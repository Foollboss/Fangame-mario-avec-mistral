class_name MenuScreensRace
extends RefCounted
## Écrans : carrière, carte de saison, sélection de voiture, fiche voiture, garage,
## événements quotidiens / spéciaux, multijoueur (ligue contre IA).

var m
var _chapter := 0
var _garage_cls := ""

const ENV_COLORS := {"sf": Color("#ff6b4a"), "la": Color("#ff9f3d"), "tokyo": Color("#2fe0ff"), "desert": Color("#ffc94d")}
const CHAPTER_CARS := ["jesko", "huracan_evo", "chiron"]


func _init(menu) -> void:
	m = menu


func _root() -> Control:
	var c := Control.new()
	UI.full_rect(c)
	c.mouse_filter = Control.MOUSE_FILTER_IGNORE
	return c


func _thumb_rect(id: String, size: Vector2) -> TextureRect:
	var tr := TextureRect.new()
	tr.texture = m.thumb(id)
	tr.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	tr.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	tr.custom_minimum_size = size
	tr.size = size
	tr.mouse_filter = Control.MOUSE_FILTER_IGNORE
	return tr


func _flat_button(cb: Callable, size: Vector2, col: Color, border: Color = Color(1, 1, 1, 0.15)) -> Button:
	var b := Button.new()
	b.focus_mode = Control.FOCUS_NONE
	b.custom_minimum_size = size
	b.size = size
	b.add_theme_stylebox_override("normal", UI.box(col, Vector2.ZERO, border, 2, 2, 0))
	b.add_theme_stylebox_override("hover", UI.box(col.lightened(0.1), Vector2.ZERO, UI.WHITE, 3, 2, 0))
	b.add_theme_stylebox_override("pressed", UI.box(col.lightened(0.2), Vector2.ZERO, UI.WHITE, 3, 2, 0))
	b.add_theme_stylebox_override("focus", StyleBoxEmpty.new())
	b.pressed.connect(func():
		Sfx.click()
		cb.call())
	return b


# ---------------------------------------------------------------------------
# Carrière : chapitres et saisons
# ---------------------------------------------------------------------------

func career(params: Dictionary) -> Control:
	var c := _root()
	var chapters := CareerDB.chapters()
	if params.has("chapter"):
		_chapter = int(params.chapter)
	_chapter = clampi(_chapter, 0, chapters.size() - 1)
	var ch: Dictionary = chapters[_chapter]
	var unlocked := Game.chapter_unlocked(ch)
	# illustration du chapitre
	var art := Panel.new()
	art.add_theme_stylebox_override("panel", UI.box(Color(0.14, 0.05, 0.3, 0.92), UI.SKEW, Color(1, 1, 1, 0.25), 2, 0, 0))
	art.position = Vector2(40, 70)
	art.size = Vector2(560, 470)
	art.mouse_filter = Control.MOUSE_FILTER_IGNORE
	art.clip_contents = true
	c.add_child(art)
	var big := _thumb_rect(CHAPTER_CARS[_chapter % CHAPTER_CARS.size()], Vector2(620, 350))
	big.position = Vector2(-10, 150)
	art.add_child(big)
	art.add_child(UI.outline(UI.label("%02d" % ch.id, 110, UI.WHITE, "black"), Color(0.1, 0.0, 0.2, 0.8), 10))
	var tl := UI.vbox(0)
	tl.position = Vector2(30, 120)
	art.add_child(tl)
	for word in str(ch.title).split(" "):
		pass
	var t1 := UI.outline(UI.label(ch.title, 40, UI.WHITE, "title"), Color(0.1, 0.0, 0.2, 0.8), 8)
	t1.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	t1.custom_minimum_size = Vector2(380, 0)
	tl.add_child(t1)
	var tag := UI.panel(Color(0.3, 0.1, 0.55, 0.95), UI.SKEW, Color(0, 0, 0, 0), 0, 6)
	tag.add_child(UI.label("CHAPITRE %d" % ch.id, 22, UI.MAGENTA.lightened(0.3), "title"))
	tag.size_flags_horizontal = Control.SIZE_SHRINK_BEGIN
	tl.add_child(tag)
	# saisons
	var positions := [Vector2(660, 330), Vector2(860, 150), Vector2(1060, 330)]
	for i in ch.seasons.size():
		var s: Dictionary = ch.seasons[i]
		var open := Game.season_unlocked(s)
		var flags := Game.season_flags(s)
		var total := CareerDB.season_flags_total(s)
		var sid: String = s.id
		var b := _flat_button(func():
			if open:
				m.remember("season", {"season": sid})
				m.show_screen("season", {"season": sid})
			else:
				m.toast("TERMINE LA SAISON PRÉCÉDENTE POUR DÉBLOQUER", UI.RED), Vector2(190, 190),
			Color(0.6, 0.15, 0.85, 0.95) if open else Color(0.3, 0.1, 0.45, 0.85))
		b.position = positions[i % positions.size()]
		c.add_child(b)
		var badge := UI.label(s.badge, 86, Color(1, 1, 1, 0.9) if open else Color(1, 1, 1, 0.3), "black",
			HORIZONTAL_ALIGNMENT_CENTER)
		badge.position = Vector2(0, 10)
		badge.size = Vector2(190, 110)
		b.add_child(badge)
		var nm := UI.label(s.name, 20, UI.WHITE, "title", HORIZONTAL_ALIGNMENT_CENTER)
		nm.position = Vector2(0, 118)
		nm.size = Vector2(190, 30)
		b.add_child(nm)
		var fl := UI.hbox(4)
		fl.add_child(UI.icon("res://assets/ui/icon_flag.png", 20))
		fl.add_child(UI.label("%d/%d  •  CLASSE %s" % [flags, total, s.cls], 16, UI.WHITE, "bold"))
		fl.position = Vector2(30, 152)
		b.add_child(fl)
		if not open:
			var lk := UI.icon("res://assets/ui/icon_lock.png", 30)
			lk.position = Vector2(152, 6)
			b.add_child(lk)
		elif flags == 0:
			var nw := UI.panel(UI.LIME, UI.SKEW, Color(0, 0, 0, 0), 0, 4)
			nw.add_child(UI.label("NOUVEAU", 18, UI.BLACK, "title"))
			nw.position = Vector2(8, 8)
			b.add_child(nw)
		if i < ch.seasons.size() - 1:
			var arrow := UI.label("»", 44, UI.WHITE, "black")
			arrow.position = positions[i % positions.size()] + Vector2(196, 70 if i % 2 == 0 else 60)
			c.add_child(arrow)
	# barre de chapitres
	var bar := UI.panel(Color(0.02, 0.01, 0.06, 0.9), UI.SKEW, Color(0, 0, 0, 0), 0, 8)
	UI.place(bar, Control.PRESET_BOTTOM_LEFT, Vector2(40, -150), Vector2(1180, 52))
	bar.mouse_filter = Control.MOUSE_FILTER_PASS
	c.add_child(bar)
	var h := UI.hbox(14)
	bar.add_child(h)
	var got := 0
	var tot := 0
	for chx in chapters:
		for s2 in chx.seasons:
			got += Game.season_flags(s2)
			tot += CareerDB.season_flags_total(s2)
	h.add_child(UI.icon("res://assets/ui/icon_flag.png", 26))
	h.add_child(UI.label("%d/%d" % [got, tot], 24, UI.LIME, "title"))
	h.add_child(UI.spacer(40, 0))
	for i in chapters.size():
		var cb := UI.button("%02d" % (i + 1), "yellow" if i == _chapter else "dark", 22, Vector2(70, 40), Vector2.ZERO)
		var idx := i
		cb.pressed.connect(func(): m.show_screen("career", {"chapter": idx}, false))
		if not Game.chapter_unlocked(chapters[i]):
			cb.text = "🔒"
			cb.text = "%02d" % (i + 1)
			cb.modulate = Color(1, 1, 1, 0.45)
		h.add_child(cb)
	h.add_child(UI.spacer(20, 0))
	h.add_child(UI.label("%d%%" % int(Game.chapter_progress(ch) * 100.0), 26, UI.WHITE, "title"))
	if not unlocked:
		var lock := UI.panel(Color(0, 0, 0, 0.8), UI.SKEW, UI.RED, 2, 12)
		lock.add_child(UI.label("CHAPITRE VERROUILLÉ — TERMINE LE CHAPITRE PRÉCÉDENT", 22, UI.WHITE, "title"))
		lock.position = Vector2(660, 560)
		c.add_child(lock)
	return c


func _find_season(sid: String) -> Dictionary:
	for ch in CareerDB.chapters():
		for s in ch.seasons:
			if s.id == sid:
				return s
	return CareerDB.chapters()[0].seasons[0]


func season(params: Dictionary) -> Control:
	var c := _root()
	var s := _find_season(str(params.get("season", "")))
	m.remember("season", {"season": s.id, "sel": params.get("sel", -1)})
	var map := TextureRect.new()
	map.texture = load("res://assets/ui/map_bg.png")
	map.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	map.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_COVERED
	UI.full_rect(map)
	map.mouse_filter = Control.MOUSE_FILTER_IGNORE
	c.add_child(map)
	var events: Array = s.events
	var sel := int(params.get("sel", -1))
	if sel < 0:
		sel = 0
		for i in events.size():
			if Game.event_unlocked(events[i]) and Game.event_flag_count(events[i].id) < 2:
				sel = i
				break
	var pts := [Vector2(170, 470), Vector2(330, 260), Vector2(560, 400), Vector2(720, 170)]
	var lines := Control.new()
	lines.mouse_filter = Control.MOUSE_FILTER_IGNORE
	UI.full_rect(lines)
	lines.draw.connect(func():
		for i in range(events.size() - 1):
			var a: Vector2 = pts[i] + Vector2(95, 60)
			var b: Vector2 = pts[i + 1] + Vector2(95, 60)
			var d := a.distance_to(b)
			var n := int(d / 18.0)
			for k in n:
				if k % 2 == 0:
					lines.draw_line(a.lerp(b, float(k) / n), a.lerp(b, float(k + 1) / n), Color(1, 1, 1, 0.55), 3.0))
	c.add_child(lines)
	for i in events.size():
		var ev: Dictionary = events[i]
		var open := Game.event_unlocked(ev)
		var tdef := TracksDB.get_track(ev.track)
		var envc: Color = ENV_COLORS.get(tdef.env, UI.MAGENTA)
		var idx := i
		var b := _flat_button(func():
			m.show_screen("season", {"season": s.id, "sel": idx}, false), Vector2(190, 120),
			Color(0.12, 0.05, 0.25, 0.95), UI.WHITE if i == sel else Color(1, 1, 1, 0.25))
		b.position = pts[i % pts.size()]
		c.add_child(b)
		var strip := ColorRect.new()
		strip.color = envc
		strip.position = Vector2(4, 4)
		strip.size = Vector2(182, 8)
		strip.mouse_filter = Control.MOUSE_FILTER_IGNORE
		b.add_child(strip)
		var num := UI.outline(UI.label("%02d" % (i + 1), 40, UI.WHITE, "black"), Color(0, 0, 0, 0.6), 6)
		num.position = Vector2(10, 12)
		b.add_child(num)
		var bpc: Control = m.blueprint_card(CarsDB.get_car(ev.bp_car), 52)
		bpc.position = Vector2(130, 14)
		b.add_child(bpc)
		var tn := UI.label(TracksDB.ENVS[tdef.env].name.to_upper(), 17, UI.WHITE, "title")
		tn.position = Vector2(10, 64)
		b.add_child(tn)
		var fl := UI.hbox(2)
		for f in Game.event_flags(ev.id):
			var ic := UI.icon("res://assets/ui/icon_flag.png", 18)
			ic.modulate = UI.LIME if f else Color(1, 1, 1, 0.3)
			fl.add_child(ic)
		fl.position = Vector2(10, 92)
		b.add_child(fl)
		if not open:
			var rq := UI.panel(UI.RED, Vector2.ZERO, Color(0, 0, 0, 0), 0, 4)
			rq.add_child(UI.label("REQUIS : %d 🏁" % int(ev.req_flags), 15, UI.WHITE, "title"))
			(rq.get_child(0) as Label).text = "REQUIS : %d DRAPEAU%s" % [int(ev.req_flags), "X" if int(ev.req_flags) > 1 else ""]
			rq.position = Vector2(4, 124)
			b.add_child(rq)
			b.modulate = Color(1, 1, 1, 0.75)
	# saison
	var sb := UI.hbox(10)
	UI.place(sb, Control.PRESET_BOTTOM_LEFT, Vector2(60, -110), Vector2(500, 70))
	c.add_child(sb)
	var badge := UI.panel(UI.MAGENTA, Vector2.ZERO, UI.WHITE, 2, 6)
	badge.add_child(UI.label(s.badge, 40, UI.WHITE, "black", HORIZONTAL_ALIGNMENT_CENTER))
	badge.custom_minimum_size = Vector2(70, 70)
	sb.add_child(badge)
	var sv := UI.vbox(0)
	sb.add_child(sv)
	sv.add_child(UI.shadow(UI.label(s.name, 22, UI.WHITE, "title")))
	var fh := UI.hbox(6)
	fh.add_child(UI.label("DRAPEAUX DE SAISON", 18, UI.WHITE, "bold"))
	fh.add_child(UI.label("%d/%d" % [Game.season_flags(s), CareerDB.season_flags_total(s)], 22, UI.LIME, "title"))
	sv.add_child(fh)
	# panneau de droite
	var ev: Dictionary = events[sel]
	c.add_child(_event_panel(ev, Game.event_unlocked(ev), func():
		m.remember("carselect", {"event": ev})
		m.show_screen("carselect", {"event": ev})))
	return c


func _event_panel(ev: Dictionary, open: bool, on_next: Callable) -> Control:
	var panel := Panel.new()
	panel.add_theme_stylebox_override("panel", UI.box(Color(0.05, 0.02, 0.12, 0.9), Vector2.ZERO, Color(1, 1, 1, 0.12), 2, 0, 0))
	UI.place(panel, Control.PRESET_RIGHT_WIDE, Vector2(-380, 64), Vector2(340, -150))
	panel.mouse_filter = Control.MOUSE_FILTER_STOP
	var v := UI.vbox(10)
	v.position = Vector2(16, 12)
	v.size = Vector2(308, 500)
	panel.add_child(v)
	var hd := UI.panel(UI.WHITE, UI.SKEW, Color(0, 0, 0, 0), 0, 6)
	var hdh := UI.hbox(0)
	hd.add_child(hdh)
	hdh.add_child(UI.label("OBJECTIFS ", 22, UI.BLACK, "title"))
	hdh.add_child(UI.label("DE COURSE", 22, UI.BLACK, "bold"))
	v.add_child(hd)
	var tdef := TracksDB.get_track(ev.track)
	v.add_child(UI.label(TracksDB.full_name(ev.track), 18, UI.YELLOW, "title"))
	v.add_child(UI.label(CareerDB.MODES.get(ev.mode, "") + "  •  CLASSE " + str(ev.cls), 16, Color(1, 1, 1, 0.8), "bold"))
	var flags: Array = Game.event_flags(ev.id) if ev.has("season") else [false, false]
	for i in ev.objectives.size():
		var oh := UI.hbox(6)
		var ic := UI.icon("res://assets/ui/icon_flag.png", 20)
		ic.modulate = UI.LIME if (i < flags.size() and flags[i]) else Color(1, 1, 1, 0.5)
		oh.add_child(ic)
		var ol := UI.label(_obj_text(ev, ev.objectives[i]), 16, UI.WHITE, "bold")
		ol.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		ol.custom_minimum_size = Vector2(270, 0)
		oh.add_child(ol)
		v.add_child(oh)
	v.add_child(UI.spacer(0, 6))
	v.add_child(UI.label("RÉCOMPENSES", 22, UI.WHITE, "title"))
	var rh := UI.hbox(12)
	v.add_child(rh)
	if str(ev.get("bp_car", "")) != "":
		var car := CarsDB.get_car(ev.bp_car)
		rh.add_child(m.blueprint_card(car, 110))
		var rv := UI.vbox(4)
		rh.add_child(rv)
		rv.add_child(UI.label("PLAN x%d" % int(ev.bp_n), 22, UI.LIME, "title"))
		var pl := UI.label("PLAN POUR\n" + CarsDB.display_name(car), 15, Color(1, 1, 1, 0.8), "bold")
		pl.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		pl.custom_minimum_size = Vector2(170, 0)
		rv.add_child(pl)
		var cr := UI.hbox(4)
		cr.add_child(UI.icon("res://assets/ui/icon_credits.png", 20))
		cr.add_child(UI.label(Game.fmt_num(int(ev.credits)), 20, UI.WHITE, "title"))
		rv.add_child(cr)
	var rr := UI.panel(UI.LIME, Vector2.ZERO, Color(0, 0, 0, 0), 0, 6)
	rr.add_child(UI.label("RANG RECOMMANDÉ : %d" % int(ev.rank), 20, UI.BLACK, "title", HORIZONTAL_ALIGNMENT_CENTER))
	v.add_child(rr)
	var nb := UI.button("SUIVANT" if open else "VERROUILLÉ", "yellow" if open else "dark", 30, Vector2(300, 64), Vector2.ZERO)
	nb.disabled = not open
	nb.pressed.connect(on_next)
	v.add_child(nb)
	return panel


func _obj_text(ev: Dictionary, o: Dictionary) -> String:
	if o.type == "time" and float(o.value) <= 0.0:
		return "BATS LE TEMPS DE RÉFÉRENCE"
	return CareerDB.objective_text(o)


# ---------------------------------------------------------------------------
# Sélection de voiture
# ---------------------------------------------------------------------------

func carselect(params: Dictionary) -> Control:
	var c := _root()
	var ev: Dictionary = params.get("event", {})
	m.set_title("SÉLECTION DE VOITURE", "CHOISIS TA VOITURE POUR CETTE COURSE.")
	var cls: String = ev.get("cls", "")
	var rr := UI.panel(UI.LIME, UI.SKEW, Color(0, 0, 0, 0), 0, 6)
	var rrl := UI.label("RANG RECOMMANDÉ : %d" % int(ev.get("rank", 0)) if not ev.get("league", false) else "TOUTES CLASSES", 22, UI.BLACK, "title")
	rr.add_child(rrl)
	UI.place(rr, Control.PRESET_TOP_RIGHT, Vector2(-420, 64), Vector2(380, 40))
	c.add_child(rr)
	var cars := []
	for car in CarsDB.all():
		if cls == "" or car.cls == cls:
			cars.append(car)
	cars.sort_custom(func(a, b):
		var oa := Game.is_owned(a.id)
		var ob := Game.is_owned(b.id)
		if oa != ob:
			return oa
		return Game.car_rank(a.id) > Game.car_rank(b.id))
	c.add_child(_card_grid(cars, func(car: Dictionary):
		m.show_screen("cardetail", {"car": car.id, "event": ev}), 112))
	return c


func _card_grid(cars: Array, on_tap: Callable, top: float) -> Control:
	var sc := ScrollContainer.new()
	UI.place(sc, Control.PRESET_FULL_RECT, Vector2(40, top), Vector2(-40, -30))
	sc.vertical_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	var row := UI.hbox(14)
	sc.add_child(row)
	var col: VBoxContainer = null
	for i in cars.size():
		if i % 2 == 0:
			col = UI.vbox(14)
			row.add_child(col)
		var car: Dictionary = cars[i]
		col.add_child(m.car_card(car, func(): on_tap.call(car)))
	return sc


# ---------------------------------------------------------------------------
# Fiche voiture (avant course ou garage)
# ---------------------------------------------------------------------------

func cardetail(params: Dictionary) -> Control:
	var c := _root()
	var id: String = params.car
	var ev: Dictionary = params.get("event", {})
	var car := CarsDB.get_car(id)
	var owned := Game.is_owned(id)
	if m.show_car_id != id or params.get("refresh", false):
		m.set_showroom_car(id)
	m.set_camera(Vector3(-2.3, 0.55, 0), Vector3(2.0, 1.7, 9.0))
	var st := Game.car_state(id)
	var stats := Game.car_stats(id)
	# en-tête : plan + nom
	var head := UI.hbox(12)
	head.position = Vector2(50, 66)
	c.add_child(head)
	head.add_child(m.blueprint_card(car, 74))
	var hv := UI.vbox(0)
	head.add_child(hv)
	hv.add_child(UI.shadow(UI.label(car.brand, 20, Color(1, 1, 1, 0.9), "bold")))
	hv.add_child(UI.shadow(UI.label(car.model, 40, UI.WHITE, "title")))
	hv.add_child(m.stars_row(int(st.stars), 3, 20))
	var need := CarsDB.blueprints_needed(car, int(st.stars))
	var bph := UI.hbox(6)
	bph.add_child(UI.icon("res://assets/ui/icon_blueprint.png", 20))
	bph.add_child(UI.label(("%d/%d" % [st.bp, need]) if need > 0 else "MAX", 18, UI.WHITE, "title"))
	bph.add_child(UI.bar(float(st.bp) / maxf(1.0, need) if need > 0 else 1.0, 120, 6, UI.YELLOW))
	hv.add_child(bph)
	# statistiques
	var sv := UI.vbox(10)
	sv.position = Vector2(50, 230)
	c.add_child(sv)
	var lvl := int(st.level)
	var can_up := owned and lvl < Game.max_level_for(id)
	var defs := [["VITESSE MAX", "top", "icon_settings"], ["ACCÉLÉRATION", "acc", "icon_car"],
		["MANIABILITÉ", "han", "icon_star"], ["NITRO", "nit", "icon_trophy"]]
	for d in defs:
		var key: String = d[1]
		var r: Array = car[key]
		var val: float = stats[key]
		var row := UI.hbox(10)
		var lab := UI.shadow(UI.label(d[0], 24, UI.WHITE, "title"))
		lab.custom_minimum_size.x = 190
		row.add_child(lab)
		if can_up:
			row.add_child(UI.label("︽", 18, UI.LIME, "black"))
		row.add_child(UI.shadow(UI.label(Game.fmt_stat(val), 24, UI.WHITE, "title")))
		sv.add_child(row)
		var maxv: float = 470.0 if key == "top" else 100.0
		var minv: float = 200.0 if key == "top" else 30.0
		sv.add_child(UI.bar((val - minv) / (maxv - minv), 300, 5, UI.WHITE, Color(1, 1, 1, 0.2)))
	# rang
	var rk := UI.hbox(0)
	UI.place(rk, Control.PRESET_TOP_RIGHT, Vector2(-330, 66), Vector2(290, 60))
	c.add_child(rk)
	var rkp := UI.panel(Color(0, 0, 0, 0.85), Vector2.ZERO, Color(0, 0, 0, 0), 0, 8)
	var rkv := UI.hbox(8)
	rkp.add_child(rkv)
	rkv.add_child(UI.label("RANG", 18, UI.WHITE, "bold"))
	rkv.add_child(UI.label(str(stats.rank), 34, UI.LIME, "title"))
	rkv.add_child(UI.label("/" + str(car.rank[1]), 24, UI.WHITE, "title"))
	rk.add_child(rkp)
	rk.add_child(UI.class_badge(car.cls, 44))
	if not ev.is_empty() and not ev.get("league", false):
		var rr := UI.panel(UI.LIME, Vector2.ZERO, Color(0, 0, 0, 0), 0, 6)
		var ok := int(stats.rank) >= int(ev.rank)
		rr.add_child(UI.label("RANG RECOMMANDÉ : %d" % int(ev.rank), 18, UI.BLACK, "title"))
		if not ok:
			rr.add_theme_stylebox_override("panel", UI.box(Color("#ff9b3d"), Vector2.ZERO, Color(0, 0, 0, 0), 0, 0, 6))
		UI.place(rr, Control.PRESET_TOP_RIGHT, Vector2(-330, 132), Vector2(290, 34))
		c.add_child(rr)
	# barre d'actions
	var bar := UI.hbox(14)
	UI.place(bar, Control.PRESET_BOTTOM_WIDE, Vector2(50, -110), Vector2(-100, 80))
	c.add_child(bar)
	if owned:
		var cost := CarsDB.upgrade_cost(car, lvl)
		var up := UI.button("AMÉLIORER" if can_up else "NIVEAU MAX", "white", 26, Vector2(230, 70))
		up.disabled = not can_up
		if can_up:
			up.text = "AMÉLIORER\n%s CR" % Game.fmt_num(cost)
			up.add_theme_font_size_override("font_size", 20)
		up.pressed.connect(func():
			if Game.upgrade_car(id):
				Sfx.play("unlock", -4.0)
				m.toast("AMÉLIORATION ! RANG %d" % Game.car_rank(id), UI.LIME)
				m.show_screen("cardetail", params, false)
			else:
				m.toast("PAS ASSEZ DE CRÉDITS" if Game.credits() < cost else "PLUS D'ÉTOILES NÉCESSAIRES", UI.RED))
		bar.add_child(up)
		var paint := UI.button("PEINTURE", "white", 22, Vector2(150, 70))
		paint.pressed.connect(func(): _paint_dialog(id, params))
		bar.add_child(paint)
		if Game.can_star_up(id):
			var star := UI.button("★ ÉTOILE", "lime", 22, Vector2(160, 70))
			star.pressed.connect(func():
				if Game.unlock_or_star(id):
					Sfx.play("unlock", -2.0)
					m.toast("NOUVELLE ÉTOILE ! NIVEAU MAX AUGMENTÉ", UI.LIME)
					m.show_screen("cardetail", params, false))
			bar.add_child(star)
		# carburant
		var fp := UI.panel(Color(0.04, 0.02, 0.1, 0.9), Vector2.ZERO, Color(1, 1, 1, 0.2), 2, 8)
		var fv := UI.vbox(0)
		fp.add_child(fv)
		var nxt := Game.fuel_next_sec(id)
		fv.add_child(UI.label("RECHARGE DANS %02d MIN" % int(ceil(nxt / 60.0)) if nxt > 0 else "RÉSERVOIR PLEIN", 14, UI.WHITE, "bold"))
		var fh := UI.hbox(6)
		fh.add_child(UI.icon("res://assets/ui/icon_fuel.png", 24))
		fh.add_child(UI.label("%d/%d" % [Game.fuel(id), Game.FUEL_MAX], 24, UI.WHITE, "title"))
		fv.add_child(fh)
		bar.add_child(fp)
		bar.add_child(UI.spacer(0, 0, true))
		if ev.is_empty():
			var fav := UI.button("FAVORITE" if Game.data.favorite != id else "★ FAVORITE", "yellow", 26, Vector2(230, 70))
			fav.pressed.connect(func():
				Game.data.favorite = id
				Game.save_game()
				m.toast("VOITURE FAVORITE : " + car.model))
			bar.add_child(fav)
		else:
			var td_box := UI.vbox(2)
			td_box.add_child(UI.label("TOUCHDRIVE", 18, UI.WHITE, "title"))
			var tdh := UI.hbox(0)
			var tdon := bool(Game.setting("touchdrive"))
			var oui := UI.button("OUI", "lime" if tdon else "dark", 18, Vector2(64, 34), Vector2.ZERO)
			var non := UI.button("NON", "red" if not tdon else "dark", 18, Vector2(64, 34), Vector2.ZERO)
			oui.pressed.connect(func():
				Game.set_setting("touchdrive", true)
				m.show_screen("cardetail", params, false))
			non.pressed.connect(func():
				Game.set_setting("touchdrive", false)
				m.show_screen("cardetail", params, false))
			tdh.add_child(oui)
			tdh.add_child(non)
			td_box.add_child(tdh)
			bar.add_child(td_box)
			var play := UI.button("JOUER", "yellow", 34, Vector2(240, 74))
			play.pressed.connect(func():
				var e2 := ev.duplicate(true)
				if e2.get("league", false):
					e2.cls = car.cls
					e2.rank = Game.car_rank(id) + 30
				m.start_event(e2, id, bool(Game.setting("touchdrive"))))
			bar.add_child(play)
	else:
		var info := UI.panel(Color(0, 0, 0, 0.8), UI.SKEW, Color(1, 1, 1, 0.2), 2, 10)
		info.add_child(UI.label("RÉCUPÈRE %d PLANS POUR DÉBLOQUER CETTE VOITURE (CARRIÈRE, ÉVÉNEMENTS, BOUTIQUE)" % need, 18, UI.WHITE, "title"))
		bar.add_child(info)
		bar.add_child(UI.spacer(0, 0, true))
		if Game.can_unlock(id):
			var un := UI.button("DÉBLOQUER", "lime", 30, Vector2(260, 74))
			un.pressed.connect(func():
				if Game.unlock_or_star(id):
					Sfx.play("unlock", 0.0)
					m.toast(car.model + " DÉBLOQUÉE !", UI.LIME)
					params["refresh"] = true
					m.show_screen("cardetail", params, false))
			bar.add_child(un)
		else:
			var buy := UI.button("ACHETER  %d" % CarsDB.TOKEN_PRICE[car.cls], "yellow", 26, Vector2(260, 74))
			buy.icon = load("res://assets/ui/icon_tokens.png")
			buy.expand_icon = true
			buy.add_theme_constant_override("icon_max_width", 28)
			buy.pressed.connect(func():
				if Game.spend_tokens(CarsDB.TOKEN_PRICE[car.cls]):
					Game.car_state(id).stars = 1
					Game.save_game()
					Sfx.play("unlock", 0.0)
					m.toast(car.model + " AJOUTÉE AU GARAGE !", UI.LIME)
					m.show_screen("cardetail", params, false)
				else:
					m.toast("PAS ASSEZ DE JETONS", UI.RED))
			bar.add_child(buy)
	return c


func _paint_dialog(id: String, params: Dictionary) -> void:
	var layer := ColorRect.new()
	layer.color = Color(0.02, 0.0, 0.06, 0.4)
	UI.full_rect(layer)
	m.root.add_child(layer)
	var p := UI.panel(Color(0.1, 0.04, 0.24, 0.97), Vector2.ZERO, UI.MAGENTA, 3, 16)
	p.mouse_filter = Control.MOUSE_FILTER_STOP
	UI.place(p, Control.PRESET_CENTER_LEFT, Vector2(40, -170), Vector2(440, 340))
	layer.add_child(p)
	var v := UI.vbox(12)
	p.add_child(v)
	v.add_child(UI.label("PEINTURE", 30, UI.WHITE, "title"))
	var grid := GridContainer.new()
	grid.columns = 8
	grid.add_theme_constant_override("h_separation", 8)
	grid.add_theme_constant_override("v_separation", 8)
	v.add_child(grid)
	for hexc in CarsDB.PAINTS:
		var col := Color(hexc)
		var b := Button.new()
		b.custom_minimum_size = Vector2(44, 44)
		b.focus_mode = Control.FOCUS_NONE
		b.add_theme_stylebox_override("normal", UI.box(col, Vector2.ZERO, Color(1, 1, 1, 0.5), 2, 6, 0))
		b.add_theme_stylebox_override("hover", UI.box(col, Vector2.ZERO, UI.WHITE, 3, 6, 0))
		b.add_theme_stylebox_override("pressed", UI.box(col, Vector2.ZERO, UI.YELLOW, 3, 6, 0))
		b.pressed.connect(func():
			Sfx.click()
			Game.set_car_color(id, col)
			m.set_showroom_car(id, col))
		grid.add_child(b)
	var ok := UI.button("TERMINÉ", "yellow", 24, Vector2(200, 54))
	ok.pressed.connect(func():
		layer.queue_free()
		m.show_screen("cardetail", params, false))
	v.add_child(ok)


# ---------------------------------------------------------------------------
# Garage
# ---------------------------------------------------------------------------

func garage(params: Dictionary) -> Control:
	var c := _root()
	m.set_title("GARAGE", "%d / %d VOITURES" % [Game.owned_cars().size(), CarsDB.all().size()])
	var tabs := UI.hbox(8)
	UI.place(tabs, Control.PRESET_TOP_RIGHT, Vector2(-520, 64), Vector2(480, 44))
	c.add_child(tabs)
	for cls in ["", "D", "C", "B", "A", "S"]:
		var b := UI.button("TOUTES" if cls == "" else cls, "yellow" if cls == _garage_cls else "dark", 20,
			Vector2(70 if cls != "" else 110, 40), Vector2.ZERO)
		var cc: String = cls
		b.pressed.connect(func():
			_garage_cls = cc
			m.show_screen("garage", {}, false))
		tabs.add_child(b)
	var cars := []
	for car in CarsDB.all():
		if _garage_cls == "" or car.cls == _garage_cls:
			cars.append(car)
	cars.sort_custom(func(a, b):
		var oa := Game.is_owned(a.id)
		var ob := Game.is_owned(b.id)
		if oa != ob:
			return oa
		var ca := CarsDB.class_index(a.cls)
		var cb := CarsDB.class_index(b.cls)
		if ca != cb:
			return ca < cb
		return Game.car_rank(a.id) < Game.car_rank(b.id))
	c.add_child(_card_grid(cars, func(car: Dictionary): m.show_screen("cardetail", {"car": car.id}), 118))
	return c


# ---------------------------------------------------------------------------
# Événements quotidiens / spéciaux / multijoueur
# ---------------------------------------------------------------------------

func _event_card(ev: Dictionary, title: String, sub: String, done: bool, cb: Callable) -> Control:
	var tdef := TracksDB.get_track(ev.track)
	var envc: Color = ENV_COLORS.get(tdef.env, UI.MAGENTA)
	var b := _flat_button(cb, Vector2(370, 430), Color(0.18, 0.06, 0.38, 0.95))
	var strip := ColorRect.new()
	strip.color = envc
	strip.position = Vector2(4, 4)
	strip.size = Vector2(362, 10)
	strip.mouse_filter = Control.MOUSE_FILTER_IGNORE
	b.add_child(strip)
	var v := UI.vbox(6)
	v.position = Vector2(18, 24)
	v.size = Vector2(334, 400)
	b.add_child(v)
	var tl := UI.shadow(UI.label(title, 28, UI.WHITE, "title"))
	tl.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	tl.custom_minimum_size = Vector2(334, 0)
	v.add_child(tl)
	v.add_child(UI.label(sub, 17, UI.YELLOW, "title"))
	v.add_child(UI.label(TracksDB.full_name(ev.track), 17, Color(1, 1, 1, 0.85), "bold"))
	v.add_child(UI.label(CareerDB.MODES.get(ev.mode, "") + "  •  CLASSE " + str(ev.cls), 16, Color(1, 1, 1, 0.75), "bold"))
	if str(ev.get("bp_car", "")) != "":
		var car := CarsDB.get_car(ev.bp_car)
		v.add_child(_thumb_rect(car.id, Vector2(330, 160)))
		v.add_child(UI.label("RÉCOMPENSE : %d PLANS %s" % [int(ev.bp_n), car.model], 17, UI.LIME, "title"))
	var rr := UI.panel(UI.LIME, Vector2.ZERO, Color(0, 0, 0, 0), 0, 4)
	rr.add_child(UI.label("RANG RECOMMANDÉ : %d" % int(ev.rank), 17, UI.BLACK, "title"))
	rr.size_flags_horizontal = Control.SIZE_SHRINK_BEGIN
	v.add_child(rr)
	if done:
		var dp := UI.panel(Color(0, 0, 0, 0.8), UI.SKEW, UI.LIME, 2, 6)
		dp.add_child(UI.label("TERMINÉ — REJOUABLE", 18, UI.LIME, "title"))
		dp.position = Vector2(150, 30)
		b.add_child(dp)
	return b


func daily() -> Control:
	var c := _root()
	m.set_title("ÉVÉNEMENTS QUOTIDIENS", "3 NOUVELLES ÉPREUVES CHAQUE JOUR")
	var h := UI.hbox(20)
	h.position = Vector2(60, 96)
	c.add_child(h)
	for ev in Game.daily_events():
		var e: Dictionary = ev
		h.add_child(_event_card(e, "ÉPREUVE DU JOUR", "PLANS EN RÉCOMPENSE", e.done, func():
			m.remember("carselect", {"event": e})
			m.show_screen("carselect", {"event": e})))
	return c


func special() -> Control:
	var c := _root()
	m.set_title("ÉVÉNEMENTS SPÉCIAUX", "RELÈVE LES DÉFIS POUR GAGNER DES PLANS DE VOITURES D'EXCEPTION")
	var sc := ScrollContainer.new()
	UI.place(sc, Control.PRESET_FULL_RECT, Vector2(40, 96), Vector2(-40, -100))
	sc.vertical_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	c.add_child(sc)
	var h := UI.hbox(20)
	sc.add_child(h)
	for sp in Game.SPECIALS:
		var ev := Game.special_event(sp)
		var stage := Game.special_stage(sp.id)
		h.add_child(_event_card(ev, sp.title, "ÉTAPE %d" % (stage + 1), false, func():
			m.remember("carselect", {"event": ev})
			m.show_screen("carselect", {"event": ev})))
	return c


func league() -> Control:
	var c := _root()
	m.set_title("MULTIJOUEUR", "COURSES CLASSÉES CONTRE DES PILOTES IA — AUCUNE CONNEXION REQUISE")
	var lg: Array = Game.league()
	var lp := int(Game.data.league_points)
	var p := UI.panel(Color(0.18, 0.06, 0.38, 0.95), UI.SKEW, UI.YELLOW, 2, 24)
	p.position = Vector2(80, 110)
	c.add_child(p)
	var v := UI.vbox(12)
	p.add_child(v)
	v.add_child(UI.shadow(UI.label("LIGUE " + str(lg[0]), 56, UI.YELLOW, "black")))
	v.add_child(UI.label("%d POINTS DE LIGUE" % lp, 26, UI.WHITE, "title"))
	var nxt: Array = []
	for l in Game.LEAGUES:
		if int(l[1]) > lp:
			nxt = l
			break
	if not nxt.is_empty():
		v.add_child(UI.label("PROCHAINE LIGUE : %s (%d PTS)" % [nxt[0], nxt[1]], 20, Color(1, 1, 1, 0.8), "bold"))
		v.add_child(UI.bar(float(lp - int(lg[1])) / maxf(1.0, float(int(nxt[1]) - int(lg[1]))), 420, 12, UI.YELLOW))
	v.add_child(UI.label("1ER : +35  •  2E : +22  •  3E : +12  •  4E : +4  •  5E : -6  •  6E : -12", 18, Color(1, 1, 1, 0.75), "bold"))
	var go := UI.button("TROUVER UNE COURSE", "yellow", 32, Vector2(420, 72))
	go.pressed.connect(func():
		var rng := RandomNumberGenerator.new()
		rng.randomize()
		var tracks := TracksDB.TRACKS.keys()
		var ev := {"id": "league", "track": tracks[rng.randi_range(0, tracks.size() - 1)], "mode": "classic",
			"cls": "", "rank": 0, "objectives": [{"type": "position", "value": 3}, {"type": "takedowns", "value": 1}],
			"credits": 4000 + lp * 4, "bp_car": "", "bp_n": 0, "opponents": 5, "league": true}
		m.remember("carselect", {"event": ev})
		m.show_screen("carselect", {"event": ev}))
	v.add_child(go)
	return c
