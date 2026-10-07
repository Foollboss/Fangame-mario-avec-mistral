class_name RaceHUD
extends CanvasLayer
## Interface de course : position, distance, vitesse, chrono, nitro, cascades, résultats, pause.

signal pause_requested
signal resume_requested
signal restart_requested
signal quit_requested
signal next_requested

class NitroBar:
	extends Control
	var gauge := 0.5
	var level := 0
	var nitro_t := 0.0
	var window := Vector2(0.85, 1.4)
	var flash := 0.0

	func _draw() -> void:
		var w := size.x
		var h := size.y
		var sk := h * 0.6
		var bg := PackedVector2Array([Vector2(sk, 0), Vector2(w, 0), Vector2(w - sk, h), Vector2(0, h)])
		draw_colored_polygon(bg, Color(0.05, 0.02, 0.12, 0.75))
		var cols := [Color("#ffd800"), Color("#ffd800"), Color("#29d4ff"), Color("#d94dff")]
		var c: Color = cols[level]
		if gauge >= 0.88 and level == 0:
			c = Color("#ffd800").lerp(Color("#d94dff"), 0.5 + 0.5 * sin(Time.get_ticks_msec() * 0.01))
		var fw := (w - sk) * gauge
		if fw > 1.0:
			var fill := PackedVector2Array([Vector2(sk, 0), Vector2(sk + fw, 0), Vector2(fw, h), Vector2(0, h)])
			draw_colored_polygon(fill, c)
		# graduations
		for k: float in [0.33, 0.66]:
			var x: float = sk + (w - sk) * k
			draw_line(Vector2(x, 0), Vector2(x - sk, h), Color(0, 0, 0, 0.5), 2.0)
		draw_polyline(PackedVector2Array([Vector2(sk, 0), Vector2(w, 0), Vector2(w - sk, h), Vector2(0, h), Vector2(sk, 0)]),
			Color(1, 1, 1, 0.5 + flash), 2.0)
		# minuterie du nitro parfait
		if level == 1:
			var ty := h + 8.0
			var tw := w * 0.6
			var tx := (w - tw) * 0.5
			var span := 1.7
			draw_rect(Rect2(tx, ty, tw, 8), Color(0, 0, 0, 0.6))
			draw_rect(Rect2(tx + tw * window.x / span, ty, tw * (window.y - window.x) / span, 8), Color("#29d4ff"))
			var cx := tx + tw * clampf(nitro_t / span, 0.0, 1.0)
			draw_rect(Rect2(cx - 2, ty - 4, 4, 16), Color.WHITE)


var race
var root: Control
var pos_lbl: Label
var dist_lbl: Label
var speed_lbl: Label
var timer_lbl: Label
var td_lbl: Label
var mode_lbl: Label
var nitro_bar: NitroBar
var popups: VBoxContainer
var big_lbl: Label
var big_sub: Label
var speedlines: ColorRect
var vignette: ColorRect
var markers: Array[Label] = []
var pause_layer: Control
var results_layer: Control
var _big_t := 0.0
var _flash := 0.0


func setup(p_race) -> void:
	race = p_race
	layer = 5
	root = Control.new()
	root.theme = UI.theme()
	UI.full_rect(root)
	root.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(root)
	# effets plein écran
	speedlines = ColorRect.new()
	UI.full_rect(speedlines)
	speedlines.mouse_filter = Control.MOUSE_FILTER_IGNORE
	var sm := ShaderMaterial.new()
	sm.shader = load("res://shaders/speedlines.gdshader")
	sm.set_shader_parameter("intensity", 0.0)
	sm.set_shader_parameter("tint", Color.WHITE)
	speedlines.material = sm
	root.add_child(speedlines)
	vignette = ColorRect.new()
	UI.full_rect(vignette)
	vignette.mouse_filter = Control.MOUSE_FILTER_IGNORE
	var vm := ShaderMaterial.new()
	vm.shader = load("res://shaders/vignette.gdshader")
	vignette.material = vm
	root.add_child(vignette)
	var safe := UI.safe_margins()
	var ml := maxf(16.0, safe.x + 8.0)
	var mr := maxf(16.0, safe.z + 8.0)
	# --- haut gauche ---
	var tl := UI.hbox(8)
	tl.position = Vector2(ml, 14)
	root.add_child(tl)
	var pause_btn := TextureButton.new()
	pause_btn.texture_normal = load("res://assets/ui/btn_pause.png")
	pause_btn.ignore_texture_size = true
	pause_btn.stretch_mode = TextureButton.STRETCH_KEEP_ASPECT_CENTERED
	pause_btn.custom_minimum_size = Vector2(58, 58)
	pause_btn.pressed.connect(func(): pause_requested.emit())
	tl.add_child(pause_btn)
	var stack := UI.vbox(2)
	tl.add_child(stack)
	var row1 := UI.panel(Color(0.02, 0.01, 0.06, 0.75), UI.SKEW, Color(0, 0, 0, 0), 0, 6)
	var r1 := UI.hbox(10)
	row1.add_child(r1)
	r1.add_child(UI.label("POS.", 18, UI.WHITE, "bold"))
	pos_lbl = UI.label("6/6", 26, UI.WHITE, "black")
	pos_lbl.custom_minimum_size.x = 70
	r1.add_child(pos_lbl)
	stack.add_child(row1)
	var row2 := UI.panel(Color(0.02, 0.01, 0.06, 0.75), UI.SKEW, Color(0, 0, 0, 0), 0, 6)
	var r2 := UI.hbox(10)
	row2.add_child(r2)
	r2.add_child(UI.label("DIST.", 18, UI.WHITE, "bold"))
	dist_lbl = UI.label("0%", 26, UI.WHITE, "black")
	dist_lbl.custom_minimum_size.x = 70
	r2.add_child(dist_lbl)
	stack.add_child(row2)
	var row3 := UI.panel(Color(0, 0, 0, 0.85), UI.SKEW, Color(0, 0, 0, 0), 0, 5)
	td_lbl = UI.label("", 16, UI.WHITE, "title")
	row3.add_child(td_lbl)
	stack.add_child(row3)
	# --- haut centre : nitro ---
	nitro_bar = NitroBar.new()
	nitro_bar.custom_minimum_size = Vector2(420, 22)
	nitro_bar.size = Vector2(420, 22)
	nitro_bar.mouse_filter = Control.MOUSE_FILTER_IGNORE
	UI.place(nitro_bar, Control.PRESET_CENTER_TOP, Vector2(-210, 22), Vector2(420, 22))
	root.add_child(nitro_bar)
	mode_lbl = UI.outline(UI.label("", 22, UI.WHITE, "title", HORIZONTAL_ALIGNMENT_CENTER), Color(0, 0, 0, 0.8), 6)
	UI.place(mode_lbl, Control.PRESET_CENTER_TOP, Vector2(-200, 62), Vector2(400, 30))
	root.add_child(mode_lbl)
	# --- haut droite : vitesse + chrono ---
	var tr := UI.vbox(4)
	UI.place(tr, Control.PRESET_TOP_RIGHT, Vector2(-220 - mr, 12), Vector2(220, 100))
	tr.alignment = BoxContainer.ALIGNMENT_BEGIN
	root.add_child(tr)
	var sp := UI.panel(Color(0.02, 0.01, 0.06, 0.75), UI.SKEW, Color(0, 0, 0, 0), 0, 6)
	var sph := UI.hbox(8)
	sph.alignment = BoxContainer.ALIGNMENT_END
	sp.add_child(sph)
	sph.add_child(UI.label("KM/H", 16, UI.WHITE, "bold"))
	speed_lbl = UI.label("0", 48, UI.WHITE, "black", HORIZONTAL_ALIGNMENT_RIGHT)
	speed_lbl.custom_minimum_size.x = 110
	sph.add_child(speed_lbl)
	tr.add_child(sp)
	var tp := UI.panel(Color("#d0142a"), UI.SKEW, Color(0, 0, 0, 0), 0, 5)
	timer_lbl = UI.label("00:00.000", 26, UI.WHITE, "title", HORIZONTAL_ALIGNMENT_RIGHT)
	tp.add_child(timer_lbl)
	tr.add_child(tp)
	# --- cascades ---
	popups = UI.vbox(6)
	UI.place(popups, Control.PRESET_CENTER_RIGHT, Vector2(-330 - mr, -40), Vector2(330, 200))
	popups.alignment = BoxContainer.ALIGNMENT_END
	root.add_child(popups)
	# --- messages centraux ---
	big_lbl = UI.outline(UI.label("", 96, UI.WHITE, "black", HORIZONTAL_ALIGNMENT_CENTER), Color(0.25, 0.0, 0.45, 0.9), 14)
	UI.place(big_lbl, Control.PRESET_CENTER, Vector2(-500, -160), Vector2(1000, 130))
	big_lbl.pivot_offset = Vector2(500, 65)
	root.add_child(big_lbl)
	big_sub = UI.outline(UI.label("", 30, UI.YELLOW, "title", HORIZONTAL_ALIGNMENT_CENTER), Color(0, 0, 0, 0.9), 8)
	UI.place(big_sub, Control.PRESET_CENTER, Vector2(-500, -40), Vector2(1000, 40))
	root.add_child(big_sub)
	for i in 8:
		var m := UI.label("", 18, UI.WHITE, "black", HORIZONTAL_ALIGNMENT_CENTER)
		var st := StyleBoxFlat.new()
		st.bg_color = Color("#7b2cff")
		st.set_content_margin_all(3)
		st.content_margin_left = 7
		st.content_margin_right = 7
		m.add_theme_stylebox_override("normal", st)
		m.visible = false
		root.add_child(m)
		markers.append(m)


func set_touchdrive(on: bool) -> void:
	td_lbl.text = "TOUCHDRIVE  " + ("OUI" if on else "NON")


func update_hud(dt: float, p: Racer, n_racers: int, race_time: float, track_len: float) -> void:
	pos_lbl.text = "%d/%d" % [p.place, n_racers]
	dist_lbl.text = "%d%%" % int(clampf(p.s / track_len, 0.0, 1.0) * 100.0)
	speed_lbl.text = str(int(p.speed_kmh()))
	timer_lbl.text = CareerDB.format_time(race_time)
	nitro_bar.gauge = p.gauge
	nitro_bar.level = p.nitro_level
	nitro_bar.nitro_t = p.nitro_t
	nitro_bar.window = p.nitro_window()
	nitro_bar.flash = maxf(0.0, nitro_bar.flash - dt * 2.0)
	nitro_bar.queue_redraw()
	var sl: ShaderMaterial = speedlines.material
	var target := 0.0
	if p.nitro_level > 0:
		target = 0.6 + 0.2 * p.nitro_level
	elif p.v > p.vmax * 0.92:
		target = 0.25
	var cur_i = sl.get_shader_parameter("intensity")
	sl.set_shader_parameter("intensity", lerpf(float(cur_i) if cur_i != null else 0.0, target, 1.0 - exp(-4.0 * dt)))
	var tint := Color(1, 1, 1) if p.nitro_level < 2 else (Color(0.6, 0.9, 1.0) if p.nitro_level == 2 else Color(1.0, 0.6, 1.0))
	sl.set_shader_parameter("tint", tint)
	_flash = maxf(0.0, _flash - dt * 3.0)
	var vmat: ShaderMaterial = vignette.material
	vmat.set_shader_parameter("flash", Color(1, 1, 1, _flash * 0.6))
	vmat.set_shader_parameter("amount", 0.3 + (0.25 if p.nitro_level > 0 else 0.0))
	if _big_t > 0.0:
		_big_t -= dt
		if _big_t <= 0.0:
			var tw := create_tween()
			tw.tween_property(big_lbl, "modulate:a", 0.0, 0.25)
			tw.parallel().tween_property(big_sub, "modulate:a", 0.0, 0.25)


func flash(a: float = 1.0) -> void:
	_flash = a


func set_mode_text(t: String, col: Color = UI.WHITE) -> void:
	mode_lbl.text = t
	mode_lbl.add_theme_color_override("font_color", col)


func update_markers(cam: Camera3D, racers: Array, player: Racer) -> void:
	var k := 0
	for r in racers:
		if r == player or r.eliminated or k >= markers.size():
			continue
		var m := markers[k]
		var d: float = r.s - player.s
		var wp: Vector3 = r.model.global_position + Vector3.UP * 2.0
		if d > -10.0 and d < 160.0 and not cam.is_position_behind(wp):
			var sp := cam.unproject_position(wp)
			m.visible = true
			m.text = str(r.place)
			m.position = sp - m.size * 0.5
			var a := clampf(1.0 - d / 160.0, 0.35, 1.0)
			m.modulate = Color(1, 1, 1, a)
		else:
			m.visible = false
		k += 1
	while k < markers.size():
		markers[k].visible = false
		k += 1


func popup(text: String, sub: String = "", col: Color = UI.MAGENTA) -> void:
	var p := PanelContainer.new()
	p.add_theme_stylebox_override("panel", UI.box(Color(1, 1, 1, 0.95), UI.SKEW, Color(0, 0, 0, 0), 0, 0, 10))
	p.mouse_filter = Control.MOUSE_FILTER_IGNORE
	var h := UI.hbox(8)
	p.add_child(h)
	var accent := ColorRect.new()
	accent.color = col
	accent.custom_minimum_size = Vector2(8, 26)
	h.add_child(accent)
	h.add_child(UI.label(text, 24, UI.BLACK, "title"))
	if sub != "":
		h.add_child(UI.label(sub, 20, col.darkened(0.2), "title"))
	popups.add_child(p)
	p.modulate.a = 0.0
	p.position.x += 60
	var tw := p.create_tween()
	tw.tween_property(p, "modulate:a", 1.0, 0.12)
	tw.tween_interval(1.6)
	tw.tween_property(p, "modulate:a", 0.0, 0.35)
	tw.tween_callback(p.queue_free)
	if popups.get_child_count() > 4:
		popups.get_child(0).queue_free()


func big(text: String, sub: String = "", col: Color = UI.WHITE, dur: float = 1.2) -> void:
	big_lbl.text = text
	big_lbl.add_theme_color_override("font_color", col)
	big_sub.text = sub
	big_lbl.modulate.a = 1.0
	big_sub.modulate.a = 1.0
	big_lbl.scale = Vector2(1.6, 1.6)
	var tw := create_tween()
	tw.tween_property(big_lbl, "scale", Vector2.ONE, 0.18).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	_big_t = dur


# ---------------------------------------------------------------------------
# Pause
# ---------------------------------------------------------------------------

func show_pause() -> void:
	if pause_layer:
		pause_layer.visible = true
		return
	pause_layer = ColorRect.new()
	(pause_layer as ColorRect).color = Color(0.05, 0.0, 0.12, 0.75)
	UI.full_rect(pause_layer)
	root.add_child(pause_layer)
	var v := UI.vbox(16)
	UI.place(v, Control.PRESET_CENTER, Vector2(-180, -170), Vector2(360, 340))
	pause_layer.add_child(v)
	v.add_child(UI.outline(UI.label("PAUSE", 64, UI.WHITE, "black", HORIZONTAL_ALIGNMENT_CENTER)))
	var b1 := UI.button("REPRENDRE", "yellow", 28, Vector2(360, 58))
	b1.pressed.connect(func(): resume_requested.emit())
	v.add_child(b1)
	var b2 := UI.button("RECOMMENCER", "white", 26, Vector2(360, 54))
	b2.pressed.connect(func(): restart_requested.emit())
	v.add_child(b2)
	var b3 := UI.button("QUITTER LA COURSE", "dark", 24, Vector2(360, 54))
	b3.pressed.connect(func(): quit_requested.emit())
	v.add_child(b3)


func hide_pause() -> void:
	if pause_layer:
		pause_layer.visible = false


# ---------------------------------------------------------------------------
# Résultats
# ---------------------------------------------------------------------------

func show_results(res: Dictionary, rewards: Dictionary, table: Array) -> void:
	for c in [nitro_bar, popups, mode_lbl, speedlines]:
		c.visible = false
	for m in markers:
		m.visible = false
	results_layer = Control.new()
	UI.full_rect(results_layer)
	root.add_child(results_layer)
	var dim := ColorRect.new()
	dim.color = Color(0.03, 0.0, 0.08, 0.55)
	UI.full_rect(dim)
	results_layer.add_child(dim)
	var main := UI.vbox(10)
	main.position = Vector2(70, 60)
	main.size = Vector2(640, 520)
	results_layer.add_child(main)
	# bandeau position
	var top := UI.hbox(0)
	main.add_child(top)
	var pos_box := UI.panel(UI.MAGENTA, UI.SKEW, Color(0, 0, 0, 0), 0, 18)
	var pos_txt := "ÉLIMINÉ" if res.get("dnf", false) else _ordinal(int(res.position))
	pos_box.add_child(UI.label(pos_txt, 64 if pos_txt.length() < 6 else 40, UI.WHITE, "black"))
	top.add_child(pos_box)
	var tag := UI.vbox(4)
	top.add_child(tag)
	var t1 := UI.panel(UI.WHITE, UI.SKEW, Color(0, 0, 0, 0), 0, 8)
	t1.add_child(UI.label("RÉCOMPENSES DE COURSE", 24, UI.BLACK, "title"))
	tag.add_child(t1)
	var t2 := UI.panel(Color(0, 0, 0, 0.85), UI.SKEW, Color(0, 0, 0, 0), 0, 8)
	var t2h := UI.hbox(8)
	t2.add_child(t2h)
	t2h.add_child(UI.label("TON TEMPS", 22, UI.WHITE, "title"))
	t2h.add_child(UI.label(CareerDB.format_time(res.time), 22, UI.LIME, "title"))
	tag.add_child(t2)
	main.add_child(UI.spacer(0, 14))
	main.add_child(UI.shadow(UI.label("OBJECTIFS DE COURSE", 30, UI.WHITE, "title")))
	var ev: Dictionary = res.event
	for i in ev.objectives.size():
		var ok: bool = res.objectives_done[i]
		var row := UI.panel(Color(0, 0, 0, 0.75), UI.SKEW, Color(0, 0, 0, 0), 0, 6)
		var rh := UI.hbox(10)
		row.add_child(rh)
		var ic := UI.icon("res://assets/ui/icon_check.png" if ok else "res://assets/ui/icon_flag.png", 26)
		if not ok:
			ic.modulate = Color(1, 0.3, 0.3)
		rh.add_child(ic)
		rh.add_child(UI.label(CareerDB.objective_text(ev.objectives[i]), 22, UI.LIME if ok else UI.GREY, "title"))
		main.add_child(row)
	main.add_child(UI.spacer(0, 10))
	# récompenses
	var rw := UI.hbox(14)
	main.add_child(rw)
	rw.add_child(_reward_chip("res://assets/ui/icon_credits.png", "+" + Game.fmt_num(int(rewards.credits))))
	if int(rewards.get("tokens", 0)) > 0:
		rw.add_child(_reward_chip("res://assets/ui/icon_tokens.png", "+" + str(rewards.tokens)))
	rw.add_child(_reward_chip("res://assets/ui/icon_star.png", "+" + str(rewards.xp) + " XP"))
	for cid in rewards.bp:
		var car := CarsDB.get_car(cid)
		rw.add_child(_reward_chip("res://assets/ui/icon_blueprint.png", "PLAN x%d %s" % [rewards.bp[cid], car.model]))
	if rewards.get("flags_new", 0) > 0:
		rw.add_child(_reward_chip("res://assets/ui/icon_flag.png", "+%d DRAPEAU%s" % [rewards.flags_new, "X" if rewards.flags_new > 1 else ""]))
	if rewards.get("lp", 0) != 0:
		rw.add_child(_reward_chip("res://assets/ui/icon_trophy.png", "%+d PTS LIGUE" % rewards.lp))
	# stats
	var st: Dictionary = res.stats
	var stat_txt := "TAKEDOWNS %d   TONNEAUX %d   SAUTS %d   FRÔLEMENTS %d   NITROS PARFAITS %d   VITESSE MAX %d KM/H" % [
		st.takedowns, st.barrel_rolls, st.jumps, st.near_miss, st.perfect_nitro, int(st.top_speed)]
	main.add_child(UI.shadow(UI.label(stat_txt, 17, UI.WHITE, "bold")))
	# tableau complet (masqué)
	var tbl := UI.panel(Color(0.04, 0.01, 0.1, 0.92), Vector2.ZERO, UI.MAGENTA, 2, 14)
	tbl.position = Vector2(760, 60)
	tbl.size = Vector2(440, 420)
	tbl.visible = false
	results_layer.add_child(tbl)
	var tv := UI.vbox(6)
	tbl.add_child(tv)
	tv.add_child(UI.label("RÉSULTATS COMPLETS", 26, UI.YELLOW, "title"))
	for row_d in table:
		var h := UI.hbox(10)
		var c := UI.WHITE if not row_d.player else UI.LIME
		var pl := UI.label(str(row_d.place), 22, c, "black")
		pl.custom_minimum_size.x = 30
		h.add_child(pl)
		var nl := UI.label(row_d.name, 20, c, "bold")
		nl.custom_minimum_size.x = 150
		h.add_child(nl)
		var cl := UI.label(row_d.car, 16, UI.GREY, "body")
		cl.custom_minimum_size.x = 140
		h.add_child(cl)
		h.add_child(UI.label(row_d.time, 18, c, "bold"))
		tv.add_child(h)
	# boutons
	var bh := UI.hbox(16)
	UI.place(bh, Control.PRESET_BOTTOM_RIGHT, Vector2(-640, -96), Vector2(600, 70))
	bh.alignment = BoxContainer.ALIGNMENT_END
	results_layer.add_child(bh)
	var full := UI.button("RÉSULTATS COMPLETS", "white", 22, Vector2(260, 60))
	full.pressed.connect(func(): tbl.visible = not tbl.visible)
	bh.add_child(full)
	var nxt := UI.button("SUIVANT", "yellow", 30, Vector2(240, 64))
	nxt.pressed.connect(func(): next_requested.emit())
	bh.add_child(nxt)
	results_layer.modulate.a = 0.0
	var tw := create_tween()
	tw.tween_property(results_layer, "modulate:a", 1.0, 0.4)


func _reward_chip(icon_path: String, text: String) -> Control:
	var p := UI.panel(Color(0.08, 0.02, 0.2, 0.9), UI.SKEW, Color(1, 1, 1, 0.3), 2, 8)
	var h := UI.hbox(6)
	p.add_child(h)
	h.add_child(UI.icon(icon_path, 28))
	h.add_child(UI.label(text, 20, UI.WHITE, "title"))
	return p


static func _ordinal(n: int) -> String:
	return "1ER" if n == 1 else "%dE" % n
