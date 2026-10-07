extends Node
## Gestion audio : bus, musique (fondu enchaîné), sons d'interface.

const DIR := "res://assets/audio/"

var _music_a: AudioStreamPlayer
var _music_b: AudioStreamPlayer
var _cur_music := ""
var _pool: Array[AudioStreamPlayer] = []
var _cache := {}


func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	if AudioServer.get_bus_index("Music") < 0:
		AudioServer.add_bus()
		AudioServer.set_bus_name(AudioServer.bus_count - 1, "Music")
		AudioServer.set_bus_send(AudioServer.bus_count - 1, "Master")
	if AudioServer.get_bus_index("SFX") < 0:
		AudioServer.add_bus()
		AudioServer.set_bus_name(AudioServer.bus_count - 1, "SFX")
		AudioServer.set_bus_send(AudioServer.bus_count - 1, "Master")
	_music_a = AudioStreamPlayer.new()
	_music_b = AudioStreamPlayer.new()
	for p in [_music_a, _music_b]:
		p.bus = "Music"
		p.volume_db = -80
		add_child(p)
	for i in 8:
		var p := AudioStreamPlayer.new()
		p.bus = "SFX"
		add_child(p)
		_pool.append(p)
	if has_node("/root/Game"):
		get_node("/root/Game").apply_settings()


func stream(name: String) -> AudioStream:
	if not _cache.has(name):
		var path := DIR + name + ".ogg"
		if ResourceLoader.exists(path):
			_cache[name] = load(path)
		else:
			_cache[name] = null
	return _cache[name]


func looped(name: String) -> AudioStream:
	var s := stream(name)
	if s is AudioStreamOggVorbis:
		var d: AudioStreamOggVorbis = s.duplicate()
		d.loop = true
		return d
	return s


func play(name: String, vol_db: float = 0.0, pitch: float = 1.0) -> void:
	var s := stream(name)
	if s == null:
		return
	for p in _pool:
		if not p.playing:
			p.stream = s
			p.volume_db = vol_db
			p.pitch_scale = pitch
			p.play()
			return
	_pool[0].stream = s
	_pool[0].volume_db = vol_db
	_pool[0].play()


func click() -> void:
	play("ui_click", -4.0)


func play_music(name: String, fade: float = 1.0) -> void:
	if name == _cur_music:
		return
	_cur_music = name
	var old := _music_a if _music_a.playing else _music_b
	var nxt := _music_b if old == _music_a else _music_a
	nxt.stream = looped(name)
	nxt.volume_db = -40
	nxt.play()
	var tw := create_tween().set_parallel(true)
	tw.tween_property(nxt, "volume_db", -6.0, fade)
	if old.playing:
		tw.tween_property(old, "volume_db", -60.0, fade)
		tw.chain().tween_callback(old.stop)


func stop_music(fade: float = 0.6) -> void:
	_cur_music = ""
	for p in [_music_a, _music_b]:
		if p.playing:
			var tw := create_tween()
			tw.tween_property(p, "volume_db", -60.0, fade)
			tw.tween_callback(p.stop)


func set_volumes(music: float, sfx: float) -> void:
	var mi := AudioServer.get_bus_index("Music")
	var si := AudioServer.get_bus_index("SFX")
	if mi >= 0:
		AudioServer.set_bus_volume_db(mi, linear_to_db(maxf(music, 0.0001)))
	if si >= 0:
		AudioServer.set_bus_volume_db(si, linear_to_db(maxf(sfx, 0.0001)))
