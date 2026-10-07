class_name CarModel
extends Node3D
## Modèle 3D d'une voiture (GLB Blender) + effets : roues, nitro, fumée, étincelles, feux.

const COG := 0.55

var car_id := ""
var pivot: Node3D
var body_root: Node3D
var wheels := {}
var wheel_radius := 0.34
var length := 4.5
var width := 1.9
var height := 1.4
var spin := 0.0
var _flames: Array[MeshInstance3D] = []
var _flame_mat: ShaderMaterial
var _smoke: Array[CPUParticles3D] = []
var _sparks: CPUParticles3D
var _tail_surfaces: Array = []
var _signal_surfaces: Array = []
var _brake := false
var _signal_side := 0
var _signal_t := 0.0
var _headlight: SpotLight3D
var _blob: MeshInstance3D
var nitro_level := 0

static var _scene_cache := {}


static func load_scene(id: String) -> PackedScene:
	if not _scene_cache.has(id):
		var path := "res://assets/cars/%s.glb" % id
		_scene_cache[id] = load(path) if ResourceLoader.exists(path) else null
	return _scene_cache[id]


func setup(id: String, color: Color, opts: Dictionary = {}) -> void:
	car_id = id
	name = "Car_" + id
	pivot = Node3D.new()
	pivot.position.y = COG
	add_child(pivot)
	var sc := load_scene(id)
	if sc == null:
		sc = load_scene("lancer_evo")
	body_root = sc.instantiate()
	body_root.position.y = -COG
	pivot.add_child(body_root)
	var rim_col: Color = opts.get("rim", Color(0.75, 0.76, 0.78))
	var cal_col: Color = opts.get("caliper", Color(0.75, 0.08, 0.06))
	var aabb := AABB()
	var first := true
	for mi in _mesh_instances(body_root):
		var mesh: Mesh = mi.mesh
		if mi.name.begins_with("Wheel"):
			wheels[String(mi.name).substr(0, 8)] = mi
		for i in mesh.get_surface_count():
			var src := mesh.surface_get_material(i)
			var nm := src.resource_name if src else ""
			var base := nm.get_slice(".", 0)
			var m: Material
			match base:
				"Paint":
					m = MatLib.paint(color)
				"Rim":
					m = MatLib.colored("rim", _src_color(src, rim_col), 0.9, 0.25)
				"Caliper":
					m = MatLib.colored("cal", _src_color(src, cal_col), 0.1, 0.3)
				_:
					m = MatLib.car_part(nm)
			mi.set_surface_override_material(i, m)
			if base == "Taillight":
				_tail_surfaces.append([mi, i])
			elif base == "Signal":
				_signal_surfaces.append([mi, i])
		if mi.name == "Body":
			aabb = mesh.get_aabb()
			first = false
		mi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_ON if opts.get("shadows", true) else \
			GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	if not first:
		length = aabb.size.z
		width = aabb.size.x
		height = aabb.size.y
	if wheels.has("Wheel_FL"):
		var w: MeshInstance3D = wheels["Wheel_FL"]
		wheel_radius = maxf(w.mesh.get_aabb().size.y * 0.5, 0.25)
	if opts.get("effects", true):
		_build_effects(aabb)
	if opts.get("headlight", false):
		_headlight = SpotLight3D.new()
		_headlight.position = Vector3(0, 0.75 - COG, -length * 0.5)
		_headlight.spot_range = 55.0
		_headlight.spot_angle = 32.0
		_headlight.light_energy = 4.0
		_headlight.light_color = Color(0.9, 0.95, 1.0)
		_headlight.shadow_enabled = false
		_headlight.rotation_degrees = Vector3(-6, 0, 0)
		pivot.add_child(_headlight)
	if opts.get("blob", false):
		_blob = MeshInstance3D.new()
		var q := QuadMesh.new()
		q.size = Vector2(width * 1.25, length * 1.15)
		q.orientation = PlaneMesh.FACE_Y
		_blob.mesh = q
		var bm := StandardMaterial3D.new()
		bm.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
		bm.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
		bm.albedo_texture = _blob_texture()
		bm.albedo_color = Color(0, 0, 0, 0.75)
		bm.disable_receive_shadows = true
		_blob.material_override = bm
		_blob.position.y = 0.04
		_blob.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
		add_child(_blob)


func _src_color(src: Material, fallback: Color) -> Color:
	if src is BaseMaterial3D:
		return (src as BaseMaterial3D).albedo_color
	return fallback


static var _blob_tex: Texture2D


static func _blob_texture() -> Texture2D:
	if _blob_tex == null:
		var g := Gradient.new()
		g.set_color(0, Color(1, 1, 1, 1))
		g.set_color(1, Color(1, 1, 1, 0))
		var gt := GradientTexture2D.new()
		gt.gradient = g
		gt.fill = GradientTexture2D.FILL_RADIAL
		gt.fill_from = Vector2(0.5, 0.5)
		gt.fill_to = Vector2(1.0, 0.5)
		gt.width = 64
		gt.height = 64
		_blob_tex = gt
	return _blob_tex


func _mesh_instances(node: Node) -> Array:
	var out := []
	if node is MeshInstance3D:
		out.append(node)
	for c in node.get_children():
		out.append_array(_mesh_instances(c))
	return out


func _build_effects(aabb: AABB) -> void:
	var rear_z := aabb.end.z if aabb.size != Vector3.ZERO else length * 0.5
	# flammes de nitro
	_flame_mat = ShaderMaterial.new()
	_flame_mat.shader = load("res://shaders/nitro_flame.gdshader")
	var cyl := CylinderMesh.new()
	cyl.top_radius = 0.11
	cyl.bottom_radius = 0.02
	cyl.height = 1.1
	cyl.radial_segments = 8
	cyl.rings = 1
	cyl.cap_top = false
	cyl.cap_bottom = false
	for sx: float in [-0.42, 0.42]:
		var f := MeshInstance3D.new()
		f.mesh = cyl
		f.material_override = _flame_mat
		f.rotation_degrees = Vector3(-90, 0, 0)
		f.position = Vector3(sx, 0.28 - COG, rear_z + 0.55)
		f.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
		f.visible = false
		pivot.add_child(f)
		_flames.append(f)
	# fumée des pneus
	var smoke_mat := StandardMaterial3D.new()
	smoke_mat.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	smoke_mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	smoke_mat.billboard_mode = BaseMaterial3D.BILLBOARD_PARTICLES
	smoke_mat.vertex_color_use_as_albedo = true
	smoke_mat.albedo_texture = _blob_texture()
	smoke_mat.disable_receive_shadows = true
	var quad := QuadMesh.new()
	quad.size = Vector2(1.2, 1.2)
	quad.material = smoke_mat
	var ramp := Gradient.new()
	ramp.set_color(0, Color(0.85, 0.85, 0.88, 0.45))
	ramp.set_color(1, Color(0.85, 0.85, 0.88, 0.0))
	for sx: float in [-0.8, 0.8]:
		var p := CPUParticles3D.new()
		p.mesh = quad
		p.amount = 24
		p.lifetime = 1.1
		p.emitting = false
		p.local_coords = false
		p.direction = Vector3(0, 1, 0.4)
		p.spread = 30.0
		p.initial_velocity_min = 1.0
		p.initial_velocity_max = 2.5
		p.gravity = Vector3(0, 0.6, 0)
		p.scale_amount_min = 0.8
		p.scale_amount_max = 1.6
		var curve := Curve.new()
		curve.add_point(Vector2(0, 0.5))
		curve.add_point(Vector2(1, 2.5))
		p.scale_amount_curve = curve
		p.color_ramp = ramp
		p.position = Vector3(sx, 0.25 - COG, rear_z - 0.9)
		pivot.add_child(p)
		_smoke.append(p)
	# étincelles
	_sparks = CPUParticles3D.new()
	var sq := QuadMesh.new()
	sq.size = Vector2(0.06, 0.25)
	var sm := StandardMaterial3D.new()
	sm.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	sm.billboard_mode = BaseMaterial3D.BILLBOARD_PARTICLES
	sm.albedo_color = Color(1.0, 0.8, 0.3)
	sm.emission_enabled = true
	sm.emission = Color(1.0, 0.7, 0.2)
	sm.emission_energy_multiplier = 4.0
	sq.material = sm
	_sparks.mesh = sq
	_sparks.amount = 40
	_sparks.lifetime = 0.45
	_sparks.emitting = false
	_sparks.local_coords = false
	_sparks.direction = Vector3(0, 0.6, 1)
	_sparks.spread = 50.0
	_sparks.initial_velocity_min = 4.0
	_sparks.initial_velocity_max = 10.0
	_sparks.gravity = Vector3(0, -12, 0)
	pivot.add_child(_sparks)


func set_wheels(dist_delta: float, steer: float) -> void:
	spin -= dist_delta / wheel_radius
	spin = fmod(spin, TAU)
	for key in wheels:
		var w: MeshInstance3D = wheels[key]
		var st := steer if key.begins_with("Wheel_F") else 0.0
		w.rotation = Vector3(spin, st, 0.0)


func set_nitro(level: int) -> void:
	nitro_level = level
	if _flames.is_empty():
		return
	for f in _flames:
		f.visible = level > 0
	if level > 0:
		var cols := [[Color(1, 0.95, 0.6), Color(1, 0.45, 0.05)], [Color(0.8, 0.95, 1), Color(0.2, 0.5, 1)],
			[Color(1, 0.8, 1), Color(0.75, 0.2, 1)]]
		var c: Array = cols[clampi(level - 1, 0, 2)]
		_flame_mat.set_shader_parameter("core", c[0])
		_flame_mat.set_shader_parameter("edge", c[1])
		var sc := 1.0 + 0.25 * (level - 1)
		for f in _flames:
			f.scale = Vector3(sc, sc * randf_range(0.85, 1.15), sc)


func set_smoke(on: bool) -> void:
	for p in _smoke:
		if p.emitting != on:
			p.emitting = on


func set_sparks(on: bool, side: float) -> void:
	if _sparks == null:
		return
	if on:
		_sparks.position = Vector3(side * width * 0.5, 0.35 - COG, 0.0)
	if _sparks.emitting != on:
		_sparks.emitting = on


func set_brake(on: bool) -> void:
	if on == _brake:
		return
	_brake = on
	for e in _tail_surfaces:
		e[0].set_surface_override_material(e[1], MatLib.brake_light() if on else MatLib.car_part("Taillight"))


func set_signal(side: int) -> void:
	_signal_side = side
	if side == 0:
		for e in _signal_surfaces:
			e[0].set_surface_override_material(e[1], MatLib.car_part("Signal"))


func _process(delta: float) -> void:
	if _signal_side != 0 and not _signal_surfaces.is_empty():
		_signal_t += delta
		var on := fmod(_signal_t, 0.8) < 0.4
		for e in _signal_surfaces:
			e[0].set_surface_override_material(e[1], MatLib.signal_on() if on else MatLib.car_part("Signal"))
	if nitro_level > 0 and not _flames.is_empty():
		for f in _flames:
			f.scale.y = (1.0 + 0.25 * (nitro_level - 1)) * randf_range(0.8, 1.2)
