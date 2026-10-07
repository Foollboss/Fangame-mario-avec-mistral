// Lignes de vitesse radiales (nitro).
shader_type canvas_item;

uniform float intensity = 0.0;
uniform vec4 tint : source_color = vec4(1.0, 1.0, 1.0, 1.0);

float hash(float n) { return fract(sin(n * 12.9898) * 43758.5453); }

void fragment() {
	vec2 p = UV - vec2(0.5, 0.48);
	p.x *= 1.78;
	float r = length(p);
	float a = atan(p.y, p.x);
	float bucket = floor(a * 60.0);
	float h = hash(bucket);
	float speed = 1.5 + h * 2.0;
	float streak = smoothstep(0.92, 1.0, fract(r * 1.5 - TIME * speed + h * 10.0));
	float thin = smoothstep(0.5, 0.0, abs(fract(a * 60.0) - 0.5) * 2.0 - 0.3);
	float mask = smoothstep(0.25, 0.7, r) * step(0.55, h);
	float v = streak * thin * mask * intensity;
	COLOR = vec4(tint.rgb, v * 0.55);
}
