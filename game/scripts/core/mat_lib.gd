class_name MatLib
## Bibliothèque de matériaux partagés (voitures, décors). Les modèles Blender
## exportent des noms de matériaux qui sont remplacés ici par des versions optimisées.

static var _cache := {}
static var night := false
static var quality := 1


static func tex(path: String) -> Texture2D:
	var key := "tex:" + path
	if not _cache.has(key):
		_cache[key] = load(path) if ResourceLoader.exists(path) else null
	return _cache[key]


static func _std(key: String, setup: Callable) -> StandardMaterial3D:
	if _cache.has(key):
		return _cache[key]
	var m := StandardMaterial3D.new()
	setup.call(m)
	_cache[key] = m
	return m


static func clear() -> void:
	_cache.clear()


# ---------------------------------------------------------------------------
# Voitures
# ---------------------------------------------------------------------------

static func paint(c: Color) -> StandardMaterial3D:
	return _std("paint:" + c.to_html(false), func(m: StandardMaterial3D):
		m.albedo_color = c
		m.metallic = 0.55
		m.metallic_specular = 0.6
		m.roughness = 0.2
		m.clearcoat_enabled = true
		m.clearcoat = 1.0
		m.clearcoat_roughness = 0.05
		m.rim_enabled = true
		m.rim = 0.25
		m.rim_tint = 0.6)


static func colored(kind: String, c: Color, metal: float, rough: float) -> StandardMaterial3D:
	return _std(kind + ":" + c.to_html(false), func(m: StandardMaterial3D):
		m.albedo_color = c
		m.metallic = metal
		m.roughness = rough)


static func car_part(name: String) -> StandardMaterial3D:
	var base := name.get_slice(".", 0)
	match base:
		"Glass":
			return _std("Glass", func(m: StandardMaterial3D):
				m.albedo_color = Color(0.02, 0.025, 0.035)
				m.metallic = 0.4
				m.metallic_specular = 1.0
				m.roughness = 0.03
				m.rim_enabled = true
				m.rim = 0.4)
		"Trim":
			return _std("Trim", func(m: StandardMaterial3D):
				m.albedo_color = Color(0.02, 0.02, 0.022)
				m.roughness = 0.4)
		"Under":
			return _std("Under", func(m: StandardMaterial3D):
				m.albedo_color = Color(0.012, 0.012, 0.012)
				m.roughness = 0.95
				m.cull_mode = BaseMaterial3D.CULL_DISABLED)
		"Chrome":
			return _std("Chrome", func(m: StandardMaterial3D):
				m.albedo_color = Color(0.92, 0.92, 0.95)
				m.metallic = 1.0
				m.roughness = 0.08)
		"Headlight":
			return _std("Headlight", func(m: StandardMaterial3D):
				m.albedo_color = Color(0.9, 0.95, 1.0)
				m.emission_enabled = true
				m.emission = Color(0.85, 0.92, 1.0)
				m.emission_energy_multiplier = 3.5 if night else 1.6)
		"Taillight":
			return _std("Taillight", func(m: StandardMaterial3D):
				m.albedo_color = Color(0.5, 0.0, 0.0)
				m.emission_enabled = true
				m.emission = Color(1.0, 0.04, 0.03)
				m.emission_energy_multiplier = 2.6 if night else 1.4)
		"Grille":
			return _std("Grille", func(m: StandardMaterial3D):
				m.albedo_color = Color(0.025, 0.025, 0.03)
				m.metallic = 0.3
				m.roughness = 0.5)
		"Plate":
			return _std("Plate", func(m: StandardMaterial3D):
				m.albedo_color = Color(0.9, 0.9, 0.88)
				m.roughness = 0.5)
		"Carbon":
			return _std("Carbon", func(m: StandardMaterial3D):
				m.albedo_color = Color(0.04, 0.04, 0.045)
				m.metallic = 0.3
				m.roughness = 0.22
				m.clearcoat_enabled = true)
		"Roof":
			return _std("Roof", func(m: StandardMaterial3D):
				m.albedo_color = Color(0.015, 0.015, 0.018)
				m.metallic = 0.3
				m.roughness = 0.15)
		"Tire":
			return _std("Tire", func(m: StandardMaterial3D):
				m.albedo_color = Color(0.03, 0.03, 0.03)
				m.roughness = 0.9)
		"Disc":
			return _std("Disc", func(m: StandardMaterial3D):
				m.albedo_color = Color(0.3, 0.3, 0.31)
				m.metallic = 1.0
				m.roughness = 0.4)
		"Signal":
			return _std("Signal", func(m: StandardMaterial3D):
				m.albedo_color = Color(0.6, 0.3, 0.0)
				m.emission_enabled = true
				m.emission = Color(1.0, 0.45, 0.0)
				m.emission_energy_multiplier = 0.6)
		"Stripe":
			return _std("Stripe", func(m: StandardMaterial3D):
				m.albedo_color = Color(0.92, 0.92, 0.92)
				m.metallic = 0.3
				m.roughness = 0.25
				m.clearcoat_enabled = true)
	return _std("Trim", func(m: StandardMaterial3D):
		m.albedo_color = Color(0.02, 0.02, 0.022)
		m.roughness = 0.4)


static func signal_on() -> StandardMaterial3D:
	return _std("SignalOn", func(m: StandardMaterial3D):
		m.albedo_color = Color(1.0, 0.5, 0.0)
		m.emission_enabled = true
		m.emission = Color(1.0, 0.5, 0.0)
		m.emission_energy_multiplier = 4.0)


static func brake_light() -> StandardMaterial3D:
	return _std("BrakeLight", func(m: StandardMaterial3D):
		m.albedo_color = Color(0.7, 0.0, 0.0)
		m.emission_enabled = true
		m.emission = Color(1.0, 0.05, 0.03)
		m.emission_energy_multiplier = 5.0)


# ---------------------------------------------------------------------------
# Décors
# ---------------------------------------------------------------------------

static func asphalt(wet: bool) -> StandardMaterial3D:
	return _std("asphalt%s" % wet, func(m: StandardMaterial3D):
		if wet:
			m.albedo_texture = tex("res://assets/textures/asphalt_wet_albedo.png")
			m.roughness_texture = tex("res://assets/textures/asphalt_wet_rough.png")
			m.metallic = 0.25
			m.metallic_specular = 0.8
		else:
			m.albedo_texture = tex("res://assets/textures/asphalt_albedo.png")
			m.roughness_texture = tex("res://assets/textures/asphalt_rough.png")
			if quality >= 1:
				m.normal_enabled = true
				m.normal_texture = tex("res://assets/textures/asphalt_normal.png")
				m.normal_scale = 0.6
		m.roughness = 1.0
		m.texture_filter = BaseMaterial3D.TEXTURE_FILTER_LINEAR_WITH_MIPMAPS_ANISOTROPIC)


static func line(c: Color) -> StandardMaterial3D:
	return _std("line:" + c.to_html(false), func(m: StandardMaterial3D):
		m.albedo_color = c
		m.roughness = 0.6
		m.emission_enabled = true
		m.emission = c
		m.emission_energy_multiplier = 0.25 if night else 0.08)


static func plain(key: String, c: Color, rough: float = 0.8, metal: float = 0.0) -> StandardMaterial3D:
	return _std("plain:" + key, func(m: StandardMaterial3D):
		m.albedo_color = c
		m.roughness = rough
		m.metallic = metal)


static func textured(key: String, path: String, c: Color = Color.WHITE, rough: float = 0.85,
		triplanar: float = 0.0) -> StandardMaterial3D:
	return _std("textured:" + key, func(m: StandardMaterial3D):
		m.albedo_texture = tex(path)
		m.albedo_color = c
		m.roughness = rough
		m.texture_filter = BaseMaterial3D.TEXTURE_FILTER_LINEAR_WITH_MIPMAPS_ANISOTROPIC
		if triplanar > 0.0:
			m.uv1_triplanar = true
			m.uv1_scale = Vector3.ONE * triplanar)


static func emissive(key: String, c: Color, energy: float) -> StandardMaterial3D:
	return _std("emis:" + key, func(m: StandardMaterial3D):
		m.albedo_color = c
		m.emission_enabled = true
		m.emission = c
		m.emission_energy_multiplier = energy)


static func emissive_tex(key: String, path: String, energy: float, unshaded: bool = true) -> StandardMaterial3D:
	return _std("emistex:" + key, func(m: StandardMaterial3D):
		m.albedo_texture = tex(path)
		m.emission_enabled = true
		m.emission_texture = tex(path)
		m.emission_energy_multiplier = energy
		if unshaded:
			m.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
		m.cull_mode = BaseMaterial3D.CULL_DISABLED)


static func facade(style: String) -> ShaderMaterial:
	var key := "facade:" + style
	if _cache.has(key):
		return _cache[key]
	var m := ShaderMaterial.new()
	m.shader = load("res://shaders/facade.gdshader")
	m.set_shader_parameter("albedo_tex", tex("res://assets/textures/facade_%s.png" % style))
	m.set_shader_parameter("emit_tex", tex("res://assets/textures/facade_%s_emit.png" % style))
	var e := 0.0
	if night:
		e = 2.2
	elif style == "shop":
		e = 0.6
	m.set_shader_parameter("emit_strength", e)
	m.set_shader_parameter("glass_rough", 0.12 if style == "office" else 0.2)
	_cache[key] = m
	return m


static func water() -> ShaderMaterial:
	if _cache.has("water"):
		return _cache.water
	var m := ShaderMaterial.new()
	m.shader = load("res://shaders/water.gdshader")
	m.set_shader_parameter("normal_tex", tex("res://assets/textures/water_normal.png"))
	m.set_shader_parameter("deep", Color(0.02, 0.10, 0.18) if not night else Color(0.01, 0.01, 0.04))
	m.set_shader_parameter("shallow", Color(0.10, 0.35, 0.45) if not night else Color(0.05, 0.03, 0.12))
	_cache.water = m
	return m


static func foliage() -> StandardMaterial3D:
	return _std("Foliage", func(m: StandardMaterial3D):
		m.albedo_texture = tex("res://assets/textures/foliage_albedo.png")
		m.roughness = 0.9)


static func palm_leaf() -> StandardMaterial3D:
	return _std("PalmLeaf", func(m: StandardMaterial3D):
		m.albedo_texture = tex("res://assets/textures/palm_leaf.png")
		m.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA_SCISSOR
		m.alpha_scissor_threshold = 0.4
		m.cull_mode = BaseMaterial3D.CULL_DISABLED
		m.roughness = 0.8
		m.texture_filter = BaseMaterial3D.TEXTURE_FILTER_LINEAR_WITH_MIPMAPS)


static func prop_part(name: String) -> Material:
	var base := name.get_slice(".", 0)
	match base:
		"RampStripes":
			return textured("ramp", "res://assets/textures/ramp_stripes.png", Color.WHITE, 0.6)
		"Metal":
			return plain("metal", Color(0.38, 0.39, 0.42), 0.35, 0.9)
		"Concrete":
			return textured("concrete_t", "res://assets/textures/concrete_albedo.png", Color(0.95, 0.95, 0.95), 0.9, 0.5)
		"PalmTrunk":
			return plain("trunk", Color(0.42, 0.32, 0.22), 0.9)
		"PalmLeaf":
			return palm_leaf()
		"Foliage":
			return foliage()
		"Bark":
			return plain("bark", Color(0.28, 0.2, 0.14), 0.9)
		"LampGlow":
			return emissive("lamp", Color(1.0, 0.88, 0.65), 4.0 if night else 1.0)
		"PoleMetal":
			return plain("pole", Color(0.16, 0.17, 0.18), 0.45, 0.7)
		"GGRed":
			return plain("ggred", Color(0.78, 0.2, 0.08), 0.6, 0.1)
		"GGWhite":
			return plain("ggwhite", Color(0.85, 0.86, 0.88), 0.5, 0.2)
		"Billboard":
			return emissive_tex("billboard", "res://assets/textures/billboards.png", 1.2 if night else 0.35, false)
		"LightRed":
			return emissive("lred", Color(1.0, 0.08, 0.05), 3.0)
		"LightAmber":
			return emissive("lamb", Color(0.25, 0.15, 0.0), 0.2)
		"LightGreen":
			return emissive("lgreen", Color(0.05, 0.25, 0.08), 0.2)
		"Cactus":
			return plain("cactus", Color(0.28, 0.45, 0.22), 0.85)
		"Rock":
			return textured("rock", "res://assets/textures/rock_albedo.png", Color.WHITE, 0.95, 0.15)
		"Cone":
			return plain("cone", Color(1.0, 0.35, 0.0), 0.6)
		"White":
			return plain("white", Color(0.9, 0.9, 0.9), 0.5)
	return plain("default", Color(0.5, 0.5, 0.5))


## Remplace les matériaux importés d'une scène GLB de décor.
static func apply_props(node: Node) -> void:
	for mi in _mesh_instances(node):
		var mesh: Mesh = mi.mesh
		for i in mesh.get_surface_count():
			var src := mesh.surface_get_material(i)
			var nm := src.resource_name if src else ""
			mi.set_surface_override_material(i, prop_part(nm))


## Prépare un Mesh (pour MultiMesh) avec les matériaux de décor.
static func prop_mesh(path: String) -> Mesh:
	var key := "propmesh:" + path
	if _cache.has(key):
		return _cache[key]
	var scene: PackedScene = load(path)
	var inst := scene.instantiate()
	var mis := _mesh_instances(inst)
	var mesh: Mesh = null
	if not mis.is_empty():
		var src: Mesh = mis[0].mesh
		mesh = src.duplicate()
		for i in mesh.get_surface_count():
			var m := src.surface_get_material(i)
			mesh.surface_set_material(i, prop_part(m.resource_name if m else ""))
	inst.free()
	_cache[key] = mesh
	return mesh


static func _mesh_instances(node: Node) -> Array:
	var out := []
	if node is MeshInstance3D:
		out.append(node)
	for c in node.get_children():
		out.append_array(_mesh_instances(c))
	return out
