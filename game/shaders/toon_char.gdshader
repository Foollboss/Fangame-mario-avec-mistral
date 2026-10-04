shader_type spatial;
render_mode diffuse_toon, specular_disabled;
// Cel-shading façon anime pour les héros : deux tons nets (lumière / ombre teintée froide),
// liseré de lumière sur les contours éclairés, reflet doux sur les cheveux et les tissus brillants.

uniform vec4 albedo : source_color = vec4(1.0);
uniform sampler2D albedo_tex : source_color, filter_linear_mipmap, repeat_enable;
uniform bool has_tex = false;
uniform vec3 shadow_tint : source_color = vec3(0.74, 0.68, 0.90);
uniform float shadow_mul = 0.62;
uniform float lit_mul = 0.86;
uniform float edge = 0.06;
uniform float soft = 0.045;
uniform float rim_power = 4.0;
uniform float rim_amount = 0.55;
uniform vec3 rim_tint : source_color = vec3(1.0, 0.96, 0.9);
uniform float spec_amount = 0.12;
uniform vec3 emission_col : source_color = vec3(0.0);
uniform float emission_energy = 0.0;
uniform float flash = 0.0;

void fragment() {
	vec4 c = albedo;
	if (has_tex) c *= texture(albedo_tex, UV);
	ALBEDO = c.rgb;
	EMISSION = emission_col * emission_energy + c.rgb * flash;
	ROUGHNESS = 1.0;
}

void light() {
	float ndl = dot(NORMAL, LIGHT);
	float sh = LIGHT_IS_DIRECTIONAL ? smoothstep(0.3, 0.7, ATTENUATION) : 1.0;
	float fall = LIGHT_IS_DIRECTIONAL ? 1.0 : ATTENUATION;
	float lit = smoothstep(edge - soft, edge + soft, ndl) * sh;
	vec3 shade = mix(shadow_tint * shadow_mul, vec3(lit_mul), lit);
	DIFFUSE_LIGHT += shade * LIGHT_COLOR * fall / PI;
	// liseré : bord de silhouette du côté de la lumière
	float fres = pow(1.0 - clamp(dot(NORMAL, VIEW), 0.0, 1.0), rim_power);
	float side = smoothstep(-0.1, 0.4, ndl);
	SPECULAR_LIGHT += rim_tint * ALBEDO * fres * side * rim_amount * LIGHT_COLOR * fall / PI * (0.4 + 0.6 * sh);
	// petit reflet net (cheveux, métal)
	vec3 h = normalize(LIGHT + VIEW);
	float sp = smoothstep(0.93, 0.96, dot(NORMAL, h)) * lit;
	SPECULAR_LIGHT += sp * spec_amount * LIGHT_COLOR * fall / PI;
}
