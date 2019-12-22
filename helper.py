
# call this function with a pixel and it changes the color to a rainbowcolor
# multiple calls lead to rainbowfading
def color_wheel(strip, pixel, step, brightness, keep_white, color=None):
    assert brightness <= 1, "brightness must be between 0 and 1"
    calculated_max_brightness = int(255 * brightness)
    if color is None:
        color = strip.getPixelColor(pixel)
        if keep_white:
            color_array = [(color&0xFF0000) >> 16,(color&0x00FF00) >> 8,(color&0x0000FF),(color&0xFF000000) >> 24]
        else:
            color_array = [(color&0xFF0000) >> 16,(color&0x00FF00) >> 8,(color&0x0000FF),0]
    else:
        color_array = color
    

    #level array to rainbowcolors(only 2 colors at the same time)
    if color_array[0] > 0 and color_array[1] > 0 and color_array[2] > 0:
        color_min = min(color_array)
        for i in range(3):
            color_array[i] -= color_min
        color_max = max(color_array)
        for i in range(3):
            if(color_array[i] == color_max):
                color_array[i] = calculated_max_brightness
                break
    if (color_array[0] == 0) and (color_array[1] == 0) and (color_array[2]) == 0:
        color_array[0] = int(calculated_max_brightness)
        return color_array
    

    brightness_check = True
    #add or substract the step to each color necesarry
    for i in range(3):
        if color_array[i] == calculated_max_brightness:
            brightness_check = False
            if(color_array[(i+2)%3] > 0):
                color_array[(i+2)%3] = color_array[(i+2)%3] - step if ((color_array[(i+2)%3] - step) > 0) else 0  
            elif(color_array[(i+1)%3] < calculated_max_brightness):
                color_array[(i+1)%3] = color_array[(i+1)%3] + step if ((color_array[(i+1)%3] + step) < calculated_max_brightness) else calculated_max_brightness 
            else:
                color_array[i] = calculated_max_brightness - step
                if(color_array[i] < 0):
                    color_array[i] = 0
    if brightness_check:
        color_array[0] = int(color_array[0] * brightness)
        color_array[1] = int(color_array[1] * brightness)
        color_array[2] = int(color_array[2] * brightness)
    return color_array

def reset_colorarray(colorarray):
    colorarray = [[[0,0,0,0]+[] for _ in range(23)]+[] for _ in range(23)]
    return colorarray

def reset_brightness_colorarray(colorarray):
    colorarray = [[[0,0,0,0,0]+[] for _ in range(23)]+[] for _ in range(23)]
    return colorarray

def rainbow_color_wheel(color, step):
    if((color[0] is 255) and (color[2] is 0)):
        color[1] += step
        if(color[1] > 255):
            color[1] = 255
        if(color[1] is 255):
            color[0] -= step
        return color[:]
    
    if((color[1] is 255) and (color[0] != 0)):
        color[0] -= step
        if(color[0] < 0):
            color[0] = 0
        return color[:]

    if((color[1] is 255) and (color[0] is 0)):
        color[2] += step
        if(color[2] > 255):
            color[2] = 255
        if(color[2] is 255):
            color[1] -= step
        return color[:]

    if((color[2] is 255) and (color[1] != 0)):
        color[1] -= step
        if(color[1] < 0):
            color[1] = 0
        return color[:]

    if((color[2] is 255) and (color[1] is 0)):
        color[0] += step
        if(color[0] > 255):
            color[0] = 255
        if(color[0] is 255):
            color[2] -= step
        return color[:]

    if((color[0] is 255) and (color[2] != 0)):
        color[2] -= step
        if(color[2] < 0):
            color[2] = 0
        return color[:]
    
    if(color[0] > 0 and color[1] > 0 and color[2] > 0):
        color[:] = [255,0,0,0]
        return color
    
    for i in range(3):
        if(color[i] > 0):
            color[i] += step 
        if(color[i] > 255):
            color[i] = 255