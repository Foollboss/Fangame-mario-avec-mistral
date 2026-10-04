class_name CharMenu
extends Control
## Écran « Personnages » : modèle 3D du héros (rotation à la souris), fiche d'attributs,
## aptitudes et profil, sélection du héros actif.

signal closed

var ui: UI
var main: Node
var box: Control
var sel: = 0
var vp: SubViewport
var stage: Node3D
var model: Node3D
var model_ap: AnimationPlayer
var cam: Camera3D
var glow_disc: MeshInstance3D
var glow_mat: StandardMaterial3D
var rot_y: = 0.0
var dragging: = false
var name_l: Label
var title_l: Label
var elem_icon: TextureRect
var level_l: Label
var stars_l: Label
var tabs: GStyle.Tabs
var content: VBoxContainer
var portraits: Array = []
var play_btn: GStyle.Pill
var tint_rect: ColorRect
var _cache: = {}

const W: = 1280.0
const H: = 720.0

func setup(u: UI, m: Node) -> void :
	ui = u;main = m
	set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	mouse_filter = Control.MOUSE_FILTER_STOP
	visible = false
	add_child(GStyle.backdrop(false))
	tint_rect = ColorRect.new();tint_rect.set_anchors_preset(Control.PRESET_FULL_RECT);tint_rect.mouse_filter = Control.MOUSE_FILTER_IGNORE
	var gm: = ShaderMaterial.new(); var gs: = Shader.new()
	gs.code = "shader_type canvas_item;\nuniform vec4 col : source_color;\nvoid fragment(){ float d = length((UV - vec2(0.36, 0.55)) * vec2(1.6, 1.0)); COLOR = vec4(col.rgb, col.a * smoothstep(0.75, 0.0, d)); }"
	gm.shader = gs;tint_rect.material = gm;add_child(tint_rect)
	box = Control.new();box.size = Vector2(W, H);add_child(box)

	# --- scène 3D du héros
	var svc: = SubViewportContainer.new();svc.stretch = true;svc.position = Vector2(230, 20);svc.size = Vector2(520, 690)
	svc.mouse_filter = Control.MOUSE_FILTER_STOP;svc.gui_input.connect(_on_view_input);box.add_child(svc)
	vp = SubViewport.new();vp.own_world_3d = true;vp.transparent_bg = true;vp.msaa_3d = Viewport.MSAA_2X
	vp.size = Vector2i(520, 690);svc.add_child(vp)
	stage = Node3D.new();vp.add_child(stage)
	var env: = WorldEnvironment.new();env.environment = Environment.new()
	env.environment.background_mode = Environment.BG_CLEAR_COLOR
	env.environment.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
	env.environment.ambient_light_color = Color(0.66, 0.7, 0.86);env.environment.ambient_light_energy = 0.75
	stage.add_child(env)
	var sun: = DirectionalLight3D.new();sun.rotation_degrees = Vector3(-35, 35, 0);sun.light_energy = 1.05
	sun.light_color = Color(1.0, 0.96, 0.9);stage.add_child(sun)
	var back: = DirectionalLight3D.new();back.rotation_degrees = Vector3(-20, 200, 0);back.light_energy = 0.45
	back.light_color = Color(0.7, 0.8, 1.0);stage.add_child(back)
	cam = Camera3D.new();cam.fov = 30.0;cam.position = Vector3(0, 1.0, 4.4);stage.add_child(cam)
	cam.look_at(Vector3(0, 0.88, 0))
	glow_disc = MeshInstance3D.new(); var qm: = QuadMesh.new();qm.size = Vector2(2.4, 2.4);glow_disc.mesh = qm
	glow_disc.rotation_degrees.x = -90;glow_disc.position.y = 0.01
	glow_mat = StandardMaterial3D.new();glow_mat.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	glow_mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA;glow_mat.albedo_texture = _radial_tex()
	glow_disc.material_override = glow_mat;stage.add_child(glow_disc)

	# --- liste des héros (portraits)
	for i in HeroData.ORDER.size():
		var who: String = HeroData.ORDER[i]
		var pic: = ui._portrait(who, 78.0);pic.position = Vector2(60, 150 + i * 102)
		pic.mouse_filter = Control.MOUSE_FILTER_STOP;pic.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		pic.gui_input.connect( func(ev):
			if (ev is InputEventMouseButton and ev.pressed and ev.button_index == MOUSE_BUTTON_LEFT) or (ev is InputEventScreenTouch and ev.pressed):
				show_hero(i))
		box.add_child(pic);portraits.append(pic)

	# --- identité (en haut à gauche)
	elem_icon = TextureRect.new();elem_icon.expand_mode = TextureRect.EXPAND_IGNORE_SIZE;elem_icon.size = Vector2(46, 46)
	elem_icon.position = Vector2(60, 34);elem_icon.mouse_filter = Control.MOUSE_FILTER_IGNORE;box.add_child(elem_icon)
	name_l = GStyle.label("", 40, Color.WHITE, 6);name_l.position = Vector2(116, 22);box.add_child(name_l)
	title_l = GStyle.label("", 18, GStyle.GOLD_HI, 3);title_l.position = Vector2(118, 74);box.add_child(title_l)
	stars_l = GStyle.label("", 20, Color("ffcc4d"), 3);stars_l.position = Vector2(60, 100);box.add_child(stars_l)
	level_l = GStyle.label("", 18, GStyle.CREAM, 3);level_l.position = Vector2(176, 103);box.add_child(level_l)

	# --- panneau de droite
	var panel: = Panel.new();panel.position = Vector2(780, 30);panel.size = Vector2(460, 600)
	panel.add_theme_stylebox_override("panel", GStyle.sb(Color(0.07, 0.08, 0.13, 0.72), 16, Color(GStyle.GOLD, 0.22), 1))
	box.add_child(panel)
	tabs = GStyle.Tabs.new(["Attributs", "Aptitudes", "Profil"]);tabs.position = Vector2(24, 14);panel.add_child(tabs)
	tabs.changed.connect( func(_i): _fill())
	var sc: = ScrollContainer.new();sc.position = Vector2(14, 66);sc.size = Vector2(432, 520)
	sc.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED;panel.add_child(sc)
	content = VBoxContainer.new();content.custom_minimum_size = Vector2(420, 0);content.add_theme_constant_override("separation", 6)
	sc.add_child(content)
	play_btn = GStyle.Pill.new("Jouer ce héros", "○", true, 250.0);play_btn.position = Vector2(780, 648)
	play_btn.pressed.connect(_play_selected);box.add_child(play_btn)
	var back_btn: = GStyle.Pill.new("Retour", "✕", false, 190.0);back_btn.glyph_col = Color(0.6, 0.8, 1.0)
	back_btn.position = Vector2(1050, 648);back_btn.pressed.connect( func(): closed.emit());box.add_child(back_btn)
	var hint: = GStyle.label("Glisser pour faire pivoter", 14, Color(GStyle.CREAM, 0.5));hint.position = Vector2(400, 690);box.add_child(hint)

func _radial_tex() -> ImageTexture:
	var n: = 128
	var img: = Image.create_empty(n, n, false, Image.FORMAT_RGBA8)
	for y in n:
		for x in n:
			var d: = Vector2(x - n * 0.5 + 0.5, y - n * 0.5 + 0.5).length() / (n * 0.5)
			var a: = clampf(1.0 - d, 0.0, 1.0)
			var ring: = clampf(1.0 - absf(d - 0.78) * 30.0, 0.0, 1.0)
			img.set_pixel(x, y, Color(1, 1, 1, a * a * 0.55 + ring * 0.6))
	return ImageTexture.create_from_image(img)

func layout(vs: Vector2) -> void :
	var sc: = minf(vs.x / W, vs.y / H)
	box.scale = Vector2(sc, sc)
	box.position = (vs - Vector2(W, H) * sc) * 0.5

func open() -> void :
	visible = true
	show_hero(main.party.active)
	modulate.a = 0.0
	create_tween().tween_property(self, "modulate:a", 1.0, 0.2)

func close() -> void :
	visible = false

func _model_for(who: String) -> Node3D:
	if _cache.has(who): return _cache[who]
	var m: Node3D = load("res://assets/%s.glb" % who).instantiate()
	Toon.apply_char(m, 0.0035)
	var skel: Skeleton3D = m.find_children("*", "Skeleton3D", true, false)[0]
	var wname: String = {"kael": "Sword_Kael", "lyra": "Sword_Lyra", "zahara": "Staff_Zahara"}.get(who, "")
	if wname != "":
		var lib: Node3D = load("res://assets/weapons.glb").instantiate()
		var src: = lib.get_node_or_null(wname)
		if src and Bones.idx(skel, "weapon.R") >= 0:
			var sock: = BoneAttachment3D.new();sock.bone_name = Bones.find(skel, "weapon.R");skel.add_child(sock)
			var w: Node3D = src.duplicate();sock.add_child(w);w.transform = Transform3D.IDENTITY
			Toon.apply_char(w, 0.002, 0.7)
		lib.free()
	var ap: AnimationPlayer = m.find_children("*", "AnimationPlayer", true, false)[0]
	for n in ["Idle", "Idle_Combat"]:
		if ap.has_animation(n): ap.get_animation(n).loop_mode = Animation.LOOP_LINEAR
	_cache[who] = m
	return m

func show_hero(i: int) -> void :
	sel = i
	var who: String = HeroData.ORDER[i]
	var d: Dictionary = HeroData.HEROES[who]
	if model and model.get_parent(): stage.remove_child(model)
	model = _model_for(who)
	stage.add_child(model)
	model_ap = model.find_children("*", "AnimationPlayer", true, false)[0]
	model_ap.play("Idle_Combat" if who != "kaelith" else "Idle")
	rot_y = 0.35
	model.rotation.y = rot_y
	var col: = FX.element_color(d.elem_id)
	glow_mat.albedo_color = Color(col.r, col.g, col.b, 0.85)
	(tint_rect.material as ShaderMaterial).set_shader_parameter("col", Color(col.r, col.g, col.b, 0.22))
	name_l.text = main.party.chars[i].name
	title_l.text = d.title
	elem_icon.texture = ui.icons.get("ic_el_" + d.elem_id)
	elem_icon.modulate = col.lightened(0.25)
	stars_l.text = "★".repeat(int(d.stars))
	level_l.text = "Niv. %d / 30" % main.rank
	for k in portraits.size():
		var pm: ShaderMaterial = (portraits[k] as TextureRect).material
		pm.set_shader_parameter("ring_col", Color(1.0, 0.86, 0.5, 1.0) if k == i else Color(1, 1, 1, 0.35))
		(portraits[k] as TextureRect).modulate = Color(1, 1, 1) if k == i else Color(0.75, 0.75, 0.8)
	play_btn.disabled = i == main.party.active or not main.party.chars[i].alive
	play_btn.text = "Héros actif" if i == main.party.active else "Jouer ce héros"
	_fill()

func _fill() -> void :
	for c in content.get_children(): c.queue_free()
	var who: String = HeroData.ORDER[sel]
	var d: Dictionary = HeroData.HEROES[who]
	var c: Dictionary = main.party.chars[sel]
	match tabs.current:
		0:
			var rows: = [
				["PV max", "%d" % int(c.max_hp)], ["PV actuels", "%d" % int(c.hp)], ["ATQ", "%d" % int(c.atk)],
				["Bonus d'ATQ actif", "+%d %%" % int(c.atk_buff * 100.0)], ["Élément", d.element], ["Arme", d.weapon],
				["Énergie du déchaînement", "%d / %d" % [int(c.energy), int(c.energy_max)]],
				["Recharge compétence", "%.1f s" % c.skill_cd_max], ["Recharge déchaînement", "%.1f s" % c.burst_cd_max],
				["Combo d'attaques", "%d coups" % int(c.combo_len)],
			]
			for k in rows.size(): content.add_child(GStyle.stat_row(rows[k][0], rows[k][1], k % 2 == 0))
		1:
			for t in d.talents:
				var row: = HBoxContainer.new();row.add_theme_constant_override("separation", 14)
				var ic: = TextureRect.new();ic.texture = ui.icons.get("%s_%s" % [who, t[0]])
				ic.expand_mode = TextureRect.EXPAND_IGNORE_SIZE;ic.custom_minimum_size = Vector2(64, 64)
				ic.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED;ic.size_flags_vertical = Control.SIZE_SHRINK_BEGIN
				if ic.texture:
					var m: = ShaderMaterial.new();m.shader = ui.circle_shader;ic.material = m
					m.set_shader_parameter("ring_col", Color(GStyle.GOLD, 0.9))
				row.add_child(ic)
				var col: = VBoxContainer.new();col.size_flags_horizontal = Control.SIZE_EXPAND_FILL;row.add_child(col)
				col.add_child(GStyle.label(t[1], 14, GStyle.GOLD))
				col.add_child(GStyle.label(t[2], 20, Color.WHITE))
				var ds: = GStyle.label(t[3], 15, Color(GStyle.CREAM, 0.85));ds.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
				ds.custom_minimum_size = Vector2(320, 0);col.add_child(ds)
				content.add_child(row)
				content.add_child(GStyle.Divider.new(400.0))
		2:
			var big: = GStyle.label(d.title, 22, GStyle.GOLD_HI);content.add_child(big)
			var lore: = GStyle.label(d.lore, 17, GStyle.CREAM);lore.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
			lore.custom_minimum_size = Vector2(410, 0);content.add_child(lore)
			content.add_child(GStyle.Divider.new(400.0))
			content.add_child(GStyle.stat_row("Élément", d.element, true))
			content.add_child(GStyle.stat_row("Arme", d.weapon))
			content.add_child(GStyle.stat_row("Rareté", "★".repeat(int(d.stars)), true))

func _play_selected() -> void :
	if main.party.chars[sel].alive and sel != main.party.active:
		main.party.switch_cd = 0.0;main.party.attack_lock = 0.0;main.party.cast_t = 0.0
		main.party.switch_to(sel)
		main.audio.play("waypoint", -6.0)
		show_hero(sel)

func _on_view_input(ev: InputEvent) -> void :
	if ev is InputEventMouseButton and ev.button_index == MOUSE_BUTTON_LEFT:
		dragging = ev.pressed
	elif ev is InputEventScreenTouch:
		dragging = ev.pressed
	elif (ev is InputEventMouseMotion and dragging) or ev is InputEventScreenDrag:
		rot_y += ev.relative.x * 0.012

func _process(delta: float) -> void :
	if not visible or model == null: return
	if not dragging: rot_y += delta * 0.15
	model.rotation.y = lerp_angle(model.rotation.y, rot_y, clampf(10.0 * delta, 0.0, 1.0))
