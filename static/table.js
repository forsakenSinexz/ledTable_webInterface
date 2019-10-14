var pickedRGBWColorLeft = null;
var pickedRGBColorLeft = null;

var pickedRGBWColorRight = null;
var pickedRGBColorRight = null;

var dragClickButton = null;
var isMouseDown;

document.addEventListener('mousedown', event => isMouseDown = true);
document.addEventListener('mouseup', event => isMouseDown = false);
document.addEventListener('contextmenu', event => event.preventDefault());

function mouseOnPixelEventHanlder(event, pixel){
  dragClickButton = event.button;
  if(event.button == 0){ //left mouse button
    pixel.style.backgroundColor = 'rgb(' + pickedRGBColorLeft[0] + ',' + pickedRGBColorLeft[1] + ',' + pickedRGBColorLeft[2] + ')';
  }
  else if(event.button == 1){ //middle mouse button
    
  }
  else if(event.button == 2){ //right mouse button
    pixel.style.backgroundColor = 'rgb(' + pickedRGBColorRight[0] + ',' + pickedRGBColorRight[1] + ',' + pickedRGBColorRight[2] + ')';
  }
  return false;
}

function printColorarray(){
  $(".pixel_elem").each(function() {
    console.log($(this).get(0).style.backgroundColor);
    if($(this).get(0).style.backgroundColor != "rgb(0, 0, 0)"){
      console.log("generationg cokalsfd");
    }
  });
}

function pixelDragOverHandler(pixel){
  if(isMouseDown){
    if(dragClickButton == 0){ //left mouse button
      pixel.style.backgroundColor = 'rgb(' + pickedRGBColorLeft[0] + ',' + pickedRGBColorLeft[1] + ',' + pickedRGBColorLeft[2] + ')';
    }
    else if(dragClickButton == 1){ //middle mouse button
      
    }
    else if(dragClickButton == 2){ //right mouse button
      pixel.style.backgroundColor = 'rgb(' + pickedRGBColorRight[0] + ',' + pickedRGBColorRight[1] + ',' + pickedRGBColorRight[2] + ')';
    }
  }
  
}


var colorPickerLeft = new iro.ColorPicker(".colorPickerLeftClick", {
  width: 200,
  color: "rgb(255, 255, 255)",
  borderwidth: 1,
  borderColor: "#fff",
});

var colorPickerRight = new iro.ColorPicker(".colorPickerRightClick", {
  width: 200,
  color: "rgb(255, 255, 255)",
  borderwidth: 1,
  borderColor: "#fff",
});

var valuesLeft = document.getElementById("valuesLeft");
var valuesRight = document.getElementById("valuesRight");

colorPickerLeft.on(["color:init", "color:change"],
function(color){
  pickedRGBWColorLeft = rgb_to_rgbw(color.rgb);
  pickedRGBColorLeft = new Array(color.rgb.r, color.rgb.g, color.rgb.b);
  valuesLeft.innerHTML = [
    "rgbw: (" + pickedRGBWColorLeft[0] + "," + pickedRGBWColorLeft[1] + "," + pickedRGBWColorLeft[2] + "," + pickedRGBWColorLeft[3] + ")",
    "rgb: (" + pickedRGBColorLeft[0] + "," + pickedRGBColorLeft[1] + "," + pickedRGBColorLeft[2] + ")"
  ].join("<br>");
});

colorPickerRight.on(["color:init", "color:change"],
function(color){
  pickedRGBWColorRight = rgb_to_rgbw(color.rgb);
  pickedRGBColorRight = new Array(color.rgb.r, color.rgb.g, color.rgb.b);
  valuesRight.innerHTML = [
    "rgbw: (" + pickedRGBWColorRight[0] + "," + pickedRGBWColorRight[1] + "," + pickedRGBWColorRight[2] + "," + pickedRGBWColorRight[3] + ")",
    "rgb: (" + pickedRGBColorRight[0] + "," + pickedRGBColorRight[1] + "," + pickedRGBColorRight[2] + ")"
  ].join("<br>");
});

function rgb_to_rgbw(color){
  var min = 0;
  if (color.r < color.g && color.r < color.b){
    min = color.r;
  } else if (color.g < color.b){
    min = color.g;
  } else {
    min = color.b;
  }
  return new Array((color.r - min), (color.g - min), (color.b - min), min);
}