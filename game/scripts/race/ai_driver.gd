class_name AIDriver
extends RefCounted
## Pilote automatique : utilisé par les adversaires et par le mode TouchDrive du joueur.

var skill := 0.7
var aggression := 0.4
var lane_pref := 0.0
var target_x := 0.0
var touchdrive := false
var auto_nitro := true
var rng := RandomNumberGenerator.new()
var _think := 0.0
var _want_ramps := true
var _nitro_cool := 0.0


func _init(p_skill: float = 0.7, p_aggr: float = 0.4, seed: int = 0) -> void:
	skill = p_skill
	aggression = p_aggr
	rng.seed = seed
	lane_pref = rng.randf_range(-4.0, 4.0)
	_want_ramps = rng.randf() < 0.4 + skill * 0.5


func drive(r: Racer, race, dt: float) -> void:
	var tr := r.track
	_think -= dt
	_nitro_cool -= dt
	if _think <= 0.0:
		_think = 0.10 + rng.randf() * 0.08
		target_x = _choose_line(r, race)
	var look := clampf(r.v * 0.8, 12.0, 55.0)
	var err := target_x - r.x
	var psi_des := clampf(atan2(err, look), -0.34, 0.34)
	var kappa := tr.curvature(r.s + r.v * 0.25)
	var han01 := clampf((r.handling - 40.0) / 45.0, 0.0, 1.0)
	var rate := lerpf(1.2, 1.7, han01) * (1.6 if r.drifting else 1.0)
	var sf := clampf(r.v / 16.0, 0.05, 1.0)
	var ff := kappa * r.v * (0.14 if not r.drifting else 0.03) / (rate * sf)
	var steer := (psi_des - r.psi) * 2.8 + ff
	r.steer_in = clampf(steer, -1.0, 1.0)
	# dérapage dans les virages serrés
	var k_ahead := 0.0
	for d: float in [20.0, 45.0, 70.0]:
		k_ahead = maxf(k_ahead, absf(tr.curvature(r.s + d)))
	r.drift_held = k_ahead > 1.0 / 125.0 and r.v > 42.0 and absf(r.steer_in) > 0.32 and skill > 0.25
	# nitro
	if auto_nitro and not r.airborne:
		if r.nitro_level == 0 and _nitro_cool <= 0.0 and r.gauge > 0.30 + (1.0 - skill) * 0.3 and k_ahead < 1.0 / 260.0:
			r.nitro_press = true
			_nitro_cool = 1.0
		elif r.nitro_level == 1 and r.nitro_t > 0.95 and r.nitro_t < 1.3 and _nitro_cool <= 0.0:
			if rng.randf() < skill * 0.9:
				r.nitro_press = true
			_nitro_cool = 1.0
	# 360° en l'air de temps en temps
	if r.airborne and not r.did_roll and not r.did_spin and r.air_time < 0.15 and rng.randf() < skill * 0.02:
		r.drift_press = true


func _choose_line(r: Racer, race) -> float:
	var tr := r.track
	var cands: Array[float] = []
	for k in tr.lanes:
		var c := tr.lane_center(k)
		cands.append(c)
		if k < tr.lanes - 1:
			cands.append(c + Track.LANE_W * 0.5)
	var half := minf(tr.half_left(r.s), tr.half_right(r.s)) - r.half_w - 0.3
	var obs: Array = race.obstacles_near(r, r.v * 2.4 + 25.0)
	var ramps := tr.ramps_between(r.s + 15.0, r.s + 130.0)
	var kappa := tr.curvature(r.s + 50.0)
	var best := r.x
	var best_cost := 1e9
	var pref := lane_pref
	if touchdrive:
		pref = lane_pref
	for c in cands:
		if absf(c) > half:
			continue
		var cost := absf(c - r.x) * 0.12 + absf(c - pref) * 0.06
		if absf(c - target_x) < 1.0:
			cost -= 1.5
		# voies à contresens
		var lane_idx := clampi(int((c + tr.lanes * Track.LANE_W * 0.5) / Track.LANE_W), 0, tr.lanes - 1)
		if tr.is_oncoming_lane(lane_idx):
			cost += 6.0
		# corde des virages
		if absf(kappa) > 1.0 / 400.0:
			cost += -signf(kappa) * c * 0.25 * skill
		for o in obs:
			var ds: float = o.s - r.s
			if ds < -3.0:
				continue
			var closing: float = r.v - o.v
			var ttc: float = ds / maxf(closing, 0.5) if closing > 0.0 else 99.0
			var gap: float = r.half_w + o.half_w + 0.7
			if absf(c - o.x) < gap and ttc < 3.0:
				var w := 60.0 if o.traffic else 18.0
				cost += w * (1.0 - ttc / 3.0) + (40.0 if o.v < 0.0 else 0.0)
			# attaque (takedown) d'un rival juste devant
			if not o.traffic and not touchdrive and ds > 2.0 and ds < 25.0 and absf(c - o.x) < 1.2:
				cost -= 9.0 * aggression * (1.0 if o.is_player else 0.5)
		if _want_ramps or touchdrive:
			for rp in ramps:
				if absf(c - rp.x) < 0.9:
					cost -= 7.0 * (0.5 + skill * 0.5)
		if cost < best_cost:
			best_cost = cost
			best = c
	return best
