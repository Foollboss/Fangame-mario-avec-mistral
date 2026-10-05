class_name MapUI
extends Control


var main: Node
var map_tex: Texture2D
var mini: TextureRect
var mini_mat: ShaderMaterial
var mini_overlay: Control
var mini_size: = 164.0
var mini_range: = 70.0
var big: Control
var big_map: TextureRect
var big_overlay: Control
var big_title: Control
var confirm: Panel
var confirm_label: Label
var pending_wp: = -1
var open: = false
var tex_ring: Texture2D
var clock: Label
var region: Label

const SHADER: = "\nshader_type canvas_item;\nuniform sampler2D map_tex : filter_linear;\nuniform vec2 center = vec2(0.5);\nuniform float span = 0.25;\nuniform float rot = 0.0;          // camera yaw: the map turns so that the view is always \"up\"\nvoid fragment() {\n\tvec2 d = UV - 0.5;\n\tfloat r = length(d);\n\tif (r > 0.5) discard;\n\tvec2 m = vec2(d.x * cos(rot) + d.y * sin(rot), -d.x * sin(rot) + d.y * cos(rot));\n\tvec4 c = texture(map_tex, clamp(center + m * span, vec2(0.0), vec2(1.0)));\n\tc.rgb *= 1.0 - smoothstep(0.38, 0.5, r) * 0.4;\n\tCOLOR = vec4(c.rgb, 0.9 * smoothstep(0.5, 0.485, r));\n}\n"
















func setup(m: Node) -> void :
	main = m


	set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	mouse_filter = Control.MOUSE_FILTER_IGNORE
	map_tex = load("res://ui/map.webp")

	mini = TextureRect.new();mini.texture = map_tex;mini.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	mini.size = Vector2(mini_size, mini_size);mini.position = Vector2(84, 14)
	mini_mat = ShaderMaterial.new(); var sh: = Shader.new();sh.code = SHADER;mini_mat.shader = sh
	mini_mat.set_shader_parameter("map_tex", map_tex)
	mini.material = mini_mat
	mini.mouse_filter = Control.MOUSE_FILTER_STOP
	mini.gui_input.connect(_on_mini_input)
	add_child(mini)
	mini_overlay = Control.new();mini_overlay.size = mini.size;mini_overlay.position = mini.position
	mini_overlay.mouse_filter = Control.MOUSE_FILTER_IGNORE
	mini_overlay.draw.connect(_draw_mini)
	add_child(mini_overlay)
	clock = main.ui._label("08:00", 16, Color(0.95, 0.97, 1.0));clock.position = Vector2(84 + mini_size - 30, 14 + mini_size - 18)
	add_child(clock)
	region = main.ui._label("", 16, Color(0.9, 0.95, 1.0, 0.85));region.position = Vector2(20, 14 + mini_size + 6)
	add_child(region)

	big = Control.new();big.set_anchors_preset(Control.PRESET_FULL_RECT);big.visible = false
	big.mouse_filter = Control.MOUSE_FILTER_STOP
	add_child(big)
	big.add_child(GStyle.backdrop(false))
	var frame: = Panel.new();frame.name = "Frame";frame.mouse_filter = Control.MOUSE_FILTER_IGNORE
	frame.add_theme_stylebox_override("panel", GStyle.sb(Color(0.93, 0.89, 0.8, 1.0), 6, GStyle.GOLD_DEEP, 3))
	big.add_child(frame)
	big_map = TextureRect.new();big_map.texture = map_tex;big_map.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	big_map.stretch_mode = TextureRect.STRETCH_SCALE;big_map.mouse_filter = Control.MOUSE_FILTER_STOP
	big_map.gui_input.connect(_on_big_input)
	big.add_child(big_map)
	big_overlay = Control.new();big_overlay.mouse_filter = Control.MOUSE_FILTER_IGNORE;big_overlay.draw.connect(_draw_big)
	big.add_child(big_overlay)
	big_title = GStyle.Header.new("Île d'Aetheria", "Carte du monde");big_title.size = Vector2(300, 70);big.add_child(big_title)
	var legend: Label = GStyle.label("◆ Téléporteur (touche pour voyager)\n● Statue d'Aetheria\n▲ Camp de monstres\n⬢ Sceau\n✦ Domaine\n× Boss\n★ Quête suivie\n■ Coffre", 16, GStyle.CREAM)
	legend.add_theme_constant_override("line_spacing", 8)
	legend.name = "Legend";big.add_child(legend)
	var close: = GStyle.Pill.new("Fermer (M)", "✕", false, 190.0);close.glyph_col = Color(0.6, 0.8, 1.0)
	close.name = "Close";close.pressed.connect(toggle);big.add_child(close)
	confirm = Panel.new();confirm.size = Vector2(520, 190);confirm.visible = false
	confirm.add_theme_stylebox_override("panel", GStyle.sb(Color(0.1, 0.12, 0.18, 0.97), 14, Color(GStyle.GOLD, 0.6), 2))
	big.add_child(confirm)
	confirm_label = GStyle.label("", 22, GStyle.CREAM);confirm_label.position = Vector2(20, 22);confirm_label.size = Vector2(480, 70)
	confirm_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER;confirm_label.autowrap_mode = TextServer.AUTOWRAP_WORD
	confirm.add_child(confirm_label)
	var no: = GStyle.Pill.new("Annuler", "✕", false, 220.0);no.glyph_col = Color(0.6, 0.8, 1.0);no.position = Vector2(30, 112)
	no.pressed.connect(_cancel_confirm);confirm.add_child(no)
	var yes: = GStyle.Pill.new("Voyager", "○", true, 220.0);yes.position = Vector2(270, 112)
	yes.pressed.connect(_do_teleport);confirm.add_child(yes)

func _cancel_confirm() -> void :
	confirm.visible = false
	pending_wp = -1

func layout(vs: Vector2) -> void :
	if big_map == null: return
	var s: = minf(vs.y - 80.0, vs.x - 80.0)
	big_map.size = Vector2(s, s);big_map.position = Vector2((vs.x - s) * 0.5, (vs.y - s) * 0.5)
	big_overlay.size = big_map.size;big_overlay.position = big_map.position
	big_title.position = Vector2(40, 24)
	var frame: Panel = big.get_node("Frame");frame.position = big_map.position - Vector2(8, 8);frame.size = big_map.size + Vector2(16, 16)
	var legend: Label = big.get_node("Legend");legend.position = Vector2(40, 130)
	legend.visible = big_map.position.x > 300.0
	var close: Button = big.get_node("Close");close.position = Vector2(vs.x - 220, vs.y - 74)
	confirm.position = (vs - confirm.size) * 0.5

func toggle() -> void :
	open = not open
	big.visible = open
	confirm.visible = false
	if main.audio: main.audio.play("click", -6.0)
	if open:
		big_overlay.queue_redraw()

		main.ui.release_touch()
		if main.party: main.party.input_vec = Vector2.ZERO;main.party.sprint_held = false
	main.set_menu_mouse(open)

func _on_mini_input(ev: InputEvent) -> void :
	if (ev is InputEventMouseButton and ev.pressed) or (ev is InputEventScreenTouch and ev.pressed):
		if main.dungeon: return
		toggle()


func set_domain_mode(on: bool, title: String) -> void :
	mini.visible = not on
	mini_overlay.visible = not on
	if on: region.text = title

func _process(_delta: float) -> void :
	if main == null or main.party == null: return
	var p: Vector3 = main.party.global_position
	mini_mat.set_shader_parameter("center", _uv(p))
	mini_mat.set_shader_parameter("span", mini_range * 2.0 / World.SIZE)
	mini_mat.set_shader_parameter("rot", main.rig.yaw)
	mini_overlay.queue_redraw()
	if open: big_overlay.queue_redraw()
	clock.text = main.daynight.clock_text() if main.daynight else ""

func _uv(p: Vector3) -> Vector2:
	return Vector2((p.x + World.HALF) / World.SIZE, (p.z + World.HALF) / World.SIZE)



func _markers(full: bool) -> Array:
	var out: = []
	var w: World = main.world
	for i in w.waypoints.size():
		var on: bool = main.waypoint_unlocked(i)
		out.append([w.waypoints[i].pos, "wp", Color(0.45, 0.8, 1.0) if on else Color(0.6, 0.62, 0.7), w.waypoints[i].name if full else "", i])
	for s in w.statues:
		out.append([s, "statue", Color(0.55, 0.95, 1.0), "", -1])
	for i in w.camps.size():
		if not main.camp_cleared(i):
			out.append([w.camps[i].pos, "camp", Color(1.0, 0.4, 0.35), "", -1])
	for sl in main.seals:
		if not sl.active:
			out.append([sl.global_position, "seal", Color(0.85, 0.6, 1.0), "", -1])
	if main.treasure_map:
		for ch in main.chests:
			if not ch.opened: out.append([ch.pos, "chest", Color(1.0, 0.85, 0.4), "", -1])

	for dm in w.domains:
		var ok: bool = main.rank >= int(dm.rank)
		var lbl: = ("%s (Rang %d)" % [dm.name, int(dm.rank)]) if full else ""
		out.append([dm.pos, "domain", Color(1.0, 0.8, 0.4) if ok else Color(0.65, 0.62, 0.7), lbl, -1])
	for id in main.world_bosses:
		var alive_b: bool = is_instance_valid(main.world_bosses[id].node)
		out.append([w.boss_spots[id], "boss", Color(1.0, 0.35, 0.3) if alive_b else Color(0.55, 0.5, 0.5), "", -1])
	for cp in w.cook_spots:
		out.append([cp, "cook", Color(1.0, 0.7, 0.35), "", -1])
	for sid in Shops.DEFS:
		var sp: Vector3 = main.npc_pos(Shops.DEFS[sid].owner)
		if sp != Vector3.INF: out.append([sp, "shop", Color(1.0, 0.86, 0.4), "", -1])
	if full:
		for vv in w.villages: out.append([(vv.pos as Vector3) + Vector3(0, 0, -30), "text", Color(1.0, 0.95, 0.8), vv.name, -1])
		out.append([w.village, "text", Color(1, 1, 1), "Brise-Marée", -1])
		out.append([w.lake, "text", Color(0.8, 0.92, 1), "Lac Miroir", -1])
		out.append([w.summit, "text", Color(0.92, 0.96, 1), "Pic Givré", -1])
		out.append([w.plateau + Vector3(0, 0, 32), "text", Color(0.8, 1.0, 0.95), "Hauts Plateaux Azur", -1])
		out.append([Vector3(150, 0, -10), "text", Color(1.0, 0.85, 0.6), "Forêt d'Automne", -1])
		out.append([Vector3(-150, 0, 60), "text", Color(1.0, 0.8, 0.9), "Vallée des Cerisiers", -1])
		out.append([Vector3(-40, 0, -85), "text", Color(0.85, 1.0, 0.8), "Prairie des Échos", -1])
		out.append([Vector3(-235, 0, 222), "text", Color(0.7, 1.0, 0.75), "Marais d'Émeraude", -1])
		out.append([Vector3(255, 0, 300), "text", Color(1.0, 0.7, 0.55), "Terres de Braise", -1])
		out.append([Vector3(-240, 0, -205), "text", Color(0.85, 0.78, 1.0), "Falaises de l'Orage", -1])
	for id in main.quests.active_list():
		var t: Vector3 = main.quests.target(id)
		if t != Vector3.INF:
			out.append([t, "quest", Color(1.0, 0.82, 0.3) if id == "main" else Color(0.5, 0.85, 1.0), "", -1])
	return out

func _icon(ci: CanvasItem, c: Vector2, kind: String, col: Color, s: float) -> void :
	var dark: = Color(0.05, 0.06, 0.12, 0.9)
	match kind:
		"wp":
			var pts: = PackedVector2Array([c + Vector2(0, - s), c + Vector2(s * 0.7, 0), c + Vector2(0, s), c + Vector2( - s * 0.7, 0)])
			ci.draw_colored_polygon(pts, dark);ci.draw_colored_polygon(_scale(pts, c, 0.72), col)
		"statue":
			ci.draw_circle(c, s * 0.75, dark);ci.draw_circle(c, s * 0.55, col)
		"camp":
			var t: = PackedVector2Array([c + Vector2(0, - s * 0.8), c + Vector2(s * 0.8, s * 0.6), c + Vector2( - s * 0.8, s * 0.6)])
			ci.draw_colored_polygon(t, dark);ci.draw_colored_polygon(_scale(t, c, 0.7), col)
		"seal":
			var hx: = PackedVector2Array()
			for k in 6: hx.append(c + Vector2(cos(TAU * k / 6.0), sin(TAU * k / 6.0)) * s * 0.75)
			ci.draw_colored_polygon(hx, dark);ci.draw_colored_polygon(_scale(hx, c, 0.7), col)
		"chest":
			ci.draw_rect(Rect2(c - Vector2(s, s) * 0.55, Vector2(s, s) * 1.1), dark);ci.draw_rect(Rect2(c - Vector2(s, s) * 0.4, Vector2(s, s) * 0.8), col)
		"domain":
			ci.draw_circle(c, s * 0.85, dark)
			ci.draw_arc(c, s * 0.62, 0.0, TAU, 20, col, s * 0.28, true)
			ci.draw_circle(c, s * 0.22, col)
		"boss":
			var sk: = PackedVector2Array([c + Vector2( - s * 0.75, - s * 0.15), c + Vector2( - s * 0.5, - s * 0.8), c + Vector2( - s * 0.2, - s * 0.35), 
				c + Vector2(0, - s * 0.9), c + Vector2(s * 0.2, - s * 0.35), c + Vector2(s * 0.5, - s * 0.8), c + Vector2(s * 0.75, - s * 0.15), 
				c + Vector2(s * 0.6, s * 0.7), c + Vector2( - s * 0.6, s * 0.7)])
			ci.draw_colored_polygon(_scale(sk, c, 1.25), dark);ci.draw_colored_polygon(sk, col)
		"shop":
			ci.draw_circle(c, s * 0.7, dark);ci.draw_circle(c, s * 0.52, col)
			ci.draw_circle(c, s * 0.24, col.darkened(0.35))
		"cook":
			ci.draw_circle(c, s * 0.7, dark)
			var pot: = PackedVector2Array()
			for k in 9:
				var a2: = PI * k / 8.0
				pot.append(c + Vector2(cos(a2) * s * 0.5, sin(a2) * s * 0.45))
			pot.append(c + Vector2( - s * 0.5, - s * 0.05))
			ci.draw_colored_polygon(pot, col)
			ci.draw_line(c + Vector2( - s * 0.15, - s * 0.25), c + Vector2( - s * 0.05, - s * 0.55), col, 2.0)
			ci.draw_line(c + Vector2(s * 0.15, - s * 0.25), c + Vector2(s * 0.25, - s * 0.55), col, 2.0)
		"quest":
			var st: = PackedVector2Array()
			for k in 10:
				var r: = s * (1.0 if k % 2 == 0 else 0.45)
				var a: = - PI * 0.5 + TAU * k / 10.0
				st.append(c + Vector2(cos(a), sin(a)) * r)
			ci.draw_colored_polygon(_scale(st, c, 1.25), dark);ci.draw_colored_polygon(st, col)

func _scale(pts: PackedVector2Array, c: Vector2, k: float) -> PackedVector2Array:
	var out: = PackedVector2Array()
	for p in pts: out.append(c + (p - c) * k)
	return out

func _player_arrow(ci: CanvasItem, c: Vector2, yaw: float, s: float) -> void :

	var f: = Vector2(sin(yaw), cos(yaw))
	var r: = Vector2( - f.y, f.x)
	var pts: = PackedVector2Array([c + f * s, c - f * s * 0.6 + r * s * 0.65, c - f * s * 0.25, c - f * s * 0.6 - r * s * 0.65])
	ci.draw_colored_polygon(pts, Color(0.05, 0.06, 0.12))
	ci.draw_colored_polygon(_scale(pts, c + f * s * 0.1, 0.72), Color(1.0, 0.95, 0.7))

func _draw_mini() -> void :
	var ci: = mini_overlay
	var ctr: = mini.size * 0.5
	var rad: = mini_size * 0.5
	var p: Vector3 = main.party.global_position
	var yaw: float = main.rig.yaw
	var cs: = cos(yaw); var sn: = sin(yaw)

	var cone: = PackedVector2Array([ctr])
	for k in 9:
		var a: = -0.5 + k / 8.0
		cone.append(ctr + Vector2(0, -1).rotated(a) * rad * 0.62)
	ci.draw_colored_polygon(cone, Color(1, 1, 1, 0.14))
	for m in _markers(false):
		var mp: Vector3 = m[0]
		var dm: = Vector2(mp.x - p.x, mp.z - p.z) / mini_range * rad
		var d: = Vector2(dm.x * cs - dm.y * sn, dm.x * sn + dm.y * cs)
		var kind: String = m[1]
		if d.length() > rad - 8.0:
			if kind != "quest": continue
			d = d.normalized() * (rad - 10.0)
		_icon(ci, ctr + d, kind, m[2], 7.0 if kind != "quest" else 9.0)
	_player_arrow(ci, ctr, main.party.visual.rotation.y - yaw, 10.0)
	ci.draw_arc(ctr, rad - 1.0, 0, TAU, 72, Color(0.05, 0.06, 0.12, 0.55), 4.0, true)
	ci.draw_arc(ctr, rad - 3.0, 0, TAU, 72, Color(1.0, 0.93, 0.75, 0.9), 2.0, true)

	var nd: = Vector2(0, -1)
	var npos: = ctr + Vector2(nd.x * cs - nd.y * sn, nd.x * sn + nd.y * cs) * (rad - 2.0)
	ci.draw_circle(npos, 10.0, Color(0.06, 0.07, 0.14, 0.9), true, -1.0, true)
	ci.draw_arc(npos, 10.0, 0, TAU, 24, Color(1.0, 0.9, 0.65), 1.5, true)
	ci.draw_string(ThemeDB.fallback_font, npos + Vector2(-5, 5), "N", HORIZONTAL_ALIGNMENT_LEFT, -1, 14, Color(1, 0.95, 0.8))

	var night: bool = main.daynight.is_night() if main.daynight else false
	var ip: = Vector2(rad * 2.0 - 40, rad * 2.0 - 10)
	if night:
		ci.draw_circle(ip, 6.0, Color(0.85, 0.9, 1.0), true, -1.0, true)
		ci.draw_circle(ip + Vector2(3, -2), 5.5, Color(0.08, 0.1, 0.2), true, -1.0, true)
	else:
		ci.draw_circle(ip, 4.5, Color(1.0, 0.85, 0.4), true, -1.0, true)
		for k in 8:
			var a2: = k * TAU / 8.0
			ci.draw_line(ip + Vector2(cos(a2), sin(a2)) * 6.5, ip + Vector2(cos(a2), sin(a2)) * 9.0, Color(1.0, 0.85, 0.4), 1.5, true)

func _to_big(p: Vector3) -> Vector2:
	return _uv(p) * big_map.size

func _draw_big() -> void :
	var ci: = big_overlay
	for m in _markers(true):
		var c: = _to_big(m[0])
		var kind: String = m[1]
		if kind == "text":
			var t: String = m[3]
			ci.draw_string_outline(ThemeDB.fallback_font, c - Vector2(t.length() * 4.5, 0), t, HORIZONTAL_ALIGNMENT_LEFT, -1, 18, 5, Color(0.05, 0.06, 0.12, 0.8))
			ci.draw_string(ThemeDB.fallback_font, c - Vector2(t.length() * 4.5, 0), t, HORIZONTAL_ALIGNMENT_LEFT, -1, 18, m[2])
			continue
		_icon(ci, c, kind, m[2], 12.0 if kind != "quest" else 14.0)
		if kind == "wp" and (m[3] as String) != "":
			var t2: String = m[3]
			ci.draw_string_outline(ThemeDB.fallback_font, c + Vector2(12, 5), t2, HORIZONTAL_ALIGNMENT_LEFT, -1, 15, 4, Color(0.05, 0.06, 0.12, 0.8))
			ci.draw_string(ThemeDB.fallback_font, c + Vector2(12, 5), t2, HORIZONTAL_ALIGNMENT_LEFT, -1, 15, m[2])
	_player_arrow(ci, _to_big(main.party.global_position), main.party.visual.rotation.y, 14.0)

func _on_big_input(ev: InputEvent) -> void :
	var pressed: bool = (ev is InputEventMouseButton and ev.pressed and ev.button_index == MOUSE_BUTTON_LEFT) or (ev is InputEventScreenTouch and ev.pressed)
	if not pressed: return
	var pos: Vector2 = ev.position
	var w: World = main.world
	for i in w.waypoints.size():
		if _to_big(w.waypoints[i].pos).distance_to(pos) < 22.0:
			if main.waypoint_unlocked(i):
				pending_wp = i
				confirm_label.text = "Se téléporter à « %s » ?" % w.waypoints[i].name
			else:
				pending_wp = -1
				confirm_label.text = "Ce téléporteur n'est pas encore activé.\nApproche-toi de lui pour l'activer."
			confirm.visible = true
			(confirm.get_child(1) as Button).visible = pending_wp >= 0
			return

func _do_teleport() -> void :
	confirm.visible = false
	if pending_wp >= 0:
		main.teleport(pending_wp)
		pending_wp = -1
		toggle()
