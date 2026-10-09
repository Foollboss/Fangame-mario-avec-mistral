extends Node
## Test de bout en bout : menu -> course (carrière) -> résultats -> retour au menu (carte de saison).

var step := 0
var t := 0.0

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	_spawn_menu.call_deferred()
	print("FLOW start credits=", Game.credits())


func _spawn_menu() -> void:
	var menu = load("res://scenes/menu.tscn").instantiate()
	get_tree().root.add_child(menu)
	# le menu devient la scène courante : change_scene_to_file ne détruira pas ce nœud de test
	get_tree().current_scene = menu


func _process(dt: float) -> void:
	t += dt
	var scene := get_tree().current_scene
	match step:
		0:
			if t > 2.0:
				var menu = get_tree().root.get_node_or_null("Menu")
				var ev := CareerDB.get_event("c1s1e1")
				print("FLOW menu ok, fuel lancer=", Game.fuel("lancer_evo"))
				menu.start_event(ev, "lancer_evo", true)
				step = 1
				t = 0.0
		1:
			var race = get_tree().root.get_node_or_null("Race")
			if race:
				race.player.nitro_press = (Engine.get_physics_frames() % 90) == 0
				if race._results_shown:
					print("FLOW results shown pos=", race.player.place, " time=", race.race_time, " credits=", Game.credits())
					race._next()
					step = 2
					t = 0.0
			if t > 400.0:
				print("FLOW timeout")
				get_tree().quit()
		2:
			if t > 3.0:
				var menu2 = get_tree().root.get_node_or_null("Menu")
				print("FLOW back in menu: ", menu2 != null, " screen=", menu2.current if menu2 else "-", " flags=", Game.event_flags("c1s1e1"), " bp z4=", Game.car_state("z4").bp, " fuel=", Game.fuel("lancer_evo"))
				get_tree().quit()
