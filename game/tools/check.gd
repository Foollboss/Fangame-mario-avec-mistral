extends Node
## Scène de vérification : charge tous les scripts (avec autoloads actifs).

func _ready() -> void:
	var files := []
	_scan("res://scripts", files)
	var bad := 0
	for f in files:
		var s = load(f)
		if s == null:
			print("FAIL ", f)
			bad += 1
	print("checked %d scripts, %d failed" % [files.size(), bad])
	get_tree().quit()


func _scan(dir: String, out: Array) -> void:
	var d := DirAccess.open(dir)
	for f in d.get_files():
		if f.ends_with(".gd"):
			out.append(dir + "/" + f)
	for sub in d.get_directories():
		_scan(dir + "/" + sub, out)
