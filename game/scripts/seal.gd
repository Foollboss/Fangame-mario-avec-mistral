class_name Seal
extends Enemy



signal activated(seal: Seal)

var need: = "hydro"
var index: = 0
var active: = false
var orb: MeshInstance3D
var orb_mat: StandardMaterial3D
var rune_mat: StandardMaterial3D
var beam: MeshInstance3D
var last_hydro: = -100.0
var last_electro: = -100.0
var _tt: = 0.0

const NAMES: = {"hydro": "Sceau de l'Onde", "electro": "Sceau de l'Éclair", "charged": "Sceau de la Tempête"}

func setup_seal(w: World, i: int, need_elem: String, pos: Vector3) -> void :
	index = i;need = need_elem;home = pos
	is_object = true;alive = true;kind = "seal";element = ""
	hit_radius = 1.3;max_hp = 1.0;hp = 1.0
	add_to_group("enemies")
	collision_layer = 1;collision_mask = 0
	var cs: = CollisionShape3D.new(); var cy: = CylinderShape3D.new();cy.radius = 0.9;cy.height = 4.2
	cs.shape = cy;cs.position.y = 2.1;add_child(cs)
	model = Node3D.new();add_child(model)
	var col: = _need_color()
	var body: = w.make_prop("Seal", Color(0.35, 0.35, 0.42))
	model.add_child(body)

	for s in body.mesh.get_surface_count():
		var m: = body.get_surface_override_material(s)
		if m is StandardMaterial3D and body.mesh.surface_get_material(s).resource_name == "tint_seal":
			rune_mat = m
	orb = w.make_prop("SealOrb", col.darkened(0.35))
	model.add_child(orb);orb.position = Vector3(0, 4.9, 0)
	orb_mat = StandardMaterial3D.new();orb_mat.albedo_color = col.darkened(0.4)
	orb_mat.emission_enabled = true;orb_mat.emission = col;orb_mat.emission_energy_multiplier = 0.25
	orb.material_override = orb_mat
	var l: = Label3D.new();l.text = NAMES[need];l.font_size = 40;l.pixel_size = 0.01;l.position = Vector3(0, 6.3, 0)
	l.billboard = BaseMaterial3D.BILLBOARD_ENABLED;l.modulate = col.lightened(0.3);l.outline_size = 10
	l.outline_modulate = Color(0.05, 0.05, 0.12, 0.9)
	model.add_child(l)

func _need_color() -> Color:
	match need:
		"hydro": return FX.HYDRO
		"electro": return FX.ELECTRO
	return Color(0.95, 0.6, 1.0)

func set_active(on: bool, silent: = false) -> void :
	active = on
	if on:
		remove_from_group("enemies")
		orb_mat.emission = Color(1.0, 0.9, 0.55);orb_mat.albedo_color = Color(1.0, 0.9, 0.6);orb_mat.emission_energy_multiplier = 2.5
		if rune_mat:
			rune_mat.albedo_color = Color(1.0, 0.85, 0.5);rune_mat.emission_enabled = true
			rune_mat.emission = Color(1.0, 0.8, 0.4);rune_mat.emission_energy_multiplier = 1.5
		beam = MeshInstance3D.new(); var cm: = CylinderMesh.new();cm.top_radius = 0.5;cm.bottom_radius = 0.8;cm.height = 60.0
		cm.cap_top = false;cm.cap_bottom = false
		beam.mesh = cm;beam.material_override = FX.mat_emit(Color(1.0, 0.85, 0.5), 1.6, 0.28)
		beam.position.y = 34.0;beam.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
		model.add_child(beam)
		if not silent:
			FX.column(global_position, Color(1.0, 0.85, 0.45), 1.6, 9.0, 1.4)
			FX.particles(global_position + Vector3(0, 4.9, 0), Color(1.0, 0.9, 0.5), 50, 7.0, 1.2, 0.12, -3.0)
			FX.flash(global_position + Vector3(0, 5, 0), Color(1.0, 0.85, 0.5), 8.0, 20.0, 1.0)
			activated.emit(self)

func take_hit(amount: float, elem: String, from: Vector3 = Vector3.INF, power: = 1.0) -> void :
	if active or elem == "": return
	var now: = Time.get_ticks_msec() / 1000.0
	if elem == "hydro": last_hydro = now
	if elem == "electro": last_electro = now
	FX.sphere(global_position + Vector3(0, 4.9, 0), FX.element_color(elem), 0.5, 1.6, 0.3, 0.6)
	var ok: = false
	match need:
		"hydro": ok = elem == "hydro"
		"electro": ok = elem == "electro"
		"charged":

			ok = (elem == "hydro" or elem == "electro") and now - last_hydro < 6.0 and now - last_electro < 6.0
			if not ok:
				var hint: = "Le sceau ne réagit pas…"
				if elem == "hydro": hint = "Hydro reçu… il manque l'Électro !"
				elif elem == "electro": hint = "Électro reçu… il manque l'Hydro !"
				FX.float_text(global_position + Vector3(0, 5.8, 0), hint, FX.element_color(elem).lightened(0.3), 38, 1.0, 1.4)
	if ok:
		if need == "charged":
			FX.float_text(global_position + Vector3(0, 6.0, 0), "Électro-chargé !", Color(0.8, 0.55, 1.0), 60, 1.4, 1.2)
		set_active(true)
	elif need != "charged":
		FX.float_text(global_position + Vector3(0, 5.8, 0), "Le sceau ne réagit pas…", Color(0.85, 0.85, 0.9), 38, 1.0, 1.2)

func _physics_process(delta: float) -> void :
	_tt += delta
	if orb:
		orb.position.y = 4.9 + sin(_tt * 1.5) * 0.12
		orb.rotation.y += delta * (1.5 if active else 0.4)
	if beam:
		beam.rotation.y += delta * 0.5

func apply_stun(_t2: float) -> void :
	pass

func pull_towards(_p: Vector3, _s: float) -> void :
	pass
