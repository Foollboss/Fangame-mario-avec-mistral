class_name DayNight
extends Node



const DAY_SECONDS: = 16.0 * 60.0

var world: World
var hour: = 8.0
var paused: = false


var KEYS: = [
	[0.0, Color(0.03, 0.06, 0.18), Color(0.12, 0.2, 0.4), Color(0.08, 0.1, 0.2), Color(0.25, 0.3, 0.5), Color(0.35, 0.4, 0.62), 0.0, 1.0, 
		Color(0.62, 0.72, 1.0), 0.5, Color(0.3, 0.42, 0.78), 0.62, Color(0.12, 0.18, 0.34), Color(0.12, 0.15, 0.3)], 
	[4.6, Color(0.04, 0.07, 0.2), Color(0.16, 0.22, 0.42), Color(0.1, 0.12, 0.22), Color(0.28, 0.32, 0.52), Color(0.4, 0.42, 0.62), 0.05, 1.0, 
		Color(0.62, 0.72, 1.0), 0.48, Color(0.3, 0.42, 0.78), 0.62, Color(0.14, 0.2, 0.36), Color(0.14, 0.16, 0.32)], 
	[6.1, Color(0.28, 0.38, 0.7), Color(1.0, 0.7, 0.5), Color(0.55, 0.5, 0.55), Color(1.0, 0.86, 0.78), Color(1.0, 0.55, 0.35), 1.0, 0.2, 
		Color(1.0, 0.72, 0.5), 0.62, Color(0.62, 0.56, 0.7), 0.52, Color(0.92, 0.72, 0.62), Color(0.62, 0.55, 0.7)], 
	[7.3, Color(0.18, 0.42, 0.86), Color(0.86, 0.86, 0.92), Color(0.62, 0.72, 0.86), Color(1.0, 0.97, 0.94), Color(1.0, 0.74, 0.52), 0.32, 0.0, 
		Color(1.0, 0.88, 0.72), 0.92, Color(0.6, 0.67, 0.88), 0.58, Color(0.82, 0.85, 0.94), Color(0.62, 0.67, 0.86)], 
	[9.0, Color(0.13, 0.36, 0.86), Color(0.66, 0.84, 1.0), Color(0.55, 0.7, 0.86), Color(1.0, 1.0, 1.0), Color(1.0, 0.86, 0.66), 0.06, 0.0, 
		Color(1.0, 0.96, 0.88), 1.05, Color(0.56, 0.68, 0.92), 0.62, Color(0.7, 0.84, 1.0), Color(0.6, 0.7, 0.88)], 
	[16.3, Color(0.13, 0.36, 0.86), Color(0.68, 0.84, 1.0), Color(0.55, 0.7, 0.86), Color(1.0, 1.0, 1.0), Color(1.0, 0.84, 0.62), 0.08, 0.0, 
		Color(1.0, 0.95, 0.86), 1.05, Color(0.56, 0.68, 0.92), 0.62, Color(0.72, 0.84, 1.0), Color(0.6, 0.7, 0.88)], 
	[18.2, Color(0.22, 0.28, 0.58), Color(1.0, 0.56, 0.34), Color(0.5, 0.42, 0.48), Color(1.0, 0.78, 0.6), Color(1.0, 0.45, 0.25), 1.0, 0.1, 
		Color(1.0, 0.62, 0.38), 0.72, Color(0.66, 0.52, 0.62), 0.52, Color(0.95, 0.62, 0.5), Color(0.55, 0.42, 0.58)], 
	[19.6, Color(0.07, 0.1, 0.3), Color(0.36, 0.3, 0.52), Color(0.14, 0.14, 0.24), Color(0.5, 0.42, 0.6), Color(0.75, 0.4, 0.45), 0.45, 0.78, 
		Color(0.62, 0.7, 1.0), 0.4, Color(0.32, 0.4, 0.7), 0.5, Color(0.24, 0.26, 0.42), Color(0.25, 0.24, 0.42)], 
	[24.0, Color(0.03, 0.06, 0.18), Color(0.12, 0.2, 0.4), Color(0.08, 0.1, 0.2), Color(0.25, 0.3, 0.5), Color(0.35, 0.4, 0.62), 0.0, 1.0, 
		Color(0.62, 0.72, 1.0), 0.5, Color(0.3, 0.42, 0.78), 0.62, Color(0.12, 0.18, 0.34), Color(0.12, 0.15, 0.3)], 
]

var fireflies: CPUParticles3D

func _ready() -> void :
	apply()


func attach_fireflies(target: Node3D) -> void :
	fireflies = CPUParticles3D.new();fireflies.name = "Fireflies"
	var qm: = QuadMesh.new();qm.size = Vector2(0.16, 0.16)
	var m: = StandardMaterial3D.new()
	m.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	m.billboard_mode = BaseMaterial3D.BILLBOARD_PARTICLES
	m.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	m.vertex_color_use_as_albedo = true
	m.albedo_texture = _dot_texture()
	m.emission_enabled = true;m.emission = Color(0.8, 1.0, 0.45);m.emission_energy_multiplier = 4.0
	qm.material = m
	fireflies.mesh = qm
	fireflies.amount = 60
	fireflies.lifetime = 7.0
	fireflies.preprocess = 7.0
	fireflies.local_coords = false
	fireflies.emission_shape = CPUParticles3D.EMISSION_SHAPE_BOX
	fireflies.emission_box_extents = Vector3(10, 1.6, 10)
	fireflies.position = Vector3(0, 1.4, 0)
	fireflies.direction = Vector3(0, 1, 0);fireflies.spread = 180.0
	fireflies.gravity = Vector3.ZERO
	fireflies.initial_velocity_min = 0.1;fireflies.initial_velocity_max = 0.45
	fireflies.angular_velocity_min = 0.0
	fireflies.damping_min = 0.0
	var ramp: = Gradient.new()
	ramp.set_color(0, Color(0.8, 1.0, 0.5, 0.0));ramp.set_color(1, Color(0.8, 1.0, 0.5, 0.0))
	for p in [[0.15, 1.0], [0.3, 0.25], [0.45, 1.0], [0.65, 0.4], [0.8, 1.0]]:
		ramp.add_point(p[0], Color(0.85, 1.0, 0.5, p[1]))
	fireflies.color_ramp = ramp
	fireflies.emitting = false
	target.add_child(fireflies)

func _dot_texture() -> ImageTexture:
	var img: = Image.create_empty(32, 32, false, Image.FORMAT_RGBA8)
	for y in 32:
		for x in 32:
			var d: = Vector2(x - 15.5, y - 15.5).length() / 16.0
			img.set_pixel(x, y, Color(1, 1, 1, clampf(1.0 - d, 0.0, 1.0) ** 2))
	return ImageTexture.create_from_image(img)

var ff_left: = 0.0
var ff_speed: = 0.0
var saved_hour: = -1.0


func override_hour(h: float) -> void :
	if h >= 0.0:
		if saved_hour < 0.0: saved_hour = hour
		ff_left = 0.0
		hour = h
	elif saved_hour >= 0.0:
		hour = saved_hour
		saved_hour = -1.0
	apply()

func _process(delta: float) -> void :
	if saved_hour >= 0.0: return
	if ff_left > 0.0:
		var step: = minf(ff_left, ff_speed * delta)
		ff_left -= step
		hour = fposmod(hour + step, 24.0)
		apply()
		return
	if paused: return
	var was_night: = is_night()
	hour = fposmod(hour + delta * 24.0 / DAY_SECONDS, 24.0)
	apply()
	if was_night != is_night() and world and world.get_parent() and world.get_parent().has_method("on_day_phase"):
		world.get_parent().on_day_phase(is_night())


func fast_forward(target: float) -> void :
	var span: = fposmod(target - hour, 24.0)
	if span < 0.02: return
	ff_left = span
	ff_speed = maxf(span / 2.5, 2.0)

func is_night() -> bool:
	return hour < 5.6 or hour > 19.0

func clock_text() -> String:
	return "%02d:%02d" % [int(hour), int(fmod(hour, 1.0) * 60.0)]

func apply() -> void :
	if world == null or world.sun == null: return
	var k0: Array = KEYS[0]; var k1: Array = KEYS[1]
	for i in KEYS.size() - 1:
		if hour >= KEYS[i][0] and hour <= KEYS[i + 1][0]:
			k0 = KEYS[i];k1 = KEYS[i + 1];break
	var t: = 0.0
	if k1[0] > k0[0]: t = (hour - k0[0]) / (k1[0] - k0[0])
	t = smoothstep(0.0, 1.0, t)
	var c: = func(i: int) -> Color: return (k0[i] as Color).lerp(k1[i], t)
	var f: = func(i: int) -> float: return lerpf(k0[i], k1[i], t)

	var day_t: = (hour - 6.0) / 12.0
	var sun_el: = sin(day_t * PI) * deg_to_rad(64.0)
	var sun_az: = lerpf(0.0, PI, clampf(day_t, -0.2, 1.2))
	var sun_dir: = Vector3(cos(sun_az) * cos(sun_el), sin(sun_el), 0.45 * cos(sun_el)).normalized()
	var moon_dir: = Vector3( - sun_dir.x, absf(sun_dir.y) * 0.8 + 0.35, -0.3).normalized()
	var night: float = f.call(7)
	var light_dir: = sun_dir if night < 0.55 else moon_dir

	var up: = Vector3.UP if absf(light_dir.y) < 0.98 else Vector3.RIGHT
	world.sun.global_transform = Transform3D(Basis.looking_at( - light_dir, up), Vector3.ZERO)
	world.sun.light_color = c.call(8)
	world.sun.light_energy = f.call(9)
	world.env.ambient_light_color = c.call(10)
	world.env.ambient_light_energy = f.call(11)
	world.env.fog_light_color = c.call(12)
	var sm: = world.sky_mat
	sm.set_shader_parameter("zenith", c.call(1));sm.set_shader_parameter("horizon", c.call(2))
	sm.set_shader_parameter("ground_col", c.call(3));sm.set_shader_parameter("cloud_col", c.call(4))
	sm.set_shader_parameter("glow_col", c.call(5));sm.set_shader_parameter("sunset", f.call(6))
	sm.set_shader_parameter("night", night)
	sm.set_shader_parameter("cloud_shade", c.call(13))
	world.sun.shadow_opacity = lerpf(0.72, 0.5, night)

	world.env.adjustment_saturation = lerpf(1.06, 0.82, night)
	world.env.adjustment_brightness = lerpf(1.0, 0.96, night)
	if world.bloom_mat: world.bloom_mat.set_shader_parameter("night", clampf((night - 0.15) / 0.6, 0.0, 1.0))
	if fireflies:
		var ff: = night > 0.55
		if ff != fireflies.emitting: fireflies.emitting = ff
	for wm in [world.water_mat, world.lake_mat, world.swamp_mat]:
		if wm:
			var sky_c: = (c.call(2) as Color).lerp(c.call(1), 0.35)
			if wm == world.swamp_mat: sky_c = sky_c.lerp(Color(0.3, 0.45, 0.35), 0.6)
			wm.set_shader_parameter("sky_col", sky_c)
			wm.set_shader_parameter("night", night)
	sm.set_shader_parameter("sun_dir", sun_dir);sm.set_shader_parameter("moon_dir", moon_dir)

	var lamps_on: = clampf((night - 0.2) / 0.4, 0.0, 1.0)
	for l in world.lanterns:
		l.visible = lamps_on > 0.01
		l.light_energy = 1.4 * lamps_on
	if world.window_mat:
		world.window_mat.emission_energy_multiplier = lerpf(0.15, 1.8, lamps_on)
	for m in world.lamp_mats:
		(m as StandardMaterial3D).emission_energy_multiplier = lerpf(0.6, 3.0, lamps_on)
	if world.light_house_lamp:
		world.light_house_lamp.light_energy = 3.0 * lamps_on
		world.light_house_lamp.visible = lamps_on > 0.01
