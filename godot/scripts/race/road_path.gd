class_name RoadPath
extends RefCounted
## Un tronçon de route en 3D : la route principale ou un itinéraire bis (toits, tunnel,
## viaduc, ruelle) qui s'en sépare puis la rejoint plus loin.
##
## La physique se fait en « espace route », propre à chaque tronçon : s = distance le long
## du tronçon, x = décalage latéral (positif = à droite), h = hauteur au-dessus de la chaussée.
## Chaque tronçon a sa propre chaussée : une voiture sur un viaduc ne roule jamais sur la
## route située en dessous, et une voiture dans un tunnel ne touche pas la route du dessus.
##
## Aux embranchements et aux jonctions, un bord du tronçon est « ouvert » (links) : en le
## franchissant au volant, la voiture passe sur l'autre tronçon, sans téléportation (sa
## position dans le monde est conservée).

const STEP := 2.0

var id := 0
var kind := "main"          # main | rooftop | tunnel | viaduct | alley
var label := ""             # texte des panneaux d'embranchement
var n := 0
var length := 0.0
var half_width := 8.0
var lanes := 4
var lane_w := 4.0
var pts := PackedVector3Array()
var fwds := PackedVector3Array()
var rights := PackedVector3Array()
var ups := PackedVector3Array()
var curv := PackedFloat32Array()
var elev_ss := PackedFloat32Array()
var h_rel := PackedFloat32Array()   # hauteur par rapport au sol de la ville (itinéraires bis)
var ramps: Array = []
var splits: Array = []
var tunnels: Array = []     # {s0, s1} : plafond au-dessus de la chaussée
var gaps: Array = []        # {s0, s1} : pas de chaussée, il faut sauter par-dessus
var steps: Array = []       # {s, dy} : la chaussée nominale monte d'un coup (saut vers un toit)
var links: Array = []       # {side, s0, s1, to} : bord ouvert -> passage sur le tronçon « to »
var closes: Array = []      # {side, s0, s1} : le mur de ce côté se resserre (voie qui se termine)
var main_s := PackedFloat32Array()  # s équivalent sur la route principale (classement)
var prev: RoadPath = null   # tronçon prolongé avant s = 0 (caméra)
var prev_s := 0.0
var prev_x := 0.0
var next: RoadPath = null   # tronçon prolongé après la fin
var next_s := 0.0
var next_x := 0.0
var _step_at := {}          # index -> hauteur de la marche (voir steps)


# ---------------------------------------------------------------------------
# Construction
# ---------------------------------------------------------------------------
## Construit les repères (avant, droite, haut), la courbure et la courbure verticale
## à partir des points (espacés de STEP à l'horizontale).
func build_frames(bank := true) -> void:
	n = pts.size()
	length = float(n - 1) * STEP
	fwds.resize(n)
	rights.resize(n)
	ups.resize(n)
	curv.resize(n)
	elev_ss.resize(n)
	# marches : la chaussée monte d'un coup à l'index k (saut vers un toit)
	_step_at = {}
	for st in steps:
		var k := int(round(float(st["s"]) / STEP))
		st["s"] = k * STEP
		_step_at[k] = float(_step_at.get(k, 0.0)) + float(st["dy"])
	# hauteurs sans les marches (pour les pentes et la courbure verticale)
	var ys := PackedFloat32Array()
	ys.resize(n)
	var off := 0.0
	for i in n:
		if _step_at.has(i):
			off += float(_step_at[i])
		ys[i] = pts[i].y - off
	for i in n:
		var a := maxi(i - 1, 0)
		var b := mini(i + 1, n - 1)
		var flat := Vector3(pts[b].x - pts[a].x, 0.0, pts[b].z - pts[a].z)
		var f := Vector3(flat.x, ys[b] - ys[a], flat.z)
		if f.length() < 0.01:
			f = Vector3(0, 0, -1)
		f = f.normalized()
		var r := f.cross(Vector3.UP).normalized()
		var u := r.cross(f).normalized()
		fwds[i] = f
		rights[i] = r
		ups[i] = u
		elev_ss[i] = (ys[a] - 2.0 * ys[i] + ys[b]) / (STEP * STEP) if b - a == 2 else 0.0
	# courbure horizontale signée (positive = virage à droite, comme la route principale)
	for i in n:
		var a := maxi(i - 1, 0)
		var b := mini(i + 1, n - 1)
		var fa := Vector2(fwds[a].x, fwds[a].z).normalized()
		var fb := Vector2(fwds[b].x, fwds[b].z).normalized()
		curv[i] = fa.angle_to(fb) / maxf(float(b - a) * STEP, 0.001)
	# près des marches, pas de courbure verticale (sinon la voiture décollerait)
	for k in _step_at.keys():
		for j in range(maxi(k - 2, 0), mini(k + 3, n)):
			elev_ss[j] = 0.0
	if bank:
		for i in n:
			var bk: float = clamp(curv[i] * 18.0, -0.075, 0.075)
			var u2 := ups[i] * cos(bk) + rights[i] * sin(bk)
			var r2 := rights[i] * cos(bk) - ups[i] * sin(bk)
			rights[i] = r2
			ups[i] = u2


# ---------------------------------------------------------------------------
# Requêtes
# ---------------------------------------------------------------------------
func lane_x(lane: int) -> float:
	return -half_width + lane_w * (lane + 0.5)


func _idx(s: float) -> Array:
	var f: float = clamp(s / STEP, 0.0, float(n - 1) - 0.001)
	var i := int(f)
	return [i, f - i]


func frame(s: float) -> Transform3D:
	if s < 0.0 and prev != null:
		var tp := prev.frame(prev_s + s)
		return Transform3D(tp.basis, tp.origin + tp.basis.x * prev_x)
	if s > length and next != null:
		var tn := next.frame(next_s + (s - length))
		return Transform3D(tn.basis, tn.origin + tn.basis.x * next_x)
	var ia := _idx(s)
	var i: int = ia[0]
	var t: float = ia[1]
	var p := pts[i].lerp(_pt_after(i), t)
	var f := fwds[i].lerp(fwds[i + 1], t).normalized()
	var r := rights[i].lerp(rights[i + 1], t).normalized()
	var u := r.cross(f).normalized()
	r = f.cross(u).normalized()
	return Transform3D(Basis(r, u, -f), p)


func position_at(s: float, x: float, h: float) -> Vector3:
	if s < 0.0 and prev != null:
		return prev.position_at(prev_s + s, x + prev_x, h)
	if s > length and next != null:
		return next.position_at(next_s + (s - length), x + next_x, h)
	var ia := _idx(s)
	var i: int = ia[0]
	var t: float = ia[1]
	var p := pts[i].lerp(_pt_after(i), t)
	var r := rights[i].lerp(rights[i + 1], t)
	var u := ups[i].lerp(ups[i + 1], t)
	return p + r * x + u * h


## Point suivant pour l'interpolation : avant une marche, on reste à la hauteur d'avant
## (la chaussée monte d'un coup pile à la marche, pas progressivement).
func _pt_after(i: int) -> Vector3:
	var p := pts[i + 1]
	if _step_at.has(i + 1):
		p.y -= float(_step_at[i + 1])
	return p


func curvature_at(s: float) -> float:
	var ia := _idx(s)
	return lerp(curv[ia[0]], curv[ia[0] + 1], ia[1])


func elev_ss_at(s: float) -> float:
	var ia := _idx(s)
	return lerp(elev_ss[ia[0]], elev_ss[ia[0] + 1], ia[1])


## Pente (montée > 0, descente < 0) : composante verticale de la direction de la route.
func slope_at(s: float) -> float:
	var ia := _idx(s)
	return lerp(fwds[ia[0]].y, fwds[ia[0] + 1].y, ia[1])


func ramp_at(s: float, x: float) -> Dictionary:
	for r in ramps:
		if s < r["s"]:
			break
		if s <= r["s"] + r["len"] and abs(x - r["x"]) <= r["w"] * 0.5:
			return r
	return {}


func in_gap(s: float) -> bool:
	for g in gaps:
		if s > g["s0"] and s < g["s1"]:
			return true
	return false


## Hauteur du sol sous la voiture (rampes) ; -1000 au-dessus d'un vide (saut obligatoire).
func ground_height(s: float, x: float) -> float:
	if in_gap(s):
		return -1000.0
	var r := ramp_at(s, x)
	if r.is_empty():
		return 0.0
	return ramp_height(r, s, x)


func ramp_height(r: Dictionary, s: float, x: float) -> float:
	var u: float = clamp((s - r["s"]) / r["len"], 0.0, 1.0)
	if r["barrel"]:
		var xl: float = clamp((x - r["x"]) / r["w"] * r["tilt"], -0.5, 0.5)
		return r["h"] * u * (0.15 + 0.85 * (xl + 0.5))
	return r["h"] * u


## Hauteur des marches franchies entre s_a (exclu) et s_b (inclus).
func step_between(s_a: float, s_b: float) -> float:
	var dy := 0.0
	for st in steps:
		var ss: float = st["s"]
		if (s_a < ss and ss <= s_b):
			dy += float(st["dy"])
		elif (s_b < ss and ss <= s_a):
			dy -= float(st["dy"])
	return dy


func in_split(s: float) -> bool:
	for sp in splits:
		if s >= sp["s0"] and s <= sp["s1"]:
			return true
	return false


func next_split(s: float) -> Dictionary:
	for sp in splits:
		if sp["s1"] > s:
			return sp
	return {}


func in_tunnel(s: float) -> bool:
	for tn in tunnels:
		if s >= tn["s0"] and s <= tn["s1"]:
			return true
	return false


## Tronçon accessible par le bord ouvert « side » (+1 droite, -1 gauche) à cette distance.
func link_at(s: float, side: int) -> RoadPath:
	for l in links:
		if int(l["side"]) == side and s >= float(l["s0"]) and s <= float(l["s1"]):
			return l["to"]
	return null


## Prochain embranchement (bord ouvert vers un itinéraire bis) devant s.
func next_fork(s: float, max_dist: float) -> Dictionary:
	var best := {}
	var bd := max_dist
	for l in links:
		if not l.get("fork", false):
			continue
		var d: float = float(l["s0"]) - s
		if d < -float(l["s1"] - l["s0"]):
			continue
		if d < bd:
			bd = d
			best = l
	return best


## Tous les embranchements devant s (un carrefour peut en avoir un à gauche et un à droite).
func forks_ahead(s: float, max_dist: float) -> Array:
	var out: Array = []
	for l in links:
		if not l.get("fork", false):
			continue
		var d: float = float(l["s0"]) - s
		if d < max_dist and d > -float(l["s1"] - l["s0"]):
			out.append(l)
	return out


## Position du mur gauche (négative) et droit (positive). Un bord ouvert n'a pas de mur.
func wall_left(s: float) -> float:
	return -_wall(s, -1)


func wall_right(s: float) -> float:
	return _wall(s, 1)


func _wall(s: float, side: int) -> float:
	if link_at(s, side) != null:
		return half_width + 4.0
	var w := half_width
	for c in closes:
		if int(c["side"]) == side and s > float(c["s0"]):
			var u: float = clamp((s - float(c["s0"])) / maxf(float(c["s1"]) - float(c["s0"]), 1.0), 0.0, 1.0)
			# la voie se termine : le mur traverse la chaussée et pousse vers le bord ouvert
			w = lerpf(half_width, -half_width - 1.5, smoothstep(0.0, 1.0, u))
	return w


## Distance équivalente sur la route principale (classement, élastique, HUD).
func progress(s: float) -> float:
	if main_s.is_empty():
		return s
	var ia := _idx(s)
	return lerpf(main_s[ia[0]], main_s[ia[0] + 1], ia[1])


## Inverse de progress() (recherche dichotomique, main_s est croissant).
func s_for_main(sm: float) -> float:
	if main_s.is_empty():
		return sm
	var lo := 0
	var hi := n - 1
	if sm <= main_s[0]:
		return 0.0
	if sm >= main_s[hi]:
		return length
	while hi - lo > 1:
		var mid := (lo + hi) / 2
		if main_s[mid] < sm:
			lo = mid
		else:
			hi = mid
	var a := main_s[lo]
	var b := main_s[hi]
	var t: float = 0.0 if b - a < 0.0001 else (sm - a) / (b - a)
	return (lo + t) * STEP


## Coordonnées (s, x, h) d'un point du monde sur ce tronçon, en cherchant autour de s_hint.
func project(p: Vector3, s_hint: float, window: float = 60.0) -> Vector3:
	var i0 := maxi(int((s_hint - window) / STEP), 0)
	var i1 := mini(int((s_hint + window) / STEP), n - 1)
	var best := i0
	var bd := INF
	for i in range(i0, i1 + 1):
		var d := (p - pts[i]).length_squared()
		if d < bd:
			bd = d
			best = i
	var s: float = clamp(best * STEP + (p - pts[best]).dot(fwds[best]), 0.0, length)
	var tr := frame(s)
	var loc := tr.affine_inverse() * p
	return Vector3(s, loc.x, loc.y)


## Point du monde au centre de la chaussée (pour les décors).
func center(i: int) -> Vector3:
	return pts[clampi(i, 0, n - 1)]
