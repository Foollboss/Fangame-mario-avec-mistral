extends Node
## Outil de test : ouvre le menu et capture chaque écran.

var out := "/tmp"
var menu: Node
var plan := []

func _ready() -> void:
	for a in OS.get_cmdline_user_args():
		var kv := a.split("=")
		if kv.size() == 2 and kv[0] == "out":
			out = kv[1]
	var sc: PackedScene = load("res://scenes/menu.tscn")
	menu = sc.instantiate()
	get_tree().root.add_child.call_deferred(menu)
	var ev := CareerDB.get_event("c1s1e1")
	plan = [["title", {}], ["home", {}], ["career", {}], ["season", {"season": "c1s1"}], ["carselect", {"event": ev}],
		["cardetail", {"car": "lancer_evo", "event": ev}], ["garage", {}], ["shop", {}], ["pass", {}],
		["daily", {}], ["special", {}], ["league", {}], ["objectives", {}], ["profile", {}], ["settings", {}],
		["cardetail", {"car": "jesko"}]]
	await get_tree().create_timer(1.0).timeout
	var i := 0
	for p in plan:
		menu.show_screen(p[0], p[1])
		await get_tree().create_timer(1.2).timeout
		await RenderingServer.frame_post_draw
		var img := get_viewport().get_texture().get_image()
		i += 1
		img.save_png(out + "/menu_%02d_%s.png" % [i, p[0]])
		print("SHOT ", p[0])
	get_tree().quit()
