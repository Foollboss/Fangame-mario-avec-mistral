shader_type spatial;
// Molten lava for the Terres de Braise: pools (slow churning crust) and streams running down the volcano.
// Streams: UV.x across (0..1), UV.y along in metres, flow_speed > 0. Pools: world-space pattern, flow_speed = 0.
render_mode unshaded, cull_disabled, shadows_disabled, depth_draw_opaque;

uniform float flow_speed = 0.0;
uniform float brightness = 1.35;

varying vec3 wpos;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
	vec2 i = floor(p), f = fract(p);
	f = f * f * (3.0 - 2.0 * f);
	return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

void vertex() {
	wpos = (MODEL_MATRIX * vec4(VERTEX, 1.0)).xyz;
}

void fragment() {
	vec2 q;
	float edge = 1.0;
	if (flow_speed > 0.0) {
		q = vec2(UV.x * 2.6, UV.y * 0.55 - TIME * flow_speed);
		edge = 1.0 - abs(UV.x * 2.0 - 1.0);
	} else {
		q = wpos.xz * 0.32 + vec2(sin(TIME * 0.21 + wpos.z * 0.05), cos(TIME * 0.17 + wpos.x * 0.05)) * 0.6;
	}
	float n = noise(q * 1.3) * 0.62 + noise(q * 3.4 + vec2(7.0, -TIME * 0.35)) * 0.38;
	float pulse = 0.08 * sin(TIME * 1.7 + wpos.x * 0.3 + wpos.z * 0.2);
	vec3 crust = vec3(0.12, 0.045, 0.03);
	vec3 mid = vec3(1.0, 0.30, 0.04);
	vec3 hot = vec3(1.0, 0.80, 0.32);
	float heat = clamp(n * 0.95 + pulse + (edge - 0.5) * 0.35, 0.0, 1.0);
	vec3 col = mix(crust, mid, smoothstep(0.30, 0.52, heat));
	col = mix(col, hot, smoothstep(0.66, 0.9, heat));
	ALBEDO = col * brightness;
	ALPHA = smoothstep(0.0, 0.18, edge);
}
