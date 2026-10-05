class_name WeaponTrail
extends MeshInstance3D
## Traînée lumineuse derrière la lame pendant les attaques (comme les « smears » des action-RPG).

var sock: Node3D
var base_y: = 0.1
var tip_y: = 0.7
var col: = Color.WHITE
## palette de dégradé (récent -> ancien) ; vide = couleur unique
var pal: Array = []
var emitting: = false
var life: = 0.14
var _pts: Array = []
var _im: ImmediateMesh

static func blade_extent(w: Node3D) -> Vector2:
	var lo: = INF
	var hi: = - INF
	var meshes: Array = w.find_children("*", "MeshInstance3D", true, false)
	if w is MeshInstance3D: meshes.append(w)
	for mi in meshes:
		var bb: AABB = (mi as MeshInstance3D).get_aabb()
		var xf: Transform3D = w.global_transform.affine_inverse() * (mi as Node3D).global_transform if w.is_inside_tree() else Transform3D.IDENTITY
		bb = xf * bb
		lo = minf(lo, bb.position.y);hi = maxf(hi, bb.end.y)
	if lo == INF: return Vector2(0.1, 0.8)
	var length: = hi - maxf(lo, 0.0)
	return Vector2(maxf(lo, 0.0) + length * 0.22, hi)

func setup(s: Node3D, a: float, b: float, c: Color) -> void :
	sock = s;base_y = a;tip_y = b;col = c

func _ready() -> void :
	top_level = true
	global_transform = Transform3D.IDENTITY
	_im = ImmediateMesh.new()
	mesh = _im
	cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	var m: = StandardMaterial3D.new()
	m.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	m.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	m.blend_mode = BaseMaterial3D.BLEND_MODE_ADD
	m.cull_mode = BaseMaterial3D.CULL_DISABLED
	m.vertex_color_use_as_albedo = true
	m.disable_receive_shadows = true
	material_override = m
	extra_cull_margin = 16.0

func _process(_d: float) -> void :
	var now: = Time.get_ticks_msec() / 1000.0
	if emitting and is_instance_valid(sock) and sock.is_visible_in_tree():
		var xf: = sock.global_transform
		_pts.push_front([now, xf * Vector3(0, base_y, 0), xf * Vector3(0, tip_y, 0)])
	while _pts.size() > 0 and now - _pts[_pts.size() - 1][0] > life:
		_pts.pop_back()
	_im.clear_surfaces()
	if _pts.size() < 2: return
	_im.surface_begin(Mesh.PRIMITIVE_TRIANGLE_STRIP)
	var n: = _pts.size()
	for i in n - 1:
		var p0: Array = _pts[maxi(i - 1, 0)]
		var p1: Array = _pts[i]
		var p2: Array = _pts[i + 1]
		var p3: Array = _pts[mini(i + 2, n - 1)]
		var steps: = 3
		for k in steps:
			var t: = float(k) / steps
			var age: float = lerpf(now - p1[0], now - p2[0], t)
			var f: = clampf(1.0 - age / life, 0.0, 1.0)
			var a: Vector3 = _cr(p0[1], p1[1], p2[1], p3[1], t)
			var b: Vector3 = _cr(p0[2], p1[2], p2[2], p3[2], t)
			var hot: = col.lerp(Color.WHITE, 0.55 * f)
			if not pal.is_empty():
				var u: = 1.0 - f
				hot = (pal[0] as Color).lerp(pal[1], clampf(u * 3.0, 0.0, 1.0)) if u < 0.33 else ((pal[1] as Color).lerp(pal[2], (u - 0.33) * 3.0) if u < 0.66 else (pal[2] as Color).lerp(pal[3], (u - 0.66) * 3.0))
			_im.surface_set_color(Color(col.r, col.g, col.b, 0.0))
			_im.surface_add_vertex(a)
			_im.surface_set_color(Color(hot.r, hot.g, hot.b, 0.85 * f * f))
			_im.surface_add_vertex(b)
	var last: Array = _pts[n - 1]
	_im.surface_set_color(Color(col.r, col.g, col.b, 0.0));_im.surface_add_vertex(last[1])
	_im.surface_set_color(Color(col.r, col.g, col.b, 0.0));_im.surface_add_vertex(last[2])
	_im.surface_end()

static func _cr(p0: Vector3, p1: Vector3, p2: Vector3, p3: Vector3, t: float) -> Vector3:
	var t2: = t * t
	var t3: = t2 * t
	return 0.5 * ((2.0 * p1) + (- p0 + p2) * t + (2.0 * p0 - 5.0 * p1 + 4.0 * p2 - p3) * t2 + (- p0 + 3.0 * p1 - 3.0 * p2 + p3) * t3)
