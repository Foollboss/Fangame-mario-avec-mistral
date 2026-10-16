class_name RoadBuilder
extends RefCounted
## Construction des visuels du réseau routier 3D : chaussées des itinéraires bis, garde-corps,
## tabliers et piles de viaduc, immeubles qui portent la route des toits, tranchées et
## tunnels, portiques de direction aux embranchements, et découpe des bas-côtés de chaque
## route là où une autre route passe à côté (pas de sol qui traverse une chaussée).

const STEP := 2.0
const DECK_H := 1.3          # épaisseur des tabliers

var track: Track
var mats: Dictionary = {}
var clips: Dictionary = {}   # RoadPath -> [clip gauche, clip droit] (PackedFloat32Array)


func _init(p_track: Track, p_mats: Dictionary) -> void:
	track = p_track
	mats = p_mats


# ---------------------------------------------------------------------------
# Découpe des bas-côtés
# ---------------------------------------------------------------------------
## Pour chaque route et chaque côté : jusqu'où ses bas-côtés (trottoir, sol) peuvent
## s'étendre avant de rencontrer une autre route au même niveau (milieu entre les deux).
func compute_clips() -> void:
	for p: RoadPath in track.paths:
		var cl := PackedFloat32Array()
		var cr := PackedFloat32Array()
		cl.resize(p.n)
		cr.resize(p.n)
		cl.fill(1e6)
		cr.fill(1e6)
		clips[p] = [cl, cr]
	for p: RoadPath in track.paths:
		for q: RoadPath in track.paths:
			if q == p:
				continue
			_clip_against(p, q)


func _clip_against(p: RoadPath, q: RoadPath) -> void:
	var cl: PackedFloat32Array = clips[p][0]
	var cr: PackedFloat32Array = clips[p][1]
	var j := 0
	while j < q.n:
		var sm: float = q.progress(j * STEP)
		var hint: float = p.s_for_main(sm)
		var pr := p.project(q.pts[j], hint, 40.0)
		var i := int(round(pr.x / STEP))
		var lateral := pr.y
		# hauteur de q par rapport aux bas-côtés de p (p en tranchée : le haut de ses murs)
		var top := 0.0
		if i >= 0 and i < p.h_rel.size() and p.h_rel[i] < 1.2:
			top = maxf(0.0, -p.h_rel[i])
		var dh := pr.z - top
		# à côté (même niveau ou tranchée peu profonde) : le sol de p s'arrête avant q
		# (pas au-dessus d'un tunnel : le sol de la ville le recouvre)
		if not q.in_tunnel(j * STEP) and dh > -7.6 and dh < 3.0 and absf(lateral) < p.half_width + 90.0 and absf(lateral) > p.half_width - 0.5 and i >= 0 and i < p.n:
			var mid: float = maxf(p.half_width, (p.half_width + absf(lateral) - q.half_width) * 0.5)
			var arr: PackedFloat32Array = cr if lateral > 0.0 else cl
			for k in range(maxi(i - 3, 0), mini(i + 4, p.n)):
				if mid < arr[k]:
					arr[k] = mid
		j += 2
	clips[p][0] = cl
	clips[p][1] = cr


func clip_at(p: RoadPath, side: int, i: int) -> float:
	var arr: PackedFloat32Array = clips[p][0 if side < 0 else 1]
	return arr[clampi(i, 0, p.n - 1)]


## Bord ouvert (embranchement / jonction) à l'index i de ce côté ?
static func is_open(p: RoadPath, side: int, i: int) -> bool:
	return p.link_at(i * STEP + 1.0, side) != null


# ---------------------------------------------------------------------------
# Maillage générique : bande de profil le long d'une route
# ---------------------------------------------------------------------------
## prof_fn(i) -> Array[Vector2] (x latéral, y vers le haut), même nombre de points pour tout i.
## draw_fn(i) -> bool : dessiner le segment i -> i+1 (facultatif).
func strip(mesh: ArrayMesh, p: RoadPath, i0: int, i1: int, prof_fn: Callable, mat: Material, road_uv := false, draw_fn := Callable(), flat_far := false) -> void:
	var st := SurfaceTool.new()
	st.begin(Mesh.PRIMITIVE_TRIANGLES)
	var count := 0
	for i in range(i0, mini(i1, p.n - 1)):
		if draw_fn.is_valid() and not draw_fn.call(i):
			continue
		var pa_arr: Array = prof_fn.call(i)
		var pb_arr: Array = prof_fn.call(i + 1)
		var acc := 0.0
		for k in range(pa_arr.size() - 1):
			var a0: Vector2 = pa_arr[k]
			var a1: Vector2 = pa_arr[k + 1]
			var b0: Vector2 = pb_arr[k]
			var b1: Vector2 = pb_arr[k + 1]
			var seg := (a1 - a0).length()
			if seg < 0.001 and (b1 - b0).length() < 0.001:
				continue
			var d := (a1 - a0).normalized() if seg > 0.001 else (b1 - b0).normalized()
			var n2 := Vector2(-d.y, d.x)
			var va0 := _vtx(p, i, a0, flat_far)
			var va1 := _vtx(p, i, a1, flat_far)
			var vb1 := _vtx(p, i + 1, b1, flat_far)
			var vb0 := _vtx(p, i + 1, b0, flat_far)
			var nrm0 := (p.rights[i] * n2.x + p.ups[i] * n2.y).normalized()
			var nrm1 := (p.rights[i + 1] * n2.x + p.ups[i + 1] * n2.y).normalized()
			var u0: float = a0.x if road_uv else acc
			var u1: float = a1.x if road_uv else acc + seg
			acc += seg
			var v0 := i * STEP
			var v1 := (i + 1) * STEP
			var quad := [[va0, Vector2(u0, v0), nrm0], [va1, Vector2(u1, v0), nrm0], [vb1, Vector2(u1, v1), nrm1], [vb0, Vector2(u0, v1), nrm1]]
			var geo: Vector3 = (va1 - va0).cross(vb1 - va0)
			var order := [0, 1, 2, 0, 2, 3]
			if geo.dot(nrm0) > 0.0:
				order = [0, 2, 1, 0, 3, 2]
			for o in order:
				st.set_normal(quad[o][2])
				st.set_uv(quad[o][1])
				st.add_vertex(quad[o][0])
			count += 1
	if count == 0:
		return
	st.set_material(mat)
	st.commit(mesh)


func _vtx(p: RoadPath, i: int, v: Vector2, flat_far: bool) -> Vector3:
	if flat_far and absf(v.x) > p.half_width + 7.0:
		var flat_r := Vector3(p.rights[i].x, 0.0, p.rights[i].z).normalized()
		return p.pts[i] + flat_r * v.x + Vector3.UP * v.y
	return p.pts[i] + p.rights[i] * v.x + p.ups[i] * v.y


## Profil d'un côté (défini pour le côté droit, x croissant) : miroir pour la gauche,
## et découpe à la limite lim (aucun point au-delà). interp : les points au-delà prennent
## la hauteur du profil en lim (pas de marche verticale au bord de la découpe).
static func side_prof(prof: Array, side: int, lim: float, interp := false) -> Array:
	var yl := prof_y(prof, lim) if interp else 0.0
	var src: Array = []
	for v: Vector2 in prof:
		if v.x <= lim:
			src.append(v)
		else:
			src.append(Vector2(lim, yl if interp else v.y))
	var out: Array = []
	if side > 0:
		out = src
	else:
		for k in range(src.size() - 1, -1, -1):
			var v: Vector2 = src[k]
			out.append(Vector2(-v.x, v.y))
	return out


## Hauteur d'un profil (x croissant) à l'abscisse x.
static func prof_y(prof: Array, x: float) -> float:
	if x <= prof[0].x:
		return prof[0].y
	for k in range(prof.size() - 1):
		var a: Vector2 = prof[k]
		var b: Vector2 = prof[k + 1]
		if x <= b.x:
			return lerpf(a.y, b.y, (x - a.x) / maxf(b.x - a.x, 0.0001))
	return prof[prof.size() - 1].y


func _add_mesh(mesh: ArrayMesh, shadows := false) -> void:
	if mesh.get_surface_count() == 0:
		return
	var mi := MeshInstance3D.new()
	mi.mesh = mesh
	if not shadows:
		mi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	track.add_child(mi)


# ---------------------------------------------------------------------------
# Itinéraires bis
# ---------------------------------------------------------------------------
func build_branches() -> void:
	for b: RoadPath in track.branches:
		_build_branch(b)
	_build_signs()


func _gap_at(p: RoadPath, i: int) -> bool:
	return p.in_gap(i * STEP + 1.0)


func _build_branch(b: RoadPath) -> void:
	var hw := b.half_width
	var road_mat := ShaderMaterial.new()
	road_mat.shader = load("res://shaders/road.gdshader")
	road_mat.set_shader_parameter("half_width", hw)
	road_mat.set_shader_parameter("lane_width", b.lane_w)
	road_mat.set_shader_parameter("wet", track.theme["wet"])
	road_mat.set_shader_parameter("rails", 0.0)
	var concrete: Material = mats["concrete"]
	var neon: Material = mats["neon"]
	var side_mat: Material = mats["side"]
	var ground_mat: Material = mats["ground"]
	var deck_mat: Material = mats["deck"]
	var urban: bool = track.theme_id != "nevada"
	var barrier := [Vector2(hw - 0.02, 0.0), Vector2(hw + 0.06, 0.28), Vector2(hw + 0.2, 1.05), Vector2(hw + 0.45, 1.05), Vector2(hw + 0.58, 0.28), Vector2(hw + 0.65, 0.0)]
	var neon_p := [Vector2(hw + 0.2, 1.06), Vector2(hw + 0.45, 1.06)]
	var chunk := 60
	var c := 0
	while c < b.n - 1:
		var i0 := c
		var i1: int = mini(c + chunk, b.n - 1)
		var mesh := ArrayMesh.new()
		# chaussée (pas au-dessus des vides)
		strip(mesh, b, i0, i1, func(_i): return [Vector2(-hw, 0.0), Vector2(hw, 0.0)], road_mat, true,
			func(i): return not _gap_at(b, i))
		for side in [-1, 1]:
			# garde-corps : pas sur un bord ouvert, pas au-dessus d'un vide, ni collé à une autre route
			var bp := func(i): return side_prof(barrier, side, 1e6)
			var bdraw := func(i):
				return not is_open(b, side, i) and not _gap_at(b, i) and clip_at(b, side, i) > hw + 0.9 and not b.in_tunnel(i * STEP)
			strip(mesh, b, i0, i1, bp, concrete, false, bdraw)
			strip(mesh, b, i0, i1, func(i): return side_prof(neon_p, side, 1e6), neon, false, bdraw)
			# au sol ou en tranchée : mur de soutènement + trottoir + sol, découpés près des autres routes
			var gfull := func(i) -> Array:
				var top: float = maxf(0.2, -b.h_rel[i] + 0.3)
				var prof := [Vector2(hw + 0.66, top), Vector2(hw + 6.0, top), Vector2(hw + 26.0, top - 0.1), Vector2(hw + 60.0, top - 1.5)]
				if not urban:
					prof[0] = Vector2(hw + 0.66, top - 0.15)
				return prof
			var glim := func(i): return maxf(clip_at(b, side, i), hw + 0.66)
			var gprof := func(i): return side_prof(gfull.call(i), side, glim.call(i), true)
			var gdraw := func(i): return b.h_rel[i] < 1.2 and not b.in_tunnel(i * STEP) and not _gap_at(b, i) and not is_open(b, side, i)
			strip(mesh, b, i0, i1, gprof, side_mat if urban else ground_mat, false, gdraw, true)
			# mur de soutènement de la tranchée (béton), puis bord du sol là où il est découpé
			var wprof := func(i): return side_prof([Vector2(hw + 0.65, 0.0), Vector2(hw + 0.66, gfull.call(i)[0].y)], side, 1e6)
			strip(mesh, b, i0, i1, wprof, concrete, false, gdraw)
			var cprof := func(i):
				var lim: float = glim.call(i)
				var x0 := minf(hw + 60.0, lim)
				var full: Array = gfull.call(i)
				return side_prof([Vector2(x0, prof_y(full, x0)), Vector2(minf(hw + 61.0, lim), full[0].y - 40.0)], side, 1e6)
			strip(mesh, b, i0, i1, cprof, concrete, false, gdraw, true)
			# ouvrage en hauteur : flancs du tablier
			var fprof := func(i): return side_prof([Vector2(hw + 0.65, 0.0), Vector2(hw + 0.7, -DECK_H)], side, 1e6)
			var fdraw := func(i): return b.h_rel[i] >= 1.2 and not _gap_at(b, i)
			strip(mesh, b, i0, i1, fprof, deck_mat, false, fdraw)
		# dessous du tablier (visible depuis la route du dessous)
		strip(mesh, b, i0, i1, func(_i): return [Vector2(hw + 0.7, -DECK_H), Vector2(-hw - 0.7, -DECK_H)], deck_mat, false,
			func(i): return b.h_rel[i] >= 1.2 and not _gap_at(b, i))
		_add_mesh(mesh)
		c = i1
	_build_supports(b)
	_build_tunnel(b)
	_build_launch_ramp(b)
	_build_branch_lamps(b)


## Piles du viaduc et immeubles qui portent la route des toits.
func _build_supports(b: RoadPath) -> void:
	var deck_mat: Material = mats["deck"]
	var i := 0
	var block_start := -1
	while i < b.n:
		var high: bool = b.h_rel[i] > 3.0 and not _gap_at(b, i)
		if b.kind == "rooftop":
			# blocs d'immeubles sous le toit (coupés aux vides entre deux toits)
			if high and block_start < 0:
				block_start = i
			var end_block: bool = block_start >= 0 and (not high or i - block_start >= 13 or i == b.n - 1)
			if end_block:
				_rooftop_building(b, block_start, i)
				block_start = i if high else -1
		elif high and i % 11 == 0:
			_pillar(b, i, deck_mat)
		i += 1


func _ground_y(b: RoadPath, i: int) -> float:
	return b.pts[i].y - b.h_rel[i] - 0.3


func _over_other_road(b: RoadPath, pos: Vector3, margin: float) -> bool:
	var sm := _main_s_near(pos)
	for q: RoadPath in track.paths:
		if q == b:
			continue
		var pr: Vector3 = q.project(pos, q.s_for_main(sm), 60.0)
		if absf(pr.y) < q.half_width + margin and pr.x > 1.0 and pr.x < q.length - 1.0 and pr.z > -3.0 and pr.z < 4.0:
			return true
	return false


func _main_s_near(pos: Vector3) -> float:
	var m: RoadPath = track.main
	var best := 0
	var bd := INF
	var k := 0
	while k < m.n:
		var d := Vector2(pos.x - m.pts[k].x, pos.z - m.pts[k].z).length_squared()
		if d < bd:
			bd = d
			best = k
		k += 4
	return best * STEP


func _pillar(b: RoadPath, i: int, mat: Material) -> void:
	var top := b.pts[i] - b.ups[i] * DECK_H
	var base_y := _ground_y(b, i) - 2.0
	var hgt := top.y - base_y
	if hgt < 2.0:
		return
	var base := Vector3(top.x, base_y, top.z)
	if _over_other_road(b, base + Vector3.UP * 0.5, 2.2):
		return
	var pil := MeshInstance3D.new()
	var bm := BoxMesh.new()
	bm.size = Vector3(2.2, hgt, 2.2)
	pil.mesh = bm
	pil.material_override = mat
	track.add_child(pil)
	var f := Vector3(b.fwds[i].x, 0, b.fwds[i].z).normalized()
	var bas := Basis(f.cross(Vector3.UP).normalized(), Vector3.UP, -f)
	pil.global_transform = Transform3D(bas, Vector3(top.x, base_y + hgt * 0.5, top.z))
	# chapiteau sous le tablier
	var cap := MeshInstance3D.new()
	var cm := BoxMesh.new()
	cm.size = Vector3(b.half_width * 2.0 + 1.0, 0.8, 2.6)
	cap.mesh = cm
	cap.material_override = mat
	track.add_child(cap)
	cap.global_transform = Transform3D(bas, top - Vector3.UP * 0.4)


func _rooftop_building(b: RoadPath, i0: int, i1: int) -> void:
	if i1 - i0 < 2:
		return
	var pa := b.pts[i0]
	var pb := b.pts[i1]
	var mid := (pa + pb) * 0.5
	var f := Vector3(pb.x - pa.x, 0, pb.z - pa.z)
	var ln := f.length()
	if ln < 2.0:
		return
	f /= ln
	var r := f.cross(Vector3.UP).normalized()
	var top: float = minf(pa.y, pb.y) - 0.35
	var base_y: float = minf(_ground_y(b, i0), _ground_y(b, i1)) - 1.5
	var h := top - base_y
	if h < 3.0:
		return
	var w := b.half_width * 2.0 + 4.0
	var xform := Transform3D(Basis(r * w, Vector3.UP * h, -f * (ln + 0.6)), Vector3(mid.x, base_y + h * 0.5, mid.z))
	var pal: Array = track.theme["palette"]
	var col := Color(pal[(i0 / 7) % pal.size()]).darkened(0.1)
	track.extra_buildings.append([xform, Color(col.r, col.g, col.b, float(i0 % 13) / 13.0)])


func _build_tunnel(b: RoadPath) -> void:
	if b.tunnels.is_empty():
		return
	var hw := b.half_width + 0.7
	var wall_mat: Material = mats["tunnel_wall"]
	var light_mat: Material = mats["tunnel_light"]
	var concrete: Material = mats["concrete"]
	for tn in b.tunnels:
		var i0 := int(float(tn["s0"]) / STEP)
		var i1 := int(float(tn["s1"]) / STEP)
		var mesh := ArrayMesh.new()
		# murs tournés vers l'intérieur du tunnel (visibles depuis la route)
		strip(mesh, b, i0, i1, func(_i): return [Vector2(hw, 0.0), Vector2(hw + 0.01, 7.6)], wall_mat)
		strip(mesh, b, i0, i1, func(_i): return [Vector2(-hw - 0.01, 7.6), Vector2(-hw, 0.0)], wall_mat)
		strip(mesh, b, i0, i1, func(_i): return [Vector2(hw, 7.6), Vector2(-hw, 7.6)], concrete)
		strip(mesh, b, i0, i1, func(_i): return [Vector2(0.45, 7.55), Vector2(-0.45, 7.55)], light_mat)
		strip(mesh, b, i0, i1, func(_i): return [Vector2(-hw - 1.5, 7.7), Vector2(hw + 1.5, 7.7)], concrete)
		_add_mesh(mesh)
		# portails : mur au-dessus de l'entrée et de la sortie, jusqu'au sol de la ville
		for e in [i0, i1]:
			var ii := clampi(e, 0, b.n - 1)
			var depth: float = -b.h_rel[ii]
			var hgt := depth - 7.6 + 1.5
			if hgt <= 0.3:
				continue
			var tr := b.frame(ii * STEP)
			var portal := MeshInstance3D.new()
			var bm := BoxMesh.new()
			bm.size = Vector3(hw * 2.0 + 4.0, hgt, 1.2)
			portal.mesh = bm
			portal.material_override = concrete
			track.add_child(portal)
			portal.global_transform = Transform3D(tr.basis, tr.origin + tr.basis.y * (7.6 + hgt * 0.5))
		if track.quality >= 2:
			var s: float = float(tn["s0"]) + 12.0
			while s < float(tn["s1"]):
				var l := OmniLight3D.new()
				l.light_color = Color(1.0, 0.9, 0.75)
				l.light_energy = 1.8
				l.omni_range = 16.0
				track.add_child(l)
				l.global_position = b.position_at(s, 0.0, 6.8)
				s += 28.0


func _build_launch_ramp(b: RoadPath) -> void:
	for r in b.ramps:
		if not r.get("launch", false):
			continue
		var node := track._load_scene("res://assets/props/ramp.glb")
		if node == null:
			node = MeshInstance3D.new()
			(node as MeshInstance3D).mesh = BoxMesh.new()
		track.add_child(node)
		var tr := b.frame(float(r["s"]))
		node.transform = Transform3D(Basis(tr.basis.x * float(r["w"]), tr.basis.y * float(r["h"]), tr.basis.z * float(r["len"])), tr.origin)
		# flèches lumineuses au bord du vide
		for side in [-1.0, 1.0]:
			var post := MeshInstance3D.new()
			var pm := BoxMesh.new()
			pm.size = Vector3(0.4, 2.2, 0.4)
			post.mesh = pm
			post.material_override = mats["neon"]
			track.add_child(post)
			var te := b.frame(float(r["s"]) + float(r["len"]))
			post.global_transform = Transform3D(te.basis, te.origin + te.basis.x * side * (b.half_width + 0.4) + te.basis.y * 1.1)


func _build_branch_lamps(b: RoadPath) -> void:
	var xforms: Array = []
	var s := 30.0
	var flip := 1.0
	while s < b.length - 30.0:
		var i := int(s / STEP)
		if not b.in_tunnel(s) and not b.in_gap(s) and not is_open(b, int(flip), i) and clip_at(b, int(flip), i) > b.half_width + 1.5:
			var tr := b.frame(s)
			var flat_r := Vector3(tr.basis.x.x, 0, tr.basis.x.z).normalized()
			var p := tr.origin + flat_r * flip * (b.half_width + 1.1) + Vector3.UP * 0.2
			var x_axis := -flat_r * flip
			var bas := Basis(x_axis, Vector3.UP, x_axis.cross(Vector3.UP).normalized() * -1.0).orthonormalized()
			xforms.append(Transform3D(bas, p))
		flip = -flip
		s += 36.0
	track._multimesh(track._mesh_from("res://assets/props/lamp.glb"), xforms)


# ---------------------------------------------------------------------------
# Portiques de direction aux embranchements
# ---------------------------------------------------------------------------
func _build_signs() -> void:
	var colors := {"rooftop": Color(1.0, 0.55, 0.1), "tunnel": Color(0.25, 0.55, 1.0), "viaduct": Color(0.15, 0.75, 0.35), "alley": Color(0.85, 0.25, 0.8)}
	var main: RoadPath = track.main
	var done := {}
	for l in main.links:
		if not l.get("fork", false):
			continue
		var b: RoadPath = l["to"]
		var side: int = l["side"]
		var s_sign: float = float(l["s0"]) - 70.0
		var tr := main.frame(s_sign)
		# portique au-dessus de la route
		var key := int(s_sign)
		if not done.has(key):
			done[key] = true
			var beam := MeshInstance3D.new()
			var bb := BoxMesh.new()
			bb.size = Vector3(main.half_width * 2.0 + 3.0, 0.5, 0.5)
			beam.mesh = bb
			beam.material_override = mats["deck"]
			track.add_child(beam)
			beam.global_transform = Transform3D(tr.basis, tr.origin + tr.basis.y * 7.6)
			for sd in [-1.0, 1.0]:
				var post := MeshInstance3D.new()
				var pb := BoxMesh.new()
				pb.size = Vector3(0.5, 7.8, 0.5)
				post.mesh = pb
				post.material_override = mats["deck"]
				track.add_child(post)
				post.global_transform = Transform3D(tr.basis, tr.origin + tr.basis.x * sd * (main.half_width + 1.4) + tr.basis.y * 3.9)
			# panneau « tout droit » au centre
			_sign_panel(tr, 0.0, "▲ ARRIVÉE", Color(0.12, 0.45, 0.2))
		var col: Color = colors.get(b.kind, Color(0.3, 0.3, 0.3))
		var txt := (b.label + "  ▶") if side > 0 else ("◀  " + b.label)
		_sign_panel(tr, side * (main.half_width - 3.2), txt, col)
		# coussin amortisseur à la pointe de la séparation
		var tn := main.frame(float(l["s1"]) + 1.0)
		var cb := MeshInstance3D.new()
		var cbm := BoxMesh.new()
		cbm.size = Vector3(1.6, 1.1, 2.2)
		cb.mesh = cbm
		cb.material_override = mats["cushion"]
		track.add_child(cb)
		cb.global_transform = Transform3D(tn.basis, tn.origin + tn.basis.x * side * main.half_width + tn.basis.y * 0.55)


func _sign_panel(tr: Transform3D, x: float, text: String, col: Color) -> void:
	var panel := MeshInstance3D.new()
	var pm := BoxMesh.new()
	pm.size = Vector3(5.6, 1.7, 0.2)
	panel.mesh = pm
	var mat := StandardMaterial3D.new()
	mat.albedo_color = col
	mat.emission_enabled = true
	mat.emission = col
	mat.emission_energy_multiplier = 0.6 + 1.2 * float(track.theme["night"])
	panel.material_override = mat
	track.add_child(panel)
	panel.global_transform = Transform3D(tr.basis, tr.origin + tr.basis.x * x + tr.basis.y * 6.6 + tr.basis.z * 0.3)
	var lbl := Label3D.new()
	lbl.text = text
	lbl.font = UIKit.font("black")
	lbl.font_size = 96
	lbl.pixel_size = 0.012
	lbl.modulate = Color.WHITE
	lbl.outline_size = 0
	track.add_child(lbl)
	lbl.global_transform = Transform3D(tr.basis, tr.origin + tr.basis.x * x + tr.basis.y * 6.6 + tr.basis.z * 0.42)
