shader_type spatial;
render_mode diffuse_toon, specular_disabled, cull_disabled;
// Toon foliage tinted per instance (MultiMesh colour, linear) with a gentle wind sway that grows with height.
// Tree crowns get "cloud" normals (pointing away from the crown centre) so they shade like soft round clumps,
// a dark-to-light vertical gradient and a light rim, the way anime trees are painted.

uniform vec3 base_tint : source_color = vec3(1.0);
uniform float sway = 0.08;
uniform float sway_height = 1.0;
uniform float near_fade = 0.0;     // 1 = dither away when the camera is inside / very close (tree crowns)
uniform vec3 crown_center = vec3(0.0);
uniform float crown_radius = 0.0;  // 0 = no crown shaping (grass, petals...)
uniform vec2 crown_y = vec2(0.0, 1.0);
uniform float grade = 1.0;

varying vec3 tint;
varying float hgrad;

void vertex() {
	tint = COLOR.rgb;
	hgrad = 1.0;
	if (crown_radius > 0.0) {
		vec3 sph = normalize(VERTEX - crown_center);
		NORMAL = normalize(mix(NORMAL, sph, 0.82));
		hgrad = clamp((VERTEX.y - crown_y.x) / max(crown_y.y - crown_y.x, 0.01), 0.0, 1.0);
	}
	vec3 w = (MODEL_MATRIX * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
	float k = clamp(VERTEX.y / sway_height, 0.0, 1.5);
	float t = TIME * 1.6 + w.x * 0.21 + w.z * 0.17;
	float gust = 0.75 + 0.25 * sin(TIME * 0.37 + w.x * 0.05);
	VERTEX.x += sin(t) * sway * k * k * gust;
	VERTEX.z += cos(t * 0.8 + 1.3) * sway * 0.6 * k * k * gust;
}

void fragment() {
	if (near_fade > 0.0) {
		float d = length(VERTEX);
		float fade = smoothstep(2.4, 4.2, d);
		float dith = fract(52.9829189 * fract(dot(FRAGCOORD.xy, vec2(0.06711056, 0.00583715))));
		if (fade < dith) discard;
	}
	vec3 c = base_tint * tint;
	// same anime grading as the terrain: greens pulled towards yellow-green
	float gw = smoothstep(0.0, 0.2, c.g - c.r) * smoothstep(-0.05, 0.12, c.g - c.b) * grade;
	c = mix(c, vec3(c.g * 0.42 + c.r * 0.1, c.g * 0.82, c.b * 0.55), gw);
	if (crown_radius > 0.0) {
		c *= mix(0.62, 1.28, hgrad);
		float rim = 1.0 - clamp(dot(normalize(NORMAL), normalize(VIEW)), 0.0, 1.0);
		c += c * pow(rim, 3.0) * 0.45;
	}
	ALBEDO = c;
	ROUGHNESS = 0.7;
}
