shader_type canvas_item;
// Red damage vignette: transparent centre, tinted edges; strength comes from the ColorRect colour alpha.
void fragment() {
	vec2 d = (UV - 0.5) * vec2(1.0, 0.85);
	float v = smoothstep(0.28, 0.72, length(d) * 1.45);
	COLOR = vec4(0.85, 0.04, 0.06, v * COLOR.a);
}
