class_name BagMenu
extends Control
## Inventaire : grille de cartes d'objets (fond selon la rareté) + fiche détaillée à droite.

signal closed

var ui: UI
var main: Node
var box: Control
var grid: GridContainer
var d_name: Label
var d_stars: Label
var d_desc: Label
var d_icon: ItemCard
var use_btn: GStyle.Pill
var sel_id: = ""

const W: = 1280.0
const H: = 720.0

const ITEMS: = {
	"shards": {"name": "Éclats d'Aether", "stars": 4, "desc": "Fragments cristallisés de l'énergie qui irrigue l'île. Obtenus en libérant les camps et en vainquant les boss."},
	"crystals": {"name": "Cristaux d'Aether", "stars": 3, "desc": "Cristaux bleutés dispersés dans la nature. Chacun rapporte 5 éclats et un peu d'expérience."},
	"oculi": {"name": "Anémoculus", "stars": 4, "desc": "Œil de cristal où souffle le vent d'Aetheria. On les trouve en hauteur, sur les toits, au sommet des aiguilles rocheuses ou au-dessus de l'eau. Offre-les aux Statues d'Aetheria pour augmenter l'endurance maximale."},
	"food": {"name": "Tarte aux pommes solaires", "stars": 3, "desc": "Spécialité du Chef Tino. Rend 35 % de ses PV max au héros actif (touche H en exploration)."},
	"map": {"name": "Carte au trésor", "stars": 4, "desc": "Une vieille carte annotée : elle révèle l'emplacement des coffres sur la carte de l'île."},
}

## Carte d'objet façon inventaire d'action-RPG (fond dégradé selon la rareté, quantité en bas).
class ItemCard extends Control:
	signal picked(id: String)
	var id: = ""
	var stars: = 3
	var count: = 0
	var icon: Texture2D
	var selected: = false
	func _init(i: = "", s: = 3, c: = 0, ic: Texture2D = null) -> void :
		id = i;stars = s;count = c;icon = ic
		custom_minimum_size = Vector2(108, 132)
		mouse_filter = Control.MOUSE_FILTER_STOP;mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
	func _gui_input(ev: InputEvent) -> void :
		if (ev is InputEventMouseButton and ev.pressed and ev.button_index == MOUSE_BUTTON_LEFT) or (ev is InputEventScreenTouch and ev.pressed):
			picked.emit(id);accept_event()
	func _draw() -> void :
		var top: Color = {5: GStyle.STAR_5, 4: GStyle.STAR_4}.get(stars, GStyle.STAR_3)
		var r: = Rect2(Vector2.ZERO, size)
		var body: = Rect2(0, 0, size.x, size.y - 26)
		draw_style_box(GStyle.sb(top.darkened(0.25), 10), r)
		for k in 12:
			var t: = float(k) / 12.0
			draw_rect(Rect2(0, body.size.y * t, size.x, body.size.y / 12.0 + 1), top.darkened(0.25).lerp(top.lightened(0.12), t))
		draw_style_box(GStyle.sb(GStyle.CREAM, 0), Rect2(0, size.y - 26, size.x, 26))
		if icon:
			var s: = Vector2(70, 70)
			draw_texture_rect(icon, Rect2(Vector2(size.x * 0.5, body.size.y * 0.5) - s * 0.5, s), false)
		else:
			_draw_gem(Vector2(size.x * 0.5, body.size.y * 0.5))
		var f: = get_theme_default_font()
		var txt: = str(count)
		var w: = f.get_string_size(txt, HORIZONTAL_ALIGNMENT_LEFT, -1, 17).x
		draw_string(f, Vector2(size.x * 0.5 - w * 0.5, size.y - 7), txt, HORIZONTAL_ALIGNMENT_LEFT, -1, 17, GStyle.INK)
		var st: = "★".repeat(stars)
		draw_string(f, Vector2(8, body.size.y - 8), st, HORIZONTAL_ALIGNMENT_LEFT, -1, 13, Color("ffd36b"))
		if selected:
			draw_style_box(GStyle.sb(Color(0, 0, 0, 0), 10, Color.WHITE, 3), r.grow(2))
	func _draw_gem(c: Vector2) -> void :
		var col: = Color(0.55, 0.85, 1.0) if id != "shards" else Color(1.0, 0.86, 0.5)
		var pts: = PackedVector2Array([c + Vector2(0, -30), c + Vector2(18, -8), c + Vector2(12, 26), c + Vector2(-12, 26), c + Vector2(-18, -8)])
		draw_colored_polygon(pts, col)
		draw_colored_polygon(PackedVector2Array([c + Vector2(0, -30), c + Vector2(18, -8), c + Vector2(0, 0), c + Vector2(-18, -8)]), col.lightened(0.45))
		draw_polyline(pts + PackedVector2Array([pts[0]]), Color(1, 1, 1, 0.8), 2.0, true)

func setup(u: UI, m: Node) -> void :
	ui = u;main = m
	set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	mouse_filter = Control.MOUSE_FILTER_STOP
	visible = false
	add_child(GStyle.backdrop(false))
	box = Control.new();box.size = Vector2(W, H);add_child(box)
	var head: = GStyle.Header.new("Inventaire", "Objets • Nourriture • Trésors");head.position = Vector2(60, 34);head.size = Vector2(700, 70)
	box.add_child(head)
	grid = GridContainer.new();grid.columns = 6;grid.position = Vector2(60, 130)
	grid.add_theme_constant_override("h_separation", 14);grid.add_theme_constant_override("v_separation", 14)
	box.add_child(grid)
	var panel: = Panel.new();panel.position = Vector2(840, 40);panel.size = Vector2(400, 620)
	panel.add_theme_stylebox_override("panel", GStyle.sb(Color(0.07, 0.08, 0.13, 0.75), 16, Color(GStyle.GOLD, 0.22), 1))
	box.add_child(panel)
	var top: = ColorRect.new();top.color = Color(GStyle.STAR_4, 0.85);top.size = Vector2(400, 150);top.mouse_filter = Control.MOUSE_FILTER_IGNORE
	top.name = "Top";panel.add_child(top)
	d_name = GStyle.label("", 26, Color.WHITE, 4);d_name.position = Vector2(22, 18);d_name.size = Vector2(360, 34)
	d_name.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART;panel.add_child(d_name)
	d_stars = GStyle.label("", 20, Color("ffd36b"), 3);d_stars.position = Vector2(22, 100);panel.add_child(d_stars)
	d_icon = ItemCard.new();d_icon.position = Vector2(270, 14);d_icon.custom_minimum_size = Vector2(108, 132);d_icon.size = Vector2(108, 132)
	d_icon.mouse_filter = Control.MOUSE_FILTER_IGNORE;panel.add_child(d_icon)
	d_desc = GStyle.label("", 17, GStyle.CREAM);d_desc.position = Vector2(22, 172);d_desc.size = Vector2(356, 300)
	d_desc.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART;panel.add_child(d_desc)
	use_btn = GStyle.Pill.new("Utiliser", "○", true, 240.0);use_btn.position = Vector2(80, 548);panel.add_child(use_btn)
	use_btn.pressed.connect(_use)
	var back: = GStyle.Pill.new("Retour", "✕", false, 200.0);back.glyph_col = Color(0.6, 0.8, 1.0)
	back.position = Vector2(60, 648);back.pressed.connect( func(): closed.emit());box.add_child(back)

func layout(vs: Vector2) -> void :
	var sc: = minf(vs.x / W, vs.y / H)
	box.scale = Vector2(sc, sc)
	box.position = (vs - Vector2(W, H) * sc) * 0.5

func _count(id: String) -> int:
	match id:
		"shards": return int(main.shards)
		"crystals": return int(main.crystals_got)
		"oculi": return int(main.oculi_in_hand())
		"food": return int(main.food)
		"map": return 1 if main.treasure_map else 0
	return 0

func _icon(id: String) -> Texture2D:
	match id:
		"food": return ui.icons.get("ic_pie")
		"map": return ui.icons.get("ic_map")
		"oculi": return ui.icons.get("ic_oculus")
	return null

func open() -> void :
	visible = true
	_rebuild()
	modulate.a = 0.0
	create_tween().tween_property(self, "modulate:a", 1.0, 0.18)

func close() -> void :
	visible = false

func _rebuild() -> void :
	for c in grid.get_children(): c.queue_free()
	var first: = ""
	for id in ITEMS:
		var n: = _count(id)
		if n <= 0: continue
		var card: = ItemCard.new(id, ITEMS[id].stars, n, _icon(id))
		card.picked.connect(_pick)
		grid.add_child(card)
		if first == "": first = id
	if first == "":
		var l: = GStyle.label("Ton sac est vide pour l'instant. Explore l'île !", 20, Color(GStyle.CREAM, 0.7));grid.add_child(l)
	if sel_id == "" or _count(sel_id) <= 0: sel_id = first
	_pick(sel_id)

func _pick(id: String) -> void :
	sel_id = id
	for c in grid.get_children():
		if c is ItemCard:
			(c as ItemCard).selected = (c as ItemCard).id == id;c.queue_redraw()
	if id == "":
		d_name.text = "";d_desc.text = "";d_stars.text = "";use_btn.visible = false;d_icon.visible = false
		return
	var it: Dictionary = ITEMS[id]
	d_name.text = it.name
	d_stars.text = "★".repeat(int(it.stars))
	d_desc.text = it.desc + "\n\nQuantité : %d" % _count(id)
	d_icon.visible = true;d_icon.id = id;d_icon.stars = it.stars;d_icon.count = _count(id);d_icon.icon = _icon(id);d_icon.queue_redraw()
	var top: ColorRect = d_name.get_parent().get_node("Top")
	top.color = Color({5: GStyle.STAR_5, 4: GStyle.STAR_4}.get(int(it.stars), GStyle.STAR_3), 0.85)
	use_btn.visible = id == "food"
	use_btn.disabled = main.food <= 0

func _use() -> void :
	if sel_id == "food" and main.food > 0:
		if main.party.eat_food():
			main.food -= 1
			main.audio.play("heal", -4.0)
		else:
			ui.message("Le héros actif a déjà tous ses PV.", 1.6, Color(0.85, 0.9, 1.0))
		_rebuild()
