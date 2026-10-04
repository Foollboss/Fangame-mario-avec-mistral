class_name HeroData
extends RefCounted
## Fiches des héros pour l'écran « Personnages ».

const HEROES: = {
	"kaelith": {
		"title": "Le Voyageur des Ondes", "element": "Hydro", "elem_id": "hydro", "weapon": "Catalyseur", "stars": 5,
		"lore": "Venu d'au-delà des mers, Kaelith lit les courants comme d'autres lisent les livres. Son grimoire flottant garde la mémoire de chaque vague qu'il a croisée.",
		"talents": [
			["na", "Attaque normale", "Lames d'Écume", "Projette jusqu'à trois lames d'eau qui filent vers l'ennemi le plus proche. Le troisième coup en lance trois en éventail."],
			["skill", "Compétence élémentaire", "Vortex des Marées", "Fait naître un tourbillon qui aspire les ennemis et inflige des dégâts Hydro répétés. Toucher plusieurs ennemis réduit le temps de recharge (« Écho des flots »)."],
			["burst", "Déchaînement élémentaire", "Raz-de-Marée", "Libère une immense vague circulaire infligeant de lourds dégâts Hydro de zone et rend 30 % de leurs PV à tous les membres de l'équipe."],
			["passive", "Aptitude passive", "Grimoire des Courants", "Le grimoire flottant de Kaelith l'accompagne en permanence et canalise ses sorts à distance."],
		],
	},
	"lyra": {
		"title": "L'Éclair des Hautes Terres", "element": "Électro", "elem_id": "electro", "weapon": "Épée à une main", "stars": 5,
		"lore": "Escrimeuse des plateaux azur, Lyra frappe avant que le tonnerre ne gronde. On dit que les orages se taisent quand elle dégaine.",
		"talents": [
			["na", "Attaque normale", "Lame Fulgurante", "Enchaîne jusqu'à trois coups d'épée chargés d'électricité ; le dernier, vertical, est le plus puissant."],
			["skill", "Compétence élémentaire", "Décharge Céleste", "Plante sa lame dans le sol et libère une décharge circulaire qui étourdit les ennemis proches et génère beaucoup d'énergie."],
			["burst", "Déchaînement élémentaire", "Tempête Azur", "Invoque un orage pendant 8 s : la foudre frappe les ennemis autour d'elle et la vitesse d'attaque de l'équipe augmente de 30 %."],
			["passive", "Aptitude passive", "Conduction", "Les dégâts Électro de Lyra rendent régulièrement de l'énergie élémentaire à toute l'équipe."],
		],
	},
	"kael": {
		"title": "Le Porte-Flamme d'Azhara", "element": "Pyro", "elem_id": "pyro", "weapon": "Épée à une main", "stars": 5,
		"lore": "Dernier gardien du foyer d'Azhara, Kael porte une lame qui n'a jamais refroidi. Son tempérament est aussi vif que son feu.",
		"talents": [
			["na", "Attaque normale", "Taille Ardente", "Enchaîne jusqu'à quatre coups rapides ; le quatrième est un estoc enflammé qui transperce les ennemis alignés."],
			["skill", "Compétence élémentaire", "Vague de Flammes", "Une taille ascendante projette une onde de feu qui avance en ligne droite et enflamme tout sur son passage."],
			["burst", "Déchaînement élémentaire", "Brasier", "Kael s'embrase pendant 10 s : ses dégâts augmentent de 25 % et ses attaques sont plus rapides."],
			["passive", "Aptitude passive", "Cœur ardent", "Quand il est touché, Kael gagne 20 % d'ATQ pendant 6 s et récupère 4 % de ses PV max."],
		],
	},
	"zahara": {
		"title": "La Gardienne de la Lave", "element": "Lave", "elem_id": "lava", "weapon": "Bâton", "stars": 5,
		"lore": "Née au pied du volcan, Zahara parle aux coulées de magma. Son bâton de basalte peut fendre la roche… ou la faire fondre.",
		"talents": [
			["na", "Attaque normale", "Frappe Volcanique", "Trois coups de bâton puissants ; chaque impact projette des éclats de lave, et le troisième frappe le sol en onde de choc."],
			["skill", "Compétence élémentaire", "Torrent de Magma", "Frappe le sol et ouvre une coulée de lave en ligne droite qui brûle les ennemis pendant plusieurs secondes."],
			["burst", "Déchaînement élémentaire", "Éruption", "Bondit et plante son bâton : des geysers de lave jaillissent, infligent d'énormes dégâts et réduisent la résistance des ennemis."],
			["passive", "Aptitude passive", "Cœur de volcan", "Quand elle est touchée, Zahara gagne 25 % d'ATQ et récupère 5 % de ses PV max."],
		],
	},
}

const ORDER: = ["kaelith", "lyra", "kael", "zahara"]

static func elem_color(id: String) -> Color:
	return FX.element_color(id)
