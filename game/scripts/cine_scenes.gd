class_name CineScenes
extends RefCounted
## Contenu des cinématiques (voir Cinematic pour le format des étapes).

const HEROES: = ["kaelith", "lyra", "kael", "zahara"]
const BOSS_TITLES: = {
	"roi_slime": ["Roi Slime des Marais", "Souverain du Marais d'Émeraude"],
	"colosse": ["Colosse de Magma", "Cœur ardent de la Caldeira"],
	"tempest": ["Tempestaire", "Esprit de la Foudre"],
}

## Les quatre héros alignés face à la direction dir, centrés sur c.
static func _lineup(c: Vector3, dir: Vector3, w: World, anim: = "Idle") -> Array:
	var out: = []
	var f: = Vector3(dir.x, 0, dir.z).normalized()
	var r: = f.cross(Vector3.UP).normalized()
	var yaw: = atan2(f.x, f.z)
	for i in HEROES.size():
		var p: = c + r * ((i - 1.5) * 1.25) - f * absf(i - 1.5) * 0.35
		p.y = w.height_at(p.x, p.z)
		out.append({"actor": HEROES[i], "hero": HEROES[i], "pos": p, "yaw": yaw, "anim": anim})
	return out

static func build(name: String, m: Node) -> Array:
	var w: World = m.world
	match name:
		"prologue":
			var v: Vector3 = w.village
			var sp: Vector3 = w.spawn_pos
			var to_v: = v - sp;to_v.y = 0
			var steps: Array = [
				{"call": func(): m.cine.fade.color.a = 1.0;m.cine.hide_party()},
				{"cam": [v + Vector3(80, 46, -150), v + Vector3(0, 6, 0)], "to": [v + Vector3(26, 20, -62), v + Vector3(0, 3, 0)], "t": 7.0, "async": true},
				{"fade": [0.0, 1.4]},
				{"title": ["Échos d'Aetheria", "Prologue — L'île aux Échos"], "t": 3.2},
				{"wait": 1.6},
			]
			steps.append_array(_lineup(sp + to_v.normalized() * 2.0, to_v, w))
			var mid: = sp + to_v.normalized() * 2.0
			var face: = atan2(to_v.x, to_v.z)
			steps.append_array([
				{"orbit": mid, "r": 5.2, "h": 1.5, "look_h": 1.25, "a0": face + 0.55, "a1": face + 0.15, "t": 14.0, "async": true},
				{"say": ["kaelith", "Nous y voilà… Aetheria. L'île dont parlent toutes les légendes."], "anim": ["kaelith", "Talk"]},
				{"anim": ["kaelith", "Idle"]},
				{"say": ["lyra", "Ces lueurs au-dessus du pic… Elles nous ont guidés jusqu'ici."], "anim": ["lyra", "Talk"]},
				{"anim": ["lyra", "Idle"]},
				{"say": ["kael", "Le village est juste là. Allons voir s'ils ont besoin d'aide."], "anim": ["kael", "Wave"]},
				{"anim": ["kael", "Idle"]},
				{"say": ["zahara", "La terre gronde sous nos pieds. Restons sur nos gardes."], "anim": ["zahara", "Talk"]},
				{"anim": ["zahara", "Idle"]},
				{"cam": [mid + Vector3(0, 2.2, 0) - to_v.normalized() * 4.0, w.summit + Vector3(0, 8, 0)], "t": 0.0},
				{"call": func(): FX.column(w.summit, Color(0.6, 0.9, 1.0), 4.0, 30.0, 3.0)},
				{"say": ["kaelith", "Là-haut, sur le Pic Givré… Les Échos nous appellent."], "t": 3.6},
				{"fade": [1.0, 0.6]},
				{"call": func():
					m.party.global_position = sp;m.party.visual.rotation.y = face;m.rig.yaw = face + PI},
				{"fade": [0.0, 0.5]},
			])
			return steps
		"gardien":
			var s: Vector3 = w.summit
			return [
				{"orbit": s, "r": 16.0, "h": 7.0, "look_h": 2.5, "a0": 0.2, "a1": 1.2, "t": 5.0, "async": true},
				{"call": func():
					FX.column(s, Color(0.7, 0.95, 1.0), 3.0, 18.0, 2.0)
					FX.particles(s + Vector3(0, 2, 0), Color(0.85, 0.97, 1.0), 60, 9.0, 1.5, 0.12, -3.0)
					m.shake(0.6)},
				{"title": ["Gardien Givré", "Seigneur du Pic"], "t": 2.6},
				{"say": ["kaelith", "Les trois Sceaux ont réveillé le Gardien. Il nous attend au sommet."], "t": 3.2},
			]
		"fin":
			var s2: Vector3 = w.summit
			var dir: = Vector3(0, 0, -1)
			var steps2: Array = [{"call": func(): m.cine.hide_party();m.daynight.hour = 6.6}]
			steps2.append_array(_lineup(s2 + Vector3(0, 0, 4), dir, w, "Victory"))
			steps2.append_array([
				{"orbit": s2 + Vector3(0, 0, 4), "r": 6.5, "h": 1.8, "look_h": 1.3, "a0": PI - 0.6, "a1": PI + 0.3, "t": 16.0, "async": true},
				{"say": ["kaelith", "C'est fini… Le Pic s'est apaisé."]},
				{"say": ["lyra", "Pour l'instant. J'ai l'impression que l'histoire ne fait que commencer."]},
				{"say": ["kael", "Quoi qu'il arrive, on sera là. Tous les quatre."]},
				{"say": ["zahara", "Écoutez… Même la lave chante plus doucement. Aetheria respire à nouveau."]},
			])
			return steps2
		"trois_villages":
			var steps3: Array = []
			var chiefs: = {"jonc": ["j_chief", "Joncbourg chantera votre nom au bord de l'eau."],
				"forge": ["f_chief", "Forgeval vous forgera des légendes. Je m'en charge."],
				"vent": ["h_chief", "Et les vents de Hautevent porteront votre histoire jusqu'à la mer."]}
			for vv in w.villages:
				var c: Vector3 = vv.pos
				var ch: Array = chiefs.get(vv.id, ["elder", ""])
				steps3.append({"orbit": c, "r": 20.0, "h": 9.0, "look_h": 2.0, "a0": float(vv.entry) - 0.4, "a1": float(vv.entry) + 0.4, "t": 4.6, "async": true})
				steps3.append({"say": [ch[0], ch[1]], "t": 4.4})
			var v2: Vector3 = w.village
			steps3.append({"orbit": v2, "r": 26.0, "h": 12.0, "look_h": 2.0, "a0": PI, "a1": PI + 0.6, "t": 6.0, "async": true})
			steps3.append({"title": ["Les Échos lointains", "Les trois villages sont unis"], "t": 2.6})
			steps3.append({"say": ["elder", "Quatre héros, quatre Échos, et toute une île à leurs côtés."], "t": 3.6})
			return steps3
		"forge_rekindle":
			var vf: Dictionary = {}
			for vv2 in w.villages:
				if vv2.id == "forge": vf = vv2
			var fp: Vector3 = vf.get("forge", vf.get("pos", Vector3.ZERO))
			return [
				{"cam": [fp + Vector3(7, 3.5, 7), fp + Vector3(0, 1.4, 0)], "to": [fp + Vector3(5, 2.5, 3), fp + Vector3(0, 1.2, 0)], "t": 6.5, "async": true},
				{"say": ["f_chief", "Trois Cœurs de braise… Reculez-vous."], "t": 2.6},
				{"call": func():
					FX.column(fp, Color(1.0, 0.45, 0.1), 2.2, 9.0, 2.0)
					FX.particles(fp + Vector3(0, 2, 0), Color(1.0, 0.8, 0.3), 50, 8.0, 1.4, 0.1, -4.0)
					FX.palette_burst(fp + Vector3(0, 1.5, 0), "pyro", 3.5)
					m.shake(0.4);m.audio.play("explode", -2.0)},
				{"say": ["f_chief", "Le cœur de la grande forge bat à nouveau !"], "t": 3.0},
				{"say": ["f_kid", "Waouh… Elle n'a jamais été aussi belle !"], "t": 3.0},
			]
	if name.begins_with("village_"):
		var id: = name.substr(8)
		for vv3 in w.villages:
			if vv3.id == id:
				var c2: Vector3 = vv3.pos
				return [
					{"orbit": c2, "r": 22.0, "h": 10.0, "look_h": 2.5, "a0": float(vv3.entry) - 0.7, "a1": float(vv3.entry) + 0.5, "t": 5.5, "async": true},
					{"wait": 0.6},
					{"title": [vv3.name, vv3.sub], "t": 3.6},
					{"wait": 0.8},
				]
	if name.begins_with("boss_"):
		var bid: = name.substr(5)
		if w.boss_spots.has(bid):
			var b: Vector3 = w.boss_spots[bid]
			var tt: Array = BOSS_TITLES.get(bid, [bid, ""])
			return [
				{"orbit": b, "r": 13.0, "h": 4.5, "look_h": 3.0, "a0": 0.0, "a1": 0.9, "t": 4.5, "async": true},
				{"wait": 0.5},
				{"title": tt, "t": 3.0},
				{"wait": 0.6},
			]
	return []
