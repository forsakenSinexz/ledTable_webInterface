function colour_picker(activate){
    if(activate){
        var colourPicker = new iro.ColorPicker(".colorPicker", {
            width: 200,
            color: "rgb(255, 255, 255)",
            borderWidth: 2,
            borderColor: "#FFFFFF"
        });
        var colorPickerValues = document.getElementById("pickerValues");
        colourPicker.on(["color:init", "color:change"],
        function(color){
            pickedRGBWColor = rgb_to_rgbw(color.rgb);
            pickedRGBColor = new Array(color.rgb.r, color.rgb.g, color.rgb.b);
            colorPickerValues.innerHTML = [
            "rgbw: (" + pickedRGBWColorLeft[0] + "," + pickedRGBWColorLeft[1] + "," + pickedRGBWColorLeft[2] + "," + pickedRGBWColorLeft[3] + ")",
            "rgb: (" + pickedRGBColorLeft[0] + "," + pickedRGBColorLeft[1] + "," + pickedRGBColorLeft[2] + ")"
            ].join("<br>");
        });
    }
}


function sound_power(activate){
    if(activate){
        console.log("SMOOOTH");
        var slider = document.getElementById("volume_range");
        var output = document.getElementById("volume_value");
        output.innerHTML = slider.value; // Display the default slider value
        
        socket.on('analyzer_volume_update', function(value){
            output.innerHTML = value;
            slider.value = value;
            console.log("GOT ANALYZER_VOLUME_UPDATE: " + value)
        });
        
        // Update the current slider value (each time you drag the slider handle)
        slider.oninput = function() {
            output.innerHTML = this.value;
            socket.emit('analyzer_volume_change', this.value);
        } 
    }
    else{
        socket.removeAllListeners('analyzer_volume_update');
    }
    
} 