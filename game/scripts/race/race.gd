extends Node3D
## Scène de course : construit le circuit, gère les concurrents, le trafic, les règles et l'audio.

const AI_NAMES := ["NeoDrift", "Kaïto_R", "LunaV8", "Mx_Turbo", "Zéphyr", "Raptor77", "NovaGT", "Ghost_RS",
	"Valkyrie", "Blaze", "Orion", "PixelRush", "Sora_Z", "Titan", "Vortex", "Mirage", "Shadow", "Inferno"]

var cfg: Dictionary
var ev: Dictionary
var mode := "classic"
var quality := 1
var track: Track
var builder: TrackBuilder
var racers: Array = []
var player: Racer
var traffic: TrafficManager
var cam: ChaseCam
var hud: RaceHUD
var controls: TouchControls
var world: Node3D
var state := "intro"
var state_t := 0.0
var race_time := 0.0
var touchdrive := false
var player_ai: AIDriver
var target_time := 0.0
var elim_interval := 14.0
var elim_timer := 14.0
var _beeps := 0
var _start_press_t := -10.0
var _paused := false
var _results_shown := false
var _finish_order: Array = []
var rng := RandomNumberGenerator.new()

var snd_engine: AudioStreamPlayer
var snd_engine2: AudioStreamPlayer
var snd_wind: AudioStreamPlayer
var snd_nitro: AudioStreamPlayer
var snd_screech: AudioStreamPlayer
var snd_scrape: AudioStreamPlayer
var _gear := 1


func _ready() -> void:
	cfg = Game.race_config
	if cfg.is_empty():
		cfg = {"event": CareerDB.get_event("c1s1e1"), "car": Game.data.favorite, "touchdrive": false}
	ev = cfg.event
	mode = ev.get("mode", "classic")
	quality = int(Game.setting("quality"))
	touchdrive = bool(cfg.get("touchdrive", false))
	rng.randomize()
	var tdef := TracksDB.get_track(ev.track)
	var env: Dictionary = TracksDB.ENVS[tdef.env]
	MatLib.night = bool(env.night)
	MatLib.quality = quality
	MatLib.clear()
	world = Node3D.new()
	world.name = "World"
	add_child(world)
	_setup_environment(env)
	track = Track.new()
	track.build(tdef)
	builder = TrackBuilder.new()
	builder.build(track, world, quality)
	traffic = TrafficManager.new()
	traffic.name = "Traffic"
	world.add_child(traffic)
	var dens: float = tdef.traffic
	if mode == "time_attack":
		dens *= 0.8
	traffic.setup(track, dens, bool(env.night), quality)
	_spawn_racers()
	_update_places()
	cam = ChaseCam.new()
	world.add_child(cam)
	cam.target = player
	cam.make_current()
	cam.set_mode("intro")
	hud = RaceHUD.new()
	add_child(hud)
	hud.setup(self)
	hud.set_touchdrive(touchdrive)
	hud.pause_requested.connect(_pause)
	hud.resume_requested.connect(_resume)
	hud.restart_requested.connect(_restart)
	hud.quit_requested.connect(_quit)
	hud.next_requested.connect(_next)
	controls = TouchControls.new()
	add_child(controls)
	var cmode: String = Game.setting("controls")
	controls.setup(cmode, touchdrive)
	controls.swipe.connect(_on_swipe)
	if not (OS.has_feature("mobile") or DisplayServer.is_touchscreen_available() or cfg.get("show_touch", false)):
		controls.visible = false
	_setup_audio()
	if mode == "time_attack":
		var ref: Dictionary = CarsDB.cars_of_class(ev.cls)[0]
		# distance réelle grille -> ligne d'arrivée (sans la zone de dégagement)
		target_time = (builder.finish_s - player.s) / (float(ref.top[0]) / 3.6 * 0.80)
		for o in ev.objectives:
			if o.type == "time":
				o.value = target_time
	for r in racers:
		r.sync_visual(0.016)
	hud.big(TracksDB.ENVS[tdef.env].name.to_upper(), tdef.name + "  •  " + CareerDB.MODES.get(mode, ""), UI.WHITE, 2.4)
	Sfx.stop_music(1.0)


# ---------------------------------------------------------------------------
# Mise en place
# ---------------------------------------------------------------------------

func _setup_environment(env: Dictionary) -> void:
	var we := WorldEnvironment.new()
	var e := Environment.new()
	var sky := Sky.new()
	var pm := PanoramaSkyMaterial.new()
	pm.panorama = load(env.sky)
	pm.energy_multiplier = 1.0 if not env.night else 0.8
	sky.sky_material = pm
	sky.radiance_size = Sky.RADIANCE_SIZE_128
	sky.process_mode = Sky.PROCESS_MODE_QUALITY
	e.background_mode = Environment.BG_SKY
	e.sky = sky
	e.ambient_light_source = Environment.AMBIENT_SOURCE_SKY
	e.ambient_light_energy = float(env.ambient)
	if env.night:
		e.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
		e.ambient_light_color = Color(0.42, 0.36, 0.62)
	e.reflected_light_source = Environment.REFLECTION_SOURCE_SKY
	e.tonemap_mode = Environment.TONE_MAPPER_FILMIC
	e.tonemap_exposure = 1.0
	e.tonemap_white = 6.0
	e.glow_enabled = quality >= 1
	e.glow_intensity = 0.8 if not env.night else 0.9
	e.glow_strength = 1.0
	e.glow_bloom = 0.05 if not env.night else 0.15
	e.glow_hdr_threshold = 1.0 if not env.night else 0.95
	e.glow_blend_mode = Environment.GLOW_BLEND_MODE_SCREEN
	e.fog_enabled = true
	e.fog_light_color = env.fog
	e.fog_density = float(env.fog_density)
	e.fog_sky_affect = 0.25
	e.fog_aerial_perspective = 0.4
	e.adjustment_enabled = true
	e.adjustment_saturation = 1.12
	e.adjustment_contrast = 1.06
	we.environment = e
	add_child(we)
	var sun := DirectionalLight3D.new()
	var sd: Vector3 = env.sun_dir
	sun.look_at_from_position(Vector3.ZERO, -sd.normalized(), Vector3.UP if absf(sd.normalized().y) < 0.99 else Vector3.RIGHT)
	sun.light_color = env.sun_color
	sun.light_energy = float(env.sun_energy)
	sun.shadow_enabled = quality >= 1
	sun.directional_shadow_mode = DirectionalLight3D.SHADOW_PARALLEL_2_SPLITS
	sun.directional_shadow_max_distance = 70.0 if quality == 1 else 110.0
	sun.shadow_blur = 1.0
	sun.light_angular_distance = 0.5
	add_child(sun)
	if quality == 0:
		get_viewport().scaling_3d_scale = 0.75
		get_viewport().msaa_3d = Viewport.MSAA_DISABLED
	elif quality == 1:
		get_viewport().scaling_3d_scale = 0.9
		get_viewport().msaa_3d = Viewport.MSAA_DISABLED
	else:
		get_viewport().scaling_3d_scale = 1.0
		get_viewport().msaa_3d = Viewport.MSAA_2X


func _spawn_racers() -> void:
	var car_id: String = cfg.car
	var pcar := CarsDB.get_car(car_id)
	var n_opp := int(ev.get("opponents", 5))
	if mode == "time_attack":
		n_opp = 0
	var total := n_opp + 1
	var grid: Array = []
	var cols := [-2.0, 2.0]
	if track.two_way:
		cols = [track.lane_center(track.lanes - 2), track.lane_center(track.lanes - 1)]
	for k in total:
		var row := k / 2
		grid.append(Vector2(30.0 + (total / 2 - row) * 10.0, cols[k % 2]))
	# joueur : dernière place de la grille
	player = _make_racer(0, Game.data.name, pcar, Game.car_level(car_id), Game.car_color(car_id), true)
	var pg: Vector2 = grid[total - 1]
	player.s = pg.x
	player.x = pg.y
	if touchdrive:
		player_ai = AIDriver.new(0.85, 0.0, 99)
		player_ai.touchdrive = true
		player_ai.auto_nitro = false
		player_ai.lane_pref = pg.y
	racers.append(player)
	var pool := CarsDB.cars_of_class(ev.cls)
	var names := AI_NAMES.duplicate()
	names.shuffle()
	var diff := clampf(float(int(ev.rank) - player.rank) / 300.0, -1.0, 1.0)
	for k in n_opp:
		var car: Dictionary = pool[rng.randi_range(0, pool.size() - 1)]
		var target_rank := int(ev.rank) + rng.randi_range(-40, 80)
		var lvl := 0
		var best := 1e9
		for L in CarsDB.max_level() + 1:
			var d := absf(CarsDB.rank(car, L) - target_rank)
			if d < best:
				best = d
				lvl = L
		var col := Color(CarsDB.PAINTS[rng.randi_range(0, CarsDB.PAINTS.size() - 1)])
		var r := _make_racer(k + 1, names[k % names.size()], car, lvl, col, false)
		var g: Vector2 = grid[k]
		r.s = g.x
		r.x = g.y
		var skill := clampf(0.62 + 0.22 * diff + rng.randf_range(-0.12, 0.12), 0.25, 0.97)
		r.ai = AIDriver.new(skill, rng.randf_range(0.2, 0.8) + (0.3 if mode == "takedown" else 0.0), rng.randi())
		r.speed_factor = 0.93 + 0.06 * skill
		racers.append(r)
	for r in racers:
		r.yw = track.road_y(r.s)


func _make_racer(id: int, nm: String, car: Dictionary, level: int, col: Color, is_player: bool) -> Racer:
	var r := Racer.new()
	r.id = id
	r.display_name = nm
	r.is_player = is_player
	r.track = track
	r.setup_stats(car, level)
	var m := CarModel.new()
	m.setup(car.id, col, {"headlight": is_player and MatLib.night, "shadows": quality >= 1,
		"blob": quality == 0 or not is_player, "effects": true})
	world.add_child(m)
	r.model = m
	r.half_len = m.length * 0.5
	r.half_w = minf(m.width * 0.5, 1.02)
	if not is_player:
		var a := AudioStreamPlayer3D.new()
		a.stream = Sfx.looped("engine_v8" if car.engine == "v8" else "engine_4cyl")
		a.bus = "SFX"
		a.unit_size = 6.0
		a.max_distance = 90.0
		a.volume_db = -6.0
		a.autoplay = true
		m.add_child(a)
		a.name = "Engine"
	return r


func _setup_audio() -> void:
	var etype: String = CarsDB.get_car(player.car_id).engine
	snd_engine = _loop("engine_v8" if etype == "v8" else "engine_4cyl", -4.0)
	snd_engine2 = _loop("engine_v8" if etype == "v8" else "engine_4cyl", -60.0)
	snd_wind = _loop("wind", -60.0)
	snd_nitro = _loop("nitro_loop", -60.0)
	snd_screech = _loop("tire_screech", -60.0)
	snd_scrape = _loop("scrape", -60.0)


func _loop(name: String, vol: float) -> AudioStreamPlayer:
	var p := AudioStreamPlayer.new()
	p.stream = Sfx.looped(name)
	p.bus = "SFX"
	p.volume_db = vol
	add_child(p)
	p.play()
	return p


# ---------------------------------------------------------------------------
# Boucle principale
# ---------------------------------------------------------------------------

func _physics_process(dt: float) -> void:
	if _paused:
		return
	state_t += dt
	match state:
		"intro":
			if state_t > 2.8 or Input.is_action_just_pressed("nitro") and state_t > 0.6:
				state = "countdown"
				state_t = 0.0
				cam.set_mode("chase")
				cam.snap()
		"countdown":
			var n := 3 - int(state_t)
			if _beeps < 3 and state_t >= _beeps:
				hud.big(str(3 - _beeps), "", UI.WHITE, 0.8)
				Sfx.play("beep_count", -2.0)
				_beeps += 1
			if Input.is_action_just_pressed("nitro"):
				_start_press_t = state_t
			if state_t >= 3.0:
				state = "race"
				state_t = 0.0
				hud.big("GO !", "", UI.YELLOW, 0.8)
				Sfx.play("beep_go", 0.0)
				Sfx.play_music("music_race1" if rng.randf() < 0.5 else "music_race2", 0.5)
				if _start_press_t > 2.65:
					player.gauge = minf(1.0, player.gauge + 0.3)
					player.v = player.vmax * 0.35
					player.nitro_press = true
					hud.popup("DÉPART PARFAIT", "", UI.LIME)
				for r in racers:
					if not r.is_player:
						r.v = r.vmax * rng.randf_range(0.15, 0.3)
			if n < 0:
				pass
		"race", "finish":
			race_time += dt
			_player_input()
			for r in racers:
				if r.ai != null and not r.finished:
					r.ai.drive(r, self, dt)
					_rubber_band(r)
				elif r.finished and r != player:
					_coast_input(r)
				if r == player and r.finished:
					_coast_input(r)
				r.update(dt, race_time)
				# réapparition : choisir une voie libre AVANT les collisions de cette frame
				for e in r.events:
					if e[0] == "respawn":
						_safe_respawn(r)
						if r.is_player:
							for c in traffic.cars:
								c.passed.erase(0)
			_collide_racers()
			_collide_traffic(dt)
			traffic.update(dt, player.s)
			_process_events()
			_update_places()
			_rules(dt)
			if state == "finish" and state_t > 3.2 and not _results_shown:
				_show_results()
	for r in racers:
		r.sync_visual(dt)
	cam.update_cam(dt)
	var shown_t := player.finish_time if player.finished else race_time
	hud.update_hud(dt, player, racers.size(), shown_t, builder.finish_s)
	if not _results_shown:
		hud.update_markers(cam, racers, player)
	_update_audio(dt)


func _player_input() -> void:
	var p := player
	if p.finished:
		return
	var steer := Input.get_action_strength("steer_right") - Input.get_action_strength("steer_left")
	if controls and controls.mode == "tilt":
		steer = clampf(steer + controls.steer_value(), -1.0, 1.0)
	p.drift_held = Input.is_action_pressed("drift")
	if Input.is_action_just_pressed("drift"):
		p.drift_press = true
	if Input.is_action_just_pressed("nitro"):
		p.nitro_press = true
	if touchdrive and player_ai != null:
		var keep_nitro := p.nitro_press
		var keep_dp := p.drift_press
		player_ai.drive(p, self, get_physics_process_delta_time())
		p.nitro_press = keep_nitro
		p.drift_press = keep_dp or p.drift_press
		if absf(steer) > 0.2:
			p.steer_in = steer
		if Input.is_action_pressed("drift") and absf(p.steer_in) < 0.3:
			p.drift_held = true
	else:
		p.steer_in = steer


func _coast_input(r: Racer) -> void:
	r.steer_in = clampf((0.0 - r.psi) * 2.0 + (r.x - r.x) * 0.0, -1.0, 1.0)
	r.drift_held = false
	r.nitro_press = false
	if r.ai == null:
		r.ai = AIDriver.new(0.6, 0.0, 7)
		r.ai.auto_nitro = false
	r.ai.drive(r, self, get_physics_process_delta_time())
	r.speed_factor = 0.5


func _rubber_band(r: Racer) -> void:
	var d := r.s - player.s
	var base := 0.93 + 0.06 * r.ai.skill
	var f := 1.0
	if d > 80.0:
		f = lerpf(1.0, 0.9, clampf((d - 80.0) / 250.0, 0.0, 1.0))
	elif d < -60.0:
		f = lerpf(1.0, 1.08, clampf((-d - 60.0) / 250.0, 0.0, 1.0))
	if player.finished:
		f = 1.0
	r.speed_factor = base * f


## Obstacles proches pour l'IA : trafic + autres concurrents
func obstacles_near(r: Racer, dist: float) -> Array:
	var out := []
	for c in traffic.active_cars():
		var ds: float = c.s - r.s
		if ds > -5.0 and ds < dist:
			out.append({"s": c.s, "x": c.x, "v": c.v, "half_w": c.half_w, "traffic": true, "is_player": false})
	for o in racers:
		if o == r or o.eliminated or o.wrecked:
			continue
		var ds2: float = o.s - r.s
		if ds2 > -5.0 and ds2 < dist:
			out.append({"s": o.s, "x": o.x, "v": o.v, "half_w": o.half_w, "traffic": false, "is_player": o.is_player})
	return out


# ---------------------------------------------------------------------------
# Collisions
# ---------------------------------------------------------------------------

func _collide_racers() -> void:
	for i in racers.size():
		var a: Racer = racers[i]
		if a.wrecked or a.eliminated:
			continue
		for j in range(i + 1, racers.size()):
			var b: Racer = racers[j]
			if b.wrecked or b.eliminated:
				continue
			var ds := b.s - a.s
			var ls := a.half_len + b.half_len
			if absf(ds) >= ls:
				continue
			var dx := b.x - a.x
			var lx := a.half_w + b.half_w
			if absf(dx) >= lx:
				continue
			if absf(a.yw - b.yw) > 1.3:
				continue
			var ox := lx - absf(dx)
			var os := ls - absf(ds)
			if ox < os * 0.6:
				# contact latéral
				var sg := signf(dx) if dx != 0.0 else 1.0
				var va := a.v * sin(a.psi)
				var vb := b.v * sin(b.psi)
				var rel := (va - vb) * sg
				a.x -= sg * ox * 0.5
				b.x += sg * ox * 0.5
				var attacker: Racer = null
				var victim: Racer = null
				if rel > 5.0:
					attacker = a
					victim = b
				elif rel < -5.0:
					attacker = b
					victim = a
				if attacker != null and _takedown_ok(attacker, victim, absf(rel)):
					victim.wreck("takedown", attacker)
				else:
					a.psi -= sg * 0.06
					b.psi += sg * 0.06
					a.v *= 0.995
					b.v *= 0.995
					if a.is_player or b.is_player:
						_bump_fx(0.15)
			else:
				# contact avant/arrière
				var back := a if ds > 0.0 else b
				var front := b if ds > 0.0 else a
				var dv := back.v - front.v
				back.s = front.s - ls
				if dv > 7.0 and back.nitro_level > 0 and _takedown_ok(back, front, dv):
					front.wreck("takedown", back)
					back.v *= 0.96
				elif dv > 0.0:
					front.v += dv * 0.4
					back.v -= dv * 0.6
					if back.is_player or front.is_player:
						_bump_fx(0.2)


func _takedown_ok(att: Racer, vic: Racer, rel: float) -> bool:
	if vic.invuln > 0.0 or vic.finished:
		return false
	if vic.is_player:
		# les IA réussissent moins souvent leurs takedowns sur le joueur
		return rel > 8.0 and rng.randf() < (0.35 + att.ai.aggression * 0.3 if att.ai else 0.3)
	if att.is_player:
		return true
	return rng.randf() < 0.35


func _collide_traffic(dt: float) -> void:
	var cars := traffic.active_cars()
	for r in racers:
		if r.wrecked or r.eliminated:
			continue
		if absf(r.s - player.s) > 450.0:
			continue
		var air_h: float = r.yw - track.road_y(r.s)
		for c in cars:
			if c.knocked:
				continue
			var ds: float = c.s - r.s
			var ls: float = r.half_len + c.half_len
			var dx: float = c.x - r.x
			var lx: float = r.half_w + c.half_w
			# frôlement (joueur uniquement)
			if r.is_player:
				var prev: float = c.passed.get(0, ds)
				if prev > 0.0 and ds <= 0.0 and absf(dx) - lx < 1.1 and absf(dx) >= lx and r.v > 25.0 and not r.airborne:
					r.stats.near_miss += 1
					r.gauge += 0.06
					hud.popup("FRÔLEMENT", "", UI.LIME)
					Sfx.play("whoosh", -6.0)
				c.passed[0] = ds
				# onde de choc : bulle autour du joueur
				if r.nitro_level == 3 and absf(ds) < 14.0 and absf(dx) < 6.0:
					traffic.knock(c, _racer_vel(r), 1.3)
					r.gauge += 0.04
					continue
			if absf(ds) >= ls or absf(dx) >= lx:
				continue
			if air_h > 1.3:
				continue
			var ox := lx - absf(dx)
			var os := ls - absf(ds)
			if ox < os * 0.5:
				# accrochage latéral
				r.x -= signf(dx) * ox
				r.v *= 0.97
				c.x += signf(dx) * 0.3
				if r.is_player:
					_bump_fx(0.25)
					Sfx.play("hit", -8.0)
				continue
			if ds < 0.0:
				continue
			var rel: float = r.v - c.v
			if r.nitro_level == 3:
				traffic.knock(c, _racer_vel(r), 1.4)
				continue
			if rel > 33.0 and (r.nitro_level == 0 or c.v < 0.0):
				r.wreck("traffic")
				traffic.knock(c, _racer_vel(r), 0.8)
			else:
				traffic.knock(c, _racer_vel(r), 1.0)
				r.v -= rel * (0.12 if r.nitro_level > 0 else 0.4)
				r.gauge += 0.03
				if r.is_player:
					_bump_fx(0.45)
					Sfx.play("hit", -2.0)
					hud.popup("IMPACT", "", UI.PINK)


func _racer_vel(r: Racer) -> Vector3:
	var f := track.forward_at(r.s)
	return f * r.v


func _bump_fx(a: float) -> void:
	cam.shake(a)
	Game.vibrate(int(30 + a * 60))


# ---------------------------------------------------------------------------
# Événements, positions, règles
# ---------------------------------------------------------------------------

func _process_events() -> void:
	for r in racers:
		if r.events.is_empty():
			continue
		var evs: Array = r.events
		r.events = []
		for e in evs:
			var kind: String = e[0]
			if r.is_player:
				_player_event(kind, e[1])
			else:
				if kind == "wreck":
					pass
				elif kind == "takedown":
					if e[1] == player:
						pass


func _player_event(kind: String, val) -> void:
	match kind:
		"nitro":
			Sfx.play("nitro_start", -3.0)
			cam.shake(0.12)
		"perfect":
			Sfx.play("nitro_start", 0.0, 1.15)
			Sfx.play("stunt", -6.0)
			hud.popup("NITRO PARFAIT", "", Color("#29d4ff"))
			if int(val) >= 2:
				hud.popup("SÉQUENCE PARFAITE", "x%d" % int(val), UI.MAGENTA)
			hud.flash(0.4)
		"shockwave":
			Sfx.play("shockwave", 0.0)
			hud.popup("ONDE DE CHOC", "", UI.MAGENTA)
			cam.shake(0.5)
			hud.flash(0.8)
			Game.vibrate(120)
		"drift":
			hud.popup("DÉRAPAGE", "%.1f S" % float(val), UI.YELLOW)
		"barrel_start":
			Sfx.play("whoosh", -2.0, 0.8)
		"barrel":
			hud.popup("TONNEAU" if int(val) < 2 else "DOUBLE TONNEAU", "", UI.MAGENTA)
			Sfx.play("stunt", -2.0)
		"spin_start":
			Sfx.play("whoosh", -2.0, 1.1)
		"spin":
			hud.popup("360°", "", UI.MAGENTA)
			Sfx.play("stunt", -2.0)
		"jump":
			hud.popup("SAUT", ("%.1f S" % float(val)).replace(".", ","), UI.YELLOW)
		"landing":
			hud.popup("ATTERRISSAGE PARFAIT", "", UI.LIME)
		"land":
			Sfx.play("land", -4.0)
			cam.shake(clampf(float(val) / 25.0, 0.05, 0.4))
		"wall":
			Sfx.play("hit", -6.0)
			cam.shake(clampf(float(val) / 30.0, 0.05, 0.35))
			Game.vibrate(25)
		"wreck":
			Sfx.play("crash", 0.0)
			hud.big("ÉPAVE !", "TAKEDOWN SUBI" if str(val) == "takedown" else "", UI.RED, 1.4)
			cam.set_mode("crash")
			cam.shake(0.8)
			hud.flash(0.9)
			Game.vibrate(250)
		"respawn":
			if state != "finish":
				cam.set_mode("chase")
				cam.snap()
		"takedown":
			Sfx.play("takedown", 0.0)
			hud.big("TAKEDOWN !", "+NITRO", UI.MAGENTA, 1.0)
			cam.shake(0.45)
			Game.vibrate(90)


func _safe_respawn(r: Racer) -> void:
	# choisit une voie libre de trafic
	var best_x := r.x
	var best_cost := 1e9
	for k in track.lanes:
		if track.is_oncoming_lane(k):
			continue
		var x := track.lane_center(k)
		var cost := absf(x - r.x) * 0.1
		for c in traffic.active_cars():
			if absf(c.x - x) < 2.4 and c.s - r.s > -10.0 and c.s - r.s < 45.0:
				cost += 50.0
		for rp in track.ramps_between(r.s - 5.0, r.s + 20.0):
			if absf(rp.x - x) < 3.0:
				cost += 30.0
		if cost < best_cost:
			best_cost = cost
			best_x = x
	r.x = best_x


func _update_places() -> void:
	var order := racers.duplicate()
	order.sort_custom(func(a: Racer, b: Racer) -> bool:
		if a.eliminated != b.eliminated:
			return b.eliminated
		if a.finished and b.finished:
			return a.finish_time < b.finish_time
		if a.finished != b.finished:
			return a.finished
		return a.s > b.s)
	for i in order.size():
		order[i].place = i + 1


func _rules(dt: float) -> void:
	# arrivée
	for r in racers:
		if not r.finished and not r.eliminated and r.s >= builder.finish_s:
			r.finished = true
			r.finish_time = race_time
			_finish_order.append(r)
			if r == player:
				_on_player_finish()
	# élimination
	if mode == "elimination" and state == "race":
		if race_time > 6.0:
			elim_timer -= dt
			var alive := 0
			for r in racers:
				if not r.eliminated:
					alive += 1
			hud.set_mode_text("ÉLIMINATION DANS %d" % int(ceil(elim_timer)), UI.RED if elim_timer < 4.0 else UI.WHITE)
			if elim_timer <= 0.0 and alive > 1:
				elim_timer = elim_interval
				var last: Racer = null
				for r in racers:
					if not r.eliminated and not r.finished and (last == null or r.place > last.place):
						last = r
				if last != null:
					last.eliminated = true
					last.model.visible = false
					var eng := last.model.get_node_or_null("Engine") as AudioStreamPlayer3D
					if eng:
						eng.stop()
					if last == player:
						hud.big("ÉLIMINÉ !", "", UI.RED, 2.0)
						Sfx.play("crash", -2.0)
						_on_player_finish(true)
					else:
						hud.popup("ÉLIMINÉ", last.display_name, UI.RED)
						Sfx.play("takedown", -6.0)
				alive -= 1
				if alive <= 1 and not player.eliminated:
					hud.big("DERNIER SURVIVANT !", "", UI.YELLOW, 1.6)
	elif mode == "time_attack" and state == "race":
		var left := target_time - race_time
		hud.set_mode_text("OBJECTIF  " + CareerDB.format_time(maxf(left, 0.0)), UI.WHITE if left > 5.0 else UI.RED)
	elif mode == "takedown" and state == "race":
		var goal := 0
		for o in ev.objectives:
			if o.type == "takedowns":
				goal = maxi(goal, int(o.value))
		hud.set_mode_text("TAKEDOWNS  %d / %d" % [player.stats.takedowns, goal], UI.MAGENTA)


func _on_player_finish(eliminated: bool = false) -> void:
	if state == "finish":
		return
	state = "finish"
	state_t = 0.0
	cam.set_mode("finish")
	controls.release_all()
	controls.visible = false
	if not eliminated:
		var p := player.place
		var txt := "VICTOIRE !" if p == 1 else RaceHUD._ordinal(p)
		if mode == "time_attack":
			txt = "TERMINÉ !"
		hud.big(txt, CareerDB.format_time(race_time), UI.YELLOW if p == 1 else UI.WHITE, 2.5)
		Sfx.play("unlock", -2.0)


func _show_results() -> void:
	_results_shown = true
	var dnf := player.eliminated
	var pos := player.place
	if mode == "time_attack":
		pos = 1 if (not dnf and player.finish_time <= target_time) else 2
	# temps estimés des concurrents qui n'ont pas fini
	var table := []
	var order := racers.duplicate()
	order.sort_custom(func(a: Racer, b: Racer) -> bool: return a.place < b.place)
	for r in order:
		var t: float = r.finish_time
		var txt := ""
		if r.eliminated:
			txt = "ÉLIMINÉ"
		elif r.finished:
			txt = CareerDB.format_time(t)
		else:
			t = race_time + (builder.finish_s - r.s) / maxf(r.v, 20.0)
			txt = CareerDB.format_time(t)
		table.append({"place": r.place, "name": r.display_name, "car": CarsDB.get_car(r.car_id).model, "time": txt,
			"player": r.is_player})
	var done := []
	for o in ev.objectives:
		done.append(_objective_done(o, pos, dnf))
	var res := {"event": ev, "position": pos, "time": player.finish_time if not dnf else race_time,
		"stats": player.stats, "objectives_done": done, "dnf": dnf, "car": player.car_id}
	if not cfg.get("free_ride", false):
		var rewards := Game.apply_race_result(res)
		hud.show_results(res, rewards, table)
	else:
		hud.show_results(res, {"credits": 0, "xp": 0, "bp": {}}, table)


func _objective_done(o: Dictionary, pos: int, dnf: bool) -> bool:
	var st: Dictionary = player.stats
	match o.type:
		"position":
			return not dnf and pos <= int(o.value)
		"win":
			return not dnf and pos == 1
		"time":
			return not dnf and player.finish_time <= float(o.value)
		"takedowns":
			return int(st.takedowns) >= int(o.value)
		"barrel_rolls":
			return int(st.barrel_rolls) >= int(o.value)
		"jumps":
			return int(st.jumps) >= int(o.value)
		"near_miss":
			return int(st.near_miss) >= int(o.value)
		"perfect_nitro":
			return int(st.perfect_nitro) >= int(o.value)
		"no_wreck":
			return not dnf and int(st.wrecks) == 0
		"top_speed":
			return float(st.top_speed) >= float(o.value)
		"drift":
			return float(st.drift) >= float(o.value)
		"survive":
			return not dnf
	return false


# ---------------------------------------------------------------------------
# Audio
# ---------------------------------------------------------------------------

func _update_audio(dt: float) -> void:
	var p := player
	var vmax := p.vmax * 1.15
	var gears := 6
	var gspan := vmax / gears
	var g := clampi(int(p.v / gspan), 0, gears - 1)
	var frac := clampf((p.v - g * gspan) / gspan, 0.0, 1.0)
	if g != _gear and g > _gear and state == "race":
		cam.shake(0.03)
	_gear = g
	var rpm := 0.25 + frac * 0.75
	if state == "countdown":
		rpm = 0.3 + 0.25 * absf(sin(state_t * 3.0))
	var pitch := 0.55 + rpm * 0.85 + g * 0.06 + (0.08 if p.nitro_level > 0 else 0.0)
	if p.airborne:
		pitch += 0.15
	snd_engine.pitch_scale = lerpf(snd_engine.pitch_scale, pitch, 1.0 - exp(-12.0 * dt))
	snd_engine2.pitch_scale = snd_engine.pitch_scale * 2.0
	snd_engine2.volume_db = lerpf(-30.0, -12.0, rpm)
	snd_engine.volume_db = -5.0 if not p.wrecked else -20.0
	var spd := clampf(p.v / p.vmax, 0.0, 1.3)
	snd_wind.volume_db = lerpf(-40.0, -9.0, clampf(spd, 0.0, 1.0))
	snd_nitro.volume_db = lerpf(snd_nitro.volume_db, -4.0 if p.nitro_level > 0 else -60.0, 1.0 - exp(-10.0 * dt))
	snd_screech.volume_db = lerpf(snd_screech.volume_db, -6.0 if (p.drifting and not p.airborne) else -60.0, 1.0 - exp(-12.0 * dt))
	snd_scrape.volume_db = -6.0 if p.scraping > 0.0 else -60.0
	for r in racers:
		if r == player or r.model == null:
			continue
		var a := r.model.get_node_or_null("Engine") as AudioStreamPlayer3D
		if a:
			a.pitch_scale = 0.7 + clampf(r.v / r.vmax, 0.0, 1.2) * 0.9


# ---------------------------------------------------------------------------
# Pause / navigation
# ---------------------------------------------------------------------------

func _notification(what: int) -> void:
	if what == NOTIFICATION_WM_GO_BACK_REQUEST:
		# bouton Retour d'Android : pause / reprise au lieu de fermer le jeu
		if _paused:
			_resume()
		elif not _results_shown and state != "finish":
			_pause()
		return
	if what == NOTIFICATION_APPLICATION_FOCUS_OUT or what == NOTIFICATION_APPLICATION_PAUSED:
		if state == "race" and not _paused:
			_pause()


func _exit_tree() -> void:
	# la course règle l'échelle 3D / MSAA du viewport racine : on les remet pour le menu
	var vp := get_viewport()
	if vp:
		vp.scaling_3d_scale = 1.0
		vp.msaa_3d = Viewport.MSAA_2X if int(Game.setting("quality")) >= 1 else Viewport.MSAA_DISABLED


func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed("pause"):
		if _paused:
			_resume()
		elif state == "race" or state == "countdown":
			_pause()


func _pause() -> void:
	if _results_shown or state == "finish":
		return
	_paused = true
	controls.release_all()
	hud.show_pause()
	for p in [snd_engine, snd_engine2, snd_wind, snd_nitro, snd_screech, snd_scrape]:
		p.stream_paused = true
	_set_ai_engines_paused(true)


func _resume() -> void:
	_paused = false
	hud.hide_pause()
	for p in [snd_engine, snd_engine2, snd_wind, snd_nitro, snd_screech, snd_scrape]:
		p.stream_paused = false
	_set_ai_engines_paused(false)


func _set_ai_engines_paused(p: bool) -> void:
	for r in racers:
		if r.model:
			var a := r.model.get_node_or_null("Engine") as AudioStreamPlayer3D
			if a:
				a.stream_paused = p


func _restart() -> void:
	# recommencer coûte un carburant (comme lancer une course depuis le menu)
	if not cfg.get("free_ride", false) and not Game.use_fuel(str(cfg.car)):
		_quit()
		return
	Game.goto_scene("res://scenes/race.tscn")


func _quit() -> void:
	Game.menu_return = {"screen": _return_screen(), "season": ev.get("season", "")}
	Game.goto_scene("res://scenes/menu.tscn")


func _next() -> void:
	Game.menu_return = {"screen": _return_screen(), "season": ev.get("season", "")}
	Game.goto_scene("res://scenes/menu.tscn")


func _return_screen() -> String:
	if ev.has("season"):
		return "season"
	if ev.get("daily", false):
		return "daily"
	if ev.get("special", false):
		return "special"
	if ev.get("league", false):
		return "league"
	return "home"


func _on_swipe(dir: int) -> void:
	if touchdrive and player_ai != null:
		player_ai.lane_pref = clampf(player.x + dir * Track.LANE_W, -track.lanes * Track.LANE_W * 0.5 + 1.8,
			track.lanes * Track.LANE_W * 0.5 - 1.8)
		player_ai.target_x = player_ai.lane_pref
