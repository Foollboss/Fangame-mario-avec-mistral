class_name Shops
extends RefCounted
## Boutiques des villages : articles [id, prix en Mora] et recettes à acheter.

const DEFS: = {
	"bm_epicerie": {"name": "Épicerie de Brise-Marée", "owner": "grocer",
		"items": [["pomme", 20], ["soleillette", 20], ["menthe", 15], ["champignon", 20], ["viande", 45], ["oeuf", 30], ["farine", 25],
			["lait", 30], ["beurre", 35], ["sucre", 25], ["sel", 15]],
		"recipes": [["omelette", 500], ["ragout", 600]]},
	"bm_tino": {"name": "Le Bon Vent, chez Tino", "owner": "cook",
		"items": [["tarte", 250], ["brochette", 160], ["salade", 140], ["jus", 120]],
		"recipes": [["gateau", 800]]},
	"jonc_epicerie": {"name": "Comptoir des pêcheurs", "owner": "j_grocer",
		"items": [["poisson", 45], ["lotus", 30], ["champignon", 20], ["oeuf", 30], ["lait", 30], ["sucre", 25], ["sel", 15], ["farine", 25]],
		"recipes": [["soupe", 700], ["the_lotus", 650]]},
	"jonc_cuisine": {"name": "Marmite du Marais", "owner": "j_cook",
		"items": [["soupe", 300], ["the_lotus", 260], ["brochette", 160], ["omelette", 240]], "recipes": []},
	"forge_epicerie": {"name": "Halle aux braises", "owner": "f_grocer",
		"items": [["viande", 45], ["piment", 30], ["farine", 25], ["beurre", 35], ["sel", 15], ["oeuf", 30], ["sucre", 25]],
		"recipes": [["brochette_ardente", 900]]},
	"forge_cuisine": {"name": "Grill de l'Enclume", "owner": "f_cook",
		"items": [["brochette_ardente", 380], ["ragout", 280], ["brochette", 160], ["jus", 120]], "recipes": []},
	"vent_epicerie": {"name": "Échoppe des Vents", "owner": "h_grocer",
		"items": [["lys_vent", 35], ["baie_givre", 35], ["lait", 30], ["farine", 25], ["sucre", 25], ["oeuf", 30], ["sel", 15]],
		"recipes": [["galette", 900], ["sorbet", 700]]},
	"vent_cuisine": {"name": "Le Nid de Mamie Brise", "owner": "h_cook",
		"items": [["galette", 380], ["sorbet", 280], ["salade", 140], ["jus", 120]], "recipes": []},
}

static func shop_of(npc: String) -> String:
	for id in DEFS:
		if DEFS[id].owner == npc: return id
	return ""
