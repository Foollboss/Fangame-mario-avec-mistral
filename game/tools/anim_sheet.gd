extends SceneTree
## Planche-contact d'animations (outil de vérification).
## godot --rendering-driver opengl3 --script res://tools/anim_sheet.gd -- --char=kael --anims=Walk,Run --frames=8 --out=/tmp/x
## Rend chaque animation en une rangée d'images (vue de profil ou de 3/4).

const W: = 200
const H: = 280

func _init() -> void :
	var char_name: = "kael"
	var anims: PackedStringArray = []
	var frames: = 8
	var out: = "user://sheets"
	var view: = "side"
	for a in OS.get_cmdline_user_args():
		if a.begins_with("--char="): char_name = a.substr(7)
		elif a.begins_with("--anims="): anims = a.substr(8).split(",")
		elif a.begins_with("--frames="): frames = int(a.substr(9))
		elif a.begins_with("--out="): out = a.substr(6)
		elif a.begins_with("--view="): view = a.substr(7)
	_run.call_deferred(char_name, anims, frames, out, view)

func _run(char_name: String, anims: PackedStringArray, frames: int, out: String, view: String) -> void :
	root.size = Vector2i(W, H)
	var world: = Node3D.new();root.add_child(world)
	var env: = WorldEnvironment.new();env.environment = Environment.new()
	env.environment.background_mode = Environment.BG_COLOR
	env.environment.background_color = Color(0.82, 0.88, 0.95)
	env.environment.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
	env.environment.ambient_light_color = Color(0.75, 0.78, 0.85)
	world.add_child(env)
	var sun: = DirectionalLight3D.new();sun.rotation_degrees = Vector3(-40, 60, 0);world.add_child(sun)
	var floor_mi: = MeshInstance3D.new(); var pm: = PlaneMesh.new();pm.size = Vector2(6, 6);floor_mi.mesh = pm
	var fm: = StandardMaterial3D.new();fm.albedo_color = Color(0.55, 0.7, 0.45);floor_mi.material_override = fm
	world.add_child(floor_mi)
	var model: Node3D = load("res://assets/%s.glb" % char_name).instantiate()
	world.add_child(model)
	var skel: Skeleton3D = model.find_children("*", "Skeleton3D", true, false)[0]
	var wname: String = {"kael": "Sword_Kael", "lyra": "Sword_Lyra", "zahara": "Staff_Zahara"}.get(char_name, "")
	if wname != "":
		var lib: Node3D = load("res://assets/weapons.glb").instantiate()
		var sock: = BoneAttachment3D.new();sock.bone_name = Bones.find(skel, "weapon.R");skel.add_child(sock)
		var w: Node3D = lib.get_node(wname).duplicate();sock.add_child(w);w.transform = Transform3D.IDENTITY
	var ap: AnimationPlayer = model.find_children("*", "AnimationPlayer", true, false)[0]
	if anims.is_empty(): anims = ap.get_animation_list()
	var cam: = Camera3D.new();world.add_child(cam)
	cam.fov = 40.0
	match view:
		"front": cam.position = Vector3(0, 1.0, 3.6)
		"back": cam.position = Vector3(0, 1.3, -3.6)
		"34": cam.position = Vector3(2.6, 1.3, 2.6)
		"top": cam.position = Vector3(0.01, 4.0, 0.0)
		_: cam.position = Vector3(3.6, 1.0, 0)
	cam.look_at(Vector3(0, 0.9, 0))
	var sheet: = Image.create(W * frames, H * anims.size(), false, Image.FORMAT_RGB8)
	for row in anims.size():
		var an: String = anims[row]
		if not ap.has_animation(an): continue
		var anim: = ap.get_animation(an)
		ap.play(an);ap.pause()
		for f in frames:
			var t: = anim.length * float(f) / float(frames if anim.loop_mode != Animation.LOOP_NONE or an in ["Walk", "Run", "Sprint", "Idle", "Idle_Combat", "Glide", "Fall"] else frames - 1)
			ap.seek(minf(t, anim.length), true)
			await process_frame
			await RenderingServer.frame_post_draw
			await process_frame
			await RenderingServer.frame_post_draw
			var img: = root.get_texture().get_image()
			img.convert(Image.FORMAT_RGB8)
			if img.get_width() != W or img.get_height() != H: img.resize(W, H)
			sheet.blit_rect(img, Rect2i(0, 0, W, H), Vector2i(f * W, row * H))
	DirAccess.make_dir_recursive_absolute(out)
	var path: = out.path_join("%s_%s.png" % [char_name, view])
	sheet.save_png(path)
	print("SHEET ", path, " anims=", anims)
	quit()
