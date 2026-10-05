class_name FX
extends RefCounted


static var world: Node3D
static var _mat_cache: = {}

const HYDRO: = Color(0.25, 0.72, 1.0)
const ELECTRO: = Color(0.72, 0.45, 1.0)
const PYRO: = Color(1.0, 0.45, 0.2)
const LAVA: = Color(1.0, 0.32, 0.08)
const HEAL: = Color(0.45, 1.0, 0.6)

static func mat_emit(col: Color, energy: = 2.0, alpha: = 1.0, vcol: = false) -> StandardMaterial3D:
	var key: = "%s_%s_%s_%s" % [col.to_html(), energy, alpha, vcol]
	if _mat_cache.has(key):
		return _mat_cache[key]
	var m: = StandardMaterial3D.new()
	m.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	m.albedo_color = Color(col.r, col.g, col.b, alpha)
	m.emission_enabled = true
	m.emission = col
	m.emission_energy_multiplier = energy
	m.cull_mode = BaseMaterial3D.CULL_DISABLED
	if alpha < 1.0 or vcol:
		m.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	if vcol:
		m.vertex_color_use_as_albedo = true
	m.disable_receive_shadows = true
	_mat_cache[key] = m
	return m

static func add(n: Node3D, pos: Vector3) -> Node3D:
	world.add_child(n)
	n.global_position = pos
	return n

static func mesh_node(mesh: Mesh, mat: Material, pos: Vector3) -> MeshInstance3D:
	var mi: = MeshInstance3D.new()
	mi.mesh = mesh
	mi.material_override = mat
	mi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	add(mi, pos)
	return mi

static func fade_free(n: Node3D, t: float, grow: = Vector3.ONE) -> void :
	var tw: = n.create_tween().set_parallel(true)
	tw.tween_property(n, "scale", grow, t).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
	if n is MeshInstance3D and n.material_override is StandardMaterial3D:
		var m: StandardMaterial3D = n.material_override.duplicate()
		m.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
		n.material_override = m
		tw.tween_property(m, "albedo_color:a", 0.0, t)
	tw.chain().tween_callback(n.queue_free)


static func sphere(pos: Vector3, col: Color, r0: float, r1: float, t: float, alpha: = 0.6) -> void :
	var s: = SphereMesh.new();s.radius = 1.0;s.height = 2.0;s.radial_segments = 20;s.rings = 10
	var mi: = mesh_node(s, mat_emit(col, 2.5, alpha), pos)
	mi.scale = Vector3.ONE * r0
	fade_free(mi, t, Vector3.ONE * r1)

static func ring(pos: Vector3, col: Color, r0: float, r1: float, t: float, thick: = 0.15, alpha: = 0.85) -> void :
	var tm: = TorusMesh.new();tm.inner_radius = 1.0 - thick;tm.outer_radius = 1.0;tm.rings = 40;tm.ring_segments = 6
	var mi: = mesh_node(tm, mat_emit(col, 2.5, alpha), pos + Vector3(0, 0.08, 0))
	mi.scale = Vector3(r0, r0 * 0.6, r0)
	fade_free(mi, t, Vector3(r1, r1 * 0.35, r1))


static func danger(pos: Vector3, r: float, t: float, col: = Color(1.0, 0.22, 0.18)) -> void :
	var cm: = CylinderMesh.new();cm.top_radius = 1.0;cm.bottom_radius = 1.0;cm.height = 0.02;cm.radial_segments = 36;cm.rings = 1
	var fill: = mesh_node(cm, mat_emit(col, 1.2, 0.3), pos + Vector3(0, 0.07, 0))
	fill.scale = Vector3(0.05, 1.0, 0.05)
	var tw: = fill.create_tween()
	tw.tween_property(fill, "scale", Vector3(r, 1.0, r), t)
	tw.tween_callback(fill.queue_free)
	var tm: = TorusMesh.new();tm.inner_radius = 0.93;tm.outer_radius = 1.0;tm.rings = 48;tm.ring_segments = 4
	var edge: = mesh_node(tm, mat_emit(col, 2.2, 0.9), pos + Vector3(0, 0.09, 0))
	edge.scale = Vector3(r, 0.25, r)
	var tw2: = edge.create_tween();tw2.tween_interval(t);tw2.tween_callback(edge.queue_free)

static func column(pos: Vector3, col: Color, r: float, h: float, t: float) -> void :
	var cm: = CylinderMesh.new();cm.top_radius = r * 0.6;cm.bottom_radius = r;cm.height = 1.0;cm.cap_top = false;cm.cap_bottom = false
	var mi: = mesh_node(cm, mat_emit(col, 2.0, 0.32), pos + Vector3(0, h * 0.5, 0))
	mi.scale = Vector3(1, 0.1, 1)
	var tw: = mi.create_tween()
	tw.tween_property(mi, "scale", Vector3(1.1, h, 1.1), t * 0.35).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	tw.tween_interval(t * 0.25)
	tw.tween_callback( func(): fade_free(mi, t * 0.4, Vector3(1.4, h * 1.1, 1.4)))

static func particles(pos: Vector3, col: Color, amount: = 24, speed: = 5.0, life: = 0.7, size: = 0.12, gravity: = -6.0) -> void :
	var p: = CPUParticles3D.new()
	var sm: = SphereMesh.new();sm.radius = size;sm.height = size * 2.0;sm.radial_segments = 6;sm.rings = 3
	p.mesh = sm
	p.material_override = mat_emit(col, 3.0)
	p.amount = amount
	p.one_shot = true
	p.explosiveness = 0.95
	p.lifetime = life
	p.direction = Vector3.UP
	p.spread = 180.0
	p.initial_velocity_min = speed * 0.5
	p.initial_velocity_max = speed
	p.gravity = Vector3(0, gravity, 0)
	p.scale_amount_min = 0.6
	p.scale_amount_max = 1.2
	var curve: = Curve.new();curve.add_point(Vector2(0, 1));curve.add_point(Vector2(1, 0))
	p.scale_amount_curve = curve
	add(p, pos)
	p.emitting = true
	world.get_tree().create_timer(life + 0.3, false).timeout.connect(p.queue_free)

static func flash(pos: Vector3, col: Color, energy: = 4.0, rng: = 8.0, t: = 0.25) -> void :
	var l: = OmniLight3D.new();l.light_color = col;l.light_energy = energy;l.omni_range = rng
	l.shadow_enabled = false
	add(l, pos)
	var tw: = l.create_tween();tw.tween_property(l, "light_energy", 0.0, t);tw.tween_callback(l.queue_free)


static func bolt(from: Vector3, to: Vector3, col: = ELECTRO, width: = 0.12, life: = 0.18, jag: = 0.35) -> void :
	var pts: Array[Vector3] = [from]
	var n: = int(clamp(from.distance_to(to) / 0.6, 4, 24))
	var d: = (to - from)
	var perp1: = d.cross(Vector3.UP).normalized()
	if perp1.length() < 0.1:
		perp1 = Vector3.RIGHT
	var perp2: = d.cross(perp1).normalized()
	for i in range(1, n):
		var t: = float(i) / n
		pts.append(from + d * t + perp1 * randf_range( - jag, jag) + perp2 * randf_range( - jag, jag))
	pts.append(to)
	var st: = SurfaceTool.new()
	st.begin(Mesh.PRIMITIVE_TRIANGLES)
	for k in 2:
		var side: = perp1 if k == 0 else perp2
		for i in pts.size() - 1:
			var a: = pts[i]; var b: = pts[i + 1]
			var w: = width * (1.0 - 0.5 * float(i) / pts.size())
			var v: = [a - side * w, a + side * w, b + side * w, b - side * w]
			for idx in [0, 1, 2, 0, 2, 3]:
				st.add_vertex(v[idx])
	var mi: = MeshInstance3D.new()
	mi.mesh = st.commit()
	mi.material_override = mat_emit(col.lightened(0.4), 4.0)
	mi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	world.add_child(mi)
	var tw: = mi.create_tween()
	tw.tween_interval(life)
	tw.tween_callback(mi.queue_free)

static func arcs(pos: Vector3, radius: = 0.8, count: = 4, col: = ELECTRO) -> void :
	for i in count:
		var a: = pos + Vector3(randf_range(-1, 1), randf_range(-0.2, 1), randf_range(-1, 1)).normalized() * radius * 0.3
		var b: = pos + Vector3(randf_range(-1, 1), randf_range(-0.3, 1), randf_range(-1, 1)).normalized() * radius
		bolt(a, b, col, 0.03, 0.12, 0.12)


static func slash(pos: Vector3, yaw: float, col: Color, radius: = 2.2, arc_deg: = 150.0, flip: = false, tilt: = 0.0) -> void :
	var st: = SurfaceTool.new()
	st.begin(Mesh.PRIMITIVE_TRIANGLES)
	var seg: = 18
	var a0: = deg_to_rad( - arc_deg * 0.5); var a1: = deg_to_rad(arc_deg * 0.5)
	for i in seg:
		var t0: = float(i) / seg; var t1: = float(i + 1) / seg
		var ang0: = lerpf(a0, a1, t0); var ang1: = lerpf(a0, a1, t1)
		if flip:
			ang0 = - ang0
			ang1 = - ang1
		var al0: = sin(t0 * PI); var al1: = sin(t1 * PI)
		var w0: = 0.35 * al0 + 0.05; var w1: = 0.35 * al1 + 0.05
		var p: = [Vector3(sin(ang0), 0, cos(ang0)) * radius, Vector3(sin(ang0), 0, cos(ang0)) * (radius - w0), 
			Vector3(sin(ang1), 0, cos(ang1)) * (radius - w1), Vector3(sin(ang1), 0, cos(ang1)) * radius]
		var c0: = Color(col.r, col.g, col.b, al0); var c1: = Color(col.r, col.g, col.b, al1)
		var cs: = [c0, c0, c1, c1]
		for idx in [0, 1, 2, 0, 2, 3]:
			st.set_color(cs[idx]);st.add_vertex(p[idx])
	var mi: = mesh_node(st.commit(), mat_emit(col.lightened(0.3), 3.0, 1.0, true), pos)
	mi.rotation = Vector3(tilt, yaw, 0)
	fade_free(mi, 0.22, Vector3(1.15, 1.15, 1.15))

# ----------------------------------------------------------------------------
# Effets multicolores : chaque élément a une palette (cœur clair -> couleur -> couleur profonde)
# et une couleur d'accent pour les étincelles.
# ----------------------------------------------------------------------------
const PALETTES: = {
	"hydro": [Color(0.9, 1.0, 1.0), Color(0.4, 0.92, 1.0), Color(0.18, 0.5, 1.0), Color(0.36, 0.28, 0.95)],
	"electro": [Color(1.0, 0.95, 1.0), Color(1.0, 0.58, 0.95), Color(0.7, 0.38, 1.0), Color(0.38, 0.18, 0.9)],
	"pyro": [Color(1.0, 0.97, 0.72), Color(1.0, 0.76, 0.22), Color(1.0, 0.4, 0.1), Color(0.86, 0.1, 0.16)],
	"lava": [Color(1.0, 0.93, 0.55), Color(1.0, 0.56, 0.1), Color(0.92, 0.2, 0.06), Color(0.45, 0.08, 0.1)],
	"cryo": [Color(1.0, 1.0, 1.0), Color(0.75, 0.95, 1.0), Color(0.5, 0.78, 1.0), Color(0.62, 0.55, 1.0)],
	"heal": [Color(0.95, 1.0, 0.9), Color(0.6, 1.0, 0.65), Color(0.3, 0.9, 0.55), Color(0.2, 0.7, 0.75)],
}
const ACCENTS: = {"hydro": Color(0.65, 1.0, 0.85), "electro": Color(1.0, 0.86, 0.4), "pyro": Color(1.0, 0.95, 0.55),
	"lava": Color(1.0, 0.75, 0.3), "cryo": Color(0.9, 1.0, 1.0), "heal": Color(1.0, 1.0, 0.7)}

static func pal(elem: String) -> Array:
	return PALETTES.get(elem, [Color.WHITE, element_color(elem).lightened(0.3), element_color(elem), element_color(elem).darkened(0.3)])

static var _pmat: StandardMaterial3D
## Matériau des particules colorées par sommet (un peu « surexposé » pour déclencher le halo).
static func _particle_mat() -> StandardMaterial3D:
	if _pmat == null:
		_pmat = StandardMaterial3D.new()
		_pmat.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
		_pmat.vertex_color_use_as_albedo = true
		_pmat.albedo_color = Color(1.7, 1.7, 1.7, 1.0)
		_pmat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
		_pmat.cull_mode = BaseMaterial3D.CULL_DISABLED
		_pmat.disable_receive_shadows = true
	return _pmat

## Particules dont chaque grain prend une couleur au hasard dans la palette, puis pâlit et s'éteint.
static func particles_pal(pos: Vector3, elem: String, amount: = 24, speed: = 5.0, life: = 0.7, size: = 0.12, gravity: = -6.0) -> void :
	var pl: Array = pal(elem)
	var p: = CPUParticles3D.new()
	var sm: = SphereMesh.new();sm.radius = size;sm.height = size * 2.0;sm.radial_segments = 6;sm.rings = 3
	p.mesh = sm
	p.material_override = _particle_mat()
	p.amount = amount;p.one_shot = true;p.explosiveness = 0.92;p.lifetime = life
	p.direction = Vector3.UP;p.spread = 180.0
	p.initial_velocity_min = speed * 0.4;p.initial_velocity_max = speed
	p.gravity = Vector3(0, gravity, 0)
	p.scale_amount_min = 0.5;p.scale_amount_max = 1.3
	var init: = Gradient.new()
	init.set_color(0, pl[0]);init.set_color(1, pl[3]);init.add_point(0.35, pl[1]);init.add_point(0.7, pl[2])
	p.color_initial_ramp = init
	var ramp: = Gradient.new()
	ramp.set_color(0, Color(1, 1, 1, 1));ramp.add_point(0.6, Color(1, 1, 1, 0.85));ramp.set_color(1, Color(1, 1, 1, 0.0))
	p.color_ramp = ramp
	var curve: = Curve.new();curve.add_point(Vector2(0, 1));curve.add_point(Vector2(1, 0))
	p.scale_amount_curve = curve
	add(p, pos)
	p.emitting = true
	world.get_tree().create_timer(life + 0.3, false).timeout.connect(p.queue_free)

## Petites étincelles rapides dans la couleur d'accent de l'élément.
static func sparks(pos: Vector3, elem: String, amount: = 14, speed: = 7.0) -> void :
	var col: Color = ACCENTS.get(elem, Color.WHITE)
	var p: = CPUParticles3D.new()
	var bm: = BoxMesh.new();bm.size = Vector3(0.03, 0.03, 0.22)
	p.mesh = bm;p.material_override = mat_emit(col, 4.0)
	p.amount = amount;p.one_shot = true;p.explosiveness = 1.0;p.lifetime = 0.35
	p.direction = Vector3.UP;p.spread = 180.0;p.initial_velocity_min = speed * 0.6;p.initial_velocity_max = speed
	p.gravity = Vector3(0, -4, 0);p.particle_flag_align_y = true
	p.scale_amount_min = 0.6;p.scale_amount_max = 1.2
	add(p, pos)
	p.emitting = true
	world.get_tree().create_timer(0.7, false).timeout.connect(p.queue_free)

## Arc de coup en dégradé : bord d'attaque blanc, cœur coloré, traîne profonde (deux couches).
static func slash_pal(pos: Vector3, yaw: float, elem: String, radius: = 2.2, arc_deg: = 150.0, flip: = false, tilt: = 0.0) -> void :
	var pl: Array = pal(elem)
	for layer in 2:
		var st: = SurfaceTool.new()
		st.begin(Mesh.PRIMITIVE_TRIANGLES)
		var seg: = 22
		var rr: = radius * (1.0 if layer == 0 else 0.84)
		var wmax: = 0.42 if layer == 0 else 0.26
		var a0: = deg_to_rad( - arc_deg * 0.5); var a1: = deg_to_rad(arc_deg * 0.5)
		for i in seg:
			var t0: = float(i) / seg; var t1: = float(i + 1) / seg
			var ang0: = lerpf(a0, a1, t0); var ang1: = lerpf(a0, a1, t1)
			if flip:
				ang0 = - ang0;ang1 = - ang1
			var al0: = sin(t0 * PI) * (0.55 + 0.45 * t0); var al1: = sin(t1 * PI) * (0.55 + 0.45 * t1)
			var w0: = wmax * sin(t0 * PI) + 0.04; var w1: = wmax * sin(t1 * PI) + 0.04
			var d0: = Vector3(sin(ang0), 0, cos(ang0)); var d1: = Vector3(sin(ang1), 0, cos(ang1))
			var p: = [d0 * rr, d0 * (rr - w0), d1 * (rr - w1), d1 * rr]
			var edge: Color = pl[0] if layer == 0 else pl[1]
			var core: Color = (pl[1] as Color).lerp(pl[2], t0) if layer == 0 else (pl[2] as Color).lerp(pl[3], t0)
			var core1: Color = (pl[1] as Color).lerp(pl[2], t1) if layer == 0 else (pl[2] as Color).lerp(pl[3], t1)
			var cs: = [Color(edge.r, edge.g, edge.b, al0), Color(core.r, core.g, core.b, 0.0), Color(core1.r, core1.g, core1.b, 0.0), Color(edge.r, edge.g, edge.b, al1)]
			# bande intérieure : du cœur coloré au transparent
			var mid0: = d0 * (rr - w0 * 0.45); var mid1: = d1 * (rr - w1 * 0.45)
			var tri: = [[p[0], cs[0]], [mid0, Color(core.r, core.g, core.b, al0)], [mid1, Color(core1.r, core1.g, core1.b, al1)], [p[3], cs[3]]]
			for idx in [0, 1, 2, 0, 2, 3]:
				st.set_color(tri[idx][1]);st.add_vertex(tri[idx][0])
			var tri2: = [[mid0, Color(core.r, core.g, core.b, al0)], [p[1], cs[1]], [p[2], cs[2]], [mid1, Color(core1.r, core1.g, core1.b, al1)]]
			for idx in [0, 1, 2, 0, 2, 3]:
				st.set_color(tri2[idx][1]);st.add_vertex(tri2[idx][0])
		var mi: = mesh_node(st.commit(), _particle_mat(), pos + Vector3(0, 0.02 * layer, 0))
		mi.rotation = Vector3(tilt, yaw, 0)
		fade_free(mi, 0.24 + layer * 0.05, Vector3(1.15, 1.15, 1.15))
	var tip_a: = deg_to_rad(arc_deg * 0.5) * (-1.0 if flip else 1.0)
	var tip: = Basis.from_euler(Vector3(tilt, yaw, 0)) * (Vector3(sin(tip_a), 0, cos(tip_a)) * radius)
	sparks(pos + tip, elem, 7, 5.0)

## Sphère à deux couches (cœur clair + halo profond).
static func sphere_pal(pos: Vector3, elem: String, r0: float, r1: float, t: float, alpha: = 0.6) -> void :
	var pl: Array = pal(elem)
	sphere(pos, pl[3], r0 * 1.15, r1 * 1.12, t * 1.1, alpha * 0.55)
	sphere(pos, pl[1], r0, r1 * 0.8, t, alpha)
	sphere(pos, pl[0], r0 * 0.5, r1 * 0.45, t * 0.7, alpha * 0.9)

## Deux anneaux décalés de couleurs différentes.
static func ring_pal(pos: Vector3, elem: String, r0: float, r1: float, t: float, thick: = 0.15, alpha: = 0.85) -> void :
	var pl: Array = pal(elem)
	ring(pos, pl[1], r0, r1, t, thick, alpha)
	ring(pos + Vector3(0, 0.05, 0), pl[3], r0 * 0.8, r1 * 0.82, t * 1.15, thick * 0.7, alpha * 0.8)
	ring(pos + Vector3(0, 0.1, 0), pl[0], r0 * 0.6, r1 * 0.62, t * 0.8, thick * 0.5, alpha)

## Colonne : cœur lumineux, gaine colorée.
static func column_pal(pos: Vector3, elem: String, r: float, h: float, t: float) -> void :
	var pl: Array = pal(elem)
	column(pos, pl[3], r * 1.25, h * 0.9, t * 1.1)
	column(pos, pl[1], r, h, t)
	column(pos, pl[0], r * 0.45, h * 1.05, t * 0.8)

## Gerbe complète (déchaînements, explosions) : sphère, anneaux, particules et étincelles.
static func palette_burst(pos: Vector3, elem: String, scale: = 1.0) -> void :
	sphere_pal(pos, elem, 0.3 * scale, 2.6 * scale, 0.45, 0.55)
	ring_pal(pos, elem, 0.4 * scale, 3.2 * scale, 0.5, 0.18)
	particles_pal(pos, elem, int(30 * scale), 6.0 * scale, 0.9, 0.1, -3.0)
	sparks(pos, elem, int(16 * scale), 9.0 * scale)
	flash(pos, (pal(elem)[1] as Color), 5.0 * scale, 10.0 * scale, 0.35)

static func float_text(pos: Vector3, text: String, col: Color, size: = 64, rise: = 1.4, life: = 0.9) -> void :
	var l: = Label3D.new()
	l.text = text
	l.modulate = col
	l.outline_modulate = Color(0.05, 0.05, 0.12, 0.9)
	l.outline_size = 12
	l.font_size = size
	l.pixel_size = 0.006
	l.billboard = BaseMaterial3D.BILLBOARD_ENABLED
	l.no_depth_test = true
	l.fixed_size = false
	add(l, pos + Vector3(randf_range(-0.3, 0.3), 0, randf_range(-0.3, 0.3)))
	# petit « pop » d'apparition, comme les chiffres de dégâts des action-RPG
	l.scale = Vector3.ONE * 1.55
	l.create_tween().tween_property(l, "scale", Vector3.ONE, 0.16).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	var tw: = l.create_tween().set_parallel(true)
	tw.tween_property(l, "position:y", l.position.y + rise, life).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
	tw.tween_property(l, "modulate:a", 0.0, life * 0.5).set_delay(life * 0.5)
	tw.tween_property(l, "outline_modulate:a", 0.0, life * 0.5).set_delay(life * 0.5)
	tw.chain().tween_callback(l.queue_free)

static func element_color(e: String) -> Color:
	match e:
		"hydro": return HYDRO
		"electro": return ELECTRO
		"pyro": return PYRO
		"lava": return LAVA
		"cryo": return Color(0.72, 0.93, 1.0)
	return Color.WHITE



class Projectile extends Node3D:
	var velocity: = Vector3.ZERO
	var life: = 1.0
	var radius: = 0.7
	var on_hit: Callable
	var trail_col: = FX.HYDRO
	var trail_elem: = ""
	var _t: = 0.0
	func _physics_process(delta: float) -> void :
		global_position += velocity * delta
		_t += delta
		if Engine.get_physics_frames() % 3 == 0:
			var tc: Color = trail_col
			if trail_elem != "":
				var pl: Array = FX.pal(trail_elem)
				tc = pl[1 + (Engine.get_physics_frames() / 3) % 3]
			FX.sphere(global_position, tc, 0.18, 0.05, 0.25, 0.5)
		for e in get_tree().get_nodes_in_group("enemies"):
			if e.alive and e.global_position.distance_to(global_position - Vector3(0, 0.4, 0)) < radius + e.hit_radius:
				if on_hit.is_valid(): on_hit.call(e, global_position)
				queue_free()
				return
		if _t > life:
			FX.sphere(global_position, trail_col, 0.2, 0.6, 0.2, 0.5)
			queue_free()
