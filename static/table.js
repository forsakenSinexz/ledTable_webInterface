var pickedRGBWColorLeft = null;
var pickedRGBColorLeft = null;

var pickedRGBWColorRight = null;
var pickedRGBColorRight = null;

var dragClickButton = null;
var isMouseDown;

var socket = io();
socket.on('connect', function() {
  socket.emit('testmessage', {data: 'I\'m connected!'});
});

document.addEventListener('mousedown', event => isMouseDown = true);
document.addEventListener('mouseup', event => isMouseDown = false);
document.addEventListener('contextmenu', event => event.preventDefault());

function parsePixel(pixelString){
  var strings = pixelString.trim().split(",");
  var y = parseInt(strings[0]);
  var x = parseInt(strings[1]);
  return [y,x];
}

function mouseOnPixelEventHanlder(event, pixel){
  dragClickButton = event.button;
  if(event.button == 0){ //left mouse button
    pixel.style.backgroundColor = 'rgb(' + pickedRGBColorLeft[0] + ',' + pickedRGBColorLeft[1] + ',' + pickedRGBColorLeft[2] + ')';
    var tmpPos = parsePixel(pixel.innerHTML);
    socket.emit('pixel_colored_event', {y: tmpPos[0], x: tmpPos[1], g: pickedRGBWColorLeft[1], r: pickedRGBWColorLeft[0], b: pickedRGBWColorLeft[2], w: pickedRGBWColorLeft[3]});
  }
  else if(event.button == 1){ //middle mouse button
    pixel.style.backgroundColor = 'rgb(' + 0 + ',' + 0 + ',' + 0 + ')';
    socket.emit('pixel_colored_event', {y: tmpPos[0], x: tmpPos[1], g: 0, r: 0, b: 0, w: 0});
  }
  else if(event.button == 2){ //right mouse button
    pixel.style.backgroundColor = 'rgb(' + pickedRGBColorRight[0] + ',' + pickedRGBColorRight[1] + ',' + pickedRGBColorRight[2] + ')';
    var tmpPos = parsePixel(pixel.innerHTML);
    socket.emit('pixel_colored_event', {y: tmpPos[0], x: tmpPos[1], g: pickedRGBWColorRight[1], r: pickedRGBWColorRight[0], b: pickedRGBWColorRight[2], w: pickedRGBWColorRight[3]});
  }
  return false;
}



function pixelDragOverHandler(pixel){
  if(isMouseDown){
    if(dragClickButton == 0){ //left mouse button
      pixel.style.backgroundColor = 'rgb(' + pickedRGBColorLeft[0] + ',' + pickedRGBColorLeft[1] + ',' + pickedRGBColorLeft[2] + ')';
      var tmpPos = parsePixel(pixel.innerHTML);
      socket.emit('pixel_colored_event', {y: tmpPos[0], x: tmpPos[1], g: pickedRGBWColorLeft[1], r: pickedRGBWColorLeft[0], b: pickedRGBWColorLeft[2], w: pickedRGBWColorLeft[3]});
    }
    else if(dragClickButton == 1){ //middle mouse button
      pixel.style.backgroundColor = 'rgb(' + 0 + ',' + 0 + ',' + 0 + ')';
      socket.emit('pixel_colored_event', {y: tmpPos[0], x: tmpPos[1], g: 0, r: 0, b: 0, w: 0});
    }
    else if(dragClickButton == 2){ //right mouse button
      pixel.style.backgroundColor = 'rgb(' + pickedRGBColorRight[0] + ',' + pickedRGBColorRight[1] + ',' + pickedRGBColorRight[2] + ')';
      var tmpPos = parsePixel(pixel.innerHTML);
      socket.emit('pixel_colored_event', {y: tmpPos[0], x: tmpPos[1], g: pickedRGBWColorRight[1], r: pickedRGBWColorRight[0], b: pickedRGBWColorRight[2], w: pickedRGBWColorRight[3]});
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

function rgbw_to_rgb(color){
  return new Array(Math.min(color[0] + color[3], 255), Math.min(color[1] + color[3], 255), Math.min(color[2] + color[3], 255))
}

var gridVisible = false;
function toggleGrid(){
  if(gridVisible){
    gridVisible = false;
    $(".pixel_elem").each(function() {
      $(this).get(0).style.border = "0px solid #969696";
    });
  }else{
    gridVisible = true;
    $(".pixel_elem").each(function() {
      $(this).get(0).style.border = "1px solid #969696";
    });
  }
}

function togglePixelNumbers(){
  $(".pixel_elem").each(function() {
    if($(this).get(0).style.fontSize == "0px"){
      $(this).get(0).style.fontSize = "10px";
    }   
    else{
      $(this).get(0).style.fontSize = "0px";
    }
  });
}

function copyChangesToClipboard(){
  var result = "";
  $(".pixel_elem").each(function() {
    if($(this).get(0).style.backgroundColor != "rgb(0, 0, 0)"){
      var tmpPos = parsePixel($(this).get(0).innerHTML);
      result += "[" + tmpPos[0] + ", " + tmpPos[1] + ", " + pickedRGBWColorRight[1] + ", " + pickedRGBWColorRight[0] + ", " + pickedRGBWColorRight[2] + ", " + pickedRGBWColorRight[3] + "], ";
    }
  });
  result = result.substring(0, result.length - 2);
  console.log(result);
}

function clearArray(){
  $(".pixel_elem").each(function() {
    $(this).get(0).style.backgroundColor = 'rgb(0,0,0)';
  });
}

socket.on('colorarray_show_event', function (data) {
  for(var y = 0; y < data.length; y++){
    for(var x = 0; x < data[y].length; x++){
      var tmp_rgb_color = rgbw_to_rgb(data[y][x]);
      ($('#table_view').children()[y].children[x]).style.backgroundColor = 'rgb(' + tmp_rgb_color[1] + ',' + tmp_rgb_color[0] + ',' + tmp_rgb_color[2] + ')'; 
    }
  }
});

function test(){
  socket.emit('colorarray_show_event', {});
}