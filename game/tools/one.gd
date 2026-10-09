extends SceneTree
func _init():
	var s = load(OS.get_cmdline_user_args()[0])
	print("loaded ", s)
	quit()
