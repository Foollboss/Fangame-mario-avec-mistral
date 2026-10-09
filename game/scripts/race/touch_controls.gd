class_name TouchControls
extends CanvasLayer
## Commandes tactiles multi-doigts : direction (boutons ou inclinaison), nitro, drift, glissements TouchDrive.

signal swipe(dir: int)

var mode := "buttons"      # buttons | tilt
var touchdrive := false
var _pad: Control
var _buttons := {}         # nom -> {center, radius, action, tex, pressed}
var _touch := {}           # index -> nom du bouton
var _swipe_start := {}     # index -> position
var tilt_steer := 0.0


func setup(p_mode: String, p_touchdrive: bool = false) -> void:
	mode = p_mode if p_mode == "tilt" else "buttons"
	touchdrive = p_touchdrive
	layer = 6
	_pad = Control.new()
	UI.full_rect(_pad)
	_pad.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_pad.draw.connect(_on_draw)
	add_child(_pad)
	_buttons.clear()
	# flèches de direction à gauche (aussi en TouchDrive, pour reprendre la main), DRIFT + NITRO à droite
	if mode == "buttons":
		_add("left", "steer_left", "res://assets/ui/btn_left.png", 100.0)
		_add("right", "steer_right", "res://assets/ui/btn_right.png", 100.0)
	_add("nitro", "nitro", "res://assets/ui/btn_nitro.png", 112.0)
	_add("drift", "drift", "res://assets/ui/btn_drift.png", 84.0)
	get_viewport().size_changed.connect(_layout)
	_layout()


func _add(nm: String, action: String, tex: String, radius: float) -> void:
	_buttons[nm] = {"center": Vector2.ZERO, "radius": radius, "action": action, "tex": load(tex), "pressed": false}


func _layout() -> void:
	var vs := get_viewport().get_visible_rect().size
	var safe := UI.safe_margins()
	var l := 40.0 + safe.x
	var r := 40.0 + safe.z
	if _buttons.has("left"):
		_buttons.left.center = Vector2(l + 100.0, vs.y - 125.0)
		_buttons.right.center = Vector2(l + 320.0, vs.y - 125.0)
	_buttons.nitro.center = Vector2(vs.x - r - 112.0, vs.y - 130.0)
	_buttons.drift.center = Vector2(vs.x - r - 320.0, vs.y - 190.0)
	_pad.queue_redraw()


func _on_draw() -> void:
	for nm in _buttons:
		var b: Dictionary = _buttons[nm]
		var rad: float = b.radius * (0.92 if b.pressed else 1.0)
		var rect := Rect2(b.center - Vector2(rad, rad), Vector2(rad, rad) * 2.0)
		_pad.draw_texture_rect(b.tex, rect, false, Color(1, 1, 1, 0.95 if b.pressed else 0.55))


func _hit(pos: Vector2) -> String:
	for nm in _buttons:
		var b: Dictionary = _buttons[nm]
		if pos.distance_to(b.center) <= b.radius * 1.15:
			return nm
	# zones larges : moitié gauche (direction) pour le mode boutons
	if mode == "buttons" and _buttons.has("left"):
		var vs := get_viewport().get_visible_rect().size
		if pos.x < vs.x * 0.33 and pos.y > vs.y * 0.45:
			return "left" if pos.x < (_buttons.left.center.x + _buttons.right.center.x) * 0.5 else "right"
	return ""


func _press(nm: String, on: bool) -> void:
	if not _buttons.has(nm):
		return
	var b: Dictionary = _buttons[nm]
	if b.pressed == on:
		return
	b.pressed = on
	if on:
		Input.action_press(b.action)
	else:
		Input.action_release(b.action)
	_pad.queue_redraw()


func _input(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		if event.pressed:
			var nm := _hit(event.position)
			if nm != "":
				_touch[event.index] = nm
				_press(nm, true)
			else:
				_swipe_start[event.index] = event.position
		else:
			if _touch.has(event.index):
				var nm2: String = _touch[event.index]
				_touch.erase(event.index)
				if not _touch.values().has(nm2):
					_press(nm2, false)
			if _swipe_start.has(event.index):
				var d: Vector2 = event.position - _swipe_start[event.index]
				if absf(d.x) > 60.0 and absf(d.x) > absf(d.y):
					swipe.emit(1 if d.x > 0 else -1)
				_swipe_start.erase(event.index)
	elif event is InputEventScreenDrag:
		if _touch.has(event.index) and mode == "buttons":
			var nm3: String = _touch[event.index]
			if nm3 == "left" or nm3 == "right":
				var now := _hit(event.position)
				if (now == "left" or now == "right") and now != nm3:
					_press(nm3, false)
					_touch[event.index] = now
					_press(now, true)


func release_all() -> void:
	for nm in _buttons:
		_press(nm, false)
	_touch.clear()


func steer_value() -> float:
	if mode == "tilt":
		var acc := Input.get_accelerometer()
		# Godot compense la rotation de l'écran : en paysage, x = axe horizontal de l'écran
		# (téléphone incliné vers la droite -> x > 0)
		var t := clampf(acc.x / 4.5, -1.0, 1.0)
		if absf(t) < 0.08:
			t = 0.0
		tilt_steer = lerpf(tilt_steer, t, 0.3)
		return tilt_steer
	return 0.0
