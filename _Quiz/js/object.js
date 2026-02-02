/*
This script use for create drag and drop quiz in e-learning web application
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


variable detail

stage : Stage instance create from canvas (createjs's object)
update : variable for control canvas to not re-render all the time (for better performance)
dropable_list : list of dropable object.
path : base path for resource.
index : Variable that use for control order of resource for reliable Z-index.
z_index : list of resource order that represent layer in canvas. Use for layer control in canvas
msg_set : set of feedback message
cout_ans : Count number the amount of answer
origin : method for calculate origin when drag "dragable object" to "dropable object" have "TOPLEFT"(default) and CENTER

*/

var stage, update, dropable_list, path, index, z_index, msg_set, count_ans, origin;
/*
Initialize all variable in this script
Must call this function at first.

Parameter:
	p : base path for resource for the quiz
	msg : (OPTION) message set for feedback if you don't want to use default message set,
			you must input object that have following properties
				"start" contain feedback when open the quiz
				"doing" contain feedback when user do the quiz
				"finish" contain feedback when user finish the quiz;
				"correct" contain feedback when user do this quiz correct
				"incorrect" contain feedback when user do this quiz incorrect
	option : (OPTION) Specially use when use this script with animation control script.
			to make this script use stage instance that create from other.
			you must input object that have following properties
				"stage" cantain stage instance 
				"index" resource order
				"z_index" list of resource order that represent layer in canvas
*/
function init(p, msg, option) {
	if(msg) {
		msg_set = msg;
	}
	else {
		msg_set = {};
		msg_set.start = "Ziehen Sie die Objekte bitte an die korrekte Position";
		msg_set.doing = "Beantworten Sie die Frage bitte komplett";
		msg_set.finish = "Die Lösung finden Sie über den Check-Button";
		msg_set.correct = "Das ist richtig!";
		msg_set.incorrect = "Leider falsch!";
	}
	if(option) {
		stage = option.stage;
		index = option.index;
		z_index = option.z_index;
	}
	else {
		stage = new createjs.Stage(document.getElementById("canvas"));
		index = 0;
		z_index = []
		// html = document.getElementById("scenario");	
		// d = new createjs.DOMElement( html );
	}
	origin = "TOPLEFT";
	document.getElementById("msg").innerHTML = msg_set.start;
	count_ans = 0;
	update = true;
	createjs.Ticker.addEventListener("tick", tick);
	dropable_list = [];
	path = p;
}

/*
	Set origin from "TOPLEFT" to "CENTER".
*/
function setOriginCenter() {
	origin = "CENTER"
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
	this.image = loadBitmap(image, x, y, "Bilder", index);
	index++;
}


/*
	Create dropable object and draw into canvas.
	Object that you can drag "dragable object" and drop in to it.

	Parameter:
		px : x-axis on canvas
		py : y-axis on canvas
		answer : list of all posible answer for this dropable object
		filename : image file
		sx : x-axis of symbol tick and cross on canvas
		sy : y-axis of symbol tick and cross on canvas
*/
function Dropable_Object(px, py, answer, filename, sx, sy) {
	var obj = {}
	obj.posX = px;
	obj.posY = py;
	obj.answer = answer;
	obj.text = null;

    var image = new Image();
	image.src = path + filename;
	image.name = answer;
	obj.image = loadBitmap(image, px, py, "Dropable_Object", index);
	index++;
	dropable_list.push(obj);

	var tick = new Image();
	tick.src = "../../../bilder/tick.png";
	tick.name = "tick";
	obj.tick = loadBitmap(tick, sx, sy, "Symbol", Number.MAX_VALUE);
	obj.tick.visible = false;

	var cross = new Image();
	cross.src = "../../../bilder/cross.png";
	cross.name = "cross";
	obj.cross = loadBitmap(cross, sx, sy, "Symbol", Number.MAX_VALUE);
	obj.cross.visible = false;
}

/*
	Create dragable object and draw into canvas.
	Object that you can drag around the canvas and allow to drop in "dropable object"

	Parameter:
		x : x-axis on canvas
		y : y-axis on canvas
		name : answer that contain in this object. it will answer in dropable  (must be matched)
		filename : image file
*/
function Dragable_Object(x, y, name, filename) {
	this.posX = x;
	this.posY = y;
	this.name = name;
	this.active = true;

    var image = new Image();
	image.src = path + filename;
	image.name = name;
	this.image = loadBitmap(image, x, y, "Dragable_Object", index);
	index++;
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
		i : Global varible index. for control z-axis.

*/
function loadBitmap(image, x, y, type, i) {
	var bitmap = new createjs.Bitmap(image);
	image.onload = function(event) {
		var img = event.target;
		// bitmap = new createjs.Bitmap(img);
		bitmap.x = x;
		bitmap.y = y;
		bitmap.scaleX = bitmap.scaleY = bitmap.scale = 1;
		bitmap.name = image.name;

		var hitArea = new createjs.Shape();
		hitArea.graphics.beginFill("#FFF").drawRect(0, 0, img.width, img.height);
		bitmap.hitArea = hitArea;
		
		if (type == "Dragable_Object")
			bitmap = addListeners(bitmap, x, y);

		// stage.addChild(bitmap);
		add_to_stage(i, bitmap);
		stage.update();
	}
	return bitmap;
}

/*
	private function
	Add action listener to bitmap (Dragable_object type)
	handle mouseup, mousedown and pressmove event.

	Parameter:
		bitmap : Bitmap of dragable object.
		x : x-axis on canvas.
		y : y-axis on canvas.
*/
function addListeners(bitmap, x, y) {
	var active = true;

	// handle mousedown event
	bitmap.addEventListener("mousedown", function(evt) {
		if (!active) return;

		var drag = evt.target;
		drag.parent.addChild(drag);
		drag.offset = { x:drag.x - evt.stageX, y:drag.y - evt.stageY };

		// Manage clicked object to always in top of layer
		stage.swapChildrenAt(stage.getNumChildren() - 1, stage.getChildIndex(bitmap));
	});

	// handle mouseup event
	bitmap.addEventListener("click", function(evt) {
		if (!active) return;

		var drag = evt.target;

		// loop check that what dropable that this dragable object drop to.
		for (var i = 0; i < dropable_list.length; i++) {
			var drop = dropable_list[i];
			if (intersect(evt, drop) && drop.text == null) {
				count_ans++;
				if(origin == "CENTER") {
					var drop_cenX = Math.round(drop.posX + (drop.image.getBounds().width/2));
					var drop_cenY = Math.round(drop.posY + (drop.image.getBounds().height/2));
					drag.x = drop_cenX - Math.round((drag.getBounds().width/2));
					drag.y = drop_cenY - Math.round((drag.getBounds().height/2));
				} else {
					drag.x = drop.posX;
					drag.y = drop.posY;
				}
				bitmap.cursor = "";
				drop.image.visible = false;
				document.getElementById("msg").innerHTML = msg_set.doing;
				drop.text = bitmap.name;
				active = false;
				update = true;
				if(count_ans >= dropable_list.length) {
					document.getElementById("check").onclick = check;
					document.getElementById("msg").innerHTML = msg_set.finish;
					var s = document.getElementById("check").src;
					document.getElementById("check").src = s.replace("check", "check2");
				}
				return;
			}
		}
		drag.x = x;
		drag.y = y;
		update = true;
	});
	
	//handle pressmove event
	bitmap.addEventListener("pressmove", function(evt) {
		if (!active) return;

		var drag = evt.target;
		drag.x = evt.stageX + drag.offset.x;
		drag.y = evt.stageY + drag.offset.y;
		update = true;
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
	update = true;
}

/*
	private function
	Move all tick and cross symbol to top of layer (make them not behind in everything)
*/
function move_tick_cross_to_toplayer() {
	for(var i = stage.getNumChildren()-1; i >= 0; i--) {
		if(stage.getChildAt(i).name == "tick" || stage.getChildAt(i).name == "cross" ) {
			continue
		} else {
			for(var j = i; j >=0; j--) {
				if(stage.getChildAt(j).name == "tick" || stage.getChildAt(j).name == "cross" ) {
					stage.swapChildrenAt(i, j);
					break;
				}
				else if(j == 0) {
					update = true;
					return;
				}
			}
		}
	}
	update = true;
}

/*
	private function
	Check that mouse over the dropable object or not.
*/
function intersect(mouse, drop) {
	if ((mouse.stageX >= drop.posX) && (mouse.stageX <= drop.posX + drop.image.getBounds().width) 
		&& (mouse.stageY >= drop.posY) && (mouse.stageY <= drop.posY + drop.image.getBounds().height))
		return true;
	return false;
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
	this function will compare possible correct answer in dropable object with answer in dragable object
	and show tick or cross symbol follow the result
*/
function check() {
	var correct = 0;
	var incorrect = 0;
	move_tick_cross_to_toplayer();
	for (var i = 0; i < dropable_list.length; i++) {
		var drop = dropable_list[i];
		var ans = drop.answer

		for(var j = 0; j < ans.length; j++) {
			if (drop.text == ans[j]) {
				drop.tick.visible = true;
				correct++;
				stage.update();
				break;
			} else if(j == ans.length - 1) {
				drop.cross.visible = true;
				incorrect++;
				stage.update();
				break;
			}
		}
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
