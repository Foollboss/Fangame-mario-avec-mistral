class_name UI
## Kit d'interface « style Asphalt Unite » : polices, couleurs, panneaux inclinés, boutons.

const PURPLE_DARK := Color("#14072e")
const PURPLE := Color("#4a1aa0")
const PURPLE_MID := Color("#2a0f5e")
const MAGENTA := Color("#c03cff")
const PINK := Color("#ff3fa4")
const YELLOW := Color("#ffd800")
const LIME := Color("#c8f53c")
const GREEN := Color("#6dff7a")
const RED := Color("#e8202f")
const WHITE := Color("#ffffff")
const BLACK := Color("#0a0a0f")
const GREY := Color("#9a93ad")
const SKEW := Vector2(-0.22, 0.0)

static var _fonts := {}
static var _theme: Theme


static func font(kind: String = "body") -> Font:
	if not _fonts.has(kind):
		var file := {"title": "800i", "bold": "700i", "body": "600", "black": "900i", "light": "500"}.get(kind, "600")
		var f: FontFile = load("res://assets/fonts/BarlowCondensed-%s.ttf" % file)
		_fonts[kind] = f
	return _fonts[kind]


static func theme() -> Theme:
	if _theme == null:
		_theme = Theme.new()
		_theme.default_font = font("body")
		_theme.default_font_size = 20
		var sb := StyleBoxFlat.new()
		sb.bg_color = Color(0, 0, 0, 0)
		_theme.set_stylebox("panel", "PanelContainer", sb)
		var scroll := StyleBoxFlat.new()
		scroll.bg_color = Color(1, 1, 1, 0.12)
		scroll.set_corner_radius_all(3)
		_theme.set_stylebox("scroll", "HScrollBar", scroll)
		_theme.set_stylebox("scroll", "VScrollBar", scroll)
		var grab := StyleBoxFlat.new()
		grab.bg_color = Color(1, 1, 1, 0.5)
		grab.set_corner_radius_all(3)
		_theme.set_stylebox("grabber", "HScrollBar", grab)
		_theme.set_stylebox("grabber", "VScrollBar", grab)
		_theme.set_stylebox("grabber_highlight", "HScrollBar", grab)
		_theme.set_stylebox("grabber_highlight", "VScrollBar", grab)
		_theme.set_stylebox("grabber_pressed", "HScrollBar", grab)
		_theme.set_stylebox("grabber_pressed", "VScrollBar", grab)
	return _theme


static func box(bg: Color, skew: Vector2 = Vector2.ZERO, border: Color = Color(0, 0, 0, 0), bw: int = 0,
		radius: int = 0, margin: int = 8) -> StyleBoxFlat:
	var s := StyleBoxFlat.new()
	s.bg_color = bg
	s.skew = skew
	if bw > 0:
		s.border_color = border
		s.set_border_width_all(bw)
	s.set_corner_radius_all(radius)
	s.content_margin_left = margin + absf(skew.x) * 20.0
	s.content_margin_right = margin + absf(skew.x) * 20.0
	s.content_margin_top = margin * 0.6
	s.content_margin_bottom = margin * 0.6
	s.anti_aliasing = true
	return s


static func label(text: String, size: int = 20, color: Color = WHITE, kind: String = "body",
		align: HorizontalAlignment = HORIZONTAL_ALIGNMENT_LEFT) -> Label:
	var l := Label.new()
	l.text = text
	l.add_theme_font_override("font", font(kind))
	l.add_theme_font_size_override("font_size", size)
	l.add_theme_color_override("font_color", color)
	l.horizontal_alignment = align
	l.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	l.mouse_filter = Control.MOUSE_FILTER_IGNORE
	return l


static func shadow(l: Label, c: Color = Color(0, 0, 0, 0.6), off: int = 2) -> Label:
	l.add_theme_color_override("font_shadow_color", c)
	l.add_theme_constant_override("shadow_offset_x", off)
	l.add_theme_constant_override("shadow_offset_y", off)
	return l


static func outline(l: Label, c: Color = Color(0, 0, 0, 0.8), size: int = 6) -> Label:
	l.add_theme_color_override("font_outline_color", c)
	l.add_theme_constant_override("outline_size", size)
	return l


static func panel(bg: Color, skew: Vector2 = Vector2.ZERO, border: Color = Color(0, 0, 0, 0), bw: int = 0,
		margin: int = 10) -> PanelContainer:
	var p := PanelContainer.new()
	p.add_theme_stylebox_override("panel", box(bg, skew, border, bw, 0, margin))
	p.mouse_filter = Control.MOUSE_FILTER_IGNORE
	return p


static func button(text: String, kind: String = "yellow", size: int = 26, min_size: Vector2 = Vector2(0, 0),
		skew: Vector2 = SKEW) -> Button:
	var b := Button.new()
	b.text = text
	b.focus_mode = Control.FOCUS_NONE
	b.custom_minimum_size = min_size
	b.add_theme_font_override("font", font("title"))
	b.add_theme_font_size_override("font_size", size)
	var bg: Color
	var fg: Color
	var border := Color(0, 0, 0, 0)
	var bw := 0
	match kind:
		"yellow":
			bg = YELLOW
			fg = BLACK
		"white":
			bg = WHITE
			fg = BLACK
		"purple":
			bg = MAGENTA
			fg = WHITE
		"lime":
			bg = LIME
			fg = BLACK
		"red":
			bg = RED
			fg = WHITE
		_:
			bg = Color(0.10, 0.04, 0.24, 0.85)
			fg = WHITE
			border = Color(1, 1, 1, 0.25)
			bw = 2
	b.add_theme_stylebox_override("normal", box(bg, skew, border, bw, 0, 14))
	b.add_theme_stylebox_override("hover", box(bg.lightened(0.12), skew, Color(1, 1, 1, 0.9), 3, 0, 14))
	b.add_theme_stylebox_override("pressed", box(bg.darkened(0.15), skew, Color(1, 1, 1, 1), 3, 0, 14))
	b.add_theme_stylebox_override("disabled", box(bg.darkened(0.5), skew, border, bw, 0, 14))
	b.add_theme_stylebox_override("focus", StyleBoxEmpty.new())
	for st in ["font_color", "font_hover_color", "font_pressed_color", "font_focus_color"]:
		b.add_theme_color_override(st, fg)
	b.add_theme_color_override("font_disabled_color", fg.darkened(0.4))
	b.pressed.connect(func():
		var sfx := (Engine.get_main_loop() as SceneTree).root.get_node_or_null("Sfx")
		if sfx:
			sfx.click())
	return b


static func icon(path: String, size: float = 32.0) -> TextureRect:
	var t := TextureRect.new()
	t.texture = load(path) if ResourceLoader.exists(path) else null
	t.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	t.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	t.custom_minimum_size = Vector2(size, size)
	t.mouse_filter = Control.MOUSE_FILTER_IGNORE
	return t


static func hbox(sep: int = 8) -> HBoxContainer:
	var h := HBoxContainer.new()
	h.add_theme_constant_override("separation", sep)
	h.mouse_filter = Control.MOUSE_FILTER_IGNORE
	return h


static func vbox(sep: int = 8) -> VBoxContainer:
	var v := VBoxContainer.new()
	v.add_theme_constant_override("separation", sep)
	v.mouse_filter = Control.MOUSE_FILTER_IGNORE
	return v


static func margin(l: int, t: int, r: int, b: int) -> MarginContainer:
	var m := MarginContainer.new()
	m.add_theme_constant_override("margin_left", l)
	m.add_theme_constant_override("margin_top", t)
	m.add_theme_constant_override("margin_right", r)
	m.add_theme_constant_override("margin_bottom", b)
	m.mouse_filter = Control.MOUSE_FILTER_IGNORE
	return m


static func spacer(w: float = 0.0, h: float = 0.0, expand: bool = false) -> Control:
	var c := Control.new()
	c.custom_minimum_size = Vector2(w, h)
	c.mouse_filter = Control.MOUSE_FILTER_IGNORE
	if expand:
		c.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		c.size_flags_vertical = Control.SIZE_EXPAND_FILL
	return c


static func class_badge(cls: String, size: int = 30) -> PanelContainer:
	var p := panel(Color(0, 0, 0, 0.85), Vector2.ZERO, CarsDB.CLASS_COLORS.get(cls, WHITE), 2, 4)
	var l := label(cls, size, WHITE, "black", HORIZONTAL_ALIGNMENT_CENTER)
	l.custom_minimum_size = Vector2(size * 0.9, size * 0.9)
	p.add_child(l)
	return p


static func bar(value: float, w: float, h: float, col: Color, bg: Color = Color(1, 1, 1, 0.18)) -> Control:
	var root := Control.new()
	root.custom_minimum_size = Vector2(w, h)
	root.mouse_filter = Control.MOUSE_FILTER_IGNORE
	var b := ColorRect.new()
	b.color = bg
	b.size = Vector2(w, h)
	b.mouse_filter = Control.MOUSE_FILTER_IGNORE
	root.add_child(b)
	var f := ColorRect.new()
	f.color = col
	f.size = Vector2(w * clampf(value, 0.0, 1.0), h)
	f.mouse_filter = Control.MOUSE_FILTER_IGNORE
	root.add_child(f)
	return root


## Ancre un contrôle et le place relativement au point d'ancrage (offsets).
static func place(c: Control, preset: int, pos: Vector2, size: Vector2) -> Control:
	c.set_anchors_preset(preset)
	c.offset_left = pos.x
	c.offset_top = pos.y
	c.offset_right = pos.x + size.x
	c.offset_bottom = pos.y + size.y
	return c


static func full_rect(c: Control) -> Control:
	c.set_anchors_preset(Control.PRESET_FULL_RECT)
	c.offset_left = 0
	c.offset_top = 0
	c.offset_right = 0
	c.offset_bottom = 0
	return c


static func safe_margins() -> Vector4:
	## marges (gauche, haut, droite, bas) pour encoches / bords arrondis, en pixels de viewport
	var safe := DisplayServer.get_display_safe_area()
	var screen := DisplayServer.screen_get_size()
	if screen.x <= 0 or safe.size.x <= 0:
		return Vector4.ZERO
	var vp := Vector2(1280, 720)
	var tree := Engine.get_main_loop() as SceneTree
	if tree and tree.root:
		vp = tree.root.get_visible_rect().size
	var kx := vp.x / float(screen.x)
	var ky := vp.y / float(screen.y)
	return Vector4(safe.position.x * kx, safe.position.y * ky, (screen.x - safe.end.x) * kx, (screen.y - safe.end.y) * ky)
