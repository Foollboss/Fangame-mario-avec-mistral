extends Node3D




var world: World
var party: Party
var rig: CameraRig
var ui: UI
var quests: Quests
var daynight: DayNight
var grass: GrassField
var audio: Audio
var npc_lib: Node3D
var npcs: = {}
var camps: Array = []
var packs: Array = []
var seals: Array = []
var chests: Array = []
var crystals: Array = []
var apples: Array = []
var wp_nodes: Array = []
var wp_unlocked: = {}
var cat_node: Node3D
var cat_found: = false
var cat_returned: = false
var boss: Enemy
var boss_done: = false
var world_bosses: = {}
var domain_clears: = {}
var dungeon: Dungeon
var lava_t: = 0.0
var storm_t: = 0.0
var crystals_got: = 0
## Anémoculus : trouvés, offerts aux statues, niveau de résonance (= bonus d'endurance)
var oculi: Array = []
var oculi_got: = 0
var oculi_offered: = 0
var statue_level: = 0
var oculus_hint: = false
var resonance_t: = 0.0
const OCULUS_LEVELS: = [3, 4, 4, 5, 5, 6, 6, 7]
const STAMINA_PER_LEVEL: = 15.0
var shards: = 0
## Inventaire : identifiant d'objet -> quantité (voir Items.DEFS), Mora, recettes connues
var inv: = {}
var mora: = 0
var recipes_known: = {}
var recipe_mastery: = {}
var dishes_cooked: = 0
## compatibilité : « food » = nombre de tartes aux pommes solaires
var food: int:
	get:
		return int(inv.get("tarte", 0))
	set(value):
		inv["tarte"] = maxi(0, value)
var rank: = 1
var xp: = 0
var treasure_map: = false
var reactions: = 0
var kills: = 0
var playing: = false
var ended: = false
var t_play: = 0.0
var statue_msg_cd: = 0.0
var autotest: = false
var shot_dir: = "user://shots/"
var save_t: = 0.0
var region_now: = ""
var combat_t: = 0.0
var interact_target: Dictionary = {}
var paused: = false
var cinematic: = false
var cine: Cinematic
var seen_cines: = {}

const SAVE_PATH: = "user://aetheria_save.json"
const MAX_RANK: = 30

const WORLD_BOSSES: = {
	"roi_slime": {"kind": "boss_slime", "elem": "hydro", "name": "Roi Slime des Marais", "lvl": 16, "xp": 700, "shards": 150}, 
	"colosse": {"kind": "boss_magma", "elem": "lava", "name": "Colosse de Magma", "lvl": 24, "xp": 900, "shards": 220}, 
	"tempest": {"kind": "boss_storm", "elem": "electro", "name": "Tempestaire", "lvl": 30, "xp": 1200, "shards": 300}, 
}


const CAMP_SETUP: = {
	"goblins": [["goblin", ""], ["goblin", ""], ["archer", ""], ["goblin", ""]], 
	"slimes": [["slime", "hydro"], ["slime", "hydro"], ["slime", "electro"], ["slime_big", "hydro"]], 
	"goblins_fire": [["goblin", ""], ["goblin", ""], ["slime", "pyro"], ["slime", "pyro"], ["archer", ""]], 
	"wisps": [["wisp", "electro"], ["wisp", "pyro"], ["goblin", ""], ["goblin", ""]], 
	"slimes_mix": [["slime", "pyro"], ["slime", "hydro"], ["slime", "electro"], ["slime_big", "pyro"]], 
	"golem": [["golem", ""], ["wisp", "hydro"], ["wisp", "cryo"]], 
	"cryo": [["slime", "cryo"], ["slime", "cryo"], ["slime_big", "cryo"], ["wisp", "cryo"], ["goblin", ""]], 

	"marais_slimes": [["slime", "hydro"], ["slime", "electro"], ["slime_big", "hydro"], ["slime", "hydro"], ["wisp", "hydro"]], 
	"marais_goblins": [["goblin", ""], ["goblin", ""], ["archer", ""], ["archer", ""], ["slime_big", "electro"]], 
	"braise_slimes": [["slime", "lava"], ["slime", "lava"], ["slime", "pyro"], ["slime_big", "lava"]], 
	"braise_golem": [["golem", "lava"], ["slime", "lava"], ["wisp", "pyro"]], 
	"braise_wisps": [["wisp", "pyro"], ["wisp", "lava"], ["goblin", ""], ["goblin", ""]], 
	"orage_wisps": [["wisp", "electro"], ["wisp", "electro"], ["slime", "electro"], ["slime_big", "electro"]], 
	"orage_golem": [["golem", "electro"], ["wisp", "electro"], ["archer", ""]], 
	"orage_goblins": [["goblin", ""], ["goblin", ""], ["goblin", ""], ["archer", ""], ["archer", ""]], 
}
const PACK_SETUP: = {
	"prairie": [[["slime", "hydro"], ["slime", "electro"]], [["goblin", ""], ["goblin", ""]], [["slime", "pyro"]]], 
	"automne": [[["slime", "pyro"], ["slime", "pyro"]], [["goblin", ""], ["archer", ""]], [["wisp", "pyro"]]], 
	"cerisiers": [[["slime", "hydro"], ["slime", "hydro"]], [["wisp", "hydro"]], [["goblin", ""], ["slime", "electro"]]], 
	"plateau": [[["wisp", "electro"], ["slime", "electro"]], [["archer", ""], ["goblin", ""]]], 
	"pic": [[["slime", "cryo"], ["slime", "cryo"]], [["wisp", "cryo"]]], 
	"marais": [[["slime", "hydro"], ["slime", "electro"]], [["goblin", ""], ["archer", ""]], [["wisp", "hydro"]]], 
	"braise": [[["slime", "lava"], ["slime", "pyro"]], [["wisp", "pyro"]], [["golem", "lava"]]], 
	"orage": [[["wisp", "electro"], ["slime", "electro"]], [["goblin", ""], ["goblin", ""], ["archer", ""]], [["golem", "electro"]]], 
}
const NPC_DEFS: = {
	"elder": ["Ancienne Maëlys", "NPC_Elder", Color(0.85, 0.75, 1.0)], 
	"cook": ["Chef Tino", "NPC_Cook", Color(1.0, 0.75, 0.5)], 
	"guard": ["Capitaine Rhéa", "NPC_Guard", Color(0.6, 0.8, 1.0)], 
	"child": ["Petite Lou", "NPC_Child", Color(1.0, 0.85, 0.45)], 
	"scholar": ["Érudit Soren", "NPC_Scholar", Color(0.6, 1.0, 0.8)], 
	"keeper": ["Aldo", "NPC_Keeper", Color(0.95, 0.9, 0.7)], 
	"guild": ["Isaure, de la Guilde", "NPC_Scholar", Color(1.0, 0.72, 0.45)], 
	"grocer": ["Mireille, l'épicière", "NPC_Cook", Color(0.95, 0.85, 0.55)], 
}

## PNJ des nouveaux villages : [nom, modèle, couleur, emplacement, [tenue, tenue 2, cheveux]]
const VILLAGE_NPCS: = {
	"j_chief": ["Doyenne Ondine", "NPC_Elder", Color(0.6, 1.0, 0.82), "jonc_chief", [Color(0.2, 0.5, 0.45), Color(0.85, 0.8, 0.55), Color(0.85, 0.85, 0.9)]], 
	"j_grocer": ["Mirelle, du comptoir", "NPC_Cook", Color(0.75, 0.95, 0.85), "jonc_grocer", [Color(0.3, 0.55, 0.5), Color(0.95, 0.9, 0.8), Color(0.4, 0.25, 0.15)]], 
	"j_cook": ["Chef Gaspard", "NPC_Keeper", Color(0.6, 0.85, 1.0), "jonc_cook", [Color(0.25, 0.4, 0.6), Color(0.9, 0.85, 0.7), Color(0.3, 0.3, 0.32)]], 
	"j_herb": ["Herboriste Lise", "NPC_Scholar", Color(0.75, 1.0, 0.65), "jonc_extra", [Color(0.4, 0.6, 0.3), Color(0.9, 0.85, 0.6), Color(0.75, 0.45, 0.2)]], 
	"f_chief": ["Maître Brann", "NPC_Guard", Color(1.0, 0.65, 0.4), "forge_chief", [Color(0.45, 0.2, 0.12), Color(0.3, 0.28, 0.3), Color(0.2, 0.12, 0.08)]], 
	"f_grocer": ["Ysolde, de la halle", "NPC_Cook", Color(1.0, 0.8, 0.55), "forge_grocer", [Color(0.6, 0.3, 0.15), Color(0.95, 0.85, 0.7), Color(0.1, 0.08, 0.08)]], 
	"f_cook": ["Chef Pyros", "NPC_Keeper", Color(1.0, 0.55, 0.35), "forge_cook", [Color(0.7, 0.2, 0.1), Color(0.95, 0.9, 0.85), Color(0.9, 0.4, 0.15)]], 
	"f_kid": ["Cendre, l'apprentie", "NPC_Child", Color(1.0, 0.75, 0.5), "forge_extra", [Color(0.35, 0.3, 0.3), Color(0.85, 0.5, 0.2), Color(0.85, 0.3, 0.15)]], 
	"h_chief": ["Sage Aeris", "NPC_Elder", Color(0.8, 0.75, 1.0), "vent_chief", [Color(0.4, 0.35, 0.7), Color(0.9, 0.85, 1.0), Color(0.95, 0.95, 1.0)]], 
	"h_grocer": ["Tobias le colporteur", "NPC_Scholar", Color(0.75, 0.85, 1.0), "vent_grocer", [Color(0.3, 0.38, 0.6), Color(0.85, 0.75, 0.5), Color(0.3, 0.22, 0.15)]], 
	"h_cook": ["Mamie Brise", "NPC_Cook", Color(0.95, 0.8, 1.0), "vent_cook", [Color(0.55, 0.42, 0.75), Color(0.95, 0.95, 0.95), Color(0.85, 0.85, 0.88)]], 
	"h_scout": ["Sylve, la guetteuse", "NPC_Guard", Color(0.7, 0.9, 1.0), "vent_extra", [Color(0.25, 0.35, 0.55), Color(0.8, 0.85, 0.9), Color(0.75, 0.6, 0.35)]], 
}

func _ready() -> void :
	_setup_input()
	FX.world = self
	audio = Audio.new();audio.name = "Audio";add_child(audio)
	world = World.new();world.name = "World";add_child(world);world.build()
	daynight = DayNight.new();daynight.world = world;add_child(daynight)
	quests = Quests.new();quests.main = self;add_child(quests)
	quests.changed.connect(_on_quests_changed)
	party = Party.new();party.name = "Party";party.main = self;add_child(party)
	party.global_position = world.spawn_pos
	audio.listener = party
	grass = GrassField.new();grass.setup(world, party);world.add_child(grass)
	daynight.attach_fireflies(party)
	rig = CameraRig.new();rig.name = "CameraRig";add_child(rig)
	rig.target = party;party.cam_rig = rig
	rig.global_position = world.spawn_pos + Vector3(0, 1.4, 0)
	rig.yaw = PI
	party.visual.rotation.y = 0.0
	ui = UI.new();ui.main = self;add_child(ui)
	cine = Cinematic.new();cine.name = "Cinematic";add_child(cine);cine.setup(self)

	ui.process_mode = Node.PROCESS_MODE_ALWAYS
	audio.process_mode = Node.PROCESS_MODE_ALWAYS
	ui.map_ui.setup(self)
	ui._layout()
	load_quality()
	for a in OS.get_cmdline_user_args():
		if a.begins_with("--quality="): apply_quality(int(a.substr(10)), false)
	_spawn_npcs()
	var args: = OS.get_cmdline_user_args()
	if not "--gaittest" in args:
		_spawn_camps()
		_spawn_packs()
		_spawn_world_bosses()
	_spawn_seals()
	_spawn_waypoints()
	_spawn_chests()
	_spawn_crystals()
	_spawn_oculi()
	_spawn_gathers()
	_spawn_beacons()
	_spawn_apples()
	_spawn_cat()
	for a in args:
		if a.begins_with("--shots="): shot_dir = a.substr(8)
	if "--title" in args:
		autotest = true
		party.enabled = false
		ui.show_title(true)
		await _wait(1.0)
		await snap("00_titre")
		get_tree().quit()
		return
	if "--gaittest" in args:
		autotest = true
		start_game(false)
		_gait_test()
		return
	if "--combattest" in args:
		autotest = true
		start_game(false)
		await _wait(1.0)
		await _combat_test()
		print("COMBATTEST done")
		get_tree().quit()
		return
	if "--menutest" in args:
		autotest = true
		start_game(false)
		await _wait(1.0)
		await _menu_test()
		print("MENUTEST done")
		get_tree().quit()
		return
	if "--kittest" in args:
		autotest = true
		start_game(false)
		await _wait(1.0)
		await _new_heroes_test()
		print("KITTEST done")
		get_tree().quit()
		return
	if "--lineup" in args:
		autotest = true
		start_game(false)
		await _lineup()
		get_tree().quit()
		return
	if "--chesttest" in args:
		autotest = true
		start_game(false)
		await _chest_test()
		get_tree().quit()
		return
	if "--bartest" in args:
		autotest = true
		start_game(false)
		await _bar_test()
		get_tree().quit()
		return
	if "--fixtest" in args:
		autotest = true
		start_game(false)
		await _fix_test()
		print("FIXTEST done")
		get_tree().quit()
		return
	if "--bosstest" in args:
		autotest = true
		start_game(false)
		await _boss_test()
		print("BOSSTEST done")
		get_tree().quit()
		return
	if "--domaintest" in args:
		autotest = true
		start_game(false)
		await _domain_test()
		print("DOMAINTEST done")
		get_tree().quit()
		return
	if "--v6tour" in args:
		autotest = true
		start_game(false)
		await _v6_tour()
		print("V6TOUR done")
		get_tree().quit()
		return
	if "--camtest" in args:
		autotest = true
		start_game(false)
		_place(_near(camps[0].center, 9.0), camps[0].center, 6.0, -0.3)
		for i in 30: await get_tree().physics_frame
		var cam: Camera3D = rig.camera
		var cp: = cam.global_position
		print("CAMTEST party=", party.global_position, " ground=", world.height_at(party.global_position.x, party.global_position.z))
		print("CAMTEST cam=", cp, " ground_at_cam=", world.height_at(cp.x, cp.z), " arm_len=", rig.arm.get_hit_length(), " yaw=", rig.yaw)
		var space: = get_world_3d().direct_space_state
		var q: = PhysicsRayQueryParameters3D.create(cp + Vector3(0, 50, 0), cp - Vector3(0, 50, 0))
		var hit: = space.intersect_ray(q)
		print("CAMTEST ray hit=", hit.get("position", "none"), " collider=", hit.get("collider", null))
		await snap("cam")
		get_tree().quit()
		return
	var views: Array[String] = []
	for a in args:
		if a.begins_with("--view="): views.append(a)
	if not views.is_empty():

		autotest = true
		start_game(false)
		var vpitch: = -0.25
		var vdist: = 7.0
		for a in args:
			if a.begins_with("--pitch="): vpitch = float(a.substr(8))
			if a.begins_with("--dist="): vdist = float(a.substr(7))
		if "--nohud" in args: ui.hud.visible = false
		daynight.paused = true
		for v in views:
			var f: PackedStringArray = v.substr(7).split(":")
			if f.size() > 5: daynight.hour = float(f[5]);daynight.apply()
			if f.size() > 6 and f[6] == "boss" and not is_instance_valid(boss): spawn_boss()
			_place(Vector3(float(f[1]), 0, float(f[2])), Vector3(float(f[3]), 0, float(f[4])), vdist, vpitch)
			await _wait(1.2)
			await snap(f[0])
		get_tree().quit()
		return
	for t in ["climbtest", "swimtest", "oculustest", "v8test", "v8shots"]:
		if "--" + t in args:
			autotest = true
			start_game(false)
			await _wait(1.0)
			match t:
				"climbtest": await _climb_test()
				"swimtest": await _swim_test()
				"oculustest": await _oculus_test()
				"v8test": await _v8_test()
				"v8shots": await _v8_shots()
			print(t.to_upper() + " done")
			get_tree().quit()
			return
	if "--questtest" in args:
		autotest = true
		start_game(false)
		_quest_test()
		return
	if "--autotest" in args:
		autotest = true
		start_game(false)
		_autotest()
	else:
		party.enabled = false
		ui.show_title(FileAccess.file_exists(SAVE_PATH))
		audio.music("explore")

func _setup_input() -> void :
	var map: = {
		"move_forward": [KEY_W, KEY_UP], "move_back": [KEY_S, KEY_DOWN], "move_left": [KEY_A, KEY_LEFT], "move_right": [KEY_D, KEY_RIGHT], 
		"jump": [KEY_SPACE], "sprint": [KEY_SHIFT], "attack": [KEY_J], "skill": [KEY_E], "burst": [KEY_Q, KEY_R], 
		"switch1": [KEY_1, KEY_KP_1], "switch2": [KEY_2, KEY_KP_2], "switch3": [KEY_3, KEY_KP_3], 
		"switch4": [KEY_4, KEY_KP_4], "interact": [KEY_F], "pause": [KEY_ESCAPE], 
		"map": [KEY_M, KEY_SEMICOLON, KEY_TAB], "food": [KEY_H], "quest_next": [KEY_T], "time_menu": [KEY_N], "quest_log": [KEY_L], 
		"sight": [KEY_V], 
	}
	for action in map:
		if not InputMap.has_action(action): InputMap.add_action(action)
		for k in map[action]:
			var ev: = InputEventKey.new();ev.physical_keycode = k
			InputMap.action_add_event(action, ev)
	var mb: = InputEventMouseButton.new();mb.button_index = MOUSE_BUTTON_LEFT
	InputMap.action_add_event("attack", mb)
	var mr: = InputEventMouseButton.new();mr.button_index = MOUSE_BUTTON_RIGHT
	InputMap.action_add_event("sprint", mr)

func start_game(load_save: bool) -> void :
	playing = true
	party.enabled = true
	ui.hide_title()
	if load_save and load_game():
		ui.message("Bon retour sur Aetheria !", 2.2)
	else:
		_new_game()
		play_cine("prologue")
		ui.message("Bienvenue sur l'île d'Aetheria !", 2.6)
		get_tree().create_timer(3.0).timeout.connect( func():
			if quests.st("main") == "available" and not ui.dlg_open:
				ui.message("Parle à l'Ancienne Maëlys, près de la statue du village.", 3.0, Color(1, 0.9, 0.6)))
	audio.music("explore")
	if not ui.touch and not autotest:
		Input.mouse_mode = Input.MOUSE_MODE_CAPTURED
	_on_quests_changed()

func _new_game() -> void :
	rank = 1;xp = 0;shards = 0;crystals_got = 0;treasure_map = false
	inv = {};mora = 300;recipes_known = {};recipe_mastery = {};dishes_cooked = 0;seen_cines = {}
	for r in Items.RECIPES:
		if Items.RECIPES[r].known: recipes_known[r] = true
	oculi_got = 0;oculi_offered = 0;statue_level = 0;oculus_hint = false
	for o in oculi:
		o.got = false;(o.node as Node3D).visible = true
	apply_stamina_level()
	domain_clears = {}
	for id in world_bosses: world_bosses[id].kills = 0
	quests.reset()
	daynight.hour = 8.5
	party.apply_rank(1)
	party.revive_all()
	party.global_position = world.spawn_pos
	party.safe_pos = world.spawn_pos
	rig.yaw = PI
	_unlock_waypoint(0, true)


func _level_at(p: Vector3) -> float:
	if p.x > World.DUNGEON_X: return 1.0

	var base: = {"marais": 13.0, "braise": 21.0, "orage": 27.0}
	var b: = world.biome_at(p.x, p.z)
	if base.has(b):
		var r: float = world.region_r(b, p.x, p.z)
		return level_mult(base[b] + 4.0 * clampf((0.9 - r) / 0.6, 0.0, 1.0))
	var d: = Vector2(p.x - world.village.x, p.z - world.village.z).length()
	return 1.0 + 0.45 * clampf((d - 50.0) / 230.0, 0.0, 1.0) + (0.25 if p.y > 30.0 else 0.0)


static func level_mult(lv: float) -> float:
	return 1.0 + (lv - 2.0) / 25.714

func _make_enemy(kind: String, elem: String, p: Vector3, lvl: float, bname: = "") -> Enemy:
	var e: = Enemy.new()
	e.party = party;e.main = self;e.boss_name = bname
	add_child(e)
	e.setup(kind, elem, p, lvl)
	e.global_position = p + Vector3(0, 0.3, 0)
	e.died.connect(_on_enemy_died)
	return e


func _spawn_world_bosses() -> void :
	for id in WORLD_BOSSES:
		if not world_bosses.has(id): world_bosses[id] = {"node": null, "respawn": -1.0, "kills": 0}
		_spawn_world_boss(id)

func _spawn_world_boss(id: String) -> void :
	var d: Dictionary = WORLD_BOSSES[id]
	var p: Vector3 = world.boss_spots[id]
	var e: = _make_enemy(d.kind, d.elem, p, level_mult(d.lvl), d.name)
	e.set_meta("world_boss", id)
	world_bosses[id].node = e
	world_bosses[id].respawn = -1.0


func boss_summon(b: Enemy, kinds: Array) -> void :
	for k in kinds.size():
		var a: = TAU * k / kinds.size() + randf() * 0.6
		var q: = b.global_position + Vector3(cos(a), 0, sin(a)) * 5.0
		q.y = world.height_at(q.x, q.z)
		var e: = _make_enemy(kinds[k][0], kinds[k][1], q, b.level_mult * 0.85)
		e.alerted = true
		e.home = b.home
		if dungeon: dungeon.adopt(e)
		FX.column(q, FX.element_color(kinds[k][1]) if kinds[k][1] != "" else Color(0.9, 0.8, 0.6), 0.8, 3.0, 0.8)

func _on_world_boss_defeated(id: String, e: Enemy) -> void :
	var wb: Dictionary = world_bosses[id]
	var d: Dictionary = WORLD_BOSSES[id]
	var first: bool = wb.kills == 0
	wb.kills += 1
	wb.node = null
	wb.respawn = 240.0
	ui.show_banner("%s vaincu !" % d.name, Color(1.0, 0.85, 0.45))
	give_xp(int(d.xp) if first else 220, "Boss")
	add_shards(int(d.shards) if first else 40)
	_spawn_reward_chest(e.global_position + Vector3(2.5, 0, 0), -2)
	quests.on_world_boss(id)
	save_game()

func _update_world_bosses(delta: float) -> void :
	for id in world_bosses:
		var wb: Dictionary = world_bosses[id]
		if not seen_cines.has("boss_" + id) and is_instance_valid(wb.node) and not cinematic and not dungeon \
				and party.global_position.distance_to(world.boss_spots[id]) < 34.0:
			play_cine("boss_" + id)
		if wb.respawn > 0.0:
			wb.respawn -= delta
			if wb.respawn <= 0.0:
				if party.global_position.distance_to(world.boss_spots[id]) > 70.0: _spawn_world_boss(id)
				else: wb.respawn = 15.0


func domain_def(id: String) -> Dictionary:
	for dm in world.domains:
		if dm.id == id: return dm
	return {}

func enter_domain(id: String) -> void :
	var dm: = domain_def(id)
	if dm.is_empty() or dungeon: return
	if rank < int(dm.rank):
		ui.message("Rang d'aventure %d requis pour entrer dans ce domaine (tu es rang %d)." % [int(dm.rank), rank], 2.8, Color(1.0, 0.6, 0.5))
		audio.play("click", -4.0)
		return
	party.reset_motion()
	dungeon = Dungeon.new()
	dungeon.name = "Domain_" + id
	add_child(dungeon)
	dungeon.setup(self, id)
	daynight.override_hour(dungeon.hour)
	var start: Vector3 = dungeon.entry_pos()
	party.global_position = start;party.velocity = Vector3.ZERO
	party.visual.rotation.y = 0.0
	rig.yaw = PI;rig.global_position = start + Vector3(0, 1.45, 0)
	FX.column(start, Color(0.6, 0.85, 1.0), 1.0, 5.0, 1.0)
	audio.play("waypoint")
	ui.show_banner("Domaine : %s" % dm.name, Color(1.0, 0.85, 0.55))
	ui.map_ui.set_domain_mode(true, dm.name)

func leave_domain(cleared: bool) -> void :
	if dungeon == null: return
	var dm: = domain_def(dungeon.id)
	dungeon.queue_free()
	dungeon = null
	daynight.override_hour(-1.0)
	var p: Vector3 = dm.pos
	var out: = - p;out.y = 0;out = out.normalized()
	party.reset_motion()
	party.global_position = world.snap(p + out * 5.0, 0.6);party.velocity = Vector3.ZERO
	rig.global_position = party.global_position + Vector3(0, 1.45, 0)
	rig.yaw = atan2(out.x, out.z)
	FX.column(party.global_position, Color(0.6, 0.85, 1.0), 1.0, 5.0, 1.0)
	ui.map_ui.set_domain_mode(false, "")
	if not cleared: ui.message("Tu as quitté le domaine.", 2.0, Color(0.85, 0.9, 1.0))
	save_game()


func on_domain_cleared(id: String) -> void :
	var dm: = domain_def(id)
	var first: = int(domain_clears.get(id, 0)) == 0
	domain_clears[id] = int(domain_clears.get(id, 0)) + 1
	ui.show_banner("Domaine terminé : %s" % dm.name, Color(1.0, 0.88, 0.5))
	audio.play("quest")
	var lvl: = {"masques": 1.0, "forge": 1.6, "celeste": 2.2}.get(id, 1.0) as float
	give_xp(int((500 if first else 160) * lvl), "Domaine")
	add_shards(int((120 if first else 35) * lvl))
	quests.on_domain(id)
	save_game()


func active_boss() -> Enemy:
	var best: Enemy = null
	var bd: = 60.0
	var cands: Array = []
	if is_instance_valid(boss): cands.append(boss)
	for id in world_bosses:
		if is_instance_valid(world_bosses[id].node): cands.append(world_bosses[id].node)
	if dungeon and is_instance_valid(dungeon.boss): cands.append(dungeon.boss)
	for b in cands:
		var e: Enemy = b
		if not e.alive or not e.alerted: continue
		var d: = party.global_position.distance_to(e.global_position)
		if d < bd: bd = d;best = e
	return best

func _spawn_camps() -> void :
	for i in world.camps.size():
		var cdef: Dictionary = world.camps[i]
		var c: Vector3 = cdef.pos
		var camp: = {"center": c, "enemies": [], "cleared": false, "theme": cdef.theme, "chest": null, "opened": false}
		camps.append(camp)
		_fill_camp(i)

func _fill_camp(i: int) -> void :
	var camp: Dictionary = camps[i]
	var c: Vector3 = camp.center
	var setup: Array = CAMP_SETUP[camp.theme]
	for k in setup.size():
		var kind: String = setup[k][0]
		var a: = TAU * k / setup.size() + 0.4
		var r: = 0.0 if kind == "golem" else 4.0
		var p: = c + Vector3(cos(a), 0, sin(a)) * r
		p.y = world.height_at(p.x, p.z)
		var e: = _make_enemy(kind, setup[k][1], p, _level_at(c))
		e.camp = i
		camp.enemies.append(e)

func _spawn_packs() -> void :
	var rng: = RandomNumberGenerator.new();rng.seed = 404
	for s in world.roam_spots:
		var pack: = {"pos": s.pos, "biome": s.biome, "enemies": [], "respawn": -1.0, "variant": rng.randi() % 3}
		packs.append(pack)
		_fill_pack(packs.size() - 1)

func _fill_pack(i: int) -> void :
	var pack: Dictionary = packs[i]
	var opts: Array = PACK_SETUP.get(pack.biome, PACK_SETUP["prairie"])
	var setup: Array = opts[pack.variant % opts.size()]
	for k in setup.size():
		var a: = TAU * k / setup.size()
		var p: Vector3 = pack.pos + Vector3(cos(a), 0, sin(a)) * 2.5
		p.y = world.height_at(p.x, p.z)
		var e: = _make_enemy(setup[k][0], setup[k][1], p, _level_at(p))
		e.pack = i
		pack.enemies.append(e)
	pack.respawn = -1.0

func spawn_boss() -> void :
	if is_instance_valid(boss) or boss_done: return
	boss = _make_enemy("boss", "cryo", world.summit, level_mult(8.0))
	boss.aggro = 28.0
	ui.message("Le Gardien Givré s'est réveillé au sommet du Pic Givré !", 3.0, Color(0.7, 0.92, 1.0))

func spawn_boss_adds(p: Vector3) -> void :
	for k in 2:
		var a: = randf() * TAU
		var q: = p + Vector3(cos(a), 0, sin(a)) * 6.0
		q.y = world.height_at(q.x, q.z)
		var e: = _make_enemy("slime", "cryo", q, level_mult(8.0))
		e.alerted = true
		FX.column(q, Color(0.7, 0.92, 1.0), 0.8, 3.0, 0.8)

func _spawn_npcs() -> void :
	npc_lib = load("res://assets/npc.glb").instantiate()
	for id in NPC_DEFS:
		var d: Array = NPC_DEFS[id]
		var n: = NPC.new()
		add_child(n)
		n.setup(id, d[0], d[1], d[2], npc_lib)
		var p: Vector3 = world.npc_spots.get(id, world.spawn_pos)
		n.global_position = p
		var look: = world.village - p;look.y = 0
		if id == "keeper": look = Vector3(0, 0, 1)
		n.rotation.y = atan2(look.x, look.z) if look.length() > 0.1 else 0.0
		n.target = party
		_view_range(n, 55.0)
		if id == "guild": n.recolor(Color(0.62, 0.17, 0.18), Color(0.95, 0.78, 0.4), Color(0.22, 0.14, 0.1))
		if id == "grocer": n.recolor(Color(0.85, 0.55, 0.3), Color(0.98, 0.95, 0.88), Color(0.55, 0.3, 0.15))
		npcs[id] = n
	for id in VILLAGE_NPCS:
		var d2: Array = VILLAGE_NPCS[id]
		var n2: = NPC.new()
		add_child(n2)
		n2.setup(id, d2[0], d2[1], d2[2], npc_lib)
		var p2: Vector3 = world.npc_spots.get(d2[3], world.spawn_pos)
		n2.global_position = p2
		var vc: Dictionary = world.village_at(p2, 40.0)
		var look2: Vector3 = ((vc.pos as Vector3) - p2) if not vc.is_empty() else Vector3(0, 0, 1)
		look2.y = 0
		n2.rotation.y = atan2(look2.x, look2.z) if look2.length() > 0.1 else 0.0
		n2.target = party
		_view_range(n2, 55.0)
		var cols: Array = d2[4]
		n2.recolor(cols[0], cols[1], cols[2])
		npcs[id] = n2
	npc_lib.free();npc_lib = null

func _spawn_seals() -> void :
	for i in world.seals.size():
		var s: = Seal.new()
		add_child(s)
		s.setup_seal(world, i, world.seal_elems[i], world.seals[i])
		s.global_position = world.seals[i]
		s.main = self;s.party = party
		s.activated.connect(_on_seal_activated)
		seals.append(s)

func _spawn_waypoints() -> void :
	for i in world.waypoints.size():
		var p: Vector3 = world.waypoints[i].pos
		var n: = Node3D.new();add_child(n);n.position = p
		n.add_child(world.make_prop("Waypoint"))
		var crystal: = world.make_prop("WaypointCrystal", Color(0.55, 0.58, 0.66))
		crystal.position = Vector3(0, 3.6, 0);n.add_child(crystal)
		var m: = StandardMaterial3D.new();m.albedo_color = Color(0.5, 0.52, 0.6);m.emission_enabled = true
		m.emission = Color(0.4, 0.75, 1.0);m.emission_energy_multiplier = 0.0;m.diffuse_mode = BaseMaterial3D.DIFFUSE_TOON
		crystal.material_override = m
		world.cyl_collider(p, 0.9, 2.6)
		_view_range(n, 170.0)
		wp_nodes.append({"node": n, "crystal": crystal, "mat": m})

func _spawn_chests() -> void :
	for i in world.chest_spots.size():
		var p: Vector3 = world.chest_spots[i]
		var node: = _make_chest(p, randf() * TAU)
		chests.append({"pos": p, "node": node, "opened": false, "lid": node.get_meta("lid"), "camp": -1})

func _view_range(n: Node, d: float) -> void :
	for g in n.find_children("*", "GeometryInstance3D", true, false):
		(g as GeometryInstance3D).visibility_range_end = d
		(g as GeometryInstance3D).visibility_range_end_margin = d * 0.1
	if n is GeometryInstance3D:
		(n as GeometryInstance3D).visibility_range_end = d

func _make_chest(p: Vector3, yaw: float) -> Node3D:
	var chest: = Node3D.new()
	add_child(chest)

	var e: = 0.6
	var n: = Vector3(world.height_at(p.x - e, p.z) - world.height_at(p.x + e, p.z), 2.0 * e, 
		world.height_at(p.x, p.z - e) - world.height_at(p.x, p.z + e)).normalized()
	var lean: = Vector3.UP.slerp(n, 0.7).normalized()
	chest.basis = Basis(Quaternion(Vector3.UP, lean)) * Basis(Vector3.UP, yaw)
	chest.position = Vector3(p.x, world.height_at(p.x, p.z) - 0.03 - 0.42 * tan(lean.angle_to(n)), p.z)
	var body: = world.make_prop("Chest");chest.add_child(body)

	var lid_pivot: = Node3D.new();lid_pivot.position = Vector3(0, 0.4, -0.3);chest.add_child(lid_pivot)
	var lid: = world.make_prop("ChestLid");lid_pivot.add_child(lid)
	chest.set_meta("lid", lid_pivot)
	chest.scale = Vector3.ONE * 1.3
	_view_range(chest, 55.0)
	return chest

var _cmat: StandardMaterial3D
func _crystal_mat() -> StandardMaterial3D:
	if _cmat == null:
		_cmat = StandardMaterial3D.new()
		_cmat.albedo_color = Color(0.25, 0.62, 1.0)
		_cmat.emission_enabled = true;_cmat.emission = Color(0.2, 0.55, 1.0);_cmat.emission_energy_multiplier = 0.9
		_cmat.diffuse_mode = BaseMaterial3D.DIFFUSE_TOON;_cmat.specular_mode = BaseMaterial3D.SPECULAR_TOON
		_cmat.roughness = 0.2;_cmat.rim_enabled = true;_cmat.rim = 0.8;_cmat.rim_tint = 0.2
	return _cmat

func _spawn_crystals() -> void :
	for p in world.crystal_spots:
		var mi: = world.make_prop("Crystal")
		mi.material_override = _crystal_mat()
		add_child(mi);mi.position = p
		_view_range(mi, 110.0)
		crystals.append({"node": mi, "got": false})

var _oc_halo: Material
func _spawn_oculi() -> void :
	_oc_halo = FX.mat_emit(Color(0.45, 1.0, 0.8), 1.4, 0.18)
	var halo_mesh: = SphereMesh.new();halo_mesh.radius = 0.5;halo_mesh.height = 1.0;halo_mesh.radial_segments = 16;halo_mesh.rings = 8
	for p in world.oculus_spots:
		var n: = Node3D.new();n.name = "Oculus%d" % oculi.size();add_child(n);n.position = p
		var mi: = world.make_prop("Oculus");mi.scale = Vector3.ONE * 1.3;n.add_child(mi)
		mi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
		var h: = MeshInstance3D.new();h.mesh = halo_mesh;h.material_override = _oc_halo;n.add_child(h)
		h.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
		_view_range(n, 90.0)
		oculi.append({"node": n, "mesh": mi, "got": false, "pos": p})

func oculi_in_hand() -> int:
	return oculi_got - oculi_offered

## Anémoculus déjà offerts pour le niveau en cours.
func statue_progress() -> int:
	var spent: = 0
	for k in mini(statue_level, OCULUS_LEVELS.size()): spent += int(OCULUS_LEVELS[k])
	return oculi_offered - spent

func statue_reward(level: int) -> Dictionary:
	return {"xp": 60 + 20 * level, "shards": 30 + 10 * level}

## Endurance maximale = 100 + 15 par niveau de résonance des statues.
func apply_stamina_level() -> void :
	party.stamina_max = 100.0 + STAMINA_PER_LEVEL * statue_level
	party.stamina = minf(party.stamina, party.stamina_max)

## Offre tous les Anémoculus utiles ; renvoie le nombre de niveaux gagnés.
func offer_oculi() -> int:
	var gained: = 0
	while statue_level < OCULUS_LEVELS.size() and oculi_in_hand() > 0:
		var need: int = int(OCULUS_LEVELS[statue_level]) - statue_progress()
		var k: = mini(need, oculi_in_hand())
		oculi_offered += k
		if k < need: break
		statue_level += 1;gained += 1
		var rw: = statue_reward(statue_level)
		shards += int(rw.shards)
		give_xp(int(rw.xp))
	apply_stamina_level()
	if gained > 0:
		party.stamina = party.stamina_max
		var s: = _nearest(world.statues)
		if s != Vector3.INF:
			FX.column(s, Color(0.5, 1.0, 0.82), 1.6, 9.0, 1.4)
			FX.particles(s + Vector3(0, 3.0, 0), Color(0.6, 1.0, 0.85), 50, 6.0, 1.2, 0.1, -2.0)
		FX.sphere(party.global_position + Vector3(0, 1.0, 0), Color(0.6, 1.0, 0.85), 0.3, 2.2, 0.5, 0.5)
		ui.show_banner("Endurance maximale augmentée : %d" % int(party.stamina_max), Color(0.65, 1.0, 0.85))
		if statue_level >= OCULUS_LEVELS.size():
			ui.message("La Statue d'Aetheria a atteint sa résonance maximale !", 3.0, Color(0.7, 1.0, 0.88))
	save_game()
	return gained

func _collect_oculus(o: Dictionary) -> void :
	o.got = true;oculi_got += 1
	var n: Node3D = o.node
	var q: Vector3 = n.position
	FX.particles(q, Color(0.55, 1.0, 0.85), 28, 3.5, 0.8, 0.08, 0.0)
	FX.sphere(q, Color(0.55, 1.0, 0.85), 0.2, 1.5, 0.35, 0.5)
	var tw: = n.create_tween()
	tw.tween_method( func(k: float):
		n.position = q.lerp(party.global_position + Vector3(0, 1.1, 0), k)
		n.scale = Vector3.ONE * (1.0 - k * 0.85), 0.0, 1.0, 0.35).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_IN)
	tw.tween_callback( func():
		n.visible = false;n.position = q;n.scale = Vector3.ONE
		FX.particles(party.global_position + Vector3(0, 1.1, 0), Color(0.6, 1.0, 0.85), 14, 2.0, 0.5, 0.06, 1.0))
	audio.play("pickup", -1.0)
	audio.play("orb", -6.0)
	ui.toast("Anémoculus  %d / %d" % [oculi_got, oculi.size()], ui.icons.get("ic_oculus"), Color(0.62, 1.0, 0.86))
	give_xp(15)
	if not oculus_hint:
		oculus_hint = true
		ui.message("Un Anémoculus ! Offre-les à une Statue d'Aetheria pour augmenter ton endurance.", 3.6, Color(0.7, 1.0, 0.88))
	save_game()

func nearest_oculus_dist() -> float:
	var best: = INF
	for o in oculi:
		if not o.got: best = minf(best, party.global_position.distance_to(o.pos))
	return best

## Endurance épuisée dans l'eau : fondu au noir puis retour sur la dernière terre ferme.
func on_drown() -> void :
	party.frozen_t = 0.5
	ui.fade_flash(0.3, 0.2, 0.45)
	ui.message("Plus d'endurance… tu regagnes la rive.", 2.4, Color(0.75, 0.9, 1.0))
	get_tree().create_timer(0.32, false).timeout.connect( func():
		var p: Vector3 = party.safe_pos if party.safe_pos != Vector3.INF else world.statue_pos + Vector3(0, 0.6, 5.0)
		party.reset_motion()
		party.global_position = p + Vector3(0, 0.4, 0)
		party.velocity = Vector3.ZERO
		party.stamina = party.stamina_max * 0.5
		rig.global_position = party.global_position + Vector3(0, 1.45, 0))

# ----------------------------------------------------------------------------
# Cueillette : plantes (touche F) et fruits qui tombent des arbres frappés
# ----------------------------------------------------------------------------
var gathers: Array = []
var drops: Array = []

func _spawn_gathers() -> void :
	for g in world.gather_spots:
		var mi: = world.make_prop(world.GATHER_KINDS[g.kind])
		if mi.mesh == null: continue
		add_child(mi);mi.position = g.pos;mi.rotation.y = randf() * TAU
		mi.scale = Vector3.ONE * (1.6 if g.kind in ["menthe", "lys_vent", "piment"] else 1.4)
		mi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
		_view_range(mi, 60.0)
		gathers.append({"node": mi, "kind": g.kind, "pos": g.pos, "t": 0.0})

func _pick_gather(g: Dictionary) -> void :
	if g.t > 0.0: return
	g.t = 300.0
	var n: Node3D = g.node
	var tw: = n.create_tween()
	tw.tween_property(n, "scale", n.scale * 0.1, 0.18)
	tw.tween_callback( func(): n.visible = false)
	FX.particles((g.pos as Vector3) + Vector3(0, 0.3, 0), Color(0.75, 1.0, 0.6), 12, 2.0, 0.5, 0.05, 1.0)
	audio.play("pickup", -4.0)
	add_item(g.kind, 2 if g.kind in ["menthe", "champignon"] else 1)
	quests.on_gather(g.kind)

func _tick_gathers(delta: float) -> void :
	for g in gathers:
		if g.t > 0.0:
			g.t -= delta
			if g.t <= 0.0:
				var n: Node3D = g.node;n.visible = true
				n.scale = Vector3.ONE * (1.6 if g.kind in ["menthe", "lys_vent", "piment"] else 1.4)

## Coup porté devant le héros : secoue les arbres touchés et fait tomber leurs fruits.
func world_hit(origin: Vector3, fwd: Vector3, reach: float) -> void :
	if dungeon: return
	for i in world.trees_near(origin, reach + 0.6):
		var t: Dictionary = world.trees[i]
		var to: Vector3 = t.p - origin;to.y = 0
		if to.length() > 0.5 and fwd.dot(to.normalized()) < 0.15: continue
		var fruit: String = t.fruit
		var fall: Array = world.shake_tree(i, to if to.length() > 0.1 else fwd)
		var leaf_col: = Color(0.45, 0.75, 0.35) if not t.pine else Color(0.3, 0.55, 0.4)
		FX.particles((t.crown as Vector3) - Vector3(0, 0.8, 0), leaf_col, 10, 2.0, 1.2, 0.07, -2.0)
		audio.play("thud", -12.0)
		for q in fall:
			_drop_item(fruit, q)
		if not fall.is_empty(): quests.on_tree_shaken(fruit)

## Fruit qui tombe de l'arbre puis reste au sol quelques minutes ; ramassé en passant dessus.
func _drop_item(id: String, from: Vector3) -> void :
	var sm: = SphereMesh.new();sm.radius = 0.17 if id != "baie_givre" else 0.13;sm.height = sm.radius * 2.0
	sm.radial_segments = 10;sm.rings = 6
	var mi: = MeshInstance3D.new();mi.mesh = sm
	var col: Color = world.FRUIT_COLORS.get(id, Color.WHITE)
	var m: = Toon.material(col);m.emission_enabled = true;m.emission = col;m.emission_energy_multiplier = 0.5
	mi.material_override = m;mi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	add_child(mi)
	var to: = from + Vector3(randf_range(-1.2, 1.2), 0, randf_range(-1.2, 1.2))
	to.y = world.height_at(to.x, to.z) + sm.radius
	mi.position = from
	var tw: = mi.create_tween()
	tw.tween_property(mi, "position", to, 0.55 + randf() * 0.2).set_trans(Tween.TRANS_BOUNCE).set_ease(Tween.EASE_OUT)
	var sparkle: = Label3D.new();sparkle.text = "✦";sparkle.font_size = 64;sparkle.pixel_size = 0.004
	sparkle.billboard = BaseMaterial3D.BILLBOARD_ENABLED;sparkle.modulate = Color(1.0, 0.95, 0.7);sparkle.position = Vector3(0, 0.35, 0)
	sparkle.no_depth_test = true;mi.add_child(sparkle)
	drops.append({"node": mi, "id": id, "t": 180.0, "age": 0.0})

func _tick_drops(delta: float, pp: Vector3) -> void :
	for n in range(drops.size() - 1, -1, -1):
		var d: Dictionary = drops[n]
		var node: Node3D = d.node
		d.t -= delta;d.age += delta
		node.rotation.y += delta * 1.5
		if d.age > 0.6 and node.position.distance_to(pp + Vector3(0, 0.3, 0)) < 1.5:
			FX.particles(node.position, world.FRUIT_COLORS.get(d.id, Color.WHITE), 8, 2.0, 0.4, 0.05, 1.0)
			audio.play("pickup", -6.0)
			add_item(d.id, 1)
			node.queue_free();drops.remove_at(n)
		elif d.t <= 0.0:
			node.queue_free();drops.remove_at(n)

## Points d'intérêt révélés par la vision élémentaire : [position, sorte].
func sight_targets(radius: float) -> Array:
	var out: = []
	var pp: = party.global_position
	if dungeon:
		for r in dungeon.relics: out.append([(r.node as Node3D).global_position, "relic"])
		return out
	for o in oculi:
		if not o.got and pp.distance_to(o.pos) < radius: out.append([o.pos, "oculus"])
	for ch in chests:
		if not ch.opened and pp.distance_to((ch.node as Node3D).position) < radius: out.append([(ch.node as Node3D).position + Vector3(0, 0.8, 0), "chest"])
	for g in gathers:
		if g.t <= 0.0 and pp.distance_to(g.pos) < radius: out.append([(g.pos as Vector3) + Vector3(0, 0.4, 0), "plant"])
	for t in world.trees_near(pp, radius):
		var tr: Dictionary = world.trees[t]
		if tr.ripe and tr.fruit != "": out.append([tr.crown, "fruit"])
	for c in crystals:
		if not c.got and pp.distance_to((c.node as Node3D).position) < radius: out.append([(c.node as Node3D).position, "crystal"])
	for b in beacons:
		if not b.lit and quests.is_active("q_vent_vigie"): out.append([(b.node as Node3D).position + Vector3(0, 0.6, 0), "beacon"])
	return out

## Courant ascendant sous le héros (planeur) : renvoie la force de portance (0 = aucune).
func updraft_at(p: Vector3) -> float:
	for u in world.updraft_spots:
		var d: = Vector2(p.x - u.x, p.z - u.z).length()
		if d < 3.4 and p.y < u.y + 30.0 and p.y > u.y - 2.0: return 1.0
	return 0.0

# ----------------------------------------------------------------------------
# Feux de vigie (quête « Les feux de vigie »)
# ----------------------------------------------------------------------------
var beacons: Array = []

func _spawn_beacons() -> void :
	for i in world.beacon_spots.size():
		var p: Vector3 = world.beacon_spots[i]
		var n: = Node3D.new();n.name = "Beacon%d" % i;add_child(n);n.position = p
		var bowl: = MeshInstance3D.new(); var cm: = CylinderMesh.new();cm.top_radius = 0.45;cm.bottom_radius = 0.22;cm.height = 0.45
		bowl.mesh = cm;bowl.material_override = Toon.material(Color(0.32, 0.3, 0.34));bowl.position = Vector3(0, 0.22, 0);n.add_child(bowl)
		var leg: = MeshInstance3D.new(); var lm: = CylinderMesh.new();lm.top_radius = 0.08;lm.bottom_radius = 0.12;lm.height = 0.5
		leg.mesh = lm;leg.material_override = Toon.material(Color(0.25, 0.22, 0.2));leg.position = Vector3(0, -0.1, 0);n.add_child(leg)
		_view_range(n, 140.0)
		beacons.append({"node": n, "lit": false, "i": i})

func _light_beacon(b: Dictionary, fx: = true) -> void :
	if b.lit: return
	b.lit = true
	var n: Node3D = b.node
	var fire: = CPUParticles3D.new();fire.amount = 26;fire.lifetime = 0.8;fire.emission_shape = CPUParticles3D.EMISSION_SHAPE_SPHERE
	fire.emission_sphere_radius = 0.25;fire.direction = Vector3.UP;fire.spread = 15.0;fire.initial_velocity_min = 1.2;fire.initial_velocity_max = 2.2
	fire.gravity = Vector3(0, 1.0, 0);fire.scale_amount_min = 0.8;fire.scale_amount_max = 1.4
	var sm: = SphereMesh.new();sm.radius = 0.14;sm.height = 0.28;sm.radial_segments = 6;sm.rings = 3;fire.mesh = sm
	var g: = Gradient.new();g.set_color(0, Color(1.0, 0.95, 0.55));g.add_point(0.4, Color(1.0, 0.55, 0.15));g.set_color(1, Color(0.8, 0.15, 0.05, 0.0))
	fire.color_ramp = g;fire.material_override = FX.mat_emit(Color.WHITE, 3.0, 1.0, true)
	var curve: = Curve.new();curve.add_point(Vector2(0, 1));curve.add_point(Vector2(1, 0.2));fire.scale_amount_curve = curve
	fire.position = Vector3(0, 0.5, 0);n.add_child(fire)
	var l: = OmniLight3D.new();l.light_color = Color(1.0, 0.6, 0.25);l.light_energy = 2.5;l.omni_range = 14.0;l.shadow_enabled = false
	l.position = Vector3(0, 1.2, 0);n.add_child(l)
	if fx:
		FX.column(n.global_position, Color(1.0, 0.6, 0.2), 0.8, 6.0, 1.2)
		FX.particles(n.global_position + Vector3(0, 0.8, 0), Color(1.0, 0.7, 0.3), 30, 5.0, 1.0, 0.08, -2.0)
		audio.play("explode", -10.0)

func next_beacon_pos(_qid: String) -> Vector3:
	var best: = Vector3.INF; var bd: = INF
	for b in beacons:
		if not b.lit:
			var d: float = party.global_position.distance_to((b.node as Node3D).position)
			if d < bd: bd = d;best = (b.node as Node3D).position
	return best

func _sync_beacons() -> void :
	var st: String = quests.st("q_vent_vigie")
	for b in beacons:
		if st == "done" or b.i in quests.q["q_vent_vigie"].got: _light_beacon(b, false)

func _spawn_apples() -> void :
	var m: = StandardMaterial3D.new();m.albedo_color = Color(1.0, 0.45, 0.2);m.emission_enabled = true
	m.emission = Color(1.0, 0.55, 0.2);m.emission_energy_multiplier = 0.6;m.diffuse_mode = BaseMaterial3D.DIFFUSE_TOON
	for p in world.apple_spots:
		var mi: = world.make_prop("Apple")
		mi.material_override = m
		add_child(mi);mi.position = p;mi.scale = Vector3.ONE * 1.4
		_view_range(mi, 45.0)
		apples.append({"node": mi, "got": false})

func _spawn_cat() -> void :
	cat_node = world.make_prop("Cat")
	add_child(cat_node)
	cat_node.position = world.cat_spot
	Toon.apply(cat_node, true, false, 0.004)


## Nom et couleur d'un personnage qui parle (héros ou PNJ), pour les sous-titres.
func speaker_name(id: String) -> String:
	if Quests.SPEAKERS.has(id): return String(Quests.SPEAKERS[id])
	return npc_name(id)

func speaker_color(id: String) -> Color:
	if Quests.COLORS.has(id): return Quests.COLORS[id]
	return npc_color(id)

## Lance une cinématique (voir CineScenes) ; on_done est appelé à la fin.
func play_cine(name: String, on_done: = Callable()) -> void :
	var steps: Array = CineScenes.build(name, self)
	seen_cines[name] = true
	if steps.is_empty() or (autotest and not allow_cine_in_test):
		if on_done.is_valid(): on_done.call()
		return
	cine.play(steps, on_done)

var allow_cine_in_test: = false

func npc_color(id: String) -> Color:
	if NPC_DEFS.has(id): return NPC_DEFS[id][2]
	if VILLAGE_NPCS.has(id): return VILLAGE_NPCS[id][2]
	return Color(1, 0.9, 0.7)

## Où trouver un ingrédient (pour la flèche de quête) : arbre mûr, plante ou boutique.
func item_source(id: String, from: Vector3) -> Vector3:
	if world.FRUIT_COLORS.has(id):
		var t: Vector3 = world.nearest_fruit_tree(from, id)
		if t != Vector3.INF: return t
	var best: = Vector3.INF; var bd: = INF
	for g in gathers:
		if g.kind == id and g.t <= 0.0:
			var d: float = from.distance_to(g.pos)
			if d < bd: bd = d;best = g.pos
	return best

func nearest_cook_pos(from: Vector3) -> Vector3:
	var best: = Vector3.INF; var bd: = INF
	for c in world.cook_spots:
		if from.distance_to(c) < bd: bd = from.distance_to(c);best = c
	return best

func npc_name(id: String) -> String:
	if NPC_DEFS.has(id): return String(NPC_DEFS[id][0])
	if VILLAGE_NPCS.has(id): return String(VILLAGE_NPCS[id][0])
	return id

func npc_pos(id: String) -> Vector3:
	return npcs[id].global_position if npcs.has(id) else Vector3.INF

func camps_cleared_count() -> int:
	var n: = 0
	for c in camps:
		if c.cleared: n += 1
	return n

func camp_cleared(i: int) -> bool:
	return i < camps.size() and camps[i].cleared

func seals_active_count() -> int:
	var n: = 0
	for s in seals:
		if s.active: n += 1
	return n

func _nearest(list: Array) -> Vector3:
	var best: = Vector3.INF
	var bd: = INF
	for p in list:
		var d: = party.global_position.distance_to(p)
		if d < bd:
			bd = d
			best = p
	return best

func nearest_camp_pos(_all: = false) -> Vector3:
	var l: = []
	for c in camps:
		if not c.cleared: l.append(c.center)
	return _nearest(l)

func nearest_seal_pos() -> Vector3:
	var l: = []
	for s in seals:
		if not s.active: l.append(s.global_position)
	return _nearest(l)

func nearest_apple_pos() -> Vector3:
	var l: = []
	for a in apples:
		if not a.got: l.append(a.node.position)
	return _nearest(l)

func apples_got_count() -> int:
	return apples.filter( func(a): return a.got).size()

func nearest_crystal_pos() -> Vector3:
	var l: = []
	for c in crystals:
		if not c.got: l.append(c.node.position)
	return _nearest(l)

func cat_pos() -> Vector3:
	return cat_node.global_position if cat_node and cat_node.visible else Vector3.INF

func waypoint_unlocked(i: int) -> bool:
	return wp_unlocked.has(i)


func xp_needed() -> int:
	return 150 + 90 * (rank - 1)

func give_xp(n: int, _why: = "") -> void :
	if rank >= MAX_RANK: return
	xp += n
	FX.float_text(party.global_position + Vector3(0, 2.3, 0), "+%d XP" % n, Color(1.0, 0.9, 0.5), 40, 1.2, 1.0)
	while xp >= xp_needed() and rank < MAX_RANK:
		xp -= xp_needed()
		rank += 1
		party.apply_rank(rank)
		for o in party.chars:
			o.alive = true;o.hp = o.max_hp
		ui.show_banner("Rang d'aventure %d !" % rank, Color(1.0, 0.88, 0.45))
		quests.on_rank(rank)
		FX.column(party.global_position, Color(1.0, 0.85, 0.4), 1.2, 5.0, 1.2)
		FX.particles(party.global_position + Vector3(0, 1, 0), Color(1.0, 0.9, 0.5), 40, 5.0, 1.0, 0.1, -2.0)
		audio.play("levelup")

func add_shards(n: int) -> void :
	shards += n
	ui.toast("Éclats d'Aether ×%d" % n, null, Color(0.85, 0.93, 1.0))

func add_food(n: int) -> void :
	add_item("tarte", n)

func item_count(id: String) -> int:
	return int(inv.get(id, 0))

## Ajoute un objet à l'inventaire (avec une ligne dans le fil des objets obtenus).
func add_item(id: String, n: = 1, show: = true) -> void :
	if n <= 0: return
	inv[id] = item_count(id) + n
	if show:
		var col: = Color(1.0, 0.88, 0.65) if Items.cat_of(id) == "food" else (Color(0.85, 1.0, 0.8) if Items.cat_of(id) == "ingredient" else Color(1.0, 0.85, 0.55))
		ui.toast("%s ×%d" % [Items.name_of(id), n], Items.icon(id), col)
	quests.on_items_changed()

func remove_item(id: String, n: = 1) -> bool:
	if item_count(id) < n: return false
	inv[id] = item_count(id) - n
	if inv[id] <= 0: inv.erase(id)
	quests.on_items_changed()
	return true

## Nombre total de plats dans le sac.
func food_total() -> int:
	var n: = 0
	for id in inv:
		if Items.cat_of(id) == "food": n += int(inv[id])
	return n

func add_mora(n: int, show: = true) -> void :
	if n <= 0: return
	mora += n
	if show: ui.toast("Mora ×%d" % n, Items.icon("mora"), Color(1.0, 0.86, 0.45))

## Mange un plat du sac (effet sur l'équipe) ; renvoie vrai s'il a été consommé.
func eat(id: String) -> bool:
	if item_count(id) <= 0: return false
	if not party.eat_dish(id):
		return false
	remove_item(id, 1)
	return true

func learn_recipe(id: String, show: = true) -> void :
	if recipes_known.has(id): return
	recipes_known[id] = true
	if show:
		ui.toast("Nouvelle recette : %s" % Items.name_of(id), Items.icon(id), Color(1.0, 0.9, 0.6))
		audio.play("quest", -6.0)

func notify(text: String) -> void :
	ui.message(text, 3.0, Color(1.0, 0.88, 0.5))
	audio.play("quest")
	save_game()

func story_complete() -> void :
	ended = true
	play_cine("fin", _show_victory_screen)
	save_game()

func _show_victory_screen() -> void :
	get_tree().create_timer(0.6).timeout.connect( func():
		ui.show_victory("L'île d'Aetheria est sauvée !\n\nTemps de jeu : %d min\nRang d'aventure : %d\nRéactions élémentaires : %d\nMonstres vaincus : %d\nCristaux : %d / %d\n\nL'aventure continue : Isaure, à la Guilde, a des missions\npour les aventuriers aguerris (marais, volcan, orage, domaines) !" % [
			int(t_play) / 60, rank, reactions, kills, crystals_got, crystals.size()])
		set_menu_mouse(true))
	save_game()

func on_victory_closed() -> void :
	set_menu_mouse(false)

func return_cat() -> void :
	cat_returned = true
	cat_node.visible = true
	cat_node.global_position = npc_pos("child") + Vector3(0.9, 0, 0.6)


func _on_enemy_died(e: Enemy) -> void :
	kills += 1
	party.gain_energy(6.0 if e.kind.begins_with("slime") else 12.0 if not e.is_boss else 40.0)
	_energy_orbs(e.global_position, FX.element_color(party.ch().element))
	var xp_gain: = {"slime": 10, "slime_big": 30, "goblin": 15, "archer": 15, "wisp": 20, "golem": 80, "boss": 500}
	if not e.is_boss or e.kind == "boss":

		give_xp(int(xp_gain.get(e.kind, 10) * (1.0 + maxf(0.0, e.level() - 4.0) * 0.12)))
	quests.on_kill()
	if not e.is_object and not dungeon: quests.on_kill_at(e.global_position)
	if not e.is_object:
		var mo: = {"slime": 25, "slime_big": 70, "goblin": 40, "archer": 40, "wisp": 55, "golem": 180}.get(e.kind, 30) as int
		if e.is_boss: mo = 1200
		mo = int(mo * (1.0 + maxf(0.0, e.level() - 4.0) * 0.06) * randf_range(0.85, 1.15))
		add_mora(mo)
	if e.kind == "boss":
		boss_done = true
		quests.on_boss_defeated()
		_spawn_reward_chest(e.global_position, -1)
	if e.has_meta("world_boss"):
		_on_world_boss_defeated(String(e.get_meta("world_boss")), e)
	if dungeon: dungeon.on_enemy_died(e)
	if e.camp >= 0:
		var camp: Dictionary = camps[e.camp]
		camp.enemies.erase(e)
		if camp.enemies.is_empty() and not camp.cleared:
			camp.cleared = true
			ui.message("Camp libéré !  Un coffre est apparu", 2.5)
			audio.play("quest", -4.0)
			_spawn_reward_chest(camp.center, e.camp)
			quests.on_camp_cleared(camps_cleared_count())
			save_game()
	if e.pack >= 0:
		var pack: Dictionary = packs[e.pack]
		pack.enemies.erase(e)
		if pack.enemies.is_empty(): pack.respawn = 150.0

func _spawn_reward_chest(p: Vector3, camp_i: int) -> void :
	var q: = Vector3(p.x, world.height_at(p.x, p.z), p.z)
	var node: = _make_chest(q, randf() * TAU)
	node.scale = Vector3.ONE * 0.01
	node.create_tween().tween_property(node, "scale", Vector3.ONE * 1.3, 0.5).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	FX.column(q, Color(1, 0.85, 0.4), 0.8, 4.0, 1.2)
	FX.particles(q + Vector3(0, 0.8, 0), Color(1, 0.9, 0.5), 30, 4.0, 1.0, 0.08, -2.0)
	var entry: = {"pos": q, "node": node, "opened": false, "lid": node.get_meta("lid"), "camp": camp_i, "reward": true}
	chests.append(entry)
	if camp_i >= 0: camps[camp_i].chest = node

func _on_seal_activated(s: Seal) -> void :
	audio.play("waypoint")
	ui.show_banner(Seal.NAMES[s.need] + " réveillé", Color(1.0, 0.88, 0.5))
	give_xp(80)
	quests.on_seal(seals_active_count())
	save_game()

func on_enemy_hit(e: Enemy) -> void :
	combat_t = 6.0
	audio.play_at("hit", e.global_position, -6.0)

func sfx_at(name: String, p: Vector3) -> void :
	audio.play_at(name, p)

func _energy_orbs(p: Vector3, col: Color) -> void :
	for i in 3:
		var s: = MeshInstance3D.new(); var sm: = SphereMesh.new();sm.radius = 0.1;sm.height = 0.2
		s.mesh = sm;s.material_override = FX.mat_emit(col, 3.0)
		add_child(s);s.global_position = p + Vector3(randf_range(-0.5, 0.5), 0.8, randf_range(-0.5, 0.5))
		var tw: = s.create_tween()
		tw.tween_property(s, "global_position", s.global_position + Vector3(0, 1.0, 0), 0.3)
		tw.tween_method(_orb_follow.bind(s), 0.0, 1.0, 0.5)
		tw.tween_callback(s.queue_free)

func _orb_follow(k: float, s: Node3D) -> void :
	if is_instance_valid(s): s.global_position = s.global_position.lerp(party.global_position + Vector3(0, 1, 0), k)

func on_reaction(_r: String) -> void :
	reactions += 1


func on_day_phase(night: bool) -> void :
	if not playing or autotest: return
	if night: ui.show_banner("La nuit tombe sur Aetheria", Color(0.75, 0.82, 1.0))
	else: ui.show_banner("Un nouveau jour se lève", Color(1.0, 0.9, 0.6))

func on_player_hit() -> void :
	ui.flash_hit();shake(0.15)
	combat_t = 6.0

func on_party_down() -> void :
	ui.message("L'équipe est à terre… retour à la Statue d'Aetheria", 2.5, Color(1, 0.6, 0.6))

func respawn_party(full: = true) -> void :
	if full: party.revive_all()
	party.reset_motion()
	if dungeon:

		leave_domain(false)
		return
	party.global_position = world.statue_pos + Vector3(0, 0.6, 5.0)
	party.velocity = Vector3.ZERO
	rig.global_position = party.global_position

func teleport(i: int) -> void :
	var p: Vector3 = world.waypoints[i].pos
	party.reset_motion()
	party.global_position = p + Vector3(0, 0.6, 3.0)
	party.velocity = Vector3.ZERO
	rig.global_position = party.global_position + Vector3(0, 1.45, 0)
	FX.column(p, Color(0.5, 0.85, 1.0), 1.0, 5.0, 1.0)
	audio.play("waypoint")
	ui.message("Téléporté : %s" % world.waypoints[i].name, 1.8, Color(0.7, 0.9, 1.0))

func _unlock_waypoint(i: int, silent: = false) -> void :
	if wp_unlocked.has(i): return
	wp_unlocked[i] = true
	var w: Dictionary = wp_nodes[i]
	var m: StandardMaterial3D = w.mat
	m.albedo_color = Color(0.45, 0.8, 1.0);m.emission_energy_multiplier = 1.6
	if not silent:
		FX.column(world.waypoints[i].pos, Color(0.5, 0.85, 1.0), 1.0, 7.0, 1.4)
		ui.show_banner("Téléporteur activé : " + world.waypoints[i].name, Color(0.7, 0.92, 1.0))
		audio.play("waypoint")
		give_xp(30)
		save_game()

func shake(a: float) -> void :
	if rig: rig.shake(a)

var _hitstop_on: = false
## Micro-gel à l'impact : le jeu ralentit une fraction de seconde pour donner du poids aux coups.
func hitstop(dur: float, scale: = 0.06) -> void :
	if _hitstop_on or autotest or paused: return
	_hitstop_on = true
	Engine.time_scale = scale
	get_tree().create_timer(dur, true, false, true).timeout.connect( func():
		Engine.time_scale = 1.0
		_hitstop_on = false)

func burst_cutin(name: String) -> void :
	ui.burst_cutin(name);shake(0.2)

func _on_quests_changed() -> void :
	for id in npcs:
		(npcs[id] as NPC).set_marker(quests.npc_marker(id))
	quests.ensure_tracked()


func _find_interaction() -> Dictionary:
	var p: = party.global_position
	if dungeon:
		return dungeon.find_interaction(p)
	for dm in world.domains:
		if Vector2(p.x - dm.pos.x, p.z - dm.pos.z).length() < 4.2:
			var lock: = "" if rank >= int(dm.rank) else "  (Rang %d requis)" % int(dm.rank)
			return {"kind": "domain", "id": dm.id, "verb": "Entrer :", "what": String(dm.name) + lock}
	for id in npcs:
		var n: NPC = npcs[id]
		if n.visible and n.global_position.distance_to(p) < 2.8:
			return {"kind": "npc", "id": id, "verb": "Parler à", "what": n.display}
	for ch in chests:
		if not ch.opened and (ch.node as Node3D).position.distance_to(p) < 2.4:
			return {"kind": "chest", "ref": ch, "verb": "Ouvrir", "what": "le coffre"}
	for a in apples:
		if not a.got and (a.node as Node3D).position.distance_to(p) < 2.2:
			return {"kind": "apple", "ref": a, "verb": "Cueillir", "what": "la pomme solaire"}
	if cat_node and cat_node.visible and not cat_found and cat_node.global_position.distance_to(p) < 2.4:
		return {"kind": "cat", "verb": "Caresser", "what": "Minou"}
	for cp in world.cook_spots:
		if cp.distance_to(p) < 2.6:
			return {"kind": "cook", "verb": "Cuisiner", "what": "à la marmite"}
	if quests._step("q_vent_vigie").get("do", "") == "beacons":
		for b in beacons:
			if not b.lit and (b.node as Node3D).position.distance_to(p + Vector3(0, 0.9, 0)) < 2.4:
				return {"kind": "beacon", "ref": b, "verb": "Allumer :", "what": "le feu de vigie"}
	for g in gathers:
		if g.t <= 0.0 and (g.pos as Vector3).distance_to(p) < 1.9:
			return {"kind": "gather", "ref": g, "verb": "Cueillir :", "what": Items.name_of(g.kind)}
	if not party.busy_moving():
		for s in world.statues:
			if Vector2(p.x - s.x, p.z - s.z).length() < 4.8 and absf(p.y - s.y) < 2.5:
				return {"kind": "statue", "verb": "Offrir à", "what": "la Statue d'Aetheria"}
	return {}

func interact() -> void :
	if interact_target.is_empty(): return
	match String(interact_target.kind):
		"npc": _talk(interact_target.id)
		"chest": _open_chest(interact_target.ref)
		"apple": _pick_apple(interact_target.ref)
		"cat": _find_cat()
		"gather": _pick_gather(interact_target.ref)
		"beacon":
			_light_beacon(interact_target.ref)
			quests.on_beacon(int(interact_target.ref.i))
		"cook":
			party.input_vec = Vector2.ZERO
			ui.show_overlay(ui.cook_menu, true)
		"domain": enter_domain(interact_target.id)
		"statue":
			party.input_vec = Vector2.ZERO
			ui.show_statue(true)
		"dungeon":
			if dungeon: dungeon.interact(interact_target)
	interact_target = {}

func _talk(id: String) -> void :
	var n: NPC = npcs[id]
	var to: = party.global_position - n.global_position;to.y = 0
	n.rotation.y = atan2(to.x, to.z)
	party._face_towards( - to, true)
	var d: Dictionary = quests.talk(id)
	var shop: = Shops.shop_of(id)
	var choices: = []
	if shop != "" and not (d.after as Callable).is_valid():
		choices = [["Voir la boutique", func(): ui.show_overlay(ui.shop_menu, true, shop), "◎"], ["Au revoir", Callable(), "✕"]]
		if d.lines.is_empty(): d.lines = [quests._l(id, "Bienvenue ! Jetez un œil à mes marchandises.")]
	if d.lines.is_empty(): return
	party.enabled = false
	party.input_vec = Vector2.ZERO
	ui.start_dialogue(d.lines, d.after, choices)

func on_dialogue_closed() -> void :
	party.enabled = true
	_on_quests_changed()
	save_game()

func _open_chest(ch: Dictionary) -> void :
	if ch.opened: return
	ch.opened = true

	var ci: int = ch.get("camp", -1)
	if ci >= 0 and ci < camps.size(): camps[ci].opened = true
	var lid: Node3D = ch.lid
	lid.create_tween().tween_property(lid, "rotation:x", -1.9, 0.5).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	var p: Vector3 = (ch.node as Node3D).position
	var gain: = 60 if ch.get("reward", false) else 40
	shards += gain
	add_mora(400 if ch.get("reward", false) else 250)
	FX.particles(p + Vector3(0, 0.9, 0), Color(1, 0.88, 0.45), 40, 5.0, 1.0, 0.1, -4.0)
	FX.flash(p + Vector3(0, 1.2, 0), Color(1, 0.85, 0.5), 4.0, 8.0, 0.6)
	ui.message("Coffre ouvert : +%d Éclats d'Aether" % gain, 2.2, Color(1, 0.9, 0.55))
	audio.play("chest")
	give_xp(25)
	for o in party.chars: o.hp = minf(o.max_hp, o.hp + o.max_hp * 0.15)
	if randf() < 0.35 or ch.get("reward", false):
		add_food(1)
	save_game()

func _pick_apple(a: Dictionary) -> void :
	a.got = true
	(a.node as Node3D).visible = false
	FX.particles((a.node as Node3D).position, Color(1.0, 0.6, 0.3), 14, 3.0, 0.6, 0.07)
	audio.play("pickup")
	quests.on_apple()

func _find_cat() -> void :
	cat_found = true
	cat_node.visible = false
	FX.particles(cat_node.global_position + Vector3(0, 0.4, 0), Color(1.0, 0.75, 0.4), 18, 3.0, 0.7, 0.07)
	audio.play("pickup")
	quests.on_cat()
	if not quests.is_active("cat"):
		ui.message("Un chat orange… Il porte un collier « Minou ».", 2.2)


var pause_frame: = -1
func toggle_pause() -> void :
	if cinematic: return
	paused = not paused
	pause_frame = Engine.get_process_frames()

	get_tree().paused = paused
	party.enabled = not paused and not ui.dlg_open
	daynight.paused = paused
	var world_chests: = chests.filter( func(c): return not c.get("reward", false))
	ui.show_pause(paused, "Rang %d  •  %d XP / %d  •  Éclats : %d  •  Cristaux : %d / %d  •  Coffres : %d / %d" % [
		rank, xp, xp_needed(), shards, crystals_got, crystals.size(), world_chests.filter( func(c): return c.opened).size(), world_chests.size()])
	if not ui.touch and not autotest:
		Input.mouse_mode = Input.MOUSE_MODE_VISIBLE if paused else Input.MOUSE_MODE_CAPTURED

func pause_action(what: String) -> void :
	match what:
		"resume": toggle_pause()
		"chars", "settings", "bag": ui.open_sub(what)
		"quests":
			toggle_pause();ui.show_quest_log(true)
		"time":
			toggle_pause();ui.show_time_menu(true)
		"map":
			toggle_pause();ui.map_ui.toggle()
		"save":
			save_game();ui.message("Partie sauvegardée", 1.6, Color(0.7, 1.0, 0.8))
		"quality":
			apply_quality((quality + 2) % 3, true)
		"quit":
			save_game();get_tree().quit()


const QUALITY_NAMES: = ["Performance", "Équilibrée", "Élevée"]
const SETTINGS_PATH: = "user://settings.cfg"
var quality: = 2

var settings: = {"sens": 1.0, "music": 0.8, "sfx": 0.9, "fps": true, "full": false}

func load_quality() -> void :
	var cf: = ConfigFile.new()
	var q: = 2
	if OS.has_feature("mobile"): q = 1
	if cf.load(SETTINGS_PATH) == OK:
		q = int(cf.get_value("video", "quality", q))
		for k in settings.keys():
			settings[k] = cf.get_value("prefs", k, settings[k])
	apply_quality(q, false)
	apply_settings(false)

## Applique les préférences (caméra, volumes, FPS) et les enregistre si demandé.
func apply_settings(store: bool) -> void :
	if rig: rig.sensitivity = 0.0032 * float(settings.sens)
	if audio:
		var mv: float = settings.music
		var sv: float = settings.sfx
		audio.music_vol = -80.0 if mv <= 0.01 else -9.0 + linear_to_db(mv)
		audio.sfx_vol = -80.0 if sv <= 0.01 else -3.0 + linear_to_db(sv)
		var cur: AudioStreamPlayer = audio.music_a
		if cur and cur.playing: cur.volume_db = audio.music_vol
	if ui and ui.fps_label: ui.fps_label.visible = bool(settings.fps)
	if store:
		var cf: = ConfigFile.new()
		cf.load(SETTINGS_PATH)
		cf.set_value("video", "quality", quality)
		for k in settings.keys(): cf.set_value("prefs", k, settings[k])
		cf.save(SETTINGS_PATH)

func apply_quality(q: int, store: bool) -> void :
	quality = clampi(q, 0, 2)
	var vp: = get_viewport()
	vp.msaa_3d = Viewport.MSAA_2X if quality == 2 else Viewport.MSAA_DISABLED
	vp.scaling_3d_mode = Viewport.SCALING_3D_MODE_BILINEAR
	vp.scaling_3d_scale = [0.75, 0.9, 1.0][quality]

	world.sun.directional_shadow_max_distance = [18.0, 28.0, 40.0][quality]
	RenderingServer.directional_shadow_atlas_set_size([1024, 2048, 2048][quality], true)
	world.env.fog_density = [0.0042, 0.0032, 0.0028][quality]
	world.env.glow_enabled = quality >= 1
	if grass: grass.configure(quality)
	var k: float = [0.65, 0.85, 1.0][quality]
	for g in world.find_children("*", "GeometryInstance3D", true, false):
		var gi: = g as GeometryInstance3D
		if gi.visibility_range_end <= 0.0 and not gi.has_meta("vr"): continue
		if not gi.has_meta("vr"): gi.set_meta("vr", Vector2(gi.visibility_range_begin, gi.visibility_range_end))
		var v: Vector2 = gi.get_meta("vr")
		gi.visibility_range_begin = v.x * k
		gi.visibility_range_end = v.y * k
	if ui: ui.set_quality_label(QUALITY_NAMES[quality])
	if store:
		apply_settings(true)
		ui.message("Graphismes : " + QUALITY_NAMES[quality], 1.4, Color(0.75, 0.9, 1.0))


var allow_save_in_test: = false
func save_game() -> void :
	if (autotest and not allow_save_in_test) or not playing: return

	var pos: = party.global_position
	if dungeon:
		var dm: = domain_def(dungeon.id)
		var out: = - (dm.pos as Vector3);out.y = 0
		pos = world.snap((dm.pos as Vector3) + out.normalized() * 5.0, 0.6)
	var wb: = {}
	for id in world_bosses: wb[id] = world_bosses[id].kills
	var d: = {
		"version": 5, "rank": rank, "xp": xp, "shards": shards, "treasure_map": treasure_map, 
		"seen_cines": seen_cines.keys(), "inv": inv, "mora": mora, "recipes": recipes_known.keys(), "mastery": recipe_mastery, "dishes_cooked": dishes_cooked, 
		"reactions": reactions, "kills": kills, "t_play": t_play, "boss_done": boss_done, 
		"hour": daynight.saved_hour if daynight.saved_hour >= 0.0 else daynight.hour, 
		"pos": [pos.x, pos.y, pos.z], "active": party.active, 
		"world_bosses": wb, "domains": domain_clears, 
		"hp": party.chars.map( func(o): return o.hp), 
		"camps": camps.map( func(c): return [c.cleared, c.opened if c.has("opened") else false]), 
		"chests": chests.filter( func(c): return not c.get("reward", false)).map( func(c): return c.opened), 
		"boss_chest": _boss_chest_state(), 
		"crystals": crystals.map( func(c): return c.got), "apples": apples.map( func(a): return a.got), 
		"oculi": oculi.map( func(o): return o.got), "oculi_offered": oculi_offered, "statue_level": statue_level, 
		"oculus_hint": oculus_hint, 
		"seals": seals.map( func(s): return s.active), "waypoints": wp_unlocked.keys(), 
		"cat_found": cat_found, "cat_returned": cat_returned, "quests": quests.save_state(), 
	}
	var f: = FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if f:
		f.store_string(JSON.stringify(d))
		f.close()


func _boss_chest_state():
	for c in chests:
		if c.get("reward", false) and c.get("camp", -1) == -1:
			var p: Vector3 = c.pos
			return [c.opened, p.x, p.y, p.z]
	return null

func load_game() -> bool:
	if not FileAccess.file_exists(SAVE_PATH): return false
	var d = JSON.parse_string(FileAccess.get_file_as_string(SAVE_PATH))
	if typeof(d) != TYPE_DICTIONARY: return false
	_new_game()
	rank = int(d.get("rank", 1));xp = int(d.get("xp", 0));shards = int(d.get("shards", 0))
	if d.has("inv") and d.inv is Dictionary:
		inv = {}
		for k in d.inv:
			if Items.DEFS.has(k) and int(d.inv[k]) > 0: inv[k] = int(d.inv[k])
	else:
		food = int(d.get("food", 0))
	mora = int(d.get("mora", 300));dishes_cooked = int(d.get("dishes_cooked", 0))
	seen_cines = {}
	for c in d.get("seen_cines", ["prologue"]): seen_cines[String(c)] = true
	for r in d.get("recipes", []):
		if Items.RECIPES.has(r): recipes_known[r] = true
	var ms = d.get("mastery", {})
	if ms is Dictionary:
		for r in ms: recipe_mastery[r] = int(ms[r])
	treasure_map = bool(d.get("treasure_map", false));reactions = int(d.get("reactions", 0));kills = int(d.get("kills", 0))
	t_play = float(d.get("t_play", 0.0));daynight.hour = float(d.get("hour", 9.0));boss_done = bool(d.get("boss_done", false))
	party.apply_rank(rank)
	var hp: Array = d.get("hp", [])
	for i in mini(hp.size(), party.chars.size()):
		party.chars[i].hp = clampf(float(hp[i]), 1.0, party.chars[i].max_hp)
	party.active = clampi(int(d.get("active", 0)), 0, party.chars.size() - 1);party._show_active()
	var cs: Array = d.get("camps", [])
	for i in mini(cs.size(), camps.size()):

		var entry = cs[i]
		var cleared: bool = bool(entry[0]) if entry is Array and entry.size() > 0 else bool(entry)
		var opened: bool = bool(entry[1]) if entry is Array and entry.size() > 1 else true
		if cleared:
			for e in camps[i].enemies:
				if is_instance_valid(e):
					e.queue_free()
			camps[i].enemies = []
			camps[i].cleared = true
			if not opened:
				_spawn_reward_chest(camps[i].center, i)
			camps[i].opened = opened
	var ch: Array = d.get("chests", [])
	for i in mini(ch.size(), world.chest_spots.size()):
		if bool(ch[i]):
			chests[i].opened = true
			(chests[i].lid as Node3D).rotation.x = -1.9
	var cr: Array = d.get("crystals", [])
	crystals_got = 0
	for i in mini(cr.size(), crystals.size()):
		if bool(cr[i]):
			crystals[i].got = true
			(crystals[i].node as Node3D).visible = false
			crystals_got += 1
	var oc: Array = d.get("oculi", [])
	oculi_got = 0
	for i in mini(oc.size(), oculi.size()):
		if bool(oc[i]):
			oculi[i].got = true
			(oculi[i].node as Node3D).visible = false
			oculi_got += 1
	statue_level = clampi(int(d.get("statue_level", 0)), 0, OCULUS_LEVELS.size())
	oculi_offered = clampi(int(d.get("oculi_offered", 0)), 0, oculi_got)
	oculus_hint = bool(d.get("oculus_hint", oculi_got > 0))
	apply_stamina_level()
	party.stamina = party.stamina_max
	var ap: Array = d.get("apples", [])
	for i in mini(ap.size(), apples.size()):
		if bool(ap[i]):
			apples[i].got = true
			(apples[i].node as Node3D).visible = false
	var sl: Array = d.get("seals", [])
	for i in mini(sl.size(), seals.size()):
		if bool(sl[i]): (seals[i] as Seal).set_active(true, true)
	for k in d.get("waypoints", []):
		_unlock_waypoint(int(k), true)
	cat_found = bool(d.get("cat_found", false));cat_returned = bool(d.get("cat_returned", false))
	if cat_found: cat_node.visible = false
	if cat_returned: return_cat()
	quests.load_state(d.get("quests", {}))
	_sync_beacons()
	if quests.is_active("main") and quests.step("main") == 4 and not boss_done: spawn_boss()

	var bc = d.get("boss_chest", null)
	if boss_done and bc is Array and bc.size() == 4 and not bool(bc[0]):
		_spawn_reward_chest(Vector3(float(bc[1]), float(bc[2]), float(bc[3])), -1)

	var wbk: Dictionary = d.get("world_bosses", {})
	for id in wbk:
		if world_bosses.has(id): world_bosses[id].kills = int(wbk[id])
	domain_clears = {}
	var dc: Dictionary = d.get("domains", {})
	for id in dc: domain_clears[id] = int(dc[id])
	quests.refresh_guild(false)
	var pos: Array = d.get("pos", [])
	if pos.size() == 3:
		party.global_position = Vector3(float(pos[0]), float(pos[1]) + 0.5, float(pos[2]))
		if party.global_position.x > World.DUNGEON_X: party.global_position = world.spawn_pos
		party.safe_pos = party.global_position
		rig.global_position = party.global_position + Vector3(0, 1.45, 0)
	_on_quests_changed()
	return true


func _process(delta: float) -> void :
	var t: = Time.get_ticks_msec() / 1000.0
	for i in crystals.size():
		var cr: Node3D = crystals[i].node
		if cr.visible:
			cr.rotation.y = t * 1.5 + i
	for w in wp_nodes:
		(w.crystal as Node3D).rotation.y = t * 0.8
		(w.crystal as Node3D).position.y = 3.6 + sin(t * 1.5) * 0.12
	for a in apples:
		if not a.got: (a.node as Node3D).rotation.y = t
	for i in oculi.size():
		var o: Dictionary = oculi[i]
		if o.got: continue
		var on: Node3D = o.node
		on.rotation.y = t * 1.8 + i
		on.position.y = (o.pos as Vector3).y + sin(t * 2.2 + i) * 0.12
	for wm in world.windmills: wm.get_child(0).rotation.z += delta * 0.7
	if not playing:
		rig.yaw += delta * 0.06
		return
	if paused:
		if Input.is_action_just_pressed("pause"): toggle_pause()
		return
	t_play += delta
	if cinematic:
		party.input_vec = Vector2.ZERO;party.sprint_held = false
		_world_update(delta)
		return

	if not autotest:
		if ui.dlg_open:

			if Input.is_action_just_pressed("interact") or Input.is_action_just_pressed("jump"):
				ui.dialogue_next()
		elif ui.victory.visible:
			party.input_vec = Vector2.ZERO
		elif ui.foodbag and ui.foodbag.visible:
			party.input_vec = Vector2.ZERO;party.sprint_held = false
			if Input.is_action_just_pressed("food") or Input.is_action_just_pressed("pause"): ui.toggle_foodbag()
		elif ui.shop_menu.visible or ui.cook_menu.visible:
			party.input_vec = Vector2.ZERO;party.sprint_held = false
			if Input.is_action_just_pressed("pause"):
				if ui.shop_menu.visible: ui.show_overlay(ui.shop_menu, false)
				elif not ui.cook_menu.game.running: ui.show_overlay(ui.cook_menu, false)
		elif ui.statue_menu.visible:
			party.input_vec = Vector2.ZERO;party.sprint_held = false
			if Input.is_action_just_pressed("pause") or Input.is_action_just_pressed("interact"): ui.show_statue(false)
		elif ui.map_ui.open:
			party.input_vec = Vector2.ZERO;party.sprint_held = false
			if Input.is_action_just_pressed("map") or Input.is_action_just_pressed("pause"): ui.map_ui.toggle()
		elif ui.time_menu.visible:
			party.input_vec = Vector2.ZERO
			if Input.is_action_just_pressed("time_menu") or Input.is_action_just_pressed("pause"): ui.show_time_menu(false)
		elif ui.quest_log.visible:
			party.input_vec = Vector2.ZERO
			if Input.is_action_just_pressed("quest_log") or Input.is_action_just_pressed("pause"): ui.show_quest_log(false)
		else:
			var kv: = Input.get_vector("move_left", "move_right", "move_back", "move_forward")
			var v: = kv + ui.joy_vec
			party.input_vec = v.limit_length(1.0)
			party.sprint_held = Input.is_action_pressed("sprint")
			if Input.is_action_just_pressed("sprint"): party.do_dash()
			if Input.is_action_just_pressed("attack") and (ui.touch or Input.mouse_mode == Input.MOUSE_MODE_CAPTURED): party.do_attack()
			if Input.is_action_just_pressed("skill"): party.do_skill()
			if Input.is_action_just_pressed("burst"): party.do_burst()
			if Input.is_action_just_pressed("jump"): party.do_jump()
			for k in 4:
				if Input.is_action_just_pressed("switch%d" % (k + 1)): party.switch_to(k)
			if Input.is_action_just_pressed("interact"): interact()
			if Input.is_action_just_pressed("food"): ui.toggle_foodbag()
			if not ui.touch:
				ui.set_sight(Input.is_action_pressed("sight"))
			elif Input.is_action_just_pressed("sight"):
				ui.sight_touch_t = 6.0 if ui.sight_touch_t <= 0.0 else 0.0
			if Input.is_action_just_pressed("map"):
				if dungeon: ui.message("Pas de carte à l'intérieur d'un domaine.", 1.6, Color(0.85, 0.9, 1.0))
				else: ui.map_ui.toggle()
			if Input.is_action_just_pressed("quest_next"): _cycle_tracked()
			if Input.is_action_just_pressed("time_menu"): ui.show_time_menu(true)
			if Input.is_action_just_pressed("quest_log"): ui.show_quest_log(true)
			if Input.is_action_just_pressed("pause"): toggle_pause()
			var drag: = ui.take_cam_drag()
			if drag != Vector2.ZERO: rig.rotate_by(drag.x * 1.6, drag.y * 1.6)
	_world_update(delta)


func set_menu_mouse(on: bool) -> void :
	party.enabled = not on and not ui.dlg_open and not paused
	if not ui.touch and not autotest and playing:
		Input.mouse_mode = Input.MOUSE_MODE_VISIBLE if on else Input.MOUSE_MODE_CAPTURED

func _cycle_tracked() -> void :
	var l: = quests.active_list()
	if l.is_empty(): return
	var i: = l.find(quests.tracked)
	quests.tracked = l[(i + 1) % l.size()]
	audio.play("click", -6.0)

func _world_update(delta: float) -> void :
	var pp: = party.global_position

	for c in crystals:
		var node: Node3D = c.node
		if not c.got and pp.distance_to(node.position - Vector3(0, 1.0, 0)) < 1.6:
			c.got = true;node.visible = false;crystals_got += 1;shards += 5
			FX.particles(node.position, Color(0.5, 0.85, 1.0), 24, 4.0, 0.7, 0.08)
			ui.toast("Cristal d'Aether  %d / %d" % [crystals_got, crystals.size()], null, Color(0.7, 0.9, 1.0))
			audio.play("pickup")
			give_xp(10)
			quests.on_crystal(crystals_got)

	if not dungeon:
		var sa: = pp + Vector3(0, 0.3, 0); var sb: = pp + Vector3(0, 1.45, 0)
		for o in oculi:
			if o.got: continue
			var q: Vector3 = (o.node as Node3D).position
			if absf(q.x - pp.x) > 3.0 or absf(q.z - pp.z) > 3.0: continue
			if Geometry3D.get_closest_point_to_segment(q, sa, sb).distance_to(q) < 1.35:
				_collect_oculus(o)
		# un tintement doux quand un Anémoculus est tout proche
		resonance_t -= delta
		if resonance_t <= 0.0:
			resonance_t = 3.0
			var d: = nearest_oculus_dist()
			if d < 22.0:
				audio.play("blip", -20.0 + (22.0 - d) * 0.5, 0.02)
				resonance_t = lerpf(1.2, 3.0, d / 22.0)

	for i in wp_nodes.size():
		if not wp_unlocked.has(i) and pp.distance_to(world.waypoints[i].pos) < 6.0:
			_unlock_waypoint(i)

	if not dungeon:
		world.tick_trees(delta)
		_tick_gathers(delta)
		_tick_drops(delta, pp)
	statue_msg_cd -= delta
	for s in world.statues:
		if pp.distance_to(s) < 5.5:
			var healed: = false
			for o in party.chars:
				if not o.alive:
					o.alive = true
					o.hp = 1.0
				if o.hp < o.max_hp:
					o.hp = minf(o.max_hp, o.hp + o.max_hp * 0.25 * delta);healed = true
			if healed and statue_msg_cd <= 0.0:
				statue_msg_cd = 6.0
				ui.message("Statue d'Aetheria : l'équipe récupère ses PV", 2.0, Color(0.7, 0.95, 1.0))
				audio.play("heal", -4.0)

	_update_world_bosses(delta)

	lava_t -= delta
	if lava_t <= 0.0 and party.is_active() and party.is_on_floor() and world.lava_at(pp):
		lava_t = 0.5
		party.take_damage(party.ch().max_hp * 0.07, "lava", pp + Vector3(0, -1, 0))
		FX.particles(pp + Vector3(0, 0.3, 0), FX.LAVA, 10, 3.0, 0.5, 0.08, 2.0)

	storm_t -= delta
	if storm_t <= 0.0:
		storm_t = randf_range(2.5, 6.0)
		if not dungeon and world.biome_at(pp.x, pp.z) == "orage":
			var a: = randf() * TAU
			var q: = pp + Vector3(cos(a), 0, sin(a)) * randf_range(25.0, 60.0)
			q.y = world.height_at(q.x, q.z)
			FX.bolt(q + Vector3(randf_range(-3, 3), 30.0, randf_range(-3, 3)), q, Color(0.8, 0.7, 1.0), 0.3, 0.25, 1.4)
			FX.flash(q + Vector3(0, 6, 0), Color(0.75, 0.7, 1.0), 6.0, 40.0, 0.2)
			audio.play_at("thunder", q, -8.0)
	if dungeon: dungeon.tick(delta)

	for i in packs.size():
		var pack: Dictionary = packs[i]
		if pack.respawn > 0.0:
			pack.respawn -= delta
			if pack.respawn <= 0.0:
				if pp.distance_to(pack.pos) > 70.0: _fill_pack(i)
				else: pack.respawn = 10.0

	if not ui.dlg_open:
		interact_target = _find_interaction()
		if interact_target.is_empty(): ui.show_prompt("", "")
		else: ui.show_prompt(interact_target.verb, interact_target.what)
	else:
		ui.show_prompt("", "")

	var reg: = world.region_name(pp) if not dungeon else "Domaine : " + String(domain_def(dungeon.id).name)
	if reg != region_now:
		var vv: Dictionary = world.village_at(pp, 34.0) if not dungeon else {}
		if not vv.is_empty() and not seen_cines.has("village_" + String(vv.id)) and region_now != "" and not cinematic:
			play_cine("village_" + String(vv.id))
		elif region_now != "" and not autotest: ui.show_banner(reg)
		region_now = reg
		ui.map_ui.region.text = reg

	combat_t -= delta
	var fighting: = combat_t > 0.0 or active_boss() != null
	audio.music("combat" if fighting else "explore")

	save_t += delta
	if save_t > 45.0:
		save_t = 0.0;save_game()
	ui.refresh(party)

func _unhandled_input(event: InputEvent) -> void :
	if playing and not ui.touch and not paused and not ui.map_ui.open and not ui.dlg_open and event is InputEventMouseButton and event.pressed and Input.mouse_mode != Input.MOUSE_MODE_CAPTURED:
		Input.mouse_mode = Input.MOUSE_MODE_CAPTURED

func _notification(what: int) -> void :
	if what == NOTIFICATION_WM_CLOSE_REQUEST or what == NOTIFICATION_APPLICATION_PAUSED:
		save_game()
	elif what == NOTIFICATION_WM_GO_BACK_REQUEST:
		_on_back()


func _on_back() -> void :
	if not playing:
		get_tree().quit();return
	save_game()
	if ui.sub_menu: ui.close_sub()
	elif ui.victory.visible: ui._close_victory()
	elif ui.dlg_open: ui.dialogue_next()
	elif ui.map_ui.open: ui.map_ui.toggle()
	elif ui.time_menu.visible: ui.show_time_menu(false)
	elif ui.quest_log.visible: ui.show_quest_log(false)
	else: toggle_pause()

func _exit_tree() -> void :

	FX._mat_cache.clear()
	FX.world = null
	Toon.outline_mat = null


func snap(name: String) -> void :
	await RenderingServer.frame_post_draw
	var img: = get_viewport().get_texture().get_image()
	DirAccess.make_dir_recursive_absolute(shot_dir)
	img.save_png(shot_dir.path_join(name + ".png"))
	print("SHOT %s  draws=%d prims=%dk objs=%d fps=%d" % [name, Performance.get_monitor(Performance.RENDER_TOTAL_DRAW_CALLS_IN_FRAME), 
		Performance.get_monitor(Performance.RENDER_TOTAL_PRIMITIVES_IN_FRAME) / 1000, Performance.get_monitor(Performance.RENDER_TOTAL_OBJECTS_IN_FRAME), 
		Performance.get_monitor(Performance.TIME_FPS)])

func _wait(t: float) -> void :
	await get_tree().create_timer(t).timeout

func _place(p: Vector3, look_at_p: Vector3, dist: = 5.6, pitch: = -0.32) -> void :
	var q: = Vector3(p.x, world.height_at(p.x, p.z) + 0.5, p.z)
	party.global_position = q;party.velocity = Vector3.ZERO
	var to: = look_at_p - q;to.y = 0
	party.visual.rotation.y = atan2(to.x, to.z)
	rig.yaw = atan2( - to.x, - to.z)
	rig.pitch = pitch;rig.distance = dist
	rig.global_position = q + Vector3(0, 1.45, 0)


## Captures de tous les menus (vérification de l'interface).
func _mt_stop(tag: String) -> bool:
	return ("--mt_stop=" + tag) in OS.get_cmdline_user_args()

func _menu_test() -> void :
	rank = 7;xp = 220;shards = 340;food = 3;crystals_got = 5;party.apply_rank(rank)
	daynight.paused = true;daynight.hour = 10.0;daynight.apply()
	_place(world.spawn_pos, world.village, 5.6, -0.3)
	await _wait(1.0)
	await snap("m00_hud")
	toggle_pause(); await _wait(0.5)
	await snap("m01_menu")
	if _mt_stop("m01_menu"): return
	ui.open_sub("chars"); await _wait(0.8)
	await snap("m02_chars_attr")
	ui.char_menu.tabs.select(1); await _wait(0.3)
	await snap("m03_chars_talents")
	ui.char_menu.show_hero(3);ui.char_menu.tabs.select(2); await _wait(0.6)
	await snap("m04_chars_zahara")
	if _mt_stop("m04_chars_zahara"): return
	ui.close_sub(); await _wait(0.2)
	ui.open_sub("bag"); await _wait(0.5)
	await snap("m05_bag")
	if _mt_stop("m05_bag"): return
	ui.close_sub();ui.open_sub("settings"); await _wait(0.5)
	await snap("m06_settings")
	if _mt_stop("m06_settings"): return
	ui.close_sub()
	toggle_pause(); await _wait(0.3)
	ui.show_quest_log(true); await _wait(0.4)
	await snap("m07_quests")
	ui.show_quest_log(false)
	ui.show_time_menu(true); await _wait(0.4)
	await snap("m08_time")
	ui.show_time_menu(false)
	ui.map_ui.toggle(); await _wait(0.5)
	await snap("m09_map")
	if _mt_stop("m09_map"): return
	ui.map_ui.toggle()
	var d0: Dictionary = quests.talk("elder")
	ui.start_dialogue(d0.lines, Callable()); await _wait(1.6)
	await snap("m10_dialogue")
	if _mt_stop("m10_dialogue"): return
	while ui.dlg_open:
		ui.dialogue_next(true); await _wait(0.05)
	ui.show_title(true); await _wait(0.6)
	await snap("m11_title")

## Captures des 4 héros en plein combat (vérifie animations, traînées d'arme, effets).
func _combat_test() -> void :
	party.test_invuln = true
	daynight.paused = true;daynight.hour = 10.5;daynight.apply()
	_place(_near(camps[0].center, 7.0), camps[0].center, 4.6, -0.22)
	await _wait(1.2)
	for i in 4:
		party.switch_cd = 0.0;party.attack_lock = 0.0;party.cast_t = 0.0
		party.switch_to(i); await _wait(0.6)
		var nm: String = party.ch().name.to_lower()
		for k in int(party.ch().combo_len):
			party.attack_lock = 0.0
			party.do_attack(); await _wait(0.12)
			if k == 0 or k == int(party.ch().combo_len) - 1: await snap("c_%s_atk%d" % [nm, k + 1])
			await _wait(0.25)
		await _wait(0.4)
		party.chars[i].skill_cd = 0.0
		party.do_skill(); await _wait(0.45)
		await snap("c_%s_skill" % nm)
		await _wait(0.8)
		party.chars[i].energy = party.chars[i].energy_max;party.chars[i].burst_cd = 0.0
		party.do_burst(); await _wait(1.0)
		await snap("c_%s_burst" % nm)
		await _wait(1.0)

func _new_heroes_test() -> void :
	_place(_near(camps[1].center, 8.0), camps[1].center, 6.0, -0.3)
	await _wait(1.1)
	party.switch_to(2); await _wait(0.5)
	for i in 4:
		party.do_attack(); await _wait(0.3)
	await snap("14b_kael_lames")
	await _wait(0.3)
	party.do_skill(); await _wait(0.75)
	await snap("14c_kael_flamme")
	party.chars[2].energy = party.chars[2].energy_max
	await _wait(0.4)
	party.do_burst(); await _wait(1.6)
	await snap("14d_kael_brasier")
	for i in 4:
		party.do_attack(); await _wait(0.28)
	print("KAEL inferno=%.1f buff=%.2f" % [party.inferno_t, party.chars[2].atk_buff])
	await _wait(1.2)
	party.switch_to(3); await _wait(0.5)
	print("KAEL inferno after switch=%.1f" % party.inferno_t)
	for i in 3:
		party.do_attack(); await _wait(0.5)
	await snap("14e_zahara_jets")
	await _wait(0.3)
	party.do_skill(); await _wait(1.0)
	await snap("14f_zahara_torrent")
	party.chars[3].energy = party.chars[3].energy_max
	await _wait(0.5)
	party.do_burst(); await _wait(1.25)
	await snap("14g_zahara_eruption")

	party.iframe = 0.0
	var hp0: float = party.chars[3].hp
	party.take_damage(60.0, "", party.global_position + Vector3(1, 0, 0))
	print("ZAHARA passive buff=%.2f hp %.0f -> %.0f" % [party.chars[3].atk_buff, hp0, party.chars[3].hp])
	await _wait(0.6)
	party.switch_to(0); await _wait(0.4)


func _lineup() -> void :
	ui.hud.visible = false
	daynight.hour = 16.0;daynight.apply()
	var p: = Vector3(-30, 0, -60)
	for a in OS.get_cmdline_user_args():
		if a.begins_with("--lineup_at="):
			var f: PackedStringArray = a.substr(12).split(":")
			p = Vector3(float(f[0]), 0, float(f[1]))
	_place(p, Vector3(40, 0, 10), 5.4, -0.08)
	party.set_physics_process(false)
	party.visual.rotation.y += PI
	await _wait(0.3)
	for i in party.chars.size():
		var c: Dictionary = party.chars[i]
		c.node.visible = true
		party.set_cloth(c, true)
		c.node.position = Vector3((i - 1.5) * 1.05, 0, 0)
		c.ap.play("Idle")
	rig.distance = 4.7;rig.pitch = -0.05
	rig.arm.collision_mask = 0
	await _wait(1.2)
	await snap("lineup_idle")
	for c in party.chars:
		if c.weapon_node: c.weapon_node.visible = true
		c.ap.play("Idle_Combat")
	await _wait(1.0)
	await snap("lineup_combat")
	for step in [["Attack1", 0.22], ["Attack3", 0.3], ["Skill", 0.55], ["Burst", 0.5], ["Burst", 1.05]]:
		for c in party.chars:
			c.ap.play(step[0], 0.0)
			c.ap.seek(step[1], true)
			c.ap.pause()
		await _wait(0.5)
		await snap("lineup_%s_%d" % [step[0].to_lower(), int(step[1] * 100)])

	for c in party.chars:
		c.ap.play("Run")
	await _wait(0.9)
	await snap("lineup_run")


func _bar_test() -> void :
	daynight.paused = true;daynight.hour = 10.0;daynight.apply()
	for ci in [1, 5]:
		if ci >= camps.size(): continue
		var c: Vector3 = camps[ci].center
		_place(_near(c, 8.0), c, 5.5, -0.22)
		party.enabled = false
		await _wait(1.2)
		await snap("bars_%d_idle" % ci)
		var es: Array = camps[ci].enemies.filter( func(e): return is_instance_valid(e) and e.alive)
		for i in es.size():
			es[i].take_hit(es[i].max_hp * (0.2 + 0.18 * i), ["hydro", "pyro", "electro", "cryo"][i % 4])
		await _wait(0.12)
		await snap("bars_%d_hit" % ci)
		await _wait(1.6)
		await snap("bars_%d_after" % ci)
		party.enabled = true


func _boss_test() -> void :
	party.test_invuln = true
	rank = 20;party.apply_rank(rank)
	for id in ["roi_slime", "colosse", "tempest"]:
		var b: Enemy = world_bosses[id].node
		var c: Vector3 = world.boss_spots[id]
		_place(c + Vector3(0, 0, 13.0), c, 7.5, -0.3)
		await _wait(2.2)
		await snap("boss_%s_1" % id)
		await _wait(2.6)
		await snap("boss_%s_2" % id)
		b.take_hit(b.max_hp * 0.4, "", Vector3.INF)
		await _wait(2.4)
		await snap("boss_%s_3" % id)
		var hits_before: = party.hits_taken
		b.take_hit(10000000.0, "", Vector3.INF)
		await _wait(1.2)
		await snap("boss_%s_4" % id)
		print("BOSSTEST %s name=%s lvl=%d hp=%d hits_on_party=%d kills=%d -> %s" % [id, b.boss_name if is_instance_valid(b) else "?", 
			b.level() if is_instance_valid(b) else -1, int(b.max_hp) if is_instance_valid(b) else 0, hits_before, 
			world_bosses[id].kills, "ok" if world_bosses[id].kills == 1 and hits_before > 0 else "CHECK"])

		for e in get_tree().get_nodes_in_group("enemies"):
			if e is Enemy and not e.is_object and e.global_position.distance_to(c) < 40.0: e.take_hit(10000000.0, "", Vector3.INF)
		await _wait(0.5)


func _domain_test() -> void :
	party.test_invuln = true

	var d0: Dictionary = quests.talk("elder");d0.after.call()
	rank = 4;party.apply_rank(rank)
	print("DOMAINTEST guild before rank5: %s" % quests.st("g_masques"))
	enter_domain("masques")
	print("DOMAINTEST locked at rank 4: inside=%s" % (dungeon != null))
	rank = 30;party.apply_rank(rank);quests.on_rank(rank)
	var dg: Dictionary = quests.talk("guild"); if dg.after.is_valid(): dg.after.call()
	print("DOMAINTEST guild contract: %s step=%d" % [quests.st("g_masques"), quests.step("g_masques")])
	for id in ["masques", "forge", "celeste"]:
		var dm: = domain_def(id)
		_place(dm.pos + Vector3(0, 0, 6), dm.pos, 6.0, -0.2)
		await _wait(0.8)
		await snap("dom_%s_0_gate" % id)
		enter_domain(id)
		await _wait(1.5)
		await snap("dom_%s_1_entree" % id)
		var guard: = 0
		while dungeon.state == "waves" and guard < 40:
			guard += 1
			await _wait(0.6)
			for m in dungeon.mobs:
				if is_instance_valid(m) and m.alive: m.take_hit(10000000.0, "", Vector3.INF)
		print("DOMAINTEST %s waves cleared state=%s" % [id, dungeon.state])
		await _wait(1.8)
		_place(dungeon.to_global(Vector3(0, 0, 30)), dungeon.to_global(Vector3(0, 0, 40)), 7.0, -0.3)
		await _wait(1.2)
		await snap("dom_%s_2_puzzle" % id)
		for t in dungeon.totems:
			(t as Totem).take_hit(10.0, "", Vector3.INF)
			(t as Totem).take_hit(10.0, (t as Totem).needs[0], Vector3.INF)
		await _wait(0.4)
		for m in dungeon.mobs:
			if is_instance_valid(m) and m.alive: m.take_hit(10000000.0, "", Vector3.INF)
		await _wait(2.0)
		print("DOMAINTEST %s puzzle lit=%d/%d state=%s" % [id, dungeon.lit_count, dungeon.totems.size(), dungeon.state])
		_place(dungeon.to_global(Vector3(0, 0, 70)), dungeon.to_global(Vector3(0, 0, 84)), 9.0, -0.3)
		await _wait(2.5)
		await snap("dom_%s_3_boss" % id)
		await _wait(2.5)
		await snap("dom_%s_4_boss" % id)
		if dungeon.boss: dungeon.boss.take_hit(100000000.0, "", Vector3.INF)
		await _wait(1.5)
		print("DOMAINTEST %s boss done state=%s clears=%d" % [id, dungeon.state, int(domain_clears.get(id, 0))])
		var ch: Dictionary = dungeon.chest
		_place(dungeon.to_global(Vector3(0, 0, 90.4)), dungeon.to_global(Vector3(0, 0, 99)), 6.0, -0.3)
		await _wait(0.6)
		interact_target = _find_interaction()
		print("DOMAINTEST %s interaction=%s" % [id, interact_target.get("action", "none")])
		interact()
		await _wait(0.8)
		await snap("dom_%s_5_coffre" % id)
		print("DOMAINTEST %s chest opened=%s" % [id, ch.get("opened", false)])
		leave_domain(true)
		await _wait(0.8)
		print("DOMAINTEST %s outside=%s" % [id, dungeon == null])
	print("DOMAINTEST guild after: %s step=%d" % [quests.st("g_masques"), quests.step("g_masques")])


func _v6_tour() -> void :
	party.test_invuln = true
	var d0: Dictionary = quests.talk("elder");d0.after.call()
	rank = 12;party.apply_rank(rank);quests.on_rank(rank)
	daynight.paused = true
	daynight.hour = 11.0;daynight.apply()
	var gp: = npc_pos("guild")
	_place(gp + Vector3(0, 0, 2.0), gp, 5.0, -0.18)
	await _wait(1.0)
	interact_target = _find_interaction()
	print("V6TOUR guild interaction=%s" % interact_target.get("what", "none"))
	await snap("v6_01_guilde")
	interact()
	await _wait(0.5)
	await snap("v6_02_guilde_dialogue")
	while ui.dlg_open:
		ui.dialogue_next(true); await _wait(0.05);ui.dialogue_next(true); await _wait(0.05)
	print("V6TOUR contracts: masques=%s roi=%s forge=%s colosse=%s" % [quests.st("g_masques"), quests.st("g_roi"), quests.st("g_forge"), quests.st("g_colosse")])
	ui.show_quest_log(true)
	await _wait(0.4)
	await snap("v6_03_journal")
	ui.show_quest_log(false)
	ui.map_ui.toggle(); await _wait(0.5)
	await snap("v6_04_carte")
	ui.map_ui.toggle()
	var views: = [
		["v6_05_marais", world.waypoints[world.waypoints.size() - 6].pos, world.swamp_center(), 14.0, 7.0, -0.22], 
		["v6_06_roi_slime", world.boss_spots.roi_slime + Vector3(0, 0, 20), world.boss_spots.roi_slime, 15.0, 8.0, -0.25], 
		["v6_07_braise", world.waypoints[world.waypoints.size() - 4].pos, world.volcano, 15.5, 7.0, -0.12], 
		["v6_08_caldera", world.volcano + Vector3(-12, 0, -9), world.volcano, 12.5, 8.0, -0.3], 
		["v6_09_orage", world.boss_spots.tempest + Vector3(16, 0, 18), world.boss_spots.tempest, 10.5, 8.0, -0.2], 
		["v6_10_panorama", world.summit, world.volcano, 13.0, 75.0, -0.42], 
		["v6_11_panorama2", world.summit + Vector3(0, 0, 4), world.boss_spots.tempest, 16.0, 75.0, -0.36], 
		["v6_12_lave_nuit", world.waypoints[world.waypoints.size() - 4].pos + Vector3(14, 0, 14), world.volcano, 22.5, 7.0, -0.14], 
		["v6_13_portail", world.domains[2].pos + Vector3(0, 0, 9), world.domains[2].pos, 9.5, 7.0, -0.15]]
	for v in views:
		daynight.hour = v[3];daynight.apply()
		_place(v[1], v[2], v[4], v[5])
		await _wait(1.4)
		await snap(v[0])


func _fix_test() -> void :
	await _wait(1.0)
	var c: Vector3 = camps[1].center
	_place(_near(c, 7.0), c, 5.0, -0.25)
	await _wait(0.8)

	var e: Enemy = camps[1].enemies[0]
	e.alerted = true
	party.ch().skill_cd = 5.0
	toggle_pause()
	var p0: = e.global_position; var cd0: float = party.ch().skill_cd; var h0: float = daynight.hour
	await _wait(1.0)
	await snap("fix_pause")
	var moved: = e.global_position.distance_to(p0); var dcd: float = cd0 - party.ch().skill_cd
	print("FIXTEST pause tree=%s enemy_moved=%.3f cd_delta=%.3f hour_delta=%.4f -> %s" % [get_tree().paused, moved, dcd, daynight.hour - h0, 
		"ok" if moved < 0.001 and dcd < 0.001 and absf(daynight.hour - h0) < 0.0001 else "FAIL"])
	toggle_pause()
	await _wait(0.6)
	print("FIXTEST unpause cd_running=%s -> %s" % [party.ch().skill_cd < cd0 - 0.3, "ok" if party.ch().skill_cd < cd0 - 0.3 else "FAIL"])

	party.input_vec = Vector2(0, 1)
	ui.map_ui.toggle()
	var q0: = party.global_position
	await _wait(0.6)
	await snap("fix_map")
	var walked: = Vector2(party.global_position.x - q0.x, party.global_position.z - q0.z).length()
	print("FIXTEST map enabled=%s walked=%.2f -> %s" % [party.enabled, walked, "ok" if not party.enabled and walked < 0.3 else "FAIL"])
	ui.map_ui.toggle()
	print("FIXTEST map closed enabled=%s -> %s" % [party.enabled, "ok" if party.enabled else "FAIL"])

	var storm: Seal = null
	for s in seals:
		if s.need == "charged": storm = s
	storm.take_hit(10.0, "pyro");storm.take_hit(10.0, "lava")
	var after_fire: = storm.active
	storm.take_hit(10.0, "hydro");storm.take_hit(10.0, "electro")
	print("FIXTEST storm_seal fire=%s hydro+electro=%s -> %s" % [after_fire, storm.active, "ok" if not after_fire and storm.active else "FAIL"])

	party.switch_cd = 0.0;party.switch_to(2)
	await _wait(1.1)
	party.ch().skill_cd = 0.0
	party.do_skill()
	await _wait(0.36)
	party.switch_to(3)
	var still_kael: = party.active == 2
	await _wait(0.25)
	party.switch_to(3)
	print("FIXTEST cast_lock blocked=%s then_switched=%s -> %s" % [still_kael, party.active == 3, "ok" if still_kael and party.active == 3 else "FAIL"])

	var slime: = _make_enemy("slime", "cryo", party.global_position + Vector3(3, 0, 0), 1.0)
	await _wait(0.3)
	slime.take_hit(1.0, "hydro")
	var f1: = slime.frozen > 0.0
	await _wait(3.5)
	slime.take_hit(1.0, "hydro")
	var f2: = slime.frozen > 0.0
	await _wait(2.6)
	slime.take_hit(1.0, "hydro")
	var f3: = slime.frozen > 0.0
	print("FIXTEST gel first=%s right_after=%s later=%s -> %s" % [f1, f2, f3, "ok" if f1 and not f2 and f3 else "FAIL"])
	slime.queue_free()

	var d: Dictionary = quests.talk("elder");d.after.call()
	for i in mini(7, apples.size()): _pick_apple(apples[i])
	var da: Dictionary = quests.talk("cook")
	if da.after.is_valid(): da.after.call()
	print("FIXTEST apples state=%s -> %s" % [quests.st("apples"), "ok" if quests.st("apples") == "done" else "FAIL"])
	_find_cat()
	var dc: Dictionary = quests.talk("child")
	if dc.after.is_valid(): dc.after.call()
	print("FIXTEST cat state=%s returned=%s -> %s" % [quests.st("cat"), cat_returned, "ok" if quests.st("cat") == "done" and cat_returned else "FAIL"])

	await _wait(0.5)
	ui.message("Message A");ui.message("Message B")
	print("FIXTEST messages text=%s -> %s" % [ui.msg_label.text.replace("\n", "|"), "ok" if ui.msg_label.text == "Message A\nMessage B" else "FAIL"])

	_spawn_reward_chest(camps[0].center, 0)
	_open_chest(chests[chests.size() - 1])
	print("FIXTEST camp_chest opened=%s -> %s" % [camps[0].opened, "ok" if camps[0].opened else "FAIL"])

	ui.start_dialogue([["A", Color.WHITE, "un"], ["B", Color.WHITE, "deux"], ["C", Color.WHITE, "trois"]], Callable())
	await _wait(1.0)
	ui.dialogue_next();ui.dialogue_next()
	print("FIXTEST dialogue index=%d -> %s" % [ui.dlg_index, "ok" if ui.dlg_index == 1 else "FAIL"])
	_finish_dialogue()

	party.switch_cd = 0.0;party.switch_to(3)
	boss_done = true
	_spawn_reward_chest(world.summit, -1)
	allow_save_in_test = true
	save_game()

	for x in chests.filter( func(x): return x.get("reward", false) and x.get("camp", -1) == -1):
		(x.node as Node3D).queue_free();chests.erase(x)
	load_game()
	allow_save_in_test = false
	var boss_chest: = chests.filter( func(x): return x.get("reward", false) and x.get("camp", -1) == -1)
	print("FIXTEST load active=%d boss_chest=%d -> %s" % [party.active, boss_chest.size(), "ok" if party.active == 3 and boss_chest.size() == 1 else "FAIL"])
	DirAccess.remove_absolute(ProjectSettings.globalize_path(SAVE_PATH))


func _chest_test() -> void :
	daynight.paused = true;daynight.hour = 11.0;daynight.apply()
	var ch: Dictionary = chests[0]
	var n: Node3D = ch.node
	var cp: Vector3 = n.position
	party.visual.visible = false
	var front: = n.global_transform.basis.z;front.y = 0;front = front.normalized()
	var side: = n.global_transform.basis.x;side.y = 0;side = side.normalized()
	_place(cp + front * 1.2, cp, 2.4, -0.38)
	await _wait(1.2)
	await snap("chest_closed")
	_place(cp + side * 1.2, cp, 2.4, -0.2)
	await _wait(0.6)
	await snap("chest_side")
	_open_chest(ch)
	await _wait(1.0)
	await snap("chest_open_side")
	_place(cp + front * 1.2, cp, 2.4, -0.45)
	await _wait(0.6)
	await snap("chest_open")

func _near(c: Vector3, dist: float) -> Vector3:
	var dir: = world.village - c;dir.y = 0
	if dir.length() < 1.0: dir = Vector3(0, 0, 1)
	return c + dir.normalized() * dist

func _gait_test() -> void :
	var c: Vector3 = world.waypoints[1].pos
	party.global_position = c + Vector3(-6.0, 0.6, 0.0)
	ui.hud.visible = false
	rig.yaw = 0.0;rig.pitch = -0.12;rig.distance = 3.4
	rig.global_position = party.global_position + Vector3(0, 1.45, 0)
	party.visual.rotation.y = PI * 0.5
	await _wait(1.2)
	party.input_vec = Vector2(0.45, 0.0); await _wait(3.0)
	party.input_vec = Vector2(1.0, 0.0); await _wait(1.6)
	var t0: = 0.0
	while t0 < 3.2:
		var ang: = t0 * 1.3
		party.input_vec = Vector2(cos(ang), sin(ang))
		await get_tree().physics_frame;t0 += get_physics_process_delta_time()
	party.sprint_held = true
	t0 = 0.0
	while t0 < 3.4:
		var ang2: = 4.16 + t0 * 0.9
		party.input_vec = Vector2(cos(ang2), sin(ang2))
		await get_tree().physics_frame;t0 += get_physics_process_delta_time()
	party.sprint_held = false
	party.input_vec = Vector2.ZERO
	await _wait(1.6)
	print("GAITTEST done")
	get_tree().quit()

func _finish_dialogue() -> void :
	var guard: = 0
	while ui.dlg_open and guard < 200:
		ui.dialogue_next(true);guard += 1

func _talk_all(id: String) -> void :
	_talk(id);_finish_dialogue()
	print("  talk %-8s -> main=%s/%d apples=%s cat=%s hunt=%s crystals=%s letter=%s" % [id, quests.st("main"), quests.step("main"), 
		quests.st("apples"), quests.st("cat"), quests.st("hunt"), quests.st("crystals"), quests.st("letter")])

func _quest_test() -> void :
	print("QUESTTEST start")
	await _wait(0.5)
	_talk_all("cook")
	_talk_all("elder")
	_talk_all("cook")
	for a in apples: _pick_apple(a)
	_talk_all("cook")
	print("  food=", food)
	_talk_all("child");_find_cat();_talk_all("child")
	_talk_all("guard")
	for i in 12: quests.on_kill()
	_talk_all("guard");_talk_all("guard")
	_talk_all("scholar")
	for k in 10:
		crystals[k].got = true;(crystals[k].node as Node3D).visible = false;crystals_got += 1;quests.on_crystal(crystals_got)
	_talk_all("scholar")
	print("  treasure_map=", treasure_map)

	for ci in 3:
		for e in camps[ci].enemies.duplicate():
			if is_instance_valid(e) and e.alive: e.take_hit(1000000.0, "", Vector3.INF)
	await _wait(0.6)
	print("  camps cleared=", camps_cleared_count(), " main step=", quests.step("main"))
	_talk_all("elder")
	_talk_all("elder")
	_talk_all("keeper")

	(seals[0] as Seal).take_hit(10, "hydro");(seals[1] as Seal).take_hit(10, "electro")
	(seals[2] as Seal).take_hit(10, "hydro");(seals[2] as Seal).take_hit(10, "electro")
	await _wait(0.3)
	print("  seals=", seals_active_count(), " main step=", quests.step("main"), " boss=", is_instance_valid(boss))
	if is_instance_valid(boss): boss.take_hit(10000000.0, "hydro", Vector3.INF)
	await _wait(0.6)
	print("  boss_done=", boss_done, " main step=", quests.step("main"))
	_talk_all("elder")
	await _wait(1.0)
	print("  victory visible=", ui.victory.visible, " ended=", ended)
	await snap("q1_victoire")
	ui._close_victory()

	party.ch().hp = party.ch().max_hp * 0.4
	var ate: = party.eat_food()
	print("  ate=", ate)
	toggle_pause(); await _wait(0.2); await snap("q2_pause");toggle_pause()
	ui.map_ui.toggle(); await _wait(0.2);ui.map_ui.toggle()
	allow_save_in_test = true
	save_game()
	var before: = "%d/%d/%d/%s" % [rank, xp, shards, quests.st("main")]
	var ok: = load_game()
	var after: = "%d/%d/%d/%s" % [rank, xp, shards, quests.st("main")]
	print("  save/load ok=", ok, " before=", before, " after=", after)
	DirAccess.remove_absolute(ProjectSettings.globalize_path(SAVE_PATH))
	print("QUESTTEST rank=%d xp=%d shards=%d food=%d kills=%d" % [rank, xp, shards, food, kills])
	print("QUESTTEST done")
	get_tree().quit()

func _autotest() -> void :
	print("AUTOTEST start")
	var quick: = "--quick" in OS.get_cmdline_user_args()
	await _wait(1.5)
	await snap("01_village")

	_place(npc_pos("elder") + Vector3(0, 0, 2.2), npc_pos("elder"), 4.2, -0.2)
	await _wait(0.6)
	interact_target = _find_interaction()
	await snap("02_pnj")
	interact()
	await _wait(0.4)
	await snap("03_dialogue")
	while ui.dlg_open:
		ui.dialogue_next(true); await _wait(0.05);ui.dialogue_next(true); await _wait(0.05)
	print("QUEST main step=", quests.step("main"), " tracked=", quests.tracked)
	await _wait(0.3)
	await snap("04_quete_active")

	ui.show_time_menu(true);ui.time_target = 21.0
	await _wait(0.4)
	await snap("04b_heure")
	ui._confirm_time()
	await _wait(3.0)
	print("TIME after fast-forward=", daynight.clock_text())
	await snap("04c_nuit")
	ui.show_quest_log(true)
	await _wait(0.4)
	await snap("04d_quetes")
	ui.show_quest_log(false)
	daynight.fast_forward(9.0)
	await _wait(3.0)

	var views: = [["05_prairie", Vector3(-30, 0, -60), Vector3(40, 0, 10)], ["06_automne", Vector3(120, 0, -20), Vector3(160, 0, 30)], 
		["07_cerisiers", Vector3(-100, 0, 80), Vector3(-150, 0, 60)], ["08_plateau", Vector3(30, 0, 120), Vector3(-10, 0, 152)], 
		["09_pic", Vector3(70, 0, 50), world.summit], ["10_lac", Vector3(-90, 0, -40), world.lake]]
	for v in views:
		_place(v[1], v[2], 6.5, -0.22)
		await _wait(0.9)
		await snap(v[0])
		if quick and v[0] == "06_automne": break
	if quick:
		if ui.touch:

			var ab: TouchBtn = ui.buttons["attack"]; var jb: TouchBtn = ui.buttons["jump"]
			var t1: = InputEventScreenTouch.new();t1.index = 0;t1.pressed = true
			t1.position = ab.get_global_transform_with_canvas() * Vector2(64, 64)
			var t2: = InputEventScreenTouch.new();t2.index = 1;t2.pressed = true
			t2.position = jb.get_global_transform_with_canvas() * Vector2(64, 64)
			Input.parse_input_event(t1);Input.parse_input_event(t2)
			await get_tree().process_frame
			print("TOUCHTEST pressed attack=", Input.is_action_pressed("attack"), " jump=", Input.is_action_pressed("jump"))
			t1 = t1.duplicate();t1.pressed = false;Input.parse_input_event(t1)
			await get_tree().process_frame
			print("TOUCHTEST released attack=", Input.is_action_pressed("attack"), " jump=", Input.is_action_pressed("jump"))
			t2 = t2.duplicate();t2.pressed = false;Input.parse_input_event(t2)
			await get_tree().process_frame
			print("TOUCHTEST all released jump=", Input.is_action_pressed("jump"))

			var sb: TouchBtn = ui.buttons["switch4"]
			var t3: = InputEventScreenTouch.new();t3.index = 2;t3.pressed = true
			t3.position = sb.get_global_transform_with_canvas() * Vector2(0, 0)
			Input.parse_input_event(t3)
			await get_tree().process_frame
			print("TOUCHTEST switch4 pressed=", Input.is_action_pressed("switch4"), " switch3=", Input.is_action_pressed("switch3"))
			t3 = t3.duplicate();t3.pressed = false;Input.parse_input_event(t3)
			await get_tree().process_frame
			print("TOUCHTEST switch4 released=", not Input.is_action_pressed("switch4"))
			party.switch_to(3); await _wait(0.6)
			await snap("06b_zahara_touch")
		print("AUTOTEST done");get_tree().quit();return

	ui.map_ui.toggle(); await _wait(0.4)
	await snap("11_carte")
	ui.map_ui.toggle()

	_place(_near(camps[0].center, 9.0), camps[0].center, 6.0, -0.3)
	await _wait(1.2)
	await snap("12_gobelins")
	for i in 4:
		party.do_attack(); await _wait(0.45)
	party.do_skill(); await _wait(1.0)
	await snap("13_combat_kaelith")
	party.switch_to(1); await _wait(0.4)
	for i in 4:
		party.do_attack(); await _wait(0.35)
	await snap("14_combat_lyra")
	await _new_heroes_test()

	_place(_near(camps[7].center, 7.0), camps[7].center, 6.0, -0.3)
	party.switch_to(0); await _wait(1.2)
	party.do_attack(); await _wait(0.5);party.do_attack(); await _wait(0.5)
	await snap("15_gel")

	_place(_near(seals[2].global_position, 5.0), seals[2].global_position, 7.0, -0.25)
	await _wait(0.8)
	await snap("16_sceau")
	party.switch_to(0); await _wait(1.1);party.do_attack(); await _wait(0.6)
	party.switch_to(1); await _wait(1.1);party.do_skill(); await _wait(1.0)
	await snap("17_sceau_actif")

	_place(world.summit + Vector3(0, 0, 16), world.summit + Vector3(0, 0, 60), 6.0, -0.15)
	await _wait(0.4)
	party.global_position += Vector3(0, 7.0, 0)
	party.input_vec = Vector2(0, 1)
	await _wait(0.35)
	party.do_jump(); await _wait(1.3)
	print("GLIDE gliding=", party.gliding)
	await snap("18_planeur")
	party.input_vec = Vector2.ZERO

	daynight.hour = 21.5;daynight.apply()
	_place(world.village + Vector3(0, 0, 18), world.village, 7.0, -0.25)
	await _wait(1.0)
	await snap("19_nuit")
	daynight.hour = 18.4;daynight.apply()
	_place(Vector3(-30, 0, -40), world.summit, 7.0, -0.15)
	await _wait(0.8)
	await snap("20_coucher")
	daynight.hour = 10.0;daynight.apply()

	spawn_boss()
	_place(world.summit + Vector3(0, 0, 12), world.summit, 8.0, -0.3)
	await _wait(1.5)
	for i in 5:
		party.do_attack(); await _wait(0.4)
	await snap("21_boss")

	var ch: Dictionary = chests[0]
	_place((ch.node as Node3D).position + Vector3(0, 0, 2.0), (ch.node as Node3D).position, 4.5, -0.3)
	await _wait(0.6)
	_open_chest(ch); await _wait(0.8)
	await snap("22_coffre")
	print("AUTOTEST rank=%d xp=%d kills=%d reactions=%d seals=%d camps=%d shards=%d" % [rank, xp, kills, reactions, seals_active_count(), camps_cleared_count(), shards])
	print("AUTOTEST done")
	get_tree().quit()


# ----------------------------------------------------------------------------
# Tests : escalade, nage, Anémoculus
# ----------------------------------------------------------------------------
func _ok(cond: bool) -> String:
	return "ok" if cond else "FAIL"

## Pousse le héros vers `target` (caméra derrière lui) pendant au plus `t` secondes, s'arrête si `until` est vrai.
func _drive(target: Vector3, t: float, until: Callable = Callable(), climb_up: = false) -> void :
	var left: = t
	while left > 0.0:
		if until.is_valid() and until.call(): break
		var to: = target - party.global_position;to.y = 0
		if party.climbing and climb_up:
			party.input_vec = Vector2(0, 1)
		elif to.length() > 0.05:
			rig.yaw = atan2( - to.x, - to.z)
			party.input_vec = Vector2(0, 1)
		await get_tree().physics_frame
		left -= get_physics_process_delta_time()
	party.input_vec = Vector2.ZERO

func _side_cam(p: Vector3, dist: = 9.0, pitch: = -0.15) -> void :
	rig.distance = dist;rig.pitch = pitch
	rig.global_position = p + Vector3(0, 1.45, 0)

func _climb_test() -> void :
	party.test_invuln = true
	# 1) mur d'une maison du village
	var ridge: Vector3 = world.house_ridges[1]
	var hc: = Vector3(ridge.x, 0, ridge.z)
	var out: = world.village - hc;out.y = 0;out = out.normalized()
	var start: = world.snap(hc + out * 6.0, 0.4)
	_place(start, hc, 7.0, -0.2)
	await _wait(0.5)
	var y0: = party.global_position.y
	await _drive(hc, 4.0, func(): return party.climbing)
	print("CLIMBTEST attach_house climbing=%s -> %s" % [party.climbing, _ok(party.climbing)])
	await _drive(hc, 1.2, Callable(), true)
	rig.yaw += 0.9
	await _wait(0.1)
	await snap("climb_wall")
	var st0: = party.stamina
	await _drive(hc, 9.0, func(): return not party.climbing and not party.vaulting and party.is_on_floor() and party.global_position.y > y0 + 6.0, true)
	await _wait(0.6)
	var top_y: = party.global_position.y
	print("CLIMBTEST house_top y=%.2f ridge=%.2f stamina_used=%.1f on_floor=%s -> %s" % [top_y, ridge.y, st0 - party.stamina, party.is_on_floor(), 
		_ok(top_y > ridge.y - 1.2 and party.is_on_floor())])
	_side_cam(party.global_position, 8.0, -0.35)
	await _wait(0.4)
	await snap("climb_roof")
	# 2) saut d'escalade et lâcher prise sur le phare
	var lh: Vector3 = world.lighthouse
	var lo: = Vector3(lh.x, 0, lh.z).normalized() * -1.0
	_place(world.snap(lh + lo * 6.0, 0.4), lh, 7.0, -0.2)
	await _wait(0.4)
	await _drive(lh, 4.0, func(): return party.climbing)
	await _drive(lh, 1.5, Callable(), true)
	var ya: = party.global_position.y
	party.stamina = party.stamina_max
	party.do_jump()
	await _wait(0.4)
	var jumped: = party.global_position.y - ya
	print("CLIMBTEST climb_jump dy=%.2f climbing=%s -> %s" % [jumped, party.climbing, _ok(jumped > 1.3 and party.climbing)])
	party.stamina = party.stamina_max
	await _drive(lh, 16.0, func(): return not party.climbing and not party.vaulting and party.global_position.y > 14.0 and party.is_on_floor(), true)
	await _wait(0.5)
	print("CLIMBTEST lighthouse_top y=%.2f (sol %.2f) -> %s" % [party.global_position.y, lh.y, _ok(party.global_position.y > lh.y + 15.0)])
	_side_cam(party.global_position, 9.0, -0.5)
	await _wait(0.4)
	await snap("climb_lighthouse_top")
	var got0: = oculi_got
	await _wait(0.2)
	print("CLIMBTEST lighthouse_oculus got=%d -> %s" % [oculi_got, _ok(oculi_got > got0 or oculi_got > 0)])
	# lâcher prise
	_place(world.snap(lh + lo * 6.0, 0.4), lh, 7.0, -0.2)
	await _wait(0.3)
	await _drive(lh, 4.0, func(): return party.climbing)
	await _drive(lh, 1.0, Callable(), true)
	party.do_dash()
	await _wait(0.1)
	print("CLIMBTEST let_go climbing=%s -> %s" % [party.climbing, _ok(not party.climbing)])
	await _wait(1.5)
	# 3) aiguille rocheuse (celle qui a un Anémoculus en plein ciel à côté)
	var sp: Vector3 = world.spire_tops[1]
	var sb: = Vector3(sp.x, 0, sp.z)
	var so: = world.village - sb;so.y = 0;so = so.normalized()
	_place(world.snap(sb + so * 7.0, 0.4), sb, 8.0, -0.2)
	await _wait(0.4)
	await _drive(sb, 5.0, func(): return party.climbing)
	print("CLIMBTEST attach_spire climbing=%s -> %s" % [party.climbing, _ok(party.climbing)])
	party.stamina = party.stamina_max
	await _drive(sb, 2.2, Callable(), true)
	party.input_vec = Vector2(0, 1)
	rig.yaw += 0.75;rig.pitch = -0.05;rig.distance = 5.0
	await _wait(0.5)
	await snap("climb_spire")
	var g1: = oculi_got
	await _drive(sb, 16.0, func(): return not party.climbing and not party.vaulting and party.is_on_floor() and party.global_position.y > sp.y - 1.5, true)
	await _wait(0.3)
	await _drive(sb, 1.5, func(): return oculi_got > g1)
	await _wait(0.3)
	print("CLIMBTEST spire_top y=%.2f top=%.2f oculus=%s stamina=%.0f -> %s" % [party.global_position.y, sp.y, oculi_got > g1, party.stamina, 
		_ok(party.global_position.y > sp.y - 1.5 and oculi_got > g1)])
	_side_cam(party.global_position, 10.0, -0.35)
	await _wait(0.4)
	await snap("climb_spire_top")
	# planer depuis le sommet vers l'Anémoculus en plein ciel
	var fl: Vector3 = Vector3.INF
	for o in oculi:
		if not o.got and Vector2(o.pos.x - sp.x, o.pos.z - sp.z).length() < 10.0 and o.pos.y < sp.y: fl = o.pos
	if fl != Vector3.INF:
		var g2: = oculi_got
		var dir: = fl - party.global_position;dir.y = 0
		rig.yaw = atan2( - dir.x, - dir.z)
		party.input_vec = Vector2(0, 1)
		await _wait(0.3)
		party.do_jump()
		await _wait(0.3)
		party.do_jump()
		await _drive(fl, 4.0, func(): return oculi_got > g2)
		print("CLIMBTEST glide_oculus got=%s gliding=%s -> %s" % [oculi_got > g2, party.gliding, _ok(oculi_got > g2)])
	# 4) épuisement : on tombe
	_place(world.snap(sb + so * 7.0, 0.4), sb, 8.0, -0.2)
	await _wait(0.4)
	await _drive(sb, 5.0, func(): return party.climbing)
	party.stamina = 4.0
	await _drive(sb, 2.0, func(): return not party.climbing, true)
	print("CLIMBTEST exhausted climbing=%s -> %s" % [party.climbing, _ok(not party.climbing)])
	await _wait(1.5)
	# 5) le village n'est pas un mur : un PNJ ne s'escalade pas
	var elder: Vector3 = npc_pos("elder")
	_place(world.snap(elder + Vector3(0, 0, 3.0), 0.4), elder, 6.0)
	await _wait(0.3)
	await _drive(elder, 1.5)
	print("CLIMBTEST npc_not_climbable climbing=%s -> %s" % [party.climbing, _ok(not party.climbing)])

func _swim_test() -> void :
	party.test_invuln = true
	var lk: Vector3 = world.lake
	# trouver la rive : depuis le centre vers l'extérieur
	var shore: = lk
	for k in 60:
		var q: = lk + Vector3(1, 0, 0.4).normalized() * (10.0 + k)
		if world.height_at(q.x, q.z) > World.LAKE_Y + 0.3:
			shore = q;break
	_place(world.snap(shore + (shore - lk).normalized() * 3.0, 0.4), lk, 6.0, -0.3)
	await _wait(0.5)
	await _drive(lk, 10.0, func(): return party.swimming)
	print("SWIMTEST enter swimming=%s y=%.2f water=%.2f -> %s" % [party.swimming, party.global_position.y, World.LAKE_Y, _ok(party.swimming)])
	await _drive(lk, 1.5)
	party.input_vec = Vector2(0, 1)
	rig.yaw += 1.2
	await _wait(0.3)
	await snap("swim_crawl")
	party.input_vec = Vector2.ZERO
	await _wait(1.2)
	await snap("swim_idle")
	var dy: = party.global_position.y - (World.LAKE_Y - Party.SWIM_ROOT)
	print("SWIMTEST float dy=%.2f -> %s" % [dy, _ok(absf(dy) < 0.2)])
	# Anémoculus du lac
	var target: = Vector3.INF
	for o in oculi:
		if not o.got and Vector2(o.pos.x - lk.x, o.pos.z - lk.z).length() < 30.0 and absf(o.pos.y - World.LAKE_Y - 0.85) < 0.1: target = o.pos;break
	var g0: = oculi_got
	party.stamina = party.stamina_max
	await _drive(target, 25.0, func(): return oculi_got > g0)
	print("SWIMTEST lake_oculus got=%s -> %s" % [oculi_got > g0, _ok(oculi_got > g0)])
	# nage rapide : consomme de l'endurance
	party.stamina = party.stamina_max
	party.sprint_held = true
	var p0: = party.global_position
	await _drive(lk + Vector3(-15, 0, 10), 1.5)
	var fast_d: = Vector2(party.global_position.x - p0.x, party.global_position.z - p0.z).length()
	print("SWIMTEST fast dist=%.2f stamina=%.0f -> %s" % [fast_d, party.stamina, _ok(fast_d > 4.0 and party.stamina < party.stamina_max - 15.0)])
	# noyade : retour sur la rive
	party.stamina = 3.0
	await _drive(lk, 3.0, func(): return not party.swimming)
	party.sprint_held = false
	await _wait(1.2)
	var land_h: = world.height_at(party.global_position.x, party.global_position.z)
	print("SWIMTEST drown swimming=%s back_on_land=%s pos=%s -> %s" % [party.swimming, land_h > World.LAKE_Y, party.global_position, _ok(not party.swimming and land_h > World.LAKE_Y - 0.2)])
	# sortir de l'eau à pied
	_place(world.snap(shore + (shore - lk).normalized() * 3.0, 0.4), lk, 6.0)
	await _wait(0.3)
	await _drive(lk, 10.0, func(): return party.swimming)
	await _drive(shore + (shore - lk).normalized() * 6.0, 8.0, func(): return not party.swimming)
	await _wait(0.6)
	print("SWIMTEST exit swimming=%s on_floor=%s -> %s" % [party.swimming, party.is_on_floor(), _ok(not party.swimming)])
	# mer, près du ponton
	var dk: Vector3 = world.dock_pos
	_place(world.snap(dk + Vector3(-8, 0, 12), 0.4), dk + Vector3(-8, 0, -20), 6.0)
	await _wait(0.3)
	await _drive(dk + Vector3(-8, 0, -30), 12.0, func(): return party.swimming)
	print("SWIMTEST sea swimming=%s y=%.2f -> %s" % [party.swimming, party.global_position.y, _ok(party.swimming)])
	await _drive(dk + Vector3(-8, 0, -30), 1.0)
	_side_cam(party.global_position, 7.0, -0.3)
	await _wait(0.6)
	await snap("swim_sea")

func _oculus_test() -> void :
	party.test_invuln = true
	print("OCULUSTEST count=%d need=%d -> %s" % [oculi.size(), OCULUS_LEVELS.reduce( func(a, b): return a + b, 0), _ok(oculi.size() >= 40)])
	var space: = get_world_3d().direct_space_state
	var bad: = 0
	for i in oculi.size():
		var p: Vector3 = oculi[i].pos
		var qp: = PhysicsPointQueryParameters3D.new();qp.position = p;qp.collision_mask = 1
		var inside: = not space.intersect_point(qp, 1).is_empty()
		var rq: = PhysicsRayQueryParameters3D.create(p, p - Vector3(0, 6.0, 0), 1)
		var hit: = space.intersect_ray(rq)
		var below: = 99.0 if hit.is_empty() else p.y - (hit.position as Vector3).y
		var wy: = world.water_level_at(p.x, p.z)
		var on_water: = wy > -INF and absf(p.y - wy - 0.85) < 0.05 and wy - world.height_at(p.x, p.z) > 1.3
		var gliding_spot: = false
		for t in world.spire_tops:
			if Vector2(t.x - p.x, t.z - p.z).length() < 12.0 and p.y < t.y: gliding_spot = true
		var ok: = not inside and (below < 2.4 or on_water or gliding_spot)
		if not ok: bad += 1
		print("  oculus %2d pos=(%.0f, %.1f, %.0f) inside=%s below=%.1f water=%s %s" % [i, p.x, p.y, p.z, inside, below, on_water, "" if ok else "<- BAD"])
	print("OCULUSTEST placement bad=%d -> %s" % [bad, _ok(bad == 0)])
	# vue d'un Anémoculus sur un toit : le héros se tient sur le faîtage, un peu à l'écart
	var o0: Vector3 = oculi[0].pos
	var r0: Vector3 = world.house_ridges[0]
	party.global_position = r0 + (world.house_ridges[1] - r0).normalized() * 0.0 + Vector3(0, 0.1, 0)
	party.reset_motion()
	var hx: = Basis(Vector3.UP, atan2(world.village.x - r0.x, world.village.z - r0.z)) * Vector3(2.4, 0, 0)
	party.global_position = r0 + hx + Vector3(0, 0.1, 0)
	await _wait(0.3)
	var lk: = o0 - party.global_position;lk.y = 0
	rig.yaw = atan2( - lk.x, - lk.z) + 0.5;rig.pitch = -0.2;rig.distance = 4.0
	party.visual.rotation.y = atan2(lk.x, lk.z)
	await _wait(0.8)
	await snap("oculus_roof")
	# collecte
	for k in 9:
		var o: Dictionary = oculi[k + 6]
		party.global_position = (o.node as Node3D).position - Vector3(0, 1.0, 0)
		party.velocity = Vector3.ZERO
		await get_tree().physics_frame
		await _wait(0.12)
	await _wait(0.3)
	print("OCULUSTEST collect got=%d in_hand=%d -> %s" % [oculi_got, oculi_in_hand(), _ok(oculi_got == 9)])
	await snap("oculus_toast")
	# statue : interaction, menu, offrande
	var s: Vector3 = world.statues[0]
	_place(world.snap(s + Vector3(0, 0, 4.0), 0.4), s, 6.0)
	await _wait(0.5)
	interact_target = _find_interaction()
	print("OCULUSTEST statue_prompt kind=%s -> %s" % [interact_target.get("kind", ""), _ok(interact_target.get("kind", "") == "statue")])
	interact()
	await _wait(0.5)
	await snap("statue_menu")
	var m0: = party.stamina_max
	ui.statue_menu._offer()
	await _wait(0.8)
	await snap("statue_menu_offered")
	print("OCULUSTEST offer level=%d offered=%d in_hand=%d stamina_max %.0f->%.0f -> %s" % [statue_level, oculi_offered, oculi_in_hand(), m0, party.stamina_max, 
		_ok(statue_level == 2 and oculi_offered == 9 and oculi_in_hand() == 0 and party.stamina_max == 130.0 and statue_progress() == 2)])
	ui.show_statue(false)
	await _wait(0.3)
	print("OCULUSTEST menu_closed enabled=%s -> %s" % [party.enabled, _ok(party.enabled and not ui.statue_menu.visible)])
	# l'endurance max sert vraiment : sprint plus long
	party.stamina = party.stamina_max
	print("OCULUSTEST stamina_full=%.0f wheel_max=%.0f -> %s" % [party.stamina, ui.stam_wheel.max_value, _ok(ui.stam_wheel.max_value == 130.0)])
	# sauvegarde / chargement
	var bak: = ""
	if FileAccess.file_exists(SAVE_PATH): bak = FileAccess.get_file_as_string(SAVE_PATH)
	allow_save_in_test = true
	save_game()
	oculi_got = 0;oculi_offered = 0;statue_level = 0;apply_stamina_level()
	var loaded: = load_game()
	print("OCULUSTEST save_load loaded=%s got=%d offered=%d level=%d max=%.0f hidden=%s -> %s" % [loaded, oculi_got, oculi_offered, statue_level, party.stamina_max, 
		not (oculi[6].node as Node3D).visible, _ok(loaded and oculi_got == 9 and oculi_offered == 9 and statue_level == 2 and party.stamina_max == 130.0)])
	# ancienne sauvegarde (v3) : valeurs par défaut
	var d: Dictionary = JSON.parse_string(FileAccess.get_file_as_string(SAVE_PATH))
	for k in ["oculi", "oculi_offered", "statue_level", "oculus_hint"]: d.erase(k)
	d["version"] = 3
	var f: = FileAccess.open(SAVE_PATH, FileAccess.WRITE);f.store_string(JSON.stringify(d));f.close()
	loaded = load_game()
	print("OCULUSTEST old_save loaded=%s got=%d level=%d max=%.0f visible=%s -> %s" % [loaded, oculi_got, statue_level, party.stamina_max, (oculi[6].node as Node3D).visible, 
		_ok(loaded and oculi_got == 0 and statue_level == 0 and party.stamina_max == 100.0 and (oculi[6].node as Node3D).visible)])
	if bak != "":
		f = FileAccess.open(SAVE_PATH, FileAccess.WRITE);f.store_string(bak);f.close()
	else:
		DirAccess.remove_absolute(ProjectSettings.globalize_path(SAVE_PATH))
	allow_save_in_test = false
	# inventaire
	oculi_got = 5;oculi_offered = 0
	toggle_pause()
	await _wait(0.3)
	ui.open_sub("bag")
	await _wait(0.4)
	ui.bag_menu._pick("oculi")
	await _wait(0.2)
	await snap("bag_oculi")
	ui.close_sub()
	toggle_pause()
	# panorama des aiguilles
	var sp: Vector3 = world.spire_tops[8]
	party.global_position = world.snap(sp + Vector3(16, 0, 10), 0.4)
	rig.global_position = party.global_position + Vector3(0, 1.45, 0)
	var to: = sp - party.global_position;to.y = 0
	rig.yaw = atan2( - to.x, - to.z);rig.pitch = 0.05;rig.distance = 6.0
	await _wait(0.8)
	await snap("spire_view")


# ----------------------------------------------------------------------------
# Tests v8 : inventaire, fruits, cueillette, cuisine, boutique, quêtes, domaine, cinématiques
# ----------------------------------------------------------------------------
func _talk_now(id: String, choice: = -1) -> void :
	interact_target = {}
	_talk(id)
	var guard: = 0
	while ui.dlg_open and guard < 60:
		guard += 1
		if ui.choices_shown():
			if choice >= 0: ui.choose(choice)
			else: ui.choose(ui.dlg_choices.size() - 1)
			break
		ui.dialogue_next(true);ui.dialogue_next(true)
		await get_tree().process_frame

func _v8_test() -> void :
	party.test_invuln = true
	var d0: Dictionary = quests.talk("elder");d0.after.call()
	await _wait(0.3)
	# --- inventaire et plats
	var m0: = mora
	add_item("tarte", 2);add_item("ragout", 1);add_item("jus", 1)
	party.ch().hp = party.ch().max_hp * 0.5
	var ate: = eat("tarte")
	print("V8TEST eat_tarte ok=%s hp=%.0f/%.0f left=%d -> %s" % [ate, party.ch().hp, party.ch().max_hp, item_count("tarte"), _ok(ate and item_count("tarte") == 1 and party.ch().hp > party.ch().max_hp * 0.8)])
	eat("ragout")
	print("V8TEST ragout atk_buff=%.0f%% atk_of=%.1f base=%.1f -> %s" % [party.buff_val("atk"), party.atk_of(party.ch()), party.ch().atk, _ok(party.buff_val("atk") == 20.0)])
	party.stamina = 10.0;eat("jus")
	print("V8TEST jus stamina=%.0f -> %s" % [party.stamina, _ok(party.stamina >= 69.0)])
	print("V8TEST food_total=%d mora=%d -> %s" % [food_total(), mora, _ok(food_total() == 1 and mora == m0)])
	# --- arbre fruitier
	var tree_i: = -1
	for i in world.trees.size():
		if world.trees[i].fruit == "soleillette" and world.trees[i].ripe: tree_i = i;break
	var t: Dictionary = world.trees[tree_i]
	var tp: Vector3 = t.p
	var back: = (world.spawn_pos - tp);back.y = 0;back = back.normalized()
	_place(world.snap(tp + back * 1.6, 0.4), tp, 6.0, -0.25)
	await _wait(0.5)
	var c0: = item_count("soleillette")
	party.switch_cd = 0.0;party.switch_to(1)
	await _wait(1.2)
	party.do_attack()
	await _wait(0.5)
	var dropped: = drops.size()
	await snap("v8_fruits_tombent")
	# ramasser : marcher sur les fruits
	await _wait(0.4)
	for dd in drops.duplicate():
		if is_instance_valid(dd.node): party.global_position = (dd.node as Node3D).position
		await _wait(0.3)
	await _wait(0.3)
	print("V8TEST tree_hit drops=%d picked=%d ripe=%s -> %s" % [dropped, item_count("soleillette") - c0, t.ripe, _ok(dropped >= 3 and item_count("soleillette") - c0 == dropped and not t.ripe)])
	# --- cueillette
	var g: Dictionary = {}
	for gg in gathers:
		if gg.kind == "menthe": g = gg;break
	_place(world.snap((g.pos as Vector3) + Vector3(1.2, 0, 0), 0.4), g.pos, 5.0, -0.3)
	await _wait(0.4)
	interact_target = _find_interaction()
	var gk: String = interact_target.get("kind", "")
	var mc: = item_count("menthe")
	interact()
	print("V8TEST gather kind=%s menthe +%d -> %s" % [gk, item_count("menthe") - mc, _ok(gk == "gather" and item_count("menthe") > mc)])
	# --- boutique (Mireille, Brise-Marée)
	_place(world.snap(npc_pos("grocer") + Vector3(0, 0, -2.2), 0.4), npc_pos("grocer"), 5.0, -0.2)
	await _wait(0.4)
	print("V8TEST q_recolte state=%s -> %s" % [quests.st("q_recolte"), _ok(quests.st("q_recolte") == "available")])
	await _talk_now("grocer")
	await _talk_now("grocer", 0)
	await _wait(0.4)
	print("V8TEST shop_open visible=%s shop=%s -> %s" % [ui.shop_menu.visible, ui.shop_menu.shop_id, _ok(ui.shop_menu.visible and ui.shop_menu.shop_id == "bm_epicerie")])
	mora = 2000
	ui.shop_menu._pick("viande");ui.shop_menu._set_qty(4);ui.shop_menu._buy()
	ui.shop_menu._pick("sel");ui.shop_menu._set_qty(2);ui.shop_menu._buy()
	ui.shop_menu._pick("omelette#r");ui.shop_menu._buy()
	print("V8TEST buy viande=%d sel=%d mora=%d omelette_known=%s -> %s" % [item_count("viande"), item_count("sel"), mora, recipes_known.has("omelette"), 
		_ok(item_count("viande") == 4 and item_count("sel") == 2 and mora == 2000 - 180 - 30 - 500 and recipes_known.has("omelette"))])
	ui.show_overlay(ui.shop_menu, false)
	await _wait(0.2)
	# --- cuisine
	_place(world.snap(world.cook_spots[0] + Vector3(0, 0, 2.0), 0.4), world.cook_spots[0], 5.0, -0.3)
	await _wait(0.4)
	interact_target = _find_interaction()
	var ck: String = interact_target.get("kind", "")
	interact()
	await _wait(0.4)
	ui.cook_menu._pick("brochette")
	var b0: = item_count("brochette")
	ui.cook_menu._start_cook()
	var gauge: = ui.cook_menu.game
	await _wait(0.3)
	gauge.pos = (gauge.gold.x + gauge.gold.y) * 0.5
	gauge.stop()
	await _wait(0.2)
	print("V8TEST cook kind=%s brochette +%d mastery=%d -> %s" % [ck, item_count("brochette") - b0, int(recipe_mastery.get("brochette", 0)), _ok(ck == "cook" and item_count("brochette") - b0 == 2)])
	await _wait(1.0)
	ui.show_overlay(ui.cook_menu, false)
	# --- quête « La récolte de Mireille » (déjà acceptée plus haut)
	_place(world.snap(npc_pos("grocer") + Vector3(0, 0, -2.2), 0.4), npc_pos("grocer"), 5.0, -0.2)
	remove_item("soleillette", item_count("soleillette"))
	add_item("soleillette", 5)
	var stp_after_collect: = quests.step("q_recolte")
	await _talk_now("grocer")
	print("V8TEST q_recolte step_after_collect=%d state=%s jus=%d -> %s" % [stp_after_collect, quests.st("q_recolte"), item_count("jus"), _ok(stp_after_collect == 1 and quests.st("q_recolte") == "done")])
	# --- quête du domaine : le carnet de Basile
	rank = 6;party.apply_rank(rank);quests.on_rank(rank);quests.ensure_tracked()
	_place(world.snap(npc_pos("j_herb") + Vector3(0, 0, 2.2), 0.4), npc_pos("j_herb"), 5.0, -0.2)
	await _wait(0.4)
	await _talk_now("j_herb")
	print("V8TEST carnet started state=%s step=%d -> %s" % [quests.st("q_jonc_carnet"), quests.step("q_jonc_carnet"), _ok(quests.st("q_jonc_carnet") == "active")])
	enter_domain("masques")
	await _wait(1.2)
	print("V8TEST domain relics=%d event_npc=%s -> %s" % [dungeon.relics.size(), dungeon.event_npc != null, _ok(dungeon.relics.size() == 3 and dungeon.event_npc != null)])
	var r0: Dictionary = dungeon.relics[0]
	_place((r0.node as Node3D).global_position - Vector3(0, 1.1, 0) + Vector3(1.0, 0, -1.0), (r0.node as Node3D).global_position, 5.0, -0.2)
	await _wait(0.6)
	await snap("v8_relique_domaine")
	for k in 3:
		var r: Dictionary = dungeon.relics[0]
		party.global_position = (r.node as Node3D).global_position - Vector3(0, 1.1, 0)
		await _wait(0.1)
		interact_target = _find_interaction()
		interact()
		await _wait(0.1)
	print("V8TEST relics pages=%d step=%d -> %s" % [item_count("page_carnet"), quests.step("q_jonc_carnet"), _ok(item_count("page_carnet") == 3 and quests.step("q_jonc_carnet") == 1)])
	# vider le domaine pour libérer Basile
	var guard2: = 0
	while dungeon.state != "done" and guard2 < 80:
		guard2 += 1
		for mm in dungeon.mobs:
			if is_instance_valid(mm) and mm.alive: mm.take_hit(100000000.0, "", Vector3.INF)
		for tt in dungeon.totems:
			(tt as Totem).take_hit(10.0, "", Vector3.INF);(tt as Totem).take_hit(10.0, (tt as Totem).needs[0], Vector3.INF)
		if dungeon.state == "puzzle": party.global_position = dungeon.to_global(Vector3(0, 0.5, 34))
		if dungeon.state == "boss_wait": party.global_position = dungeon.to_global(Vector3(0, 0.5, 74))
		if dungeon.state == "boss" and dungeon.boss: dungeon.boss.take_hit(100000000.0, "", Vector3.INF)
		await _wait(0.5)
	party.global_position = dungeon.event_npc.global_position + Vector3(1.6, 0.3, 0)
	await _wait(0.4)
	interact_target = _find_interaction()
	var ev_ok: bool = interact_target.get("action", "") == "event"
	interact()
	await _wait(0.3)
	var guard3: = 0
	while ui.dlg_open and guard3 < 30:
		guard3 += 1;ui.dialogue_next(true);ui.dialogue_next(true);await get_tree().process_frame
	print("V8TEST basile event_ready=%s step=%d -> %s" % [ev_ok, quests.step("q_jonc_carnet"), _ok(ev_ok and quests.step("q_jonc_carnet") == 2)])
	leave_domain(true)
	await _wait(0.5)
	_place(world.snap(npc_pos("j_herb") + Vector3(0, 0, 2.2), 0.4), npc_pos("j_herb"), 5.0, -0.2)
	await _talk_now("j_herb")
	print("V8TEST carnet done=%s gateau=%d -> %s" % [quests.st("q_jonc_carnet"), item_count("gateau"), _ok(quests.st("q_jonc_carnet") == "done" and item_count("gateau") >= 2)])
	# --- quête de cuisine (le festin du pêcheur)
	await _talk_now("j_cook")
	add_item("poisson", 2);add_item("lotus", 1);add_item("sel", 1)
	ui.show_overlay(ui.cook_menu, true)
	ui.cook_menu._pick("soupe")
	ui.cook_menu._start_cook()
	var guard4: = 0
	while gauge.running and gauge.pos < (gauge.ok.x + gauge.gold.x) * 0.5 and guard4 < 600:
		guard4 += 1;await get_tree().process_frame
	gauge.stop()
	await _wait(1.2)
	ui.show_overlay(ui.cook_menu, false)
	await _talk_now("j_cook")
	print("V8TEST soupe quest=%s -> %s" % [quests.st("q_jonc_soupe"), _ok(quests.st("q_jonc_soupe") == "done")])
	# --- acte II : les trois villages
	quests.q["main"].step = 3;quests.refresh_new()
	print("V8TEST main2 available=%s -> %s" % [quests.st("main2"), _ok(quests.st("main2") == "available")])
	await _talk_now("elder")
	for who in ["j_chief", "f_chief", "h_chief", "elder"]:
		await _talk_now(who)
	print("V8TEST main2 state=%s mora=%d -> %s" % [quests.st("main2"), mora, _ok(quests.st("main2") == "done")])
	# --- feux de vigie
	await _talk_now("h_scout")
	for b in beacons:
		party.global_position = (b.node as Node3D).position + Vector3(0.9, 0.2, 0);party.velocity = Vector3.ZERO
		await get_tree().physics_frame
		interact_target = _find_interaction()
		print("  beacon %d at %s kind=%s" % [b.i, (b.node as Node3D).position, interact_target.get("kind", "")])
		interact()
	await _talk_now("h_scout")
	print("V8TEST vigie lit=%d state=%s -> %s" % [beacons.filter( func(b): return b.lit).size(), quests.st("q_vent_vigie"), _ok(quests.st("q_vent_vigie") == "done")])
	# --- courant ascendant
	var u: Vector3 = world.updraft_spots[0]
	party.global_position = u + Vector3(0, 8, 0);party.velocity = Vector3.ZERO
	await _wait(0.3)
	party.air_t = 0.5;party.start_glide()
	var y0: = party.global_position.y
	await _wait(1.5)
	print("V8TEST updraft dy=%.1f -> %s" % [party.global_position.y - y0, _ok(party.global_position.y - y0 > 3.0)])
	party.stop_glide()
	# --- sauvegarde v5
	var bak: = ""
	if FileAccess.file_exists(SAVE_PATH): bak = FileAccess.get_file_as_string(SAVE_PATH)
	allow_save_in_test = true
	var inv0: = inv.duplicate();var mora0: = mora;var rec0: = recipes_known.size()
	save_game()
	inv = {};mora = 0;recipes_known = {}
	var loaded: = load_game()
	print("V8TEST save_load ok=%s inv_same=%s mora=%d recipes=%d quests_done=%s -> %s" % [loaded, inv == inv0, mora, recipes_known.size(), quests.st("q_jonc_carnet"), 
		_ok(loaded and inv == inv0 and mora == mora0 and recipes_known.size() == rec0 and quests.st("q_jonc_carnet") == "done")])
	if bak != "":
		var f: = FileAccess.open(SAVE_PATH, FileAccess.WRITE);f.store_string(bak);f.close()
	else:
		DirAccess.remove_absolute(ProjectSettings.globalize_path(SAVE_PATH))
	allow_save_in_test = false

func _v8_shots() -> void :
	party.test_invuln = true
	for vv0 in world.villages: seen_cines["village_" + String(vv0.id)] = true
	add_item("tarte", 3);add_item("omelette", 2);add_item("jus", 4);add_item("gateau", 1);add_item("brochette_ardente", 2)
	add_item("pomme", 7);add_item("soleillette", 5);add_item("viande", 4);add_item("sel", 3);add_item("menthe", 6)
	learn_recipe("omelette", false);learn_recipe("gateau", false)
	# villages
	for vv in world.villages:
		var c: Vector3 = vv.pos
		var e: float = vv.entry
		var fwd: = Vector3(sin(e), 0, cos(e))
		_place(world.snap(c + fwd * 24.0, 0.4), c, 9.0, -0.28)
		await _wait(1.2)
		await snap("v8_village_%s" % vv.id)
	# marché et marmite (Joncbourg)
	var jc: Vector3 = npc_pos("j_cook")
	_place(world.snap(jc + Vector3(3.0, 0, 3.0), 0.4), jc, 6.0, -0.25)
	await _wait(0.8)
	await snap("v8_etal_marmite")
	# boutique et cuisine
	ui.show_overlay(ui.shop_menu, true, "jonc_epicerie")
	await _wait(0.5)
	await snap("v8_boutique")
	ui.show_overlay(ui.shop_menu, false)
	ui.show_overlay(ui.cook_menu, true)
	await _wait(0.3)
	ui.cook_menu._pick("tarte")
	await _wait(0.2)
	await snap("v8_cuisine")
	add_item("farine", 2);add_item("beurre", 1);add_item("sucre", 1)
	ui.cook_menu._pick("tarte");ui.cook_menu._start_cook()
	await _wait(0.9)
	await snap("v8_cuisson")
	ui.cook_menu.game.stop()
	await _wait(1.2)
	ui.show_overlay(ui.cook_menu, false)
	# sac à provisions et inventaire
	ui.toggle_foodbag()
	await _wait(0.4)
	await snap("v8_sac_provisions")
	ui.toggle_foodbag()
	toggle_pause()
	await _wait(0.2)
	ui.open_sub("bag")
	await _wait(0.4)
	await snap("v8_inventaire")
	ui.bag_menu.tabs.select(1)
	await _wait(0.3)
	await snap("v8_inventaire_ingredients")
	ui.close_sub();toggle_pause()
	# vision élémentaire près du verger
	_place(world.snap(world.orchard + Vector3(0, 0, 12), 0.4), world.orchard, 7.0, -0.25)
	await _wait(0.6)
	ui.set_sight(true)
	await _wait(1.0)
	await snap("v8_vision")
	ui.set_sight(false)
	await _wait(0.5)
	# techniques multicolores
	var camp: Vector3 = camps[1].center
	_place(_near(camp, 8.0), camp, 6.5, -0.25)
	await _wait(0.6)
	for k in 4:
		party.switch_cd = 0.0;party.switch_to(k)
		await _wait(1.1)
		party.ch().skill_cd = 0.0
		party.do_skill()
		await _wait(0.5)
		await snap("v8_competence_%d" % k)
		party.ch().energy = party.ch().energy_max;party.ch().burst_cd = 0.0
		await _wait(1.0)
		party.do_burst()
		await _wait(1.25)
		await snap("v8_dechainement_%d" % k)
		await _wait(1.5)
	# cinématiques
	allow_cine_in_test = true
	cine.play(CineScenes.build("village_forge", self))
	await _wait(2.2)
	await snap("v8_cine_village")
	while cine.running: await _wait(0.2)
	cine.play(CineScenes.build("prologue", self))
	await _wait(11.0)
	await snap("v8_cine_prologue")
	cine.skip()
	while cine.running: await _wait(0.2)
	cine.play(CineScenes.build("forge_rekindle", self))
	await _wait(3.4)
	await snap("v8_cine_forge")
	while cine.running: await _wait(0.2)
