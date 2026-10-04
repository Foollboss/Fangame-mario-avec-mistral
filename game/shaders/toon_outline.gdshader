shader_type spatial;
render_mode unshaded, cull_front, depth_draw_opaque, shadows_disabled;
// Contour « coque inversée » coloré (version sombre de la couleur de base, comme dans les jeux anime),
// épaisseur quasi constante à l'écran.

uniform vec4 albedo : source_color = vec4(1.0);
uniform sampler2D albedo_tex : source_color, filter_linear_mipmap, repeat_enable;
uniform bool has_tex = false;
uniform float width = 0.0045;
uniform vec3 line_tint : source_color = vec3(0.36, 0.3, 0.38);

void vertex() {
	float d = length((MODELVIEW_MATRIX * vec4(VERTEX, 1.0)).xyz);
	VERTEX += NORMAL * width * clamp(d * 0.28, 0.9, 3.2);
}

void fragment() {
	vec3 c = albedo.rgb;
	if (has_tex) c *= texture(albedo_tex, UV).rgb;
	ALBEDO = c * line_tint;
}
