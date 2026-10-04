extends SceneTree



const MAP: = 1280

func _init() -> void :
	var t0: = Time.get_ticks_msec()
	var w: = World.new()
	w.bake("res://assets")
	print("BAKE grid ", Time.get_ticks_msec() - t0, " ms")
	t0 = Time.get_ticks_msec()
	_map(w)
	print("BAKE map ", Time.get_ticks_msec() - t0, " ms")
	w.free()
	quit()

func _map(w: World) -> void :
	var img: = Image.create_empty(MAP, MAP, false, Image.FORMAT_RGB8)
	var light: = Vector3(-1.0, 1.6, -1.2).normalized()
	var mpp: = World.SIZE / MAP
	for py in MAP:
		for px in MAP:
			var x: = - World.HALF + (px + 0.5) * mpp
			var z: = - World.HALF + (py + 0.5) * mpp
			var h: = w.height_at(x, z)
			var col: Color
			var in_lake: = Vector2(x - w.lake.x, z - w.lake.z).length() < 40.0 and h < World.LAKE_Y
			var in_swamp: = h < World.SWAMP_Y and Vector2(x - w.swamp_center().x, z - w.swamp_center().z).length() < w.swamp_radius()
			var in_lava: = false
			for lp in World.LAVA_POOLS:
				if Vector2(x - lp[0], z - lp[1]).length() < float(lp[2]) * 0.95: in_lava = true
			if in_lava:
				col = Color(1.0, 0.42, 0.12)
			elif in_swamp:
				col = Color(0.28, 0.44, 0.32).lerp(Color(0.16, 0.3, 0.22), smoothstep(0.0, 1.0, World.SWAMP_Y - h))
			elif in_lake:
				col = Color(0.36, 0.66, 0.78).lerp(Color(0.18, 0.46, 0.66), smoothstep(0.0, 2.5, World.LAKE_Y - h))
			elif h < World.SEA_Y:
				var depth: = World.SEA_Y - h
				col = Color(0.52, 0.8, 0.86).lerp(Color(0.16, 0.4, 0.62), smoothstep(0.0, 5.5, depth))
			else:

				var fx: = clampf((x + World.HALF) / World.STEP, 0.0, World.N - 1.001)
				var fz: = clampf((z + World.HALF) / World.STEP, 0.0, World.N - 1.001)
				var i: = int(fx); var j: = int(fz)
				var c00: = _c(w, i, j); var c10: = _c(w, i + 1, j); var c01: = _c(w, i, j + 1); var c11: = _c(w, i + 1, j + 1)
				col = c00.lerp(c10, fx - i).lerp(c01.lerp(c11, fx - i), fz - j)
				var n: = w.normal_at(x, z)
				var shade: = clampf(n.dot(light), 0.0, 1.0)
				col = col * (0.72 + 0.42 * shade)

				var cl: = fposmod(h, 6.0)
				if cl < 0.35 and h > 3.0: col = col.darkened(0.12)

				if h < 0.6: col = col.lerp(Color(0.95, 0.9, 0.75), 0.25)
			img.set_pixel(px, py, Color(clampf(col.r, 0, 1), clampf(col.g, 0, 1), clampf(col.b, 0, 1)))

	var out: = img.duplicate()
	for py in range(1, MAP - 1):
		for px in range(1, MAP - 1):
			var x: = - World.HALF + (px + 0.5) * mpp
			var z: = - World.HALF + (py + 0.5) * mpp
			var land: = w.height_at(x, z) >= World.SEA_Y
			var land2: = w.height_at(x + mpp, z) >= World.SEA_Y
			var land3: = w.height_at(x, z + mpp) >= World.SEA_Y
			if land != land2 or land != land3:
				out.set_pixel(px, py, Color(0.3, 0.26, 0.2))
	out.save_webp("res://ui/map.webp", true, 0.88)

func _c(w: World, i: int, j: int) -> Color:
	var g: = (clampi(j, 0, World.N - 1) * World.N + clampi(i, 0, World.N - 1)) * 4
	return Color.from_rgba8(w.cmap[g], w.cmap[g + 1], w.cmap[g + 2])
