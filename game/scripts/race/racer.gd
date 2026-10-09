class_name Racer
extends RefCounted
## Physique arcade d'un concurrent (joueur ou IA) dans le repère de la piste.

const G := 17.0
const PERFECT_T0 := 0.85
const PERFECT_T1 := 1.40
const WRECK_TIME := 2.0
const NITRO_ACC := [0.0, 5.5, 7.5, 10.5]
const NITRO_BOOST := [1.0, 1.16, 1.24, 1.33]

var id := 0
var display_name := ""
var car_id := ""
var cls := "D"
var is_player := false
var model: CarModel
var track: Track
var ai: AIDriver

# statistiques de la voiture
var vmax := 70.0
var accel := 10.0
var handling := 50.0
var nitro_stat := 50.0
var rank := 500
var half_len := 2.25
var half_w := 0.95

# état
var s := 0.0
var x := 0.0
var psi := 0.0
var v := 0.0
var yw := 0.0
var vy := 0.0
var airborne := false
var air_time := 0.0
var on_ramp := -1
var ramp_roll := 0.0

# entrées
var steer_in := 0.0
var nitro_press := false
var drift_held := false
var drift_press := false
var steer_vis := 0.0

var drifting := false
var drift_dir := 0.0
var drift_time := 0.0
var braking := false
var slip := 0.0

var gauge := 0.5
var nitro_level := 0
var nitro_t := 0.0
var last_tap := -10.0
var perfect_chain := 0

var roll := 0.0
var roll_speed := 0.0
var roll_target := 0.0
var spin := 0.0
var spin_speed := 0.0
var spin_target := 0.0
var did_roll := false
var did_spin := false
var pitch_vis := 0.0
var grav_mult := 1.0

var wrecked := false
var wreck_t := 0.0
var wreck_rot := Vector3.ZERO
var wreck_angvel := Vector3.ZERO
var wreck_vx := 0.0
var invuln := 0.0
var scraping := 0.0
var scrape_side := 0.0

var finished := false
var finish_time := 0.0
var eliminated := false
var place := 1
var speed_factor := 1.0
var time := 0.0
var events: Array = []
var stats := {"takedowns": 0, "barrel_rolls": 0, "jumps": 0, "near_miss": 0, "perfect_nitro": 0,
	"wrecks": 0, "drift": 0.0, "top_speed": 0.0, "distance": 0.0, "spins": 0, "knockdowns": 0}


func setup_stats(car: Dictionary, level: int) -> void:
	car_id = car.id
	cls = car.cls
	vmax = CarsDB.stat(car, "top", level) / 3.6
	accel = 5.0 + CarsDB.stat(car, "acc", level) * 0.13
	handling = CarsDB.stat(car, "han", level)
	nitro_stat = CarsDB.stat(car, "nit", level)
	rank = CarsDB.rank(car, level)


func progress() -> float:
	return s


func speed_kmh() -> float:
	return v * 3.6


func nitro_window() -> Vector2:
	return Vector2(PERFECT_T0, PERFECT_T1)


# ---------------------------------------------------------------------------
# Mise à jour
# ---------------------------------------------------------------------------

func update(dt: float, race_time: float) -> void:
	time = race_time
	if invuln > 0.0:
		invuln -= dt
	if wrecked:
		_update_wreck(dt)
		return
	if eliminated:
		v = maxf(0.0, v - 20.0 * dt)
		s += v * dt
		return
	_nitro(dt)
	_drive(dt)
	_vertical(dt)
	_walls()
	gauge = clampf(gauge, 0.0, 1.0)
	drift_press = false


func _nitro(dt: float) -> void:
	nitro_t += dt
	if nitro_press:
		nitro_press = false
		var double_tap := (time - last_tap) < 0.32
		last_tap = time
		if nitro_level == 0:
			if gauge > 0.06:
				nitro_level = 1
				nitro_t = 0.0
				events.append(["nitro", 1])
		elif nitro_level == 1 or nitro_level == 2:
			if double_tap and gauge >= 0.88:
				nitro_level = 3
				nitro_t = 0.0
				perfect_chain = 0
				events.append(["shockwave", 0])
			elif nitro_level == 1 and nitro_t >= PERFECT_T0 and nitro_t <= PERFECT_T1:
				nitro_level = 2
				stats.perfect_nitro += 1
				perfect_chain += 1
				events.append(["perfect", perfect_chain])
	if nitro_level > 0:
		var rate := 0.42 if nitro_level == 3 else (0.30 - nitro_stat * 0.0012)
		gauge -= rate * dt
		if gauge <= 0.0:
			gauge = 0.0
			if nitro_level != 2:
				perfect_chain = 0
			nitro_level = 0


func _drive(dt: float) -> void:
	var lvl := nitro_level
	var boost: float = NITRO_BOOST[lvl]
	if lvl > 0:
		boost += nitro_stat * 0.0006
	var vcap := vmax * boost * speed_factor
	braking = drift_held and absf(steer_in) < 0.25 and not drifting and not airborne
	# dérapage
	if drift_held and absf(steer_in) > 0.3 and v > 20.0 and not airborne:
		if not drifting:
			drifting = true
			drift_time = 0.0
			drift_dir = signf(steer_in)
	elif drifting and (not drift_held or v < 14.0 or airborne):
		drifting = false
		if drift_time > 0.7:
			events.append(["drift", drift_time])
	if drifting:
		drift_time += dt
		stats.drift += dt
		gauge += 0.16 * dt
		if absf(steer_in) > 0.3:
			drift_dir = signf(steer_in)
	if braking:
		v -= 26.0 * dt
		if lvl == 1 or lvl == 2:
			nitro_level = 0
	elif not airborne:
		if v < vcap:
			var a: float = accel * (1.0 - pow(v / vcap, 2.0)) + NITRO_ACC[lvl]
			v += a * dt
		else:
			v -= (v - vcap) * 0.9 * dt + 1.5 * dt
		if drifting:
			v -= 2.2 * dt
		v -= absf(sin(psi)) * 3.5 * dt
	else:
		v -= 0.4 * dt
	v = maxf(v, 0.0)
	stats.top_speed = maxf(stats.top_speed, v * 3.6)

	var han01 := clampf((handling - 40.0) / 45.0, 0.0, 1.0)
	var rate := lerpf(1.2, 1.7, han01)
	if drifting:
		rate *= 1.6
	var sf := clampf(v / 16.0, 0.0, 1.0)
	var kappa := track.curvature(s)
	var denom := maxf(1.0 - kappa * x, 0.3)
	var dsdt := v * cos(psi) / denom
	var assist := 0.86 if not drifting else 0.97
	var omega := steer_in * rate * sf
	if airborne:
		omega *= 0.35
		assist = 1.0
	omega += kappa * dsdt * assist
	if absf(steer_in) < 0.15 and not drifting:
		omega -= psi * 3.0 * sf
	psi += (omega - kappa * dsdt) * dt
	var lim := 0.5 if not drifting else 0.72
	psi = clampf(psi, -lim, lim)
	s += dsdt * dt
	x += v * sin(psi) * dt
	stats.distance += dsdt * dt
	var slip_t := drift_dir * 0.42 if drifting else 0.0
	slip = lerpf(slip, slip_t, 1.0 - exp(-6.0 * dt))
	steer_vis = lerpf(steer_vis, steer_in, 1.0 - exp(-10.0 * dt))


func _vertical(dt: float) -> void:
	var r := track.ramp_at(s, x)
	var g := track.road_y(s) + r.x
	if not airborne:
		var new_vy := (g - yw) / dt
		if new_vy < vy - G * dt - 0.15 and v > 10.0:
			_take_off()
		else:
			vy = new_vy
			yw = g
			if r.z >= 0.0:
				on_ramp = int(r.z)
				ramp_roll = atan(r.y)
			else:
				on_ramp = -1
				ramp_roll = lerpf(ramp_roll, 0.0, 1.0 - exp(-10.0 * dt))
	if airborne:
		air_time += dt
		vy -= G * grav_mult * dt
		yw += vy * dt
		if roll_speed != 0.0:
			roll += roll_speed * dt
			if (roll_speed > 0.0 and roll >= roll_target) or (roll_speed < 0.0 and roll <= roll_target):
				roll = roll_target
				roll_speed = 0.0
		if spin_speed != 0.0:
			spin += spin_speed * dt
			if (spin_speed > 0.0 and spin >= spin_target) or (spin_speed < 0.0 and spin <= spin_target):
				spin = spin_target
				spin_speed = 0.0
		if drift_press and not did_spin and not did_roll:
			var t_rem := _air_time_left(g)
			if t_rem > 0.55:
				var dir := 1.0 if steer_in >= 0.0 else -1.0
				spin_target = TAU * dir
				spin_speed = spin_target / (t_rem * 0.85)
				did_spin = true
				events.append(["spin_start", 0])
		if yw <= g:
			_land(g)


func _air_time_left(g: float) -> float:
	var h := yw - g
	var gg := G * grav_mult
	return (vy + sqrt(maxf(vy * vy + 2.0 * gg * h, 0.0))) / gg


func _take_off() -> void:
	airborne = true
	air_time = 0.0
	did_roll = false
	did_spin = false
	roll = ramp_roll
	# saut naturel (crête de colline) : gravité renforcée pour des sauts courts façon Asphalt
	grav_mult = 1.0 if on_ramp >= 0 else 1.9
	if on_ramp >= 0:
		var rp: Dictionary = track.ramps[on_ramp]
		if rp.kind == "ramp":
			vy = maxf(vy, 6.0)
		else:
			vy = maxf(vy, 8.5)
			var t_air := 2.0 * vy / G
			var n_rolls := 2.0 if t_air > 2.1 and v > 70.0 else 1.0
			var dir := 1.0 if rp.kind == "barrel_r" else -1.0
			roll_target = TAU * n_rolls * dir
			roll_speed = (roll_target - roll) / (t_air * 0.88)
			did_roll = true
			events.append(["barrel_start", n_rolls])
	on_ramp = -1
	ramp_roll = 0.0


func _land(g: float) -> void:
	airborne = false
	var impact := -vy
	yw = g
	vy = v * track.forward_at(s).y
	if did_roll:
		var n := int(round(absf(roll_target) / TAU))
		stats.barrel_rolls += 1
		events.append(["barrel", n])
		gauge += 0.25
	if did_spin:
		stats.spins += 1
		events.append(["spin", 1])
		gauge += 0.25
	roll = 0.0
	roll_speed = 0.0
	spin = 0.0
	spin_speed = 0.0
	if air_time > 0.6:
		stats.jumps += 1
		events.append(["jump", air_time])
		gauge += air_time * 0.08
		if air_time > 0.8 and absf(psi) < 0.12:
			events.append(["landing", 0])
			gauge += 0.06
	if impact > 3.0:
		events.append(["land", impact])
	did_roll = false
	did_spin = false


func _walls() -> void:
	s = minf(s, track.length - 2.0)
	var lw := track.half_left(s) - half_w
	var rw := track.half_right(s) - half_w
	if scraping > 0.0:
		scraping -= 1.0 / 60.0
	if x > rw:
		_hit_wall(1.0)
		x = rw
	elif x < -lw:
		_hit_wall(-1.0)
		x = -lw


func _hit_wall(side: float) -> void:
	var into := v * sin(psi) * side
	if into <= 0.0:
		return
	if into > 19.0 and absf(psi) > 0.40 and invuln <= 0.0 and not airborne:
		wreck("wall")
		return
	psi = -psi * 0.25
	v -= into * 0.45
	scraping = 0.15
	scrape_side = side
	if into > 4.0:
		events.append(["wall", into])


func wreck(cause: String, by: Racer = null) -> void:
	if wrecked or invuln > 0.0 or finished:
		return
	wrecked = true
	wreck_t = 0.0
	stats.wrecks += 1
	wreck_angvel = Vector3(randf_range(-4.0, 4.0), randf_range(-3.0, 3.0), randf_range(-8.0, 8.0))
	wreck_rot = Vector3.ZERO
	vy = randf_range(5.0, 9.0)
	wreck_vx = sin(psi) * v * 0.5 + randf_range(-4.0, 4.0)
	nitro_level = 0
	drifting = false
	airborne = true
	events.append(["wreck", cause])
	if by != null:
		by.events.append(["takedown", self])
		by.stats.takedowns += 1
		by.gauge = minf(1.0, by.gauge + 0.35)


func _update_wreck(dt: float) -> void:
	wreck_t += dt
	v = maxf(0.0, v - v * 1.4 * dt - 4.0 * dt)
	s += v * dt
	x += wreck_vx * dt
	wreck_vx *= exp(-2.0 * dt)
	var lw := track.half_left(s) - half_w
	var rw := track.half_right(s) - half_w
	if x > rw or x < -lw:
		x = clampf(x, -lw, rw)
		wreck_vx = -wreck_vx * 0.3
	vy -= G * dt
	yw += vy * dt
	var g := track.road_y(s)
	if yw < g:
		yw = g
		vy = absf(vy) * 0.35
		wreck_angvel *= 0.6
	wreck_rot += wreck_angvel * dt
	if wreck_t > WRECK_TIME:
		respawn()


func respawn(new_x: float = INF) -> void:
	wrecked = false
	wreck_rot = Vector3.ZERO
	airborne = false
	vy = 0.0
	roll = 0.0
	spin = 0.0
	roll_speed = 0.0
	spin_speed = 0.0
	if new_x == INF:
		var best := 0.0
		var bd := 1e9
		for k in track.lanes:
			if track.is_oncoming_lane(k):
				continue
			var c := track.lane_center(k)
			if absf(c - x) < bd:
				bd = absf(c - x)
				best = c
		x = best
	else:
		x = new_x
	psi = 0.0
	v = vmax * 0.5
	yw = track.road_y(s)
	vy = v * track.forward_at(s).y
	invuln = 2.2
	events.append(["respawn", 0])


# ---------------------------------------------------------------------------
# Visuel
# ---------------------------------------------------------------------------

func sync_visual(dt: float) -> void:
	if model == null:
		return
	var b := track.basis_at(s)
	var p := track.point(s, x)
	p.y = yw
	var yaw := -(psi + slip)
	var basis := b * Basis(Vector3.UP, yaw)
	model.global_transform = Transform3D(basis, p)
	var road_slope := track.forward_at(s).y
	var pitch_t := 0.0
	if airborne:
		pitch_t = clampf((atan2(vy, maxf(v, 1.0)) - asin(clampf(road_slope, -1.0, 1.0))) * 0.55, -0.45, 0.35)
	elif on_ramp >= 0:
		var rp: Dictionary = track.ramps[on_ramp]
		pitch_t = atan(rp.h / rp.len)
	pitch_vis = lerpf(pitch_vis, pitch_t, 1.0 - exp(-8.0 * dt))
	if wrecked:
		model.pivot.rotation = wreck_rot
	else:
		var body_roll := steer_vis * 0.035 * clampf(v / 50.0, 0.0, 1.0)
		var squat := -0.012 if nitro_level > 0 else (0.02 if braking else 0.0)
		model.pivot.rotation = Vector3(pitch_vis - squat, spin, roll + ramp_roll + body_roll)
	model.set_wheels(v * dt, steer_vis * 0.45)
	model.set_nitro(nitro_level if not wrecked else 0)
	model.set_smoke(drifting and not airborne)
	model.set_sparks(scraping > 0.0, scrape_side)
	model.set_brake(braking or drifting)
	model.visible = not eliminated
