class_name CameraRig
extends Node3D


var target: Node3D
var yaw: = 0.0
var pitch: = -0.32
var distance: = 5.6
var arm: SpringArm3D
var camera: Camera3D
var shake_amt: = 0.0
var sensitivity: = 0.0032

func _ready() -> void :
	arm = SpringArm3D.new()
	arm.spring_length = distance
	arm.collision_mask = 1 | (1 << 7)
	arm.margin = 0.3
	add_child(arm)
	var sph: = SphereShape3D.new();sph.radius = 0.25
	arm.shape = sph
	camera = Camera3D.new()
	camera.fov = 62.0
	camera.far = 900.0
	arm.add_child(camera)

func rotate_by(dx: float, dy: float) -> void :
	yaw -= dx * sensitivity
	pitch = clampf(pitch - dy * sensitivity, -1.2, 0.45)

func shake(a: float) -> void :
	shake_amt = maxf(shake_amt, a)

func _unhandled_input(event: InputEvent) -> void :
	if event is InputEventMouseMotion and Input.mouse_mode == Input.MOUSE_MODE_CAPTURED:
		rotate_by(event.relative.x, event.relative.y)

func _process(delta: float) -> void :
	if target:
		var tp: = target.global_position + Vector3(0, 1.45, 0)
		global_position = global_position.lerp(tp, clampf(12.0 * delta, 0.0, 1.0))
	rotation = Vector3(pitch, yaw, 0)
	arm.spring_length = distance
	if shake_amt > 0.0:
		shake_amt = maxf(0.0, shake_amt - delta * 1.5)
		camera.h_offset = randf_range(-1, 1) * shake_amt * 0.4
		camera.v_offset = randf_range(-1, 1) * shake_amt * 0.4
	else:
		camera.h_offset = 0.0;camera.v_offset = 0.0
