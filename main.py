from flask import Flask, render_template, has_app_context
from flask_socketio import SocketIO
import random
import config
import TableData
from TableData import table_mode_manager as tmm 


# venv\Scripts\activate

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secreto!'
socketio = SocketIO(app, logger=True, engineio_logger=True)


@app.route('/')
def hello_world():
    return render_template('index.html')

##################################################################################
###########################  SOCKET IO STUFF  ####################################
##################################################################################
##################################################################################

@socketio.on('connect')
def connect():
    socketio.emit('sub_page', (get_sub_page(TableData.mode), TableData.mode), broadcast=False)

@socketio.on('analyzer_volume_change')
def change_analyzer_volume(value):
    #Event.analyzer_percentage_queue.put(message['value'])
    TableData.analyzer_change_boost(value)
    print("Analyzer volume change to {}".format(value))
    socketio.emit('analyzer_volume_update', value, broadcast=True, include_self=False)

@socketio.on('request_analyzer_volume')
def answer_analyzer_volume_request():
    print('got analyzer volume request')
    print(TableData.analyzer_boost)
    socketio.emit('analyzer_volume_update', TableData.analyzer_boost)

@socketio.on('sub_color_change')
def color_constant_change(m):
    print(m)
    TableData.table_mode_manager.get_color_manager().change_color(m['pos'], [m['g'],m['r'],m['b'],0])

@socketio.on('color_mode_change')
def color_mode_change(mode):
    print('color mode has been changed to {}'.format(mode))
    TableData.table_mode_manager.get_color_manager().change_mode(mode)

@socketio.on('color_fade_speed_change')
def color_fade_speed_change(speed_message):
    TableData.table_mode_manager.get_color_manager().change_color_fade_speed(speed_message['pos'], speed_message['value'])

# @socketio.on('pixel_colored_event')
# def handle_pixel_colored(message):
#     global table_main
#     y = message['y']
#     x = message['x']
#     g = message['g']
#     r = message['r']
#     b = message['b']
#     w = message['w']
#     # print('pixel [{},{}] was colored: [{},{},{},{}]'.format(y,x,r,g,b,w))
#     table_main.web_rgbw_array[y][x] = [g,r,b,w]
#     #Event.web_array_change_queue.put((y,x,[g,r,b,w]), timeout=50)

# @socketio.on('array_clear_event')
# def handle_array_clear(message):
#     #TODO: insert into table python script!
#     print('Pixel array was cleared.')
#     for y,row in enumerate(web_colorarray):
#         for x,_ in enumerate(row):
#             web_colorarray[y][x] = [0,0,0,0,1]
#     if(not (table_main is None)):
#         for y in range(len(table_main.web_rgbw_array)):
#             for x in range(len(table_main.web_rgbw_array[y])):
#                 table_main.web_rgbw_array[y][x] = [0,0,0,0]


@socketio.on('mode_switch_event')
def handle_mode_switch(mode):
    print('Mode switched to {}.'.format(mode))
    tmm.change_mode(mode)


@socketio.on('colorarray_show_event')
def tmp_test_show_reciever(message):
    random_list = [[[g,r,0,0] for r,g in [(random.randint(0,255),random.randint(0,255)) for _ in range(23)]] for _ in range(23)]
    for each in random_list:
        for each_pixel in each:
            random.shuffle(each_pixel)
    tmp_show(random_list)

@socketio.on('load_sub_page')
def load_sub_page(page_name): # page_name : str
    socketio.emit('sub_page', get_sub_page(page_name), broadcast=False)

def get_sub_page(page_name):
    return render_template('subPages/{}.html'.format(page_name))

@socketio.on('color_mode_switch')
def color_mode_switch(cmode):
    TableData.table_mode_manager.get_color_manager().change_mode(cmode)
    socketio.emit('color_mode_update', cmode, broadcast=True, include_self=False)

def load_color_component(color_manager):
    print("got color manager call for {}".format(color_manager))
    if has_app_context():
        socketio.emit(
            'component_load',
            render_template(
                'components/color_object.html',
                mode = color_manager.mode,
                mode_objects = color_manager.color_objects,
            ),
            broadcast = True)
    print("got color manager call for {}".format(color_manager))

def update_color_component(cmode):
    socketio.emit('update_color_component', cmode, broadcast=True)

@socketio.on('color_submode_change')
def color_submode_change(mode_dict):
    tmm.get_color_manager().change_submode(
        mode_dict['co'], mode_dict['m']
    )

#TODO: Take over to table python scripts
def tmp_show(colorarray):
    '''
        This method will be replaced with show at LED_table (matrix.show(colorarray))
        For now: Display the array on the web-app
    '''
    #[[y,x,g,r,b], [y,x,g,r,b],....]
    socketio.emit('colorarray_show_event', [[pixel for pixel in row] for row in colorarray])    


@socketio.on('testmessage')
def handle_testmessage(stringMessage):
    print(stringMessage['data'])


##################################################################################
##################################################################################
##################################################################################


def start_server(ip, debug=False):
    print(has_app_context())
    TableData.web_app_ready = True
    socketio.run(app, host=ip, port=5000, debug=debug)
    #socketio.run(app, host='127.0.0.1', port=5000, debug=True)

if __name__ == "__main__":
    start_server('127.0.0.1', debug=True)
    # start_server('192.168.178.30', debug=True)
    #app.run(debug=True,host='127.0.0.1', port=8080)


    