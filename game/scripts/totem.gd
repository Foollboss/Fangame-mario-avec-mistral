class_name Totem
extends Enemy



signal lit(t: Totem)

var needs: Array = ["pyro"]
var active: = false
var style: = "totem"
var orb: MeshInstance3D
var orb_mat: StandardMaterial3D
var light: OmniLight3D
var label: Label3D
var _tt: = 0.0

const NAMES: = {"pyro": "Feu", "lava": "Lave", "hydro": "Hydro", "electro": "Électro", "cryo": "Cryo"}

func setup_totem(w: World, need: Array, style_: String) -> void :
	needs = need;style = style_
	is_object = true;alive = true;kind = "totem";element = ""
	hit_radius = 1.0;max_hp = 1.0;hp = 1.0
	add_to_group("enemies")
	collision_layer = 1;collision_mask = 0
	var cs: = CollisionShape3D.new(); var cy: = CylinderShape3D.new();cy.radius = 0.7;cy.height = 3.2
	cs.shape = cy;cs.position.y = 1.6;add_child(cs)
	model = Node3D.new();add_child(model)
	var col: = FX.element_color(needs[0])
	if style == "brazier":
		var b: = w.make_prop("Brazier");model.add_child(b);b.scale = Vector3.ONE * 1.3
	else:
		var t: = w.make_prop("Totem", col.darkened(0.55));model.add_child(t)
	orb = MeshInstance3D.new(); var sm: = SphereMesh.new();sm.radius = 0.32;sm.height = 0.64
	orb.mesh = sm
	orb_mat = StandardMaterial3D.new();orb_mat.albedo_color = col.darkened(0.5)
	orb_mat.emission_enabled = true;orb_mat.emission = col;orb_mat.emission_energy_multiplier = 0.3
	orb.material_override = orb_mat
	orb.position.y = 2.45 if style == "brazier" else 3.7
	model.add_child(orb)
	light = OmniLight3D.new();light.light_color = col;light.light_energy = 0.0;light.omni_range = 7.0
	light.position.y = 3.0;light.shadow_enabled = false;model.add_child(light)
	label = Label3D.new();label.font_size = 34;label.pixel_size = 0.01;label.billboard = BaseMaterial3D.BILLBOARD_ENABLED
	label.outline_size = 10;label.outline_modulate = Color(0.04, 0.05, 0.12, 0.9)
	label.text = " / ".join(needs.map( func(e): return NAMES.get(e, e)))
	label.modulate = col.lightened(0.35);label.position.y = 4.6
	model.add_child(label)

func take_hit(_amount: float, elem: String, _from: Vector3 = Vector3.INF, _power: = 1.0) -> void :
	if active or elem == "": return
	if elem in needs:
		set_active()
	else:
		FX.float_text(global_position + Vector3(0, 4.2, 0), "Il faut : " + label.text, Color(0.9, 0.9, 0.95), 36, 1.0, 1.1)

func set_active() -> void :
	active = true
	remove_from_group("enemies")
	var col: = FX.element_color(needs[0])
	orb_mat.albedo_color = col.lightened(0.3);orb_mat.emission_energy_multiplier = 3.0
	light.light_energy = 2.2
	label.visible = false
	FX.column(global_position, col, 0.9, 6.0, 0.9)
	FX.particles(global_position + Vector3(0, 2.6, 0), col, 30, 5.0, 0.9, 0.1, -3.0)
	if style == "brazier":
		_flame()
	lit.emit(self)

func _flame() -> void :
	var f: = CPUParticles3D.new()
	var sm: = SphereMesh.new();sm.radius = 0.18;sm.height = 0.36;sm.radial_segments = 6;sm.rings = 3
	sm.material = FX.mat_emit(Color(1.0, 0.55, 0.18), 3.0, 0.85, true)
	f.mesh = sm;f.amount = 18;f.lifetime = 0.8
	f.direction = Vector3.UP;f.spread = 14.0;f.gravity = Vector3(0, 2.5, 0)
	f.initial_velocity_min = 0.6;f.initial_velocity_max = 1.4
	f.scale_amount_min = 0.8;f.scale_amount_max = 1.6
	var curve: = Curve.new();curve.add_point(Vector2(0, 1));curve.add_point(Vector2(1, 0));f.scale_amount_curve = curve
	var grad: = Gradient.new();grad.set_color(0, Color(1.0, 0.85, 0.4));grad.set_color(1, Color(1.0, 0.3, 0.1, 0.0))
	f.color_ramp = grad
	f.position.y = 2.2
	model.add_child(f)

func _physics_process(delta: float) -> void :
	_tt += delta
	if orb:
		orb.position.y = (2.45 if style == "brazier" else 3.7) + sin(_tt * 1.8) * 0.08
		orb.rotation.y += delta * (2.0 if active else 0.5)

func apply_stun(_t2: float) -> void :
	pass

func pull_towards(_p: Vector3, _s: float) -> void :
	pass
