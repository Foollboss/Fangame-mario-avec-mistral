class_name SettingsMenu
extends Control
## Paramètres : graphismes, caméra, volumes, FPS, plein écran (sauvegardés dans user://settings.cfg).

signal closed

var ui: UI
var main: Node
var box: Control
var q_btns: Array = []
var sens: HSlider
var mus: HSlider
var sfx: HSlider
var fps_chk: CheckButton
var full_chk: CheckButton

const W: = 1280.0
const H: = 720.0

func setup(u: UI, m: Node) -> void :
	ui = u;main = m
	set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	mouse_filter = Control.MOUSE_FILTER_STOP
	visible = false
	add_child(GStyle.backdrop(true))
	box = Control.new();box.size = Vector2(W, H);add_child(box)
	var head: = GStyle.Header.new("Paramètres", "Graphismes • Son • Commandes");head.position = Vector2(250, 40);head.size = Vector2(780, 70)
	box.add_child(head)
	var panel: = Panel.new();panel.position = Vector2(250, 124);panel.size = Vector2(780, 440)
	panel.add_theme_stylebox_override("panel", GStyle.sb(Color(0.07, 0.08, 0.13, 0.7), 16, Color(GStyle.GOLD, 0.2), 1))
	box.add_child(panel)
	var col: = VBoxContainer.new();col.position = Vector2(36, 26);col.size = Vector2(708, 420)
	col.add_theme_constant_override("separation", 4);panel.add_child(col)

	var qrow: = _row(col, "Qualité graphique")
	for i in 3:
		var b: = Button.new();b.text = ["Performance", "Équilibrée", "Élevée"][i];b.custom_minimum_size = Vector2(130, 40)
		b.add_theme_font_size_override("font_size", 16)
		b.pressed.connect( func(): main.apply_quality(i, true);_refresh())
		qrow.add_child(b);q_btns.append(b)
	sens = GStyle.slider(0.3, 2.0, 1.0);_row(col, "Sensibilité de la caméra").add_child(sens)
	sens.value_changed.connect( func(_v): _apply())
	mus = GStyle.slider(0.0, 1.0, 0.8);_row(col, "Volume de la musique").add_child(mus)
	mus.value_changed.connect( func(_v): _apply())
	sfx = GStyle.slider(0.0, 1.0, 0.9);_row(col, "Volume des effets").add_child(sfx)
	sfx.value_changed.connect( func(_v): _apply();main.audio.play("click", -4.0))
	fps_chk = CheckButton.new();fps_chk.add_theme_font_size_override("font_size", 16);_row(col, "Afficher les FPS").add_child(fps_chk)
	fps_chk.toggled.connect( func(_b): _apply())
	full_chk = CheckButton.new();full_chk.add_theme_font_size_override("font_size", 16)
	if not OS.has_feature("mobile"):
		_row(col, "Plein écran").add_child(full_chk)
	full_chk.toggled.connect( func(on):
		DisplayServer.window_set_mode(DisplayServer.WINDOW_MODE_FULLSCREEN if on else DisplayServer.WINDOW_MODE_WINDOWED)
		_apply())
	var keys: = GStyle.label("ZQSD / WASD : bouger  •  Clic : attaque  •  E : compétence  •  Q / R : déchaînement\nEspace : saut / planeur  •  Maj : sprint / esquive  •  1-4 : héros  •  F : interagir\nM : carte  •  L : quêtes  •  N : heure  •  H : sac à provisions  •  V : vision élémentaire  •  Échap : menu",
		15, Color(GStyle.CREAM, 0.7))
	keys.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER;keys.position = Vector2(250, 574);keys.size = Vector2(780, 70)
	box.add_child(keys)
	var back: = GStyle.Pill.new("Retour", "✕", false, 220.0);back.glyph_col = Color(0.6, 0.8, 1.0)
	back.position = Vector2(530, 656);back.pressed.connect( func(): closed.emit());box.add_child(back)

func _row(parent: Control, text: String) -> HBoxContainer:
	var h: = HBoxContainer.new();h.add_theme_constant_override("separation", 10)
	var l: = GStyle.label(text, 19, GStyle.CREAM);l.custom_minimum_size = Vector2(300, 44);l.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	h.add_child(l);parent.add_child(h)
	parent.add_child(GStyle.Divider.new(700.0))
	return h

func layout(vs: Vector2) -> void :
	var sc: = minf(vs.x / W, vs.y / H)
	box.scale = Vector2(sc, sc)
	box.position = (vs - Vector2(W, H) * sc) * 0.5

func open() -> void :
	visible = true
	var s: Dictionary = main.settings
	sens.set_value_no_signal(s.get("sens", 1.0))
	mus.set_value_no_signal(s.get("music", 0.8))
	sfx.set_value_no_signal(s.get("sfx", 0.9))
	fps_chk.set_pressed_no_signal(s.get("fps", true))
	full_chk.set_pressed_no_signal(DisplayServer.window_get_mode() == DisplayServer.WINDOW_MODE_FULLSCREEN)
	_refresh()

func close() -> void :
	visible = false

func _refresh() -> void :
	for i in q_btns.size():
		var b: Button = q_btns[i]
		var on: bool = i == main.quality
		var st: = GStyle.sb(GStyle.CREAM if on else Color(1, 1, 1, 0.08), 20, Color(GStyle.GOLD, 0.6), 0 if on else 1)
		for k in ["normal", "hover", "pressed", "focus"]: b.add_theme_stylebox_override(k, st)
		for k in ["font_color", "font_hover_color", "font_pressed_color", "font_focus_color"]:
			b.add_theme_color_override(k, GStyle.INK if on else GStyle.CREAM)

func _apply() -> void :
	main.settings = {"sens": sens.value, "music": mus.value, "sfx": sfx.value, "fps": fps_chk.button_pressed,
		"full": full_chk.button_pressed}
	main.apply_settings(true)
