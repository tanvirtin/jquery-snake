/*
	Purpose: Responsible for all the game logic

	Author: Md. Tanvir Islam

	Command to execute: N/A

*/
var name = prompt("Please enter your name: ", "Default");
if (name.length === 0) {
	name = "Default";
}

var game_counter = true; // global variable which determines the flow of game if false game is over

// logic generated on page load 
$(document).ready(function() {
	var speed = 0;
	var post_obj = dimension();
	post_obj.name = name;

	speed = ask_server("generate", false, post_obj);

	var snake = "<div class = 'snake' id = '0' name = 'head'></div>";
	$("#canvas").append(snake);
	$("#0").css({
		top: Math.round(post_obj.height_min) + "px",
		left: Math.round(post_obj.width_min) + "px",
	});
	move(Math.round(post_obj.width_min),Math.round(post_obj.width_max), Math.round(post_obj.height_min), Math.round(post_obj.height_max), speed);

})


/*
	Function: move
	 Purpose: initiates acceleration and initial movement		 
		  in: w_min, w_max, h_min, h_max, speed
*/

function move(w_min, w_max, h_min, h_max, speed) {
	move_right($("#0").offset().left, w_max, speed, w_min, w_max, h_min, h_max); // right
}


/*
	Function: move_up
	 Purpose: controls for moving up 		 
		  in: min, max, speed, w_min, w_max, h_min, h_max 
		 out: min
*/

function move_up(min, max, speed, w_min, w_max, h_min, h_max) {
	var snake = $("#0");
	var food = $("#food");
	if (((snake.offset().top - food.offset().top === 3) || (snake.offset().top - food.offset().top === 2) || (snake.offset().top - food.offset().top === 1) || (snake.offset().top - food.offset().top === 0)) && ((snake.offset().left - food.offset().left >= -10) && (snake.offset().left - food.offset().left <= 10))) {
		food.remove(); // removes food 
		consume(speed, w_min, w_max, h_min, h_max); // this function calls food generate to generate food and makes the snake grow
	}
	var control_obj = {};
	control_obj.flag = true;
	collision_detection(); // detects collision between snakes everytime it moves
	$(document).on("keydown", function(event) {
		if (event.keyCode === 65 || event.keyCode === 37) { // left
			control_obj.flag = false;
			control_obj.which = "left"; 
		} else if (event.keyCode === 83 || event.keyCode === 40) { // down
			if ($("#canvas").children().length < 3) { // 
				control_obj.flag = false;
				control_obj.which = "down";		
			}
		} else if (event.keyCode === 68 || event.keyCode === 39) { // right
			control_obj.flag = false;
			control_obj.which = "right";
		}
	})

	// upon button pressed the control_obj.which changes its properties to whatever key is pressed
	// this causes other movement functions to be called
	setTimeout(function() {
		if ((min > max) && control_obj.flag && game_counter) { // stops moving upon these conditions
			$("#0").css("top", "-=3px");
			min -= 3;
			move_up(min, max, speed, w_min, w_max, h_min, h_max);
		} else {
			if (game_counter) {
				if (control_obj.which === "left") { // left
					move_left($("#0").offset().left, w_min, speed, w_min, w_max, h_min, h_max)
				} else if (control_obj.which === "down") { // down
					move_down($("#0").offset().top, h_max, speed, w_min, w_max, h_min, h_max)
				} else if (control_obj.which === "right") { // right
					move_right($("#0").offset().left, w_max, speed, w_min, w_max, h_min, h_max)
				} else {
					game_counter = false;
					alert("Game over!");
				}
			} else {
				alert("Game over!");
			}
		}
	}, speed);
}

/*
	Function: move_down
	 Purpose: controls for moving down same functionality as move_up 		 
		  in: min, max, speed, w_min, w_max, h_min, h_max 
		 out: min
*/


function move_down(min, max, speed, w_min, w_max, h_min, h_max) {
	var snake = $("#0");
	var food = $("#food");
	if (((snake.offset().top - food.offset().top === 3) || (snake.offset().top - food.offset().top === 2) || (snake.offset().top - food.offset().top === 1) || (snake.offset().top - food.offset().top === 0)) && ((snake.offset().left - food.offset().left >= -10) && (snake.offset().left - food.offset().left <= 10))) {
		food.remove();
		consume(speed, w_min, w_max, h_min, h_max);
	}
	var control_obj = {};
	control_obj.flag = true;
	collision_detection();
	$(document).on("keydown", function(event) {
		if (event.keyCode === 68 || event.keyCode === 39) { // right
			control_obj.flag = false;
			control_obj.which = "right";
		} else if (event.keyCode === 65 || event.keyCode === 37) { // left
			control_obj.flag = false;
			control_obj.which = "left";
		} else if (event.keyCode === 87 || event.keyCode === 38) { // up
			if ($("#canvas").children().length < 3) {
				control_obj.flag = false;
				control_obj.which = "up";
			}
		}
	})
	setTimeout(function() {
		if ((min < max) && control_obj.flag && game_counter) {
			$("#0").css("top", "+=3px");
			min += 3;
			move_down(min, max, speed, w_min, w_max, h_min, h_max);
		} else {
			if (game_counter) {
				if (control_obj.which === "right") { // right
					move_right($("#0").offset().left, w_max, speed, w_min, w_max, h_min, h_max);
				} else if (control_obj.which === "left") { // left
					move_left($("#0").offset().left, w_min,  speed, w_min, w_max, h_min, h_max);
				} else if (control_obj.which === "up") { // up
					move_up($("#0").offset().top, h_min, speed, w_min, w_max, h_min, h_max);
				} else {
					game_counter = false;
					alert("Game over!");
				}
			} else {
				alert("Game over!");
			}
		}
	}, speed);
}

/*
	Function: move_right
	 Purpose: controls for moving right same functionality 		 
		  in: min, max, speed, w_min, w_max, h_min, h_max 
		 out: min
*/

function move_right(min, max, speed, w_min, w_max, h_min, h_max) {
	var snake = $("#0");
	var food = $("#food");
	if (((snake.offset().top - food.offset().top === 3) || (snake.offset().top - food.offset().top === 2) || (snake.offset().top - food.offset().top === 1) || (snake.offset().top - food.offset().top === 0)) && ((snake.offset().left - food.offset().left >= -10) && (snake.offset().left - food.offset().left <= 10))) {
		food.remove();
		consume(speed, w_min, w_max, h_min, h_max);
	}	
	var control_obj = {};
	control_obj.flag = true;
	collision_detection();
	$(document).on("keydown", function(event) {
		if (event.keyCode === 83 || event.keyCode === 40) { // down
			control_obj.flag = false;
			control_obj.which = "down";
		} else if (event.keyCode === 87 || event.keyCode === 38) { // up 
			control_obj.flag = false;
			control_obj.which = "up";
		} else if (event.keyCode === 65 || event.keyCode === 37) { // left 
			if ($("#canvas").children().length < 3) {
				control_obj.flag = false;
				control_obj.which = "left";
			}
		}
	})
	setTimeout(function() {
		if ((min < (max - 3)) && control_obj.flag && game_counter) {
			$("#0").css("left", "+=3px");
			min += 3;
			move_right(min, max, speed, w_min, w_max, h_min, h_max);
		} else {
			if (game_counter) {
				if (control_obj.which === "down") { // down
					move_down($("#0").offset().top, h_max, speed, w_min, w_max, h_min, h_max)
				} else if (control_obj.which === "up") { // up
					move_up($("#0").offset().top, h_min, speed, w_min, w_max, h_min, h_max);
				} else if (control_obj.which === "left") { // left
					move_left($("#0").offset().left, w_min, speed, w_min, w_max, h_min, h_max);
				} else {
					game_counter = false;
					alert("Game over!");
				}
			} else {
				alert("Game over!");
			}
		}
	}, speed);
}

/*
	Function: move_left
	 Purpose: controls for moving left same functionality		 
		  in: min, max, speed, w_min, w_max, h_min, h_max 
		 out: min
*/

function move_left(min, max, speed, w_min, w_max, h_min, h_max) {
	var snake = $("#0");
	var food = $("#food");
	if (((snake.offset().top - food.offset().top === 3) || (snake.offset().top - food.offset().top === 2) || (snake.offset().top - food.offset().top === 1) || (snake.offset().top - food.offset().top === 0)) && ((snake.offset().left - food.offset().left >= -10) && (snake.offset().left - food.offset().left <= 10))) {
		food.remove();
		consume(speed, w_min, w_max, h_min, h_max);
	}
	var control_obj = {};
	control_obj.flag = true;
	collision_detection();
	$(document).on("keydown", function(event) {
		if (event.keyCode === 68 || event.keyCode === 39) { // right
			if ($("#canvas").children().length < 3) {
				control_obj.flag = false;
				control_obj.which = "right";
			}
		} else if (event.keyCode === 83 || event.keyCode === 40) { // down 
			control_obj.flag = false;
			control_obj.which = "down";
		} else if (event.keyCode === 87 || event.keyCode === 38) { // up 
			control_obj.flag = false;
			control_obj.which = "up";
		}
	})
	setTimeout(function() {
		if ((min > (max - 5)) && control_obj.flag && game_counter) {
			$("#0").css("left", "-=3px");
			min -= 3;
			move_left(min, max, speed, w_min, w_max, h_min, h_max);
		} else {
			if (game_counter) {
				if (control_obj.which === "right") {
					move_right($("#0").offset().left, w_max, speed, w_min, w_max, h_min, h_max);
				} else if (control_obj.which === "down") {
					move_down($("#0").offset().top, h_max, speed, w_min, w_max, h_min, h_max);
				} else if (control_obj.which === "up") {
					move_up($("#0").offset().top, h_min, speed, w_min, w_max, h_min, h_max);
				} else {
					game_counter = false;
					alert("Game over!")
				}
			} else {
				alert("Game over!");
			}
		}
	}, speed);
}

/*
	Function: consume
	 Purpose: when the snake eats the food, makes a new snake div and attaches it to the back,
			  a variable counter is kept which keeps the number of snakes being added
			  so when you eat the side doesnt get added to the head but to the last node		 
		  in: speed, w_min, w_max, h_min, h_max
*/

function consume(speed, w_min, w_max, h_min, h_max) {
	post_obj = dimension();
	obj_obj = {};
	obj_obj.name = name;
	var size = 0;
	var snake = "";
	ask_server("regenerate", true, post_obj);
	$.ajax({
		url: "/size",
		type: "POST",
		contentType: "application/json",
		dataType: "json",
		async: false,
		data: JSON.stringify(obj_obj),
		success: function(data) {
			$("#score").html("Score: " + data.size);
			generate_body(snake, data.size, w_min, w_max, h_min, h_max, speed);				
		}
	})
	// makes an ajax request to the server telling the server that the snake has had a meal

}

/*
	Function: 
	 Purpose: function to generate the body of the snake and attach it to the div, also responsible for the parts of the body to move along recursively		 
		  in: param_uno, id, w_min, w_max, h_min, h_max, speed
*/

function generate_body(param_uno, id, w_min, w_max, h_min, h_max, speed) {
	var str_id = (id - 1).toString();	
	param_uno = $("<div class = 'body' id = 's'></div>");
	$("#canvas").append(param_uno);
	$("#s").attr("id", "" + id + "");
	recursive_movement(id, speed + 100);
}

function recursive_movement(id, speed) {
	$("#" + id).css("left", $( "#" + (id - 1) ).offset().left + 2);
	$("#" + id).css("top", $("#" + (id - 1)).offset().top);

	if(game_counter) {
		setTimeout(function() {
			recursive_movement(id, speed);
		}, speed);
	}
}

/*
	Function: ask_server
	 Purpose: post request to ask server for food generation at random dimension		 
		  in: url, async, my_data
*/

function ask_server(url, async, my_data) {
	$.ajax({
		url: "/" + url,
		type: "POST",
		contentType: "application/json",
		dataType: "json",
		async: async,
		data: JSON.stringify(my_data),
		success: function(data) {
			speed = init_game(data);
		}
	})
	return speed;
}

/*
	Function: dimension
	 Purpose: calculates dimension of the canvas		 
*/

function dimension() {
	var window_height = $(window).height();
	var window_width = $(window).width();
	var canvas_height = $("#canvas").height();
	var canvas_width = $("#canvas").width();

	var obj = {};
	obj.width_min = (window_width - canvas_width)/2;
	obj.width_max = obj.width_min + canvas_width;
	obj.height_min = 15;
	obj.height_max = canvas_height + 15;

	return obj;
}

/*
	Function: init_game
	 Purpose: generates food at random coordinates and get's the speed of the snake	 
		  in: data
*/

function init_game(data) {
	food_generator(data.x, data.y);
	var speed = data.speed
	return speed;
}

/*
	Function: food_generator
	 Purpose: the x and y coordinate generated by flask server is used to display the new food		 
		  in: width, height
*/

function food_generator(width, height) {
	$("#canvas").append("<div class = 'food' id = 'food'></div>");
	$("#food").css({
		top: height + "px",
		left: width + "px",
	});
}

/*
	Function: collision_detection
	 Purpose: is responsible for the detecting collision between the snake and the parts of its body		 
*/

function collision_detection() {
	if ($("#canvas").children().length > 2) {
		for (var i = 3; i < ($("#canvas").children().length - 1); i++) {
			if (($("#0").offset().top === $("#" + i).offset().top) && ($("#0").offset().left === $("#" + i).offset().left)) {
				game_counter = false;
			}
		}
	}
}