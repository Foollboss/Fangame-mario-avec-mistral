class_name TrackBuilder
extends RefCounted
## Construit tout le décor 3D d'un circuit : chaussée, marquages, trottoirs, immeubles,
## pont suspendu, tunnel, canyon, plage, végétation, mobilier urbain, rampes, départ/arrivée.

const CHUNK := 50
const STEP := 2
const SW := 4.5          # largeur des trottoirs
const GROUND_FLAT := 55.0
const GROUND_SLOPE := 90.0

var track: Track
var env: Dictionary
var root: Node3D
var rng := RandomNumberGenerator.new()
var night := false
var quality := 1
var start_s := 42.0
var finish_s := 0.0
var base_y := -8.0
var water_y := -1000.0
var has_water := false
var env_id := "sf"
var _props := {}      # nom -> {group -> Array[Transform3D]}
var _m := {}          # matériaux


func build(p_track: Track, p_root: Node3D, p_quality: int) -> void:
	track = p_track
	root = p_root
	quality = p_quality
	env = track.env
	env_id = track.def.env
	night = bool(env.night)
	rng.seed = int(track.def.seed) * 13 + 1
	finish_s = track.length - track.runoff
	_setup_materials()
	_compute_levels()
	var n_chunks := int(ceil(float(track.n - 1) / CHUNK))
	for ci in n_chunks:
		_build_chunk(ci)
	_build_bridges()
	_build_tunnel_portals()
	_build_ramps()
	_build_gantry(start_s, "res://assets/textures/start_banner.png")
	_build_gantry(finish_s, "res://assets/textures/finish_banner.png")
	_build_far_scenery()
	_build_base()
	_flush_props()


func _setup_materials() -> void:
	_m.asphalt = MatLib.asphalt(night)
	_m.white = MatLib.line(Color(0.92, 0.92, 0.9))
	_m.yellow = MatLib.line(Color(0.95, 0.72, 0.1))
	_m.redlane = MatLib.textured("redlane", "res://assets/textures/asphalt_albedo.png", Color(0.95, 0.32, 0.28), 0.85)
	_m.rail = MatLib.plain("rail", Color(0.55, 0.55, 0.58), 0.3, 0.9)
	_m.concrete = MatLib.textured("sidewalk", "res://assets/textures/concrete_albedo.png",
		Color(0.85, 0.84, 0.82) if not night else Color(0.45, 0.45, 0.5), 0.9)
	_m.curb = MatLib.plain("curb", Color(0.7, 0.7, 0.68) if not night else Color(0.35, 0.35, 0.4), 0.9)
	var g: String = env.ground
	match g:
		"grass":
			_m.ground = MatLib.textured("ground_grass", "res://assets/textures/grass_albedo.png", Color.WHITE, 0.95)
		"sand":
			_m.ground = MatLib.textured("ground_sand", "res://assets/textures/sand_albedo.png", Color.WHITE, 0.95)
		_:
			_m.ground = MatLib.textured("ground_conc", "res://assets/textures/concrete_albedo.png",
				Color(0.62, 0.62, 0.6) if not night else Color(0.18, 0.18, 0.22), 0.95)
	_m.sand = MatLib.textured("ground_sand", "res://assets/textures/sand_albedo.png", Color.WHITE, 0.95)
	_m.rock = MatLib.prop_part("Rock")
	_m.roof = MatLib.textured("roof", "res://assets/textures/roof_albedo.png",
		Color.WHITE if not night else Color(0.4, 0.4, 0.45), 0.9)
	_m.trim_white = MatLib.plain("trim_white", Color(0.92, 0.91, 0.88) if not night else Color(0.4, 0.4, 0.45), 0.7)
	_m.trim_dark = MatLib.plain("trim_dark", Color(0.25, 0.25, 0.27), 0.7)
	_m.barrier = MatLib.textured("barrier", "res://assets/textures/concrete_albedo.png",
		Color(0.9, 0.9, 0.88) if not night else Color(0.5, 0.5, 0.55), 0.9)
	_m.gg = MatLib.prop_part("GGWhite" if track.def.get("bridge_color", "") == "white" else "GGRed")
	_m.deck = MatLib.plain("deck", Color(0.3, 0.3, 0.32), 0.8)
	_m.tunnel = MatLib.textured("tunnelwall", "res://assets/textures/concrete_albedo.png", Color(0.55, 0.55, 0.6), 0.6)
	_m.tunnel_light = MatLib.emissive("tunnel_light", Color(0.75, 0.95, 1.0) if night else Color(1.0, 0.9, 0.7), 4.0)
	_m.neon_strip = MatLib.emissive("neon_strip", Color(0.15, 0.85, 1.0), 3.0)
	_m.neon = MatLib.emissive_tex("neon", "res://assets/textures/neon_atlas.png", 2.6)
	_m.checker = MatLib.plain("checker_w", Color(0.95, 0.95, 0.95), 0.6)
	_m.checker_b = MatLib.plain("checker_b", Color(0.05, 0.05, 0.05), 0.6)
	_m.cable = MatLib.prop_part("GGWhite" if track.def.get("bridge_color", "") == "white" else "GGRed")
	_m.glass_rail = MatLib.plain("rail_metal", Color(0.6, 0.62, 0.65), 0.35, 0.8)


func _compute_levels() -> void:
	var miny := 1e9
	for i in track.n:
		miny = minf(miny, track.pos[i].y)
	base_y = miny - 8.0
	for i in track.n:
		var k: String = Track.SEC_NAMES[track.sec[i]]
		if k == "bridge":
			has_water = true
			water_y = minf(water_y if water_y > -999.0 else 1e9, track.pos[i].y - 62.0)
		elif k == "beach" and water_y < -999.0:
			has_water = true
	if has_water:
		if water_y < -999.0:
			water_y = miny - 2.6
		base_y = water_y


# ---------------------------------------------------------------------------
# Utilitaires
# ---------------------------------------------------------------------------

func P(i: int, x: float, h: float = 0.0) -> Vector3:
	return track.pos[i] + track.right[i] * x + Vector3.UP * h


func _sec(i: int) -> String:
	return Track.SEC_NAMES[track.sec[clampi(i, 0, track.n - 1)]]


func _side_kind(kind: String, side: int) -> String:
	if kind == "beach":
		return "city" if side < 0 else "beach"
	return kind


func _max_offset(i: int, side: int) -> float:
	var k := track.curv[i] * side
	if k > 1e-4:
		return 0.85 / k
	return 1e9


func _add_prop(name: String, xf: Transform3D, s: float) -> void:
	if not _props.has(name):
		_props[name] = {}
	var g := int(s / 200.0)
	if not _props[name].has(g):
		_props[name][g] = []
	_props[name][g].append(xf)


func _near_intersection(s: float, margin: float) -> bool:
	for it: float in track.intersections:
		if absf(s - it) < margin:
			return true
	return false


func _flat_basis(i: int) -> Basis:
	var f := track.fwd[i]
	f.y = 0.0
	f = f.normalized()
	var r := f.cross(Vector3.UP).normalized()
	return Basis(r, Vector3.UP, -f)


# ---------------------------------------------------------------------------
# Tronçons
# ---------------------------------------------------------------------------

func _build_chunk(ci: int) -> void:
	var i0 := ci * CHUNK
	var i1 := mini((ci + 1) * CHUNK, track.n - 1)
	var flat := MeshBuf.new()
	var solid := MeshBuf.new()
	var i := i0
	while i < i1:
		var j := mini(i + STEP, track.n - 1)
		_road(flat, i, j)
		var kind := _sec(i)
		for side: int in [-1, 1]:
			var sk := _side_kind(kind, side)
			match sk:
				"city":
					_sidewalk(flat, i, j, side)
					_ground(flat, i, j, side, track.wl[i] + SW if side < 0 else track.wr[i] + SW, 0.15)
				"beach":
					_sidewalk(flat, i, j, side, 3.0)
					_beach(flat, solid, i, j, side)
				"highway":
					_barrier(solid, i, j, side)
					_ground(flat, i, j, side, (track.wl[i] if side < 0 else track.wr[i]) + 0.6, -0.05)
				"open":
					_shoulder(flat, i, j, side)
					_ground(flat, i, j, side, (track.wl[i] if side < 0 else track.wr[i]) + 2.5, -0.08)
				"canyon":
					_shoulder(flat, i, j, side)
					_canyon(solid, i, j, side)
				"bridge":
					_bridge_side(flat, solid, i, j, side)
				"tunnel":
					_tunnel(solid, i, j, side)
		i = j
	# immeubles et accessoires
	for side: int in [-1, 1]:
		_buildings(solid, i0, i1, side)
	_street_props(i0, i1)
	_add_mesh(flat, "flat_%d" % ci, false)
	_add_mesh(solid, "solid_%d" % ci, quality >= 1)


func _add_mesh(mb: MeshBuf, nm: String, shadows: bool) -> void:
	if mb.is_empty():
		return
	var mi := MeshInstance3D.new()
	mi.name = nm
	mi.mesh = mb.commit()
	mi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_ON if shadows else \
		GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	mi.visibility_range_end = 1150.0
	mi.visibility_range_end_margin = 50.0
	root.add_child(mi)


func _road(mb: MeshBuf, i: int, j: int) -> void:
	var wl := track.wl[i]
	var wr := track.wr[i]
	var wlj := track.wl[j]
	var wrj := track.wr[j]
	var si := float(i)
	var sj := float(j)
	mb.quad(_m.asphalt, P(i, -wl), P(i, wr), P(j, wrj), P(j, -wlj),
		Vector2(-wl / 6.0, -si / 6.0), Vector2(wr / 6.0, -si / 6.0), Vector2(wrj / 6.0, -sj / 6.0), Vector2(-wlj / 6.0, -sj / 6.0))
	var h := 0.012
	var total := track.lanes * Track.LANE_W
	# lignes de rive
	_line(mb, _m.white, i, j, -total * 0.5 - 0.2, 0.15, h)
	_line(mb, _m.white, i, j, total * 0.5 + 0.2, 0.15, h)
	# séparations de voies
	var dash := (i % 12) < 4
	for k in range(1, track.lanes):
		var xb := -total * 0.5 + Track.LANE_W * k
		if track.two_way and k == track.lanes / 2:
			_line(mb, _m.yellow, i, j, xb - 0.14, 0.12, h)
			_line(mb, _m.yellow, i, j, xb + 0.14, 0.12, h)
		elif dash:
			_line(mb, _m.white, i, j, xb, 0.13, h)
	var kind := _sec(i)
	# San Francisco : rails de tramway + voie de bus rouge
	if env_id == "sf" and kind == "city":
		var lanes_t := [1, 2] if not track.two_way else [track.lanes / 2 - 1, track.lanes / 2]
		for k: int in lanes_t:
			var c := track.lane_center(k)
			for o: float in [-0.72, 0.72]:
				_line(mb, _m.rail, i, j, c + o, 0.09, 0.02)
		if not track.two_way:
			var c2 := track.lane_center(track.lanes - 1)
			mb.quad(_m.redlane, P(i, c2 - 1.65, 0.006), P(i, c2 + 1.65, 0.006), P(j, c2 + 1.65, 0.006), P(j, c2 - 1.65, 0.006),
				Vector2(0, si / 6.0), Vector2(0.55, si / 6.0), Vector2(0.55, sj / 6.0), Vector2(0, sj / 6.0))
	# passages piétons aux intersections
	for it: float in track.intersections:
		if si >= it - 8.0 and si < it - 3.0:
			var stripes := int(total / 1.0)
			for k2 in stripes:
				var x0 := -total * 0.5 + k2 * 1.0 + 0.2
				mb.quad(_m.white, P(i, x0, h), P(i, x0 + 0.55, h), P(j, x0 + 0.55, h), P(j, x0, h),
					Vector2.ZERO, Vector2.RIGHT, Vector2.ONE, Vector2.DOWN)
	# lignes de départ / arrivée (damier)
	for line_s: float in [start_s, finish_s]:
		if si <= line_s and sj > line_s:
			_checker(mb, line_s)


func _line(mb: MeshBuf, mat: Material, i: int, j: int, x: float, w: float, h: float) -> void:
	mb.quad(mat, P(i, x - w * 0.5, h), P(i, x + w * 0.5, h), P(j, x + w * 0.5, h), P(j, x - w * 0.5, h),
		Vector2.ZERO, Vector2.RIGHT, Vector2.ONE, Vector2.DOWN)


func _checker(mb: MeshBuf, s: float) -> void:
	var i := int(s)
	var total := track.wl[i] + track.wr[i]
	var sq := 0.9
	var nx := int(total / sq)
	for row in 2:
		for k in nx:
			var mat: Material = _m.checker if (k + row) % 2 == 0 else _m.checker_b
			var x0 := -track.wl[i] + k * sq
			var a := track.point(s + row * sq, x0, 0.015)
			var b := track.point(s + row * sq, x0 + sq, 0.015)
			var c := track.point(s + (row + 1) * sq, x0 + sq, 0.015)
			var d := track.point(s + (row + 1) * sq, x0, 0.015)
			mb.quad(mat, a, b, c, d, Vector2.ZERO, Vector2.RIGHT, Vector2.ONE, Vector2.DOWN)


func _sidewalk(mb: MeshBuf, i: int, j: int, side: int, width: float = SW) -> void:
	var e_i := track.wr[i] if side > 0 else track.wl[i]
	var e_j := track.wr[j] if side > 0 else track.wl[j]
	var hc := 0.15
	var inward := -track.right[i] * side
	# bordure (face verticale)
	mb.quad_f(_m.curb, P(i, side * e_i), P(j, side * e_j), P(j, side * e_j, hc), P(i, side * e_i, hc),
		Vector2(0, 0), Vector2(1, 0), Vector2(1, 0.05), Vector2(0, 0.05), inward)
	# dessus du trottoir
	var a := P(i, side * e_i, hc)
	var b := P(i, side * (e_i + width), hc)
	var c := P(j, side * (e_j + width), hc)
	var d := P(j, side * e_j, hc)
	mb.quad_f(_m.concrete, a, b, c, d, Vector2(0, i / 4.0), Vector2(width / 4.0, i / 4.0),
		Vector2(width / 4.0, j / 4.0), Vector2(0, j / 4.0), Vector3.UP)


func _ground(mb: MeshBuf, i: int, j: int, side: int, x_start: float, h: float) -> void:
	var lim_i := _max_offset(i, side)
	var lim_j := _max_offset(j, side)
	var x1i := minf(x_start + GROUND_FLAT, lim_i)
	var x1j := minf(x_start + GROUND_FLAT, lim_j)
	if x1i <= x_start + 1.0 or x1j <= x_start + 1.0:
		return
	var a := P(i, side * x_start, h)
	var b := P(i, side * x1i, h)
	var c := P(j, side * x1j, h)
	var d := P(j, side * x_start, h)
	var sc := 1.0 / 8.0
	mb.quad_f(_m.ground, a, b, c, d, Vector2(a.x, a.z) * sc, Vector2(b.x, b.z) * sc, Vector2(c.x, c.z) * sc,
		Vector2(d.x, d.z) * sc, Vector3.UP)
	# pente vers le niveau de base
	var x2i := minf(x1i + GROUND_SLOPE, lim_i)
	var x2j := minf(x1j + GROUND_SLOPE, lim_j)
	if x2i > x1i + 1.0 and x2j > x1j + 1.0:
		var bi := P(i, side * x2i)
		bi.y = base_y
		var bj := P(j, side * x2j)
		bj.y = base_y
		mb.quad_f(_m.ground, b, bi, bj, c, Vector2(b.x, b.z) * sc, Vector2(bi.x, bi.z) * sc, Vector2(bj.x, bj.z) * sc,
			Vector2(c.x, c.z) * sc, Vector3.UP)


func _shoulder(mb: MeshBuf, i: int, j: int, side: int) -> void:
	var e_i := track.wr[i] if side > 0 else track.wl[i]
	var e_j := track.wr[j] if side > 0 else track.wl[j]
	mb.quad_f(_m.sand if env_id == "desert" else _m.ground, P(i, side * e_i, -0.02), P(i, side * (e_i + 2.5), -0.08),
		P(j, side * (e_j + 2.5), -0.08), P(j, side * e_j, -0.02), Vector2(0, i / 6.0), Vector2(0.4, i / 6.0),
		Vector2(0.4, j / 6.0), Vector2(0, j / 6.0), Vector3.UP)


func _barrier(mb: MeshBuf, i: int, j: int, side: int) -> void:
	var e_i := (track.wr[i] if side > 0 else track.wl[i]) + 0.1
	var e_j := (track.wr[j] if side > 0 else track.wl[j]) + 0.1
	var inward := -track.right[i] * side
	var prof := [[0.0, 0.0], [0.0, 0.25], [0.12, 0.85], [0.32, 0.85], [0.44, 0.25], [0.44, 0.0]]
	for k in prof.size() - 1:
		var p0: Array = prof[k]
		var p1: Array = prof[k + 1]
		var a := P(i, side * (e_i + p0[0]), p0[1])
		var b := P(j, side * (e_j + p0[0]), p0[1])
		var c := P(j, side * (e_j + p1[0]), p1[1])
		var d := P(i, side * (e_i + p1[0]), p1[1])
		var face := inward if k < 2 else (Vector3.UP if k == 2 else -inward)
		mb.quad_f(_m.barrier, a, b, c, d, Vector2(0, 0), Vector2(1, 0), Vector2(1, 0.2), Vector2(0, 0.2), face)


func _beach(flat: MeshBuf, solid: MeshBuf, i: int, j: int, side: int) -> void:
	var e_i := track.wr[i] + 3.0
	var e_j := track.wr[j] + 3.0
	# muret
	var inward := -track.right[i]
	solid.quad_f(_m.trim_white, P(i, e_i, 0.15), P(j, e_j, 0.15), P(j, e_j, 0.75), P(i, e_i, 0.75),
		Vector2.ZERO, Vector2.RIGHT, Vector2.ONE, Vector2.DOWN, inward)
	solid.quad_f(_m.trim_white, P(i, e_i, 0.75), P(j, e_j, 0.75), P(j, e_j + 0.3, 0.75), P(i, e_i + 0.3, 0.75),
		Vector2.ZERO, Vector2.RIGHT, Vector2.ONE, Vector2.DOWN, Vector3.UP)
	# sable jusqu'à l'eau
	var lim_i := _max_offset(i, side)
	var lim_j := _max_offset(j, side)
	var x1i := minf(e_i + 70.0, lim_i)
	var x1j := minf(e_j + 70.0, lim_j)
	var a := P(i, e_i, -0.5)
	var d := P(j, e_j, -0.5)
	var b := P(i, x1i)
	b.y = water_y - 1.5
	var c := P(j, x1j)
	c.y = water_y - 1.5
	var sc := 1.0 / 8.0
	flat.quad_f(_m.sand, a, b, c, d, Vector2(a.x, a.z) * sc, Vector2(b.x, b.z) * sc, Vector2(c.x, c.z) * sc,
		Vector2(d.x, d.z) * sc, Vector3.UP)
	solid.quad_f(_m.trim_white, P(i, e_i + 0.3, -0.6), P(j, e_j + 0.3, -0.6), P(j, e_j + 0.3, 0.75), P(i, e_i + 0.3, 0.75),
		Vector2.ZERO, Vector2.RIGHT, Vector2.ONE, Vector2.DOWN, -inward)


func _canyon(mb: MeshBuf, i: int, j: int, side: int) -> void:
	var e_i := (track.wr[i] if side > 0 else track.wl[i]) + 2.5
	var e_j := (track.wr[j] if side > 0 else track.wl[j]) + 2.5
	var inward := -track.right[i] * side
	var prof := [[0.0, -0.1], [3.0, 3.0], [7.0, 14.0], [13.0, 26.0], [22.0, 34.0], [40.0, 38.0]]
	for k in prof.size() - 1:
		var p0: Array = prof[k]
		var p1: Array = prof[k + 1]
		var n0 := _rock_noise(i, side, k)
		var n1 := _rock_noise(i, side, k + 1)
		var m0 := _rock_noise(j, side, k)
		var m1 := _rock_noise(j, side, k + 1)
		var a := P(i, side * (e_i + p0[0] + n0 * 1.5), p0[1] * (1.0 + n0 * 0.25))
		var b := P(j, side * (e_j + p0[0] + m0 * 1.5), p0[1] * (1.0 + m0 * 0.25))
		var c := P(j, side * (e_j + p1[0] + m1 * 1.5), p1[1] * (1.0 + m1 * 0.25))
		var d := P(i, side * (e_i + p1[0] + n1 * 1.5), p1[1] * (1.0 + n1 * 0.25))
		mb.quad_f(_m.rock, a, b, c, d, Vector2.ZERO, Vector2.RIGHT, Vector2.ONE, Vector2.DOWN, inward + Vector3.UP * 0.3)


func _rock_noise(i: int, side: int, k: int) -> float:
	if k == 0:
		return 0.0
	var v := sin(i * 0.071 + side * 3.1 + k * 1.7) * 0.6 + sin(i * 0.23 + k * 2.3 + side) * 0.3 + sin(i * 0.53 + k) * 0.1
	return v


func _bridge_side(flat: MeshBuf, solid: MeshBuf, i: int, j: int, side: int) -> void:
	var e_i := track.wr[i] if side > 0 else track.wl[i]
	var e_j := track.wr[j] if side > 0 else track.wl[j]
	var inward := -track.right[i] * side
	var ww := 2.0
	# trottoir du pont
	solid.quad_f(_m.curb, P(i, side * e_i), P(j, side * e_j), P(j, side * e_j, 0.2), P(i, side * e_i, 0.2),
		Vector2.ZERO, Vector2.RIGHT, Vector2.ONE, Vector2.DOWN, inward)
	flat.quad_f(_m.concrete, P(i, side * e_i, 0.2), P(i, side * (e_i + ww), 0.2), P(j, side * (e_j + ww), 0.2),
		P(j, side * e_j, 0.2), Vector2(0, i / 4.0), Vector2(0.5, i / 4.0), Vector2(0.5, j / 4.0), Vector2(0, j / 4.0), Vector3.UP)
	# garde-corps
	var xr_i := e_i + ww
	var xr_j := e_j + ww
	solid.quad_f(_m.gg, P(i, side * xr_i, 1.15), P(j, side * xr_j, 1.15), P(j, side * xr_j, 1.3), P(i, side * xr_i, 1.3),
		Vector2.ZERO, Vector2.RIGHT, Vector2.ONE, Vector2.DOWN, inward)
	solid.quad_f(_m.gg, P(i, side * xr_i, 1.3), P(j, side * xr_j, 1.3), P(j, side * (xr_j + 0.15), 1.3),
		P(i, side * (xr_i + 0.15), 1.3), Vector2.ZERO, Vector2.RIGHT, Vector2.ONE, Vector2.DOWN, Vector3.UP)
	if i % 4 == 0:
		var b := _flat_basis(i)
		var xf := Transform3D(b, P(i, side * (xr_i + 0.07), 0.2))
		solid.box(_m.gg, xf, Vector3(0.12, 1.1, 0.12), 0.25)
	# tablier (dessous + flancs)
	var xo_i := e_i + ww + 0.4
	var xo_j := e_j + ww + 0.4
	solid.quad_f(_m.gg, P(i, side * xo_i, 0.2), P(j, side * xo_j, 0.2), P(j, side * xo_j, -3.5), P(i, side * xo_i, -3.5),
		Vector2.ZERO, Vector2.RIGHT, Vector2.ONE, Vector2.DOWN, -inward)
	solid.quad_f(_m.deck, P(i, 0.0, -3.5), P(i, side * xo_i, -3.5), P(j, side * xo_j, -3.5), P(j, 0.0, -3.5),
		Vector2.ZERO, Vector2.RIGHT, Vector2.ONE, Vector2.DOWN, Vector3.DOWN)
	# poutres treillis
	if i % 8 == 0:
		var b2 := _flat_basis(i)
		var xf2 := Transform3D(b2, P(i, side * (xo_i - 0.3), -3.5))
		solid.box(_m.gg, xf2, Vector3(0.4, 3.6, 0.4), 0.25)


func _tunnel(mb: MeshBuf, i: int, j: int, side: int) -> void:
	var e_i := (track.wr[i] if side > 0 else track.wl[i]) + 0.4
	var e_j := (track.wr[j] if side > 0 else track.wl[j]) + 0.4
	var inward := -track.right[i] * side
	var hgt := 7.0
	mb.quad_f(_m.tunnel, P(i, side * e_i), P(j, side * e_j), P(j, side * e_j, hgt), P(i, side * e_i, hgt),
		Vector2(i / 4.0, 0), Vector2(j / 4.0, 0), Vector2(j / 4.0, hgt / 4.0), Vector2(i / 4.0, hgt / 4.0), inward)
	# bande lumineuse
	mb.quad_f(_m.neon_strip if night else _m.tunnel_light, P(i, side * (e_i - 0.02), 3.6), P(j, side * (e_j - 0.02), 3.6),
		P(j, side * (e_j - 0.02), 3.85), P(i, side * (e_i - 0.02), 3.85), Vector2.ZERO, Vector2.RIGHT, Vector2.ONE,
		Vector2.DOWN, inward)
	if side > 0:
		var el := track.wl[i] + 0.4
		var elj := track.wl[j] + 0.4
		mb.quad_f(_m.tunnel, P(i, -el, hgt), P(i, e_i, hgt), P(j, e_j, hgt), P(j, -elj, hgt),
			Vector2.ZERO, Vector2.RIGHT, Vector2.ONE, Vector2.DOWN, Vector3.DOWN)
		if i % 10 == 0:
			for x: float in [-3.0, 3.0]:
				mb.quad_f(_m.tunnel_light, P(i, x - 0.3, hgt - 0.05), P(i, x + 0.3, hgt - 0.05),
					P(j, x + 0.3, hgt - 0.05), P(j, x - 0.3, hgt - 0.05), Vector2.ZERO, Vector2.RIGHT, Vector2.ONE,
					Vector2.DOWN, Vector3.DOWN)


# ---------------------------------------------------------------------------
# Immeubles
# ---------------------------------------------------------------------------

const VICTORIAN := ["#f2c6c2", "#c9e4de", "#f7e1a8", "#c6d8f0", "#e8c8e8", "#d9f0c4", "#f5d0a9", "#b5d3e7",
	"#f0f0e0", "#e6b8a2", "#a8d5ba", "#f3e5ab"]
const NEUTRAL := ["#e8e4dc", "#d8d2c8", "#c8c2b8", "#bfc6cc", "#e0d6c4", "#d4cfc8", "#f0ebe0", "#cfd8d4"]


func _buildings(mb: MeshBuf, i0: int, i1: int, side: int) -> void:
	var s := float(i0)
	var styles: Array = env.styles
	var hr: Array = env.heights
	while s < float(i1):
		var i := int(s)
		var kind := _side_kind(_sec(i), side)
		if kind != "city":
			s += 6.0
			continue
		if s < 8.0 or s > track.length - 12.0:
			s += 6.0
			continue
		if _near_intersection(s, 13.0):
			s += 4.0
			continue
		var style: String = styles[rng.randi_range(0, styles.size() - 1)]
		var w := rng.randf_range(7.5, 9.5) if style == "victorian" else rng.randf_range(10.0, 22.0)
		var d := rng.randf_range(12.0, 20.0)
		var h := rng.randf_range(hr[0], hr[1])
		if style == "victorian":
			h = rng.randf_range(10.0, 14.5)
		if _near_intersection(s + w, 13.0):
			s += 3.0
			continue
		_building(mb, s + w * 0.5, side, w, d, h, style)
		s += w + (0.0 if style == "victorian" else rng.randf_range(0.5, 3.0))


func _building(mb: MeshBuf, sc: float, side: int, w: float, d: float, h: float, style: String) -> void:
	var i := clampi(int(sc), 0, track.n - 1)
	var e := track.wr[i] if side > 0 else track.wl[i]
	var lim := _max_offset(i, side)
	if e + SW + 1.0 + d > lim:
		d = lim - (e + SW + 1.0)
		if d < 5.0:
			return
	var b := _flat_basis(i)
	var fdir := -b.z
	var rdir := b.x
	var toward := -rdir * side
	var gy := track.pos[i].y + 0.15
	var front := track.pos[i] + rdir * side * (e + SW + 1.0)
	front.y = gy
	var y0 := gy - 3.0
	var top := gy + h
	var col := Color(VICTORIAN[rng.randi_range(0, VICTORIAN.size() - 1)]) if style == "victorian" else \
		Color(NEUTRAL[rng.randi_range(0, NEUTRAL.size() - 1)])
	col.a = rng.randf()
	var fl := front - fdir * w * 0.5
	var fr := front + fdir * w * 0.5
	var bl := fl - toward * d
	var br := fr - toward * d
	var mat: Material = MatLib.facade(style)
	var uoff := float(rng.randi_range(0, 3)) * 0.5
	var shop_h := 4.5 if style != "victorian" else 0.0
	var us := 1.0 / 7.0
	# rez-de-chaussée commercial
	if shop_h > 0.0:
		var ms: Material = MatLib.facade("shop")
		_facade_quad(mb, ms, fl, fr, gy - 0.4, gy + shop_h, Vector2(uoff, 0.0), Vector2(uoff + w * us, 1.0), toward, col)
		_facade_quad(mb, mat, fl, fr, y0, gy - 0.4, Vector2(0, 0), Vector2(w * us, 0.3), toward, col)
	else:
		_facade_quad(mb, mat, fl, fr, y0, gy, Vector2(0, 0.5), Vector2(w * us, 0.9), toward, col)
	var up_h := top - (gy + shop_h)
	_facade_quad(mb, mat, fl, fr, gy + shop_h, top, Vector2(uoff, 0.0), Vector2(uoff + w * us, up_h * us), toward, col)
	# côtés
	_facade_quad(mb, mat, bl, fl, y0, top, Vector2(0, 0), Vector2(d * us, (top - y0) * us), -fdir, col)
	_facade_quad(mb, mat, fr, br, y0, top, Vector2(0, 0), Vector2(d * us, (top - y0) * us), fdir, col)
	# toit
	var r0 := Vector3(fl.x, top, fl.z)
	var r1 := Vector3(fr.x, top, fr.z)
	var r2 := Vector3(br.x, top, br.z)
	var r3 := Vector3(bl.x, top, bl.z)
	mb.quad_f(_m.roof, r0, r1, r2, r3, Vector2(0, 0), Vector2(w / 10.0, 0), Vector2(w / 10.0, d / 10.0), Vector2(0, d / 10.0),
		Vector3.UP)
	# corniche
	var cb := Basis(fdir.cross(Vector3.UP).normalized() * -1.0, Vector3.UP, toward).orthonormalized()
	cb = Basis(fdir, Vector3.UP, toward)
	var trim: Material = _m.trim_white if style == "victorian" or style == "stucco" else _m.trim_dark
	mb.box(trim, Transform3D(cb, front + Vector3.UP * (h - 0.8) + toward * 0.25), Vector3(w + 0.3, 0.8, 0.6), 0.25)
	if style == "victorian":
		# oriel (bow-window) sur la façade
		var bw := minf(3.4, w * 0.45)
		var bh := h - 4.0
		var bxf := Transform3D(cb, front + Vector3.UP * 3.0 + toward * 0.55 + fdir * (w * 0.18))
		_bay(mb, mat, bxf, bw, bh, col)
		mb.box(_m.trim_white, Transform3D(cb, front + Vector3.UP * (3.0 + bh) + toward * 0.6 + fdir * (w * 0.18)),
			Vector3(bw + 0.4, 0.35, 1.3), 0.25)
		# perron
		mb.box(_m.trim_white, Transform3D(cb, front + toward * 0.9 - fdir * (w * 0.3) + Vector3.DOWN * 0.1),
			Vector3(1.8, 1.1, 1.8), 0.25)
	elif style == "tokyo":
		_neon_signs(mb, front, fdir, toward, w, h, gy)
	elif style == "office" and night:
		mb.box(_m.neon_strip, Transform3D(cb, front + Vector3.UP * (h - 0.2) + toward * 0.32), Vector3(w + 0.35, 0.12, 0.62), 0.25)


func _facade_quad(mb: MeshBuf, mat: Material, a: Vector3, b: Vector3, y0: float, y1: float, uv0: Vector2,
		uv1: Vector2, face: Vector3, col: Color) -> void:
	var p0 := Vector3(a.x, y0, a.z)
	var p1 := Vector3(b.x, y0, b.z)
	var p2 := Vector3(b.x, y1, b.z)
	var p3 := Vector3(a.x, y1, a.z)
	mb.quad_f(mat, p0, p1, p2, p3, Vector2(uv0.x, uv1.y), Vector2(uv1.x, uv1.y), Vector2(uv1.x, uv0.y),
		Vector2(uv0.x, uv0.y), face, col)


func _bay(mb: MeshBuf, mat: Material, xf: Transform3D, w: float, h: float, col: Color) -> void:
	# boîte à pans coupés : face avant + deux pans à 45°
	var us := 1.0 / 7.0
	var hw := w * 0.5
	var dpt := 0.9
	var pts := [Vector3(-hw - 0.4, 0, -dpt), Vector3(-hw, 0, 0), Vector3(hw, 0, 0), Vector3(hw + 0.4, 0, -dpt)]
	for k in 3:
		var a: Vector3 = xf * pts[k]
		var b: Vector3 = xf * pts[k + 1]
		var face := (xf.basis * Vector3(0, 0, 1)).normalized()
		if k == 0:
			face = (xf.basis * Vector3(-1, 0, 1)).normalized()
		elif k == 2:
			face = (xf.basis * Vector3(1, 0, 1)).normalized()
		var wseg := a.distance_to(b)
		_facade_quad(mb, mat, a, b, a.y, a.y + h, Vector2(0.06, 0.0), Vector2(0.06 + wseg * us, h * us), face, col)
	var top := [xf * Vector3(-hw - 0.4, h, -dpt), xf * Vector3(-hw, h, 0), xf * Vector3(hw, h, 0), xf * Vector3(hw + 0.4, h, -dpt)]
	mb.quad_f(_m.roof, top[0], top[1], top[2], top[3], Vector2.ZERO, Vector2.RIGHT, Vector2.ONE, Vector2.DOWN, Vector3.UP)


func _neon_signs(mb: MeshBuf, front: Vector3, fdir: Vector3, toward: Vector3, w: float, h: float, gy: float) -> void:
	var n_signs := rng.randi_range(1, 3)
	for k in n_signs:
		var cell := rng.randi_range(0, 7)
		var u0 := (cell % 2) * 0.5
		var v0 := (cell / 2) * 0.25
		if rng.randf() < 0.5:
			# panneau vertical perpendiculaire à la façade
			var y0 := gy + rng.randf_range(5.0, maxf(6.0, h - 12.0))
			var along := fdir * rng.randf_range(-w * 0.4, w * 0.4)
			var base := front + along + toward * 0.1
			var p0 := Vector3(base.x, y0, base.z)
			var p1 := p0 + toward * 1.4
			var p2 := p1 + Vector3.UP * 7.0
			var p3 := p0 + Vector3.UP * 7.0
			mb.quad(_m.neon, p0, p1, p2, p3, Vector2(u0, v0), Vector2(u0, v0 + 0.25), Vector2(u0 + 0.5, v0 + 0.25),
				Vector2(u0 + 0.5, v0))
		else:
			var y1 := gy + rng.randf_range(5.0, maxf(6.0, h - 8.0))
			var sw := minf(w * 0.7, 8.0)
			var c := front + fdir * rng.randf_range(-w * 0.15, w * 0.15) + toward * 0.15
			var p0b := Vector3(c.x, y1, c.z) - fdir * sw * 0.5
			var p1b := Vector3(c.x, y1, c.z) + fdir * sw * 0.5
			mb.quad_f(_m.neon, p0b, p1b, p1b + Vector3.UP * sw * 0.5, p0b + Vector3.UP * sw * 0.5,
				Vector2(u0, v0 + 0.25), Vector2(u0 + 0.5, v0 + 0.25), Vector2(u0 + 0.5, v0), Vector2(u0, v0), toward)


# ---------------------------------------------------------------------------
# Accessoires (instanciés)
# ---------------------------------------------------------------------------

func _street_props(i0: int, i1: int) -> void:
	var veg: String = env.veg
	var s := float(i0)
	while s < float(i1):
		var i := int(s)
		var kind := _sec(i)
		for side: int in [-1, 1]:
			var sk := _side_kind(kind, side)
			var e := track.wr[i] if side > 0 else track.wl[i]
			var b := _flat_basis(i)
			if sk == "city" or sk == "beach":
				# lampadaires
				if i % 36 == (0 if side > 0 else 18):
					var lb := b if side < 0 else b.rotated(Vector3.UP, PI)
					_add_prop("streetlamp", Transform3D(lb, P(i, side * (e + 0.5), 0.15)), s)
					if night:
						_add_prop("light_pool", Transform3D(b, P(i, side * (e - 2.0), 0.03)), s)
				# végétation
				if i % 16 == (8 if side > 0 else 0) and not _near_intersection(s, 10.0):
					var vtype := "palm" if (veg == "palm" or sk == "beach") else "tree"
					var sc := rng.randf_range(0.85, 1.2)
					var vb := b.rotated(Vector3.UP, rng.randf() * TAU).scaled(Vector3.ONE * sc)
					var off := 2.4 if sk == "city" else 1.8
					var nm := vtype + ("_a" if rng.randf() < 0.5 else "_b")
					_add_prop(nm, Transform3D(vb, P(i, side * (e + off), 0.15)), s)
			elif sk == "highway":
				if i % 40 == (0 if side > 0 else 20):
					var hb := b if side < 0 else b.rotated(Vector3.UP, PI)
					_add_prop("streetlamp", Transform3D(hb, P(i, side * (e + 0.8), 0.0)), s)
					if night:
						_add_prop("light_pool", Transform3D(b, P(i, side * (e - 1.8), 0.03)), s)
				if i % 180 == (60 if side > 0 else 150) and quality >= 1:
					_billboard(i, side, e + 14.0)
				if env_id == "la" and i % 22 == 11:
					_add_prop("palm_a", Transform3D(b.rotated(Vector3.UP, rng.randf() * TAU), P(i, side * (e + 6.0), -0.05)), s)
			elif sk == "open" or sk == "canyon":
				if i % 6 == 0 and rng.randf() < 0.5:
					var dist := rng.randf_range(5.0, 50.0) if sk == "open" else rng.randf_range(3.0, 5.0)
					var nm2 := "cactus_a" if rng.randf() < 0.5 else "cactus_b"
					if rng.randf() < 0.45:
						nm2 = "rock_a"
					var rb := b.rotated(Vector3.UP, rng.randf() * TAU).scaled(Vector3.ONE * rng.randf_range(0.7, 1.4))
					_add_prop(nm2, Transform3D(rb, P(i, side * (e + dist), -0.1)), s)
				if sk == "open" and i % 200 == (100 if side > 0 else 0) and quality >= 1:
					_billboard(i, side, e + 18.0)
		# feux tricolores aux intersections
		for it: float in track.intersections:
			if int(it) - 10 == i:
				var bb := _flat_basis(i)
				var e2 := track.wr[i]
				_add_prop("traffic_light", Transform3D(bb.rotated(Vector3.UP, PI), P(i, e2 + 0.6, 0.15)), s)
				var e3 := track.wl[i]
				_add_prop("traffic_light", Transform3D(bb, P(i, -e3 - 0.6, 0.15)), s)
		s += 2.0


func _light_pool_mesh() -> Mesh:
	var q := QuadMesh.new()
	q.size = Vector2(13.0, 13.0)
	q.orientation = PlaneMesh.FACE_Y
	var mat := StandardMaterial3D.new()
	mat.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	mat.blend_mode = BaseMaterial3D.BLEND_MODE_ADD
	mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	mat.albedo_texture = CarModel._blob_texture()
	mat.albedo_color = Color(1.0, 0.75, 0.45, 0.32)
	mat.disable_receive_shadows = true
	mat.depth_draw_mode = BaseMaterial3D.DEPTH_DRAW_DISABLED
	q.material = mat
	return q


func _billboard(i: int, side: int, dist: float) -> void:
	var path := "res://assets/props/billboard.glb"
	if not ResourceLoader.exists(path):
		return
	var inst: Node3D = load(path).instantiate()
	MatLib.apply_props(inst)
	var b := _flat_basis(i)
	# orienté vers les pilotes qui arrivent, légèrement tourné vers la route
	var bb := b.rotated(Vector3.UP, (-0.35 if side > 0 else 0.35))
	inst.transform = Transform3D(bb, P(i, side * dist, 0.0))
	var k := rng.randi_range(0, 3)
	for mi in MatLib._mesh_instances(inst):
		for si in mi.mesh.get_surface_count():
			var m: Material = mi.get_surface_override_material(si)
			if m and m == MatLib.prop_part("Billboard"):
				var mm: StandardMaterial3D = (m as StandardMaterial3D).duplicate()
				mm.uv1_offset = Vector3(0, -0.25 * k, 0)
				mi.set_surface_override_material(si, mm)
	root.add_child(inst)


func _flush_props() -> void:
	var paths := {
		"streetlamp": "res://assets/props/streetlamp.glb", "traffic_light": "res://assets/props/traffic_light.glb",
		"palm_a": "res://assets/props/palm_a.glb", "palm_b": "res://assets/props/palm_b.glb",
		"tree_a": "res://assets/props/tree_a.glb", "tree_b": "res://assets/props/tree_b.glb",
		"cactus_a": "res://assets/props/cactus_a.glb", "cactus_b": "res://assets/props/cactus_b.glb",
		"rock_a": "res://assets/props/rock_a.glb", "rock_b": "res://assets/props/rock_b.glb",
	}
	for nm in _props:
		var mesh: Mesh = null
		if nm == "light_pool":
			mesh = _light_pool_mesh()
		elif not paths.has(nm) or not ResourceLoader.exists(paths[nm]):
			continue
		else:
			mesh = MatLib.prop_mesh(paths[nm])
		if mesh == null:
			continue
		for g in _props[nm]:
			var xfs: Array = _props[nm][g]
			var mm := MultiMesh.new()
			mm.transform_format = MultiMesh.TRANSFORM_3D
			mm.mesh = mesh
			mm.instance_count = xfs.size()
			for k in xfs.size():
				mm.set_instance_transform(k, xfs[k])
			var mmi := MultiMeshInstance3D.new()
			mmi.multimesh = mm
			mmi.name = "%s_%d" % [nm, g]
			mmi.visibility_range_end = 700.0
			mmi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_ON if quality >= 1 and nm != "rock_a" \
				and nm != "light_pool" else GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
			root.add_child(mmi)


# ---------------------------------------------------------------------------
# Rampes, portiques, ponts
# ---------------------------------------------------------------------------

func _build_ramps() -> void:
	var p_ramp := "res://assets/props/ramp.glb"
	var p_barrel := "res://assets/props/ramp_barrel.glb"
	for r in track.ramps:
		var path: String = p_ramp if r.kind == "ramp" else p_barrel
		if not ResourceLoader.exists(path):
			continue
		var inst: Node3D = load(path).instantiate()
		MatLib.apply_props(inst)
		var b := track.basis_at(r.s0)
		if r.kind == "barrel_l":
			b = b * Basis.from_scale(Vector3(-1, 1, 1))
		# l'échelle de la rampe suit les dimensions de la physique
		var sx: float = r.hw * 2.0 / (4.4 if r.kind == "ramp" else 3.6)
		b = b * Basis.from_scale(Vector3(sx, 1, 1))
		inst.transform = Transform3D(b, track.point(r.s0, r.x, 0.01))
		root.add_child(inst)
		# flèches lumineuses au sol pour signaler la rampe
		var arrow := MeshInstance3D.new()
		var q := QuadMesh.new()
		q.size = Vector2(r.hw * 1.6, 3.0)
		q.orientation = PlaneMesh.FACE_Y
		arrow.mesh = q
		arrow.material_override = MatLib.emissive("ramp_arrow", Color(1.0, 0.75, 0.0), 1.5)
		arrow.transform = Transform3D(track.basis_at(r.s0 - 14.0), track.point(r.s0 - 14.0, r.x, 0.02))
		arrow.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
		root.add_child(arrow)


func _build_gantry(s: float, banner: String) -> void:
	var i := clampi(int(s), 0, track.n - 1)
	var b := _flat_basis(i)
	var mb := MeshBuf.new()
	var hw := track.wr[i] + 1.4
	var col := MatLib.plain("gantry", Color(0.12, 0.08, 0.2), 0.4, 0.6)
	for side: int in [-1, 1]:
		mb.box(col, Transform3D(b, P(i, side * hw, 0.0)), Vector3(1.4, 8.0, 1.4), 0.25)
	mb.box(col, Transform3D(b, P(i, 0.0, 6.2)), Vector3(hw * 2.0 + 1.4, 1.8, 1.2), 0.25)
	var bm := MatLib.emissive_tex("banner_" + banner.get_file(), banner, 1.2 if night else 0.8)
	var a := P(i, -hw, 6.25) + b.z * 0.62
	var c := P(i, hw, 6.25) + b.z * 0.62
	mb.quad_f(bm, a, c, c + Vector3.UP * 1.7, a + Vector3.UP * 1.7, Vector2(0, 1), Vector2(1, 1), Vector2(1, 0),
		Vector2(0, 0), b.z)
	var a2 := P(i, hw, 6.25) - b.z * 0.62
	var c2 := P(i, -hw, 6.25) - b.z * 0.62
	mb.quad_f(bm, a2, c2, c2 + Vector3.UP * 1.7, a2 + Vector3.UP * 1.7, Vector2(0, 1), Vector2(1, 1), Vector2(1, 0),
		Vector2(0, 0), -b.z)
	# néons sur les piliers
	var glow := MatLib.emissive("gantry_glow", env.accent, 3.0)
	for side: int in [-1, 1]:
		mb.box(glow, Transform3D(b, P(i, side * hw, 0.0) + b.z * 0.72), Vector3(0.25, 7.6, 0.05), 0.25)
	_add_mesh(mb, "gantry_%d" % i, true)


func _build_bridges() -> void:
	var ranges := []
	var cur := -1
	for i in track.n:
		var isb := _sec(i) == "bridge"
		if isb and cur < 0:
			cur = i
		elif not isb and cur >= 0:
			ranges.append([cur, i - 1])
			cur = -1
	if cur >= 0:
		ranges.append([cur, track.n - 1])
	var tower_path := "res://assets/props/gg_tower.glb"
	for rg in ranges:
		var b0: int = rg[0]
		var b1: int = rg[1]
		var lb := float(b1 - b0)
		var t1 := b0 + int(lb * 0.25)
		var t2 := b0 + int(lb * 0.75)
		var deck := track.pos[(b0 + b1) / 2].y
		var mb := MeshBuf.new()
		var cable_x := 13.0
		for t: int in [t1, t2]:
			if ResourceLoader.exists(tower_path):
				var inst: Node3D = load(tower_path).instantiate()
				MatLib.apply_props(inst)
				if track.def.get("bridge_color", "") == "white":
					for mi in MatLib._mesh_instances(inst):
						for si in mi.mesh.get_surface_count():
							mi.set_surface_override_material(si, MatLib.prop_part("GGWhite"))
				inst.transform = Transform3D(_flat_basis(t), track.pos[t])
				root.add_child(inst)
			# piles jusqu'à l'eau
			for side: int in [-1, 1]:
				var bp := _flat_basis(t)
				var top: Vector3 = track.pos[t] + bp.x * side * cable_x + Vector3.DOWN * 30.0
				var hgt: float = top.y - water_y + 2.0
				mb.box(_m.gg, Transform3D(bp, top + Vector3.DOWN * hgt), Vector3(6.0, hgt, 8.0), 0.1)
		# câbles porteurs
		for side: int in [-1, 1]:
			var path := PackedVector3Array()
			var k := b0
			while k <= b1:
				path.append(P(k, side * cable_x, _cable_h(k, b0, b1, t1, t2)))
				k += 6
			path.append(P(b1, side * cable_x, _cable_h(b1, b0, b1, t1, t2)))
			mb.tube(_m.cable, path, 0.45, 6)
			# suspentes
			k = b0 + 6
			while k < b1:
				var hgt2 := _cable_h(k, b0, b1, t1, t2)
				if hgt2 > 2.0:
					var bp2 := _flat_basis(k)
					mb.box(_m.cable, Transform3D(bp2, P(k, side * cable_x, 1.2)), Vector3(0.12, hgt2 - 1.2, 0.12), 0.25)
				k += 12
			# lumières de câbles la nuit
			if night:
				var lm := MatLib.emissive("cable_light", Color(1.0, 0.95, 0.85), 5.0)
				k = b0
				while k < b1:
					var bp3 := _flat_basis(k)
					mb.box(lm, Transform3D(bp3, P(k, side * cable_x, _cable_h(k, b0, b1, t1, t2) + 0.4)), Vector3(0.35, 0.35, 0.35), 0.25)
					k += 18
		# falaises aux extrémités
		for e: int in [b0, b1]:
			var be := _flat_basis(e)
			var face := -be.z if e == b0 else be.z
			for side: int in [-1, 1]:
				var x0 := (track.wr[e] if side > 0 else track.wl[e]) + 3.0
				var a: Vector3 = P(e, side * x0, -3.5)
				var c: Vector3 = P(e, side * (x0 + 150.0), -3.5)
				var a2 := Vector3(a.x, water_y - 2.0, a.z)
				var c2 := Vector3(c.x, water_y - 2.0, c.z)
				mb.quad_f(_m.rock, a2, c2, c, a, Vector2.ZERO, Vector2.RIGHT, Vector2.ONE, Vector2.DOWN, face)
			var lo := P(e, -track.wl[e] - 3.0, -3.5)
			var ro := P(e, track.wr[e] + 3.0, -3.5)
			mb.quad_f(_m.rock, Vector3(lo.x, water_y - 2.0, lo.z), Vector3(ro.x, water_y - 2.0, ro.z), ro, lo,
				Vector2.ZERO, Vector2.RIGHT, Vector2.ONE, Vector2.DOWN, face)
		_add_mesh(mb, "bridge_%d" % b0, quality >= 1)
		if deck < 0.0:
			pass


func _cable_h(k: int, b0: int, b1: int, t1: int, t2: int) -> float:
	var top := 76.0
	if k <= t1:
		var u := float(k - b0) / maxf(1.0, float(t1 - b0))
		return 4.0 + (top - 4.0) * u * u
	if k >= t2:
		var u2 := float(b1 - k) / maxf(1.0, float(b1 - t2))
		return 4.0 + (top - 4.0) * u2 * u2
	var u3 := float(k - t1) / maxf(1.0, float(t2 - t1))
	return top - (top - 6.0) * (1.0 - pow(2.0 * u3 - 1.0, 2.0))


func _build_tunnel_portals() -> void:
	var mb := MeshBuf.new()
	var prev := ""
	for i in range(1, track.n):
		var k := _sec(i)
		var kp := _sec(i - 1)
		if (k == "tunnel") != (kp == "tunnel"):
			var b := _flat_basis(i)
			var face := b.z if k == "tunnel" else -b.z
			var hw := track.wr[i] + 0.4
			var p := track.pos[i]
			var r := b.x
			var top := 7.0
			var big := 26.0
			for side: int in [-1, 1]:
				var a := p + r * side * hw
				var c := p + r * side * 70.0
				mb.quad_f(_m.tunnel, Vector3(a.x, p.y - 1.0, a.z), Vector3(c.x, p.y - 1.0, c.z),
					Vector3(c.x, p.y + big, c.z), Vector3(a.x, p.y + big, a.z), Vector2.ZERO, Vector2(10, 0),
					Vector2(10, 5), Vector2(0, 5), face)
			var l := p - r * hw
			var rr := p + r * hw
			mb.quad_f(_m.tunnel, Vector3(l.x, p.y + top, l.z), Vector3(rr.x, p.y + top, rr.z),
				Vector3(rr.x, p.y + big, rr.z), Vector3(l.x, p.y + big, l.z), Vector2.ZERO, Vector2(4, 0),
				Vector2(4, 3), Vector2(0, 3), face)
			mb.box(_m.neon_strip if night else _m.trim_dark, Transform3D(b, p + Vector3.UP * top + face * 0.1),
				Vector3(hw * 2.0, 0.5, 0.3), 0.25)
		prev = k
	_add_mesh(mb, "portals", true)


func _build_far_scenery() -> void:
	# mesas du désert / tours lointaines
	if env_id == "desert":
		for k in 26:
			var path := "res://assets/props/mesa_a.glb" if k % 2 == 0 else "res://assets/props/mesa_b.glb"
			if not ResourceLoader.exists(path):
				continue
			var s := rng.randf_range(0.0, track.length)
			var side := -1 if rng.randf() < 0.5 else 1
			var i := int(s)
			var dist := rng.randf_range(260.0, 650.0)
			if _max_offset(i, side) < dist + 60.0:
				continue
			var inst: Node3D = load(path).instantiate()
			MatLib.apply_props(inst)
			var p := P(i, side * dist)
			p.y = base_y
			inst.transform = Transform3D(Basis(Vector3.UP, rng.randf() * TAU).scaled(Vector3.ONE * rng.randf_range(1.2, 3.0)), p)
			root.add_child(inst)
	elif env_id == "tokyo" or env_id == "la":
		# silhouettes d'immeubles lointains
		var mb := MeshBuf.new()
		var mat: Material = MatLib.facade("tokyo" if env_id == "tokyo" else "office")
		for k in 60:
			var s2 := rng.randf_range(0.0, track.length)
			var side2 := -1 if rng.randf() < 0.5 else 1
			var i2 := int(s2)
			var dist2 := rng.randf_range(150.0, 400.0)
			if _max_offset(i2, side2) < dist2 + 40.0:
				continue
			var p2 := P(i2, side2 * dist2)
			p2.y = base_y
			var hgt := rng.randf_range(40.0, 160.0) if env_id == "tokyo" else rng.randf_range(25.0, 90.0)
			var wid := rng.randf_range(18.0, 40.0)
			var col := Color(0.9, 0.9, 0.95, rng.randf())
			mb.box(mat, Transform3D(Basis(Vector3.UP, rng.randf() * TAU), p2), Vector3(wid, hgt - base_y + track.pos[i2].y, wid),
				1.0 / 7.0, col)
		_add_mesh(mb, "far_city", false)


func _build_base() -> void:
	var mi := MeshInstance3D.new()
	var pm := PlaneMesh.new()
	pm.size = Vector2(9000, 9000)
	pm.subdivide_depth = 0
	mi.mesh = pm
	var center := Vector3.ZERO
	for i in range(0, track.n, 50):
		center += track.pos[i]
	center /= float(int(track.n / 50) + (1 if track.n % 50 != 0 else 0))
	if has_water:
		mi.material_override = MatLib.water()
		mi.position = Vector3(center.x, water_y, center.z)
	else:
		var gm: StandardMaterial3D = (_m.ground as StandardMaterial3D).duplicate()
		gm.uv1_scale = Vector3(600, 600, 1)
		mi.material_override = gm
		mi.position = Vector3(center.x, base_y, center.z)
	mi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	mi.name = "base_plane"
	root.add_child(mi)
