class_name ShopMenu
extends Control
## Boutique : grille des articles (prix en Mora), fiche détaillée, quantité et achat.

signal closed

var ui: UI
var main: Node
var box: Control
var head: GStyle.Header
var grid: GridContainer
var mora_l: Label
var d_name: Label
var d_stars: Label
var d_desc: Label
var d_icon: BagMenu.ItemCard
var qty_l: Label
var total_l: Label
var buy_btn: GStyle.Pill
var qty_row: HBoxContainer
var shop_id: = ""
var sel: = ""
var sel_recipe: = false
var qty: = 1

const W: = 1280.0
const H: = 720.0

func setup(u: UI, m: Node) -> void :
	ui = u;main = m
	set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	mouse_filter = Control.MOUSE_FILTER_STOP
	visible = false
	add_child(GStyle.backdrop(false, 0.95))
	box = Control.new();box.size = Vector2(W, H);add_child(box)
	head = GStyle.Header.new("Boutique", "");head.position = Vector2(60, 26);head.size = Vector2(740, 70);box.add_child(head)
	mora_l = BagMenu.mora_chip(box, Vector2(610, 30))
	var sc: = ScrollContainer.new();sc.position = Vector2(60, 120);sc.size = Vector2(760, 510)
	sc.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED;box.add_child(sc)
	grid = GridContainer.new();grid.columns = 6
	grid.add_theme_constant_override("h_separation", 14);grid.add_theme_constant_override("v_separation", 14);sc.add_child(grid)
	var panel: = Panel.new();panel.position = Vector2(840, 40);panel.size = Vector2(400, 620)
	panel.add_theme_stylebox_override("panel", GStyle.sb(Color(0.07, 0.08, 0.13, 0.78), 16, Color(GStyle.GOLD, 0.22), 1))
	box.add_child(panel)
	var top: = ColorRect.new();top.color = Color(GStyle.STAR_3, 0.85);top.size = Vector2(400, 150);top.mouse_filter = Control.MOUSE_FILTER_IGNORE
	top.name = "Top";panel.add_child(top)
	d_name = GStyle.label("", 24, Color.WHITE, 4);d_name.position = Vector2(22, 18);d_name.size = Vector2(240, 70)
	d_name.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART;panel.add_child(d_name)
	d_stars = GStyle.label("", 20, Color("ffd36b"), 3);d_stars.position = Vector2(22, 100);panel.add_child(d_stars)
	d_icon = BagMenu.ItemCard.new();d_icon.position = Vector2(270, 14);d_icon.size = Vector2(108, 132)
	d_icon.mouse_filter = Control.MOUSE_FILTER_IGNORE;panel.add_child(d_icon)
	d_desc = GStyle.label("", 17, GStyle.CREAM);d_desc.position = Vector2(22, 168);d_desc.size = Vector2(356, 260)
	d_desc.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART;panel.add_child(d_desc)
	qty_row = HBoxContainer.new();qty_row.position = Vector2(40, 440);qty_row.add_theme_constant_override("separation", 10);panel.add_child(qty_row)
	for spec in [["−", -1], ["+", 1], ["Max", 99]]:
		var b: = Button.new();b.text = spec[0];b.custom_minimum_size = Vector2(70 if spec[1] == 99 else 52, 44)
		b.add_theme_font_size_override("font_size", 22)
		b.add_theme_stylebox_override("normal", GStyle.sb(Color(1, 1, 1, 0.1), 22, Color(GStyle.GOLD, 0.5), 1))
		b.add_theme_stylebox_override("hover", GStyle.sb(Color(1, 1, 1, 0.2), 22, GStyle.GOLD, 1))
		b.add_theme_stylebox_override("pressed", GStyle.sb(Color(1, 1, 1, 0.3), 22, GStyle.GOLD, 1))
		var d: int = spec[1]
		b.pressed.connect( func(): _set_qty(qty + d if d != 99 else _max_qty()))
		if spec[0] == "+":
			qty_l = GStyle.label("1", 24, GStyle.CREAM_HI, 3);qty_l.custom_minimum_size = Vector2(60, 44)
			qty_l.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER;qty_l.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
			qty_row.add_child(qty_l)
		qty_row.add_child(b)
	total_l = GStyle.label("", 19, GStyle.GOLD_HI, 3);total_l.position = Vector2(22, 496);total_l.size = Vector2(356, 30)
	total_l.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER;panel.add_child(total_l)
	buy_btn = GStyle.Pill.new("Acheter", "○", true, 260.0);buy_btn.position = Vector2(70, 548);panel.add_child(buy_btn)
	buy_btn.pressed.connect(_buy)
	var back: = GStyle.Pill.new("Retour", "✕", false, 200.0);back.glyph_col = Color(0.6, 0.8, 1.0)
	back.position = Vector2(60, 648);back.pressed.connect( func(): closed.emit());box.add_child(back)

func layout(vs: Vector2) -> void :
	var sc: = minf(vs.x / W, vs.y / H)
	box.scale = Vector2(sc, sc)
	box.position = (vs - Vector2(W, H) * sc) * 0.5

func open(id: String) -> void :
	shop_id = id
	var d: Dictionary = Shops.DEFS[id]
	head.title = d.name;head.sub = String(main.npc_name(d.owner));head.queue_redraw()
	visible = true;sel = ""
	_rebuild()
	modulate.a = 0.0
	create_tween().tween_property(self, "modulate:a", 1.0, 0.18)

func close() -> void :
	visible = false

func _entries() -> Array:
	if not Shops.DEFS.has(shop_id): return []
	var d: Dictionary = Shops.DEFS[shop_id]
	var out: = []
	for r in d.recipes:
		if not main.recipes_known.has(r[0]): out.append([r[0], int(r[1]), true])
	for it in d.items: out.append([it[0], int(it[1]), false])
	return out

func _rebuild() -> void :
	mora_l.text = str(main.mora)
	for c in grid.get_children(): c.queue_free()
	var first: = []
	for e in _entries():
		var card: = BagMenu.ItemCard.new(e[0] + ("#r" if e[2] else ""), Items.stars_of(e[0]), 0, Items.icon(e[0]))
		card.label = "%d" % e[1]
		card.coin = true
		card.dim = main.mora < e[1]
		card.picked.connect(_pick)
		if e[2]: card.tooltip_text = "Recette"
		grid.add_child(card)
		if e[2]:
			var rb: = GStyle.label("Recette", 13, GStyle.INK);rb.position = Vector2(4, 4)
			rb.add_theme_stylebox_override("normal", GStyle.sb(GStyle.GOLD_HI, 6, Color(0, 0, 0, 0), 0, 4));card.add_child(rb)
		if first.is_empty(): first = e
	if sel == "" and not first.is_empty(): sel = first[0] + ("#r" if first[2] else "")
	_pick(sel)

func _price() -> int:
	var id: = sel.trim_suffix("#r")
	for e in _entries():
		if e[0] == id and e[2] == sel_recipe: return e[1]
	return 0

func _max_qty() -> int:
	if sel_recipe: return 1
	var p: = _price()
	return clampi(main.mora / maxi(p, 1), 1, 99)

func _set_qty(q: int) -> void :
	qty = clampi(q, 1, maxi(1, _max_qty()) if not sel_recipe else 1)
	qty_l.text = str(qty)
	var total: = _price() * qty
	total_l.text = "Total : %d Mora" % total
	buy_btn.disabled = main.mora < total or sel == ""
	total_l.add_theme_color_override("font_color", GStyle.GOLD_HI if main.mora >= total else Color(1.0, 0.5, 0.45))

func _pick(key: String) -> void :
	sel = key
	sel_recipe = key.ends_with("#r")
	var id: = key.trim_suffix("#r")
	for c in grid.get_children():
		if c is BagMenu.ItemCard:
			(c as BagMenu.ItemCard).selected = (c as BagMenu.ItemCard).id == key;c.queue_redraw()
	if id == "" or not Items.DEFS.has(id):
		d_name.text = "";d_desc.text = "Rien à vendre pour l'instant.";buy_btn.disabled = true;qty_row.visible = false
		return
	var it: Dictionary = Items.DEFS[id]
	d_name.text = ("Recette : " if sel_recipe else "") + String(it.name)
	d_stars.text = "★".repeat(int(it.stars))
	var txt: String = it.desc
	if sel_recipe:
		var ing: Dictionary = Items.RECIPES[id].ing
		var parts: = []
		for k in ing: parts.append("%s ×%d" % [Items.name_of(k), ing[k]])
		txt = "Apprends à cuisiner ce plat à une marmite.\n\nIngrédients : " + ", ".join(parts) + "\n\nEffet : " + Items.effect_text(id)
	elif Items.cat_of(id) == "food":
		txt += "\n\nEffet : " + Items.effect_text(id)
	d_desc.text = txt + ("" if sel_recipe else "\n\nEn ta possession : %d" % main.item_count(id))
	d_icon.id = id;d_icon.stars = it.stars;d_icon.count = main.item_count(id);d_icon.icon = Items.icon(id);d_icon.queue_redraw()
	var top: ColorRect = d_name.get_parent().get_node("Top")
	top.color = Color({5: GStyle.STAR_5, 4: GStyle.STAR_4, 3: GStyle.STAR_3}.get(int(it.stars), Color("6f7a8a")), 0.85)
	qty_row.visible = not sel_recipe
	_set_qty(1)

func _buy() -> void :
	var id: = sel.trim_suffix("#r")
	var total: = _price() * qty
	if id == "" or main.mora < total: return
	main.mora -= total
	if sel_recipe:
		main.learn_recipe(id)
		sel = ""
	else:
		main.add_item(id, qty)
	main.audio.play("pickup", -2.0)
	main.quests.on_bought(id, qty)
	_rebuild()
