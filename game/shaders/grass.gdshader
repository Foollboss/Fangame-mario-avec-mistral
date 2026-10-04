shader_type spatial;
render_mode cull_disabled, diffuse_toon, specular_disabled, world_vertex_coords;
// Dense grass around the player. Every instance is a clump of blades sitting on a world-space grid cell: position
// jitter, rotation and size come from the cell hash (stable when the field follows the player), height from the
// terrain heightmap (same triangulation as the terrain mesh), colour and density from the baked terrain maps.
// Blades sway in travelling wind gusts and bend away from the player.

uniform sampler2D hmap : filter_nearest, repeat_disable;     // RF heights, N x N
uniform sampler2D gcolor : filter_linear, repeat_disable;     // sRGB terrain colour (rgb)
uniform sampler2D gmask : filter_linear, repeat_disable;      // grass density (r)
uniform vec4 map_rect = vec4(-300.0, -300.0, 600.0, 241.0);   // x0, z0, size (m), N
uniform vec3 player_pos = vec3(0.0);
uniform float radius = 20.0;
uniform float spacing = 0.5;
uniform float blade_h = 0.48;
uniform float wind = 0.16;
uniform float grade = 1.0;

varying vec3 gcol;
varying float tipk;
varying float patch;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p) {
	vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float height_at(vec2 xz) {
	float n = map_rect.w - 1.0;
	vec2 g = clamp((xz - map_rect.xy) / map_rect.z * n, vec2(0.0), vec2(n - 0.001));
	vec2 i = floor(g); vec2 f = g - i;
	ivec2 ii = ivec2(i);
	float h00 = texelFetch(hmap, ii, 0).r;
	float h10 = texelFetch(hmap, ii + ivec2(1, 0), 0).r;
	float h01 = texelFetch(hmap, ii + ivec2(0, 1), 0).r;
	float h11 = texelFetch(hmap, ii + ivec2(1, 1), 0).r;
	// same two triangles per cell as the terrain mesh
	if (f.x + f.y < 1.0) return h00 + (h10 - h00) * f.x + (h01 - h00) * f.y;
	return h11 + (h01 - h11) * (1.0 - f.x) + (h10 - h11) * (1.0 - f.y);
}

void vertex() {
	vec3 origin = MODEL_MATRIX[3].xyz;
	vec2 cell = floor(origin.xz / spacing + 0.5);
	vec2 jit = vec2(hash(cell), hash(cell + 17.3)) - 0.5;
	vec2 pos = (cell + jit * 0.95) * spacing;
	vec2 muv = (pos - map_rect.xy) / map_rect.z;
	float dens = texture(gmask, muv).r;
	float keep = step(hash(cell + 5.1), dens * 1.2 - 0.1);
	float dist = length(pos - player_pos.xz);
	float fade = 1.0 - smoothstep(radius * 0.62, radius * 0.97, dist);
	float sc = (0.65 + 0.7 * hash(cell + 9.7)) * keep * fade;
	// blades right in front of the lens shrink away (low camera angles)
	sc *= smoothstep(0.6, 1.8, length(vec3(pos.x, origin.y, pos.y) - CAMERA_POSITION_WORLD + vec3(0.0, height_at(pos), 0.0)));
	vec3 lv = VERTEX - origin;
	float a = hash(cell + 2.9) * 6.2832;
	float ca = cos(a); float sa = sin(a);
	lv.xz = vec2(ca * lv.x - sa * lv.z, sa * lv.x + ca * lv.z);
	float k = UV.y;
	lv.y *= blade_h * sc;
	lv.xz *= 0.5 + 0.5 * sc;
	// wind: a steady breeze with travelling gusts
	float gust = sin(dot(pos, vec2(0.11, 0.06)) - TIME * 1.6) * 0.5 + 0.5;
	vec2 wv = vec2(sin(TIME * 2.3 + pos.x * 0.7 + pos.y * 0.4), cos(TIME * 1.9 + pos.y * 0.6 + pos.x * 0.2)) * 0.35
			+ vec2(0.8, 0.45) * (0.35 + gust);
	vec2 bend = wv * wind * k * k * sc;
	// the player pushes the blades aside
	vec2 away = pos - player_pos.xz;
	float pd = length(away);
	float push = (1.0 - smoothstep(0.15, 1.0, pd)) * (1.0 - smoothstep(1.0, 2.2, abs(player_pos.y - height_at(pos) - 0.2)));
	bend += away / max(pd, 0.001) * push * 0.42 * k * sc;
	lv.xz += bend;
	lv.y -= length(bend) * 0.45 * k;
	VERTEX = vec3(pos.x, height_at(pos) - 0.05, pos.y) + lv;
	NORMAL = vec3(0.0, 1.0, 0.0);
	gcol = pow(texture(gcolor, muv).rgb, vec3(1.75)) * 1.05;
	tipk = k;
	patch = smoothstep(0.30, 0.74, vnoise(pos * 0.022 + 3.7) * 0.65 + vnoise(pos * 0.08) * 0.35);
}

void fragment() {
	vec3 base = gcol;
	// same grading as the terrain under it
	float gw = smoothstep(0.0, 0.2, base.g - base.r) * smoothstep(-0.05, 0.12, base.g - base.b);
	vec3 g_sun = mix(base * vec3(1.08, 1.02, 0.8), vec3(base.g * 0.44 + base.r * 0.08, base.g * 0.82, base.b * 0.5), gw);
	vec3 g_deep = mix(base * vec3(0.76, 0.86, 0.95), vec3(base.g * 0.2, base.g * 0.47, base.b * 0.6 + base.g * 0.04), gw);
	vec3 c = mix(base, mix(g_deep, g_sun, patch), grade);
	c *= mix(0.72, 1.18, tipk);
	c = mix(c, c * vec3(1.16, 1.10, 0.66), tipk * tipk * 0.5);     // sun-bleached tips
	ALBEDO = c;
	// light every blade like the ground it grows from (both faces), so the meadow reads as one soft surface
	NORMAL = normalize((VIEW_MATRIX * vec4(0.0, 1.0, 0.0, 0.0)).xyz);
	ROUGHNESS = 0.75;
}
