class_name CarVisual
extends Node3D
## Modèle 3D d'une voiture (glb généré par Blender) + effets : roues, suspension,
## flammes de nitro, fumée de drift, étincelles, phares.

var model: Node3D
var body_root: Node3D
var wheels: Array[Node3D] = []
var front_wheels: Array[Node3D] = []
var wheel_radius := 0.35
var length := 4.6
var width := 1.9
var height := 1.3

var flames: Array[CPUParticles3D] = []
var smoke: Array[CPUParticles3D] = []
var sparks: CPUParticles3D
var flame_mats: Array[StandardMaterial3D] = []
var headlights: Array[SpotLight3D] = []

var _spin := 0.0
var _bounce := 0.0
var _bounce_v := 0.0
var _lean := 0.0
var _squat := 0.0
var _last_v := 0.0


func setup(car_id: String, traffic := false, paint_hex: String = "", with_lights := false, with_fx := true) -> void:
	var path := "res://assets/cars/%s%s.glb" % ["traffic/" if traffic else "", car_id]
	body_root = Node3D.new()
	add_child(body_root)
	if ResourceLoader.exists(path):
		var ps: PackedScene = load(path)
		model = ps.instantiate()
	else:
		model = _fallback_model()
	body_root.add_child(model)
	_collect(model)
	_measure()
	_tame_lights()
	if paint_hex != "":
		set_paint(Color(paint_hex))
	if with_fx:
		_make_fx()
	if with_lights:
		for side in [-1.0, 1.0]:
			var sl := SpotLight3D.new()
			sl.light_color = Color(1.0, 0.95, 0.85)
			sl.light_energy = 6.0
			sl.spot_range = 60.0
			sl.spot_angle = 28.0
			sl.spot_attenuation = 0.8
			sl.position = Vector3(side * width * 0.32, 0.65, -length * 0.5)
			sl.rotation_degrees = Vector3(-6, 0, 0)
			body_root.add_child(sl)
			headlights.append(sl)
		# lumière d'appoint pour bien voir la voiture la nuit
		var fill := OmniLight3D.new()
		fill.light_color = Color(0.85, 0.8, 1.0)
		fill.light_energy = 1.4
		fill.omni_range = 7.0
		fill.position = Vector3(0, 3.2, 1.5)
		add_child(fill)


func _fallback_model() -> Node3D:
	var root := Node3D.new()
	var mi := MeshInstance3D.new()
	var bm := BoxMesh.new()
	bm.size = Vector3(1.9, 1.0, 4.5)
	mi.mesh = bm
	mi.position.y = 0.75
	var m := StandardMaterial3D.new()
	m.albedo_color = Color(0.8, 0.1, 0.9)
	mi.material_override = m
	root.add_child(mi)
	return root


func _collect(n: Node) -> void:
	if n is Node3D and String(n.name).begins_with("Wheel_"):
		wheels.append(n)
		if String(n.name).begins_with("Wheel_F"):
			front_wheels.append(n)
	for c in n.get_children():
		_collect(c)


func _measure() -> void:
	var aabb := AABB()
	var first := true
	for mi in _meshes(model):
		var a: AABB = mi.get_aabb()
		a = mi.transform * a if mi.get_parent() == model else a
		if first:
			aabb = a
			first = false
		else:
			aabb = aabb.merge(a)
	if not first:
		length = aabb.size.z
		width = aabb.size.x
		height = aabb.size.y
	if not wheels.is_empty():
		wheel_radius = max(0.25, wheels[0].position.y)


func _meshes(n: Node) -> Array:
	var out := []
	if n is MeshInstance3D:
		out.append(n)
	for c in n.get_children():
		out.append_array(_meshes(c))
	return out


func _tame_lights() -> void:
	# phares un peu moins éblouissants (le glow de Godot les amplifie)
	for mi in _meshes(model):
		var mesh: Mesh = mi.mesh
		if mesh == null:
			continue
		for i in mesh.get_surface_count():
			var m := mesh.surface_get_material(i)
			if m is StandardMaterial3D and m.resource_name in ["Headlight", "Taillight"]:
				var nm: StandardMaterial3D = m.duplicate()
				nm.emission_energy_multiplier = 0.35 if m.resource_name == "Headlight" else 0.6
				mi.set_surface_override_material(i, nm)


func set_paint(c: Color) -> void:
	for mi in _meshes(model):
		var mesh: Mesh = mi.mesh
		if mesh == null:
			continue
		for i in mesh.get_surface_count():
			var m := mesh.surface_get_material(i)
			if m and m.resource_name == "Paint":
				var nm: StandardMaterial3D
				if m is StandardMaterial3D:
					nm = m.duplicate()
				else:
					nm = StandardMaterial3D.new()
				nm.albedo_color = c
				nm.metallic = 0.6
				nm.roughness = 0.25
				nm.clearcoat_enabled = true
				nm.clearcoat = 1.0
				nm.clearcoat_roughness = 0.05
				mi.set_surface_override_material(i, nm)


func _particle_mat(col: Color, additive := true) -> StandardMaterial3D:
	var m := StandardMaterial3D.new()
	m.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	m.billboard_mode = BaseMaterial3D.BILLBOARD_PARTICLES
	m.vertex_color_use_as_albedo = true
	m.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	if additive:
		m.blend_mode = BaseMaterial3D.BLEND_MODE_ADD
	m.albedo_color = col
	m.albedo_texture = _soft_dot()
	return m


static var _dot_tex: Texture2D


static func _soft_dot() -> Texture2D:
	if _dot_tex:
		return _dot_tex
	var g := Gradient.new()
	g.set_color(0, Color(1, 1, 1, 1))
	g.set_color(1, Color(1, 1, 1, 0))
	g.add_point(0.35, Color(1, 1, 1, 0.75))
	var t := GradientTexture2D.new()
	t.gradient = g
	t.fill = GradientTexture2D.FILL_RADIAL
	t.fill_from = Vector2(0.5, 0.5)
	t.fill_to = Vector2(1.0, 0.5)
	t.width = 64
	t.height = 64
	_dot_tex = t
	return t


func _make_fx() -> void:
	# flammes de nitro aux échappements
	for side in [-1.0, 1.0]:
		var p := CPUParticles3D.new()
		p.amount = 28
		p.lifetime = 0.16
		p.local_coords = false
		p.emitting = false
		var qm := QuadMesh.new()
		qm.size = Vector2(0.42, 0.42)
		var mat := _particle_mat(Color(1, 1, 1, 1))
		flame_mats.append(mat)
		qm.material = mat
		p.mesh = qm
		p.direction = Vector3(0, 0.1, 1)
		p.spread = 6.0
		p.gravity = Vector3.ZERO
		p.initial_velocity_min = 7.0
		p.initial_velocity_max = 11.0
		p.scale_amount_min = 0.6
		p.scale_amount_max = 1.2
		var sc := Curve.new()
		sc.add_point(Vector2(0, 1))
		sc.add_point(Vector2(1, 0.1))
		p.scale_amount_curve = sc
		var g := Gradient.new()
		g.set_color(0, Color(1.0, 0.9, 0.6, 1.0))
		g.set_color(1, Color(1.0, 0.25, 0.0, 0.0))
		p.color_ramp = g
		p.position = Vector3(side * width * 0.24, 0.32, length * 0.5 + 0.05)
		body_root.add_child(p)
		flames.append(p)
	# fumée de drift (roues arrière)
	for side in [-1.0, 1.0]:
		var sm := CPUParticles3D.new()
		sm.amount = 40
		sm.lifetime = 1.1
		sm.local_coords = false
		sm.emitting = false
		var qm2 := QuadMesh.new()
		qm2.size = Vector2(1.6, 1.6)
		qm2.material = _particle_mat(Color(0.85, 0.85, 0.9, 0.35), false)
		sm.mesh = qm2
		sm.direction = Vector3(0, 1, 0.5)
		sm.spread = 40.0
		sm.gravity = Vector3(0, 0.6, 0)
		sm.initial_velocity_min = 1.0
		sm.initial_velocity_max = 3.0
		sm.scale_amount_min = 0.6
		sm.scale_amount_max = 1.6
		var sc2 := Curve.new()
		sc2.add_point(Vector2(0, 0.5))
		sc2.add_point(Vector2(1, 1.6))
		sm.scale_amount_curve = sc2
		var g2 := Gradient.new()
		g2.set_color(0, Color(0.9, 0.9, 0.95, 0.22))
		g2.set_color(1, Color(0.9, 0.9, 0.95, 0.0))
		sm.color_ramp = g2
		sm.position = Vector3(side * width * 0.42, 0.25, length * 0.3)
		body_root.add_child(sm)
		smoke.append(sm)
	# étincelles (frottement contre les murs)
	sparks = CPUParticles3D.new()
	sparks.amount = 36
	sparks.lifetime = 0.45
	sparks.local_coords = false
	sparks.emitting = false
	var qm3 := QuadMesh.new()
	qm3.size = Vector2(0.12, 0.12)
	qm3.material = _particle_mat(Color(1, 1, 1, 1))
	sparks.mesh = qm3
	sparks.direction = Vector3(0, 0.6, 1)
	sparks.spread = 35.0
	sparks.gravity = Vector3(0, -14, 0)
	sparks.initial_velocity_min = 6.0
	sparks.initial_velocity_max = 13.0
	var g3 := Gradient.new()
	g3.set_color(0, Color(1.0, 0.95, 0.6, 1))
	g3.set_color(1, Color(1.0, 0.4, 0.0, 0))
	sparks.color_ramp = g3
	body_root.add_child(sparks)


func set_nitro(level: int) -> void:
	if flames.is_empty():
		return
	var on := level > 0
	for f in flames:
		f.emitting = on
	if on:
		var c0 := Color(1.0, 0.65, 0.25)
		var c1 := Color(1.0, 0.3, 0.0, 0.0)
		var sz := 0.42
		if level == 2:
			c0 = Color(1.0, 0.6, 1.0)
			c1 = Color(0.65, 0.1, 1.0, 0.0)
			sz = 0.55
		elif level == 3:
			c0 = Color(0.85, 0.95, 1.0)
			c1 = Color(0.1, 0.45, 1.0, 0.0)
			sz = 0.75
		for f in flames:
			f.color_ramp.set_color(0, c0)
			f.color_ramp.set_color(1, c1)
			(f.mesh as QuadMesh).size = Vector2(sz, sz)


func set_drift_smoke(on: bool) -> void:
	for s in smoke:
		s.emitting = on


func emit_sparks(side: float) -> void:
	if sparks == null:
		return
	sparks.position = Vector3(side * width * 0.5, 0.4, 0.3)
	sparks.restart()
	sparks.emitting = true


func bounce(strength: float) -> void:
	_bounce_v -= clamp(strength * 0.05, 0.0, 1.2)


func update_visual(dt: float, speed: float, steer: float, lat_vel: float, airborne: bool) -> void:
	_spin -= speed / wheel_radius * dt
	for w in wheels:
		w.rotation.x = _spin
	for w in front_wheels:
		w.rotation.y = lerp(w.rotation.y, -steer * 0.38, 1.0 - exp(-10.0 * dt))
	# suspension : ressort amorti
	var k := 160.0
	var damp := 14.0
	_bounce_v += (-k * _bounce - damp * _bounce_v) * dt
	_bounce += _bounce_v * dt
	var acc := (speed - _last_v) / maxf(dt, 0.001)
	_last_v = speed
	_squat = lerp(_squat, clamp(acc * 0.004, -0.05, 0.05), 1.0 - exp(-6.0 * dt))
	_lean = lerp(_lean, clamp(lat_vel * 0.006, -0.06, 0.06), 1.0 - exp(-6.0 * dt))
	if airborne:
		_lean = lerp(_lean, 0.0, dt * 3.0)
	body_root.position.y = _bounce * 0.2
	body_root.rotation = Vector3(_squat, 0.0, -_lean)
