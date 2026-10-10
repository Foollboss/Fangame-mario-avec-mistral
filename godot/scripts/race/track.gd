class_name Track
extends Node3D
## Piste procédurale : tracé (virages, collines, bosses), rampes, rampes à tonneau,
## séparations de voies, tunnels, décors urbains et ambiance (ciel, brouillard, lumière).
##
## Toute la physique se fait en "espace piste" : s = distance parcourue, x = décalage latéral
## (positif = à droite), h = hauteur au-dessus de la route.

const STEP := 2.0
const LANE_W := 4.0
const LANES := 4
const CHUNK := 60
const GRAVITY := 26.0

const THEMES := {
	"sf": {
		"name": "SAN FRANCISCO", "sky_top": "#3b6fc4", "sky_horizon": "#bcd5ec", "sun_color": "#fff1d8",
		"sun_energy": 1.35, "sun_elev": 40.0, "sun_az": 150.0, "ambient": 0.55, "fog": "#c6d7e8", "fog_density": 0.0011,
		"night": 0.0, "wet": 0.0, "hills": 14.0, "crests": 3, "ground": "#5f6f45", "sidewalk": "#b9b4ab",
		"buildings": "victorian", "bh": [9.0, 17.0], "tall_chance": 0.06, "rails": 1.0, "neon_strip": "#ff3df0",
		"palette": ["#e8c9a6", "#c9e0e6", "#f2d4dc", "#d9e6c3", "#f0e2b6", "#b9c7e8", "#e7b7a0", "#f4f1ea"],
		"props": {"tree": 0.55, "lamp": 1.0, "palm": 0.0, "billboard": 0.15}, "tunnel": false, "skyline": true,
		"traffic": 1.0, "clouds": 0.45,
	},
	"la": {
		"name": "LOS ANGELES", "sky_top": "#2b3d8c", "sky_horizon": "#ff9a5a", "sun_color": "#ffb36b",
		"sun_energy": 1.6, "sun_elev": 9.0, "sun_az": 255.0, "ambient": 0.5, "fog": "#f0a07c", "fog_density": 0.0014,
		"night": 0.15, "wet": 0.0, "hills": 5.0, "crests": 2, "ground": "#8a7b56", "sidewalk": "#d6cbb8",
		"buildings": "modern", "bh": [6.0, 20.0], "tall_chance": 0.1, "rails": 0.0, "neon_strip": "#ff7a3d",
		"palette": ["#f2ebe0", "#e6d3b8", "#d8c3a5", "#f5f5f5", "#cfe0e8", "#f0d9c8"],
		"props": {"tree": 0.0, "lamp": 0.6, "palm": 1.0, "billboard": 0.3}, "tunnel": false, "skyline": true,
		"traffic": 0.9, "clouds": 0.25,
	},
	"tokyo": {
		"name": "TOKYO", "sky_top": "#04030c", "sky_horizon": "#2c1452", "sun_color": "#8ea6ff",
		"sun_energy": 0.22, "sun_elev": 45.0, "sun_az": 60.0, "ambient": 0.32, "fog": "#1d0e36", "fog_density": 0.0032,
		"night": 1.0, "wet": 1.0, "hills": 3.0, "crests": 1, "ground": "#1c1b22", "sidewalk": "#4a4852",
		"buildings": "neon", "bh": [18.0, 85.0], "tall_chance": 0.25, "rails": 0.0, "neon_strip": "#36d6ff",
		"palette": ["#3a3a44", "#2c2f3a", "#4a4550", "#22252e", "#3b3340"],
		"props": {"tree": 0.0, "lamp": 1.0, "palm": 0.0, "billboard": 0.9}, "tunnel": true, "skyline": true,
		"traffic": 1.0, "clouds": 0.0,
	},
	"nevada": {
		"name": "NEVADA", "sky_top": "#2369d1", "sky_horizon": "#d5e6f5", "sun_color": "#fff6e0",
		"sun_energy": 1.75, "sun_elev": 58.0, "sun_az": 200.0, "ambient": 0.6, "fog": "#e8d6b2", "fog_density": 0.0008,
		"night": 0.0, "wet": 0.0, "hills": 10.0, "crests": 4, "ground": "#c49a62", "sidewalk": "#c49a62",
		"buildings": "rocks", "bh": [10.0, 45.0], "tall_chance": 0.0, "rails": 0.0, "neon_strip": "#ffb000",
		"palette": ["#a8643a", "#b9754a", "#9c5a33", "#c48459"],
		"props": {"tree": 0.0, "lamp": 0.0, "palm": 0.0, "billboard": 0.25, "cone": 1.0}, "tunnel": false, "skyline": false,
		"traffic": 0.6, "clouds": 0.15,
	},
	"newyork": {
		"name": "NEW YORK", "sky_top": "#1b2657", "sky_horizon": "#e8714c", "sun_color": "#ff9a66",
		"sun_energy": 0.85, "sun_elev": 6.0, "sun_az": 290.0, "ambient": 0.42, "fog": "#4b3a5c", "fog_density": 0.0022,
		"night": 0.75, "wet": 0.55, "hills": 3.0, "crests": 1, "ground": "#3a3a3e", "sidewalk": "#8f8b86",
		"buildings": "towers", "bh": [28.0, 130.0], "tall_chance": 0.3, "rails": 0.0, "neon_strip": "#ffd21f",
		"palette": ["#7a4b3a", "#8c6a52", "#6b6f78", "#a39b8f", "#4f5866", "#93846f"],
		"props": {"tree": 0.15, "lamp": 1.0, "palm": 0.0, "billboard": 0.5}, "tunnel": true, "skyline": true,
		"traffic": 1.25, "clouds": 0.35,
	},
}

var theme_id := "sf"
var theme: Dictionary = {}
var half_width := 8.0
var length := 3000.0
var n := 0
var pts := PackedVector3Array()
var fwds := PackedVector3Array()
var rights := PackedVector3Array()
var ups := PackedVector3Array()
var curv := PackedFloat32Array()
var elev_ss := PackedFloat32Array()
var ramps: Array = []
var splits: Array = []
var tunnels: Array = []
var crest_list: Array = []
var quality := 2
var rng := RandomNumberGenerator.new()
var start_s := 40.0
var finish_s := 0.0

var _lamp_positions: Array = []


# ---------------------------------------------------------------------------
# Génération du tracé
# ---------------------------------------------------------------------------
func generate(p_theme: String, seed_value: int, p_length: float, opts: Dictionary = {}) -> void:
	theme_id = p_theme if THEMES.has(p_theme) else "sf"
	theme = THEMES[theme_id]
	quality = int(opts.get("quality", 2))
	rng.seed = seed_value
	length = p_length + 260.0  # marge après la ligne d'arrivée
	finish_s = p_length + 40.0
	n = int(length / STEP) + 1
	_build_curvature()
	_build_points()
	_build_frames()
	_place_ramps(opts.get("barrel_heavy", false))
	_place_splits_and_tunnels()


func _build_curvature() -> void:
	var raw := PackedFloat32Array()
	raw.resize(n)
	var heading := 0.0
	var i := int(260.0 / STEP)  # ligne droite de départ
	var end_i := n - int(220.0 / STEP)
	while i < end_i:
		var kind := rng.randf()
		if kind < 0.3:
			i += int(rng.randf_range(60.0, 220.0) / STEP)
			continue
		var seg_len := rng.randf_range(90.0, 280.0)
		var angle := deg_to_rad(rng.randf_range(18.0, 80.0))
		var dir := 1.0 if rng.randf() < 0.5 else -1.0
		if heading > deg_to_rad(55.0):
			dir = -1.0
		elif heading < -deg_to_rad(55.0):
			dir = 1.0
		var k: float = min(angle / seg_len, 1.0 / 105.0)
		var cnt := int(seg_len / STEP)
		for j in cnt:
			if i + j < end_i:
				raw[i + j] = k * dir
		heading += k * dir * seg_len
		i += cnt
		if kind > 0.8:  # contre-virage (chicane rapide)
			var cnt2 := int(rng.randf_range(80.0, 160.0) / STEP)
			var k2: float = min(deg_to_rad(rng.randf_range(15.0, 40.0)) / (cnt2 * STEP), 1.0 / 120.0)
			for j in cnt2:
				if i + j < end_i:
					raw[i + j] = -k2 * dir
			heading -= k2 * dir * cnt2 * STEP
			i += cnt2
	# lissage (entrée progressive des virages)
	curv = _smooth(_smooth(raw, 18), 12)


func _smooth(a: PackedFloat32Array, radius: int) -> PackedFloat32Array:
	var out := PackedFloat32Array()
	out.resize(a.size())
	var acc := 0.0
	var cnt := 0
	var size := a.size()
	for i in range(-radius, size + radius):
		var add_i := i + radius
		if add_i < size and add_i >= 0:
			acc += a[add_i]
			cnt += 1
		var rem_i := i - radius - 1
		if rem_i >= 0 and rem_i < size:
			acc -= a[rem_i]
			cnt -= 1
		if i >= 0 and i < size and cnt > 0:
			out[i] = acc / cnt
	return out


func _build_points() -> void:
	# altitude : collines douces + bosses (sauts de crête à la San Francisco)
	var heights := PackedFloat32Array()
	heights.resize(n)
	var amp: float = theme["hills"]
	var waves := []
	for w in 3:
		waves.append([amp * rng.randf_range(0.3, 1.0) / (w + 1), rng.randf_range(350.0, 900.0) / (w * 0.6 + 1.0), rng.randf() * TAU])
	crest_list = []
	var n_crests: int = theme["crests"]
	for c in n_crests:
		var cs := rng.randf_range(450.0, finish_s - 300.0)
		crest_list.append({"s": cs, "len": rng.randf_range(55.0, 80.0), "h": rng.randf_range(2.6, 4.2)})
	for i in n:
		var s := i * STEP
		var y := 0.0
		for w in waves:
			y += w[0] * (sin(TAU * s / w[1] + w[2]) - sin(w[2]))
		y *= smoothstep(0.0, 300.0, s)
		for c in crest_list:
			var u: float = (s - c["s"]) / c["len"]
			if u > 0.0 and u < 1.0:
				y += c["h"] * sin(PI * u) * sin(PI * u)
		heights[i] = y
	pts.resize(n)
	var yaw := 0.0
	var p := Vector3.ZERO
	for i in n:
		pts[i] = Vector3(p.x, heights[i], p.z)
		yaw += curv[i] * STEP
		p += Vector3(sin(yaw), 0.0, -cos(yaw)) * STEP
	elev_ss.resize(n)
	for i in n:
		var a := heights[max(i - 1, 0)]
		var b := heights[i]
		var c2 := heights[min(i + 1, n - 1)]
		elev_ss[i] = (a - 2.0 * b + c2) / (STEP * STEP)


func _build_frames() -> void:
	fwds.resize(n)
	rights.resize(n)
	ups.resize(n)
	for i in n:
		var f := (pts[min(i + 1, n - 1)] - pts[max(i - 1, 0)]).normalized()
		var r := f.cross(Vector3.UP).normalized()
		var u := r.cross(f).normalized()
		var bank: float = clamp(curv[i] * 18.0, -0.075, 0.075)
		var u2 := u * cos(bank) + r * sin(bank)
		var r2 := r * cos(bank) - u * sin(bank)
		fwds[i] = f
		rights[i] = r2
		ups[i] = u2


func _place_ramps(barrel_heavy: bool) -> void:
	ramps = []
	var s := 380.0
	while s < finish_s - 260.0:
		var ok := true
		for t in range(int((s - 30.0) / STEP), int((s + 170.0) / STEP)):
			if t >= 0 and t < n and abs(curv[t]) > 0.0042:
				ok = false
				break
		for c in crest_list:
			if abs(s - c["s"]) < 160.0:
				ok = false
		if not ok:
			s += 40.0
			continue
		var r := rng.randf()
		var barrel_p := 0.6 if barrel_heavy else 0.35
		if r < barrel_p:
			var lane := 0 if rng.randf() < 0.5 else LANES - 1
			var tilt := 1.0 if lane == LANES - 1 else -1.0  # côté haut vers l'extérieur
			ramps.append({"s": s, "len": 12.0, "x": lane_x(lane), "w": 5.0, "h": 3.4, "barrel": true, "tilt": tilt})
			if rng.randf() < 0.4:
				var lane2 := LANES - 1 - lane
				ramps.append({"s": s + 6.0, "len": 12.0, "x": lane_x(lane2), "w": 5.0, "h": 3.4, "barrel": true, "tilt": -tilt})
		elif r < 0.75:
			var lane := rng.randi_range(0, LANES - 1)
			ramps.append({"s": s, "len": 14.0, "x": lane_x(lane), "w": 5.6, "h": 2.6, "barrel": false, "tilt": 0.0})
		else:
			for lane in [1, 2]:
				ramps.append({"s": s, "len": 14.0, "x": lane_x(lane), "w": 5.6, "h": 2.6, "barrel": false, "tilt": 0.0})
		s += rng.randf_range(260.0, 440.0)
	ramps.sort_custom(func(a, b): return a["s"] < b["s"])


func _place_splits_and_tunnels() -> void:
	splits = []
	tunnels = []
	var tries := 0
	var wanted := 2 if length > 2600.0 else 1
	while splits.size() < wanted and tries < 40:
		tries += 1
		var s0 := rng.randf_range(500.0, finish_s - 400.0)
		var s1 := s0 + rng.randf_range(130.0, 220.0)
		if _zone_free(s0 - 80.0, s1 + 120.0):
			splits.append({"s0": s0, "s1": s1})
	if theme.get("tunnel", false):
		tries = 0
		while tunnels.is_empty() and tries < 40:
			tries += 1
			var t0 := rng.randf_range(400.0, finish_s - 400.0)
			var t1 := t0 + rng.randf_range(160.0, 260.0)
			if _zone_free(t0 - 120.0, t1 + 20.0, true):
				tunnels.append({"s0": t0, "s1": t1})


func _zone_free(a: float, b: float, check_splits := false) -> bool:
	for r in ramps:
		if r["s"] > a - 30.0 and r["s"] < b:
			return false
	for c in crest_list:
		if c["s"] + c["len"] > a - 60.0 and c["s"] < b + 60.0:
			return false
	for sp in splits:
		if sp["s1"] > a and sp["s0"] < b:
			return false
	return true


# ---------------------------------------------------------------------------
# Requêtes (physique)
# ---------------------------------------------------------------------------
func lane_x(lane: int) -> float:
	return -half_width + LANE_W * (lane + 0.5)


func _idx(s: float) -> Array:
	var f: float = clamp(s / STEP, 0.0, float(n - 1) - 0.001)
	var i := int(f)
	return [i, f - i]


func frame(s: float) -> Transform3D:
	var ia := _idx(s)
	var i: int = ia[0]
	var t: float = ia[1]
	var p := pts[i].lerp(pts[i + 1], t)
	var f := fwds[i].lerp(fwds[i + 1], t).normalized()
	var r := rights[i].lerp(rights[i + 1], t).normalized()
	var u := r.cross(f).normalized()
	r = f.cross(u).normalized()
	return Transform3D(Basis(r, u, -f), p)


func position_at(s: float, x: float, h: float) -> Vector3:
	var ia := _idx(s)
	var i: int = ia[0]
	var t: float = ia[1]
	var p := pts[i].lerp(pts[i + 1], t)
	var r := rights[i].lerp(rights[i + 1], t)
	var u := ups[i].lerp(ups[i + 1], t)
	return p + r * x + u * h


func curvature_at(s: float) -> float:
	var ia := _idx(s)
	return lerp(curv[ia[0]], curv[ia[0] + 1], ia[1])


func elev_ss_at(s: float) -> float:
	var ia := _idx(s)
	return lerp(elev_ss[ia[0]], elev_ss[ia[0] + 1], ia[1])


func ramp_at(s: float, x: float) -> Dictionary:
	for r in ramps:
		if s < r["s"]:
			break
		if s <= r["s"] + r["len"] and abs(x - r["x"]) <= r["w"] * 0.5:
			return r
	return {}


func ground_height(s: float, x: float) -> float:
	var r := ramp_at(s, x)
	if r.is_empty():
		return 0.0
	return ramp_height(r, s, x)


func ramp_height(r: Dictionary, s: float, x: float) -> float:
	var u: float = clamp((s - r["s"]) / r["len"], 0.0, 1.0)
	if r["barrel"]:
		var xl: float = clamp((x - r["x"]) / r["w"] * r["tilt"], -0.5, 0.5)
		return r["h"] * u * (0.15 + 0.85 * (xl + 0.5))
	return r["h"] * u


func in_split(s: float) -> bool:
	for sp in splits:
		if s >= sp["s0"] and s <= sp["s1"]:
			return true
	return false


func next_split(s: float) -> Dictionary:
	for sp in splits:
		if sp["s1"] > s:
			return sp
	return {}


# ---------------------------------------------------------------------------
# Construction des visuels
# ---------------------------------------------------------------------------
func build_visuals() -> void:
	var road_mat := ShaderMaterial.new()
	road_mat.shader = load("res://shaders/road.gdshader")
	road_mat.set_shader_parameter("half_width", half_width)
	road_mat.set_shader_parameter("lane_width", LANE_W)
	road_mat.set_shader_parameter("wet", theme["wet"])
	road_mat.set_shader_parameter("rails", theme["rails"])
	if theme_id == "nevada":
		road_mat.set_shader_parameter("asphalt_color", Color(0.2, 0.19, 0.18))

	var concrete := StandardMaterial3D.new()
	concrete.albedo_color = Color(0.72, 0.71, 0.69) if theme["night"] < 0.5 else Color(0.42, 0.42, 0.45)
	concrete.roughness = 0.8
	concrete.albedo_texture = _noise_tex(0.05)
	concrete.uv1_triplanar = true
	concrete.uv1_world_triplanar = true
	concrete.uv1_scale = Vector3(0.25, 0.25, 0.25)

	var neon := StandardMaterial3D.new()
	var nc := Color(theme["neon_strip"])
	neon.albedo_color = nc
	neon.emission_enabled = true
	neon.emission = nc
	neon.emission_energy_multiplier = 2.5 + 3.0 * theme["night"]

	var side_mat := StandardMaterial3D.new()
	side_mat.albedo_color = Color(theme["sidewalk"])
	side_mat.roughness = 0.9
	side_mat.albedo_texture = _noise_tex(0.08)
	side_mat.uv1_triplanar = true
	side_mat.uv1_world_triplanar = true
	side_mat.uv1_scale = Vector3(0.3, 0.3, 0.3)

	var ground_mat := StandardMaterial3D.new()
	ground_mat.albedo_color = Color(theme["ground"])
	ground_mat.roughness = 0.95
	ground_mat.albedo_texture = _noise_tex(0.02)
	ground_mat.uv1_triplanar = true
	ground_mat.uv1_world_triplanar = true
	ground_mat.uv1_scale = Vector3(0.04, 0.04, 0.04)

	var hw := half_width
	var urban: bool = theme_id != "nevada"
	# profils (x, y) avec x croissant ; le côté gauche est obtenu par symétrie
	var road_prof := [Vector2(-hw, 0.0), Vector2(hw, 0.0)]
	var barrier_prof := [Vector2(hw - 0.02, 0.0), Vector2(hw + 0.06, 0.28), Vector2(hw + 0.2, 0.95), Vector2(hw + 0.45, 0.95), Vector2(hw + 0.58, 0.28), Vector2(hw + 0.65, 0.0)]
	var neon_prof := [Vector2(hw + 0.2, 0.96), Vector2(hw + 0.45, 0.96)]
	var walk_prof := [Vector2(hw + 0.65, 0.0), Vector2(hw + 0.66, 0.2), Vector2(hw + 6.5, 0.2)] if urban else [Vector2(hw + 0.65, 0.0), Vector2(hw + 6.5, 0.05)]
	var ground_prof := [Vector2(hw + 6.5, 0.2 if urban else 0.05), Vector2(hw + 28.0, 0.0), Vector2(hw + 75.0, -1.5), Vector2(hw + 76.0, -45.0)]

	var c := 0
	while c < n - 1:
		var i0 := c
		var i1: int = min(c + CHUNK, n - 1)
		var mesh := ArrayMesh.new()
		_add_surface(mesh, road_prof, i0, i1, road_mat, false, true)
		_add_surface(mesh, barrier_prof, i0, i1, concrete, true)
		_add_surface(mesh, neon_prof, i0, i1, neon, true)
		_add_surface(mesh, walk_prof, i0, i1, side_mat, true)
		_add_surface(mesh, ground_prof, i0, i1, ground_mat, true)
		var mi := MeshInstance3D.new()
		mi.mesh = mesh
		mi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
		add_child(mi)
		c = i1
	# grand sol lointain
	var far := MeshInstance3D.new()
	var pm := PlaneMesh.new()
	pm.size = Vector2(9000, 9000)
	far.mesh = pm
	far.material_override = ground_mat
	var center := (pts[0] + pts[n - 1]) * 0.5
	var min_y := 0.0
	for p in pts:
		min_y = min(min_y, p.y)
	far.position = Vector3(center.x, min_y - 6.0, center.z)
	add_child(far)

	_build_ramps()
	_build_splits(concrete, neon)
	_build_tunnels(concrete)
	_build_gates()
	_build_buildings()
	_build_props()


func _noise_tex(freq: float) -> NoiseTexture2D:
	var nt := NoiseTexture2D.new()
	var fn := FastNoiseLite.new()
	fn.frequency = freq
	fn.seed = rng.randi()
	nt.noise = fn
	nt.width = 256
	nt.height = 256
	nt.seamless = true
	var g := Gradient.new()
	g.set_color(0, Color(0.78, 0.78, 0.78))
	g.set_color(1, Color(1.0, 1.0, 1.0))
	nt.color_ramp = g
	return nt


func _add_surface(mesh: ArrayMesh, prof: Array, i0: int, i1: int, mat: Material, both_sides: bool, road_uv := false) -> void:
	var st := SurfaceTool.new()
	st.begin(Mesh.PRIMITIVE_TRIANGLES)
	var profiles := [prof]
	if both_sides:
		var mirrored := []
		for k in range(prof.size() - 1, -1, -1):
			mirrored.append(Vector2(-prof[k].x, prof[k].y))
		profiles.append(mirrored)
	for pr in profiles:
		# longueur cumulée pour les UV
		var acc := [0.0]
		for k in range(1, pr.size()):
			acc.append(acc[k - 1] + (pr[k] - pr[k - 1]).length())
		for i in range(i0, i1):
			for k in range(pr.size() - 1):
				var a2: Vector2 = pr[k]
				var b2: Vector2 = pr[k + 1]
				var d := (b2 - a2).normalized()
				var n2 := Vector2(-d.y, d.x)  # normale "visible"
				var pa := _vtx(i, a2)
				var pb := _vtx(i, b2)
				var pc := _vtx(i + 1, b2)
				var pd := _vtx(i + 1, a2)
				var nrm0 := (rights[i] * n2.x + ups[i] * n2.y).normalized()
				var nrm1 := (rights[i + 1] * n2.x + ups[i + 1] * n2.y).normalized()
				var u0: float = a2.x if road_uv else acc[k]
				var u1: float = b2.x if road_uv else acc[k + 1]
				var v0 := i * STEP
				var v1 := (i + 1) * STEP
				var quad := [[pa, Vector2(u0, v0), nrm0], [pb, Vector2(u1, v0), nrm0], [pc, Vector2(u1, v1), nrm1], [pd, Vector2(u0, v1), nrm1]]
				var geo: Vector3 = (pb - pa).cross(pc - pa)
				var order := [0, 1, 2, 0, 2, 3]
				if geo.dot(nrm0) > 0.0:
					order = [0, 2, 1, 0, 3, 2]
				for o in order:
					st.set_normal(quad[o][2])
					st.set_uv(quad[o][1])
					st.add_vertex(quad[o][0])
	st.set_material(mat)
	st.commit(mesh)


func _vtx(i: int, p: Vector2) -> Vector3:
	# au-delà du trottoir on garde la verticale du monde pour éviter le dévers du sol
	if abs(p.x) > half_width + 7.0:
		var flat_r := Vector3(rights[i].x, 0.0, rights[i].z).normalized()
		return pts[i] + flat_r * p.x + Vector3.UP * p.y
	return pts[i] + rights[i] * p.x + ups[i] * p.y


func _place_unit(node: Node3D, s: float, x: float, size: Vector3) -> void:
	var tr := frame(s)
	var origin := tr.origin + tr.basis.x * x
	node.transform = Transform3D(Basis(tr.basis.x * size.x, tr.basis.y * size.y, tr.basis.z * size.z), origin)


func _load_scene(path: String) -> Node3D:
	if not ResourceLoader.exists(path):
		return null
	var ps: PackedScene = load(path)
	return ps.instantiate()


func _build_ramps() -> void:
	for r in ramps:
		var path := "res://assets/props/ramp.glb"
		if r["barrel"]:
			path = "res://assets/props/barrel_ramp.glb" if r["tilt"] > 0.0 else "res://assets/props/barrel_ramp_l.glb"
		var node := _load_scene(path)
		if node == null:
			node = MeshInstance3D.new()
			var bm := BoxMesh.new()
			node.mesh = bm
		add_child(node)
		_place_unit(node, r["s"], r["x"], Vector3(r["w"], r["h"], r["len"]))
		# plots d'avertissement
		if quality >= 1:
			for side in [-1.0, 1.0]:
				var cone := _load_scene("res://assets/props/cone.glb")
				if cone:
					add_child(cone)
					var tr := frame(r["s"] - 4.0)
					cone.global_transform = Transform3D(tr.basis, tr.origin + tr.basis.x * (r["x"] + side * (r["w"] * 0.5 + 0.4)))


func _build_splits(concrete: Material, neon: Material) -> void:
	var cushion := StandardMaterial3D.new()
	cushion.albedo_color = Color(1.0, 0.8, 0.0)
	cushion.emission_enabled = true
	cushion.emission = Color(1.0, 0.7, 0.0)
	cushion.emission_energy_multiplier = 1.5
	for sp in splits:
		var i0 := int(sp["s0"] / STEP)
		var i1 := int(sp["s1"] / STEP)
		var mesh := ArrayMesh.new()
		var prof := [Vector2(-1.0, 0.0), Vector2(-0.8, 1.1), Vector2(0.8, 1.1), Vector2(1.0, 0.0)]
		_add_surface(mesh, prof, i0, i1, concrete, false)
		_add_surface(mesh, [Vector2(-0.6, 1.12), Vector2(0.6, 1.12)], i0, i1, neon, false)
		var mi := MeshInstance3D.new()
		mi.mesh = mesh
		add_child(mi)
		# atténuateur de choc à l'entrée
		var cb := MeshInstance3D.new()
		var bx := BoxMesh.new()
		bx.size = Vector3(2.0, 1.2, 2.5)
		cb.mesh = bx
		cb.material_override = cushion
		add_child(cb)
		var tr := frame(sp["s0"])
		cb.global_transform = Transform3D(tr.basis, tr.origin + tr.basis.y * 0.6 - tr.basis.z * 0.0)
		# piliers et tablier d'autoroute surélevée
		var deck_mat := StandardMaterial3D.new()
		deck_mat.albedo_color = Color(0.5, 0.5, 0.52)
		deck_mat.roughness = 0.85
		var s := float(sp["s0"]) + 10.0
		while s < sp["s1"]:
			var pil := MeshInstance3D.new()
			var pb := BoxMesh.new()
			pb.size = Vector3(1.4, 10.0, 1.4)
			pil.mesh = pb
			pil.material_override = deck_mat
			add_child(pil)
			var t2 := frame(s)
			pil.global_transform = Transform3D(t2.basis, t2.origin + t2.basis.y * 5.0)
			s += 24.0
		var dmesh := ArrayMesh.new()
		var dprof := [Vector2(-half_width - 1.0, 10.0), Vector2(half_width + 1.0, 10.0), Vector2(half_width + 1.0, 11.4), Vector2(-half_width - 1.0, 11.4)]
		_add_surface(dmesh, [dprof[1], dprof[0]], i0, i1, deck_mat, false)  # dessous (visible d'en bas)
		_add_surface(dmesh, [dprof[0], dprof[3]], i0, i1, deck_mat, false)
		_add_surface(dmesh, [dprof[2], dprof[1]], i0, i1, deck_mat, false)
		var dmi := MeshInstance3D.new()
		dmi.mesh = dmesh
		add_child(dmi)


func _build_tunnels(concrete: Material) -> void:
	var light_mat := StandardMaterial3D.new()
	light_mat.albedo_color = Color(1, 0.95, 0.85)
	light_mat.emission_enabled = true
	light_mat.emission = Color(1.0, 0.9, 0.75)
	light_mat.emission_energy_multiplier = 1.2
	var wall_mat := StandardMaterial3D.new()
	wall_mat.albedo_color = Color(0.55, 0.55, 0.58)
	wall_mat.roughness = 0.7
	for tn in tunnels:
		var i0 := int(tn["s0"] / STEP)
		var i1 := int(tn["s1"] / STEP)
		var hw := half_width + 0.7
		var mesh := ArrayMesh.new()
		# murs et plafond vus de l'intérieur
		_add_surface(mesh, [Vector2(hw + 0.01, 8.5), Vector2(hw, 0.0)], i0, i1, wall_mat, true)
		_add_surface(mesh, [Vector2(hw, 8.5), Vector2(-hw, 8.5)], i0, i1, concrete, false)
		_add_surface(mesh, [Vector2(-hw, 8.6), Vector2(hw, 8.6), Vector2(hw + 2.0, 8.6), Vector2(hw + 2.0, 0.0)], i0, i1, concrete, false)
		_add_surface(mesh, [Vector2(-hw - 2.0, 0.0), Vector2(-hw - 2.0, 8.6), Vector2(-hw, 8.6)], i0, i1, concrete, false)
		_add_surface(mesh, [Vector2(0.4, 8.45), Vector2(-0.4, 8.45)], i0, i1, light_mat, false)
		var mi := MeshInstance3D.new()
		mi.mesh = mesh
		add_child(mi)
		if quality >= 2:
			var s: float = tn["s0"] + 15.0
			while s < tn["s1"]:
				var l := OmniLight3D.new()
				l.light_color = Color(1.0, 0.9, 0.75)
				l.light_energy = 2.0
				l.omni_range = 18.0
				add_child(l)
				l.global_position = position_at(s, 0.0, 7.5)
				s += 30.0


func _build_gates() -> void:
	for gate in [[start_s - 6.0, "START", Color(0.7, 0.25, 1.0)], [finish_s, "FINISH", Color(1.0, 0.2, 0.75)]]:
		var s: float = gate[0]
		var tr := frame(s)
		var col: Color = gate[2]
		var mat := StandardMaterial3D.new()
		mat.albedo_color = Color(0.08, 0.06, 0.1)
		mat.metallic = 0.6
		mat.roughness = 0.3
		var emat := StandardMaterial3D.new()
		emat.albedo_color = col
		emat.emission_enabled = true
		emat.emission = col
		emat.emission_energy_multiplier = 3.0
		for side in [-1.0, 1.0]:
			var post := MeshInstance3D.new()
			var pb := BoxMesh.new()
			pb.size = Vector3(0.8, 9.0, 0.8)
			post.mesh = pb
			post.material_override = mat
			add_child(post)
			post.global_transform = Transform3D(tr.basis, tr.origin + tr.basis.x * side * (half_width + 1.2) + tr.basis.y * 4.5)
		var beam := MeshInstance3D.new()
		var bb := BoxMesh.new()
		bb.size = Vector3(half_width * 2.0 + 3.2, 1.8, 0.6)
		beam.mesh = bb
		beam.material_override = emat
		add_child(beam)
		beam.global_transform = Transform3D(tr.basis, tr.origin + tr.basis.y * 8.6)
		var lbl := Label3D.new()
		lbl.text = gate[1]
		lbl.font = UIKit.font("black")
		lbl.font_size = 220
		lbl.pixel_size = 0.01
		lbl.modulate = Color(1, 1, 1)
		lbl.outline_size = 0
		lbl.double_sided = true
		add_child(lbl)
		lbl.global_transform = Transform3D(tr.basis, tr.origin + tr.basis.y * 8.6 + tr.basis.z * 0.35)
		if gate[1] == "FINISH":
			# damier au sol
			var chk := MeshInstance3D.new()
			var cm := PlaneMesh.new()
			cm.size = Vector2(half_width * 2.0, 3.0)
			chk.mesh = cm
			var cmat := ShaderMaterial.new()
			var sh := Shader.new()
			sh.code = "shader_type spatial;\nvoid fragment(){ vec2 c = floor(UV * vec2(16.0, 3.0)); float k = mod(c.x + c.y, 2.0); ALBEDO = vec3(k * 0.9 + 0.05); ROUGHNESS = 0.7; }"
			cmat.shader = sh
			chk.material_override = cmat
			add_child(chk)
			chk.global_transform = Transform3D(tr.basis, tr.origin + tr.basis.y * 0.02)


# ---------------------------------------------------------------------------
# Bâtiments (MultiMesh + shader de façade)
# ---------------------------------------------------------------------------
func _clear_of_track(p: Vector3, i_ref: int, radius: float) -> bool:
	var lo: int = max(0, i_ref - 90)
	var hi: int = min(n - 1, i_ref + 90)
	var k := lo
	while k <= hi:
		var d := Vector2(p.x - pts[k].x, p.z - pts[k].z).length()
		if d < half_width + 6.8 + radius:
			return false
		k += 3
	return true


func _build_buildings() -> void:
	var style: String = theme["buildings"]
	var palette: Array = theme["palette"]
	var bh: Array = theme["bh"]
	var xforms: Array = []
	var customs: Array = []
	var density: float = [0.45, 0.75, 1.0][clampi(quality, 0, 2)]
	for side in [-1.0, 1.0]:
		var s := 0.0
		while s < length:
			var w := rng.randf_range(10.0, 26.0)
			if style == "victorian":
				w = rng.randf_range(7.0, 12.0)
			var d := rng.randf_range(12.0, 24.0)
			var h := rng.randf_range(bh[0], bh[1])
			if rng.randf() < theme["tall_chance"]:
				h *= rng.randf_range(1.6, 2.6)
			var gap := rng.randf_range(0.0, 3.0) if style != "rocks" else rng.randf_range(4.0, 30.0)
			var sc := s + w * 0.5
			s += w + gap
			if rng.randf() > density:
				continue
			var i := int(clamp(sc / STEP, 0, n - 1))
			var off := half_width + 7.0 + d * 0.5 + rng.randf_range(0.0, 2.0)
			if style == "rocks":
				off += rng.randf_range(4.0, 40.0)
			var flat_r := Vector3(rights[i].x, 0, rights[i].z).normalized()
			var flat_f := Vector3(fwds[i].x, 0, fwds[i].z).normalized()
			var center: Vector3 = pts[i] + flat_r * side * off
			var radius: float = max(w, d) * 0.5
			if not _clear_of_track(center, i, radius * 0.85):
				continue
			var basis := Basis(flat_r * d, Vector3.UP * h, -flat_f * w)
			if style == "rocks":
				basis = Basis(Vector3.UP, rng.randf() * TAU) * Basis(Vector3(1, 0, 0) * d, Vector3(0, h, 0), Vector3(0, 0, w))
				basis = Basis(Vector3(1, 0, 0), rng.randf_range(-0.15, 0.15)) * basis
			var base_y := pts[i].y - 1.5
			xforms.append(Transform3D(basis, Vector3(center.x, base_y + h * 0.5, center.z)))
			var col := Color(palette[rng.randi() % palette.size()])
			col = col.darkened(rng.randf_range(0.0, 0.18))
			customs.append(Color(col.r, col.g, col.b, rng.randf()))
	# ligne d'horizon lointaine
	if theme["skyline"] and quality >= 1:
		var count := 140 if quality >= 2 else 70
		for k in count:
			var i := rng.randi_range(0, n - 1)
			var flat_r := Vector3(rights[i].x, 0, rights[i].z).normalized()
			var side := 1.0 if rng.randf() < 0.5 else -1.0
			var dist := rng.randf_range(140.0, 520.0)
			var center: Vector3 = pts[i] + flat_r * side * dist
			if not _far_from_track(center, 110.0):
				continue
			var h := rng.randf_range(bh[0], bh[1] * 1.6) * (1.6 if style == "victorian" else 1.0)
			var w := rng.randf_range(20.0, 45.0)
			var basis := Basis(Vector3.UP, rng.randf() * TAU) * Basis(Vector3(w, 0, 0), Vector3(0, h, 0), Vector3(0, 0, w))
			xforms.append(Transform3D(basis, Vector3(center.x, pts[i].y - 2.0 + h * 0.5, center.z)))
			var col2 := Color(palette[rng.randi() % palette.size()]).darkened(0.25)
			customs.append(Color(col2.r, col2.g, col2.b, rng.randf()))
	if xforms.is_empty():
		return
	var mm := MultiMesh.new()
	mm.transform_format = MultiMesh.TRANSFORM_3D
	mm.use_custom_data = true
	mm.mesh = BoxMesh.new()
	mm.instance_count = xforms.size()
	for k in xforms.size():
		mm.set_instance_transform(k, xforms[k])
		mm.set_instance_custom_data(k, customs[k])
	var mmi := MultiMeshInstance3D.new()
	mmi.multimesh = mm
	if style == "rocks":
		var rock_mesh := _mesh_from("res://assets/props/rock.glb")
		if rock_mesh:
			mm.mesh = rock_mesh
		var rock := StandardMaterial3D.new()
		rock.albedo_color = Color(theme["palette"][0])
		rock.roughness = 1.0
		rock.albedo_texture = _noise_tex(0.06)
		rock.uv1_triplanar = true
		rock.uv1_world_triplanar = true
		rock.uv1_scale = Vector3(0.05, 0.05, 0.05)
		mmi.material_override = rock
	else:
		var bmat := ShaderMaterial.new()
		bmat.shader = load("res://shaders/building.gdshader")
		bmat.set_shader_parameter("night", theme["night"])
		bmat.set_shader_parameter("neon", 1.0 if style == "neon" or theme_id == "newyork" else 0.0)
		if style == "victorian":
			bmat.set_shader_parameter("floor_h", 3.1)
			bmat.set_shader_parameter("win_w", 1.9)
		mmi.material_override = bmat
	add_child(mmi)


func _far_from_track(p: Vector3, dist: float) -> bool:
	var k := 0
	while k < n:
		if Vector2(p.x - pts[k].x, p.z - pts[k].z).length() < dist:
			return false
		k += 8
	return true


# ---------------------------------------------------------------------------
# Décors : lampadaires, palmiers, arbres, panneaux
# ---------------------------------------------------------------------------
func _mesh_from(path: String) -> Mesh:
	var node := _load_scene(path)
	if node == null:
		return null
	var mesh: Mesh = null
	var stack: Array = [node]
	while not stack.is_empty():
		var c: Node = stack.pop_back()
		if c is MeshInstance3D and c.mesh:
			mesh = c.mesh
			break
		stack.append_array(c.get_children())
	node.free()
	return mesh


func _multimesh(mesh: Mesh, xforms: Array) -> void:
	if mesh == null or xforms.is_empty():
		return
	var mm := MultiMesh.new()
	mm.transform_format = MultiMesh.TRANSFORM_3D
	mm.mesh = mesh
	mm.instance_count = xforms.size()
	for k in xforms.size():
		mm.set_instance_transform(k, xforms[k])
	var mmi := MultiMeshInstance3D.new()
	mmi.multimesh = mm
	add_child(mmi)


func _side_xform(s: float, side: float, off: float, yaw_extra: float = 0.0, scale_v: float = 1.0) -> Transform3D:
	var i := int(clamp(s / STEP, 0, n - 1))
	var flat_r := Vector3(rights[i].x, 0, rights[i].z).normalized()
	var flat_f := Vector3(fwds[i].x, 0, fwds[i].z).normalized()
	var p := pts[i] + flat_r * side * (half_width + off) + Vector3.UP * 0.2
	# l'axe +X local pointe vers la route
	var x_axis := -flat_r * side
	var b := Basis(x_axis, Vector3.UP, x_axis.cross(Vector3.UP).normalized() * -1.0)
	b = b.orthonormalized()
	if yaw_extra != 0.0:
		b = Basis(Vector3.UP, yaw_extra) * b
	return Transform3D(b.scaled(Vector3.ONE * scale_v), p)


func _build_props() -> void:
	var props: Dictionary = theme["props"]
	var lamp_x: Array = []
	var palm_x: Array = []
	var tree_x: Array = []
	var bill_x: Array = []
	var cone_x: Array = []
	_lamp_positions = []
	var spacing := 48.0 if quality >= 1 else 80.0
	var s := 20.0
	var flip := 1.0
	while s < length - 20.0:
		if _in_tunnel(s):
			s += spacing
			continue
		if props.get("lamp", 0.0) > 0.0 and rng.randf() < props["lamp"]:
			lamp_x.append(_side_xform(s, flip, 1.3))
			_lamp_positions.append(position_at(s, flip * (half_width - 1.5), 8.5))
		flip = -flip
		s += spacing
	s = 10.0
	while s < length:
		for side in [-1.0, 1.0]:
			if _in_tunnel(s):
				continue
			if props.get("palm", 0.0) > 0.0 and rng.randf() < props["palm"] * 0.8:
				palm_x.append(_side_xform(s + rng.randf_range(-3, 3), side, rng.randf_range(2.5, 5.5), rng.randf() * TAU, rng.randf_range(0.85, 1.25)))
			if props.get("tree", 0.0) > 0.0 and rng.randf() < props["tree"] * 0.6:
				tree_x.append(_side_xform(s + rng.randf_range(-3, 3), side, rng.randf_range(3.0, 5.5), rng.randf() * TAU, rng.randf_range(0.8, 1.2)))
		s += 16.0 if quality >= 1 else 28.0
	s = 150.0
	while s < length - 100.0:
		if props.get("billboard", 0.0) > 0.0 and rng.randf() < props["billboard"] and not _in_tunnel(s):
			var side := 1.0 if rng.randf() < 0.5 else -1.0
			var x := _side_xform(s, side, 9.0, PI * 0.5 * side * 0.6, 1.3)
			if _clear_of_track(x.origin, int(s / STEP), 4.0):
				bill_x.append(x)
		s += rng.randf_range(90.0, 180.0)
	if props.get("cone", 0.0) > 0.0:
		s = 60.0
		while s < length:
			for side in [-1.0, 1.0]:
				cone_x.append(_side_xform(s, side, 1.2))
			s += 12.0
	_multimesh(_mesh_from("res://assets/props/lamp.glb"), lamp_x)
	_multimesh(_mesh_from("res://assets/props/palm.glb"), palm_x)
	_multimesh(_mesh_from("res://assets/props/tree.glb"), tree_x)
	_multimesh(_mesh_from("res://assets/props/cone.glb"), cone_x)
	if not bill_x.is_empty():
		var bm := _mesh_from("res://assets/props/billboard.glb")
		if bm:
			var cols := [Color(1.0, 0.2, 0.8), Color(0.2, 0.8, 1.0), Color(1.0, 0.8, 0.1), Color(0.6, 0.3, 1.0)]
			for k in bill_x.size():
				var mi := MeshInstance3D.new()
				mi.mesh = bm
				add_child(mi)
				mi.global_transform = bill_x[k]
				# écran : couleur unique par panneau
				for si in bm.get_surface_count():
					var m := bm.surface_get_material(si)
					if m and m.resource_name == "Screen":
						var sm := StandardMaterial3D.new()
						var c: Color = cols[k % cols.size()]
						sm.albedo_color = c
						sm.emission_enabled = true
						sm.emission = c
						sm.emission_energy_multiplier = 2.5 + 2.0 * theme["night"]
						mi.set_surface_override_material(si, sm)
	# éclairage réel des lampadaires la nuit (Forward+ : beaucoup de lumières possibles)
	if theme["night"] > 0.4 and quality >= 2:
		for k in range(0, _lamp_positions.size()):
			var l := OmniLight3D.new()
			l.light_color = Color(1.0, 0.82, 0.6)
			l.light_energy = 2.2
			l.omni_range = 20.0
			l.omni_attenuation = 1.2
			add_child(l)
			l.global_position = _lamp_positions[k]


func _in_tunnel(s: float) -> bool:
	for tn in tunnels:
		if s > tn["s0"] - 10.0 and s < tn["s1"] + 10.0:
			return true
	return false


# ---------------------------------------------------------------------------
# Ambiance
# ---------------------------------------------------------------------------
func make_environment() -> Environment:
	var env := Environment.new()
	var sky := Sky.new()
	var sm := ProceduralSkyMaterial.new()
	sm.sky_top_color = Color(theme["sky_top"])
	sm.sky_horizon_color = Color(theme["sky_horizon"])
	sm.ground_horizon_color = Color(theme["sky_horizon"]).darkened(0.2)
	sm.ground_bottom_color = Color(theme["ground"]).darkened(0.5)
	sm.sun_angle_max = 20.0
	sm.sky_energy_multiplier = 1.0 if theme["night"] < 0.9 else 0.6
	if theme.get("clouds", 0.0) > 0.0:
		var nt := NoiseTexture2D.new()
		var fn := FastNoiseLite.new()
		fn.frequency = 0.012
		fn.fractal_octaves = 4
		nt.noise = fn
		nt.width = 512
		nt.height = 256
		nt.seamless = true
		var g := Gradient.new()
		g.set_color(0, Color(0, 0, 0, 1))
		g.set_color(1, Color(1, 1, 1, 1))
		g.add_point(1.0 - theme["clouds"], Color(0, 0, 0, 1))
		nt.color_ramp = g
		sm.sky_cover = nt
		sm.sky_cover_modulate = Color(1, 1, 1, 0.85)
	sky.sky_material = sm
	env.background_mode = Environment.BG_SKY
	env.sky = sky
	env.ambient_light_source = Environment.AMBIENT_SOURCE_SKY
	env.ambient_light_color = Color(theme["sky_horizon"]).lerp(Color(1, 1, 1), 0.3)
	env.ambient_light_sky_contribution = 0.55
	env.ambient_light_energy = theme["ambient"] * 1.3
	if theme["night"] > 0.5:
		env.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
		env.ambient_light_color = Color(0.45, 0.4, 0.75)
		env.ambient_light_energy = 0.9
	env.reflected_light_source = Environment.REFLECTION_SOURCE_SKY
	env.tonemap_mode = Environment.TONE_MAPPER_ACES
	env.tonemap_exposure = 1.0 if theme["night"] < 0.5 else 1.15
	env.tonemap_white = 6.0
	env.glow_enabled = true
	env.glow_intensity = 0.6 + 0.5 * theme["night"]
	env.glow_bloom = 0.05 + 0.1 * theme["night"]
	env.glow_hdr_threshold = 1.0
	env.glow_blend_mode = Environment.GLOW_BLEND_MODE_SOFTLIGHT if theme["night"] < 0.5 else Environment.GLOW_BLEND_MODE_ADDITIVE
	env.fog_enabled = true
	env.fog_light_color = Color(theme["fog"])
	env.fog_density = theme["fog_density"]
	env.fog_sky_affect = 0.25
	env.fog_aerial_perspective = 0.4
	env.adjustment_enabled = true
	env.adjustment_saturation = 1.15
	env.adjustment_contrast = 1.06
	if quality >= 2 and Game.is_forward_plus():
		env.ssao_enabled = true
		env.ssao_radius = 1.2
		env.ssao_intensity = 1.5
		env.ssr_enabled = theme["wet"] > 0.3
		env.ssr_max_steps = 48
	return env


func make_sun() -> DirectionalLight3D:
	var sun := DirectionalLight3D.new()
	sun.light_color = Color(theme["sun_color"])
	sun.light_energy = theme["sun_energy"]
	sun.rotation_degrees = Vector3(-float(theme["sun_elev"]), float(theme["sun_az"]), 0.0)
	sun.shadow_enabled = quality >= 1
	sun.directional_shadow_max_distance = 140.0 if quality >= 2 else 80.0
	sun.directional_shadow_mode = DirectionalLight3D.SHADOW_PARALLEL_4_SPLITS if quality >= 2 else DirectionalLight3D.SHADOW_PARALLEL_2_SPLITS
	sun.shadow_blur = 1.5
	sun.shadow_normal_bias = 2.5
	return sun
