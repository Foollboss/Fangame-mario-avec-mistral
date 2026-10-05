class_name Items
extends RefCounted
## Catalogue des objets : ingrédients (cueillis ou achetés), plats cuisinés et objets de quête.
## Les icônes sont dans res://ui/items/<id>.png (générées par tools/make_item_icons.py).

const CATS: = ["food", "ingredient", "material"]
const CAT_NAMES: = {"food": "Nourriture", "ingredient": "Ingrédients", "material": "Matériaux", "treasure": "Trésors"}

## effets des plats : heal (% PV du héros actif), heal_all (% PV de l'équipe), revive (% PV), stamina (endurance rendue),
## atk (% d'attaque, durée), stam_save (% d'endurance économisée, durée), guard (% de dégâts en moins, durée)
const DEFS: = {
	# --- ingrédients cueillis
	"pomme": {"name": "Pomme", "cat": "ingredient", "stars": 1, "price": 15,
		"desc": "Fruit croquant des pommiers. Frappe un arbre fruitier pour faire tomber ses fruits."},
	"soleillette": {"name": "Soleillette", "cat": "ingredient", "stars": 1, "price": 15,
		"desc": "Fruit orangé et sucré qui pousse dans les arbres de la Prairie des Échos."},
	"cerise": {"name": "Cerise d'Aetheria", "cat": "ingredient", "stars": 1, "price": 20,
		"desc": "Petites cerises roses des arbres de la Vallée des Cerisiers."},
	"baie_givre": {"name": "Baie givrée", "cat": "ingredient", "stars": 2, "price": 25,
		"desc": "Baie bleue et glacée cueillie dans les sapins des hauteurs et du Pic Givré."},
	"menthe": {"name": "Menthe", "cat": "ingredient", "stars": 1, "price": 10,
		"desc": "Feuilles fraîches qui poussent dans l'herbe. Parfaite pour les salades."},
	"champignon": {"name": "Champignon", "cat": "ingredient", "stars": 1, "price": 12,
		"desc": "Champignon des sous-bois de la Forêt d'Automne."},
	"lotus": {"name": "Graine de lotus", "cat": "ingredient", "stars": 2, "price": 20,
		"desc": "Spécialité du Marais d'Émeraude : les lotus poussent au bord de l'eau."},
	"piment": {"name": "Piment de braise", "cat": "ingredient", "stars": 2, "price": 20,
		"desc": "Spécialité des Terres de Braise. Il pousse sur la cendre chaude, près des coulées de lave."},
	"lys_vent": {"name": "Lys des vents", "cat": "ingredient", "stars": 2, "price": 25,
		"desc": "Spécialité des Falaises de l'Orage. Il fleurit en hauteur, là où souffle le vent."},
	# --- ingrédients achetés
	"viande": {"name": "Viande crue", "cat": "ingredient", "stars": 1, "price": 40, "desc": "Viande fraîche de l'épicerie."},
	"poisson": {"name": "Poisson frais", "cat": "ingredient", "stars": 1, "price": 40, "desc": "Pêché le matin même dans le marais."},
	"oeuf": {"name": "Œuf", "cat": "ingredient", "stars": 1, "price": 25, "desc": "Un bel œuf de ferme."},
	"farine": {"name": "Farine", "cat": "ingredient", "stars": 1, "price": 20, "desc": "Farine de blé moulue au moulin de Brise-Marée."},
	"lait": {"name": "Lait", "cat": "ingredient", "stars": 1, "price": 25, "desc": "Lait frais."},
	"beurre": {"name": "Beurre", "cat": "ingredient", "stars": 1, "price": 30, "desc": "Beurre doux, indispensable en pâtisserie."},
	"sucre": {"name": "Sucre", "cat": "ingredient", "stars": 1, "price": 20, "desc": "Sucre blanc."},
	"sel": {"name": "Sel", "cat": "ingredient", "stars": 1, "price": 10, "desc": "Sel de mer récolté sur la plage."},
	# --- plats
	"tarte": {"name": "Tarte aux pommes solaires", "cat": "food", "stars": 3, "price": 180, "effect": ["heal", 35.0],
		"desc": "Spécialité du Chef Tino. Rend 35 % de ses PV max au héros actif."},
	"brochette": {"name": "Brochettes de viande", "cat": "food", "stars": 2, "price": 120, "effect": ["heal", 25.0],
		"desc": "Simples et nourrissantes. Rend 25 % de ses PV max au héros actif."},
	"salade": {"name": "Salade à la menthe", "cat": "food", "stars": 2, "price": 100, "effect": ["stam_save", 25.0, 150.0],
		"desc": "Fraîcheur garantie : l'équipe consomme 25 % d'endurance en moins pendant 150 s."},
	"jus": {"name": "Jus de soleillette", "cat": "food", "stars": 2, "price": 90, "effect": ["stamina", 60.0],
		"desc": "Rend aussitôt 60 points d'endurance. Idéal en pleine escalade ou à la nage !"},
	"omelette": {"name": "Omelette aux champignons", "cat": "food", "stars": 3, "price": 200, "effect": ["heal_all", 25.0],
		"desc": "Rend 25 % de leurs PV max à tous les héros de l'équipe."},
	"ragout": {"name": "Ragoût du chasseur", "cat": "food", "stars": 3, "price": 220, "effect": ["atk", 20.0, 150.0],
		"desc": "Plat roboratif : +20 % d'ATQ pour toute l'équipe pendant 150 s."},
	"soupe": {"name": "Soupe de poisson du marais", "cat": "food", "stars": 3, "price": 240, "effect": ["heal_all", 35.0],
		"desc": "Recette de Joncbourg. Rend 35 % de leurs PV max à tous les héros."},
	"the_lotus": {"name": "Thé de lotus", "cat": "food", "stars": 3, "price": 200, "effect": ["guard", 20.0, 150.0],
		"desc": "Apaisant : l'équipe subit 20 % de dégâts en moins pendant 150 s."},
	"brochette_ardente": {"name": "Brochette ardente", "cat": "food", "stars": 4, "price": 300, "effect": ["atk", 30.0, 120.0],
		"desc": "Recette de Forgeval, très épicée : +30 % d'ATQ pour toute l'équipe pendant 120 s."},
	"gateau": {"name": "Gâteau aux cerises", "cat": "food", "stars": 4, "price": 320, "effect": ["revive", 40.0],
		"desc": "Ressuscite un héros K.O. avec 40 % de ses PV (ou soigne le héros actif de 40 %)."},
	"galette": {"name": "Galette des vents", "cat": "food", "stars": 4, "price": 300, "effect": ["stam_save", 35.0, 180.0],
		"desc": "Recette de Hautevent, légère comme l'air : 35 % d'endurance en moins pendant 180 s."},
	"sorbet": {"name": "Sorbet givré", "cat": "food", "stars": 3, "price": 220, "effect": ["heal_stam", 30.0, 40.0],
		"desc": "Rend 30 % de ses PV max au héros actif et 40 points d'endurance."},
	# --- objets de quête
	"page_carnet": {"name": "Page de carnet", "cat": "material", "stars": 3, "price": 0,
		"desc": "Une page du carnet de Basile l'explorateur, couverte de croquis du Repaire des Masques."},
	"coeur_braise": {"name": "Cœur de braise", "cat": "material", "stars": 4, "price": 0,
		"desc": "Une pierre encore brûlante, tirée des conduits de la Forge d'Ignis. Elle pulse comme un cœur."},
	"note_celeste": {"name": "Note céleste", "cat": "material", "stars": 4, "price": 0,
		"desc": "Un fragment de mélodie cristallisé, recueilli auprès d'une pierre d'écho du Sanctuaire Céleste."},
}

## Recettes : ingrédients requis ; "known" = connue dès le début.
const RECIPES: = {
	"brochette": {"ing": {"viande": 2, "sel": 1}, "known": true},
	"salade": {"ing": {"menthe": 2, "pomme": 1}, "known": true},
	"jus": {"ing": {"soleillette": 3, "sucre": 1}, "known": true},
	"tarte": {"ing": {"pomme": 3, "farine": 2, "beurre": 1, "sucre": 1}, "known": true},
	"omelette": {"ing": {"oeuf": 2, "champignon": 2, "beurre": 1}, "known": false},
	"ragout": {"ing": {"viande": 2, "champignon": 1, "sel": 1}, "known": false},
	"gateau": {"ing": {"cerise": 3, "farine": 1, "oeuf": 1, "sucre": 1}, "known": false},
	"soupe": {"ing": {"poisson": 2, "lotus": 1, "sel": 1}, "known": false},
	"the_lotus": {"ing": {"lotus": 2, "sucre": 1}, "known": false},
	"brochette_ardente": {"ing": {"viande": 2, "piment": 2}, "known": false},
	"galette": {"ing": {"farine": 2, "lys_vent": 2, "lait": 1}, "known": false},
	"sorbet": {"ing": {"baie_givre": 2, "lait": 1, "sucre": 1}, "known": false},
}
const RECIPE_ORDER: = ["brochette", "salade", "jus", "tarte", "omelette", "ragout", "gateau", "soupe", "the_lotus", "brochette_ardente", "galette", "sorbet"]

static var _icons: = {}

static func name_of(id: String) -> String:
	return String(DEFS[id].name) if DEFS.has(id) else id

static func cat_of(id: String) -> String:
	return String(DEFS[id].cat) if DEFS.has(id) else ""

static func stars_of(id: String) -> int:
	return int(DEFS[id].stars) if DEFS.has(id) else 1

static func icon(id: String) -> Texture2D:
	if _icons.has(id): return _icons[id]
	var path: = "res://ui/items/%s.png" % id
	var t: Texture2D = load(path) if ResourceLoader.exists(path) else null
	_icons[id] = t
	return t

## Texte court de l'effet d'un plat (qualité « délicieux » = effet ×1,25).
static func effect_text(id: String, mult: = 1.0) -> String:
	if not DEFS.has(id) or not DEFS[id].has("effect"): return ""
	var e: Array = DEFS[id].effect
	match String(e[0]):
		"heal": return "Soigne %d %% (héros actif)" % int(e[1] * mult)
		"heal_all": return "Soigne %d %% (toute l'équipe)" % int(e[1] * mult)
		"revive": return "Ressuscite (%d %% PV)" % int(e[1] * mult)
		"stamina": return "+%d endurance" % int(e[1] * mult)
		"heal_stam": return "Soigne %d %% • +%d endurance" % [int(e[1] * mult), int(e[2] * mult)]
		"atk": return "ATQ +%d %% pendant %d s" % [int(e[1] * mult), int(e[2])]
		"stam_save": return "Endurance −%d %% pendant %d s" % [int(e[1] * mult), int(e[2])]
		"guard": return "Dégâts subis −%d %% pendant %d s" % [int(e[1] * mult), int(e[2])]
	return ""

static func foods() -> Array:
	var out: = []
	for id in DEFS:
		if DEFS[id].cat == "food": out.append(id)
	return out
