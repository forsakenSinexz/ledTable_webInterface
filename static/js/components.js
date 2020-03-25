var colourPickerCounter = 0;


socket.on('component_load', function(colorObjects, name){
    // console.log(colorObjects);
    if(name == "color_objects"){
        try{
            $("#color-row").remove();
        } catch(e){}    
        $('#final_content_container').append($.parseHTML(colorObjects, document, true));
    }
});





// function fadeSettings(){
//     if(activate){
//         var slider = document.getElementById("fade_speed_range");
//         var output = document.getElementById("fade_speed_value");
//         slider.min = 1;
//         slider.max = 500;
//         output.innerHTML = (slider.value / 5) + "%"; // Display the default slider value
        
//         // Update the current slider value (each time you drag the slider handle)
//         slider.oninput = function() {
//             output.innerHTML = (this.value / 5) + "%";
//             socket.emit('color_fade_speed_change', {pos: 1, value: 501 - this.value});
//         } 
//     }
//     else{
        
//     }
// }

        