class_name TrafficManager
extends Node3D
## Circulation civile autour du joueur (voies, contresens, changements de voie, voitures percutées).

class TCar:
	var s := 0.0
	var x := 0.0
	var v := 15.0
	var lane := 0
	var model: CarModel
	var half_len := 2.3
	var half_w := 0.95
	var active := false
	var knocked := false
	var kt := 0.0
	var kpos := Vector3.ZERO
	var kvel := Vector3.ZERO
	var kang := Vector3.ZERO
	var kbasis := Basis()
	var lc_t := 0.0
	var lc_from := 0.0
	var lc_to := 0.0
	var passed := {}

	func oncoming() -> bool:
		return v < 0.0


var track: Track
var cars: Array = []
var density := 0.8
var target := 10
var rng := RandomNumberGenerator.new()
var _finish_s := 0.0
var night := false


func setup(p_track: Track, p_density: float, p_night: bool, quality: int) -> void:
	track = p_track
	density = p_density
	night = p_night
	rng.seed = track.def.seed * 7 + 3
	_finish_s = track.length - track.runoff - 40.0
	target = int(round(lerpf(5.0, 13.0, density))) - (2 if quality == 0 else 0)
	var palette := ["#d8d8d8", "#202022", "#8a8f99", "#2b3a55", "#7a1f1f", "#e8e8e8", "#3d5c3a", "#b8a27a",
		"#4a4f57", "#1f3f7a", "#c9c9c9", "#5a2a5a"]
	var types := CarsDB.TRAFFIC_MODELS
	var count := target + 4
	for i in count:
		var t: String = types[i % types.size()]
		var col := Color(palette[rng.randi_range(0, palette.size() - 1)])
		if t == "t_taxi":
			col = Color("#ffc400")
		elif t == "t_bus":
			col = Color("#d32f2f") if rng.randf() < 0.6 else Color("#1f6fd1")
		var m := CarModel.new()
		m.setup(t, col, {"effects": false, "shadows": quality >= 2, "blob": quality < 2})
		m.visible = false
		add_child(m)
		var c := TCar.new()
		c.model = m
		c.half_len = m.length * 0.5
		c.half_w = m.width * 0.5
		cars.append(c)


func active_cars() -> Array:
	var out := []
	for c in cars:
		if c.active and not c.knocked:
			out.append(c)
	return out


func update(dt: float, focus_s: float) -> void:
	var n_active := 0
	for c in cars:
		if c.active:
			n_active += 1
	# apparition
	var tries := 0
	while n_active < target and tries < 4:
		tries += 1
		if _spawn(focus_s):
			n_active += 1
	for c in cars:
		if not c.active:
			continue
		if c.knocked:
			_update_knocked(c, dt)
			continue
		# suivi du véhicule devant dans la même voie
		var vdes: float = c.v
		for o in cars:
			if o == c or not o.active or o.knocked or o.lane != c.lane:
				continue
			var ds: float = (o.s - c.s) * signf(c.v)
			if ds > 0.0 and ds < 16.0 and absf(o.v) < absf(c.v):
				vdes = o.v
		c.v = lerpf(c.v, vdes, 1.0 - exp(-2.0 * dt))
		c.s += c.v * dt
		# changement de voie
		if c.lc_t > 0.0:
			c.lc_t -= dt
			var t := 1.0 - clampf(c.lc_t / 2.2, 0.0, 1.0)
			c.x = lerpf(c.lc_from, c.lc_to, smoothstep(0.0, 1.0, t))
			if c.lc_t <= 0.0:
				c.model.set_signal(0)
		elif rng.randf() < dt * 0.05 and not c.oncoming():
			_try_lane_change(c)
		if c.s < focus_s - 70.0 or c.s > focus_s + 700.0 or c.s > _finish_s or c.s < 2.0:
			_despawn(c)
			continue
		_place(c)


func _spawn(focus_s: float) -> bool:
	var free: TCar = null
	var start := rng.randi_range(0, cars.size() - 1)
	for i in cars.size():
		var c: TCar = cars[(start + i) % cars.size()]
		if not c.active:
			free = c
			break
	if free == null:
		return false
	var s := focus_s + rng.randf_range(170.0, 480.0)
	if s > _finish_s - 30.0:
		return false
	var sec := track.section_at(s)
	var lane := rng.randi_range(0, track.lanes - 1)
	var x := track.lane_center(lane)
	# pas sur une rampe
	for r in track.ramps_between(s - 30.0, s + 30.0):
		if absf(r.x - x) < 3.5:
			return false
	for c in cars:
		if c.active and c.lane == lane and absf(c.s - s) < 30.0:
			return false
	var oncoming := track.is_oncoming_lane(lane)
	var spd := rng.randf_range(12.0, 22.0)
	if sec == "highway" or sec == "bridge" or sec == "open":
		spd += 6.0
	if free.model.car_id == "t_bus":
		spd *= 0.75
	free.s = s
	free.x = x
	free.lane = lane
	free.v = -spd if oncoming else spd
	free.active = true
	free.knocked = false
	free.lc_t = 0.0
	free.passed.clear()
	free.model.visible = true
	free.model.set_signal(0)
	_place(free)
	return true


func _try_lane_change(c: TCar) -> void:
	var dir := 1 if rng.randf() < 0.5 else -1
	var nl := c.lane + dir
	if nl < 0 or nl >= track.lanes or track.is_oncoming_lane(nl) != track.is_oncoming_lane(c.lane):
		return
	for o in cars:
		if o != c and o.active and o.lane == nl and absf(o.s - c.s) < 25.0:
			return
	c.lc_from = c.x
	c.lc_to = track.lane_center(nl)
	c.lane = nl
	c.lc_t = 2.2
	c.model.set_signal(dir)


func _despawn(c: TCar) -> void:
	c.active = false
	c.knocked = false
	c.model.visible = false


func _place(c: TCar) -> void:
	var b := track.basis_at(c.s)
	if c.oncoming():
		b = b * Basis(Vector3.UP, PI)
	var p := track.point(c.s, c.x)
	c.model.global_transform = Transform3D(b, p)
	c.model.pivot.rotation = Vector3.ZERO
	c.model.set_wheels(absf(c.v) * get_physics_process_delta_time(), 0.0)


## Percuté : la voiture est projetée (purement visuel).
func knock(c: TCar, by_vel: Vector3, strength: float) -> void:
	if c.knocked:
		return
	c.knocked = true
	c.kt = 0.0
	c.kpos = c.model.global_position
	c.kbasis = c.model.global_transform.basis
	c.kvel = by_vel * 0.85 + Vector3(rng.randf_range(-3, 3), rng.randf_range(4.0, 7.0) * strength, 0)
	c.kang = Vector3(rng.randf_range(-3, 3), rng.randf_range(-4, 4), rng.randf_range(-5, 5)) * strength


func _update_knocked(c: TCar, dt: float) -> void:
	c.kt += dt
	c.kvel.y -= 17.0 * dt
	c.kpos += c.kvel * dt
	var s_est := c.s + c.kvel.length() * c.kt
	var gy := track.road_y(clampf(s_est, 0.0, track.length - 1.0))
	if c.kpos.y < gy:
		c.kpos.y = gy
		c.kvel *= Vector3(0.6, -0.3, 0.6)
		c.kang *= 0.5
	c.kbasis = c.kbasis.rotated(Vector3.RIGHT, c.kang.x * dt).rotated(Vector3.UP, c.kang.y * dt)
	c.kbasis = c.kbasis.rotated(Vector3.FORWARD, c.kang.z * dt).orthonormalized()
	c.model.global_transform = Transform3D(c.kbasis, c.kpos)
	if c.kt > 3.5:
		_despawn(c)
