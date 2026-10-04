class_name Party
extends CharacterBody3D



const GRAV: = 24.0
const JUMP_V: = 8.2
const WALK: = 1.2
const RUN: = 5.2
const SPRINT: = 7.6
const LOCO: = ["Walk", "Run", "Sprint"]
const LAVA_SHADER: = preload("res://shaders/lava.gdshader")

var main: Node
var cam_rig: Node3D
var chars: Array[Dictionary] = []
var active: = 0
var visual: Node3D
var stamina: = 100.0
var input_vec: = Vector2.ZERO
var sprint_held: = false
var attack_lock: = 0.0
var combo: = 0
var combo_timer: = 0.0
var iframe: = 0.0
var dash_t: = 0.0
var dash_dir: = Vector3.ZERO
var switch_cd: = 0.0
var cast_t: = 0.0
var glider_tw: Tween
var storm_t: = 0.0
var storm_tick: = 0.0
var storm_node: Node3D
var lyra_passive_cd: = 0.0
var inferno_t: = 0.0
var inferno_tick: = 0.0
var inferno_node: Node3D
var weapons_lib: Node3D
var dead_t: = 0.0
var enabled: = true
var cur_anim: = ""
var loco: = ""
var gliding: = false
var glider: Node3D
var air_t: = 0.0
var fall_speed: = 0.0
var land_lock: = 0.0
var step_t: = 0.0
var catalyst: Node3D
var catalyst_gem: Node3D
var cat_attack: = 0.0
var rank: = 1
const GLIDE_SPEED: = 7.5
const GLIDE_SINK: = 2.2
var last_yaw: = 0.0
var roll: = 0.0
var stats: = {"reactions": 0, "damage": 0.0}
var lunge_t: = 0.0
var lunge_v: = 0.0

func _ready() -> void :
	collision_layer = 2
	collision_mask = 1 | 4
	var cap: = CapsuleShape3D.new();cap.radius = 0.32;cap.height = 1.6
	var cs: = CollisionShape3D.new();cs.shape = cap;cs.position.y = 0.8
	add_child(cs)
	visual = Node3D.new();add_child(visual)

	weapons_lib = load("res://assets/weapons.glb").instantiate()
	_add_char({"name": "Kaelith", "element": "hydro", "weapon": "", "scene": "res://assets/kaelith.glb", "max_hp": 1100.0, "atk": 30.0, 
		"energy_max": 60.0, "skill_cd_max": 6.0, "burst_cd_max": 15.0, "combo_len": 3, 
		"gait": {"Walk": 1.1987, "Run": 5.1522, "Sprint": 7.5681}})
	_add_char({"name": "Lyra", "element": "electro", "weapon": "Sword_Lyra", "scene": "res://assets/lyra.glb", "max_hp": 1000.0, "atk": 34.0, 
		"energy_max": 80.0, "skill_cd_max": 7.0, "burst_cd_max": 18.0, "combo_len": 3, 
		"gait": {"Walk": 1.197, "Run": 5.2572, "Sprint": 7.8308}})
	_add_char({"name": "Kael", "element": "pyro", "weapon": "Sword_Kael", "scene": "res://assets/kael.glb", "max_hp": 1050.0, "atk": 32.0, 
		"energy_max": 70.0, "skill_cd_max": 8.0, "burst_cd_max": 18.0, "combo_len": 4, 
		"gait": {"Walk": 1.1952, "Run": 5.312, "Sprint": 7.7163}})
	_add_char({"name": "Zahara", "element": "lava", "weapon": "Staff_Zahara", "scene": "res://assets/zahara.glb", "max_hp": 1250.0, "atk": 37.0, 
		"energy_max": 80.0, "skill_cd_max": 9.0, "burst_cd_max": 20.0, "combo_len": 3, 
		"gait": {"Walk": 1.2014, "Run": 5.186, "Sprint": 7.5731}})
	weapons_lib.free();weapons_lib = null
	_show_active()
	_build_glider()

func _build_glider() -> void :
	var gear: Node3D = load("res://assets/gear.glb").instantiate()
	glider = Node3D.new();visual.add_child(glider)
	for n in ["Glider", "GliderTrim"]:
		var g: = gear.get_node_or_null(n)
		if g:
			var d: Node3D = g.duplicate();glider.add_child(d)
	Toon.apply(glider, true, false, 0.004)
	glider.position = Vector3(0, 2.25, -0.1)
	glider.scale = Vector3.ONE * 0.01
	glider.visible = false

	var cat_src: = gear.get_node_or_null("Catalyst")
	if cat_src:
		catalyst = Node3D.new()
		var book: Node3D = cat_src.duplicate();catalyst.add_child(book)
		Toon.apply(catalyst, true, true, 0.003)
		chars[0].node.add_child(catalyst)
		catalyst.position = Vector3(-0.55, 1.2, 0.25)
		catalyst.scale = Vector3.ONE * 1.15
		catalyst_gem = Node3D.new();catalyst.add_child(catalyst_gem);catalyst_gem.position = Vector3(0, 0.2, 0)
		var glow: = OmniLight3D.new();glow.light_color = FX.HYDRO;glow.light_energy = 0.5;glow.omni_range = 2.2
		glow.shadow_enabled = false;catalyst_gem.add_child(glow)
	gear.free()

func apply_rank(r: int) -> void :
	rank = r
	for o in chars:
		var hp_ratio: float = o.hp / o.max_hp if o.max_hp > 0.0 else 1.0
		o.max_hp = o.base_hp * (1.0 + 0.06 * (r - 1))
		o.atk = o.base_atk * (1.0 + 0.08 * (r - 1))
		o.hp = o.max_hp * hp_ratio

func eat_food() -> bool:
	var c: = ch()
	if not c.alive or c.hp >= c.max_hp: return false
	c.hp = minf(c.max_hp, c.hp + c.max_hp * 0.35)
	FX.float_text(global_position + Vector3(0, 2.0, 0), "+35% PV", FX.HEAL, 56, 1.4, 1.2)
	FX.particles(global_position + Vector3(0, 1.0, 0), FX.HEAL, 24, 3.0, 1.0, 0.09, 2.0)
	_sfx("heal")
	return true

func _sfx(n: String, vol: = 0.0) -> void :
	if main and main.audio: main.audio.play(n, vol)

func _add_char(c: Dictionary) -> void :
	var model: Node3D = load(c.scene).instantiate()
	visual.add_child(model)
	Toon.apply(model, true, true, 0.0045)
	for mi in model.find_children("*", "MeshInstance3D", true, false):
		mi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_ON
	var ap: AnimationPlayer = model.find_children("*", "AnimationPlayer", true, false)[0]
	for n in ["Idle", "Walk", "Run", "Sprint", "Idle_Combat", "Glide", "Fall"]:
		if ap.has_animation(n): ap.get_animation(n).loop_mode = Animation.LOOP_LINEAR
	var skel: Skeleton3D = model.find_children("*", "Skeleton3D", true, false)[0]
	var hand: = BoneAttachment3D.new();hand.bone_name = Bones.find(skel, "hand.R");skel.add_child(hand)
	var fx: = BoneAttachment3D.new();fx.bone_name = Bones.find(skel, "fx");skel.add_child(fx)
	var weapon: Node3D = null
	var trail: WeaponTrail = null
	if c.weapon != "" and weapons_lib and Bones.idx(skel, "weapon.R") >= 0:
		var src: = weapons_lib.get_node_or_null(c.weapon)
		if src:
			var sock: = BoneAttachment3D.new();sock.bone_name = Bones.find(skel, "weapon.R");skel.add_child(sock)
			weapon = src.duplicate();sock.add_child(weapon)
			weapon.transform = Transform3D.IDENTITY
			Toon.apply(weapon, true, true, 0.0025)
			weapon.visible = false
			var blade: = WeaponTrail.blade_extent(weapon)
			trail = WeaponTrail.new()
			trail.setup(sock, blade.x, blade.y, FX.element_color(c.element))
			add_child(trail)
	_setup_cloth(skel)
	c.merge({"node": model, "ap": ap, "hand": hand, "fxb": fx, "skel": skel, "weapon_node": weapon, "weapon_t": 0.0, "trail": trail, 
		"hp": c.max_hp, "energy": 0.0, "skill_cd": 0.0, "burst_cd": 0.0, "alive": true, "atk_speed": 1.0, 
		"base_hp": c.max_hp, "base_atk": c.atk, "atk_buff": 0.0, "atk_buff_t": 0.0, "passive_cd": 0.0})
	chars.append(c)


func _setup_cloth(skel: Skeleton3D) -> void :
	var chains: = {}
	for i in skel.get_bone_count():
		var bn: = skel.get_bone_name(i)
		if bn.begins_with("cloth_"):
			var parts: = bn.split("_")
			if parts.size() >= 3:
				var key: = parts[1]
				if not chains.has(key): chains[key] = []
				chains[key].append(bn)
	if chains.is_empty(): return
	var sb: = SpringBoneSimulator3D.new();sb.name = "Cloth"
	skel.add_child(sb)
	var keys: = chains.keys()
	sb.setting_count = keys.size()
	for i in keys.size():
		var names: Array = chains[keys[i]]
		names.sort()
		sb.set_root_bone_name(i, names[0]);sb.set_end_bone_name(i, names[names.size() - 1])
		sb.set_extend_end_bone(i, true);sb.set_end_bone_length(i, 0.12)
		sb.set_stiffness(i, 1.6);sb.set_drag(i, 0.55);sb.set_gravity(i, 0.25);sb.set_radius(i, 0.03)
	for side in ["L", "R"]:
		for b in ["thigh", "shin"]:
			var bi: = Bones.idx(skel, "%s.%s" % [b, side])
			if bi < 0: continue
			var cap: = SpringBoneCollisionCapsule3D.new()
			cap.bone_name = Bones.find(skel, "%s.%s" % [b, side])
			cap.radius = 0.11 if b == "thigh" else 0.08
			cap.height = 0.5
			cap.position_offset = Vector3(0, 0.22, 0)
			sb.add_child(cap)
	for i in keys.size(): sb.set_enable_all_child_collisions(i, true)

func ch() -> Dictionary:
	return chars[active]

func is_active() -> bool:
	return enabled and dead_t <= 0.0

func _show_active() -> void :

	for i in chars.size():
		var on: = i == active
		var c: Dictionary = chars[i]
		c.node.visible = on
		if not on and c.ap.is_playing(): c.ap.stop()
		set_cloth(c, on)
	cur_anim = ""

func set_cloth(c: Dictionary, on: bool) -> void :
	var sb: SkeletonModifier3D = c.skel.get_node_or_null("Cloth")
	if sb == null: return
	sb.active = on
	if on: sb.call_deferred("reset")


func _play(anim: String, blend: = 0.15, spd: = 1.0) -> void :
	var ap: AnimationPlayer = ch().ap
	if anim == cur_anim and ap.is_playing():
		ap.speed_scale = spd
		return
	var phase: = -1.0
	if cur_anim in LOCO and anim in LOCO and ap.is_playing() and ap.current_animation_length > 0.0:
		phase = ap.current_animation_position / ap.current_animation_length
	cur_anim = anim
	ap.play(anim, blend)
	if phase >= 0.0:
		ap.seek(phase * ap.current_animation_length, true)
	ap.speed_scale = spd

func _cam_basis_dirs() -> Array:
	var cam: Camera3D = cam_rig.camera
	var f: = - cam.global_transform.basis.z;f.y = 0;f = f.normalized()
	var r: = cam.global_transform.basis.x;r.y = 0;r = r.normalized()
	return [f, r]

func facing_dir() -> Vector3:
	var y: float = visual.rotation.y
	return Vector3(sin(y), 0, cos(y))

func _face_towards(dir: Vector3, instant: = false, delta: = 0.016) -> void :
	if dir.length() < 0.01: return
	var target: = atan2(dir.x, dir.z)
	visual.rotation.y = target if instant else lerp_angle(visual.rotation.y, target, 14.0 * delta)

func nearest_enemy(max_d: float, cone_deg: = 360.0, foes_only: = false) -> Enemy:
	var best: Enemy = null
	var bd: = max_d
	var fwd: = facing_dir()
	for e in get_tree().get_nodes_in_group("enemies"):
		if not e.alive or (foes_only and e.is_object): continue
		var d: Vector3 = e.global_position - global_position;d.y = 0
		var l: = d.length()
		if l < bd and (cone_deg >= 360.0 or rad_to_deg(fwd.angle_to(d)) < cone_deg * 0.5):
			bd = l;best = e
	return best

func enemies_in(center: Vector3, radius: float) -> Array:
	var out: = []
	for e in get_tree().get_nodes_in_group("enemies"):
		if e.alive and e.global_position.distance_to(center) < radius + e.hit_radius:
			out.append(e)
	return out

func _hit(e: Enemy, mult: float, elem: String, from: = Vector3.INF, power: = 1.0, who: = -1) -> void :
	var c: Dictionary = chars[who] if who >= 0 else ch()
	var dmg: float = c.atk * (1.0 + c.atk_buff) * mult * randf_range(0.93, 1.07)
	if c.name == "Kael" and inferno_t > 0.0: dmg *= 1.25
	e.take_hit(dmg, elem, from, power)
	stats.damage += dmg
	if not e.is_object and main and main.has_method("hitstop"):
		main.hitstop(0.035 + 0.03 * clampf(power, 0.0, 1.5), 0.06)
	if elem == "electro" and lyra_passive_cd <= 0.0 and not e.is_object:
		lyra_passive_cd = 0.8
		for o in chars: o.energy = minf(o.energy_max, o.energy + 1.0)

func gain_energy(amount: float) -> void :
	for i in chars.size():
		var k: = 1.0 if i == active else 0.6
		chars[i].energy = minf(chars[i].energy_max, chars[i].energy + amount * k)

func _hand_pos() -> Vector3:
	return ch().hand.global_position


func do_attack() -> void :
	if not is_active() or attack_lock > 0.12 or dash_t > 0.0: return
	var c: = ch()
	var reach: = {"Kaelith": 16.0, "Lyra": 7.0, "Kael": 7.0, "Zahara": 8.0}.get(c.name, 7.0) as float
	var tgt: = nearest_enemy(reach, 200.0)
	if tgt: _face_towards(tgt.global_position - global_position, true)
	combo = (combo % int(c.combo_len)) + 1
	combo_timer = 1.1
	var spd: float = c.atk_speed
	_show_weapon(c)
	# petit pas en avant pendant le coup, sauf si l'ennemi est déjà au contact
	var close: bool = tgt != null and global_position.distance_to(tgt.global_position) < 1.4 + tgt.hit_radius
	if c.name != "Kaelith" and not close and is_on_floor():
		var finisher: bool = combo == int(c.combo_len)
		get_tree().create_timer(0.06, false).timeout.connect(_lunge.bind(4.5 if finisher else 3.0, 0.14))
	match c.name:
		"Kaelith":
			_play("Attack%d" % combo, 0.05, spd * 1.1)
			attack_lock = [0.0, 0.42, 0.42, 0.6][combo] / spd
			var mult: float = [0.0, 0.95, 1.05, 1.5][combo]
			get_tree().create_timer(0.17 / spd, false).timeout.connect(_kaelith_blade.bind(tgt, mult, combo))
			cat_attack = 0.6
			_sfx("water", -2.0)
		"Lyra":
			_play("Attack%d" % combo, 0.05, spd * 1.25)
			attack_lock = [0.0, 0.34, 0.34, 0.52][combo] / spd
			var mult: float = [0.0, 1.0, 1.15, 1.7][combo]
			get_tree().create_timer(0.13 / spd, false).timeout.connect(_lyra_slash.bind(mult, combo))
			_sfx("slash", -2.0)
		"Kael":
			var sp: = spd * (1.3 if inferno_t > 0.0 else 1.0)
			_play("Attack%d" % combo, 0.04, sp * 1.2)
			attack_lock = [0.0, 0.26, 0.26, 0.32, 0.5][combo] / sp
			var mult: float = [0.0, 0.85, 0.9, 1.05, 1.55][combo]
			var t_hit: float = [0.0, 0.16, 0.16, 0.22, 0.26][combo]
			get_tree().create_timer(t_hit / sp, false).timeout.connect(_kael_slash.bind(mult, combo))
			_sfx("slash", -2.0)
		"Zahara":
			_play("Attack%d" % combo, 0.06, spd * 1.05)
			attack_lock = [0.0, 0.55, 0.55, 0.78][combo] / spd
			var mult: float = [0.0, 1.35, 1.45, 2.1][combo]
			var t_hit: float = [0.0, 0.36, 0.36, 0.42][combo]
			get_tree().create_timer(t_hit / spd, false).timeout.connect(_zahara_strike.bind(mult, combo))
			_sfx("slam" if combo == 3 else "thud", -3.0)

func _lunge(v: float, dur: float) -> void :
	lunge_v = v;lunge_t = dur

func _kaelith_blade(tgt: Enemy, mult: float, step: int) -> void :
	if ch().name != "Kaelith": return
	var from: Vector3 = catalyst_gem.global_position if catalyst_gem else _hand_pos()
	cat_attack = 0.5
	var count: = 3 if step == 3 else 1
	for k in count:
		var dir: = facing_dir()
		if is_instance_valid(tgt) and tgt.alive:
			dir = (tgt.global_position + Vector3(0, 0.5, 0) - from).normalized()
		dir = dir.rotated(Vector3.UP, (k - (count - 1) * 0.5) * 0.18)
		var p: = FX.Projectile.new()
		p.velocity = dir * 24.0;p.life = 0.8;p.trail_col = FX.HYDRO
		p.on_hit = func(e, pos):
			_hit(e, mult / (1.0 if count == 1 else 1.6), "hydro", pos, 0.6)
			FX.sphere(pos, FX.HYDRO, 0.2, 1.0, 0.25, 0.6)
			FX.particles(pos, FX.HYDRO, 10, 4.0, 0.4, 0.08)
			if not e.is_object: gain_energy(0.6)
		FX.add(p, from)
		var blade: = MeshInstance3D.new(); var sm: = SphereMesh.new();sm.radius = 0.16;sm.height = 0.32
		blade.mesh = sm;blade.material_override = FX.mat_emit(FX.HYDRO.lightened(0.3), 3.0)
		p.add_child(blade);blade.basis = Basis.looking_at(dir, Vector3.UP) * Basis.from_scale(Vector3(1.0, 0.45, 2.4))
	FX.sphere(from, FX.HYDRO, 0.1, 0.45, 0.2, 0.7)

func _lyra_slash(mult: float, step: int) -> void :
	if ch().name != "Lyra": return
	var fwd: = facing_dir()
	var yaw: float = visual.rotation.y
	var origin: = global_position + Vector3(0, 1.0, 0)
	var tilt: float = [0.0, 0.15, -0.15, 1.35][step]
	FX.slash(origin + fwd * 0.3, yaw, FX.ELECTRO, 2.3, 160.0, step == 2, tilt)
	FX.slash(origin + fwd * 0.3, yaw, Color(0.95, 0.9, 1.0), 2.0, 140.0, step == 2, tilt)
	var hit_any: = false
	for e in get_tree().get_nodes_in_group("enemies"):
		if not e.alive: continue
		var d: Vector3 = e.global_position - global_position;d.y = 0
		if d.length() < 2.8 + e.hit_radius and rad_to_deg(fwd.angle_to(d)) < 75.0:
			_hit(e, mult, "electro", global_position, 0.8 if step == 3 else 0.4)
			FX.arcs(e.global_position + Vector3(0, 0.6, 0), 0.8, 2)
			hit_any = hit_any or not e.is_object
	if hit_any:
		_sfx("hit", -4.0)
		gain_energy(0.8)
		if step == 3 and main: main.shake(0.12)


func _show_weapon(c: Dictionary) -> void :
	var w: Node3D = c.weapon_node
	if w == null: return
	c.weapon_t = 5.0
	if not w.visible:
		w.visible = true
		w.scale = Vector3.ONE * 0.15
		w.create_tween().tween_property(w, "scale", Vector3.ONE, 0.14).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
		if c.node.visible:
			FX.particles(c.hand.global_position, FX.element_color(c.element), 10, 2.2, 0.35, 0.05, 0.0)

func _hide_weapon(c: Dictionary) -> void :
	var w: Node3D = c.weapon_node
	if w == null or not w.visible: return
	if c.node.visible and c.alive:
		FX.particles(c.hand.global_position, FX.element_color(c.element), 10, 1.6, 0.4, 0.05, 1.0)
	w.visible = false


func _kael_slash(mult: float, step: int) -> void :
	if ch().name != "Kael": return
	var fwd: = facing_dir()
	var yaw: float = visual.rotation.y
	var origin: = global_position + Vector3(0, 1.0, 0)
	var tilt: float = [0.0, 0.2, -0.2, -0.9, 0.0][step]
	var r: = 2.2 if step < 4 else 2.6
	var flip: = step == 2
	FX.slash(origin + fwd * 0.3, yaw, FX.PYRO, r, 150.0, flip, tilt)
	FX.slash(origin + fwd * 0.3, yaw, Color(1.0, 0.86, 0.45), r * 0.86, 125.0, flip, tilt)
	FX.particles(origin + fwd * 1.1, Color(1.0, 0.55 + randf() * 0.3, 0.15), 8, 2.5, 0.4, 0.05, 2.5)
	var reach: = r + 0.4
	if step == 4:
		reach = 4.2
		for k in 4:
			var q: = global_position + fwd * (1.2 + k * 0.85)
			get_tree().create_timer(k * 0.04, false).timeout.connect( func(): FX.sphere(q + Vector3(0, 0.9, 0), FX.PYRO, 0.3, 0.9 + k * 0.12, 0.3, 0.55))
		FX.flash(origin + fwd * 1.5, FX.PYRO, 4.0, 7.0, 0.25)
	var hit_any: = false
	for e in get_tree().get_nodes_in_group("enemies"):
		if not e.alive: continue
		var d: Vector3 = e.global_position - global_position;d.y = 0
		var cone: = 75.0 if step < 4 else 35.0
		if d.length() < reach + e.hit_radius and rad_to_deg(fwd.angle_to(d)) < cone:
			_hit(e, mult, "pyro", global_position, 0.9 if step == 4 else 0.35)
			FX.particles(e.global_position + Vector3(0, 0.8, 0), FX.PYRO, 6, 2.5, 0.3, 0.06, 2.0)
			hit_any = hit_any or not e.is_object
	if hit_any:
		_sfx("hit", -4.0)
		gain_energy(0.7)
		if step == 4 and main: main.shake(0.1)


func _zahara_strike(mult: float, step: int) -> void :
	if ch().name != "Zahara": return
	var fwd: = facing_dir()
	var yaw: float = visual.rotation.y
	var impact: = global_position + fwd * 1.7
	if main: impact.y = main.world.height_at(impact.x, impact.z)
	if step < 3:
		var tilt: float = [0.0, 0.5, -0.15][step]
		FX.slash(global_position + Vector3(0, 0.95, 0) + fwd * 0.2, yaw, FX.LAVA, 2.5, 150.0, step == 2, tilt)
		FX.slash(global_position + Vector3(0, 0.95, 0) + fwd * 0.2, yaw, Color(1.0, 0.8, 0.35), 2.1, 120.0, step == 2, tilt)
	else:
		FX.ring(impact, FX.LAVA, 0.3, 3.3, 0.45, 0.25)
		FX.sphere(impact + Vector3(0, 0.2, 0), FX.LAVA.lightened(0.2), 0.3, 2.2, 0.35, 0.7)
		FX.flash(impact + Vector3(0, 1, 0), FX.LAVA, 5.0, 9.0, 0.3)
		FX.particles(impact + Vector3(0, 0.2, 0), Color(0.3, 0.22, 0.2), 14, 4.0, 0.6, 0.1, -9.0)
		if main: main.shake(0.2)
	FX.particles(impact + Vector3(0, 0.3, 0), FX.LAVA, 12, 4.0, 0.5, 0.07, -10.0)
	var hit_any: = false
	var r: = 2.5 if step < 3 else 2.2
	for e in get_tree().get_nodes_in_group("enemies"):
		if not e.alive: continue
		var d: Vector3 = e.global_position - global_position;d.y = 0
		var in_arc: bool = d.length() < r + 0.3 + e.hit_radius and rad_to_deg(fwd.angle_to(d)) < 80.0
		var in_slam: bool = step == 3 and e.global_position.distance_to(impact) < 2.7 + e.hit_radius
		if in_arc or in_slam:
			_hit(e, mult, "lava", global_position, 1.3 if step == 3 else 0.6)
			hit_any = hit_any or not e.is_object
	var n: = 2 if step < 3 else 5
	for k in n:
		_lava_shard(impact + Vector3(0, 0.45, 0), fwd.rotated(Vector3.UP, (k - (n - 1) * 0.5) * 0.24), mult * 0.32)
	if hit_any:
		_sfx("hit", -4.0)
		gain_energy(1.0)

func _lava_shard(from: Vector3, dir: Vector3, mult: float) -> void :
	var p: = FX.Projectile.new()
	p.velocity = (dir + Vector3(0, 0.08, 0)).normalized() * 16.0
	p.life = 0.55;p.trail_col = FX.LAVA;p.radius = 0.55
	p.on_hit = func(e, pos):
		_hit(e, mult, "lava", pos, 0.3)
		FX.sphere(pos, FX.LAVA, 0.2, 0.9, 0.25, 0.7)
		FX.particles(pos, FX.LAVA, 8, 3.5, 0.4, 0.06, -8.0)
	FX.add(p, from)
	var rock: = MeshInstance3D.new(); var pm: = PrismMesh.new();pm.size = Vector3(0.17, 0.36, 0.15)
	rock.mesh = pm;rock.material_override = FX.mat_emit(FX.LAVA.lightened(0.15), 3.0)
	rock.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	p.add_child(rock);rock.basis = Basis.looking_at(dir, Vector3.UP) * Basis(Vector3.RIGHT, - PI / 2)

func do_skill() -> void :
	var c: = ch()
	if not is_active() or c.skill_cd > 0.0 or attack_lock > 0.2: return
	c.skill_cd = c.skill_cd_max
	combo = 0
	var tgt: = nearest_enemy(12.0)
	if tgt: _face_towards(tgt.global_position - global_position, true)
	_show_weapon(c)
	match c.name:
		"Kaelith":
			_play("Skill", 0.08, 1.3)
			attack_lock = 0.75
			cat_attack = 1.0
			_sfx("splash")
			var center: = global_position + facing_dir() * 6.0
			if tgt: center = tgt.global_position
			cast_t = 0.4
			get_tree().create_timer(0.35, false).timeout.connect(_kaelith_vortex.bind(center))
		"Lyra":
			_play("Skill", 0.08, 1.3)
			attack_lock = 0.75
			_sfx("zap")
			cast_t = 0.35
			get_tree().create_timer(0.3, false).timeout.connect(_lyra_discharge)
		"Kael":
			_play("Skill", 0.06, 1.2)
			attack_lock = 0.72
			_sfx("slash")
			cast_t = 0.47
			get_tree().create_timer(0.42, false).timeout.connect(_kael_flame_wave)
		"Zahara":
			_play("Skill", 0.08, 1.1)
			attack_lock = 0.95
			_sfx("thud", -2.0)
			cast_t = 0.67
			get_tree().create_timer(0.62, false).timeout.connect(_zahara_torrent)


func _kael_flame_wave() -> void :
	if ch().name != "Kael": return
	var fwd: = facing_dir()
	var yaw: float = visual.rotation.y
	var origin: = global_position
	FX.slash(origin + Vector3(0, 1.0, 0) + fwd * 0.3, yaw, FX.PYRO, 3.0, 170.0, false, 0.12)
	FX.slash(origin + Vector3(0, 1.0, 0) + fwd * 0.3, yaw, Color(1.0, 0.9, 0.5), 2.6, 150.0, false, 0.12)
	FX.flash(origin + Vector3(0, 1.2, 0) + fwd, FX.PYRO, 5.0, 10.0, 0.35)
	_sfx("explode", -5.0)
	if main: main.shake(0.15)
	var state: = {"hit": {}}
	for k in 8:
		get_tree().create_timer(k * 0.055, false).timeout.connect(_flame_wave_step.bind(origin + fwd * (1.4 + k * 1.05), fwd, k, state))

func _flame_wave_step(p: Vector3, fwd: Vector3, k: int, state: Dictionary) -> void :
	if main: p.y = main.world.height_at(p.x, p.z)
	FX.column(p, FX.PYRO, 0.8 + k * 0.05, 1.5 + k * 0.08, 0.5)
	FX.sphere(p + Vector3(0, 0.6, 0), Color(1.0, 0.75, 0.3), 0.3, 1.1, 0.3, 0.5)
	FX.particles(p + Vector3(0, 0.5, 0), Color(1.0, 0.55 + randf() * 0.3, 0.15), 8, 3.0, 0.5, 0.08, 3.0)
	var who: = _index_of("Kael")
	var c: Dictionary = chars[who]
	for e in enemies_in(p, 1.7):
		var id: int = e.get_instance_id()
		if state.hit.has(id): continue
		state.hit[id] = true
		_hit(e, 2.6, "pyro", p - fwd, 1.0, who)
		e.apply_burn(c.atk * (1.0 + c.atk_buff) * 0.6, 4.0)
		if not e.is_object: gain_energy(2.5)


func _zahara_torrent() -> void :
	if ch().name != "Zahara": return
	var fwd: = facing_dir()
	var a: = global_position + fwd * 0.9
	var length: = 9.0
	var b: = a + fwd * length
	FX.ring(a, FX.LAVA, 0.4, 3.0, 0.5, 0.22)
	FX.flash(a + Vector3(0, 1, 0), FX.LAVA, 6.0, 12.0, 0.4)
	FX.particles(a + Vector3(0, 0.3, 0), Color(0.3, 0.22, 0.2), 16, 4.0, 0.7, 0.12, -9.0)
	if main: main.shake(0.25)
	_sfx("slam", -1.0)
	_sfx("explode", -6.0)

	var node: = MeshInstance3D.new()
	FX.world.add_child(node)
	node.global_position = a
	var right: = fwd.cross(Vector3.UP).normalized()
	var st: = SurfaceTool.new()
	st.begin(Mesh.PRIMITIVE_TRIANGLES)
	var seg: = 18
	var width: = 2.4
	for i in seg + 1:
		var along: = length * float(i) / seg
		var w: = width * lerpf(1.0, 0.8, float(i) / seg)
		for side in 2:
			var p: = a + fwd * along + right * (float(side) - 0.5) * w
			if main: p.y = main.world.height_at(p.x, p.z) + 0.07
			st.set_uv(Vector2(float(side), along))
			st.add_vertex(p - a)
	for i in seg:
		var k: = i * 2
		for idx in [k, k + 1, k + 2, k + 1, k + 3, k + 2]:
			st.add_index(idx)
	node.mesh = st.commit()
	var mat: = ShaderMaterial.new();mat.shader = LAVA_SHADER
	node.material_override = mat
	node.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	var tw: = node.create_tween()
	tw.tween_method( func(v: float): mat.set_shader_parameter("reach", v), 0.0, length + 0.5, 0.42).set_ease(Tween.EASE_OUT).set_trans(Tween.TRANS_QUAD)
	tw.tween_interval(2.7)
	tw.tween_method( func(v: float): mat.set_shader_parameter("cool", v), 0.0, 1.0, 0.5)
	tw.tween_method( func(v: float): mat.set_shader_parameter("fade", v), 1.0, 0.0, 0.45)
	tw.tween_callback(node.queue_free)
	for k in 5:
		var q: = a.lerp(b, k / 4.0)
		if main: q.y = main.world.height_at(q.x, q.z)
		get_tree().create_timer(k * 0.09, false).timeout.connect( func(): FX.particles(q + Vector3(0, 0.3, 0), FX.LAVA.lightened(0.15), 8, 4.5, 0.6, 0.08, -9.0))
	var light: = OmniLight3D.new();light.light_color = FX.LAVA;light.light_energy = 2.0;light.omni_range = 7.0
	light.shadow_enabled = false;node.add_child(light);light.position = (b - a) * 0.5 + Vector3(0, 1.0, 0)
	var state: = {"hit": {}, "a": a, "b": b}
	get_tree().create_timer(0.2, false).timeout.connect(_torrent_tick.bind(state, true))
	for i in 6:
		get_tree().create_timer(0.7 + i * 0.5, false).timeout.connect(_torrent_tick.bind(state, false))

func _torrent_tick(state: Dictionary, first: bool) -> void :
	var a: Vector3 = state.a
	var b: Vector3 = state.b
	var c: = chars[_index_of("Zahara")]
	for e in get_tree().get_nodes_in_group("enemies"):
		if not e.alive: continue
		var p: Vector3 = e.global_position
		var ab: = b - a;ab.y = 0
		var ap: = p - a;ap.y = 0
		var t: = clampf(ap.dot(ab) / ab.length_squared(), 0.0, 1.0)
		if (ap - ab * t).length() > 1.3 + e.hit_radius: continue
		var dmg_mult: = 2.2 if first else 0.42
		var dmg: float = c.atk * (1.0 + c.atk_buff) * dmg_mult * randf_range(0.93, 1.07)
		e.take_hit(dmg, "lava", Vector3.INF if not first else a, 0.9 if first else 0.0)
		stats.damage += dmg
		e.apply_burn(c.atk * (1.0 + c.atk_buff) * 0.5, 3.0)
		if first and not state.hit.has(e.get_instance_id()):
			state.hit[e.get_instance_id()] = true
			if not e.is_object: gain_energy(2.5)
	if not first:
		var q: Vector3 = a.lerp(b, randf())
		if main: q.y = main.world.height_at(q.x, q.z)
		FX.particles(q + Vector3(0, 0.2, 0), FX.LAVA.lightened(0.2), 6, 2.5, 0.5, 0.07, -6.0)

func _index_of(n: String) -> int:
	for i in chars.size():
		if chars[i].name == n: return i
	return active

func _kaelith_vortex(center: Vector3) -> void :
	var state: = {"hit": {}}
	FX.sphere(center + Vector3(0, 1.0, 0), FX.HYDRO, 0.3, 1.6, 0.4, 0.55)
	FX.flash(center + Vector3(0, 1.5, 0), FX.HYDRO, 3.0, 9.0, 0.4)
	for i in 10:
		get_tree().create_timer(i * 0.25, false).timeout.connect(_vortex_pull.bind(center))
	for i in 3:
		get_tree().create_timer(0.8 * (i + 1), false).timeout.connect(_vortex_tick.bind(center, state))

func _vortex_pull(center: Vector3) -> void :
	FX.ring(center, FX.HYDRO, 5.5, 0.6, 0.3, 0.12, 0.7)
	FX.sphere(center + Vector3(0, 1.0, 0), FX.HYDRO.lightened(0.2), 1.1, 0.4, 0.3, 0.35)
	for e in enemies_in(center, 6.5):
		e.pull_towards(center, 3.5)

func _vortex_tick(center: Vector3, state: Dictionary) -> void :
	var hits: = enemies_in(center, 3.2)
	var who: = _index_of("Kaelith")
	for e in hits:
		_hit(e, 1.25, "hydro", Vector3.INF, 1.0, who)
		FX.column(e.global_position, FX.HYDRO, 0.6, 2.2, 0.5)
		if not state.hit.has(e.get_instance_id()):
			state.hit[e.get_instance_id()] = true
			if not e.is_object: gain_energy(3.0)

	if hits.size() >= 2 and chars[0].skill_cd > 0.0:
		chars[0].skill_cd = maxf(0.0, chars[0].skill_cd - 0.5 * (hits.size() - 1))
		FX.float_text(center + Vector3(0, 2.5, 0), "Écho des flots", FX.HYDRO.lightened(0.3), 40)

func _lyra_discharge() -> void :
	var p: = global_position + Vector3(0, 0.9, 0)
	FX.sphere(p, FX.ELECTRO, 0.4, 5.2, 0.35, 0.55)
	FX.ring(global_position, FX.ELECTRO, 0.6, 5.5, 0.4, 0.12)
	FX.flash(p, FX.ELECTRO, 6.0, 12.0, 0.35)
	_sfx("thunder", -3.0)
	for i in 12:
		var a: = TAU * i / 12.0
		FX.bolt(p, p + Vector3(cos(a) * 5.0, randf_range(-0.6, 0.8), sin(a) * 5.0), FX.ELECTRO, 0.07, 0.25, 0.5)
	var n: = 0
	for e in enemies_in(global_position, 5.0):
		_hit(e, 2.3, "electro", global_position, 1.2, _index_of("Lyra"))
		e.apply_stun(0.9)
		if not e.is_object: n += 1
	gain_energy(3.0 * mini(n, 3))
	if main: main.shake(0.2)

func do_burst() -> void :
	var c: = ch()
	if not is_active() or c.burst_cd > 0.0 or c.energy < c.energy_max: return
	c.energy = 0.0
	c.burst_cd = c.burst_cd_max
	combo = 0
	iframe = 1.4
	attack_lock = 1.2
	var tgt: = nearest_enemy(12.0)
	if tgt: _face_towards(tgt.global_position - global_position, true)
	_play("Burst", 0.08, 1.0)
	cat_attack = 1.4
	_show_weapon(c)
	_sfx("burst")
	if main:
		main.burst_cutin(c.name)
	cast_t = 1.05
	match c.name:
		"Kaelith": get_tree().create_timer(0.95, false).timeout.connect(_kaelith_wave)
		"Lyra": get_tree().create_timer(0.95, false).timeout.connect(_lyra_storm_start)
		"Kael": get_tree().create_timer(1.0, false).timeout.connect(_kael_inferno_start)
		"Zahara": get_tree().create_timer(0.97, false).timeout.connect(_zahara_eruption)

func _kaelith_wave() -> void :
	var p: = global_position
	FX.column(p, FX.HYDRO, 1.3, 7.0, 1.0)
	for i in 3:
		get_tree().create_timer(i * 0.18, false).timeout.connect( func(): FX.ring(p, FX.HYDRO.lightened(i * 0.15), 1.0, 11.0, 0.9, 0.22, 0.85))
	FX.sphere(p + Vector3(0, 1, 0), FX.HYDRO, 1.0, 10.5, 0.8, 0.35)
	FX.particles(p + Vector3(0, 1.5, 0), FX.HYDRO.lightened(0.3), 60, 11.0, 1.2, 0.16)
	FX.flash(p + Vector3(0, 3, 0), FX.HYDRO, 8.0, 20.0, 0.8)
	_sfx("splash", 2.0)
	if main: main.shake(0.5)
	for e in enemies_in(p, 10.5):
		_hit(e, 5.2, "hydro", p, 2.5, _index_of("Kaelith"))
	for o in chars:
		if o.alive:
			o.hp = minf(o.max_hp, o.hp + o.max_hp * 0.3)
	FX.float_text(p + Vector3(0, 2.4, 0), "+30% PV", FX.HEAL, 60, 1.6, 1.3)
	FX.particles(p + Vector3(0, 1.0, 0), FX.HEAL, 30, 3.0, 1.2, 0.1, 2.0)

func _lyra_storm_start() -> void :
	storm_t = 8.0
	storm_tick = 0.2
	for o in chars: o.atk_speed = 1.3
	var p: = global_position
	FX.sphere(p + Vector3(0, 1, 0), FX.ELECTRO, 0.5, 6.5, 0.45, 0.5)
	for i in 6:
		var q: = p + Vector3(randf_range(-4, 4), 0, randf_range(-4, 4))
		FX.bolt(q + Vector3(0, 14, 0), q, FX.ELECTRO, 0.16, 0.3, 0.8)
	FX.flash(p + Vector3(0, 4, 0), FX.ELECTRO, 10.0, 22.0, 0.6)
	_sfx("thunder", 2.0)
	if main: main.shake(0.45)
	for e in enemies_in(p, 6.5):
		_hit(e, 3.0, "electro", p, 1.5, _index_of("Lyra"))
	if storm_node:
		storm_node.queue_free()
	storm_node = Node3D.new();add_child(storm_node)
	var cloud: = MeshInstance3D.new(); var cyl: = CylinderMesh.new();cyl.top_radius = 7.5;cyl.bottom_radius = 9.0;cyl.height = 1.2
	cloud.mesh = cyl;cloud.material_override = FX.mat_emit(Color(0.28, 0.18, 0.45), 1.2, 0.6)
	cloud.position.y = 11.0;storm_node.add_child(cloud)
	var ring: = MeshInstance3D.new(); var tm: = TorusMesh.new();tm.inner_radius = 8.6;tm.outer_radius = 9.0;tm.rings = 48
	ring.mesh = tm;ring.material_override = FX.mat_emit(FX.ELECTRO, 2.0, 0.6);ring.position.y = 0.15
	storm_node.add_child(ring)



func _kael_inferno_start() -> void :
	if ch().name != "Kael": return
	inferno_t = 10.0
	inferno_tick = 0.3
	var p: = global_position
	FX.sphere(p + Vector3(0, 1, 0), FX.PYRO, 0.5, 5.5, 0.45, 0.55)
	for i in 3:
		get_tree().create_timer(i * 0.12, false).timeout.connect( func(): FX.ring(p, FX.PYRO.lightened(i * 0.15), 0.8, 6.5, 0.6, 0.2))
	FX.flash(p + Vector3(0, 2, 0), FX.PYRO, 9.0, 18.0, 0.6)
	FX.particles(p + Vector3(0, 1, 0), FX.PYRO, 40, 8.0, 0.8, 0.12, 2.0)
	FX.float_text(p + Vector3(0, 2.4, 0), "Brasier : +25% dégâts", Color(1.0, 0.75, 0.4), 44, 1.4, 1.4)
	_sfx("explode", 1.0)
	if main: main.shake(0.4)
	var c: = ch()
	for e in enemies_in(p, 5.5):
		_hit(e, 2.8, "pyro", p, 1.5)
		e.apply_burn(c.atk * (1.0 + c.atk_buff) * 0.6, 4.0)
	if inferno_node: inferno_node.queue_free()
	inferno_node = Node3D.new();add_child(inferno_node)
	var ring: = MeshInstance3D.new(); var tm: = TorusMesh.new();tm.inner_radius = 4.55;tm.outer_radius = 5.0;tm.rings = 48;tm.ring_segments = 6
	ring.mesh = tm;ring.material_override = FX.mat_emit(FX.PYRO, 2.5, 0.75);ring.position.y = 0.12
	ring.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	inferno_node.add_child(ring)

	var outer: = CylinderMesh.new();outer.top_radius = 0.0;outer.bottom_radius = 0.17;outer.height = 0.62;outer.radial_segments = 8;outer.rings = 1
	var core: = CylinderMesh.new();core.top_radius = 0.0;core.bottom_radius = 0.09;core.height = 0.4;core.radial_segments = 6;core.rings = 1
	for i in 6:
		var f: = MeshInstance3D.new();f.mesh = outer;f.name = "Flame%d" % i
		f.material_override = FX.mat_emit(Color(1.0, 0.45, 0.12), 2.8, 0.85)
		f.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
		var a: = TAU * i / 6.0
		f.position = Vector3(cos(a) * 1.25, 0.75 + 0.3 * sin(a * 2.0), sin(a) * 1.25)
		var k: = MeshInstance3D.new();k.mesh = core;k.position = Vector3(0, -0.08, 0)
		k.material_override = FX.mat_emit(Color(1.0, 0.85, 0.4), 3.5)
		k.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
		f.add_child(k)
		inferno_node.add_child(f)
	var l: = OmniLight3D.new();l.light_color = FX.PYRO;l.light_energy = 1.6;l.omni_range = 6.0;l.position.y = 1.2
	l.shadow_enabled = false
	inferno_node.add_child(l)

func _inferno_update(delta: float) -> void :
	inferno_t -= delta
	if inferno_node:
		inferno_node.rotation.y += delta * 3.0
		var tt: = Time.get_ticks_msec() * 0.001
		for i in 6:
			var f: = inferno_node.get_node_or_null("Flame%d" % i) as Node3D
			if f: f.scale = Vector3(1.0, 0.8 + 0.35 * absf(sin(tt * 9.0 + i * 1.7)), 1.0)
	if ch().name != "Kael": inferno_t = 0.0
	inferno_tick -= delta
	if inferno_tick <= 0.0 and inferno_t > 0.0:
		inferno_tick = 0.5
		var hits: = enemies_in(global_position, 5.0)
		for e in hits:
			_hit(e, 0.55, "pyro", Vector3.INF, 0.2)
			FX.particles(e.global_position + Vector3(0, 0.8, 0), FX.PYRO, 6, 2.0, 0.4, 0.07, 2.0)
		if hits.size() > 0:
			_sfx("hit", -10.0)
			gain_energy(0.4)
		for k in 2:
			var a: = randf() * TAU
			FX.column(global_position + Vector3(cos(a) * 4.8, 0, sin(a) * 4.8), FX.PYRO, 0.35, 1.4, 0.45)
	if inferno_t <= 0.0:
		inferno_t = 0.0
		if inferno_node:
			FX.particles(global_position + Vector3(0, 1, 0), FX.PYRO, 20, 4.0, 0.5, 0.08, 2.0)
			inferno_node.queue_free();inferno_node = null



func _zahara_eruption() -> void :
	if ch().name != "Zahara": return
	var p: = global_position
	var c: = ch()
	FX.column(p, FX.LAVA, 1.6, 9.0, 1.2)
	for i in 3:
		get_tree().create_timer(i * 0.15, false).timeout.connect( func(): FX.ring(p, FX.LAVA.lightened(i * 0.12), 1.0, 8.0, 0.9, 0.25, 0.9))
	FX.sphere(p + Vector3(0, 1, 0), FX.LAVA, 1.0, 7.5, 0.7, 0.4)
	FX.particles(p + Vector3(0, 1.5, 0), FX.LAVA, 60, 12.0, 1.4, 0.18, -14.0)
	FX.particles(p + Vector3(0, 1.0, 0), Color(0.25, 0.18, 0.16), 26, 6.0, 1.2, 0.2, -4.0)
	FX.flash(p + Vector3(0, 3, 0), FX.LAVA, 10.0, 22.0, 0.9)
	_sfx("explode", 3.0)
	_sfx("slam")
	if main: main.shake(0.7)
	for i in 7:
		var a: = TAU * i / 7.0 + randf() * 0.4
		var q: = p + Vector3(cos(a), 0, sin(a)) * randf_range(3.0, 6.2)
		get_tree().create_timer(0.1 + i * 0.07, false).timeout.connect(_geyser.bind(q))
	for e in enemies_in(p, 7.5):
		_hit(e, 5.6, "lava", p, 2.5)
		e.apply_res_down(10.0)
		e.apply_burn(c.atk * (1.0 + c.atk_buff) * 0.7, 5.0)

func _geyser(q: Vector3) -> void :
	if main: q.y = main.world.height_at(q.x, q.z)
	FX.column(q, FX.LAVA, 0.55, 4.0, 0.8)
	FX.particles(q + Vector3(0, 0.5, 0), FX.LAVA.lightened(0.2), 12, 7.0, 0.9, 0.1, -12.0)
	FX.ring(q, FX.LAVA, 0.2, 1.4, 0.4, 0.3)

func _storm_update(delta: float) -> void :
	storm_t -= delta
	storm_tick -= delta
	if storm_node: storm_node.rotation.y += delta * 0.8
	if storm_tick <= 0.0:
		storm_tick = 0.55
		var targets: = enemies_in(global_position, 9.0)
		var q: = global_position + Vector3(randf_range(-6, 6), 0, randf_range(-6, 6))
		if targets.size() > 0:
			var e: Enemy = targets[randi() % targets.size()]
			q = e.global_position
		FX.bolt(q + Vector3(randf_range(-1, 1), 11.0, randf_range(-1, 1)), q, FX.ELECTRO, 0.12, 0.2, 0.7)
		FX.sphere(q + Vector3(0, 0.3, 0), FX.ELECTRO, 0.2, 1.8, 0.25, 0.6)
		FX.flash(q + Vector3(0, 2, 0), FX.ELECTRO, 3.0, 8.0, 0.2)
		_sfx("zap", -6.0)
		for e in enemies_in(q, 2.2):
			_hit(e, 1.15, "electro", q, 0.5, _index_of("Lyra"))
	if storm_t <= 0.0:
		for o in chars: o.atk_speed = 1.0
		if storm_node:
			storm_node.queue_free()
			storm_node = null

func do_jump() -> void :
	if not is_active(): return
	if gliding:
		stop_glide();return
	if is_on_floor():
		if attack_lock > 0.3: return
		velocity.y = JUMP_V
		_play("Jump", 0.08, 1.2)
		_sfx("jump", -4.0)
		return

	if main and air_t > 0.15 and stamina > 5.0:
		var ground: float = main.world.height_at(global_position.x, global_position.z)
		if global_position.y - ground > 2.4:
			start_glide()

func start_glide() -> void :
	gliding = true
	if glider_tw: glider_tw.kill()
	glider.visible = true
	glider.scale = Vector3.ONE * 0.05
	glider_tw = glider.create_tween()
	glider_tw.tween_property(glider, "scale", Vector3.ONE, 0.25).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	velocity.y = maxf(velocity.y, -1.0)
	_play("Glide", 0.2, 1.0)
	_sfx("glide")
	FX.particles(global_position + Vector3(0, 2.2, 0), Color(0.9, 0.95, 1.0), 14, 2.5, 0.5, 0.06, 0.0)

func stop_glide() -> void :
	if not gliding: return
	gliding = false
	if glider_tw: glider_tw.kill()
	glider_tw = glider.create_tween()
	glider_tw.tween_property(glider, "scale", Vector3.ONE * 0.05, 0.15)
	glider_tw.tween_callback( func(): glider.visible = false)
	visual.rotation.x = 0.0

func do_dash() -> void :
	if not is_active() or dash_t > 0.0 or stamina < 18.0 or attack_lock > 0.3: return
	stamina -= 18.0
	dash_t = 0.22;iframe = maxf(iframe, 0.3)
	var dirs: = _cam_basis_dirs()
	var d: Vector3 = dirs[0] * input_vec.y + dirs[1] * input_vec.x
	dash_dir = d.normalized() if d.length() > 0.1 else facing_dir()
	_face_towards(dash_dir, true)
	_play("Dash", 0.05, 1.4)
	_sfx("dash", -3.0)
	FX.particles(global_position + Vector3(0, 0.6, 0), FX.element_color(ch().element), 12, 3.0, 0.35, 0.08, 0.0)

func switch_to(i: int) -> void :
	if i == active or i >= chars.size() or switch_cd > 0.0 or not chars[i].alive or attack_lock > 0.4 or cast_t > 0.0: return
	var y: float = visual.rotation.y
	active = i
	switch_cd = 1.0
	attack_lock = 0.0;combo = 0;combo_timer = 0.0
	_show_active()
	visual.rotation.y = y
	FX.sphere(global_position + Vector3(0, 0.9, 0), FX.element_color(ch().element), 0.3, 1.6, 0.3, 0.6)
	FX.particles(global_position + Vector3(0, 0.9, 0), FX.element_color(ch().element), 20, 4.0, 0.5, 0.08)

var test_invuln: = false
var hits_taken: = 0
func take_damage(amount: float, elem: String, from: Vector3) -> void :
	if not is_active() or iframe > 0.0: return
	hits_taken += 1
	if test_invuln:
		FX.float_text(global_position + Vector3(0, 1.9, 0), str(int(amount)), Color(1, 0.35, 0.35), 50)
		iframe = 0.5
		return
	var c: = ch()
	var dmg: = amount * randf_range(0.9, 1.1)
	c.hp -= dmg
	iframe = 0.5
	FX.float_text(global_position + Vector3(0, 1.9, 0), str(int(dmg)), Color(1, 0.35, 0.35), 50)
	_sfx("hurt", -2.0)
	if gliding: stop_glide()
	if main: main.on_player_hit()
	var push: = global_position - from;push.y = 0
	velocity += push.normalized() * 5.0 + Vector3(0, 3, 0)
	if attack_lock <= 0.0: _play("Hit", 0.05, 1.3)

	if c.hp > 0.0 and c.passive_cd <= 0.0 and (c.name == "Kael" or c.name == "Zahara"):
		var kael: bool = c.name == "Kael"
		c.passive_cd = 1.5
		c.atk_buff = 0.2 if kael else 0.25
		c.atk_buff_t = 6.0
		var heal: float = c.max_hp * (0.04 if kael else 0.05)
		c.hp = minf(c.max_hp, c.hp + heal)
		var col: Color = FX.PYRO if kael else FX.LAVA
		FX.float_text(global_position + Vector3(0, 2.35, 0), ("Cœur ardent" if kael else "Cœur de volcan") + "  +%d PV" % int(heal), col, 40, 1.3, 1.1)
		FX.particles(global_position + Vector3(0, 1.0, 0), col, 14, 2.5, 0.6, 0.08, 2.0)
	if c.hp <= 0.0:
		c.hp = 0.0;c.alive = false
		FX.float_text(global_position + Vector3(0, 2.2, 0), "K.O.", Color(1, 0.4, 0.4), 70)
		for k in chars.size():
			if chars[k].alive:
				switch_cd = 0.0;attack_lock = 0.0;cast_t = 0.0;switch_to(k);return
		dead_t = 2.5
		if main: main.on_party_down()

func revive_all() -> void :
	for o in chars:
		o.alive = true;o.hp = o.max_hp
	dead_t = 0.0


func _physics_process(delta: float) -> void :
	var c: = ch()
	for o in chars:
		o.skill_cd = maxf(0.0, o.skill_cd - delta)
		o.burst_cd = maxf(0.0, o.burst_cd - delta)
		o.passive_cd = maxf(0.0, o.passive_cd - delta)
		if o.atk_buff_t > 0.0:
			o.atk_buff_t -= delta
			if o.atk_buff_t <= 0.0: o.atk_buff = 0.0
		if o.weapon_t > 0.0:
			o.weapon_t -= delta
			if o.weapon_t <= 0.0: _hide_weapon(o)
	switch_cd = maxf(0.0, switch_cd - delta)
	var striking: bool = attack_lock > 0.04 and (cur_anim.begins_with("Attack") or cur_anim == "Skill" or cur_anim == "Burst")
	for i in chars.size():
		var o: Dictionary = chars[i]
		if o.trail:
			o.trail.emitting = i == active and striking and o.weapon_node != null and o.weapon_node.visible
	cast_t = maxf(0.0, cast_t - delta)
	iframe = maxf(0.0, iframe - delta)
	lyra_passive_cd = maxf(0.0, lyra_passive_cd - delta)
	combo_timer -= delta
	if combo_timer <= 0.0: combo = 0
	if storm_t > 0.0: _storm_update(delta)
	if inferno_t > 0.0: _inferno_update(delta)
	if dead_t > 0.0:
		dead_t -= delta
		if dead_t <= 0.0 and main: main.respawn_party()
	var was_air: = not is_on_floor()
	if was_air:
		air_t += delta
		fall_speed = maxf(fall_speed, - velocity.y)
		if gliding:
			velocity.y = lerpf(velocity.y, - GLIDE_SINK, 5.0 * delta)
			stamina = maxf(0.0, stamina - 4.0 * delta)
			if stamina <= 0.0: stop_glide()
		else:
			velocity.y -= GRAV * delta
	var dirs: = _cam_basis_dirs()
	var want: Vector3 = (dirs[0] * input_vec.y + dirs[1] * input_vec.x) if (enabled and dead_t <= 0.0) else Vector3.ZERO
	var mag: = minf(want.length(), 1.0)
	var spd: = 0.0
	loco = ""
	if mag > 0.05:
		spd = WALK if mag < 0.55 else RUN
		loco = "walk" if mag < 0.55 else "run"
		if sprint_held and stamina > 0.0 and is_on_floor():
			spd = SPRINT;loco = "sprint";stamina = maxf(0.0, stamina - 20.0 * delta)
	if gliding:
		spd = GLIDE_SPEED if mag > 0.05 else GLIDE_SPEED * 0.6
		loco = ""
		if mag <= 0.05: want = facing_dir()
	elif not (sprint_held and mag > 0.05) and is_on_floor():
		stamina = minf(100.0, stamina + 28.0 * delta)
	if land_lock > 0.0:
		land_lock -= delta
		spd *= 0.35
	if attack_lock > 0.0:
		attack_lock -= delta
		spd *= 0.15
	var hv: = want.normalized() * spd
	if lunge_t > 0.0:
		lunge_t -= delta
		hv += facing_dir() * lunge_v
	if dash_t > 0.0:
		dash_t -= delta
		hv = dash_dir * 15.0
	velocity.x = lerpf(velocity.x, hv.x, 12.0 * delta)
	velocity.z = lerpf(velocity.z, hv.z, 12.0 * delta)
	if (mag > 0.05 or gliding) and attack_lock <= 0.0: _face_towards(want, false, delta * (0.5 if gliding else 1.0))
	move_and_slide()
	if is_on_floor():
		if was_air:
			if gliding: stop_glide()
			if air_t > 0.4 and fall_speed > 6.0:
				land_lock = 0.18
				_play("Land", 0.06, 1.3)
				_sfx("land", -3.0)
				FX.particles(global_position + Vector3(0, 0.1, 0), Color(0.85, 0.8, 0.7), 10, 2.0, 0.4, 0.07, -3.0)
		air_t = 0.0;fall_speed = 0.0
	visual.rotation.x = lerpf(visual.rotation.x, 0.28 if gliding else 0.0, 6.0 * delta)
	_update_catalyst(delta)
	if global_position.y < -3.0 and main:
		main.respawn_party(false)

	if attack_lock > 0.0 or cur_anim == "Hit" and ch().ap.is_playing():
		pass
	elif dash_t > 0.0 and cur_anim == "Dash":
		pass
	elif gliding:
		_play("Glide", 0.2, 1.0)
	elif land_lock > 0.0 and cur_anim == "Land":
		pass
	elif not is_on_floor() and (velocity.y < 6.0 or cur_anim == "Jump"):
		if air_t > 0.55 and velocity.y < -5.0:
			_play("Fall", 0.25, 1.0)
		elif cur_anim != "Jump" and cur_anim != "Fall": _play("Jump", 0.15, 1.0)
	else:
		var hs: = Vector2(velocity.x, velocity.z).length()
		var a: = ""
		if loco == "sprint" and hs > RUN * 0.9 and c.ap.has_animation("Sprint"): a = "Sprint"
		elif hs > 0.35 and (loco == "run" or loco == "sprint"): a = "Run"
		elif hs > 0.35 and loco == "walk": a = "Walk"
		elif hs > 2.4: a = "Run"
		if a != "":

			var nat: float = c.gait.get(a, 4.0)
			var sc: = clampf(hs / nat, 0.45, 1.9)
			_play(a, 0.22, sc)

			var ap: AnimationPlayer = c.ap
			if ap.current_animation_length > 0.0:
				step_t -= delta * sc
				if step_t <= 0.0:
					step_t = ap.current_animation_length * 0.5
					_sfx("step", -14.0 if a == "Walk" else -10.0)
		else:
			var fighting: = nearest_enemy(12.0, 360.0, true) != null
			_play("Idle_Combat" if fighting else "Idle", 0.25, 1.0)
			if fighting: _show_weapon(c)
	_lean(delta)

func _update_catalyst(delta: float) -> void :
	if catalyst == null or not catalyst.is_inside_tree(): return
	var t: = Time.get_ticks_msec() / 1000.0
	cat_attack = maxf(0.0, cat_attack - delta)
	var rest: = Vector3(-0.55, 1.2 + sin(t * 2.0) * 0.06, 0.25)
	var cast: = Vector3(-0.35, 1.35, 0.75)
	var k: = clampf(cat_attack * 2.5, 0.0, 1.0)
	catalyst.position = catalyst.position.lerp(rest.lerp(cast, k), clampf(10.0 * delta, 0.0, 1.0))
	catalyst.rotation = Vector3(0.35 + 0.1 * sin(t * 1.3), sin(t * 0.7) * 0.3 + k * 0.4, 0.15 * sin(t * 1.7))
	if catalyst_gem and catalyst_gem.get_child_count() > 0:
		(catalyst_gem.get_child(0) as OmniLight3D).light_energy = 0.5 + k * 2.5


func _lean(delta: float) -> void :
	var yaw: float = visual.rotation.y
	var rate: = wrapf(yaw - last_yaw, - PI, PI) / maxf(delta, 0.001)
	last_yaw = yaw
	var hs: = Vector2(velocity.x, velocity.z).length()
	var target: = 0.0
	if is_on_floor() and cur_anim in LOCO and attack_lock <= 0.0:
		target = clampf( - rate * hs * 0.016, -0.2, 0.2)
	roll = lerpf(roll, target, clampf(7.0 * delta, 0.0, 1.0))
	visual.rotation.z = roll
