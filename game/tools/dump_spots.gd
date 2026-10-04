extends SceneTree

func _init() -> void :
	var w: = World.new()
	w.load_grid()
	for i in w.camps.size(): w.camps[i].pos = w.snap(w.camps[i].pos)
	for i in w.seals.size(): w.seals[i] = w.snap(w.seals[i])
	for i in w.statues.size(): w.statues[i] = w.snap(w.statues[i])
	for wp in w.waypoints: wp.pos = w.snap(wp.pos)
	w.village = w.snap(w.village);w.mountain = w.snap(w.mountain);w.plateau = w.snap(w.plateau)
	w.lighthouse = w.snap(w.lighthouse);w.orchard = w.snap(w.orchard);w.cat_spot = w.snap(w.cat_spot)
	w._pick_spots()
	var out: = {"chests": [], "crystals": [], "apples": [], "roam": []}
	for p in w.chest_spots: out.chests.append([snappedf(p.x, 0.01), snappedf(p.z, 0.01)])
	for p in w.crystal_spots: out.crystals.append([snappedf(p.x, 0.01), snappedf(p.z, 0.01)])
	for p in w.apple_spots: out.apples.append([snappedf(p.x, 0.01), snappedf(p.z, 0.01)])
	for r in w.roam_spots: out.roam.append([snappedf(r.pos.x, 0.01), snappedf(r.pos.z, 0.01), r.biome])
	var f: = FileAccess.open("res://tools/v5_spots.json", FileAccess.WRITE);f.store_string(JSON.stringify(out));f.close()
	print("SPOTS chests=%d crystals=%d apples=%d roam=%d" % [out.chests.size(), out.crystals.size(), out.apples.size(), out.roam.size()])
	w.free()
	quit()
