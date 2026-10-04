shader_type spatial;
render_mode diffuse_toon, specular_disabled, cull_disabled;
// Anime-style terrain. Baked biome colours (COLOR, sRGB), UV.x = grass amount, UV.y = snow amount.
// Painterly grass fields (sunny yellow-green / cool deep green patches), layered rock on cliffs,
// soft sand ripples, blue-shadowed snow.

uniform float detail = 0.10;
uniform float grade = 1.0;          // 0 = original colours, 1 = anime grading

varying vec3 wpos;
varying vec3 wnrm;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p) {
	vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

void vertex() {
	wpos = (MODEL_MATRIX * vec4(VERTEX, 1.0)).xyz;
	wnrm = normalize((MODEL_MATRIX * vec4(NORMAL, 0.0)).xyz);
}

void fragment() {
	vec3 base = pow(COLOR.rgb, vec3(1.75)) * 1.05;
	float grass = UV.x;
	float snow = UV.y;
	float n0 = vnoise(wpos.xz * 0.022 + 3.7);       // very large patches (~45 m)
	float n1 = vnoise(wpos.xz * 0.08);
	float n2 = vnoise(wpos.xz * 0.45);
	float n3 = vnoise(wpos.xz * 3.2);

	// ---- grass: greens are pulled towards anime yellow-greens, painted in large sunny / deep patches
	float gw = smoothstep(0.0, 0.2, base.g - base.r) * smoothstep(-0.05, 0.12, base.g - base.b);
	vec3 g_sun = mix(base * vec3(1.08, 1.02, 0.8), vec3(base.g * 0.44 + base.r * 0.08, base.g * 0.82, base.b * 0.5), gw);
	vec3 g_deep = mix(base * vec3(0.76, 0.86, 0.95), vec3(base.g * 0.2, base.g * 0.47, base.b * 0.6 + base.g * 0.04), gw);
	float patch = smoothstep(0.30, 0.74, n0 * 0.65 + n1 * 0.35);
	vec3 gcol = mix(g_deep, g_sun, patch);
	gcol *= 0.93 + 0.14 * n2;
	gcol *= 1.0 - smoothstep(0.62, 0.92, n3) * 0.12;          // blade clumps
	vec3 other = base * (1.0 - detail + detail * 2.0 * (0.6 * n1 + 0.4 * n2));
	vec3 col = mix(other, mix(base, gcol, grade), grass);

	// ---- dirt paths: light, dusty beige with pebbles and a grassy fringe
	float path = COLOR.a;
	float plum = dot(base, vec3(0.3, 0.59, 0.11));
	vec3 pcol = mix(vec3(plum), base, 0.55) * vec3(1.12, 1.08, 1.02);
	pcol *= 0.9 + 0.12 * n2 + 0.1 * step(0.8, vnoise(wpos.xz * 4.5));
	col = mix(col, pcol, smoothstep(0.2, 0.7, path) * grade);

	// ---- sand ripples where there is neither grass nor snow
	float sand = (1.0 - grass) * (1.0 - snow);
	col *= 1.0 - sand * smoothstep(0.55, 0.85, vnoise(vec2(wpos.x * 0.6 + wpos.z * 0.2, wpos.z * 2.4))) * 0.07;

	// ---- cliffs: layered rock where the ground is steep
	float slope = 1.0 - clamp(wnrm.y, 0.0, 1.0);
	float cliff = smoothstep(0.26, 0.42, slope + (n2 - 0.5) * 0.10) * (1.0 - snow * 0.8);
	cliff *= 1.0 - smoothstep(0.2, 0.7, path) * 0.85;          // trails stay trails, even where they climb
	float band = fract(wpos.y * 0.38 + n1 * 0.8 + n2 * 0.2);
	vec3 rock_a = vec3(0.50, 0.49, 0.47);
	vec3 rock_b = vec3(0.34, 0.33, 0.33);
	vec3 rock_c = vec3(0.60, 0.56, 0.48);
	// v6 lands: dark basalt with rusty seams around the volcano, violet slate on the storm cliffs
	rock_a = mix(rock_a, vec3(0.12, 0.09, 0.085), UV2.x); rock_b = mix(rock_b, vec3(0.07, 0.055, 0.055), UV2.x);
	rock_c = mix(rock_c, vec3(0.22, 0.11, 0.06), UV2.x);
	rock_a = mix(rock_a, vec3(0.37, 0.36, 0.48), UV2.y); rock_b = mix(rock_b, vec3(0.25, 0.24, 0.34), UV2.y);
	rock_c = mix(rock_c, vec3(0.47, 0.43, 0.56), UV2.y);
	vec3 rock = mix(rock_a, rock_b, smoothstep(0.50, 0.56, band) * (1.0 - smoothstep(0.86, 0.94, band)));
	rock = mix(rock, rock_c, smoothstep(0.15, 0.2, band) * (1.0 - smoothstep(0.3, 0.36, band)) * 0.8);
	rock *= 0.88 + 0.24 * vnoise(vec2((wpos.x + wpos.z) * 1.6, wpos.y * 0.35));   // vertical streaks
	rock = mix(rock, rock * vec3(0.92, 0.98, 1.08), 0.5);                              // cool cast
	// moss creeping on the ledges
	rock = mix(rock, gcol * 0.8, smoothstep(0.62, 0.8, n2) * (1.0 - smoothstep(0.42, 0.6, slope)) * grass);
	col = mix(col, rock, cliff * grade);

	// ---- snow: soft blue shadows in the noise and tiny glints
	col *= 1.0 - snow * 0.12;
	col = mix(col, col * vec3(0.80, 0.88, 1.0), snow * (1.0 - n2) * 0.5);
	col += vec3(0.5) * snow * step(0.93, vnoise(wpos.xz * 7.0)) * 0.4;
	col = mix(col, mix(vec3(dot(col, vec3(0.3, 0.59, 0.11))), col, 0.86) * vec3(0.95, 0.97, 1.0), grass);
	ALBEDO = col;
	ROUGHNESS = 0.62;

	// ---- Terres de Braise: glowing magma veins in patches of cracked ground (they light the night)
	if (UV2.x > 0.01) {
		vec2 cp = wpos.xz;
		float cn = vnoise(cp * 0.11 + 17.0) * 0.7 + vnoise(cp * 0.43 + 5.0) * 0.3;
		float aw = fwidth(cn);
		float vein = 1.0 - smoothstep(0.004, 0.02 + aw, abs(cn - 0.5));
		float zone = smoothstep(0.42, 0.68, vnoise(cp * 0.035 + 41.0));
		float fade = 1.0 - smoothstep(70.0, 150.0, length(wpos - CAMERA_POSITION_WORLD));
		float glow = vein * zone * UV2.x * fade * (1.0 - smoothstep(0.2, 0.6, path)) * (1.0 - snow);
		ALBEDO = mix(ALBEDO, vec3(0.22, 0.05, 0.02), glow);
		EMISSION = vec3(1.0, 0.32, 0.06) * glow * (0.85 + 0.3 * sin(TIME * 1.3 + cn * 23.0));
	}
}
