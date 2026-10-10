class_name UIKit
extends RefCounted
## Boîte à outils d'interface façon "Asphalt" : formes inclinées, italique gras,
## violet néon, boutons jaunes.

const PURPLE := Color("#5b16a8")
const PURPLE_DARK := Color("#1a0733")
const PURPLE_MID := Color("#3a0f70")
const PURPLE_LIGHT := Color("#a24dff")
const MAGENTA := Color("#d23cff")
const YELLOW := Color("#ffd21f")
const LIME := Color("#c6f23a")
const RED := Color("#e8192c")
const CYAN := Color("#36d6ff")
# couleurs du nitro : parfait = bleu clair, onde de choc = violet, ultra = turquoise
const NITRO_ORANGE := Color("#ffa72b")
const SKY := Color("#6cc8ff")
const VIOLET := Color("#a14dff")
const TURQUOISE := Color("#19f2cf")
const WHITE := Color(1, 1, 1)
const GREY := Color(0.72, 0.68, 0.8)
const PANEL_BG := Color(0.10, 0.03, 0.22, 0.88)
const SKEW := 0.18

static var _fonts := {}
static var _theme: Theme


static func font(kind: String = "bold") -> Font:
	if _fonts.has(kind):
		return _fonts[kind]
	var f: Font
	match kind:
		"black":
			var fv := FontVariation.new()
			fv.base_font = load("res://assets/fonts/TitilliumWeb-Black.ttf")
			fv.variation_transform = Transform2D(Vector2(1.0, 0.2), Vector2(0.0, 1.0), Vector2.ZERO)
			f = fv
		"semi":
			f = load("res://assets/fonts/TitilliumWeb-SemiBoldItalic.ttf")
		"upright":
			f = load("res://assets/fonts/TitilliumWeb-Bold.ttf")
		_:
			f = load("res://assets/fonts/TitilliumWeb-BoldItalic.ttf")
	_fonts[kind] = f
	return f


static func theme() -> Theme:
	if _theme:
		return _theme
	var t := Theme.new()
	t.default_font = font("bold")
	t.default_font_size = 22
	var normal := style(Color(1, 1, 1, 0.08), 0, SKEW)
	var hover := style(Color(1, 1, 1, 0.18), 0, SKEW)
	var pressed := style(Color(1, 1, 1, 0.28), 0, SKEW)
	var focus := style(Color(0, 0, 0, 0), 0, SKEW, Color.WHITE, 3)
	t.set_stylebox("normal", "Button", normal)
	t.set_stylebox("hover", "Button", hover)
	t.set_stylebox("pressed", "Button", pressed)
	t.set_stylebox("focus", "Button", focus)
	t.set_stylebox("disabled", "Button", style(Color(1, 1, 1, 0.04), 0, SKEW))
	t.set_color("font_color", "Button", WHITE)
	t.set_color("font_hover_color", "Button", WHITE)
	t.set_color("font_pressed_color", "Button", WHITE)
	t.set_color("font_focus_color", "Button", WHITE)
	t.set_color("font_disabled_color", "Button", Color(1, 1, 1, 0.35))
	t.set_stylebox("panel", "PanelContainer", style(PANEL_BG))
	t.set_stylebox("panel", "Panel", style(PANEL_BG))
	var sb_bg := style(Color(1, 1, 1, 0.12), 3)
	var sb_fill := style(YELLOW, 3)
	t.set_stylebox("background", "ProgressBar", sb_bg)
	t.set_stylebox("fill", "ProgressBar", sb_fill)
	t.set_color("font_color", "Label", WHITE)
	t.set_stylebox("grabber_area", "HSlider", style(YELLOW, 3))
	t.set_stylebox("slider", "HSlider", style(Color(1, 1, 1, 0.2), 3))
	t.set_stylebox("normal", "LineEdit", style(Color(0, 0, 0, 0.4), 2, 0.0, PURPLE_LIGHT, 2))
	t.set_stylebox("focus", "LineEdit", style(Color(0, 0, 0, 0.5), 2, 0.0, YELLOW, 2))
	var sc := style(Color(1, 1, 1, 0.25), 4)
	t.set_stylebox("grabber", "VScrollBar", sc)
	t.set_stylebox("grabber_highlight", "VScrollBar", style(YELLOW, 4))
	t.set_stylebox("scroll", "VScrollBar", style(Color(0, 0, 0, 0.2), 4))
	t.set_stylebox("grabber", "HScrollBar", sc)
	t.set_stylebox("grabber_highlight", "HScrollBar", style(YELLOW, 4))
	t.set_stylebox("scroll", "HScrollBar", style(Color(0, 0, 0, 0.2), 4))
	_theme = t
	return t


static func style(color: Color, radius: int = 0, skew: float = 0.0, border_color: Color = Color(0, 0, 0, 0), border: int = 0) -> StyleBoxFlat:
	var s := StyleBoxFlat.new()
	s.bg_color = color
	s.set_corner_radius_all(radius)
	s.skew = Vector2(skew, 0)
	if border > 0:
		s.border_color = border_color
		s.set_border_width_all(border)
	s.content_margin_left = 14 + int(abs(skew) * 30)
	s.content_margin_right = 14 + int(abs(skew) * 30)
	s.content_margin_top = 6
	s.content_margin_bottom = 6
	s.anti_aliasing = true
	return s


static func gradient_style(top: Color, bottom: Color) -> StyleBoxTexture:
	var g := Gradient.new()
	g.set_color(0, top)
	g.set_color(1, bottom)
	var gt := GradientTexture2D.new()
	gt.gradient = g
	gt.fill_from = Vector2(0, 0)
	gt.fill_to = Vector2(0, 1)
	gt.width = 8
	gt.height = 64
	var s := StyleBoxTexture.new()
	s.texture = gt
	return s


static func label(text: String, size: int = 24, color: Color = WHITE, kind: String = "bold", align: int = HORIZONTAL_ALIGNMENT_LEFT) -> Label:
	var l := Label.new()
	l.text = text
	l.add_theme_font_override("font", font(kind))
	l.add_theme_font_size_override("font_size", size)
	l.add_theme_color_override("font_color", color)
	l.horizontal_alignment = align
	l.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	return l


static func outlined(l: Label, outline: int = 6, color: Color = Color(0, 0, 0, 0.6)) -> Label:
	l.add_theme_constant_override("outline_size", outline)
	l.add_theme_color_override("font_outline_color", color)
	return l


static func button(text: String, size: int = 26, kind: String = "secondary", min_size: Vector2 = Vector2(0, 0)) -> Button:
	var b := Button.new()
	b.text = text
	b.add_theme_font_override("font", font("black"))
	b.add_theme_font_size_override("font_size", size)
	b.custom_minimum_size = min_size
	b.focus_mode = Control.FOCUS_ALL
	match kind:
		"primary":
			b.add_theme_stylebox_override("normal", style(YELLOW, 0, SKEW))
			b.add_theme_stylebox_override("hover", style(YELLOW.lightened(0.2), 0, SKEW))
			b.add_theme_stylebox_override("pressed", style(YELLOW.darkened(0.15), 0, SKEW))
			b.add_theme_stylebox_override("focus", style(Color(0, 0, 0, 0), 0, SKEW, Color.WHITE, 4))
			b.add_theme_stylebox_override("disabled", style(Color(0.4, 0.38, 0.3, 0.8), 0, SKEW))
			for k in ["font_color", "font_hover_color", "font_pressed_color", "font_focus_color"]:
				b.add_theme_color_override(k, Color(0.06, 0.04, 0.1))
		"white":
			b.add_theme_stylebox_override("normal", style(Color(0.96, 0.96, 0.98), 0, SKEW))
			b.add_theme_stylebox_override("hover", style(Color(1, 1, 1), 0, SKEW, YELLOW, 3))
			b.add_theme_stylebox_override("pressed", style(Color(0.85, 0.85, 0.88), 0, SKEW))
			b.add_theme_stylebox_override("focus", style(Color(0, 0, 0, 0), 0, SKEW, YELLOW, 4))
			for k in ["font_color", "font_hover_color", "font_pressed_color", "font_focus_color"]:
				b.add_theme_color_override(k, Color(0.06, 0.04, 0.1))
		"danger":
			b.add_theme_stylebox_override("normal", style(RED, 0, SKEW))
			b.add_theme_stylebox_override("hover", style(RED.lightened(0.2), 0, SKEW))
		"purple":
			b.add_theme_stylebox_override("normal", style(PURPLE, 0, SKEW))
			b.add_theme_stylebox_override("hover", style(PURPLE_LIGHT, 0, SKEW))
			b.add_theme_stylebox_override("pressed", style(PURPLE.darkened(0.2), 0, SKEW))
	return b


static func panel(color: Color = PANEL_BG, skew: float = 0.0, border_color: Color = Color(0, 0, 0, 0), border: int = 0) -> PanelContainer:
	var p := PanelContainer.new()
	p.add_theme_stylebox_override("panel", style(color, 0, skew, border_color, border))
	return p


static func hbox(sep: int = 10) -> HBoxContainer:
	var h := HBoxContainer.new()
	h.add_theme_constant_override("separation", sep)
	return h


static func vbox(sep: int = 10) -> VBoxContainer:
	var v := VBoxContainer.new()
	v.add_theme_constant_override("separation", sep)
	return v


static func margin(l: int, t: int = -1, r: int = -1, b: int = -1) -> MarginContainer:
	var m := MarginContainer.new()
	m.add_theme_constant_override("margin_left", l)
	m.add_theme_constant_override("margin_top", l if t < 0 else t)
	m.add_theme_constant_override("margin_right", l if r < 0 else r)
	m.add_theme_constant_override("margin_bottom", (l if t < 0 else t) if b < 0 else b)
	return m


## Positionne un contrôle par rapport à une ancre (offsets en pixels de l'interface 1920x1080).
static func place(c: Control, preset: int, offset: Vector2, size: Vector2) -> void:
	c.set_anchors_preset(preset)
	c.offset_left = offset.x
	c.offset_top = offset.y
	c.offset_right = offset.x + size.x
	c.offset_bottom = offset.y + size.y


static func spacer(h: bool = true) -> Control:
	var c := Control.new()
	if h:
		c.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	else:
		c.size_flags_vertical = Control.SIZE_EXPAND_FILL
	return c


static func fmt_int(n: int) -> String:
	var s := str(abs(n))
	var out := ""
	while s.length() > 3:
		out = " " + s.substr(s.length() - 3) + out
		s = s.substr(0, s.length() - 3)
	return ("-" if n < 0 else "") + s + out


static func fmt_time(sec: float) -> String:
	var m := int(sec / 60.0)
	var s := fmod(sec, 60.0)
	return "%02d:%06.3f" % [m, s]


static func progress(value: float, max_value: float, color: Color = YELLOW, height: int = 8) -> ProgressBar:
	var p := ProgressBar.new()
	p.max_value = max(max_value, 0.001)
	p.value = min(value, max_value)
	p.show_percentage = false
	p.custom_minimum_size = Vector2(0, height)
	p.add_theme_stylebox_override("fill", style(color, 2))
	p.add_theme_stylebox_override("background", style(Color(1, 1, 1, 0.15), 2))
	return p


static func class_badge(cls: String, size: int = 40) -> Control:
	var p := PanelContainer.new()
	p.add_theme_stylebox_override("panel", style(Color(0.97, 0.97, 0.97), 0, 0.0))
	p.custom_minimum_size = Vector2(size, size)
	var l := label(cls, int(size * 0.85), Color(0.05, 0.05, 0.08), "black", HORIZONTAL_ALIGNMENT_CENTER)
	p.add_child(l)
	return p


## Icône vectorielle dessinée (pas besoin d'images externes)
static func icon(kind: String, size: float = 28.0, color: Color = WHITE) -> Control:
	var c := Control.new()
	c.custom_minimum_size = Vector2(size, size)
	c.mouse_filter = Control.MOUSE_FILTER_IGNORE
	c.draw.connect(func(): _draw_icon(c, kind, size, color))
	return c


static func _draw_icon(c: Control, kind: String, s: float, col: Color) -> void:
	var ctr := Vector2(s, s) * 0.5
	match kind:
		"coin":
			c.draw_circle(ctr, s * 0.48, Color("#ffcc1a"))
			c.draw_circle(ctr, s * 0.36, Color("#e2a800"))
			c.draw_arc(ctr, s * 0.2, deg_to_rad(40), deg_to_rad(320), 16, Color(0.1, 0.06, 0.0), s * 0.1)
		"token":
			var pts := PackedVector2Array()
			for i in 6:
				var a := TAU * i / 6.0 + PI / 6.0
				pts.append(ctr + Vector2(cos(a), sin(a)) * s * 0.48)
			c.draw_colored_polygon(pts, Color("#1f7cff"))
			c.draw_colored_polygon(PackedVector2Array([ctr + Vector2(0, -s * 0.25), ctr + Vector2(s * 0.22, s * 0.2), ctr + Vector2(-s * 0.22, s * 0.2)]), Color(1, 1, 1, 0.9))
		"star", "star_empty":
			var pts2 := PackedVector2Array()
			for i in 10:
				var a := -PI / 2 + TAU * i / 10.0
				var r := s * (0.48 if i % 2 == 0 else 0.2)
				pts2.append(ctr + Vector2(cos(a), sin(a)) * r)
			c.draw_colored_polygon(pts2, Color("#ffcc1a") if kind == "star" else Color(1, 1, 1, 0.25))
		"flag":
			c.draw_line(Vector2(s * 0.2, s * 0.1), Vector2(s * 0.2, s * 0.92), col, s * 0.08)
			c.draw_colored_polygon(PackedVector2Array([Vector2(s * 0.24, s * 0.12), Vector2(s * 0.85, s * 0.28), Vector2(s * 0.24, s * 0.5)]), col)
		"lock":
			c.draw_arc(Vector2(s * 0.5, s * 0.42), s * 0.2, PI, TAU, 12, col, s * 0.09)
			c.draw_rect(Rect2(s * 0.22, s * 0.42, s * 0.56, s * 0.45), col)
		"check":
			c.draw_polyline(PackedVector2Array([Vector2(s * 0.15, s * 0.5), Vector2(s * 0.42, s * 0.78), Vector2(s * 0.88, s * 0.2)]), col, s * 0.14)
		"cross":
			c.draw_line(Vector2(s * 0.2, s * 0.2), Vector2(s * 0.8, s * 0.8), col, s * 0.13)
			c.draw_line(Vector2(s * 0.8, s * 0.2), Vector2(s * 0.2, s * 0.8), col, s * 0.13)
		"plan":
			c.draw_rect(Rect2(s * 0.18, s * 0.08, s * 0.64, s * 0.84), col, false, s * 0.08)
			c.draw_rect(Rect2(s * 0.3, s * 0.22, s * 0.4, s * 0.25), col)
			c.draw_line(Vector2(s * 0.3, s * 0.62), Vector2(s * 0.7, s * 0.62), col, s * 0.06)
			c.draw_line(Vector2(s * 0.3, s * 0.75), Vector2(s * 0.62, s * 0.75), col, s * 0.06)
		"gear":
			for i in 8:
				var a := TAU * i / 8.0
				c.draw_line(ctr + Vector2(cos(a), sin(a)) * s * 0.25, ctr + Vector2(cos(a), sin(a)) * s * 0.47, col, s * 0.16)
			c.draw_circle(ctr, s * 0.3, col)
			c.draw_circle(ctr, s * 0.13, Color(0.1, 0.03, 0.2))
		"home":
			c.draw_colored_polygon(PackedVector2Array([Vector2(s * 0.5, s * 0.1), Vector2(s * 0.92, s * 0.5), Vector2(s * 0.08, s * 0.5)]), col)
			c.draw_rect(Rect2(s * 0.2, s * 0.48, s * 0.6, s * 0.42), col)
		"user":
			c.draw_circle(Vector2(s * 0.5, s * 0.32), s * 0.2, col)
			c.draw_colored_polygon(PackedVector2Array([Vector2(s * 0.12, s * 0.95), Vector2(s * 0.25, s * 0.6), Vector2(s * 0.75, s * 0.6), Vector2(s * 0.88, s * 0.95)]), col)
		"trophy":
			c.draw_rect(Rect2(s * 0.28, s * 0.12, s * 0.44, s * 0.38), col)
			c.draw_arc(Vector2(s * 0.28, s * 0.3), s * 0.13, PI / 2, PI * 1.5, 8, col, s * 0.06)
			c.draw_arc(Vector2(s * 0.72, s * 0.3), s * 0.13, -PI / 2, PI / 2, 8, col, s * 0.06)
			c.draw_rect(Rect2(s * 0.45, s * 0.5, s * 0.1, s * 0.25), col)
			c.draw_rect(Rect2(s * 0.28, s * 0.75, s * 0.44, s * 0.12), col)
		"car":
			c.draw_colored_polygon(PackedVector2Array([Vector2(s * 0.05, s * 0.7), Vector2(s * 0.12, s * 0.48), Vector2(s * 0.3, s * 0.45), Vector2(s * 0.42, s * 0.28), Vector2(s * 0.7, s * 0.28), Vector2(s * 0.85, s * 0.45), Vector2(s * 0.95, s * 0.52), Vector2(s * 0.95, s * 0.7)]), col)
			c.draw_circle(Vector2(s * 0.27, s * 0.72), s * 0.11, Color(0.08, 0.02, 0.15))
			c.draw_circle(Vector2(s * 0.75, s * 0.72), s * 0.11, Color(0.08, 0.02, 0.15))
		"timer":
			c.draw_arc(ctr + Vector2(0, s * 0.05), s * 0.38, 0, TAU, 24, col, s * 0.09)
			c.draw_line(ctr + Vector2(0, s * 0.05), ctr + Vector2(0, -s * 0.2), col, s * 0.08)
			c.draw_rect(Rect2(s * 0.4, s * 0.0, s * 0.2, s * 0.1), col)
		"pause":
			c.draw_rect(Rect2(s * 0.22, s * 0.18, s * 0.18, s * 0.64), col)
			c.draw_rect(Rect2(s * 0.6, s * 0.18, s * 0.18, s * 0.64), col)
		"bolt":
			c.draw_colored_polygon(PackedVector2Array([Vector2(s * 0.58, s * 0.02), Vector2(s * 0.2, s * 0.56), Vector2(s * 0.48, s * 0.56), Vector2(s * 0.4, s * 0.98), Vector2(s * 0.82, s * 0.4), Vector2(s * 0.53, s * 0.4)]), col)
		"chevron":
			c.draw_colored_polygon(PackedVector2Array([Vector2(s * 0.1, s * 0.65), Vector2(s * 0.5, s * 0.25), Vector2(s * 0.9, s * 0.65), Vector2(s * 0.75, s * 0.8), Vector2(s * 0.5, s * 0.55), Vector2(s * 0.25, s * 0.8)]), col)
		"camera":
			c.draw_rect(Rect2(s * 0.08, s * 0.28, s * 0.62, s * 0.46), col)
			c.draw_colored_polygon(PackedVector2Array([Vector2(s * 0.7, s * 0.5), Vector2(s * 0.95, s * 0.3), Vector2(s * 0.95, s * 0.7)]), col)
		"paint":
			c.draw_circle(Vector2(s * 0.5, s * 0.55), s * 0.32, col)
			c.draw_colored_polygon(PackedVector2Array([Vector2(s * 0.5, s * 0.05), Vector2(s * 0.75, s * 0.45), Vector2(s * 0.25, s * 0.45)]), col)


static func stars_row(filled: int, total: int, size: float = 22.0) -> HBoxContainer:
	var h := hbox(2)
	for i in total:
		h.add_child(icon("star" if i < filled else "star_empty", size))
	return h


static func currency_chip(kind: String, amount: int) -> Control:
	var p := panel(Color(0.04, 0.02, 0.08, 0.85), SKEW)
	var h := hbox(10)
	h.add_child(icon(kind, 26))
	var l := label(fmt_int(amount), 22, WHITE, "black")
	l.custom_minimum_size = Vector2(90, 0)
	l.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	h.add_child(l)
	p.add_child(h)
	return p


static func texture(path: String) -> Texture2D:
	if ResourceLoader.exists(path):
		return load(path)
	return null


static func thumb(car_id: String) -> TextureRect:
	var tr := TextureRect.new()
	tr.texture = texture("res://assets/thumbs/%s.png" % car_id)
	tr.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	tr.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_COVERED
	tr.mouse_filter = Control.MOUSE_FILTER_IGNORE
	return tr


static func toast(parent: Control, text: String, color: Color = YELLOW) -> void:
	var p := panel(Color(0.05, 0.01, 0.1, 0.92), SKEW, color, 2)
	var l := label(text, 26, color, "black", HORIZONTAL_ALIGNMENT_CENTER)
	p.add_child(l)
	parent.add_child(p)
	place(p, Control.PRESET_CENTER_TOP, Vector2(-300, 120), Vector2(600, 60))
	p.z_index = 100
	var tw := p.create_tween()
	tw.tween_interval(1.6)
	tw.tween_property(p, "modulate:a", 0.0, 0.5)
	tw.tween_callback(p.queue_free)
