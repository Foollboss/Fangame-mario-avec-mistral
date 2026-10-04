shader_type spatial;
render_mode blend_mix, cull_disabled, diffuse_toon, specular_toon, depth_draw_always;
// Anime water: crystal turquoise shallows, deep saturated blue, sky reflection at grazing angles (fresnel),
// rippling normals with sharp sun / moon glints and soft foam lines along every shore.
// Shallows and foam come from the baked terrain height texture, so any coast (sea or lake) works.

uniform vec3 deep_color : source_color = vec3(0.05, 0.38, 0.62);
uniform vec3 shallow_color : source_color = vec3(0.20, 0.78, 0.86);
uniform vec3 foam_color : source_color = vec3(0.92, 0.98, 1.0);
uniform vec3 sky_col : source_color = vec3(0.70, 0.86, 1.0);
uniform float night = 0.0;
uniform float wave_height = 0.12;
uniform float water_level = 0.05;
uniform sampler2D height_tex : filter_linear, repeat_disable;
uniform vec3 map_rect = vec3(-300.0, -300.0, 600.0);   // x0, z0, size in metres
uniform float h_min = -8.0;
uniform float h_range = 24.0;
uniform float foam_k = 1.0;            // marsh pools: almost no foam

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p) {
	vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float ripples(vec2 p) {
	return vnoise(p * 0.35 + vec2(TIME * 0.11, TIME * 0.07)) * 0.6 + vnoise(p * 0.9 - vec2(TIME * 0.13, -TIME * 0.05)) * 0.4;
}
varying vec3 wpos;
void vertex() {
	wpos = (MODEL_MATRIX * vec4(VERTEX, 1.0)).xyz;
	float w = sin(wpos.x * 0.35 + TIME * 1.3) * cos(wpos.z * 0.28 + TIME * 1.1);
	VERTEX.y += w * wave_height;
}
void fragment() {
	vec2 muv = (wpos.xz - map_rect.xy) / map_rect.z;
	float inside = step(0.0, muv.x) * step(muv.x, 1.0) * step(0.0, muv.y) * step(muv.y, 1.0);
	float th = mix(h_min, h_min + h_range * texture(height_tex, clamp(muv, 0.0, 1.0)).r, inside);
	float depth = water_level - th;
	// rippling normal from two scrolling noise layers
	float e = 0.35;
	float r0 = ripples(wpos.xz);
	float rx = ripples(wpos.xz + vec2(e, 0.0));
	float rz = ripples(wpos.xz + vec2(0.0, e));
	vec3 wn = normalize(vec3((r0 - rx) * 1.4, 1.0, (r0 - rz) * 1.4));
	NORMAL = normalize((VIEW_MATRIX * vec4(wn, 0.0)).xyz);
	float shallow = smoothstep(5.5, 0.3, depth);
	vec3 col = mix(deep_color, shallow_color, shallow * 0.9 + r0 * 0.1);
	// sky reflection at grazing angles
	float fres = pow(1.0 - clamp(dot(NORMAL, VIEW), 0.0, 1.0), 4.0);
	col = mix(col, sky_col, clamp(fres * 0.75, 0.0, 0.75));
	// foam: a soft band hugging the shore plus broken lines that come and go
	float lines = step(0.42, r0 + 0.25 * sin(TIME * 2.0 + depth * 6.0));
	float foam = (smoothstep(0.9, 0.15, depth) * lines + smoothstep(0.25, 0.02, depth) * 0.8) * foam_k;
	float sparkle = step(0.9, vnoise(wpos.xz * 1.1 + TIME * 0.6)) * (1.0 - night * 0.6);
	col = mix(col, foam_color * mix(1.0, 0.45, night), clamp(max(sparkle * 0.55, foam), 0.0, 1.0));
	ALBEDO = col;
	ROUGHNESS = 0.18;
	SPECULAR = 0.7;
	ALPHA = mix(0.94, 0.72, shallow);
}
