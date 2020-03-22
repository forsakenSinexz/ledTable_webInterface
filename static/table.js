var pickedRGBWColorLeft = null;
var pickedRGBColorLeft = null;

var pickedRGBWColorRight = null;
var pickedRGBColorRight = null;

var dragClickButton = null;
var isMouseDown;

var sideBarOffset = document.getElementById('sidebar').getBoundingClientRect().top;
var sideBarSelectorBarPos = 0;
var currentlySelectedSidenavItem = document.getElementsByClassName('sidebar-nav')[0];
var oldBarPos = 0;

var currentMode = 0;






document.addEventListener('keydown', function(event) {
  if(event.keyCode == 78) {
    toggleSidebar();
  }
});

// sidenav
$(document).ready(function () {
  $('#sidebarCollapse').on('click', function() {toggleSidebar()});
});

function toggleSidebar(){
  $('#sidebar').toggleClass('active');
  if($('#sidebar').hasClass('active')){
    $('.subsidebar.active').addClass('subactive');
    $('.subsidebar').addClass('active');
  }
  else{
    $('.subsidebar:not(.subactive)').removeClass('active')
    $('.subsidebar.subactive').removeClass('subactive');
  }
  checkContentPos();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function moveSideBarSelectorBar(elem, barPos, subnavnumber){
  
  currentlySelectedSidenavItem.classList.remove('active');
  elem.classList.add('active');
  currentlySelectedSidenavItem = elem;
  
  if($('.subsidebar.' + barPos + "-" + subnavnumber).hasClass('active')){
    $('.subsidebar.' + barPos + "-" + subnavnumber).removeClass('active');
  }
  else{
    $('.subsidebar.'+ barPos + "-" + subnavnumber).addClass('active');
  }
  $('.subsidebar:not(.' + barPos + "-" + subnavnumber + ')').addClass('active');
  checkContentPos();
  if(barPos == 0){
    var bar = document.getElementById('slelected-bar-indicator').classList.add('active');
    var bar = document.getElementById('settings-bar-indicator').classList.remove('active');
    animiere(subnavnumber * 80, 500);
  }
  else{
    var bar = document.getElementById('slelected-bar-indicator').classList.remove('active');
    var bar = document.getElementById('settings-bar-indicator').classList.add('active');
  }
}

function checkContentPos(){
  if($('.subsidebar:not(.active)').length){
    $('#pseudo-sidebar').addClass('active');
  }
  else{
    $('#pseudo-sidebar').removeClass('active');
  }
}

function animiere(toPosY, myDuration) { 
  // console.log(toPosY);
  // toPosY -= sideBarOffset;
  var bar = document.getElementById('slelected-bar-indicator');
  bar.animate(
    [
      {
        marginTop: sideBarSelectorBarPos + 'px'
      }, {
        marginTop: toPosY + 'px'
      }
    ], {
      duration: myDuration,
      iterations: 1,
      fill: 'forwards',
      easing: 'ease'
    });
    sideBarSelectorBarPos = toPosY;
  }
  
  
  $('#mode-collapsible').on('show.bs.collapse', function () {
    $('#nav-mode-btn').addClass('nav-button-collapsed');
  });
  
  $('#mode-collapsible').on('hidden.bs.collapse', function () {
    $('#nav-mode-btn').removeClass('nav-button-collapsed');
  });
  
  document.addEventListener('mousedown', event => isMouseDown = true);
  document.addEventListener('mouseup', event => isMouseDown = false);
  // document.querySelector("#table_view").addEventListener('contextmenu', event => event.preventDefault());
  
  function parsePixel(pixelString){
    var strings = pixelString.trim().split(",");
    var y = parseInt(strings[0]);
    var x = parseInt(strings[1]);
    return [y,x];
  }
  
  function mouseOnPixelEventHanlder(event, pixel){
    dragClickButton = event.button;
    if(colorpicking){
      var pick = pixel.style.backgroundColor.replace("rgb(", "").replace(")", "").split(",");
      var parsed_pick = new Array(parseInt(pick[0]), parseInt(pick[1]), parseInt(pick[2]));
      applyColorPick(parsed_pick);
      return;
    }
    if(event.button == 0){ //left mouse button
      pixel.style.backgroundColor = 'rgb(' + pickedRGBColorLeft[0] + ',' + pickedRGBColorLeft[1] + ',' + pickedRGBColorLeft[2] + ')';
      var tmpPos = parsePixel(pixel.innerHTML);
      socket.emit('pixel_colored_event', {y: tmpPos[0], x: tmpPos[1], g: pickedRGBWColorLeft[1], r: pickedRGBWColorLeft[0], b: pickedRGBWColorLeft[2], w: pickedRGBWColorLeft[3]});
    }
    else if(event.button == 1){ //middle mouse button
      pixel.style.backgroundColor = 'rgb(' + 0 + ',' + 0 + ',' + 0 + ')';
      var tmpPos = parsePixel(pixel.innerHTML);
      socket.emit('pixel_colored_event', {y: tmpPos[0], x: tmpPos[1], g: 0, r: 0, b: 0, w: 0});
      event.preventDefault();
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
        var tmpPos = parsePixel(pixel.innerHTML);
        socket.emit('pixel_colored_event', {y: tmpPos[0], x: tmpPos[1], g: 0, r: 0, b: 0, w: 0});
      }
      else if(dragClickButton == 2){ //right mouse button
        pixel.style.backgroundColor = 'rgb(' + pickedRGBColorRight[0] + ',' + pickedRGBColorRight[1] + ',' + pickedRGBColorRight[2] + ')';
        var tmpPos = parsePixel(pixel.innerHTML);
        socket.emit('pixel_colored_event', {y: tmpPos[0], x: tmpPos[1], g: pickedRGBWColorRight[1], r: pickedRGBWColorRight[0], b: pickedRGBWColorRight[2], w: pickedRGBWColorRight[3]});
      }
    }
  }
  
  
  // var colorPickerLeft = new iro.ColorPicker(".colorPickerLeftClick", {
  //   width: 200,
  //   color: "rgb(255, 255, 255)",
  //   borderWidth: 2,
  //   borderColor: "#FFFFFF"
  // });
  
  // var colorPickerRight = new iro.ColorPicker(".colorPickerRightClick", {
  //   width: 200,
  //   color: "rgb(255, 255, 255)",
  //   borderWidth: 2,
  //   borderColor: "#FFFFFF"
  // });
  
  // var valuesLeft = document.getElementById("valuesLeft");
  // var valuesRight = document.getElementById("valuesRight");
  
  // colorPickerLeft.on(["color:init", "color:change"],
  // function(color){
  //   pickedRGBWColorLeft = rgb_to_rgbw(color.rgb);
  //   pickedRGBColorLeft = new Array(color.rgb.r, color.rgb.g, color.rgb.b);
  //   valuesLeft.innerHTML = [
  //     "rgbw: (" + pickedRGBWColorLeft[0] + "," + pickedRGBWColorLeft[1] + "," + pickedRGBWColorLeft[2] + "," + pickedRGBWColorLeft[3] + ")",
  //     "rgb: (" + pickedRGBColorLeft[0] + "," + pickedRGBColorLeft[1] + "," + pickedRGBColorLeft[2] + ")"
  //   ].join("<br>");
  // });
  
  // colorPickerRight.on(["color:init", "color:change"],
  // function(color){
  //   pickedRGBWColorRight = rgb_to_rgbw(color.rgb);
  //   pickedRGBColorRight = new Array(color.rgb.r, color.rgb.g, color.rgb.b);
  //   valuesRight.innerHTML = [
  //     "rgbw: (" + pickedRGBWColorRight[0] + "," + pickedRGBWColorRight[1] + "," + pickedRGBWColorRight[2] + "," + pickedRGBWColorRight[3] + ")",
  //     "rgb: (" + pickedRGBColorRight[0] + "," + pickedRGBColorRight[1] + "," + pickedRGBColorRight[2] + ")"
  //   ].join("<br>");
  // });
  
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
    socket.emit('array_clear_event', {});
  }
  
  // socket.on('colorarray_show_event', function (data) {
  //   for(var y = 0; y < data.length; y++){
  //     for(var x = 0; x < data[y].length; x++){
  //       var tmp_rgb_color = rgbw_to_rgb(data[y][x]);
  //       ($('#table_view').children()[y].children[x]).style.backgroundColor = 'rgb(' + tmp_rgb_color[1] + ',' + tmp_rgb_color[0] + ',' + tmp_rgb_color[2] + ')'; 
  //     }
  //   }
  // });
  
  colorpicking = false;
  colorpickingHand = false;
  
  function pickColorStart(left){
    $("html").get(0).style.cursor = 'url("static/icons/dropper.svg"), default';
    colorpicking = true;
    colorpickingHand = left;
  }
  
  function applyColorPick(color){
    if(colorpickingHand){
      colorPickerLeft.color.rgb = {r:color[0], g:color[1], b: color[2]};
    }
    else{
      colorPickerRight.color.rgb = {r:color[0], g:color[1], b: color[2]};
    }
    colorpicking = false;
    console.log($("html").get(0).style);
    $("html").get(0).style.cursor = 'default';
  }
  
  
  
  
  
  
  
  
  // Range slider
  
  
  
  
  
  
  
  
  
  
  
  
  // function test(){
  //   socket.emit('colorarray_show_event', {});
  // }