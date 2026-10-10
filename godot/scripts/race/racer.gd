class_name Racer
extends Node3D
## Un concurrent (joueur ou IA). Physique arcade façon Asphalt en espace piste :
## accélération automatique, drift, nitro (normal / parfait / onde de choc / ultra), sauts,
## tonneaux sur rampes inclinées, 360°, takedowns, épaves et réapparition.

signal stunt(racer: Racer, kind: String, text: String, nitro_gain: float)

const CAR_HALF_W := 0.95
const CAR_LEN := 4.6
const NITRO_BURST := 1.35
const PERFECT_A := 0.62
const PERFECT_B := 1.05
const DOUBLE_TAP := 0.32
# niveaux de nitro (comme dans Asphalt Legends Unite) :
# normal (orange) -> ré-appui dans la zone bleu clair de la jauge = PARFAIT (bleu clair)
# jauge pleine + double appui = ONDE DE CHOC (violet)
# pendant l'onde de choc, appui dans la zone turquoise de la jauge = ULTRA NITRO (turquoise)
const NITRO_OFF := 0
const NITRO_NORMAL := 1
const NITRO_PERFECT := 2
const NITRO_SHOCK := 3
const NITRO_ULTRA := 4
const SHOCK_FULL := 99.0      # l'onde de choc demande une jauge pleine
const ULTRA_A := 0.7          # fenêtre de l'ultra nitro (secondes après le début de l'onde de choc)
const ULTRA_B := 1.12
const ULTRA_BONUS := 15.0     # nitro rendu en déclenchant l'ultra

var track: Track
var car_id := ""
var display_name := ""
var is_player := false
var stats: Dictionary = {}
var visual: CarVisual
var speed_mult := 1.0

# état en espace piste
var s := 0.0
var x := 0.0
var h := 0.0
var v := 0.0
var vx := 0.0
var vy := 0.0
var prev_s := 0.0
var airborne := false
var air_time := 0.0
var on_ramp: Dictionary = {}
var rolling := false
var roll := 0.0
var roll_rate := 0.0
var yaw := 0.0
var pitch := 0.0
var spin_time := 0.0
var spin_angle := 0.0
var started := false

# nitro / drift
var nitro := 30.0
var nitro_level := 0
var nitro_time := 0.0
var perfect_chain := 0
var last_nitro_press := -10.0
var _full_at_press := false
var ultra_lost := false
var drifting := false
var drift_time := 0.0
var drift_dir := 0.0
var last_drift_press := -10.0
var scraping := 0.0

# épave
var wrecked := false
var wreck_timer := 0.0
var ghost := 0.0
var _w_off := Vector3.ZERO
var _w_vel := Vector3.ZERO
var _w_rot := Vector3.ZERO
var _w_spin := Vector3.ZERO

# course
var finished := false
var finish_time := 0.0
var race_pos := 1

# entrées (remplies par le joueur ou l'IA)
var in_steer := 0.0
var in_drift := false
var in_nitro := false
var _prev_nitro := false
var _prev_drift := false

# IA / TouchDrive
var autopilot := false
var ai_skill := 0.8
var ai_aggressive := false
var ai_target_x := 0.0
var _ai_lane_timer := 0.0
var _ai_nitro_timer := 0.0
var _ai_rng := RandomNumberGenerator.new()

# statistiques de course
var takedowns := 0
var barrel_rolls := 0
var jumps := 0
var wrecks := 0
var perfect_nitros := 0
var shockwaves := 0
var ultra_nitros := 0
var near_misses := 0
var flat_spins := 0
var near_miss_ids := {}


func setup(p_track: Track, p_car_id: String, p_stats: Dictionary, p_player: bool, p_name: String, paint := "") -> void:
	track = p_track
	car_id = p_car_id
	stats = p_stats
	is_player = p_player
	display_name = p_name
	visual = CarVisual.new()
	add_child(visual)
	var lights: bool = p_player and track.theme.get("night", 0.0) > 0.3 and track.quality >= 1
	visual.setup(car_id, false, paint, lights, true)
	_ai_rng.seed = hash(p_name)


func top_speed() -> float:
	return stats["top_speed"] * speed_mult


# ---------------------------------------------------------------------------
func physics_step(dt: float, clock: float) -> void:
	prev_s = s
	if wrecked:
		_update_wreck(dt)
		_apply_transform(dt)
		return
	ghost = max(0.0, ghost - dt)
	if finished:
		in_nitro = false
		in_drift = false
	_handle_nitro(dt, clock)
	_handle_drift(dt, clock)

	# --- vitesse longitudinale ---
	var top := top_speed()
	var acc: float = stats["accel"]
	match nitro_level:
		NITRO_NORMAL:
			top *= stats["nitro_mult"]
			acc *= 1.9
		NITRO_PERFECT:
			top *= stats["nitro_mult"] + 0.07
			acc *= 2.4
		NITRO_SHOCK:
			top *= stats["nitro_mult"] + 0.14
			acc *= 3.2
		NITRO_ULTRA:
			top *= stats["nitro_mult"] + 0.24
			acc *= 4.4
	if finished:
		top *= 0.6
	if not started:
		v = 0.0
	elif in_drift and abs(in_steer) < 0.25 and not airborne:
		v = max(0.0, v - 30.0 * dt)  # freinage
	elif v < top:
		var f := 1.0 - pow(v / top, 2.2)
		v = min(top, v + acc * max(f, 0.07) * dt)
	else:
		v = move_toward(v, top, 10.0 * dt)
	if drifting:
		v = max(0.0, v - 2.5 * dt)
	if scraping > 0.0:
		v = max(0.0, v - 8.0 * dt)
	if spin_time > 0.0 and not airborne:
		v = max(0.0, v - 6.0 * dt)
	scraping = max(0.0, scraping - dt)
	s += v * dt

	# --- déplacement latéral ---
	var k := track.curvature_at(s)
	var lat_max: float = stats["lat_speed"] * (1.28 if drifting else 1.0)
	var cf := -k * v * minf(v, 70.0) * (0.17 if drifting else 0.33)
	var steer_eff := in_steer
	if airborne:
		cf *= 0.3
		steer_eff *= 0.45
	var target := steer_eff * lat_max + cf
	var resp := 2.0 if airborne else 7.5
	vx = lerp(vx, target, 1.0 - exp(-resp * dt))
	x += vx * dt
	var limit := track.half_width - CAR_HALF_W
	if abs(x) > limit:
		var impact: float = abs(vx)
		var side: float = sign(x)
		x = side * limit
		vx = -side * min(impact * 0.25, 2.0)
		if not airborne:
			scraping = 0.25
			if visual:
				visual.emit_sparks(side)
			if is_player and impact > 3.0:
				Audio.play("scrape", -4.0)
	_check_split()

	# --- vertical : rampes, crêtes, sauts ---
	var ramp := track.ramp_at(s, x)
	if airborne:
		air_time += dt
		vy += (-Track.GRAVITY - v * v * track.elev_ss_at(s)) * dt
		h += vy * dt
		nitro = min(100.0, nitro + 7.0 * dt)
		if rolling:
			roll += roll_rate * dt
		var gh := track.ground_height(s, x)
		if h <= gh and vy <= 0.0:
			_land(gh)
	else:
		if not ramp.is_empty():
			var slope := track.ramp_height(ramp, s + 0.5, x) - track.ramp_height(ramp, s - 0.5, x)
			h = track.ramp_height(ramp, s, x)
			vy = slope * v
			on_ramp = ramp
		elif not on_ramp.is_empty():
			_takeoff(on_ramp)
			on_ramp = {}
		else:
			h = 0.0
			vy = 0.0
			var lift := -Track.GRAVITY - v * v * track.elev_ss_at(s)
			if lift > 0.0 and v > 25.0 and started:
				airborne = true
				air_time = 0.0
				vy = 0.0

	# --- 360° ---
	if spin_time > 0.0:
		spin_time -= dt
		spin_angle = (1.0 - max(spin_time, 0.0) / 0.75) * TAU
		if spin_time <= 0.0:
			spin_angle = 0.0

	_apply_transform(dt)


func _handle_nitro(dt: float, clock: float) -> void:
	var pressed := in_nitro and not _prev_nitro
	_prev_nitro = in_nitro
	if not started or finished:
		if nitro_level > NITRO_OFF:
			nitro_level = NITRO_OFF
			_nitro_fx()
		return
	if pressed:
		var double_tap := clock - last_nitro_press < DOUBLE_TAP
		if double_tap and _full_at_press and nitro_level < NITRO_SHOCK:
			nitro_level = NITRO_SHOCK
			nitro_time = 0.0
			perfect_chain = 0
			ultra_lost = false
			shockwaves += 1
			stunt.emit(self, "shockwave", "ONDE DE CHOC", 0.0)
			if is_player:
				Audio.play("shockwave", -2.0)
			_nitro_fx()
		elif nitro_level == NITRO_SHOCK:
			if not ultra_lost and nitro_time >= ULTRA_A and nitro_time <= ULTRA_B:
				nitro_level = NITRO_ULTRA
				nitro_time = 0.0
				nitro = minf(100.0, nitro + ULTRA_BONUS)
				ultra_nitros += 1
				stunt.emit(self, "ultra", "ULTRA NITRO", 0.0)
				if is_player:
					Audio.play("ultra", 0.0)
				_nitro_fx()
			elif nitro_time > DOUBLE_TAP:
				# appui hors de la zone turquoise : l'ultra est raté pour cette onde de choc
				ultra_lost = true
		elif nitro_level == NITRO_NORMAL or nitro_level == NITRO_PERFECT:
			if nitro_time >= PERFECT_A and nitro_time <= PERFECT_B:
				nitro_level = NITRO_PERFECT
				nitro_time = 0.0
				perfect_nitros += 1
				perfect_chain += 1
				stunt.emit(self, "perfect", "NITRO PARFAIT", 0.0)
				if perfect_chain == 3:
					stunt.emit(self, "sequence", "SÉQUENCE PARFAITE", 0.0)
				if is_player:
					Audio.play("boost", -3.0, 1.2)
				_nitro_fx()
			elif not double_tap:
				# appui hors de la zone bleu clair : nitro normal, une nouvelle zone apparaît
				if nitro_level != NITRO_NORMAL:
					nitro_level = NITRO_NORMAL
					_nitro_fx()
				nitro_time = 0.0
				perfect_chain = 0
		elif nitro_level == NITRO_OFF and nitro > 4.0:
			nitro_level = NITRO_NORMAL
			nitro_time = 0.0
			perfect_chain = 0
			if is_player:
				Audio.play("boost", -5.0)
			_nitro_fx()
		_full_at_press = nitro >= SHOCK_FULL and nitro_level < NITRO_SHOCK
		last_nitro_press = clock
	if nitro_level > NITRO_OFF:
		nitro_time += dt
		nitro -= nitro_burn_rate() * dt
		var active := nitro > 0.0 and (nitro_level >= NITRO_SHOCK or in_nitro or nitro_time < NITRO_BURST)
		if not active:
			nitro_level = NITRO_OFF
			_nitro_fx()
	elif started:
		nitro += 2.2 * dt  # recharge passive lente
	nitro = clamp(nitro, 0.0, 100.0)


## Consommation de nitro par seconde au niveau actuel.
func nitro_burn_rate() -> float:
	var burn: float = stats["nitro_burn"]
	if nitro_level == NITRO_SHOCK:
		burn *= 1.7
	elif nitro_level == NITRO_ULTRA:
		burn *= 1.45
	return burn


## Zone de la jauge (en unités de nitro, x = bas, y = haut) que le bord de la jauge
## traverse pendant la fenêtre [t_a, t_b] du niveau actuel. Vector2.ZERO = pas de zone.
func _zone(t_a: float, t_b: float) -> Vector2:
	var burn := nitro_burn_rate()
	var hi := nitro - burn * maxf(t_a - nitro_time, 0.0)
	var lo := nitro - burn * maxf(t_b - nitro_time, 0.0)
	if nitro_time > t_b or hi <= 0.0:
		return Vector2.ZERO
	return Vector2(maxf(lo, 0.0), hi)


## Zone bleu clair du nitro parfait (pendant un nitro normal ou parfait).
func perfect_zone() -> Vector2:
	if nitro_level != NITRO_NORMAL and nitro_level != NITRO_PERFECT:
		return Vector2.ZERO
	return _zone(PERFECT_A, PERFECT_B)


## Zone turquoise de l'ultra nitro (pendant l'onde de choc, tant qu'elle n'est pas ratée).
func ultra_zone() -> Vector2:
	if nitro_level != NITRO_SHOCK or ultra_lost:
		return Vector2.ZERO
	return _zone(ULTRA_A, ULTRA_B)


func in_perfect_window() -> bool:
	return (nitro_level == NITRO_NORMAL or nitro_level == NITRO_PERFECT) and nitro_time >= PERFECT_A and nitro_time <= PERFECT_B


func in_ultra_window() -> bool:
	return nitro_level == NITRO_SHOCK and not ultra_lost and nitro_time >= ULTRA_A and nitro_time <= ULTRA_B


## Jauge pleine : l'onde de choc est disponible (double appui).
func shockwave_ready() -> bool:
	return nitro >= SHOCK_FULL and nitro_level < NITRO_SHOCK and started and not finished


func _nitro_fx() -> void:
	if visual:
		visual.set_nitro(nitro_level)


func _handle_drift(dt: float, clock: float) -> void:
	var pressed := in_drift and not _prev_drift
	_prev_drift = in_drift
	if pressed and started:
		if clock - last_drift_press < DOUBLE_TAP and spin_time <= 0.0 and v > 30.0:
			spin_time = 0.75
			flat_spins += 1
			_gain(18.0)
			stunt.emit(self, "spin", "360°", 18.0)
			if is_player:
				Audio.play("whoosh", -2.0)
		last_drift_press = clock
	var was := drifting
	drifting = in_drift and abs(in_steer) > 0.2 and v > 22.0 and not airborne and started
	if drifting:
		drift_time += dt
		drift_dir = sign(in_steer)
		_gain(13.0 * dt)
	else:
		if was and drift_time > 1.3:
			stunt.emit(self, "drift", "DRIFT", 0.0)
		drift_time = 0.0
	if visual:
		visual.set_drift_smoke(drifting)


func _gain(n: float) -> void:
	nitro = min(100.0, nitro + n)


func _check_split() -> void:
	if airborne and h > 1.3:
		return
	for sp in track.splits:
		if s < sp["s0"] or s > sp["s1"]:
			continue
		var lim := 1.0 + CAR_HALF_W
		if abs(x) < lim:
			if prev_s < sp["s0"] + 0.5 and abs(x) < lim - 0.35:
				wreck("pillar")
				return
			var side: float = sign(x) if x != 0.0 else 1.0
			x = side * lim
			vx = side * 2.0
			scraping = 0.2
			if visual:
				visual.emit_sparks(-side)


func _takeoff(r: Dictionary) -> void:
	airborne = true
	air_time = 0.0
	if r["barrel"] and vy > 2.0:
		var t_air: float = max(0.55, (vy + sqrt(vy * vy + 2.0 * Track.GRAVITY * max(h, 0.0))) / Track.GRAVITY)
		rolling = true
		roll = 0.0
		roll_rate = TAU / t_air * -float(r["tilt"])


func _land(gh: float) -> void:
	var impact := -vy
	airborne = false
	h = gh
	vy = 0.0
	if rolling:
		rolling = false
		roll = 0.0
		barrel_rolls += 1
		_gain(30.0)
		stunt.emit(self, "barrel", "TONNEAU", 30.0)
	elif air_time > 0.75:
		jumps += 1
		_gain(12.0)
		stunt.emit(self, "jump", "SAUT", 12.0)
	if visual:
		visual.bounce(impact)
	if is_player and impact > 4.0:
		Audio.play("land", -4.0)


func wreck(reason: String = "") -> void:
	if wrecked or ghost > 0.0 or finished:
		return
	if is_player and Game.autotest.has("log"):
		print("WRECK %s s=%.0f x=%.2f h=%.1f v=%.0f split=%s" % [reason, s, x, h, v * 3.6, track.in_split(s)])
	wrecked = true
	wreck_timer = 2.1
	wrecks += 1
	nitro_level = NITRO_OFF
	_nitro_fx()
	drifting = false
	rolling = false
	roll = 0.0
	spin_time = 0.0
	on_ramp = {}
	var rng := _ai_rng
	_w_off = Vector3(0, h, 0)
	_w_vel = Vector3(rng.randf_range(-5, 5), rng.randf_range(7, 11), -min(v, 40.0) * 0.15)
	_w_rot = Vector3.ZERO
	_w_spin = Vector3(rng.randf_range(-7, 7), rng.randf_range(-5, 5), rng.randf_range(-9, 9))
	airborne = false
	h = 0.0
	if visual:
		visual.set_drift_smoke(false)
	stunt.emit(self, "wreck", "ÉPAVE", 0.0)


func _update_wreck(dt: float) -> void:
	wreck_timer -= dt
	v = move_toward(v, 0.0, 22.0 * dt)
	s += v * dt
	_w_vel.y -= Track.GRAVITY * dt
	_w_off += _w_vel * dt
	_w_rot += _w_spin * dt
	if _w_off.y < 0.3:
		_w_off.y = 0.3
		if _w_vel.y < 0.0:
			_w_vel.y = -_w_vel.y * 0.35
			_w_vel.x *= 0.6
			_w_spin *= 0.55
	if wreck_timer <= 0.0:
		_respawn()


func _respawn() -> void:
	wrecked = false
	ghost = 2.2
	v = top_speed() * 0.55
	vx = 0.0
	h = 0.0
	vy = 0.0
	airborne = false
	_w_off = Vector3.ZERO
	_w_rot = Vector3.ZERO
	var best := 0
	var bd := 1e9
	for lane in Track.LANES:
		var d: float = abs(track.lane_x(lane) - x)
		if d < bd:
			bd = d
			best = lane
	x = track.lane_x(best)
	if visual:
		visual.transform = Transform3D.IDENTITY


func _apply_transform(dt: float) -> void:
	var tr := track.frame(s)
	var pos := tr.origin + tr.basis.x * x + tr.basis.y * h
	var yaw_target := atan2(vx, maxf(v, 5.0)) * 0.9
	if drifting:
		yaw_target += drift_dir * 0.42
	yaw = lerp(yaw, yaw_target, 1.0 - exp(-6.0 * dt))
	var pitch_target := 0.0
	if not on_ramp.is_empty() and not airborne:
		pitch_target = atan(vy / max(v, 1.0))
	elif airborne:
		pitch_target = atan(vy / max(v, 1.0)) * 0.6
	pitch = lerp(pitch, pitch_target, 1.0 - exp(-8.0 * dt))
	var b := tr.basis * Basis(Vector3.UP, -yaw - spin_angle) * Basis(Vector3.RIGHT, pitch) * Basis(Vector3.FORWARD, roll)
	global_transform = Transform3D(b, pos)
	if wrecked and visual:
		visual.transform = Transform3D(Basis.from_euler(_w_rot), Vector3(_w_off.x, _w_off.y, 0.0))
	elif visual:
		visual.update_visual(dt, v, in_steer, vx, airborne)
		visual.visible = true
	if visual and ghost > 0.0:
		visual.visible = fmod(ghost, 0.24) > 0.08


# ---------------------------------------------------------------------------
# Pilote automatique (IA et TouchDrive)
# ---------------------------------------------------------------------------
func think(dt: float, clock: float, racers: Array, traffic: Array, player: Racer) -> void:
	if wrecked:
		in_nitro = false
		in_drift = false
		return
	_ai_lane_timer -= dt
	var look: float = clamp(v * 1.7, 45.0, 150.0)
	if _ai_lane_timer <= 0.0:
		_ai_lane_timer = 0.22 if is_player else _ai_rng.randf_range(0.25, 0.5)
		var best_cost := 1e9
		var best_x := x
		for lane in Track.LANES:
			var lx := track.lane_x(lane)
			var cost: float = abs(lx - x) * 0.6
			for t in traffic:
				if not t.active or t.knocked:
					continue
				var ds: float = t.s - s
				if ds > -3.0 and ds < look and abs(t.x - lx) < 2.6:
					cost += 60.0 * (1.0 - ds / look) + 15.0
			for r in track.ramps:
				var dr: float = r["s"] - s
				if dr > 15.0 and dr < look and abs(r["x"] - lx) < 1.0:
					if is_player or ai_skill > 0.55:
						cost -= 25.0 if r["barrel"] else 14.0
			var sp := track.next_split(s)
			if not sp.is_empty() and sp["s0"] - s < look and abs(lx) < 2.5 and sp["s0"] - s > -1.0:
				cost += 0.0  # les voies centrales passent de chaque côté de la séparation
			for o in racers:
				if o == self or o.wrecked:
					continue
				var dso: float = o.s - s
				if dso > 2.0 and dso < 30.0 and abs(o.x - lx) < 2.0:
					if ai_aggressive and o == player and v > o.v:
						cost -= 20.0
					else:
						cost += 10.0
			if cost < best_cost:
				best_cost = cost
				best_x = lx
		ai_target_x = best_x
	# séparation centrale : rester d'un côté
	var spn := track.next_split(s)
	if not spn.is_empty() and spn["s0"] - s < 60.0 and abs(ai_target_x) < 2.2:
		ai_target_x = track.lane_x(1) if x < 0.0 else track.lane_x(2)
	# direction : vitesse latérale souhaitée -> braquage
	var k := track.curvature_at(s + v * 0.25)
	var lat_max: float = stats["lat_speed"]
	var cf := -k * v * minf(v, 70.0) * 0.33
	var vx_des: float = clamp((ai_target_x - x) * 2.2, -lat_max, lat_max)
	var steer := (vx_des - cf) / lat_max
	in_drift = false
	if abs(steer) > 1.05 and v > 30.0:
		cf = -k * v * minf(v, 70.0) * 0.17
		steer = (vx_des - cf) / (lat_max * 1.28)
		in_drift = true
	in_steer = clamp(steer, -1.0, 1.0)
	if airborne:
		in_drift = false
	# nitro
	_ai_nitro_timer -= dt
	var straight: bool = abs(k) < 0.004
	if nitro_level == NITRO_OFF:
		in_nitro = false
		if nitro > (30.0 if is_player else 40.0) and straight and _ai_nitro_timer <= 0.0 and started:
			in_nitro = true
			_ai_nitro_timer = 0.4
	elif nitro_level == NITRO_NORMAL or nitro_level == NITRO_PERFECT:
		var want_perfect := _ai_rng.randf() < (0.9 if is_player else ai_skill)
		in_nitro = want_perfect and nitro_time > PERFECT_A + 0.08 and nitro_time < PERFECT_B - 0.05 and not _prev_nitro
		if not in_nitro and nitro_time > PERFECT_B:
			in_nitro = false
	else:
		in_nitro = false
