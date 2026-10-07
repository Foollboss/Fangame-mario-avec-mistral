extends Node
## Audio 100% procédural : moteur synthétisé en temps réel, effets et musique synthwave.
## Autoload : "Audio"

const MIX := 22050.0

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
var _music_stream: AudioStreamWAV
var _music_thread: Thread
var _music_wanted := false


func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	for i in 10:
		var p := AudioStreamPlayer.new()
		add_child(p)
		_pool.append(p)
	_build_sfx()
	_engine_player = AudioStreamPlayer.new()
	var gen := AudioStreamGenerator.new()
	gen.mix_rate = MIX
	gen.buffer_length = 0.12
	_engine_player.stream = gen
	add_child(_engine_player)
	_music_player = AudioStreamPlayer.new()
	add_child(_music_player)
	if DisplayServer.get_name() != "headless":
		_music_thread = Thread.new()
		_music_thread.start(_generate_music)


func _exit_tree() -> void:
	if _music_thread and _music_thread.is_started():
		_music_thread.wait_to_finish()


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


func _make_wav(samples: PackedFloat32Array, loop := false) -> AudioStreamWAV:
	var data := PackedByteArray()
	data.resize(samples.size() * 2)
	for i in samples.size():
		data.encode_s16(i * 2, int(clamp(samples[i], -1.0, 1.0) * 32000.0))
	var w := AudioStreamWAV.new()
	w.format = AudioStreamWAV.FORMAT_16_BITS
	w.mix_rate = int(MIX)
	w.stereo = false
	w.data = data
	if loop:
		w.loop_mode = AudioStreamWAV.LOOP_FORWARD
		w.loop_begin = 0
		w.loop_end = samples.size()
	return w


func _gen(duration: float, f: Callable) -> AudioStreamWAV:
	var n := int(duration * MIX)
	var buf := PackedFloat32Array()
	buf.resize(n)
	var lp := 0.0
	for i in n:
		var t := float(i) / MIX
		var v: float = f.call(t, duration)
		buf[i] = v
	return _make_wav(buf)


func _build_sfx() -> void:
	var lp := [0.0]
	_sfx["crash"] = _gen(0.9, func(t, d):
		var e := exp(-t * 5.0)
		lp[0] = lp[0] * 0.75 + _rand() * 0.25
		return (lp[0] * 1.6 + sin(TAU * 55.0 * t) * exp(-t * 9.0)) * e * 0.9)
	_sfx["takedown"] = _gen(0.8, func(t, d):
		var e := exp(-t * 4.0)
		return (_rand() * 0.5 * e + sin(TAU * (90.0 - 40.0 * t) * t) * exp(-t * 6.0) * 0.8 + sin(TAU * 1800.0 * t) * exp(-t * 18.0) * 0.2))
	_sfx["boost"] = _gen(0.7, func(t, d):
		var e := sin(PI * t / d)
		lp[0] = lp[0] * (0.92 - 0.3 * t) + _rand() * (0.08 + 0.3 * t)
		return lp[0] * e * 1.5)
	_sfx["shockwave"] = _gen(1.1, func(t, d):
		var e := exp(-t * 2.5)
		lp[0] = lp[0] * 0.85 + _rand() * 0.15
		return (sin(TAU * (70.0 - 30.0 * t) * t) * 0.9 + lp[0] * 1.8) * e)
	_sfx["beep"] = _gen(0.18, func(t, d): return sin(TAU * 880.0 * t) * 0.5 * (1.0 - t / d))
	_sfx["go"] = _gen(0.5, func(t, d): return (sin(TAU * 1320.0 * t) + 0.4 * sin(TAU * 1980.0 * t)) * 0.4 * (1.0 - t / d))
	_sfx["click"] = _gen(0.05, func(t, d): return sin(TAU * 2200.0 * t) * 0.35 * (1.0 - t / d))
	_sfx["confirm"] = _gen(0.22, func(t, d):
		var f := 880.0 if t < 0.09 else 1320.0
		return sin(TAU * f * t) * 0.35 * (1.0 - t / d))
	_sfx["land"] = _gen(0.3, func(t, d):
		lp[0] = lp[0] * 0.9 + _rand() * 0.1
		return (sin(TAU * 60.0 * t) * 0.9 + lp[0] * 1.2) * exp(-t * 14.0))
	_sfx["scrape"] = _gen(0.35, func(t, d):
		return (_rand() * 0.3 + sin(TAU * 2600.0 * t + _rand()) * 0.15) * (1.0 - t / d))
	_sfx["whoosh"] = _gen(0.45, func(t, d):
		lp[0] = lp[0] * 0.8 + _rand() * 0.2
		return lp[0] * sin(PI * t / d) * 1.6)
	_sfx["reward"] = _gen(0.7, func(t, d):
		var notes := [523.25, 659.25, 783.99, 1046.5]
		var k: int = min(3, int(t / 0.12))
		return sin(TAU * notes[k] * t) * 0.3 * exp(-(t - k * 0.12) * 6.0))
	_sfx["star"] = _gen(1.0, func(t, d):
		return (sin(TAU * 1046.5 * t) + sin(TAU * 1318.5 * t) + sin(TAU * 1568.0 * t)) * 0.15 * exp(-t * 3.0))


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
	if _music_wanted and _music_stream and not _music_player.playing:
		_music_player.stream = _music_stream
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
# Musique synthwave générée (thread)
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


func _generate_music() -> void:
	var bpm := 112.0
	var beat := 60.0 / bpm
	var bars := 8
	var n := int(bars * 4 * beat * MIX)
	var buf := PackedFloat32Array()
	buf.resize(n)
	# Am - F - C - G (x2)
	var roots := [57, 53, 60, 55, 57, 53, 60, 55]
	var chords := [[0, 3, 7, 12], [0, 4, 7, 12], [0, 4, 7, 12], [0, 4, 7, 12]]
	var seed := 98765
	var lp := 0.0
	var lpb := 0.0
	for i in n:
		var t := float(i) / MIX
		var bar := int(t / (4.0 * beat)) % bars
		var in_bar := fmod(t, 4.0 * beat)
		var root: int = roots[bar]
		var ch: Array = chords[bar % 4]
		# basse en croches
		var e8 := fmod(t, beat * 0.5)
		var bass_f := 440.0 * pow(2.0, float(root - 24 - 69) / 12.0)
		var bass_ph := fmod(t * bass_f, 1.0)
		var bass := (bass_ph * 2.0 - 1.0) * exp(-e8 * 5.0) * 0.32
		lpb += (bass - lpb) * 0.08
		# arpège en doubles croches
		var step := int(in_bar / (beat * 0.25))
		var e16 := fmod(t, beat * 0.25)
		var note: int = root + int(ch[step % 4]) + (12 if (step / 4) % 2 == 1 else 0)
		var af := 440.0 * pow(2.0, float(note - 69) / 12.0)
		var arp_ph := fmod(t * af, 1.0)
		var arp := (1.0 if arp_ph < 0.5 else -1.0) * exp(-e16 * 9.0) * 0.07
		# nappe
		var pad := 0.0
		for k in 3:
			var pf := 440.0 * pow(2.0, float(root + int(ch[k]) - 69) / 12.0)
			pad += sin(TAU * pf * t) * 0.035 + sin(TAU * pf * 1.003 * t) * 0.03
		# batterie
		var eb := fmod(t, beat)
		var kick := sin(TAU * (50.0 + 90.0 * exp(-eb * 30.0)) * eb) * exp(-eb * 7.0) * 0.55
		var beat_idx := int(t / beat) % 4
		var snare := 0.0
		seed = (seed * 1103515245 + 12345) & 0x7fffffff
		var noise := float(seed) / float(0x7fffffff) * 2.0 - 1.0
		if beat_idx == 1 or beat_idx == 3:
			snare = noise * exp(-eb * 14.0) * 0.28
		var hat := noise * exp(-e8 * 60.0) * 0.06
		var s := lpb + arp + pad + kick + snare + hat
		lp += (s - lp) * 0.6
		buf[i] = tanh(lp * 1.2) * 0.8
	_music_stream = _make_wav(buf, true)
