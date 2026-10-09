class_name TracksDB
## Définition des circuits.
## Segments : ["s", longueur, dénivelé, {options}] ligne droite
##            ["c", angle (° ; + = droite), rayon, dénivelé, {options}] virage
## Options de segment : {"sec": "city"|"bridge"|"beach"|"highway"|"canyon"|"open"|"tunnel"}

const ENVS := {
	"sf": {"name": "San Francisco", "sky": "res://assets/sky/sky_sf.png", "sun_dir": Vector3(0.45, 0.62, -0.62),
		"sun_color": Color(1.0, 0.95, 0.86), "sun_energy": 1.25, "ambient": 0.55, "fog": Color(0.70, 0.80, 0.95),
		"fog_density": 0.0016, "night": false, "ground": "concrete", "styles": ["victorian", "victorian", "brick", "stucco"],
		"heights": [9.0, 17.0], "veg": "tree", "accent": Color("#ff3fa4")},
	"la": {"name": "Los Angeles", "sky": "res://assets/sky/sky_la.png", "sun_dir": Vector3(-0.2, 0.10, -0.97),
		"sun_color": Color(1.0, 0.62, 0.36), "sun_energy": 1.1, "ambient": 0.6, "fog": Color(0.85, 0.5, 0.45),
		"fog_density": 0.0018, "night": false, "ground": "grass", "styles": ["stucco", "stucco", "office", "brick"],
		"heights": [7.0, 22.0], "veg": "palm", "accent": Color("#ff8a3d")},
	"tokyo": {"name": "Tokyo", "sky": "res://assets/sky/sky_tokyo.png", "sun_dir": Vector3(0.3, 0.7, 0.6),
		"sun_color": Color(0.55, 0.6, 0.95), "sun_energy": 0.5, "ambient": 0.8, "fog": Color(0.12, 0.06, 0.22),
		"fog_density": 0.0025, "night": true, "ground": "concrete", "styles": ["tokyo", "tokyo", "office", "tokyo"],
		"heights": [25.0, 90.0], "veg": "tree", "accent": Color("#2fe0ff")},
	"desert": {"name": "Nevada", "sky": "res://assets/sky/sky_desert.png", "sun_dir": Vector3(-0.3, 0.8, 0.45),
		"sun_color": Color(1.0, 0.95, 0.85), "sun_energy": 1.35, "ambient": 0.6, "fog": Color(0.92, 0.84, 0.74),
		"fog_density": 0.0011, "night": false, "ground": "sand", "styles": ["stucco"], "heights": [5.0, 8.0],
		"veg": "cactus", "accent": Color("#ffb400")},
}

const TRACKS := {
	"sf_downtown": {"name": "DOWNTOWN", "env": "sf", "lanes": 4, "two_way": false, "traffic": 0.85, "seed": 11,
		"default_sec": "city", "ramp_every": 260.0,
		"segments": [["s", 170, 0], ["s", 90, 14], ["s", 28, 0], ["s", 90, -12], ["c", -40, 140, 0],
			["s", 100, 16], ["s", 25, 0], ["s", 110, -18], ["c", 35, 180, -4], ["s", 200, 0], ["c", -60, 120, 0],
			["s", 80, 10], ["s", 30, 0], ["s", 80, -10], ["c", 50, 150, 0], ["s", 220, -6], ["c", -30, 250, 0],
			["s", 180, 12], ["s", 30, 0], ["s", 120, -14], ["c", 40, 160, 0], ["s", 260, 0]]},
	"sf_goldengate": {"name": "GOLDEN GATE", "env": "sf", "lanes": 4, "two_way": true, "traffic": 0.7, "seed": 12,
		"default_sec": "city", "ramp_every": 300.0,
		"segments": [["s", 150, 0], ["s", 80, 10], ["s", 25, 0], ["s", 80, -10], ["c", 30, 200, 0],
			["s", 120, 0, {"sec": "highway"}], ["c", -25, 300, 4, {"sec": "highway"}], ["s", 80, 6, {"sec": "highway"}],
			["s", 950, 0, {"sec": "bridge"}], ["s", 100, -4, {"sec": "highway"}], ["c", 40, 220, -6, {"sec": "highway"}],
			["s", 200, 0, {"sec": "highway"}], ["c", -35, 250, 0], ["s", 250, 0]]},
	"la_hollywood": {"name": "HOLLYWOOD", "env": "la", "lanes": 5, "two_way": true, "traffic": 0.75, "seed": 21,
		"default_sec": "city", "ramp_every": 250.0,
		"segments": [["s", 200, 0], ["c", -25, 300, 0], ["s", 180, 3], ["c", 30, 250, 0], ["s", 160, -3], ["s", 120, 6],
			["c", -45, 180, 0], ["s", 220, 0], ["c", 35, 220, -4], ["s", 180, 0], ["c", -20, 400, 0], ["s", 260, 0],
			["c", 40, 200, 2], ["s", 200, 0]]},
	"la_coast": {"name": "PACIFIC COAST", "env": "la", "lanes": 4, "two_way": false, "traffic": 0.8, "seed": 22,
		"default_sec": "city", "ramp_every": 240.0,
		"segments": [["s", 150, 0], ["c", 20, 300, 0], ["s", 200, 0, {"sec": "beach"}], ["c", -30, 350, 2, {"sec": "beach"}],
			["s", 250, -2, {"sec": "beach"}], ["c", 25, 300, 0, {"sec": "beach"}], ["s", 200, 0, {"sec": "beach"}],
			["c", -40, 200, 0], ["s", 150, 9], ["s", 30, 0], ["s", 150, -9], ["c", 30, 250, 0],
			["s", 300, 0, {"sec": "beach"}], ["c", -20, 300, 0, {"sec": "beach"}], ["s", 200, 0]]},
	"tokyo_shibuya": {"name": "SHIBUYA", "env": "tokyo", "lanes": 4, "two_way": false, "traffic": 0.9, "seed": 31,
		"default_sec": "city", "ramp_every": 250.0,
		"segments": [["s", 180, 0], ["c", 50, 140, 0], ["s", 160, 0], ["c", -50, 140, 0], ["s", 120, -6],
			["s", 300, 0, {"sec": "tunnel"}], ["s", 100, 6], ["c", -35, 180, 0], ["s", 200, 0], ["c", 45, 160, 0],
			["s", 180, 0], ["c", -30, 250, 0], ["s", 250, 0]]},
	"tokyo_bay": {"name": "RAINBOW BAY", "env": "tokyo", "lanes": 4, "two_way": false, "traffic": 0.75, "seed": 32,
		"default_sec": "highway", "ramp_every": 280.0, "bridge_color": "white",
		"segments": [["s", 150, 0], ["c", 30, 300, 8], ["s", 200, 10], ["s", 700, 0, {"sec": "bridge"}],
			["c", -40, 350, -6], ["s", 200, -12], ["c", 35, 250, 0, {"sec": "city"}], ["s", 250, 0, {"sec": "city"}],
			["c", -30, 200, 0, {"sec": "city"}], ["s", 300, 0, {"sec": "city"}]]},
	"nevada_canyon": {"name": "CANYON", "env": "desert", "lanes": 4, "two_way": false, "traffic": 0.45, "seed": 41,
		"default_sec": "open", "ramp_every": 200.0,
		"segments": [["s", 200, 0], ["s", 120, 12], ["s", 30, 0], ["s", 140, -14], ["c", -35, 250, 0, {"sec": "canyon"}],
			["s", 300, 0, {"sec": "canyon"}], ["c", 40, 200, -5, {"sec": "canyon"}], ["s", 250, 0, {"sec": "canyon"}],
			["c", -30, 300, 0, {"sec": "canyon"}], ["s", 150, 15], ["s", 30, 0], ["s", 160, -15], ["c", 25, 400, 0],
			["s", 350, 0]]},
	"route66": {"name": "ROUTE 66", "env": "desert", "lanes": 4, "two_way": true, "traffic": 0.55, "seed": 42,
		"default_sec": "open", "ramp_every": 230.0,
		"segments": [["s", 400, 0], ["c", -20, 500, 0], ["s", 300, 7], ["s", 30, 0], ["s", 300, -7], ["c", 25, 450, 0],
			["s", 500, 0, {"sec": "highway"}], ["c", -30, 350, 0], ["s", 350, 9], ["s", 30, 0], ["s", 250, -9],
			["c", 20, 500, 0], ["s", 300, 0]]},
}


static func get_track(id: String) -> Dictionary:
	return TRACKS.get(id, TRACKS["sf_downtown"])


static func env_of(track_id: String) -> Dictionary:
	return ENVS[get_track(track_id).env]


static func full_name(track_id: String) -> String:
	var t := get_track(track_id)
	return ENVS[t.env].name.to_upper() + " — " + t.name
