
/*
This script help to create animation in e-learning web application by controlling resource loader.
This script use createjs, easeljs, canvas for load resource.
This script can help you make sure that animation will start when all resource already loaded to memory.
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
tweenjs-0.5.1.min.js


variable detail

animation_stage : Stage instance create from canvas (createjs's object)
resource_object : list of resource object.
path_a : base path for all resource.
index_a : Variable that use for control order of resource for reliable Z-index.
z_index_a : list of resource order that represent layer in canvas. Use for layer control in canvas
all_resource : Number of all resource that call for load.
loaded_resource : Number of all resource that already loaded.
onloadcomplete : Function that will call after all resource loaded.

*/

var animation_stage, resource_object, path_a, index_a, z_index_a, all_resource, loaded_resource, onloadcomplete;

/*
Initialize all variable in this script
Must call this function at first.

Parameter:
	p : base path for resource for the quiz
	f : Callback function that will call after all resource already loaded.
		This function will be call with object map between <Tag (Specify when add resource), Bitmap object (Can use with tweenjs)>
		pass as parameter.
*/
function init_animation_controll(p,f) {
	animation_stage = new createjs.Stage(document.getElementById("canvas"));
	createjs.Ticker.addEventListener("tick", animation_tick);
	createjs.Ticker.setFPS(12);
	resource_object = {};
	path_a = p;
	index_a = 0;
	z_index_a = [];
	all_resource = 0;
	loaded_resource = 0;
	onloadcomplete = f;
}

/*
	Add resource (Image)

	Parameter:
		x : x-axis on canvas
		y : y-axis on canvas
		filename : image file
		tag : This will specify key that map to this bitmap object in map object
		visible : set that this bitmap will visible at first or not
*/
function add_resource(x, y, filename, tag, visible) {
	var image = new Image();
	image.src = path_a + filename;
	image.name = filename;
	// image.scaleX = image.scaleY = image.scale = scale;
	all_resource++;
	resource_object[tag] = load_resource(image, x, y, "Bilder", index_a, visible);
	index_a++;
}

/*
	Add text

	Parameter:
		x : x-axis on canvas
		y : y-axis on canvas
		filename : image file
		text : The text to display.
		font : The font style to use. Any valid value for the CSS font attribute is acceptable (ex. "bold 36px Arial").
		color : The color to draw the text in. Any valid value for the CSS color attribute is acceptable (ex. "#F00", "red", or "#FF0000").
		tag : This will specify key that map to this bitmap object in map object
		visible : set that this bitmap will visible at first or not
*/
function add_text(x, y, text, font, color, tag, visible) {
	var t = new createjs.Text(text, font, color);
	t.x = x;
	t.y = y;
	t.name = "text"
	t.visible = visible;
	resource_object[tag] = t;
	add_to_animation_stage(index_a, t);
	index_a++;
}

/*
	private function
	use for load image into bitmap

	Parameter:
		image : image object
		x : x-axis on canvas
		y : y-axis on canvas
		type : Type of object.
		i : Global varible index_a. for control z-axis.
		visible : set that this bitmap will visible at first or not

*/
function load_resource(image, x, y, type, i, visible) {
	var bitmap = new createjs.Bitmap(image);
	image.onload = function(event) {
		var img = event.target;
		// bitmap = new createjs.Bitmap(img);
		bitmap.x = x;
		bitmap.y = y;
		bitmap.scaleX = bitmap.scaleY = bitmap.scale = 1;
		bitmap.name = image.name;
		bitmap.visible = visible;

		var hitArea = new createjs.Shape();
		hitArea.graphics.beginFill("#FFF").drawRect(0, 0, img.width, img.height);
		bitmap.hitArea = hitArea;

		add_to_animation_stage(i, bitmap);
		loaded_resource++;

		// When all resource already loaded then call function (that specify when init)
		// with map object that map between tag and bitmap for all bitmap that add by
		// "add_text" and "add_resource" function
		if(all_resource == loaded_resource) {
			onloadcomplete(resource_object);
		}
	}
	return bitmap;
}

/*
	private function
	this function will called in every framerate
*/
function animation_tick(event) {
	animation_stage.update(event);
}

/*
	private function
	layer control
	Control order of resource add to canvas follow order of function call.

	Paramether:
		index_a : Given index number
		bitmap : bitmap instance
*/
function add_to_animation_stage(index_a, bitmap) {
	if(z_index_a.length == 0) {
		animation_stage.addChild(bitmap);
		z_index_a.push(index_a);
	} 
	else {
		for(var i = 0; i < z_index_a.length; i++) {
			if(z_index_a[i] > index_a) {
				z_index_a.splice(i, 0, index_a);
				animation_stage.addChildAt(bitmap, i);
				break;
			} else if(i == z_index_a.length-1) {
				animation_stage.addChild(bitmap);
				z_index_a.push(index_a);
				break;
			}
		}
	}

}

// function DrawHTML(x, y,htmlTag) {
// 	var html = document.getElementById(htmlTag);	
// 	var d = new createjs.DOMElement( html );
// 	d.x = x;
// 	d.y = y;
// 	add_to_animation_stage(index_a, d);
// 	index_a++;
// }

function rect(x, y, w, h, color){
	var rect = new createjs.Shape();
	rect.graphics.beginFill(color);
	rect.graphics.drawRect(x, y, w, h);
	add_to_animation_stage(index_a, rect);
	index_a++;
}

function Border(x, y, width, height, color, colorfill, tag) {
	var border = new createjs.Shape(); 
	border.graphics.beginFill(colorfill);
	border.graphics.beginStroke(color); 
	border.graphics.setStrokeStyle(.5); 
	border.snapToPixel = true; 
	border.graphics.drawRect(x, y, width, height); 
	border.name = "border"
	// stage.addChild(border);
	resource_object[tag] = border;
	add_to_animation_stage(index_a, border);
	index_a++;
}
