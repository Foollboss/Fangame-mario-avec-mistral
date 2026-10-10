extends Node3D
## Orchestration d'une course : construction de la piste, concurrents, trafic,
## décompte, collisions / takedowns, classement, arrivée et récompenses.

var req: Dictionary = {}
var track: Track
var racers: Array = []
var player: Racer
var traffic: TrafficManager
var cam: RaceCamera
var hud: RaceHUD
var world_env: WorldEnvironment
var sun: DirectionalLight3D

var state := "intro"
var clock := 0.0
var state_t := 0.0
var countdown_n := 4
var touchdrive := false
var paused := false
var order: Array = []
var target_time := 0.0
var mode := "classic"
var _slowmo := 0.0
var _rng := RandomNumberGenerator.new()
var _rewards: Dictionary = {}
var _finish_shown := false
var _test_ramp_x := 0.0
var _shock_hint_shown := false


func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	req = Game.race_request
	if req.is_empty():
		req = Game.quick_race_request()
		Game.race_request = req
	mode = req.get("mode", "classic")
	_rng.seed = int(req.get("seed", 1)) + 77
	var quality: int = Game.setting("quality", 2)
	touchdrive = Game.setting("touchdrive", false) or Game.autotest.has("autodrive")

	track = Track.new()
	add_child(track)
	track.generate(req.get("theme", "sf"), int(req.get("seed", 1)), float(req.get("length", 3000.0)),
		{"quality": quality, "barrel_heavy": req.get("barrel_heavy", false)})
	track.build_visuals()

	world_env = WorldEnvironment.new()
	world_env.environment = track.make_environment()
	add_child(world_env)
	sun = track.make_sun()
	add_child(sun)

	_spawn_racers()
	traffic = TrafficManager.new()
	add_child(traffic)
	traffic.setup(track, float(track.theme.get("traffic", 1.0)) * (0.6 if quality == 0 else 1.0), int(req.get("seed", 1)))
	traffic.initial_spawn()

	cam = RaceCamera.new()
	cam.track = track
	cam.target = player
	cam.mode = int(Game.setting("camera", 0))
	add_child(cam)
	cam.set_state("intro")

	hud = RaceHUD.new()
	add_child(hud)
	hud.setup_board(racers)
	hud.pause_pressed.connect(_toggle_pause)
	hud.resume_pressed.connect(_toggle_pause)
	hud.restart_pressed.connect(_restart)
	hud.quit_pressed.connect(_quit)
	hud.next_pressed.connect(_quit)
	hud.touchdrive_toggled.connect(_toggle_touchdrive)
	hud.show_center(req.get("name", ""), 2.2, Game.objective_text(req.get("objective", {})), Color.WHITE)

	if mode == "time_attack":
		target_time = (float(req.get("length", 3000.0)) / (player.stats["top_speed"] * 0.80)) + 6.0
		req["objective"] = {"type": "time", "value": target_time}

	Audio.engine_start()
	Audio.play_music()
	for r in racers:
		r._apply_transform(0.016)
	_update_order()


func _spawn_racers() -> void:
	var car_id: String = req.get("car", Game.save["selected_car"])
	var pstats := Game.race_stats(car_id)
	var paint: String = Game.car_state(car_id).get("paint", "")
	player = Racer.new()
	add_child(player)
	player.setup(track, car_id, pstats, true, Game.save.get("name", "Joueur"), paint)
	racers.append(player)
	if mode == "time_attack":
		player.s = track.start_s
		player.x = track.lane_x(1) + 2.0
		player.stunt.connect(_on_stunt)
		return
	var cls: String = req.get("class", Game.car_def(car_id)["class"])
	var pool := Game.cars_of_class(cls)
	if pool.is_empty():
		pool = Game.cars
	var names := Game.AI_NAMES.duplicate()
	_shuffle(names)
	var rec := float(req.get("rec_rank", Game.car_rank(car_id)))
	var n_ai := 5
	for i in n_ai:
		var c: Dictionary = pool[_rng.randi() % pool.size()]
		var rank := rec * _rng.randf_range(0.9, 1.06)
		rank = clamp(rank, float(c["rank"][0]), float(c["rank"][1]))
		var st := Game.race_stats(c["id"], int(rank))
		var ai := Racer.new()
		add_child(ai)
		var paint_ai := ""
		ai.setup(track, c["id"], st, false, names[i], paint_ai)
		ai.autopilot = true
		ai.ai_skill = _rng.randf_range(0.55, 0.95)
		ai.ai_aggressive = _rng.randf() < 0.4
		racers.append(ai)
	# grille : 3 rangées de 2, le joueur part en dernière ligne
	var slots := []
	for row in 3:
		for col in 2:
			slots.append([track.start_s - row * 9.0 - col * 2.5, track.lane_x(1 + col)])
	var ai_list := racers.slice(1)
	for i in ai_list.size():
		ai_list[i].s = slots[i][0]
		ai_list[i].x = slots[i][1]
	player.s = slots[5][0]
	player.x = slots[5][1]
	for r in racers:
		r.stunt.connect(_on_stunt)
	if Game.autotest.has("goto_ramp"):
		for rp in track.ramps:
			if rp["barrel"] == (Game.autotest["goto_ramp"] == "barrel"):
				player.s = rp["s"] - 110.0
				player.x = rp["x"]
				_test_ramp_x = rp["x"]
				for ai in ai_list:
					ai.s = player.s - 30.0
				break


func _shuffle(a: Array) -> void:
	for i in range(a.size() - 1, 0, -1):
		var j := _rng.randi_range(0, i)
		var t = a[i]
		a[i] = a[j]
		a[j] = t


# ---------------------------------------------------------------------------
func debug_state() -> String:
	return "(course %s, %s, chrono %.1f s, position %d, %.0f m)" % [req.get("theme", "?"), state, clock, player.race_pos if player else 0, player.s if player else 0.0]


func _notification(what: int) -> void:
	# bouton « retour » d'Android : met en pause / reprend
	if what == NOTIFICATION_WM_GO_BACK_REQUEST:
		if state == "results":
			_quit()
		else:
			_toggle_pause()
	elif what == NOTIFICATION_APPLICATION_FOCUS_OUT and not paused and state == "racing":
		_toggle_pause()


func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed("pause") and state != "results":
		_toggle_pause()
	elif event.is_action_pressed("touchdrive") and not paused:
		_toggle_touchdrive()
	elif event.is_action_pressed("camera") and not paused:
		cam.mode = (cam.mode + 1) % 3
		Game.set_setting("camera", cam.mode)


func _toggle_pause() -> void:
	if state == "results":
		return
	paused = not paused
	get_tree().paused = paused
	hud.show_pause(paused)
	if paused:
		Audio.engine_stop()
	else:
		Audio.engine_start()


func _toggle_touchdrive() -> void:
	touchdrive = not touchdrive
	Game.save["settings"]["touchdrive"] = touchdrive
	Game.save_game()
	hud.push_message("TOUCHDRIVE", "OUI" if touchdrive else "NON", UIKit.LIME if touchdrive else UIKit.RED)


func _restart() -> void:
	get_tree().paused = false
	Engine.time_scale = 1.0
	Audio.engine_stop()
	get_tree().reload_current_scene()


func _quit() -> void:
	get_tree().paused = false
	Engine.time_scale = 1.0
	Audio.engine_stop()
	Game.go_to_hub()


# ---------------------------------------------------------------------------
func _process(delta: float) -> void:
	if paused:
		return
	var dt: float = min(delta, 0.05)
	state_t += dt
	match state:
		"intro":
			if state_t > 2.4 or Input.is_action_just_pressed("nitro") or Input.is_action_just_pressed("ui_accept"):
				state = "countdown"
				state_t = 0.0
				countdown_n = 4
				cam.set_state("race")
		"countdown":
			var n := 3 - int(state_t)
			if n < countdown_n and n >= 1:
				countdown_n = n
				hud.show_center(str(n), 0.9, "", UIKit.WHITE)
				Audio.play("beep")
			if state_t >= 3.0:
				state = "racing"
				state_t = 0.0
				hud.show_center("GO !", 0.9, "", UIKit.YELLOW)
				Audio.play("go")
				for r in racers:
					r.started = true
				# départ parfait : nitro maintenu pendant le décompte
				if Input.is_action_pressed("nitro") or touchdrive:
					player.nitro = min(100.0, player.nitro + 25.0)
					hud.push_message("DÉPART PARFAIT", "+NITRO")
		"racing":
			clock += dt
			if not _shock_hint_shown and player.shockwave_ready():
				_shock_hint_shown = true
				hud.push_message("JAUGE PLEINE", "x2 = ONDE DE CHOC", UIKit.VIOLET)
			if Game.autotest.has("touchtest") and clock > 1.0 and not has_meta("touchtest_done"):
				set_meta("touchtest_done", true)
				hud.run_touch_test()
		"finished":
			clock += 0.0
			if state_t > 3.0 and not _finish_shown:
				_finish_shown = true
				_show_results()
	_drive(dt)
	cam.update(dt)
	_update_order()
	var total := racers.size()
	var dist: float = clamp((player.s - track.start_s) / (track.finish_s - track.start_s), 0.0, 1.0)
	hud.update_hud(dt, player, player.race_pos, total, dist, clock, touchdrive)
	hud.update_board(order, player)
	Audio.set_engine(player.v, player.stats["top_speed"], 1.0 if player.started else 0.3, player.nitro_level)
	if Game.autotest.has("log") and int(clock * 2.0) != int((clock - dt) * 2.0):
		print("t=%.1f s=%.0f x=%.1f h=%.1f v=%.0fkmh pos=%d nitro=%.0f lvl=%d wrecks=%d td=%d rolls=%d jumps=%d" % [clock, player.s, player.x, player.h, player.v * 3.6, player.race_pos, player.nitro, player.nitro_level, player.wrecks, player.takedowns, player.barrel_rolls, player.jumps])
	if _slowmo > 0.0:
		_slowmo -= delta / max(Engine.time_scale, 0.1)
		Engine.time_scale = 0.35 if _slowmo > 0.0 else 1.0


func _drive(dt: float) -> void:
	# entrées du joueur
	if Game.autotest.has("goto_ramp") and not player.finished:
		player.in_steer = clamp((_test_ramp_x - player.x) * 0.6 - player.vx * 0.1, -1.0, 1.0)
		player.in_nitro = int(clock * 4.0) % 2 == 0
		player.in_drift = false
		if state == "racing" and clock < 0.1:
			player.v = 75.0
	elif not player.finished:
		if touchdrive:
			player.think(dt, clock, racers, traffic.active_cars(), player)
			var manual := Input.get_axis("steer_left", "steer_right")
			if abs(manual) > 0.2:
				player.in_steer = manual
			if Input.is_action_pressed("nitro"):
				player.in_nitro = true
			if Input.is_action_pressed("drift"):
				player.in_drift = true
		else:
			player.in_steer = Input.get_axis("steer_left", "steer_right")
			player.in_nitro = Input.is_action_pressed("nitro")
			player.in_drift = Input.is_action_pressed("drift")
	else:
		player.think(dt, clock, racers, traffic.active_cars(), player)
	if Game.autotest.has("nitrotest") and state == "racing" and not player.finished:
		_nitro_test()
	# IA + élastique (rubber band)
	for r in racers:
		if r == player:
			continue
		var gap: float = r.s - player.s
		var mult := 1.0
		if gap > 140.0:
			mult = 0.9
		elif gap > 60.0:
			mult = 0.96
		elif gap < -200.0:
			mult = 1.1
		elif gap < -80.0:
			mult = 1.04
		r.speed_mult = lerp(r.speed_mult, mult, dt * 0.5)
		r.think(dt, clock, racers, traffic.active_cars(), player)
	for r in racers:
		r.physics_step(dt, clock)
	traffic.update(dt, player.s)
	_collisions()
	# arrivées
	for r in racers:
		if not r.finished and r.s >= track.finish_s and state != "intro" and state != "countdown":
			r.finished = true
			r.finish_time = clock
			if r == player:
				_on_player_finished()


## Test automatique du nitro (--nitrotest=/chemin/prefixe) : appuis scriptés pour vérifier
## nitro parfait, onde de choc et ultra nitro, avec captures de la jauge.
var _nt_level := 0


func _nitro_test() -> void:
	var t := clock
	var presses := [[1.3, 1.38], [1.45, 1.53], [2.37, 2.45],    # double appui = onde de choc, puis zone turquoise = ultra
		[7.0, 7.08], [7.8, 7.88], [8.65, 8.73], [9.0, 9.08],       # nitro, parfait, parfait, appui hors zone
		[12.0, 12.08], [12.15, 12.23], [12.65, 12.73], [13.0, 13.08]]  # onde de choc, appui trop tôt, ultra raté
	var down := false
	for pr in presses:
		if t >= pr[0] and t < pr[1]:
			down = true
	player.in_nitro = down
	var events := [[0.8, "fill", 100.0], [1.2, "shot", "1_jauge_pleine"], [1.95, "shot", "2_onde_zone_ultra"],
		[2.3, "shot", "3_onde_dans_zone"], [2.75, "shot", "4_ultra"], [6.5, "fill", 70.0],
		[7.4, "shot", "5_zone_parfait"], [7.75, "shot", "6_dans_zone_parfait"], [8.1, "shot", "7_parfait"],
		[11.5, "fill", 100.0], [12.5, "shot", "8_onde"], [16.0, "end", 0]]
	for i in events.size():
		var e: Array = events[i]
		if t < e[0] or has_meta("nt_%d" % i):
			continue
		set_meta("nt_%d" % i, true)
		match e[1]:
			"fill":
				# repart d'une jauge au repos pour l'étape suivante
				print("nitrotest remise à zéro (niveau %d avant)" % player.nitro_level)
				player.nitro_level = Racer.NITRO_OFF
				player._nitro_fx()
				player.nitro = e[2]
			"shot":
				print("nitrotest capture %s : niveau=%d nitro=%.1f t_nitro=%.2f zone_parfait=%s zone_ultra=%s" % [
					e[2], player.nitro_level, player.nitro, player.nitro_time, player.perfect_zone(), player.ultra_zone()])
				if String(Game.autotest["nitrotest"]) != "1":
					Game._shot("%s_%s.png" % [Game.autotest["nitrotest"], e[2]])
			"end":
				print("nitrotest bilan : parfaits=%d ondes=%d ultras=%d épaves=%d" % [player.perfect_nitros, player.shockwaves, player.ultra_nitros, player.wrecks])
	if player.nitro_level != _nt_level:
		print("nitrotest t=%.2f niveau %d -> %d nitro=%.1f ultra_raté=%s" % [t, _nt_level, player.nitro_level, player.nitro, player.ultra_lost])
		_nt_level = player.nitro_level


func _update_order() -> void:
	order = racers.duplicate()
	order.sort_custom(func(a, b):
		if a.finished and b.finished:
			return a.finish_time < b.finish_time
		if a.finished != b.finished:
			return a.finished
		return a.s > b.s)
	for i in order.size():
		order[i].race_pos = i + 1


# ---------------------------------------------------------------------------
# Collisions
# ---------------------------------------------------------------------------
func _collisions() -> void:
	for i in racers.size():
		for j in range(i + 1, racers.size()):
			_pair(racers[i], racers[j])
	var cars := traffic.active_cars()
	for r in racers:
		if r.wrecked:
			continue
		for t in cars:
			_vs_traffic(r, t)


func _pair(a: Racer, b: Racer) -> void:
	if a.wrecked or b.wrecked or a.ghost > 0.0 or b.ghost > 0.0:
		return
	var ds := b.s - a.s
	var dx := b.x - a.x
	if abs(ds) > Racer.CAR_LEN or abs(dx) > Racer.CAR_HALF_W * 2.0 or abs(a.h - b.h) > 1.3:
		return
	# ultra nitro : tout contact élimine l'adversaire
	if a.nitro_level == Racer.NITRO_ULTRA and b.nitro_level != Racer.NITRO_ULTRA:
		_takedown(a, b)
		return
	if b.nitro_level == Racer.NITRO_ULTRA and a.nitro_level != Racer.NITRO_ULTRA:
		_takedown(b, a)
		return
	var lat_ov := Racer.CAR_HALF_W * 2.0 - absf(dx)
	var lon_ov := Racer.CAR_LEN - absf(ds)
	if lat_ov < lon_ov * 0.55:
		# contact latéral
		var dir: float = sign(dx) if dx != 0.0 else 1.0
		var rel := (a.vx - b.vx) * dir
		a.x -= dir * lat_ov * 0.5
		b.x += dir * lat_ov * 0.5
		if rel > 5.0 and (a.v > b.v * 0.85 or a.nitro_level >= Racer.NITRO_PERFECT):
			_takedown(a, b)
		elif rel < -5.0 and (b.v > a.v * 0.85 or b.nitro_level >= Racer.NITRO_PERFECT):
			_takedown(b, a)
		else:
			var avx := a.vx
			a.vx = -dir * 3.0 + b.vx * 0.3
			b.vx = dir * 3.0 + avx * 0.3
			if a == player or b == player:
				Audio.play("land", -8.0, 1.6)
				cam.add_shake(0.3)
	else:
		var front: Racer = b if ds > 0.0 else a
		var back: Racer = a if ds > 0.0 else b
		var closing := back.v - front.v
		if back.nitro_level >= Racer.NITRO_SHOCK or closing > 11.0:
			_takedown(back, front)
		else:
			back.v = max(0.0, front.v - 1.5)
			front.v += max(closing, 0.0) * 0.3
			back.s = front.s - Racer.CAR_LEN
			if back == player or front == player:
				cam.add_shake(0.25)


func _takedown(attacker: Racer, victim: Racer) -> void:
	if victim.wrecked or victim.ghost > 0.0 or victim.finished:
		return
	victim.wreck("takedown")
	attacker.takedowns += 1
	attacker.nitro = min(100.0, attacker.nitro + 35.0)
	if attacker == player:
		hud.push_message("TAKEDOWN", "+NITRO", UIKit.MAGENTA)
		Audio.play("takedown", -1.0)
		cam.add_shake(0.6)
	elif victim == player:
		hud.push_message("ÉLIMINÉ PAR", attacker.display_name.to_upper(), UIKit.RED)


func _vs_traffic(r: Racer, t) -> void:
	if t.knocked:
		return
	var ds: float = t.s - r.s
	var dx: float = t.x - r.x
	var len_sum: float = Racer.CAR_LEN * 0.5 + t.half_len
	var w_sum: float = Racer.CAR_HALF_W + t.half_w
	# ultra nitro : une aura turquoise éjecte aussi le trafic tout proche
	var aura := ULTRA_AURA if r.nitro_level == Racer.NITRO_ULTRA else 0.0
	if abs(ds) < len_sum + aura and r.h < t.height:
		if abs(dx) < w_sum + aura:
			if r.nitro_level >= Racer.NITRO_SHOCK:
				traffic.knock(t, sign(dx) if dx != 0.0 else 1.0, r.v)
				if r == player:
					var ultra := r.nitro_level == Racer.NITRO_ULTRA
					hud.push_message("TRAFIC ÉJECTÉ", "+NITRO", UIKit.TURQUOISE if ultra else UIKit.VIOLET)
					Audio.play("crash", -6.0, 1.3)
				# l'ultra éjecte beaucoup de voitures : il rapporte moins par voiture
				r.nitro = minf(100.0, r.nitro + (3.0 if r.nitro_level == Racer.NITRO_ULTRA else 6.0))
				return
			if r.ghost > 0.0:
				return
			var lat_ov: float = w_sum - abs(dx)
			var lon_ov: float = len_sum - abs(ds)
			if ds > 0.0 and lon_ov < lat_ov * 1.6 and (r.v - t.v) > 6.0:
				r.wreck("traffic")
				traffic.knock(t, sign(dx) if dx != 0.0 else 1.0, r.v * 0.6)
			else:
				var side: float = sign(dx) if dx != 0.0 else 1.0
				r.x -= side * lat_ov
				r.vx = -side * 4.0
				r.v *= 0.97
				t.x += side * 0.4
				if r == player:
					Audio.play("land", -8.0, 1.8)
					cam.add_shake(0.35)
		elif r == player and abs(dx) < w_sum + 0.75 and abs(ds) < 1.5 and r.v - t.v > 15.0:
			var id: int = t.get_instance_id()
			if not r.near_miss_ids.has(id) or clock - float(r.near_miss_ids[id]) > 3.0:
				r.near_miss_ids[id] = clock
				r.near_misses += 1
				r.nitro = min(100.0, r.nitro + 6.0)
				hud.push_message("FRÔLEMENT", "+NITRO", UIKit.LIME)
				Audio.play("whoosh", -6.0)


const ULTRA_AURA := 1.5


## Ultra nitro : explosion turquoise au déclenchement, éjecte le trafic et les rivaux proches.
func _ultra_blast(r: Racer) -> void:
	var knocked := 0
	for t in traffic.active_cars():
		if t.knocked:
			continue
		var ds: float = t.s - r.s
		var dx: float = t.x - r.x
		if ds > -6.0 and ds < 30.0 and absf(dx) < 7.5 and r.h < t.height + 1.0:
			traffic.knock(t, sign(dx) if dx != 0.0 else 1.0, r.v)
			knocked += 1
	for o in racers:
		if o == r or o.wrecked or o.ghost > 0.0 or o.finished:
			continue
		var ds2: float = o.s - r.s
		if ds2 > -5.0 and ds2 < 16.0 and absf(o.x - r.x) < 4.0 and absf(o.h - r.h) < 2.0:
			_takedown(r, o)
	if knocked > 0:
		r.nitro = minf(100.0, r.nitro + 3.0 * knocked)
		if r == player:
			hud.push_message("TRAFIC ÉJECTÉ x%d" % knocked, "+NITRO", UIKit.TURQUOISE)
			Audio.play("crash", -5.0, 1.2)


func _on_stunt(r: Racer, kind: String, text: String, gain: float) -> void:
	if kind == "ultra":
		_ultra_blast(r)
	if r != player:
		return
	match kind:
		"wreck":
			hud.show_center("ÉPAVE", 1.6, "", UIKit.RED)
			Audio.play("crash")
			cam.set_state("wreck")
			cam.add_shake(1.0)
			_slowmo = 0.9
			get_tree().create_timer(2.0, false).timeout.connect(func():
				if state == "racing" or state == "finished":
					cam.set_state("race"))
		"barrel":
			hud.push_message(text, "+NITRO", UIKit.MAGENTA)
			Audio.play("reward", -6.0)
		"jump":
			hud.push_message(text, "+NITRO", UIKit.YELLOW)
		"spin":
			hud.push_message(text, "+NITRO", UIKit.CYAN)
		"perfect":
			hud.push_message(text, "", UIKit.SKY)
		"sequence":
			hud.push_message(text, "", UIKit.SKY)
		"shockwave":
			# les premières fois, on rappelle comment déclencher l'ultra nitro
			hud.push_message(text, "ZONE TURQUOISE = ULTRA" if r.shockwaves <= 2 else "", UIKit.VIOLET)
			hud.flash(UIKit.VIOLET, 0.22, 0.4)
			cam.add_shake(0.8)
		"ultra":
			hud.show_center(text, 1.1, "", UIKit.TURQUOISE)
			hud.flash(UIKit.TURQUOISE, 0.45, 0.6)
			cam.add_shake(1.2)
		"drift":
			hud.push_message(text, "+NITRO", UIKit.YELLOW)


func _on_player_finished() -> void:
	state = "finished"
	state_t = 0.0
	player.autopilot = true
	cam.set_state("finish")
	var pos := player.race_pos
	var txt := "FINISH"
	if mode != "time_attack":
		txt = "%d%s" % [pos, "ER" if pos == 1 else "E"]
	hud.show_center(txt, 3.0, "ARRIVÉE  " + UIKit.fmt_time(clock), UIKit.YELLOW if pos == 1 else UIKit.WHITE)
	Audio.play("reward")


func _show_results() -> void:
	state = "results"
	Audio.engine_stop()
	# temps estimés pour les concurrents non arrivés
	for r in racers:
		if not r.finished:
			var remaining: float = max(0.0, track.finish_s - r.s)
			r.finish_time = clock + remaining / max(r.stats["top_speed"] * 0.85, 10.0)
	var final := racers.duplicate()
	final.sort_custom(func(a, b): return a.finish_time < b.finish_time)
	var pos := final.find(player) + 1
	var obj: Dictionary = req.get("objective", {"type": "position", "value": 3})
	var ok := false
	match obj.get("type", "position"):
		"position":
			ok = pos <= int(obj.get("value", 3))
		"barrel":
			ok = player.barrel_rolls >= int(obj.get("value", 1))
		"takedown":
			ok = player.takedowns >= int(obj.get("value", 1))
		"time":
			ok = clock <= float(obj.get("value", target_time))
		"nowreck":
			ok = player.wrecks == 0
	var table := []
	for i in final.size():
		var r: Racer = final[i]
		table.append([i + 1, r.display_name, Game.car_display_name(r.car_id), r == player, UIKit.fmt_time(r.finish_time)])
	var res := {
		"finished": true,
		"position": pos,
		"time": player.finish_time if player.finished else clock,
		"objective_ok": ok,
		"takedowns": player.takedowns,
		"barrel_rolls": player.barrel_rolls,
		"jumps": player.jumps,
		"wrecks": player.wrecks,
		"perfect_nitros": player.perfect_nitros,
		"ultra_nitros": player.ultra_nitros,
		"near_misses": player.near_misses,
	}
	_rewards = Game.apply_race_result(res)
	var data := res.duplicate()
	data["mode"] = mode
	data["objective_text"] = Game.objective_text(obj) if obj.get("type") != "time" else "TERMINE EN MOINS DE " + UIKit.fmt_time(float(obj.get("value", target_time)))
	data["rewards"] = _rewards
	data["table"] = table
	hud.show_results(data)
