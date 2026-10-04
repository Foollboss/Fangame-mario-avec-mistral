class_name Audio
extends Node


var music_a: AudioStreamPlayer
var music_b: AudioStreamPlayer
var current: = ""
var pool: Array[AudioStreamPlayer] = []
var streams: = {}
var listener: Node3D
var music_vol: = -9.0
var sfx_vol: = -3.0
var _fade: = 0.0

const SFX: = ["slash", "water", "splash", "zap", "thunder", "hit", "hurt", "explode", "jump", "land", "step", "glide", 
	"pickup", "chest", "levelup", "quest", "waypoint", "click", "blip", "pop", "freeze", "enemy_die", "thud", "bow", 
	"orb", "slam", "heal", "burst", "dash"]

func _ready() -> void :
	music_a = AudioStreamPlayer.new();music_b = AudioStreamPlayer.new()
	add_child(music_a);add_child(music_b)
	for i in 10:
		var p: = AudioStreamPlayer.new();add_child(p);pool.append(p)
	for n in SFX:
		var path: = "res://audio/%s.ogg" % n
		if ResourceLoader.exists(path): streams[n] = load(path)
	for n in ["explore", "combat", "night"]:
		var path: = "res://audio/music_%s.ogg" % n
		if ResourceLoader.exists(path):
			var s: AudioStream = load(path)
			if s is AudioStreamOggVorbis: (s as AudioStreamOggVorbis).loop = true
			streams["music_" + n] = s

func music(name: String) -> void :
	if name == current or not streams.has("music_" + name): return
	current = name

	var tmp: = music_a;music_a = music_b;music_b = tmp
	music_a.stream = streams["music_" + name]
	music_a.volume_db = -40.0
	music_a.play()
	var tw: = create_tween().set_parallel(true)
	tw.tween_property(music_a, "volume_db", music_vol, 1.6)
	tw.tween_property(music_b, "volume_db", -40.0, 1.6)
	tw.chain().tween_callback(music_b.stop)

func play(name: String, vol: = 0.0, pitch_var: = 0.08) -> void :
	if not streams.has(name): return
	var p: AudioStreamPlayer = null
	for q in pool:
		if not q.playing: p = q;break
	if p == null: p = pool[randi() % pool.size()]
	p.stream = streams[name]
	p.volume_db = sfx_vol + vol
	p.pitch_scale = 1.0 + randf_range( - pitch_var, pitch_var)
	p.play()

func play_at(name: String, pos: Vector3, vol: = 0.0) -> void :
	var d: = 0.0
	if listener: d = listener.global_position.distance_to(pos)
	if d > 45.0: return
	play(name, vol - d * 0.45)
