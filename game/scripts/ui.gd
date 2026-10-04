class_name UI
extends CanvasLayer



var main: Node
var touch: = false
var joy_vec: = Vector2.ZERO
var joy_index: = -1
var joy_center: = Vector2.ZERO
var cam_index: = -1
var cam_last: = Vector2.ZERO
var cam_drag_delta: = Vector2.ZERO

var root: Control
var title_box: Control
var hud: Control
var msg_label: Label
var hp_bar: ProgressBar
var hp_label: Label
var xp_bg: ColorRect
var xp_fill: ColorRect
var stam_bar: ProgressBar
var party_rows: Array = []
var skill_icon: TextureRect
var burst_icon: TextureRect
var skill_cd: TextureProgressBar
var burst_cd: TextureProgressBar
var burst_ring: TextureProgressBar
var skill_lbl: Label
var burst_lbl: Label
var hit_rect: ColorRect
var title: Control
var victory: Control
var cutin: TextureRect
var joy_base: TextureRect
var joy_knob: TextureRect
var buttons: = {}
var tex: = {}
var icons: = {}
var map_ui: MapUI
var tracker: Control
var tr_title: Label
var tr_obj: Label
var tr_dist: Label
var prompt: Panel
var prompt_key: Label
var prompt_text: Label
var dialog: Control
var dlg_panel: Panel
var dlg_name: Label
var dlg_text: Label
var dlg_arrow: Label
var dlg_lines: Array = []
var dlg_index: = 0
var dlg_after: = Callable()
var dlg_open: = false
var boss_box: Control
var boss_name: Label
var boss_bar: ProgressBar
var banner: Label
var food_label: Label
var pause: Control
var continue_btn: Button
var _t: = 0.0
const PARTY_IDS: = ["kaelith", "lyra", "kael", "zahara"]
const PARTY_NAMES: = ["Kaelith", "Lyra", "Kael", "Zahara"]
const ROW_W: = 232.0
const ROW_H: = 58.0
const ROW_STEP: = 64.0

func _ready() -> void :
	layer = 5
	touch = DisplayServer.is_touchscreen_available() or OS.has_feature("mobile") or "--touch" in OS.get_cmdline_user_args()
	tex.circle = _circle_tex(128, Color(1, 1, 1, 1), 0.0)
	tex.dark = _circle_tex(128, Color(0, 0, 0, 0.62), 0.0)
	tex.ring = _circle_tex(128, Color(1, 1, 1, 1), 0.8)
	tex.btn = _circle_tex(128, Color(0.06, 0.07, 0.15, 0.4), 0.0, Color(1, 1, 1, 0.5))
	tex.clear = _circle_tex(128, Color(0, 0, 0, 0), 0.0)
	for who in PARTY_IDS:
		for k in ["skill", "burst", "na", "portrait"]:
			icons["%s_%s" % [who, k]] = load("res://ui/%s_%s.png" % [who, k])
	root = Control.new();root.set_anchors_preset(Control.PRESET_FULL_RECT);root.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(root)
	_build_hud()
	_build_dialog()
	_build_pause()
	_build_title()
	_build_victory()
	get_viewport().size_changed.connect(_layout)
	_layout()
	_layout.call_deferred()


func _circle_tex(sz: int, col: Color, hole: float, border: = Color(0, 0, 0, 0)) -> ImageTexture:
	var img: = Image.create_empty(sz, sz, false, Image.FORMAT_RGBA8)
	var c: = sz * 0.5
	for y in sz:
		for x in sz:
			var d: = Vector2(x + 0.5 - c, y + 0.5 - c).length() / c
			var a: = clampf((1.0 - d) * c * 0.5, 0.0, 1.0)
			if hole > 0.0: a *= clampf((d - hole) * c * 0.5, 0.0, 1.0)
			var px: = col
			if border.a > 0.0 and d > 0.9: px = border
			img.set_pixel(x, y, Color(px.r, px.g, px.b, px.a * a))
	return ImageTexture.create_from_image(img)

func _style(bg: Color, radius: = 6, border: = Color(0, 0, 0, 0), bw: = 0) -> StyleBoxFlat:
	var s: = StyleBoxFlat.new();s.bg_color = bg
	s.corner_radius_top_left = radius;s.corner_radius_top_right = radius
	s.corner_radius_bottom_left = radius;s.corner_radius_bottom_right = radius
	if bw > 0:
		s.border_color = border;s.border_width_left = bw;s.border_width_right = bw;s.border_width_top = bw;s.border_width_bottom = bw
	return s

func _bar(fill: Color, w: float, h: float) -> ProgressBar:
	var b: = ProgressBar.new();b.custom_minimum_size = Vector2(w, h);b.size = Vector2(w, h)
	b.show_percentage = false
	b.add_theme_stylebox_override("background", _style(Color(0.05, 0.06, 0.12, 0.75), 4))
	b.add_theme_stylebox_override("fill", _style(fill, 4))
	b.mouse_filter = Control.MOUSE_FILTER_IGNORE
	return b

func _label(text: String, size: int, col: = Color.WHITE) -> Label:
	var l: = Label.new();l.text = text
	l.add_theme_font_size_override("font_size", size)
	l.add_theme_color_override("font_color", col)
	l.add_theme_color_override("font_outline_color", Color(0.03, 0.04, 0.1, 0.9))
	l.add_theme_constant_override("outline_size", maxi(4, size / 5))
	l.mouse_filter = Control.MOUSE_FILTER_IGNORE
	return l

func _button(text: String, size: int, bg: Color, _fg: Color) -> Button:
	# boutons-pilules crème (le bouton principal, doré à l'origine, reçoit un liseré doré)
	var primary: = bg.r > 0.8 and bg.g > 0.6
	var b: = Button.new();b.text = text;b.add_theme_font_size_override("font_size", mini(size, 22))
	var n: = GStyle.sb(GStyle.CREAM_HI if primary else GStyle.CREAM, 24, GStyle.GOLD if primary else Color(0, 0, 0, 0), 2 if primary else 0)
	var h: = GStyle.sb(GStyle.CREAM_HI, 24, Color(1, 1, 1, 0.95), 3)
	var p: = GStyle.sb(GStyle.CREAM_DIM, 24)
	for st in [n, h, p]:
		st.content_margin_left = 18;st.content_margin_right = 18;st.content_margin_top = 6;st.content_margin_bottom = 6
	b.add_theme_stylebox_override("normal", n);b.add_theme_stylebox_override("hover", h)
	b.add_theme_stylebox_override("pressed", p);b.add_theme_stylebox_override("focus", h)
	for k in ["font_color", "font_hover_color", "font_pressed_color", "font_focus_color"]:
		b.add_theme_color_override(k, GStyle.INK)
	b.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
	return b



class Disc extends Control:
	var fill: = Color(0.05, 0.06, 0.13, 0.42)
	var ring: = Color(1, 1, 1, 0.5)
	var ring_w: = 2.0
	var icon: Texture2D
	var icon_mod: = Color(1, 1, 1, 0.95)
	var icon_scale: = 0.56
	var full_icon: = false
	var glow: = 0.0
	var glow_col: = Color(1, 0.9, 0.5)
	var on_click: = Callable()
	func _init() -> void :
		mouse_filter = Control.MOUSE_FILTER_IGNORE
	func clickable(cb: Callable) -> void :
		on_click = cb;mouse_filter = Control.MOUSE_FILTER_STOP
		mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
	func _gui_input(ev: InputEvent) -> void :
		if ev is InputEventMouseButton and ev.pressed and ev.button_index == MOUSE_BUTTON_LEFT and on_click.is_valid():
			if Input.mouse_mode == Input.MOUSE_MODE_VISIBLE:
				on_click.call();accept_event()
	func _draw() -> void :
		var r: = size.x * 0.5
		var c: = size * 0.5
		if glow > 0.0:
			for k in 5:
				draw_circle(c, r + 1.5 + k * 2.2, Color(glow_col.r, glow_col.g, glow_col.b, 0.09 * glow), true, -1.0, true)
		if fill.a > 0.0: draw_circle(c, r, fill, true, -1.0, true)
		if icon:
			var s: = size * (1.0 if full_icon else icon_scale)
			draw_texture_rect(icon, Rect2(c - s * 0.5, s), false, icon_mod)
		if ring_w > 0.0:
			draw_arc(c, r - ring_w * 0.5, 0, TAU, 56, ring, ring_w, true)


class Dial extends Control:
	var hour: = 8.0
	var target: = 8.0
	var sun_tex: Texture2D
	func _init() -> void :
		mouse_filter = Control.MOUSE_FILTER_IGNORE
	func _pt(h: float, r: float) -> Vector2:
		var a: = (h / 24.0) * TAU + PI * 0.5
		return size * 0.5 + Vector2(cos(a), sin(a)) * r
	func _draw() -> void :
		var c: = size * 0.5
		var r: = size.x * 0.5

		draw_circle(c, r, Color(0.05, 0.07, 0.16, 0.85), true, -1.0, true)
		var day: = PackedVector2Array([c])
		for k in 33:
			day.append(_pt(6.0 + 12.0 * k / 32.0, r * 0.96))
		draw_colored_polygon(day, Color(0.95, 0.78, 0.42, 0.16))
		draw_arc(c, r - 2.0, 0, TAU, 96, Color(1.0, 0.9, 0.65, 0.85), 3.0, true)
		draw_arc(c, r * 0.72, 0, TAU, 96, Color(1.0, 0.9, 0.65, 0.25), 1.5, true)
		for h in 24:
			var big: = h % 6 == 0
			draw_line(_pt(h, r * (0.84 if big else 0.89)), _pt(h, r * 0.95), Color(1, 0.95, 0.85, 0.9 if big else 0.5), 3.0 if big else 1.5, true)

		var span: = fposmod(target - hour, 24.0)
		if span > 0.01:
			var pts: = PackedVector2Array()
			for k in 41:
				pts.append(_pt(hour + span * k / 40.0, r * 0.78))
			draw_polyline(pts, Color(1.0, 0.82, 0.4, 0.9), 7.0, true)
		draw_line(c, _pt(hour, r * 0.62), Color(1, 1, 1, 0.95), 4.0, true)
		draw_line(c, _pt(target, r * 0.78), Color(1.0, 0.82, 0.4), 3.0, true)
		draw_circle(_pt(target, r * 0.78), 8.0, Color(1.0, 0.82, 0.4), true, -1.0, true)
		draw_circle(c, 7.0, Color(1, 0.95, 0.85), true, -1.0, true)

		var sp: = _pt(12.0, r * 0.52)
		draw_circle(sp, 11.0, Color(1.0, 0.85, 0.4), true, -1.0, true)
		for k in 8:
			var a: = k * TAU / 8.0
			draw_line(sp + Vector2(cos(a), sin(a)) * 15.0, sp + Vector2(cos(a), sin(a)) * 21.0, Color(1.0, 0.85, 0.4), 2.5, true)
		var mp: = _pt(0.0, r * 0.52)
		draw_circle(mp, 11.0, Color(0.85, 0.9, 1.0), true, -1.0, true)
		draw_circle(mp + Vector2(5, -4), 10.0, Color(0.05, 0.07, 0.16), true, -1.0, true)



class EnemyBars extends Control:
	var main: Node
	var elem_icons: = {}
	var state: = {}
	var draw_list: Array = []
	func _init() -> void :
		mouse_filter = Control.MOUSE_FILTER_IGNORE
		set_anchors_preset(Control.PRESET_FULL_RECT)
	func _process(dt: float) -> void :
		draw_list.clear()
		var cam: = get_viewport().get_camera_3d()
		if cam == null or main == null or not is_visible_in_tree():
			queue_redraw();return
		var vs: = get_viewport().get_visible_rect().size
		var seen: = {}
		for n in get_tree().get_nodes_in_group("enemies"):
			var e: = n as Enemy
			if e == null or not e.alive or e.is_object or e.is_boss or not e.is_visible_in_tree(): continue
			var id: = e.get_instance_id()
			seen[id] = true
			var f: = clampf(e.hp / maxf(1.0, e.max_hp), 0.0, 1.0)
			if not state.has(id): state[id] = {"f": f, "trail": f, "delay": 0.0, "hold": 0.0, "a": 0.0}
			var st: Dictionary = state[id]
			if f < st.f - 0.0001:
				st.delay = 0.45;st.hold = 9.0
			st.f = f
			if f > st.trail: st.trail = f
			elif st.delay > 0.0: st.delay -= dt
			else: st.trail = move_toward(st.trail, f, dt * 0.9)
			st.hold = maxf(0.0, st.hold - dt)
			var d: = cam.global_position.distance_to(e.global_position)
			var want: bool = st.hold > 0.0 or d < 20.0 or (e.alerted and d < 42.0)
			var head: = e.global_position + Vector3(0, e.bar_height(), 0)
			var on_screen: = not cam.is_position_behind(head)
			var sp: = cam.unproject_position(head) if on_screen else Vector2(-999, -999)
			if sp.x < -80 or sp.y < -40 or sp.x > vs.x + 80 or sp.y > vs.y + 40: on_screen = false
			st.a = move_toward(st.a, 1.0 if want and on_screen else 0.0, dt * 6.0)
			if st.a > 0.01 and on_screen:
				draw_list.append([sp, d, f, st.trail, st.a, e])
		for id in state.keys():
			if not seen.has(id): state.erase(id)

		draw_list.sort_custom( func(x, y): return x[1] > y[1])
		queue_redraw()
	func _draw() -> void :
		var font: = get_theme_default_font()
		var t: = Time.get_ticks_msec() / 1000.0
		for b in draw_list:
			var sp: Vector2 = b[0]; var d: float = b[1]; var f: float = b[2]; var trail: float = b[3]; var a: float = b[4]
			if not is_instance_valid(b[5]): continue
			var e: Enemy = b[5]
			var s: = clampf(1.18 - d * 0.013, 0.72, 1.12)
			var w: = (118.0 if e.kind == "golem" else (104.0 if e.kind == "slime_big" else 90.0)) * s
			var h: = maxf(5.0, 7.0 * s)
			var r: = Rect2(sp.x - w * 0.5, sp.y - h, w, h)
			draw_rect(r.grow(1.5), Color(0.02, 0.02, 0.05, 0.8 * a))
			draw_rect(r, Color(0.22, 0.18, 0.2, 0.7 * a))
			if trail > f:
				draw_rect(Rect2(r.position + Vector2(w * f, 0), Vector2(w * (trail - f), h)), Color(1.0, 0.93, 0.86, 0.95 * a))
			if f > 0.0:
				var fc: = Color(0.9, 0.25, 0.22) if e.frozen <= 0.0 else Color(0.5, 0.8, 1.0)
				draw_rect(Rect2(r.position, Vector2(w * f, h)), Color(fc, a))
				draw_rect(Rect2(r.position, Vector2(w * f, h * 0.42)), Color(1.0, 0.62, 0.55, 0.35 * a) if e.frozen <= 0.0 else Color(0.85, 0.95, 1.0, 0.4 * a))

			var fs: = int(round(14.0 * s))
			var lv: = "Nv.%d" % e.level()
			var lw: = font.get_string_size(lv, HORIZONTAL_ALIGNMENT_LEFT, -1, fs).x
			var lp: = Vector2(r.position.x - lw - 5.0, r.end.y + 1.0)
			draw_string_outline(font, lp, lv, HORIZONTAL_ALIGNMENT_LEFT, -1, fs, 4, Color(0.03, 0.03, 0.08, 0.85 * a))
			draw_string(font, lp, lv, HORIZONTAL_ALIGNMENT_LEFT, -1, fs, Color(1, 1, 1, 0.95 * a))

			var shown: Array = []
			for el in e.auras.keys():
				if e.auras[el] > 0.0 and elem_icons.has(el): shown.append(el)
			if shown.is_empty(): continue
			var isz: = 19.0 * s
			var x0: = sp.x - (shown.size() * isz + (shown.size() - 1) * 3.0) * 0.5
			for k in shown.size():
				var el: String = shown[k]
				var left: float = e.auras[el]
				var ia: = a * ((0.45 + 0.55 * absf(sin(t * 7.0))) if left < 1.6 else 1.0)
				var c: = Vector2(x0 + k * (isz + 3.0) + isz * 0.5, r.position.y - 5.0 - isz * 0.5)
				draw_circle(c, isz * 0.56, Color(0.02, 0.03, 0.08, 0.5 * ia), true, -1.0, true)
				var ec: Color = Enemy.ELEM_COLORS.get(el, Color.WHITE)
				draw_texture_rect(elem_icons[el], Rect2(c - Vector2(isz, isz) * 0.42, Vector2(isz, isz) * 0.84), false, Color(ec.lightened(0.25), ia))

var enemy_bars: EnemyBars
var menu_disc: Disc
var top_icons: = {}
var top_keys: = {}
var fps_label: Label
var tr_icon: TextureRect
var lvl_label: Label
var stam_wheel: TextureProgressBar
var food_disc: Disc
var skill_disc: Disc
var burst_disc: Disc
var keycaps: = {}
var time_menu: Control
var dial: Dial
var time_target: = 8.0
var quest_log: Control
var quest_list: VBoxContainer
var circle_shader: Shader
var square_portraits: = {}

const CIRCLE_SHADER: = "\nshader_type canvas_item;\nuniform vec4 ring_col : source_color = vec4(1.0, 0.92, 0.7, 1.0);\nuniform float ring = 0.07;\nvoid fragment() {\n\tvec2 d = UV - 0.5;\n\tfloat r = length(d) * 2.0;\n\tvec4 c = texture(TEXTURE, UV);\n\tfloat aa = fwidth(r) * 1.2;\n\tfloat inside = 1.0 - smoothstep(1.0 - aa, 1.0, r);\n\tfloat rg = smoothstep(1.0 - ring - aa, 1.0 - ring, r);\n\tc.rgb = mix(c.rgb, ring_col.rgb, rg * ring_col.a);\n\tCOLOR = vec4(c.rgb, inside * COLOR.a);\n}\n"















func _square(tex2: Texture2D) -> Texture2D:
	var img: = tex2.get_image()
	if img.is_compressed(): img.decompress()
	var s: = mini(img.get_width(), img.get_height())
	var sq: = img.get_region(Rect2i((img.get_width() - s) / 2, 0, s, s))
	return ImageTexture.create_from_image(sq)

func _portrait(who: String, sz: float) -> TextureRect:
	var t: = TextureRect.new()
	if not square_portraits.has(who): square_portraits[who] = _square(icons[who + "_portrait"])
	t.texture = square_portraits[who]
	t.expand_mode = TextureRect.EXPAND_IGNORE_SIZE;t.stretch_mode = TextureRect.STRETCH_SCALE
	t.size = Vector2(sz, sz);t.mouse_filter = Control.MOUSE_FILTER_IGNORE
	var m: = ShaderMaterial.new();m.shader = circle_shader
	t.material = m
	return t

func _keycap(text: String) -> Label:
	var l: = _label(text, 14, Color(0.12, 0.12, 0.16))
	var sb: = _style(Color(0.95, 0.94, 0.9, 0.92), 4)
	sb.content_margin_left = 5;sb.content_margin_right = 5;sb.content_margin_top = 0;sb.content_margin_bottom = 0
	l.add_theme_stylebox_override("normal", sb)
	l.add_theme_constant_override("outline_size", 0)
	l.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	return l

func _disc(icon: Texture2D, sz: float) -> Disc:
	var d: = Disc.new();d.icon = icon;d.size = Vector2(sz, sz)
	hud.add_child(d)
	return d


func _build_hud() -> void :
	hud = Control.new();hud.set_anchors_preset(Control.PRESET_FULL_RECT);hud.mouse_filter = Control.MOUSE_FILTER_IGNORE
	root.add_child(hud)
	circle_shader = Shader.new();circle_shader.code = CIRCLE_SHADER
	for k in ["map", "book", "clock", "gear", "sword", "jump", "dash", "talk", "pie", "quest", "el_hydro", "el_electro", "el_pyro", "el_lava", "el_cryo"]:
		icons["ic_" + k] = load("res://ui/icons/%s.png" % k)
	hit_rect = ColorRect.new();hit_rect.color = Color(1, 0.1, 0.1, 0.0);hit_rect.set_anchors_preset(Control.PRESET_FULL_RECT)
	hit_rect.mouse_filter = Control.MOUSE_FILTER_IGNORE;hud.add_child(hit_rect)
	var vm: = ShaderMaterial.new();vm.shader = load("res://shaders/vignette.gdshader");hit_rect.material = vm

	enemy_bars = EnemyBars.new();enemy_bars.main = main;enemy_bars.name = "EnemyBars"
	for el in ["hydro", "electro", "pyro", "lava", "cryo"]: enemy_bars.elem_icons[el] = icons["ic_el_" + el]
	hud.add_child(enemy_bars)
	map_ui = MapUI.new();map_ui.name = "Map"

	menu_disc = _disc(load("res://ui/emblem.png"), 62.0)
	menu_disc.full_icon = true;menu_disc.ring = Color(1.0, 0.88, 0.6, 0.9);menu_disc.ring_w = 2.5

	tracker = Control.new();tracker.mouse_filter = Control.MOUSE_FILTER_IGNORE;hud.add_child(tracker)
	tr_icon = TextureRect.new();tr_icon.texture = icons.ic_quest;tr_icon.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	tr_icon.size = Vector2(26, 26);tr_icon.position = Vector2(0, 2);tr_icon.modulate = Color(1.0, 0.82, 0.32)
	tr_icon.mouse_filter = Control.MOUSE_FILTER_IGNORE;tracker.add_child(tr_icon)
	tr_title = _label("", 19, Color(1.0, 0.85, 0.4));tr_title.position = Vector2(34, 0);tracker.add_child(tr_title)
	tr_obj = _label("", 16, Color(0.97, 0.97, 1.0));tr_obj.position = Vector2(34, 26);tr_obj.size = Vector2(300, 22)
	tr_obj.autowrap_mode = TextServer.AUTOWRAP_WORD;tracker.add_child(tr_obj)
	tr_dist = _label("", 15, Color(1.0, 0.92, 0.7));tr_dist.position = Vector2(34, 50);tracker.add_child(tr_dist)

	for spec in [["time", "ic_clock", "N"], ["quests", "ic_book", "L"], ["map", "ic_map", "M"], ["menu", "ic_gear", "Échap"]]:
		var d: = _disc(icons[spec[1]], 50.0)
		d.icon_scale = 0.62
		top_icons[spec[0]] = d
		if not touch:
			var kl: = _label(spec[2], 13, Color(1, 1, 1, 0.8));kl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
			kl.size = Vector2(60, 16);hud.add_child(kl);top_keys[spec[0]] = kl
	if not touch:
		top_icons.time.clickable( func(): show_time_menu( not time_menu.visible))
		top_icons.quests.clickable( func(): show_quest_log( not quest_log.visible))
		top_icons.map.clickable( func(): main.ui.map_ui.toggle())
		top_icons.menu.clickable( func(): main.toggle_pause())
		menu_disc.clickable( func(): main.toggle_pause())
	fps_label = _label("60 FPS", 14, Color(0.75, 1.0, 0.7))
	var fsb: = _style(Color(0.04, 0.05, 0.1, 0.45), 9);fsb.content_margin_left = 9;fsb.content_margin_right = 9
	fps_label.add_theme_stylebox_override("normal", fsb);hud.add_child(fps_label)
	msg_label = _label("", 32, Color(1, 0.95, 0.75));msg_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	msg_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	msg_label.modulate.a = 0.0;hud.add_child(msg_label)
	banner = _label("", 42, Color(1, 0.96, 0.85));banner.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	banner.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	banner.modulate.a = 0.0;hud.add_child(banner)

	lvl_label = _label("Niv. 1", 17, Color(1, 1, 1, 0.95));hud.add_child(lvl_label)
	hp_bar = ProgressBar.new();hp_bar.size = Vector2(360, 9);hp_bar.show_percentage = false
	hp_bar.add_theme_stylebox_override("background", _style(Color(0.02, 0.03, 0.06, 0.62), 5, Color(0.0, 0.0, 0.0, 0.55), 1))
	hp_bar.add_theme_stylebox_override("fill", _style(Color(0.55, 0.88, 0.33), 5))
	hp_bar.mouse_filter = Control.MOUSE_FILTER_IGNORE;hud.add_child(hp_bar)
	hp_label = _label("", 14, Color(1, 1, 1));hp_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	hp_label.size = Vector2(360, 18);hud.add_child(hp_label)
	xp_bg = ColorRect.new();xp_bg.color = Color(0.03, 0.04, 0.08, 0.45);xp_bg.size = Vector2(360, 2)
	xp_bg.mouse_filter = Control.MOUSE_FILTER_IGNORE;hud.add_child(xp_bg)
	xp_fill = ColorRect.new();xp_fill.color = Color(0.98, 0.82, 0.38);xp_fill.size = Vector2(0, 3)
	xp_fill.mouse_filter = Control.MOUSE_FILTER_IGNORE;xp_bg.add_child(xp_fill)

	stam_wheel = TextureProgressBar.new();stam_wheel.texture_under = _circle_tex(96, Color(0, 0, 0, 0.35), 0.72)
	stam_wheel.texture_progress = _circle_tex(96, Color(1, 1, 1, 1), 0.72)
	stam_wheel.tint_progress = Color(0.98, 0.88, 0.32)
	stam_wheel.fill_mode = TextureProgressBar.FILL_COUNTER_CLOCKWISE;stam_wheel.nine_patch_stretch = true
	stam_wheel.max_value = 100.0;stam_wheel.size = Vector2(46, 46);stam_wheel.mouse_filter = Control.MOUSE_FILTER_IGNORE
	hud.add_child(stam_wheel)

	for i in PARTY_IDS.size():
		var row: = Control.new();row.custom_minimum_size = Vector2(ROW_W, ROW_H);row.size = Vector2(ROW_W, ROW_H)
		row.mouse_filter = Control.MOUSE_FILTER_IGNORE
		var who: String = PARTY_IDS[i]
		var el: = Disc.new();el.icon = icons["ic_el_" + ["hydro", "electro", "pyro", "lava"][i]];el.size = Vector2(34, 34)
		el.position = Vector2(0, 12);el.icon_scale = 0.66;el.icon_mod = [FX.HYDRO, FX.ELECTRO, FX.PYRO, FX.LAVA][i].lightened(0.25)
		el.ring = Color(1, 1, 1, 0.35);el.glow_col = [FX.HYDRO, FX.ELECTRO, FX.PYRO, FX.LAVA][i]
		row.add_child(el)
		var name_l: = _label(PARTY_NAMES[i], 19);name_l.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
		name_l.size = Vector2(120, 24);name_l.position = Vector2(42, 6);row.add_child(name_l)
		var hb: = ProgressBar.new();hb.show_percentage = false;hb.size = Vector2(84, 5);hb.position = Vector2(78, 36)
		hb.add_theme_stylebox_override("background", _style(Color(0.03, 0.04, 0.08, 0.6), 3))
		hb.add_theme_stylebox_override("fill", _style(Color(0.47, 0.86, 0.32), 3))
		hb.mouse_filter = Control.MOUSE_FILTER_IGNORE;row.add_child(hb)
		var pic: = _portrait(who, 54.0);pic.position = Vector2(168, 2);row.add_child(pic)
		var key_l: Label = null
		if not touch:
			key_l = _keycap(str(i + 1));key_l.position = Vector2(ROW_W - 8, 20);row.add_child(key_l)
		hud.add_child(row)
		party_rows.append({"row": row, "hp": hb, "el": el, "name": name_l, "pic": pic, "key": key_l})

	skill_icon = TextureRect.new();burst_icon = TextureRect.new()
	for ic in [skill_icon, burst_icon]:
		ic.expand_mode = TextureRect.EXPAND_IGNORE_SIZE;ic.mouse_filter = Control.MOUSE_FILTER_IGNORE;hud.add_child(ic)
	burst_ring = TextureProgressBar.new();burst_ring.texture_progress = tex.ring;burst_ring.fill_mode = TextureProgressBar.FILL_CLOCKWISE
	burst_ring.nine_patch_stretch = true;burst_ring.max_value = 1.0;burst_ring.step = 0.001;burst_ring.mouse_filter = Control.MOUSE_FILTER_IGNORE
	hud.add_child(burst_ring)
	skill_cd = TextureProgressBar.new();burst_cd = TextureProgressBar.new()
	for cd in [skill_cd, burst_cd]:
		cd.texture_progress = tex.dark;cd.fill_mode = TextureProgressBar.FILL_COUNTER_CLOCKWISE;cd.nine_patch_stretch = true
		cd.max_value = 1.0;cd.step = 0.001;cd.mouse_filter = Control.MOUSE_FILTER_IGNORE;hud.add_child(cd)
	skill_lbl = _label("", 24);burst_lbl = _label("", 24)
	for l in [skill_lbl, burst_lbl]:
		l.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER;l.vertical_alignment = VERTICAL_ALIGNMENT_CENTER;hud.add_child(l)
	food_disc = _disc(icons.ic_pie, 52.0);food_disc.icon_scale = 0.6;food_disc.icon_mod = Color(1.0, 0.86, 0.6)
	food_label = _label("", 15, Color(1.0, 0.9, 0.7));hud.add_child(food_label)
	if not touch:
		for k in ["E", "Q", "H"]:
			var kc: = _keycap("A" if k == "Q" else k);hud.add_child(kc);keycaps[k] = kc

	boss_box = Control.new();boss_box.mouse_filter = Control.MOUSE_FILTER_IGNORE;boss_box.visible = false;hud.add_child(boss_box)
	boss_name = _label("", 22, Color(0.85, 0.95, 1.0));boss_name.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	boss_name.size = Vector2(560, 28);boss_box.add_child(boss_name)
	boss_bar = _bar(Color(0.95, 0.3, 0.35), 560, 9);boss_bar.position = Vector2(0, 32);boss_box.add_child(boss_bar)

	prompt = Panel.new();prompt.size = Vector2(300, 46);prompt.mouse_filter = Control.MOUSE_FILTER_IGNORE;prompt.visible = false
	prompt.add_theme_stylebox_override("panel", _style(Color(0.04, 0.06, 0.14, 0.62), 23, Color(1, 1, 1, 0.35), 1))
	hud.add_child(prompt)
	prompt_key = _label("F", 20, Color(0.1, 0.1, 0.15));prompt_key.position = Vector2(8, 7);prompt_key.size = Vector2(32, 32)
	prompt_key.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER;prompt_key.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	prompt_key.add_theme_constant_override("outline_size", 0)
	var kb: = Panel.new();kb.position = Vector2(8, 7);kb.size = Vector2(32, 32);kb.mouse_filter = Control.MOUSE_FILTER_IGNORE
	kb.add_theme_stylebox_override("panel", _style(Color(0.97, 0.95, 0.88), 16));prompt.add_child(kb);prompt.add_child(prompt_key)
	prompt_text = _label("", 20);prompt_text.position = Vector2(50, 10);prompt.add_child(prompt_text)
	cutin = TextureRect.new();cutin.expand_mode = TextureRect.EXPAND_IGNORE_SIZE;cutin.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_COVERED
	cutin.mouse_filter = Control.MOUSE_FILTER_IGNORE;cutin.modulate.a = 0.0;hud.add_child(cutin)
	if touch: _build_touch()
	hud.add_child(map_ui)
	_build_time_menu()
	_build_quest_log()

func _build_touch() -> void :
	joy_base = TextureRect.new();joy_base.texture = tex.btn;joy_base.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	joy_base.size = Vector2(200, 200);joy_base.mouse_filter = Control.MOUSE_FILTER_IGNORE;joy_base.modulate.a = 0.45;hud.add_child(joy_base)
	joy_knob = TextureRect.new();joy_knob.texture = tex.circle;joy_knob.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	joy_knob.size = Vector2(80, 80);joy_knob.modulate = Color(1, 1, 1, 0.65);joy_knob.mouse_filter = Control.MOUSE_FILTER_IGNORE;hud.add_child(joy_knob)

	prompt_key.text = ""
	var ki: = TextureRect.new();ki.texture = icons.ic_talk;ki.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	ki.size = Vector2(22, 22);ki.position = Vector2(13, 12);ki.modulate = Color(0.12, 0.12, 0.18);ki.mouse_filter = Control.MOUSE_FILTER_IGNORE
	prompt.add_child(ki)
	for spec in [["attack", 132, "ic_sword"], ["skill", 96, ""], ["burst", 104, ""], ["jump", 84, "ic_jump"], ["sprint", 84, "ic_dash"], 
					["interact", 0, ""], ["food", 64, "ic_pie"], ["pause", 50, ""], ["map", 50, ""], ["time_menu", 50, ""], 
					["quest_log", 50, ""], ["switch1", 0, ""], ["switch2", 0, ""], ["switch3", 0, ""], ["switch4", 0, ""]]:
		var b: = TouchBtn.new()
		b.action = spec[0]
		var sz: float = spec[1]
		if sz > 0:
			b.texture_normal = tex.btn if spec[0] in ["attack", "jump", "sprint", "food"] else tex.clear
			b.scale = Vector2.ONE * sz / 128.0
			b.radius = 64.0
			if spec[2] != "":
				var ic: = TextureRect.new();ic.texture = icons[spec[2]];ic.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
				ic.size = Vector2(76, 76);ic.position = Vector2(26, 26);ic.modulate = Color(1, 1, 1, 0.92);ic.name = "Icon"
				ic.mouse_filter = Control.MOUSE_FILTER_IGNORE;b.add_child(ic)
			if spec[0] == "food":
				var l: = _label("", 34);l.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
				l.size = Vector2(124, 40);l.position = Vector2(0, 96);l.name = "L";b.add_child(l)
		else:
			b.rect_size = Vector2(ROW_W, ROW_H)
		hud.add_child(b)
		buttons[spec[0]] = b

func _layout() -> void :
	var vs: = get_viewport().get_visible_rect().size
	if title_box:
		var sc: = minf(1.0, minf(vs.y / 720.0, vs.x / 1180.0))
		title_box.scale = Vector2(sc, sc)
		title_box.position = (vs - title_box.size * sc) * 0.5
	if victory and victory.has_node("Continue"):
		var cb: Button = victory.get_node("Continue")
		cb.position = Vector2(vs.x * 0.5 - cb.size.x * 0.5, vs.y - 140)
	for mnu in [paimon, char_menu, settings_menu, bag_menu]:
		if mnu: mnu.layout(vs)
	if time_menu:
		var tb: Control = time_menu.get_node("Box");tb.position = (vs - tb.size) * 0.5
	if quest_log:
		var qb: Control = quest_log.get_node("Box");qb.position = (vs - qb.size) * 0.5

	menu_disc.position = Vector2(14, 14)
	tracker.position = Vector2(18, 214)

	var names: = ["time", "quests", "map", "menu"]
	for k in names.size():
		var d: Disc = top_icons[names[k]]
		d.position = Vector2(vs.x - 70 - (names.size() - 1 - k) * 62, 14)
		if top_keys.has(names[k]):
			var kl: Label = top_keys[names[k]];kl.position = d.position + Vector2(-5, 52)
	fps_label.position = Vector2(vs.x - 96, 84)
	var mw: = clampf(vs.x - 580.0, 420.0, 900.0)
	msg_label.size = Vector2(mw, 50);msg_label.position = Vector2((vs.x - mw) * 0.5, vs.y * 0.22)
	var bw: = clampf(vs.x - 520.0, 480.0, 1000.0)
	banner.size = Vector2(bw, 60);banner.position = Vector2((vs.x - bw) * 0.5, vs.y * 0.1)

	var cx: = vs.x * 0.5
	hp_bar.position = Vector2(cx - 180, vs.y - 36)
	hp_label.position = Vector2(cx - 180, vs.y - 58)
	xp_bg.position = Vector2(cx - 180, vs.y - 23)
	lvl_label.position = Vector2(cx - 240, vs.y - 45)
	stam_wheel.position = Vector2(cx + 62, vs.y * 0.5 - 32)
	boss_box.position = Vector2(cx - 280, 22)

	for i in party_rows.size():
		party_rows[i].row.position = Vector2(vs.x - ROW_W - (28 if not touch else 14), 150 + i * ROW_STEP)
	prompt.position = Vector2(vs.x * 0.6, vs.y * 0.52)
	dlg_panel.size = Vector2(minf(vs.x - 80, 980), 170);dlg_panel.position = Vector2((vs.x - dlg_panel.size.x) * 0.5, vs.y - 190)
	dlg_name.size = Vector2(dlg_panel.size.x, 34)
	(dlg_panel.get_node("Line") as ColorRect).position = Vector2(dlg_panel.size.x * 0.5 - 110, 44)
	dlg_arrow.position = Vector2(dlg_panel.size.x * 0.5 - 8, 140)
	dlg_text.size = Vector2(dlg_panel.size.x - 60, 90)
	map_ui.layout(vs)

	var skill_pos: = Vector2(vs.x - 214, vs.y - 104); var burst_pos: = Vector2(vs.x - 118, vs.y - 118)
	var ssz: = 74.0; var bsz: = 92.0
	if touch:
		skill_pos = Vector2(vs.x - 380, vs.y - 158);burst_pos = Vector2(vs.x - 360, vs.y - 302)
		ssz = 96.0;bsz = 104.0
	skill_icon.position = skill_pos;skill_icon.size = Vector2(ssz, ssz)
	skill_cd.position = skill_pos;skill_cd.size = Vector2(ssz, ssz)
	skill_lbl.position = skill_pos;skill_lbl.size = Vector2(ssz, ssz)
	burst_icon.position = burst_pos;burst_icon.size = Vector2(bsz, bsz)
	burst_cd.position = burst_pos;burst_cd.size = Vector2(bsz, bsz)
	burst_lbl.position = burst_pos;burst_lbl.size = Vector2(bsz, bsz)
	burst_ring.position = burst_pos - Vector2(7, 7);burst_ring.size = Vector2(bsz + 14, bsz + 14)
	food_disc.position = Vector2(vs.x - 290, vs.y - 86)
	food_label.position = food_disc.position + Vector2(36, 34)
	if keycaps.has("E"):
		(keycaps.E as Label).position = skill_pos + Vector2(ssz * 0.5 - 9, ssz + 4)
		(keycaps.Q as Label).position = burst_pos + Vector2(bsz * 0.5 - 9, bsz + 2)
		(keycaps.H as Label).position = food_disc.position + Vector2(17, 54)
	cutin.size = Vector2(vs.x * 0.45, vs.y * 0.6);cutin.position = Vector2(vs.x, vs.y * 0.2)
	if touch:
		food_disc.visible = false
		joy_center = Vector2(180, vs.y - 170)
		joy_base.position = joy_center - joy_base.size * 0.5
		joy_knob.position = joy_center - joy_knob.size * 0.5
		var place: = {"attack": Vector2(vs.x - 236, vs.y - 236), "skill": skill_pos, "burst": burst_pos, 
			"jump": Vector2(vs.x - 124, vs.y - 330), "sprint": Vector2(vs.x - 116, vs.y - 112), 
			"food": Vector2(vs.x - 500, vs.y - 92), 
			"pause": top_icons.menu.position, "map": top_icons.map.position, "time_menu": top_icons.time.position, 
			"quest_log": top_icons.quests.position}
		for k in place: buttons[k].position = place[k]
		for i in party_rows.size():
			buttons["switch%d" % (i + 1)].position = party_rows[i].row.position + Vector2(ROW_W, ROW_H) * 0.5


func _input(event: InputEvent) -> void :
	if not touch: return
	if dlg_open or (map_ui and map_ui.open) or (pause and pause.visible) or (title and title.visible): return
	if (time_menu and time_menu.visible) or (quest_log and quest_log.visible): return
	var vs: = get_viewport().get_visible_rect().size
	if event is InputEventScreenTouch:
		if event.pressed:
			if event.position.x < vs.x * 0.4 and event.position.y > vs.y * 0.35 and joy_index < 0:
				joy_index = event.index
				joy_center = event.position
				joy_base.position = joy_center - joy_base.size * 0.5
				_update_joy(event.position)
			elif cam_index < 0 and not _over_button(event.position) and not _over_minimap(event.position):
				cam_index = event.index;cam_last = event.position
		else:
			if event.index == joy_index:
				joy_index = -1;joy_vec = Vector2.ZERO
				joy_knob.position = joy_center - joy_knob.size * 0.5
			if event.index == cam_index: cam_index = -1
	elif event is InputEventScreenDrag:
		if event.index == joy_index: _update_joy(event.position)
		elif event.index == cam_index:
			cam_drag_delta += event.position - cam_last
			cam_last = event.position


func _process(_d: float) -> void :
	if main and main.paused and Engine.get_process_frames() != main.pause_frame and Input.is_action_just_pressed("pause"):
		if sub_menu: close_sub()
		else: main.toggle_pause()

func _over_minimap(p: Vector2) -> bool:
	return p.distance_to(map_ui.mini.position + map_ui.mini.size * 0.5) < map_ui.mini_size * 0.5 + 6.0

func _over_button(p: Vector2) -> bool:
	for k in buttons:
		var b: TouchBtn = buttons[k]
		if not b.visible: continue
		if b.texture_normal:
			var sz: = 128.0 * b.scale.x
			if Rect2(b.position, Vector2(sz, sz)).has_point(p): return true
		elif Rect2(b.position - b.rect_size * 0.5, b.rect_size).has_point(p): return true
	return false

func _update_joy(p: Vector2) -> void :
	var d: = p - joy_center
	var m: = 80.0
	if d.length() > m: d = d.normalized() * m
	joy_knob.position = joy_center + d - joy_knob.size * 0.5
	joy_vec = Vector2(d.x / m, - d.y / m)

func release_touch() -> void :
	joy_index = -1;joy_vec = Vector2.ZERO;cam_index = -1
	if joy_knob: joy_knob.position = joy_center - joy_knob.size * 0.5

func take_cam_drag() -> Vector2:
	var d: = cam_drag_delta;cam_drag_delta = Vector2.ZERO
	return d


func refresh(party: Party) -> void :
	var dt: = get_process_delta_time()
	_t += dt
	var c: = party.ch()
	var who: String = c.name.to_lower()
	hp_bar.max_value = c.max_hp;hp_bar.value = c.hp
	hp_label.text = "%d / %d" % [int(c.hp), int(c.max_hp)]
	lvl_label.text = "Niv. %d" % main.rank
	var hp_low: bool = c.hp < c.max_hp * 0.3
	(hp_bar.get_theme_stylebox("fill") as StyleBoxFlat).bg_color = Color(0.95, 0.35, 0.3) if hp_low else Color(0.55, 0.88, 0.33)
	xp_fill.size.x = 360.0 * clampf(float(main.xp) / maxf(1.0, float(main.xp_needed())), 0.0, 1.0)
	stam_wheel.value = party.stamina
	var show_st: bool = party.stamina < 99.5
	stam_wheel.modulate.a = move_toward(stam_wheel.modulate.a, 1.0 if show_st else 0.0, dt * 4.0)
	stam_wheel.tint_progress = Color(0.98, 0.88, 0.32) if party.stamina > 25.0 else Color(1.0, 0.45, 0.3)
	skill_icon.texture = icons[who + "_skill"];burst_icon.texture = icons[who + "_burst"]
	skill_cd.value = c.skill_cd / c.skill_cd_max
	burst_cd.value = c.burst_cd / c.burst_cd_max
	skill_lbl.text = ("%.1f" % c.skill_cd) if c.skill_cd > 0.0 else ""
	var ready: bool = c.energy >= c.energy_max
	burst_lbl.text = ("%.1f" % c.burst_cd) if c.burst_cd > 0.0 else ""
	burst_ring.value = c.energy / c.energy_max
	burst_ring.tint_progress = FX.element_color(c.element) if not ready else Color(1, 0.95, 0.6).lerp(Color(1, 1, 1), 0.5 + 0.5 * sin(_t * 6.0))
	burst_icon.modulate = Color(1, 1, 1) if ready else Color(0.62, 0.62, 0.72)
	for i in party_rows.size():
		var o: Dictionary = party.chars[i]
		var r: Dictionary = party_rows[i]
		r.hp.max_value = o.max_hp;r.hp.value = o.hp
		var act: = i == party.active
		var full: bool = o.energy >= o.energy_max
		var el: Disc = r.el
		el.glow = (0.6 + 0.4 * sin(_t * 5.0 + i)) if full else 0.0
		el.fill = Color(0.05, 0.06, 0.13, 0.62 if full else 0.38)
		el.ring = el.glow_col.lightened(0.3) if full else Color(1, 1, 1, 0.3)
		el.queue_redraw()
		(r.name as Label).text = ("✦ " if act else "") + PARTY_NAMES[i]
		el.position.x = 162.0 - (r.name as Label).get_minimum_size().x - 40.0
		(r.name as Label).modulate = Color(1, 1, 1, 1.0 if act else 0.78)
		var pm: ShaderMaterial = (r.pic as TextureRect).material
		pm.set_shader_parameter("ring_col", Color(1.0, 0.86, 0.5, 1.0) if act else Color(1, 1, 1, 0.45))
		(r.pic as TextureRect).modulate = Color(1, 1, 1) if o.alive else Color(0.45, 0.4, 0.4)
		r.row.modulate.a = 1.0 if o.alive else 0.7
	food_disc.visible = not touch and main.food > 0
	food_label.text = ("×%d" % main.food) if main.food > 0 and not touch else ""
	if keycaps.has("H"): (keycaps.H as Label).visible = main.food > 0
	if touch and buttons.has("food"):
		buttons["food"].visible = main.food > 0
		var fl: Label = buttons["food"].get_node("L");fl.text = "×%d" % main.food
	if Engine.get_frames_drawn() % 20 == 0:
		var fps: = Engine.get_frames_per_second()
		fps_label.text = "%d FPS" % fps
		fps_label.add_theme_color_override("font_color", Color(0.75, 1.0, 0.7) if fps >= 45 else (Color(1.0, 0.9, 0.5) if fps >= 25 else Color(1.0, 0.55, 0.45)))

	var qid: String = main.quests.tracked
	tracker.visible = qid != "" or main.dungeon != null
	if main.dungeon:
		tr_title.text = String(main.dungeon.def.name)
		tr_title.add_theme_color_override("font_color", Color(1.0, 0.72, 0.45))
		tr_icon.modulate = Color(1.0, 0.72, 0.45)
		tr_obj.text = main.dungeon.objective()
		tr_dist.text = "Nv. %d" % int(main.dungeon.def.lvl)
		tr_dist.position.y = 26 + maxf(22.0, tr_obj.get_minimum_size().y) + 2
	elif qid != "":
		var is_main: bool = qid == "main"
		tr_title.text = main.quests.title(qid)
		tr_title.add_theme_color_override("font_color", Color(1.0, 0.85, 0.4) if is_main else Color(0.55, 0.85, 1.0))
		tr_icon.modulate = Color(1.0, 0.82, 0.32) if is_main else Color(0.55, 0.85, 1.0)
		tr_obj.text = main.quests.objective(qid)
		var tp: Vector3 = main.quests.target(qid)
		tr_dist.text = "%d m" % int(party.global_position.distance_to(tp)) if tp != Vector3.INF else ""
		tr_dist.position.y = 26 + maxf(22.0, tr_obj.get_minimum_size().y) + 2

	var boss: Enemy = main.active_boss()
	boss_box.visible = boss != null
	if boss_box.visible:
		boss_name.text = "%s   Nv. %d" % [boss.boss_name, boss.level()]
		boss_bar.max_value = boss.max_hp;boss_bar.value = boss.hp
	if dlg_open:
		dlg_arrow.modulate.a = 0.5 + 0.5 * sin(_t * 6.0)
	if time_menu.visible:
		dial.hour = main.daynight.hour;dial.target = time_target;dial.queue_redraw()
		(time_menu.get_node("Box/Now") as Label).text = "Maintenant : %s   »   %s" % [main.daynight.clock_text(), _fmt_hour(time_target)]

func _fmt_hour(h: float) -> String:
	return "%02d:%02d" % [int(h), int(fmod(h, 1.0) * 60.0)]


func _build_time_menu() -> void :
	time_menu = Control.new();time_menu.set_anchors_preset(Control.PRESET_FULL_RECT);time_menu.visible = false
	time_menu.mouse_filter = Control.MOUSE_FILTER_STOP;root.add_child(time_menu)
	time_menu.add_child(GStyle.backdrop(true, 0.85))
	var box: = Control.new();box.name = "Box";box.size = Vector2(760, 470);time_menu.add_child(box)
	var t: = GStyle.Header.new("Heure du jour", "Fais avancer le temps jusqu'à l'heure choisie");t.position = Vector2(0, -20);t.size = Vector2(760, 70)
	box.add_child(t)
	dial = Dial.new();dial.size = Vector2(300, 300);dial.position = Vector2(30, 70);box.add_child(dial)
	var now: = _label("", 20, Color(0.92, 0.95, 1.0));now.name = "Now";now.position = Vector2(0, 384);now.size = Vector2(360, 26)
	now.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER;box.add_child(now)
	var col: = VBoxContainer.new();col.position = Vector2(390, 70);col.size = Vector2(340, 340)
	col.add_theme_constant_override("separation", 10);box.add_child(col)
	for spec in [["Aube", 6.0], ["Midi", 12.0], ["Crépuscule", 18.0], ["Nuit", 0.0]]:
		var b: = _button("  %s  (%s)  " % [spec[0], _fmt_hour(spec[1])], 22, Color(0.16, 0.2, 0.36), Color(0.95, 0.95, 1.0))
		b.custom_minimum_size = Vector2(340, 50)
		b.pressed.connect( func(): time_target = spec[1];main.audio.play("click", -6.0))
		col.add_child(b)
	var row: = HBoxContainer.new();row.add_theme_constant_override("separation", 10);col.add_child(row)
	for spec2 in [["− 1 h", -1.0], ["+ 1 h", 1.0]]:
		var b2: = _button("  %s  " % spec2[0], 22, Color(0.16, 0.2, 0.36), Color(0.95, 0.95, 1.0))
		b2.custom_minimum_size = Vector2(165, 46)
		b2.pressed.connect( func(): time_target = fposmod(round(time_target) + spec2[1], 24.0);main.audio.play("click", -6.0))
		row.add_child(b2)
	var ok: = _button("  Confirmer  ", 26, Color(0.95, 0.78, 0.35), Color(0.12, 0.1, 0.2));ok.custom_minimum_size = Vector2(340, 56)
	ok.pressed.connect(_confirm_time);col.add_child(ok)
	var close: = _button("  Fermer  ", 22, Color(0.12, 0.14, 0.26), Color(0.9, 0.9, 1.0));close.custom_minimum_size = Vector2(340, 46)
	close.pressed.connect( func(): show_time_menu(false));col.add_child(close)

func show_time_menu(on: bool) -> void :
	time_menu.visible = on
	if on:
		time_target = fposmod(round(main.daynight.hour + 6.0), 24.0)
		release_touch()
	main.set_menu_mouse(on)

func _confirm_time() -> void :
	main.daynight.fast_forward(time_target)
	main.audio.play("waypoint", -4.0)
	show_time_menu(false)


func _build_quest_log() -> void :
	quest_log = Control.new();quest_log.set_anchors_preset(Control.PRESET_FULL_RECT);quest_log.visible = false
	quest_log.mouse_filter = Control.MOUSE_FILTER_STOP;root.add_child(quest_log)
	quest_log.add_child(GStyle.backdrop(true, 0.9))
	var box: = Control.new();box.name = "Box";box.size = Vector2(760, 520);quest_log.add_child(box)
	var t: = GStyle.Header.new("Journal des quêtes", "Quêtes en cours • Contrats de la Guilde");t.position = Vector2(0, -24);t.size = Vector2(760, 70)
	box.add_child(t)
	var scroll: = ScrollContainer.new();scroll.position = Vector2(0, 58);scroll.size = Vector2(760, 400)
	scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED;box.add_child(scroll)
	quest_list = VBoxContainer.new();quest_list.custom_minimum_size = Vector2(740, 0)
	quest_list.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	quest_list.add_theme_constant_override("separation", 8);scroll.add_child(quest_list)
	var close: = _button("  Fermer (L)  ", 22, Color(0.12, 0.14, 0.26), Color(0.9, 0.9, 1.0));close.position = Vector2(270, 468)
	close.custom_minimum_size = Vector2(220, 46);close.pressed.connect( func(): show_quest_log(false));box.add_child(close)

func show_quest_log(on: bool) -> void :
	quest_log.visible = on
	if on:
		release_touch()
		for ch in quest_list.get_children(): ch.queue_free()
		var ids: Array = main.quests.active_list()
		if ids.is_empty():
			quest_list.add_child(_label("Aucune quête en cours. Parle aux villageois !", 22, Color(0.9, 0.92, 1.0)))
		for id in ids:
			var row: = PanelContainer.new()
			var sb: = GStyle.sb(Color(0.09, 0.1, 0.16, 0.82), 12, Color(GStyle.GOLD, 0.85) if id == main.quests.tracked else Color(1, 1, 1, 0.12), 2)
			sb.content_margin_left = 16;sb.content_margin_right = 16;sb.content_margin_top = 8;sb.content_margin_bottom = 8
			row.add_theme_stylebox_override("panel", sb)
			var hb: = HBoxContainer.new();hb.add_theme_constant_override("separation", 12);row.add_child(hb)
			var tx: = VBoxContainer.new();tx.size_flags_horizontal = Control.SIZE_EXPAND_FILL;hb.add_child(tx)
			var tl: = _label(("★ " if id == "main" else "◆ ") + main.quests.title(id), 21, Color(1.0, 0.85, 0.4) if id == "main" else Color(0.6, 0.88, 1.0))
			tx.add_child(tl)
			var ob: = _label(main.quests.objective(id), 17, Color(0.95, 0.95, 1.0));ob.autowrap_mode = TextServer.AUTOWRAP_WORD
			ob.custom_minimum_size = Vector2(520, 0);tx.add_child(ob)
			var tb: = _button("  Suivre  " if id != main.quests.tracked else "  Suivie  ", 19, Color(0.95, 0.78, 0.35) if id != main.quests.tracked else Color(0.25, 0.3, 0.45), Color(0.12, 0.1, 0.2) if id != main.quests.tracked else Color(0.9, 0.9, 1.0))
			tb.pressed.connect( func(): main.quests.tracked = id;main._on_quests_changed();show_quest_log(true))
			hb.add_child(tb)
			quest_list.add_child(row)

		var qs: Quests = main.quests
		if qs.st("main") != "available":
			var head: = _label("Guilde des aventuriers — Isaure, à Brise-Marée", 20, Color(1.0, 0.72, 0.45))
			quest_list.add_child(head)
			for gid in Quests.GUILD:
				var stt: = qs.st(gid)
				if stt == "active" or stt == "ready": continue
				var need: = int(Quests.DEFS[gid].rank)
				var line: = ""
				var col: = Color(0.8, 0.82, 0.9)
				match stt:
					"available": line = "Disponible : va voir Isaure";col = Color(0.75, 1.0, 0.7)
					"done": line = "Accomplie";col = Color(0.6, 0.65, 0.75)
					_: line = "Rang d'aventure %d requis (tu es rang %d)" % [need, main.rank];col = Color(1.0, 0.62, 0.55)
				var r2: = _label("◆ %s  —  %s" % [Quests.DEFS[gid].title, line], 17, col)
				r2.autowrap_mode = TextServer.AUTOWRAP_WORD;r2.custom_minimum_size = Vector2(720, 0)
				quest_list.add_child(r2)
	main.set_menu_mouse(on)

func show_prompt(verb: String, what: String) -> void :
	if verb == "":
		prompt.visible = false
		if touch and buttons.has("interact"): buttons["interact"].visible = false
		return
	prompt.visible = true
	prompt_text.text = "%s %s" % [verb, what]
	prompt.size.x = 80 + prompt_text.get_minimum_size().x
	if touch:

		var b: TouchBtn = buttons["interact"]
		b.visible = true
		b.rect_size = prompt.size + Vector2(16, 16)
		b.position = prompt.position + prompt.size * 0.5

var _msg_tw: Tween
var _msg_t0: = -10.0
var _msg_prev: = ""
var _banner_tw: Tween
func message(text: String, dur: = 2.2, col: = Color(1, 0.95, 0.75)) -> void :

	var now: = Time.get_ticks_msec() / 1000.0
	if now - _msg_t0 < 0.35 and _msg_prev != "" and not _msg_prev.contains(text):
		var stack: = (_msg_prev + "\n" + text).split("\n")
		text = "\n".join(stack.slice(maxi(0, stack.size() - 3)))
	_msg_prev = text
	_msg_t0 = now
	msg_label.text = text
	msg_label.add_theme_color_override("font_color", col)
	if _msg_tw: _msg_tw.kill()
	_msg_tw = msg_label.create_tween()
	_msg_tw.tween_property(msg_label, "modulate:a", 1.0, 0.2)
	_msg_tw.tween_interval(dur)
	_msg_tw.tween_property(msg_label, "modulate:a", 0.0, 0.5)

func show_banner(text: String, col: = Color(1, 0.96, 0.85)) -> void :
	banner.text = "— %s —" % text
	banner.add_theme_color_override("font_color", col)
	if _banner_tw: _banner_tw.kill()
	_banner_tw = banner.create_tween()
	_banner_tw.tween_property(banner, "modulate:a", 1.0, 0.6)
	_banner_tw.tween_interval(2.0)
	_banner_tw.tween_property(banner, "modulate:a", 0.0, 0.8)

var toast_box: VBoxContainer

## Fil des objets obtenus (à gauche de l'écran, comme dans les action-RPG).
func toast(text: String, icon_tex: Texture2D = null, col: = Color(1, 1, 1)) -> void :
	if toast_box == null:
		toast_box = VBoxContainer.new();toast_box.add_theme_constant_override("separation", 6)
		toast_box.mouse_filter = Control.MOUSE_FILTER_IGNORE;hud.add_child(toast_box)
	var vs: = get_viewport().get_visible_rect().size
	toast_box.position = Vector2(18, vs.y * 0.46)
	var p: = PanelContainer.new();p.mouse_filter = Control.MOUSE_FILTER_IGNORE
	var st: = GStyle.sb(Color(0.05, 0.06, 0.1, 0.55), 18);st.content_margin_left = 8;st.content_margin_right = 18
	st.content_margin_top = 4;st.content_margin_bottom = 4;p.add_theme_stylebox_override("panel", st)
	var h: = HBoxContainer.new();h.add_theme_constant_override("separation", 8);p.add_child(h)
	if icon_tex:
		var ic: = TextureRect.new();ic.texture = icon_tex;ic.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
		ic.custom_minimum_size = Vector2(28, 28);ic.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED;h.add_child(ic)
	else:
		var dot: = GStyle.label("◆", 16, GStyle.GOLD);h.add_child(dot)
	h.add_child(GStyle.label(text, 18, col, 3))
	toast_box.add_child(p)
	while toast_box.get_child_count() > 5:
		toast_box.get_child(0).queue_free();toast_box.remove_child(toast_box.get_child(0))
	p.modulate.a = 0.0
	var tw: = p.create_tween()
	tw.tween_property(p, "modulate:a", 1.0, 0.2)
	tw.tween_interval(2.6)
	tw.tween_property(p, "modulate:a", 0.0, 0.5)
	tw.tween_callback(p.queue_free)

func flash_hit() -> void :
	hit_rect.color.a = 0.55
	var tw: = hit_rect.create_tween();tw.tween_property(hit_rect, "color:a", 0.0, 0.35)

func burst_cutin(name: String) -> void :
	cutin.texture = icons[name.to_lower() + "_portrait"]
	var vs: = get_viewport().get_visible_rect().size
	cutin.position = Vector2(vs.x, vs.y * 0.18);cutin.modulate.a = 0.0
	var tw: = cutin.create_tween().set_parallel(true)
	tw.tween_property(cutin, "position:x", vs.x * 0.52, 0.25).set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_OUT)
	tw.tween_property(cutin, "modulate:a", 1.0, 0.2)
	tw.chain().tween_interval(0.45)
	tw.chain().tween_property(cutin, "modulate:a", 0.0, 0.25)


func _build_dialog() -> void :
	dialog = Control.new();dialog.set_anchors_preset(Control.PRESET_FULL_RECT);dialog.visible = false
	dialog.mouse_filter = Control.MOUSE_FILTER_STOP
	dialog.gui_input.connect(_on_dialog_input)
	root.add_child(dialog)

	var grad: = Gradient.new()
	grad.set_color(0, Color(0, 0, 0, 0.0));grad.set_color(1, Color(0.0, 0.01, 0.04, 0.82))
	grad.add_point(0.55, Color(0.0, 0.01, 0.04, 0.55))
	var gt: = GradientTexture2D.new();gt.gradient = grad;gt.fill_from = Vector2(0, 0);gt.fill_to = Vector2(0, 1);gt.width = 4;gt.height = 128
	var shade: = TextureRect.new();shade.texture = gt;shade.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	shade.stretch_mode = TextureRect.STRETCH_SCALE;shade.name = "Shade"
	shade.anchor_left = 0;shade.anchor_right = 1;shade.anchor_top = 1;shade.anchor_bottom = 1
	shade.offset_top = -300;shade.offset_bottom = 0
	shade.mouse_filter = Control.MOUSE_FILTER_IGNORE;dialog.add_child(shade)
	dlg_panel = Panel.new();dlg_panel.mouse_filter = Control.MOUSE_FILTER_IGNORE
	dlg_panel.add_theme_stylebox_override("panel", StyleBoxEmpty.new())
	dialog.add_child(dlg_panel)
	dlg_name = _label("", 26, Color(1, 0.85, 0.5));dlg_name.position = Vector2(0, 8);dlg_name.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	dlg_panel.add_child(dlg_name)
	var line: = ColorRect.new();line.name = "Line";line.color = Color(1.0, 0.88, 0.6, 0.55);line.size = Vector2(220, 1.5)
	line.mouse_filter = Control.MOUSE_FILTER_IGNORE;dlg_panel.add_child(line)
	dlg_text = _label("", 23, Color(0.97, 0.97, 1.0));dlg_text.position = Vector2(30, 52)
	dlg_text.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	dlg_text.autowrap_mode = TextServer.AUTOWRAP_WORD;dlg_panel.add_child(dlg_text)
	dlg_arrow = _label("▼", 22, Color(1, 0.9, 0.6));dlg_panel.add_child(dlg_arrow)
	var skip: = Button.new();skip.text = "Passer  ▸▸";skip.flat = true;skip.name = "Skip"
	skip.add_theme_font_size_override("font_size", 18)
	for k in ["font_color", "font_focus_color"]: skip.add_theme_color_override(k, Color(GStyle.CREAM, 0.85))
	skip.add_theme_color_override("font_hover_color", GStyle.GOLD_HI)
	skip.anchor_left = 1.0;skip.anchor_right = 1.0;skip.offset_left = -170;skip.offset_right = -30;skip.offset_top = 22;skip.offset_bottom = 56
	skip.pressed.connect( func():
		var guard: = 0
		while dlg_open and guard < 200:
			guard += 1;dialogue_next(true);dialogue_next(true))
	dialog.add_child(skip)

func start_dialogue(lines: Array, after: Callable) -> void :
	if lines.is_empty(): return
	dlg_lines = lines;dlg_index = 0;dlg_after = after;dlg_open = true
	dialog.visible = true
	hud.visible = false
	release_touch()
	_show_line()

func _show_line() -> void :
	var l: Array = dlg_lines[dlg_index]
	dlg_name.text = l[0]
	dlg_name.add_theme_color_override("font_color", l[1])
	dlg_text.text = l[2]
	dlg_text.visible_ratio = 0.0
	if _dlg_tw: _dlg_tw.kill()
	_dlg_tw = dlg_text.create_tween()
	_dlg_tw.tween_property(dlg_text, "visible_ratio", 1.0, clampf((l[2] as String).length() / 70.0, 0.25, 1.4))
	if main.audio: main.audio.play("blip", -8.0)

var _dlg_tw: Tween
var _dlg_ms: = -1000
func dialogue_next(force: = false) -> void :
	if not dlg_open: return

	var ms: = Time.get_ticks_msec()
	if not force and ms - _dlg_ms < 110: return
	_dlg_ms = ms
	if dlg_text.visible_ratio < 1.0:
		if _dlg_tw: _dlg_tw.kill()
		dlg_text.visible_ratio = 1.0
		return
	dlg_index += 1
	if dlg_index >= dlg_lines.size():
		dlg_open = false
		dialog.visible = false
		hud.visible = true
		var cb: = dlg_after
		dlg_after = Callable()
		if cb.is_valid(): cb.call()
		main.on_dialogue_closed()
	else:
		_show_line()

func _on_dialog_input(ev: InputEvent) -> void :
	if (ev is InputEventMouseButton and ev.pressed and ev.button_index == MOUSE_BUTTON_LEFT) or (ev is InputEventScreenTouch and ev.pressed):
		dialogue_next()


var paimon: PaimonMenu
var char_menu: CharMenu
var settings_menu: SettingsMenu
var bag_menu: BagMenu
var sub_menu: Control

func _build_pause() -> void :
	paimon = PaimonMenu.new();paimon.name = "Paimon";root.add_child(paimon);paimon.setup(self, main)
	paimon.action.connect(main_pause_action)
	pause = paimon
	char_menu = CharMenu.new();char_menu.name = "Chars";root.add_child(char_menu);char_menu.setup(self, main)
	settings_menu = SettingsMenu.new();settings_menu.name = "Settings";root.add_child(settings_menu);settings_menu.setup(self, main)
	bag_menu = BagMenu.new();bag_menu.name = "Bag";root.add_child(bag_menu);bag_menu.setup(self, main)
	for mnu in [char_menu, settings_menu, bag_menu]:
		mnu.closed.connect(close_sub)

## Ouvre un sous-menu (personnages, inventaire, paramètres) par-dessus le menu principal.
func open_sub(which: String) -> void :
	var m: Control = {"chars": char_menu, "settings": settings_menu, "bag": bag_menu}.get(which)
	if m == null: return
	if sub_menu: sub_menu.close()
	paimon.visible = false
	sub_menu = m
	m.open()

func close_sub() -> void :
	if sub_menu: sub_menu.close()
	sub_menu = null
	if main.paused: paimon.open()

func set_quality_label(_q: String) -> void :
	if settings_menu and settings_menu.visible: settings_menu._refresh()

func main_pause_action(what: String) -> void :
	main.pause_action(what)

func show_pause(on: bool, _stats_text: = "") -> void :
	hud.visible = not on and not dlg_open
	if on:
		paimon.open()
		release_touch()
	else:
		if sub_menu: sub_menu.close()
		sub_menu = null
		paimon.close()


var title_btns: VBoxContainer
var title_hint: Label

func _build_title() -> void :
	title = Control.new();title.set_anchors_preset(Control.PRESET_FULL_RECT);root.add_child(title)
	# voile : ciel lumineux en haut, bas assombri pour lire les boutons
	var grad: = Gradient.new()
	grad.set_color(0, Color(1.0, 0.98, 0.94, 0.18));grad.set_color(1, Color(0.02, 0.04, 0.1, 0.78))
	grad.add_point(0.45, Color(0.6, 0.75, 0.95, 0.05))
	var gt: = GradientTexture2D.new();gt.gradient = grad;gt.fill_from = Vector2(0, 0);gt.fill_to = Vector2(0, 1);gt.width = 4;gt.height = 256
	var veil: = TextureRect.new();veil.texture = gt;veil.expand_mode = TextureRect.EXPAND_IGNORE_SIZE;veil.stretch_mode = TextureRect.STRETCH_SCALE
	veil.set_anchors_preset(Control.PRESET_FULL_RECT);veil.mouse_filter = Control.MOUSE_FILTER_IGNORE;title.add_child(veil)
	var box: = Control.new();box.size = Vector2(1160, 680);title.add_child(box);title_box = box
	var logo: = GStyle.Logo.new();logo.position = Vector2(200, 40);logo.size = Vector2(760, 300);box.add_child(logo)
	title_btns = VBoxContainer.new();title_btns.position = Vector2(400, 372);title_btns.size = Vector2(360, 260)
	title_btns.add_theme_constant_override("separation", 12);box.add_child(title_btns)
	continue_btn = GStyle.Pill.new("Continuer l'aventure", "○", true, 360.0)
	continue_btn.pressed.connect( func(): main.start_game(true))
	title_btns.add_child(continue_btn)
	var play: = GStyle.Pill.new("Nouvelle partie", "✦", false, 360.0);play.name = "New"
	play.pressed.connect( func(): main.start_game(false))
	title_btns.add_child(play)
	var sets: = GStyle.Pill.new("Paramètres", "⚙", false, 360.0);sets.glyph_col = GStyle.CREAM
	sets.pressed.connect( func(): title.visible = false;sub_menu = settings_menu;settings_menu.open())
	title_btns.add_child(sets)
	if not OS.has_feature("web"):
		var quit: = GStyle.Pill.new("Quitter", "✕", false, 360.0);quit.glyph_col = Color(0.6, 0.8, 1.0)
		quit.pressed.connect( func(): get_tree().quit())
		title_btns.add_child(quit)
	var heroes: = HBoxContainer.new();heroes.position = Vector2(856, 600);heroes.add_theme_constant_override("separation", 10)
	for who in PARTY_IDS:
		var pic: = _portrait(who, 64.0);pic.custom_minimum_size = Vector2(64, 64);heroes.add_child(pic)
	box.add_child(heroes)
	var ver: = GStyle.label("Version 7.0  •  Godot 4.7 + Blender", 15, Color(1, 1, 1, 0.65), 3);ver.position = Vector2(0, 652);box.add_child(ver)
	title.visible = false
	settings_menu_closed_title.call_deferred()

func settings_menu_closed_title() -> void :
	if settings_menu:
		settings_menu.closed.connect( func():
			if not main.playing:
				title.visible = true)

func show_title(has_save: bool) -> void :
	title.visible = true;hud.visible = false
	continue_btn.visible = has_save
	var nb: GStyle.Pill = title_box.find_child("New", true, false)
	if nb:
		nb.glyph = "○" if not has_save else "✦"
		nb.add_theme_stylebox_override("normal", GStyle.sb(GStyle.CREAM_HI if not has_save else GStyle.CREAM, 26))
		(nb.get_theme_stylebox("normal") as StyleBoxFlat).content_margin_left = 58
	title.modulate.a = 0.0
	title.create_tween().tween_property(title, "modulate:a", 1.0, 0.8)

func hide_title() -> void :
	title.visible = false;hud.visible = true

func _build_victory() -> void :
	victory = Control.new();victory.set_anchors_preset(Control.PRESET_FULL_RECT);root.add_child(victory)
	var bg: = ColorRect.new();bg.color = Color(0.03, 0.05, 0.14, 0.72);bg.set_anchors_preset(Control.PRESET_FULL_RECT);victory.add_child(bg)
	var l: = _label("", 32, Color(1, 0.92, 0.6));l.name = "Text";l.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	l.set_anchors_preset(Control.PRESET_FULL_RECT);l.vertical_alignment = VERTICAL_ALIGNMENT_CENTER;victory.add_child(l)
	var b: = _button("  Continuer à explorer  ", 26, Color(0.95, 0.78, 0.35), Color(0.12, 0.1, 0.2))
	b.name = "Continue"
	b.pressed.connect(_close_victory)
	victory.add_child(b)
	victory.visible = false

func _close_victory() -> void :
	victory.visible = false
	main.on_victory_closed()

func show_victory(text: String) -> void :
	(victory.get_node("Text") as Label).text = text
	victory.visible = true
	release_touch()
	_layout()
