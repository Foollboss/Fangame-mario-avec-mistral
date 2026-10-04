shader_type spatial;
// Flowing lava ribbon for Zahara's "Torrent de lave": UV.x goes across the strip (0..1), UV.y along it in metres.
render_mode unshaded, cull_disabled, depth_draw_never, blend_mix, shadows_disabled;

uniform float reach = 0.0;      // how far (m) the lava front has advanced
uniform float fade = 1.0;       // 1 -> 0 when the torrent cools down
uniform float cool = 0.0;       // 0 molten -> 1 crusted

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
	vec2 i = floor(p), f = fract(p);
	f = f * f * (3.0 - 2.0 * f);
	return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

void fragment() {
	float along = UV.y;
	float front = reach - along;
	if (front < 0.0) discard;
	float edge = 1.0 - abs(UV.x * 2.0 - 1.0);                 // 1 in the middle, 0 on the banks
	float wob = noise(vec2(along * 0.9, TIME * 0.7)) * 0.35;   // ragged banks
	float n = noise(vec2(UV.x * 5.0, along * 1.3 - TIME * 1.6)) * 0.6 + noise(vec2(UV.x * 11.0 + 3.0, along * 3.1 - TIME * 2.4)) * 0.4;
	vec3 crust = vec3(0.16, 0.05, 0.03);
	vec3 mid = vec3(0.95, 0.30, 0.05);
	vec3 hot = vec3(1.0, 0.78, 0.30);
	float heat = clamp(n * 0.75 + edge * 0.55 - cool * 0.6, 0.0, 1.0);
	vec3 col = mix(crust, mid, smoothstep(0.25, 0.55, heat));
	col = mix(col, hot, smoothstep(0.62, 0.9, heat));
	col += hot * smoothstep(0.6, 0.0, front) * 0.5;            // bright leading edge
	ALBEDO = col;
	ALPHA = smoothstep(0.0, 0.22 + wob * 0.3, edge) * fade * smoothstep(0.0, 0.35, front + 0.05);
}
