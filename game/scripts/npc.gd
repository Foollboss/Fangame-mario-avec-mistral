class_name NPC
extends Node3D


var id: = ""
var display: = ""
var color: = Color(1, 0.9, 0.6)
var head: Node3D
var body: Node3D
var marker: Label3D
var name_label: Label3D
var _t: = 0.0
var target: Node3D
var home_yaw: = 0.0

func setup(npc_id: String, shown_name: String, model_name: String, col: Color, lib: Node3D) -> void :
	id = npc_id;display = shown_name;color = col
	add_to_group("npcs")
	var b: = lib.get_node_or_null(model_name)
	var h: = lib.get_node_or_null(model_name + "_Head")
	if b:
		body = b.duplicate();body.position = Vector3.ZERO;add_child(body)
	if h:
		head = h.duplicate();add_child(head)
	Toon.apply(self, true, true, 0.007)
	name_label = Label3D.new();name_label.text = shown_name;name_label.font_size = 34;name_label.pixel_size = 0.008
	name_label.billboard = BaseMaterial3D.BILLBOARD_ENABLED;name_label.modulate = col;name_label.outline_size = 9
	name_label.outline_modulate = Color(0.04, 0.05, 0.12, 0.85);name_label.no_depth_test = false
	name_label.position = Vector3(0, 2.25, 0);add_child(name_label)
	marker = Label3D.new();marker.font_size = 96;marker.pixel_size = 0.01;marker.billboard = BaseMaterial3D.BILLBOARD_ENABLED
	marker.outline_size = 16;marker.outline_modulate = Color(0.1, 0.05, 0.0, 0.9);marker.position = Vector3(0, 2.75, 0)
	marker.modulate = Color(1.0, 0.82, 0.3);marker.visible = false;add_child(marker)
	var col_body: = StaticBody3D.new(); var cs: = CollisionShape3D.new(); var cap: = CapsuleShape3D.new()
	cap.radius = 0.35;cap.height = 1.7;cs.shape = cap;cs.position.y = 0.85;col_body.add_child(cs);add_child(col_body)


func recolor(cloth: Color, cloth2: Color, hair: Color) -> void :
	_set_col(body, 0, cloth);_set_col(body, 1, cloth2)
	_set_col(head, 1, hair);_set_col(head, 4, cloth2)

func _set_col(n: Node, surf: int, c: Color) -> void :
	var mi: = n as MeshInstance3D
	if mi == null or mi.mesh == null or surf >= mi.mesh.get_surface_count(): return
	var m: = mi.get_surface_override_material(surf) as StandardMaterial3D
	if m: m.albedo_color = c * Color(0.93, 0.93, 0.95)

func set_marker(kind: String) -> void :

	marker.visible = kind != ""
	marker.text = kind
	marker.modulate = Color(1.0, 0.82, 0.3) if kind == "!" else Color(0.55, 0.9, 1.0)

func _process(delta: float) -> void :
	_t += delta
	if body:
		body.scale.y = 1.0 + sin(_t * 2.1) * 0.012
	if marker.visible:
		marker.position.y = 2.75 + sin(_t * 3.0) * 0.08
	if head and target:
		var to: = target.global_position - global_position;to.y = 0
		var want: = 0.0
		if to.length() < 7.0:
			want = wrapf(atan2(to.x, to.z) - global_rotation.y, - PI, PI)
			want = clampf(want, -1.0, 1.0)
		head.rotation.y = lerp_angle(head.rotation.y, want, 5.0 * delta)

	if target:
		name_label.visible = target.global_position.distance_to(global_position) < 18.0
