class_name ChaseCam
extends Camera3D
## Caméra de poursuite : intro cinématique, poursuite, accident, arrivée.

var target: Racer
var mode := "intro"
var t := 0.0
var trauma := 0.0
var base_fov := 64.0
var dist := 5.1
var height := 1.7
var _pos := Vector3.ZERO
var _look := Vector3.ZERO
var _fwd := Vector3.FORWARD
var _noise := FastNoiseLite.new()
var _crash_pos := Vector3.ZERO


func _ready() -> void:
	_noise.frequency = 2.2
	near = 0.15
	far = 1400.0
	fov = base_fov


func shake(amount: float) -> void:
	trauma = clampf(trauma + amount, 0.0, 1.0)


func set_mode(m: String) -> void:
	mode = m
	t = 0.0
	if m == "crash":
		_crash_pos = global_position


func snap() -> void:
	_compute_chase(1.0, true)


func update_cam(dt: float) -> void:
	t += dt
	if target == null or target.model == null:
		return
	var car := target.model.global_position
	match mode:
		"intro":
			var b := target.track.basis_at(target.s)
			var a := lerpf(-2.4, -0.4, smoothstep(0.0, 3.0, t))
			var r := lerpf(8.5, 7.0, smoothstep(0.0, 3.0, t))
			var off := b * Vector3(sin(a) * r, lerpf(1.4, 2.4, smoothstep(0.0, 3.0, t)), cos(a) * r)
			global_position = car + off
			look_at(car + Vector3.UP * 0.7, Vector3.UP)
			fov = base_fov
			_pos = global_position
		"chase":
			_compute_chase(dt, false)
		"crash":
			var dir := (car - _crash_pos)
			var p := _crash_pos + Vector3.UP * 0.02
			if dir.length() > 22.0:
				_crash_pos = car - dir.normalized() * 22.0 + Vector3.UP * 3.0
			global_position = global_position.lerp(p, 1.0 - exp(-2.0 * dt))
			look_at(car + Vector3.UP * 0.5, Vector3.UP)
		"finish":
			var b2 := target.track.basis_at(target.s)
			var a2 := 0.9 + t * 0.35
			var off2 := b2 * Vector3(sin(a2) * 7.5, 1.6, -cos(a2) * 7.5)
			global_position = global_position.lerp(car + off2, 1.0 - exp(-3.0 * dt))
			look_at(car + Vector3.UP * 0.6, Vector3.UP)
			fov = lerpf(fov, 60.0, 1.0 - exp(-2.0 * dt))
	# tremblement
	if trauma > 0.0:
		var sh := trauma * trauma
		var tt := Time.get_ticks_msec() * 0.001
		h_offset = _noise.get_noise_2d(tt * 40.0, 0.0) * 0.35 * sh
		v_offset = _noise.get_noise_2d(0.0, tt * 40.0) * 0.25 * sh
		trauma = maxf(0.0, trauma - dt * 1.6)
	else:
		h_offset = 0.0
		v_offset = 0.0


func _compute_chase(dt: float, instant: bool) -> void:
	var r := target
	var tr := r.track
	var b := tr.basis_at(r.s)
	# direction de déplacement (sans l'angle de dérapage visuel)
	var dir := (b * Basis(Vector3.UP, -r.psi * 0.75)) * Vector3.FORWARD
	dir.y *= 0.5
	dir = dir.normalized()
	var k := 1.0 if instant else 1.0 - exp(-7.0 * dt)
	_fwd = _fwd.lerp(dir, k).normalized()
	var spd := clampf(r.v / 90.0, 0.0, 1.0)
	var d := dist + spd * 0.7 - (0.4 if r.nitro_level > 0 else 0.0)
	var car := r.model.global_position
	var ground := tr.point(r.s, r.x).y
	var cy := lerpf(ground, car.y, 0.82) if r.airborne else car.y
	var desired := Vector3(car.x, cy, car.z) - _fwd * d + Vector3.UP * (height + spd * 0.15)
	var kp := 1.0 if instant else 1.0 - exp(-12.0 * dt)
	_pos.x = lerpf(_pos.x, desired.x, kp)
	_pos.z = lerpf(_pos.z, desired.z, kp)
	_pos.y = lerpf(_pos.y, desired.y, 1.0 if instant else 1.0 - exp(-6.0 * dt))
	var floor_y := tr.road_y(r.s - d) + 0.8
	_pos.y = maxf(_pos.y, floor_y)
	global_position = _pos
	var look := Vector3(car.x, cy + 0.85, car.z) + _fwd * 4.0
	_look = look if instant else _look.lerp(look, 1.0 - exp(-14.0 * dt))
	look_at(_look, Vector3.UP)
	var fov_t := base_fov + spd * 9.0 + (7.0 if r.nitro_level > 0 else 0.0) + (5.0 if r.nitro_level >= 2 else 0.0)
	fov = lerpf(fov, fov_t, 1.0 - exp(-3.0 * dt)) if not instant else fov_t
