class_name CarsDB
## Base de données des voitures (statistiques de jeu).
## Les modèles 3D sont générés par blender/build_cars.py (même identifiant).

const CLASSES := ["D", "C", "B", "A", "S"]

const CLASS_COLORS := {
	"D": Color("#9aa3b2"), "C": Color("#3fbf6a"), "B": Color("#3a8bff"),
	"A": Color("#b44dff"), "S": Color("#ffb400"),
}

## Plans nécessaires : [déblocage (1★), 2★, 3★]
const BLUEPRINTS := {
	"D": [5, 8, 12], "C": [10, 15, 20], "B": [15, 20, 30], "A": [20, 30, 40], "S": [25, 40, 50],
}

## Coût de base d'une amélioration (crédits)
const UPGRADE_COST := {"D": 1800, "C": 3500, "B": 7000, "A": 14000, "S": 28000}

## Prix en jetons pour acheter directement une voiture (boutique)
const TOKEN_PRICE := {"D": 150, "C": 400, "B": 900, "A": 1800, "S": 3500}

const LEVELS_PER_STAR := 4
const MAX_STARS := 3

## top/acc/han/nit : [base, max]. rank : [base, max]
const CARS := [
	{"id": "lancer_evo", "brand": "MITSUBISHI", "model": "LANCER EVOLUTION", "cls": "D", "free": true,
	 "top": [250.0, 291.0], "acc": [42.4, 58.0], "han": [46.3, 60.0], "nit": [54.8, 68.0], "rank": [467, 728],
	 "engine": "4cyl", "color": "#1f4fd1"},
	{"id": "cla", "brand": "MERCEDES-BENZ", "model": "CLA 45", "cls": "D", "free": true,
	 "top": [252.0, 290.0], "acc": [44.0, 57.0], "han": [48.0, 61.0], "nit": [50.0, 64.0], "rank": [470, 720],
	 "engine": "4cyl", "color": "#3a3d44"},
	{"id": "z4", "brand": "BMW", "model": "Z4 LCI E89", "cls": "D",
	 "top": [256.0, 296.0], "acc": [47.0, 60.0], "han": [51.0, 63.0], "nit": [45.0, 60.0], "rank": [518, 793],
	 "engine": "4cyl", "color": "#b3121b"},
	{"id": "camaro_lt", "brand": "CHEVROLET", "model": "CAMARO LT", "cls": "D",
	 "top": [262.0, 302.0], "acc": [46.0, 59.0], "han": [42.0, 55.0], "nit": [50.0, 63.0], "rank": [556, 910],
	 "engine": "v8", "color": "#f2c500"},
	{"id": "nismo_370z", "brand": "NISSAN", "model": "370Z NISMO", "cls": "D",
	 "top": [266.0, 305.0], "acc": [49.0, 62.0], "han": [52.0, 64.0], "nit": [48.0, 62.0], "rank": [620, 991],
	 "engine": "v8", "color": "#e9ecef"},
	{"id": "leaf_rc", "brand": "NISSAN", "model": "LEAF NISMO RC", "cls": "D",
	 "top": [255.0, 295.0], "acc": [53.0, 66.0], "han": [55.0, 67.0], "nit": [46.0, 60.0], "rank": [511, 761],
	 "engine": "electric", "color": "#f4f6f8"},
	{"id": "xbow_gtx", "brand": "KTM", "model": "X-BOW GTX", "cls": "D",
	 "top": [270.0, 312.0], "acc": [55.0, 68.0], "han": [58.0, 70.0], "nit": [50.0, 64.0], "rank": [662, 1042],
	 "engine": "4cyl", "color": "#ff6a00"},
	{"id": "p3008", "brand": "PEUGEOT", "model": "3008", "cls": "C", "free": true,
	 "top": [263.0, 305.0], "acc": [45.0, 60.0], "han": [50.0, 62.0], "nit": [52.0, 66.0], "rank": [800, 1150],
	 "engine": "4cyl", "color": "#55585f"},
	{"id": "mustang_gt", "brand": "FORD", "model": "MUSTANG GT", "cls": "C",
	 "top": [282.0, 322.0], "acc": [52.0, 64.0], "han": [50.0, 62.0], "nit": [55.0, 67.0], "rank": [850, 1230],
	 "engine": "v8", "color": "#1c2a4a"},
	{"id": "cayman_gt4", "brand": "PORSCHE", "model": "718 CAYMAN GT4", "cls": "C",
	 "top": [290.0, 330.0], "acc": [56.0, 68.0], "han": [62.0, 73.0], "nit": [52.0, 65.0], "rank": [900, 1300],
	 "engine": "v8", "color": "#e2b100"},
	{"id": "alpine_a110", "brand": "ALPINE", "model": "A110", "cls": "C",
	 "top": [285.0, 326.0], "acc": [58.0, 70.0], "han": [64.0, 75.0], "nit": [50.0, 64.0], "rank": [880, 1280],
	 "engine": "4cyl", "color": "#1a5fc2"},
	{"id": "m5", "brand": "BMW", "model": "M5", "cls": "B", "free": true,
	 "top": [305.0, 346.0], "acc": [60.0, 72.0], "han": [56.0, 68.0], "nit": [58.0, 70.0], "rank": [1250, 1700],
	 "engine": "v8", "color": "#0b0c10"},
	{"id": "gtr_nismo", "brand": "NISSAN", "model": "GT-R NISMO", "cls": "B",
	 "top": [315.0, 356.0], "acc": [66.0, 76.0], "han": [60.0, 71.0], "nit": [60.0, 72.0], "rank": [1320, 1780],
	 "engine": "v8", "color": "#8f949b"},
	{"id": "amg_gt", "brand": "MERCEDES-AMG", "model": "GT", "cls": "B",
	 "top": [318.0, 360.0], "acc": [63.0, 74.0], "han": [62.0, 72.0], "nit": [62.0, 73.0], "rank": [1350, 1820],
	 "engine": "v8", "color": "#b7bcc4"},
	{"id": "gt3_rs", "brand": "PORSCHE", "model": "911 GT3 RS", "cls": "B",
	 "top": [312.0, 352.0], "acc": [68.0, 78.0], "han": [70.0, 80.0], "nit": [58.0, 70.0], "rank": [1380, 1860],
	 "engine": "v8", "color": "#2fbf71"},
	{"id": "huracan_evo", "brand": "LAMBORGHINI", "model": "HURACÁN EVO", "cls": "A",
	 "top": [335.0, 378.0], "acc": [72.0, 82.0], "han": [70.0, 80.0], "nit": [66.0, 77.0], "rank": [1900, 2500],
	 "engine": "v8", "color": "#7bd400"},
	{"id": "f8_tributo", "brand": "FERRARI", "model": "F8 TRIBUTO", "cls": "A",
	 "top": [340.0, 384.0], "acc": [74.0, 84.0], "han": [68.0, 79.0], "nit": [68.0, 78.0], "rank": [1950, 2560],
	 "engine": "v8", "color": "#c00d0d"},
	{"id": "mclaren_720s", "brand": "MCLAREN", "model": "720S", "cls": "A",
	 "top": [345.0, 390.0], "acc": [76.0, 85.0], "han": [69.0, 79.0], "nit": [70.0, 80.0], "rank": [2000, 2620],
	 "engine": "v8", "color": "#ff7a1a"},
	{"id": "ford_gt", "brand": "FORD", "model": "GT", "cls": "A",
	 "top": [348.0, 392.0], "acc": [72.0, 82.0], "han": [66.0, 77.0], "nit": [74.0, 83.0], "rank": [2020, 2650],
	 "engine": "v8", "color": "#0d47a1"},
	{"id": "jesko", "brand": "KOENIGSEGG", "model": "JESKO", "cls": "S",
	 "top": [400.0, 455.0], "acc": [82.0, 92.0], "han": [74.0, 84.0], "nit": [80.0, 90.0], "rank": [2900, 3700],
	 "engine": "v8", "color": "#e6e8ec"},
	{"id": "chiron", "brand": "BUGATTI", "model": "CHIRON", "cls": "S",
	 "top": [405.0, 460.0], "acc": [80.0, 90.0], "han": [70.0, 80.0], "nit": [84.0, 94.0], "rank": [2950, 3750],
	 "engine": "v8", "color": "#0b2a6b"},
]

const TRAFFIC_MODELS := ["t_sedan", "t_sedan", "t_suv", "t_hatch", "t_hatch", "t_van", "t_taxi", "t_bus"]

const PAINTS := ["#1f4fd1", "#b3121b", "#f2c500", "#0b0c10", "#e9ecef", "#3a3d44", "#2fbf71", "#ff6a00",
	"#7b2cff", "#ff2fa0", "#00c2d1", "#8f949b", "#0b2a6b", "#7bd400", "#c48a1e", "#55585f"]

static var _by_id := {}


static func all() -> Array:
	return CARS


static func get_car(id: String) -> Dictionary:
	if _by_id.is_empty():
		for c in CARS:
			_by_id[c.id] = c
	return _by_id.get(id, CARS[0])


static func cars_of_class(cls: String) -> Array:
	var out := []
	for c in CARS:
		if c.cls == cls:
			out.append(c)
	return out


static func class_index(cls: String) -> int:
	return CLASSES.find(cls)


static func max_level() -> int:
	return LEVELS_PER_STAR * MAX_STARS


## Valeur interpolée d'une statistique selon le niveau d'amélioration (0..max_level)
static func stat(car: Dictionary, key: String, level: int) -> float:
	var r: Array = car[key]
	var t := clampf(float(level) / float(max_level()), 0.0, 1.0)
	return lerpf(r[0], r[1], t)


static func rank(car: Dictionary, level: int) -> int:
	var r: Array = car.rank
	var t := clampf(float(level) / float(max_level()), 0.0, 1.0)
	return int(round(lerpf(r[0], r[1], t)))


static func upgrade_cost(car: Dictionary, level: int) -> int:
	return int(UPGRADE_COST[car.cls] * (1.0 + level * 0.45))


static func blueprints_needed(car: Dictionary, stars: int) -> int:
	## stars = nombre d'étoiles actuel (0 = non débloquée). Retourne le nombre pour l'étoile suivante.
	var arr: Array = BLUEPRINTS[car.cls]
	if stars >= arr.size():
		return 0
	return arr[stars]


static func display_name(car: Dictionary) -> String:
	return car.brand + " " + car.model
