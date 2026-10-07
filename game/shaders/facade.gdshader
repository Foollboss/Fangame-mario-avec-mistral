// Façade d'immeuble : texture avec masque de teinte (alpha) + fenêtres éclairées la nuit.
shader_type spatial;
render_mode blend_mix, depth_draw_opaque, cull_back;

uniform sampler2D albedo_tex : source_color, filter_linear_mipmap_anisotropic, repeat_enable;
uniform sampler2D emit_tex : source_color, filter_linear_mipmap, repeat_enable;
uniform float emit_strength = 0.0;
uniform float glass_rough = 0.2;

void fragment() {
	vec4 t = texture(albedo_tex, UV);
	float mask = t.a;
	ALBEDO = mix(t.rgb, t.rgb * COLOR.rgb * 1.1, mask);
	ROUGHNESS = mix(glass_rough, 0.85, mask);
	METALLIC = mix(0.45, 0.0, mask);
	SPECULAR = mix(0.9, 0.4, mask);
	vec2 off = vec2(floor(COLOR.a * 4.0) * 0.5, floor(fract(COLOR.a * 7.0) * 2.0) * 0.5);
	EMISSION = texture(emit_tex, UV + off).rgb * emit_strength * (1.0 - mask);
}
