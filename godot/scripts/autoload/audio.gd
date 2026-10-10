extends Node
## Audio : effets sonores et musique synthwave (fichiers .wav pré-générés par
## tools/generate_audio.py) + moteur synthétisé en temps réel.
## Autoload : "Audio"

const MIX := 22050.0
const SFX_NAMES := ["crash", "takedown", "boost", "shockwave", "beep", "go", "click", "confirm",
	"land", "scrape", "whoosh", "reward", "star"]

var _sfx: Dictionary = {}
var _pool: Array[AudioStreamPlayer] = []
var _pool_idx := 0

var _engine_player: AudioStreamPlayer
var _engine_pb: AudioStreamGeneratorPlayback
var _engine_on := false
var _rpm := 900.0
var _target_rpm := 900.0
var _throttle := 0.0
var _nitro := 0.0
var _ph1 := 0.0
var _ph2 := 0.0
var _ph3 := 0.0
var _lp := 0.0
var _lp2 := 0.0
var _noise_seed := 1234567

var _music_player: AudioStreamPlayer
var _music_wanted := false


func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	for i in 10:
		var p := AudioStreamPlayer.new()
		add_child(p)
		_pool.append(p)
	for n in SFX_NAMES:
		var path := "res://assets/audio/sfx_%s.wav" % n
		if ResourceLoader.exists(path):
			_sfx[n] = load(path)
	_engine_player = AudioStreamPlayer.new()
	var gen := AudioStreamGenerator.new()
	gen.mix_rate = MIX
	gen.buffer_length = 0.12
	_engine_player.stream = gen
	add_child(_engine_player)
	_music_player = AudioStreamPlayer.new()
	if ResourceLoader.exists("res://assets/audio/music_synthwave.wav"):
		_music_player.stream = load("res://assets/audio/music_synthwave.wav")
	# la boucle est réglée dans le .import ; on relance quand même au cas où
	_music_player.finished.connect(func():
		if _music_wanted:
			_music_player.play())
	add_child(_music_player)


func _exit_tree() -> void:
	# arrête tous les sons avant la fermeture (évite des fuites signalées à la sortie)
	_music_wanted = false
	_music_player.stop()
	_engine_player.stop()
	for p in _pool:
		p.stop()


func _vol(key: String) -> float:
	var v: float = Game.setting(key, 0.8)
	return linear_to_db(max(v, 0.0001))


# ---------------------------------------------------------------------------
# Effets sonores
# ---------------------------------------------------------------------------
func play(name: String, gain_db: float = 0.0, pitch: float = 1.0) -> void:
	if not _sfx.has(name):
		return
	var p := _pool[_pool_idx]
	_pool_idx = (_pool_idx + 1) % _pool.size()
	p.stream = _sfx[name]
	p.volume_db = _vol("sfx") + gain_db
	p.pitch_scale = pitch
	p.play()


func _rand() -> float:
	_noise_seed = (_noise_seed * 1103515245 + 12345) & 0x7fffffff
	return float(_noise_seed) / float(0x7fffffff) * 2.0 - 1.0


# ---------------------------------------------------------------------------
# Moteur
# ---------------------------------------------------------------------------
func engine_start() -> void:
	_engine_on = true
	_rpm = 900.0
	_engine_player.volume_db = _vol("engine") - 6.0
	_engine_player.play()
	_engine_pb = _engine_player.get_stream_playback()


func engine_stop() -> void:
	_engine_on = false
	_engine_player.stop()
	_engine_pb = null


func set_engine(speed: float, top_speed: float, throttle: float, nitro_level: int) -> void:
	var f: float = clamp(speed / max(top_speed, 1.0), 0.0, 1.3)
	var gears := 6.0
	var g: float = min(gears - 1.0, floor(f * gears * 0.999))
	var p: float = f * gears - g
	if g <= 0.0:
		_target_rpm = 1100.0 + p * 6200.0
	else:
		_target_rpm = 3600.0 + p * 4000.0
	_throttle = throttle
	_nitro = float(nitro_level)


func _process(_delta: float) -> void:
	if _engine_on and _engine_pb:
		_fill_engine()
	if _music_wanted and _music_player.stream and not _music_player.playing:
		_music_player.volume_db = _vol("music") - 4.0
		_music_player.play()


func _fill_engine() -> void:
	var n := _engine_pb.get_frames_available()
	if n <= 0:
		return
	var buf := PackedVector2Array()
	buf.resize(n)
	for i in n:
		_rpm += (_target_rpm - _rpm) * 0.0025
		var f := _rpm / 60.0 * 3.0  # moteur 6 cylindres
		_ph1 = fmod(_ph1 + f / MIX, 1.0)
		_ph2 = fmod(_ph2 + f * 0.5 / MIX, 1.0)
		_ph3 = fmod(_ph3 + f * 2.01 / MIX, 1.0)
		var saw := _ph1 * 2.0 - 1.0
		var s := saw * 0.45 + sin(TAU * _ph2) * 0.35 + sin(TAU * _ph3) * 0.12
		s += _rand() * (0.05 + 0.08 * _throttle + 0.12 * _nitro)
		var cutoff := 0.10 + 0.25 * _throttle + 0.05 * _nitro
		_lp += (s - _lp) * cutoff
		_lp2 += (_lp - _lp2) * 0.5
		var out := _lp2 * (0.55 + 0.35 * _throttle)
		buf[i] = Vector2(out, out)
	_engine_pb.push_buffer(buf)


# ---------------------------------------------------------------------------
# Musique
# ---------------------------------------------------------------------------
func play_music() -> void:
	_music_wanted = true


func stop_music() -> void:
	_music_wanted = false
	_music_player.stop()


func refresh_volumes() -> void:
	_music_player.volume_db = _vol("music") - 4.0
	if _engine_on:
		_engine_player.volume_db = _vol("engine") - 6.0
