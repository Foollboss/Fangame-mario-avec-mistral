shader_type spatial;
render_mode diffuse_toon, specular_disabled, cull_disabled;
// Little bell flowers that glow softly at night (vertex colour alpha = glowing part).

uniform float night = 0.0;

varying float glow;
varying vec3 vcol;

void vertex() {
	glow = COLOR.a;
	vcol = mix(vec3(0.20, 0.42, 0.20), COLOR.rgb, glow);
	vec3 w = (MODEL_MATRIX * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
	float k = clamp(VERTEX.y / 0.35, 0.0, 1.2);
	VERTEX.x += sin(TIME * 1.7 + w.x * 0.4 + w.z * 0.3) * 0.03 * k * k;
}

void fragment() {
	vec3 w = (INV_VIEW_MATRIX * vec4(VERTEX, 1.0)).xyz;
	float pulse = 0.75 + 0.25 * sin(TIME * 1.4 + w.x * 1.7 + w.z * 1.3);
	ALBEDO = vcol * mix(1.0, 0.6, night * glow);
	EMISSION = vcol * glow * (0.12 + 2.6 * night) * pulse;
}
