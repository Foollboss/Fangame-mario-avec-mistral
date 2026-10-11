class_name RoadNetwork
extends RefCounted
## Réseau routier 3D : itinéraires bis qui se séparent de la route principale à un
## embranchement (2 ou 3 directions) puis la rejoignent plus loin.
##
##  - « rooftop » : rampe d'accès, saut vers une route posée sur le toit d'une rangée
##    d'immeubles (avec un second saut entre deux toits), puis descente vers la route.
##  - « tunnel »  : rue qui plonge dans une tranchée, tunnel sous un quartier, remontée.
##  - « viaduc »  : bretelle qui monte et passe AU-DESSUS de la route principale pour
##    la rejoindre de l'autre côté (passage à deux niveaux, pas un croisement).
##  - « alley »   : ruelle étroite et sinueuse entre les immeubles (raccourci dans un virage).
##
## Chaque itinéraire est un RoadPath distinct : sa chaussée, ses murs, ses rampes et ses
## vides lui appartiennent. On change de tronçon en franchissant le bord ouvert d'une zone
## d'embranchement ou de jonction.

const BRANCH_HW := 4.6          # demi-largeur d'un itinéraire bis (2 voies)
const OPEN_LEN := 56.0          # longueur de la zone où l'on peut changer de route
const PAR_LEN := 70.0           # longueur où les deux routes restent côte à côte
const TUNNEL_DEPTH := 8.8       # sous cette profondeur (par rapport au sol), on est dans le tunnel
static var last_error := ""
const LABELS := {"rooftop": "TOITS", "tunnel": "TUNNEL", "viaduct": "VIADUC", "alley": "RUELLE"}

## Types d'itinéraires bis par ville, pour chaque embranchement (le premier peut en avoir deux).
const THEME_KINDS := {
	"sf": [["rooftop", "tunnel"], ["viaduct"], ["alley"]],
	"la": [["viaduct", "alley"], ["rooftop"]],
	"tokyo": [["viaduct", "tunnel"], ["rooftop"]],
	"nevada": [["tunnel", "viaduct"], ["viaduct"]],
	"newyork": [["rooftop", "tunnel"], ["viaduct"], ["alley"]],
}


## Emplacements des embranchements, choisis AVANT le tracé de la route principale : la route
## est ensuite rendue droite à ces endroits (embranchement et jonction praticables).
## Retourne [{s, kinds: [..]}].
static func plan(theme_id: String, network: String, start_s: float, finish_s: float, seed_value: int) -> Array:
	var out: Array = []
	if network == "none":
		return out
	var kinds_plan: Array = THEME_KINDS.get(theme_id, THEME_KINDS["sf"])
	if network == "test":
		kinds_plan = [["rooftop", "tunnel"], ["viaduct"], ["alley"]]
	var rng := RandomNumberGenerator.new()
	rng.seed = seed_value * 7919 + 13
	var s := start_s + 330.0 + rng.randf_range(0.0, 120.0)
	for site in kinds_plan:
		var span := _span_for(site)
		if s + span > finish_s - 200.0:
			break
		out.append({"s": s, "kinds": site, "side": 1 if (rng.randf() < 0.5 or network == "test") else -1})
		s += span + rng.randf_range(200.0, 320.0)
	return out


## Zones de la route principale qui doivent rester droites (embranchements et jonctions).
static func straight_zones(sites: Array) -> Array:
	var z: Array = []
	for site in sites:
		var sf: float = site["s"]
		z.append([sf - 50.0, sf + PAR_LEN + 70.0])
		for kind in site["kinds"]:
			var sm: float = sf + _kind_span(kind)
			z.append([sm - PAR_LEN - 70.0, sm + 50.0])
	return z


## Construit les itinéraires bis de la piste aux emplacements prévus. Retourne la liste des
## RoadPath créés et remplit track.branch_zones (portions de la route principale à garder libres).
static func build(track: Track, opts: Dictionary) -> Array:
	var main: RoadPath = track.main
	var rng := RandomNumberGenerator.new()
	rng.seed = int(opts.get("seed", 1)) * 104729 + 7
	var out: Array = []
	var next_id := 1
	for site in track.planned_sites:
		var sf: float = site["s"]
		var side_first: int = site["side"]
		var kinds: Array = site["kinds"]
		for k in kinds.size():
			var kind: String = kinds[k]
			var sigma := side_first if k == 0 else -side_first
			var b := _make_branch(track, kind, sigma, sf, sf + _kind_span(kind), rng)
			if b == null:
				b = _make_branch(track, kind, sigma, sf, sf + _kind_span(kind), rng, 0.55)
			if b == null:
				print("réseau : itinéraire %s impossible à %d m (ignoré) : %s" % [kind, int(sf), last_error])
				continue
			b.id = next_id
			next_id += 1
			_connect(main, b)
			out.append(b)
			track.branch_zones.append([sf - 50.0, sf + PAR_LEN + 40.0])
			track.branch_zones.append([b.next_s - PAR_LEN - 40.0, b.next_s + 40.0])
			track.branch_spans.append([sf, b.next_s])
	return out


static func _kind_span(kind: String) -> float:
	match kind:
		"rooftop":
			return 660.0
		"tunnel":
			return 640.0
		"viaduct":
			return 760.0
		"alley":
			return 520.0
	return 600.0


static func _span_for(site: Array) -> float:
	var m := 0.0
	for k in site:
		m = maxf(m, _kind_span(k))
	return m


## L'embranchement et la jonction doivent être sur des portions presque droites,
## loin des bosses (sauts de crête).
static func _site_ok(track: Track, s_f: float, s_m: float) -> bool:
	if s_m > track.finish_s - 160.0:
		return false
	for zone in [[s_f - 30.0, s_f + PAR_LEN + 60.0], [s_m - PAR_LEN - 60.0, s_m + 30.0]]:
		var i0 := int(zone[0] / Track.STEP)
		var i1 := int(zone[1] / Track.STEP)
		for i in range(maxi(i0, 0), mini(i1, track.n - 1)):
			if absf(track.curv[i]) > 0.0032:
				return false
		for c in track.crest_list:
			if float(c["s"]) + float(c["len"]) > zone[0] - 40.0 and float(c["s"]) < zone[1] + 40.0:
				return false
	return true


# ---------------------------------------------------------------------------
# Tracés des itinéraires : images clés (s sur la route principale, x latéral, h relatif)
# ---------------------------------------------------------------------------
static func _make_branch(track: Track, kind: String, sigma: int, s_f: float, s_m: float, rng: RandomNumberGenerator, sc: float = 1.0) -> RoadPath:
	var main: RoadPath = track.main
	var o := main.half_width + BRANCH_HW          # côte à côte : bords qui se touchent
	var keys: Array = []      # [s_main, x, h, extra]
	var sig_m := sigma
	# départ : les deux routes restent côte à côte, bord ouvert
	for d in [0.0, 20.0, 40.0, PAR_LEN]:
		keys.append([s_f + d, sigma * o, 0.0, {}])
	var span := s_m - s_f
	match kind:
		"rooftop":
			var H := rng.randf_range(9.5, 11.5)
			var w := o + 9.0 * sc
			keys.append([s_f + 110.0, sigma * (o + 3.0 * sc), 0.0, {}])
			keys.append([s_f + 132.0, sigma * (o + 5.0 * sc), 0.0, {"launch": true}])   # rampe d'accès
			keys.append([s_f + 150.0, sigma * (o + 6.5 * sc), H, {"step": H}])         # vide puis toit
			keys.append([s_f + 182.0, sigma * w, H, {"gap_end": true}])
			keys.append([s_f + 260.0, sigma * (w + 5.0 * sc), H + 0.3, {}])
			keys.append([s_f + 390.0, sigma * (w + 6.0 * sc), H + 0.3, {}])
			keys.append([s_m - 210.0, sigma * (w + 2.0 * sc), H, {}])
			keys.append([s_m - 150.0, sigma * (o + 5.0 * sc), H * 0.45, {}])           # descente
			keys.append([s_m - 100.0, sigma * (o + 1.5 * sc), 0.0, {}])
		"tunnel":
			keys.append([s_f + 110.0, sigma * (o + 2.0 * sc), -2.0, {}])
			keys.append([s_f + 175.0, sigma * (o + 10.0 * sc), -9.5, {}])
			keys.append([s_f + 245.0, sigma * (o + 20.0 * sc), -11.0, {}])
			keys.append([(s_f + s_m) * 0.5, sigma * (o + 26.0 * sc), -11.0, {}])
			keys.append([s_m - 245.0, sigma * (o + 20.0 * sc), -11.0, {}])
			keys.append([s_m - 175.0, sigma * (o + 10.0 * sc), -9.5, {}])
			keys.append([s_m - 110.0, sigma * (o + 2.0 * sc), -2.0, {}])
		"viaduct":
			sig_m = -sigma
			keys.append([s_f + 120.0, sigma * (o + 6.0 * sc), 3.5, {}])
			keys.append([s_f + 200.0, sigma * (o + 13.0 * sc), 9.0, {}])
			keys.append([s_f + span * 0.36, sigma * (o + 6.0 * sc), 11.0, {}])
			keys.append([s_f + span * 0.5, 0.0, 11.5, {}])                      # au-dessus de la route
			keys.append([s_f + span * 0.64, -sigma * (o + 6.0 * sc), 11.0, {}])
			keys.append([s_m - 200.0, -sigma * (o + 13.0 * sc), 9.0, {}])
			keys.append([s_m - 120.0, -sigma * (o + 6.0 * sc), 3.5, {}])
		"alley":
			# raccourci : ruelle sinueuse entre les immeubles, plus étroite
			var a := o + 16.0 * sc
			keys.append([s_f + 105.0, sigma * (o + 5.0 * sc), 0.0, {}])
			keys.append([s_f + 150.0, sigma * a, 0.0, {}])
			var m := s_f + 190.0
			var flip := 1.0
			while m < s_m - 190.0:
				keys.append([m, sigma * (a + flip * 5.0 * sc), 0.0, {}])
				flip = -flip
				m += 48.0
			keys.append([s_m - 150.0, sigma * a, 0.0, {}])
			keys.append([s_m - 105.0, sigma * (o + 5.0 * sc), 0.0, {}])
	# arrivée : de nouveau côte à côte
	for d in [PAR_LEN, 40.0, 20.0, 0.0]:
		keys.append([s_m - d, sig_m * o, 0.0, {}])
	var b := _path_from_keys(track, keys, kind)
	if b == null:
		return null
	b.kind = kind
	b.label = LABELS.get(kind, "")
	b.prev = main
	b.prev_s = s_f
	b.prev_x = sigma * o
	b.next = main
	b.next_s = s_m
	b.next_x = sig_m * o
	b.set_meta("fork_side", sigma)
	b.set_meta("merge_side", sig_m)
	if kind == "rooftop" and not b.gaps.is_empty():
		# second saut, entre deux toits à la même hauteur (sur une portion droite du toit)
		var g1: Dictionary = b.gaps[0]
		var d2: float = float(g1["s1"]) + 95.0
		b.gaps.append({"s0": d2, "s1": d2 + 11.0, "deck": true})
	# virages trop serrés = tracé raté (sauf la ruelle, volontairement sinueuse)
	var k_max := 1.0 / (32.0 if kind == "alley" else 70.0)
	for i in range(2, b.n - 2):
		if absf(b.curv[i]) > k_max:
			last_error = "virage trop serré à %d m (rayon %.0f m)" % [i * 2, 1.0 / absf(b.curv[i])]
			return null
	if not _clear_of_main(main, b):
		return null
	return b


## Construit le RoadPath : ruelle de points (Catmull-Rom à l'horizontale), profil de hauteur
## (interpolation puis lissage, sans lisser les marches), rééchantillonné tous les STEP m.
static func _path_from_keys(track: Track, keys: Array, kind: String) -> RoadPath:
	var main: RoadPath = track.main
	var wp: Array = []
	for k in keys:
		var p := main.position_at(float(k[0]), float(k[1]), 0.0)
		wp.append(Vector2(p.x, p.z))
	# polyligne dense (Catmull-Rom) avec paramètres interpolés
	var dense_xz: Array = []
	var dense_key: Array = []    # position fractionnaire dans la liste des images clés
	var SUB := 24
	for j in range(keys.size() - 1):
		var p0: Vector2 = wp[maxi(j - 1, 0)]
		var p1: Vector2 = wp[j]
		var p2: Vector2 = wp[j + 1]
		var p3: Vector2 = wp[mini(j + 2, keys.size() - 1)]
		for q in SUB:
			var t := float(q) / SUB
			dense_xz.append(_catmull(p0, p1, p2, p3, t))
			dense_key.append(j + t)
	dense_xz.append(wp[keys.size() - 1])
	dense_key.append(float(keys.size() - 1))
	# rééchantillonnage tous les STEP mètres (longueur horizontale, comme la route principale)
	var acc := [0.0]
	for j in range(1, dense_xz.size()):
		acc.append(acc[j - 1] + (dense_xz[j] - dense_xz[j - 1]).length())
	var total: float = acc[acc.size() - 1]
	var count := int(total / Track.STEP) + 1
	var res_xz: Array = []
	var res_key: Array = []
	var j2 := 0
	for c in count:
		var d := c * Track.STEP
		while j2 < acc.size() - 2 and acc[j2 + 1] < d:
			j2 += 1
		var seg: float = maxf(acc[j2 + 1] - acc[j2], 0.0001)
		var t: float = clamp((d - acc[j2]) / seg, 0.0, 1.0)
		res_xz.append(dense_xz[j2].lerp(dense_xz[j2 + 1], t))
		res_key.append(lerpf(dense_key[j2], dense_key[j2 + 1], t))
	# lissage horizontal du tracé (pas dans les zones côte à côte avec la route principale)
	var sm_xz: Array = res_xz.duplicate()
	for rep_i in 3:
		var src: Array = sm_xz.duplicate()
		for c in count:
			var d := c * Track.STEP
			var wz: float = smoothstep(PAR_LEN - 10.0, PAR_LEN + 30.0, d) * smoothstep(PAR_LEN - 10.0, PAR_LEN + 30.0, (count - 1) * Track.STEP - d)
			if wz <= 0.0:
				continue
			var acc_v := Vector2.ZERO
			var wsum := 0.0
			for dc in range(-6, 7):
				var cc := clampi(c + dc, 0, count - 1)
				var wgt := 7.0 - absf(dc)
				acc_v += src[cc] * wgt
				wsum += wgt
			sm_xz[c] = (src[c] as Vector2).lerp(acc_v / wsum, wz)
	res_xz = sm_xz
	# distance le long de l'itinéraire de chaque image clé
	var key_d: Array = []
	var cc0 := 0
	for k in keys.size():
		while cc0 < count - 1 and float(res_key[cc0]) < k - 0.0001:
			cc0 += 1
		key_d.append(cc0 * Track.STEP)
	# profil de hauteur (par rapport au sol de la ville), par morceaux séparés par les marches
	var hr := PackedFloat32Array()
	hr.resize(count)
	var s_main := PackedFloat32Array()
	s_main.resize(count)
	for c in count:
		var kf: float = res_key[c]
		var k0 := clampi(int(floor(kf)), 0, keys.size() - 2)
		var t: float = kf - k0
		var h0: float = keys[k0][2]
		var h1: float = keys[k0 + 1][2]
		if keys[k0 + 1][3].has("step"):
			h1 = h0   # avant la marche : on reste au niveau d'avant
		hr[c] = lerpf(h0, h1, t)
		s_main[c] = lerpf(float(keys[k0][0]), float(keys[k0 + 1][0]), t)
	var b := RoadPath.new()
	b.half_width = BRANCH_HW if kind != "alley" else BRANCH_HW - 0.4
	b.lanes = 2
	b.lane_w = b.half_width
	# marches, vides, rampe d'accès
	var cuts: Array = [0]
	for k in keys.size():
		var ex: Dictionary = keys[k][3]
		if ex.has("step"):
			var ds: float = key_d[k]
			b.steps.append({"s": ds, "dy": float(ex["step"])})
			cuts.append(int(round(ds / Track.STEP)))
			# le vide commence à la marche et finit à l'image clé « gap_end »
			for k2 in range(k + 1, keys.size()):
				if keys[k2][3].has("gap_end"):
					b.gaps.append({"s0": ds, "s1": float(key_d[k2]), "deck": true})
					break
		if ex.has("gap2"):
			for k2 in range(k + 1, keys.size()):
				if keys[k2][3].has("gap2_end"):
					b.gaps.append({"s0": float(key_d[k]), "s1": float(key_d[k2]), "deck": true})
					break
	# rampe d'accès : elle finit pile au bord du vide
	for g in b.gaps:
		if g == b.gaps[0] and not b.steps.is_empty():
			b.ramps.append({"s": float(g["s0"]) - 16.0, "len": 16.0, "x": 0.0, "w": b.half_width * 2.0, "h": 3.8, "barrel": false, "tilt": 0.0, "launch": true})
	# lissage par morceaux (sans traverser les marches)
	cuts.append(count)
	cuts.sort()
	var hs := PackedFloat32Array()
	hs.resize(count)
	for q in range(cuts.size() - 1):
		var a: int = cuts[q]
		var e: int = cuts[q + 1]
		for c in range(a, e):
			var sum := 0.0
			var wsum := 0.0
			for dc in range(-10, 11):
				var cc := c + dc
				if cc < a or cc >= e:
					continue
				var wgt := 11.0 - absf(dc)
				sum += hr[cc] * wgt
				wsum += wgt
			hs[c] = sum / wsum if wsum > 0.0 else hr[c]
	# hauteur de base : le sol de la ville sous l'itinéraire. Les ouvrages (viaduc, toits,
	# tunnel) suivent un relief lissé, pas chaque bosse de la route principale.
	var base_exact := PackedFloat32Array()
	base_exact.resize(count)
	for c in count:
		base_exact[c] = main.position_at(s_main[c], 0.0, 0.0).y
	var base_smooth := PackedFloat32Array()
	base_smooth.resize(count)
	for c in count:
		var sum := 0.0
		var wsum := 0.0
		for dc in range(-30, 31, 2):
			var cc := clampi(c + dc, 0, count - 1)
			var wgt := 31.0 - absf(dc)
			sum += base_exact[cc] * wgt
			wsum += wgt
		base_smooth[c] = sum / wsum
	b.pts.resize(count)
	b.h_rel.resize(count)
	for c in count:
		var xz: Vector2 = res_xz[c]
		var k_ouvrage: float = clamp(absf(hs[c]) / 4.0, 0.0, 1.0)
		var y := lerpf(base_exact[c], base_smooth[c], k_ouvrage) + hs[c]
		b.pts[c] = Vector3(xz.x, y, xz.y)
		b.h_rel[c] = hs[c]
	# hauteur réelle de chaque marche (saut de la chaussée moins la pente qui continue)
	for st in b.steps:
		var k_st := clampi(int(round(float(st["s"]) / Track.STEP)), 2, count - 1)
		st["s"] = k_st * Track.STEP
		st["dy"] = (b.pts[k_st].y - b.pts[k_st - 1].y) - (b.pts[k_st - 1].y - b.pts[k_st - 2].y)
	b.build_frames(true)
	# tunnels : là où la chaussée est assez profonde sous le sol
	var in_t := false
	var t0 := 0.0
	for c in count:
		var deep: bool = hs[c] < -TUNNEL_DEPTH
		if deep and not in_t:
			in_t = true
			t0 = c * Track.STEP
		elif not deep and in_t:
			in_t = false
			b.tunnels.append({"s0": t0, "s1": c * Track.STEP})
	if in_t:
		b.tunnels.append({"s0": t0, "s1": (count - 1) * Track.STEP})
	# correspondance avec la route principale (classement) : projection, croissante
	b.main_s.resize(count)
	var last := -1e9
	for c in count:
		var pr := main.project(b.pts[c] - Vector3(0, hs[c], 0), s_main[c], 50.0)
		var v: float = maxf(pr.x, last)
		b.main_s[c] = v
		last = v
	return b


static func _catmull(p0: Vector2, p1: Vector2, p2: Vector2, p3: Vector2, t: float) -> Vector2:
	var t2 := t * t
	var t3 := t2 * t
	return 0.5 * ((2.0 * p1) + (-p0 + p2) * t + (2.0 * p0 - 5.0 * p1 + 4.0 * p2 - p3) * t2 + (-p0 + 3.0 * p1 - 3.0 * p2 + p3) * t3)


## Vérifie que l'itinéraire ne recouvre pas la route principale (hors zones côte à côte) :
## soit il est à côté, soit il passe nettement au-dessus (viaduc) ou en dessous (tunnel).
static func _clear_of_main(main: RoadPath, b: RoadPath) -> bool:
	var lo := PAR_LEN + 10.0
	var hi := b.length - PAR_LEN - 10.0
	var c := 0
	while c < b.n:
		var d := c * Track.STEP
		if d > lo and d < hi:
			var pr := main.project(b.pts[c], b.main_s[c], 40.0)
			var lateral := absf(pr.y)
			var dh := pr.z
			var too_close := lateral < main.half_width + b.half_width - 0.3
			if too_close and dh > -9.0 and dh < 7.0:
				last_error = "chevauche la route principale à %d m (écart %.1f m, hauteur %.1f m)" % [int(d), lateral, dh]
				return false
		c += 3
	return true


## Relie l'itinéraire à la route principale : bords ouverts à l'embranchement et à la jonction.
static func _connect(main: RoadPath, b: RoadPath) -> void:
	var sf: float = b.prev_s
	var sm: float = b.next_s
	var sig: int = b.get_meta("fork_side")
	var sig_m: int = b.get_meta("merge_side")
	main.links.append({"side": sig, "s0": sf + 2.0, "s1": sf + OPEN_LEN, "to": b, "fork": true})
	b.links.append({"side": -sig, "s0": 0.0, "s1": OPEN_LEN - 2.0, "to": main})
	main.links.append({"side": sig_m, "s0": sm - OPEN_LEN, "s1": sm - 2.0, "to": b})
	b.links.append({"side": -sig_m, "s0": b.length - OPEN_LEN + 2.0, "s1": b.length, "to": main})
	# fin de l'itinéraire : le mur extérieur se resserre, on rejoint la route principale
	b.closes.append({"side": sig_m, "s0": b.length - 46.0, "s1": b.length - 4.0})
