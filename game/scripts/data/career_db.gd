class_name CareerDB
## Mode Carrière : chapitres > saisons > épreuves.
## Chaque épreuve rapporte jusqu'à 2 drapeaux (un par objectif).

const MODES := {
	"classic": "COURSE CLASSIQUE",
	"elimination": "ÉLIMINATION",
	"time_attack": "CONTRE-LA-MONTRE",
	"takedown": "CHASSE AUX TAKEDOWNS",
}

const OBJ_TEXT := {
	"position": "TERMINE EN POSITION %d OU MIEUX",
	"win": "TERMINE 1ER",
	"time": "TERMINE EN MOINS DE %s",
	"takedowns": "FAIS %d TAKEDOWNS",
	"barrel_rolls": "FAIS %d TONNEAUX",
	"jumps": "FAIS %d SAUTS",
	"near_miss": "FAIS %d FRÔLEMENTS",
	"perfect_nitro": "FAIS %d NITROS PARFAITS",
	"no_wreck": "TERMINE SANS ACCIDENT",
	"top_speed": "ATTEINS %d KM/H",
	"drift": "DÉRAPE PENDANT %d SECONDES",
	"survive": "SURVIS À L'ÉLIMINATION",
}

## Définitions compactes :
## [track, mode, rang recommandé, objectif bonus [type, valeur], crédits, voiture plan, nb plans, adversaires]
const RAW := [
	{"id": 1, "title": "BIENVENUE DANS ASPHALT", "seasons": [
		{"name": "LEGENDARY START", "cls": "D", "badge": "X", "events": [
			["sf_downtown", "classic", 458, ["barrel_rolls", 1], 2500, "z4", 1, 5],
			["sf_goldengate", "classic", 470, ["jumps", 2], 2800, "z4", 2, 5],
			["la_hollywood", "classic", 480, ["near_miss", 3], 3000, "z4", 2, 5],
		]},
		{"name": "CLASSE D", "cls": "D", "badge": "D", "events": [
			["la_coast", "classic", 520, ["takedowns", 1], 3500, "camaro_lt", 3, 5],
			["nevada_canyon", "time_attack", 540, ["jumps", 3], 3800, "nismo_370z", 3, 0],
			["tokyo_shibuya", "elimination", 560, ["perfect_nitro", 2], 4200, "camaro_lt", 2, 5],
			["route66", "classic", 600, ["top_speed", 280], 4500, "nismo_370z", 2, 5],
		]},
		{"name": "DÉCOUVERTE C", "cls": "C", "badge": "C", "events": [
			["sf_downtown", "classic", 820, ["takedowns", 2], 5500, "mustang_gt", 4, 5],
			["tokyo_bay", "takedown", 850, ["no_wreck", 1], 6000, "leaf_rc", 5, 6],
			["la_hollywood", "elimination", 870, ["barrel_rolls", 2], 6200, "mustang_gt", 3, 5],
			["nevada_canyon", "classic", 900, ["drift", 4], 6800, "xbow_gtx", 5, 5],
		]},
	]},
	{"id": 2, "title": "MONTÉE EN PUISSANCE", "seasons": [
		{"name": "MAÎTRES C", "cls": "C", "badge": "C", "events": [
			["sf_goldengate", "classic", 950, ["takedowns", 2], 7500, "cayman_gt4", 4, 5],
			["route66", "time_attack", 980, ["top_speed", 320], 7800, "alpine_a110", 4, 0],
			["tokyo_shibuya", "classic", 1020, ["near_miss", 5], 8200, "cayman_gt4", 3, 5],
			["la_coast", "elimination", 1080, ["jumps", 3], 8800, "alpine_a110", 4, 5],
		]},
		{"name": "ÉLITE B", "cls": "B", "badge": "B", "events": [
			["nevada_canyon", "classic", 1260, ["barrel_rolls", 2], 10000, "gtr_nismo", 5, 5],
			["sf_downtown", "takedown", 1300, ["no_wreck", 1], 10500, "amg_gt", 5, 6],
			["la_hollywood", "classic", 1350, ["perfect_nitro", 3], 11000, "gtr_nismo", 5, 5],
			["tokyo_bay", "elimination", 1400, ["takedowns", 3], 12000, "amg_gt", 5, 5],
		]},
		{"name": "NUITS DE TOKYO", "cls": "B", "badge": "N", "events": [
			["tokyo_shibuya", "classic", 1450, ["drift", 6], 12500, "gt3_rs", 5, 5],
			["tokyo_bay", "time_attack", 1500, ["near_miss", 6], 13000, "gt3_rs", 5, 0],
			["tokyo_shibuya", "takedown", 1550, ["barrel_rolls", 2], 13500, "gtr_nismo", 5, 6],
			["tokyo_bay", "classic", 1600, ["no_wreck", 1], 14500, "gt3_rs", 5, 5],
		]},
	]},
	{"id": 3, "title": "LÉGENDES", "seasons": [
		{"name": "RIVAUX A", "cls": "A", "badge": "A", "events": [
			["route66", "classic", 1950, ["top_speed", 360], 18000, "huracan_evo", 7, 5],
			["sf_goldengate", "elimination", 2050, ["takedowns", 3], 19000, "f8_tributo", 7, 5],
			["la_coast", "classic", 2150, ["barrel_rolls", 3], 20000, "mclaren_720s", 7, 5],
			["nevada_canyon", "takedown", 2250, ["jumps", 4], 21000, "ford_gt", 7, 6],
		]},
		{"name": "DUEL S", "cls": "S", "badge": "S", "events": [
			["route66", "classic", 2950, ["top_speed", 420], 28000, "jesko", 8, 5],
			["tokyo_bay", "classic", 3050, ["near_miss", 6], 30000, "chiron", 8, 5],
			["sf_downtown", "elimination", 3150, ["takedowns", 3], 32000, "jesko", 8, 5],
			["nevada_canyon", "time_attack", 3250, ["barrel_rolls", 3], 34000, "chiron", 8, 0],
		]},
		{"name": "FINALE LÉGENDAIRE", "cls": "S", "badge": "L", "events": [
			["la_hollywood", "classic", 3400, ["perfect_nitro", 4], 40000, "jesko", 9, 5],
			["sf_goldengate", "takedown", 3500, ["no_wreck", 1], 45000, "chiron", 9, 6],
			["tokyo_shibuya", "classic", 3600, ["takedowns", 4], 60000, "jesko", 9, 5],
		]},
	]},
]

static var _chapters: Array = []
static var _events_by_id := {}


static func chapters() -> Array:
	if _chapters.is_empty():
		_build()
	return _chapters


static func get_event(eid: String) -> Dictionary:
	if _chapters.is_empty():
		_build()
	return _events_by_id.get(eid, {})


static func _build() -> void:
	for ch in RAW:
		var chapter := {"id": ch.id, "title": ch.title, "seasons": []}
		var si := 0
		for s in ch.seasons:
			si += 1
			var season := {"id": "c%ds%d" % [ch.id, si], "name": s.name, "cls": s.cls, "badge": s.badge,
				"chapter": ch.id, "events": []}
			var ei := 0
			for e in s.events:
				ei += 1
				var eid := "c%ds%de%d" % [ch.id, si, ei]
				var mode: String = e[1]
				var pos_obj := 3 if ch.id == 1 and si == 1 else (2 if ch.id < 3 else 1)
				var objs := []
				match mode:
					"time_attack":
						var tr := TracksDB.get_track(e[0])
						objs.append({"type": "time", "value": 0.0})  # calculé à la volée (voir race)
					"elimination":
						objs.append({"type": "survive", "value": 1})
					"takedown":
						objs.append({"type": "takedowns", "value": 3 + ch.id})
					_:
						objs.append({"type": "position", "value": pos_obj} if pos_obj > 1 else {"type": "win", "value": 1})
				objs.append({"type": e[3][0], "value": e[3][1]})
				var ev := {"id": eid, "track": e[0], "mode": mode, "rank": e[2], "cls": s.cls,
					"objectives": objs, "credits": e[4], "bp_car": e[5], "bp_n": e[6], "opponents": e[7],
					"season": season.id, "index": ei,
					# drapeaux requis pour débloquer l'épreuve (dans la saison)
					"req_flags": maxi(0, (ei - 1) * 2 - 1)}
				season.events.append(ev)
				_events_by_id[eid] = ev
			chapter.seasons.append(season)
		_chapters.append(chapter)


static func objective_text(obj: Dictionary) -> String:
	var t: String = obj.type
	var fmt: String = OBJ_TEXT.get(t, t)
	match t:
		"time":
			return fmt % format_time(obj.value)
		"win", "no_wreck", "survive":
			return fmt
		_:
			return fmt % int(obj.value)


static func format_time(sec: float) -> String:
	var m := int(sec) / 60
	var s := int(sec) % 60
	var ms := int((sec - floor(sec)) * 1000.0)
	return "%02d:%02d.%03d" % [m, s, ms]


static func season_flags_total(season: Dictionary) -> int:
	return season.events.size() * 2
