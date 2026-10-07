// Vignettage + flash d'impact.
shader_type canvas_item;

uniform float amount = 0.35;
uniform vec4 flash : source_color = vec4(1.0, 1.0, 1.0, 0.0);

void fragment() {
	vec2 p = UV - 0.5;
	float v = smoothstep(0.35, 0.85, length(p * vec2(1.2, 1.0)));
	COLOR = vec4(mix(vec3(0.0), flash.rgb, flash.a), clamp(v * amount + flash.a, 0.0, 1.0));
}
