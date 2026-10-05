class_name Quests
extends Node




signal changed

var main: Node
var q: = {}
var tracked: = "main"

const DEFS: = {
	"main": {"title": "L'Écho d'Aetheria", "type": "main", "giver": "elder"}, 
	"apples": {"title": "Pommes solaires", "type": "side", "giver": "cook"}, 
	"cat": {"title": "Où est Minou ?", "type": "side", "giver": "child"}, 
	"hunt": {"title": "Chasse aux monstres", "type": "side", "giver": "guard"}, 
	"crystals": {"title": "Éclats d'Aether", "type": "side", "giver": "scholar"}, 
	"letter": {"title": "Une lettre pour le phare", "type": "side", "giver": "elder"}, 

	"g_masques": {"title": "Le Repaire des Masques", "type": "guild", "giver": "guild", "rank": 5}, 
	"g_roi": {"title": "Le Roi des Marais", "type": "guild", "giver": "guild", "rank": 7}, 
	"g_forge": {"title": "La Forge d'Ignis", "type": "guild", "giver": "guild", "rank": 10}, 
	"g_colosse": {"title": "Le Cœur du Volcan", "type": "guild", "giver": "guild", "rank": 12}, 
	"g_tempest": {"title": "L'Œil de la Tempête", "type": "guild", "giver": "guild", "rank": 15}, 
	"g_celeste": {"title": "Le Sanctuaire Céleste", "type": "guild", "giver": "guild", "rank": 18}, 
	"g_legende": {"title": "Légende d'Aetheria", "type": "guild", "giver": "guild", "rank": 20}, 
}
const ORDER: = ["main", "apples", "cat", "hunt", "crystals", "letter", 
	"g_masques", "g_roi", "g_forge", "g_colosse", "g_tempest", "g_celeste", "g_legende"]
const GUILD: = ["g_masques", "g_roi", "g_forge", "g_colosse", "g_tempest", "g_celeste", "g_legende"]

const GUILD_TARGET: = {"g_masques": ["domain", "masques"], "g_roi": ["boss", "roi_slime"], "g_forge": ["domain", "forge"], 
	"g_colosse": ["boss", "colosse"], "g_tempest": ["boss", "tempest"], "g_celeste": ["domain", "celeste"]}

const GUILD_REWARD: = {"g_masques": [450, 150, 2], "g_roi": [600, 180, 1], "g_forge": [800, 240, 2], "g_colosse": [950, 280, 2], 
	"g_tempest": [1200, 340, 2], "g_celeste": [1500, 420, 3], "g_legende": [2500, 800, 5]}
const GUILD_TEXT: = {
	"g_masques": "Des gobelins se sont retranchés dans un ancien sanctuaire, à l'orée du Marais d'Émeraude. Leur chef porte un masque d'or… Nettoie le Repaire des Masques !", 
	"g_roi": "Un slime gigantesque règne sur le Marais d'Émeraude. On l'appelle le Roi Slime. Il écrase tout ce qui approche de sa clairière.", 
	"g_forge": "Au pied du volcan dort la Forge d'Ignis. Son gardien s'est réveillé et la lave déborde. Il faudra de l'Hydro pour refroidir ses conduits.", 
	"g_colosse": "Le Colosse de Magma s'est installé dans le cratère de la Caldeira d'Ignis. Méfie-toi des éruptions sous tes pieds !", 
	"g_tempest": "Sur les Falaises de l'Orage, un esprit de foudre, le Tempestaire, tourne au-dessus du Cercle des Tempêtes. Peu en sont revenus.", 
	"g_celeste": "Le Sanctuaire Céleste ne s'ouvre qu'aux plus grands aventuriers. Son gardien de glace et de foudre t'y attend.", 
	"g_legende": "Il ne reste qu'une épreuve : vaincre les quatre seigneurs d'Aetheria. Le Gardien Givré, le Roi Slime, le Colosse et le Tempestaire.", 
}
const SPEAKERS: = {"elder": "Ancienne Maëlys", "cook": "Chef Tino", "guard": "Capitaine Rhéa", "child": "Petite Lou", 
	"scholar": "Érudit Soren", "keeper": "Aldo, gardien du phare", "guild": "Isaure, de la Guilde", "kaelith": "Kaelith", "lyra": "Lyra", "kael": "Kael", "zahara": "Zahara"}
const COLORS: = {"guild": Color(1.0, 0.72, 0.45), "elder": Color(0.85, 0.75, 1.0), "cook": Color(1.0, 0.75, 0.5), "guard": Color(0.6, 0.8, 1.0), 
	"child": Color(1.0, 0.85, 0.45), "scholar": Color(0.6, 1.0, 0.8), "keeper": Color(0.95, 0.9, 0.7), 
	"kaelith": Color(0.55, 0.85, 1.0), "lyra": Color(0.85, 0.7, 1.0), "kael": Color(1.0, 0.62, 0.35), 
	"zahara": Color(1.0, 0.5, 0.3)}
const NEED: = {"camps": 3, "seals": 3, "apples": 6, "hunt": 12, "crystals": 10}

func _init() -> void :
	reset()

func reset() -> void :
	q = {}
	for id in ORDER + QuestData.ORDER:
		q[id] = {"state": "locked", "step": 0, "count": 0, "got": []}
	q["main"].state = "available"
	tracked = "main"

func st(id: String) -> String:
	return q[id].state if q.has(id) else ""

func step(id: String) -> int:
	return q[id].step if q.has(id) else 0

func is_active(id: String) -> bool:
	return q.has(id) and q[id].state in ["active", "ready"]

func _setq(id: String, state: String, stp: = -1) -> void :
	q[id].state = state
	if stp >= 0: q[id].step = stp
	changed.emit()

func _unlock_sides() -> void :
	for id in ["apples", "cat", "hunt", "crystals"]:
		if q[id].state == "locked": q[id].state = "available"


func title(id: String) -> String:
	if QuestData.DEFS.has(id): return QuestData.DEFS[id].title
	return DEFS[id].title if DEFS.has(id) else ""

func qtype(id: String) -> String:
	if QuestData.DEFS.has(id): return QuestData.DEFS[id].type
	return DEFS[id].type if DEFS.has(id) else "side"

func objective(id: String) -> String:
	if not q.has(id): return ""
	if QuestData.DEFS.has(id): return _gen_objective(id)
	var s: int = q[id].step
	var c: int = q[id].count
	match id:
		"main":
			match s:
				0: return "Parle à l'Ancienne Maëlys à Brise-Marée"
				1: return "Libère 3 camps de monstres (%d/3)" % mini(c, 3)
				2: return "Retourne voir l'Ancienne Maëlys"
				3: return "Réveille les 3 Sceaux anciens (%d/3)" % mini(c, 3)
				4: return "Vaincs le Gardien Givré au sommet du Pic Givré"
				5: return "Retourne voir l'Ancienne Maëlys"
			return "L'île est sauvée !"
		"apples":
			return "Cueille des pommes solaires au verger (%d/6)" % mini(c, 6) if s == 0 else "Rapporte les pommes à Chef Tino"
		"cat":
			return "Retrouve Minou dans la Vallée des Cerisiers" if s == 0 else "Ramène Minou à Petite Lou"
		"hunt":
			return "Vaincs des monstres (%d/12)" % mini(c, 12) if s == 0 else "Retourne voir la Capitaine Rhéa"
		"crystals":
			return "Récolte des cristaux d'Aether (%d/10)" % mini(c, 10) if s == 0 else "Retourne voir l'Érudit Soren"
		"letter":
			return "Apporte la lettre à Aldo, au phare"
	if id in GUILD:
		if s >= 1: return "Retourne voir Isaure, à la Guilde de Brise-Marée"
		if id == "g_legende": return "Vaincs les quatre seigneurs d'Aetheria (%d/4)" % lords_defeated()
		var tg: Array = GUILD_TARGET[id]
		if tg[0] == "domain": return "Termine le domaine : %s" % String(main.domain_def(tg[1]).name)
		return "Vaincs %s" % String(main.WORLD_BOSSES[tg[1]].name)
	return ""


func target(id: String) -> Vector3:
	if not q.has(id): return Vector3.INF
	if QuestData.DEFS.has(id): return _gen_target(id)
	var s: int = q[id].step
	match id:
		"main":
			match s:
				0, 2, 5: return main.npc_pos("elder")
				1: return main.nearest_camp_pos(false)
				3: return main.nearest_seal_pos()
				4: return main.world.summit
		"apples": return main.nearest_apple_pos() if s == 0 else main.npc_pos("cook")
		"cat": return main.cat_pos() if s == 0 else main.npc_pos("child")
		"hunt": return Vector3.INF if s == 0 else main.npc_pos("guard")
		"crystals": return main.nearest_crystal_pos() if s == 0 else main.npc_pos("scholar")
		"letter": return main.npc_pos("keeper")
	if id in GUILD:
		if s >= 1: return main.npc_pos("guild")
		if id == "g_legende":
			for b in ["roi_slime", "colosse", "tempest"]:
				if int(main.world_bosses.get(b, {}).get("kills", 0)) == 0: return main.world.boss_spots[b]
			return main.world.summit if not main.boss_done else Vector3.INF
		var tg: Array = GUILD_TARGET[id]
		if tg[0] == "domain": return main.domain_def(tg[1]).pos
		return main.world.boss_spots[tg[1]]
	return Vector3.INF

func active_list() -> Array:
	var out: = []
	for id in ORDER + QuestData.ORDER:
		if is_active(id): out.append(id)
	return out

func ensure_tracked() -> void :
	refresh_new()

	if tracked == "main" and q["main"].state == "available": return
	if not is_active(tracked):
		var l: = active_list()
		tracked = l[0] if l.size() > 0 else ""


func npc_marker(npc: String) -> String:
	var gm: = _gen_marker(npc)
	if gm == "?": return gm
	var om: = _old_marker(npc)
	return om if om != "" else gm

func _old_marker(npc: String) -> String:
	if npc == "guild":
		for id in GUILD:
			if q[id].state == "active" and q[id].step == 1: return "?"
		for id in GUILD:
			if q[id].state == "available": return "!"
		return ""
	if npc == "elder":
		if q["main"].state == "available" or (q["main"].state == "active" and q["main"].step in [2, 5]): return "?" if q["main"].step in [2, 5] else "!"
		if q["letter"].state == "available": return "!"
	if npc == "keeper" and is_active("letter"): return "?"
	for id in ORDER:
		if not DEFS.has(id) or DEFS[id].giver != npc or id == "main" or id == "letter" or id in GUILD: continue
		if q[id].state == "available": return "!"
		if q[id].state == "active" and q[id].step == 1: return "?"
	return ""


func on_camp_cleared(total_cleared: int) -> void :
	if is_active("main") and q["main"].step == 1:
		q["main"].count = total_cleared
		if total_cleared >= NEED.camps:
			q["main"].step = 2
			main.notify("Trois camps libérés ! Retourne voir l'Ancienne Maëlys.")
		changed.emit()

func on_seal(active_count: int) -> void :
	if is_active("main") and q["main"].step == 3:
		q["main"].count = active_count
		if active_count >= NEED.seals:
			q["main"].step = 4
			main.notify("Les trois Sceaux sont réveillés… Le Gardien Givré s'agite au sommet !")
			main.spawn_boss()
			main.play_cine("gardien")
		changed.emit()

func on_boss_defeated() -> void :
	_guild_progress("g_legende")
	if is_active("main") and q["main"].step == 4:
		q["main"].step = 5
		main.notify("Le Gardien Givré est vaincu ! Retourne voir l'Ancienne Maëlys.")
		changed.emit()

func on_kill_at(p: Vector3) -> void :
	var b: = main.world.biome_at(p.x, p.z) as String
	for id in QuestData.ORDER:
		var st: = _step(id)
		if st.get("do", "") == "kill" and st.region == b:
			q[id].count += 1
			if q[id].count >= int(st.n): _advance(id)
			else: changed.emit()

func on_kill() -> void :
	if is_active("hunt") and q["hunt"].step == 0:
		q["hunt"].count += 1
		if q["hunt"].count >= NEED.hunt:
			q["hunt"].step = 1
			main.notify("Chasse terminée ! Retourne voir la Capitaine Rhéa.")
		changed.emit()


func on_apple() -> void :
	if is_active("apples") and q["apples"].step == 0:
		q["apples"].count = main.apples_got_count()
		if q["apples"].count >= NEED.apples:
			q["apples"].step = 1
			main.notify("Six pommes solaires ! Rapporte-les à Chef Tino.")
		changed.emit()

func on_crystal(total: int) -> void :
	if is_active("crystals") and q["crystals"].step == 0:
		q["crystals"].count = total
		if total >= NEED.crystals:
			q["crystals"].step = 1
			main.notify("Dix cristaux ! Retourne voir l'Érudit Soren.")
		changed.emit()


func lords_defeated() -> int:
	var n: = 1 if main.boss_done else 0
	for b in ["roi_slime", "colosse", "tempest"]:
		if int(main.world_bosses.get(b, {}).get("kills", 0)) > 0: n += 1
	return n

func _guild_done_already(id: String) -> bool:
	if id == "g_legende": return lords_defeated() >= 4
	var tg: Array = GUILD_TARGET[id]
	if tg[0] == "domain": return int(main.domain_clears.get(tg[1], 0)) > 0
	return int(main.world_bosses.get(tg[1], {}).get("kills", 0)) > 0


func refresh_guild(announce: = true) -> void :
	if q["main"].state == "available" or q["main"].state == "locked": return
	var opened: = []
	for id in GUILD:
		if q[id].state == "locked" and main.rank >= int(DEFS[id].rank):
			q[id].state = "available";opened.append(id)
	if not opened.is_empty():
		changed.emit()
		if announce: main.notify("Nouvelle mission à la Guilde : « %s »" % DEFS[opened[0]].title)

func on_rank(_r: int) -> void :
	refresh_guild()

func _guild_progress(id: String) -> void :
	if is_active(id) and q[id].step == 0 and _guild_done_already(id):
		q[id].step = 1
		main.notify("Mission accomplie : « %s ». Retourne voir Isaure." % DEFS[id].title)
		changed.emit()

func on_domain(_d: String) -> void :
	for id in GUILD: _guild_progress(id)

func on_world_boss(_b: String) -> void :
	for id in GUILD: _guild_progress(id)

## Appelé quand l'inventaire change (quêtes de collecte).
func on_items_changed() -> void :
	if q.is_empty(): return
	for id in QuestData.ORDER:
		var stp: = _step(id)
		if stp.get("do", "") in ["collect", "relics"] and main.item_count(stp.item) >= int(stp.n):
			_advance(id)
			return
	changed.emit()

func on_gather(_kind: String) -> void :
	pass

func on_tree_shaken(_fruit: String) -> void :
	pass

func on_cook(dish: String, n: int) -> void :
	for id in QuestData.ORDER:
		var stp: = _step(id)
		if stp.get("do", "") == "cook" and (String(stp.item) == "" or stp.item == dish):
			q[id].count += n
			if q[id].count >= int(stp.n): _advance(id)
			else: changed.emit()

func on_bought(_id: String, _n: int) -> void :
	pass

func on_cat() -> void :
	if is_active("cat") and q["cat"].step == 0:
		q["cat"].step = 1
		main.notify("Minou est sain et sauf ! Ramène-le à Petite Lou.")
		changed.emit()


func _l(who: String, text: String) -> Array:
	if SPEAKERS.has(who): return [SPEAKERS[who], COLORS[who], text]
	return [main.npc_name(who), main.npc_color(who), text]


func talk(npc: String) -> Dictionary:
	var old: = _old_talk(npc)
	if (old.after as Callable).is_valid(): return old
	var g: = _gen_talk(npc)
	if not g.is_empty(): return g
	if (old.lines as Array).is_empty(): return {"lines": _idle(npc), "after": Callable()}
	return old

func _old_talk(npc: String) -> Dictionary:
	var lines: = []
	var after: = Callable()
	match npc:
		"elder":
			var m: Dictionary = q["main"]
			if m.state == "available":
				lines = [_l("elder", "Oh ! Des voyageurs… Le vent de la mer m'avait annoncé votre venue."), 
					_l("kaelith", "Je suis Kaelith. Voici Lyra, Kael et Zahara. Nous avons vu d'étranges lueurs au-dessus de l'île."), 
					_l("zahara", "La terre gronde sous nos pieds… Ce n'est pas un volcan qui s'éveille, c'est autre chose."), 
					_l("elder", "Depuis que le Pic Givré s'est réveillé, les monstres se multiplient sur Aetheria."), 
					_l("elder", "Si vous voulez aider Brise-Marée, libérez trois camps de monstres. Ils sont marqués sur votre carte."), 
					_l("lyra", "Trois camps ? Ça me va. Mon épée s'ennuyait."), 
					_l("kael", "Tant qu'il reste une étincelle, il y a de l'espoir. Allons-y.")]
				after = func():
					_setq("main", "active", 1);q["main"].count = main.camps_cleared_count();_unlock_sides()
					tracked = "main";main.give_xp(60, "Quête")
					on_camp_cleared(main.camps_cleared_count())
					refresh_guild()
			elif m.state == "active" and m.step == 1:
				lines = [_l("elder", "Les camps sont marqués sur votre carte. Revenez quand trois d'entre eux seront libérés.")]
			elif m.state == "active" and m.step == 2:
				lines = [_l("elder", "Trois camps libérés… Les villageois respirent enfin. Merci, voyageurs."), 
					_l("elder", "Mais le mal vient du sommet. Autrefois, trois Sceaux anciens gardaient le Pic Givré endormi."), 
					_l("elder", "Le Sceau de l'Onde, dans la Forêt d'Automne, ne répond qu'à l'Hydro. Celui de l'Éclair, dans la Vallée des Cerisiers, qu'à l'Électro."), 
					_l("elder", "Et le Sceau de la Tempête, sur les Hauts Plateaux… il lui faut l'Hydro et l'Électro en même temps."), 
					_l("kaelith", "Un Électro-chargé, donc. Lyra, on fait équipe."), 
					_l("kael", "Et si un monstre se met en travers du chemin, Zahara et moi, on s'en charge.")]
				after = func():
					_setq("main", "active", 3);q["main"].count = main.seals_active_count()
					if q["letter"].state == "locked": q["letter"].state = "available"
					main.give_xp(150, "Quête")
					on_seal(main.seals_active_count())
			elif m.state == "active" and m.step == 3:
				lines = [_l("elder", "Les Sceaux brillent sur votre carte. L'Onde, l'Éclair, la Tempête… Courage !")]
			elif m.state == "active" and m.step == 4:
				lines = [_l("elder", "Le Gardien Givré vous attend au sommet. Passez par la Statue d'Aetheria pour vous soigner avant de monter !")]
			elif m.state == "active" and m.step == 5:
				lines = [_l("elder", "Le froid quitte le Pic… Je l'ai senti jusqu'ici ! Vous avez sauvé Aetheria."), 
					_l("elder", "L'écho des Sceaux chantera longtemps vos noms : Kaelith, Lyra, Kael et Zahara."), 
					_l("zahara", "La lave n'est pas seulement une destruction… c'est aussi une renaissance."), 
					_l("lyra", "On reste un peu ? Il paraît que les tartes de Tino sont légendaires.")]
				after = func():
					_setq("main", "done", 6);main.give_xp(400, "Quête");main.add_shards(300)
					main.story_complete()
			else:
				lines = [_l("elder", "Aetheria vous doit tout. Profitez de l'île, voyageurs !")]
			if q["letter"].state == "available" and m.state != "available" and after.is_null():
				lines = [_l("elder", "Au fait… Aldo, le gardien du phare, attend des nouvelles de moi."), 
					_l("elder", "Pourriez-vous lui porter cette lettre ? Le phare est au nord-est de l'île.")]
				after = func():
					_setq("letter", "active", 0);tracked = "letter"
		"cook":
			var a: Dictionary = q["apples"]
			if a.state == "available" and main.apples_got_count() >= NEED.apples:

				lines = [_l("cook", "Bienvenue à mon étal ! Je prépare ma fameuse tarte aux pommes solaires…"), 
					_l("cook", "…mais je n'ai plus une seule pomme."), 
					_l("lyra", "Des pommes solaires ? On en a justement cueilli tout un panier au verger !"), 
					_l("cook", "Magnifique ! Elles sont parfaites. Tenez, trois parts de tarte, ça requinque !")]
				after = func():
					_setq("apples", "done", 2);main.add_food(3);main.give_xp(120, "Quête");main.add_shards(50)
			elif a.state == "available":
				lines = [_l("cook", "Bienvenue à mon étal ! Je prépare ma fameuse tarte aux pommes solaires…"), 
					_l("cook", "…mais je n'ai plus une seule pomme. Vous pourriez m'en cueillir six au verger, à l'est du village ?")]
				after = func():
					_setq("apples", "active", 0);tracked = "apples";on_apple()
			elif a.state == "active" and a.step == 0:
				lines = [_l("cook", "Le verger est juste à l'est. Les pommes solaires brillent un peu, vous verrez !")]
			elif a.state == "active" and a.step == 1:
				lines = [_l("cook", "Magnifique ! Elles sont parfaites."), 
					_l("cook", "Tenez, trois parts de tarte. Mangez-en une en cas de coup dur, ça requinque !")]
				after = func():
					_setq("apples", "done", 2);main.add_food(3);main.give_xp(120, "Quête");main.add_shards(50)
			elif a.state == "locked":
				lines = [_l("cook", "Allez d'abord saluer l'Ancienne Maëlys, elle vous attend près de la statue.")]
			else:
				lines = [_l("cook", "Revenez quand vous voulez, il y aura toujours une part pour vous.")]
		"child":
			var c: Dictionary = q["cat"]
			if c.state == "available" and main.cat_found:

				lines = [_l("child", "Snif… Mon chat Minou est parti chasser les papillons dans la Vallée des Cerisiers…"), 
					_l("kaelith", "Un chat tout orange, avec un collier « Minou » ? Il nous suit depuis la vallée !"), 
					_l("child", "MINOU ! Merci, merci, merci !"), 
					_l("child", "Tiens, c'est mon trésor : des éclats d'Aether ! Je les gardais dans ma boîte secrète.")]
				after = func():
					_setq("cat", "done", 2);main.give_xp(150, "Quête");main.add_shards(120);main.return_cat()
			elif c.state == "available":
				lines = [_l("child", "Snif… Mon chat Minou est parti chasser les papillons dans la Vallée des Cerisiers…"), 
					_l("child", "Il a peur des monstres ! Vous pouvez le retrouver ? Il est tout orange !")]
				after = func():
					_setq("cat", "active", 0);tracked = "cat"
			elif c.state == "active" and c.step == 0:
				lines = [_l("child", "Minou adore les fleurs roses… Il doit être dans la Vallée des Cerisiers, à l'ouest !")]
			elif c.state == "active" and c.step == 1:
				lines = [_l("child", "MINOU ! Merci, merci, merci !"), 
					_l("child", "Tiens, c'est mon trésor : des éclats d'Aether ! Je les gardais dans ma boîte secrète.")]
				after = func():
					_setq("cat", "done", 2);main.give_xp(150, "Quête");main.add_shards(120);main.return_cat()
			elif c.state == "locked":
				lines = [_l("child", "Tu as vu la grande statue ? L'Ancienne Maëlys veut te parler !")]
			else:
				lines = [_l("child", "Minou fait des câlins à tout le monde depuis que tu l'as ramené !")]
		"guard":
			var h: Dictionary = q["hunt"]
			if h.state == "available":
				lines = [_l("guard", "Halte, voyageurs ! Les monstres rôdent partout sur l'île."), 
					_l("guard", "Éliminez-en douze et je vous verserai une prime. Marché conclu ?")]
				after = func():
					_setq("hunt", "active", 0);tracked = "hunt"
			elif h.state == "active" and h.step == 0:
				lines = [_l("guard", "Encore %d monstres. Courage !" % (NEED.hunt - int(h.count)))]
			elif h.state == "active" and h.step == 1:
				lines = [_l("guard", "Excellent travail ! Voici votre prime, vous l'avez méritée.")]
				after = func():
					_setq("hunt", "done", 2);main.give_xp(200, "Quête");main.add_shards(150)
			else:
				lines = [_l("guard", "Astuce : sautez d'un endroit élevé, puis appuyez de nouveau sur Saut pour déployer votre planeur !")]
		"scholar":
			var k: Dictionary = q["crystals"]
			if k.state == "available":
				lines = [_l("scholar", "Les cristaux d'Aether… L'île en regorge, jusque sur les hauteurs."), 
					_l("scholar", "Rapportez-m'en dix et je vous confierai mes cartes au trésor.")]
				after = func():
					_setq("crystals", "active", 0);tracked = "crystals";on_crystal(main.crystals_got)
			elif k.state == "active" and k.step == 0:
				lines = [_l("scholar", "Encore quelques cristaux… Ils brillent en bleu, on les voit de loin.")]
			elif k.state == "active" and k.step == 1:
				lines = [_l("scholar", "Fascinant ! Leur écho est parfaitement pur."), 
					_l("scholar", "Voici mes notes : les coffres de l'île apparaissent maintenant sur votre carte.")]
				after = func():
					_setq("crystals", "done", 2);main.give_xp(150, "Quête");main.treasure_map = true
			else:
				lines = [_l("scholar", "Le Pic Givré serait le cœur de l'île… Tout y résonne, même le silence.")]
		"guild":
			var d: = _guild_talk()
			lines = d.lines;after = d.after
		"keeper":
			if is_active("letter"):
				lines = [_l("keeper", "Une lettre de Maëlys ? Elle ne m'oublie jamais !"), 
					_l("keeper", "Merci, voyageurs. Tenez, pour la route.")]
				after = func():
					_setq("letter", "done", 1);main.give_xp(120, "Quête");main.add_shards(80);main.add_food(1)
			else:
				lines = [_l("keeper", "Du haut du phare, on voit toute l'île. Et avec un planeur, on peut même la survoler !")]
	return {"lines": lines, "after": after}

func _guild_talk() -> Dictionary:

	for id in GUILD:
		if q[id].state == "active" and q[id].step == 1:
			var rw: Array = GUILD_REWARD[id]
			var txt: = "Beau travail ! La Guilde te doit une fière chandelle. Voici ta prime."
			if id == "g_legende": txt = "Les quatre seigneurs sont tombés… Tu es désormais une Légende d'Aetheria !"
			return {"lines": [_l("guild", txt)], "after": func():
				_setq(id, "done", 2);main.give_xp(rw[0], "Guilde");main.add_shards(rw[1]);main.add_food(rw[2])
				if id == "g_legende": main.ui.show_banner("Légende d'Aetheria", Color(1.0, 0.85, 0.4))
				refresh_guild()}

	for id in GUILD:
		if q[id].state == "available":
			var lines: = [_l("guild", "Bienvenue à la Guilde des aventuriers de Brise-Marée ! Une mission pour toi : « %s »." % DEFS[id].title), 
				_l("guild", GUILD_TEXT[id])]
			if _guild_done_already(id):
				lines.append(_l("lyra", "C'est déjà fait ! On s'en est chargés en passant."))
			return {"lines": lines, "after": func():
				_setq(id, "active", 0);tracked = id
				_guild_progress(id)}
	if q["main"].state == "available" or q["main"].state == "locked":
		return {"lines": [_l("guild", "Des voyageurs ? Va d'abord saluer l'Ancienne Maëlys, près de la statue. Ensuite, reviens me voir !")], "after": Callable()}
	for id in GUILD:
		if q[id].state == "locked":
			return {"lines": [_l("guild", "Les missions de la Guilde sont réservées aux aventuriers aguerris."), 
				_l("guild", "Reviens quand tu auras atteint le rang d'aventure %d : « %s » t'attendra." % [int(DEFS[id].rank), DEFS[id].title])], "after": Callable()}
	for id in GUILD:
		if is_active(id):
			return {"lines": [_l("guild", "Ta mission en cours : « %s ». %s" % [DEFS[id].title, objective(id)])], "after": Callable()}
	return {"lines": [_l("guild", "Tu as accompli toutes les missions de la Guilde. Aetheria chantera longtemps ton nom !")], "after": Callable()}


func save_state() -> Dictionary:
	return {"q": q.duplicate(true), "tracked": tracked}

# ----------------------------------------------------------------------------
# Moteur générique (quêtes de QuestData)
# ----------------------------------------------------------------------------
func _step(id: String) -> Dictionary:
	if not QuestData.DEFS.has(id) or not is_active(id): return {}
	var steps: Array = QuestData.DEFS[id].steps
	var i: int = q[id].step
	return steps[i] if i < steps.size() else {}

## Débloque les nouvelles quêtes dont les conditions sont remplies.
func refresh_new() -> void :
	if q.is_empty() or main == null: return
	for id in QuestData.ORDER:
		if q[id].state != "locked": continue
		var r: Dictionary = QuestData.DEFS[id].get("req", {})
		var ok: = true
		if r.has("main"):
			var ms: String = q["main"].state
			ok = ok and (ms == "done" or (ms in ["active", "ready"] and int(q["main"].step) >= int(r.main)))
		if r.has("rank"): ok = ok and int(main.rank) >= int(r.rank)
		if r.has("quest"): ok = ok and st(String(r.quest)) == "done"
		if ok: q[id].state = "available"

func _lines(arr: Array) -> Array:
	var out: = []
	for l in arr: out.append(_l(String(l[0]), String(l[1])))
	return out

func _gen_objective(id: String) -> String:
	var e: Dictionary = q[id]
	var steps: Array = QuestData.DEFS[id].steps
	if e.state == "done": return "Quête terminée"
	if e.state == "available": return "Parle à %s" % main.npc_name(QuestData.DEFS[id].giver)
	var stp: Dictionary = steps[mini(int(e.step), steps.size() - 1)]
	var o: String = stp.obj
	match String(stp.do):
		"collect", "relics":
			return "%s (%d/%d)" % [o, mini(main.item_count(stp.item), int(stp.n)), int(stp.n)]
		"kill", "cook", "beacons":
			return "%s (%d/%d)" % [o, mini(int(e.count), int(stp.n)), int(stp.n)]
		"deliver":
			if main.item_count(stp.item) < int(stp.n):
				return "%s (%d/%d)" % [o, main.item_count(stp.item), int(stp.n)]
	return o

func _gen_target(id: String) -> Vector3:
	var stp: = _step(id)
	if stp.is_empty(): return Vector3.INF
	var pp: Vector3 = main.party.global_position
	match String(stp.do):
		"talk", "deliver": return main.npc_pos(stp.npc)
		"collect": return main.item_source(String(stp.item), pp)
		"kill": return main.world.snap((main.world.REGIONS[stp.region].pos as Vector3) * 0.85)
		"cook": return main.nearest_cook_pos(pp)
		"beacons": return main.next_beacon_pos(id)
		"relics", "event":
			if main.dungeon and main.dungeon.id == String(stp.domain): return main.dungeon.quest_target()
			return main.domain_def(String(stp.domain)).get("pos", Vector3.INF)
	return Vector3.INF

func _gen_marker(npc: String) -> String:
	for id in QuestData.ORDER:
		var stp: = _step(id)
		if stp.get("npc", "") == npc and (stp.do == "talk" or (stp.do == "deliver" and main.item_count(stp.item) >= int(stp.n))): return "?"
	for id in QuestData.ORDER:
		if q[id].state == "available" and QuestData.DEFS[id].giver == npc: return "!"
	return ""

func _gen_talk(npc: String) -> Dictionary:
	# étape en cours qui concerne ce PNJ
	for id in QuestData.ORDER:
		var stp: = _step(id)
		if stp.get("npc", "") != npc: continue
		if stp.do == "talk":
			return {"lines": _lines(stp.lines), "after": func(): _advance(id)}
		if stp.do == "deliver":
			if main.item_count(stp.item) >= int(stp.n):
				return {"lines": _lines(stp.lines), "after": func():
					main.remove_item(String(stp.item), int(stp.n))
					_advance(id)}
			return {"lines": [_l(npc, "Il m'en faut encore : %s (%d/%d)." % [Items.name_of(stp.item), main.item_count(stp.item), int(stp.n)])], "after": Callable()}
	# nouvelle quête proposée
	for id in QuestData.ORDER:
		if q[id].state == "available" and QuestData.DEFS[id].giver == npc:
			var d: Dictionary = QuestData.DEFS[id]
			return {"lines": _lines(d.start), "after": func(): _start(id)}
	# rappel de l'objectif
	for id in QuestData.ORDER:
		if is_active(id) and QuestData.DEFS[id].giver == npc:
			return {"lines": [_l(npc, "Alors, où en êtes-vous ? %s." % _gen_objective(id))], "after": Callable()}
	return {}

func _start(id: String) -> void :
	var d: Dictionary = QuestData.DEFS[id]
	q[id].state = "active";q[id].step = 0;q[id].count = 0;q[id].got = []
	tracked = id
	var sr: Dictionary = d.get("start_reward", {})
	if sr.has("recipe"): main.learn_recipe(String(sr.recipe))
	main.ui.show_banner("Nouvelle quête : %s" % d.title, Color(1.0, 0.88, 0.55) if d.type != "main" else Color(1.0, 0.8, 0.4))
	main.audio.play("quest", -4.0)
	_check_auto(id)
	changed.emit()

func _advance(id: String) -> void :
	var d: Dictionary = QuestData.DEFS[id]
	q[id].step += 1;q[id].count = 0
	if q[id].step >= (d.steps as Array).size():
		_complete(id)
	else:
		main.notify("%s : %s" % [d.title, _gen_objective(id)])
		_check_auto(id)
	changed.emit()

## Étapes déjà remplies au moment où elles commencent (objets déjà en poche…).
func _check_auto(id: String) -> void :
	var stp: = _step(id)
	if stp.is_empty(): return
	if stp.do in ["collect", "relics"] and main.item_count(stp.item) >= int(stp.n):
		_advance(id)

func _complete(id: String) -> void :
	var d: Dictionary = QuestData.DEFS[id]
	q[id].state = "done"
	var r: Dictionary = d.get("reward", {})
	main.ui.show_banner("Quête terminée : %s" % d.title, Color(1.0, 0.88, 0.5))
	main.audio.play("levelup", -3.0)
	if r.has("xp"): main.give_xp(int(r.xp), "Quête")
	if r.has("mora"): main.add_mora(int(r.mora))
	if r.has("shards"): main.add_shards(int(r.shards))
	for it in r.get("items", {}): main.add_item(String(it), int(r.items[it]))
	if r.has("recipe"): main.learn_recipe(String(r.recipe))
	if r.has("cine"): main.play_cine(String(r.cine))
	refresh_new()
	ensure_tracked()

func on_event(ev: String) -> void :
	for id in QuestData.ORDER:
		var stp: = _step(id)
		if stp.get("do", "") == "event" and stp.event == ev: _advance(id)

## Feu de vigie allumé (index dans la liste des feux).
func on_beacon(i: int) -> void :
	for id in QuestData.ORDER:
		var stp: = _step(id)
		if stp.get("do", "") == "beacons" and not i in q[id].got:
			q[id].got.append(i);q[id].count = (q[id].got as Array).size()
			if q[id].count >= int(stp.n): _advance(id)
			else: changed.emit()

## Relique ramassée dans un domaine (on retient son index pour ne pas la refaire apparaître).
func on_relic(id: String, i: int) -> void :
	if q.has(id) and not i in q[id].got: q[id].got.append(i)

func relic_step(domain: String) -> Array:
	for id in QuestData.ORDER:
		var stp: = _step(id)
		if stp.get("domain", "") == domain: return [id, stp]
	return []

const IDLE: = {
	"grocer": "Des fruits frais, des œufs, de la farine… Tout ce qu'il faut pour une bonne marmite !",
	"j_chief": "Le marais a ses humeurs, mais Joncbourg tient bon depuis trois cents ans.",
	"j_grocer": "Le poisson du jour est arrivé ! Le lotus aussi, si vous cuisinez.",
	"j_cook": "Une soupe, ça réchauffe les pêcheurs comme les aventuriers.",
	"j_herb": "Le lotus soigne, la menthe rafraîchit… et le champignon rouge ? On ne le mange pas !",
	"f_chief": "Le fer se travaille chaud. Les gens aussi.",
	"f_grocer": "Piments, viande, farine : la halle ne ferme jamais, même quand le volcan tousse.",
	"f_cook": "Plus c'est épicé, plus on frappe fort. C'est scientifique.",
	"f_kid": "Un jour, je forgerai une épée aussi belle que celle de Lyra !",
	"h_chief": "Écoutez le vent : il connaît tous les chemins de l'île.",
	"h_grocer": "Des lys, des baies givrées… Tout ce que le vent apporte, je le vends !",
	"h_cook": "Asseyez-vous, mes petits, il reste de la galette.",
	"h_scout": "D'ici, on voit jusqu'au phare d'Aldo quand le temps est clair.",
}

func _idle(npc: String) -> Array:
	return [_l(npc, IDLE.get(npc, "Belle journée, n'est-ce pas ?"))]

func load_state(d: Dictionary) -> void :
	reset()
	var src: Dictionary = d.get("q", {})
	for id in src:
		if q.has(id):
			var e: Dictionary = src[id]
			q[id] = {"state": String(e.get("state", "locked")), "step": int(e.get("step", 0)), "count": int(e.get("count", 0)), 
				"got": (e.get("got", []) as Array).map( func(x): return int(x))}
	tracked = String(d.get("tracked", "main"))
	ensure_tracked()
	refresh_guild(false)
