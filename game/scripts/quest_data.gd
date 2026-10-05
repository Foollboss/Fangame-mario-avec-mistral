class_name QuestData
extends RefCounted
## Quêtes de la v8 (moteur générique de quests.gd).
## Étapes : collect (objet en poche), deliver (rapporter à un PNJ), talk, cook, kill (région), relics
## (objets à ramasser dans un domaine ou dans le monde), event (évènement scénarisé).
## Lignes de dialogue : [qui, texte] (qui = identifiant de PNJ ou de héros).

const ORDER: = ["main2", "q_recolte", "q_festin", "q_jonc_marais", "q_jonc_soupe", "q_jonc_carnet",
	"q_forge_piments", "q_forge_magma", "q_forge_coeurs", "q_vent_lys", "q_vent_vigie", "q_vent_chant"]

const DEFS: = {
	"main2": {"title": "Les Échos lointains", "type": "main", "giver": "elder", "req": {"main": 3},
		"start": [["elder", "Voyageurs… Trois messages sont arrivés ce matin, portés par les oiseaux des autres îles."],
			["elder", "Joncbourg, au Marais d'Émeraude. Forgeval, sur les Terres de Braise. Et Hautevent, sur les Falaises de l'Orage."],
			["elder", "Tous disent la même chose : depuis le réveil du Pic, les Échos d'Aetheria résonnent jusque chez eux."],
			["kaelith", "Les Échos… Ce sont eux qui nous ont guidés jusqu'ici."],
			["elder", "Allez voir leurs chefs. Ondine, Brann et Aeris sauront vous en dire plus."]],
		"steps": [
			{"do": "talk", "npc": "j_chief", "obj": "Rencontre la Doyenne Ondine à Joncbourg",
				"lines": [["j_chief", "Bienvenue à Joncbourg, voyageurs. Ici, le marais murmure depuis des semaines."],
					["j_chief", "Les nuits sans lune, les eaux brillent comme des étoiles. Les anciens appelaient ça « l'Écho de l'Onde »."],
					["kaelith", "L'Onde… Comme le premier Sceau. Tout est lié."],
					["j_chief", "Allez voir Maître Brann, à Forgeval. Son feu, lui aussi, a changé de couleur."]]},
			{"do": "talk", "npc": "f_chief", "obj": "Rencontre Maître Brann à Forgeval",
				"lines": [["f_chief", "Hm. Des aventuriers. Vous tombez bien : mon enclume chante toute seule la nuit."],
					["f_chief", "Le volcan respire au même rythme que le Pic Givré. Comme un cœur qui bat en deux endroits."],
					["zahara", "Je l'ai senti aussi. La lave a une voix, sous Forgeval."],
					["f_chief", "Allez à Hautevent. Aeris lit les vents : elle saura ce que ça veut dire."]]},
			{"do": "talk", "npc": "h_chief", "obj": "Rencontre la Sage Aeris à Hautevent",
				"lines": [["h_chief", "Je vous attendais. Le vent m'a parlé de quatre étoiles venues de la mer."],
					["h_chief", "L'Onde, la Flamme, la Terre et la Foudre : quatre Échos, et vous êtes quatre."],
					["lyra", "…Ça fait beaucoup de coïncidences, non ?"],
					["h_chief", "Il n'y a pas de coïncidence sur Aetheria. Retournez voir Maëlys : dites-lui que les trois villages sont avec vous."]]},
			{"do": "talk", "npc": "elder", "obj": "Retourne voir l'Ancienne Maëlys à Brise-Marée",
				"lines": [["elder", "Joncbourg, Forgeval et Hautevent… Tous unis. Cela n'était pas arrivé depuis cent ans."],
					["elder", "Les Échos vous ont choisis. Quoi qu'il arrive, Aetheria ne sera plus jamais seule."],
					["kael", "Alors on continue. Ensemble."]]}],
		"reward": {"xp": 800, "mora": 3000, "shards": 200, "cine": "trois_villages"}},

	"q_recolte": {"title": "La récolte de Mireille", "type": "side", "giver": "grocer", "req": {"main": 1},
		"start": [["grocer", "Bonjour ! Mes étals sont vides… Les soleillettes de la Prairie sont mûres, mais je n'ai plus l'âge de grimper aux arbres."],
			["lyra", "Pas besoin de grimper : on frappe le tronc et les fruits tombent tout seuls !"],
			["grocer", "Ha ha ! Alors rapportez-m'en cinq, je vous paierai bien."]],
		"steps": [
			{"do": "collect", "item": "soleillette", "n": 5, "obj": "Fais tomber 5 soleillettes (frappe les arbres fruitiers de la Prairie)"},
			{"do": "deliver", "npc": "grocer", "item": "soleillette", "n": 5, "obj": "Rapporte les soleillettes à Mireille",
				"lines": [["grocer", "Magnifiques ! Elles sentent le soleil."], ["grocer", "Voici votre paiement, et deux jus bien frais en prime."]]}],
		"reward": {"xp": 120, "mora": 600, "items": {"jus": 2}}},

	"q_festin": {"title": "Premier festin", "type": "side", "giver": "cook", "req": {"quest": "apples"},
		"start": [["cook", "Dites, vous avez déjà cuisiné ? Une aventure, ça se mène le ventre plein !"],
			["cook", "Il y a une marmite près du puits. Choisissez une recette, et arrêtez la cuisson pile dans la zone dorée."],
			["kael", "Si c'est trop cuit, je m'en charge : j'aime quand c'est grillé."]],
		"steps": [
			{"do": "cook", "item": "", "n": 1, "obj": "Cuisine un plat à une marmite"},
			{"do": "talk", "npc": "cook", "obj": "Montre ton plat à Chef Tino",
				"lines": [["cook", "Hmm… Voyons voir… C'est bon, ça ! Vous avez le coup de main."],
					["cook", "Tenez, ma recette d'omelette aux champignons. Elle soigne toute l'équipe d'un coup."]]}],
		"reward": {"xp": 150, "mora": 500, "recipe": "omelette"}},

	"q_jonc_marais": {"title": "Les marais envahis", "type": "side", "giver": "j_chief", "req": {"main": 1},
		"start": [["j_chief", "Les monstres sont de plus en plus nombreux dans le marais. Nos pêcheurs n'osent plus sortir."],
			["j_chief", "Si vous pouviez en chasser une huitaine, Joncbourg vous en serait reconnaissant."]],
		"steps": [
			{"do": "kill", "region": "marais", "n": 8, "obj": "Vaincs des monstres dans le Marais d'Émeraude"},
			{"do": "talk", "npc": "j_chief", "obj": "Retourne voir la Doyenne Ondine",
				"lines": [["j_chief", "Les barques sont déjà sorties ! Merci, voyageurs."], ["j_chief", "Prenez ce thé de lotus, il apaise même les plus gros coups."]]}],
		"reward": {"xp": 300, "mora": 1200, "items": {"the_lotus": 2}}},

	"q_jonc_soupe": {"title": "La soupe du pêcheur", "type": "side", "giver": "j_cook", "req": {"main": 1},
		"start": [["j_cook", "Ah, des visages nouveaux ! Vous connaissez la soupe de poisson du marais ?"],
			["j_cook", "Voici ma recette. Le poisson se trouve au comptoir de Mirelle, et le lotus pousse au bord de l'eau."],
			["j_cook", "Cuisinez-en une à la marmite, et apportez-la-moi : je veux voir si vous avez la main !"]],
		"start_reward": {"recipe": "soupe"},
		"steps": [
			{"do": "cook", "item": "soupe", "n": 1, "obj": "Cuisine une Soupe de poisson du marais"},
			{"do": "deliver", "npc": "j_cook", "item": "soupe", "n": 1, "obj": "Apporte la soupe au Chef Gaspard",
				"lines": [["j_cook", "*slurp* … Par toutes les grenouilles ! Elle est parfaite !"], ["j_cook", "Vous êtes ici chez vous. Voici pour la peine."]]}],
		"reward": {"xp": 250, "mora": 900, "items": {"poisson": 3}}},

	"q_jonc_carnet": {"title": "Le carnet de Basile", "type": "side", "giver": "j_herb", "req": {"rank": 5},
		"start": [["j_herb", "Mon frère Basile est parti explorer le Repaire des Masques il y a trois jours… Il n'est jamais revenu."],
			["j_herb", "Il emporte toujours son carnet. S'il a eu des ennuis, il en aura semé les pages pour qu'on le retrouve."],
			["kaelith", "On va le chercher. Le Repaire est un domaine, au nord-est du marais."]],
		"steps": [
			{"do": "relics", "item": "page_carnet", "n": 3, "domain": "masques", "obj": "Retrouve les pages du carnet dans le Repaire des Masques"},
			{"do": "event", "event": "basile_free", "domain": "masques", "obj": "Libère Basile, enfermé dans la dernière salle du Repaire"},
			{"do": "deliver", "npc": "j_herb", "item": "page_carnet", "n": 3, "obj": "Rapporte le carnet à l'Herboriste Lise",
				"lines": [["j_herb", "Basile est rentré ! Et il ne parle que de vous !"], ["j_herb", "Son carnet est complet… Merci, du fond du cœur."],
					["j_herb", "Prenez ces gâteaux aux cerises : ils remettraient sur pied un héros à terre."]]}],
		"reward": {"xp": 600, "mora": 2000, "items": {"gateau": 2}}},

	"q_forge_piments": {"title": "Piquant !", "type": "side", "giver": "f_cook", "req": {"main": 1},
		"start": [["f_cook", "Vous savez ce qui manque à Forgeval ? Du piquant ! Mes brochettes sont fades."],
			["f_cook", "Les piments de braise poussent sur la cendre chaude, près des coulées de lave. Rapportez-m'en six !"]],
		"steps": [
			{"do": "collect", "item": "piment", "n": 6, "obj": "Cueille 6 Piments de braise sur les Terres de Braise"},
			{"do": "deliver", "npc": "f_cook", "item": "piment", "n": 6, "obj": "Rapporte les piments au Chef Pyros",
				"lines": [["f_cook", "Ouh ! Rien qu'à l'odeur, j'ai les yeux qui pleurent. Parfait !"],
					["f_cook", "Tenez, la recette de ma Brochette ardente. Ça donne une de ces forces !"]]}],
		"reward": {"xp": 220, "mora": 800, "recipe": "brochette_ardente"}},

	"q_forge_magma": {"title": "Les gardiens de magma", "type": "side", "giver": "f_chief", "req": {"main": 1},
		"start": [["f_chief", "Les créatures de lave descendent du volcan et bloquent la route du minerai."],
			["f_chief", "Abattez-en dix. Mon marteau vous en sera reconnaissant."]],
		"steps": [
			{"do": "kill", "region": "braise", "n": 10, "obj": "Vaincs des monstres sur les Terres de Braise"},
			{"do": "talk", "npc": "f_chief", "obj": "Retourne voir Maître Brann",
				"lines": [["f_chief", "Les chariots repassent. Bon travail."], ["f_chief", "Mangez un ragoût, vous l'avez gagné."]]}],
		"reward": {"xp": 350, "mora": 1500, "items": {"ragout": 2}}},

	"q_forge_coeurs": {"title": "Le feu de la grande forge", "type": "side", "giver": "f_kid", "req": {"rank": 10},
		"start": [["f_kid", "Psst ! La grande forge du village s'éteint petit à petit… Maître Brann fait comme si de rien n'était."],
			["f_kid", "Il faudrait des Cœurs de braise, des pierres qui brûlent pour toujours. Il y en a dans la Forge d'Ignis !"],
			["zahara", "Le domaine du volcan… Allons-y. Je n'aime pas qu'un feu s'éteigne."]],
		"steps": [
			{"do": "relics", "item": "coeur_braise", "n": 3, "domain": "forge", "obj": "Récupère 3 Cœurs de braise dans la Forge d'Ignis"},
			{"do": "deliver", "npc": "f_chief", "item": "coeur_braise", "n": 3, "obj": "Apporte les Cœurs de braise à Maître Brann",
				"lines": [["f_chief", "Des Cœurs de braise ?! Cendre vous a parlé, hein…"], ["f_chief", "Bon. Regardez bien. Ça n'arrive qu'une fois par siècle."]]}],
		"reward": {"xp": 800, "mora": 2500, "items": {"brochette_ardente": 3}, "cine": "forge_rekindle"}},

	"q_vent_lys": {"title": "Les lys des falaises", "type": "side", "giver": "h_cook", "req": {"main": 1},
		"start": [["h_cook", "Mes petits, ma galette des vents a besoin de lys des vents, et mes vieilles jambes ne grimpent plus."],
			["h_cook", "Ils fleurissent tout en haut, là où le vent souffle fort. Rapportez-m'en cinq, je vous apprendrai la recette."]],
		"steps": [
			{"do": "collect", "item": "lys_vent", "n": 5, "obj": "Cueille 5 Lys des vents sur les Falaises de l'Orage"},
			{"do": "deliver", "npc": "h_cook", "item": "lys_vent", "n": 5, "obj": "Rapporte les lys à Mamie Brise",
				"lines": [["h_cook", "Qu'ils sont beaux ! Ils sentent la pluie et le ciel."], ["h_cook", "Voilà ma recette. Une bouchée, et vous grimperez sans vous fatiguer !"]]}],
		"reward": {"xp": 250, "mora": 900, "recipe": "galette"}},

	"q_vent_vigie": {"title": "Les feux de vigie", "type": "side", "giver": "h_scout", "req": {"main": 1},
		"start": [["h_scout", "Les feux de vigie de l'île sont éteints depuis la tempête. Sans eux, les bateaux se perdent."],
			["h_scout", "Il y en a trois, tout en haut : sur l'aiguille rocheuse, sur la plus haute falaise, et sur le moulin du village."],
			["lyra", "Il va falloir grimper… J'adore."]],
		"steps": [
			{"do": "beacons", "n": 3, "obj": "Rallume les 3 feux de vigie (en hauteur)"},
			{"do": "talk", "npc": "h_scout", "obj": "Retourne voir Sylve à Hautevent",
				"lines": [["h_scout", "Je les vois d'ici ! Les trois brillent comme des étoiles."], ["h_scout", "Merci. Tenez, des galettes : elles rendent léger comme le vent."]]}],
		"reward": {"xp": 400, "mora": 1500, "items": {"galette": 2}}},

	"q_vent_chant": {"title": "Le chant du Sanctuaire", "type": "side", "giver": "h_chief", "req": {"rank": 18},
		"start": [["h_chief", "Au cœur du Sanctuaire Céleste, trois pierres d'écho chantaient autrefois. Elles se sont tues."],
			["h_chief", "Recueillez leurs notes, puis parlez à l'esprit qui veille au fond du sanctuaire."]],
		"steps": [
			{"do": "relics", "item": "note_celeste", "n": 3, "domain": "celeste", "obj": "Recueille 3 Notes célestes auprès des pierres d'écho"},
			{"do": "event", "event": "esprit_talk", "domain": "celeste", "obj": "Parle à l'Esprit céleste, au fond du Sanctuaire"},
			{"do": "deliver", "npc": "h_chief", "item": "note_celeste", "n": 3, "obj": "Rapporte les Notes célestes à la Sage Aeris",
				"lines": [["h_chief", "Écoutez… Le vent chante à nouveau. Vous avez rendu sa voix au Sanctuaire."], ["h_chief", "Aetheria vous remercie."]]}],
		"reward": {"xp": 1000, "mora": 3000, "shards": 200, "items": {"sorbet": 3}}},
}

## Emplacements des reliques dans les domaines (coordonnées locales du domaine, une par salle).
const DOMAIN_RELICS: = [Vector3(-10, 0, 8), Vector3(11, 0, 46), Vector3(-14, 0, 92)]
