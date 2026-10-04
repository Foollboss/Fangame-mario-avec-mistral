class_name Dungeon
extends Node3D







const DEFS: = {
	"masques": {"name": "Repaire des Masques", "hour": 18.7, "lvl": 12, "x": 2000.0, "style": "brazier", 
		"floor": Color(0.4, 0.31, 0.22), "carpet": Color(0.55, 0.22, 0.16), "wall": Color(0.5, 0.42, 0.33), 
		"trim": Color(0.36, 0.24, 0.14), "accent": Color(1.0, 0.6, 0.28), 
		"waves": [[["goblin", ""], ["goblin", ""], ["archer", ""]], [["goblin", ""], ["goblin", ""], ["archer", ""], ["slime", "pyro"]]], 
		"guards": [["goblin", ""], ["archer", ""], ["goblin", ""]], 
		"totems": [["pyro", "lava"], ["pyro", "lava"], ["pyro", "lava"]], 
		"puzzle": "Rallume les 3 braseros (Feu ou Lave)", 
		"boss": ["boss_goblin", "", "Seigneur des Masques"]}, 
	"forge": {"name": "Forge d'Ignis", "hour": 21.6, "lvl": 22, "x": 2400.0, "style": "totem", 
		"floor": Color(0.2, 0.17, 0.17), "carpet": Color(0.32, 0.14, 0.1), "wall": Color(0.26, 0.22, 0.22), 
		"trim": Color(0.55, 0.22, 0.1), "accent": Color(1.0, 0.42, 0.12), 
		"waves": [[["slime", "lava"], ["slime", "lava"], ["wisp", "pyro"]], [["golem", "lava"], ["slime", "pyro"], ["slime", "pyro"]]], 
		"guards": [["wisp", "pyro"], ["slime", "lava"], ["wisp", "lava"]], 
		"totems": [["hydro"], ["hydro"], ["hydro"]], 
		"puzzle": "Refroidis les 3 conduits de lave (Hydro)", 
		"boss": ["boss_magma", "pyro", "Gardien de la Forge"]}, 
	"celeste": {"name": "Sanctuaire Céleste", "hour": 6.7, "lvl": 30, "x": 2800.0, "style": "totem", 
		"floor": Color(0.6, 0.64, 0.74), "carpet": Color(0.24, 0.33, 0.6), "wall": Color(0.68, 0.7, 0.8), 
		"trim": Color(0.85, 0.68, 0.3), "accent": Color(0.55, 0.78, 1.0), 
		"waves": [[["wisp", "electro"], ["wisp", "cryo"], ["slime", "cryo"]], [["golem", "cryo"], ["wisp", "electro"], ["archer", ""], ["slime", "electro"]]], 
		"guards": [["golem", "electro"], ["wisp", "cryo"]], 
		"totems": [["electro"], ["hydro"], ["electro"]], 
		"puzzle": "Éveille les pylônes : Électro, Hydro, Électro", 
		"boss": ["boss_storm", "cryo", "Gardien Céleste"]}, 
}

const ROOMS: = [[0.0, 16.0], [40.0, 16.0], [84.0, 20.0]]
const GATE_Z: = [16.0, 56.0]
const CORRIDOR: = 8.0
const OPEN_W: = 7.0
const WALL_H: = 7.0
const WALL_T: = 1.5

var main: Node
var id: = ""
var def: Dictionary
var hour: = 12.0
var body: StaticBody3D
var gates: Array = []
var mobs: Array = []
var wave: = 0
var state: = "waves"
var wave_t: = 1.2
var guards_spawned: = false
var totems: Array = []
var lit_count: = 0
var boss: Enemy
var chest: Dictionary = {}
var exit_portal: Node3D
var _mat_cache: = {}

func setup(m: Node, domain_id: String) -> void :
	main = m;id = domain_id;def = DEFS[id]
	hour = def.hour
	position = Vector3(def.x, 0.0, 0.0)
	body = StaticBody3D.new();body.collision_layer = 1;body.collision_mask = 0;add_child(body)
	_build()

func entry_pos() -> Vector3:
	return to_global(Vector3(0, 0.6, -5.0))

func lvl_mult() -> float:
	return 1.0 + (float(def.lvl) - 2.0) / 25.714


func _mat(col: Color, emit: = 0.0) -> StandardMaterial3D:
	var key: = "%s_%s" % [col.to_html(), emit]
	if _mat_cache.has(key): return _mat_cache[key]
	var m: = Toon.material(col)
	if emit > 0.0:
		m.emission_enabled = true;m.emission = col;m.emission_energy_multiplier = emit
	_mat_cache[key] = m
	return m

func _box(center: Vector3, size: Vector3, col: Color, collide: = true, emit: = 0.0) -> MeshInstance3D:
	var mi: = MeshInstance3D.new(); var bm: = BoxMesh.new();bm.size = size;mi.mesh = bm
	mi.material_override = _mat(col, emit);mi.position = center
	add_child(mi)
	if collide:
		var cs: = CollisionShape3D.new(); var bs: = BoxShape3D.new();bs.size = size
		cs.shape = bs;cs.position = center;body.add_child(cs)
	return mi

func _wall_x(z: float, x0: float, x1: float) -> void :
	if x1 - x0 < 0.1: return
	_box(Vector3((x0 + x1) * 0.5, WALL_H * 0.5, z), Vector3(x1 - x0, WALL_H, WALL_T), def.wall)
	_box(Vector3((x0 + x1) * 0.5, WALL_H + 0.25, z), Vector3(x1 - x0 + 0.3, 0.5, WALL_T + 0.4), def.trim, false)

func _wall_z(x: float, z0: float, z1: float) -> void :
	if z1 - z0 < 0.1: return
	_box(Vector3(x, WALL_H * 0.5, (z0 + z1) * 0.5), Vector3(WALL_T, WALL_H, z1 - z0), def.wall)
	_box(Vector3(x, WALL_H + 0.25, (z0 + z1) * 0.5), Vector3(WALL_T + 0.4, 0.5, z1 - z0 + 0.3), def.trim, false)

func _build() -> void :
	var w: World = main.world
	var last: Array = ROOMS[ROOMS.size() - 1]

	var z_min: float = - ROOMS[0][1] - 1.0
	var z_max: float = last[0] + last[1] + 1.0
	_box(Vector3(0, -1.0, (z_min + z_max) * 0.5), Vector3(46.0, 2.0, z_max - z_min), def.floor)
	for i in ROOMS.size():
		var zc: float = ROOMS[i][0]; var hs: float = ROOMS[i][1]

		_box(Vector3(0, 0.02, zc), Vector3(hs * 1.1, 0.05, hs * 1.1), def.carpet, false)
		var ring: = MeshInstance3D.new(); var tm: = TorusMesh.new();tm.inner_radius = hs * 0.43;tm.outer_radius = hs * 0.45;tm.rings = 48;tm.ring_segments = 4
		ring.mesh = tm;ring.material_override = _mat(def.accent.darkened(0.25), 0.55);ring.position = Vector3(0, 0.06, zc);ring.scale = Vector3(1, 0.08, 1)
		add_child(ring)

		_wall_z( - hs - WALL_T * 0.5, zc - hs - WALL_T, zc + hs + WALL_T)
		_wall_z(hs + WALL_T * 0.5, zc - hs - WALL_T, zc + hs + WALL_T)

		var zb: = zc - hs - WALL_T * 0.5
		var zf: = zc + hs + WALL_T * 0.5
		if i == 0:
			_wall_x(zb, - hs - WALL_T, hs + WALL_T)
		else:
			_wall_x(zb, - hs - WALL_T, - OPEN_W * 0.5);_wall_x(zb, OPEN_W * 0.5, hs + WALL_T)
		if i == ROOMS.size() - 1:
			_wall_x(zf, - hs - WALL_T, hs + WALL_T)
		else:
			_wall_x(zf, - hs - WALL_T, - OPEN_W * 0.5);_wall_x(zf, OPEN_W * 0.5, hs + WALL_T)

			var cz0: = zc + hs + WALL_T
			var cz1: float = ROOMS[i + 1][0] - ROOMS[i + 1][1] - WALL_T
			_wall_z( - OPEN_W * 0.5 - WALL_T * 0.5, cz0, cz1);_wall_z(OPEN_W * 0.5 + WALL_T * 0.5, cz0, cz1)
			_box(Vector3(0, 0.03, (cz0 + cz1) * 0.5), Vector3(OPEN_W, 0.05, cz1 - cz0), def.carpet, false)

			var g: = _box(Vector3(0, WALL_H * 0.5, zf), Vector3(OPEN_W + 0.2, WALL_H, WALL_T * 0.8), def.trim)
			var gs: CollisionShape3D = body.get_child(body.get_child_count() - 1)
			var rune: = MeshInstance3D.new(); var qm: = QuadMesh.new();qm.size = Vector2(3.0, 3.0);rune.mesh = qm
			rune.material_override = _mat(def.accent, 2.0);rune.position = Vector3(0, 0.6, - WALL_T * 0.42);rune.rotation.y = PI
			g.add_child(rune)
			gates.append({"node": g, "shape": gs, "open": false})

		for k in 3:
			var z: = zc - hs * 0.6 + k * hs * 0.6
			for sx in [-1.0, 1.0]:
				var p: = Vector3(sx * (hs - 1.2), 0, z)
				var pil: = w.make_prop("Pillar");add_child(pil);pil.position = p;pil.scale = Vector3.ONE * 1.25
				var cs: = CollisionShape3D.new(); var cy: = CylinderShape3D.new();cy.radius = 0.6;cy.height = 6.0
				cs.shape = cy;cs.position = p + Vector3(0, 3.0, 0);body.add_child(cs)
		for k in 4:
			var a: = TAU * k / 4.0 + PI * 0.25
			var tp: = Vector3(cos(a) * hs * 0.82, 0, zc + sin(a) * hs * 0.82)
			var torch: = w.make_prop("Torch");add_child(torch);torch.position = tp;torch.scale = Vector3.ONE * 1.4
			if k % 2 == 0:
				var l: = OmniLight3D.new();l.light_color = def.accent.lerp(Color(1.0, 0.7, 0.4), 0.5);l.light_energy = 1.6
				l.omni_range = hs * 1.3;l.position = tp + Vector3(0, 3.0, 0);l.shadow_enabled = false;add_child(l)
	_theme_props()

	_portal(Vector3(0, 0, - ROOMS[0][1] + 2.2), "leave")

func _theme_props() -> void :
	var w: World = main.world
	match id:
		"masques":
			for p in [Vector3(-11, 0, -11), Vector3(11, 0, -11), Vector3(-11, 0, 51), Vector3(11, 0, 51)]:
				var t: = w.make_prop("Tent");add_child(t);t.position = p;t.rotation.y = randf() * TAU
			for p in [Vector3(-12, 0, 6), Vector3(12, 0, 30), Vector3(-12, 0, 74), Vector3(12, 0, 96)]:
				var b: = w.make_prop("Banner", def.accent.darkened(0.2));add_child(b);b.position = p
			for p in [Vector3(8, 0, -13), Vector3(-6, 0, 28), Vector3(14, 0, 70)]:
				var c: = w.make_prop("Crate");add_child(c);c.position = p
				var br: = w.make_prop("Barrel");add_child(br);br.position = p + Vector3(1.2, 0, 0.4)
		"forge":
			for z in [0.0, 40.0, 84.0]:
				for sx in [-1.0, 1.0]:
					var hs: float = 16.0 if z < 80.0 else 20.0
					var strip: = MeshInstance3D.new(); var bm: = BoxMesh.new();bm.size = Vector3(1.6, 0.1, hs * 1.6)
					strip.mesh = bm
					var lm: = ShaderMaterial.new();lm.shader = load("res://shaders/lava_flow.gdshader")
					strip.material_override = lm;strip.position = Vector3(sx * (hs - 3.0), 0.04, z)
					add_child(strip)
			for p in [Vector3(-10, 0, -9), Vector3(10, 0, 9), Vector3(-12, 0, 76), Vector3(12, 0, 92)]:
				var v: = w.make_prop("Vent");add_child(v);v.position = p;v.scale = Vector3.ONE * 1.3
			for p in [Vector3(9, 0, -12), Vector3(-9, 0, 52), Vector3(15, 0, 100), Vector3(-15, 0, 68)]:
				var o: = w.make_prop("Obsidian");add_child(o);o.position = p;o.scale = Vector3.ONE * 1.4
		"celeste":
			for p in [Vector3(-12, 0, -12), Vector3(12, 0, 12), Vector3(-13, 0, 28), Vector3(13, 0, 52), Vector3(-16, 0, 100), Vector3(16, 0, 68)]:
				var c: = w.make_prop("CrystalSpire", Color(0.85, 0.88, 0.98));add_child(c);c.position = p;c.rotation.y = randf() * TAU
			for p in [Vector3(-12, 0, 2), Vector3(12, 0, 40), Vector3(-15, 0, 84), Vector3(15, 0, 84)]:
				var b: = w.make_prop("Banner", def.accent.darkened(0.15));add_child(b);b.position = p

			for k in 8:
				var a: = TAU * k / 8.0
				var fi: = w.make_prop("FloatIsland");add_child(fi)
				fi.position = Vector3(cos(a) * 70.0, 18.0 + 10.0 * sin(k * 1.7), 40.0 + sin(a) * 80.0)
				fi.scale = Vector3.ONE * (8.0 + 4.0 * fmod(k * 0.37, 1.0))

func _portal(local: Vector3, kind: String) -> Node3D:
	var w: World = main.world
	var n: = Node3D.new();add_child(n);n.position = local
	var gate: = w.make_prop("PortalGate");n.add_child(gate);gate.scale = Vector3.ONE * 0.75
	var disc: = MeshInstance3D.new(); var qm: = QuadMesh.new();qm.size = Vector2(2.8, 2.8);disc.mesh = qm
	var pm: = ShaderMaterial.new();pm.shader = load("res://shaders/portal.gdshader")
	pm.set_shader_parameter("tint", Color(0.5, 0.85, 1.0) if kind == "leave" else Color(1.0, 0.85, 0.45))
	disc.material_override = pm;disc.position = Vector3(0, 2.7, 0);disc.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	n.add_child(disc)
	n.set_meta("portal", kind)
	return n


func _spawn(kind: String, elem: String, local: Vector3, mult: = 1.0, bname: = "") -> Enemy:
	var e: = Enemy.new()
	e.party = main.party;e.main = main;e.boss_name = bname
	add_child(e)
	e.setup(kind, elem, to_global(local), lvl_mult() * mult)
	e.global_position = to_global(local) + Vector3(0, 0.3, 0)
	e.died.connect(main._on_enemy_died)
	e.alerted = true
	mobs.append(e)
	FX.column(e.global_position, FX.element_color(elem) if elem != "" else Color(0.9, 0.8, 0.6), 0.8, 3.0, 0.8)
	return e


func adopt(e: Enemy) -> void :
	if e.get_parent() != self: e.reparent(self)
	mobs.append(e)

func _alive_mobs() -> int:
	var n: = 0
	for m in mobs:
		if is_instance_valid(m) and m.alive and not m.is_boss: n += 1
	return n

func on_enemy_died(_e: Enemy) -> void :
	pass

func _spawn_wave(list: Array, zc: float, hs: float) -> void :
	for k in list.size():
		var a: = TAU * k / list.size() + 0.4
		_spawn(list[k][0], list[k][1], Vector3(cos(a) * hs * 0.45, 0, zc + 4.0 + sin(a) * hs * 0.35))

func _open_gate(i: int) -> void :
	var g: Dictionary = gates[i]
	if g.open: return
	g.open = true
	(g.shape as CollisionShape3D).set_deferred("disabled", true)
	var n: Node3D = g.node
	n.create_tween().tween_property(n, "position:y", - WALL_H * 0.5 - 0.2, 1.6).set_trans(Tween.TRANS_QUAD)
	main.shake(0.25);main.audio.play("waypoint", -4.0)
	main.ui.message("Une porte s'ouvre…", 1.8, Color(1.0, 0.9, 0.6))


func tick(delta: float) -> void :
	var lp: = to_local(main.party.global_position)
	match state:
		"waves":
			if _alive_mobs() == 0:
				wave_t -= delta
				if wave_t <= 0.0:
					if wave < def.waves.size():
						_spawn_wave(def.waves[wave], ROOMS[0][0], ROOMS[0][1])
						wave += 1
						wave_t = 1.6
					else:
						_open_gate(0)
						state = "puzzle"
						for i in def.totems.size():
							var t: = Totem.new()
							add_child(t)
							t.setup_totem(main.world, def.totems[i], def.style)
							var a: float = PI * 0.5 + (i - 1) * 1.1
							t.global_position = to_global(Vector3(cos(a) * 9.0, 0, ROOMS[1][0] + sin(a) * 9.0 - 2.0))
							t.main = main
							t.lit.connect(_on_totem_lit)
							totems.append(t)
		"puzzle":
			if not guards_spawned and lp.z > ROOMS[1][0] - ROOMS[1][1] + 3.0:
				guards_spawned = true
				_spawn_wave(def.guards, ROOMS[1][0], ROOMS[1][1])
			if lit_count >= totems.size() and guards_spawned and _alive_mobs() == 0:
				_open_gate(1)
				state = "boss_wait"
		"boss_wait":
			if lp.z > ROOMS[2][0] - ROOMS[2][1] + 4.0:
				state = "boss"
				var b: Array = def.boss
				boss = _spawn(b[0], b[1], Vector3(0, 0, ROOMS[2][0] + 6.0), 1.0, b[2])
				boss.home = boss.global_position
				boss.alerted = true
				main.ui.show_banner(b[2], Color(1.0, 0.7, 0.55))
				main.audio.music("combat")
		"boss":
			if not is_instance_valid(boss) or not boss.alive:
				state = "done"
				_finish()

func _on_totem_lit(_t: Totem) -> void :
	lit_count += 1
	main.ui.message("%s  %d / %d" % [def.puzzle.split(" (")[0], lit_count, totems.size()], 1.6, Color(1.0, 0.9, 0.6))
	main.audio.play("waypoint", -6.0)

func _finish() -> void :

	var zc: float = ROOMS[2][0]
	var cpos: = to_global(Vector3(0, 0, zc + 8.0))
	var node: Node3D = main._make_chest(cpos, PI)
	node.reparent(self)
	chest = {"node": node, "lid": node.get_meta("lid"), "opened": false}
	FX.column(cpos, Color(1, 0.85, 0.4), 0.8, 4.0, 1.2)
	exit_portal = _portal(Vector3(0, 0, zc + 15.0), "exit")
	for m in mobs:
		if is_instance_valid(m) and m.alive: m.take_hit(10000000.0, "", Vector3.INF)
	main.on_domain_cleared(id)

func objective() -> String:
	match state:
		"waves": return "Vaincs les monstres (vague %d / %d)" % [maxi(1, wave), def.waves.size()]
		"puzzle":
			if lit_count < totems.size(): return "%s  %d / %d" % [def.puzzle, lit_count, totems.size()]
			return "Vaincs les gardiens"
		"boss_wait", "boss": return "Vaincs : %s" % def.boss[2]
		"done": return "Ouvre le coffre, puis sors par le portail" if not chest.get("opened", false) else "Sors par le portail doré"
	return ""


func find_interaction(p: Vector3) -> Dictionary:
	if not chest.is_empty() and not chest.opened and (chest.node as Node3D).global_position.distance_to(p) < 2.6:
		return {"kind": "dungeon", "what": "le coffre du domaine", "verb": "Ouvrir", "action": "chest"}
	for n in get_children():
		if n is Node3D and n.has_meta("portal") and (n as Node3D).global_position.distance_to(p) < 3.2:
			var k: String = n.get_meta("portal")
			return {"kind": "dungeon", "verb": "Quitter", "what": "le domaine", "action": k}
	return {}

func interact(t: Dictionary) -> void :
	match String(t.get("action", "")):
		"chest":
			if chest.opened: return
			chest.opened = true
			var lid: Node3D = chest.lid
			lid.create_tween().tween_property(lid, "rotation:x", -1.9, 0.5).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
			var first: = int(main.domain_clears.get(id, 0)) <= 1
			var gain: = int((80 if first else 30) * (1.0 + (float(def.lvl) - 12.0) / 20.0))
			main.add_shards(gain)
			main.add_food(1 if not first else 2)
			main.audio.play("chest")
			FX.particles((chest.node as Node3D).global_position + Vector3(0, 0.9, 0), Color(1, 0.88, 0.45), 40, 5.0, 1.0, 0.1, -4.0)
		"leave":
			main.leave_domain(false)
		"exit":
			main.leave_domain(true)
