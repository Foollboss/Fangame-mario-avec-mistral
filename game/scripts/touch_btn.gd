class_name TouchBtn
extends Node2D




var action: = ""
var texture_normal: Texture2D
var radius: = 0.0
var rect_size: = Vector2.ZERO
var finger: = -1

func _draw() -> void :
	if texture_normal:
		draw_texture(texture_normal, Vector2.ZERO, Color(1, 1, 1) if finger < 0 else Color(0.75, 0.85, 1.0))

func _input(event: InputEvent) -> void :
	if not is_visible_in_tree(): return
	var st: = event as InputEventScreenTouch
	if st == null: return
	if st.pressed:
		if finger == -1 and hit(st.position): _press(st.index)
	elif st.index == finger:
		_release()

func hit(p: Vector2) -> bool:
	var c: Vector2 = get_global_transform_with_canvas().affine_inverse() * p
	if radius > 0.0:
		var ctr: = texture_normal.get_size() * 0.5 if texture_normal else Vector2.ZERO
		return c.distance_to(ctr) <= radius
	return Rect2( - rect_size * 0.5, rect_size).has_point(c)

func is_pressed() -> bool:
	return finger != -1

func _press(i: int) -> void :
	finger = i
	if action != "": Input.action_press(action)
	queue_redraw()

func _release() -> void :
	finger = -1
	if action != "": Input.action_release(action)
	queue_redraw()

func _notification(what: int) -> void :
	if finger == -1: return
	if what == NOTIFICATION_EXIT_TREE or (what == NOTIFICATION_VISIBILITY_CHANGED and not is_visible_in_tree()):
		_release()
