class_name World
extends Node3D






const R: = 230.0
const SIZE: = 1100.0
const HALF: = 550.0
const STEP: = 2.5
const N: = 441
const LAKE_Y: = 5.4
const SEA_Y: = 0.05
const SWAMP_Y: = 1.75
const CHUNKS: = 11
const DUNGEON_X: = 1500.0
const BIOMES: = ["prairie", "automne", "plateau", "cerisiers"]
const BIOME_NAMES: = {"prairie": "Prairie des Échos", "automne": "Forêt d'Automne", "plateau": "Hauts Plateaux Azur", 
	"cerisiers": "Vallée des Cerisiers", "pic": "Pic Givré", "village": "Brise-Marée", "plage": "Plages d'Aetheria", 
	"braise": "Terres de Braise", "marais": "Marais d'Émeraude", "orage": "Falaises de l'Orage"}
const REGION_IDS: = {"braise": 5, "marais": 6, "orage": 7}

const REGIONS: = {
	"marais": {"pos": Vector3(-222, 0, 246), "r": 172.0}, 
	"braise": {"pos": Vector3(232, 0, 236), "r": 170.0}, 
	"orage": {"pos": Vector3(-232, 0, -236), "r": 168.0}, 
}


var village: = Vector3(0, 0, -150)
var mountain: = Vector3(45, 0, 22)
var plateau: = Vector3(-10, 0, 152)
var lake: = Vector3(-128, 0, -58)
var lighthouse: = Vector3(132, 0, -123)
var orchard: = Vector3(46, 0, -128)
var cat_spot: = Vector3(-150, 0, 100)
var statues: Array[Vector3] = [Vector3(0, 0, -132), Vector3(88, 0, 92), 
	Vector3(-182, 0, 214), Vector3(192, 0, 196), Vector3(-190, 0, -198)]
var seals: Array[Vector3] = [Vector3(162, 0, 8), Vector3(-150, 0, 55), Vector3(-2, 0, 170)]
var seal_elems: = ["hydro", "electro", "charged"]
var waypoints: Array = [
	{"name": "Brise-Marée", "pos": Vector3(-20, 0, -128)}, 
	{"name": "Prairie des Échos", "pos": Vector3(-38, 0, -48)}, 
	{"name": "Forêt d'Automne", "pos": Vector3(122, 0, -34)}, 
	{"name": "Vallée des Cerisiers", "pos": Vector3(-112, 0, 88)}, 
	{"name": "Hauts Plateaux Azur", "pos": Vector3(38, 0, 128)}, 
	{"name": "Pic Givré", "pos": Vector3(78, 0, 58)}, 
	{"name": "Phare d'Aldo", "pos": Vector3(110, 0, -140)}, 

	{"name": "Marais d'Émeraude", "pos": Vector3(-160, 0, 178)}, 
	{"name": "Clairière du Roi", "pos": Vector3(-205, 0, 248)}, 
	{"name": "Terres de Braise", "pos": Vector3(160, 0, 166)}, 
	{"name": "Caldeira d'Ignis", "pos": Vector3(214, 0, 224)}, 
	{"name": "Falaises de l'Orage", "pos": Vector3(-162, 0, -166)}, 
	{"name": "Cercle des Tempêtes", "pos": Vector3(-212, 0, -228)}, 
]

var camps: Array = [
	{"pos": Vector3(-62, 0, -78), "theme": "goblins", "biome": "prairie"}, 
	{"pos": Vector3(62, 0, -86), "theme": "slimes", "biome": "prairie"}, 
	{"pos": Vector3(150, 0, 58), "theme": "goblins_fire", "biome": "automne"}, 
	{"pos": Vector3(118, 0, -80), "theme": "wisps", "biome": "automne"}, 
	{"pos": Vector3(-150, 0, 18), "theme": "slimes_mix", "biome": "cerisiers"}, 
	{"pos": Vector3(-86, 0, 128), "theme": "goblins", "biome": "cerisiers"}, 
	{"pos": Vector3(24, 0, 170), "theme": "golem", "biome": "plateau"}, 
	{"pos": Vector3(90, 0, 10), "theme": "cryo", "biome": "pic"}, 
	{"pos": Vector3(-262, 0, 214), "theme": "marais_slimes", "biome": "marais"}, 
	{"pos": Vector3(-170, 0, 302), "theme": "marais_goblins", "biome": "marais"}, 
	{"pos": Vector3(302, 0, 198), "theme": "braise_slimes", "biome": "braise"}, 
	{"pos": Vector3(198, 0, 302), "theme": "braise_golem", "biome": "braise"}, 
	{"pos": Vector3(306, 0, 318), "theme": "braise_wisps", "biome": "braise"}, 
	{"pos": Vector3(-290, 0, -190), "theme": "orage_wisps", "biome": "orage"}, 
	{"pos": Vector3(-200, 0, -300), "theme": "orage_golem", "biome": "orage"}, 
	{"pos": Vector3(-300, 0, -276), "theme": "orage_goblins", "biome": "orage"}, 
]

var domains: Array = [
	{"id": "masques", "name": "Repaire des Masques", "pos": Vector3(-140, 0, 206), "rank": 5}, 
	{"id": "forge", "name": "Forge d'Ignis", "pos": Vector3(286, 0, 168), "rank": 10}, 
	{"id": "celeste", "name": "Sanctuaire Céleste", "pos": Vector3(-270, 0, -312), "rank": 18}, 
]

var boss_spots: = {
	"roi_slime": Vector3(-238, 0, 278), 
	"colosse": Vector3(252, 0, 261), 
	"tempest": Vector3(-248, 0, -258), 
}
var volcano: = Vector3(252, 0, 261)
const LAVA_POOLS: = [[330.0, 255.0, 8.0], [240.0, 345.0, 7.0], [174.0, 300.0, 6.0], [312.0, 190.0, 6.5]]
const LAVA_RIVERS: = [0.5, 2.6, 4.3]

const LEGACY_CHESTS: = [[17.89, 120.22], [-168.05, -52.16], [-108.68, -126.77], [-122.7, 48.07], [-7.63, 86.01], [44.33, 57.63], 
	[150.12, 105.61], [167.76, 28.82], [-85.93, -46.43], [-62.94, 66.12], [-20.46, -53.08], [-130.92, -21.61], [-32.56, -93.04], 
	[-125.44, 103.54], [159.73, -45.81], [26.65, -94.55], [121.25, 6.65], [-40.27, 33.05]]
const LEGACY_CRYSTALS: = [[-174.32, -62.98], [-37.03, 69.71], [-92.49, -91.08], [74.24, 68.22], [168.63, 52.55], [-87.94, -134.43], 
	[109.82, -37.32], [-94.62, 73.38], [173.0, 13.02], [-177.44, -40.13], [31.33, 126.74], [-136.97, 127.48], [56.7, -125.17], 
	[-24.0, -96.33], [-154.38, 21.95], [48.41, 95.97], [-65.24, 122.66], [92.11, 47.8], [36.15, -99.6], [132.95, 54.12], 
	[116.94, -8.3], [36.26, 34.28], [-119.97, -116.49], [-91.17, -165.02], [-50.13, 25.79], [92.41, 103.48], [-80.23, 8.02], 
	[15.14, 169.47], [-5.37, 30.72], [-94.62, -15.57]]
const LEGACY_APPLES: = [[54.74, -124.31], [48.88, -120.89], [42.31, -119.28], [40.78, -125.88], [40.11, -130.49], [44.48, -131.74], 
	[49.04, -135.18], [51.01, -130.03]]
const LEGACY_ROAM: = [[-85.5, 90.04, "cerisiers"], [55.25, -16.85, "pic"], [-68.4, -13.7, "cerisiers"], [-6.61, 28.15, "plateau"], 
	[-159.79, -94.49, "cerisiers"], [-90.56, -108.71, "prairie"], [-87.92, 47.98, "plateau"], [114.81, 94.33, "automne"], 
	[-27.64, 71.2, "plateau"], [85.3, 134.81, "plateau"], [152.25, -72.65, "automne"], [-105.35, 148.87, "plateau"], 
	[173.4, 72.41, "automne"], [-124.82, -141.3, "prairie"], [-105.11, 14.69, "cerisiers"], [-40.54, 8.27, "cerisiers"]]
var summit: = Vector3.ZERO
var spawn_pos: = Vector3.ZERO
var statue_pos: = Vector3.ZERO
var dock_pos: = Vector3.ZERO
var npc_spots: = {}
var chest_spots: Array[Vector3] = []
var crystal_spots: Array[Vector3] = []
var apple_spots: Array[Vector3] = []
var roam_spots: Array = []


var hmap: = PackedFloat32Array()
var cmap: = PackedByteArray()
var amap: = PackedByteArray()
var noise: = FastNoiseLite.new()
var noise2: = FastNoiseLite.new()
var noise3: = FastNoiseLite.new()
var rng: = RandomNumberGenerator.new()
var paths: Array = []


var sun: DirectionalLight3D
var env: Environment
var sky_mat: ShaderMaterial
var water_mat: ShaderMaterial
var lake_mat: ShaderMaterial
var height_tex: ImageTexture
var prop_meshes: = {}
var lanterns: Array = []
var window_mat: StandardMaterial3D
var lamp_mats: Array = []
var bloom_mat: ShaderMaterial
var windmill_blades: Node3D
var light_house_lamp: OmniLight3D
var solid: StaticBody3D
var canopies: StaticBody3D
var swamp_mat: ShaderMaterial
var lava_pool_mat: ShaderMaterial
var lava_streams: Array = []
var portal_mats: Array = []
var _mm: = {}
var _flatten: Array = []

func _init() -> void :
	noise.seed = 971;noise.frequency = 0.009;noise.fractal_octaves = 4
	noise2.seed = 42;noise2.frequency = 0.05
	noise3.seed = 2026;noise3.frequency = 0.02
	rng.seed = 2026
	paths = [
		[Vector2(0, -150), Vector2(-20, -128), 3.0], [Vector2(-20, -128), Vector2(-38, -48), 2.6], 
		[Vector2(-38, -48), Vector2(-112, 88), 2.4], [Vector2(-112, 88), Vector2(-150, 55), 2.2], 
		[Vector2(-38, -48), Vector2(38, 128), 2.4], [Vector2(38, 128), Vector2(-2, 170), 2.2], 
		[Vector2(0, -150), Vector2(46, -128), 2.4], [Vector2(46, -128), Vector2(122, -34), 2.4], 
		[Vector2(122, -34), Vector2(162, 8), 2.2], [Vector2(46, -128), Vector2(110, -140), 2.2], 
		[Vector2(122, -34), Vector2(78, 58), 2.2], [Vector2(-38, -48), Vector2(-128, -58), 2.0], 

		[Vector2(-112, 88), Vector2(-160, 178), 2.4], [Vector2(-160, 178), Vector2(-205, 248), 2.2], 
		[Vector2(-160, 178), Vector2(-140, 206), 2.0], [Vector2(38, 128), Vector2(160, 166), 2.4], 
		[Vector2(160, 166), Vector2(214, 224), 2.2], [Vector2(160, 166), Vector2(286, 168), 2.0], 
		[Vector2(-128, -58), Vector2(-162, -166), 2.4], [Vector2(-162, -166), Vector2(-212, -228), 2.2], 
		[Vector2(-212, -228), Vector2(-270, -312), 2.0], 
	]


func coast_radius(ang: float) -> float:
	var c: = Vector2(cos(ang), sin(ang))
	return R * (1.0 + 0.075 * noise3.get_noise_2d(c.x * 60.0, c.y * 60.0) + 0.03 * noise2.get_noise_2d(c.x * 200.0, c.y * 200.0))


func raw_height(x: float, z: float) -> float:
	var h: = _old_height(x, z)
	for key in REGIONS:
		var c: Vector3 = REGIONS[key].pos
		if absf(x - c.x) > 240.0 or absf(z - c.z) > 240.0: continue
		var hr: = _region_height(key, x, z)
		if hr > -5.9: h = _smax(h, hr, 3.0)
	return h

static func _smax(a: float, b: float, k: float) -> float:
	var t: = clampf(0.5 + 0.5 * (b - a) / k, 0.0, 1.0)
	return lerpf(a, b, t) + k * t * (1.0 - t)


func region_r(key: String, x: float, z: float) -> float:
	var reg: Dictionary = REGIONS[key]
	var c: Vector3 = reg.pos
	var dx: = x - c.x; var dz: = z - c.z
	var ang: = atan2(dz, dx)
	var cr: float = reg.r * (1.0 + 0.17 * noise3.get_noise_2d(cos(ang) * 38.0 + c.x, sin(ang) * 38.0 + c.z)
		+ 0.05 * noise2.get_noise_2d(cos(ang) * 150.0 + c.z, sin(ang) * 150.0))
	return sqrt(dx * dx + dz * dz) / cr

func _region_height(key: String, x: float, z: float) -> float:
	var r: = region_r(key, x, z)
	var h: = -6.0 + smoothstep(1.03, 0.88, r) * 7.2
	var inland: = smoothstep(0.93, 0.72, r)
	match key:
		"marais":

			h += inland * (0.9 + 1.4 * (noise.get_noise_2d(x * 1.4 + 300.0, z * 1.4) * 0.5 + 0.5))
			var pool: = smoothstep(-0.12, -0.32, noise2.get_noise_2d(x * 0.55, z * 0.55)) * smoothstep(0.72, 0.5, r)
			h = lerpf(h, 0.3, pool * 0.9)
			var arena: = boss_spots.roi_slime as Vector3
			h += 1.2 * exp( - pow(Vector2(x - arena.x, z - arena.z).length() / 30.0, 2.0)) * inland
		"braise":

			h += inland * (2.4 + 5.0 * (noise.get_noise_2d(x * 1.1 + 900.0, z * 1.1) * 0.5 + 0.5))
			var dv: = Vector2(x - volcano.x, z - volcano.z).length()
			h += inland * volcano_profile(dv)
			for lp in LAVA_POOLS:
				var dl: = Vector2(x - lp[0], z - lp[1]).length() / float(lp[2])
				if dl < 1.6: h -= 1.6 * smoothstep(1.5, 0.8, dl) * inland
		"orage":

			var ridged: = 1.0 - absf(noise.get_noise_2d(x * 0.8 + 700.0, z * 0.8))
			h += inland * (5.0 + 12.0 * ridged * ridged)
			var hill: = boss_spots.tempest as Vector3
			h += inland * 16.0 * exp( - pow(Vector2(x - hill.x, z - hill.z).length() / 46.0, 2.0))
	return h


static func volcano_profile(d: float) -> float:
	if d < 34.0: return 30.0 + 8.0 * smoothstep(16.0, 30.0, d)
	return 38.0 * (1.0 - smoothstep(34.0, 118.0, d))

func _old_height(x: float, z: float) -> float:
	var d: = sqrt(x * x + z * z)
	var r: = d / coast_radius(atan2(z, x))
	var island: = smoothstep(1.03, 0.86, r)
	var h: = -6.0 + island * 7.2
	var inland: = smoothstep(0.92, 0.66, r)
	h += (noise.get_noise_2d(x, z) * 0.5 + 0.5) * 10.0 * inland
	h += noise2.get_noise_2d(x, z) * 0.6 * inland

	var dm: = Vector2(x - mountain.x, z - mountain.z).length()
	var ridge: = 1.0 - absf(noise2.get_noise_2d(x * 0.7, z * 0.7))
	h += 52.0 * exp( - pow(dm / 64.0, 2.0)) * (0.9 + 0.12 * ridge)

	var dp: = Vector2(x - plateau.x, z - plateau.z).length() / (52.0 * (1.0 + 0.12 * noise3.get_noise_2d(x, z)))
	h += 12.0 * smoothstep(1.0, 0.62, dp)

	var dl: = Vector2(x - lake.x, z - lake.z).length() / (34.0 * (1.0 + 0.1 * noise3.get_noise_2d(x * 2.0, z * 2.0)))
	h = lerpf(h, 2.2, smoothstep(1.0, 0.55, dl))
	return h

func _setup_flatten() -> void :
	_flatten.clear()
	_add_flat(village, 26.0, 40.0, 5.0)
	_add_flat(orchard, 12.0, 20.0, 4.0)
	for s in statues: _add_flat(s, 6.0, 11.0, 2.5)
	for s in seals: _add_flat(s, 7.0, 13.0, 2.5)
	for w in waypoints: _add_flat(w.pos, 3.5, 7.0, 2.5)
	for c in camps: _add_flat(c.pos, 9.0, 15.0, 2.5)
	_add_flat(lighthouse, 7.0, 12.0, 3.0)

	var top: = raw_height(mountain.x, mountain.z)
	_flatten.append([Vector2(mountain.x, mountain.z), 15.0, 22.0, top - 3.0])

	for dm in domains: _add_flat(dm.pos, 7.0, 13.0, 2.6)
	_add_flat(boss_spots.roi_slime, 17.0, 26.0, 2.6)
	_add_flat(boss_spots.colosse, 14.0, 17.0, 20.0)
	_add_flat(boss_spots.tempest, 13.0, 22.0, 6.0)

func _add_flat(p: Vector3, r0: float, r1: float, min_h: float) -> void :
	_flatten.append([Vector2(p.x, p.z), r0, r1, maxf(raw_height(p.x, p.z), min_h)])

func terrain_height(x: float, z: float) -> float:
	var h: = raw_height(x, z)
	for f in _flatten:
		var d: = Vector2(x, z).distance_to(f[0])
		if d < f[2]:
			h = lerpf(h, f[3], smoothstep(f[2], f[1], d))
	return h

func biome_weights(x: float, z: float) -> PackedFloat32Array:

	var ang: = atan2(z, x) + 0.55 * noise3.get_noise_2d(x * 0.6 + 400.0, z * 0.6)
	var centers: = [ - PI * 0.5, 0.0, PI * 0.5, PI]
	var w: = PackedFloat32Array([0, 0, 0, 0])
	var tot: = 0.0
	for i in 4:
		var v: = pow(maxf(cos(ang - centers[i]), 0.0), 2.4)
		w[i] = v;tot += v
	for i in 4: w[i] /= maxf(tot, 0.0001)
	return w

func path_dist(x: float, z: float) -> float:
	var best: = 999.0
	var p: = Vector2(x, z)
	for seg in paths:
		var a: Vector2 = seg[0]; var b: Vector2 = seg[1]
		var ab: = b - a
		var t: = clampf((p - a).dot(ab) / ab.length_squared(), 0.0, 1.0)
		var wob: = 1.5 * noise2.get_noise_2d(x * 1.3, z * 1.3)
		best = minf(best, p.distance_to(a + ab * t) + wob - (seg[2] as float))
	return best

const GRASS_COLS: = [[Color(0.36, 0.66, 0.26), Color(0.47, 0.73, 0.3)], 
	[Color(0.8, 0.56, 0.22), Color(0.7, 0.4, 0.17)], 
	[Color(0.25, 0.62, 0.55), Color(0.33, 0.55, 0.66)], 
	[Color(0.6, 0.76, 0.4), Color(0.95, 0.66, 0.76)]]
const SAND: = Color(0.9, 0.8, 0.56)
const WET: = Color(0.76, 0.68, 0.5)
const ROCK: = Color(0.52, 0.49, 0.46)
const SNOW: = Color(0.86, 0.9, 0.97)
const PATH: = Color(0.66, 0.54, 0.38)
const MUD: = Color(0.42, 0.46, 0.34)


func vertex_attrs(x: float, z: float, h: float, nrm: Vector3) -> Array:
	var w: = biome_weights(x, z)
	var n1: = noise2.get_noise_2d(x * 0.9, z * 0.9) * 0.5 + 0.5
	var grass_col: = Color(0, 0, 0)
	var dom: = 0
	for i in 4:
		var pair: Array = GRASS_COLS[i]
		var gc: Color = (pair[0] as Color).lerp(pair[1], smoothstep(0.35, 0.75, n1) if i != 3 else smoothstep(0.44, 0.64, n1))
		grass_col += gc * w[i]
		if w[i] > w[dom]: dom = i
	var c: = grass_col
	var grass: = 1.0
	var snow: = 0.0
	var sand: = 0.0

	var reg_key: = ""
	var reg_w: = 0.0
	for key in REGIONS:
		var rc: Vector3 = REGIONS[key].pos
		if absf(x - rc.x) > 240.0 or absf(z - rc.z) > 240.0: continue
		var wk: = smoothstep(0.95, 0.72, region_r(key, x, z))
		if wk > reg_w: reg_w = wk;reg_key = key
	if reg_key != "":
		var rcol: Color
		var rgrass: = 1.0
		match reg_key:
			"marais":
				rcol = Color(0.22, 0.4, 0.25).lerp(Color(0.34, 0.47, 0.22), smoothstep(0.3, 0.7, n1))
				if h < SWAMP_Y + 0.5: rcol = rcol.lerp(Color(0.3, 0.27, 0.19), smoothstep(SWAMP_Y + 0.5, SWAMP_Y - 0.2, h));rgrass = 0.4
			"braise":
				rcol = Color(0.26, 0.22, 0.21).lerp(Color(0.4, 0.27, 0.21), smoothstep(0.35, 0.75, n1))
				var dry: = smoothstep(0.62, 0.8, noise3.get_noise_2d(x * 2.0, z * 2.0) * 0.5 + 0.5)
				rcol = rcol.lerp(Color(0.56, 0.44, 0.24), dry * 0.8)
				rgrass = 0.15 + 0.5 * dry
				var dv: = Vector2(x - volcano.x, z - volcano.z).length()
				if dv < 40.0: rcol = rcol.lerp(Color(0.17, 0.14, 0.14), smoothstep(40.0, 25.0, dv));rgrass *= smoothstep(25.0, 40.0, dv)
			"orage":
				rcol = Color(0.34, 0.42, 0.52).lerp(Color(0.47, 0.4, 0.58), smoothstep(0.35, 0.72, n1))
				rgrass = 0.85
		c = c.lerp(rcol, reg_w)
		grass = lerpf(grass, rgrass, reg_w)

	var pd: = path_dist(x, z)
	var on_path: = smoothstep(1.2, -0.4, pd)
	c = c.lerp(PATH, on_path * 0.9);grass *= 1.0 - on_path * 0.9

	var steep: = smoothstep(0.8, 0.66, nrm.y)
	var alt_rock: = smoothstep(30.0, 38.0, h)
	var rock: = maxf(steep, alt_rock * 0.85) * float(h > 2.5)
	var rock_col: = ROCK
	if reg_key == "braise": rock_col = Color(0.22, 0.18, 0.18).lerp(ROCK, 1.0 - reg_w)
	elif reg_key == "orage": rock_col = Color(0.42, 0.41, 0.5).lerp(ROCK, 1.0 - reg_w)
	c = c.lerp(rock_col.lerp(rock_col.darkened(0.15), n1), rock);grass *= 1.0 - rock

	snow = smoothstep(39.0, 44.0, h + 3.0 * (n1 - 0.5)) * (1.0 - (reg_w if reg_key == "braise" else 0.0))
	c = c.lerp(SNOW, snow);grass *= 1.0 - snow

	var dl: = Vector2(x - lake.x, z - lake.z).length()
	if dl < 40.0 and h < LAKE_Y + 0.7:
		var k: = smoothstep(LAKE_Y + 0.7, LAKE_Y - 0.3, h)
		c = c.lerp(MUD, k);grass *= 1.0 - k

	if h < 3.0:
		var k2: = smoothstep(3.0, 1.9, h)
		if reg_key == "marais": k2 *= 1.0 - smoothstep(0.55, 0.85, reg_w)
		c = c.lerp(SAND, k2);grass *= 1.0 - k2;sand = k2
		if h < 0.5:
			c = c.lerp(WET, smoothstep(0.5, -0.5, h))
	var biome: = dom
	if snow > 0.5 or (h > 34.0 and reg_key != "braise"): biome = 4
	if reg_w > 0.5: biome = REGION_IDS[reg_key]
	return [c, clampf(grass, 0.0, 1.0), snow, sand, biome, on_path]


func compute_grid() -> void :
	_setup_flatten()
	hmap.resize(N * N);cmap.resize(N * N * 4);amap.resize(N * N * 4)
	for j in N:
		for i in N:
			hmap[j * N + i] = terrain_height( - HALF + i * STEP, - HALF + j * STEP)
	for j in N:
		for i in N:
			var idx: = j * N + i
			var nrm: = _grid_normal(i, j)
			var a: Array = vertex_attrs( - HALF + i * STEP, - HALF + j * STEP, hmap[idx], nrm)
			var c: Color = a[0]
			cmap[idx * 4] = int(clampf(c.r, 0, 1) * 255);cmap[idx * 4 + 1] = int(clampf(c.g, 0, 1) * 255)
			cmap[idx * 4 + 2] = int(clampf(c.b, 0, 1) * 255);cmap[idx * 4 + 3] = int(a[1] * 255)
			amap[idx * 4] = int(a[2] * 255);amap[idx * 4 + 1] = int(a[3] * 255)
			amap[idx * 4 + 2] = a[4];amap[idx * 4 + 3] = int(a[5] * 255)

func bake(dir: String) -> void :
	compute_grid()
	var f: = FileAccess.open(dir.path_join("terrain_h.bin"), FileAccess.WRITE);f.store_buffer(hmap.to_byte_array());f.close()
	f = FileAccess.open(dir.path_join("terrain_c.bin"), FileAccess.WRITE);f.store_buffer(cmap);f.close()
	f = FileAccess.open(dir.path_join("terrain_a.bin"), FileAccess.WRITE);f.store_buffer(amap);f.close()

func load_grid() -> void :
	var hb: = FileAccess.get_file_as_bytes("res://assets/terrain_h.bin")
	if hb.size() != N * N * 4:
		push_warning("terrain bake missing, computing (slow)")
		compute_grid()
		return
	hmap = hb.to_float32_array()
	cmap = FileAccess.get_file_as_bytes("res://assets/terrain_c.bin")
	amap = FileAccess.get_file_as_bytes("res://assets/terrain_a.bin")

func _grid_normal(i: int, j: int) -> Vector3:
	var hl: = hmap[j * N + maxi(i - 1, 0)]; var hr: = hmap[j * N + mini(i + 1, N - 1)]
	var hd: = hmap[maxi(j - 1, 0) * N + i]; var hu: = hmap[mini(j + 1, N - 1) * N + i]
	return Vector3(hl - hr, 2.0 * STEP, hd - hu).normalized()


func height_at(x: float, z: float) -> float:
	if x > DUNGEON_X: return 0.0
	var fx: = clampf((x + HALF) / STEP, 0.0, N - 1.001)
	var fz: = clampf((z + HALF) / STEP, 0.0, N - 1.001)
	var i: = int(fx); var j: = int(fz)
	var tx: = fx - i; var tz: = fz - j
	var a: = hmap[j * N + i]; var b: = hmap[j * N + i + 1]
	var c: = hmap[(j + 1) * N + i]; var d: = hmap[(j + 1) * N + i + 1]
	return lerpf(lerpf(a, b, tx), lerpf(c, d, tx), tz)

func normal_at(x: float, z: float) -> Vector3:
	var e: = 1.0
	return Vector3(height_at(x - e, z) - height_at(x + e, z), 2.0 * e, height_at(x, z - e) - height_at(x, z + e)).normalized()

func _attr(x: float, z: float, k: int) -> int:
	var i: = clampi(int(round((x + HALF) / STEP)), 0, N - 1)
	var j: = clampi(int(round((z + HALF) / STEP)), 0, N - 1)
	return amap[(j * N + i) * 4 + k]

func biome_at(x: float, z: float) -> String:
	var b: = _attr(x, z, 2)
	match b:
		4: return "pic"
		5: return "braise"
		6: return "marais"
		7: return "orage"
	return BIOMES[clampi(b, 0, 3)]

func region_name(p: Vector3) -> String:
	if Vector2(p.x - village.x, p.z - village.z).length() < 45.0: return BIOME_NAMES["village"]
	var b: = biome_at(p.x, p.z)
	if height_at(p.x, p.z) < 2.6 and b != "marais": return BIOME_NAMES["plage"]
	return BIOME_NAMES[b]


func lava_at(p: Vector3) -> bool:
	if Vector2(p.x - volcano.x, p.z - volcano.z).length() > 180.0: return false
	for lp in LAVA_POOLS:
		if Vector2(p.x - lp[0], p.z - lp[1]).length() < float(lp[2]) * 0.85 and p.y < height_at(p.x, p.z) + 0.8: return true
	for seg in lava_streams:
		var a: Vector3 = seg[0]; var b: Vector3 = seg[1]
		var ab: = Vector2(b.x - a.x, b.z - a.z); var ap: = Vector2(p.x - a.x, p.z - a.z)
		var t: = clampf(ap.dot(ab) / ab.length_squared(), 0.0, 1.0)
		if (ap - ab * t).length() < float(seg[2]) and p.y < height_at(p.x, p.z) + 0.8: return true
	return false

func on_path(x: float, z: float) -> bool:
	return _attr(x, z, 3) > 100

func is_land(x: float, z: float, min_h: = 1.2) -> bool:
	var h: = height_at(x, z)
	if h < min_h: return false
	if Vector2(x - lake.x, z - lake.z).length() < 40.0 and h < LAKE_Y + 0.4: return false
	if h < SWAMP_Y + 0.25 and Vector2(x - swamp_center().x, z - swamp_center().z).length() < swamp_radius(): return false
	return true

func swamp_center() -> Vector3:
	return REGIONS.marais.pos

func swamp_radius() -> float:
	return REGIONS.marais.r * 0.74

func snap(p: Vector3, up: = 0.0) -> Vector3:
	return Vector3(p.x, height_at(p.x, p.z) + up, p.z)


func build() -> void :
	load_grid()
	for i in camps.size(): camps[i].pos = snap(camps[i].pos)
	for i in seals.size(): seals[i] = snap(seals[i])
	for i in statues.size(): statues[i] = snap(statues[i])
	for w in waypoints: w.pos = snap(w.pos)
	village = snap(village);mountain = snap(mountain);plateau = snap(plateau);lake = Vector3(lake.x, LAKE_Y, lake.z)
	lighthouse = snap(lighthouse);orchard = snap(orchard);cat_spot = snap(cat_spot)
	summit = snap(mountain)
	for dm in domains: dm.pos = snap(dm.pos)
	for k in boss_spots: boss_spots[k] = snap(boss_spots[k])
	volcano = snap(volcano)
	statue_pos = statues[0]
	spawn_pos = snap(village + Vector3(-6, 0, 12), 0.6)
	_environment()
	_terrain()
	_sea()
	_load_props()
	solid = StaticBody3D.new();solid.name = "PropColliders";add_child(solid)
	canopies = StaticBody3D.new();canopies.name = "Canopies";add_child(canopies)
	canopies.collision_layer = 1 << 7;canopies.collision_mask = 0
	_village()
	_dock()
	_lighthouse_site()
	_ruins()
	_summit_arena()
	_statues()
	_camp_decor()
	_lava()
	_region_sites()
	_scatter()
	_sky_islands()
	_night_blooms()
	_pick_spots()
	_flush_multimeshes()

func _environment() -> void :
	env = Environment.new()
	env.background_mode = Environment.BG_SKY
	var sky: = Sky.new()
	sky_mat = ShaderMaterial.new();sky_mat.shader = load("res://shaders/sky.gdshader")
	sky.sky_material = sky_mat
	env.sky = sky
	env.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
	env.ambient_light_color = Color(0.62, 0.7, 0.88)
	env.ambient_light_energy = 0.5
	env.reflected_light_source = Environment.REFLECTION_SOURCE_DISABLED
	env.tonemap_mode = Environment.TONE_MAPPER_LINEAR
	env.tonemap_exposure = 1.0

	env.glow_enabled = true
	env.glow_intensity = 0.55
	env.glow_strength = 1.0
	env.glow_bloom = 0.04
	env.glow_hdr_threshold = 0.92
	env.glow_blend_mode = Environment.GLOW_BLEND_MODE_SOFTLIGHT
	env.adjustment_enabled = true
	env.adjustment_saturation = 1.06
	env.adjustment_contrast = 1.04

	env.fog_enabled = true
	env.fog_light_color = Color(0.72, 0.86, 1.0)
	env.fog_density = 0.0028
	env.fog_sky_affect = 0.0
	var we: = WorldEnvironment.new();we.environment = env
	add_child(we)
	sun = DirectionalLight3D.new()
	sun.light_color = Color(1.0, 0.97, 0.9)
	sun.light_energy = 0.9
	sun.shadow_enabled = true
	sun.directional_shadow_mode = DirectionalLight3D.SHADOW_ORTHOGONAL
	sun.directional_shadow_max_distance = 40.0
	sun.shadow_bias = 0.08
	sun.shadow_blur = 1.5
	sun.shadow_opacity = 0.72
	add_child(sun)
	sun.rotation = Vector3(deg_to_rad(-52), deg_to_rad(-35), 0)


const TERRAIN_LODS: = [[1, 180.0], [2, 420.0], [4, 0.0]]

func _terrain() -> void :
	var mat: = ShaderMaterial.new();mat.shader = load("res://shaders/terrain.gdshader")
	var per: = (N - 1) / CHUNKS
	for cj in CHUNKS:
		for ci in CHUNKS:
			var i0: = ci * per; var j0: = cj * per
			var any_land: = false
			for j in range(j0, j0 + per + 1):
				for i in range(i0, i0 + per + 1):
					if hmap[j * N + i] > -4.5: any_land = true;break
				if any_land: break
			if not any_land: continue



			var centre: = Vector3( - HALF + (i0 + per * 0.5) * STEP, 0.0, - HALF + (j0 + per * 0.5) * STEP)
			var begin: = 0.0
			for li in TERRAIN_LODS.size():
				var lod: Array = TERRAIN_LODS[li]
				var mi: = MeshInstance3D.new();mi.name = "Terrain_%d_%d_%d" % [ci, cj, li]
				mi.mesh = _chunk_mesh(i0, j0, per, int(lod[0]), centre, mat)
				mi.position = centre
				var end: float = lod[1]
				mi.visibility_range_begin = begin;mi.visibility_range_end = end
				mi.visibility_range_begin_margin = 10.0;mi.visibility_range_end_margin = 10.0
				mi.set_meta("vr", Vector2(begin, end))
				if li > 0: mi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
				add_child(mi)
				begin = end

	var body: = StaticBody3D.new();body.name = "TerrainBody"
	var shape: = HeightMapShape3D.new()
	shape.map_width = N;shape.map_depth = N
	var scaled: = hmap.duplicate()
	for k in scaled.size(): scaled[k] = scaled[k] / STEP
	shape.map_data = scaled
	var cs: = CollisionShape3D.new();cs.shape = shape
	cs.scale = Vector3(STEP, STEP, STEP)
	body.add_child(cs);add_child(body)

	var bytes: = PackedByteArray();bytes.resize(N * N)
	for k in N * N:
		bytes[k] = int(clampf((hmap[k] + 8.0) / 24.0, 0.0, 1.0) * 255.0)
	var img: = Image.create_from_data(N, N, false, Image.FORMAT_R8, bytes)
	height_tex = ImageTexture.create_from_image(img)

func _chunk_mesh(i0: int, j0: int, per: int, s: int, centre: Vector3, mat: Material) -> ArrayMesh:
	var idx: = PackedInt32Array()
	var w: = per / s + 1
	var pts: Array[Vector3i] = []
	for j in w:
		for i in w:
			pts.append(Vector3i(i0 + i * s, j0 + j * s, 0))
	for j in w - 1:
		for i in w - 1:
			var a: = j * w + i
			idx.append_array([a, a + 1, a + w, a + 1, a + w + 1, a + w])

	var edges: = [[0, 0, 1, 0], [0, w - 1, 1, 0], [0, 0, 0, 1], [w - 1, 0, 0, 1]]
	for e in edges:
		var base: = pts.size()
		for k in w:
			var gi: int = e[0] + e[2] * k; var gj: int = e[1] + e[3] * k
			pts.append(Vector3i(i0 + gi * s, j0 + gj * s, 1))
		for k in w - 1:
			var gi: int = e[0] + e[2] * k; var gj: int = e[1] + e[3] * k
			var t0: int = gj * w + gi
			var t1: int = (gj + e[3]) * w + gi + e[2]
			idx.append_array([t0, t1, base + k, t1, base + k + 1, base + k])
	var verts: = PackedVector3Array(); var norms: = PackedVector3Array()
	var cols: = PackedColorArray(); var uvs: = PackedVector2Array(); var uv2s: = PackedVector2Array()
	verts.resize(pts.size());norms.resize(pts.size());cols.resize(pts.size());uvs.resize(pts.size());uv2s.resize(pts.size())
	for k in pts.size():
		var p: = pts[k]
		var g: = p.y * N + p.x
		verts[k] = Vector3( - HALF + p.x * STEP, hmap[g] - 4.0 * p.z, - HALF + p.y * STEP) - centre
		norms[k] = _grid_normal(p.x, p.y)
		cols[k] = Color.from_rgba8(cmap[g * 4], cmap[g * 4 + 1], cmap[g * 4 + 2], amap[g * 4 + 3])
		uvs[k] = Vector2(cmap[g * 4 + 3] / 255.0, amap[g * 4] / 255.0)
		var b: = amap[g * 4 + 2]
		uv2s[k] = Vector2(1.0 if b == 5 else 0.0, 1.0 if b == 7 else 0.0)
	var arr: = [];arr.resize(Mesh.ARRAY_MAX)
	arr[Mesh.ARRAY_VERTEX] = verts;arr[Mesh.ARRAY_NORMAL] = norms;arr[Mesh.ARRAY_COLOR] = cols
	arr[Mesh.ARRAY_TEX_UV] = uvs;arr[Mesh.ARRAY_TEX_UV2] = uv2s;arr[Mesh.ARRAY_INDEX] = idx
	var am: = ArrayMesh.new();am.add_surface_from_arrays(Mesh.PRIMITIVE_TRIANGLES, arr)
	am.surface_set_material(0, mat)
	return am

func _sea() -> void :
	var pm: = PlaneMesh.new();pm.size = Vector2(2600, 2600);pm.subdivide_width = 130;pm.subdivide_depth = 130
	water_mat = ShaderMaterial.new();water_mat.shader = load("res://shaders/water.gdshader")
	water_mat.set_shader_parameter("height_tex", height_tex)
	water_mat.set_shader_parameter("map_rect", Vector3( - HALF, - HALF, SIZE))
	water_mat.set_shader_parameter("water_level", SEA_Y)
	var mi: = MeshInstance3D.new();mi.mesh = pm;mi.material_override = water_mat;mi.name = "Sea"
	mi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	mi.position = Vector3(0, SEA_Y, 0)
	add_child(mi)

	var lm: = PlaneMesh.new();lm.size = Vector2(84, 84);lm.subdivide_width = 16;lm.subdivide_depth = 16
	lake_mat = water_mat.duplicate()
	lake_mat.set_shader_parameter("water_level", LAKE_Y)
	lake_mat.set_shader_parameter("wave_height", 0.04)
	lake_mat.set_shader_parameter("deep_color", Color(0.08, 0.36, 0.52))
	lake_mat.set_shader_parameter("shallow_color", Color(0.26, 0.7, 0.72))
	var li: = MeshInstance3D.new();li.mesh = lm;li.material_override = lake_mat;li.name = "Lake"
	li.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	li.position = Vector3(lake.x, LAKE_Y, lake.z)
	add_child(li)

	var sr: = swamp_radius()
	var sm: = disc_mesh(sr, 14, 48)
	swamp_mat = water_mat.duplicate()
	swamp_mat.set_shader_parameter("water_level", SWAMP_Y)
	swamp_mat.set_shader_parameter("wave_height", 0.02)
	swamp_mat.set_shader_parameter("deep_color", Color(0.06, 0.2, 0.15))
	swamp_mat.set_shader_parameter("shallow_color", Color(0.16, 0.32, 0.22))
	swamp_mat.set_shader_parameter("foam_k", 0.12)
	swamp_mat.set_shader_parameter("sky_col", Color(0.45, 0.58, 0.55))
	var si: = MeshInstance3D.new();si.mesh = sm;si.material_override = swamp_mat;si.name = "Swamp"
	si.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	si.position = Vector3(swamp_center().x, SWAMP_Y, swamp_center().z)
	add_child(si)


static func disc_mesh(radius: float, rings: int, segs: int) -> ArrayMesh:
	var st: = SurfaceTool.new()
	st.begin(Mesh.PRIMITIVE_TRIANGLES)
	for ri in rings:
		var r0: = radius * ri / rings; var r1: = radius * (ri + 1) / rings
		for k in segs:
			var a0: = TAU * k / segs; var a1: = TAU * (k + 1) / segs
			var p: = [Vector3(cos(a0) * r0, 0, sin(a0) * r0), Vector3(cos(a1) * r0, 0, sin(a1) * r0), 
				Vector3(cos(a1) * r1, 0, sin(a1) * r1), Vector3(cos(a0) * r1, 0, sin(a0) * r1)]
			for idx in ([0, 2, 1, 0, 3, 2] if ri > 0 else [0, 3, 2]):
				var v: Vector3 = p[idx]
				st.set_normal(Vector3.UP);st.set_uv(Vector2(v.x, v.z) / (radius * 2.0) + Vector2(0.5, 0.5));st.add_vertex(v)
	return st.commit()


const TINTED: = ["tint_leaves", "tint_needles", "tint_grass", "tint_bush", "tint_petal", "tint_moss", "tint_rock", "tint_cap", 
	"tint_roof", "tint_cloth", "tint_wpcrystal", "tint_seal", "tint_orb"]
const SWAYING: = {"tint_leaves": [0.12, 4.0], "tint_needles": [0.08, 5.0], "tint_grass": [0.07, 0.45], "tint_bush": [0.03, 1.0], 
	"tint_petal": [0.03, 0.3], "leaf": [0.1, 5.0], "leaf2": [0.1, 5.0]}

func _load_props() -> void :
	var scene: Node3D = load("res://assets/props.glb").instantiate()

	# props_genshin.glb (généré par blender/build_props.py) remplace les décors du même nom
	for extra in ["res://assets/chest.glb", "res://assets/props_v6.glb", "res://assets/props_genshin.glb"]:
		var extra_scene: Node3D = load(extra).instantiate()
		for c in extra_scene.get_children():
			var old: = scene.get_node_or_null(NodePath(c.name))
			if old: scene.remove_child(old);old.free()
			c.owner = null;extra_scene.remove_child(c);scene.add_child(c)
		extra_scene.free()
	var fol_shader: Shader = load("res://shaders/foliage.gdshader")
	for c in scene.get_children():
		if not (c is MeshInstance3D): continue
		var m: Mesh = c.mesh.duplicate()
		for s in m.get_surface_count():
			var src: Material = m.surface_get_material(s)
			var mname: = src.resource_name if src else ""
			var mat: Material
			if SWAYING.has(mname) and mname.begins_with("tint"):
				var sm: = ShaderMaterial.new();sm.shader = fol_shader
				sm.set_shader_parameter("sway", SWAYING[mname][0]);sm.set_shader_parameter("sway_height", SWAYING[mname][1])
				if src is BaseMaterial3D and (src as BaseMaterial3D).albedo_texture:
					sm.set_shader_parameter("leaf_tex", (src as BaseMaterial3D).albedo_texture)
					sm.set_shader_parameter("use_leaf_tex", true)
				if mname in ["tint_leaves", "tint_needles", "tint_bush"]:
					if mname != "tint_bush": sm.set_shader_parameter("near_fade", 1.0)

					var verts: PackedVector3Array = m.surface_get_arrays(s)[Mesh.ARRAY_VERTEX]
					var bb: = AABB(verts[0], Vector3.ZERO)
					for v in verts: bb = bb.expand(v)
					var ctr: = bb.get_center()
					if mname == "tint_needles": ctr.y = bb.position.y + bb.size.y * 0.35
					sm.set_shader_parameter("crown_center", ctr)
					sm.set_shader_parameter("crown_radius", maxf(bb.size.x, bb.size.z) * 0.5)
					sm.set_shader_parameter("crown_y", Vector2(bb.position.y, bb.end.y))
				mat = sm
			else:
				var tm: = Toon.from_material(src)
				if mname in TINTED:
					tm.vertex_color_use_as_albedo = true
				if mname == "window_lit": window_mat = tm
				if mname == "lamp" or mname == "lh_lamp" or mname == "fire": lamp_mats.append(tm)
				mat = tm
			m.surface_set_material(s, mat)
		prop_meshes[c.name] = m
	scene.free()


func make_prop(mesh_name: String, tint: = Color(-1, 0, 0)) -> MeshInstance3D:
	var mi: = MeshInstance3D.new();mi.mesh = prop_meshes.get(mesh_name)
	if tint.r >= 0.0 and mi.mesh:
		for s in mi.mesh.get_surface_count():
			var m: Material = mi.mesh.surface_get_material(s)
			if m is StandardMaterial3D and (m as StandardMaterial3D).vertex_color_use_as_albedo:
				var d: StandardMaterial3D = m.duplicate();d.vertex_color_use_as_albedo = false
				d.albedo_color = tint * 0.9
				mi.set_surface_override_material(s, d)
			elif m is ShaderMaterial:
				var d2: ShaderMaterial = m.duplicate();d2.set_shader_parameter("base_tint", tint)
				mi.set_surface_override_material(s, d2)
	return mi

func place(mesh_name: String, pos: Vector3, yaw: = 0.0, sc: = 1.0, tint: = Color(-1, 0, 0), parent: Node = null) -> MeshInstance3D:
	var mi: = make_prop(mesh_name, tint)
	(parent if parent else self).add_child(mi)
	mi.position = pos;mi.rotation.y = yaw;mi.scale = Vector3.ONE * sc
	return mi


func decor(mesh_name: String, pos: Vector3, yaw: = 0.0, sc: = 1.0, tint: = Color.WHITE, far: = false) -> void :
	mm_add(mesh_name, Transform3D(Basis(Vector3.UP, yaw).scaled(Vector3.ONE * sc), pos), tint, false, far)

func box_collider(center: Vector3, size: Vector3, yaw: = 0.0) -> void :
	var cs: = CollisionShape3D.new(); var bs: = BoxShape3D.new();bs.size = size
	cs.shape = bs;cs.position = center;cs.rotation.y = yaw;solid.add_child(cs)

func cyl_collider(base: Vector3, radius: float, height: float) -> void :
	var cs: = CollisionShape3D.new(); var cy: = CylinderShape3D.new();cy.radius = radius;cy.height = height
	cs.shape = cy;cs.position = base + Vector3(0, height * 0.5, 0);solid.add_child(cs)


func mm_add(mesh_name: String, xf: Transform3D, col: = Color.WHITE, small: = false, far: = false) -> void :
	var cs: = 40.0 if small else 100.0
	var key: = "%s|%d|%d" % [mesh_name, int(floor(xf.origin.x / cs)), int(floor(xf.origin.z / cs))]
	if far: key = mesh_name + "|far"
	if not _mm.has(key):
		_mm[key] = {"mesh": mesh_name, "xf": [], "col": [], "small": small, "far": far}
	_mm[key].xf.append(xf);_mm[key].col.append(col.srgb_to_linear())

const NEAR_LOD: = ["TreeRound", "TreeRound2", "TreeApple", "TreePine"]
const FAR_LOD: = ["TreeRoundFar", "TreePineFar"]
const NO_SHADOW: = ["Rock", "RockMoss", "Bush", "Flower", "Fence", "Barrel", "Crate", "RuinFloor", "Dock", "Boat", "Torch", "Lantern", "IceSpike", 
	"LilyPad", "Obsidian", "Bones", "Vent", "Mushrooms", "Reeds"]

func _flush_multimeshes() -> void :
	for key in _mm:
		var e: Dictionary = _mm[key]
		if not prop_meshes.has(e.mesh): continue
		var mm: = MultiMesh.new()
		mm.transform_format = MultiMesh.TRANSFORM_3D
		mm.use_colors = true
		mm.mesh = prop_meshes[e.mesh]
		mm.instance_count = e.xf.size()
		for i in e.xf.size():
			mm.set_instance_transform(i, e.xf[i]);mm.set_instance_color(i, e.col[i])
		var mmi: = MultiMeshInstance3D.new();mmi.multimesh = mm;mmi.name = key.replace("|", "_")
		if e.small:
			mmi.visibility_range_end = 60.0;mmi.visibility_range_end_margin = 6.0
			mmi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
		elif e.mesh in NEAR_LOD:
			mmi.visibility_range_end = 95.0;mmi.visibility_range_end_margin = 8.0
		elif e.mesh in FAR_LOD:
			mmi.visibility_range_begin = 92.0;mmi.visibility_range_begin_margin = 8.0
			mmi.visibility_range_end = 250.0;mmi.visibility_range_end_margin = 25.0
			mmi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
		elif not e.far:
			mmi.visibility_range_end = 240.0;mmi.visibility_range_end_margin = 20.0
		if e.mesh in NO_SHADOW:
			mmi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
		add_child(mmi)
	_mm.clear()

func _near_poi(p: Vector3, extra: = 0.0) -> bool:
	if Vector2(p.x - village.x, p.z - village.z).length() < 44.0 + extra: return true
	for c in camps:
		if Vector2(p.x - c.pos.x, p.z - c.pos.z).length() < 13.0 + extra: return true
	for s in seals:
		if Vector2(p.x - s.x, p.z - s.z).length() < 11.0 + extra: return true
	for s in statues:
		if Vector2(p.x - s.x, p.z - s.z).length() < 8.0 + extra: return true
	for w in waypoints:
		if Vector2(p.x - w.pos.x, p.z - w.pos.z).length() < 5.0 + extra: return true
	if Vector2(p.x - mountain.x, p.z - mountain.z).length() < 22.0 + extra: return true
	if Vector2(p.x - lighthouse.x, p.z - lighthouse.z).length() < 12.0 + extra: return true
	if Vector2(p.x - orchard.x, p.z - orchard.z).length() < 16.0 + extra: return true
	if Vector2(p.x - plateau.x, p.z - plateau.z).length() < 20.0 + extra: return true
	for dm in domains:
		if Vector2(p.x - dm.pos.x, p.z - dm.pos.z).length() < 12.0 + extra: return true
	for k in boss_spots:
		var b: Vector3 = boss_spots[k]
		if Vector2(p.x - b.x, p.z - b.z).length() < 27.0 + extra: return true
	if Vector2(p.x - volcano.x, p.z - volcano.z).length() < 34.0 + extra: return true
	return false

func _rand_land(min_h: = 1.6, max_h: = 60.0, max_slope: = 0.75) -> Vector3:
	for i in 40:
		var a: = rng.randf() * TAU; var r: = sqrt(rng.randf()) * 500.0
		var p: = Vector3(cos(a) * r, 0, sin(a) * r)
		p.y = height_at(p.x, p.z)
		if p.y < min_h or p.y > max_h: continue
		if not is_land(p.x, p.z, min_h): continue
		if normal_at(p.x, p.z).y < max_slope: continue
		return p
	return Vector3.INF

const FOLIAGE: = {
	"prairie": [Color(0.3, 0.62, 0.24), Color(0.4, 0.7, 0.28), Color(0.26, 0.55, 0.22)], 
	"automne": [Color(0.95, 0.52, 0.16), Color(0.86, 0.28, 0.14), Color(0.98, 0.76, 0.22), Color(0.8, 0.44, 0.12)], 
	"cerisiers": [Color(0.98, 0.7, 0.8), Color(0.95, 0.58, 0.72), Color(1.0, 0.86, 0.9)], 
	"plateau": [Color(0.22, 0.56, 0.52), Color(0.3, 0.62, 0.66), Color(0.4, 0.66, 0.5)], 
	"pic": [Color(0.2, 0.42, 0.34), Color(0.84, 0.9, 0.94)], 
	"marais": [Color(0.2, 0.42, 0.26), Color(0.28, 0.5, 0.3), Color(0.34, 0.46, 0.2)], 
	"braise": [Color(0.42, 0.3, 0.2), Color(0.55, 0.36, 0.18)], 
	"orage": [Color(0.3, 0.4, 0.52), Color(0.42, 0.36, 0.56), Color(0.26, 0.46, 0.5)], 
}
const FLOWERS: = {
	"prairie": [Color(1.0, 0.95, 0.9), Color(1.0, 0.85, 0.25), Color(0.55, 0.65, 1.0)], 
	"automne": [Color(1.0, 0.45, 0.2), Color(0.95, 0.25, 0.25), Color(1.0, 0.8, 0.3)], 
	"cerisiers": [Color(1.0, 0.55, 0.75), Color(1.0, 0.8, 0.9), Color(0.9, 0.45, 0.85)], 
	"plateau": [Color(0.45, 0.6, 1.0), Color(0.7, 0.5, 1.0), Color(0.5, 0.95, 1.0)], 
	"pic": [Color(0.8, 0.9, 1.0)], 
	"marais": [Color(0.95, 0.9, 0.45), Color(0.75, 0.55, 1.0), Color(1.0, 1.0, 0.95)], 
	"braise": [Color(1.0, 0.55, 0.15), Color(0.95, 0.3, 0.12)], 
	"orage": [Color(0.6, 0.5, 1.0), Color(0.45, 0.8, 1.0), Color(0.95, 0.9, 1.0)], 
}

func _grass_tint(p: Vector3) -> Color:
	var i: = clampi(int(round((p.x + HALF) / STEP)), 0, N - 1)
	var j: = clampi(int(round((p.z + HALF) / STEP)), 0, N - 1)
	var g: = (j * N + i) * 4
	return Color.from_rgba8(cmap[g], cmap[g + 1], cmap[g + 2]).lightened(0.12)

func _scatter() -> void :

	var n: = 0; var tries: = 0
	while n < 150 and tries < 6000:
		tries += 1
		var a: = rng.randf() * TAU; var r: = R * rng.randf_range(0.78, 1.02)
		var p: = Vector3(cos(a) * r, 0, sin(a) * r);p.y = height_at(p.x, p.z)
		if p.y < 1.0 or p.y > 4.0 or _near_poi(p) or not is_land(p.x, p.z, 1.0): continue
		var s: = rng.randf_range(0.85, 1.3)
		mm_add("Palm", Transform3D(Basis(Vector3.UP, rng.randf() * TAU).scaled(Vector3.ONE * s), p - Vector3(0, 0.2, 0)))
		cyl_collider(p, 0.3 * s, 3.0)
		n += 1

	n = 0;tries = 0
	while n < 1500 and tries < 30000:
		tries += 1
		var p: = _rand_land(1.9, 46.0, 0.72)
		if p == Vector3.INF or _near_poi(p) or on_path(p.x, p.z): continue
		var b: = biome_at(p.x, p.z)
		if b != "marais" and p.y < 3.2: continue
		if lava_at(p): continue
		var dens: = {"prairie": 0.35, "automne": 1.0, "cerisiers": 0.75, "plateau": 0.3, "pic": 0.7, "marais": 0.85, 
			"braise": 0.3, "orage": 0.4}[b] as float
		if Vector2(p.x, p.z).length() > R * 0.86 and b in BIOMES: dens *= 0.3
		if rng.randf() > dens: continue
		var cols: Array = FOLIAGE[b]
		var col: Color = cols[rng.randi() % cols.size()]
		var mesh: = "TreeRound" if rng.randf() < 0.6 else "TreeRound2"
		if b == "pic" or (b == "plateau" and rng.randf() < 0.5) or b == "orage":
			mesh = "TreePine"
			if b == "pic": col = cols[0] if p.y < 36.0 else cols[1]
		elif b == "marais":
			mesh = "Mangrove"
		elif b == "braise":
			mesh = "DeadTree"
		var s: = rng.randf_range(0.85, 1.35)
		var txf: = Transform3D(Basis(Vector3.UP, rng.randf() * TAU).scaled(Vector3.ONE * s), p - Vector3(0, 0.15, 0))
		mm_add(mesh, txf, col)
		if mesh in ["TreePine", "TreeRound", "TreeRound2", "Mangrove"]:
			mm_add("TreePineFar" if mesh == "TreePine" else "TreeRoundFar", txf, col)
		cyl_collider(p, 0.35 * s, 3.0)
		if mesh != "DeadTree":
			var crown: = CollisionShape3D.new(); var cs2: = SphereShape3D.new()
			cs2.radius = (1.7 if mesh == "TreePine" else 2.1) * s
			crown.shape = cs2;crown.position = p + Vector3(0, (3.4 if mesh == "TreePine" else 4.2) * s, 0)
			canopies.add_child(crown)
		n += 1

	for k in 320:
		var p: = _rand_land(1.9, 60.0, 0.55)
		if p == Vector3.INF or _near_poi(p, -4.0) or on_path(p.x, p.z) or lava_at(p): continue
		var s: = rng.randf_range(0.5, 2.0)
		var b: = biome_at(p.x, p.z)
		var rc: = {"prairie": Color(0.62, 0.6, 0.58), "automne": Color(0.66, 0.56, 0.48), "cerisiers": Color(0.7, 0.64, 0.66), 
			"plateau": Color(0.56, 0.62, 0.7), "pic": Color(0.6, 0.62, 0.66), "marais": Color(0.46, 0.5, 0.42), 
			"braise": Color(0.3, 0.26, 0.26), "orage": Color(0.5, 0.48, 0.58)}[b] as Color
		var xf: = Transform3D(Basis.from_euler(Vector3(rng.randf() * 0.3, rng.randf() * TAU, rng.randf() * 0.3)).scaled(Vector3(s, s * rng.randf_range(0.7, 1.2), s)), p - Vector3(0, 0.15 * s, 0))
		if rng.randf() < 0.45 and b != "pic" and b != "braise":
			mm_add("RockMoss", xf, _grass_tint(p).darkened(0.1))
		else:
			mm_add("Rock", xf, rc)
		if s > 1.0:
			var cs: = CollisionShape3D.new(); var sp: = SphereShape3D.new();sp.radius = 0.75 * s
			cs.shape = sp;cs.position = p + Vector3(0, 0.1 * s, 0);solid.add_child(cs)

	for k in 760:
		var p: = _rand_land(2.2, 40.0, 0.7)
		if p == Vector3.INF or _near_poi(p, -6.0) or on_path(p.x, p.z): continue
		var b: = biome_at(p.x, p.z)
		if b == "braise" and rng.randf() < 0.75: continue
		var cols: Array = FOLIAGE[b]
		var s: = rng.randf_range(0.6, 1.3)
		mm_add("Bush", Transform3D(Basis(Vector3.UP, rng.randf() * TAU).scaled(Vector3.ONE * s), p), (cols[rng.randi() % cols.size()] as Color).darkened(0.08), true)

	for k in 160:
		var p: = _rand_land(3.0, 30.0, 0.8)
		if p == Vector3.INF or biome_at(p.x, p.z) != "automne" or _near_poi(p, -6.0): continue
		mm_add("Mushrooms", Transform3D(Basis(Vector3.UP, rng.randf() * TAU).scaled(Vector3.ONE * rng.randf_range(0.8, 1.6)), p), 
			[Color(0.9, 0.2, 0.15), Color(0.95, 0.6, 0.2), Color(0.85, 0.75, 0.6)][rng.randi() % 3], true)
	for k in 90:
		var a: = rng.randf() * TAU; var r: = rng.randf_range(28.0, 40.0)
		var p: = lake + Vector3(cos(a) * r, 0, sin(a) * r);p.y = height_at(p.x, p.z)
		if p.y < LAKE_Y - 0.4 or p.y > LAKE_Y + 1.2: continue
		mm_add("Reeds", Transform3D(Basis(Vector3.UP, rng.randf() * TAU).scaled(Vector3.ONE * rng.randf_range(0.8, 1.3)), p), Color.WHITE, true)
	for k in 70:
		var p: = _rand_land(34.0, 70.0, 0.5)
		if p == Vector3.INF or Vector2(p.x - mountain.x, p.z - mountain.z).length() < 16.0 or biome_at(p.x, p.z) != "pic": continue
		mm_add("IceSpike", Transform3D(Basis.from_euler(Vector3(rng.randf_range(-0.2, 0.2), rng.randf() * TAU, rng.randf_range(-0.2, 0.2))).scaled(Vector3.ONE * rng.randf_range(0.6, 1.6)), p - Vector3(0, 0.3, 0)))

	for k in 30000:
		var a: = rng.randf() * TAU; var r: = sqrt(rng.randf()) * 500.0
		var p: = Vector3(cos(a) * r, 0, sin(a) * r)
		var g: = _grass_amount(p.x, p.z)
		if g < 0.55: continue
		p.y = height_at(p.x, p.z)
		if p.y < 2.0 or not is_land(p.x, p.z, 2.0): continue
		mm_add("GrassTuft", Transform3D(Basis(Vector3.UP, rng.randf() * TAU).scaled(Vector3.ONE * rng.randf_range(0.8, 1.5)), p), _grass_tint(p), true)
	for k in 9000:
		var a: = rng.randf() * TAU; var r: = sqrt(rng.randf()) * 500.0
		var p: = Vector3(cos(a) * r, 0, sin(a) * r)
		if _grass_amount(p.x, p.z) < 0.6: continue
		p.y = height_at(p.x, p.z)
		if p.y < 2.2 or not is_land(p.x, p.z, 2.2): continue
		var b: = biome_at(p.x, p.z)
		var fc: Array = FLOWERS[b]
		mm_add("Flower", Transform3D(Basis(Vector3.UP, rng.randf() * TAU).scaled(Vector3.ONE * rng.randf_range(0.8, 1.3)), p), fc[rng.randi() % fc.size()], true)

func _grass_amount(x: float, z: float) -> float:
	var i: = clampi(int(round((x + HALF) / STEP)), 0, N - 1)
	var j: = clampi(int(round((z + HALF) / STEP)), 0, N - 1)
	return cmap[(j * N + i) * 4 + 3] / 255.0


const ROOFS: = [Color(0.8, 0.3, 0.22), Color(0.25, 0.45, 0.78), Color(0.92, 0.55, 0.22), Color(0.22, 0.6, 0.55), Color(0.55, 0.35, 0.7)]

func _village() -> void :
	var v: = village

	var angles: = [-2.6, -2.0, -1.2, -0.55, 0.35, 1.0, 2.2, 2.85]
	for k in angles.size():
		var a: float = angles[k]
		var r: = 22.0 + (k % 2) * 4.0
		var p: = snap(v + Vector3(cos(a) * r, 0, sin(a) * r), -0.1)
		var yaw: = atan2(v.x - p.x, v.z - p.z)
		var roof: Color = ROOFS[k % ROOFS.size()]
		decor("House", p, yaw, 1.0, roof)
		box_collider(p + Vector3(0, 2.4, 0), Vector3(5.4, 4.8, 4.6), yaw)

		var side: = Vector3(cos(yaw), 0, - sin(yaw))
		var fwd: = Vector3(sin(yaw), 0, cos(yaw))
		var lp: = snap(p + fwd * 3.2 + side * 1.9)
		decor("Lantern", lp, yaw)
		if k % 2 == 0: _lantern_light(lp + Vector3(0.42 * cos(yaw), 2.05, -0.42 * sin(yaw)))
		if k % 3 == 0: decor("Barrel", snap(p + fwd * 2.8 - side * 2.4), rng.randf() * TAU)
		if k % 3 == 1: decor("Crate", snap(p + fwd * 2.6 - side * 2.6), rng.randf() * TAU, 0.9)
	decor("Well", snap(v + Vector3(3, 0, -2)), 0.4, 1.0, Color(0.55, 0.35, 0.25))
	cyl_collider(snap(v + Vector3(3, 0, -2)), 1.05, 2.0)
	for k in 3:
		var sp: = snap(v + Vector3(-10 + k * 6.5, 0, -10))
		decor("Stall", sp, PI, 1.0, [Color(0.9, 0.3, 0.3), Color(0.95, 0.85, 0.35), Color(0.3, 0.55, 0.9)][k])
		box_collider(sp + Vector3(0, 0.5, 0), Vector3(2.7, 1.0, 1.3))

	for k in 6:
		var a: = TAU * k / 6.0 + 0.3
		var lp: = snap(v + Vector3(cos(a), 0, sin(a)) * 12.5)
		decor("Lantern", lp, - a)
		if k % 2 == 0: _lantern_light(lp + Vector3(0, 2.1, 0))

	var wp: = snap(v + Vector3(-34, 0, 4), -0.3)
	decor("WindmillBase", wp, PI * 0.5, 1.0, Color(0.7, 0.28, 0.22), true)
	cyl_collider(wp, 2.0, 8.0)
	windmill_blades = Node3D.new();add_child(windmill_blades)
	windmill_blades.position = wp + Vector3(2.3, 6.2, 0);windmill_blades.rotation.y = PI * 0.5
	var bl: = make_prop("WindmillBlades");windmill_blades.add_child(bl)

	for k in 6:
		var a: = TAU * k / 6.0
		var tp: = snap(orchard + Vector3(cos(a), 0, sin(a)) * 7.0, -0.1)
		mm_add("TreeApple", Transform3D(Basis(Vector3.UP, rng.randf() * TAU), tp), Color(0.32, 0.62, 0.26))
		mm_add("TreeRoundFar", Transform3D(Basis.IDENTITY, tp), Color(0.32, 0.62, 0.26))
		cyl_collider(tp, 0.35, 3.0)
	for k in 10:
		var a: = TAU * k / 10.0
		var fp: = snap(orchard + Vector3(cos(a), 0, sin(a)) * 14.0)
		decor("Fence", fp, - a + PI * 0.5)
	npc_spots = {
		"elder": snap(statue_pos + Vector3(3.5, 0, -3.0)), 
		"cook": snap(v + Vector3(-3.5, 0, -8.6)), 
		"guard": snap(v + Vector3(8, 0, 30)), 
		"child": snap(v + Vector3(6, 0, 1)), 
		"scholar": snap(v + Vector3(-12, 0, 6)), 
		"keeper": snap(lighthouse + Vector3(0, 0, 6)), 
		"guild": snap(v + Vector3(13.5, 0, -6.0)), 
	}

	decor("Banner", snap(v + Vector3(15.6, 0, -8.2)), -0.6, 1.0, Color(0.75, 0.25, 0.2))
	decor("Banner", snap(v + Vector3(11.2, 0, -8.6)), -0.6, 1.0, Color(0.95, 0.75, 0.3))
	decor("Crate", snap(v + Vector3(15.8, 0, -4.2)), 0.3)

func _lantern_light(p: Vector3) -> void :
	var l: = OmniLight3D.new();l.light_color = Color(1.0, 0.72, 0.4);l.light_energy = 0.0;l.omni_range = 7.0
	l.shadow_enabled = false;l.position = p;l.visible = false
	add_child(l);lanterns.append(l)

func _dock() -> void :

	var p: = village
	for k in 90:
		p.z -= 1.0
		if height_at(p.x, p.z) < 0.3: break
	dock_pos = Vector3(p.x, 0, p.z)
	decor("Dock", Vector3(p.x, -0.2, p.z + 1.0), 0.0)
	decor("Boat", Vector3(p.x + 3.0, SEA_Y - 0.05, p.z - 4.0), 0.3)

func _lighthouse_site() -> void :
	var p: = snap(lighthouse, -0.2)
	decor("Lighthouse", p, 0.8, 1.0, Color.WHITE, true)
	cyl_collider(p, 2.0, 16.0)
	light_house_lamp = OmniLight3D.new();light_house_lamp.light_color = Color(1.0, 0.85, 0.5);light_house_lamp.omni_range = 18.0
	light_house_lamp.light_energy = 0.0;light_house_lamp.position = p + Vector3(0, 14.2, 0);add_child(light_house_lamp)

func _ruins() -> void :
	var c: = plateau
	decor("RuinFloor", snap(c, -0.05), 0.2, 1.4)
	for k in 10:
		var a: = TAU * k / 10.0
		var p: = snap(c + Vector3(cos(a), 0, sin(a)) * 16.0, -0.1)
		var broken: = k % 3 != 0
		decor("PillarBroken" if broken else "Pillar", p, rng.randf() * TAU, 1.1)
		cyl_collider(p, 0.5, 4.0)
	for k in 2:
		var a: = PI * 0.5 + k * PI
		var p: = snap(c + Vector3(cos(a), 0, sin(a)) * 24.0, -0.1)
		decor("Arch", p, a + PI * 0.5, 1.1, Color.WHITE, true)
		var side: = Vector3( - sin(a), 0, cos(a))
		cyl_collider(p + side * 2.4, 0.5, 5.0);cyl_collider(p - side * 2.4, 0.5, 5.0)

	for k in 14:
		var a: = rng.randf() * TAU; var r: = rng.randf_range(24.0, 48.0)
		var p: = snap(c + Vector3(cos(a), 0, sin(a)) * r, -0.2)
		if p.y < 8.0 or _near_poi(p, -8.0): continue
		decor("PillarBroken", p, rng.randf() * TAU, rng.randf_range(0.7, 1.1))
	for k in 24:
		var a: = rng.randf() * TAU; var r: = rng.randf_range(10.0, 50.0)
		var p: = snap(c + Vector3(cos(a), 0, sin(a)) * r, -0.2)
		mm_add("IceSpike", Transform3D(Basis.from_euler(Vector3(0, rng.randf() * TAU, rng.randf_range(-0.2, 0.2))).scaled(Vector3.ONE * rng.randf_range(0.4, 0.9)), p))

func _summit_arena() -> void :
	for k in 12:
		var a: = TAU * k / 12.0
		var p: = snap(summit + Vector3(cos(a), 0, sin(a)) * 17.0, -0.2)
		decor("PillarBroken" if k % 2 == 0 else "Pillar", p, rng.randf() * TAU, 1.2, Color.WHITE, true)
		cyl_collider(p, 0.55, 4.5)

func _statues() -> void :
	for s in statues:
		decor("Statue", s, 0.0, 1.0, Color.WHITE, true)
		cyl_collider(s, 1.2, 2.0)
		var l: = OmniLight3D.new();l.light_color = Color(0.5, 0.8, 1.0);l.light_energy = 0.6;l.omni_range = 6
		add_child(l);l.position = s + Vector3(0, 3.2, 0)

func _camp_decor() -> void :
	for c in camps:
		var p: Vector3 = c.pos
		var theme: String = c.theme
		if "goblins" in theme:
			for k in 2:
				var a: = k * PI + 0.6
				var tp: = snap(p + Vector3(cos(a), 0, sin(a)) * 8.5, -0.1)
				decor("Tent", tp, a + PI)
				cyl_collider(tp, 1.6, 2.5)
			for k in 3:
				var a: = TAU * k / 3.0 + 1.2
				decor("Torch", snap(p + Vector3(cos(a), 0, sin(a)) * 6.0), 0)
			decor("Crate", snap(p + Vector3(2.5, 0, -6.5)), 0.4)
			decor("Barrel", snap(p + Vector3(-3.0, 0, -6.0)), 0.0)
		else:
			for s in 7:
				var a: = TAU * s / 7.0
				var rp: = snap(p + Vector3(cos(a), 0, sin(a)) * 9.0, -0.1)
				mm_add("Rock", Transform3D(Basis(Vector3.UP, a).scaled(Vector3.ONE * 0.6), rp), Color(0.62, 0.6, 0.58))


func _lava() -> void :
	var lava_shader: Shader = load("res://shaders/lava_flow.gdshader")
	lava_pool_mat = ShaderMaterial.new();lava_pool_mat.shader = lava_shader
	for lp in LAVA_POOLS:
		var c: = Vector3(lp[0], 0, lp[1])
		var y: = height_at(c.x, c.z) + 0.75
		var mi: = MeshInstance3D.new();mi.mesh = disc_mesh(float(lp[2]) * 1.15, 4, 28);mi.material_override = lava_pool_mat
		mi.position = Vector3(c.x, y, c.z);mi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
		mi.visibility_range_end = 260.0;mi.name = "LavaPool"
		add_child(mi)
		_glow_light(Vector3(c.x, y + 1.6, c.z), Color(1.0, 0.45, 0.15), 1.5, float(lp[2]) * 2.4)
		for k in 5:
			var a: = TAU * k / 5.0 + 0.4
			var q: = snap(c + Vector3(cos(a), 0, sin(a)) * float(lp[2]) * 1.45, -0.2)
			mm_add("Obsidian", Transform3D(Basis(Vector3.UP, a * 2.3).scaled(Vector3.ONE * (0.6 + 0.15 * (k % 3))), q))
	var stream_mat: = ShaderMaterial.new();stream_mat.shader = lava_shader
	stream_mat.set_shader_parameter("flow_speed", 0.9)
	for ang in LAVA_RIVERS:
		var dir: = Vector3(cos(ang), 0, sin(ang))
		var side: = Vector3( - dir.z, 0, dir.x)
		var pts: Array[Vector3] = []
		for k in 25:
			var p: = volcano + dir * (30.0 + k * 3.2) + side * sin(k * 0.45 + ang * 3.0) * 3.0
			p.y = height_at(p.x, p.z)
			pts.append(p)
		var st: = SurfaceTool.new();st.begin(Mesh.PRIMITIVE_TRIANGLES)
		var along: = 0.0
		for k in pts.size():
			if k > 0: along += pts[k].distance_to(pts[k - 1])
			var w: = lerpf(1.4, 2.8, k / float(pts.size() - 1))
			var td: = pts[mini(k + 1, pts.size() - 1)] - pts[maxi(k - 1, 0)];td.y = 0;td = td.normalized()
			var sd: = Vector3( - td.z, 0, td.x)
			for s in 2:
				var q: = pts[k] + sd * (float(s) - 0.5) * 2.0 * w
				q.y = height_at(q.x, q.z) + 0.1
				st.set_normal(Vector3.UP);st.set_uv(Vector2(float(s), along));st.add_vertex(q)
			if k > 0: lava_streams.append([pts[k - 1], pts[k], w * 0.8])
		for k in pts.size() - 1:
			var i: = k * 2
			for idx in [i, i + 1, i + 2, i + 1, i + 3, i + 2]: st.add_index(idx)
		var rv: = MeshInstance3D.new();rv.mesh = st.commit();rv.material_override = stream_mat;rv.name = "LavaStream"
		rv.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
		add_child(rv)
		_glow_light(pts[8] + Vector3(0, 2.0, 0), Color(1.0, 0.45, 0.15), 1.2, 9.0)
		_glow_light(pts[20] + Vector3(0, 2.0, 0), Color(1.0, 0.45, 0.15), 1.2, 9.0)

func _glow_light(p: Vector3, col: Color, energy: float, rng_m: float) -> void :
	var l: = OmniLight3D.new();l.light_color = col;l.light_energy = energy;l.omni_range = rng_m
	l.shadow_enabled = false;l.position = p
	l.distance_fade_enabled = true;l.distance_fade_begin = 100.0;l.distance_fade_length = 20.0
	add_child(l)


func _region_sites() -> void :
	var r3: = RandomNumberGenerator.new();r3.seed = 606
	var portal_shader: Shader = load("res://shaders/portal.gdshader")
	var tints: = {"masques": Color(1.0, 0.62, 0.3), "forge": Color(1.0, 0.36, 0.12), "celeste": Color(0.55, 0.75, 1.0)}
	for dm in domains:
		var p: Vector3 = dm.pos
		var to: = - p;to.y = 0
		var yaw: = atan2(to.x, to.z)
		decor("PortalGate", p, yaw, 1.0, Color.WHITE, true)
		var side: = Vector3(cos(yaw), 0, - sin(yaw))
		cyl_collider(p + side * 2.3, 0.6, 5.5);cyl_collider(p - side * 2.3, 0.6, 5.5)
		var disc: = MeshInstance3D.new(); var qm: = QuadMesh.new();qm.size = Vector2(3.8, 3.8);disc.mesh = qm
		var pm: = ShaderMaterial.new();pm.shader = portal_shader;pm.set_shader_parameter("tint", tints[dm.id])
		disc.material_override = pm;disc.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
		disc.position = p + Vector3(0, 3.6, 0);disc.rotation.y = yaw;disc.name = "Portal_" + dm.id
		add_child(disc);portal_mats.append(pm)
		_glow_light(p + Vector3(0, 3.6, 0) + Vector3(sin(yaw), 0, cos(yaw)) * 1.5, tints[dm.id], 1.0, 8.0)
		for s in [-1.0, 1.0]:
			decor("Banner", snap(p + side * 4.4 * s + Vector3(sin(yaw), 0, cos(yaw)) * 1.5), yaw, 1.0, tints[dm.id].darkened(0.25))

	var rs: Vector3 = boss_spots.roi_slime
	for k in 12:
		var a: = TAU * k / 12.0
		mm_add("RockMoss", Transform3D(Basis(Vector3.UP, a).scaled(Vector3.ONE * r3.randf_range(0.8, 1.4)), snap(rs + Vector3(cos(a), 0, sin(a)) * 25.0, -0.2)), Color(0.32, 0.48, 0.26))
	for k in 6:
		var a: = r3.randf() * TAU
		decor("PillarBroken", snap(rs + Vector3(cos(a), 0, sin(a)) * r3.randf_range(28.0, 34.0), -0.3), r3.randf() * TAU, 1.0, Color(0.7, 0.75, 0.65))
	for k in 3:
		decor("Bones", snap(rs + Vector3(r3.randf_range(-14, 14), 0, r3.randf_range(-14, 14))), r3.randf() * TAU, 1.3)
	var sc: = swamp_center(); var sr: = swamp_radius()
	var lily: = 0; var reeds: = 0
	for k in 2600:
		var a: = r3.randf() * TAU; var rr: = sqrt(r3.randf()) * sr * 0.97
		var q: = sc + Vector3(cos(a) * rr, 0, sin(a) * rr)
		var h: = height_at(q.x, q.z)
		if h < SWAMP_Y - 0.3 and lily < 240:
			mm_add("LilyPad", Transform3D(Basis(Vector3.UP, r3.randf() * TAU).scaled(Vector3.ONE * r3.randf_range(0.7, 1.5)), Vector3(q.x, SWAMP_Y + 0.03, q.z)), Color.WHITE, true)
			lily += 1
		elif h > SWAMP_Y - 0.1 and h < SWAMP_Y + 0.35 and reeds < 220:
			mm_add("Reeds", Transform3D(Basis(Vector3.UP, r3.randf() * TAU).scaled(Vector3.ONE * r3.randf_range(0.9, 1.5)), Vector3(q.x, h, q.z)), Color.WHITE, true)
			reeds += 1
	for k in 40:
		var a: = r3.randf() * TAU; var rr: = sqrt(r3.randf()) * sr
		var q: = snap(sc + Vector3(cos(a) * rr, 0, sin(a) * rr))
		if q.y < SWAMP_Y + 0.2 or _near_poi(q, -6.0): continue
		mm_add("Mushrooms", Transform3D(Basis(Vector3.UP, r3.randf() * TAU).scaled(Vector3.ONE * r3.randf_range(2.6, 4.2)), q), 
			[Color(0.55, 0.35, 0.95), Color(0.25, 0.85, 0.75), Color(0.95, 0.45, 0.7)][k % 3])

	var vc: = volcano
	for k in 10:
		var a: = TAU * k / 10.0 + 0.2
		mm_add("Obsidian", Transform3D(Basis(Vector3.UP, a).scaled(Vector3.ONE * r3.randf_range(1.0, 1.7)), snap(vc + Vector3(cos(a), 0, sin(a)) * 31.0, -0.3)))
	for k in 4:
		decor("Bones", snap(vc + Vector3(r3.randf_range(-10, 10), 0, r3.randf_range(-10, 10))), r3.randf() * TAU, 1.5, Color(0.62, 0.55, 0.48))
	_magma_cracks(vc, r3)
	_glow_light(Vector3(vc.x, height_at(vc.x, vc.z) + 7.0, vc.z), Color(1.0, 0.48, 0.18), 1.3, 30.0)
	for k in 7:
		var a: = TAU * k / 7.0 + 0.9
		var q: = snap(vc + Vector3(cos(a), 0, sin(a)) * r3.randf_range(58.0, 96.0), -0.2)
		if not is_land(q.x, q.z, 2.0): continue
		decor("Vent", q, r3.randf() * TAU, r3.randf_range(1.0, 1.6))
		_smoke(q + Vector3(0, 1.2, 0), 0.6)
	for k in 3:
		_smoke(vc + Vector3(r3.randf_range(-6, 6), 2.0, r3.randf_range(-6, 6)), 1.4)
	var obs: = 0
	for k in 600:
		if obs >= 46: break
		var p: = _rand_land(2.5, 40.0, 0.6)
		if p == Vector3.INF or biome_at(p.x, p.z) != "braise" or _near_poi(p, -4.0) or lava_at(p): continue
		mm_add("Obsidian", Transform3D(Basis(Vector3.UP, r3.randf() * TAU).scaled(Vector3.ONE * r3.randf_range(0.6, 1.5)), p - Vector3(0, 0.1, 0)))
		if r3.randf() < 0.4: cyl_collider(p, 0.5, 1.6)
		obs += 1

	var ts: Vector3 = boss_spots.tempest
	decor("StoneCircle", ts - Vector3(0, 0.2, 0), 0.3, 1.55, Color.WHITE, true)
	for k in 9:
		var a: = TAU * k / 9.0 + 0.3
		cyl_collider(ts + Vector3(cos(a), 0, sin(a)) * 9.0 * 1.55, 0.6, 4.0)
	for k in 4:
		var a: = TAU * k / 4.0 + 0.7
		decor("Banner", snap(ts + Vector3(cos(a), 0, sin(a)) * 18.0), - a, 1.2, Color(0.45, 0.35, 0.75))
	var spires: = 0
	for k in 900:
		if spires >= 70: break
		var p: = _rand_land(4.0, 60.0, 0.55)
		if p == Vector3.INF or biome_at(p.x, p.z) != "orage" or _near_poi(p, -2.0) or on_path(p.x, p.z): continue
		if spires % 3 == 0:
			var s: = r3.randf_range(0.6, 1.2)
			mm_add("RockSpire", Transform3D(Basis(Vector3.UP, r3.randf() * TAU).scaled(Vector3(s, s * r3.randf_range(0.7, 1.3), s)), p - Vector3(0, 0.4, 0)), Color(0.5, 0.48, 0.58), false, false)
			cyl_collider(p, 1.1 * s, 6.0 * s)
		else:
			mm_add("CrystalSpire", Transform3D(Basis(Vector3.UP, r3.randf() * TAU).scaled(Vector3.ONE * r3.randf_range(0.7, 1.4)), p - Vector3(0, 0.1, 0)), Color(0.46, 0.44, 0.54))
			if r3.randf() < 0.5: cyl_collider(p, 0.6, 2.4)
		spires += 1


func _magma_cracks(c: Vector3, r3: RandomNumberGenerator) -> void :
	var st: = SurfaceTool.new();st.begin(Mesh.PRIMITIVE_TRIANGLES)
	var base: = 0
	var y: = height_at(c.x, c.z) + 0.05
	for k in 9:
		var a: = TAU * k / 9.0 + r3.randf_range(-0.25, 0.25)
		var r0: = r3.randf_range(2.5, 5.0); var r1: = r3.randf_range(10.5, 13.5)
		var pts: Array[Vector3] = []
		var steps: = 9
		for i in steps + 1:
			var t: = i / float(steps)
			var rr: = lerpf(r0, r1, t)
			var aa: = a + sin(t * 7.0 + k) * 0.09 + r3.randf_range(-0.04, 0.04)
			pts.append(Vector3(c.x + cos(aa) * rr, y, c.z + sin(aa) * rr))
		var along: = 0.0
		for i in pts.size():
			if i > 0: along += pts[i].distance_to(pts[i - 1])
			var t: = i / float(steps)
			var w: = 0.55 * sin(PI * clampf(t * 1.1, 0.0, 1.0)) + 0.06
			var td: = pts[mini(i + 1, steps)] - pts[maxi(i - 1, 0)];td = td.normalized()
			var sd: = Vector3( - td.z, 0, td.x)
			for s in 2:
				st.set_normal(Vector3.UP);st.set_uv(Vector2(float(s), along * 0.5))
				st.add_vertex(pts[i] + sd * (float(s) - 0.5) * 2.0 * w)
		for i in steps:
			var q: = base + i * 2
			for idx in [q, q + 1, q + 2, q + 1, q + 3, q + 2]: st.add_index(idx)
		base += pts.size() * 2
	var m: = ShaderMaterial.new();m.shader = load("res://shaders/lava_flow.gdshader")
	m.set_shader_parameter("flow_speed", 0.35)
	var mi: = MeshInstance3D.new();mi.mesh = st.commit();mi.material_override = m;mi.name = "MagmaCracks"
	mi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	add_child(mi)

var _smoke_mesh: QuadMesh
func _smoke(p: Vector3, amount: float) -> void :
	var sp: = CPUParticles3D.new()
	if _smoke_mesh == null:

		_smoke_mesh = QuadMesh.new();_smoke_mesh.size = Vector2(1.6, 1.6)
		var m: = StandardMaterial3D.new();m.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
		m.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA;m.vertex_color_use_as_albedo = true
		m.billboard_mode = BaseMaterial3D.BILLBOARD_PARTICLES
		m.cull_mode = BaseMaterial3D.CULL_DISABLED
		var gt: = GradientTexture2D.new();gt.width = 64;gt.height = 64
		gt.fill = GradientTexture2D.FILL_RADIAL;gt.fill_from = Vector2(0.5, 0.5);gt.fill_to = Vector2(0.5, 0.0)
		var g: = Gradient.new();g.set_color(0, Color(1, 1, 1, 1));g.add_point(0.45, Color(1, 1, 1, 0.55));g.set_color(1, Color(1, 1, 1, 0))
		gt.gradient = g
		m.albedo_texture = gt
		_smoke_mesh.material = m
	sp.mesh = _smoke_mesh;sp.amount = int(9 * amount);sp.lifetime = 6.0;sp.preprocess = 6.0
	sp.direction = Vector3.UP;sp.spread = 10.0;sp.gravity = Vector3(0.35, 1.0, 0)
	sp.initial_velocity_min = 0.6;sp.initial_velocity_max = 1.3
	sp.angle_min = 0.0;sp.angle_max = 360.0
	sp.scale_amount_min = 1.2 * amount;sp.scale_amount_max = 2.4 * amount
	var curve: = Curve.new();curve.add_point(Vector2(0, 0.45));curve.add_point(Vector2(1, 1.8));sp.scale_amount_curve = curve
	var grad: = Gradient.new();grad.set_color(0, Color(0.3, 0.27, 0.27, 0.0));grad.add_point(0.12, Color(0.3, 0.27, 0.27, 0.6))
	grad.add_point(0.55, Color(0.42, 0.4, 0.41, 0.35));grad.set_color(1, Color(0.5, 0.48, 0.5, 0.0))
	sp.color_ramp = grad
	sp.position = p;sp.visibility_range_end = 140.0
	sp.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	add_child(sp)


func _night_blooms() -> void :
	var st: = SurfaceTool.new()
	st.begin(Mesh.PRIMITIVE_TRIANGLES)
	var stem: = Color(1, 1, 1, 0.0)
	for k in 3:
		var a: = k * TAU / 3.0 + 0.3
		var lean: = Vector3(cos(a), 0, sin(a)) * 0.07
		var top: = lean + Vector3(0, 0.26 + k * 0.04, 0)
		var side: = Vector3( - sin(a), 0, cos(a)) * 0.012
		for v in [Vector3.ZERO - side, Vector3.ZERO + side, top + side, Vector3.ZERO - side, top + side, top - side]:
			st.set_color(stem);st.set_normal(Vector3.UP);st.add_vertex(v)

		var r: = 0.045
		var bell_top: = top + Vector3(0, 0.02, 0)
		var bell_bot: = top - Vector3(0, 0.06, 0)
		for i in 8:
			var a0: = i * TAU / 8.0; var a1: = (i + 1) * TAU / 8.0
			var p0: = bell_bot + Vector3(cos(a0), 0, sin(a0)) * r
			var p1: = bell_bot + Vector3(cos(a1), 0, sin(a1)) * r
			for v in [bell_top, p0, p1]:
				st.set_color(Color(1, 1, 1, 1));st.set_normal((v - top).normalized());st.add_vertex(v)
	var mesh: = st.commit()
	bloom_mat = ShaderMaterial.new();bloom_mat.shader = load("res://shaders/nightbloom.gdshader")
	mesh.surface_set_material(0, bloom_mat)
	prop_meshes["NightBloom"] = mesh
	var tints: = [Color(0.45, 0.85, 1.0), Color(0.55, 0.65, 1.0), Color(0.75, 0.6, 1.0), Color(0.5, 1.0, 0.9)]
	var n: = 0
	for k in 30000:
		if n >= 3600: break
		var a2: = rng.randf() * TAU; var rr: = sqrt(rng.randf()) * 500.0
		var p: = Vector3(cos(a2) * rr, 0, sin(a2) * rr)
		if _grass_amount(p.x, p.z) < 0.7: continue
		p.y = height_at(p.x, p.z)
		if p.y < 2.2 or p.y > 34.0 or _near_poi(p, -8.0) or on_path(p.x, p.z) or not is_land(p.x, p.z, 2.2): continue

		var cnt: = rng.randi_range(3, 6)
		var tint: Color = tints[rng.randi() % tints.size()]
		for c in cnt:
			var q: = p + Vector3(rng.randf_range(-1.2, 1.2), 0, rng.randf_range(-1.2, 1.2))
			q.y = height_at(q.x, q.z)
			mm_add("NightBloom", Transform3D(Basis(Vector3.UP, rng.randf() * TAU).scaled(Vector3.ONE * rng.randf_range(1.2, 1.8)), q), tint, true)
			n += 1

func _sky_islands() -> void :
	for i in 14:
		var a: = TAU * i / 14 + rng.randf_range(-0.2, 0.2)
		var r: = rng.randf_range(560, 680)
		var s: = rng.randf_range(9, 18)
		var p: = Vector3(cos(a) * r, rng.randf_range(30, 75), sin(a) * r)
		var xf: = Transform3D(Basis(Vector3.UP, rng.randf() * TAU).scaled(Vector3(s, s * 1.2, s)), p)
		mm_add("FloatIsland", xf, Color.WHITE, false, true)
		if s > 12.0:
			mm_add("Tower", Transform3D(Basis.IDENTITY.scaled(Vector3.ONE * rng.randf_range(0.9, 1.5)), p + Vector3(rng.randf_range(-0.3, 0.3) * s, 0, rng.randf_range(-0.3, 0.3) * s)), Color.WHITE, false, true)

func _pick_spots() -> void :

	for c in LEGACY_CHESTS: chest_spots.append(snap(Vector3(c[0], 0, c[1])))
	for c in LEGACY_CRYSTALS: crystal_spots.append(snap(Vector3(c[0], 0, c[1]), 1.3))
	for c in LEGACY_APPLES: apple_spots.append(snap(Vector3(c[0], 0, c[1]), 0.25))
	for c in LEGACY_ROAM: roam_spots.append({"pos": snap(Vector3(c[0], 0, c[1])), "biome": c[2]})

	var r2: = RandomNumberGenerator.new();r2.seed = 77
	var old: = rng;rng = r2
	for key in ["marais", "braise", "orage"]:
		var want_c: = chest_spots.size() + 6
		var want_k: = crystal_spots.size() + 5
		var want_r: = roam_spots.size() + 4
		for tries in 4000:
			if chest_spots.size() >= want_c and crystal_spots.size() >= want_k and roam_spots.size() >= want_r: break
			var p: = _rand_land(2.0, 60.0, 0.7)
			if p == Vector3.INF or biome_at(p.x, p.z) != key or lava_at(p): continue
			if chest_spots.size() < want_c and not _near_poi(p, 4.0):
				var ok: = true
				for q in chest_spots:
					if q.distance_to(p) < 36.0: ok = false
				if ok: chest_spots.append(p);continue
			if crystal_spots.size() < want_k and not _near_poi(p, -8.0):
				var ok2: = true
				for q in crystal_spots:
					if q.distance_to(p) < 22.0: ok2 = false
				if ok2: crystal_spots.append(p + Vector3(0, 1.3, 0));continue
			if roam_spots.size() < want_r and not _near_poi(p, 12.0):
				var ok3: = true
				for q in roam_spots:
					if (q.pos as Vector3).distance_to(p) < 35.0: ok3 = false
				if ok3: roam_spots.append({"pos": p, "biome": key})
	rng = old
