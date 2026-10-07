class_name MeshBuf
extends RefCounted
## Accumulateur de géométrie multi-matériaux -> ArrayMesh (une surface par matériau).

var _surf := {}   # clé matériau -> {mat, v, n, t, uv, c, idx}


func _surface(mat: Material) -> Dictionary:
	var key := mat.get_instance_id()
	if not _surf.has(key):
		_surf[key] = {"mat": mat, "v": PackedVector3Array(), "n": PackedVector3Array(), "t": PackedFloat32Array(),
			"uv": PackedVector2Array(), "c": PackedColorArray(), "i": PackedInt32Array()}
	return _surf[key]


## Quad p0-p1-p2-p3 (sens antihoraire vu de face), uv correspondants.
func quad(mat: Material, p0: Vector3, p1: Vector3, p2: Vector3, p3: Vector3,
		uv0: Vector2, uv1: Vector2, uv2: Vector2, uv3: Vector2, col: Color = Color.WHITE) -> void:
	var s := _surface(mat)
	var base: int = s.v.size()
	var nrm := (p1 - p0).cross(p3 - p0)
	if nrm.length_squared() < 1e-10:
		nrm = (p2 - p1).cross(p3 - p1)
	nrm = nrm.normalized()
	var tan := (p1 - p0).normalized()
	for p in [p0, p1, p2, p3]:
		s.v.append(p)
		s.n.append(nrm)
		s.t.append_array([tan.x, tan.y, tan.z, 1.0])
		s.c.append(col)
	s.uv.append_array([uv0, uv1, uv2, uv3])
	# Godot : faces avant dans le sens horaire -> on inverse l'ordre
	s.i.append_array([base, base + 2, base + 1, base, base + 3, base + 2])


## Quad orienté automatiquement vers face_dir (inverse l'ordre si nécessaire).
func quad_f(mat: Material, p0: Vector3, p1: Vector3, p2: Vector3, p3: Vector3,
		uv0: Vector2, uv1: Vector2, uv2: Vector2, uv3: Vector2, face_dir: Vector3, col: Color = Color.WHITE) -> void:
	var nrm := (p1 - p0).cross(p3 - p0)
	if nrm.dot(face_dir) >= 0.0:
		quad(mat, p0, p1, p2, p3, uv0, uv1, uv2, uv3, col)
	else:
		quad(mat, p1, p0, p3, p2, uv1, uv0, uv3, uv2, col)


## Boîte orientée : xf = transform du centre de la face inférieure, size = (largeur, hauteur, profondeur)
func box(mat: Material, xf: Transform3D, size: Vector3, uv_scale: float = 0.25, col: Color = Color.WHITE,
		skip_bottom: bool = true) -> void:
	var hx := size.x * 0.5
	var hz := size.z * 0.5
	var h := size.y
	var c := [Vector3(-hx, 0, -hz), Vector3(hx, 0, -hz), Vector3(hx, 0, hz), Vector3(-hx, 0, hz),
		Vector3(-hx, h, -hz), Vector3(hx, h, -hz), Vector3(hx, h, hz), Vector3(-hx, h, hz)]
	var w := []
	for p in c:
		w.append(xf * p)
	var us := uv_scale
	var bx := xf.basis
	var fz := bx * Vector3(0, 0, 1)
	var fx := bx * Vector3(1, 0, 0)
	var fy := bx * Vector3(0, 1, 0)
	# avant (+Z), arrière (-Z), droite (+X), gauche (-X), dessus
	quad_f(mat, w[3], w[2], w[6], w[7], Vector2(0, h * us), Vector2(size.x * us, h * us), Vector2(size.x * us, 0), Vector2(0, 0), fz, col)
	quad_f(mat, w[1], w[0], w[4], w[5], Vector2(0, h * us), Vector2(size.x * us, h * us), Vector2(size.x * us, 0), Vector2(0, 0), -fz, col)
	quad_f(mat, w[2], w[1], w[5], w[6], Vector2(0, h * us), Vector2(size.z * us, h * us), Vector2(size.z * us, 0), Vector2(0, 0), fx, col)
	quad_f(mat, w[0], w[3], w[7], w[4], Vector2(0, h * us), Vector2(size.z * us, h * us), Vector2(size.z * us, 0), Vector2(0, 0), -fx, col)
	quad_f(mat, w[7], w[6], w[5], w[4], Vector2(0, 0), Vector2(size.x * us, 0), Vector2(size.x * us, size.z * us), Vector2(0, size.z * us), fy, col)
	if not skip_bottom:
		quad_f(mat, w[0], w[1], w[2], w[3], Vector2(0, 0), Vector2(1, 0), Vector2(1, 1), Vector2(0, 1), -fy, col)


## Tube le long d'un chemin (câbles).
func tube(mat: Material, path: PackedVector3Array, radius: float, segs: int = 6) -> void:
	for i in path.size() - 1:
		var a := path[i]
		var b := path[i + 1]
		var d := (b - a).normalized()
		var up := Vector3.UP if absf(d.y) < 0.95 else Vector3.RIGHT
		var s1 := d.cross(up).normalized()
		var s2 := s1.cross(d).normalized()
		for k in segs:
			var a0 := TAU * k / segs
			var a1 := TAU * (k + 1) / segs
			var o0 := (s1 * cos(a0) + s2 * sin(a0)) * radius
			var o1 := (s1 * cos(a1) + s2 * sin(a1)) * radius
			quad(mat, a + o0, a + o1, b + o1, b + o0, Vector2.ZERO, Vector2(1, 0), Vector2(1, 1), Vector2(0, 1))


func is_empty() -> bool:
	return _surf.is_empty()


func commit() -> ArrayMesh:
	var mesh := ArrayMesh.new()
	for key in _surf:
		var s: Dictionary = _surf[key]
		if s.v.is_empty():
			continue
		var arr := []
		arr.resize(Mesh.ARRAY_MAX)
		arr[Mesh.ARRAY_VERTEX] = s.v
		arr[Mesh.ARRAY_NORMAL] = s.n
		arr[Mesh.ARRAY_TANGENT] = s.t
		arr[Mesh.ARRAY_TEX_UV] = s.uv
		arr[Mesh.ARRAY_COLOR] = s.c
		arr[Mesh.ARRAY_INDEX] = s.i
		mesh.add_surface_from_arrays(Mesh.PRIMITIVE_TRIANGLES, arr)
		mesh.surface_set_material(mesh.get_surface_count() - 1, s.mat)
	return mesh
