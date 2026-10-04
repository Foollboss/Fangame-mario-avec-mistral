extends SceneTree
## Aperçu des décors : godot --rendering-driver opengl3 --script res://tools/props_sheet.gd -- --out=/tmp/x [--glb=res://assets/props_genshin.glb]

func _init() -> void :
	var out: = "user://sheets"
	var glb: = "res://assets/props_genshin.glb"
	var only: = ""
	for a in OS.get_cmdline_user_args():
		if a.begins_with("--out="): out = a.substr(6)
		elif a.begins_with("--glb="): glb = a.substr(6)
		elif a.begins_with("--only="): only = a.substr(7)
	_run.call_deferred(out, glb, only)

func _run(out: String, glb: String, only: String) -> void :
	root.size = Vector2i(1600, 900)
	var world: = Node3D.new();root.add_child(world)
	var env: = WorldEnvironment.new();env.environment = Environment.new()
	env.environment.background_mode = Environment.BG_COLOR
	env.environment.background_color = Color(0.62, 0.8, 0.98)
	env.environment.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
	env.environment.ambient_light_color = Color(0.62, 0.7, 0.88);env.environment.ambient_light_energy = 0.6
	world.add_child(env)
	var sun: = DirectionalLight3D.new();sun.rotation_degrees = Vector3(-45, -35, 0);sun.shadow_enabled = true;world.add_child(sun)
	var floor_mi: = MeshInstance3D.new(); var pm: = PlaneMesh.new();pm.size = Vector2(80, 80);floor_mi.mesh = pm
	var fm: = StandardMaterial3D.new();fm.albedo_color = Color(0.45, 0.68, 0.32);floor_mi.material_override = fm
	world.add_child(floor_mi)
	var scene: Node3D = load(glb).instantiate()
	var items: Array = []
	for c in scene.get_children():
		if c is MeshInstance3D and (only == "" or only.split(",").has(String(c.name))): items.append(c)
	var cols: = ceili(sqrt(items.size() * 1.6))
	var sp: = 7.5
	var tints: = {"tint_leaves": Color(0.34, 0.66, 0.27), "tint_needles": Color(0.2, 0.45, 0.3), "tint_roof": Color(0.72, 0.28, 0.24),
		"tint_bush": Color(0.3, 0.6, 0.25), "tint_rock": Color(0.75, 0.72, 0.68), "tint_moss": Color(0.42, 0.62, 0.28),
		"tint_petal": Color(0.95, 0.55, 0.75), "tint_cloth": Color(0.3, 0.55, 0.9), "tint_wpcrystal": Color(0.5, 0.75, 1.0)}
	for i in items.size():
		var mi: MeshInstance3D = items[i].duplicate()
		world.add_child(mi)
		mi.position = Vector3((i % cols) * sp - (cols - 1) * sp * 0.5, 0, (i / cols) * sp * 1.1)
		Toon.apply(mi, false, true)
		for s in mi.mesh.get_surface_count():
			var m: = mi.get_surface_override_material(s) as StandardMaterial3D
			if m and tints.has(m.resource_name):
				m.vertex_color_use_as_albedo = true
				m.albedo_color = tints[m.resource_name]
		if mi.name == "WaypointCrystal": mi.position.y = 3.6;mi.position.x -= sp
	var cam: = Camera3D.new();world.add_child(cam)
	var rows: = ceili(float(items.size()) / cols)
	cam.fov = 45.0
	cam.position = Vector3(0, 16, -14)
	cam.look_at(Vector3(0, 1.5, rows * sp * 0.45))
	if only != "":
		var n: = items.size()
		var w: = (mini(n, cols) - 1) * sp
		cam.position = Vector3(w * 0.15 + 4.0, 5.0, -10.0 - w * 0.55);cam.look_at(Vector3(0, 2.6, rows * sp * 0.3))
	await process_frame
	await RenderingServer.frame_post_draw
	await process_frame
	await RenderingServer.frame_post_draw
	var img: = root.get_texture().get_image()
	DirAccess.make_dir_recursive_absolute(out)
	img.save_png(out.path_join("props%s.png" % ("_" + only.replace(",", "_") if only != "" else "")))
	print("PROPS_SHEET ", items.size())
	quit()
