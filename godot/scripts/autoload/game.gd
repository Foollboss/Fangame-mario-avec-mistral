extends Node
## Données du jeu, sauvegarde, économie, carrière et navigation entre scènes.
## Autoload : "Game"

const SAVE_PATH := "user://asphalt_unite_fangame.save.json"
const HUB_SCENE := "res://scenes/hub.tscn"
const RACE_SCENE := "res://scenes/race.tscn"

const CLASS_ORDER := ["D", "C", "B", "A", "S"]
const UPGRADE_COST := {"D": 2500, "C": 6000, "B": 12000, "A": 22000, "S": 40000}
const LEVELS_PER_STAR := 4

const LOCATIONS := [
	{"name": "SAN FRANCISCO", "theme": "sf"},
	{"name": "LOS ANGELES", "theme": "la"},
	{"name": "TOKYO", "theme": "tokyo"},
	{"name": "NEVADA", "theme": "nevada"},
	{"name": "NEW YORK", "theme": "newyork"},
]

const AI_NAMES := [
	"NeoDrift", "Kaz_R", "LunaRacer", "TurboMax", "Shadow_V", "Rexx", "Nitrogirl", "ZeroLag",
	"SpeedyGonz", "Valkyria", "DriftKing75", "Akira_GT", "MissFire", "Blaze", "Vortex", "Hikari",
	"Mamba", "Phantom", "IceVenom", "LeLoup", "Sonic_FR", "Kenji", "Viper", "Nova",
]

# Chapitres de carrière : chaque saison = 6 courses sur une carte.
const CHAPTERS := [
	{"title": "BIENVENUE DANS ASPHALT", "class": "D", "flags_needed": 0, "seasons": [
		{"name": "DÉPART LÉGENDAIRE", "reward_car": "bmw_z4", "badge": "LEGENDARY START"},
		{"name": "CAMARO", "reward_car": "chevrolet_camaro_lt", "badge": "CAMARO"},
		{"name": "D BOOST", "reward_car": "nissan_370z_nismo", "badge": "D BOOST"},
		{"name": "ÉLECTRIQUE", "reward_car": "nissan_leaf_nismo_rc", "badge": "VOLT"},
		{"name": "MACHINE DE COURSE", "reward_car": "ktm_xbow_gtx", "badge": "TRACK"},
	]},
	{"title": "LA MONTÉE EN PUISSANCE", "class": "C", "flags_needed": 12, "seasons": [
		{"name": "BLEU ALPINE", "reward_car": "alpine_a110", "badge": "ALPINE"},
		{"name": "PORSCHE GT4", "reward_car": "porsche_718_cayman_gt4", "badge": "GT4"},
		{"name": "MUSCLE V8", "reward_car": "ford_mustang_gt", "badge": "V8"},
	]},
	{"title": "GRAND TOURISME", "class": "B", "flags_needed": 26, "seasons": [
		{"name": "QUATTRO", "reward_car": "audi_r8", "badge": "V10"},
		{"name": "GODZILLA", "reward_car": "nissan_gtr_nismo", "badge": "GT-R"},
		{"name": "ENFER VERT", "reward_car": "mercedes_amg_gtr", "badge": "AMG"},
		{"name": "RENNSPORT", "reward_car": "porsche_911_gt3_rs", "badge": "RS"},
	]},
	{"title": "EXOTIQUES", "class": "A", "flags_needed": 44, "seasons": [
		{"name": "TAUREAU", "reward_car": "lamborghini_huracan_evo", "badge": "EVO"},
		{"name": "CAVALLINO", "reward_car": "ferrari_f8_tributo", "badge": "F8"},
		{"name": "PAPAYE", "reward_car": "mclaren_720s", "badge": "720"},
		{"name": "HYBRIDE", "reward_car": "porsche_918_spyder", "badge": "918"},
	]},
	{"title": "LÉGENDES", "class": "S", "flags_needed": 64, "seasons": [
		{"name": "V12 HYBRIDE", "reward_car": "lamborghini_revuelto", "badge": "V12"},
		{"name": "FOUDRE", "reward_car": "rimac_nevera", "badge": "EV"},
		{"name": "MOLSHEIM", "reward_car": "bugatti_chiron", "badge": "W16"},
		{"name": "MÉGACAR", "reward_car": "koenigsegg_jesko", "badge": "JESKO"},
	]},
]

const SPECIAL_EVENTS := [
	{"id": "ev_m5", "name": "COUPE M5", "desc": "Course classique, classe B. Récompense : plans BMW M5.",
	 "class": "B", "mode": "classic", "theme": "newyork", "reward_car": "bmw_m5", "obj": {"type": "position", "value": 3}},
	{"id": "ev_barrel", "name": "DÉFI TONNEAUX", "desc": "Enchaîne les rampes à tonneau à Los Angeles.",
	 "class": "", "mode": "classic", "theme": "la", "reward_car": "", "image": "nissan_370z_nismo", "obj": {"type": "barrel", "value": 3}, "barrel_heavy": true},
	{"id": "ev_tt", "name": "CONTRE-LA-MONTRE", "desc": "Seul contre le chrono dans le désert du Nevada.",
	 "class": "", "mode": "time_attack", "theme": "nevada", "reward_car": "", "image": "porsche_918_spyder", "obj": {"type": "time", "value": 0}},
	{"id": "ev_takedown", "name": "CHASSEUR", "desc": "Élimine tes rivaux à Tokyo de nuit.",
	 "class": "", "mode": "classic", "theme": "tokyo", "reward_car": "", "image": "nissan_gtr_nismo", "obj": {"type": "takedown", "value": 3}},
]

const DAILY_OBJECTIVES := [
	{"id": "races", "label": "Termine 3 courses", "goal": 3, "reward": {"credits": 8000}},
	{"id": "barrel_rolls", "label": "Réalise 5 tonneaux", "goal": 5, "reward": {"tokens": 30}},
	{"id": "takedowns", "label": "Fais 5 takedowns", "goal": 5, "reward": {"credits": 12000}},
	{"id": "perfect_nitros", "label": "Déclenche 10 nitros parfaits", "goal": 10, "reward": {"tokens": 40}},
	{"id": "wins", "label": "Gagne 2 courses", "goal": 2, "reward": {"credits": 15000}},
]

const PASS_TIERS := 30
const PASS_XP_PER_TIER := 1000

var classes: Dictionary = {}
var cars: Array = []
var car_by_id: Dictionary = {}
var traffic_defs: Array = []
var save: Dictionary = {}

var race_request: Dictionary = {}
var last_result: Dictionary = {}
var hub_screen := "home"
var hub_screen_args: Dictionary = {}

var autotest := {}  # paramètres de test en ligne de commande

signal currencies_changed


func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	_load_data()
	_load_save()
	_setup_inputs()
	_parse_cmdline()
	apply_window_settings()
	_start_heartbeat()


# ---------------------------------------------------------------------------
# Données
# ---------------------------------------------------------------------------
func _load_data() -> void:
	var f := FileAccess.open("res://data/cars.json", FileAccess.READ)
	var data: Dictionary = JSON.parse_string(f.get_as_text())
	classes = data["classes"]
	cars = data["cars"]
	traffic_defs = data["traffic"]
	for c in cars:
		car_by_id[c["id"]] = c


func car_def(id: String) -> Dictionary:
	return car_by_id.get(id, cars[0])


func cars_of_class(cls: String) -> Array:
	return cars.filter(func(c): return c["class"] == cls)


func class_color(cls: String) -> Color:
	return Color(classes.get(cls, {}).get("color", "#ffffff"))


func car_display_name(id: String) -> String:
	var c := car_def(id)
	return "%s %s" % [c["brand"], c["model"]]


# ---------------------------------------------------------------------------
# Sauvegarde
# ---------------------------------------------------------------------------
func _default_save() -> Dictionary:
	var s := {
		"version": 1,
		"name": "Galax",
		"credits": 65000,
		"tokens": 800,
		"selected_car": "mercedes_cla",
		"cars": {},
		"career": {"flags": {}},
		"events": {},
		"stats": {"races": 0, "wins": 0, "takedowns": 0, "barrel_rolls": 0, "jumps": 0, "wrecks": 0,
				  "perfect_nitros": 0, "near_misses": 0, "distance_km": 0.0, "best_times": {}},
		"daily": {"day": "", "progress": {}, "claimed": {}},
		"pass": {"xp": 0, "claimed": []},
		"settings": {"quality": 1 if is_mobile() else 2, "touchdrive": is_mobile(), "sfx": 0.8, "music": 0.5, "engine": 0.7,
					 "show_fps": false, "camera": 0, "fullscreen": false},
	}
	for c in cars:
		s["cars"][c["id"]] = {"owned": c.get("free", false), "stars": 1, "plans": 0, "upg": [0, 0, 0, 0], "paint": ""}
	return s


## Dernières lignes du journal de la session précédente (pour diagnostiquer une fermeture).
func previous_log_tail(max_lines: int = 80) -> String:
	var hb := ""
	if FileAccess.file_exists(HEARTBEAT_PREV):
		hb = "DERNIER SIGNE DE VIE DE LA SESSION PRÉCÉDENTE :\n" + FileAccess.get_file_as_string(HEARTBEAT_PREV) + "\n"
	return hb + _previous_log_lines(max_lines)


func _previous_log_lines(max_lines: int) -> String:
	var dir := DirAccess.open("user://logs")
	if dir == null:
		return "Aucun journal trouvé."
	var files := []
	for f in dir.get_files():
		if f.ends_with(".log") and f != "godot.log":
			files.append(f)
	if files.is_empty():
		return "Aucun journal de session précédente (relance le jeu après une fermeture)."
	files.sort()
	var path: String = "user://logs/" + files[files.size() - 1]
	var fa := FileAccess.open(path, FileAccess.READ)
	if fa == null:
		return "Impossible de lire " + path
	var lines := fa.get_as_text().split("\n")
	var start: int = max(0, lines.size() - max_lines)
	return "%s\n\n%s" % [path.get_file(), "\n".join(lines.slice(start))]


func is_forward_plus() -> bool:
	return RenderingServer.get_current_rendering_method() == "forward_plus"


# ---------------------------------------------------------------------------
# Diagnostic : « dernier signe de vie » écrit toutes les 5 s. Si le jeu se ferme
# brutalement (plantage, manque de mémoire), on retrouve au lancement suivant
# où il en était (écran, temps de jeu, mémoire, images par seconde).
# ---------------------------------------------------------------------------
const HEARTBEAT := "user://logs/dernier_signe_de_vie.txt"
const HEARTBEAT_PREV := "user://logs/dernier_signe_de_vie_precedent.txt"
var _hb_timer: Timer


func _start_heartbeat() -> void:
	DirAccess.make_dir_recursive_absolute("user://logs")
	if FileAccess.file_exists(HEARTBEAT):
		var d := DirAccess.open("user://logs")
		if d:
			if d.file_exists(HEARTBEAT_PREV.get_file()):
				d.remove(HEARTBEAT_PREV.get_file())
			d.rename(HEARTBEAT.get_file(), HEARTBEAT_PREV.get_file())
	_hb_timer = Timer.new()
	_hb_timer.wait_time = 5.0
	_hb_timer.process_mode = Node.PROCESS_MODE_ALWAYS
	_hb_timer.timeout.connect(_write_heartbeat)
	add_child(_hb_timer)
	_hb_timer.start()
	_write_heartbeat()


func _write_heartbeat() -> void:
	var f := FileAccess.open(HEARTBEAT, FileAccess.WRITE)
	if f == null:
		return
	var scene := get_tree().current_scene
	var extra := ""
	if scene and scene.has_method("debug_state"):
		extra = scene.debug_state()
	f.store_string("Version %s · %s · %s\nTemps depuis le lancement : %.0f s\nÉcran : %s %s\nImages/s : %d\nMémoire (moteur) : %.0f Mo\nRendu : %s\n" % [
		ProjectSettings.get_setting("application/config/version", "1.0"), OS.get_name(), OS.get_model_name(),
		Time.get_ticks_msec() / 1000.0, scene.name if scene else "?", extra, Engine.get_frames_per_second(),
		OS.get_static_memory_usage() / 1048576.0, RenderingServer.get_current_rendering_method()])


func is_mobile() -> bool:
	return OS.has_feature("mobile") or OS.has_feature("android") or OS.has_feature("ios")


func _load_save() -> void:
	save = _default_save()
	if FileAccess.file_exists(SAVE_PATH):
		var f := FileAccess.open(SAVE_PATH, FileAccess.READ)
		var parsed = JSON.parse_string(f.get_as_text())
		if parsed is Dictionary:
			_merge(save, parsed)
	# nouvelles voitures ajoutées depuis la dernière version
	for c in cars:
		if not save["cars"].has(c["id"]):
			save["cars"][c["id"]] = {"owned": c.get("free", false), "stars": 1, "plans": 0, "upg": [0, 0, 0, 0], "paint": ""}
	if not car_by_id.has(save["selected_car"]):
		save["selected_car"] = "mercedes_cla"
	_refresh_daily()


func _merge(dst: Dictionary, src: Dictionary) -> void:
	for k in src.keys():
		if dst.has(k) and dst[k] is Dictionary and src[k] is Dictionary:
			_merge(dst[k], src[k])
		else:
			dst[k] = src[k]


func save_game() -> void:
	if autotest.has("nosave"):
		return
	var f := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if f:
		f.store_string(JSON.stringify(save, "\t"))


func reset_save() -> void:
	save = _default_save()
	_refresh_daily()
	save_game()
	currencies_changed.emit()


func setting(key: String, default = null):
	return save["settings"].get(key, default)


func set_setting(key: String, value) -> void:
	save["settings"][key] = value
	save_game()
	apply_window_settings()


func apply_window_settings() -> void:
	if DisplayServer.get_name() == "headless" or is_mobile():
		return
	var fs: bool = setting("fullscreen", false)
	var mode := DisplayServer.window_get_mode()
	if fs and mode != DisplayServer.WINDOW_MODE_FULLSCREEN:
		DisplayServer.window_set_mode(DisplayServer.WINDOW_MODE_FULLSCREEN)
	elif not fs and mode == DisplayServer.WINDOW_MODE_FULLSCREEN:
		DisplayServer.window_set_mode(DisplayServer.WINDOW_MODE_WINDOWED)


# ---------------------------------------------------------------------------
# Économie
# ---------------------------------------------------------------------------
func credits() -> int:
	return int(save["credits"])


func tokens() -> int:
	return int(save["tokens"])


func add_currency(credits_amount: int, tokens_amount: int = 0) -> void:
	save["credits"] = int(save["credits"]) + credits_amount
	save["tokens"] = int(save["tokens"]) + tokens_amount
	save_game()
	currencies_changed.emit()


func spend(credits_amount: int, tokens_amount: int = 0) -> bool:
	if credits() < credits_amount or tokens() < tokens_amount:
		return false
	add_currency(-credits_amount, -tokens_amount)
	return true


# ---------------------------------------------------------------------------
# Voitures du joueur
# ---------------------------------------------------------------------------
func car_state(id: String) -> Dictionary:
	return save["cars"][id]


func is_owned(id: String) -> bool:
	return bool(car_state(id)["owned"])


func owned_cars() -> Array:
	return cars.filter(func(c): return is_owned(c["id"]))


func max_stars(id: String) -> int:
	return int(classes[car_def(id)["class"]]["stars"])


func plans_needed(id: String) -> int:
	## plans nécessaires pour débloquer (si non possédée) ou pour l'étoile suivante
	var plans: Array = classes[car_def(id)["class"]]["plans"]
	var st := car_state(id)
	if not st["owned"]:
		return int(plans[0])
	var idx := int(st["stars"])
	if idx >= plans.size():
		return 0
	return int(plans[idx])


func ready_to_unlock(id: String) -> bool:
	var st := car_state(id)
	return not st["owned"] and int(st["plans"]) >= plans_needed(id)


func ready_to_star_up(id: String) -> bool:
	var st := car_state(id)
	return st["owned"] and int(st["stars"]) < max_stars(id) and int(st["plans"]) >= plans_needed(id)


func unlock_car(id: String) -> bool:
	if not ready_to_unlock(id):
		return false
	var st := car_state(id)
	st["plans"] = int(st["plans"]) - plans_needed(id)
	st["owned"] = true
	st["stars"] = 1
	save_game()
	return true


func star_up(id: String) -> bool:
	if not ready_to_star_up(id):
		return false
	var st := car_state(id)
	st["plans"] = int(st["plans"]) - plans_needed(id)
	st["stars"] = int(st["stars"]) + 1
	save_game()
	return true


func buy_car(id: String, with_tokens: bool) -> bool:
	var cls: Dictionary = classes[car_def(id)["class"]]
	var ok := spend(0, int(cls["tokens"])) if with_tokens else spend(int(cls["credits"]), 0)
	if ok:
		var st := car_state(id)
		st["owned"] = true
		st["stars"] = max(1, int(st["stars"]))
		save_game()
	return ok


func add_plans(id: String, n: int) -> void:
	var st := car_state(id)
	st["plans"] = int(st["plans"]) + n
	save_game()


func max_level(id: String) -> int:
	return max_stars(id) * LEVELS_PER_STAR


func level_cap(id: String) -> int:
	return int(car_state(id)["stars"]) * LEVELS_PER_STAR


func upgrade_cost(id: String, stat_idx: int) -> int:
	var lvl := int(car_state(id)["upg"][stat_idx])
	return int(UPGRADE_COST[car_def(id)["class"]] * (1.0 + lvl * 0.35))


func can_upgrade(id: String, stat_idx: int) -> bool:
	var st := car_state(id)
	return st["owned"] and int(st["upg"][stat_idx]) < level_cap(id) and credits() >= upgrade_cost(id, stat_idx)


func upgrade(id: String, stat_idx: int) -> bool:
	if not can_upgrade(id, stat_idx):
		return false
	var cost := upgrade_cost(id, stat_idx)
	var st := car_state(id)
	st["upg"][stat_idx] = int(st["upg"][stat_idx]) + 1
	spend(cost, 0)
	return true


const STAT_KEYS := ["top_speed", "accel", "handling", "nitro"]


func _progress(id: String, stat_idx: int) -> float:
	var st := car_state(id)
	var ms := max_stars(id)
	var star_part := 0.0 if ms <= 1 else float(int(st["stars"]) - 1) / float(ms - 1)
	var lvl_part := float(st["upg"][stat_idx]) / float(max_level(id))
	return clamp(0.35 * star_part + 0.65 * lvl_part, 0.0, 1.0)


func stat_value(id: String, stat_idx: int, extra_levels: int = 0) -> float:
	var c := car_def(id)
	var rng: Array = c[STAT_KEYS[stat_idx]]
	var p := _progress(id, stat_idx)
	if extra_levels != 0:
		p = clamp(p + 0.65 * float(extra_levels) / float(max_level(id)), 0.0, 1.0)
	return lerp(float(rng[0]), float(rng[1]), p)


func car_rank(id: String) -> int:
	var c := car_def(id)
	var p := 0.0
	for i in 4:
		p += _progress(id, i)
	p /= 4.0
	return int(round(lerp(float(c["rank"][0]), float(c["rank"][1]), p)))


func car_max_rank(id: String) -> int:
	return int(car_def(id)["rank"][1])


func race_stats(id: String, rank_override: int = -1) -> Dictionary:
	## Statistiques physiques utilisées en course.
	var vals := []
	for i in 4:
		vals.append(stat_value(id, i))
	if rank_override >= 0:
		# voitures IA : on interpole selon le rang demandé
		var c := car_def(id)
		var p: float = clamp(inverse_lerp(float(c["rank"][0]), float(c["rank"][1]), float(rank_override)), 0.0, 1.0)
		vals = []
		for i in 4:
			var rng: Array = c[STAT_KEYS[i]]
			vals.append(lerp(float(rng[0]), float(rng[1]), p))
	return {
		"top_speed": vals[0] / 3.6,
		"accel": 3.5 + vals[1] * 0.12,
		"handling": vals[2],
		"lat_speed": 9.5 + vals[2] * 0.10,
		"nitro_mult": 1.16 + vals[3] * 0.0016,
		"nitro_burn": 26.0 - vals[3] * 0.09,
	}


# ---------------------------------------------------------------------------
# Carrière
# ---------------------------------------------------------------------------
func season_races(ch_idx: int, se_idx: int) -> Array:
	var ch: Dictionary = CHAPTERS[ch_idx]
	var se: Dictionary = ch["seasons"][se_idx]
	var cls: String = ch["class"]
	var car_list := cars_of_class(cls)
	var rmin := 1e9
	var rmax := 0.0
	for c in car_list:
		rmin = min(rmin, float(c["rank"][0]))
		rmax = max(rmax, float(c["rank"][1]))
	var n_seasons: int = ch["seasons"].size()
	var res := []
	var rng := RandomNumberGenerator.new()
	for r in 6:
		rng.seed = hash("race_%d_%d_%d" % [ch_idx, se_idx, r])
		var k := float(se_idx * 6 + r) / float(n_seasons * 6)
		var loc: Dictionary = LOCATIONS[(se_idx * 2 + r + ch_idx) % LOCATIONS.size()]
		var obj := {"type": "position", "value": 3}
		match r:
			0, 1:
				obj = {"type": "position", "value": 3}
			2:
				obj = {"type": "barrel", "value": 1 + ch_idx / 2}
			3:
				obj = {"type": "position", "value": 2}
			4:
				obj = {"type": "takedown", "value": 1 + ch_idx / 2}
			5:
				obj = {"type": "position", "value": 1}
		var mode := "classic"
		if r == 3 and se_idx % 2 == 1:
			mode = "time_attack"
			obj = {"type": "time", "value": 0}
		var reward := {"credits": int(3000 + 1500 * ch_idx + 250 * r), "plans": {}}
		if r in [1, 3, 5]:
			reward["plans"][se["reward_car"]] = 1 + (1 if r == 5 else 0) + ch_idx / 3
		res.append({
			"id": "c%d_s%d_r%d" % [ch_idx, se_idx, r],
			"index": r,
			"name": loc["name"],
			"theme": loc["theme"],
			"seed": rng.randi(),
			"length": 2400.0 + 260.0 * r + 120.0 * ch_idx,
			"mode": mode,
			"class": cls,
			"rec_rank": int(lerp(rmin, rmax * 0.85, k)),
			"objective": obj,
			"reward": reward,
			"flags_required": r,
			"chapter": ch_idx,
			"season": se_idx,
		})
	return res


func race_flag(race_id: String) -> bool:
	return save["career"]["flags"].get(race_id, false)


func season_flags(ch_idx: int, se_idx: int) -> int:
	var n := 0
	for r in 6:
		if race_flag("c%d_s%d_r%d" % [ch_idx, se_idx, r]):
			n += 1
	return n


func total_flags() -> int:
	return save["career"]["flags"].size()


func chapter_unlocked(ch_idx: int) -> bool:
	return total_flags() >= int(CHAPTERS[ch_idx]["flags_needed"])


func season_unlocked(ch_idx: int, se_idx: int) -> bool:
	if not chapter_unlocked(ch_idx):
		return false
	if se_idx == 0:
		return true
	return season_flags(ch_idx, se_idx - 1) >= 3


func objective_text(obj: Dictionary) -> String:
	match obj.get("type", ""):
		"position":
			if int(obj["value"]) == 1:
				return "TERMINE 1ER"
			return "TERMINE EN POSITION %d OU MIEUX" % int(obj["value"])
		"barrel":
			return "RÉALISE %d TONNEAU%s ET TERMINE" % [int(obj["value"]), "X" if int(obj["value"]) > 1 else ""]
		"takedown":
			return "RÉALISE %d TAKEDOWN%s ET TERMINE" % [int(obj["value"]), "S" if int(obj["value"]) > 1 else ""]
		"time":
			return "BATS LE TEMPS CIBLE"
		"nowreck":
			return "TERMINE SANS ÉPAVE"
	return "TERMINE LA COURSE"


# ---------------------------------------------------------------------------
# Lancement de course
# ---------------------------------------------------------------------------
func start_race(req: Dictionary, return_screen: String = "home", return_args: Dictionary = {}) -> void:
	race_request = req.duplicate(true)
	if not race_request.has("car"):
		race_request["car"] = save["selected_car"]
	hub_screen = return_screen
	hub_screen_args = return_args
	get_tree().paused = false
	Engine.time_scale = 1.0
	get_tree().change_scene_to_file(RACE_SCENE)


func quick_race_request(theme: String = "", cls: String = "") -> Dictionary:
	var rng := RandomNumberGenerator.new()
	rng.randomize()
	if theme == "":
		theme = LOCATIONS[rng.randi() % LOCATIONS.size()]["theme"]
	var loc_name := ""
	for l in LOCATIONS:
		if l["theme"] == theme:
			loc_name = l["name"]
	var car_id: String = save["selected_car"]
	if cls == "":
		cls = car_def(car_id)["class"]
	return {
		"id": "quick",
		"name": loc_name,
		"theme": theme,
		"seed": rng.randi(),
		"length": rng.randf_range(2600.0, 3600.0),
		"mode": "classic",
		"class": cls,
		"rec_rank": car_rank(car_id),
		"objective": {"type": "position", "value": 3},
		"reward": {"credits": 2500, "plans": {}},
		"car": car_id,
	}


func go_to_hub() -> void:
	get_tree().paused = false
	Engine.time_scale = 1.0
	get_tree().change_scene_to_file(HUB_SCENE)


func apply_race_result(res: Dictionary) -> Dictionary:
	## Applique gains et progression. Retourne le récapitulatif des récompenses.
	last_result = res
	var req: Dictionary = race_request
	var st: Dictionary = save["stats"]
	st["races"] = int(st["races"]) + 1
	if int(res.get("position", 9)) == 1 and req.get("mode", "classic") != "time_attack":
		st["wins"] = int(st["wins"]) + 1
	for k in ["takedowns", "barrel_rolls", "jumps", "wrecks", "perfect_nitros", "near_misses"]:
		st[k] = int(st.get(k, 0)) + int(res.get(k, 0))
	st["distance_km"] = float(st["distance_km"]) + float(req.get("length", 0.0)) / 1000.0
	var bt: Dictionary = st["best_times"]
	var key := str(req.get("id", "quick"))
	if res.get("finished", false):
		if not bt.has(key) or float(res["time"]) < float(bt[key]):
			bt[key] = float(res["time"])

	var rewards := {"credits": 0, "tokens": 0, "plans": {}, "flag": false, "xp": 0}
	var ok: bool = res.get("objective_ok", false)
	var first_time := ok and req.has("chapter") and not race_flag(key)
	var base_credits := int(req.get("reward", {}).get("credits", 2000))
	var pos := int(res.get("position", 6))
	var mult := 1.0 if ok else 0.4
	if req.get("mode", "classic") != "time_attack":
		mult *= [1.0, 1.0, 0.8, 0.65, 0.5, 0.4, 0.35, 0.3][clamp(pos, 0, 7)]
	rewards["credits"] = int(base_credits * mult) + int(res.get("takedowns", 0)) * 150 + int(res.get("barrel_rolls", 0)) * 200
	if first_time:
		save["career"]["flags"][key] = true
		rewards["flag"] = true
		for car_id in req.get("reward", {}).get("plans", {}).keys():
			var n := int(req["reward"]["plans"][car_id])
			add_plans(car_id, n)
			rewards["plans"][car_id] = n
		rewards["tokens"] = 10
	elif ok and req.has("event"):
		var ev_key: String = req["event"]
		var cnt := int(save["events"].get(ev_key, 0))
		save["events"][ev_key] = cnt + 1
		var rc: String = req.get("reward_car", "")
		if rc != "":
			add_plans(rc, 1)
			rewards["plans"][rc] = 1
		rewards["tokens"] = 5
	rewards["xp"] = 120 + (200 if ok else 0) + int(res.get("takedowns", 0)) * 20
	save["pass"]["xp"] = int(save["pass"]["xp"]) + int(rewards["xp"])
	_daily_progress("races", 1)
	if pos == 1 and req.get("mode", "classic") != "time_attack":
		_daily_progress("wins", 1)
	_daily_progress("barrel_rolls", int(res.get("barrel_rolls", 0)))
	_daily_progress("takedowns", int(res.get("takedowns", 0)))
	_daily_progress("perfect_nitros", int(res.get("perfect_nitros", 0)))
	add_currency(int(rewards["credits"]), int(rewards["tokens"]))
	save_game()
	return rewards


# ---------------------------------------------------------------------------
# Objectifs quotidiens et Pass
# ---------------------------------------------------------------------------
func _today() -> String:
	var d := Time.get_date_dict_from_system()
	return "%04d-%02d-%02d" % [d["year"], d["month"], d["day"]]


func _refresh_daily() -> void:
	var daily: Dictionary = save["daily"]
	if daily.get("day", "") != _today():
		daily["day"] = _today()
		daily["progress"] = {}
		daily["claimed"] = {}


func _daily_progress(id: String, amount: int) -> void:
	_refresh_daily()
	var p: Dictionary = save["daily"]["progress"]
	p[id] = int(p.get(id, 0)) + amount


func daily_value(id: String) -> int:
	return int(save["daily"]["progress"].get(id, 0))


func daily_claimed(id: String) -> bool:
	return save["daily"]["claimed"].get(id, false)


func claim_daily(obj: Dictionary) -> bool:
	if daily_claimed(obj["id"]) or daily_value(obj["id"]) < int(obj["goal"]):
		return false
	save["daily"]["claimed"][obj["id"]] = true
	add_currency(int(obj["reward"].get("credits", 0)), int(obj["reward"].get("tokens", 0)))
	return true


func daily_pending() -> int:
	var n := 0
	for o in DAILY_OBJECTIVES:
		if not daily_claimed(o["id"]) and daily_value(o["id"]) >= int(o["goal"]):
			n += 1
	return n


func pass_tier() -> int:
	return min(PASS_TIERS, int(save["pass"]["xp"]) / PASS_XP_PER_TIER)


func pass_reward(tier: int) -> Dictionary:
	## tier commence à 1
	if tier % 10 == 0:
		var pool := ["koenigsegg_jesko", "bugatti_chiron", "mclaren_720s", "porsche_911_gt3_rs"]
		return {"plans": {pool[(tier / 10) % pool.size()]: 2}}
	if tier % 5 == 0:
		return {"tokens": 60}
	if tier % 3 == 0:
		var pool2 := ["nissan_370z_nismo", "ford_mustang_gt", "audi_r8", "lamborghini_huracan_evo", "ktm_xbow_gtx"]
		return {"plans": {pool2[tier % pool2.size()]: 1}}
	return {"credits": 5000 + tier * 500}


func claim_pass(tier: int) -> bool:
	if tier > pass_tier() or tier in save["pass"]["claimed"]:
		return false
	var r := pass_reward(tier)
	save["pass"]["claimed"].append(tier)
	for car_id in r.get("plans", {}).keys():
		add_plans(car_id, int(r["plans"][car_id]))
	add_currency(int(r.get("credits", 0)), int(r.get("tokens", 0)))
	return true


# ---------------------------------------------------------------------------
# Contrôles
# ---------------------------------------------------------------------------
func _add_key(action: String, keys: Array, joy_buttons: Array = [], joy_axes: Array = []) -> void:
	if not InputMap.has_action(action):
		InputMap.add_action(action, 0.3)
	for k in keys:
		var e := InputEventKey.new()
		e.physical_keycode = k
		InputMap.action_add_event(action, e)
	for b in joy_buttons:
		var j := InputEventJoypadButton.new()
		j.button_index = b
		InputMap.action_add_event(action, j)
	for a in joy_axes:
		var m := InputEventJoypadMotion.new()
		m.axis = a[0]
		m.axis_value = a[1]
		InputMap.action_add_event(action, m)


func _setup_inputs() -> void:
	_add_key("steer_left", [KEY_A, KEY_LEFT], [JOY_BUTTON_DPAD_LEFT], [[JOY_AXIS_LEFT_X, -1.0]])
	_add_key("steer_right", [KEY_D, KEY_RIGHT], [JOY_BUTTON_DPAD_RIGHT], [[JOY_AXIS_LEFT_X, 1.0]])
	_add_key("nitro", [KEY_W, KEY_UP, KEY_SPACE], [JOY_BUTTON_A], [[JOY_AXIS_TRIGGER_RIGHT, 1.0]])
	_add_key("drift", [KEY_S, KEY_DOWN, KEY_SHIFT], [JOY_BUTTON_X, JOY_BUTTON_B], [[JOY_AXIS_TRIGGER_LEFT, 1.0]])
	_add_key("pause", [KEY_ESCAPE, KEY_P], [JOY_BUTTON_START])
	_add_key("touchdrive", [KEY_T], [JOY_BUTTON_BACK])
	_add_key("camera", [KEY_C], [JOY_BUTTON_Y])
	_add_key("tab_prev", [KEY_PAGEUP], [JOY_BUTTON_LEFT_SHOULDER])
	_add_key("tab_next", [KEY_PAGEDOWN], [JOY_BUTTON_RIGHT_SHOULDER])


# ---------------------------------------------------------------------------
# Ligne de commande (tests automatiques / captures d'écran)
#   godot -- --race=tokyo --car=bmw_m5 --autodrive --quit-after=20 --shot=/tmp/a.png
# ---------------------------------------------------------------------------
func _parse_cmdline() -> void:
	for a in OS.get_cmdline_user_args():
		var arg := String(a)
		if arg.begins_with("--"):
			var kv := arg.substr(2).split("=", true, 1)
			autotest[kv[0]] = kv[1] if kv.size() > 1 else "1"
	if autotest.is_empty():
		return
	autotest["nosave"] = "1"
	if autotest.has("quality"):
		save["settings"]["quality"] = int(autotest["quality"])
	if autotest.has("car"):
		save["selected_car"] = autotest["car"]
		car_state(autotest["car"])["owned"] = true
	if autotest.has("race"):
		var req := quick_race_request(autotest["race"])
		if autotest.has("mode"):
			req["mode"] = autotest["mode"]
		if autotest.has("length"):
			req["length"] = float(autotest["length"])
		call_deferred("start_race", req)
	if autotest.has("quit-after"):
		var t := get_tree().create_timer(float(autotest["quit-after"]), true, false, true)
		t.timeout.connect(_autotest_quit)
	if autotest.has("shots"):
		# --shots=/tmp/prefix,5,10,15  : captures aux instants donnés
		var parts: PackedStringArray = autotest["shots"].split(",")
		for i in range(1, parts.size()):
			var tt := get_tree().create_timer(float(parts[i]), true, false, true)
			tt.timeout.connect(_shot.bind("%s_%02d.png" % [parts[0], i]))


func _shot(path: String) -> void:
	var img := get_viewport().get_texture().get_image()
	if img:
		img.save_png(path)
		print("screenshot: ", path)


func _autotest_quit() -> void:
	if autotest.has("shot"):
		_shot(autotest["shot"])
	print("autotest: quit")
	quit_game()


## Quitte proprement : coupe tous les sons, attend quelques images, puis ferme.
func quit_game() -> void:
	Audio.stop_all()
	# l'AudioServer libère les sons arrêtés de façon asynchrone : on lui laisse le temps
	await get_tree().create_timer(0.35, true, false, true).timeout
	get_tree().quit()
