extends Node
## État global : sauvegarde, économie, progression, paramètres, transitions.

signal currency_changed
signal garage_changed

const SAVE_PATH := "user://save.json"
const FUEL_MAX := 6
const FUEL_REGEN_SEC := 120
const PASS_XP_PER_TIER := 1000
const PASS_TIERS := 30
const LEAGUES := [["BRONZE", 0], ["ARGENT", 300], ["OR", 800], ["PLATINE", 1500], ["LÉGENDE", 2500]]

var data: Dictionary = {}
## Configuration de la course à lancer (remplie par les menus)
var race_config: Dictionary = {}
## Résultat de la dernière course (rempli par la course)
var last_result: Dictionary = {}
## Écran du menu à afficher au retour de course
var menu_return: Dictionary = {}

var _fade: ColorRect
var _fade_layer: CanvasLayer


func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	_setup_input()
	_setup_fade()
	load_game()
	apply_settings()


# ---------------------------------------------------------------------------
# Sauvegarde
# ---------------------------------------------------------------------------

func default_data() -> Dictionary:
	var d := {
		"version": 1,
		"name": "Galax",
		"credits": 65000,
		"tokens": 800,
		"xp": 0,
		"pass_claimed": 0,
		"league_points": 0,
		"cars": {},
		"career": {},
		"special": {},
		"daily": {"date": "", "tasks": [], "events_done": []},
		"stats": {"races": 0, "wins": 0, "takedowns": 0, "barrel_rolls": 0, "jumps": 0, "near_miss": 0,
			"distance_km": 0.0, "wrecks": 0, "top_speed": 0.0, "perfect_nitro": 0},
		"settings": {"music": 0.7, "sfx": 0.9, "quality": 1, "controls": "buttons", "touchdrive": false,
			"vibration": true, "camera": 0},
		"favorite": "lancer_evo",
		"last_gift": "",
	}
	for c in CarsDB.all():
		var owned: bool = c.get("free", false)
		d.cars[c.id] = {"stars": 1 if owned else 0, "bp": 6 if c.id == "lancer_evo" else 0, "level": 0,
			"fuel": FUEL_MAX, "fuel_ts": 0, "color": c.color}
	# un petit bonus de départ : plans pour la Z4 (comme dans le jeu original)
	d.cars["z4"].bp = 4
	return d


func load_game() -> void:
	data = default_data()
	if FileAccess.file_exists(SAVE_PATH):
		var f := FileAccess.open(SAVE_PATH, FileAccess.READ)
		if f:
			var parsed = JSON.parse_string(f.get_as_text())
			if parsed is Dictionary:
				_merge(data, parsed)
	_ensure_daily()


func _merge(dst: Dictionary, src: Dictionary) -> void:
	for k in src.keys():
		if dst.has(k) and dst[k] is Dictionary and src[k] is Dictionary:
			_merge(dst[k], src[k])
		else:
			dst[k] = src[k]


func save_game() -> void:
	var f := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if f:
		f.store_string(JSON.stringify(data))


func reset_save() -> void:
	data = default_data()
	_ensure_daily()
	save_game()
	currency_changed.emit()
	garage_changed.emit()


# ---------------------------------------------------------------------------
# Monnaies
# ---------------------------------------------------------------------------

func credits() -> int:
	return int(data.credits)


func tokens() -> int:
	return int(data.tokens)


func add_credits(n: int) -> void:
	data.credits = int(data.credits) + n
	currency_changed.emit()


func add_tokens(n: int) -> void:
	data.tokens = int(data.tokens) + n
	currency_changed.emit()


func spend_credits(n: int) -> bool:
	if credits() < n:
		return false
	data.credits = credits() - n
	currency_changed.emit()
	save_game()
	return true


func spend_tokens(n: int) -> bool:
	if tokens() < n:
		return false
	data.tokens = tokens() - n
	currency_changed.emit()
	save_game()
	return true


static func fmt_num(n: int) -> String:
	var s := str(absi(n))
	var out := ""
	var c := 0
	for i in range(s.length() - 1, -1, -1):
		out = s[i] + out
		c += 1
		if c % 3 == 0 and i > 0:
			out = " " + out
	return ("-" if n < 0 else "") + out


static func fmt_stat(v: float) -> String:
	return ("%.2f" % v).replace(".", ",") if v < 100.0 else ("%.1f" % v).replace(".", ",")


# ---------------------------------------------------------------------------
# Garage
# ---------------------------------------------------------------------------

func car_state(id: String) -> Dictionary:
	if not data.cars.has(id):
		var c := CarsDB.get_car(id)
		data.cars[id] = {"stars": 0, "bp": 0, "level": 0, "fuel": FUEL_MAX, "fuel_ts": 0, "color": c.color}
	return data.cars[id]


func is_owned(id: String) -> bool:
	return int(car_state(id).stars) > 0


func car_level(id: String) -> int:
	return int(car_state(id).level)


func car_rank(id: String) -> int:
	return CarsDB.rank(CarsDB.get_car(id), car_level(id))


func car_stars(id: String) -> int:
	return int(car_state(id).stars)


func max_level_for(id: String) -> int:
	return maxi(car_stars(id), 1) * CarsDB.LEVELS_PER_STAR


func can_unlock(id: String) -> bool:
	var st := car_state(id)
	if int(st.stars) > 0:
		return false
	return int(st.bp) >= CarsDB.blueprints_needed(CarsDB.get_car(id), 0)


func can_star_up(id: String) -> bool:
	var st := car_state(id)
	var s := int(st.stars)
	if s <= 0 or s >= CarsDB.MAX_STARS:
		return false
	return int(st.bp) >= CarsDB.blueprints_needed(CarsDB.get_car(id), s)


func unlock_or_star(id: String) -> bool:
	var st := car_state(id)
	var need := CarsDB.blueprints_needed(CarsDB.get_car(id), int(st.stars))
	if need <= 0 or int(st.bp) < need:
		return false
	st.bp = int(st.bp) - need
	st.stars = int(st.stars) + 1
	save_game()
	garage_changed.emit()
	return true


func add_blueprints(id: String, n: int) -> void:
	var st := car_state(id)
	st.bp = int(st.bp) + n
	garage_changed.emit()


func upgrade_car(id: String) -> bool:
	var st := car_state(id)
	var lvl := int(st.level)
	if lvl >= max_level_for(id) or not is_owned(id):
		return false
	var cost := CarsDB.upgrade_cost(CarsDB.get_car(id), lvl)
	if not spend_credits(cost):
		return false
	st.level = lvl + 1
	save_game()
	garage_changed.emit()
	return true


func car_color(id: String) -> Color:
	return Color(str(car_state(id).color))


func set_car_color(id: String, c: Color) -> void:
	car_state(id).color = "#" + c.to_html(false)
	save_game()
	garage_changed.emit()


func car_stats(id: String) -> Dictionary:
	var c := CarsDB.get_car(id)
	var lvl := car_level(id)
	return {"top": CarsDB.stat(c, "top", lvl), "acc": CarsDB.stat(c, "acc", lvl),
		"han": CarsDB.stat(c, "han", lvl), "nit": CarsDB.stat(c, "nit", lvl), "rank": CarsDB.rank(c, lvl)}


func owned_cars(cls: String = "") -> Array:
	var out := []
	for c in CarsDB.all():
		if is_owned(c.id) and (cls == "" or c.cls == cls):
			out.append(c)
	return out


# ---------------------------------------------------------------------------
# Carburant
# ---------------------------------------------------------------------------

func _now() -> int:
	return int(Time.get_unix_time_from_system())


func fuel(id: String) -> int:
	var st := car_state(id)
	var f := int(st.fuel)
	if f >= FUEL_MAX:
		return FUEL_MAX
	var ts := int(st.fuel_ts)
	var gained := int((_now() - ts) / FUEL_REGEN_SEC)
	if gained > 0:
		f = mini(FUEL_MAX, f + gained)
		st.fuel = f
		st.fuel_ts = ts + gained * FUEL_REGEN_SEC
	return f


func fuel_next_sec(id: String) -> int:
	var st := car_state(id)
	if fuel(id) >= FUEL_MAX:
		return 0
	return FUEL_REGEN_SEC - (_now() - int(st.fuel_ts)) % FUEL_REGEN_SEC


func use_fuel(id: String) -> bool:
	var f := fuel(id)
	if f <= 0:
		return false
	var st := car_state(id)
	if f >= FUEL_MAX:
		st.fuel_ts = _now()
	st.fuel = f - 1
	save_game()
	return true


func refill_fuel(id: String) -> void:
	var st := car_state(id)
	st.fuel = FUEL_MAX
	st.fuel_ts = _now()
	save_game()


# ---------------------------------------------------------------------------
# Carrière
# ---------------------------------------------------------------------------

func event_flags(eid: String) -> Array:
	var e = data.career.get(eid, {})
	return e.get("flags", [false, false])


func event_flag_count(eid: String) -> int:
	var n := 0
	for f in event_flags(eid):
		if f:
			n += 1
	return n


func season_flags(season: Dictionary) -> int:
	var n := 0
	for ev in season.events:
		n += event_flag_count(ev.id)
	return n


func chapter_progress(chapter: Dictionary) -> float:
	var got := 0
	var total := 0
	for s in chapter.seasons:
		got += season_flags(s)
		total += s.events.size() * 2
	return float(got) / maxf(1.0, float(total))


func season_unlocked(season: Dictionary) -> bool:
	# première saison toujours ouverte ; sinon il faut la moitié des drapeaux de la saison précédente
	var prev = null
	for ch in CareerDB.chapters():
		for s in ch.seasons:
			if s.id == season.id:
				if prev == null:
					return true
				return season_flags(prev) >= int(prev.events.size())
			prev = s
	return false


func chapter_unlocked(chapter: Dictionary) -> bool:
	return season_unlocked(chapter.seasons[0])


func event_unlocked(ev: Dictionary) -> bool:
	var season: Dictionary = {}
	for ch in CareerDB.chapters():
		for s in ch.seasons:
			if s.id == ev.season:
				season = s
	if season.is_empty() or not season_unlocked(season):
		return false
	return season_flags(season) >= int(ev.req_flags)


# ---------------------------------------------------------------------------
# Objectifs quotidiens / épreuves du jour
# ---------------------------------------------------------------------------

const DAILY_POOL := [
	["races", 3, "TERMINE %d COURSES", 2000, 0],
	["wins", 2, "GAGNE %d COURSES", 3000, 10],
	["barrel_rolls", 4, "FAIS %d TONNEAUX", 2500, 5],
	["takedowns", 4, "FAIS %d TAKEDOWNS", 3000, 10],
	["near_miss", 12, "FAIS %d FRÔLEMENTS", 2000, 5],
	["jumps", 8, "FAIS %d SAUTS", 2000, 5],
	["perfect_nitro", 6, "FAIS %d NITROS PARFAITS", 2500, 5],
	["distance_km", 10, "PARCOURS %d KM", 3000, 10],
]


func today() -> String:
	var d := Time.get_date_dict_from_system()
	return "%04d-%02d-%02d" % [d.year, d.month, d.day]


func _ensure_daily() -> void:
	var t := today()
	if data.daily.get("date", "") == t:
		return
	var rng := RandomNumberGenerator.new()
	rng.seed = hash(t)
	var pool := DAILY_POOL.duplicate()
	var tasks := []
	for i in 4:
		var k := rng.randi_range(0, pool.size() - 1)
		var p: Array = pool[k]
		pool.remove_at(k)
		tasks.append({"stat": p[0], "goal": p[1], "text": p[2] % p[1], "credits": p[3], "tokens": p[4],
			"progress": 0.0, "claimed": false})
	data.daily = {"date": t, "tasks": tasks, "events_done": []}


func daily_tasks() -> Array:
	_ensure_daily()
	return data.daily.tasks


func claim_daily(i: int) -> bool:
	var t: Dictionary = daily_tasks()[i]
	if t.claimed or float(t.progress) < float(t.goal):
		return false
	t.claimed = true
	add_credits(int(t.credits))
	add_tokens(int(t.tokens))
	save_game()
	return true


func daily_events() -> Array:
	## 3 épreuves générées selon la date
	var rng := RandomNumberGenerator.new()
	rng.seed = hash(today() + "ev")
	var tracks := TracksDB.TRACKS.keys()
	var out := []
	var classes := ["D", "C", "B"]
	if not owned_cars("A").is_empty():
		classes.append("A")
	if not owned_cars("S").is_empty():
		classes.append("S")
	var modes := ["classic", "elimination", "takedown", "classic"]
	for i in 3:
		var cls: String = classes[rng.randi_range(0, classes.size() - 1)]
		var pool := CarsDB.cars_of_class(cls)
		var reward_car: Dictionary = pool[rng.randi_range(0, pool.size() - 1)]
		var base_rank: int = {"D": 520, "C": 900, "B": 1400, "A": 2100, "S": 3100}[cls]
		var mode: String = modes[rng.randi_range(0, modes.size() - 1)]
		var objs := [{"type": "position", "value": 3}, {"type": ["takedowns", "barrel_rolls", "near_miss"][i], "value": 2}]
		if mode == "elimination":
			objs[0] = {"type": "survive", "value": 1}
		elif mode == "takedown":
			objs[0] = {"type": "takedowns", "value": 4}
		out.append({"id": "daily_%d" % i, "track": tracks[rng.randi_range(0, tracks.size() - 1)], "mode": mode,
			"cls": cls, "rank": base_rank + rng.randi_range(-40, 120), "objectives": objs,
			"credits": int(base_rank * 6.0), "bp_car": reward_car.id, "bp_n": 3, "opponents": 5, "daily": true,
			"done": data.daily.events_done.has("daily_%d" % i)})
	return out


# ---------------------------------------------------------------------------
# Événements spéciaux (défis voiture)
# ---------------------------------------------------------------------------

const SPECIALS := [
	{"id": "sp_mustang", "car": "mustang_gt", "cls": "D", "title": "DÉFI FORD MUSTANG GT", "base": 560, "track": "route66"},
	{"id": "sp_gt3", "car": "gt3_rs", "cls": "C", "title": "DÉFI PORSCHE 911 GT3 RS", "base": 950, "track": "sf_goldengate"},
	{"id": "sp_huracan", "car": "huracan_evo", "cls": "B", "title": "DÉFI LAMBORGHINI HURACÁN", "base": 1400, "track": "tokyo_bay"},
	{"id": "sp_jesko", "car": "jesko", "cls": "A", "title": "DÉFI KOENIGSEGG JESKO", "base": 2100, "track": "nevada_canyon"},
]


func special_stage(sid: String) -> int:
	return int(data.special.get(sid, 0))


func special_event(sp: Dictionary) -> Dictionary:
	var stage := special_stage(sp.id)
	var tracks := [sp.track, "la_coast", "tokyo_shibuya", "sf_downtown", "route66"]
	return {"id": sp.id, "track": tracks[stage % tracks.size()], "mode": ["classic", "elimination", "classic",
		"takedown", "classic"][stage % 5], "cls": sp.cls, "rank": int(sp.base + stage * 60),
		"objectives": [{"type": "position", "value": 2} if stage % 5 != 1 else {"type": "survive", "value": 1},
			{"type": "barrel_rolls", "value": 1 + stage % 3}],
		"credits": int(sp.base * 5), "bp_car": sp.car, "bp_n": 5, "opponents": 5, "special": true, "stage": stage}


# ---------------------------------------------------------------------------
# Pass Unité / ligue
# ---------------------------------------------------------------------------

func pass_tier() -> int:
	return mini(PASS_TIERS, int(data.xp) / PASS_XP_PER_TIER)


func pass_reward(tier: int) -> Dictionary:
	## tier : 1..30
	var cars := ["z4", "camaro_lt", "nismo_370z", "mustang_gt", "alpine_a110", "gtr_nismo", "amg_gt",
		"f8_tributo", "mclaren_720s", "chiron"]
	if tier == PASS_TIERS:
		return {"type": "bp", "car": "jesko", "n": 10, "text": "10 PLANS JESKO"}
	match tier % 5:
		0:
			var car: String = cars[(tier / 5) % cars.size()]
			return {"type": "bp", "car": car, "n": 4, "text": "4 PLANS " + CarsDB.get_car(car).model}
		1, 3:
			return {"type": "credits", "n": 2000 + tier * 300, "text": fmt_num(2000 + tier * 300) + " CRÉDITS"}
		2:
			return {"type": "tokens", "n": 20 + tier * 2, "text": str(20 + tier * 2) + " JETONS"}
		_:
			var car2: String = cars[(tier * 3) % cars.size()]
			return {"type": "bp", "car": car2, "n": 2, "text": "2 PLANS " + CarsDB.get_car(car2).model}


func claim_pass(tier: int) -> bool:
	if tier != int(data.pass_claimed) + 1 or tier > pass_tier():
		return false
	var r := pass_reward(tier)
	match r.type:
		"credits":
			add_credits(r.n)
		"tokens":
			add_tokens(r.n)
		"bp":
			add_blueprints(r.car, r.n)
	data.pass_claimed = tier
	save_game()
	return true


func league() -> Array:
	var lp := int(data.league_points)
	var cur: Array = LEAGUES[0]
	for l in LEAGUES:
		if lp >= int(l[1]):
			cur = l
	return cur


# ---------------------------------------------------------------------------
# Résultats de course
# ---------------------------------------------------------------------------

func apply_race_result(res: Dictionary) -> Dictionary:
	## Applique gains et progression ; retourne le détail des récompenses.
	last_result = res
	var ev: Dictionary = res.event
	var rewards := {"credits": 0, "tokens": 0, "bp": {}, "xp": 0, "flags_new": 0, "lp": 0}
	var st: Dictionary = data.stats
	st.races = int(st.races) + 1
	if res.position == 1 and not res.get("dnf", false):
		st.wins = int(st.wins) + 1
	for k in ["takedowns", "barrel_rolls", "jumps", "near_miss", "perfect_nitro"]:
		st[k] = int(st[k]) + int(res.stats.get(k, 0))
	st.wrecks = int(st.wrecks) + int(res.stats.get("wrecks", 0))
	st.distance_km = float(st.distance_km) + float(res.stats.get("distance", 0.0)) / 1000.0
	st.top_speed = maxf(float(st.top_speed), float(res.stats.get("top_speed", 0.0)))
	# quotidien
	for t in daily_tasks():
		var stat: String = t.stat
		var add := 0.0
		match stat:
			"races":
				add = 1.0
			"wins":
				add = 1.0 if res.position == 1 else 0.0
			"distance_km":
				add = float(res.stats.get("distance", 0.0)) / 1000.0
			_:
				add = float(res.stats.get(stat, 0))
		t.progress = minf(float(t.goal), float(t.progress) + add)
	# crédits selon la position
	var mult := [1.0, 0.75, 0.6, 0.45, 0.35, 0.3, 0.25, 0.2]
	var base := int(ev.get("credits", 2000))
	var pos := int(res.position)
	var c := int(base * mult[clampi(pos - 1, 0, mult.size() - 1)]) if not res.get("dnf", false) else int(base * 0.15)
	c += int(res.stats.get("takedowns", 0)) * 250 + int(res.stats.get("barrel_rolls", 0)) * 150
	c += int(res.stats.get("near_miss", 0)) * 40 + int(res.stats.get("jumps", 0)) * 60
	rewards.credits = c
	add_credits(c)
	# objectifs -> drapeaux (carrière) / récompenses uniques
	var done: Array = res.objectives_done
	var first_completion := false
	if ev.has("season"):
		var prev := event_flags(ev.id).duplicate()
		var flags := [prev[0] or done[0], prev[1] or done[1]]
		var newf := 0
		for i in 2:
			if flags[i] and not prev[i]:
				newf += 1
		rewards.flags_new = newf
		first_completion = (not prev[0]) and flags[0]
		var rec: Dictionary = data.career.get(ev.id, {})
		rec.flags = flags
		if not res.get("dnf", false):
			rec.best_time = minf(float(rec.get("best_time", 99999.0)), float(res.time))
			rec.best_pos = mini(int(rec.get("best_pos", 99)), pos)
		data.career[ev.id] = rec
		if newf > 0:
			add_tokens(5 * newf)
			rewards.tokens += 5 * newf
	elif ev.get("daily", false):
		if done[0] and not data.daily.events_done.has(ev.id):
			data.daily.events_done.append(ev.id)
			first_completion = true
	elif ev.get("special", false):
		if done[0]:
			data.special[ev.id] = special_stage(ev.id) + 1
			first_completion = true
	elif ev.get("league", false):
		var lp_gain: int = [35, 22, 12, 4, -6, -12][clampi(pos - 1, 0, 5)]
		data.league_points = maxi(0, int(data.league_points) + lp_gain)
		rewards.lp = lp_gain
	else:
		first_completion = done[0]
	if first_completion and ev.get("bp_car", "") != "":
		add_blueprints(ev.bp_car, int(ev.bp_n))
		rewards.bp[ev.bp_car] = int(ev.bp_n)
	# XP du pass
	var xp := 150 + maxi(0, 6 - pos) * 60 + int(res.stats.get("takedowns", 0)) * 25 + int(res.stats.get("barrel_rolls", 0)) * 15
	data.xp = int(data.xp) + xp
	rewards.xp = xp
	save_game()
	return rewards


# ---------------------------------------------------------------------------
# Paramètres
# ---------------------------------------------------------------------------

func setting(key: String):
	return data.settings.get(key)


func set_setting(key: String, v) -> void:
	data.settings[key] = v
	save_game()
	apply_settings()


func apply_settings() -> void:
	if has_node("/root/Sfx"):
		get_node("/root/Sfx").set_volumes(float(setting("music")), float(setting("sfx")))


# ---------------------------------------------------------------------------
# Entrées
# ---------------------------------------------------------------------------

func _add_action(name: String, keys: Array, joy_buttons: Array = [], joy_axes: Array = []) -> void:
	if not InputMap.has_action(name):
		InputMap.add_action(name, 0.2)
	for k in keys:
		var ev := InputEventKey.new()
		ev.physical_keycode = k
		InputMap.action_add_event(name, ev)
	for b in joy_buttons:
		var jb := InputEventJoypadButton.new()
		jb.button_index = b
		InputMap.action_add_event(name, jb)
	for a in joy_axes:
		var ja := InputEventJoypadMotion.new()
		ja.axis = a[0]
		ja.axis_value = a[1]
		InputMap.action_add_event(name, ja)


func _setup_input() -> void:
	_add_action("steer_left", [KEY_LEFT, KEY_A, KEY_Q], [JOY_BUTTON_DPAD_LEFT], [[JOY_AXIS_LEFT_X, -1.0]])
	_add_action("steer_right", [KEY_RIGHT, KEY_D], [JOY_BUTTON_DPAD_RIGHT], [[JOY_AXIS_LEFT_X, 1.0]])
	_add_action("nitro", [KEY_SPACE, KEY_UP, KEY_W, KEY_Z], [JOY_BUTTON_A], [[JOY_AXIS_TRIGGER_RIGHT, 1.0]])
	_add_action("drift", [KEY_DOWN, KEY_S, KEY_SHIFT], [JOY_BUTTON_X], [[JOY_AXIS_TRIGGER_LEFT, 1.0]])
	_add_action("pause", [KEY_ESCAPE, KEY_P], [JOY_BUTTON_START])
	_add_action("tab_prev", [KEY_PAGEUP], [JOY_BUTTON_LEFT_SHOULDER])
	_add_action("tab_next", [KEY_PAGEDOWN], [JOY_BUTTON_RIGHT_SHOULDER])


# ---------------------------------------------------------------------------
# Transitions
# ---------------------------------------------------------------------------

func _setup_fade() -> void:
	_fade_layer = CanvasLayer.new()
	_fade_layer.layer = 100
	add_child(_fade_layer)
	_fade = ColorRect.new()
	_fade.color = Color(0.05, 0.0, 0.12, 1.0)
	_fade.modulate.a = 0.0
	_fade.set_anchors_preset(Control.PRESET_FULL_RECT)
	_fade.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_fade_layer.add_child(_fade)
	# texte de chargement (visible quand l'écran est noir pendant la construction du circuit)
	var lbl := Label.new()
	lbl.text = "CHARGEMENT…"
	lbl.add_theme_font_override("font", load("res://assets/fonts/BarlowCondensed-800i.ttf"))
	lbl.add_theme_font_size_override("font_size", 40)
	lbl.add_theme_color_override("font_color", Color(1, 1, 1, 1))
	lbl.set_anchors_preset(Control.PRESET_BOTTOM_RIGHT)
	lbl.offset_left = -320
	lbl.offset_top = -90
	lbl.offset_right = -40
	lbl.offset_bottom = -30
	lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	lbl.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_fade.add_child(lbl)


func goto_scene(path: String) -> void:
	_fade.mouse_filter = Control.MOUSE_FILTER_STOP
	var tw := create_tween()
	tw.tween_property(_fade, "modulate:a", 1.0, 0.25)
	await tw.finished
	get_tree().paused = false
	get_tree().change_scene_to_file(path)
	await get_tree().process_frame
	await get_tree().process_frame
	var tw2 := create_tween()
	tw2.tween_property(_fade, "modulate:a", 0.0, 0.35)
	await tw2.finished
	_fade.mouse_filter = Control.MOUSE_FILTER_IGNORE


func start_race(cfg: Dictionary) -> void:
	race_config = cfg
	goto_scene("res://scenes/race.tscn")


func vibrate(ms: int) -> void:
	if setting("vibration") and OS.has_feature("mobile"):
		Input.vibrate_handheld(ms)
