class_name Enemy
extends CharacterBody3D






signal died(enemy: Enemy)

const GRAV: = 22.0
const ELEM_COLORS: = {"hydro": Color(0.35, 0.72, 1.0), "electro": Color(0.72, 0.5, 1.0), "pyro": Color(1.0, 0.5, 0.25), 
	"cryo": Color(0.72, 0.93, 1.0), "lava": Color(1.0, 0.32, 0.08), "": Color(0.7, 0.7, 0.7)}
const SLIME_COLORS: = ELEM_COLORS

var kind: = "slime"
var element: = "hydro"
var max_hp: = 220.0
var hp: = 220.0
var alive: = true
var hit_radius: = 0.55
var damage: = 55.0
var speed: = 3.2
var aggro: = 15.0
var leash: = 34.0
var level_mult: = 1.0
var party: Node3D
var main: Node
var camp: = -1
var pack: = -1
var home: = Vector3.ZERO
var is_object: = false
var boss_name: = ""

var auras: = {}
var ec_ticks: = 0
var ec_timer: = 0.0
var ec_power: = 20.0
var stun: = 0.0
var frozen: = 0.0
var vulnerable: = 0.0
var res_down: = 0.0
var burn_t: = 0.0
var burn_dps: = 0.0
var burn_tick: = 0.0
var push: = Vector3.ZERO
var atk_cd: = 1.5
var windup: = 0.0
var hop_t: = 0.0
var model: Node3D
var parts: = {}
var flash_t: = 0.0
var alerted: = false
var wander_t: = 0.0
var wander_to: = Vector3.ZERO
var walk_phase: = 0.0
var ice_block: MeshInstance3D
var cc_immune: = 0.0
var engage: = 15.0
var summons_done: = 0
var sleeping: = false
var _t: = 0.0

var is_boss: = false
var bcd: = {}
var enraged: = false
var leap_t: = 0.0
var leap_to: = Vector3.ZERO
var leap_vel: = Vector3.ZERO
var combo_left: = 0
var hover_y: = 0.4


func setup(k: String, elem: String, pos: Vector3, lvl: = 1.0) -> void :
	kind = k;element = elem;home = pos;level_mult = lvl
	add_to_group("enemies")
	collision_layer = 4
	collision_mask = 1
	var col: = CollisionShape3D.new()
	is_boss = kind == "boss" or kind.begins_with("boss_")
	match kind:
		"golem", "boss", "boss_magma":
			_build_golem(col)
		"goblin", "archer", "boss_goblin":
			_build_goblin(col)
		"wisp", "boss_storm":
			_build_wisp(col)
		_:
			_build_slime(col)
	if is_boss:
		aggro = maxf(aggro, 26.0);leash = maxf(leash, 55.0)
		bcd = {"a": 3.0, "b": 6.0, "c": 9.0, "d": 12.0}
	max_hp *= level_mult;damage *= lerpf(1.0, level_mult, 0.7)
	hp = max_hp
	add_child(col)
	add_child(model)
	atk_cd = randf_range(0.8, 2.0)

func _build_slime(col: CollisionShape3D) -> void :
	var big: = kind == "slime_big"
	var king: = kind == "boss_slime"
	max_hp = 900.0 if big else 220.0
	damage = 90.0 if big else 55.0
	speed = 2.6 if big else 3.2
	hit_radius = 1.0 if big else 0.55
	var sph: = SphereShape3D.new();sph.radius = 0.85 if big else 0.45;col.shape = sph;col.position.y = 0.8 if big else 0.42
	if king:
		max_hp = 8200.0;damage = 140.0;speed = 2.4;hit_radius = 2.5
		sph.radius = 2.0;col.position.y = 1.9
		if boss_name == "": boss_name = "Roi Slime des Marais"
	model = load("res://assets/slime.glb").instantiate()
	Toon.apply(model, true, false, 0.012)
	var body_col: Color = ELEM_COLORS.get(element, Color.WHITE)
	for mi in model.find_children("*", "MeshInstance3D", true, false):
		for s in mi.mesh.get_surface_count():
			var m: StandardMaterial3D = mi.get_surface_override_material(s)
			if m and m.albedo_color.v > 0.8 and not m.emission_enabled:
				m.albedo_color = body_col
				m.emission_enabled = true;m.emission = body_col * 0.35;m.emission_energy_multiplier = 1.0
	if big:
		model.scale = Vector3.ONE * 1.9
	if king:
		model.scale = Vector3.ONE * 4.6
		if main and main.world:
			var crown: MeshInstance3D = main.world.make_prop("Crown")
			model.add_child(crown);crown.position = Vector3(0, 0.86, 0);crown.scale = Vector3.ONE * 0.36;crown.rotation.x = 0.12
	auras[element] = INF

func _build_golem(col: CollisionShape3D) -> void :
	var boss: = kind == "boss"
	var magma: = kind == "boss_magma"
	max_hp = 7000.0 if boss else (9000.0 if magma else 1800.0)
	damage = 170.0 if boss or magma else 150.0
	speed = 2.4 if boss or magma else 2.0
	hit_radius = 2.0 if boss else (2.3 if magma else 1.2)
	aggro = 26.0 if boss or magma else 18.0
	leash = 60.0 if boss or magma else 34.0
	var s: = 1.75 if boss else (2.0 if magma else 1.0)
	var cap: = CapsuleShape3D.new();cap.radius = 0.9 * s;cap.height = 2.6 * s;col.shape = cap;col.position.y = 1.3 * s
	var src: Node3D = load("res://assets/golem.glb").instantiate()
	model = Node3D.new()
	for c in src.get_children():
		var n: Node3D = c.duplicate()
		model.add_child(n);parts[c.name] = n
	src.free()
	Toon.apply(model, true, false, 0.02)
	if boss:
		element = "cryo";auras["cryo"] = INF
		boss_name = "Gardien Givré"
		model.scale = Vector3.ONE * s
		_tint_golem(Color(0.6, 0.9, 1.0), Color(0.4, 0.6, 0.92), 0.7)
	elif magma or element != "":

		if element == "": element = "lava"
		auras[element] = INF
		model.scale = Vector3.ONE * s
		if magma:
			if boss_name == "": boss_name = "Colosse de Magma"
			var lt: = OmniLight3D.new();lt.light_color = Color(1.0, 0.45, 0.15);lt.light_energy = 1.4;lt.omni_range = 10.0
			lt.position = Vector3(0, 3.2, 1.2);lt.shadow_enabled = false
			add_child(lt)
		match element:
			"lava":
				if magma: _tint_golem(Color(1.0, 0.42, 0.08), Color(0.21, 0.14, 0.12), 0.93)
				else: _tint_golem(Color(1.0, 0.42, 0.08), Color(0.22, 0.17, 0.16), 0.85)
			"pyro": _tint_golem(Color(1.0, 0.62, 0.2), Color(0.55, 0.22, 0.14), 0.7)
			"electro": _tint_golem(Color(0.75, 0.5, 1.0), Color(0.36, 0.34, 0.46), 0.75)
			"hydro": _tint_golem(Color(0.35, 0.75, 1.0), Color(0.22, 0.42, 0.5), 0.7)
			"cryo": _tint_golem(Color(0.6, 0.9, 1.0), Color(0.55, 0.7, 0.9), 0.7)
	else:
		element = ""

func _tint_golem(glow: Color, stone: Color, k: float) -> void :
	for mi in model.find_children("*", "MeshInstance3D", true, false):
		for i in mi.mesh.get_surface_count():
			var m: StandardMaterial3D = mi.get_surface_override_material(i)
			if m == null: continue
			if m.emission_enabled:
				m.emission = glow;m.albedo_color = glow.lightened(0.2);m.emission_energy_multiplier = maxf(m.emission_energy_multiplier, 1.6)
			else:
				m.albedo_color = m.albedo_color.lerp(stone, k)

func _build_goblin(col: CollisionShape3D) -> void :
	var archer: = kind == "archer"
	var chief: = kind == "boss_goblin"
	max_hp = 240.0 if archer else 320.0
	damage = 45.0 if archer else 70.0
	speed = 3.3 if archer else 3.6
	hit_radius = 0.55
	aggro = 20.0 if archer else 16.0
	element = ""
	var gs: = 2.3 if chief else 1.0
	if chief:
		max_hp = 7000.0;damage = 120.0;speed = 3.5;hit_radius = 1.3
		if boss_name == "": boss_name = "Seigneur des Masques"
	var cap: = CapsuleShape3D.new();cap.radius = 0.38 * gs;cap.height = 1.4 * gs;col.shape = cap;col.position.y = 0.7 * gs
	var src: Node3D = load("res://assets/goblin.glb").instantiate()
	model = Node3D.new()
	for c in src.get_children():
		if c.name == "Arrow": continue
		var n: Node3D = c.duplicate()
		model.add_child(n);parts[c.name] = n
	src.free()
	Toon.apply(model, false, false, 0.012)

	var club: Node3D = parts["GobClub"]; var bow: Node3D = parts["GobBow"]
	if archer:
		club.queue_free();parts.erase("GobClub")
		model.remove_child(bow);parts["GobArmL"].add_child(bow)
		bow.position = Vector3(0, -0.52, 0.05);bow.rotation = Vector3(0, PI * 0.5, 0)
	else:
		bow.queue_free();parts.erase("GobBow")
		model.remove_child(club);parts["GobArmR"].add_child(club)
		club.position = Vector3(0, -0.52, 0.05);club.rotation = Vector3(PI * 0.5, 0, 0)

	var mask_tint: Color = [Color(0.95, 0.93, 0.86), Color(0.85, 0.95, 0.75), Color(0.95, 0.8, 0.7)][randi() % 3]
	if chief:
		mask_tint = Color(1.0, 0.78, 0.3)
		model.scale = Vector3.ONE * gs
		(parts["GobClub"] as Node3D).scale = Vector3.ONE * 1.35
	var head: MeshInstance3D = parts["GobHead"]
	for k in head.mesh.get_surface_count():
		var m: StandardMaterial3D = head.get_surface_override_material(k)
		if m and m.albedo_color.v > 0.8: m.albedo_color = mask_tint

func _build_wisp(col: CollisionShape3D) -> void :
	max_hp = 280.0;damage = 50.0;speed = 2.8;hit_radius = 0.7;aggro = 18.0
	var storm: = kind == "boss_storm"
	var sph: = SphereShape3D.new();sph.radius = 0.5;col.shape = sph;col.position.y = 2.0
	if storm:
		max_hp = 10000.0;damage = 140.0;speed = 3.4;hit_radius = 2.3;hover_y = 0.6
		sph.radius = 1.5;col.position.y = 3.0
		if boss_name == "": boss_name = "Tempestaire" if element == "electro" else "Gardien Céleste"
	var src: Node3D = load("res://assets/wisp.glb").instantiate()
	model = Node3D.new()
	var c: Color = ELEM_COLORS.get(element, Color.WHITE)
	for ch in src.get_children():
		var n: MeshInstance3D = ch.duplicate()
		model.add_child(n);parts[ch.name] = n
		n.position = Vector3(0, 2.0, 0)
		var m: = StandardMaterial3D.new()
		m.albedo_color = c
		m.emission_enabled = true;m.emission = c
		m.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED if ch.name != "WispShell" else BaseMaterial3D.SHADING_MODE_PER_PIXEL
		m.emission_energy_multiplier = {"WispCore": 3.0, "WispRing": 1.6, "WispShell": 0.5}.get(String(ch.name), 1.0)
		if ch.name == "WispShell":
			m.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA;m.albedo_color.a = 0.45
			m.diffuse_mode = BaseMaterial3D.DIFFUSE_TOON
		n.material_override = m
		n.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	src.free()
	if storm:
		model.scale = Vector3.ONE * 4.0;model.position.y = -5.0

		var ring2: MeshInstance3D = parts["WispRing"].duplicate()
		model.add_child(ring2);parts["WispRing2"] = ring2
		var orbit: = Node3D.new();orbit.position = Vector3(0, 2.0, 0)
		model.add_child(orbit);parts["Orbit"] = orbit
		var sm: = StandardMaterial3D.new()
		sm.albedo_color = c.lightened(0.4);sm.emission_enabled = true;sm.emission = c;sm.emission_energy_multiplier = 1.5
		sm.roughness = 0.2
		var shard: = SphereMesh.new();shard.radial_segments = 4;shard.rings = 1;shard.radius = 0.5;shard.height = 1.0
		for k in 4:
			var mi: = MeshInstance3D.new();mi.mesh = shard;mi.material_override = sm
			var a: = TAU * k / 4.0
			mi.position = Vector3(cos(a), 0.12 * (1.0 if k % 2 == 0 else -1.0), sin(a)) * 0.82
			mi.scale = Vector3(0.11, 0.34, 0.11)
			mi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
			orbit.add_child(mi)
		var lt: = OmniLight3D.new();lt.light_color = c;lt.light_energy = 1.6;lt.omni_range = 11.0
		lt.position = Vector3(0, 3.0, 0);lt.shadow_enabled = false
		add_child(lt)
	auras[element] = INF


func bar_height() -> float:
	match kind:
		"golem": return 3.2
		"slime_big": return 2.1
		"goblin", "archer": return 1.85
		"wisp": return 2.9
	return 1.15


func level() -> int:
	return clampi(int(round(2.0 + (level_mult - 1.0) / 0.7 * 18.0)), 1, 30)

func has_aura(e: String) -> bool:
	return auras.has(e) and auras[e] > 0.0

func display_name() -> String:
	var en: = {"hydro": "Hydro", "electro": "Électro", "pyro": "Pyro", "cryo": "Cryo", "lava": "de lave"}
	if is_boss: return boss_name
	match kind:
		"slime": return "Slime %s" % en.get(element, "")
		"slime_big": return "Grand slime %s" % en.get(element, "")
		"goblin": return "Gobelin masqué"
		"archer": return "Gobelin archer"
		"wisp": return "Feu follet %s" % en.get(element, "")
		"golem": return "Gardien de pierre" if element == "" else "Gardien %s" % en.get(element, "")
	return "Monstre"


func take_hit(amount: float, elem: String, from: Vector3 = Vector3.INF, power: = 1.0) -> void :
	if not alive: return
	var mult: = 1.0
	var reaction: = ""
	var immune_to_own: = kind in ["slime", "slime_big", "wisp"] or is_boss or (kind == "golem" and element != "")
	var immune: = elem != "" and immune_to_own and elem == element
	if kind == "boss_magma" and (elem == "pyro" or elem == "lava"): immune = true
	if immune:
		FX.float_text(global_position + Vector3(0, 1.3 + _top(), 0), "Immunisé", Color(0.8, 0.8, 0.85), 44)
		return
	var fire: = elem == "pyro" or elem == "lava"
	if elem == "hydro" and has_aura("lava"):
		reaction = "Obsidienne";_consume("lava");mult = 1.6;_petrify()
	elif elem == "lava" and has_aura("hydro"):
		reaction = "Obsidienne";_consume("hydro");mult = 1.6;_petrify()
	elif elem == "hydro" and has_aura("pyro"):
		mult = 2.0;reaction = "Vaporisation"
		_consume("pyro");FX.particles(global_position + Vector3(0, 0.8, 0), Color(1, 1, 1), 20, 3.0, 0.9, 0.18, 1.5)
	elif elem == "pyro" and has_aura("hydro"):
		mult = 1.5;reaction = "Vaporisation"
		_consume("hydro");FX.particles(global_position + Vector3(0, 0.8, 0), Color(1, 1, 1), 20, 3.0, 0.9, 0.18, 1.5)
	elif (elem == "electro" and (has_aura("pyro") or has_aura("lava"))) or (fire and has_aura("electro")):
		reaction = "Surcharge";_consume("pyro");_consume("lava");_consume("electro")
		_overload(amount * 1.6)
	elif fire and has_aura("cryo"):
		reaction = "Fonte";_consume("cryo");mult = 2.0
		if frozen > 0.0: _thaw()
		FX.particles(global_position + Vector3(0, 0.8, 0), Color(1.0, 0.85, 0.6), 22, 4.0, 0.7, 0.14, 1.0)
	elif (elem == "lava" and has_aura("pyro")) or (elem == "pyro" and has_aura("lava")):
		reaction = "Magma";_consume("lava");mult = 1.3
		apply_burn(amount * 0.35, 4.0)
		FX.ring(global_position + Vector3(0, 0.1, 0), ELEM_COLORS["lava"], 0.4, 2.8, 0.5, 0.25, 0.9)
	elif (elem == "electro" and has_aura("hydro")) or (elem == "hydro" and has_aura("electro")):
		reaction = "Électro-chargé"
		ec_ticks = 4;ec_timer = 0.25;ec_power = amount * 0.55
	elif elem == "hydro" and has_aura("cryo") and cc_immune <= 0.0:
		reaction = "Gel";_consume("cryo")
		_freeze(0.8 if is_boss else 3.2)
	elif elem == "electro" and has_aura("cryo"):
		reaction = "Supraconduction";_consume("cryo")
		mult = 1.25;vulnerable = 8.0
		FX.sphere(global_position + Vector3(0, 0.8, 0), Color(0.75, 0.7, 1.0), 0.3, 2.6, 0.35, 0.6)
		for e in get_tree().get_nodes_in_group("enemies"):
			if e != self and e.alive and not e.is_object and e.global_position.distance_to(global_position) < 3.0:
				e.take_hit(amount * 0.5, "", global_position, 0.6)
				e.vulnerable = 8.0
	if elem != "" and not (immune_to_own and elem == element):
		if not (auras.has(elem) and auras[elem] == INF):
			auras[elem] = 8.0
	if vulnerable > 0.0: mult *= 1.4
	if res_down > 0.0 and elem != "": mult *= 1.25
	if frozen > 0.0 and power >= 1.5:
		mult *= 1.5;_thaw();FX.particles(global_position + Vector3(0, 0.8, 0), ELEM_COLORS["cryo"], 24, 5.0, 0.6, 0.12)
	var dmg: = amount * mult
	hp -= dmg
	flash_t = 0.12
	FX.float_text(global_position + Vector3(0, 1.1 + _top(), 0), str(int(round(dmg))), 
		FX.element_color(elem) if elem != "" else Color.WHITE, 64 if mult > 1.0 else 52)
	if reaction != "":
		FX.float_text(global_position + Vector3(0, 1.8 + _top(), 0), reaction, _reaction_color(reaction), 58, 1.8, 1.2)
		if main: main.on_reaction(reaction)
	if main: main.on_enemy_hit(self)
	if not alerted: _alert()
	if from != Vector3.INF and kind in ["slime", "goblin", "archer", "wisp"] and frozen <= 0.0:
		var d: = global_position - from;d.y = 0
		push += d.normalized() * 4.0 * power
		if kind != "wisp": velocity.y = 3.0 * power
	if hp <= 0.0:
		_die()

func _top() -> float:
	match kind:
		"boss_goblin": return 2.8
		"boss_slime": return 3.8
		"boss_magma": return 4.4
		"boss_storm": return 5.0
		"golem": return 1.5
		"boss": return 3.8
		"slime_big": return 0.8
		"wisp": return 1.4
		"goblin", "archer": return 0.5
	return 0.0

func _reaction_color(r: String) -> Color:
	match r:
		"Fonte": return Color(1.0, 0.8, 0.5)
		"Obsidienne": return Color(0.75, 0.55, 0.45)
		"Magma": return Color(1.0, 0.4, 0.12)
		"Vaporisation": return Color(1.0, 0.75, 0.45)
		"Surcharge": return Color(1.0, 0.45, 0.6)
		"Gel": return Color(0.6, 0.9, 1.0)
		"Supraconduction": return Color(0.7, 0.65, 1.0)
	return Color(0.8, 0.55, 1.0)

func _consume(e: String) -> void :
	if auras.has(e) and auras[e] != INF: auras.erase(e)

func _overload(amount: float) -> void :
	var p: = global_position + Vector3(0, 0.5, 0)
	FX.sphere(p, Color(1.0, 0.45, 0.55), 0.3, 3.2, 0.35, 0.7)
	FX.particles(p, Color(1.0, 0.55, 0.3), 30, 7.0, 0.6, 0.15)
	FX.flash(p, Color(1.0, 0.5, 0.4), 6.0, 10.0)
	if main: main.sfx_at("explode", p)
	for e in get_tree().get_nodes_in_group("enemies"):
		if e != self and e.alive and not e.is_object and e.global_position.distance_to(global_position) < 3.2:
			e.take_hit(amount * 0.6, "", global_position, 2.0)
	if not is_boss and kind != "golem":
		push += Vector3(randf_range(-1, 1), 0, randf_range(-1, 1)).normalized() * 8.0
		velocity.y = 6.0

func _freeze(t: float) -> void :
	frozen = t

	cc_immune = t + (6.0 if is_boss else (4.0 if kind == "golem" else 2.5))
	if ice_block == null:
		ice_block = MeshInstance3D.new()
		var bm: = SphereMesh.new();bm.radius = 1.0;bm.height = 2.0;bm.radial_segments = 8;bm.rings = 4
		ice_block.mesh = bm
		var m: = StandardMaterial3D.new();m.albedo_color = Color(0.7, 0.92, 1.0, 0.55)
		m.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA;m.emission_enabled = true;m.emission = Color(0.4, 0.7, 1.0)
		m.emission_energy_multiplier = 0.4;m.roughness = 0.1
		ice_block.material_override = m
		var s: = hit_radius * 1.6 + 0.3
		ice_block.scale = Vector3(s, s * 1.1, s);ice_block.position.y = 0.2 + _top() * 0.5 + (1.8 if kind == "wisp" else 0.4)
		add_child(ice_block)
	FX.particles(global_position + Vector3(0, 0.8, 0), ELEM_COLORS["cryo"], 18, 3.0, 0.6, 0.1)
	if main: main.sfx_at("freeze", global_position)

func _thaw() -> void :
	frozen = 0.0
	if ice_block:
		ice_block.queue_free();ice_block = null


func apply_burn(dps: float, t: float) -> void :
	if not alive or is_object: return
	burn_dps = maxf(burn_dps, dps);burn_t = maxf(burn_t, t)
	if burn_tick <= 0.0: burn_tick = 0.5

func apply_res_down(t: float) -> void :
	if not alive or is_object: return
	if res_down <= 0.0:
		FX.float_text(global_position + Vector3(0, 1.6 + _top(), 0), "Résistances -25%", ELEM_COLORS["lava"], 40, 1.4, 1.2)
	res_down = maxf(res_down, t)


func _petrify() -> void :
	var t: = 0.6 if is_boss or kind == "golem" else 2.2
	if cc_immune <= 0.0:
		apply_stun(t)
		cc_immune = t + 2.5
	var p: = global_position + Vector3(0, 0.5, 0)
	FX.sphere(p, Color(0.18, 0.12, 0.14), 0.4, 1.4, 0.5, 0.85)
	FX.particles(p, Color(0.3, 0.22, 0.2), 18, 3.0, 0.6, 0.12, -6.0)
	FX.particles(p, Color(1.0, 0.5, 0.2), 10, 4.0, 0.5, 0.08, 2.0)

func apply_stun(t: float) -> void :
	stun = max(stun, t * (0.3 if kind == "golem" or is_boss else 1.0))
	FX.arcs(global_position + Vector3(0, 0.6, 0), 0.9, 3)

func pull_towards(p: Vector3, strength: float) -> void :
	if kind == "golem" or is_boss: strength *= 0.15
	var d: = p - global_position;d.y = 0
	if d.length() > 0.6: push += d.normalized() * strength

func _alert() -> void :
	alerted = true
	FX.float_text(global_position + Vector3(0, 1.6 + _top(), 0), "!", Color(1, 0.75, 0.3), 80, 0.6, 0.7)

func _die() -> void :
	alive = false
	_thaw()
	remove_from_group("enemies")
	var c: Color = ELEM_COLORS.get(element, Color(0.6, 0.6, 0.6))
	FX.particles(global_position + Vector3(0, 0.5 + _top() * 0.5, 0), c, 28, 5.0, 0.8, 0.14)
	FX.sphere(global_position + Vector3(0, 0.5, 0), Color(1, 1, 1), 0.3, 1.5, 0.3, 0.5)
	if main: main.sfx_at("pop" if kind.begins_with("slime") else "enemy_die", global_position)
	died.emit(self)
	var tw: = create_tween()
	if kind.begins_with("slime"):
		tw.tween_property(model, "scale", model.scale * Vector3(1.3, 0.05, 1.3), 0.25)
	else:
		tw.tween_property(model, "scale", model.scale * 0.01, 0.4).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_IN)
	tw.tween_callback(queue_free)


func _physics_process(delta: float) -> void :
	if not alive or is_object: return
	_t += delta

	var pd: = 999.0
	if party: pd = party.global_position.distance_to(global_position)
	sleeping = pd > 85.0
	visible = pd < 90.0
	if sleeping:
		return
	for e in auras.keys():
		if auras[e] != INF:
			auras[e] -= delta
			if auras[e] <= 0.0: auras.erase(e)
	vulnerable = maxf(0.0, vulnerable - delta)
	res_down = maxf(0.0, res_down - delta)
	cc_immune = maxf(0.0, cc_immune - delta)
	if burn_t > 0.0 and alive:
		burn_t -= delta;burn_tick -= delta
		if burn_tick <= 0.0:
			burn_tick = 0.5
			var bd: = burn_dps * 0.5
			hp -= bd;flash_t = 0.06
			FX.float_text(global_position + Vector3(0, 1.0 + _top(), 0), str(int(round(bd))), Color(1.0, 0.55, 0.2), 40, 1.0, 0.7)
			FX.particles(global_position + Vector3(0, 0.6, 0), Color(1.0, 0.45 + randf() * 0.3, 0.1), 6, 1.5, 0.5, 0.09, 2.5)
			if hp <= 0.0:
				_die();return
		if burn_t <= 0.0: burn_dps = 0.0
	if ec_ticks > 0:
		ec_timer -= delta
		if ec_timer <= 0.0:
			ec_timer = 1.0;ec_ticks -= 1
			if has_aura("hydro") and has_aura("electro"):
				FX.arcs(global_position + Vector3(0, 0.6, 0), 1.1, 5)
				take_hit(ec_power, "", Vector3.INF)
				for o in get_tree().get_nodes_in_group("enemies"):
					if o != self and o.alive and not o.is_object and o.has_aura("hydro") and o.global_position.distance_to(global_position) < 3.5:
						FX.bolt(global_position + Vector3(0, 0.6, 0), o.global_position + Vector3(0, 0.6, 0), FX.ELECTRO, 0.05, 0.15, 0.25)
						o.take_hit(ec_power * 0.7, "", Vector3.INF)
			else:
				ec_ticks = 0
			if not alive: return
	if flash_t > 0.0:
		flash_t -= delta
	if kind.begins_with("slime") and windup <= 0.0:
		var base: = Vector3.ONE * (1.9 if kind == "slime_big" else 1.0)
		model.scale = model.scale.lerp(base, 8.0 * delta)
	var floaty: = kind == "wisp" or kind == "boss_storm"
	if not floaty and not is_on_floor(): velocity.y -= GRAV * delta
	if floaty:
		var ground: float = main.world.height_at(global_position.x, global_position.z) if main else global_position.y - hover_y
		var bob: = sin(_t * 1.6) * 0.25 if frozen <= 0.0 and stun <= 0.0 else 0.0
		velocity.y = (ground + hover_y + bob - global_position.y) * 3.0
	push = push.lerp(Vector3.ZERO, 5.0 * delta)
	var to_p: = Vector3.ZERO
	var dist: = 999.0
	if party and party.is_active():
		to_p = party.global_position - global_position;to_p.y = 0
		dist = to_p.length()

	var from_home: = Vector2(global_position.x - home.x, global_position.z - home.z).length()
	if from_home > leash and dist > 8.0:
		alerted = false
		hp = minf(max_hp, hp + max_hp * 0.2 * delta)
		dist = 999.0
	elif dist < aggro and not alerted:
		_alert()
	engage = aggro * (1.7 if alerted else 1.0)
	atk_cd -= delta
	var move: = Vector3.ZERO
	if frozen > 0.0:
		frozen -= delta
		if frozen <= 0.0: _thaw()
		velocity.x = 0.0;velocity.z = 0.0
		move_and_slide()
		return
	if stun > 0.0:
		stun -= delta
	else:
		match kind:
			"slime", "slime_big": move = _slime_ai(delta, to_p, dist)
			"goblin": move = _goblin_ai(delta, to_p, dist)
			"archer": move = _archer_ai(delta, to_p, dist)
			"wisp": move = _wisp_ai(delta, to_p, dist)
			"boss": move = _boss_ai(delta, to_p, dist)
			"boss_goblin": move = _chief_ai(delta, to_p, dist)
			"boss_slime": move = _king_ai(delta, to_p, dist)
			"boss_magma": move = _magma_ai(delta, to_p, dist)
			"boss_storm": move = _storm_ai(delta, to_p, dist)
			_: move = _golem_ai(delta, to_p, dist)
	velocity.x = move.x + push.x
	velocity.z = move.z + push.z
	move_and_slide()
	if global_position.y < -6.0:
		global_position = home + Vector3(0, 2, 0);velocity = Vector3.ZERO

func _face(dir: Vector3, delta: float) -> void :
	if dir.length() < 0.01: return
	var target: = atan2(dir.x, dir.z)
	model.rotation.y = lerp_angle(model.rotation.y, target, 8.0 * delta)

func _wander(delta: float, spd: float) -> Vector3:
	wander_t -= delta
	if wander_t <= 0.0:
		wander_t = randf_range(2.5, 5.0)
		var a: = randf() * TAU
		wander_to = home + Vector3(cos(a), 0, sin(a)) * randf_range(0.0, 5.0)
	var h: = wander_to - global_position;h.y = 0
	if h.length() > 0.8:
		_face(h, delta)
		return h.normalized() * spd
	return Vector3.ZERO

func _slime_ai(delta: float, to_p: Vector3, dist: float) -> Vector3:
	var move: = Vector3.ZERO
	var big: = kind == "slime_big"
	var base: = 1.9 if big else 1.0
	if windup > 0.0:
		windup -= delta
		model.scale = Vector3(1.25, 0.7, 1.25) * base
		if windup <= 0.0:
			velocity.y = 6.5 if big else 6.0
			push += to_p.normalized() * (6.0 if big else 7.0)
			model.scale = Vector3(0.8, 1.35, 0.8) * base
			get_tree().create_timer(0.45, false).timeout.connect(_slime_land_check)
		return move
	if dist < engage:
		_face(to_p, delta)
		if dist < (3.2 if big else 2.4) and atk_cd <= 0.0 and is_on_floor():
			windup = 0.55 if big else 0.4;atk_cd = 2.6 if big else 2.3
			return move
		move = to_p.normalized() * speed
	else:
		move = _wander(delta, speed * 0.4)
	hop_t -= delta
	if move.length() > 0.1 and hop_t <= 0.0 and is_on_floor():
		velocity.y = 4.2;hop_t = 0.55
		model.scale = Vector3(0.85, 1.25, 0.85) * base
	return move

func _slime_land_check() -> void :
	if not alive or not party or frozen > 0.0 or stun > 0.0: return
	var big: = kind == "slime_big"
	if party.global_position.distance_to(global_position) < (2.6 if big else 1.6):
		party.take_damage(damage, element, global_position)
	model.scale = Vector3(1.3, 0.75, 1.3) * (1.9 if big else 1.0)
	if big:
		FX.ring(global_position, ELEM_COLORS[element], 0.5, 3.0, 0.4, 0.2, 0.7)
		if main: main.shake(0.15)


func _goblin_walk(delta: float, moving: bool) -> void :
	walk_phase += delta * (9.0 if moving else 0.0)
	var s: = sin(walk_phase) * (0.75 if moving else 0.0)
	parts["GobLegL"].rotation.x = lerpf(parts["GobLegL"].rotation.x, s, 10.0 * delta)
	parts["GobLegR"].rotation.x = lerpf(parts["GobLegR"].rotation.x, - s, 10.0 * delta)
	if windup <= 0.0 and atk_cd < 1.8:
		parts["GobArmL"].rotation.x = lerpf(parts["GobArmL"].rotation.x, - s * 0.6, 10.0 * delta)
		if kind == "goblin": parts["GobArmR"].rotation.x = lerpf(parts["GobArmR"].rotation.x, s * 0.6 - 0.3, 10.0 * delta)
	parts["GobBody"].position.y = absf(sin(walk_phase)) * 0.06 if moving else 0.02 * sin(_t * 2.0)
	parts["GobHead"].rotation.z = 0.08 * sin(_t * 1.7)

func _goblin_ai(delta: float, to_p: Vector3, dist: float) -> Vector3:
	var move: = Vector3.ZERO
	if windup > 0.0:
		windup -= delta
		var k: = 1.0 - windup / 0.6
		parts["GobArmR"].rotation.x = lerpf(-0.3, -2.8, clampf(k * 1.3, 0.0, 1.0))
		_face(to_p, delta)
		if windup <= 0.0:
			parts["GobArmR"].rotation.x = -0.9
			var fwd: = Vector3(sin(model.rotation.y), 0, cos(model.rotation.y))
			var p: = global_position + fwd * 1.3
			FX.ring(p, Color(0.8, 0.7, 0.55), 0.3, 1.6, 0.3, 0.2, 0.8)
			if main: main.sfx_at("thud", p)
			if party and party.global_position.distance_to(p) < 1.9:
				party.take_damage(damage, "", global_position)
		_goblin_walk(delta, false)
		return move
	if dist < engage:
		_face(to_p, delta)
		if dist < 1.9 and atk_cd <= 0.0:
			windup = 0.6;atk_cd = 2.0
			return move
		if dist > 1.5: move = to_p.normalized() * speed
	else:
		move = _wander(delta, speed * 0.35)
	_goblin_walk(delta, move.length() > 0.1)
	return move


func _archer_ai(delta: float, to_p: Vector3, dist: float) -> Vector3:
	var move: = Vector3.ZERO
	if windup > 0.0:
		windup -= delta
		_face(to_p, delta)
		parts["GobArmL"].rotation.x = lerpf(parts["GobArmL"].rotation.x, -1.5, 10.0 * delta)
		parts["GobArmR"].rotation.x = lerpf(parts["GobArmR"].rotation.x, -1.3, 10.0 * delta)
		if windup <= 0.0:
			_shoot("arrow", to_p)
			parts["GobArmR"].rotation.x = -0.3
		_goblin_walk(delta, false)
		return move
	if dist < engage:
		_face(to_p, delta)
		if dist < 7.0: move = - to_p.normalized() * speed * 0.8
		elif dist > 13.0: move = to_p.normalized() * speed
		elif atk_cd <= 0.0:
			windup = 0.55;atk_cd = 2.4
	else:
		move = _wander(delta, speed * 0.35)
	_goblin_walk(delta, move.length() > 0.1)
	return move


func _wisp_ai(delta: float, to_p: Vector3, dist: float) -> Vector3:
	var move: = Vector3.ZERO
	parts["WispRing"].rotation = Vector3(0.6 + 0.2 * sin(_t), _t * 1.4, 0.3)
	parts["WispShell"].rotation.y = - _t * 0.8
	var core_s: = 1.0 + 0.1 * sin(_t * 5.0)
	if windup > 0.0:
		windup -= delta
		core_s = 1.0 + (1.0 - windup / 0.7) * 0.8
		if windup <= 0.0:
			_shoot("orb", to_p)
	parts["WispCore"].scale = Vector3.ONE * core_s
	if windup > 0.0: return move
	if dist < engage:
		_face(to_p, delta)
		if dist < 6.0: move = - to_p.normalized() * speed
		elif dist > 11.0: move = to_p.normalized() * speed
		elif atk_cd <= 0.0:
			windup = 0.7;atk_cd = 2.8
		var side: = Vector3( - to_p.z, 0, to_p.x).normalized()
		move += side * sin(_t * 0.7) * 1.2
	else:
		move = _wander(delta, speed * 0.4)
	return move

func _shoot(what: String, to_p: Vector3) -> void :
	if not party: return
	var from: = global_position + Vector3(0, 1.2 if what == "arrow" else 2.0, 0)
	var target: Vector3 = party.global_position + Vector3(0, 1.0, 0) + party.velocity * 0.25
	var shot: = EnemyShot.new()
	shot.velocity = (target - from).normalized() * (22.0 if what == "arrow" else 11.0)
	shot.damage = damage;shot.element = element if what == "orb" else ""
	shot.party = party;shot.world = main.world if main else null
	shot.kind = what
	FX.add(shot, from)
	if main: main.sfx_at("bow" if what == "arrow" else "orb", from)


func _golem_ai(delta: float, to_p: Vector3, dist: float) -> Vector3:
	var move: = Vector3.ZERO
	var t: = _t
	parts["GolemCore"].scale = Vector3.ONE * (1.0 + 0.15 * sin(t * 4.0))
	if windup > 0.0:
		windup -= delta
		var k: = 1.0 - windup / 1.0
		parts["GolemArmL"].rotation.x = lerpf(0.0, -2.6, clampf(k * 1.4, 0, 1))
		parts["GolemArmR"].rotation.x = lerpf(0.0, -2.6, clampf(k * 1.4, 0, 1))
		if windup <= 0.0:
			_golem_slam()
		return move
	parts["GolemArmL"].rotation.x = lerpf(parts["GolemArmL"].rotation.x, sin(t * 2.0) * 0.3, 6.0 * delta)
	parts["GolemArmR"].rotation.x = lerpf(parts["GolemArmR"].rotation.x, - sin(t * 2.0) * 0.3, 6.0 * delta)
	if dist < engage:
		_face(to_p, delta)
		if dist < 3.2 * _scale() and atk_cd <= 0.0:
			windup = 1.0;atk_cd = 3.2
			FX.float_text(global_position + Vector3(0, 3.6 * _scale(), 0), "!", Color(1, 0.4, 0.3), 90, 0.6, 0.8)
			return move
		move = to_p.normalized() * speed
		model.position.y = abs(sin(t * 4.0)) * 0.08
	else:
		var h: = home - global_position;h.y = 0
		if h.length() > 2.0:
			move = h.normalized() * speed * 0.6;_face(h, delta)
	return move

func _scale() -> float:
	return 1.75 if kind == "boss" else (2.0 if kind == "boss_magma" else 1.0)

func _golem_slam() -> void :
	parts["GolemArmL"].rotation.x = -0.7;parts["GolemArmR"].rotation.x = -0.7
	var fwd: = Vector3(sin(model.rotation.y), 0, cos(model.rotation.y))
	var p: = global_position + fwd * 1.8 * _scale()
	var r: = 3.6 * _scale()
	FX.ring(p, Color(0.8, 0.7, 0.55) if kind != "boss" else ELEM_COLORS["cryo"], 0.5, r + 0.4, 0.5, 0.25, 0.9)
	FX.particles(p + Vector3(0, 0.3, 0), Color(0.65, 0.58, 0.5) if kind != "boss" else Color(0.85, 0.95, 1.0), 30, 6.0, 0.8, 0.2)
	if main:
		main.shake(0.35)
		main.sfx_at("slam", p)
	if party and party.global_position.distance_to(p) < r:
		party.take_damage(damage, "cryo" if kind == "boss" else "", p)


func _boss_ai(delta: float, to_p: Vector3, dist: float) -> Vector3:
	if hp < max_hp * (0.66 - 0.33 * summons_done) and summons_done < 2:
		summons_done += 1
		FX.float_text(global_position + Vector3(0, 6.0, 0), "Renforts glacés !", ELEM_COLORS["cryo"], 60, 1.4, 1.2)
		if main: main.spawn_boss_adds(global_position)
	if windup <= 0.0 and dist < engage and atk_cd <= 0.0 and dist > 5.0:
		atk_cd = 4.0
		_ice_spikes()
		return Vector3.ZERO
	return _golem_ai(delta, to_p, dist)

func _ice_spikes() -> void :
	if not party or not main: return
	for i in 3:
		var p: Vector3 = party.global_position + Vector3(randf_range(-2.5, 2.5), 0, randf_range(-2.5, 2.5)) * (0.0 if i == 0 else 1.0)
		p.y = main.world.height_at(p.x, p.z)
		FX.ring(p, Color(1.0, 0.3, 0.3), 1.9, 2.0, 1.1, 0.08, 0.8)
		get_tree().create_timer(1.1, false).timeout.connect(_spike_burst.bind(p))

func _spike_burst(p: Vector3) -> void :
	if not alive or not main: return
	var spike: MeshInstance3D = main.world.make_prop("IceSpike")
	main.add_child(spike);spike.position = p - Vector3(0, 2.4, 0);spike.scale = Vector3.ONE * 1.1
	var tw: = spike.create_tween()
	tw.tween_property(spike, "position:y", p.y - 0.2, 0.15).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	tw.tween_interval(1.0)
	tw.tween_property(spike, "position:y", p.y - 3.0, 0.5)
	tw.tween_callback(spike.queue_free)
	FX.particles(p + Vector3(0, 0.5, 0), ELEM_COLORS["cryo"], 16, 5.0, 0.6, 0.12)
	main.sfx_at("freeze", p)
	if party and party.global_position.distance_to(p) < 1.9:
		party.take_damage(damage * 0.8, "cryo", p)



func _tick_boss(delta: float) -> void :
	for k in bcd: bcd[k] = maxf(0.0, bcd[k] - delta * (1.3 if enraged else 1.0))


func _later(t: float, cb: Callable) -> void :
	get_tree().create_timer(t, false).timeout.connect( func():
		if alive and is_inside_tree(): cb.call())

func _ground(p: Vector3) -> Vector3:
	if main: p.y = main.world.height_at(p.x, p.z)
	return p

func _hurt_party(p: Vector3, r: float, dmg: float, elem: = "") -> void :
	if party and party.is_active():
		var q: Vector3 = party.global_position
		if Vector2(q.x - p.x, q.z - p.z).length() < r + 0.35 and absf(q.y - p.y) < 3.5:
			party.take_damage(dmg, elem, p)


func _phase_summon(kinds: Array, msg: String) -> bool:
	if summons_done < 2 and hp < max_hp * (0.66 - 0.33 * summons_done):
		summons_done += 1
		enraged = true
		FX.float_text(global_position + Vector3(0, _top() + 2.2, 0), msg, Color(1.0, 0.6, 0.35), 58, 1.4, 1.3)
		if main: main.boss_summon(self, kinds)
		return true
	return false


func _shoot_dir(what: String, ang: float, h: float) -> void :
	if not party: return
	var from: = global_position + Vector3(0, h, 0)
	var target: Vector3 = party.global_position + Vector3(0, 1.0, 0)
	var shot: = EnemyShot.new()
	shot.velocity = (target - from).normalized().rotated(Vector3.UP, ang) * (20.0 if what == "arrow" else 11.0)
	shot.damage = damage * 0.6;shot.element = element if what == "orb" else ""
	shot.party = party;shot.world = main.world if main else null
	shot.kind = what
	FX.add(shot, from)
	if main: main.sfx_at("orb", from)


func _chief_ai(delta: float, to_p: Vector3, dist: float) -> Vector3:
	_tick_boss(delta)
	var move: = Vector3.ZERO
	var k_spd: = 1.3 if enraged else 1.0
	if leap_t > 0.0:
		leap_t -= delta
		parts["GobArmR"].rotation.x = lerpf(parts["GobArmR"].rotation.x, -2.7, 8.0 * delta)
		if is_on_floor() and leap_t < 0.7:
			leap_t = 0.0;_chief_land()
			return move
		return leap_vel
	if windup > 0.0:
		windup -= delta
		var k: = 1.0 - windup / (0.42 / k_spd)
		parts["GobArmR"].rotation.x = lerpf(-0.3, -2.9, clampf(k * 1.4, 0.0, 1.0))
		_face(to_p, delta)
		if windup <= 0.0:
			_chief_swing()
			combo_left -= 1
			if combo_left > 0: windup = 0.42 / k_spd
			else: atk_cd = 1.5 / k_spd
		_goblin_walk(delta, false)
		return move
	if _phase_summon([["goblin", ""], ["goblin", ""], ["archer", ""]], "À moi, mes masques !"):
		FX.ring(global_position, Color(1.0, 0.7, 0.3), 0.5, 8.0, 0.6, 0.25, 0.8)
		if main: main.shake(0.25)
		return move
	if dist < engage:
		_face(to_p, delta)
		if dist > 7.0 and bcd.b <= 0.0 and is_on_floor():
			bcd.b = 7.0
			leap_to = _ground(party.global_position)
			var air: = 2.0 * 9.5 / GRAV
			FX.danger(leap_to, 3.9, air)
			velocity.y = 9.5
			leap_vel = (leap_to - global_position) / air;leap_vel.y = 0.0
			leap_t = air + 0.1
			return leap_vel
		if dist < 3.7 and atk_cd <= 0.0:
			combo_left = 3;windup = 0.42 / k_spd
			return move
		if dist > 2.6: move = to_p.normalized() * speed * k_spd
	else:
		move = _wander(delta, speed * 0.3)
	_goblin_walk(delta, move.length() > 0.1)
	return move

func _chief_swing() -> void :
	parts["GobArmR"].rotation.x = -0.6
	var fwd: = Vector3(sin(model.rotation.y), 0, cos(model.rotation.y))
	FX.slash(global_position + Vector3(0, 1.7, 0) + fwd * 0.6, model.rotation.y, Color(1.0, 0.82, 0.45), 3.6, 150.0, combo_left % 2 == 0, 0.2)
	if main: main.sfx_at("thud", global_position)
	if party and party.is_active():
		var d: Vector3 = party.global_position - global_position;d.y = 0
		if d.length() < 4.0 and rad_to_deg(fwd.angle_to(d)) < 80.0:
			party.take_damage(damage, "", global_position)

func _chief_land() -> void :
	var p: = global_position
	parts["GobArmR"].rotation.x = -0.5
	FX.ring(p, Color(0.9, 0.72, 0.5), 0.5, 4.6, 0.5, 0.3, 0.9)
	FX.particles(p + Vector3(0, 0.3, 0), Color(0.65, 0.58, 0.5), 30, 6.0, 0.8, 0.2)
	if main:
		main.shake(0.35);main.sfx_at("slam", p)
	_hurt_party(p, 3.9, damage * 1.3)


func _king_ai(delta: float, to_p: Vector3, dist: float) -> Vector3:
	_tick_boss(delta)
	var move: = Vector3.ZERO
	var base: = Vector3.ONE * 4.6
	if leap_t > 0.0:
		leap_t -= delta
		model.scale = model.scale.lerp(Vector3(0.85, 1.3, 0.85) * 4.6, 6.0 * delta)
		if is_on_floor() and leap_t < 0.9:
			leap_t = 0.0;_king_land()
			return move
		return leap_vel
	if windup > 0.0:
		windup -= delta
		model.scale = model.scale.lerp(Vector3(1.3, 0.65, 1.3) * 4.6, 8.0 * delta)
		if windup <= 0.0:
			velocity.y = 12.0
			var air: = 2.0 * 12.0 / GRAV
			leap_vel = (leap_to - global_position) / air;leap_vel.y = 0.0
			leap_t = air + 0.1
		return move
	model.scale = model.scale.lerp(base, 6.0 * delta)
	if _phase_summon([["slime", "hydro"], ["slime", "electro"], ["slime", element]], "Le Roi se divise !"):
		FX.sphere(global_position + Vector3(0, 2.0, 0), ELEM_COLORS.get(element, Color.WHITE), 1.0, 6.0, 0.5, 0.5)
		return move
	if dist < engage:
		_face(to_p, delta)
		if bcd.b <= 0.0 and is_on_floor():
			bcd.b = 6.5
			leap_to = _ground(party.global_position)
			FX.danger(leap_to, 5.2, 0.6 + 2.0 * 12.0 / GRAV)
			windup = 0.6
			return move
		if bcd.a <= 0.0 and dist > 4.5:
			bcd.a = 3.6
			for k in 3: _shoot_dir("orb", (k - 1) * 0.26, 3.0)
			model.scale = Vector3(1.15, 0.85, 1.15) * 4.6
		move = to_p.normalized() * speed
	else:
		move = _wander(delta, speed * 0.4)
	hop_t -= delta
	if move.length() > 0.1 and hop_t <= 0.0 and is_on_floor():
		velocity.y = 4.0;hop_t = 0.8
		model.scale = Vector3(0.9, 1.15, 0.9) * 4.6
	return move

func _king_land() -> void :
	var p: = global_position
	model.scale = Vector3(1.35, 0.7, 1.35) * 4.6
	var c: Color = ELEM_COLORS.get(element, Color.WHITE)
	FX.ring(p, c, 0.6, 6.6, 0.55, 0.3, 0.9)
	FX.particles(p + Vector3(0, 0.6, 0), c, 40, 7.0, 0.9, 0.22)
	if main:
		main.shake(0.45);main.sfx_at("slam", p)
	_hurt_party(p, 5.2, damage * 1.4, element)


func _magma_ai(delta: float, to_p: Vector3, dist: float) -> Vector3:
	_tick_boss(delta)
	var move: = Vector3.ZERO
	parts["GolemCore"].scale = Vector3.ONE * (1.0 + 0.2 * sin(_t * (7.0 if enraged else 4.0)))
	if windup > 0.0:
		windup -= delta
		var k: = 1.0 - windup / 1.0
		parts["GolemArmL"].rotation.x = lerpf(0.0, -2.6, clampf(k * 1.4, 0, 1))
		parts["GolemArmR"].rotation.x = lerpf(0.0, -2.6, clampf(k * 1.4, 0, 1))
		if windup <= 0.0: _magma_slam()
		return move
	if not enraged and hp < max_hp * 0.5:
		enraged = true
		FX.float_text(global_position + Vector3(0, _top() + 2.2, 0), "Fusion !", ELEM_COLORS.get(element, Color.WHITE), 64, 1.4, 1.3)
		FX.sphere(global_position + Vector3(0, 2.0, 0), ELEM_COLORS.get(element, Color.WHITE), 1.0, 7.0, 0.6, 0.45)
		if main:
			main.boss_summon(self, [["slime", "lava"], ["slime", "pyro"]])
			main.shake(0.4)
	var k_spd: = 1.25 if enraged else 1.0
	parts["GolemArmL"].rotation.x = lerpf(parts["GolemArmL"].rotation.x, sin(_t * 2.0) * 0.3, 6.0 * delta)
	parts["GolemArmR"].rotation.x = lerpf(parts["GolemArmR"].rotation.x, - sin(_t * 2.0) * 0.3, 6.0 * delta)
	if dist < engage:
		_face(to_p, delta)
		if bcd.b <= 0.0 and dist < 28.0:
			bcd.b = 7.5
			_eruption(5 if enraged else 4)
		if dist < 5.2 and atk_cd <= 0.0:
			windup = 1.0;atk_cd = 3.0
			var fwd: = Vector3(sin(model.rotation.y), 0, cos(model.rotation.y))
			FX.danger(_ground(global_position + fwd * 3.0), 4.8, 1.0)
			return move
		move = to_p.normalized() * speed * k_spd
		model.position.y = abs(sin(_t * 4.0)) * 0.1
	else:
		var h: = home - global_position;h.y = 0
		if h.length() > 2.0:
			move = h.normalized() * speed * 0.6;_face(h, delta)
	return move

func _magma_slam() -> void :
	parts["GolemArmL"].rotation.x = -0.7;parts["GolemArmR"].rotation.x = -0.7
	var fwd: = Vector3(sin(model.rotation.y), 0, cos(model.rotation.y))
	var p: = _ground(global_position + fwd * 3.0)
	var c: Color = ELEM_COLORS.get(element, Color.WHITE)
	FX.ring(p, c, 0.5, 5.4, 0.5, 0.3, 0.9)
	FX.particles(p + Vector3(0, 0.3, 0), c, 34, 7.0, 0.8, 0.18, -8.0)
	FX.flash(p + Vector3(0, 1.0, 0), c, 5.0, 10.0, 0.3)
	if main:
		main.shake(0.4);main.sfx_at("slam", p)
	_hurt_party(p, 4.8, damage * 1.2, element)

func _eruption(n: int) -> void :
	if not party: return
	for i in n:
		var off: = Vector3.ZERO if i == 0 else Vector3(randf_range(-6.5, 6.5), 0, randf_range(-6.5, 6.5))
		var p: = _ground(party.global_position + off)
		FX.danger(p, 2.5, 1.3, Color(1.0, 0.35, 0.1))
		_later(1.3, _geyser_burst.bind(p))

func _geyser_burst(p: Vector3) -> void :
	var c: Color = ELEM_COLORS.get(element, Color.WHITE)
	FX.column(p, c, 1.0, 6.5, 0.8)
	FX.particles(p + Vector3(0, 0.5, 0), c.lightened(0.2), 18, 8.0, 0.9, 0.12, -12.0)
	if main: main.sfx_at("explode", p)
	_hurt_party(p, 2.5, damage * 0.9, element)


func _storm_ai(delta: float, to_p: Vector3, dist: float) -> Vector3:
	_tick_boss(delta)
	parts["WispRing"].rotation = Vector3(0.6 + 0.2 * sin(_t), _t * 1.8, 0.3)
	parts["WispRing2"].rotation = Vector3(-0.9 + 0.2 * cos(_t * 0.8), - _t * 1.3, 1.2)
	parts["WispShell"].rotation.y = - _t * 0.9
	var orbit: Node3D = parts["Orbit"]
	orbit.rotation = Vector3(0.25 * sin(_t * 0.7), _t * (2.2 if enraged else 1.2), 0.0)
	for sh in orbit.get_children(): (sh as Node3D).rotation.y = _t * 3.0
	if windup > 0.0:
		windup -= delta
		parts["WispCore"].scale = Vector3.ONE * (1.0 + (1.0 - windup / 1.1) * 0.9)
		if windup <= 0.0: _storm_nova()
		return Vector3.ZERO
	parts["WispCore"].scale = Vector3.ONE * (1.0 + 0.1 * sin(_t * 5.0))
	if not enraged and hp < max_hp * 0.5:
		enraged = true
		FX.float_text(global_position + Vector3(0, _top() + 2.2, 0), "L'orage se déchaîne !", ELEM_COLORS.get(element, Color.WHITE), 58, 1.4, 1.3)
		if main: main.boss_summon(self, [["wisp", element], ["wisp", element]])
	if dist < engage:
		_face(to_p, delta)
		if dist < 6.5 and bcd.c <= 0.0:
			bcd.c = 8.0;windup = 1.1
			FX.danger(_ground(global_position), 6.8, 1.1)
			return Vector3.ZERO
		if bcd.b <= 0.0:
			bcd.b = 5.5
			_storm_strikes(5 if enraged else 4)
		if bcd.a <= 0.0 and dist > 5.0:
			bcd.a = 3.2
			for k in 5: _shoot_dir("orb", (k - 2) * 0.22, 3.0)
		if enraged and bcd.d <= 0.0:
			bcd.d = 9.0
			_storm_blink()
		var move: = Vector3.ZERO
		if dist < 7.0: move = - to_p.normalized() * speed
		elif dist > 12.0: move = to_p.normalized() * speed
		move += Vector3( - to_p.z, 0, to_p.x).normalized() * sin(_t * 0.6) * 2.0
		return move
	return _wander(delta, speed * 0.4)

func _storm_strikes(n: int) -> void :
	if not party: return
	for i in n:
		var off: = Vector3.ZERO if i == 0 else Vector3(randf_range(-5.5, 5.5), 0, randf_range(-5.5, 5.5))
		var p: = _ground(party.global_position + off)
		FX.danger(p, 2.2, 1.0)
		_later(1.0, _strike_at.bind(p))

func _strike_at(p: Vector3) -> void :
	if element == "cryo":
		_spike_burst(p)
		return
	var c: Color = ELEM_COLORS.get(element, Color.WHITE)
	FX.bolt(p + Vector3(randf_range(-1, 1), 14.0, randf_range(-1, 1)), p, c, 0.2, 0.3, 0.9)
	FX.sphere(p + Vector3(0, 0.3, 0), c, 0.3, 2.2, 0.3, 0.6)
	FX.flash(p + Vector3(0, 2.0, 0), c, 4.0, 9.0, 0.25)
	if main: main.sfx_at("zap", p)
	_hurt_party(p, 2.2, damage, element)

func _storm_nova() -> void :
	var c: Color = ELEM_COLORS.get(element, Color.WHITE)
	var p: = _ground(global_position)
	FX.ring(p, c, 1.0, 7.4, 0.5, 0.3, 0.9)
	FX.sphere(global_position + Vector3(0, 2.8, 0), c, 1.0, 6.5, 0.4, 0.45)
	if main:
		main.shake(0.3);main.sfx_at("thunder" if element == "electro" else "freeze", p)
	_hurt_party(p, 6.8, damage * 1.25, element)

func _storm_blink() -> void :
	if not party: return
	var c: Color = ELEM_COLORS.get(element, Color.WHITE)
	FX.sphere(global_position + Vector3(0, 2.8, 0), c, 2.0, 0.2, 0.3, 0.6)
	var a: = randf() * TAU
	var q: Vector3 = party.global_position + Vector3(cos(a), 0, sin(a)) * 9.0
	if Vector2(q.x - home.x, q.z - home.z).length() > leash * 0.8: q = home
	global_position = _ground(q) + Vector3(0, hover_y, 0)
	FX.sphere(global_position + Vector3(0, 2.8, 0), c, 0.2, 2.5, 0.3, 0.6)
	FX.particles(global_position + Vector3(0, 2.8, 0), c, 24, 5.0, 0.6, 0.1, 0.0)


class EnemyShot extends Node3D:
	var velocity: = Vector3.ZERO
	var damage: = 40.0
	var element: = ""
	var kind: = "arrow"
	var party: Node3D
	var world: Node
	var life: = 2.2
	var _t: = 0.0
	func _ready() -> void :
		var mi: = MeshInstance3D.new()
		if kind == "arrow":
			var cm: = CylinderMesh.new();cm.top_radius = 0.02;cm.bottom_radius = 0.02;cm.height = 0.75
			mi.mesh = cm;mi.material_override = FX.mat_emit(Color(0.9, 0.8, 0.6), 1.0)
			mi.rotation.x = PI * 0.5
		else:
			var sm: = SphereMesh.new();sm.radius = 0.24;sm.height = 0.48
			mi.mesh = sm;mi.material_override = FX.mat_emit(Enemy.ELEM_COLORS.get(element, Color.WHITE), 3.0)
		add_child(mi)
		if velocity.length() > 0.1:
			look_at(global_position + velocity, Vector3.UP if absf(velocity.normalized().y) < 0.99 else Vector3.RIGHT)
	func _physics_process(delta: float) -> void :
		global_position += velocity * delta
		_t += delta
		if kind == "orb" and Engine.get_physics_frames() % 3 == 0:
			FX.sphere(global_position, Enemy.ELEM_COLORS.get(element, Color.WHITE), 0.2, 0.05, 0.3, 0.5)
		if party and party.is_active() and party.global_position.distance_to(global_position - Vector3(0, 1.0, 0)) < 0.8:
			party.take_damage(damage, element, global_position)
			FX.sphere(global_position, Enemy.ELEM_COLORS.get(element, Color(0.9, 0.8, 0.6)), 0.2, 0.8, 0.2, 0.6)
			queue_free()
			return
		var ground: float = world.height_at(global_position.x, global_position.z) if world else -100.0
		if _t > life or global_position.y < ground:
			queue_free()
