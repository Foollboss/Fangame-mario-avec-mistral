class_name PaimonMenu
extends Control
## Menu principal en jeu (Échap) : carte de profil à gauche, grille d'icônes rondes à droite.

signal action(what: String)

var ui: UI
var main: Node
var box: Control
var avatar: TextureRect
var name_l: Label
var rank_l: Label
var xp_bar: ProgressBar
var xp_l: Label
var stats_box: VBoxContainer
var time_l: Label

const W: = 1280.0
const H: = 720.0

func setup(u: UI, m: Node) -> void :
	ui = u;main = m
	set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	mouse_filter = Control.MOUSE_FILTER_STOP
	visible = false
	add_child(GStyle.backdrop(true))
	box = Control.new();box.size = Vector2(W, H);add_child(box)

	# --- carte de profil
	var card: = Panel.new();card.position = Vector2(56, 70);card.size = Vector2(440, 580)
	card.add_theme_stylebox_override("panel", GStyle.sb(Color(0.08, 0.1, 0.15, 0.55), 18, Color(GStyle.GOLD, 0.25), 1))
	box.add_child(card)
	var banner: = ColorRect.new();banner.position = Vector2(0, 0);banner.size = Vector2(440, 130)
	banner.color = Color(GStyle.GOLD, 0.12);banner.mouse_filter = Control.MOUSE_FILTER_IGNORE;card.add_child(banner)
	avatar = ui._portrait("kaelith", 112.0);avatar.position = Vector2(24, 70);card.add_child(avatar)
	name_l = GStyle.label("Voyageur d'Aetheria", 28, GStyle.CREAM, 4);name_l.position = Vector2(150, 84);card.add_child(name_l)
	rank_l = GStyle.label("Rang d'aventure 1", 18, GStyle.GOLD_HI);rank_l.position = Vector2(152, 124);card.add_child(rank_l)
	xp_bar = ProgressBar.new();xp_bar.show_percentage = false;xp_bar.position = Vector2(152, 154);xp_bar.size = Vector2(260, 8)
	xp_bar.add_theme_stylebox_override("background", GStyle.sb(Color(1, 1, 1, 0.12), 4))
	xp_bar.add_theme_stylebox_override("fill", GStyle.sb(GStyle.GOLD, 4))
	xp_bar.mouse_filter = Control.MOUSE_FILTER_IGNORE;card.add_child(xp_bar)
	xp_l = GStyle.label("0 / 150", 14, Color(GStyle.CREAM, 0.75));xp_l.position = Vector2(152, 164);card.add_child(xp_l)
	var dv: = GStyle.Divider.new(392.0);dv.position = Vector2(24, 200);card.add_child(dv)
	var sig: = GStyle.label("« Un monde, mille éléments, une seule aventure. »", 15, Color(GStyle.CREAM, 0.7))
	sig.position = Vector2(24, 220);sig.size = Vector2(392, 22);sig.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER;card.add_child(sig)
	stats_box = VBoxContainer.new();stats_box.position = Vector2(20, 256);stats_box.size = Vector2(400, 300)
	stats_box.add_theme_constant_override("separation", 2);card.add_child(stats_box)

	# --- grille d'icônes
	var head: = GStyle.Header.new("Menu", "Île d'Aetheria");head.position = Vector2(560, 64);head.size = Vector2(640, 70)
	box.add_child(head)
	time_l = GStyle.label("", 16, Color(GStyle.CREAM, 0.7));time_l.position = Vector2(1080, 76);box.add_child(time_l)
	var grid: = GridContainer.new();grid.columns = 4;grid.position = Vector2(560, 170)
	grid.add_theme_constant_override("h_separation", 34);grid.add_theme_constant_override("v_separation", 18)
	box.add_child(grid)
	var items: = [
		["Personnages", "ic_sword", "chars"], ["Inventaire", "ic_pie", "bag"], ["Carte", "ic_map", "map"], ["Quêtes", "ic_book", "quests"],
		["Heure", "ic_clock", "time"], ["Paramètres", "ic_gear", "settings"], ["Sauvegarder", "ic_quest", "save"], ["Quitter", "ic_dash", "quit"],
	]
	for it in items:
		var b: = GStyle.RoundIcon.new(it[0], ui.icons.get(it[1]))
		b.pressed.connect( func(): ui.main.audio.play("click", -6.0);action.emit(it[2]))
		grid.add_child(b)
	var resume: = GStyle.Pill.new("Reprendre l'aventure", "○", true, 330.0);resume.position = Vector2(870, 600)
	resume.pressed.connect( func(): action.emit("resume"))
	box.add_child(resume)
	var close: = Button.new();close.text = "✕";close.flat = true;close.position = Vector2(1200, 22);close.size = Vector2(48, 48)
	close.add_theme_font_size_override("font_size", 30);close.add_theme_color_override("font_color", GStyle.CREAM)
	close.add_theme_color_override("font_hover_color", GStyle.GOLD_HI)
	close.pressed.connect( func(): action.emit("resume"));box.add_child(close)
	var hint: = GStyle.label("Échap : fermer", 15, Color(GStyle.CREAM, 0.5));hint.position = Vector2(60, 668);box.add_child(hint)

func layout(vs: Vector2) -> void :
	var sc: = minf(vs.x / W, vs.y / H)
	box.scale = Vector2(sc, sc)
	box.position = (vs - Vector2(W, H) * sc) * 0.5

func open() -> void :
	visible = true
	var party: Party = main.party
	var who: String = party.ch().name.to_lower()
	if not ui.square_portraits.has(who): ui.square_portraits[who] = ui._square(ui.icons[who + "_portrait"])
	avatar.texture = ui.square_portraits[who]
	name_l.text = "Voyageur d'Aetheria"
	rank_l.text = "Rang d'aventure %d   •   Équipe : %s" % [main.rank, party.ch().name]
	xp_bar.max_value = main.xp_needed();xp_bar.value = main.xp
	xp_l.text = "Expérience  %d / %d" % [main.xp, main.xp_needed()] if main.rank < 30 else "Rang maximal atteint"
	for c in stats_box.get_children(): c.queue_free()
	var world_chests: Array = main.chests.filter( func(c): return not c.get("reward", false))
	var opened: = world_chests.filter( func(c): return c.opened).size()
	var mins: = int(main.t_play / 60.0)
	var rows: = [
		["Éclats d'Aether", str(main.shards)],
		["Cristaux d'Aether", "%d / %d" % [main.crystals_got, main.crystals.size()]],
		["Coffres ouverts", "%d / %d" % [opened, world_chests.size()]],
		["Téléporteurs activés", "%d / %d" % [main.wp_unlocked.size(), main.wp_nodes.size()]],
		["Réactions élémentaires", str(main.reactions)],
		["Ennemis vaincus", str(main.kills)],
		["Temps d'aventure", "%d h %02d" % [int(mins / 60.0), mins % 60]],
	]
	for i in rows.size():
		stats_box.add_child(GStyle.stat_row(rows[i][0], rows[i][1], i % 2 == 0))
	time_l.text = "Heure : " + main.daynight.clock_text()
	modulate.a = 0.0
	create_tween().tween_property(self, "modulate:a", 1.0, 0.18)

func close() -> void :
	visible = false
