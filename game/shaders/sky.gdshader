shader_type sky;
// Painterly anime sky: deep blue gradient, big puffy cumulus lit by the sun (bright crowns, soft blue bellies,
// golden rims at dawn / dusk), thin cirrus veils, sun glare; at night a blue starry sky with the Milky Way and the moon.

uniform vec3 zenith : source_color = vec3(0.16, 0.42, 0.90);
uniform vec3 horizon : source_color = vec3(0.70, 0.88, 1.0);
uniform vec3 ground_col : source_color = vec3(0.62, 0.78, 0.92);
uniform vec3 cloud_col : source_color = vec3(1.0, 1.0, 1.0);
uniform vec3 cloud_shade : source_color = vec3(0.62, 0.72, 0.88);
uniform vec3 glow_col : source_color = vec3(1.0, 0.55, 0.30);
uniform vec3 sun_dir = vec3(0.3, 0.6, 0.5);
uniform vec3 moon_dir = vec3(-0.3, 0.6, -0.5);
uniform float night = 0.0;
uniform float sunset = 0.0;
uniform float cover = 0.48;        // cloud coverage

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p) {
	vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
	float v = 0.0; float a = 0.5;
	for (int i = 0; i < 4; i++) { v += a * vnoise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; }
	return v / 0.9375;
}

void sky() {
	vec3 d = EYEDIR;
	vec3 sd = normalize(sun_dir);
	float up = clamp(d.y, 0.0, 1.0);
	// sky gradient: a pale band near the horizon that quickly turns into deep blue
	vec3 col = mix(horizon, zenith, pow(smoothstep(0.0, 0.62, up), 0.65));
	if (d.y < 0.0) { col = mix(horizon, ground_col, clamp(-d.y * 4.0, 0.0, 1.0)); }
	float sun_amt = max(dot(d, sd), 0.0);
	// brighter, warmer sky around the sun; big sunset glow hugging the horizon
	col += glow_col * pow(sun_amt, 6.0) * 0.18 * (1.0 - night);
	float around = pow(max(dot(normalize(vec3(d.x, 0.0, d.z)), normalize(vec3(sd.x, 0.0, sd.z))), 0.0), 2.5);
	col = mix(col, glow_col, sunset * around * (1.0 - smoothstep(0.0, 0.5, abs(d.y))) * 0.9);
	col = mix(col, glow_col * vec3(1.0, 0.7, 0.85), sunset * (1.0 - around) * (1.0 - smoothstep(0.0, 0.3, abs(d.y))) * 0.35);

	// ---- night sky: stars, Milky Way, moon
	if (night > 0.01 && d.y > -0.05) {
		vec2 sp = vec2(atan(d.z, d.x) * 110.0, asin(clamp(d.y, -1.0, 1.0)) * 110.0);
		vec2 cell = floor(sp);
		float h = hash(cell);
		float star = step(0.982, h) * smoothstep(0.42, 0.0, length(fract(sp) - 0.5 - (vec2(hash(cell + 3.1), hash(cell + 7.7)) - 0.5) * 0.5));
		float tw = 0.55 + 0.45 * sin(TIME * (1.5 + h * 4.0) + h * 50.0);
		vec3 star_col = mix(vec3(0.75, 0.85, 1.0), vec3(1.0, 0.92, 0.8), hash(cell + 1.3));
		col += star_col * star * tw * night * 1.4 * smoothstep(-0.02, 0.2, d.y);
		// Milky Way: a soft noisy band across the sky
		vec3 band_n = normalize(vec3(0.35, 0.25, 0.9));
		float b = 1.0 - abs(dot(d, band_n));
		float mw = smoothstep(0.72, 1.0, b) * (0.55 + 0.45 * fbm(d.xz * 7.0 + d.y * 3.0));
		col += vec3(0.30, 0.36, 0.62) * mw * night * 0.55 * smoothstep(0.0, 0.3, d.y);
		// fine star dust inside the band
		col += vec3(0.8, 0.85, 1.0) * step(0.93, hash(floor(sp * 2.3))) * mw * night * 0.5;
	}
	vec3 md = normalize(moon_dir);
	float mdot = dot(d, md);
	float moon = smoothstep(0.99955, 0.99975, mdot);
	float crater = vnoise((d.xz - md.xz) * 900.0) * 0.18;
	col = mix(col, vec3(0.95, 0.96, 1.0) * (1.0 - crater), moon * night);
	col += vec3(0.45, 0.58, 0.95) * pow(max(mdot, 0.0), 80.0) * 0.45 * night;
	col += vec3(0.30, 0.40, 0.75) * pow(max(mdot, 0.0), 8.0) * 0.12 * night;

	// ---- cumulus clouds on a curved layer
	if (d.y > 0.0) {
		vec2 p = d.xz / (d.y * 0.92 + 0.08);
		vec2 wind = vec2(TIME * 0.010, TIME * 0.004);
		vec2 q = p * 0.55 + wind;
		vec2 warp = vec2(fbm(q * 0.6 + 4.0), fbm(q * 0.6 + 11.0)) - 0.5;
		float dens = fbm(q + warp * 0.9);
		float c = smoothstep(cover, cover + 0.2, dens);
		// light: compare with the density a little towards the sun -> shaded bellies, bright crowns
		vec2 to_sun = normalize(sd.xz + vec2(0.0001)) * 0.18;
		float dens2 = fbm(q + to_sun + warp * 0.9);
		float lit = clamp(0.62 + (dens - dens2) * 3.2, 0.0, 1.0);
		float belly = smoothstep(cover + 0.32, cover + 0.06, dens);       // thin edges are brighter
		vec3 day_cloud = mix(cloud_shade, cloud_col, clamp(lit * 0.75 + belly * 0.35, 0.0, 1.0));
		// silver / golden lining near the sun
		day_cloud += glow_col * pow(sun_amt, 10.0) * belly * (0.4 + sunset);
		day_cloud = mix(day_cloud, day_cloud * mix(vec3(1.0), glow_col * 1.25, 0.55), sunset * (0.4 + 0.6 * around));
		vec3 night_cloud = mix(vec3(0.07, 0.10, 0.22), vec3(0.20, 0.26, 0.44), lit);
		vec3 cc = mix(day_cloud, night_cloud, night);
		float fade = smoothstep(0.0, 0.16, d.y);
		col = mix(col, cc, c * fade * 0.96);
		// high cirrus veils
		float ci = fbm(vec2(p.x * 0.18, p.y * 0.7) + wind * 2.0 + 20.0);
		col = mix(col, mix(cloud_col, vec3(0.3, 0.38, 0.6), night), smoothstep(0.58, 0.85, ci) * 0.28 * fade * (1.0 - c));
	}
	// sun disc and glare
	float sun = smoothstep(0.9993, 0.9996, sun_amt);
	col += vec3(1.0, 0.96, 0.86) * sun * 3.0 * (1.0 - night);
	col += vec3(1.0, 0.92, 0.75) * pow(sun_amt, 220.0) * 0.8 * (1.0 - night);
	COLOR = col;
}
