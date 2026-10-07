// Eau animée (baie, océan).
shader_type spatial;
render_mode cull_disabled;

uniform sampler2D normal_tex : hint_normal, filter_linear_mipmap, repeat_enable;
uniform vec4 deep : source_color = vec4(0.02, 0.1, 0.18, 1.0);
uniform vec4 shallow : source_color = vec4(0.1, 0.35, 0.45, 1.0);

void fragment() {
	vec3 wp = (INV_VIEW_MATRIX * vec4(VERTEX, 1.0)).xyz;
	vec2 uv = wp.xz * 0.015;
	vec3 n1 = texture(normal_tex, uv + TIME * vec2(0.010, 0.006)).rgb;
	vec3 n2 = texture(normal_tex, uv * 2.3 - TIME * vec2(0.007, 0.012)).rgb;
	NORMAL_MAP = normalize((n1 + n2) * 0.5);
	NORMAL_MAP_DEPTH = 0.6;
	float fres = pow(1.0 - clamp(dot(NORMAL, VIEW), 0.0, 1.0), 4.0);
	ALBEDO = mix(deep.rgb, shallow.rgb, 0.35 + 0.4 * fres);
	ROUGHNESS = 0.06;
	METALLIC = 0.15;
	SPECULAR = 0.9;
}
