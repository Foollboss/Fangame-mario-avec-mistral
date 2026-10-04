shader_type spatial;
// Domain portal: a swirling disc of light inside the stone gate (UV centred on 0.5).
render_mode unshaded, cull_disabled, shadows_disabled, blend_add, depth_draw_never;

uniform vec4 tint : source_color = vec4(0.45, 0.8, 1.0, 1.0);
uniform float strength = 1.0;      // 0 = sealed (rank too low), 1 = open

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
	vec2 i = floor(p), f = fract(p);
	f = f * f * (3.0 - 2.0 * f);
	return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

void fragment() {
	vec2 d = UV - 0.5;
	float r = length(d) * 2.0;
	if (r > 1.0) discard;
	float a = atan(d.y, d.x);
	float swirl = a + r * 5.0 - TIME * 1.6;
	float n = noise(vec2(swirl * 1.6, r * 4.0 - TIME * 0.8)) * 0.6 + noise(vec2(swirl * 3.2 + 4.0, r * 9.0)) * 0.4;
	float ring = smoothstep(1.0, 0.82, r) * smoothstep(0.55, 0.92, r);
	float core = smoothstep(0.75, 0.0, r);
	float k = (n * 0.75 + core * 0.55) * smoothstep(1.0, 0.9, r) + ring * 0.8;
	ALBEDO = tint.rgb * k * mix(0.2, 0.85, strength);
}
