class_name Track
extends RefCounted
## Tracé du circuit échantillonné tous les mètres (repère de Frenet).
## s = distance le long de l'axe, x = décalage latéral (+ = droite).

const LANE_W := 3.6
const SEC_NAMES := ["city", "bridge", "beach", "highway", "canyon", "open", "tunnel"]

var def: Dictionary
var env: Dictionary
var length := 0.0
var n := 0
var pos := PackedVector3Array()
var fwd := PackedVector3Array()
var right := PackedVector3Array()
var up := PackedVector3Array()
var curv := PackedFloat32Array()
var heading := PackedFloat32Array()
var wl := PackedFloat32Array()
var wr := PackedFloat32Array()
var sec := PackedByteArray()
var lanes := 4
var two_way := false
var ramps: Array = []
var _ramp_buckets := {}
var intersections: Array = []
var runoff := 320.0
var rng := RandomNumberGenerator.new()


func build(track_def: Dictionary) -> void:
	def = track_def
	env = TracksDB.ENVS[def.env]
	lanes = int(def.lanes)
	two_way = bool(def.two_way)
	rng.seed = int(def.seed)
	var default_sec := SEC_NAMES.find(def.get("default_sec", "city"))
	var p2 := Vector2.ZERO
	var th := 0.0
	var pts2: Array[Vector2] = []
	var ths: Array[float] = []
	var ks: Array[float] = []
	var secs: Array[int] = []
	var h_ctrl: Array = [[0.0, 0.0]]
	var acc_s := 0.0
	var acc_h := 0.0
	pts2.append(p2)
	ths.append(th)
	ks.append(0.0)
	secs.append(default_sec)
	for seg in def.segments:
		var kind: String = seg[0]
		var seg_len := 0.0
		var k := 0.0
		var dh := 0.0
		var opts: Dictionary = {}
		if kind == "s":
			seg_len = float(seg[1])
			dh = float(seg[2])
			if seg.size() > 3:
				opts = seg[3]
		else:
			var ang := deg_to_rad(float(seg[1]))
			var r := float(seg[2])
			seg_len = absf(ang) * r
			k = signf(ang) / r
			dh = float(seg[3])
			if seg.size() > 4:
				opts = seg[4]
		var sc := SEC_NAMES.find(opts.get("sec", def.get("default_sec", "city")))
		var steps := int(round(seg_len))
		for i in steps:
			th += k
			p2 += Vector2(sin(th), -cos(th))
			pts2.append(p2)
			ths.append(th)
			ks.append(k)
			secs.append(sc)
		acc_s += steps
		acc_h += dh
		h_ctrl.append([acc_s, acc_h])
	# zone de dégagement après l'arrivée
	var last_sec: int = secs[secs.size() - 1]
	for i in int(runoff):
		p2 += Vector2(sin(th), -cos(th))
		pts2.append(p2)
		ths.append(th)
		ks.append(0.0)
		secs.append(last_sec)
	acc_s += runoff
	h_ctrl.append([acc_s, acc_h])
	n = pts2.size()
	length = float(n - 1)
	# hauteurs : linéaire par morceaux puis lissage (crêtes encore marquées -> sauts)
	var hs := PackedFloat32Array()
	hs.resize(n)
	var ci := 0
	for i in n:
		while ci < h_ctrl.size() - 2 and i > h_ctrl[ci + 1][0]:
			ci += 1
		var a: Array = h_ctrl[ci]
		var b: Array = h_ctrl[mini(ci + 1, h_ctrl.size() - 1)]
		var t := 0.0 if b[0] == a[0] else clampf((i - a[0]) / (b[0] - a[0]), 0.0, 1.0)
		hs[i] = lerpf(a[1], b[1], t)
	hs = _smooth(hs, 7)
	var ksm := PackedFloat32Array()
	ksm.resize(n)
	for i in n:
		ksm[i] = ks[i]
	ksm = _smooth(ksm, 14)
	pos.resize(n)
	fwd.resize(n)
	right.resize(n)
	up.resize(n)
	curv = ksm
	heading.resize(n)
	wl.resize(n)
	wr.resize(n)
	sec.resize(n)
	for i in n:
		pos[i] = Vector3(pts2[i].x, hs[i], pts2[i].y)
		heading[i] = ths[i]
		sec[i] = secs[i]
	var half := lanes * LANE_W * 0.5 + 0.6
	for i in n:
		var a := pos[maxi(i - 1, 0)]
		var b := pos[mini(i + 1, n - 1)]
		var f := (b - a).normalized()
		fwd[i] = f
		var r := f.cross(Vector3.UP).normalized()
		right[i] = r
		up[i] = r.cross(f).normalized()
		wl[i] = half
		wr[i] = half
	_place_ramps()
	_place_intersections()


func _smooth(arr: PackedFloat32Array, radius: int) -> PackedFloat32Array:
	var out := PackedFloat32Array()
	out.resize(arr.size())
	var m := arr.size()
	for i in m:
		var acc := 0.0
		var cnt := 0
		for j in range(maxi(0, i - radius), mini(m, i + radius + 1)):
			acc += arr[j]
			cnt += 1
		out[i] = acc / cnt
	return out


# ---------------------------------------------------------------------------
# Requêtes
# ---------------------------------------------------------------------------

func _idx(s: float) -> int:
	return clampi(int(s), 0, n - 2)


func point(s: float, x: float = 0.0, h: float = 0.0) -> Vector3:
	var i := _idx(s)
	var f := clampf(s - i, 0.0, 1.0)
	var p := pos[i].lerp(pos[i + 1], f)
	var r := right[i].lerp(right[i + 1], f)
	return p + r * x + Vector3.UP * h


func road_y(s: float) -> float:
	var i := _idx(s)
	return lerpf(pos[i].y, pos[i + 1].y, clampf(s - i, 0.0, 1.0))


func forward_at(s: float) -> Vector3:
	var i := _idx(s)
	return fwd[i].lerp(fwd[i + 1], clampf(s - i, 0.0, 1.0)).normalized()


func right_at(s: float) -> Vector3:
	var i := _idx(s)
	return right[i].lerp(right[i + 1], clampf(s - i, 0.0, 1.0)).normalized()


func curvature(s: float) -> float:
	var i := _idx(s)
	return lerpf(curv[i], curv[i + 1], clampf(s - i, 0.0, 1.0))


func half_left(s: float) -> float:
	return wl[_idx(s)]


func half_right(s: float) -> float:
	return wr[_idx(s)]


func section_at(s: float) -> String:
	return SEC_NAMES[sec[_idx(s)]]


## Base orientée (avant = -Z) au point s
func basis_at(s: float) -> Basis:
	var f := forward_at(s)
	var r := right_at(s)
	var u := r.cross(f).normalized()
	return Basis(r, u, -f)


func lane_center(k: int) -> float:
	var total := lanes * LANE_W
	return -total * 0.5 + LANE_W * (k + 0.5)


func is_oncoming_lane(k: int) -> bool:
	return two_way and k < lanes / 2


## Décalage du sol dû aux rampes : Vector3(hauteur, pente latérale, index rampe ou -1)
func ramp_at(s: float, x: float) -> Vector3:
	var b := int(s / 50.0)
	for bi in [b - 1, b]:
		if not _ramp_buckets.has(bi):
			continue
		for ri in _ramp_buckets[bi]:
			var r: Dictionary = ramps[ri]
			var s0: float = r.s0
			if s < s0 or s > s0 + r.len:
				continue
			var dx: float = x - r.x
			if absf(dx) > r.hw:
				continue
			var u: float = (s - s0) / r.len
			match r.kind:
				"ramp":
					return Vector3(r.h * u, 0.0, ri)
				"barrel_r":
					var v: float = (dx + r.hw) / (2.0 * r.hw)
					return Vector3(r.h * u * v, r.h * u / (2.0 * r.hw), ri)
				"barrel_l":
					var v2: float = (r.hw - dx) / (2.0 * r.hw)
					return Vector3(r.h * u * v2, -r.h * u / (2.0 * r.hw), ri)
	return Vector3(0.0, 0.0, -1.0)


func ground_y(s: float, x: float) -> float:
	return road_y(s) + ramp_at(s, x).x


## Rampes dans une fenêtre [s0, s1]
func ramps_between(s0: float, s1: float) -> Array:
	var out := []
	for r in ramps:
		if r.s0 + r.len >= s0 and r.s0 <= s1:
			out.append(r)
	return out


# ---------------------------------------------------------------------------
# Placement procédural
# ---------------------------------------------------------------------------

func _straight_enough(s0: float, s1: float) -> bool:
	var i0 := clampi(int(s0), 0, n - 1)
	var i1 := clampi(int(s1), 0, n - 1)
	for i in range(i0, i1):
		if absf(curv[i]) > 1.0 / 450.0:
			return false
		if SEC_NAMES[sec[i]] == "tunnel":
			return false
	return true


func _place_ramps() -> void:
	ramps.clear()
	_ramp_buckets.clear()
	var every := float(def.get("ramp_every", 260.0))
	var s := 230.0
	var count := 0
	while s < length - runoff - 230.0:
		var kind := "ramp"
		var roll := rng.randf()
		if roll < 0.38:
			kind = "barrel_r" if rng.randf() < 0.5 else "barrel_l"
		var r_len := 9.0 if kind == "ramp" else 8.0
		if _straight_enough(s - 20.0, s + r_len + 70.0):
			var lane := rng.randi_range(0, lanes - 1)
			if two_way:
				lane = rng.randi_range(lanes / 2, lanes - 1) if rng.randf() < 0.75 else lane
			var x := lane_center(lane)
			var r := {"s0": s, "len": r_len, "x": x, "hw": 2.2 if kind == "ramp" else 1.8,
				"h": 1.5 if kind == "ramp" else 1.9, "kind": kind}
			ramps.append(r)
			# parfois une deuxième rampe à côté
			if kind == "ramp" and lanes >= 4 and rng.randf() < 0.35:
				var lane2 := (lane + 2) % lanes
				ramps.append({"s0": s, "len": r_len, "x": lane_center(lane2), "hw": 2.2, "h": 1.5, "kind": "ramp"})
			count += 1
			s += every * rng.randf_range(0.75, 1.25)
		else:
			s += 25.0
	for i in ramps.size():
		var r: Dictionary = ramps[i]
		for b in range(int(r.s0 / 50.0), int((r.s0 + r.len) / 50.0) + 1):
			if not _ramp_buckets.has(b):
				_ramp_buckets[b] = []
			_ramp_buckets[b].append(i)


func _place_intersections() -> void:
	intersections.clear()
	var s := 140.0
	while s < length - runoff - 120.0:
		var i := int(s)
		if SEC_NAMES[sec[i]] == "city" and absf(curv[i]) < 1.0 / 600.0 and _flat(s - 10.0, s + 10.0):
			var near_ramp := false
			for r in ramps:
				if absf(r.s0 - s) < 40.0:
					near_ramp = true
			if not near_ramp:
				intersections.append(s)
				s += rng.randf_range(110.0, 170.0)
				continue
		s += 10.0


func _flat(s0: float, s1: float) -> bool:
	return absf(road_y(s0) - road_y(s1)) < 0.8
