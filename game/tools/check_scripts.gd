extends SceneTree
func _init() -> void :
	for f in ["fx", "toon", "world", "enemy", "seal", "npc", "quests", "daynight", "audio", "party", "camera_rig", "map_ui", "ui", "totem", "dungeon", "grass", "main"]:
		var s = load("res://scripts/%s.gd" % f)
		print("CHECK ", f, " ", "ok" if s != null and s.can_instantiate() else "FAIL")
	quit()
