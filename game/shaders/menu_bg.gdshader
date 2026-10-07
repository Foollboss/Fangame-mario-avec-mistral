// Fond animé des menus (dégradé violet + bandes diagonales + lueurs).
shader_type canvas_item;

uniform vec4 col_a : source_color = vec4(0.10, 0.03, 0.25, 1.0);
uniform vec4 col_b : source_color = vec4(0.45, 0.08, 0.65, 1.0);
uniform vec4 col_c : source_color = vec4(0.95, 0.2, 0.75, 1.0);
uniform float stripes = 1.0;

void fragment() {
	vec2 uv = UV;
	float g = smoothstep(0.0, 1.0, uv.x * 0.7 + (1.0 - uv.y) * 0.4);
	vec3 c = mix(col_a.rgb, col_b.rgb, g);
	float d = uv.x * 1.6 + uv.y * 0.9 - TIME * 0.03;
	float s = smoothstep(0.46, 0.5, fract(d * 4.0)) * smoothstep(0.62, 0.5, fract(d * 4.0));
	c += col_c.rgb * s * 0.08 * stripes;
	float glow = exp(-length((uv - vec2(0.78, 0.35)) * vec2(1.6, 2.4)) * 2.4);
	c += col_c.rgb * glow * 0.35;
	float glow2 = exp(-length((uv - vec2(0.15, 0.9)) * vec2(1.4, 2.0)) * 3.0);
	c += vec3(0.3, 0.2, 1.0) * glow2 * 0.25;
	float grid = step(0.985, fract(uv.x * 40.0)) + step(0.985, fract(uv.y * 22.0));
	c += vec3(1.0) * grid * 0.015;
	COLOR = vec4(c, 1.0);
}
