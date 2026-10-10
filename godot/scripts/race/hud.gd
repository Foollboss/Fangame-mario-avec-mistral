class_name RaceHUD
extends CanvasLayer
## Interface de course : position, distance, vitesse, chrono, barre de nitro,
## messages de cascades, décompte, pause, résultats et commandes tactiles.

signal pause_pressed
signal resume_pressed
signal restart_pressed
signal quit_pressed
signal next_pressed
signal touchdrive_toggled

const K = preload("res://scripts/ui/ui_kit.gd")

var root: Control
var pos_label: Label
var pos_total: Label
var dist_label: Label
var td_label: Label
var td_box: PanelContainer
var speed_label: Label
var timer_label: Label
var nitro_bar: Control
var msg_box: VBoxContainer
var center_label: Label
var sub_label: Label
var board: VBoxContainer
var hint: Label
var fps_label: Label
var speedlines: ColorRect
var flash_rect: ColorRect
var pause_layer: Control
var results_layer: Control
var touch_nodes: Array = []

var _nitro := 0.0
var _nitro_level := 0
var _nitro_time := 0.0
var _perfect_zone := Vector2.ZERO
var _ultra_zone := Vector2.ZERO
var _in_perfect := false
var _in_ultra := false
var _shock_ready := false
var _anim_t := 0.0
var _center_t := 0.0
var _board_rows: Array = []


func _ready() -> void:
	layer = 5
	root = Control.new()
	root.set_anchors_preset(Control.PRESET_FULL_RECT)
	root.mouse_filter = Control.MOUSE_FILTER_IGNORE
	root.theme = K.theme()
	add_child(root)

	speedlines = ColorRect.new()
	speedlines.set_anchors_preset(Control.PRESET_FULL_RECT)
	speedlines.mouse_filter = Control.MOUSE_FILTER_IGNORE
	var sm := ShaderMaterial.new()
	sm.shader = load("res://shaders/speedlines.gdshader")
	sm.set_shader_parameter("intensity", 0.0)
	speedlines.material = sm
	root.add_child(speedlines)
	flash_rect = ColorRect.new()
	flash_rect.set_anchors_preset(Control.PRESET_FULL_RECT)
	flash_rect.mouse_filter = Control.MOUSE_FILTER_IGNORE
	flash_rect.color = Color(1, 1, 1, 0)
	root.add_child(flash_rect)

	_build_top_left()
	_build_top_right()
	_build_nitro_bar()
	_build_messages()
	_build_center()
	_build_board()
	_build_touch()

	var hint_text := "← →  DIRIGER    ↑ / ESPACE  NITRO    ↓ / MAJ  DRIFT (x2 = 360°)    T  TOUCHDRIVE    C  CAMÉRA"
	if is_touch():
		hint_text = "◀ ▶  DIRIGER    NITRO    DRIFT (x2 = 360°)    TOUCHDRIVE : TOUCHE LE CADRE EN HAUT À GAUCHE"
	hint_text += "\nNITRO : ré-appuie dans la zone BLEU CLAIR = PARFAIT  ·  jauge pleine + double appui = ONDE DE CHOC  ·  pendant l'onde, zone TURQUOISE = ULTRA NITRO"
	hint = K.outlined(K.label(hint_text, 18, Color(1, 1, 1, 0.85), "semi", HORIZONTAL_ALIGNMENT_CENTER), 5)
	K.place(hint, Control.PRESET_CENTER_BOTTOM, Vector2(-760, -84), Vector2(1520, 64))
	root.add_child(hint)

	fps_label = K.label("", 16, Color(0.7, 1, 0.7), "upright")
	K.place(fps_label, Control.PRESET_BOTTOM_LEFT, Vector2(14, -34), Vector2(200, 30))
	root.add_child(fps_label)
	fps_label.visible = Game.setting("show_fps", false)


func _build_top_left() -> void:
	var box := K.hbox(8)
	box.position = Vector2(26, 22)
	root.add_child(box)
	var pause_btn := Button.new()
	pause_btn.custom_minimum_size = Vector2(62, 62)
	pause_btn.add_theme_stylebox_override("normal", K.style(Color(0.05, 0.02, 0.1, 0.85), 0, 0.0, Color(1, 1, 1, 0.6), 2))
	pause_btn.add_theme_stylebox_override("hover", K.style(Color(0.2, 0.08, 0.3, 0.9), 0, 0.0, K.YELLOW, 2))
	pause_btn.add_theme_stylebox_override("pressed", K.style(Color(0.2, 0.08, 0.3, 0.9), 0, 0.0, K.YELLOW, 2))
	var ic := K.icon("pause", 30)
	ic.position = Vector2(16, 16)
	pause_btn.add_child(ic)
	pause_btn.pressed.connect(func(): pause_pressed.emit())
	pause_btn.focus_mode = Control.FOCUS_NONE
	box.add_child(pause_btn)

	var col := K.vbox(2)
	box.add_child(col)
	var p1 := K.panel(Color(0.04, 0.02, 0.08, 0.85))
	p1.custom_minimum_size = Vector2(190, 0)
	var h1 := K.hbox(8)
	h1.add_child(K.label("POS.", 20, Color(1, 1, 1, 0.8), "black"))
	h1.add_child(K.spacer())
	pos_label = K.label("1", 28, K.PURPLE_LIGHT, "black")
	h1.add_child(pos_label)
	pos_total = K.label("/6", 22, Color.WHITE, "black")
	h1.add_child(pos_total)
	p1.add_child(h1)
	col.add_child(p1)
	var p2 := K.panel(Color(0.04, 0.02, 0.08, 0.85))
	var h2 := K.hbox(8)
	h2.add_child(K.label("DIST.", 20, Color(1, 1, 1, 0.8), "black"))
	h2.add_child(K.spacer())
	dist_label = K.label("0%", 24, Color.WHITE, "black")
	h2.add_child(dist_label)
	p2.add_child(h2)
	col.add_child(p2)
	td_box = K.panel(Color(0.04, 0.02, 0.08, 0.85))
	var h3 := K.hbox(4)
	h3.add_child(K.label("TOUCH", 18, Color.WHITE, "black"))
	h3.add_child(K.label("DRIVE", 18, Color(1, 1, 1, 0.75), "semi"))
	td_label = K.label(" NON", 18, K.RED, "black")
	h3.add_child(td_label)
	td_box.add_child(h3)
	td_box.gui_input.connect(func(e):
		if e is InputEventMouseButton and e.pressed:
			touchdrive_toggled.emit())
	col.add_child(td_box)


func _build_top_right() -> void:
	var col := K.vbox(4)
	K.place(col, Control.PRESET_TOP_RIGHT, Vector2(-300, 20), Vector2(276, 140))
	col.alignment = BoxContainer.ALIGNMENT_END
	root.add_child(col)
	var sp := K.panel(Color(0.04, 0.02, 0.08, 0.85))
	var h := K.hbox(8)
	h.alignment = BoxContainer.ALIGNMENT_END
	h.add_child(K.label("KM/H", 18, Color(1, 1, 1, 0.8), "black"))
	speed_label = K.label("0", 58, Color.WHITE, "black", HORIZONTAL_ALIGNMENT_RIGHT)
	speed_label.custom_minimum_size = Vector2(150, 0)
	h.add_child(speed_label)
	sp.add_child(h)
	col.add_child(sp)
	var tp := K.panel(Color(0.85, 0.08, 0.12, 0.92))
	var th := K.hbox(8)
	th.alignment = BoxContainer.ALIGNMENT_END
	th.add_child(K.icon("timer", 24))
	timer_label = K.label("00:00.000", 26, Color.WHITE, "black")
	th.add_child(timer_label)
	tp.add_child(th)
	col.add_child(tp)


func _build_nitro_bar() -> void:
	nitro_bar = Control.new()
	K.place(nitro_bar, Control.PRESET_CENTER_TOP, Vector2(-290, 26), Vector2(580, 60))
	nitro_bar.mouse_filter = Control.MOUSE_FILTER_IGNORE
	nitro_bar.draw.connect(_draw_nitro)
	root.add_child(nitro_bar)


const NB_W := 580.0
const NB_H := 24.0
const NB_SK := 10.0


## Abscisse dans la jauge inclinée pour une fraction f (0..1) à la hauteur y.
func _nb_x(f: float, y: float) -> float:
	return NB_W * f + NB_SK - 2.0 * NB_SK * y / NB_H


func _nb_seg(f0: float, f1: float, y0: float, y1: float) -> PackedVector2Array:
	return PackedVector2Array([Vector2(_nb_x(f0, y0), y0), Vector2(_nb_x(f1, y0), y0),
		Vector2(_nb_x(f1, y1), y1), Vector2(_nb_x(f0, y1), y1)])


func _nitro_color(level: int) -> Color:
	match level:
		Racer.NITRO_NORMAL:
			return K.NITRO_ORANGE
		Racer.NITRO_PERFECT:
			return K.SKY
		Racer.NITRO_SHOCK:
			return K.VIOLET
		Racer.NITRO_ULTRA:
			return K.TURQUOISE
	return K.YELLOW


func _draw_nitro() -> void:
	var bg := _nb_seg(0.0, 1.0, 0.0, NB_H)
	nitro_bar.draw_colored_polygon(bg, Color(0.04, 0.02, 0.08, 0.8))
	var f: float = clamp(_nitro / 100.0, 0.0, 1.0)
	var pulse := 0.5 + 0.5 * sin(_anim_t * 9.0)
	var col := _nitro_color(_nitro_level)
	if _shock_ready:
		# jauge pleine : elle clignote en violet, l'onde de choc est prête
		col = K.YELLOW.lerp(K.VIOLET, smoothstep(0.3, 0.7, pulse))
	elif _nitro_level == Racer.NITRO_ULTRA:
		col = K.TURQUOISE.lerp(Color.WHITE, 0.25 * pulse)
	if f * NB_W > 4.0:
		nitro_bar.draw_colored_polygon(_nb_seg(0.0, f, 3.0, NB_H - 3.0), col)
		# reflet en haut de la jauge
		nitro_bar.draw_colored_polygon(_nb_seg(0.0, f, 3.0, 8.0), Color(1, 1, 1, 0.22))
	# zones de timing DANS la jauge : bleu clair = nitro parfait, turquoise = ultra nitro
	_draw_zone(_perfect_zone, K.SKY, _in_perfect, "PARFAIT")
	_draw_zone(_ultra_zone, K.TURQUOISE, _in_ultra, "ULTRA")
	# segments
	for i in [1, 2]:
		var sf: float = i / 3.0
		nitro_bar.draw_line(Vector2(_nb_x(sf, 0.0), 0.0), Vector2(_nb_x(sf, NB_H), NB_H), Color(0, 0, 0, 0.7), 3.0)
	# bord de la jauge qui descend pendant le nitro
	if _nitro_level > Racer.NITRO_OFF and f > 0.0:
		nitro_bar.draw_line(Vector2(_nb_x(f, -3.0), -3.0), Vector2(_nb_x(f, NB_H + 3.0), NB_H + 3.0), Color.WHITE, 3.0)
	# contour
	var outline_col := Color(1, 1, 1, 0.25)
	var outline_w := 2.0
	if _shock_ready:
		outline_col = Color(K.VIOLET.r, K.VIOLET.g, K.VIOLET.b, 0.55 + 0.45 * pulse)
		outline_w = 4.0
	elif _nitro_level >= Racer.NITRO_SHOCK:
		outline_col = _nitro_color(_nitro_level)
		outline_w = 3.0
	var ol := bg.duplicate()
	ol.append(bg[0])
	nitro_bar.draw_polyline(ol, outline_col, outline_w)
	if _shock_ready:
		_nb_text("DOUBLE APPUI : ONDE DE CHOC", NB_W * 0.5, 16, K.VIOLET.lightened(0.25 * pulse))


## Petit texte sous la jauge, centré sur cx, avec un contour sombre pour rester lisible sur le ciel.
func _nb_text(text: String, cx: float, fs: int, col: Color) -> void:
	var font := K.font("black")
	var tw := font.get_string_size(text, HORIZONTAL_ALIGNMENT_LEFT, -1, fs).x
	var pos := Vector2(cx - tw * 0.5, NB_H + 21.0)
	nitro_bar.draw_string_outline(font, pos, text, HORIZONTAL_ALIGNMENT_LEFT, -1, fs, 6, Color(0.04, 0.0, 0.1, 0.85))
	nitro_bar.draw_string(font, pos, text, HORIZONTAL_ALIGNMENT_LEFT, -1, fs, col)


func _draw_zone(zone: Vector2, col: Color, inside: bool, text: String) -> void:
	if zone.y <= zone.x:
		return
	var f0: float = clamp(zone.x / 100.0, 0.0, 1.0)
	var f1: float = clamp(zone.y / 100.0, 0.0, 1.0)
	if (f1 - f0) * NB_W < 2.0:
		return
	# zone opaque, plus claire que la jauge et cernée de sombre pour se voir même
	# quand la jauge a la même couleur (nitro parfait dans la zone bleu clair)
	var zone_poly := _nb_seg(f0, f1, 1.0, NB_H - 1.0)
	nitro_bar.draw_colored_polygon(zone_poly, col.lightened(0.45 if inside else 0.2))
	var border := zone_poly.duplicate()
	border.append(border[0])
	nitro_bar.draw_polyline(border, Color(0.03, 0.0, 0.08, 0.9), 4.0)
	nitro_bar.draw_polyline(border, Color.WHITE if inside else col.lightened(0.5), 2.0)
	if inside:
		# halo quand le bord de la jauge est dans la zone : c'est le moment d'appuyer
		var halo := _nb_seg(f0, f1, -5.0, NB_H + 5.0)
		halo.append(halo[0])
		nitro_bar.draw_polyline(halo, Color(col.r, col.g, col.b, 0.6), 2.0)
	_nb_text(text, _nb_x((f0 + f1) * 0.5, NB_H), 15, col.lightened(0.3) if inside else col)


## Flash plein écran (ultra nitro, onde de choc).
func flash(col: Color, strength: float = 0.4, duration: float = 0.45) -> void:
	if flash_rect == null:
		return
	flash_rect.color = Color(col.r, col.g, col.b, strength)
	var tw := flash_rect.create_tween()
	tw.tween_property(flash_rect, "color:a", 0.0, duration).set_ease(Tween.EASE_OUT)


func _build_messages() -> void:
	msg_box = K.vbox(6)
	if is_touch():
		K.place(msg_box, Control.PRESET_CENTER_TOP, Vector2(-200, 104), Vector2(400, 10))
		msg_box.grow_horizontal = Control.GROW_DIRECTION_BOTH
	else:
		K.place(msg_box, Control.PRESET_CENTER_RIGHT, Vector2(-430, -60), Vector2(400, 10))
		msg_box.grow_horizontal = Control.GROW_DIRECTION_BEGIN
	msg_box.alignment = BoxContainer.ALIGNMENT_END
	msg_box.mouse_filter = Control.MOUSE_FILTER_IGNORE
	root.add_child(msg_box)


func _build_center() -> void:
	center_label = K.outlined(K.label("", 150, Color.WHITE, "black", HORIZONTAL_ALIGNMENT_CENTER), 14, Color(0.3, 0.0, 0.5, 0.8))
	K.place(center_label, Control.PRESET_CENTER, Vector2(-600, -230), Vector2(1200, 220))
	root.add_child(center_label)
	sub_label = K.outlined(K.label("", 34, K.YELLOW, "black", HORIZONTAL_ALIGNMENT_CENTER), 8)
	K.place(sub_label, Control.PRESET_CENTER, Vector2(-600, 0), Vector2(1200, 50))
	root.add_child(sub_label)


func _build_board() -> void:
	board = K.vbox(3)
	if is_touch():
		K.place(board, Control.PRESET_TOP_LEFT, Vector2(26, 196), Vector2(240, 200))
	else:
		K.place(board, Control.PRESET_CENTER_LEFT, Vector2(26, -80), Vector2(240, 200))
	board.mouse_filter = Control.MOUSE_FILTER_IGNORE
	root.add_child(board)


func setup_board(racers: Array) -> void:
	for c in board.get_children():
		c.queue_free()
	_board_rows.clear()
	pos_total.text = "/%d" % racers.size()
	if racers.size() <= 1:
		return
	for i in racers.size():
		var p := K.panel(Color(0.04, 0.02, 0.08, 0.6))
		p.custom_minimum_size = Vector2(230, 0)
		var h := K.hbox(10)
		var n := K.label(str(i + 1), 18, K.YELLOW, "black")
		n.custom_minimum_size = Vector2(22, 0)
		h.add_child(n)
		var nm := K.label("", 17, Color.WHITE, "semi")
		h.add_child(nm)
		p.add_child(h)
		board.add_child(p)
		_board_rows.append([p, nm])


func update_board(order: Array, player: Racer) -> void:
	for i in min(order.size(), _board_rows.size()):
		var r: Racer = order[i]
		var row: Array = _board_rows[i]
		row[1].text = r.display_name + ("  ✕" if r.wrecked else "")
		row[0].add_theme_stylebox_override("panel", K.style(K.PURPLE if r == player else Color(0.04, 0.02, 0.08, 0.6)))


func is_touch() -> bool:
	return DisplayServer.is_touchscreen_available() or Game.autotest.has("touch")


## Commandes tactiles : ◀ au milieu à gauche (DRIFT dessous), ▶ au milieu à droite (NITRO dessous).
## Les zones sensibles sont plus grandes que les ronds dessinés pour être faciles à toucher.
func _build_touch() -> void:
	if not is_touch():
		return
	var vp := get_viewport().get_visible_rect().size
	var r := vp.y * 0.105            # rayon des boutons
	var m := vp.x * 0.025 + r        # distance du centre des boutons au bord
	var cy := vp.y * 0.52            # hauteur des flèches
	var cy2 := cy + r * 2.35         # hauteur de DRIFT / NITRO
	var zone_w := m + r * 1.6
	var split := (cy + cy2) * 0.5
	var defs := [
		# action, centre du rond, zone sensible, texte, couleur, rayon
		["steer_left", Vector2(m, cy), Rect2(0, cy - r * 1.6, zone_w, split - (cy - r * 1.6)), "◀", Color(1, 1, 1), r],
		["drift", Vector2(m, cy2), Rect2(0, split, zone_w, vp.y - split), "DRIFT", K.CYAN, r * 0.9],
		["steer_right", Vector2(vp.x - m, cy), Rect2(vp.x - zone_w, cy - r * 1.6, zone_w, split - (cy - r * 1.6)), "▶", Color(1, 1, 1), r],
		["nitro", Vector2(vp.x - m, cy2), Rect2(vp.x - zone_w, split, zone_w, vp.y - split), "NITRO", K.YELLOW, r * 1.05],
	]
	for d in defs:
		var zone: Rect2 = d[2]
		var b := TouchScreenButton.new()
		var shape := RectangleShape2D.new()
		shape.size = zone.size
		b.shape = shape
		# sans texture, Godot centre toujours la forme sur la position du bouton :
		# on place donc le bouton au CENTRE de sa zone sensible
		b.position = zone.get_center()
		b.action = d[0]
		b.visibility_mode = TouchScreenButton.VISIBILITY_ALWAYS
		add_child(b)
		var vis := _touch_visual(d[1], d[3], d[4], d[5])
		vis.set_meta("label", d[3])
		vis.set_meta("center", d[1])
		root.add_child(vis)
		touch_nodes.append(b)
		touch_nodes.append(vis)
		b.pressed.connect(func(): vis.set_meta("down", true); vis.queue_redraw())
		b.released.connect(func(): vis.set_meta("down", false); vis.queue_redraw())


## Outil de test (--touchtest) : simule un doigt au centre de chaque rond, en coordonnées
## de la fenêtre comme un vrai écran tactile, et affiche les commandes déclenchées.
func run_touch_test() -> void:
	var to_window := get_viewport().get_final_transform()
	print("touchtest: fenetre=", DisplayServer.window_get_size(), " canevas=", get_viewport().get_visible_rect().size)
	var idx := 0
	for n in touch_nodes:
		if not (n is Control):
			continue
		var label: String = n.get_meta("label", "?")
		var center: Vector2 = n.get_meta("center", n.position + n.size * 0.5)
		var wpos: Vector2 = to_window * center
		var ev := InputEventScreenTouch.new()
		ev.index = idx
		ev.position = wpos
		ev.pressed = true
		Input.parse_input_event(ev)
		for i in 3:
			await get_tree().process_frame
		var active := []
		for a in ["steer_left", "steer_right", "drift", "nitro"]:
			if Input.is_action_pressed(a):
				active.append(a)
		print("touchtest: doigt sur [%s] -> %s" % [label, ", ".join(active) if not active.is_empty() else "RIEN"])
		var up := InputEventScreenTouch.new()
		up.index = idx
		up.position = wpos
		up.pressed = false
		Input.parse_input_event(up)
		for i in 3:
			await get_tree().process_frame
		idx += 1
	# deux doigts en même temps : ◀ maintenu + NITRO
	var pts := {}
	for n in touch_nodes:
		if n is Control:
			pts[n.get_meta("label", "?")] = to_window * (n.get_meta("center", Vector2.ZERO) as Vector2)
	var downs := []
	for pair in [[10, "◀"], [11, "NITRO"]]:
		var e := InputEventScreenTouch.new()
		e.index = pair[0]
		e.position = pts[pair[1]]
		e.pressed = true
		Input.parse_input_event(e)
		downs.append(e)
	for i in 3:
		await get_tree().process_frame
	print("touchtest: deux doigts [◀ + NITRO] -> gauche=%s nitro=%s" % [Input.is_action_pressed("steer_left"), Input.is_action_pressed("nitro")])
	for e in downs:
		var u := InputEventScreenTouch.new()
		u.index = e.index
		u.position = e.position
		u.pressed = false
		Input.parse_input_event(u)


func set_touch_visible(on: bool) -> void:
	for n in touch_nodes:
		n.visible = on


func _touch_visual(center: Vector2, text: String, col: Color, radius: float) -> Control:
	var c := Control.new()
	c.mouse_filter = Control.MOUSE_FILTER_IGNORE
	c.position = center - Vector2(radius, radius)
	c.size = Vector2(radius, radius) * 2.0
	c.set_meta("down", false)
	var font := K.font("black")
	c.draw.connect(func():
		var down: bool = c.get_meta("down", false)
		var ctr := Vector2(radius, radius)
		c.draw_circle(ctr, radius, Color(col.r * 0.25, col.g * 0.2, col.b * 0.35, 0.75 if down else 0.45))
		c.draw_arc(ctr, radius - 3.0, 0.0, TAU, 48, Color(col.r, col.g, col.b, 1.0 if down else 0.8), 6.0 if down else 4.0, true)
		if text == "◀" or text == "▶":
			var s := 1.0 if text == "▶" else -1.0
			var k := radius * 0.42
			c.draw_colored_polygon(PackedVector2Array([ctr + Vector2(s * k, 0), ctr + Vector2(-s * k * 0.7, -k), ctr + Vector2(-s * k * 0.7, k)]), Color(1, 1, 1, 1.0 if down else 0.85))
		else:
			var fs := int(radius * 0.36)
			var tw := font.get_string_size(text, HORIZONTAL_ALIGNMENT_LEFT, -1, fs).x
			c.draw_string(font, ctr + Vector2(-tw * 0.5, fs * 0.35), text, HORIZONTAL_ALIGNMENT_LEFT, -1, fs, Color(col.r, col.g, col.b, 1.0 if down else 0.9)))
	return c


# ---------------------------------------------------------------------------
func update_hud(dt: float, player: Racer, pos: int, total: int, dist: float, clock: float, touchdrive: bool) -> void:
	pos_label.text = str(pos)
	dist_label.text = "%d%%" % int(clamp(dist, 0.0, 1.0) * 100.0)
	speed_label.text = str(int(player.v * 3.6))
	timer_label.text = K.fmt_time(clock)
	td_label.text = " OUI" if touchdrive else " NON"
	td_label.add_theme_color_override("font_color", K.LIME if touchdrive else K.RED)
	_anim_t += dt
	_nitro = player.nitro
	_nitro_level = player.nitro_level
	_nitro_time = player.nitro_time
	_perfect_zone = player.perfect_zone()
	_ultra_zone = player.ultra_zone()
	_in_perfect = player.in_perfect_window()
	_in_ultra = player.in_ultra_window()
	_shock_ready = player.shockwave_ready()
	nitro_bar.queue_redraw()
	var target := 0.0
	var tint := Color(1, 1, 1)
	match player.nitro_level:
		Racer.NITRO_NORMAL:
			target = 0.35
		Racer.NITRO_PERFECT:
			target = 0.6
			tint = Color(0.75, 0.9, 1.0)
		Racer.NITRO_SHOCK:
			target = 0.9
			tint = Color(0.82, 0.6, 1.0)
		Racer.NITRO_ULTRA:
			target = 1.0
			tint = Color(0.55, 1.0, 0.92)
	var sm := speedlines.material as ShaderMaterial
	var cur: float = sm.get_shader_parameter("intensity")
	sm.set_shader_parameter("intensity", lerp(cur, target, 1.0 - exp(-5.0 * dt)))
	sm.set_shader_parameter("tint", tint)
	if _center_t > 0.0:
		_center_t -= dt
		if _center_t <= 0.0:
			center_label.text = ""
			sub_label.text = ""
	if hint.visible and clock > 9.0:
		hint.modulate.a = max(0.0, hint.modulate.a - dt)
		if hint.modulate.a <= 0.0:
			hint.visible = false
	if fps_label.visible:
		fps_label.text = "%d FPS" % Engine.get_frames_per_second()


func show_center(text: String, duration: float = 1.0, sub: String = "", color: Color = Color.WHITE) -> void:
	center_label.text = text
	center_label.add_theme_color_override("font_color", color)
	sub_label.text = sub
	_center_t = duration
	center_label.pivot_offset = center_label.size * 0.5
	center_label.scale = Vector2(1.4, 1.4)
	var tw := center_label.create_tween()
	tw.tween_property(center_label, "scale", Vector2.ONE, 0.25).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)


func push_message(text: String, sub: String = "", color: Color = K.YELLOW) -> void:
	var p := K.panel(Color(0.05, 0.01, 0.12, 0.85), K.SKEW, color, 2)
	var h := K.hbox(12)
	h.alignment = BoxContainer.ALIGNMENT_END
	var l := K.label(text, 28, Color.WHITE, "black")
	h.add_child(l)
	if sub != "":
		h.add_child(K.label(sub, 24, color, "black"))
	p.add_child(h)
	p.mouse_filter = Control.MOUSE_FILTER_IGNORE
	msg_box.add_child(p)
	if msg_box.get_child_count() > 4:
		msg_box.get_child(0).queue_free()
	p.modulate.a = 0.0
	p.position.x += 60
	var tw := p.create_tween()
	tw.tween_property(p, "modulate:a", 1.0, 0.12)
	tw.tween_interval(1.7)
	tw.tween_property(p, "modulate:a", 0.0, 0.35)
	tw.tween_callback(p.queue_free)


# ---------------------------------------------------------------------------
# Pause
# ---------------------------------------------------------------------------
func show_pause(on: bool) -> void:
	set_touch_visible(not on)
	if pause_layer:
		pause_layer.queue_free()
		pause_layer = null
	if not on:
		return
	pause_layer = ColorRect.new()
	(pause_layer as ColorRect).color = Color(0.05, 0.0, 0.12, 0.75)
	pause_layer.set_anchors_preset(Control.PRESET_FULL_RECT)
	pause_layer.process_mode = Node.PROCESS_MODE_ALWAYS
	root.add_child(pause_layer)
	var v := K.vbox(18)
	K.place(v, Control.PRESET_CENTER, Vector2(-220, -220), Vector2(440, 400))
	pause_layer.add_child(v)
	v.add_child(K.outlined(K.label("PAUSE", 72, Color.WHITE, "black", HORIZONTAL_ALIGNMENT_CENTER)))
	var b1 := K.button("REPRENDRE", 30, "primary", Vector2(440, 70))
	b1.pressed.connect(func(): resume_pressed.emit())
	v.add_child(b1)
	var b2 := K.button("RECOMMENCER", 28, "white", Vector2(440, 64))
	b2.pressed.connect(func(): restart_pressed.emit())
	v.add_child(b2)
	var b3 := K.button("QUITTER LA COURSE", 28, "purple", Vector2(440, 64))
	b3.pressed.connect(func(): quit_pressed.emit())
	v.add_child(b3)
	b1.call_deferred("grab_focus")


# ---------------------------------------------------------------------------
# Résultats
# ---------------------------------------------------------------------------
func show_results(data: Dictionary) -> void:
	for c in [msg_box, board, nitro_bar, speedlines, hint]:
		c.visible = false
	set_touch_visible(false)
	results_layer = Control.new()
	results_layer.set_anchors_preset(Control.PRESET_FULL_RECT)
	results_layer.process_mode = Node.PROCESS_MODE_ALWAYS
	root.add_child(results_layer)
	var shade := ColorRect.new()
	shade.color = Color(0.03, 0.0, 0.08, 0.55)
	shade.set_anchors_preset(Control.PRESET_FULL_RECT)
	results_layer.add_child(shade)

	var pos: int = data.get("position", 1)
	var time_attack: bool = data.get("mode", "classic") == "time_attack"
	var head := K.hbox(0)
	head.position = Vector2(60, 70)
	results_layer.add_child(head)
	var pbox := K.panel(K.MAGENTA if data.get("finished", true) else K.RED, K.SKEW)
	pbox.custom_minimum_size = Vector2(230, 130)
	var ptxt := "%d%s" % [pos, "ER" if pos == 1 else "E"]
	if time_attack:
		ptxt = "OK" if data.get("objective_ok", false) else "RATÉ"
	if not data.get("finished", true):
		ptxt = "DNF"
	pbox.add_child(K.outlined(K.label(ptxt, 96, Color.WHITE, "black", HORIZONTAL_ALIGNMENT_CENTER), 4))
	head.add_child(pbox)
	var hv := K.vbox(4)
	var t1 := K.panel(Color(0.97, 0.97, 0.97), K.SKEW)
	var t1h := K.hbox(6)
	t1h.add_child(K.label("RÉCOMPENSES", 30, Color(0.05, 0.03, 0.1), "black"))
	t1h.add_child(K.label("DE COURSE", 30, Color(0.05, 0.03, 0.1), "semi"))
	t1.add_child(t1h)
	hv.add_child(t1)
	var t2 := K.panel(Color(0.05, 0.02, 0.1, 0.9), K.SKEW)
	var t2h := K.hbox(10)
	t2h.add_child(K.icon("timer", 26))
	t2h.add_child(K.label("TON TEMPS", 26, Color.WHITE, "black"))
	t2h.add_child(K.label(K.fmt_time(data.get("time", 0.0)), 28, K.LIME, "black"))
	t2.add_child(t2h)
	hv.add_child(t2)
	head.add_child(hv)

	var body := K.vbox(14)
	body.position = Vector2(70, 260)
	body.custom_minimum_size = Vector2(760, 0)
	results_layer.add_child(body)
	body.add_child(K.outlined(K.label("OBJECTIFS DE COURSE", 34, Color.WHITE, "black"), 5))
	var obj := K.panel(Color(0.02, 0.01, 0.05, 0.85))
	var oh := K.hbox(12)
	oh.add_child(K.icon("flag", 26, K.LIME if data.get("objective_ok", false) else K.RED))
	oh.add_child(K.label(data.get("objective_text", ""), 24, Color.WHITE, "black"))
	oh.add_child(K.icon("check" if data.get("objective_ok", false) else "cross", 24, K.LIME if data.get("objective_ok", false) else K.RED))
	obj.add_child(oh)
	body.add_child(obj)
	var rw: Dictionary = data.get("rewards", {})
	var rr := K.hbox(14)
	var cp := K.panel(Color(0.02, 0.01, 0.05, 0.85), K.SKEW)
	var ch := K.hbox(8)
	ch.add_child(K.icon("coin", 30))
	ch.add_child(K.label("+" + K.fmt_int(int(rw.get("credits", 0))), 30, Color.WHITE, "black"))
	cp.add_child(ch)
	rr.add_child(cp)
	if int(rw.get("tokens", 0)) > 0:
		var tk := K.panel(Color(0.02, 0.01, 0.05, 0.85), K.SKEW)
		var th := K.hbox(8)
		th.add_child(K.icon("token", 30))
		th.add_child(K.label("+" + str(rw.get("tokens", 0)), 30, Color.WHITE, "black"))
		tk.add_child(th)
		rr.add_child(tk)
	var xp := K.panel(Color(0.02, 0.01, 0.05, 0.85), K.SKEW)
	xp.add_child(K.label("+%d XP PASS" % int(rw.get("xp", 0)), 26, K.LIME, "black"))
	rr.add_child(xp)
	body.add_child(rr)
	for car_id in rw.get("plans", {}).keys():
		var pl := K.panel(Color(0.2, 0.05, 0.4, 0.9), K.SKEW, K.YELLOW, 2)
		var plh := K.hbox(10)
		plh.add_child(K.icon("plan", 30, K.YELLOW))
		plh.add_child(K.label("PLAN x%d  %s" % [int(rw["plans"][car_id]), Game.car_display_name(car_id)], 24, Color.WHITE, "black"))
		pl.add_child(plh)
		body.add_child(pl)
	if rw.get("flag", false):
		var fl := K.panel(Color(0.1, 0.35, 0.05, 0.9), K.SKEW, K.LIME, 2)
		var flh := K.hbox(10)
		flh.add_child(K.icon("flag", 28, K.LIME))
		flh.add_child(K.label("DRAPEAU DE SAISON OBTENU !", 24, Color.WHITE, "black"))
		fl.add_child(flh)
		body.add_child(fl)
	var stats_line := "TAKEDOWNS %d   ·   TONNEAUX %d   ·   SAUTS %d   ·   NITROS PARFAITS %d   ·   FRÔLEMENTS %d" % [
		data.get("takedowns", 0), data.get("barrel_rolls", 0), data.get("jumps", 0), data.get("perfect_nitros", 0), data.get("near_misses", 0)]
	if int(data.get("ultra_nitros", 0)) > 0:
		stats_line += "   ·   ULTRA NITROS %d" % int(data.get("ultra_nitros", 0))
	body.add_child(K.outlined(K.label(stats_line, 20, Color(1, 1, 1, 0.85), "semi"), 4))

	# tableau complet
	var table := K.panel(Color(0.04, 0.01, 0.1, 0.92))
	table.position = Vector2(1080, 120)
	table.custom_minimum_size = Vector2(760, 0)
	table.visible = false
	var tv := K.vbox(6)
	tv.add_child(K.label("RÉSULTATS COMPLETS", 30, K.YELLOW, "black"))
	for row in data.get("table", []):
		var rh := K.hbox(14)
		var a := K.label(str(row[0]), 24, K.YELLOW, "black")
		a.custom_minimum_size = Vector2(40, 0)
		rh.add_child(a)
		var b := K.label(row[1], 22, K.LIME if row[3] else Color.WHITE, "black")
		b.custom_minimum_size = Vector2(230, 0)
		rh.add_child(b)
		var c := K.label(row[2], 18, Color(1, 1, 1, 0.75), "semi")
		c.custom_minimum_size = Vector2(300, 0)
		rh.add_child(c)
		rh.add_child(K.label(row[4], 22, Color.WHITE, "black"))
		tv.add_child(rh)
	table.add_child(tv)
	results_layer.add_child(table)

	var btns := K.hbox(18)
	K.place(btns, Control.PRESET_BOTTOM_RIGHT, Vector2(-900, -130), Vector2(860, 80))
	btns.alignment = BoxContainer.ALIGNMENT_END
	results_layer.add_child(btns)
	var full := K.button("RÉSULTATS COMPLETS", 24, "white", Vector2(330, 72))
	full.pressed.connect(func(): table.visible = not table.visible)
	btns.add_child(full)
	var again := K.button("REJOUER", 24, "white", Vector2(170, 72))
	again.pressed.connect(func(): restart_pressed.emit())
	btns.add_child(again)
	var nxt := K.button("SUIVANT", 34, "primary", Vector2(300, 80))
	nxt.pressed.connect(func(): next_pressed.emit())
	btns.add_child(nxt)
	nxt.call_deferred("grab_focus")
	results_layer.modulate.a = 0.0
	results_layer.create_tween().tween_property(results_layer, "modulate:a", 1.0, 0.4)
