class_name Bones
extends RefCounted
## Les GLB exportés par Blender nomment les os « hand_R » ou « hand.R » selon l'outil :
## on accepte les deux écritures.

static func find(skel: Skeleton3D, bone: String) -> String:
	if skel == null: return bone
	if skel.find_bone(bone) >= 0: return bone
	var alt: = bone.replace(".", "_")
	if skel.find_bone(alt) >= 0: return alt
	alt = bone.replace("_", ".")
	if skel.find_bone(alt) >= 0: return alt
	return bone

static func idx(skel: Skeleton3D, bone: String) -> int:
	return skel.find_bone(find(skel, bone))
