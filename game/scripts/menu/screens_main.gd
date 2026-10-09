class_name MenuScreensMain
extends RefCounted
## Écrans : titre, accueil, Pass Unité, objectifs quotidiens, profil, paramètres, boutique.

var m


func _init(menu) -> void:
	m = menu


func _root() -> Control:
	var c := Control.new()
	UI.full_rect(c)
	c.mouse_filter = Control.MOUSE_FILTER_IGNORE
	return c


# ---------------------------------------------------------------------------
# Titre
# ---------------------------------------------------------------------------

func title() -> Control:
	var c := _root()
	m.set_showroom_car(Game.data.favorite)
	m.set_camera(Vector3(0, 0.6, 0), Vector3(4.2, 1.6, 6.2))
	var shade := ColorRect.new()
	shade.color = Color(0.05, 0.0, 0.12, 0.35)
	UI.full_rect(shade)
	shade.mouse_filter = Control.MOUSE_FILTER_IGNORE
	c.add_child(shade)
	var v := UI.vbox(0)
	UI.place(v, Control.PRESET_CENTER_LEFT, Vector2(70, -200), Vector2(700, 400))
	c.add_child(v)
	v.add_child(UI.outline(UI.label("ASPHALT", 120, UI.WHITE, "black"), Color(0.2, 0.0, 0.4, 0.9), 16))
	v.add_child(UI.outline(UI.label("LEGENDS UNITE", 74, UI.MAGENTA, "black"), Color(0.05, 0.0, 0.1, 0.9), 14))
	var fan := UI.panel(UI.YELLOW, UI.SKEW, Color(0, 0, 0, 0), 0, 10)
	fan.add_child(UI.label("FANGAME", 34, UI.BLACK, "title"))
	fan.size_flags_horizontal = Control.SIZE_SHRINK_BEGIN
	v.add_child(fan)
	v.add_child(UI.spacer(0, 30))
	var tap := UI.outline(UI.label("TOUCHE L'ÉCRAN POUR COMMENCER", 30, UI.WHITE, "title"), Color(0, 0, 0, 0.9), 8)
	v.add_child(tap)
	var tw := tap.create_tween().set_loops()
	tw.tween_property(tap, "modulate:a", 0.25, 0.7)
	tw.tween_property(tap, "modulate:a", 1.0, 0.7)
	var disc := UI.label("Fangame non officiel, gratuit et sans but commercial. Non affilié à Gameloft. "
		+ "Les marques et modèles de voitures appartiennent à leurs propriétaires respectifs.", 15,
		Color(1, 1, 1, 0.65), "body")
	disc.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	UI.place(disc, Control.PRESET_BOTTOM_LEFT, Vector2(30, -60), Vector2(900, 50))
	c.add_child(disc)
	var hit := Button.new()
	hit.flat = true
	hit.focus_mode = Control.FOCUS_NONE
	UI.full_rect(hit)
	hit.add_theme_stylebox_override("normal", StyleBoxEmpty.new())
	hit.add_theme_stylebox_override("hover", StyleBoxEmpty.new())
	hit.add_theme_stylebox_override("pressed", StyleBoxEmpty.new())
	hit.add_theme_stylebox_override("focus", StyleBoxEmpty.new())
	hit.pressed.connect(func():
		Sfx.play("ui_confirm", -2.0)
		m.show_screen("home", {}, false))
	c.add_child(hit)
	return c


# ---------------------------------------------------------------------------
# Accueil
# ---------------------------------------------------------------------------

func home() -> Control:
	var c := _root()
	m.set_showroom_car(Game.data.favorite)
	m.set_camera(Vector3(-1.4, 0.55, 0), Vector3(2.4, 1.45, 6.6))
	var v := UI.vbox(10)
	v.position = Vector2(60, 70)
	c.add_child(v)
	var nm := UI.hbox(6)
	nm.add_child(UI.icon("res://assets/ui/icon_car.png", 22))
	nm.add_child(UI.shadow(UI.label(str(Game.data.name), 24, UI.WHITE, "bold")))
	var lg: Array = Game.league()
	nm.add_child(UI.label("  •  LIGUE " + str(lg[0]), 18, UI.YELLOW, "title"))
	v.add_child(nm)
	var tasks := Game.daily_tasks()
	var claimable := 0
	for t in tasks:
		if not t.claimed and float(t.progress) >= float(t.goal):
			claimable += 1
	v.add_child(_home_panel("OBJECTIFS QUOTIDIENS", "DÉFIS DU JOUR", "%d À RÉCUPÉRER" % claimable if claimable > 0 else "",
		func(): m.show_screen("objectives"), true))
	var owned := Game.owned_cars().size()
	v.add_child(_home_panel("GARAGE", "%d VOITURES" % owned, "NIV %d" % (1 + Game.pass_tier()),
		func(): m.show_screen("garage"), false))
	v.add_child(_home_panel("PROFIL", "ET STATISTIQUES", "", func(): m.show_screen("profile"), false))
	# voiture favorite
	var car := CarsDB.get_car(Game.data.favorite)
	var info := UI.vbox(0)
	UI.place(info, Control.PRESET_BOTTOM_RIGHT, Vector2(-520, -300), Vector2(480, 100))
	c.add_child(info)
	var l1 := UI.shadow(UI.label(car.brand, 22, Color(1, 1, 1, 0.85), "bold", HORIZONTAL_ALIGNMENT_RIGHT))
	l1.size_flags_horizontal = Control.SIZE_FILL
	info.add_child(l1)
	info.add_child(UI.shadow(UI.label(car.model, 40, UI.WHITE, "title", HORIZONTAL_ALIGNMENT_RIGHT)))
	var rk := UI.label("RANG %d  •  CLASSE %s" % [Game.car_rank(car.id), car.cls], 20, UI.LIME, "title", HORIZONTAL_ALIGNMENT_RIGHT)
	info.add_child(UI.shadow(rk))
	var play := UI.button("JOUER", "yellow", 34, Vector2(250, 66))
	UI.place(play, Control.PRESET_BOTTOM_RIGHT, Vector2(-300, -186), Vector2(250, 66))
	play.pressed.connect(func(): m.show_screen("career"))
	c.add_child(play)
	# cadeau quotidien
	if str(Game.data.last_gift) != Game.today():
		var gift := UI.button("🎁  CADEAU DU JOUR", "purple", 22, Vector2(260, 52))
		UI.place(gift, Control.PRESET_TOP_RIGHT, Vector2(-300, 66), Vector2(260, 52))
		gift.text = "CADEAU DU JOUR !"
		gift.pressed.connect(func():
			Game.data.last_gift = Game.today()
			Game.add_credits(5000)
			Game.add_tokens(10)
			Game.save_game()
			Sfx.play("reward", -2.0)
			m.toast("+5 000 CRÉDITS  +10 JETONS")
			gift.queue_free())
		c.add_child(gift)
	return c


func _home_panel(t1: String, t2: String, badge: String, cb: Callable, selected: bool) -> Control:
	var b := Button.new()
	b.focus_mode = Control.FOCUS_NONE
	b.custom_minimum_size = Vector2(360, 128)
	var base := Color(0.32, 0.10, 0.62, 0.78)
	b.add_theme_stylebox_override("normal", UI.box(base, Vector2.ZERO, Color(1, 1, 1, 0.9) if selected else Color(1, 1, 1, 0.15), 3 if selected else 2, 0, 0))
	b.add_theme_stylebox_override("hover", UI.box(base.lightened(0.1), Vector2.ZERO, UI.WHITE, 3, 0, 0))
	b.add_theme_stylebox_override("pressed", UI.box(base.lightened(0.18), Vector2.ZERO, UI.WHITE, 3, 0, 0))
	b.add_theme_stylebox_override("focus", StyleBoxEmpty.new())
	b.pressed.connect(func():
		Sfx.click()
		cb.call())
	var v := UI.vbox(-2)
	v.position = Vector2(16, 58)
	b.add_child(v)
	v.add_child(UI.shadow(UI.label(t1, 28, UI.WHITE, "title")))
	v.add_child(UI.label(t2, 16, Color(1, 1, 1, 0.85), "bold"))
	if badge != "":
		var bd := UI.panel(UI.YELLOW, Vector2.ZERO, Color(0, 0, 0, 0), 0, 4)
		bd.add_child(UI.label(badge, 15, UI.BLACK, "title"))
		bd.position = Vector2(200, 10)
		b.add_child(bd)
	return b


# ---------------------------------------------------------------------------
# Pass Unité
# ---------------------------------------------------------------------------

func pass_screen() -> Control:
	var c := _root()
	m.set_title("PASS UNITÉ", "GAGNE DE L'XP EN COURSE POUR DÉBLOQUER DES RÉCOMPENSES")
	var xp := int(Game.data.xp)
	var tier := Game.pass_tier()
	var head := UI.hbox(16)
	head.position = Vector2(60, 90)
	c.add_child(head)
	head.add_child(UI.shadow(UI.label("PALIER %d / %d" % [tier, Game.PASS_TIERS], 30, UI.YELLOW, "title")))
	var into := xp % Game.PASS_XP_PER_TIER
	head.add_child(UI.bar(float(into) / Game.PASS_XP_PER_TIER, 360, 14, UI.MAGENTA))
	head.add_child(UI.label("%d / %d XP" % [into, Game.PASS_XP_PER_TIER], 20, UI.WHITE, "title"))
	var sc := ScrollContainer.new()
	sc.position = Vector2(40, 150)
	sc.size = Vector2(1200, 420)
	UI.place(sc, Control.PRESET_TOP_WIDE, Vector2(40, 150), Vector2(-80, 420))
	sc.vertical_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	c.add_child(sc)
	var row := UI.hbox(12)
	sc.add_child(row)
	var claimed := int(Game.data.pass_claimed)
	for t in range(1, Game.PASS_TIERS + 1):
		var r := Game.pass_reward(t)
		var unlocked := t <= tier
		var done := t <= claimed
		var col := Color(0.25, 0.08, 0.5, 0.9) if unlocked else Color(0.12, 0.05, 0.24, 0.85)
		var p := UI.panel(col, Vector2.ZERO, UI.YELLOW if (unlocked and not done) else Color(1, 1, 1, 0.15), 2, 12)
		p.custom_minimum_size = Vector2(190, 380)
		p.mouse_filter = Control.MOUSE_FILTER_PASS
		var v := UI.vbox(10)
		p.add_child(v)
		v.add_child(UI.label("PALIER %d" % t, 24, UI.WHITE, "title", HORIZONTAL_ALIGNMENT_CENTER))
		var ic := "res://assets/ui/icon_credits.png"
		if r.type == "tokens":
			ic = "res://assets/ui/icon_tokens.png"
		if r.type == "bp":
			v.add_child(m.blueprint_card(CarsDB.get_car(r.car), 120))
		else:
			var ce := CenterContainer.new()
			ce.custom_minimum_size = Vector2(160, 156)
			ce.add_child(UI.icon(ic, 96))
			v.add_child(ce)
		var lt := UI.label(r.text, 18, UI.WHITE, "title", HORIZONTAL_ALIGNMENT_CENTER)
		lt.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		lt.custom_minimum_size = Vector2(160, 50)
		v.add_child(lt)
		if done:
			v.add_child(UI.label("RÉCUPÉRÉ", 20, UI.LIME, "title", HORIZONTAL_ALIGNMENT_CENTER))
		elif unlocked and t == claimed + 1:
			var b := UI.button("RÉCUPÉRER", "yellow", 20, Vector2(160, 48))
			var tt := t
			b.pressed.connect(func():
				if Game.claim_pass(tt):
					Sfx.play("reward", -2.0)
					m.toast("RÉCOMPENSE OBTENUE : " + r.text)
					m.show_screen("pass", {}, false))
			v.add_child(b)
		elif not unlocked:
			v.add_child(UI.icon("res://assets/ui/icon_lock.png", 30))
		row.add_child(p)
	return c


# ---------------------------------------------------------------------------
# Objectifs quotidiens
# ---------------------------------------------------------------------------

func objectives() -> Control:
	var c := _root()
	m.set_title("OBJECTIFS QUOTIDIENS", "RÉINITIALISÉS CHAQUE JOUR")
	var v := UI.vbox(12)
	v.position = Vector2(80, 100)
	c.add_child(v)
	var tasks := Game.daily_tasks()
	for i in tasks.size():
		var t: Dictionary = tasks[i]
		var p := UI.panel(Color(0.2, 0.07, 0.42, 0.9), UI.SKEW, Color(1, 1, 1, 0.15), 2, 14)
		p.mouse_filter = Control.MOUSE_FILTER_PASS
		var h := UI.hbox(18)
		p.add_child(h)
		var tl := UI.label(t.text, 26, UI.WHITE, "title")
		tl.custom_minimum_size.x = 360
		h.add_child(tl)
		var prog := float(t.progress) / float(t.goal)
		h.add_child(UI.bar(prog, 240, 12, UI.YELLOW))
		h.add_child(UI.label("%d / %d" % [int(t.progress), int(t.goal)], 22, UI.WHITE, "title"))
		var rw := "%s CR" % Game.fmt_num(int(t.credits))
		if int(t.tokens) > 0:
			rw += "  +%d JETONS" % int(t.tokens)
		var rl := UI.label(rw, 20, UI.LIME, "title")
		rl.custom_minimum_size.x = 200
		h.add_child(rl)
		if t.claimed:
			h.add_child(UI.label("RÉCUPÉRÉ", 22, UI.GREY, "title"))
		elif prog >= 1.0:
			var b := UI.button("RÉCUPÉRER", "yellow", 20, Vector2(170, 44))
			var idx := i
			b.pressed.connect(func():
				if Game.claim_daily(idx):
					Sfx.play("reward", -2.0)
					m.toast("RÉCOMPENSE OBTENUE !")
					m.show_screen("objectives", {}, false))
			h.add_child(b)
		v.add_child(p)
	return c


# ---------------------------------------------------------------------------
# Profil
# ---------------------------------------------------------------------------

func profile() -> Control:
	var c := _root()
	m.set_title("PROFIL", "TES STATISTIQUES DE PILOTE")
	var v := UI.vbox(14)
	v.position = Vector2(80, 100)
	c.add_child(v)
	var h := UI.hbox(12)
	v.add_child(h)
	h.add_child(UI.label("PSEUDO", 24, UI.WHITE, "title"))
	var le := LineEdit.new()
	le.text = str(Game.data.name)
	le.max_length = 16
	le.custom_minimum_size = Vector2(320, 48)
	le.add_theme_font_override("font", UI.font("title"))
	le.add_theme_font_size_override("font_size", 26)
	le.add_theme_stylebox_override("normal", UI.box(Color(0, 0, 0, 0.6), Vector2.ZERO, UI.MAGENTA, 2, 4, 10))
	le.text_changed.connect(func(t: String):
		Game.data.name = t if t.strip_edges() != "" else "Pilote"
		Game.save_game())
	h.add_child(le)
	var st: Dictionary = Game.data.stats
	var lg: Array = Game.league()
	var rows := [["COURSES", str(st.races)], ["VICTOIRES", str(st.wins)], ["TAKEDOWNS", str(st.takedowns)],
		["TONNEAUX", str(st.barrel_rolls)], ["SAUTS", str(st.jumps)], ["FRÔLEMENTS", str(st.near_miss)],
		["NITROS PARFAITS", str(st.perfect_nitro)], ["DISTANCE", "%.1f KM" % float(st.distance_km)],
		["VITESSE MAX", "%d KM/H" % int(st.top_speed)], ["ACCIDENTS", str(st.wrecks)],
		["VOITURES", "%d / %d" % [Game.owned_cars().size(), CarsDB.all().size()]],
		["LIGUE", "%s (%d PTS)" % [lg[0], int(Game.data.league_points)]]]
	var grid := GridContainer.new()
	grid.columns = 4
	grid.add_theme_constant_override("h_separation", 40)
	grid.add_theme_constant_override("v_separation", 12)
	v.add_child(grid)
	for r in rows:
		grid.add_child(UI.label(r[0], 22, Color(1, 1, 1, 0.75), "bold"))
		grid.add_child(UI.label(r[1], 26, UI.YELLOW, "title"))
	return c


# ---------------------------------------------------------------------------
# Paramètres
# ---------------------------------------------------------------------------

func settings() -> Control:
	var c := _root()
	m.set_title("PARAMÈTRES")
	var v := UI.vbox(16)
	v.position = Vector2(80, 100)
	c.add_child(v)
	v.add_child(_slider_row("MUSIQUE", float(Game.setting("music")), func(x: float): Game.set_setting("music", x)))
	v.add_child(_slider_row("EFFETS SONORES", float(Game.setting("sfx")), func(x: float): Game.set_setting("sfx", x)))
	v.add_child(_choice_row("QUALITÉ GRAPHIQUE", ["BASSE", "MOYENNE", "HAUTE"], int(Game.setting("quality")),
		func(i: int): Game.set_setting("quality", i)))
	var cm := 0 if Game.setting("controls") == "buttons" else 1
	v.add_child(_choice_row("COMMANDES", ["BOUTONS", "INCLINAISON"], cm,
		func(i: int): Game.set_setting("controls", "buttons" if i == 0 else "tilt")))
	v.add_child(_choice_row("TOUCHDRIVE PAR DÉFAUT", ["NON", "OUI"], 1 if Game.setting("touchdrive") else 0,
		func(i: int): Game.set_setting("touchdrive", i == 1)))
	v.add_child(_choice_row("VIBRATIONS", ["NON", "OUI"], 1 if Game.setting("vibration") else 0,
		func(i: int): Game.set_setting("vibration", i == 1)))
	var help := UI.label("CONTRÔLES : ◀ ▶ pour tourner • NITRO (tape) — retape dans la zone bleue = NITRO PARFAIT • "
		+ "double tape avec la jauge pleine = ONDE DE CHOC • DRIFT en tournant = dérapage • DRIFT en l'air = 360° • "
		+ "les rampes vrillées font faire des TONNEAUX. Clavier : flèches, Espace = nitro, Bas/Maj = drift.", 17,
		Color(1, 1, 1, 0.8), "body")
	help.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	help.custom_minimum_size = Vector2(1000, 70)
	v.add_child(help)
	var reset := UI.button("RÉINITIALISER LA PROGRESSION", "red", 20, Vector2(360, 50))
	reset.size_flags_horizontal = Control.SIZE_SHRINK_BEGIN
	reset.pressed.connect(func():
		m.dialog("RÉINITIALISER ?", "Toute ta progression (voitures, crédits, carrière) sera effacée.",
			[["EFFACER", "red", func():
				Game.reset_save()
				m.toast("PROGRESSION RÉINITIALISÉE")
				m.show_screen("home", {}, false)], ["ANNULER", "white", Callable()]]))
	v.add_child(reset)
	v.add_child(UI.label("Asphalt Unite Fangame v1.0 — fait avec Godot 4 et Blender. Fangame non officiel, non affilié à Gameloft.",
		15, Color(1, 1, 1, 0.55), "body"))
	return c


func _slider_row(t: String, val: float, cb: Callable) -> Control:
	var h := UI.hbox(20)
	var l := UI.label(t, 24, UI.WHITE, "title")
	l.custom_minimum_size.x = 300
	h.add_child(l)
	var s := HSlider.new()
	s.min_value = 0.0
	s.max_value = 1.0
	s.step = 0.05
	s.value = val
	s.custom_minimum_size = Vector2(380, 40)
	s.value_changed.connect(func(x: float): cb.call(x))
	h.add_child(s)
	return h


func _choice_row(t: String, opts: Array, sel: int, cb: Callable) -> Control:
	var h := UI.hbox(12)
	var l := UI.label(t, 24, UI.WHITE, "title")
	l.custom_minimum_size.x = 300
	h.add_child(l)
	var btns: Array = []
	for i in opts.size():
		var b := UI.button(opts[i], "yellow" if i == sel else "dark", 20, Vector2(150, 44))
		var idx := i
		b.pressed.connect(func():
			cb.call(idx)
			m.show_screen(m.current, m.current_params, false))
		h.add_child(b)
	return h


# ---------------------------------------------------------------------------
# Boutique
# ---------------------------------------------------------------------------

func shop() -> Control:
	var c := _root()
	m.set_title("BOUTIQUE", "PLANS, CRÉDITS ET VOITURES — TOUT EST GRATUIT, AUCUN ACHAT RÉEL")
	var sc := ScrollContainer.new()
	UI.place(sc, Control.PRESET_FULL_RECT, Vector2(40, 90), Vector2(-80, -110))
	c.add_child(sc)
	var v := UI.vbox(16)
	sc.add_child(v)
	v.add_child(UI.shadow(UI.label("PACKS DE PLANS", 28, UI.YELLOW, "title")))
	var row := UI.hbox(14)
	v.add_child(row)
	for cls in CarsDB.CLASSES:
		var price: int = {"D": 40, "C": 90, "B": 180, "A": 320, "S": 550}[cls]
		var n: int = {"D": 4, "C": 5, "B": 6, "A": 6, "S": 6}[cls]
		row.add_child(_offer("PACK CLASSE " + cls, "%d PLANS ALÉATOIRES" % n, "res://assets/ui/icon_blueprint.png",
			str(price), "res://assets/ui/icon_tokens.png", func():
				if Game.spend_tokens(price):
					var pool := CarsDB.cars_of_class(cls)
					var got := {}
					for k in n:
						var car: Dictionary = pool[randi() % pool.size()]
						Game.add_blueprints(car.id, 1)
						got[car.model] = got.get(car.model, 0) + 1
					Game.save_game()
					Sfx.play("reward", -2.0)
					var txt := ""
					for k2 in got:
						txt += "%s x%d  " % [k2, got[k2]]
					m.toast("PLANS : " + txt)
				else:
					m.toast("PAS ASSEZ DE JETONS", UI.RED)))
	v.add_child(UI.shadow(UI.label("CRÉDITS", 28, UI.YELLOW, "title")))
	var row2 := UI.hbox(14)
	v.add_child(row2)
	for o in [[25000, 60], [80000, 170], [250000, 450]]:
		var amount: int = o[0]
		var cost: int = o[1]
		row2.add_child(_offer(Game.fmt_num(amount), "CRÉDITS", "res://assets/ui/icon_credits.png", str(cost),
			"res://assets/ui/icon_tokens.png", func():
				if Game.spend_tokens(cost):
					Game.add_credits(amount)
					Game.save_game()
					Sfx.play("reward", -2.0)
					m.toast("+%s CRÉDITS" % Game.fmt_num(amount))
				else:
					m.toast("PAS ASSEZ DE JETONS", UI.RED)))
	row2.add_child(_offer("100 JETONS", "CONTRE 40 000 CRÉDITS", "res://assets/ui/icon_tokens.png", "40 000",
		"res://assets/ui/icon_credits.png", func():
			if Game.spend_credits(40000):
				Game.add_tokens(100)
				Game.save_game()
				Sfx.play("reward", -2.0)
				m.toast("+100 JETONS")
			else:
				m.toast("PAS ASSEZ DE CRÉDITS", UI.RED)))
	v.add_child(UI.shadow(UI.label("VOITURES EN VENTE", 28, UI.YELLOW, "title")))
	var row3 := UI.hbox(14)
	v.add_child(row3)
	var forsale := []
	for car in CarsDB.all():
		if not Game.is_owned(car.id):
			forsale.append(car)
	forsale.sort_custom(func(a, b): return CarsDB.class_index(a.cls) < CarsDB.class_index(b.cls))
	for car in forsale.slice(0, 6):
		var price2: int = CarsDB.TOKEN_PRICE[car.cls]
		var cid: String = car.id
		var card: Control = m.blueprint_card(car, 120)
		row3.add_child(_offer_card(card, car.model, str(price2), func():
			if Game.spend_tokens(price2):
				var st := Game.car_state(cid)
				st.stars = 1
				Game.save_game()
				Game.garage_changed.emit()
				Sfx.play("unlock", -2.0)
				m.toast(CarsDB.display_name(CarsDB.get_car(cid)) + " AJOUTÉE AU GARAGE !")
				m.show_screen("shop", {}, false)
			else:
				m.toast("PAS ASSEZ DE JETONS", UI.RED)))
	return c


func _offer(t1: String, t2: String, icon: String, price: String, price_icon: String, cb: Callable) -> Control:
	var p := UI.panel(Color(0.22, 0.08, 0.45, 0.92), Vector2.ZERO, Color(1, 1, 1, 0.2), 2, 12)
	p.custom_minimum_size = Vector2(200, 230)
	p.mouse_filter = Control.MOUSE_FILTER_PASS
	var v := UI.vbox(6)
	p.add_child(v)
	var ce := CenterContainer.new()
	ce.custom_minimum_size = Vector2(170, 80)
	ce.add_child(UI.icon(icon, 72))
	v.add_child(ce)
	v.add_child(UI.label(t1, 22, UI.WHITE, "title", HORIZONTAL_ALIGNMENT_CENTER))
	var l2 := UI.label(t2, 15, Color(1, 1, 1, 0.75), "bold", HORIZONTAL_ALIGNMENT_CENTER)
	l2.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	l2.custom_minimum_size = Vector2(170, 36)
	v.add_child(l2)
	var b := UI.button(price, "yellow", 20, Vector2(170, 44))
	b.icon = load(price_icon)
	b.expand_icon = true
	b.add_theme_constant_override("icon_max_width", 24)
	b.pressed.connect(cb)
	v.add_child(b)
	return p


func _offer_card(card: Control, t: String, price: String, cb: Callable) -> Control:
	var p := UI.panel(Color(0.22, 0.08, 0.45, 0.92), Vector2.ZERO, Color(1, 1, 1, 0.2), 2, 12)
	p.custom_minimum_size = Vector2(170, 270)
	p.mouse_filter = Control.MOUSE_FILTER_PASS
	var v := UI.vbox(6)
	p.add_child(v)
	var ce := CenterContainer.new()
	ce.add_child(card)
	v.add_child(ce)
	v.add_child(UI.label(t, 18, UI.WHITE, "title", HORIZONTAL_ALIGNMENT_CENTER))
	var b := UI.button(price, "yellow", 20, Vector2(150, 44))
	b.icon = load("res://assets/ui/icon_tokens.png")
	b.expand_icon = true
	b.add_theme_constant_override("icon_max_width", 24)
	b.pressed.connect(cb)
	v.add_child(b)
	return p
