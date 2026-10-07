shader_type spatial;
// Asphalte procédural : grain, traces de pneus, marquages, rails de tram (SF), route mouillée.
// UV.x = position latérale en mètres (0 = centre), UV.y = distance le long de la piste (m).

uniform float half_width = 8.0;
uniform float lane_width = 4.0;
uniform float wet : hint_range(0.0, 1.0) = 0.0;
uniform float rails : hint_range(0.0, 1.0) = 0.0;
uniform vec3 asphalt_color : source_color = vec3(0.17, 0.17, 0.18);
uniform vec3 line_color : source_color = vec3(0.93, 0.93, 0.9);
uniform vec3 center_color : source_color = vec3(0.98, 0.76, 0.12);

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p) {
	vec2 i = floor(p);
	vec2 f = fract(p);
	f = f * f * (3.0 - 2.0 * f);
	return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

void fragment() {
	float x = UV.x;
	float s = UV.y;
	float n = vnoise(vec2(x, s) * 2.3) * 0.5 + vnoise(vec2(x, s) * 0.25) * 0.5;
	float grain = hash(floor(vec2(x, s) * 35.0));
	vec3 col = asphalt_color * (0.82 + 0.3 * n + 0.1 * grain);
	// patchs de réparation
	float patch = step(0.82, vnoise(vec2(x * 0.15, s * 0.04) + 13.0));
	col *= 1.0 - 0.18 * patch;
	// traces de roues dans chaque voie
	float lp = mod(x + half_width, lane_width);
	float tracks = smoothstep(0.45, 0.0, abs(lp - 1.1)) + smoothstep(0.45, 0.0, abs(lp - 2.9));
	col *= 1.0 - 0.13 * tracks;

	float wear = 0.7 + 0.3 * vnoise(vec2(x * 4.0, s * 0.7));
	float paint = 0.0;
	// lignes de rive
	paint = max(paint, step(abs(abs(x) - (half_width - 0.5)), 0.11));
	// pointillés entre les voies (sauf au centre)
	for (int k = 1; k < 8; k++) {
		float lx = -half_width + float(k) * lane_width;
		if (lx >= half_width - 0.1) break;
		if (abs(lx) < 0.01) continue;
		paint = max(paint, step(abs(x - lx), 0.08) * step(mod(s, 10.0), 4.5));
	}
	col = mix(col, line_color, paint * wear);
	// double ligne jaune centrale
	float c = step(abs(abs(x) - 0.2), 0.075);
	col = mix(col, center_color, c * wear);

	float metal = 0.0;
	if (rails > 0.5) {
		float r1 = abs(abs(x) - 2.0);
		float rail = step(abs(r1 - 0.72), 0.045);
		float slot = step(r1, 0.03);
		col = mix(col, vec3(0.55, 0.55, 0.58), rail);
		col = mix(col, vec3(0.02), slot);
		metal = rail;
	}

	float puddle = smoothstep(0.55, 0.75, vnoise(vec2(x * 0.3, s * 0.08) + 5.0));
	float w = wet * (0.55 + 0.45 * puddle);
	ALBEDO = col * (1.0 - 0.45 * w);
	ROUGHNESS = mix(0.86 - 0.2 * paint, 0.08, w);
	METALLIC = metal * 0.9;
	SPECULAR = 0.5 - 0.35 * paint;
}
