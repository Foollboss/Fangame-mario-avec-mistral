class_name GStyle
extends RefCounted
## Charte graphique de l'interface (inspirée des action-RPG « anime » type Genshin) :
## crème + encre bleu-gris + or, boutons-pilules, fonds bleu nuit étoilés, ornements en losange.

const CREAM: = Color("ece5d8")
const CREAM_HI: = Color("fffaf0")
const CREAM_DIM: = Color("cfc6b5")
const INK: = Color("3b4255")
const INK_SOFT: = Color("626a7c")
const GOLD: = Color("d3bc8e")
const GOLD_HI: = Color("ffe6b2")
const GOLD_DEEP: = Color("a88b54")
const NAVY: = Color(0.105, 0.125, 0.18, 0.94)
const NAVY_SOFT: = Color(0.16, 0.19, 0.26, 0.82)
const NAVY_LINE: = Color(1.0, 0.95, 0.85, 0.12)
const STAR_5: = Color("b9824a")
const STAR_4: = Color("8a6bb8")
const STAR_3: = Color("5a83b4")

const BG_SHADER: = """
shader_type canvas_item;
uniform vec4 top_col : source_color = vec4(0.10, 0.12, 0.19, 0.93);
uniform vec4 bot_col : source_color = vec4(0.04, 0.05, 0.09, 0.96);
uniform vec2 ring_center = vec2(0.78, 0.5);
uniform float aspect = 1.78;
uniform float rings = 1.0;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
void fragment() {
	vec2 uv = UV;
	vec4 c = mix(top_col, bot_col, smoothstep(0.0, 1.0, uv.y));
	c.rgb += vec3(0.34, 0.28, 0.18) * 0.16 * exp(-length((uv - vec2(0.18, 0.05)) * vec2(aspect, 1.0)) * 2.6);
	vec2 g = uv * vec2(110.0 * aspect / 1.78, 62.0);
	vec2 id = floor(g);
	float h = hash(id);
	float d = length(fract(g) - 0.5 - (vec2(hash(id + 3.1), hash(id + 7.3)) - 0.5) * 0.6);
	float tw = 0.6 + 0.4 * sin(TIME * (0.8 + h * 2.0) + h * 40.0);
	c.rgb += vec3(1.0, 0.95, 0.82) * step(0.986, h) * smoothstep(0.14, 0.0, d) * 0.55 * tw;
	vec2 q = (uv - ring_center) * vec2(aspect, 1.0);
	float r = length(q);
	float ring = smoothstep(0.004, 0.0, abs(r - 0.44)) + smoothstep(0.003, 0.0, abs(r - 0.38)) * 0.7
		+ smoothstep(0.002, 0.0, abs(r - 0.30)) * 0.5;
	float ang = atan(q.y, q.x);
	ring += smoothstep(0.003, 0.0, abs(r - 0.41)) * step(0.5, fract(ang * 12.0 / 6.2832)) * 0.6;
	c.rgb += vec3(0.83, 0.74, 0.56) * 0.07 * ring * rings;
	COLOR = c;
}
"""

static var _bg_shader: Shader

static func backdrop(rings: = true, alpha: = 1.0) -> ColorRect:
	if _bg_shader == null:
		_bg_shader = Shader.new();_bg_shader.code = BG_SHADER
	var r: = ColorRect.new()
	r.set_anchors_preset(Control.PRESET_FULL_RECT)
	r.mouse_filter = Control.MOUSE_FILTER_IGNORE
	var m: = ShaderMaterial.new();m.shader = _bg_shader
	m.set_shader_parameter("rings", 1.0 if rings else 0.0)
	m.set_shader_parameter("top_col", Color(0.10, 0.12, 0.19, 0.93 * alpha))
	m.set_shader_parameter("bot_col", Color(0.04, 0.05, 0.09, 0.96 * alpha))
	r.material = m
	r.resized.connect( func(): m.set_shader_parameter("aspect", r.size.x / maxf(r.size.y, 1.0)))
	return r

static func sb(bg: Color, radius: = 8, border: = Color(0, 0, 0, 0), bw: = 0, pad: = 0) -> StyleBoxFlat:
	var s: = StyleBoxFlat.new();s.bg_color = bg
	s.set_corner_radius_all(radius)
	if bw > 0:
		s.border_color = border;s.set_border_width_all(bw)
	if pad > 0:
		s.content_margin_left = pad;s.content_margin_right = pad;s.content_margin_top = pad * 0.6;s.content_margin_bottom = pad * 0.6
	s.anti_aliasing = true
	return s

static func label(text: String, size: int, col: = CREAM, outline: = 0) -> Label:
	var l: = Label.new();l.text = text
	l.add_theme_font_size_override("font_size", size)
	l.add_theme_color_override("font_color", col)
	if outline > 0:
		l.add_theme_color_override("font_outline_color", Color(0.04, 0.05, 0.1, 0.85))
		l.add_theme_constant_override("outline_size", outline)
	l.mouse_filter = Control.MOUSE_FILTER_IGNORE
	return l


## Bouton-pilule crème avec pastille d'icône à gauche (○ valider, ✕ annuler, ...).
class Pill extends Button:
	var glyph: = ""
	var glyph_col: = Color("ffcc33")
	var primary: = false
	var _hover: = 0.0
	func _init(t: = "", g: = "", prim: = false, w: = 300.0) -> void :
		text = t;glyph = g;primary = prim
		custom_minimum_size = Vector2(w, 52)
		add_theme_font_size_override("font_size", 21)
		var bg: = GStyle.CREAM if not prim else GStyle.CREAM_HI
		var n: = GStyle.sb(bg, 26);n.content_margin_left = 58 if g != "" else 22;n.content_margin_right = 22
		var h: = GStyle.sb(GStyle.CREAM_HI, 26, Color(1, 1, 1, 0.95), 3);h.content_margin_left = n.content_margin_left;h.content_margin_right = 22
		var p: = GStyle.sb(GStyle.CREAM_DIM, 26);p.content_margin_left = n.content_margin_left;p.content_margin_right = 22
		var d: = GStyle.sb(Color(0.6, 0.6, 0.62, 0.7), 26);d.content_margin_left = n.content_margin_left
		add_theme_stylebox_override("normal", n);add_theme_stylebox_override("hover", h)
		add_theme_stylebox_override("pressed", p);add_theme_stylebox_override("focus", h)
		add_theme_stylebox_override("disabled", d)
		for k in ["font_color", "font_hover_color", "font_pressed_color", "font_focus_color"]:
			add_theme_color_override(k, GStyle.INK)
		add_theme_color_override("font_disabled_color", Color(0.3, 0.3, 0.35))
		mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		mouse_entered.connect( func(): queue_redraw())
		mouse_exited.connect( func(): queue_redraw())
	func _draw() -> void :
		if glyph == "": return
		var c: = Vector2(28, size.y * 0.5)
		draw_circle(c, 17.0, GStyle.INK, true, -1.0, true)
		var f: = get_theme_default_font()
		var fs: = 18
		var gs: = f.get_string_size(glyph, HORIZONTAL_ALIGNMENT_LEFT, -1, fs)
		draw_string(f, c + Vector2(- gs.x * 0.5, gs.y * 0.32), glyph, HORIZONTAL_ALIGNMENT_LEFT, -1, fs, glyph_col)


## Bouton rond (icône dans un disque) avec libellé dessous : grille du menu principal.
class RoundIcon extends Control:
	signal pressed
	var icon: Texture2D
	var text: = ""
	var tint: = Color(1, 1, 1)
	var hover: = false
	var disc: = 84.0
	func _init(t: = "", ic: Texture2D = null) -> void :
		text = t;icon = ic
		custom_minimum_size = Vector2(124, 130)
		mouse_filter = Control.MOUSE_FILTER_STOP
		mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		mouse_entered.connect( func(): hover = true;queue_redraw())
		mouse_exited.connect( func(): hover = false;queue_redraw())
	func _gui_input(ev: InputEvent) -> void :
		if (ev is InputEventMouseButton and ev.pressed and ev.button_index == MOUSE_BUTTON_LEFT) or (ev is InputEventScreenTouch and ev.pressed):
			pressed.emit();accept_event()
	func _draw() -> void :
		var c: = Vector2(size.x * 0.5, disc * 0.5 + 6)
		var r: = disc * 0.5
		if hover:
			for k in 4: draw_circle(c, r + 3 + k * 3, Color(1.0, 0.92, 0.7, 0.07), true, -1.0, true)
		draw_circle(c, r, Color(0.92, 0.89, 0.82, 0.12) if not hover else Color(0.95, 0.9, 0.78, 0.22), true, -1.0, true)
		draw_arc(c, r - 1.5, 0, TAU, 64, GStyle.GOLD if hover else Color(1, 1, 1, 0.35), 2.0, true)
		draw_arc(c, r - 6.0, 0, TAU, 64, Color(1, 1, 1, 0.08), 1.0, true)
		if icon:
			var s: = Vector2(r, r) * 1.15
			draw_texture_rect(icon, Rect2(c - s * 0.5, s), false, tint)
		var f: = get_theme_default_font()
		var fs: = 17
		var w: = f.get_string_size(text, HORIZONTAL_ALIGNMENT_LEFT, -1, fs).x
		var tp: = Vector2(size.x * 0.5 - w * 0.5, disc + 32)
		draw_string_outline(f, tp, text, HORIZONTAL_ALIGNMENT_LEFT, -1, fs, 4, Color(0.03, 0.04, 0.1, 0.7))
		draw_string(f, tp, text, HORIZONTAL_ALIGNMENT_LEFT, -1, fs, GStyle.GOLD_HI if hover else GStyle.CREAM)


## En-tête de menu : titre + filet doré à losanges.
class Header extends Control:
	var title: = ""
	var sub: = ""
	func _init(t: = "", s: = "") -> void :
		title = t;sub = s;custom_minimum_size = Vector2(420, 64);mouse_filter = Control.MOUSE_FILTER_IGNORE
	func _draw() -> void :
		var f: = get_theme_default_font()
		draw_string_outline(f, Vector2(0, 34), title, HORIZONTAL_ALIGNMENT_LEFT, -1, 32, 5, Color(0.03, 0.04, 0.1, 0.6))
		draw_string(f, Vector2(0, 34), title, HORIZONTAL_ALIGNMENT_LEFT, -1, 32, GStyle.CREAM)
		if sub != "":
			draw_string(f, Vector2(2, 58), sub, HORIZONTAL_ALIGNMENT_LEFT, -1, 16, GStyle.GOLD)
		var y: = 44.0 if sub == "" else 66.0
		var w: = maxf(size.x, 200.0)
		draw_line(Vector2(0, y), Vector2(w, y), Color(GStyle.GOLD, 0.35), 1.0, true)
		GStyle.diamond(self, Vector2(0, y), 4.0, GStyle.GOLD)
		GStyle.diamond(self, Vector2(w, y), 4.0, GStyle.GOLD)

static func diamond(ci: CanvasItem, c: Vector2, r: float, col: Color) -> void :
	ci.draw_colored_polygon(PackedVector2Array([c + Vector2(0, - r), c + Vector2(r, 0), c + Vector2(0, r), c + Vector2(- r, 0)]), col)

## Séparateur doré avec losange central.
class Divider extends Control:
	func _init(w: = 300.0) -> void :
		custom_minimum_size = Vector2(w, 14);mouse_filter = Control.MOUSE_FILTER_IGNORE
	func _draw() -> void :
		var y: = size.y * 0.5
		draw_line(Vector2(0, y), Vector2(size.x * 0.5 - 10, y), Color(GStyle.GOLD, 0.5), 1.0, true)
		draw_line(Vector2(size.x * 0.5 + 10, y), Vector2(size.x, y), Color(GStyle.GOLD, 0.5), 1.0, true)
		GStyle.diamond(self, Vector2(size.x * 0.5, y), 5.0, GStyle.GOLD)

## Onglets à soulignement doré.
class Tabs extends HBoxContainer:
	signal changed(i: int)
	var current: = 0
	var btns: Array = []
	func _init(names: Array) -> void :
		add_theme_constant_override("separation", 26)
		for i in names.size():
			var b: = Button.new();b.text = names[i];b.flat = true
			b.add_theme_font_size_override("font_size", 20)
			b.add_theme_stylebox_override("focus", StyleBoxEmpty.new())
			b.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
			b.pressed.connect(select.bind(i))
			add_child(b);btns.append(b)
		select(0, false)
	func select(i: int, emit: = true) -> void :
		current = i
		for k in btns.size():
			var b: Button = btns[k]
			var col: = GStyle.GOLD_HI if k == i else Color(GStyle.CREAM, 0.6)
			for s in ["font_color", "font_hover_color", "font_pressed_color", "font_focus_color"]: b.add_theme_color_override(s, col)
		queue_redraw()
		if emit: changed.emit(i)
	func _draw() -> void :
		if current < btns.size():
			var b: Button = btns[current]
			draw_rect(Rect2(b.position.x + 6, b.position.y + b.size.y - 3, b.size.x - 12, 3), GStyle.GOLD)

## Ligne « Nom ........ valeur » d'une fiche de stats.
static func stat_row(name: String, value: String, alt: = false) -> PanelContainer:
	var p: = PanelContainer.new()
	var s: = sb(Color(1, 1, 1, 0.05) if alt else Color(0, 0, 0, 0), 4);s.content_margin_left = 14;s.content_margin_right = 14
	s.content_margin_top = 7;s.content_margin_bottom = 7
	p.add_theme_stylebox_override("panel", s)
	var h: = HBoxContainer.new();p.add_child(h)
	var a: = label(name, 18, CREAM);a.size_flags_horizontal = Control.SIZE_EXPAND_FILL;h.add_child(a)
	h.add_child(label(value, 18, Color.WHITE))
	return p

static func slider(minv: float, maxv: float, val: float, step: = 0.01) -> HSlider:
	var s: = HSlider.new();s.min_value = minv;s.max_value = maxv;s.step = step;s.value = val
	s.custom_minimum_size = Vector2(300, 28)
	var track: = sb(Color(1, 1, 1, 0.18), 3);track.content_margin_top = 3;track.content_margin_bottom = 3
	s.add_theme_stylebox_override("slider", track)
	var fill: = sb(GOLD, 3);fill.content_margin_top = 3;fill.content_margin_bottom = 3
	s.add_theme_stylebox_override("grabber_area", fill);s.add_theme_stylebox_override("grabber_area_highlight", fill)
	# le tactile n'émule pas la souris dans ce projet : on gère le doigt nous-mêmes
	s.gui_input.connect( func(ev: InputEvent):
		if (ev is InputEventScreenTouch and ev.pressed) or ev is InputEventScreenDrag:
			var k: = clampf(ev.position.x / maxf(s.size.x, 1.0), 0.0, 1.0)
			s.value = lerpf(s.min_value, s.max_value, k)
			s.accept_event())
	return s


## Logo du titre : étoile à huit branches dans des anneaux + nom du jeu en grandes lettres.
class Logo extends Control:
	var t: = 0.0
	func _init() -> void :
		custom_minimum_size = Vector2(760, 300);mouse_filter = Control.MOUSE_FILTER_IGNORE
	func _process(d: float) -> void :
		t += d;queue_redraw()
	func _draw() -> void :
		var c: = Vector2(size.x * 0.5, 82)
		var glow: = 0.5 + 0.5 * sin(t * 1.4)
		for k in 6: draw_circle(c, 46 + k * 7, Color(1.0, 0.92, 0.7, 0.025 + 0.012 * glow), true, -1.0, true)
		draw_arc(c, 62, 0, TAU, 96, Color(GStyle.GOLD_HI, 0.75), 2.0, true)
		draw_arc(c, 54, 0, TAU, 96, Color(GStyle.GOLD, 0.45), 1.2, true)
		for k in 24:
			var a: = TAU * k / 24.0 + t * 0.05
			draw_line(c + Vector2(cos(a), sin(a)) * 64, c + Vector2(cos(a), sin(a)) * (70 if k % 3 == 0 else 67), Color(GStyle.GOLD_HI, 0.7), 1.5, true)
		var pts: = PackedVector2Array()
		for k in 16:
			var a: = TAU * k / 16.0 - PI * 0.5
			var r: = 48.0 if k % 4 == 0 else (24.0 if k % 2 == 0 else 11.0)
			pts.append(c + Vector2(cos(a), sin(a)) * r)
		draw_colored_polygon(pts, Color(1.0, 0.97, 0.9, 0.95))
		draw_polyline(pts + PackedVector2Array([pts[0]]), GStyle.GOLD, 1.5, true)
		draw_circle(c, 6.0, GStyle.GOLD_HI, true, -1.0, true)
		var f: = get_theme_default_font()
		var title: = "Échos d'Aetheria"
		var fs: = 84
		var w: = f.get_string_size(title, HORIZONTAL_ALIGNMENT_LEFT, -1, fs).x
		var tp: = Vector2(size.x * 0.5 - w * 0.5, 228)
		draw_string_outline(f, tp + Vector2(0, 4), title, HORIZONTAL_ALIGNMENT_LEFT, -1, fs, 18, Color(0.05, 0.08, 0.2, 0.35))
		draw_string_outline(f, tp, title, HORIZONTAL_ALIGNMENT_LEFT, -1, fs, 10, Color(GStyle.GOLD_DEEP, 0.95))
		draw_string(f, tp, title, HORIZONTAL_ALIGNMENT_LEFT, -1, fs, Color(1.0, 0.99, 0.95))
		var sub: = "UN MONDE, MILLE ÉLÉMENTS, UNE SEULE AVENTURE"
		var sw: = f.get_string_size(sub, HORIZONTAL_ALIGNMENT_LEFT, -1, 18).x
		var sp: = Vector2(size.x * 0.5 - sw * 0.5, 274)
		draw_line(Vector2(sp.x - 70, 268), Vector2(sp.x - 14, 268), Color(GStyle.GOLD_HI, 0.8), 1.2, true)
		draw_line(Vector2(sp.x + sw + 14, 268), Vector2(sp.x + sw + 70, 268), Color(GStyle.GOLD_HI, 0.8), 1.2, true)
		GStyle.diamond(self, Vector2(sp.x - 76, 268), 3.5, GStyle.GOLD_HI)
		GStyle.diamond(self, Vector2(sp.x + sw + 76, 268), 3.5, GStyle.GOLD_HI)
		draw_string_outline(f, sp, sub, HORIZONTAL_ALIGNMENT_LEFT, -1, 18, 6, Color(0.05, 0.08, 0.2, 0.5))
		draw_string(f, sp, sub, HORIZONTAL_ALIGNMENT_LEFT, -1, 18, GStyle.CREAM_HI)
