class_name GrassField
extends MultiMeshInstance3D




const QUALITY: = [[11.0, 0.62], [15.0, 0.54], [18.0, 0.46]]

var world: World
var target: Node3D
var spacing: = 0.5
var radius: = 20.0
var mat: ShaderMaterial

func setup(w: World, tgt: Node3D) -> void :
	world = w;target = tgt
	name = "GrassField"
	cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	mat = ShaderMaterial.new();mat.shader = load("res://shaders/grass.gdshader")
	var N: = World.N

	var himg: = Image.create_from_data(N, N, false, Image.FORMAT_RF, world.hmap.to_byte_array())
	var cimg: = Image.create_from_data(N, N, false, Image.FORMAT_RGBA8, world.cmap)
	var mbytes: = PackedByteArray();mbytes.resize(N * N)
	for j in N:
		for i in N:
			var g: = j * N + i
			var h: = world.hmap[g]
			var ny: = world._grid_normal(i, j).y
			var d: = smoothstep(0.35, 0.8, world.cmap[g * 4 + 3] / 255.0)
			d *= smoothstep(0.8, 0.88, ny) * smoothstep(2.2, 2.8, h) * (1.0 - world.amap[g * 4 + 3] / 255.0)
			d *= 1.0 - world.amap[g * 4] / 255.0
			mbytes[g] = int(clampf(d, 0.0, 1.0) * 255.0)
	var mimg: = Image.create_from_data(N, N, false, Image.FORMAT_L8, mbytes)
	const MR: = 1536
	mimg.resize(MR, MR, Image.INTERPOLATE_BILINEAR)

	var px: = MR / World.SIZE
	for cs in world.solid.get_children():
		if not (cs is CollisionShape3D): continue
		var shape: Shape3D = cs.shape
		var c: Vector3 = cs.global_position
		var ext: = Vector2.ZERO
		if shape is BoxShape3D:
			var bs: Vector3 = (shape as BoxShape3D).size
			var yaw: float = cs.rotation.y
			var hx: = absf(cos(yaw)) * bs.x * 0.5 + absf(sin(yaw)) * bs.z * 0.5
			var hz: = absf(sin(yaw)) * bs.x * 0.5 + absf(cos(yaw)) * bs.z * 0.5
			ext = Vector2(hx, hz) + Vector2(0.4, 0.4)
		elif shape is CylinderShape3D:
			var r: float = (shape as CylinderShape3D).radius + 0.25
			ext = Vector2(r, r)
		elif shape is SphereShape3D:
			var r2: float = (shape as SphereShape3D).radius * 0.85
			ext = Vector2(r2, r2)
		elif shape is ConvexPolygonShape3D and cs.rotation.y == 0.0:
			var bb: = AABB()
			for v in (shape as ConvexPolygonShape3D).points: bb = bb.expand(v)
			if bb.position.y > 1.0: continue
			ext = Vector2(maxf( - bb.position.x, bb.end.x), maxf( - bb.position.z, bb.end.z)) * 0.8
		else:
			continue
		var x0: = int((c.x - ext.x + World.HALF) * px); var z0: = int((c.z - ext.y + World.HALF) * px)
		var x1: = int(ceil((c.x + ext.x + World.HALF) * px)); var z1: = int(ceil((c.z + ext.y + World.HALF) * px))
		mimg.fill_rect(Rect2i(x0, z0, maxi(1, x1 - x0), maxi(1, z1 - z0)), Color(0, 0, 0))
	mat.set_shader_parameter("hmap", ImageTexture.create_from_image(himg))
	mat.set_shader_parameter("gcolor", ImageTexture.create_from_image(cimg))
	mat.set_shader_parameter("gmask", ImageTexture.create_from_image(mimg))
	mat.set_shader_parameter("map_rect", Vector4( - World.HALF, - World.HALF, World.SIZE, N))
	material_override = mat
	multimesh = MultiMesh.new()
	multimesh.transform_format = MultiMesh.TRANSFORM_3D
	multimesh.mesh = _clump_mesh()


func configure(q: int) -> void :
	radius = QUALITY[q][0];spacing = QUALITY[q][1]
	var cells: = int(ceil(radius / spacing))
	var xs: Array[Transform3D] = []
	for j in range( - cells, cells + 1):
		for i in range( - cells, cells + 1):
			if Vector2(i, j).length() * spacing <= radius:
				xs.append(Transform3D(Basis(), Vector3(i * spacing, 0, j * spacing)))
	multimesh.instance_count = xs.size()
	for k in xs.size(): multimesh.set_instance_transform(k, xs[k])
	custom_aabb = AABB(Vector3( - radius - 1.0, -20.0, - radius - 1.0), Vector3(radius * 2.0 + 2.0, 120.0, radius * 2.0 + 2.0))
	mat.set_shader_parameter("radius", radius)
	mat.set_shader_parameter("spacing", spacing)


func _clump_mesh() -> ArrayMesh:
	var st: = SurfaceTool.new()
	st.begin(Mesh.PRIMITIVE_TRIANGLES)
	var rng: = RandomNumberGenerator.new();rng.seed = 7
	for b in 4:
		var ang: = b * TAU / 4.0 + rng.randf_range(-0.4, 0.4)
		var off: = Vector3(cos(ang), 0, sin(ang)) * rng.randf_range(0.03, 0.14)
		var face: = ang + PI * 0.5 + rng.randf_range(-0.5, 0.5)
		var side: = Vector3(cos(face), 0, sin(face))
		var lean: = Vector3(cos(ang), 0, sin(ang)) * rng.randf_range(0.08, 0.2)
		var hgt: = rng.randf_range(0.7, 1.0)
		var w: = rng.randf_range(0.045, 0.065)
		var pts: = [off - side * w, off + side * w, 
			off + lean * 0.4 - side * w * 0.72 + Vector3(0, hgt * 0.5, 0), off + lean * 0.4 + side * w * 0.72 + Vector3(0, hgt * 0.5, 0), 
			off + lean + Vector3(0, hgt, 0)]
		var uvs: = [Vector2(0, 0), Vector2(1, 0), Vector2(0, 0.5), Vector2(1, 0.5), Vector2(0.5, 1.0)]
		for tri in [[0, 1, 2], [1, 3, 2], [2, 3, 4]]:
			for v in tri:
				st.set_uv(uvs[v]);st.set_normal(Vector3.UP);st.add_vertex(pts[v])
	return st.commit()

func _process(_delta: float) -> void :
	if target == null: return
	var p: = target.global_position
	global_position = Vector3(snappedf(p.x, spacing), 0.0, snappedf(p.z, spacing))
	mat.set_shader_parameter("player_pos", p)
