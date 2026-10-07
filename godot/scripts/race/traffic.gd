class_name TrafficManager
extends Node3D
## Trafic civil : voitures qui roulent dans les voies, réapparaissent devant le joueur
## et peuvent être éjectées (onde de choc, collisions).

class TrafficCar:
	extends Node3D
	var s := 0.0
	var x := 0.0
	var v := 20.0
	var half_len := 2.3
	var half_w := 0.95
	var height := 1.5
	var active := false
	var knocked := false
	var knock_t := 0.0
	var k_off := Vector3.ZERO
	var k_vel := Vector3.ZERO
	var k_rot := Vector3.ZERO
	var k_spin := Vector3.ZERO
	var model: CarVisual

var track: Track
var cars: Array = []
var rng := RandomNumberGenerator.new()
var density := 1.0
const TYPES := ["traffic_sedan", "traffic_hatch", "traffic_taxi", "traffic_suv", "traffic_van", "traffic_bus"]
const WEIGHTS := [0.3, 0.22, 0.14, 0.18, 0.11, 0.05]


func setup(p_track: Track, p_density: float, seed_value: int) -> void:
	track = p_track
	density = p_density
	rng.seed = seed_value
	var count := int(round(13.0 * density))
	var weights := WEIGHTS.duplicate()
	if track.theme_id == "newyork":
		weights[2] = 0.4
	for i in count:
		var t := TrafficCar.new()
		var typ := _pick(weights)
		t.model = CarVisual.new()
		t.add_child(t.model)
		var defs: Array = Game.traffic_defs.filter(func(d): return d["id"] == typ)
		var paint := ""
		if typ in ["traffic_sedan", "traffic_hatch", "traffic_suv"]:
			var cols := ["#d8d8d8", "#202226", "#7a0f12", "#2b5fa8", "#5a6066", "#e8e4dc", "#204a2a"]
			paint = cols[rng.randi() % cols.size()]
		t.model.setup(typ, true, paint, false, false)
		if not defs.is_empty():
			t.half_len = defs[0]["L"] * 0.5
			t.half_w = defs[0]["W"] * 0.5
			t.height = defs[0]["H"]
		t.visible = false
		add_child(t)
		cars.append(t)


func _pick(weights: Array) -> String:
	var total := 0.0
	for w in weights:
		total += w
	var r := rng.randf() * total
	for i in weights.size():
		r -= weights[i]
		if r <= 0.0:
			return TYPES[i]
	return TYPES[0]


func _lane_free(s: float, lane_x: float, gap: float) -> bool:
	for c in cars:
		if c.active and abs(c.x - lane_x) < 2.0 and abs(c.s - s) < gap:
			return false
	for r in track.ramps:
		if s > r["s"] - 25.0 and s < r["s"] + r["len"] + 110.0 and abs(r["x"] - lane_x) < r["w"] * 0.5 + 1.6:
			return false
	for sp in track.splits:
		if s > sp["s0"] - 15.0 and s < sp["s0"] + 10.0:
			return false
	if s < track.start_s + 160.0 or s > track.finish_s - 30.0:
		return false
	return true


func _spawn(c: TrafficCar, s_min: float, s_max: float) -> bool:
	for attempt in 8:
		var s := rng.randf_range(s_min, s_max)
		var lane := rng.randi_range(0, Track.LANES - 1)
		var lx := track.lane_x(lane)
		if _lane_free(s, lx, 28.0):
			c.s = s
			c.x = lx + rng.randf_range(-0.3, 0.3)
			c.v = rng.randf_range(15.0, 24.0) + (4.0 if lane in [1, 2] else 0.0)
			c.active = true
			c.knocked = false
			c.k_off = Vector3.ZERO
			c.k_rot = Vector3.ZERO
			c.model.transform = Transform3D.IDENTITY
			c.visible = true
			return true
	return false


func initial_spawn() -> void:
	var span := 900.0
	var i := 0
	for c in cars:
		_spawn(c, track.start_s + 180.0 + i * (span / cars.size()), track.start_s + 230.0 + (i + 1) * (span / cars.size()))
		i += 1


func update(dt: float, focus_s: float) -> void:
	for c in cars:
		if not c.active:
			if rng.randf() < 0.1:
				_spawn(c, focus_s + 220.0, focus_s + 650.0)
			continue
		if c.knocked:
			c.knock_t += dt
			c.k_vel.y -= Track.GRAVITY * dt
			c.k_off += c.k_vel * dt
			c.k_rot += c.k_spin * dt
			if c.k_off.y < 0.0:
				c.k_off.y = 0.0
				c.k_vel.y = -c.k_vel.y * 0.3
				c.k_vel.x *= 0.7
				c.k_spin *= 0.6
			c.s += c.v * dt
			c.v = move_toward(c.v, 0.0, 15.0 * dt)
			if c.knock_t > 3.0:
				c.active = false
				c.visible = false
				continue
		else:
			c.s += c.v * dt
			if c.s > focus_s + 160.0:
				_clear_landing(c)
		if c.s < focus_s - 70.0 or c.s > track.length - 10.0:
			c.active = false
			c.visible = false
			continue
		var tr := track.frame(c.s)
		c.global_transform = Transform3D(tr.basis, tr.origin + tr.basis.x * c.x)
		if c.knocked:
			c.model.transform = Transform3D(Basis.from_euler(c.k_rot), c.k_off)


func _clear_landing(c: TrafficCar) -> void:
	# libère la zone d'atterrissage des rampes (loin devant le joueur, donc invisible)
	for r in track.ramps:
		if c.s > r["s"] - 20.0 and c.s < r["s"] + r["len"] + 130.0 and abs(r["x"] - c.x) < r["w"] * 0.5 + 1.6:
			for lane in Track.LANES:
				var lx := track.lane_x(lane)
				if abs(lx - r["x"]) > r["w"] * 0.5 + 2.0 and _lane_free_simple(c, lx):
					c.x = lx
					return
			c.s += 150.0
			return


func _lane_free_simple(me: TrafficCar, lx: float) -> bool:
	for o in cars:
		if o != me and o.active and abs(o.x - lx) < 2.0 and abs(o.s - me.s) < 25.0:
			return false
	return true


func knock(c: TrafficCar, dir_x: float, speed: float) -> void:
	if c.knocked:
		return
	c.knocked = true
	c.knock_t = 0.0
	c.k_off = Vector3.ZERO
	c.k_vel = Vector3(dir_x * rng.randf_range(4.0, 9.0), rng.randf_range(5.0, 10.0), 0.0)
	c.k_spin = Vector3(rng.randf_range(-6, 6), rng.randf_range(-4, 4), rng.randf_range(-7, 7))
	c.v = max(c.v, speed * 0.7)


func active_cars() -> Array:
	return cars.filter(func(c): return c.active)
