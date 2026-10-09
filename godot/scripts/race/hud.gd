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
var pause_layer: Control
var results_layer: Control

var _nitro := 0.0
var _nitro_level := 0
var _nitro_time := 0.0
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

	_build_top_left()
	_build_top_right()
	_build_nitro_bar()
	_build_messages()
	_build_center()
	_build_board()
	_build_touch()

	var hint_text := "← →  DIRIGER    ↑ / ESPACE  NITRO (x2 = ONDE DE CHOC)    ↓ / MAJ  DRIFT (x2 = 360°)    T  TOUCHDRIVE    C  CAMÉRA"
	if DisplayServer.is_touchscreen_available():
		hint_text = "◀ ▶  DIRIGER (MOITIÉ GAUCHE)    NITRO : TAPE (x2 = ONDE DE CHOC)    DRIFT (x2 = 360°)    TOUCHDRIVE : TOUCHE LE CADRE EN HAUT À GAUCHE"
	hint = K.outlined(K.label(hint_text, 18, Color(1, 1, 1, 0.85), "semi", HORIZONTAL_ALIGNMENT_CENTER), 5)
	K.place(hint, Control.PRESET_CENTER_BOTTOM, Vector2(-700, -60), Vector2(1400, 40))
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


func _draw_nitro() -> void:
	var w := 580.0
	var hgt := 24.0
	var sk := 10.0
	var bg := PackedVector2Array([Vector2(sk, 0), Vector2(w + sk, 0), Vector2(w - sk, hgt), Vector2(-sk, hgt)])
	nitro_bar.draw_colored_polygon(bg, Color(0.04, 0.02, 0.08, 0.8))
	var f: float = clamp(_nitro / 100.0, 0.0, 1.0)
	var col := K.YELLOW
	if _nitro_level == 2:
		col = K.MAGENTA
	elif _nitro_level == 3:
		col = K.CYAN
	if w * f > sk * 2.0 + 6.0:
		var fw := w * f
		var poly := PackedVector2Array([Vector2(sk + 2, 3), Vector2(fw + sk - 2, 3), Vector2(fw - sk + 2, hgt - 3), Vector2(-sk + 4, hgt - 3)])
		nitro_bar.draw_colored_polygon(poly, col)
	# segments
	for i in [1, 2]:
		var sx: float = w * i / 3.0
		nitro_bar.draw_line(Vector2(sx + sk, 0), Vector2(sx - sk, hgt), Color(0, 0, 0, 0.7), 3.0)
	# jauge de timing du nitro parfait
	if _nitro_level == 1 or _nitro_level == 2:
		var ty := hgt + 8.0
		var tw := w * 0.6
		var tx := (w - tw) * 0.5
		nitro_bar.draw_rect(Rect2(tx, ty, tw, 10), Color(0, 0, 0, 0.6))
		var a := Racer.PERFECT_A / Racer.NITRO_BURST
		var b := Racer.PERFECT_B / Racer.NITRO_BURST
		var in_win := _nitro_time >= Racer.PERFECT_A and _nitro_time <= Racer.PERFECT_B
		nitro_bar.draw_rect(Rect2(tx + tw * a, ty, tw * (b - a), 10), Color(0.8, 0.3, 1.0, 1.0 if in_win else 0.55))
		var c: float = clamp(_nitro_time / Racer.NITRO_BURST, 0.0, 1.0)
		nitro_bar.draw_rect(Rect2(tx + tw * c - 2, ty - 4, 4, 18), Color.WHITE)


func _build_messages() -> void:
	msg_box = K.vbox(6)
	K.place(msg_box, Control.PRESET_CENTER_RIGHT, Vector2(-430, -60), Vector2(400, 10))
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


func _build_touch() -> void:
	if not DisplayServer.is_touchscreen_available():
		return
	var vp := get_viewport().get_visible_rect().size
	var defs := [
		["steer_left", Rect2(0, vp.y * 0.35, vp.x * 0.3, vp.y * 0.65), "◀"],
		["steer_right", Rect2(vp.x * 0.3, vp.y * 0.35, vp.x * 0.3, vp.y * 0.65), "▶"],
		["drift", Rect2(vp.x * 0.62, vp.y * 0.62, vp.x * 0.17, vp.y * 0.38), "DRIFT"],
		["nitro", Rect2(vp.x * 0.80, vp.y * 0.5, vp.x * 0.2, vp.y * 0.5), "NITRO"],
	]
	for d in defs:
		var b := TouchScreenButton.new()
		var shape := RectangleShape2D.new()
		var r: Rect2 = d[1]
		shape.size = r.size
		b.shape = shape
		b.shape_centered = false
		b.position = r.position
		b.action = d[0]
		b.visibility_mode = TouchScreenButton.VISIBILITY_TOUCHSCREEN_ONLY
		add_child(b)
		var lbl := K.label(d[2], 30, Color(1, 1, 1, 0.35), "black", HORIZONTAL_ALIGNMENT_CENTER)
		lbl.position = r.position + Vector2(0, r.size.y - 90)
		lbl.size = Vector2(r.size.x, 60)
		lbl.mouse_filter = Control.MOUSE_FILTER_IGNORE
		root.add_child(lbl)


# ---------------------------------------------------------------------------
func update_hud(dt: float, player: Racer, pos: int, total: int, dist: float, clock: float, touchdrive: bool) -> void:
	pos_label.text = str(pos)
	dist_label.text = "%d%%" % int(clamp(dist, 0.0, 1.0) * 100.0)
	speed_label.text = str(int(player.v * 3.6))
	timer_label.text = K.fmt_time(clock)
	td_label.text = " OUI" if touchdrive else " NON"
	td_label.add_theme_color_override("font_color", K.LIME if touchdrive else K.RED)
	_nitro = player.nitro
	_nitro_level = player.nitro_level
	_nitro_time = player.nitro_time
	nitro_bar.queue_redraw()
	var target := 0.0
	match player.nitro_level:
		1:
			target = 0.35
		2:
			target = 0.6
		3:
			target = 1.0
	var sm := speedlines.material as ShaderMaterial
	var cur: float = sm.get_shader_parameter("intensity")
	sm.set_shader_parameter("intensity", lerp(cur, target, 1.0 - exp(-5.0 * dt)))
	sm.set_shader_parameter("tint", Color(1, 1, 1) if player.nitro_level < 2 else (Color(0.9, 0.6, 1.0) if player.nitro_level == 2 else Color(0.6, 0.85, 1.0)))
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
