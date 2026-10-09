extends Node3D
## Menu principal : showroom 3D + navigation entre les écrans (style Asphalt Legends Unite).

const THUMB_DIR := "res://assets/thumbs/"

var ui: CanvasLayer
var root: Control
var bg: ColorRect
var content: Control
var top_bar: Control
var bottom_bar: Control
var title_box: Control
var back_btn: Button
var toast_lbl: Label
var credits_lbl: Label
var tokens_lbl: Label
var showroom: Node3D
var show_car: CarModel
var show_car_id := ""
var cam: Camera3D
var turntable: Node3D
var screens_main: MenuScreensMain
var screens_race: MenuScreensRace
var stack: Array = []
var current := ""
var current_params: Dictionary = {}
var tab_buttons := {}
var _rot := 0.0
var _drag := false
var _cam_target := Vector3(0.0, 0.55, 0.0)
var _cam_pos := Vector3(3.6, 1.55, 5.6)

static var title_seen := false


func _ready() -> void:
	MatLib.night = true
	MatLib.quality = int(Game.setting("quality"))
	MatLib.clear()
	_build_showroom()
	_build_ui()
	screens_main = MenuScreensMain.new(self)
	screens_race = MenuScreensRace.new(self)
	Game.currency_changed.connect(_refresh_currency)
	_refresh_currency()
	Sfx.play_music("music_menu", 1.2)
	var ret: Dictionary = Game.menu_return
	Game.menu_return = {}
	if not title_seen:
		title_seen = true
		show_screen("title")
	elif ret.has("screen") and ret.screen != "home":
		stack = ["home"]
		var sc: String = ret.screen
		if sc == "season":
			stack.append("career")
			show_screen("season", {"season": ret.get("season", "")}, false)
		else:
			show_screen(sc, {}, false)
	else:
		show_screen("home")


# ---------------------------------------------------------------------------
# Showroom 3D
# ---------------------------------------------------------------------------

func _build_showroom() -> void:
	showroom = Node3D.new()
	add_child(showroom)
	var we := WorldEnvironment.new()
	var e := Environment.new()
	e.background_mode = Environment.BG_COLOR
	e.background_color = Color(0.08, 0.02, 0.16)
	e.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
	e.ambient_light_color = Color(0.55, 0.35, 0.85)
	e.ambient_light_energy = 0.5
	e.reflected_light_source = Environment.REFLECTION_SOURCE_BG
	e.tonemap_mode = Environment.TONE_MAPPER_FILMIC
	e.glow_enabled = true
	e.glow_intensity = 1.0
	e.glow_bloom = 0.1
	e.glow_hdr_threshold = 0.8
	e.fog_enabled = true
	e.fog_light_color = Color(0.25, 0.08, 0.4)
	e.fog_density = 0.02
	we.environment = e
	showroom.add_child(we)
	# sol brillant
	var floor_mi := MeshInstance3D.new()
	var pm := PlaneMesh.new()
	pm.size = Vector2(60, 60)
	floor_mi.mesh = pm
	var fm := StandardMaterial3D.new()
	fm.albedo_color = Color(0.10, 0.06, 0.16)
	fm.metallic = 0.6
	fm.roughness = 0.18
	floor_mi.material_override = fm
	showroom.add_child(floor_mi)
	# halo lumineux sous la voiture
	var halo := MeshInstance3D.new()
	var q := QuadMesh.new()
	q.size = Vector2(9, 9)
	q.orientation = PlaneMesh.FACE_Y
	halo.mesh = q
	var hm := StandardMaterial3D.new()
	hm.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	hm.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	hm.albedo_texture = CarModel._blob_texture()
	hm.albedo_color = Color(0.85, 0.35, 1.0, 0.45)
	halo.material_override = hm
	halo.position.y = 0.01
	showroom.add_child(halo)
	# mur du fond avec néons
	var wall := MeshInstance3D.new()
	var cyl := CylinderMesh.new()
	cyl.top_radius = 16.0
	cyl.bottom_radius = 16.0
	cyl.height = 14.0
	cyl.radial_segments = 48
	cyl.flip_faces = true
	cyl.cap_top = false
	cyl.cap_bottom = false
	wall.mesh = cyl
	var wm := StandardMaterial3D.new()
	wm.albedo_color = Color(0.16, 0.05, 0.28)
	wm.roughness = 0.6
	wall.material_override = wm
	wall.position.y = 6.5
	showroom.add_child(wall)
	var neon_cols := [Color("#c03cff"), Color("#ff3fa4"), Color("#7b2cff"), Color("#2fe0ff")]
	for k in 14:
		var a := -PI * 0.85 + k * (PI * 1.7 / 13.0)
		var tube := MeshInstance3D.new()
		var bm := BoxMesh.new()
		var hgt := 3.0 + (k % 3) * 1.5
		bm.size = Vector3(0.12, hgt, 0.12)
		tube.mesh = bm
		tube.material_override = MatLib.emissive("show_neon%d" % (k % 4), neon_cols[k % 4], 3.5)
		tube.position = Vector3(sin(a) * 15.3, hgt * 0.5 + 0.6, -cos(a) * 15.3)
		showroom.add_child(tube)
	for k in 3:
		var strip := MeshInstance3D.new()
		var sb := BoxMesh.new()
		sb.size = Vector3(26.0, 0.08, 0.08)
		strip.mesh = sb
		strip.material_override = MatLib.emissive("show_strip", Color("#c03cff"), 3.0)
		strip.position = Vector3(0, 0.4 + k * 3.2, -15.0)
		showroom.add_child(strip)
	# plateau tournant
	turntable = Node3D.new()
	showroom.add_child(turntable)
	var disc := MeshInstance3D.new()
	var dm := CylinderMesh.new()
	dm.top_radius = 3.4
	dm.bottom_radius = 3.5
	dm.height = 0.08
	dm.radial_segments = 64
	disc.mesh = dm
	var dmat := StandardMaterial3D.new()
	dmat.albedo_color = Color(0.06, 0.04, 0.1)
	dmat.metallic = 0.8
	dmat.roughness = 0.12
	disc.material_override = dmat
	disc.position.y = 0.04
	showroom.add_child(disc)
	var ring := MeshInstance3D.new()
	var tm := TorusMesh.new()
	tm.inner_radius = 3.42
	tm.outer_radius = 3.5
	tm.rings = 64
	ring.mesh = tm
	ring.material_override = MatLib.emissive("show_ring", Color("#ff3fa4"), 4.0)
	ring.position.y = 0.06
	showroom.add_child(ring)
	# lumières
	var key := SpotLight3D.new()
	key.position = Vector3(0, 7, 2)
	key.rotation_degrees = Vector3(-75, 0, 0)
	key.spot_range = 14.0
	key.spot_angle = 40.0
	key.light_energy = 6.0
	key.light_color = Color(1.0, 0.95, 1.0)
	key.shadow_enabled = true
	showroom.add_child(key)
	for p in [[Vector3(-5, 2.5, 2), Color("#c03cff")], [Vector3(5, 2.0, -1), Color("#ff3fa4")], [Vector3(0, 2.5, -6), Color("#2fe0ff")]]:
		var o := OmniLight3D.new()
		o.position = p[0]
		o.light_color = p[1]
		o.light_energy = 3.0
		o.omni_range = 12.0
		showroom.add_child(o)
	var dl := DirectionalLight3D.new()
	dl.rotation_degrees = Vector3(-50, 30, 0)
	dl.light_energy = 0.35
	dl.light_color = Color(0.8, 0.7, 1.0)
	showroom.add_child(dl)
	cam = Camera3D.new()
	cam.fov = 40.0
	showroom.add_child(cam)
	cam.make_current()
	_place_camera(true)


func set_showroom_car(id: String, color: Color = Color(0, 0, 0, 0)) -> void:
	if color.a == 0.0:
		color = Game.car_color(id)
	if show_car != null:
		show_car.queue_free()
	show_car_id = id
	show_car = CarModel.new()
	show_car.setup(id, color, {"effects": false, "shadows": true})
	turntable.add_child(show_car)
	show_car.scale = Vector3.ONE * 0.001
	var tw := create_tween()
	tw.tween_property(show_car, "scale", Vector3.ONE, 0.35).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)


func set_camera(target: Vector3, pos: Vector3) -> void:
	_cam_target = target
	_cam_pos = pos


func _place_camera(instant: bool = false) -> void:
	if instant:
		cam.position = _cam_pos
	cam.look_at(_cam_target, Vector3.UP)


func _process(delta: float) -> void:
	if not _drag:
		_rot += delta * 0.25
	turntable.rotation.y = _rot
	cam.position = cam.position.lerp(_cam_pos, 1.0 - exp(-4.0 * delta))
	cam.look_at(_cam_target, Vector3.UP)


func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventScreenDrag and showroom_interactive():
		_rot += event.relative.x * 0.01
		_drag = true
	elif event is InputEventScreenTouch and not event.pressed:
		_drag = false
	if event.is_action_pressed("pause") or (event is InputEventKey and event.pressed and event.keycode == KEY_BACKSPACE):
		back()
	elif event.is_action_pressed("tab_next") and current == "home":
		show_screen("career")


func showroom_interactive() -> bool:
	return not bg.visible


# ---------------------------------------------------------------------------
# Interface commune
# ---------------------------------------------------------------------------

func _build_ui() -> void:
	ui = CanvasLayer.new()
	add_child(ui)
	root = Control.new()
	root.theme = UI.theme()
	UI.full_rect(root)
	root.mouse_filter = Control.MOUSE_FILTER_IGNORE
	ui.add_child(root)
	bg = ColorRect.new()
	UI.full_rect(bg)
	var sm := ShaderMaterial.new()
	sm.shader = load("res://shaders/menu_bg.gdshader")
	bg.material = sm
	bg.mouse_filter = Control.MOUSE_FILTER_IGNORE
	root.add_child(bg)
	content = Control.new()
	UI.full_rect(content)
	content.mouse_filter = Control.MOUSE_FILTER_IGNORE
	root.add_child(content)
	_build_top_bar()
	_build_bottom_bar()
	toast_lbl = UI.outline(UI.label("", 26, UI.YELLOW, "title", HORIZONTAL_ALIGNMENT_CENTER), Color(0, 0, 0, 0.9), 8)
	UI.place(toast_lbl, Control.PRESET_CENTER_BOTTOM, Vector2(-450, -170), Vector2(900, 50))
	toast_lbl.modulate.a = 0.0
	root.add_child(toast_lbl)


func _build_top_bar() -> void:
	top_bar = Control.new()
	UI.place(top_bar, Control.PRESET_TOP_WIDE, Vector2(0, 0), Vector2(0, 56))
	top_bar.mouse_filter = Control.MOUSE_FILTER_IGNORE
	root.add_child(top_bar)
	# lignes décoratives à gauche
	var deco := Control.new()
	deco.mouse_filter = Control.MOUSE_FILTER_IGNORE
	deco.size = Vector2(520, 56)
	deco.draw.connect(func():
		for k in 4:
			var y := 4.0 + k * 5.0
			deco.draw_line(Vector2(0, y + 18), Vector2(380 - k * 40, y), Color(1, 1, 1, 0.55 - k * 0.1), 2.0))
	top_bar.add_child(deco)
	back_btn = UI.button("◀  RETOUR", "dark", 20, Vector2(150, 44))
	back_btn.position = Vector2(16, 6)
	back_btn.pressed.connect(back)
	top_bar.add_child(back_btn)
	title_box = UI.vbox(0)
	title_box.position = Vector2(190, 4)
	top_bar.add_child(title_box)
	var bar := PanelContainer.new()
	bar.add_theme_stylebox_override("panel", UI.box(Color(0.02, 0.01, 0.05, 0.92), UI.SKEW, Color(0, 0, 0, 0), 0, 0, 6))
	UI.place(bar, Control.PRESET_TOP_RIGHT, Vector2(-660, 0), Vector2(660, 48))
	top_bar.add_child(bar)
	var h := UI.hbox(14)
	h.alignment = BoxContainer.ALIGNMENT_END
	bar.add_child(h)
	h.add_child(UI.icon("res://assets/ui/icon_credits.png", 30))
	credits_lbl = UI.label("0", 24, UI.WHITE, "title", HORIZONTAL_ALIGNMENT_RIGHT)
	credits_lbl.custom_minimum_size.x = 110
	h.add_child(credits_lbl)
	h.add_child(UI.icon("res://assets/ui/icon_tokens.png", 30))
	tokens_lbl = UI.label("0", 24, UI.WHITE, "title", HORIZONTAL_ALIGNMENT_RIGHT)
	tokens_lbl.custom_minimum_size.x = 70
	h.add_child(tokens_lbl)
	var shop := UI.button("BOUTIQUE", "yellow", 22, Vector2(140, 40))
	shop.pressed.connect(func(): show_screen("shop"))
	h.add_child(shop)
	var prof := UI.button("", "dark", 18, Vector2(48, 40), Vector2.ZERO)
	prof.icon = load("res://assets/ui/icon_car.png")
	prof.expand_icon = true
	prof.pressed.connect(func(): show_screen("garage"))
	h.add_child(prof)
	var gear := UI.button("", "dark", 18, Vector2(48, 40), Vector2.ZERO)
	gear.icon = load("res://assets/ui/icon_settings.png")
	gear.expand_icon = true
	gear.pressed.connect(func(): show_screen("settings"))
	h.add_child(gear)
	var home := UI.button("", "dark", 18, Vector2(48, 40), Vector2.ZERO)
	home.icon = load("res://assets/ui/icon_home.png")
	home.expand_icon = true
	home.pressed.connect(func():
		stack.clear()
		show_screen("home", {}, false))
	h.add_child(home)


func set_title(t: String, sub: String = "") -> void:
	for c in title_box.get_children():
		c.queue_free()
	if t == "":
		return
	title_box.add_child(UI.shadow(UI.label(t, 30, UI.WHITE, "title")))
	if sub != "":
		title_box.add_child(UI.label(sub, 16, Color(1, 1, 1, 0.8), "bold"))


const TABS := [["home", "ACCUEIL", "icon_home"], ["pass", "PASS UNITÉ", "icon_star"],
	["daily", "ÉVÉNEMENTS QUOTIDIENS", "icon_flag"], ["special", "ÉVÉNEMENTS SPÉCIAUX", "icon_car"],
	["league", "MULTIJOUEUR", "icon_trophy"], ["career", "CARRIÈRE", "icon_flag"]]


func _build_bottom_bar() -> void:
	bottom_bar = PanelContainer.new()
	bottom_bar.add_theme_stylebox_override("panel", UI.box(Color(0, 0, 0, 0.95), Vector2.ZERO, Color(0, 0, 0, 0), 0, 0, 0))
	UI.place(bottom_bar, Control.PRESET_BOTTOM_WIDE, Vector2(0, -84), Vector2(0, 84))
	root.add_child(bottom_bar)
	var h := UI.hbox(0)
	bottom_bar.add_child(h)
	h.add_child(_hint_lbl("LT"))
	for t in TABS:
		var b := Button.new()
		b.focus_mode = Control.FOCUS_NONE
		b.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		b.custom_minimum_size = Vector2(150, 84)
		b.add_theme_font_override("font", UI.font("title"))
		b.add_theme_font_size_override("font_size", 19)
		b.text = t[1]
		b.icon = load("res://assets/ui/%s.png" % t[2])
		b.expand_icon = false
		b.icon_alignment = HORIZONTAL_ALIGNMENT_CENTER
		b.vertical_icon_alignment = VERTICAL_ALIGNMENT_TOP
		b.add_theme_constant_override("icon_max_width", 30)
		b.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		var key: String = t[0]
		b.pressed.connect(func():
			Sfx.click()
			stack.clear()
			if key != "home":
				stack.append("home")
			show_screen(key, {}, false))
		h.add_child(b)
		tab_buttons[key] = b
	h.add_child(_hint_lbl("RT"))


func _hint_lbl(t: String) -> Control:
	var p := UI.panel(Color(0.15, 0.15, 0.18), Vector2.ZERO, Color(0, 0, 0, 0), 0, 4)
	p.add_child(UI.label(t, 14, UI.WHITE, "bold", HORIZONTAL_ALIGNMENT_CENTER))
	var c := CenterContainer.new()
	c.custom_minimum_size = Vector2(46, 84)
	c.add_child(p)
	return c


func _style_tabs(active: String) -> void:
	for key in tab_buttons:
		var b: Button = tab_buttons[key]
		var on: bool = key == active
		var bgc := UI.WHITE if on else Color(0, 0, 0, 0)
		var fg := UI.BLACK if on else UI.WHITE
		for st in ["normal", "hover", "pressed"]:
			var sb := StyleBoxFlat.new()
			sb.bg_color = bgc if st != "hover" or on else Color(1, 1, 1, 0.08)
			sb.content_margin_top = 8
			sb.content_margin_bottom = 6
			b.add_theme_stylebox_override(st, sb)
		b.add_theme_stylebox_override("focus", StyleBoxEmpty.new())
		for c in ["font_color", "font_hover_color", "font_pressed_color"]:
			b.add_theme_color_override(c, fg)
		b.add_theme_color_override("icon_normal_color", fg)
		b.add_theme_color_override("icon_hover_color", fg)
		b.add_theme_color_override("icon_pressed_color", fg)


func _refresh_currency() -> void:
	credits_lbl.text = Game.fmt_num(Game.credits())
	tokens_lbl.text = Game.fmt_num(Game.tokens())


func toast(t: String, col: Color = UI.YELLOW) -> void:
	toast_lbl.text = t
	toast_lbl.add_theme_color_override("font_color", col)
	toast_lbl.modulate.a = 1.0
	var tw := create_tween()
	tw.tween_interval(1.6)
	tw.tween_property(toast_lbl, "modulate:a", 0.0, 0.5)


func dialog(title: String, text: String, buttons: Array) -> void:
	## buttons : [[texte, style, callable], ...]
	var layer := ColorRect.new()
	layer.color = Color(0.02, 0.0, 0.06, 0.78)
	UI.full_rect(layer)
	root.add_child(layer)
	var p := UI.panel(Color(0.10, 0.04, 0.24, 0.98), Vector2.ZERO, UI.MAGENTA, 3, 24)
	p.mouse_filter = Control.MOUSE_FILTER_STOP
	UI.place(p, Control.PRESET_CENTER, Vector2(-300, -170), Vector2(600, 300))
	layer.add_child(p)
	var v := UI.vbox(16)
	p.add_child(v)
	v.add_child(UI.label(title, 34, UI.WHITE, "title", HORIZONTAL_ALIGNMENT_CENTER))
	var l := UI.label(text, 22, Color(1, 1, 1, 0.9), "body", HORIZONTAL_ALIGNMENT_CENTER)
	l.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	l.custom_minimum_size = Vector2(540, 80)
	v.add_child(l)
	var h := UI.hbox(16)
	h.alignment = BoxContainer.ALIGNMENT_CENTER
	v.add_child(h)
	for b in buttons:
		var bt := UI.button(b[0], b[1], 24, Vector2(200, 56))
		var cb: Callable = b[2]
		bt.pressed.connect(func():
			layer.queue_free()
			if cb.is_valid():
				cb.call())
		h.add_child(bt)


# ---------------------------------------------------------------------------
# Navigation
# ---------------------------------------------------------------------------

func show_screen(name: String, params: Dictionary = {}, push: bool = true) -> void:
	if push and current != "" and current != name and current != "title":
		stack.append(current)
	current = name
	current_params = params
	for c in content.get_children():
		c.queue_free()
	var scr: Control = null
	var show_bottom := false
	var use_bg := true
	set_title("")
	match name:
		"title":
			scr = screens_main.title()
			use_bg = false
		"home":
			scr = screens_main.home()
			show_bottom = true
			use_bg = false
		"pass":
			scr = screens_main.pass_screen()
			show_bottom = true
		"objectives":
			scr = screens_main.objectives()
		"profile":
			scr = screens_main.profile()
		"settings":
			scr = screens_main.settings()
		"shop":
			scr = screens_main.shop()
		"daily":
			scr = screens_race.daily()
			show_bottom = true
		"special":
			scr = screens_race.special()
			show_bottom = true
		"league":
			scr = screens_race.league()
			show_bottom = true
		"career":
			scr = screens_race.career(params)
			show_bottom = true
		"season":
			scr = screens_race.season(params)
		"carselect":
			scr = screens_race.carselect(params)
		"cardetail":
			scr = screens_race.cardetail(params)
			use_bg = false
		"garage":
			scr = screens_race.garage(params)
	bg.visible = use_bg
	bottom_bar.visible = show_bottom
	top_bar.visible = name != "title"
	back_btn.visible = name != "home" and name != "title"
	_style_tabs(name if show_bottom else "")
	if scr != null:
		content.add_child(scr)
		scr.modulate.a = 0.0
		var tw := create_tween()
		tw.tween_property(scr, "modulate:a", 1.0, 0.18)


func back() -> void:
	if current == "home" or current == "title":
		return
	Sfx.play("ui_back", -4.0)
	if stack.is_empty():
		show_screen("home", {}, false)
		return
	var prev: String = stack.pop_back()
	var params := {}
	if prev == "season" or prev == "carselect":
		params = _last_params.get(prev, {})
	show_screen(prev, params, false)


var _last_params := {}


func remember(name: String, params: Dictionary) -> void:
	_last_params[name] = params


# ---------------------------------------------------------------------------
# Widgets partagés
# ---------------------------------------------------------------------------

func thumb(id: String) -> Texture2D:
	var p := THUMB_DIR + id + ".png"
	return load(p) if ResourceLoader.exists(p) else null


func blueprint_card(car: Dictionary, w: float = 110.0) -> Control:
	var h := w * 1.3
	var card := Control.new()
	card.custom_minimum_size = Vector2(w, h)
	card.mouse_filter = Control.MOUSE_FILTER_IGNORE
	var frame := Panel.new()
	frame.add_theme_stylebox_override("panel", UI.box(Color(0.96, 0.96, 0.98), Vector2.ZERO, Color(0, 0, 0, 0), 0, 4, 0))
	frame.size = Vector2(w, h)
	frame.mouse_filter = Control.MOUSE_FILTER_IGNORE
	card.add_child(frame)
	var top := ColorRect.new()
	top.color = Color("#3a7bff")
	top.position = Vector2(5, 5)
	top.size = Vector2(w - 10, h * 0.62)
	top.mouse_filter = Control.MOUSE_FILTER_IGNORE
	card.add_child(top)
	var tr := TextureRect.new()
	tr.texture = thumb(car.id)
	tr.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	tr.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	tr.position = Vector2(2, h * 0.12)
	tr.size = Vector2(w - 4, h * 0.5)
	tr.mouse_filter = Control.MOUSE_FILTER_IGNORE
	card.add_child(tr)
	var tag := UI.label("PLAN", maxi(10, int(w * 0.12)), UI.BLACK, "title")
	var tag_bg := PanelContainer.new()
	tag_bg.add_theme_stylebox_override("panel", UI.box(UI.LIME, UI.SKEW, Color(0, 0, 0, 0), 0, 0, 3))
	tag_bg.add_child(tag)
	tag_bg.position = Vector2(w * 0.5, 4)
	tag_bg.mouse_filter = Control.MOUSE_FILTER_IGNORE
	card.add_child(tag_bg)
	var cls := UI.label(car.cls, int(w * 0.28), UI.BLACK, "black")
	cls.position = Vector2(8, h * 0.6)
	card.add_child(cls)
	var nm := UI.label(car.brand + "\n" + car.model, maxi(9, int(w * 0.085)), UI.BLACK, "bold")
	nm.position = Vector2(w * 0.36, h * 0.68)
	nm.size = Vector2(w * 0.62, h * 0.3)
	card.add_child(nm)
	return card


func stars_row(n: int, total: int = 3, size: float = 22.0) -> HBoxContainer:
	var h := UI.hbox(2)
	for i in total:
		h.add_child(UI.icon("res://assets/ui/icon_star.png" if i < n else "res://assets/ui/icon_star_empty.png", size))
	return h


## Carte voiture façon « Sélection de voiture »
func car_card(car: Dictionary, on_tap: Callable, extra_lock: String = "") -> Control:
	var id: String = car.id
	var owned := Game.is_owned(id)
	var st := Game.car_state(id)
	var b := Button.new()
	b.focus_mode = Control.FOCUS_NONE
	b.custom_minimum_size = Vector2(390, 200)
	var col := Color(0.20, 0.07, 0.42, 0.92) if owned else Color(0.13, 0.05, 0.26, 0.85)
	b.add_theme_stylebox_override("normal", UI.box(col, Vector2.ZERO, Color(1, 1, 1, 0.08), 2, 2, 0))
	b.add_theme_stylebox_override("hover", UI.box(col.lightened(0.08), Vector2.ZERO, Color(1, 1, 1, 0.7), 3, 2, 0))
	b.add_theme_stylebox_override("pressed", UI.box(col.lightened(0.12), Vector2.ZERO, UI.WHITE, 3, 2, 0))
	b.add_theme_stylebox_override("focus", StyleBoxEmpty.new())
	b.pressed.connect(func():
		Sfx.click()
		on_tap.call())
	var tr := TextureRect.new()
	tr.texture = thumb(id)
	tr.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	tr.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	tr.position = Vector2(-6, 34)
	tr.size = Vector2(270, 140)
	tr.mouse_filter = Control.MOUSE_FILTER_IGNORE
	if not owned:
		tr.modulate = Color(0.55, 0.5, 0.65, 0.75)
	b.add_child(tr)
	# rang
	var rk := UI.panel(Color(0, 0, 0, 0.75), Vector2.ZERO, Color(0, 0, 0, 0), 0, 4)
	var rkh := UI.hbox(0)
	rk.add_child(rkh)
	rkh.add_child(UI.label(str(Game.car_rank(id)), 18, UI.LIME, "title"))
	rkh.add_child(UI.label("/" + str(car.rank[1]), 16, UI.WHITE, "title"))
	rk.position = Vector2(10, 8)
	b.add_child(rk)
	var sr := stars_row(Game.car_stars(id), 3, 16)
	sr.position = Vector2(12, 40)
	b.add_child(sr)
	if owned:
		var fu := UI.hbox(2)
		fu.add_child(UI.icon("res://assets/ui/icon_fuel.png", 18))
		fu.add_child(UI.label("%d/%d" % [Game.fuel(id), Game.FUEL_MAX], 16, UI.WHITE, "title"))
		fu.position = Vector2(110, 10)
		b.add_child(fu)
	var nm := UI.vbox(-4)
	nm.add_child(UI.label(car.brand, 15, Color(1, 1, 1, 0.8), "bold"))
	nm.add_child(UI.shadow(UI.label(car.model, 21, UI.WHITE, "title")))
	nm.position = Vector2(12, 150)
	b.add_child(nm)
	# plan + progression
	var bp := blueprint_card(car, 96)
	bp.position = Vector2(282, 10)
	b.add_child(bp)
	var need := CarsDB.blueprints_needed(car, int(st.stars))
	var bph := UI.hbox(4)
	bph.add_child(UI.icon("res://assets/ui/icon_blueprint.png", 18))
	bph.add_child(UI.label(("%d/%d" % [st.bp, need]) if need > 0 else "MAX", 17, UI.WHITE, "title"))
	bph.position = Vector2(286, 142)
	b.add_child(bph)
	var bar := UI.bar(float(st.bp) / maxf(1.0, need) if need > 0 else 1.0, 90, 5, UI.YELLOW)
	bar.position = Vector2(286, 170)
	b.add_child(bar)
	if not owned and Game.can_unlock(id):
		var ready := UI.panel(UI.LIME, UI.SKEW, Color(0, 0, 0, 0), 0, 4)
		ready.add_child(UI.label("PRÊTE À DÉBLOQUER", 15, UI.BLACK, "title"))
		ready.position = Vector2(10, 62)
		b.add_child(ready)
	elif not owned:
		var lk := UI.icon("res://assets/ui/icon_lock.png", 30)
		lk.position = Vector2(230, 150)
		b.add_child(lk)
	if extra_lock != "":
		var el := UI.panel(UI.RED, UI.SKEW, Color(0, 0, 0, 0), 0, 4)
		el.add_child(UI.label(extra_lock, 14, UI.WHITE, "title"))
		el.position = Vector2(10, 62)
		b.add_child(el)
	var cb := UI.class_badge(car.cls, 22)
	cb.position = Vector2(244, 8)
	b.add_child(cb)
	return b


func start_event(ev: Dictionary, car_id: String, touchdrive: bool) -> void:
	if not Game.is_owned(car_id):
		toast("VOITURE VERROUILLÉE", UI.RED)
		return
	if Game.fuel(car_id) <= 0:
		dialog("PLUS DE CARBURANT", "Cette voiture n'a plus de carburant. Recharge-la pour 20 jetons ou choisis une autre voiture.",
			[["RECHARGER (20)", "yellow", func():
				if Game.spend_tokens(20):
					Game.refill_fuel(car_id)
					start_event(ev, car_id, touchdrive)
				else:
					toast("PAS ASSEZ DE JETONS", UI.RED)], ["ANNULER", "white", Callable()]])
		return
	Game.use_fuel(car_id)
	Game.set_setting("touchdrive", touchdrive)
	Sfx.play("ui_confirm", -2.0)
	Sfx.stop_music(0.5)
	Game.start_race({"event": ev, "car": car_id, "touchdrive": touchdrive})
