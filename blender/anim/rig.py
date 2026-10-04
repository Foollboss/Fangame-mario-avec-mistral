"""Solveur de pose pour les rigs des héros d'Échos d'Aetheria.

On décrit une pose dans le repère du corps (gauche, avant, haut) :
  * colonne (bassin, dos, poitrine, cou, tête) en orientations « monde » ;
  * bras par directions visées (bras, avant-bras, main ou lame) ;
  * pieds par position au sol + inclinaison, résolus en IK à deux os.
Le solveur convertit tout ça en rotations locales d'os Blender.
"""
import math
from mathutils import Vector, Quaternion, Matrix

# Axes de l'armature Blender : le personnage regarde vers -Y, sa gauche est +X.
def V(l=0.0, f=0.0, u=0.0):
    return Vector((l, -f, u))


def E(lean=0.0, turn=0.0, tilt=0.0):
    """lean : penché en avant (+), turn : tourné vers sa gauche (+), tilt : incliné vers sa gauche (+)."""
    qx = Quaternion((1, 0, 0), math.radians(lean))
    qy = Quaternion((0, 1, 0), math.radians(tilt))
    qz = Quaternion((0, 0, 1), math.radians(turn))
    return qz @ qy @ qx


def limb_dir(side, fwd, out, twist=0.0):
    """Direction d'un membre qui pend : fwd (°) le lève vers l'avant (90 = horizontal, 180 = en l'air),
    out (°) l'écarte du corps. side = +1 gauche, -1 droite. Repère corps -> armature."""
    f = math.radians(fwd)
    o = math.radians(out)
    return V(side * math.sin(o), math.sin(f) * math.cos(o), -math.cos(f) * math.cos(o)).normalized()


def rot_between(a, b):
    a = a.normalized()
    b = b.normalized()
    return a.rotation_difference(b)


def frame_rotation(p_rest, s_rest, p_des, s_des):
    """Rotation qui envoie p_rest sur p_des exactement et s_rest au plus près de s_des."""
    def basis(p, s):
        p = p.normalized()
        s = (s - p * s.dot(p))
        if s.length < 1e-6:
            s = p.orthogonal()
        s.normalize()
        t = p.cross(s)
        m = Matrix((p, s, t)).transposed()
        return m
    mr = basis(p_rest, s_rest)
    md = basis(p_des, s_des)
    return (md @ mr.transposed()).to_quaternion()


class Rig:
    def __init__(self, arm_obj):
        self.obj = arm_obj
        bones = arm_obj.data.bones
        self.parent = {}
        self.rest = {}
        for b in bones:
            self.parent[b.name] = b.parent.name if b.parent else None
            self.rest[b.name] = b.matrix_local.copy()
        self.rest_rot = {n: m.to_quaternion() for n, m in self.rest.items()}
        self.head = {n: m.translation.copy() for n, m in self.rest.items()}
        self.tail = {b.name: b.tail_local.copy() for b in bones}
        self.rest_rel = {}
        for n, p in self.parent.items():
            self.rest_rel[n] = (self.rest[p].inverted() @ self.rest[n]) if p else self.rest[n].copy()
        # ordre parents -> enfants
        depth = {}
        def d(n):
            if n not in depth:
                p = self.parent[n]
                depth[n] = 0 if p is None else d(p) + 1
            return depth[n]
        self.order = sorted(self.rest.keys(), key=lambda n: (d(n), n))
        self.has = set(self.rest.keys())
        # proportions
        self.hip_h = self.head["hips"].z
        self.leg = {}
        for s in ("L", "R"):
            th, sh, ft, to = (self.head["thigh." + s], self.head["shin." + s], self.head["foot." + s], self.head["toe." + s])
            heel = Vector((ft.x, ft.y + (ft.y - to.y) * 0.45, 0.0))
            self.leg[s] = {
                "l1": (sh - th).length, "l2": (ft - sh).length,
                "ankle": ft.copy(), "ball": Vector((to.x, to.y, 0.0)), "heel": heel,
                "toe_tip": self.tail["toe." + s].copy(),
            }
        self.ankle_h = (self.head["foot.L"].z + self.head["foot.R"].z) * 0.5
        self.LL = self.hip_h  # longueur de jambe de référence

    # ------------------------------------------------------------------
    def solve(self, P):
        """P : dict de pose déjà évaluée (voir anims.py). Retourne {os: (loc, quat)} en espace local Blender."""
        acc = {}
        mat = {}
        out = {}

        def finish(n, D, loc_arm=None):
            p = self.parent[n]
            acc_p = acc[p] if p else Quaternion()
            mat_p = mat[p] if p else Matrix.Identity(4)
            R = self.rest_rot[n]
            q = R.inverted() @ D @ R
            loc = Vector()
            if loc_arm is not None:
                # translation exprimée dans l'espace de repos de l'os
                base = (mat_p @ self.rest_rel[n]).to_3x3()
                loc = base.inverted() @ loc_arm
            m = mat_p @ self.rest_rel[n] @ (Matrix.Translation(loc) @ q.to_matrix().to_4x4())
            acc[n] = acc_p @ D
            mat[n] = m
            out[n] = (loc, q)

        def acc_of(n):
            p = self.parent[n]
            return acc[p] if p else Quaternion()

        def world(n, W):
            return acc_of(n).inverted() @ W

        def aim(n, rest_vec, d_arm, twist=0.0):
            ap = acc_of(n)
            local = ap.inverted() @ d_arm
            D = rot_between(rest_vec, local)
            if twist:
                D = Quaternion(local.normalized(), math.radians(twist)) @ D
            return D

        def head_pos(n):
            p = self.parent[n]
            mat_p = mat[p] if p else Matrix.Identity(4)
            return (mat_p @ self.rest_rel[n]).translation

        deferred = []
        ik_sides = [s for s in ("L", "R") if "ik" in P["arm" + s]]
        order = []
        def under(n, anc):
            while n is not None:
                if n == anc:
                    return True
                n = self.parent[n]
            return False
        for n in self.order:
            if any(under(n, "upper_arm." + s) for s in ik_sides):
                deferred.append(n)
            else:
                order.append(n)
        order += deferred
        legs_done = set()
        ik_done = set()
        for n in order:
            if n.startswith("upper_arm.") and n[-1] in ik_sides:
                self._arm_ik(n[-1], P, finish, acc_of, aim, head_pos, mat)
                ik_done.add(n[-1])
                continue
            if n in out:
                continue
            if n == "root":
                finish(n, Quaternion())
            elif n == "hips":
                finish(n, P["hips"], P["hips_off"])
            elif n in ("spine", "chest", "neck", "head"):
                finish(n, world(n, P[n]))
            elif n.startswith("shoulder."):
                s = n[-1]
                finish(n, world(n, P["chest"] @ P["sh" + s]))
            elif n.startswith("upper_arm.") or n.startswith("forearm."):
                s = n[-1]
                arm = P["arm" + s]
                key = "up" if n.startswith("upper") else "fore"
                child = ("forearm." if key == "up" else "hand.") + s
                rest_vec = self.head[child] - self.head[n]
                d = P["armframe"] @ arm[key]
                finish(n, aim(n, rest_vec, d, arm.get(key + "_twist", 0.0)))
            elif n.startswith("hand."):
                s = n[-1]
                arm = P["arm" + s]
                fore_dir = (mat["forearm." + s].to_3x3() @ Vector((0, 1, 0))).normalized()
                hand_rest = self.tail[n] - self.head[n]
                ap = acc_of(n)
                if "blade" in arm and ("weapon." + s) in self.has:
                    wb = "weapon." + s
                    blade_rest = self.tail[wb] - self.head[wb]
                    blade = (P["armframe"] @ arm["blade"]).normalized()
                    hand_d = fore_dir if "hand" not in arm else (P["armframe"] @ arm["hand"])
                    W = frame_rotation(blade_rest, hand_rest, blade, hand_d)
                    finish(n, ap.inverted() @ W)
                elif "hand" in arm:
                    finish(n, aim(n, hand_rest, P["armframe"] @ arm["hand"], arm.get("hand_twist", 0.0)))
                else:
                    finish(n, Quaternion())
            elif n.startswith("fingers.") or n.startswith("thumb."):
                s = n[-1]
                curl = P["arm" + s].get("curl", 20.0) * (0.7 if n.startswith("thumb") else 1.0)
                sign = 1.0 if s == "L" else -1.0
                finish(n, Quaternion((0, 1, 0), math.radians(curl * sign)))
            elif n.startswith("thigh."):
                s = n[-1]
                self._leg(n, s, P, finish, acc_of, aim, head_pos, mat)
                legs_done.add(s)
            elif n.startswith("shin.") or n.startswith("foot.") or n.startswith("toe."):
                pass  # résolus par _leg
            else:
                finish(n, Quaternion())
        return out

    def grip_point(self, mat, s, offset):
        """Point le long de l'arme tenue par la main s, à `offset` mètres de la poignée."""
        wb = "weapon." + s
        m = mat[wb]
        d = (m.to_3x3() @ Vector((0, 1, 0))).normalized()
        return m.translation + d * offset, d

    def _arm_ik(self, s, P, finish, acc_of, aim, head_pos, mat):
        arm = P["arm" + s]
        ik = arm["ik"]
        up, fo, ha = "upper_arm." + s, "forearm." + s, "hand." + s
        other = "R" if s == "L" else "L"
        if ik[0] == "grip":
            gp, wdir = self.grip_point(mat, other, ik[1])
            # la main se place sous la hampe, poing perpendiculaire
            S0 = head_pos(up)
            side = (S0 - gp)
            side = side - wdir * side.dot(wdir)
            if side.length < 1e-5:
                side = Vector((0, 0, 1))
            side.normalize()
            grip_len = (self.head["weapon." + other] - self.head["hand." + other]).length
            target = gp + side * grip_len
            hand_dir = -side
        else:
            target = ik[1]
            hand_dir = None
        S = head_pos(up)
        l1 = (self.head[fo] - self.head[up]).length
        l2 = (self.head[ha] - self.head[fo]).length
        to = target - S
        dist_c = min(max(to.length, abs(l1 - l2) + 1e-3), (l1 + l2) * 0.999)
        dirn = to.normalized()
        ca = max(-1.0, min(1.0, (l1 * l1 + dist_c * dist_c - l2 * l2) / (2 * l1 * dist_c)))
        a = math.acos(ca)
        side_sign = 1.0 if s == "L" else -1.0
        pole = P["chest"] @ arm.get("pole", V(side_sign * 0.6, -0.4, -1.0))
        pole = pole - dirn * pole.dot(dirn)
        if pole.length < 1e-5:
            pole = V(0, 0, -1)
        pole.normalize()
        elbow = S + dirn * (math.cos(a) * l1) + pole * (math.sin(a) * l1)
        wrist = S + dirn * dist_c
        finish(up, aim(up, self.head[fo] - self.head[up], elbow - S))
        finish(fo, aim(fo, self.head[ha] - self.head[fo], wrist - elbow))
        hand_rest = self.tail[ha] - self.head[ha]
        if hand_dir is not None:
            finish(ha, aim(ha, hand_rest, hand_dir))
        else:
            finish(ha, Quaternion())
        for f in ("fingers." + s, "thumb." + s):
            if f in self.has:
                curl = arm.get("curl", 70.0) * (0.7 if f.startswith("thumb") else 1.0)
                finish(f, Quaternion((0, 1, 0), math.radians(curl * side_sign)))

    def _leg(self, n, s, P, finish, acc_of, aim, head_pos, mat):
        L = self.leg[s]
        ft = P["foot" + s]
        pitch = ft.get("pitch", 0.0)
        yaw = ft.get("yaw", 0.0)
        Wf = E(lean=pitch, turn=yaw)
        Wyaw = E(turn=yaw)
        base = ft["p"]  # position de la cheville quand le pied est à plat
        pivot = ft.get("pivot", "ball" if pitch > 0 else "heel")
        rel_ankle = Vector()
        if pivot == "ball":
            pv = base + Wyaw @ (L["ball"] - L["ankle"])
            rel = L["ankle"] - L["ball"]
            ankle = pv + Wf @ rel
        elif pivot == "heel":
            pv = base + Wyaw @ (L["heel"] - L["ankle"])
            rel = L["ankle"] - L["heel"]
            ankle = pv + Wf @ rel
        else:
            ankle = base
        H = head_pos(n)
        l1, l2 = L["l1"], L["l2"]
        to = ankle - H
        dist = to.length
        dist_c = min(max(dist, abs(l1 - l2) + 1e-3), (l1 + l2) * 0.9995)
        dirn = to.normalized()
        ca = (l1 * l1 + dist_c * dist_c - l2 * l2) / (2 * l1 * dist_c)
        ca = max(-1.0, min(1.0, ca))
        a = math.acos(ca)
        knee_dir = ft.get("knee", None)
        pole = (P["hips"] @ E(turn=yaw * 0.6)) @ V(0, 1, 0) if knee_dir is None else knee_dir
        pole = pole - dirn * pole.dot(dirn)
        if pole.length < 1e-5:
            pole = V(0, 1, 0)
        pole.normalize()
        knee = H + dirn * (math.cos(a) * l1) + pole * (math.sin(a) * l1)
        ankle_c = H + dirn * dist_c
        th, sh = "thigh." + s, "shin." + s
        finish(th, aim(th, self.head[sh] - self.head[th], knee - H))
        finish(sh, aim(sh, self.head["foot." + s] - self.head[sh], ankle_c - knee))
        fo = "foot." + s
        finish(fo, acc_of(fo).inverted() @ Wf)
        to_b = "toe." + s
        if to_b in self.has:
            tp = ft.get("toe", 0.0 if pitch > 0 else pitch)
            finish(to_b, acc_of(to_b).inverted() @ E(lean=tp, turn=yaw))
