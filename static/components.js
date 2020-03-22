var colourPickerCounter = 0;


socket.on('component_load', function(colorObjects){
    // console.log(colorObjects);
    try{
        $("#color-row").remove();
    } catch(e){}    
    $('#final_content_container').append($.parseHTML(colorObjects, document, true));
});

async function colour_picker(activate){
    if(activate){
        await sleep(1000);
        var colourPicker = new iro.ColorPicker(".colorPicker", {
            width: 200,
            color: "rgb(255, 255, 255)",
            borderWidth: 2,
            borderColor: "#373737",
            layoutDirection: "horizontal",
            padding: 5,
            margin: 5,
            layout: [
                { 
                  component: iro.ui.Box,
                },
                { 
                  component: iro.ui.Slider,
                  options:{
                      sliderType: 'hue',
                  }
                },
              ]
        });
        var colorPickerValues = document.getElementsByClassName("pickerValues");
        colourPicker.on(["color:init", "color:change"],
        function(color){
            pickedRGBWColor = rgb_to_rgbw(color.rgb);
            pickedRGBColor = new Array(color.rgb.r, color.rgb.g, color.rgb.b);
            colorPickerValues.innerHTML = [
                // "RGBW - (" + pickedRGBWColor[0] + ", " + pickedRGBWColor[1] + ", " + pickedRGBWColor[2] + ", " + pickedRGBWColor[3] + ")",
                // "RGB  - (" + pickedRGBColor[0] + ", " + pickedRGBColor[1] + ", " + pickedRGBColor[2] + ")"
                "R: " + pickedRGBWColor[0] + ", " + pickedRGBColor[0],
                "G: " + pickedRGBWColor[1] + ", " + pickedRGBColor[1],
                "B: " + pickedRGBWColor[2] + ", " + pickedRGBColor[2],
                "W: " + pickedRGBWColor[3]
            ].join("<br>");
            socket.emit('color_constant_change', color.rgb);
        });
        colourPickerCounter += 1;
    }
}


function sound_power(activate){
    if(activate){
        var slider = document.getElementById("volume_range");
        var output = document.getElementById("volume_value");
        output.innerHTML = slider.value; // Display the default slider value
        
        socket.on('analyzer_volume_update', function(value){
            output.innerHTML = value;
            slider.value = value;
            console.log("GOT ANALYZER_VOLUME_UPDATE: " + value);
        });
        
        // Update the current slider value (each time you drag the slider handle)
        slider.oninput = function() {
            output.innerHTML = this.value;
            socket.emit('analyzer_volume_change', this.value);
        } 
        socket.emit('request_analyzer_volume');
    }
    else{
        socket.removeAllListeners('analyzer_volume_update');
    }
} 

function fadeSettings(activate){
    if(activate){
        var slider = document.getElementById("fade_speed_range");
        var output = document.getElementById("fade_speed_value");
        slider.min = 1;
        slider.max = 500;
        output.innerHTML = (slider.value / 5) + "%"; // Display the default slider value
        
        // Update the current slider value (each time you drag the slider handle)
        slider.oninput = function() {
            output.innerHTML = (this.value / 5) + "%";
            socket.emit('color_fade_speed_change', {pos: 1, value: 501 - this.value});
        } 
    }
    else{
        
    }
}

        