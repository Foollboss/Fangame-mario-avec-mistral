extends Node3D
## Hub principal façon Asphalt Legends Unite : showroom 3D + écrans
## (Accueil, Carrière, Carte de saison, Sélection de voiture, Fiche voiture,
##  Garage, Boutique, Événements, Objectifs quotidiens, Pass, Multijoueur, Profil, Réglages).

const K = preload("res://scripts/ui/ui_kit.gd")

const TABS := [
	["home", "ACCUEIL", "home"],
	["pass", "PASS UNITE", "star"],
	["daily", "ÉVÉNEMENTS QUOTIDIENS", "timer"],
	["events", "ÉVÉNEMENTS SPÉCIAUX", "car"],
	["multi", "MULTIJOUEUR", "trophy"],
	["career", "CARRIÈRE", "flag"],
]

const PAINTS := ["#c21818", "#1f45b8", "#121318", "#f2f2f0", "#f2c200", "#ff6a00", "#2f7d32", "#8edb19",
	"#6a1fb3", "#d23cff", "#36d6ff", "#8e9399", "#4a4c52", "#b9d23a", "#0d2a7a", "#ff9a00"]

var cam: Camera3D
var car_pivot: Node3D
var car_visual: CarVisual
var shown_car := ""
var ui: Control
var bg_shade: Control
var content: Control
var top_left: HBoxContainer
var bottom_bar: Control
var credits_label: Label
var tokens_label: Label
var tab_buttons: Dictionary = {}
var overlay: Control

var stack: Array = []
var current := ""
var args: Dictionary = {}
var career_chapter := 0
var _cam_offset := -1.6
var _dragging := false
var _spin := 0.0


func _ready() -> void:
	_build_showroom()
	_build_ui()
	Game.currencies_changed.connect(_refresh_currencies)
	Audio.play_music()
	var start := Game.hub_screen
	var start_args := Game.hub_screen_args
	Game.hub_screen = "home"
	Game.hub_screen_args = {}
	if start != "home":
		stack = [["home", {}]]
		if start == "season_map":
			stack.append(["career", {"chapter": start_args.get("chapter", 0)}])
	open(start, start_args, false)
	if Game.autotest.has("screens"):
		_autotest_screens(String(Game.autotest["screens"]).split(","))


func _autotest_screens(list: PackedStringArray) -> void:
	# captures automatiques des écrans (outil de test)
	var race: Dictionary = Game.season_races(0, 0)[1]
	for scr in list:
		await get_tree().create_timer(2.0).timeout
		match scr:
			"season_map":
				open("season_map", {"chapter": 0, "season": 0})
			"car_select":
				open("car_select", {"req": race})
			"car_detail":
				open("car_detail", {"car": Game.save["selected_car"], "req": race, "mode": "race"})
			"upgrade":
				_overlay_upgrade(Game.save["selected_car"])
			_:
				open(scr)


# ---------------------------------------------------------------------------
# Showroom 3D
# ---------------------------------------------------------------------------
func _build_showroom() -> void:
	var env := Environment.new()
	env.background_mode = Environment.BG_COLOR
	env.background_color = Color("#12041d")
	env.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
	env.ambient_light_color = Color("#5a3590")
	env.ambient_light_energy = 0.55
	env.tonemap_mode = Environment.TONE_MAPPER_ACES
	env.tonemap_white = 6.0
	env.glow_enabled = true
	env.glow_intensity = 0.9
	env.glow_bloom = 0.12
	env.glow_blend_mode = Environment.GLOW_BLEND_MODE_ADDITIVE
	env.ssr_enabled = Game.setting("quality", 2) >= 2
	env.adjustment_enabled = true
	env.adjustment_saturation = 1.2
	var we := WorldEnvironment.new()
	we.environment = env
	add_child(we)

	var floor_mi := MeshInstance3D.new()
	var pm := PlaneMesh.new()
	pm.size = Vector2(80, 80)
	floor_mi.mesh = pm
	var fm := StandardMaterial3D.new()
	fm.albedo_color = Color("#1b0b2b")
	fm.metallic = 0.6
	fm.roughness = 0.28
	floor_mi.material_override = fm
	add_child(floor_mi)

	# mur du fond + néons
	var wall := MeshInstance3D.new()
	var wb := BoxMesh.new()
	wb.size = Vector3(60, 16, 1)
	wall.mesh = wb
	var wm := StandardMaterial3D.new()
	wm.albedo_color = Color("#2a0d45")
	wm.roughness = 0.6
	wall.material_override = wm
	wall.position = Vector3(0, 8, -9)
	add_child(wall)
	var neon_cols := [Color("#b04dff"), Color("#ff3df0"), Color("#5b7bff"), Color("#d23cff")]
	var rng := RandomNumberGenerator.new()
	rng.seed = 42
	for i in 14:
		var n := MeshInstance3D.new()
		var nb := BoxMesh.new()
		var vertical := rng.randf() < 0.5
		nb.size = Vector3(0.08, rng.randf_range(2.0, 7.0), 0.08) if vertical else Vector3(rng.randf_range(2.0, 9.0), 0.08, 0.08)
		n.mesh = nb
		var nm := StandardMaterial3D.new()
		var c: Color = neon_cols[i % neon_cols.size()]
		nm.albedo_color = c
		nm.emission_enabled = true
		nm.emission = c
		nm.emission_energy_multiplier = 4.0
		n.material_override = nm
		n.position = Vector3(rng.randf_range(-18, 18), rng.randf_range(1.0, 9.0), -8.4)
		if not vertical:
			n.rotation.z = rng.randf_range(-0.5, 0.5)
		add_child(n)
	# immeubles néon en arrière-plan
	var bmat := ShaderMaterial.new()
	bmat.shader = load("res://shaders/building.gdshader")
	bmat.set_shader_parameter("night", 1.0)
	bmat.set_shader_parameter("neon", 1.0)
	var mm := MultiMesh.new()
	mm.transform_format = MultiMesh.TRANSFORM_3D
	mm.use_custom_data = true
	mm.mesh = BoxMesh.new()
	mm.instance_count = 10
	for i in 10:
		var h := rng.randf_range(18, 40)
		var w := rng.randf_range(6, 10)
		mm.set_instance_transform(i, Transform3D(Basis().scaled(Vector3(w, h, w)), Vector3(-30 + i * 6.5, h * 0.5, -14 - rng.randf() * 6)))
		mm.set_instance_custom_data(i, Color(0.18, 0.15, 0.22, rng.randf()))
	var mmi := MultiMeshInstance3D.new()
	mmi.multimesh = mm
	mmi.material_override = bmat
	add_child(mmi)

	# plateau tournant
	var plate := MeshInstance3D.new()
	var cm := CylinderMesh.new()
	cm.top_radius = 3.4
	cm.bottom_radius = 3.4
	cm.height = 0.08
	plate.mesh = cm
	var pmat := StandardMaterial3D.new()
	pmat.albedo_color = Color("#140a1f")
	pmat.metallic = 0.8
	pmat.roughness = 0.2
	plate.material_override = pmat
	plate.position.y = 0.04
	add_child(plate)
	var ring := MeshInstance3D.new()
	var tm := TorusMesh.new()
	tm.inner_radius = 3.38
	tm.outer_radius = 3.43
	ring.mesh = tm
	var rm := StandardMaterial3D.new()
	rm.albedo_color = Color("#c25bff")
	rm.emission_enabled = true
	rm.emission = Color("#c25bff")
	rm.emission_energy_multiplier = 2.0
	ring.material_override = rm
	ring.position.y = 0.06
	add_child(ring)

	car_pivot = Node3D.new()
	car_pivot.position.y = 0.08
	add_child(car_pivot)

	var key := SpotLight3D.new()
	key.position = Vector3(2.5, 6.5, 5.0)
	key.light_energy = 18.0
	key.spot_range = 20.0
	key.spot_angle = 35.0
	key.shadow_enabled = true
	add_child(key)
	key.look_at(Vector3(0, 0.5, 0))
	var mag := OmniLight3D.new()
	mag.position = Vector3(-4.5, 2.5, -2.5)
	mag.light_color = Color("#ff3df0")
	mag.light_energy = 6.0
	mag.omni_range = 12.0
	add_child(mag)
	var cyan := OmniLight3D.new()
	cyan.position = Vector3(4.5, 1.8, -1.5)
	cyan.light_color = Color("#4d7bff")
	cyan.light_energy = 5.0
	cyan.omni_range = 12.0
	add_child(cyan)
	var fill := DirectionalLight3D.new()
	fill.rotation_degrees = Vector3(-35, 30, 0)
	fill.light_energy = 0.5
	fill.light_color = Color("#e8d8ff")
	add_child(fill)
	var probe := ReflectionProbe.new()
	probe.size = Vector3(40, 14, 30)
	probe.position = Vector3(0, 3, 0)
	probe.update_mode = ReflectionProbe.UPDATE_ONCE
	add_child(probe)

	cam = Camera3D.new()
	cam.fov = 42.0
	add_child(cam)
	cam.position = Vector3(4.4, 1.45, 5.0)
	cam.look_at(Vector3(0, 0.55, 0))
	cam.current = true


func show_car(id: String) -> void:
	car_pivot.visible = true
	if id == shown_car and car_visual:
		return
	if car_visual:
		car_visual.queue_free()
	shown_car = id
	car_visual = CarVisual.new()
	car_pivot.add_child(car_visual)
	car_visual.setup(id, false, Game.car_state(id).get("paint", ""), false, false)
	car_pivot.rotation.y = deg_to_rad(-160)


func hide_car() -> void:
	car_pivot.visible = false


func _process(delta: float) -> void:
	if not _dragging:
		car_pivot.rotation.y += delta * 0.18
	cam.h_offset = lerp(cam.h_offset, _cam_offset, 1.0 - exp(-4.0 * delta))


# ---------------------------------------------------------------------------
# Structure de l'interface
# ---------------------------------------------------------------------------
func _build_ui() -> void:
	var layer := CanvasLayer.new()
	add_child(layer)
	ui = Control.new()
	ui.set_anchors_preset(Control.PRESET_FULL_RECT)
	ui.theme = K.theme()
	ui.mouse_filter = Control.MOUSE_FILTER_PASS
	ui.gui_input.connect(_on_bg_input)
	layer.add_child(ui)

	bg_shade = TextureRect.new()
	var g := Gradient.new()
	g.set_color(0, Color(0.08, 0.01, 0.16, 0.92))
	g.set_color(1, Color(0.08, 0.01, 0.16, 0.0))
	var gt := GradientTexture2D.new()
	gt.gradient = g
	gt.fill_from = Vector2(0, 0)
	gt.fill_to = Vector2(1, 0)
	(bg_shade as TextureRect).texture = gt
	(bg_shade as TextureRect).expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	K.place(bg_shade, Control.PRESET_LEFT_WIDE, Vector2(0, 0), Vector2(1100, 0))
	bg_shade.mouse_filter = Control.MOUSE_FILTER_IGNORE
	ui.add_child(bg_shade)

	content = Control.new()
	content.set_anchors_preset(Control.PRESET_FULL_RECT)
	content.mouse_filter = Control.MOUSE_FILTER_PASS
	ui.add_child(content)

	# décor : bandes diagonales en haut à gauche
	var deco := Control.new()
	deco.mouse_filter = Control.MOUSE_FILTER_IGNORE
	deco.draw.connect(func():
		for i in 3:
			var o := i * 16.0
			deco.draw_colored_polygon(PackedVector2Array([Vector2(0, 8 + o), Vector2(380 - o * 2, 8 + o), Vector2(370 - o * 2, 14 + o), Vector2(0, 14 + o)]), Color(1, 1, 1, 0.85 - i * 0.25)))
	deco.size = Vector2(400, 60)
	ui.add_child(deco)

	top_left = K.hbox(14)
	top_left.position = Vector2(40, 70)
	ui.add_child(top_left)

	var top := K.hbox(4)
	K.place(top, Control.PRESET_TOP_RIGHT, Vector2(-1000, 0), Vector2(1000, 58))
	top.alignment = BoxContainer.ALIGNMENT_END
	ui.add_child(top)
	var cp := K.panel(Color(0.03, 0.01, 0.06, 0.92), K.SKEW)
	var ch := K.hbox(10)
	ch.add_child(K.icon("coin", 28))
	credits_label = K.label("0", 24, Color.WHITE, "black")
	credits_label.custom_minimum_size = Vector2(130, 0)
	credits_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	ch.add_child(credits_label)
	cp.add_child(ch)
	top.add_child(cp)
	var tp := K.panel(Color(0.03, 0.01, 0.06, 0.92), K.SKEW)
	var th := K.hbox(10)
	th.add_child(K.icon("token", 28))
	tokens_label = K.label("0", 24, Color.WHITE, "black")
	tokens_label.custom_minimum_size = Vector2(100, 0)
	tokens_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	th.add_child(tokens_label)
	tp.add_child(th)
	top.add_child(tp)
	var shop := K.button("BOUTIQUE", 24, "primary", Vector2(190, 52))
	shop.pressed.connect(func(): open("shop"))
	top.add_child(shop)
	var gear := Button.new()
	gear.custom_minimum_size = Vector2(56, 52)
	var gi := K.icon("gear", 30)
	gi.position = Vector2(13, 11)
	gear.add_child(gi)
	gear.pressed.connect(func(): open("settings"))
	top.add_child(gear)
	var home := Button.new()
	home.custom_minimum_size = Vector2(56, 52)
	var hi := K.icon("home", 30)
	hi.position = Vector2(13, 11)
	home.add_child(hi)
	home.pressed.connect(func(): go_home())
	top.add_child(home)
	_refresh_currencies()

	bottom_bar = _build_tabs()
	ui.add_child(bottom_bar)


func _build_tabs() -> Control:
	var bar := PanelContainer.new()
	bar.add_theme_stylebox_override("panel", K.style(Color(0.02, 0.0, 0.05, 0.96)))
	K.place(bar, Control.PRESET_BOTTOM_WIDE, Vector2(0, -122), Vector2(0, 122))
	var h := K.hbox(0)
	bar.add_child(h)
	var lt := K.label("LT", 16, Color(1, 1, 1, 0.6), "black", HORIZONTAL_ALIGNMENT_CENTER)
	lt.custom_minimum_size = Vector2(90, 0)
	h.add_child(lt)
	for t in TABS:
		var b := Button.new()
		b.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		b.custom_minimum_size = Vector2(0, 110)
		b.add_theme_stylebox_override("normal", K.style(Color(0, 0, 0, 0)))
		b.add_theme_stylebox_override("hover", K.style(Color(1, 1, 1, 0.08)))
		b.add_theme_stylebox_override("pressed", K.style(Color(1, 1, 1, 0.15)))
		b.add_theme_stylebox_override("focus", K.style(Color(0, 0, 0, 0), 0, 0.0, K.YELLOW, 3))
		var v := K.vbox(4)
		v.set_anchors_preset(Control.PRESET_FULL_RECT)
		v.alignment = BoxContainer.ALIGNMENT_CENTER
		v.mouse_filter = Control.MOUSE_FILTER_IGNORE
		var icc := CenterContainer.new()
		icc.mouse_filter = Control.MOUSE_FILTER_IGNORE
		icc.add_child(K.icon(t[2], 40, Color.WHITE))
		v.add_child(icc)
		var l := K.label(t[1], 20 if t[1].length() < 14 else 15, Color.WHITE, "black", HORIZONTAL_ALIGNMENT_CENTER)
		l.mouse_filter = Control.MOUSE_FILTER_IGNORE
		v.add_child(l)
		b.add_child(v)
		var badge := K.panel(K.YELLOW)
		badge.add_child(K.label("!", 18, Color(0.1, 0.05, 0.1), "black", HORIZONTAL_ALIGNMENT_CENTER))
		badge.position = Vector2(20, 2)
		badge.visible = false
		badge.mouse_filter = Control.MOUSE_FILTER_IGNORE
		b.add_child(badge)
		b.pressed.connect(func(): _tab(t[0]))
		h.add_child(b)
		tab_buttons[t[0]] = [b, l, badge, icc]
	var rt := K.label("RT", 16, Color(1, 1, 1, 0.6), "black", HORIZONTAL_ALIGNMENT_CENTER)
	rt.custom_minimum_size = Vector2(90, 0)
	h.add_child(rt)
	return bar


func _refresh_tabs() -> void:
	for id in tab_buttons.keys():
		var arr: Array = tab_buttons[id]
		var sel: bool = id == current
		arr[0].add_theme_stylebox_override("normal", K.style(Color(0.97, 0.97, 0.98) if sel else Color(0, 0, 0, 0)))
		arr[1].add_theme_color_override("font_color", Color(0.06, 0.03, 0.1) if sel else Color.WHITE)
		for c in arr[3].get_children():
			c.queue_free()
		var t: Array = TABS.filter(func(x): return x[0] == id)[0]
		arr[3].add_child(K.icon(t[2], 40, Color(0.35, 0.1, 0.6) if sel else Color.WHITE))
	tab_buttons["daily"][2].visible = Game.daily_pending() > 0
	var pass_ready := false
	for tier in range(1, Game.pass_tier() + 1):
		if not tier in Game.save["pass"]["claimed"]:
			pass_ready = true
			break
	tab_buttons["pass"][2].visible = pass_ready


func _tab(id: String) -> void:
	Audio.play("click", -6.0)
	if id == "home":
		go_home()
	else:
		stack = [["home", {}]]
		open(id, {}, false)


func _refresh_currencies() -> void:
	credits_label.text = K.fmt_int(Game.credits())
	tokens_label.text = K.fmt_int(Game.tokens())


func _on_bg_input(e: InputEvent) -> void:
	if e is InputEventMouseButton and e.button_index == MOUSE_BUTTON_LEFT:
		_dragging = e.pressed
	elif e is InputEventMouseMotion and _dragging:
		car_pivot.rotation.y += e.relative.x * 0.008


func _notification(what: int) -> void:
	if what == NOTIFICATION_WM_GO_BACK_REQUEST:
		if overlay:
			_close_overlay()
		elif current != "home":
			back()
		else:
			get_tree().quit()


func _unhandled_input(e: InputEvent) -> void:
	if e.is_action_pressed("ui_cancel"):
		if overlay:
			_close_overlay()
		else:
			back()
	elif e.is_action_pressed("tab_next") or e.is_action_pressed("tab_prev"):
		var d := 1 if e.is_action_pressed("tab_next") else -1
		if current == "career":
			career_chapter = clampi(career_chapter + d, 0, Game.CHAPTERS.size() - 1)
			open("career", {"chapter": career_chapter}, false)
			return
		var ids := TABS.map(func(t): return t[0])
		var idx := ids.find(current)
		if idx >= 0:
			_tab(ids[(idx + d + ids.size()) % ids.size()])


# ---------------------------------------------------------------------------
# Navigation
# ---------------------------------------------------------------------------
func open(screen: String, a: Dictionary = {}, push := true) -> void:
	if push and current != "":
		stack.append([current, args])
	_close_overlay()
	current = screen
	args = a
	for c in content.get_children():
		c.queue_free()
	for c in top_left.get_children():
		c.queue_free()
	var is_tab := TABS.any(func(t): return t[0] == screen)
	bottom_bar.visible = is_tab
	bg_shade.visible = true
	_cam_offset = -1.6
	if screen != "home":
		var back_b := K.button("◀", 26, "white", Vector2(70, 56))
		back_b.pressed.connect(back)
		top_left.add_child(back_b)
	match screen:
		"home":
			_screen_home()
		"career":
			_screen_career(a)
		"season_map":
			_screen_season_map(a)
		"car_select":
			_screen_car_select(a)
		"car_detail":
			_screen_car_detail(a)
		"garage":
			_screen_garage(a)
		"shop":
			_screen_shop()
		"events":
			_screen_events()
		"daily":
			_screen_daily()
		"pass":
			_screen_pass()
		"multi":
			_screen_multi()
		"profile":
			_screen_profile()
		"settings":
			_screen_settings()
		_:
			_screen_home()
	_refresh_tabs()
	_focus_first(content)


func back() -> void:
	Audio.play("click", -6.0)
	if stack.is_empty():
		if current != "home":
			open("home", {}, false)
		return
	var prev: Array = stack.pop_back()
	open(prev[0], prev[1], false)


func go_home() -> void:
	stack.clear()
	open("home", {}, false)


func _focus_first(n: Node) -> void:
	await get_tree().process_frame
	if not is_inside_tree() or not is_instance_valid(n):
		return
	var b := _find_button(n)
	if b and is_instance_valid(b):
		b.grab_focus()


func _find_button(n: Node) -> Button:
	for c in n.get_children():
		if c is Button and c.visible and not c.disabled:
			return c
		var r := _find_button(c)
		if r:
			return r
	return null


func _title(t1: String, t2: String = "") -> void:
	var v := K.vbox(0)
	v.add_child(K.outlined(K.label(t1, 46, Color.WHITE, "black"), 4))
	if t2 != "":
		v.add_child(K.label(t2, 20, Color(1, 1, 1, 0.85), "semi"))
	top_left.add_child(v)


func _full_bg(alpha: float = 0.9) -> void:
	var r := ColorRect.new()
	r.color = Color(0.09, 0.02, 0.17, alpha)
	r.set_anchors_preset(Control.PRESET_FULL_RECT)
	r.mouse_filter = Control.MOUSE_FILTER_IGNORE
	content.add_child(r)
	content.move_child(r, 0)


# ---------------------------------------------------------------------------
# ACCUEIL
# ---------------------------------------------------------------------------
func _screen_home() -> void:
	show_car(Game.save["selected_car"])
	_cam_offset = -1.7
	var name_box := K.hbox(8)
	name_box.add_child(K.icon("user", 26))
	name_box.add_child(K.label(Game.save["name"], 28, Color.WHITE, "bold"))
	top_left.add_child(name_box)

	var cards := K.vbox(18)
	cards.position = Vector2(150, 150)
	content.add_child(cards)
	var pending := Game.daily_pending()
	cards.add_child(_home_card("OBJECTIFS QUOTIDIENS", "DÉFIS ET PARRAINAGE", "", pending > 0, func(): open("daily")))
	var owned := Game.owned_cars().size()
	cards.add_child(_home_card("GARAGE", "%d VOITURE%s" % [owned, "S" if owned > 1 else ""], "NIV%d" % (1 + owned / 4), false, func(): open("garage")))
	cards.add_child(_home_card("PROFIL", "ET MESSAGERIE", "", false, func(): open("profile")))

	# voiture sélectionnée + course rapide
	var c := Game.car_def(Game.save["selected_car"])
	var info := K.vbox(4)
	K.place(info, Control.PRESET_BOTTOM_RIGHT, Vector2(-640, -330), Vector2(600, 190))
	info.alignment = BoxContainer.ALIGNMENT_END
	content.add_child(info)
	var hb := K.hbox(12)
	hb.alignment = BoxContainer.ALIGNMENT_END
	var nm := K.vbox(-6)
	nm.add_child(K.outlined(K.label(c["brand"], 22, Color(1, 1, 1, 0.85), "semi", HORIZONTAL_ALIGNMENT_RIGHT), 4))
	nm.add_child(K.outlined(K.label(c["model"], 38, Color.WHITE, "black", HORIZONTAL_ALIGNMENT_RIGHT), 5))
	hb.add_child(nm)
	hb.add_child(K.class_badge(c["class"], 54))
	info.add_child(hb)
	var hb2 := K.hbox(10)
	hb2.alignment = BoxContainer.ALIGNMENT_END
	var rk := K.panel(Color(0.03, 0.01, 0.06, 0.9), K.SKEW)
	rk.add_child(K.label("RANG %d" % Game.car_rank(c["id"]), 24, K.LIME, "black"))
	hb2.add_child(rk)
	var play := K.button("COURSE RAPIDE", 30, "primary", Vector2(330, 74))
	play.pressed.connect(func(): open("car_select", {"req": Game.quick_race_request(), "any_class": true}))
	hb2.add_child(play)
	info.add_child(hb2)


func _home_card(title: String, sub: String, right: String, alert: bool, cb: Callable) -> Button:
	var b := Button.new()
	b.custom_minimum_size = Vector2(480, 160)
	b.add_theme_stylebox_override("normal", K.style(Color(0.33, 0.1, 0.62, 0.72)))
	b.add_theme_stylebox_override("hover", K.style(Color(0.42, 0.14, 0.75, 0.85), 0, 0.0, Color.WHITE, 3))
	b.add_theme_stylebox_override("focus", K.style(Color(0, 0, 0, 0), 0, 0.0, Color(1, 1, 1, 0.9), 4))
	b.add_theme_stylebox_override("pressed", K.style(Color(0.5, 0.2, 0.85, 0.9)))
	var v := K.vbox(-4)
	v.position = Vector2(18, 74)
	v.mouse_filter = Control.MOUSE_FILTER_IGNORE
	v.add_child(K.outlined(K.label(title, 32, Color.WHITE, "black"), 4))
	v.add_child(K.label(sub, 18, Color(1, 1, 1, 0.85), "semi"))
	b.add_child(v)
	if right != "":
		var r := K.label(right, 34, Color.WHITE, "black", HORIZONTAL_ALIGNMENT_RIGHT)
		r.position = Vector2(300, 98)
		r.size = Vector2(160, 50)
		b.add_child(r)
	if alert:
		var a := K.panel(K.YELLOW)
		a.add_child(K.label("!", 20, Color(0.1, 0.05, 0.1), "black", HORIZONTAL_ALIGNMENT_CENTER))
		a.position = Vector2(430, 8)
		a.mouse_filter = Control.MOUSE_FILTER_IGNORE
		b.add_child(a)
	b.pressed.connect(func():
		Audio.play("click", -6.0)
		cb.call())
	return b


# ---------------------------------------------------------------------------
# CARRIÈRE : chapitres et saisons
# ---------------------------------------------------------------------------
func _screen_career(a: Dictionary) -> void:
	hide_car()
	career_chapter = int(a.get("chapter", career_chapter))
	var ch: Dictionary = Game.CHAPTERS[career_chapter]
	_full_bg(0.96)
	# panneau gauche : visuel du chapitre
	var hero_car: String = ch["seasons"][ch["seasons"].size() - 1]["reward_car"]
	var img := K.thumb(hero_car)
	img.position = Vector2(0, 60)
	img.size = Vector2(760, 860)
	img.modulate = Color(1, 1, 1, 0.85)
	content.add_child(img)
	var shade := ColorRect.new()
	shade.color = Color(0.1, 0.0, 0.2, 0.35)
	shade.position = img.position
	shade.size = img.size
	shade.mouse_filter = Control.MOUSE_FILTER_IGNORE
	content.add_child(shade)
	var hv := K.vbox(0)
	hv.position = Vector2(60, 150)
	content.add_child(hv)
	hv.add_child(K.outlined(K.label("%02d" % (career_chapter + 1), 120, Color.WHITE, "black"), 8))
	var words: PackedStringArray = ch["title"].split(" ")
	hv.add_child(K.outlined(K.label(" ".join(words.slice(0, max(1, words.size() - 1))), 44, Color.WHITE, "bold"), 6))
	hv.add_child(K.outlined(K.label(words[words.size() - 1], 52, Color.WHITE, "black"), 6))
	var cp := K.panel(Color(0.25, 0.05, 0.45, 0.9), K.SKEW)
	cp.add_child(K.label("CHAPITRE %d  ·  CLASSE %s" % [career_chapter + 1, ch["class"]], 26, K.MAGENTA.lightened(0.3), "black"))
	hv.add_child(cp)
	if not Game.chapter_unlocked(career_chapter):
		var lk := K.panel(Color(0.5, 0.05, 0.1, 0.9), K.SKEW)
		lk.add_child(K.label("VERROUILLÉ : %d DRAPEAUX REQUIS" % int(ch["flags_needed"]), 22, Color.WHITE, "black"))
		hv.add_child(lk)

	# grille des saisons
	var grid := GridContainer.new()
	grid.columns = 3
	grid.add_theme_constant_override("h_separation", 22)
	grid.add_theme_constant_override("v_separation", 22)
	grid.position = Vector2(820, 160)
	content.add_child(grid)
	for si in ch["seasons"].size():
		grid.add_child(_season_tile(career_chapter, si))

	# bas : drapeaux, sélecteur de chapitre
	var bottom := K.hbox(24)
	K.place(bottom, Control.PRESET_BOTTOM_WIDE, Vector2(80, -215), Vector2(-160, 70))
	content.add_child(bottom)
	var total_possible := 0
	for c in Game.CHAPTERS:
		total_possible += c["seasons"].size() * 6
	var fp := K.panel(Color(0.03, 0.01, 0.06, 0.9), K.SKEW)
	var fh := K.hbox(10)
	fh.add_child(K.icon("flag", 28))
	fh.add_child(K.label("%d/%d" % [Game.total_flags(), total_possible], 26, K.LIME, "black"))
	fh.add_child(K.icon("plan", 28))
	var plans_total := 0
	for cid in Game.save["cars"].keys():
		plans_total += int(Game.save["cars"][cid]["plans"])
	fh.add_child(K.label("%d PLANS EN STOCK" % plans_total, 22, Color.WHITE, "black"))
	fp.add_child(fh)
	bottom.add_child(fp)
	bottom.add_child(K.spacer())
	bottom.add_child(K.label("LT", 18, Color(1, 1, 1, 0.6), "black"))
	for i in Game.CHAPTERS.size():
		var b := K.button("%02d" % (i + 1), 24, "primary" if i == career_chapter else "secondary", Vector2(80, 54))
		if not Game.chapter_unlocked(i):
			b.modulate = Color(1, 1, 1, 0.5)
		b.pressed.connect(func(): open("career", {"chapter": i}, false))
		bottom.add_child(b)
	bottom.add_child(K.label("RT", 18, Color(1, 1, 1, 0.6), "black"))
	var pct := 0.0
	var chapter_total: int = ch["seasons"].size() * 6
	var chapter_flags := 0
	for si in ch["seasons"].size():
		chapter_flags += Game.season_flags(career_chapter, si)
	pct = 100.0 * chapter_flags / max(1, chapter_total)
	bottom.add_child(K.label("%d%%" % int(pct), 28, Color.WHITE, "black"))


func _season_tile(ch_idx: int, si: int) -> Button:
	var se: Dictionary = Game.CHAPTERS[ch_idx]["seasons"][si]
	var unlocked := Game.season_unlocked(ch_idx, si)
	var flags := Game.season_flags(ch_idx, si)
	var b := Button.new()
	b.custom_minimum_size = Vector2(300, 300)
	var col := Color(0.62, 0.12, 0.85, 0.95) if unlocked else Color(0.35, 0.08, 0.5, 0.8)
	b.add_theme_stylebox_override("normal", K.style(col))
	b.add_theme_stylebox_override("hover", K.style(col.lightened(0.12), 0, 0.0, Color.WHITE, 4))
	b.add_theme_stylebox_override("focus", K.style(Color(0, 0, 0, 0), 0, 0.0, Color.WHITE, 5))
	b.add_theme_stylebox_override("pressed", K.style(col.darkened(0.1)))
	var thumb := K.thumb(se["reward_car"])
	thumb.position = Vector2(10, 10)
	thumb.size = Vector2(280, 158)
	thumb.modulate = Color(1, 1, 1, 0.9 if unlocked else 0.3)
	b.add_child(thumb)
	var badge := K.label(se["badge"], 30, Color.WHITE, "black", HORIZONTAL_ALIGNMENT_CENTER)
	K.outlined(badge, 6, Color(0.2, 0.0, 0.3, 0.8))
	badge.position = Vector2(0, 168)
	badge.size = Vector2(300, 46)
	b.add_child(badge)
	var nm := K.label(se["name"], 20, Color(1, 1, 1, 0.9), "semi", HORIZONTAL_ALIGNMENT_CENTER)
	nm.position = Vector2(0, 208)
	nm.size = Vector2(300, 30)
	b.add_child(nm)
	var fl := K.hbox(6)
	fl.position = Vector2(16, 252)
	fl.add_child(K.icon("flag", 24))
	fl.add_child(K.label("%d/6" % flags, 22, K.LIME if flags == 6 else Color.WHITE, "black"))
	b.add_child(fl)
	for c in [thumb, badge, nm, fl]:
		c.mouse_filter = Control.MOUSE_FILTER_IGNORE
	if not unlocked:
		var lk := K.icon("lock", 40)
		lk.position = Vector2(244, 244)
		b.add_child(lk)
	elif flags == 0:
		var nw := K.panel(K.LIME, K.SKEW)
		nw.add_child(K.label("NOUVEAU", 20, Color(0.05, 0.05, 0.05), "black"))
		nw.position = Vector2(150, 250)
		nw.mouse_filter = Control.MOUSE_FILTER_IGNORE
		b.add_child(nw)
	b.pressed.connect(func():
		if unlocked:
			Audio.play("click", -6.0)
			open("season_map", {"chapter": ch_idx, "season": si})
		else:
			K.toast(ui, "SAISON VERROUILLÉE : 3 DRAPEAUX REQUIS DANS LA SAISON PRÉCÉDENTE", K.RED))
	return b


# ---------------------------------------------------------------------------
# CARTE DE SAISON
# ---------------------------------------------------------------------------
func _screen_season_map(a: Dictionary) -> void:
	hide_car()
	var ch_idx: int = a.get("chapter", 0)
	var se_idx: int = a.get("season", 0)
	var se: Dictionary = Game.CHAPTERS[ch_idx]["seasons"][se_idx]
	var races := Game.season_races(ch_idx, se_idx)
	var sel: int = a.get("selected", -1)
	if sel < 0:
		sel = 0
		for r in races:
			if not Game.race_flag(r["id"]) and Game.season_flags(ch_idx, se_idx) >= int(r["flags_required"]):
				sel = r["index"]
				break
	_full_bg(1.0)
	# fond de carte : rues stylisées
	var map := Control.new()
	map.set_anchors_preset(Control.PRESET_FULL_RECT)
	map.mouse_filter = Control.MOUSE_FILTER_IGNORE
	var rng := RandomNumberGenerator.new()
	rng.seed = hash(se["name"])
	var lines := []
	for i in 70:
		var p := Vector2(rng.randf_range(0, 1920), rng.randf_range(60, 1080))
		var d := Vector2.from_angle(rng.randf() * TAU) * rng.randf_range(80, 420)
		lines.append([p, p + d, rng.randf_range(1.0, 4.0)])
	var node_pos := [Vector2(250, 640), Vector2(560, 440), Vector2(330, 230), Vector2(800, 260), Vector2(980, 520), Vector2(700, 760)]
	map.draw.connect(func():
		for l in lines:
			map.draw_line(l[0], l[1], Color(0.45, 0.25, 0.7, 0.35), l[2])
		for i in range(node_pos.size() - 1):
			var p0: Vector2 = node_pos[i] + Vector2(110, 70)
			var p1: Vector2 = node_pos[i + 1] + Vector2(110, 70)
			var dist := p0.distance_to(p1)
			var n_d := int(dist / 22.0)
			for k in n_d:
				if k % 2 == 0:
					map.draw_line(p0.lerp(p1, float(k) / n_d), p0.lerp(p1, float(k + 1) / n_d), Color(0.85, 0.75, 1.0, 0.7), 3.0))
	content.add_child(map)
	_title(se["name"], "CHAPITRE %d · CLASSE %s" % [ch_idx + 1, Game.CHAPTERS[ch_idx]["class"]])

	var flags := Game.season_flags(ch_idx, se_idx)
	for r in races:
		var i: int = r["index"]
		var locked := flags < int(r["flags_required"])
		var b := Button.new()
		b.custom_minimum_size = Vector2(240, 150)
		b.position = node_pos[i]
		var selected := i == sel
		var col := Color(0.25, 0.08, 0.4, 0.95)
		b.add_theme_stylebox_override("normal", K.style(col, 0, 0.0, Color.WHITE if selected else Color(1, 1, 1, 0.25), 4 if selected else 2))
		b.add_theme_stylebox_override("hover", K.style(col.lightened(0.1), 0, 0.0, K.YELLOW, 3))
		b.add_theme_stylebox_override("focus", K.style(Color(0, 0, 0, 0), 0, 0.0, K.YELLOW, 4))
		b.add_theme_stylebox_override("pressed", K.style(col))
		var num := K.outlined(K.label("%02d" % (i + 1), 44, Color.WHITE, "black"), 5)
		num.position = Vector2(12, 0)
		num.mouse_filter = Control.MOUSE_FILTER_IGNORE
		b.add_child(num)
		var loc := K.label(r["name"], 20, Color.WHITE, "black")
		loc.position = Vector2(12, 58)
		loc.mouse_filter = Control.MOUSE_FILTER_IGNORE
		b.add_child(loc)
		var md := K.label("CONTRE-LA-MONTRE" if r["mode"] == "time_attack" else "COURSE CLASSIQUE", 15, Color(1, 1, 1, 0.75), "semi")
		md.position = Vector2(12, 86)
		md.mouse_filter = Control.MOUSE_FILTER_IGNORE
		b.add_child(md)
		if not r["reward"]["plans"].is_empty():
			var pc: String = r["reward"]["plans"].keys()[0]
			var th := K.thumb(pc)
			th.position = Vector2(150, 8)
			th.size = Vector2(80, 50)
			b.add_child(th)
		if locked:
			var req := K.panel(Color(0.85, 0.08, 0.12, 0.95))
			var rh := K.hbox(6)
			rh.add_child(K.label("REQUIS : %d" % int(r["flags_required"]), 17, Color.WHITE, "black"))
			rh.add_child(K.icon("flag", 18))
			req.add_child(rh)
			req.position = Vector2(12, 112)
			req.mouse_filter = Control.MOUSE_FILTER_IGNORE
			b.add_child(req)
		elif Game.race_flag(r["id"]):
			var ok := K.hbox(6)
			ok.add_child(K.icon("flag", 22, K.LIME))
			ok.add_child(K.label("TERMINÉE", 17, K.LIME, "black"))
			ok.position = Vector2(12, 114)
			ok.mouse_filter = Control.MOUSE_FILTER_IGNORE
			b.add_child(ok)
		b.pressed.connect(func():
			Audio.play("click", -6.0)
			open("season_map", {"chapter": ch_idx, "season": se_idx, "selected": i}, false))
		content.add_child(b)

	# bas gauche : drapeaux de saison
	var fb := K.hbox(0)
	K.place(fb, Control.PRESET_BOTTOM_LEFT, Vector2(80, -130), Vector2(460, 90))
	var bdg := K.panel(Color(0.62, 0.12, 0.85))
	bdg.custom_minimum_size = Vector2(90, 90)
	bdg.add_child(K.label(se["badge"].substr(0, 6), 18, Color.WHITE, "black", HORIZONTAL_ALIGNMENT_CENTER))
	fb.add_child(bdg)
	var fp := K.panel(Color(0.03, 0.01, 0.06, 0.92))
	var fv := K.vbox(0)
	var t1 := K.hbox(6)
	t1.add_child(K.label("DRAPEAUX", 24, Color.WHITE, "black"))
	t1.add_child(K.label("DE SAISON", 24, Color.WHITE, "semi"))
	fv.add_child(t1)
	var t2 := K.hbox(8)
	t2.add_child(K.icon("flag", 26))
	t2.add_child(K.label("%d/6" % flags, 28, K.LIME, "black"))
	fv.add_child(t2)
	fp.add_child(fv)
	fb.add_child(fp)
	content.add_child(fb)

	# panneau de droite
	var race: Dictionary = races[sel]
	var locked_sel := flags < int(race["flags_required"])
	var side := K.vbox(14)
	K.place(side, Control.PRESET_RIGHT_WIDE, Vector2(-560, 120), Vector2(500, -260))
	content.add_child(side)
	var oh := K.panel(Color(0.97, 0.97, 0.97), K.SKEW)
	var ohh := K.hbox(6)
	ohh.add_child(K.label("OBJECTIFS", 26, Color(0.05, 0.03, 0.1), "black"))
	ohh.add_child(K.label("DE COURSE", 26, Color(0.05, 0.03, 0.1), "semi"))
	oh.add_child(ohh)
	side.add_child(oh)
	var op := K.panel(Color(0.03, 0.01, 0.06, 0.9))
	var objv := K.vbox(6)
	var oc := CenterContainer.new()
	oc.add_child(K.icon("flag", 34, K.LIME if Game.race_flag(race["id"]) else Color.WHITE))
	objv.add_child(oc)
	objv.add_child(K.label(Game.objective_text(race["objective"]), 22, Color(1, 1, 1, 0.9), "black", HORIZONTAL_ALIGNMENT_CENTER))
	op.add_child(objv)
	side.add_child(op)
	side.add_child(K.outlined(K.label("RÉCOMPENSES", 28, Color.WHITE, "black"), 4))
	var rw := K.hbox(14)
	rw.alignment = BoxContainer.ALIGNMENT_CENTER
	if not race["reward"]["plans"].is_empty() and not Game.race_flag(race["id"]):
		for cid in race["reward"]["plans"].keys():
			rw.add_child(_plan_card(cid, int(race["reward"]["plans"][cid])))
	else:
		var cr := K.panel(Color(0.03, 0.01, 0.06, 0.9))
		cr.custom_minimum_size = Vector2(250, 120)
		var crv := K.vbox(4)
		var cc := CenterContainer.new()
		cc.add_child(K.icon("coin", 50))
		crv.add_child(cc)
		crv.add_child(K.label(K.fmt_int(int(race["reward"]["credits"])), 28, Color.WHITE, "black", HORIZONTAL_ALIGNMENT_CENTER))
		cr.add_child(crv)
		rw.add_child(cr)
	side.add_child(rw)
	var rr := K.panel(K.LIME, K.SKEW)
	rr.add_child(K.label("RANG RECOMMANDÉ : %d" % int(race["rec_rank"]), 24, Color(0.05, 0.05, 0.05), "black", HORIZONTAL_ALIGNMENT_CENTER))
	side.add_child(rr)
	var nxt := K.button("SUIVANT" if not locked_sel else "VERROUILLÉE", 36, "primary", Vector2(500, 90))
	nxt.disabled = locked_sel
	nxt.pressed.connect(func():
		Audio.play("confirm", -4.0)
		open("car_select", {"req": race}))
	side.add_child(nxt)
	nxt.call_deferred("grab_focus")


func _plan_card(car_id: String, n: int) -> Control:
	var c := Game.car_def(car_id)
	var p := K.panel(Color(0.97, 0.97, 0.98))
	p.custom_minimum_size = Vector2(230, 0)
	var v := K.vbox(2)
	var top := Control.new()
	top.custom_minimum_size = Vector2(210, 130)
	var th := K.thumb(car_id)
	th.position = Vector2(0, 0)
	th.size = Vector2(210, 130)
	top.add_child(th)
	var tag := K.panel(K.LIME, K.SKEW)
	tag.add_child(K.label("PLAN x%d" % n, 18, Color(0.05, 0.05, 0.05), "black"))
	tag.position = Vector2(110, 4)
	top.add_child(tag)
	var bd := K.class_badge(c["class"], 40)
	bd.position = Vector2(4, 86)
	top.add_child(bd)
	v.add_child(top)
	v.add_child(K.label(c["brand"], 16, Color(0.2, 0.2, 0.25), "semi"))
	v.add_child(K.label(c["model"], 20, Color(0.05, 0.03, 0.1), "black"))
	p.add_child(v)
	return p


# ---------------------------------------------------------------------------
# SÉLECTION DE VOITURE
# ---------------------------------------------------------------------------
func _screen_car_select(a: Dictionary) -> void:
	hide_car()
	_full_bg(0.97)
	_title("SÉLECTION DE VOITURE", "CHOISIS TA VOITURE POUR CETTE COURSE.")
	var req: Dictionary = a.get("req", {})
	var cls: String = req.get("class", "")
	var any_class: bool = a.get("any_class", false) or cls == ""
	var list: Array = Game.cars.duplicate()
	if not any_class:
		list = Game.cars_of_class(cls)
	list.sort_custom(func(x, y):
		var ox := Game.is_owned(x["id"])
		var oy := Game.is_owned(y["id"])
		if ox != oy:
			return ox
		var cx := Game.CLASS_ORDER.find(x["class"])
		var cy := Game.CLASS_ORDER.find(y["class"])
		if cx != cy:
			return cx < cy
		return int(x["rank"][0]) < int(y["rank"][0]))
	var hdr := K.hbox(14)
	K.place(hdr, Control.PRESET_TOP_RIGHT, Vector2(-760, 100), Vector2(700, 60))
	hdr.alignment = BoxContainer.ALIGNMENT_END
	content.add_child(hdr)
	if req.has("rec_rank"):
		var rr := K.panel(K.LIME, K.SKEW)
		rr.add_child(K.label("RANG RECOMMANDÉ : %d" % int(req["rec_rank"]), 24, Color(0.05, 0.05, 0.05), "black"))
		hdr.add_child(rr)
	if not any_class:
		var cp := K.panel(Color(0.03, 0.01, 0.06, 0.9), K.SKEW)
		cp.add_child(K.label("CLASSE %s UNIQUEMENT" % cls, 22, Game.class_color(cls), "black"))
		hdr.add_child(cp)
	_car_grid(list, func(id): _on_car_pick(id, req, "race"), Vector2(70, 190))


func _car_grid(list: Array, cb: Callable, pos: Vector2) -> void:
	var sc := ScrollContainer.new()
	K.place(sc, Control.PRESET_FULL_RECT, pos, Vector2(-pos.x * 2.0, -pos.y - 40))
	sc.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_AUTO
	sc.vertical_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	content.add_child(sc)
	var grid := GridContainer.new()
	var rows := 2
	grid.columns = int(ceil(list.size() / float(rows)))
	grid.add_theme_constant_override("h_separation", 20)
	grid.add_theme_constant_override("v_separation", 20)
	sc.add_child(grid)
	# ordre colonne par colonne pour 2 rangées
	var cols: int = grid.columns
	for r in rows:
		for c in cols:
			var idx := c * rows + r
			if idx < list.size():
				grid.add_child(_car_card(list[idx]["id"], cb))
			else:
				var sp := Control.new()
				sp.custom_minimum_size = Vector2(560, 300)
				grid.add_child(sp)


func _car_card(id: String, cb: Callable) -> Button:
	var c := Game.car_def(id)
	var st := Game.car_state(id)
	var owned: bool = st["owned"]
	var ready := Game.ready_to_unlock(id)
	var b := Button.new()
	b.custom_minimum_size = Vector2(560, 300)
	var col := Color(0.32, 0.1, 0.55, 0.95) if owned or ready else Color(0.22, 0.08, 0.36, 0.7)
	b.add_theme_stylebox_override("normal", K.style(col))
	b.add_theme_stylebox_override("hover", K.style(col.lightened(0.1), 0, 0.0, Color.WHITE, 3))
	b.add_theme_stylebox_override("focus", K.style(Color(0, 0, 0, 0), 0, 0.0, Color.WHITE, 4))
	b.add_theme_stylebox_override("pressed", K.style(col.darkened(0.1)))
	var th := K.thumb(id)
	th.position = Vector2(8, 46)
	th.size = Vector2(340, 192)
	th.modulate = Color(1, 1, 1, 1.0 if owned or ready else 0.45)
	b.add_child(th)
	var rank_box := K.hbox(6)
	rank_box.position = Vector2(14, 8)
	var rp := K.panel(Color(0.02, 0.01, 0.05, 0.9))
	var rkh := K.hbox(0)
	rkh.add_child(K.label(str(Game.car_rank(id)), 22, K.LIME if owned else Color(1, 1, 1, 0.6), "black"))
	rkh.add_child(K.label("/%d" % Game.car_max_rank(id), 18, Color(1, 1, 1, 0.7), "black"))
	rp.add_child(rkh)
	rank_box.add_child(rp)
	rank_box.add_child(K.class_badge(c["class"], 32))
	b.add_child(rank_box)
	var stars := K.stars_row(int(st["stars"]) if owned else 0, Game.max_stars(id), 20)
	stars.position = Vector2(16, 40)
	b.add_child(stars)
	var nm := K.vbox(-6)
	nm.position = Vector2(16, 230)
	nm.add_child(K.outlined(K.label(c["brand"], 17, Color(1, 1, 1, 0.85), "semi"), 3))
	nm.add_child(K.outlined(K.label(c["model"], 24, Color.WHITE, "black"), 4))
	b.add_child(nm)
	# carte plan
	var pc := K.panel(Color(0.97, 0.97, 0.98))
	pc.position = Vector2(370, 14)
	pc.custom_minimum_size = Vector2(176, 190)
	var pv := K.vbox(0)
	var pth := K.thumb(id)
	pth.custom_minimum_size = Vector2(150, 100)
	pv.add_child(pth)
	pv.add_child(K.label("PLAN", 15, Color(0.4, 0.1, 0.6), "black"))
	pv.add_child(K.label(c["model"], 15, Color(0.05, 0.03, 0.1), "black"))
	pc.add_child(pv)
	b.add_child(pc)
	var need := Game.plans_needed(id)
	var ph := K.hbox(6)
	ph.position = Vector2(372, 214)
	ph.add_child(K.icon("plan", 24))
	ph.add_child(K.label("%d/%d" % [int(st["plans"]), need] if need > 0 else "MAX", 22, Color.WHITE, "black"))
	b.add_child(ph)
	var pb := K.progress(float(st["plans"]), float(max(need, 1)), K.YELLOW, 6)
	pb.position = Vector2(372, 250)
	pb.size = Vector2(170, 6)
	b.add_child(pb)
	if ready:
		var rt := K.panel(K.LIME, K.SKEW)
		rt.add_child(K.label("PRÊTE À DÉBLOQUER", 18, Color(0.05, 0.05, 0.05), "black"))
		rt.position = Vector2(14, 72)
		b.add_child(rt)
	elif not owned:
		var lk := K.icon("lock", 40)
		lk.position = Vector2(300, 230)
		b.add_child(lk)
	if id == Game.save["selected_car"]:
		var sel := K.panel(K.YELLOW, K.SKEW)
		sel.add_child(K.label("SÉLECTIONNÉE", 15, Color(0.05, 0.05, 0.05), "black"))
		sel.position = Vector2(200, 8)
		b.add_child(sel)
	for ch in b.get_children():
		if ch is Control:
			ch.mouse_filter = Control.MOUSE_FILTER_IGNORE
	b.pressed.connect(func():
		Audio.play("click", -6.0)
		cb.call(id))
	return b


func _on_car_pick(id: String, req: Dictionary, mode: String) -> void:
	if Game.is_owned(id):
		open("car_detail", {"car": id, "req": req, "mode": mode})
	elif Game.ready_to_unlock(id):
		Game.unlock_car(id)
		Audio.play("star")
		K.toast(ui, "%s DÉBLOQUÉE !" % Game.car_display_name(id), K.LIME)
		open(current, args, false)
	else:
		_overlay_locked_car(id)


func _overlay_locked_car(id: String) -> void:
	var c := Game.car_def(id)
	var cls: Dictionary = Game.classes[c["class"]]
	var p := _open_overlay("VOITURE VERROUILLÉE")
	p.add_child(K.label(Game.car_display_name(id), 30, Color.WHITE, "black"))
	p.add_child(K.label("Plans : %d / %d  —  gagne des plans en carrière et dans le Pass." % [int(Game.car_state(id)["plans"]), Game.plans_needed(id)], 20, Color(1, 1, 1, 0.85), "semi"))
	var h := K.hbox(16)
	var b1 := K.button("ACHETER  %s CR" % K.fmt_int(int(cls["credits"])), 22, "primary", Vector2(330, 64))
	b1.disabled = Game.credits() < int(cls["credits"])
	b1.pressed.connect(func():
		if Game.buy_car(id, false):
			Audio.play("star")
			_close_overlay()
			K.toast(ui, "%s AJOUTÉE AU GARAGE" % Game.car_display_name(id), K.LIME)
			open(current, args, false))
	h.add_child(b1)
	var b2 := K.button("ACHETER  %d JETONS" % int(cls["tokens"]), 22, "purple", Vector2(330, 64))
	b2.disabled = Game.tokens() < int(cls["tokens"])
	b2.pressed.connect(func():
		if Game.buy_car(id, true):
			Audio.play("star")
			_close_overlay()
			K.toast(ui, "%s AJOUTÉE AU GARAGE" % Game.car_display_name(id), K.LIME)
			open(current, args, false))
	h.add_child(b2)
	p.add_child(h)


# ---------------------------------------------------------------------------
# FICHE VOITURE
# ---------------------------------------------------------------------------
func _screen_car_detail(a: Dictionary) -> void:
	var id: String = a.get("car", Game.save["selected_car"])
	var req: Dictionary = a.get("req", {})
	var mode: String = a.get("mode", "garage")
	show_car(id)
	_cam_offset = -1.2
	var c := Game.car_def(id)
	var st := Game.car_state(id)
	var left := K.vbox(10)
	left.position = Vector2(70, 140)
	content.add_child(left)
	var head := K.hbox(14)
	var pc := K.panel(Color(0.97, 0.97, 0.98))
	var pth := K.thumb(id)
	pth.custom_minimum_size = Vector2(120, 80)
	pc.add_child(pth)
	head.add_child(pc)
	var hv := K.vbox(-4)
	hv.add_child(K.outlined(K.label(c["brand"], 26, Color.WHITE, "semi"), 4))
	hv.add_child(K.outlined(K.label(c["model"], 46, Color.WHITE, "black"), 5))
	var sr := K.hbox(10)
	sr.add_child(K.stars_row(int(st["stars"]), Game.max_stars(id), 24))
	var need := Game.plans_needed(id)
	var pp := K.panel(Color(0.03, 0.01, 0.06, 0.85))
	var pph := K.hbox(6)
	pph.add_child(K.icon("plan", 22))
	pph.add_child(K.label("%d/%d" % [int(st["plans"]), need] if need > 0 else "MAX", 20, Color.WHITE, "black"))
	pp.add_child(pph)
	sr.add_child(pp)
	hv.add_child(sr)
	head.add_child(hv)
	left.add_child(head)
	left.add_child(Control.new())
	var names := ["VITESSE MAX", "ACCÉLÉRATION", "MANIABILITÉ", "NITRO"]
	var icons := ["timer", "bolt", "car", "chevron"]
	for i in 4:
		var row := K.hbox(14)
		row.add_child(K.icon(icons[i], 32))
		var col := K.vbox(4)
		var top := K.hbox(10)
		var l := K.outlined(K.label(names[i], 28, Color.WHITE, "black"), 4)
		l.custom_minimum_size = Vector2(290, 0)
		top.add_child(l)
		if int(st["upg"][i]) < Game.level_cap(id):
			top.add_child(K.icon("chevron", 24, K.LIME))
		top.add_child(K.outlined(K.label("%.1f" % Game.stat_value(id, i) if i == 0 else "%.2f" % Game.stat_value(id, i), 28, K.LIME, "black"), 4))
		col.add_child(top)
		var rng: Array = c[Game.STAT_KEYS[i]]
		var bar := K.progress(Game.stat_value(id, i) - float(rng[0]) * 0.5, float(rng[1]) - float(rng[0]) * 0.5, Color.WHITE, 6)
		bar.custom_minimum_size = Vector2(440, 6)
		col.add_child(bar)
		row.add_child(col)
		left.add_child(row)

	# rang
	var rk := K.vbox(6)
	K.place(rk, Control.PRESET_TOP_RIGHT, Vector2(-520, 110), Vector2(460, 140))
	content.add_child(rk)
	var rkp := K.hbox(0)
	rkp.alignment = BoxContainer.ALIGNMENT_END
	var rkb := K.panel(Color(0.02, 0.01, 0.04, 0.95))
	var rkv := K.vbox(-6)
	rkv.add_child(K.label("RANG", 18, Color.WHITE, "black", HORIZONTAL_ALIGNMENT_RIGHT))
	var rkh := K.hbox(0)
	rkh.alignment = BoxContainer.ALIGNMENT_END
	rkh.add_child(K.label(str(Game.car_rank(id)), 40, K.LIME, "black"))
	rkh.add_child(K.label("/%d" % Game.car_max_rank(id), 30, Color.WHITE, "black"))
	rkv.add_child(rkh)
	rkb.add_child(rkv)
	rkp.add_child(rkb)
	rkp.add_child(K.class_badge(c["class"], 78))
	rk.add_child(rkp)
	if req.has("rec_rank"):
		var rr := K.panel(K.LIME)
		rr.add_child(K.label("RANG RECOMMANDÉ : %d" % int(req["rec_rank"]), 20, Color(0.05, 0.05, 0.05), "black", HORIZONTAL_ALIGNMENT_RIGHT))
		rk.add_child(rr)

	# barre d'actions
	var bar_h := K.hbox(18)
	K.place(bar_h, Control.PRESET_BOTTOM_WIDE, Vector2(70, -150), Vector2(-140, 100))
	content.add_child(bar_h)
	var up := K.button("AMÉLIORER", 30, "white", Vector2(300, 84))
	up.pressed.connect(func(): _overlay_upgrade(id))
	bar_h.add_child(up)
	var paint := Button.new()
	paint.custom_minimum_size = Vector2(110, 84)
	paint.add_theme_stylebox_override("normal", K.style(Color(0.96, 0.96, 0.98), 0, K.SKEW))
	paint.add_theme_stylebox_override("hover", K.style(Color(1, 1, 1), 0, K.SKEW, K.YELLOW, 3))
	paint.add_theme_stylebox_override("focus", K.style(Color(0, 0, 0, 0), 0, K.SKEW, K.YELLOW, 4))
	var pic := K.icon("paint", 40, Color(0.1, 0.05, 0.15))
	pic.position = Vector2(35, 22)
	paint.add_child(pic)
	paint.pressed.connect(func(): _overlay_paint(id))
	bar_h.add_child(paint)
	bar_h.add_child(K.spacer())
	var td := K.vbox(0)
	var tdl := K.hbox(0)
	tdl.add_child(K.label("TOUCH", 22, Color.WHITE, "black"))
	tdl.add_child(K.label("DRIVE", 22, Color(1, 1, 1, 0.8), "semi"))
	td.add_child(tdl)
	var tdh := K.hbox(0)
	var on: bool = Game.setting("touchdrive", false)
	var b_on := K.button("OUI", 18, "white" if on else "secondary", Vector2(80, 40))
	var b_off := K.button("NON", 18, "white" if not on else "secondary", Vector2(80, 40))
	b_on.pressed.connect(func():
		Game.set_setting("touchdrive", true)
		open(current, args, false))
	b_off.pressed.connect(func():
		Game.set_setting("touchdrive", false)
		open(current, args, false))
	tdh.add_child(b_on)
	tdh.add_child(b_off)
	td.add_child(tdh)
	bar_h.add_child(td)
	if mode == "race":
		var play := K.button("JOUER", 40, "primary", Vector2(380, 96))
		play.pressed.connect(func():
			Game.save["selected_car"] = id
			Game.save_game()
			Audio.play("confirm")
			var r := req.duplicate(true)
			r["car"] = id
			var ret := "home"
			var ret_args := {}
			if r.has("chapter"):
				ret = "season_map"
				ret_args = {"chapter": r["chapter"], "season": r["season"], "selected": r["index"]}
			elif r.has("event"):
				ret = "events"
			elif r.get("id", "") == "multi":
				ret = "multi"
			Audio.stop_music()
			Game.start_race(r, ret, ret_args))
		bar_h.add_child(play)
		play.call_deferred("grab_focus")
	else:
		var selb := K.button("SÉLECTIONNER" if id != Game.save["selected_car"] else "SÉLECTIONNÉE", 32, "primary", Vector2(380, 96))
		selb.disabled = id == Game.save["selected_car"]
		selb.pressed.connect(func():
			Game.save["selected_car"] = id
			Game.save_game()
			Audio.play("confirm")
			K.toast(ui, "%s SÉLECTIONNÉE" % Game.car_display_name(id), K.LIME)
			open(current, args, false))
		bar_h.add_child(selb)


func _open_overlay(title: String) -> VBoxContainer:
	_close_overlay()
	overlay = ColorRect.new()
	(overlay as ColorRect).color = Color(0.03, 0.0, 0.08, 0.82)
	overlay.set_anchors_preset(Control.PRESET_FULL_RECT)
	ui.add_child(overlay)
	var p := K.panel(Color(0.14, 0.04, 0.28, 0.98), 0.0, K.PURPLE_LIGHT, 2)
	K.place(p, Control.PRESET_CENTER, Vector2(-520, -360), Vector2(1040, 720))
	overlay.add_child(p)
	var m := K.margin(30)
	p.add_child(m)
	var v := K.vbox(16)
	m.add_child(v)
	var h := K.hbox(10)
	h.add_child(K.label(title, 40, Color.WHITE, "black"))
	h.add_child(K.spacer())
	var x := K.button("✕", 24, "white", Vector2(64, 54))
	x.pressed.connect(_close_overlay)
	h.add_child(x)
	v.add_child(h)
	return v


func _close_overlay() -> void:
	if overlay:
		overlay.queue_free()
		overlay = null


func _overlay_upgrade(id: String) -> void:
	var v := _open_overlay("AMÉLIORATIONS")
	var names := ["VITESSE MAX", "ACCÉLÉRATION", "MANIABILITÉ", "NITRO"]
	var st := Game.car_state(id)
	for i in 4:
		var row := K.panel(Color(0.03, 0.01, 0.06, 0.8))
		var h := K.hbox(16)
		var nl := K.label(names[i], 26, Color.WHITE, "black")
		nl.custom_minimum_size = Vector2(250, 0)
		h.add_child(nl)
		var lv := int(st["upg"][i])
		h.add_child(K.label("NIV %d/%d" % [lv, Game.level_cap(id)], 22, Color(1, 1, 1, 0.8), "semi"))
		var cur := Game.stat_value(id, i)
		var nxt := Game.stat_value(id, i, 1)
		var vl := K.label("%.1f  →  %.1f" % [cur, nxt] if lv < Game.level_cap(id) else "%.1f" % cur, 24, K.LIME, "black")
		vl.custom_minimum_size = Vector2(230, 0)
		h.add_child(vl)
		h.add_child(K.spacer())
		var cost := Game.upgrade_cost(id, i)
		var b := K.button(("%s CR" % K.fmt_int(cost)) if lv < Game.level_cap(id) else "MAX", 22, "primary", Vector2(220, 56))
		b.disabled = not Game.can_upgrade(id, i)
		b.pressed.connect(func():
			if Game.upgrade(id, i):
				Audio.play("confirm")
				_overlay_upgrade(id)
				_refresh_detail_behind())
		h.add_child(b)
		row.add_child(h)
		v.add_child(row)
	var sp := K.panel(Color(0.25, 0.06, 0.45, 0.9), 0.0, K.YELLOW, 2)
	var sh := K.hbox(16)
	sh.add_child(K.stars_row(int(st["stars"]), Game.max_stars(id), 30))
	var need := Game.plans_needed(id)
	sh.add_child(K.label("ÉTOILE SUIVANTE : %d/%d PLANS" % [int(st["plans"]), need] if need > 0 else "ÉTOILES AU MAXIMUM", 22, Color.WHITE, "black"))
	sh.add_child(K.spacer())
	var sb := K.button("+1 ÉTOILE", 24, "primary", Vector2(220, 56))
	sb.disabled = not Game.ready_to_star_up(id)
	sb.pressed.connect(func():
		if Game.star_up(id):
			Audio.play("star")
			K.toast(ui, "NOUVELLE ÉTOILE ! NIVEAUX MAX AUGMENTÉS", K.YELLOW)
			_overlay_upgrade(id)
			_refresh_detail_behind())
	sh.add_child(sb)
	sp.add_child(sh)
	v.add_child(sp)
	v.add_child(K.label("Les étoiles débloquent de nouveaux niveaux d'amélioration et augmentent le rang.", 18, Color(1, 1, 1, 0.7), "semi"))


func _refresh_detail_behind() -> void:
	# reconstruit l'écran derrière l'overlay sans le fermer
	var keep := overlay
	overlay = null
	for c in content.get_children():
		c.queue_free()
	for c in top_left.get_children():
		c.queue_free()
	var back_b := K.button("◀", 26, "white", Vector2(70, 56))
	back_b.pressed.connect(back)
	top_left.add_child(back_b)
	_screen_car_detail(args)
	overlay = keep
	if overlay:
		ui.move_child(overlay, ui.get_child_count() - 1)


func _overlay_paint(id: String) -> void:
	var v := _open_overlay("PEINTURE")
	var grid := GridContainer.new()
	grid.columns = 8
	grid.add_theme_constant_override("h_separation", 14)
	grid.add_theme_constant_override("v_separation", 14)
	for hex in PAINTS:
		var b := Button.new()
		b.custom_minimum_size = Vector2(100, 100)
		b.add_theme_stylebox_override("normal", K.style(Color(hex)))
		b.add_theme_stylebox_override("hover", K.style(Color(hex), 0, 0.0, Color.WHITE, 4))
		b.add_theme_stylebox_override("focus", K.style(Color(hex), 0, 0.0, K.YELLOW, 5))
		b.pressed.connect(func():
			Game.car_state(id)["paint"] = hex
			Game.save_game()
			if car_visual:
				car_visual.set_paint(Color(hex))
			Audio.play("click"))
		grid.add_child(b)
	v.add_child(grid)
	var orig := K.button("PEINTURE D'ORIGINE", 24, "white", Vector2(360, 60))
	orig.pressed.connect(func():
		Game.car_state(id)["paint"] = ""
		Game.save_game()
		shown_car = ""
		show_car(id)
		Audio.play("click"))
	v.add_child(orig)


# ---------------------------------------------------------------------------
# GARAGE
# ---------------------------------------------------------------------------
func _screen_garage(a: Dictionary) -> void:
	hide_car()
	_full_bg(0.97)
	var owned := Game.owned_cars().size()
	_title("GARAGE", "NIVEAU %d  ·  %d / %d VOITURES" % [1 + owned / 4, owned, Game.cars.size()])
	var filt: String = a.get("filter", "")
	var fb := K.hbox(10)
	K.place(fb, Control.PRESET_TOP_RIGHT, Vector2(-700, 100), Vector2(640, 60))
	fb.alignment = BoxContainer.ALIGNMENT_END
	content.add_child(fb)
	for f in ["", "D", "C", "B", "A", "S"]:
		var b := K.button("TOUTES" if f == "" else f, 22, "primary" if f == filt else "secondary", Vector2(90 if f != "" else 140, 52))
		b.pressed.connect(func(): open("garage", {"filter": f}, false))
		fb.add_child(b)
	var list: Array = Game.cars if filt == "" else Game.cars_of_class(filt)
	list = list.duplicate()
	list.sort_custom(func(x, y):
		var ox := Game.is_owned(x["id"])
		var oy := Game.is_owned(y["id"])
		if ox != oy:
			return ox
		return Game.CLASS_ORDER.find(x["class"]) * 10000 + int(x["rank"][0]) < Game.CLASS_ORDER.find(y["class"]) * 10000 + int(y["rank"][0]))
	_car_grid(list, func(id): _on_car_pick(id, {}, "garage"), Vector2(70, 190))


# ---------------------------------------------------------------------------
# BOUTIQUE
# ---------------------------------------------------------------------------
func _screen_shop() -> void:
	hide_car()
	_full_bg(0.97)
	_title("BOUTIQUE", "VOITURES, PLANS ET CRÉDITS")
	var sc := ScrollContainer.new()
	K.place(sc, Control.PRESET_FULL_RECT, Vector2(70, 180), Vector2(-140, -220))
	content.add_child(sc)
	var v := K.vbox(20)
	sc.add_child(v)
	v.add_child(K.outlined(K.label("OFFRES", 32, K.YELLOW, "black"), 4))
	var offers := K.hbox(20)
	v.add_child(offers)
	offers.add_child(_offer("PACK DE PLANS", "3 plans d'une voiture aléatoire", "100 JETONS", Game.tokens() >= 100, func():
		if Game.spend(0, 100):
			var pool := Game.cars.filter(func(c): return c["class"] in ["D", "C", "B"])
			var c: Dictionary = pool[randi() % pool.size()]
			Game.add_plans(c["id"], 3)
			Audio.play("reward")
			K.toast(ui, "+3 PLANS : %s" % Game.car_display_name(c["id"]), K.LIME)
			open("shop", {}, false)))
	offers.add_child(_offer("PACK PRESTIGE", "5 plans d'une voiture A ou S", "350 JETONS", Game.tokens() >= 350, func():
		if Game.spend(0, 350):
			var pool := Game.cars.filter(func(c): return c["class"] in ["A", "S"])
			var c: Dictionary = pool[randi() % pool.size()]
			Game.add_plans(c["id"], 5)
			Audio.play("reward")
			K.toast(ui, "+5 PLANS : %s" % Game.car_display_name(c["id"]), K.LIME)
			open("shop", {}, false)))
	offers.add_child(_offer("CRÉDITS", "+30 000 crédits", "50 JETONS", Game.tokens() >= 50, func():
		if Game.spend(0, 50):
			Game.add_currency(30000)
			Audio.play("reward")
			open("shop", {}, false)))
	var gift_claimed: bool = Game.save["daily"]["claimed"].get("gift", false)
	offers.add_child(_offer("CADEAU DU JOUR", "+15 jetons gratuits", "GRATUIT" if not gift_claimed else "DÉJÀ RÉCUPÉRÉ", not gift_claimed, func():
		Game.save["daily"]["claimed"]["gift"] = true
		Game.add_currency(0, 15)
		Audio.play("reward")
		open("shop", {}, false)))
	v.add_child(K.outlined(K.label("VOITURES À VENDRE", 32, K.YELLOW, "black"), 4))
	var grid := GridContainer.new()
	grid.columns = 4
	grid.add_theme_constant_override("h_separation", 18)
	grid.add_theme_constant_override("v_separation", 18)
	v.add_child(grid)
	for c in Game.cars:
		if Game.is_owned(c["id"]):
			continue
		var cls: Dictionary = Game.classes[c["class"]]
		var p := K.panel(Color(0.25, 0.07, 0.45, 0.9))
		p.custom_minimum_size = Vector2(420, 0)
		var pv := K.vbox(6)
		var th := K.thumb(c["id"])
		th.custom_minimum_size = Vector2(400, 200)
		pv.add_child(th)
		var nh := K.hbox(8)
		nh.add_child(K.class_badge(c["class"], 34))
		nh.add_child(K.label(Game.car_display_name(c["id"]), 20, Color.WHITE, "black"))
		pv.add_child(nh)
		var bh := K.hbox(10)
		var id: String = c["id"]
		var b1 := K.button("%s CR" % K.fmt_int(int(cls["credits"])), 20, "primary", Vector2(190, 50))
		b1.disabled = Game.credits() < int(cls["credits"])
		b1.pressed.connect(func():
			if Game.buy_car(id, false):
				Audio.play("star")
				K.toast(ui, "%s AJOUTÉE AU GARAGE" % Game.car_display_name(id), K.LIME)
				open("shop", {}, false))
		bh.add_child(b1)
		var b2 := K.button("%d JETONS" % int(cls["tokens"]), 20, "purple", Vector2(190, 50))
		b2.disabled = Game.tokens() < int(cls["tokens"])
		b2.pressed.connect(func():
			if Game.buy_car(id, true):
				Audio.play("star")
				K.toast(ui, "%s AJOUTÉE AU GARAGE" % Game.car_display_name(id), K.LIME)
				open("shop", {}, false))
		bh.add_child(b2)
		pv.add_child(bh)
		p.add_child(pv)
		grid.add_child(p)


func _offer(title: String, desc: String, price: String, enabled: bool, cb: Callable) -> Control:
	var p := K.panel(Color(0.3, 0.08, 0.55, 0.92), 0.0, K.PURPLE_LIGHT, 2)
	p.custom_minimum_size = Vector2(400, 200)
	var v := K.vbox(10)
	v.add_child(K.label(title, 28, Color.WHITE, "black"))
	v.add_child(K.label(desc, 18, Color(1, 1, 1, 0.8), "semi"))
	v.add_child(K.spacer(false))
	var b := K.button(price, 22, "primary", Vector2(360, 56))
	b.disabled = not enabled
	b.pressed.connect(cb)
	v.add_child(b)
	p.add_child(v)
	return p


# ---------------------------------------------------------------------------
# ÉVÉNEMENTS SPÉCIAUX
# ---------------------------------------------------------------------------
func _screen_events() -> void:
	hide_car()
	_full_bg(0.95)
	_title("ÉVÉNEMENTS SPÉCIAUX", "DÉFIS À DURÉE LIMITÉE")
	var h := K.hbox(24)
	h.position = Vector2(70, 200)
	content.add_child(h)
	for ev in Game.SPECIAL_EVENTS:
		var p := K.panel(Color(0.3, 0.08, 0.55, 0.92), 0.0, K.PURPLE_LIGHT, 2)
		p.custom_minimum_size = Vector2(420, 640)
		var v := K.vbox(12)
		var img := K.thumb(ev.get("image", ev["reward_car"]))
		img.custom_minimum_size = Vector2(400, 230)
		v.add_child(img)
		v.add_child(K.outlined(K.label(ev["name"], 34, Color.WHITE, "black"), 4))
		var loc := ""
		for l in Game.LOCATIONS:
			if l["theme"] == ev["theme"]:
				loc = l["name"]
		v.add_child(K.label(loc, 20, K.YELLOW, "black"))
		var d := K.label(ev["desc"], 18, Color(1, 1, 1, 0.85), "semi")
		d.autowrap_mode = TextServer.AUTOWRAP_WORD
		d.custom_minimum_size = Vector2(390, 80)
		v.add_child(d)
		var cl := "CLASSE %s" % ev["class"] if ev["class"] != "" else "TOUTES CLASSES"
		v.add_child(K.label(cl, 20, Color.WHITE, "black"))
		var obj: Dictionary = ev["obj"]
		v.add_child(K.label(Game.objective_text(obj) if obj["type"] != "time" else "BATS LE TEMPS CIBLE", 18, K.LIME, "black"))
		v.add_child(K.label("Victoires : %d" % int(Game.save["events"].get(ev["id"], 0)), 18, Color(1, 1, 1, 0.7), "semi"))
		v.add_child(K.spacer(false))
		var b := K.button("PARTICIPER", 28, "primary", Vector2(400, 70))
		var evc: Dictionary = ev
		b.pressed.connect(func(): _start_event(evc))
		v.add_child(b)
		p.add_child(v)
		h.add_child(p)


func _start_event(ev: Dictionary) -> void:
	var car_id: String = Game.save["selected_car"]
	var cls: String = ev["class"]
	var loc := ""
	for l in Game.LOCATIONS:
		if l["theme"] == ev["theme"]:
			loc = l["name"]
	var rank := Game.car_rank(car_id)
	if cls != "":
		var pool := Game.cars_of_class(cls)
		rank = int(lerp(float(pool[0]["rank"][0]), float(pool[0]["rank"][1]), 0.45))
	var req := {
		"id": ev["id"], "event": ev["id"], "name": loc, "theme": ev["theme"],
		"seed": hash(ev["id"] + Game._today()), "length": 3000.0, "mode": ev["mode"],
		"class": cls, "rec_rank": rank, "objective": ev["obj"].duplicate(),
		"reward": {"credits": 6000, "plans": {}}, "reward_car": ev["reward_car"],
		"barrel_heavy": ev.get("barrel_heavy", false),
	}
	open("car_select", {"req": req, "any_class": cls == ""})


# ---------------------------------------------------------------------------
# OBJECTIFS QUOTIDIENS
# ---------------------------------------------------------------------------
func _screen_daily() -> void:
	hide_car()
	_full_bg(0.95)
	_title("OBJECTIFS QUOTIDIENS", "RÉINITIALISÉS CHAQUE JOUR")
	var v := K.vbox(16)
	v.position = Vector2(70, 200)
	content.add_child(v)
	for o in Game.DAILY_OBJECTIVES:
		var p := K.panel(Color(0.25, 0.07, 0.45, 0.9))
		p.custom_minimum_size = Vector2(1300, 0)
		var h := K.hbox(20)
		var val := Game.daily_value(o["id"])
		var done: bool = val >= int(o["goal"])
		h.add_child(K.icon("check" if done else "flag", 34, K.LIME if done else Color.WHITE))
		var col := K.vbox(6)
		col.add_child(K.label(o["label"], 28, Color.WHITE, "black"))
		var pb := K.progress(float(val), float(o["goal"]), K.LIME if done else K.YELLOW, 10)
		pb.custom_minimum_size = Vector2(600, 10)
		col.add_child(pb)
		h.add_child(col)
		h.add_child(K.label("%d/%d" % [min(val, int(o["goal"])), int(o["goal"])], 26, Color.WHITE, "black"))
		h.add_child(K.spacer())
		var rw: Dictionary = o["reward"]
		h.add_child(K.icon("coin" if rw.has("credits") else "token", 30))
		h.add_child(K.label(K.fmt_int(int(rw.get("credits", rw.get("tokens", 0)))), 26, Color.WHITE, "black"))
		var claimed := Game.daily_claimed(o["id"])
		var b := K.button("RÉCUPÉRÉ" if claimed else "RÉCUPÉRER", 22, "primary", Vector2(230, 60))
		b.disabled = claimed or not done
		var oc: Dictionary = o
		b.pressed.connect(func():
			if Game.claim_daily(oc):
				Audio.play("reward")
				open("daily", {}, false))
		h.add_child(b)
		p.add_child(h)
		v.add_child(p)


# ---------------------------------------------------------------------------
# PASS UNITE
# ---------------------------------------------------------------------------
func _screen_pass() -> void:
	hide_car()
	_full_bg(0.95)
	_title("PASS UNITE", "GAGNE DE L'XP EN COURSE POUR DÉBLOQUER DES RÉCOMPENSES")
	var xp := int(Game.save["pass"]["xp"])
	var tier := Game.pass_tier()
	var head := K.hbox(20)
	head.position = Vector2(70, 190)
	content.add_child(head)
	head.add_child(K.label("PALIER %d / %d" % [tier, Game.PASS_TIERS], 32, K.YELLOW, "black"))
	var pb := K.progress(float(xp % Game.PASS_XP_PER_TIER), float(Game.PASS_XP_PER_TIER), K.MAGENTA, 14)
	pb.custom_minimum_size = Vector2(600, 14)
	head.add_child(pb)
	head.add_child(K.label("%d / %d XP" % [xp % Game.PASS_XP_PER_TIER, Game.PASS_XP_PER_TIER], 22, Color.WHITE, "semi"))
	var sc := ScrollContainer.new()
	K.place(sc, Control.PRESET_FULL_RECT, Vector2(70, 270), Vector2(-140, -440))
	sc.vertical_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	content.add_child(sc)
	var h := K.hbox(14)
	sc.add_child(h)
	for t in range(1, Game.PASS_TIERS + 1):
		var r := Game.pass_reward(t)
		var unlocked := t <= tier
		var claimed: bool = t in Game.save["pass"]["claimed"]
		var p := K.panel(Color(0.32, 0.1, 0.58, 0.95) if unlocked else Color(0.15, 0.05, 0.25, 0.8), 0.0, K.YELLOW if t % 10 == 0 else Color(0, 0, 0, 0), 3 if t % 10 == 0 else 0)
		p.custom_minimum_size = Vector2(230, 0)
		var v := K.vbox(8)
		v.add_child(K.label("%02d" % t, 34, Color.WHITE, "black"))
		if r.has("plans"):
			var cid: String = r["plans"].keys()[0]
			var th := K.thumb(cid)
			th.custom_minimum_size = Vector2(210, 120)
			v.add_child(th)
			v.add_child(K.label("PLAN x%d" % int(r["plans"][cid]), 20, K.LIME, "black"))
			var nl := K.label(Game.car_display_name(cid), 15, Color(1, 1, 1, 0.85), "semi")
			nl.autowrap_mode = TextServer.AUTOWRAP_WORD
			nl.custom_minimum_size = Vector2(210, 44)
			v.add_child(nl)
		else:
			var cc := CenterContainer.new()
			cc.custom_minimum_size = Vector2(210, 120)
			cc.add_child(K.icon("coin" if r.has("credits") else "token", 70))
			v.add_child(cc)
			v.add_child(K.label(K.fmt_int(int(r.get("credits", r.get("tokens", 0)))), 24, Color.WHITE, "black"))
			v.add_child(K.label("CRÉDITS" if r.has("credits") else "JETONS", 15, Color(1, 1, 1, 0.8), "semi"))
		var b := K.button("OK" if claimed else ("RÉCUPÉRER" if unlocked else "VERROUILLÉ"), 18, "primary", Vector2(210, 50))
		b.disabled = claimed or not unlocked
		var tt := t
		b.pressed.connect(func():
			if Game.claim_pass(tt):
				Audio.play("reward")
				open("pass", {}, false))
		v.add_child(b)
		p.add_child(v)
		h.add_child(p)


# ---------------------------------------------------------------------------
# MULTIJOUEUR (bots hors ligne)
# ---------------------------------------------------------------------------
func _screen_multi() -> void:
	show_car(Game.save["selected_car"])
	_cam_offset = -1.8
	_title("MULTIJOUEUR", "COURSES CONTRE DES BOTS (HORS LIGNE)")
	var wins := int(Game.save["stats"]["wins"])
	var leagues := [["BRONZE", 0, Color("#cd7f32")], ["ARGENT", 5, Color("#c0c0c0")], ["OR", 15, Color("#ffd21f")], ["PLATINE", 30, Color("#7fe0ff")], ["LÉGENDE", 60, Color("#d23cff")]]
	var league: Array = leagues[0]
	for l in leagues:
		if wins >= int(l[1]):
			league = l
	var v := K.vbox(18)
	v.position = Vector2(110, 200)
	content.add_child(v)
	var lp := K.panel(Color(0.03, 0.01, 0.06, 0.9), K.SKEW, league[2], 3)
	var lh := K.hbox(14)
	lh.add_child(K.icon("trophy", 50, league[2]))
	var lv := K.vbox(0)
	lv.add_child(K.label("LIGUE", 20, Color(1, 1, 1, 0.8), "semi"))
	lv.add_child(K.label(league[0], 46, league[2], "black"))
	lh.add_child(lv)
	lp.add_child(lh)
	v.add_child(lp)
	v.add_child(K.label("%d victoires  ·  %d courses" % [wins, int(Game.save["stats"]["races"])], 24, Color.WHITE, "semi"))
	var d := K.label("Affronte 5 pilotes contrôlés par l'IA, au niveau de ta voiture.\nLes takedowns et les victoires font grimper ta ligue !", 20, Color(1, 1, 1, 0.85), "semi")
	v.add_child(d)
	var b := K.button("TROUVER UNE COURSE", 32, "primary", Vector2(520, 90))
	b.pressed.connect(func():
		var req := Game.quick_race_request()
		req["id"] = "multi"
		req["rec_rank"] = int(Game.car_rank(Game.save["selected_car"]) * 1.03)
		req["reward"] = {"credits": 4000 + 500 * Game.CLASS_ORDER.find(Game.car_def(Game.save["selected_car"])["class"]), "plans": {}}
		req["objective"] = {"type": "position", "value": 3}
		open("car_select", {"req": req, "any_class": true}))
	v.add_child(b)


# ---------------------------------------------------------------------------
# PROFIL
# ---------------------------------------------------------------------------
func _screen_profile() -> void:
	show_car(Game.save["selected_car"])
	_cam_offset = -1.9
	_title("PROFIL", "STATISTIQUES DU PILOTE")
	var v := K.vbox(14)
	v.position = Vector2(110, 200)
	content.add_child(v)
	var nh := K.hbox(12)
	nh.add_child(K.icon("user", 40))
	var le := LineEdit.new()
	le.text = Game.save["name"]
	le.max_length = 16
	le.custom_minimum_size = Vector2(360, 56)
	le.add_theme_font_override("font", K.font("black"))
	le.add_theme_font_size_override("font_size", 28)
	le.text_submitted.connect(func(t):
		Game.save["name"] = t.strip_edges() if t.strip_edges() != "" else "Galax"
		Game.save_game()
		K.toast(ui, "NOM MIS À JOUR", K.LIME))
	nh.add_child(le)
	var ok := K.button("OK", 22, "primary", Vector2(90, 56))
	ok.pressed.connect(func(): le.text_submitted.emit(le.text))
	nh.add_child(ok)
	v.add_child(nh)
	var st: Dictionary = Game.save["stats"]
	var rows := [
		["COURSES", str(st["races"])], ["VICTOIRES", str(st["wins"])], ["TAKEDOWNS", str(st["takedowns"])],
		["TONNEAUX", str(st["barrel_rolls"])], ["SAUTS", str(st["jumps"])], ["NITROS PARFAITS", str(st["perfect_nitros"])],
		["FRÔLEMENTS", str(st.get("near_misses", 0))], ["ÉPAVES", str(st["wrecks"])], ["DISTANCE", "%.1f KM" % float(st["distance_km"])],
		["DRAPEAUX", str(Game.total_flags())], ["VOITURES", "%d / %d" % [Game.owned_cars().size(), Game.cars.size()]],
	]
	var grid := GridContainer.new()
	grid.columns = 2
	grid.add_theme_constant_override("h_separation", 40)
	grid.add_theme_constant_override("v_separation", 6)
	for r in rows:
		var l := K.label(r[0], 24, Color(1, 1, 1, 0.8), "semi")
		l.custom_minimum_size = Vector2(300, 0)
		grid.add_child(l)
		grid.add_child(K.label(r[1], 26, K.LIME, "black"))
	var gp := K.panel(Color(0.03, 0.01, 0.06, 0.85))
	gp.add_child(grid)
	v.add_child(gp)
	var rs := K.button("RÉINITIALISER LA SAUVEGARDE", 20, "danger", Vector2(420, 56))
	rs.pressed.connect(func():
		var p := _open_overlay("CONFIRMATION")
		p.add_child(K.label("Effacer toute la progression ? Cette action est définitive.", 24, Color.WHITE, "semi"))
		var yes := K.button("OUI, TOUT EFFACER", 24, "danger", Vector2(360, 64))
		yes.pressed.connect(func():
			Game.reset_save()
			_close_overlay()
			go_home())
		p.add_child(yes))
	v.add_child(rs)


# ---------------------------------------------------------------------------
# RÉGLAGES
# ---------------------------------------------------------------------------
func _screen_settings() -> void:
	hide_car()
	_full_bg(0.95)
	_title("RÉGLAGES", "GRAPHISMES, SON ET COMMANDES")
	var v := K.vbox(18)
	v.position = Vector2(110, 200)
	content.add_child(v)
	var q := K.hbox(12)
	var ql := K.label("QUALITÉ GRAPHIQUE", 26, Color.WHITE, "black")
	ql.custom_minimum_size = Vector2(380, 0)
	q.add_child(ql)
	var cur: int = Game.setting("quality", 2)
	for i in 3:
		var b := K.button(["BASSE", "MOYENNE", "HAUTE"][i], 22, "primary" if i == cur else "secondary", Vector2(170, 54))
		b.pressed.connect(func():
			Game.set_setting("quality", i)
			open("settings", {}, false))
		q.add_child(b)
	v.add_child(q)
	for s in [["MUSIQUE", "music"], ["EFFETS SONORES", "sfx"], ["MOTEUR", "engine"]]:
		var h := K.hbox(12)
		var l := K.label(s[0], 26, Color.WHITE, "black")
		l.custom_minimum_size = Vector2(380, 0)
		h.add_child(l)
		var sl := HSlider.new()
		sl.min_value = 0.0
		sl.max_value = 1.0
		sl.step = 0.05
		sl.value = Game.setting(s[1], 0.7)
		sl.custom_minimum_size = Vector2(520, 40)
		var key: String = s[1]
		sl.value_changed.connect(func(val):
			Game.save["settings"][key] = val
			Game.save_game()
			Audio.refresh_volumes())
		h.add_child(sl)
		v.add_child(h)
	var toggles := [["AFFICHER LES FPS", "show_fps"], ["TOUCHDRIVE PAR DÉFAUT", "touchdrive"]]
	if not Game.is_mobile():
		toggles.push_front(["PLEIN ÉCRAN", "fullscreen"])
	for t in toggles:
		var h2 := K.hbox(12)
		var l2 := K.label(t[0], 26, Color.WHITE, "black")
		l2.custom_minimum_size = Vector2(380, 0)
		h2.add_child(l2)
		var on: bool = Game.setting(t[1], false)
		var key2: String = t[1]
		var b2 := K.button("OUI" if on else "NON", 22, "primary" if on else "secondary", Vector2(170, 54))
		b2.pressed.connect(func():
			Game.set_setting(key2, not on)
			open("settings", {}, false))
		h2.add_child(b2)
		v.add_child(h2)
	var help := K.label("COMMANDES — Clavier : ← → / Q D diriger · ↑ / Z / Espace nitro (2x = onde de choc) · ↓ / S / Maj drift (2x = 360°) · T TouchDrive · C caméra · Échap pause\nManette : stick gauche · A / RT nitro · X / B / LT drift · Y caméra · Start pause · LB / RB onglets", 18, Color(1, 1, 1, 0.8), "semi")
	help.autowrap_mode = TextServer.AUTOWRAP_WORD
	help.custom_minimum_size = Vector2(1500, 0)
	v.add_child(help)
	var disc := K.label("Fangame non officiel, gratuit et sans but commercial, réalisé par des fans. Asphalt est une marque de Gameloft ; les noms de voitures appartiennent à leurs constructeurs. Modèles 3D générés procéduralement avec Blender, police Titillium Web (OFL).", 16, Color(1, 1, 1, 0.55), "semi")
	disc.autowrap_mode = TextServer.AUTOWRAP_WORD
	disc.custom_minimum_size = Vector2(1500, 0)
	v.add_child(disc)
