extends SceneTree
func _init() -> void :
	var w: = World.new()
	w._setup_flatten()
	var pts: = {"village": w.village, "mountain": w.mountain, "plateau": w.plateau, "lake": w.lake, "lighthouse": w.lighthouse, 
		"orchard": w.orchard, "cat": w.cat_spot}
	for i in w.statues.size(): pts["statue%d" % i] = w.statues[i]
	for i in w.seals.size(): pts["seal%d" % i] = w.seals[i]
	for wp in w.waypoints: pts["wp " + wp.name] = wp.pos
	for i in w.camps.size(): pts["camp%d" % i] = w.camps[i].pos
	for k in pts:
		var p: Vector3 = pts[k]
		var ang: = atan2(p.z, p.x)
		print("POI %-28s r=%5.1f coast=%5.1f raw=%6.2f" % [k, Vector2(p.x, p.z).length(), w.coast_radius(ang), w.raw_height(p.x, p.z)])
	w.free()
	quit()
