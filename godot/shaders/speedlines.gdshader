shader_type canvas_item;
// Lignes de vitesse radiales en surimpression (nitro).
uniform float intensity : hint_range(0.0, 1.0) = 0.0;
uniform vec4 tint : source_color = vec4(1.0, 1.0, 1.0, 1.0);

float hash(float n) { return fract(sin(n) * 43758.5453); }

void fragment() {
	vec2 p = UV - vec2(0.5, 0.48);
	p.x *= 1.777;
	float r = length(p);
	float a = atan(p.y, p.x);
	float seg = floor(a * 60.0);
	float h = hash(seg);
	float speed = fract(h * 7.0 + TIME * (1.5 + h * 2.5));
	float line = step(0.82, h) * smoothstep(0.3, 0.9, r) * smoothstep(0.0, 0.2, speed) * (1.0 - speed);
	float vign = smoothstep(0.45, 1.0, r);
	COLOR = vec4(tint.rgb, (line * 0.55 + vign * 0.35) * intensity);
}
