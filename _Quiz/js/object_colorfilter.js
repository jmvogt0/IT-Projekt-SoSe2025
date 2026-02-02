
/*
This script use for create color filter quiz in e-learning web application
This script use createjs, easeljs, canvas for create the quiz 
before load this script, You must load those script first

createjs/events/Event.js
createjs/events/EventDispatcher.js
createjs/utils/IndexOf.js
easeljs/utils/UID.js
easeljs/utils/Ticker.js
easeljs/geom/Matrix2D.js
easeljs/geom/Rectangle.js
easeljs/display/Graphics.js
easeljs/display/DisplayObject.js
easeljs/display/Container.js
easeljs/display/Stage.js
easeljs/display/Bitmap.js
easeljs/display/BitmapText.js
easeljs/display/Shape.js
easeljs/display/Text.js
easeljs/events/MouseEvent.js
easeljs/ui/Touch.js
easeljs/utils/SpriteSheetUtils.js
easeljs/filters/Filter.js
easeljs/filters/ColorFilter.js


variable detail

stage : Stage instance create from canvas (createjs's object)
update : variable for control canvas to not re-render all the time (for better performance)
clickable_list : list of clickable object.
path : base path for resource.
index : Variable that use for control order of resource for reliable Z-index.
z_index : list of resource order that represent layer in canvas. Use for layer control in canvas
msg_set : set of feedback message
ready : if ready == true  click button aill able to click.

*/

var stage, update, clickable_list, path, index, z_index, msg_set, ready;

/*
Initialize all variable in this script
Must call this function at first.

Parameter:
	p : base path for resource for the quiz
	msg : (OPTION) message set for feedback if you don't want to use default message set,
			you must input object that have following properties
				"start" contain feedback when open the quiz
				"finish" contain feedback when user finish the quiz;
				"correct" contain feedback when user do this quiz correct
				"incorrect" contain feedback when user do this quiz incorrect
*/
function init(p, msg) {

	if(msg) {
		msg_set = msg;
	}
	else {
		msg_set = {};
		msg_set.start = "Klicken Sie auf die korrekten Objekte";
		msg_set.finish = "Die Lösung finden Sie über den Check-Button";
		msg_set.correct = "Das ist richtig!";
		msg_set.incorrect = "Leider falsch!";
	}
	document.getElementById("msg").innerHTML = msg_set.start;
	stage = new createjs.Stage(document.getElementById("canvas"));
	stage.enableMouseOver();
	update = true;
	clickable_list = [];
	path = p;
	index = 0;
	z_index = [];
	ready = false;
}

/*
	Draw rectangle border on canvas.

	Parameter:
		x : x-axis on canvas
		y : y-axis on canvas
		width : width of rectangle border
		height : height of rectangle border
		color : color of rectangle border. You can enter both color name or color code
*/
function Border(x, y, width, height, color) {
	var border = new createjs.Shape(); 
	border.graphics.beginStroke(color); 
	border.graphics.setStrokeStyle(2); 
	border.snapToPixel = true; 
	border.graphics.drawRect(x, y, width, height); 
	border.name = "border"
	// stage.addChild(border);
	add_to_stage(index, border);
	index++;
}

/*
	Draw image on canvas.

	Parameter:
		x : x-axis on canvas
		y : y-axis on canvas
		filename : image file
*/
function Bilder(x, y, filename) {
	var image = new Image();
	image.src = path + filename;// + ".png";
	image.name = filename;
	this.image = loadBitmap(image, x, y, "Bilder", {}, index);
	index++;
}

/*
	Create clickable object and draw into canvas.
	Clickable object is object that if user clicked, It will filter color into pink.

	Parameter:
		px : x-axis on canvas
		py : y-axis on canvas
		answer : correct answer for this clickable object
		filename : image file
		sx : x-axis of symbol tick and cross on canvas
		sy : y-axis of symbol tick and cross on canvas
*/
function Clickable_Object(px, py, answer, filename, sx, sy) {
	var obj = {}
	obj.posX = px;
	obj.posY = py;
	obj.answer = answer;
	obj.text = "n";

    var image = new Image();
	image.src = path + filename;
	image.name = answer;
	obj.image = loadBitmap(image, px, py, "Clickable_Object", obj, index);
	index++;

	var tick = new Image();
	tick.src = "../../../bilder/tick.png";
	tick.name = "tick";
	obj.tick = loadBitmap(tick, sx, sy, "Bilder", {}, Number.MAX_VALUE);
	obj.tick.visible = false;

	var cross = new Image();
	cross.src = "../../../bilder/cross.png";
	cross.name = "cross";
	obj.cross = loadBitmap(cross, sx, sy, "Bilder", {}, Number.MAX_VALUE);
	obj.cross.visible = false;

	clickable_list.push(obj)
}

/*
	Draw text on canvas.

	Parameter:
		x : x-axis on canvas
		y : y-axis on canvas
		text : The text to display.
		font : The font style to use. Any valid value for the CSS font attribute is acceptable (ex. "bold 36px Arial").
		color : The color to draw the text in. Any valid value for the CSS color attribute is acceptable (ex. "#F00", "red", or "#FF0000").
*/
function Draw_text(x, y, text, font, color) {
	var t = new createjs.Text(text, font, color);
	t.x = x;
	t.y = y;
	t.name = "text"
	// stage.addChild(t);
	add_to_stage(index, t);
	index++;
}

/*
	private function
	use for load image into bitmap

	Parameter:
		image : image object
		x : x-axis on canvas
		y : y-axis on canvas
		type : Type of object.(ex. Dragable_Object, Dropable_Object,...)
		o : clickable object for this image
		i : Global varible index. for control z-axis.

*/
function loadBitmap(image, x, y, type, o, i) {
	var bitmap = new createjs.Bitmap(image);
	image.onload = function(event) {	
		var img = event.target;
		bitmap.x = x;
		bitmap.y = y;
		bitmap.scaleX = bitmap.scaleY = bitmap.scale = 1;
		bitmap.name = image.name;
		var hitArea = new createjs.Shape();
		hitArea.graphics.beginFill("#FFF").drawRect(0, 0, img.width, img.height);
		bitmap.hitArea = hitArea;
		if (type == "Clickable_Object") {
			bitmap = addListeners(bitmap, x, y, o);
			bitmap.cursor = "pointer";
		}

		// stage.addChild(bitmap);
		add_to_stage(i, bitmap);
		createjs.Ticker.addEventListener("tick", tick);
		stage.update();
	}
	return bitmap;
}

/*
	private function
	Add action listener to bitmap (clickable objec type)
	handle mousedown event.

	Parameter:
		bitmap : Bitmap of dragable object.
		x : x-axis on canvas.
		y : y-axis on canvas.
		o : clickable object for this bitmap
*/
function addListeners(bitmap, x, y, o) {
	var active = true;
	bitmap.addEventListener("mousedown", function(evt) {
		if (!active) return;
		var c = evt.target;
		var filter = new createjs.ColorFilter(1,1,1,1,255);
		c.filters = [filter];
		c.cache(0,0,bitmap.image.width,bitmap.image.height)
		stage.update()
		o.text = "y"
		active = false;
		if(!ready) {

			document.getElementById("check").onclick = check;
			document.getElementById("msg").innerHTML = msg_set.finish;
			var s = document.getElementById("check").src;
			document.getElementById("check").src = s.replace("check", "check2");
			ready = true;
		}
	});
	return bitmap;
}

/*
	private function
	layer control
	Control order of resource add to canvas follow order of function call.

	Paramether:
		index : Given index number
		bitmap : bitmap instance
*/
function add_to_stage(index, bitmap) {
	if(z_index.length == 0) {
		stage.addChild(bitmap);
		z_index.push(index);
	} 
	else {
		for(var i = 0; i < z_index.length; i++) {
			if(z_index[i] > index) {
				z_index.splice(i, 0, index);
				stage.addChildAt(bitmap, i);
				break;
			} else if(i == z_index.length-1) {
				stage.addChild(bitmap);
				z_index.push(index);
				break;
			}
		}
	}
}

/*
	private function
	this function will called in every framerate
*/
function tick(event) {
	// this set makes it so the stage only re-renders when an event handler indicates a change has happened.
	if (update) {
		update = false; // only update once
		stage.update(event);
	}
}

/*
	check function that must add to check button
	this function will check the correct answer in each clickable object
	and show tick or cross symbol follow the result
*/
function check() {
	var correct = 0;
	var incorrect = 0;
	for (var i = 0; i < clickable_list.length; i++) {
		var click = clickable_list[i];
		var ans = click.answer
		if(click.text == ans) {
			click.tick.visible = true;
			correct++;
		} else {
			click.cross.visible = true;
			incorrect++;
		}
		click.image.removeAllEventListeners();
	}
	if(incorrect == 0) {
		document.getElementById("msg").innerHTML = msg_set.correct;
		var src_undo = document.getElementById("undo").src;
		document.getElementById("undo").src = src_undo.replace("undo2", "undo");
		document.getElementById("undo").onclick = null;
	}
	else {
		document.getElementById("msg").innerHTML = msg_set.incorrect;
	}
	var src_check = document.getElementById("check").src;
	document.getElementById("check").src = src_check.replace("check2", "check");
	document.getElementById("check").onclick = null;
	stage.update();
}



