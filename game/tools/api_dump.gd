extends SceneTree
func _init() -> void :
	for cls in ["SpringBoneSimulator3D", "SpringBoneCollisionCapsule3D", "SpringBoneCollision3D"]:
		print("== ", cls, " exists=", ClassDB.class_exists(cls))
		if not ClassDB.class_exists(cls): continue
		for m in ClassDB.class_get_method_list(cls, true):
			var args: = []
			for a in m.args: args.append("%s:%s" % [a.name, type_string(a.type)])
			print("  ", m.name, "(", ", ".join(args), ")")
	quit()
