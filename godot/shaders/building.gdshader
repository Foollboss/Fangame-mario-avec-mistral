shader_type spatial;
// Façades procédurales (MultiMesh) : fenêtres, rez-de-chaussée, enseignes néon la nuit.
// INSTANCE_CUSTOM : rgb = couleur du bâtiment, a = graine aléatoire.

uniform float night : hint_range(0.0, 1.0) = 0.0;
uniform float neon : hint_range(0.0, 1.0) = 0.0;
uniform float floor_h = 3.4;
uniform float win_w = 2.6;
uniform vec3 glass_color : source_color = vec3(0.12, 0.16, 0.22);

varying vec3 wpos;
varying vec3 wnrm;
varying vec4 cust;
varying float ly;
varying float bh;

float hash3(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453); }

void vertex() {
	wpos = (MODEL_MATRIX * vec4(VERTEX, 1.0)).xyz;
	wnrm = normalize((MODEL_MATRIX * vec4(NORMAL, 0.0)).xyz);
	cust = INSTANCE_CUSTOM;
	bh = length(MODEL_MATRIX[1].xyz);
	ly = (VERTEX.y + 0.5) * bh;
}

void fragment() {
	vec3 base = cust.rgb;
	float seed = cust.a * 97.0;
	if (abs(wnrm.y) > 0.5) {
		ALBEDO = base * 0.3;
		ROUGHNESS = 0.9;
	} else {
		vec2 t2 = normalize(vec2(-wnrm.z, wnrm.x));
		float hc = dot(wpos.xz, t2);
		float fx = fract(hc / win_w);
		float fy = fract(ly / floor_h);
		vec2 cell = vec2(floor(hc / win_w), floor(ly / floor_h));
		float win = step(0.16, fx) * step(fx, 0.84) * step(0.26, fy) * step(fy, 0.84);
		// anti-crénelage : au loin, les fenêtres se fondent en une teinte moyenne
		float aa = clamp(max(fwidth(hc / win_w), fwidth(ly / floor_h)) * 2.5 - 0.3, 0.0, 1.0);
		win = mix(win, 0.38, aa);
		float ground = step(ly, 4.2);
		float cornice = step(bh - 0.7, ly);
		float h = hash3(vec3(cell, seed));
		vec3 wall = base * (0.88 + 0.12 * step(0.5, fract(hc * 0.5 / win_w)));
		wall = mix(wall, base * 1.25 + 0.08, cornice);
		vec3 g = glass_color * (0.7 + 0.6 * h);
		vec3 shop = vec3(0.05, 0.05, 0.06);
		vec3 albedo = mix(wall, g, win * (1.0 - ground));
		albedo = mix(albedo, shop, ground * step(0.1, fx) * step(fx, 0.9) * step(ly, 3.4));
		ALBEDO = albedo;
		float glassy = win * (1.0 - ground);
		ROUGHNESS = mix(0.85, 0.32, glassy);
		METALLIC = glassy * 0.25;
		float lit = step(0.52, h) * night;
		lit = mix(lit, 0.45 * night, aa);
		vec3 warm = mix(vec3(1.0, 0.75, 0.45), vec3(0.75, 0.85, 1.0), step(0.8, h));
		vec3 em = glassy * lit * warm * (1.2 + 1.8 * hash3(vec3(cell.yx, seed)));
		// vitrines éclairées
		em += ground * step(0.1, fx) * step(fx, 0.9) * step(ly, 3.4) * night * vec3(1.0, 0.85, 0.6) * 1.5;
		// bandes néon
		if (neon > 0.0) {
			float band_floor = floor(hash3(vec3(seed, 1.0, 2.0)) * 6.0) + 2.0;
			float band = step(abs(ly - band_floor * floor_h), 0.35);
			float vband = step(abs(fract(hc / (win_w * 7.0) + hash3(vec3(seed))) - 0.5), 0.02) * step(6.0, ly) * step(ly, 30.0);
			vec3 nc = mix(vec3(1.0, 0.15, 0.75), vec3(0.1, 0.85, 1.0), step(0.5, hash3(vec3(seed, 3.0, 1.0))));
			nc = mix(nc, vec3(0.7, 0.25, 1.0), step(0.75, hash3(vec3(seed, 5.0, 7.0))));
			em += (band + vband) * nc * 4.0 * neon;
		}
		EMISSION = em;
	}
}
