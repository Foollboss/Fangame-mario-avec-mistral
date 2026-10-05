class_name Cinematic
extends Node
## Cinématiques : caméra animée, bandes noires, sous-titres, cartouches de titre, héros « acteurs ».
## Une scène est une liste d'étapes (dictionnaires) jouées l'une après l'autre :
##   {"cam": [pos, regard], "to": [pos, regard], "t": durée}  caméra fixe ou travelling
##   {"orbit": centre, "r": rayon, "h": hauteur, "a0": angle, "a1": angle, "t": durée, "look_h": 1.4}
##   {"say": [qui, texte], "t": durée?}                         sous-titre (qui = PNJ ou héros)
##   {"title": [titre, sous-titre], "t": durée}                  grand cartouche
##   {"actor": nom, "hero": "kael", "pos": Vector3, "yaw": a, "anim": "Idle"}
##   {"anim": [acteur, animation]}   {"move": [acteur, destination, durée]}
##   {"wait": t}   {"call": Callable}   {"fade": [alpha, t]}

signal finished

var main: Node
var layer: CanvasLayer
var cam: Camera3D
var bar_top: ColorRect
var bar_bot: ColorRect
var sub_name: Label
var sub_text: Label
var title_l: Label
var title_sub: Label
var fade: ColorRect
var skip_btn: Button
var running: = false
var skipping: = false
var advance: = false
var actors: = {}
var _prev_cam: Camera3D
var _party_vis: = true

func setup(m: Node) -> void :
	main = m
	process_mode = Node.PROCESS_MODE_ALWAYS
	layer = CanvasLayer.new();layer.layer = 8;add_child(layer)
	var root: = Control.new();root.set_anchors_preset(Control.PRESET_FULL_RECT);root.mouse_filter = Control.MOUSE_FILTER_IGNORE
	layer.add_child(root)
	fade = ColorRect.new();fade.color = Color(0, 0, 0, 0);fade.set_anchors_preset(Control.PRESET_FULL_RECT)
	fade.mouse_filter = Control.MOUSE_FILTER_IGNORE;root.add_child(fade)
	for k in 2:
		var b: = ColorRect.new();b.color = Color(0, 0, 0, 1);b.mouse_filter = Control.MOUSE_FILTER_IGNORE
		b.anchor_left = 0;b.anchor_right = 1
		if k == 0:
			b.anchor_top = 0;b.anchor_bottom = 0;b.offset_bottom = 0;bar_top = b
		else:
			b.anchor_top = 1;b.anchor_bottom = 1;b.offset_top = 0;bar_bot = b
		root.add_child(b)
	sub_name = GStyle.label("", 24, GStyle.GOLD_HI, 5);sub_name.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	sub_name.anchor_left = 0;sub_name.anchor_right = 1;sub_name.anchor_top = 1;sub_name.anchor_bottom = 1
	sub_name.offset_top = -132;sub_name.offset_bottom = -100;root.add_child(sub_name)
	sub_text = GStyle.label("", 23, Color(0.97, 0.97, 1.0), 5);sub_text.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	sub_text.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	sub_text.anchor_left = 0.12;sub_text.anchor_right = 0.88;sub_text.anchor_top = 1;sub_text.anchor_bottom = 1
	sub_text.offset_top = -98;sub_text.offset_bottom = -30;root.add_child(sub_text)
	title_l = GStyle.label("", 54, GStyle.CREAM_HI, 8);title_l.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	title_l.anchor_left = 0;title_l.anchor_right = 1;title_l.anchor_top = 0.36;title_l.anchor_bottom = 0.36
	title_l.offset_bottom = 70;root.add_child(title_l)
	title_sub = GStyle.label("", 22, GStyle.GOLD, 5);title_sub.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	title_sub.anchor_left = 0;title_sub.anchor_right = 1;title_sub.anchor_top = 0.36;title_sub.anchor_bottom = 0.36
	title_sub.offset_top = 76;title_sub.offset_bottom = 110;root.add_child(title_sub)
	skip_btn = Button.new();skip_btn.text = "Passer  ▸▸";skip_btn.flat = true
	skip_btn.add_theme_font_size_override("font_size", 19)
	for k in ["font_color", "font_focus_color"]: skip_btn.add_theme_color_override(k, Color(GStyle.CREAM, 0.85))
	skip_btn.add_theme_color_override("font_hover_color", GStyle.GOLD_HI)
	skip_btn.anchor_left = 1;skip_btn.anchor_right = 1;skip_btn.offset_left = -190;skip_btn.offset_right = -30
	skip_btn.offset_top = 16;skip_btn.offset_bottom = 52;skip_btn.pressed.connect(skip);root.add_child(skip_btn)
	var click: = Control.new();click.set_anchors_preset(Control.PRESET_FULL_RECT);click.mouse_filter = Control.MOUSE_FILTER_PASS
	click.gui_input.connect( func(ev: InputEvent):
		if (ev is InputEventMouseButton and ev.pressed and ev.button_index == MOUSE_BUTTON_LEFT) or (ev is InputEventScreenTouch and ev.pressed):
			advance = true)
	root.add_child(click);root.move_child(click, 1)
	layer.visible = false
	cam = Camera3D.new();cam.fov = 55.0;cam.far = 1500.0;cam.process_mode = Node.PROCESS_MODE_ALWAYS
	add_child(cam)

func skip() -> void :
	if running: skipping = true

func _process(_d: float) -> void :
	if not running: return
	if Input.is_action_just_pressed("pause"): skip()
	if Input.is_action_just_pressed("jump") or Input.is_action_just_pressed("interact") or Input.is_action_just_pressed("attack"): advance = true

## Joue une scène (coroutine) ; on_done est appelé à la fin, même si on passe la scène.
func play(steps: Array, on_done: = Callable()) -> void :
	if running:
		if on_done.is_valid(): on_done.call()
		return
	running = true;skipping = false
	main.cinematic = true
	main.party.enabled = false;main.party.input_vec = Vector2.ZERO;main.party.iframe = 999.0
	main.ui.hud.visible = false;main.ui.release_touch()
	if not main.ui.touch and not main.autotest: Input.mouse_mode = Input.MOUSE_MODE_VISIBLE
	_prev_cam = get_viewport().get_camera_3d()
	cam.global_transform = _prev_cam.global_transform if _prev_cam else Transform3D.IDENTITY
	cam.current = true
	layer.visible = true
	sub_name.text = "";sub_text.text = "";title_l.text = "";title_sub.text = ""
	var tw: = create_tween().set_parallel(true)
	tw.tween_property(bar_top, "offset_bottom", 76.0, 0.4).set_trans(Tween.TRANS_QUAD)
	tw.tween_property(bar_bot, "offset_top", -76.0, 0.4).set_trans(Tween.TRANS_QUAD)
	for s in steps:
		await _step(s)
	_end()
	if on_done.is_valid(): on_done.call()
	finished.emit()

func _end() -> void :
	for k in actors:
		if is_instance_valid(actors[k]): actors[k].queue_free()
	actors.clear()
	main.party.visual.visible = true
	fade.color.a = 0.0
	bar_top.offset_bottom = 0.0;bar_bot.offset_top = 0.0
	layer.visible = false
	cam.current = false
	if _prev_cam and is_instance_valid(_prev_cam): _prev_cam.current = true
	running = false
	main.cinematic = false
	main.party.iframe = 0.6
	main.party.enabled = not main.paused and not main.ui.dlg_open
	main.ui.hud.visible = true
	if not main.ui.touch and not main.autotest and main.playing: Input.mouse_mode = Input.MOUSE_MODE_CAPTURED
	main.rig.snap_behind()

func _wait(t: float, can_advance: = false) -> void :
	advance = false
	var left: = t
	while left > 0.0 and not skipping:
		if can_advance and advance: break
		await get_tree().process_frame
		left -= get_process_delta_time()

func _look(from: Vector3, at: Vector3) -> Transform3D:
	var up: = Vector3.UP if absf((at - from).normalized().y) < 0.98 else Vector3.FORWARD
	return Transform3D(Basis.looking_at(at - from, up), from)

func _step(s: Dictionary) -> void :
	if s.has("call"):
		(s["call"] as Callable).call();return
	if skipping and not s.has("actor"): return
	if s.has("cam"):
		var a: Array = s.cam
		var t: float = s.get("t", 0.0)
		cam.global_transform = _look(a[0], a[1])
		if s.has("to"):
			var b: Array = s.to
			var p0: Vector3 = a[0]; var l0: Vector3 = a[1]; var p1: Vector3 = b[0]; var l1: Vector3 = b[1]
			var tw: = create_tween()
			tw.tween_method( func(k: float):
				var e: = k * k * (3.0 - 2.0 * k)
				cam.global_transform = _look(p0.lerp(p1, e), l0.lerp(l1, e)), 0.0, 1.0, t)
		if t > 0.0 and not s.get("async", false): await _wait(t)
		return
	if s.has("orbit"):
		var c: Vector3 = s.orbit
		var r: float = s.get("r", 6.0); var h: float = s.get("h", 2.0); var lh: float = s.get("look_h", 1.3)
		var a0: float = s.get("a0", 0.0); var a1: float = s.get("a1", 1.0); var t2: float = s.get("t", 3.0)
		var tw2: = create_tween()
		tw2.tween_method( func(k: float):
			var a: = lerpf(a0, a1, k)
			cam.global_transform = _look(c + Vector3(sin(a) * r, h, cos(a) * r), c + Vector3(0, lh, 0)), 0.0, 1.0, t2)
		if not s.get("async", false): await _wait(t2)
		return
	if s.has("say"):
		var who: String = s.say[0]
		var txt: String = s.say[1]
		sub_name.text = main.speaker_name(who)
		sub_name.add_theme_color_override("font_color", main.speaker_color(who))
		sub_text.text = txt
		sub_text.visible_ratio = 0.0
		create_tween().tween_property(sub_text, "visible_ratio", 1.0, clampf(txt.length() / 60.0, 0.3, 1.4))
		main.audio.play("blip", -10.0)
		if s.has("anim"): _anim(String(s.anim[0]), String(s.anim[1]))
		await _wait(float(s.get("t", 2.4 + txt.length() / 22.0)), true)
		sub_name.text = "";sub_text.text = ""
		return
	if s.has("title"):
		var tt: Array = s.title
		title_l.text = tt[0];title_sub.text = tt[1] if tt.size() > 1 else ""
		title_l.modulate.a = 0.0;title_sub.modulate.a = 0.0
		var tw3: = create_tween().set_parallel(true)
		tw3.tween_property(title_l, "modulate:a", 1.0, 0.6);tw3.tween_property(title_sub, "modulate:a", 1.0, 0.9)
		main.audio.play("quest", -6.0)
		await _wait(float(s.get("t", 2.6)))
		var tw4: = create_tween().set_parallel(true)
		tw4.tween_property(title_l, "modulate:a", 0.0, 0.5);tw4.tween_property(title_sub, "modulate:a", 0.0, 0.5)
		return
	if s.has("actor"):
		_spawn_actor(String(s.actor), String(s.hero), s.pos, float(s.get("yaw", 0.0)), String(s.get("anim", "Idle")))
		return
	if s.has("anim"):
		_anim(String(s.anim[0]), String(s.anim[1]))
		return
	if s.has("move"):
		var m: Array = s.move
		var n: Node3D = actors.get(m[0])
		if n:
			var to: Vector3 = m[1]
			var d: = to - n.global_position;d.y = 0
			if d.length() > 0.1: n.rotation.y = atan2(d.x, d.z)
			_anim(String(m[0]), String(m[3]) if m.size() > 3 else "Walk")
			n.create_tween().tween_property(n, "global_position", to, float(m[2]))
		return
	if s.has("fade"):
		var f: Array = s.fade
		create_tween().tween_property(fade, "color:a", float(f[0]), float(f[1]))
		await _wait(float(f[1]))
		return
	if s.has("wait"):
		await _wait(float(s.wait))
		return

func _spawn_actor(key: String, hero: String, pos: Vector3, yaw: float, anim: String) -> void :
	var path: = "res://assets/%s.glb" % hero
	if not ResourceLoader.exists(path): return
	var model: Node3D = load(path).instantiate()
	main.add_child(model)
	Toon.apply_char(model, 0.0042)
	model.global_position = pos;model.rotation.y = yaw
	actors[key] = model
	_anim(key, anim)

func _anim(key: String, anim: String) -> void :
	var n: Node3D = actors.get(key)
	if n == null: return
	var aps: = n.find_children("*", "AnimationPlayer", true, false)
	if aps.is_empty(): return
	var ap: AnimationPlayer = aps[0]
	if not ap.has_animation(anim): anim = "Idle"
	var a: = ap.get_animation(anim)
	if anim in ["Idle", "Walk", "Run", "Talk", "Wave", "Victory", "Idle_Combat"]: a.loop_mode = Animation.LOOP_LINEAR
	ap.play(anim, 0.25)

func hide_party() -> void :
	main.party.visual.visible = false
