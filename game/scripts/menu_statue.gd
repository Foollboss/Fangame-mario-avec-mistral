class_name StatueMenu
extends Control
## Offrande aux Statues d'Aetheria : les Anémoculus font monter le niveau de résonance,
## chaque niveau augmente l'endurance maximale de l'équipe.

signal closed

var ui: UI
var main: Node
var box: Control
var dial: Dial
var have_l: Label
var level_l: Label
var need_l: Label
var stam_l: Label
var rewards_box: VBoxContainer
var levels_box: VBoxContainer
var offer_btn: GStyle.Pill

const W: = 1280.0
const H: = 720.0

## Cadran : anneau de progression du niveau en cours, losanges des 8 niveaux autour.
class Dial extends Control:
	var level: = 0
	var levels: = 8
	var frac: = 0.0
	var shown: = 0.0
	var icon: Texture2D
	var t: = 0.0
	func _init() -> void :
		custom_minimum_size = Vector2(360, 360);mouse_filter = Control.MOUSE_FILTER_IGNORE
	func _process(d: float) -> void :
		t += d
		shown = move_toward(shown, frac, d * 1.6) if shown <= frac else frac
		queue_redraw()
	func _draw() -> void :
		var c: = size * 0.5
		var glow: = 0.5 + 0.5 * sin(t * 1.6)
		for k in 6: draw_circle(c, 92 + k * 8, Color(0.45, 1.0, 0.8, 0.02 + 0.012 * glow), true, -1.0, true)
		draw_circle(c, 118, Color(0.05, 0.08, 0.1, 0.55), true, -1.0, true)
		draw_arc(c, 136, 0, TAU, 96, Color(GStyle.GOLD, 0.45), 1.5, true)
		draw_arc(c, 118, 0, TAU, 96, Color(1, 1, 1, 0.12), 10.0, true)
		if shown > 0.001:
			draw_arc(c, 118, - PI * 0.5, - PI * 0.5 + TAU * shown, 96, Color(0.5, 1.0, 0.82), 10.0, true)
		for k in levels:
			var a: = - PI * 0.5 + TAU * (k + 0.5) / levels
			var p: = c + Vector2(cos(a), sin(a)) * 152.0
			var on: = k < level
			GStyle.diamond(self, p, 9.0, GStyle.GOLD_HI if on else Color(1, 1, 1, 0.18))
			if k == level: GStyle.diamond(self, p, 5.0, Color(0.5, 1.0, 0.82, 0.6 + 0.4 * glow))
		if icon:
			var s: = Vector2(150, 150)
			draw_texture_rect(icon, Rect2(c - s * 0.5 - Vector2(0, 14), s), false)
		var f: = get_theme_default_font()
		var txt: = "Niveau %d" % level
		var w: = f.get_string_size(txt, HORIZONTAL_ALIGNMENT_LEFT, -1, 22).x
		draw_string_outline(f, c + Vector2(- w * 0.5, 84), txt, HORIZONTAL_ALIGNMENT_LEFT, -1, 22, 5, Color(0.03, 0.04, 0.1, 0.8))
		draw_string(f, c + Vector2(- w * 0.5, 84), txt, HORIZONTAL_ALIGNMENT_LEFT, -1, 22, GStyle.GOLD_HI)

func setup(u: UI, m: Node) -> void :
	ui = u;main = m
	set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	mouse_filter = Control.MOUSE_FILTER_STOP
	visible = false
	add_child(GStyle.backdrop(true, 0.92))
	box = Control.new();box.size = Vector2(W, H);add_child(box)
	var head: = GStyle.Header.new("Statue d'Aetheria", "Résonance des Anémoculus");head.position = Vector2(80, 34);head.size = Vector2(1120, 70)
	box.add_child(head)

	dial = Dial.new();dial.position = Vector2(150, 120);dial.size = Vector2(360, 360);dial.icon = ui.icons.get("ic_oculus")
	box.add_child(dial)
	need_l = GStyle.label("", 20, GStyle.CREAM, 4);need_l.position = Vector2(80, 488);need_l.size = Vector2(500, 30)
	need_l.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER;box.add_child(need_l)
	have_l = GStyle.label("", 18, Color(0.6, 1.0, 0.85), 3);have_l.position = Vector2(80, 522);have_l.size = Vector2(500, 28)
	have_l.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER;box.add_child(have_l)

	var panel: = Panel.new();panel.position = Vector2(640, 120);panel.size = Vector2(560, 470)
	panel.add_theme_stylebox_override("panel", GStyle.sb(Color(0.07, 0.08, 0.13, 0.72), 16, Color(GStyle.GOLD, 0.22), 1))
	box.add_child(panel)
	level_l = GStyle.label("", 22, GStyle.GOLD_HI, 3);level_l.position = Vector2(26, 18);level_l.size = Vector2(500, 30);panel.add_child(level_l)
	rewards_box = VBoxContainer.new();rewards_box.position = Vector2(22, 58);rewards_box.size = Vector2(516, 130)
	rewards_box.add_theme_constant_override("separation", 2);panel.add_child(rewards_box)
	var dv: = GStyle.Divider.new(516.0);dv.position = Vector2(22, 196);panel.add_child(dv)
	stam_l = GStyle.label("", 17, Color(GStyle.CREAM, 0.85));stam_l.position = Vector2(26, 214);stam_l.size = Vector2(500, 24);panel.add_child(stam_l)
	levels_box = VBoxContainer.new();levels_box.position = Vector2(22, 246);levels_box.size = Vector2(516, 210)
	levels_box.add_theme_constant_override("separation", 0);panel.add_child(levels_box)

	offer_btn = GStyle.Pill.new("Offrir les Anémoculus", "○", true, 330.0);offer_btn.position = Vector2(755, 612)
	offer_btn.pressed.connect(_offer);box.add_child(offer_btn)
	var back: = GStyle.Pill.new("Retour", "✕", false, 200.0);back.glyph_col = Color(0.6, 0.8, 1.0)
	back.position = Vector2(230, 612);back.pressed.connect( func(): closed.emit());box.add_child(back)

func layout(vs: Vector2) -> void :
	var sc: = minf(vs.x / W, vs.y / H)
	box.scale = Vector2(sc, sc)
	box.position = (vs - Vector2(W, H) * sc) * 0.5

func open() -> void :
	visible = true
	_refresh(true)
	modulate.a = 0.0
	create_tween().tween_property(self, "modulate:a", 1.0, 0.2)

func close() -> void :
	visible = false

func _refresh(instant: = false) -> void :
	var lv: int = main.statue_level
	var levels: Array = main.OCULUS_LEVELS
	var maxed: = lv >= levels.size()
	var need: int = 0 if maxed else int(levels[lv])
	var prog: int = main.statue_progress()
	dial.level = lv;dial.levels = levels.size()
	dial.frac = 1.0 if maxed else float(prog) / maxf(1.0, need)
	if instant: dial.shown = dial.frac
	need_l.text = "Résonance maximale atteinte" if maxed else "Offrandes pour le niveau %d : %d / %d" % [lv + 1, prog, need]
	have_l.text = "Anémoculus en votre possession : %d   (trouvés : %d / %d)" % [main.oculi_in_hand(), main.oculi_got, main.oculi.size()]
	level_l.text = "Résonance maximale" if maxed else "Récompenses du niveau %d" % (lv + 1)
	for c in rewards_box.get_children(): c.queue_free()
	if maxed:
		rewards_box.add_child(GStyle.stat_row("La statue rayonne de toute sa puissance.", "", true))
	else:
		var rw: Dictionary = main.statue_reward(lv + 1)
		rewards_box.add_child(GStyle.stat_row("Endurance maximale", "+%d" % int(main.STAMINA_PER_LEVEL), true))
		rewards_box.add_child(GStyle.stat_row("Expérience d'aventure", "+%d" % int(rw.xp)))
		rewards_box.add_child(GStyle.stat_row("Éclats d'Aether", "+%d" % int(rw.shards), true))
	stam_l.text = "Endurance maximale actuelle : %d" % int(main.party.stamina_max)
	for c in levels_box.get_children(): c.queue_free()
	var first: = maxi(0, mini(lv - 2, levels.size() - 5))
	for k in range(first, mini(first + 5, levels.size())):
		var done: = k < lv
		var txt: = "Niveau %d  —  %d Anémoculus" % [k + 1, int(levels[k])]
		var val: = "✓ Endurance +%d" % int(main.STAMINA_PER_LEVEL) if done else ("en cours" if k == lv else "")
		var row: = GStyle.stat_row(txt, val, k % 2 == 0)
		row.modulate = Color(1, 1, 1, 1.0 if k <= lv else 0.5)
		levels_box.add_child(row)
	offer_btn.disabled = maxed or main.oculi_in_hand() <= 0
	offer_btn.text = "Résonance maximale" if maxed else ("Offrir les Anémoculus" if main.oculi_in_hand() > 0 else "Aucun Anémoculus à offrir")

func _offer() -> void :
	var gained: int = main.offer_oculi()
	main.audio.play("levelup" if gained > 0 else "orb", -3.0)
	_refresh()
	if gained > 0:
		var tw: = dial.create_tween()
		dial.scale = Vector2.ONE;dial.pivot_offset = dial.size * 0.5
		tw.tween_property(dial, "scale", Vector2.ONE * 1.08, 0.12).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
		tw.tween_property(dial, "scale", Vector2.ONE, 0.25)
