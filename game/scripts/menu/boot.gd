extends Control
## Écran de démarrage -> menu principal.

func _ready() -> void:
	await get_tree().process_frame
	get_tree().change_scene_to_file("res://scenes/menu.tscn")
