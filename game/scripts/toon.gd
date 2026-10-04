class_name Toon
extends RefCounted


static var outline_mat: StandardMaterial3D

static func material(col: Color, tex: Texture2D = null) -> StandardMaterial3D:
	var m: = StandardMaterial3D.new()
	m.albedo_color = col
	if tex: m.albedo_texture = tex
	m.diffuse_mode = BaseMaterial3D.DIFFUSE_TOON
	m.specular_mode = BaseMaterial3D.SPECULAR_DISABLED
	m.roughness = 0.45
	return m

static func from_material(src: Material) -> StandardMaterial3D:
	var col: = Color.WHITE
	var tex: Texture2D = null
	var emit: = Color.BLACK
	var emit_e: = 0.0
	if src is BaseMaterial3D:

		col = src.albedo_color.srgb_to_linear()
		if col.get_luminance() > 0.8:
			col = col.darkened(0.14)
		tex = src.albedo_texture
		if src.emission_enabled:
			emit = src.emission.srgb_to_linear();emit_e = src.emission_energy_multiplier
	var m: = material(col, tex)
	if src: m.resource_name = src.resource_name
	if emit_e > 0.0:
		m.emission_enabled = true;m.emission = emit;m.emission_energy_multiplier = emit_e
	return m

static func outline(width: = 0.006, col: = Color(0.04, 0.05, 0.12)) -> StandardMaterial3D:
	var m: = StandardMaterial3D.new()
	m.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	m.albedo_color = col
	m.cull_mode = BaseMaterial3D.CULL_FRONT
	m.grow = true
	m.grow_amount = width
	m.disable_receive_shadows = true
	return m


static func apply(root: Node, with_outline: = true, rim: = true, outline_width: = 0.006) -> void :
	var ol: = outline(outline_width)
	for mi in root.find_children("*", "MeshInstance3D", true, false):
		var mesh: Mesh = mi.mesh
		if mesh == null: continue
		for s in mesh.get_surface_count():
			var src: Material = mi.get_active_material(s)
			var m: = from_material(src)
			m.specular_mode = BaseMaterial3D.SPECULAR_TOON
			m.roughness = 0.5
			if rim:
				m.rim_enabled = true;m.rim = 0.25;m.rim_tint = 0.6
			m.albedo_color = m.albedo_color * Color(0.93, 0.93, 0.95)
			if with_outline: m.next_pass = ol
			mi.set_surface_override_material(s, m)


const CHAR_SHADER: = preload("res://shaders/toon_char.gdshader")
const OUTLINE_SHADER: = preload("res://shaders/toon_outline.gdshader")

## Cel-shading des héros (shader toon_char + contour coloré).
static func apply_char(root: Node, outline_width: = 0.0045, rim: = 0.55) -> void :
	for mi in root.find_children("*", "MeshInstance3D", true, false):
		var mesh: Mesh = mi.mesh
		if mesh == null: continue
		for s in mesh.get_surface_count():
			var src: Material = mi.get_active_material(s)
			var col: = Color.WHITE
			var tex: Texture2D = null
			var emit: = Color.BLACK
			var emit_e: = 0.0
			if src is BaseMaterial3D:
				col = src.albedo_color
				tex = src.albedo_texture
				if src.emission_enabled:
					emit = src.emission;emit_e = src.emission_energy_multiplier
			var m: = ShaderMaterial.new();m.shader = CHAR_SHADER
			if src: m.resource_name = src.resource_name
			m.set_shader_parameter("albedo", col)
			m.set_shader_parameter("has_tex", tex != null)
			if tex: m.set_shader_parameter("albedo_tex", tex)
			m.set_shader_parameter("rim_amount", rim)
			if emit_e > 0.0:
				m.set_shader_parameter("emission_col", emit);m.set_shader_parameter("emission_energy", emit_e)
			if outline_width > 0.0:
				var o: = ShaderMaterial.new();o.shader = OUTLINE_SHADER
				o.set_shader_parameter("albedo", col)
				o.set_shader_parameter("has_tex", tex != null)
				if tex: o.set_shader_parameter("albedo_tex", tex)
				o.set_shader_parameter("width", outline_width)
				m.next_pass = o
			mi.set_surface_override_material(s, m)

