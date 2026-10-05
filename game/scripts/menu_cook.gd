class_name CookMenu
extends Control
## Cuisine à une marmite : liste des recettes, ingrédients, mini-jeu de cuisson (arrêter l'aiguille
## dans la zone dorée = « Délicieux ! » ×2), cuisson automatique une fois la recette maîtrisée.

signal closed

var ui: UI
var main: Node
var box: Control
var grid: GridContainer
var d_name: Label
var d_eff: Label
var d_icon: BagMenu.ItemCard
var ing_box: VBoxContainer
var mastery_l: Label
var cook_btn: GStyle.Pill
var auto_btn: GStyle.Pill
var back_btn: GStyle.Pill
var game: Gauge
var result_l: Label
var sel: = ""

const W: = 1280.0
const H: = 720.0
const MASTERY: = 3

## Jauge de cuisson : une aiguille parcourt la barre, il faut l'arrêter dans la zone dorée.
class Gauge extends Control:
	signal stopped(quality: int)
	var running: = false
	var t: = 0.0
	var pos: = 0.0
	var gold: = Vector2(0.55, 0.68)
	var ok: = Vector2(0.42, 0.8)
	var speed: = 0.42
	func _init() -> void :
		custom_minimum_size = Vector2(560, 120);mouse_filter = Control.MOUSE_FILTER_STOP
	func start() -> void :
		var c: = randf_range(0.45, 0.72)
		gold = Vector2(c - 0.07, c + 0.07);ok = Vector2(c - 0.2, c + 0.17)
		pos = 0.0;t = 0.0;running = true;visible = true
		queue_redraw()
	func stop() -> void :
		if not running: return
		running = false
		var q: = 0
		if pos >= gold.x and pos <= gold.y: q = 2
		elif pos >= ok.x and pos <= ok.y: q = 1
		stopped.emit(q)
		queue_redraw()
	func _gui_input(ev: InputEvent) -> void :
		if (ev is InputEventMouseButton and ev.pressed and ev.button_index == MOUSE_BUTTON_LEFT) or (ev is InputEventScreenTouch and ev.pressed):
			stop();accept_event()
	func _process(d: float) -> void :
		if not running: return
		t += d
		pos += d * speed * (1.0 + t * 0.55)
		if pos >= 1.0:
			pos = 1.0;stop()
		queue_redraw()
	func _draw() -> void :
		var bar: = Rect2(20, 50, size.x - 40, 26)
		draw_style_box(GStyle.sb(Color(0.12, 0.1, 0.12, 0.9), 13, Color(GStyle.GOLD, 0.6), 2), bar.grow(4))
		var x0: = bar.position.x; var w: = bar.size.x
		draw_rect(Rect2(x0, bar.position.y, w * ok.x, bar.size.y), Color(0.45, 0.6, 0.85, 0.55))
		draw_rect(Rect2(x0 + w * ok.x, bar.position.y, w * (ok.y - ok.x), bar.size.y), Color(1.0, 0.62, 0.25, 0.85))
		draw_rect(Rect2(x0 + w * gold.x, bar.position.y, w * (gold.y - gold.x), bar.size.y), Color(1.0, 0.86, 0.35))
		draw_rect(Rect2(x0 + w * ok.y, bar.position.y, w * (1.0 - ok.y), bar.size.y), Color(0.55, 0.18, 0.15, 0.85))
		var f: = get_theme_default_font()
		draw_string(f, Vector2(x0 + w * (gold.x + gold.y) * 0.5 - 30, bar.position.y - 10), "Parfait", HORIZONTAL_ALIGNMENT_LEFT, -1, 16, GStyle.GOLD_HI)
		draw_string(f, Vector2(x0 + w - 60, bar.position.y - 10), "Brûlé", HORIZONTAL_ALIGNMENT_LEFT, -1, 16, Color(1.0, 0.55, 0.5))
		var px: = x0 + w * pos
		draw_colored_polygon(PackedVector2Array([Vector2(px, bar.position.y - 2), Vector2(px - 11, bar.position.y - 20), Vector2(px + 11, bar.position.y - 20)]), Color.WHITE)
		draw_line(Vector2(px, bar.position.y - 2), Vector2(px, bar.end.y + 4), Color.WHITE, 3.0)
		var hint: = "Clique / touche / Espace pour arrêter la cuisson !" if running else ""
		var hw: = f.get_string_size(hint, HORIZONTAL_ALIGNMENT_LEFT, -1, 17).x
		draw_string(f, Vector2(size.x * 0.5 - hw * 0.5, bar.end.y + 34), hint, HORIZONTAL_ALIGNMENT_LEFT, -1, 17, GStyle.CREAM)

func setup(u: UI, m: Node) -> void :
	ui = u;main = m
	set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	mouse_filter = Control.MOUSE_FILTER_STOP
	visible = false
	add_child(GStyle.backdrop(true, 0.95))
	box = Control.new();box.size = Vector2(W, H);add_child(box)
	var head: = GStyle.Header.new("Cuisine", "Marmite • Recettes");head.position = Vector2(60, 26);head.size = Vector2(740, 70);box.add_child(head)
	var sc: = ScrollContainer.new();sc.position = Vector2(60, 120);sc.size = Vector2(760, 330)
	sc.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED;box.add_child(sc)
	grid = GridContainer.new();grid.columns = 6
	grid.add_theme_constant_override("h_separation", 14);grid.add_theme_constant_override("v_separation", 14);sc.add_child(grid)
	game = Gauge.new();game.position = Vector2(160, 470);game.size = Vector2(560, 120);game.visible = false;box.add_child(game)
	game.stopped.connect(_on_cooked)
	result_l = GStyle.label("", 30, GStyle.GOLD_HI, 5);result_l.position = Vector2(60, 455);result_l.size = Vector2(760, 60)
	result_l.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER;box.add_child(result_l)
	var panel: = Panel.new();panel.position = Vector2(840, 40);panel.size = Vector2(400, 620)
	panel.add_theme_stylebox_override("panel", GStyle.sb(Color(0.07, 0.08, 0.13, 0.78), 16, Color(GStyle.GOLD, 0.22), 1))
	box.add_child(panel)
	var top: = ColorRect.new();top.color = Color(GStyle.STAR_4, 0.85);top.size = Vector2(400, 150);top.mouse_filter = Control.MOUSE_FILTER_IGNORE
	top.name = "Top";panel.add_child(top)
	d_name = GStyle.label("", 24, Color.WHITE, 4);d_name.position = Vector2(22, 18);d_name.size = Vector2(240, 70)
	d_name.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART;panel.add_child(d_name)
	d_eff = GStyle.label("", 16, Color(1.0, 0.93, 0.75), 3);d_eff.position = Vector2(22, 92);d_eff.size = Vector2(240, 52)
	d_eff.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART;panel.add_child(d_eff)
	d_icon = BagMenu.ItemCard.new();d_icon.position = Vector2(270, 14);d_icon.size = Vector2(108, 132)
	d_icon.mouse_filter = Control.MOUSE_FILTER_IGNORE;panel.add_child(d_icon)
	var il: = GStyle.label("Ingrédients", 19, GStyle.GOLD_HI);il.position = Vector2(22, 164);panel.add_child(il)
	ing_box = VBoxContainer.new();ing_box.position = Vector2(22, 196);ing_box.size = Vector2(356, 220)
	ing_box.add_theme_constant_override("separation", 4);panel.add_child(ing_box)
	mastery_l = GStyle.label("", 16, Color(GStyle.CREAM, 0.8));mastery_l.position = Vector2(22, 430);mastery_l.size = Vector2(356, 48)
	mastery_l.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART;panel.add_child(mastery_l)
	cook_btn = GStyle.Pill.new("Cuisiner", "○", true, 300.0);cook_btn.position = Vector2(50, 488);panel.add_child(cook_btn)
	cook_btn.pressed.connect(_start_cook)
	auto_btn = GStyle.Pill.new("Cuisson auto", "◇", false, 300.0);auto_btn.position = Vector2(50, 550);panel.add_child(auto_btn)
	auto_btn.pressed.connect(_auto_cook)
	back_btn = GStyle.Pill.new("Retour", "✕", false, 200.0);back_btn.glyph_col = Color(0.6, 0.8, 1.0)
	back_btn.position = Vector2(60, 648);back_btn.pressed.connect(_back);box.add_child(back_btn)

func _back() -> void :
	if not game.running: closed.emit()

func layout(vs: Vector2) -> void :
	var sc: = minf(vs.x / W, vs.y / H)
	box.scale = Vector2(sc, sc)
	box.position = (vs - Vector2(W, H) * sc) * 0.5

func open() -> void :
	visible = true;game.visible = false;game.running = false;result_l.text = ""
	_rebuild()
	modulate.a = 0.0
	create_tween().tween_property(self, "modulate:a", 1.0, 0.18)

func close() -> void :
	game.running = false
	visible = false

func _process(_d: float) -> void :
	if visible and game.running and (Input.is_action_just_pressed("jump") or Input.is_action_just_pressed("interact")):
		game.stop()

func can_cook(id: String, n: = 1) -> bool:
	var ing: Dictionary = Items.RECIPES[id].ing
	for k in ing:
		if main.item_count(k) < int(ing[k]) * n: return false
	return true

func _rebuild() -> void :
	for c in grid.get_children(): c.queue_free()
	var first: = ""
	for id in Items.RECIPE_ORDER:
		var known: bool = main.recipes_known.has(id)
		var card: = BagMenu.ItemCard.new(id, Items.stars_of(id), main.item_count(id), Items.icon(id))
		card.dim = not known or not can_cook(id)
		if not known: card.label = "???"
		card.picked.connect(_pick)
		grid.add_child(card)
		if first == "" and known: first = id
	if sel == "": sel = first
	_pick(sel)

func _pick(id: String) -> void :
	if game.running: return
	sel = id
	for c in grid.get_children():
		if c is BagMenu.ItemCard:
			(c as BagMenu.ItemCard).selected = (c as BagMenu.ItemCard).id == id;c.queue_redraw()
	var known: bool = main.recipes_known.has(id)
	d_name.text = Items.name_of(id) if known else "Recette inconnue"
	d_eff.text = Items.effect_text(id) if known else "Achète cette recette chez un marchand ou gagne-la en quête."
	d_icon.id = id;d_icon.stars = Items.stars_of(id);d_icon.count = main.item_count(id);d_icon.icon = Items.icon(id);d_icon.dim = not known
	d_icon.queue_redraw()
	for c in ing_box.get_children(): c.queue_free()
	var ing: Dictionary = Items.RECIPES[id].ing
	for k in ing:
		var h: = HBoxContainer.new();h.add_theme_constant_override("separation", 10)
		var ic: = TextureRect.new();ic.texture = Items.icon(k);ic.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
		ic.custom_minimum_size = Vector2(38, 38);h.add_child(ic)
		var nl: = GStyle.label(Items.name_of(k), 18, GStyle.CREAM);nl.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		nl.vertical_alignment = VERTICAL_ALIGNMENT_CENTER;h.add_child(nl)
		var have: int = main.item_count(k)
		var cl: = GStyle.label("%d / %d" % [have, int(ing[k])], 18, Color(0.7, 1.0, 0.7) if have >= int(ing[k]) else Color(1.0, 0.5, 0.45), 3)
		cl.vertical_alignment = VERTICAL_ALIGNMENT_CENTER;h.add_child(cl)
		ing_box.add_child(h)
	var m: int = int(main.recipe_mastery.get(id, 0))
	mastery_l.text = ("Maîtrise : %d / %d" % [mini(m, MASTERY), MASTERY]) + ("  —  cuisson automatique débloquée" if m >= MASTERY else "  —  la cuisson auto se débloque à 3")
	cook_btn.disabled = not known or not can_cook(id)
	auto_btn.disabled = not known or m < MASTERY or not can_cook(id)
	auto_btn.text = "Cuisson auto ×1" if m >= MASTERY else "Cuisson auto (maîtrise 3)"

func _consume(id: String) -> void :
	var ing: Dictionary = Items.RECIPES[id].ing
	for k in ing: main.remove_item(k, int(ing[k]))

func _start_cook() -> void :
	if sel == "" or not can_cook(sel) or game.running: return
	_consume(sel)
	result_l.text = ""
	game.start()
	cook_btn.disabled = true;auto_btn.disabled = true
	main.audio.play("water", -10.0)

func _on_cooked(q: int) -> void :
	var n: int = [0, 1, 2][q]
	var msg: String = ["Raté… c'est brûlé.", "Réussi ! %s ×1" % Items.name_of(sel), "Délicieux ! %s ×2" % Items.name_of(sel)][q]
	result_l.text = msg
	result_l.add_theme_color_override("font_color", [Color(1.0, 0.5, 0.45), GStyle.CREAM_HI, GStyle.GOLD_HI][q])
	if n > 0:
		main.add_item(sel, n)
		main.recipe_mastery[sel] = int(main.recipe_mastery.get(sel, 0)) + 1
		main.dishes_cooked += n
		main.quests.on_cook(sel, n)
		main.audio.play("levelup" if q == 2 else "pickup", -4.0)
	else:
		main.audio.play("hurt", -10.0)
	get_tree().create_timer(0.9).timeout.connect( func():
		if visible:
			game.visible = false
			_rebuild())

func _auto_cook() -> void :
	if sel == "" or not can_cook(sel) or int(main.recipe_mastery.get(sel, 0)) < MASTERY: return
	_consume(sel)
	main.add_item(sel, 1)
	main.dishes_cooked += 1
	main.quests.on_cook(sel, 1)
	result_l.text = "%s ×1" % Items.name_of(sel)
	result_l.add_theme_color_override("font_color", GStyle.CREAM_HI)
	main.audio.play("pickup", -4.0)
	_rebuild()
