// Flamme de nitro (cône additif, UV.y = 0 à la buse).
shader_type spatial;
render_mode blend_add, unshaded, cull_disabled, depth_draw_never, shadows_disabled;

uniform vec4 core : source_color = vec4(1.0, 0.95, 0.6, 1.0);
uniform vec4 edge : source_color = vec4(1.0, 0.45, 0.05, 1.0);
uniform float intensity = 1.0;

float hash(float n) { return fract(sin(n) * 43758.5453); }

void fragment() {
	float v = UV.y;
	float flick = 0.75 + 0.25 * sin(TIME * 60.0 + UV.x * 12.0) * hash(floor(TIME * 30.0));
	float a = pow(1.0 - v, 1.6) * flick * intensity;
	vec3 c = mix(core.rgb, edge.rgb, smoothstep(0.0, 0.7, v));
	ALBEDO = c * a * 2.5;
}
