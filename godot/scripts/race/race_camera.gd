class_name RaceCamera
extends Camera3D
## Caméra de poursuite façon Asphalt (lissée en espace piste), intro, épave, arrivée.

var track: Track
var target: Racer
var mode := 0  # 0 = proche, 1 = éloignée, 2 = capot
var state := "intro"
var shake := 0.0
var _t := 0.0
var _cam_x := 0.0
var _cam_h := 0.0
var _dist := 6.5
var _wreck_pos := Vector3.ZERO
var _rel := Vector3(0, 2, 6)
var _rng := RandomNumberGenerator.new()


func _ready() -> void:
	fov = 68.0
	near = 0.1
	far = 2500.0
	current = true


func set_state(st: String) -> void:
	state = st
	_t = 0.0
	if target:
		_rel = global_position - target.global_position
	if st == "wreck" and target:
		var tr := track.frame(target.s)
		_wreck_pos = target.global_position + tr.basis.z * 12.0 + tr.basis.y * 4.0 + tr.basis.x * (4.0 if target.x < 0.0 else -4.0)


func add_shake(a: float) -> void:
	shake = max(shake, a)


func update(dt: float) -> void:
	if target == null:
		return
	_t += dt
	var top: float = target.stats.get("top_speed", 70.0)
	var ratio: float = clamp(target.v / max(top, 1.0), 0.0, 1.4)
	match state:
		"intro":
			var a := -0.9 + _t * 0.45
			var center := target.global_position + Vector3.UP * 0.8
			var tr := track.frame(target.s)
			var dir := (tr.basis.z * cos(a) + tr.basis.x * sin(a)).normalized()
			global_position = center + dir * (7.5 - _t * 0.6) + Vector3.UP * (1.2 + _t * 0.25)
			look_at(center, Vector3.UP)
			fov = 60.0
		"wreck":
			global_position = global_position.lerp(_wreck_pos, 1.0 - exp(-3.0 * dt))
			var vp := target.visual.global_position if target.visual else target.global_position
			look_at(vp, Vector3.UP)
			fov = lerp(fov, 55.0, dt * 2.0)
		"finish":
			var center2 := target.global_position + Vector3.UP * 0.7
			var tr2 := track.frame(target.s)
			var a2 := _t * 0.35
			var dir2 := (tr2.basis.z * cos(a2) - tr2.basis.x * sin(a2)).normalized()
			_rel = _rel.lerp(dir2 * 8.0 + Vector3.UP * 2.3, 1.0 - exp(-2.0 * dt))
			global_position = center2 + _rel
			look_at(center2, Vector3.UP)
			fov = lerp(fov, 60.0, dt * 2.0)
		_:
			_chase(dt, ratio)
	if shake > 0.0:
		shake = max(0.0, shake - dt * 1.8)
		h_offset = _rng.randf_range(-1, 1) * shake * 0.12
		v_offset = _rng.randf_range(-1, 1) * shake * 0.12
	else:
		h_offset = 0.0
		v_offset = 0.0


func _chase(dt: float, ratio: float) -> void:
	var nitro_k := 0.0
	match target.nitro_level:
		Racer.NITRO_NORMAL:
			nitro_k = 0.6
		Racer.NITRO_PERFECT:
			nitro_k = 0.85
		Racer.NITRO_SHOCK:
			nitro_k = 1.2
		Racer.NITRO_ULTRA:
			nitro_k = 1.5
	var dist: float = [6.2, 9.5, 0.0][mode] + ratio * 0.8 - nitro_k * 0.6
	var height: float = [2.0, 3.1, 1.15][mode] - nitro_k * 0.15
	_dist = lerp(_dist, dist, 1.0 - exp(-3.0 * dt))
	_cam_x = lerp(_cam_x, target.x * (0.82 if mode != 2 else 1.0), 1.0 - exp(-6.0 * dt))
	var h_follow: float = target.h if mode == 2 else target.h * 0.75
	_cam_h = lerp(_cam_h, h_follow, 1.0 - exp(-5.0 * dt))
	if mode == 2:
		var tr := track.frame(target.s)
		global_position = target.global_position + target.global_transform.basis.y * 1.15 - target.global_transform.basis.z * 0.3
		look_at(track.position_at(target.s + 20.0, target.x, 1.0 + target.h), tr.basis.y)
	else:
		global_position = track.position_at(target.s - _dist, _cam_x, height + _cam_h)
		var look := track.position_at(target.s + 9.0, target.x * 0.6, 1.0 + target.h * 0.85)
		var up := track.frame(target.s).basis.y
		look_at(look, up)
	fov = lerp(fov, 66.0 + ratio * 9.0 + nitro_k * 9.0, 1.0 - exp(-3.0 * dt))
	if target.nitro_level == Racer.NITRO_SHOCK:
		add_shake(0.6)
	elif target.nitro_level == Racer.NITRO_ULTRA:
		add_shake(0.8)
