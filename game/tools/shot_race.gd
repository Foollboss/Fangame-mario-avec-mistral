extends Node
## Outil de test : lance une course en TouchDrive et prend des captures à des instants donnés.
## godot --path game res://tools/shot_race.tscn -- track=sf_downtown car=lancer_evo times=4,12 out=/chemin

var times: Array = [4.0, 12.0]
var out := "/tmp"
var _ticks := 0
var _shot := 0
var _race: Node
var mode := "classic"
var quit_at := 0.0
var tag := "shot"

func _ready() -> void:
	var args := {}
	for a in OS.get_cmdline_user_args():
		var kv := a.split("=")
		if kv.size() == 2:
			args[kv[0]] = kv[1]
	var track: String = args.get("track", "sf_downtown")
	var car: String = args.get("car", "lancer_evo")
	mode = args.get("mode", "classic")
	out = args.get("out", "/tmp")
	tag = args.get("tag", track)
	if args.has("times"):
		times = []
		for t in args.times.split(","):
			times.append(float(t))
	quit_at = float(args.get("quit", str(times[-1] + 0.5)))
	Game.data.settings.quality = int(args.get("q", "1"))
	var ev := {"id": "test", "track": track, "mode": mode, "cls": CarsDB.get_car(car).cls, "rank": Game.car_rank(car),
		"objectives": [{"type": "position", "value": 3}, {"type": "barrel_rolls", "value": 1}], "credits": 1000,
		"bp_car": "", "bp_n": 0, "opponents": 5}
	Game.race_config = {"event": ev, "car": car, "touchdrive": args.get("td", "1") == "1", "free_ride": true,
		"show_touch": true}
	var sc: PackedScene = load("res://scenes/race.tscn")
	_race = sc.instantiate()
	get_tree().root.add_child.call_deferred(_race)
	process_priority = 1000


func _physics_process(_dt: float) -> void:
	if _race == null or not _race.is_inside_tree():
		return
	_ticks += 1
	var t := _ticks / 60.0
	# auto nitro pour le test
	if _race.player and _ticks % 90 == 0:
		_race.player.nitro_press = true
	if _shot < times.size() and t >= times[_shot]:
		_shot += 1
		await RenderingServer.frame_post_draw
		var img := get_viewport().get_texture().get_image()
		var p: String = out + "/%s_%02d.png" % [tag, _shot]
		img.save_png(p)
		var pl = _race.player
		print("SHOT %s t=%.1f state=%s s=%.0f/%.0f v=%.0f km/h place=%d air=%s fps=%d" % [p, t, _race.state, pl.s, _race.track.length, pl.v * 3.6, pl.place, pl.airborne, Engine.get_frames_per_second()])
	if t >= quit_at:
		var pl2 = _race.player
		print("END stats=", pl2.stats, " time=", _race.race_time, " finished=", pl2.finished)
		get_tree().quit()
