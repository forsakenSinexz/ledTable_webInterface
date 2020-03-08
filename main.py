from flask import Flask, render_template
from flask_socketio import SocketIO
import random
# import Table_Event

# venv\Scripts\activate

#TODO wenn alles fertig ist, mache eine zweite main klasse ohne die (if (table_main is not none)) überall (effizienz)

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secreto!'
socketio = SocketIO(app)

web_colorarray = [[[0,0,0,0,1] for _ in range(23)] for _ in range(23)] # not really used.

@app.route('/')
def hello_world():
    return render_template('index.html')

@app.route('/controls/<mode_name>')
def control_modes(mode_name="paint"):
    return render_template('controls/{}.html'.format(mode_name))

@app.route('/modi/<mode_name>')
def modi_page(mode_name="AndyAnalyzer"):
    return 

@app.route('/analyzers/<mode_name>')
def analyzer_page(mode_name='andy'):
    return render_template('analyzers/{}.html'.format(mode_name))

@socketio.on('analyzer_volume_change')
def change_analyzer_volume(message):
    #Event.analyzer_percentage_queue.put(message['value'])
    Table_Event.analyzer_event(Table_Event.Analyzer_Event(0, message['value']))
    socketio.emit('analyzer_volume_update', {'value': message['value']}, broadcast=True)

@socketio.on('request_analyzer_volume')
def answer_analyzer_volume_request():
    #TODO request from table
    socketio.emit('analyzer_volume_update', {'value': 25})

@socketio.on('pixel_colored_event')
def handle_pixel_colored(message):
    global table_main
    y = message['y']
    x = message['x']
    g = message['g']
    r = message['r']
    b = message['b']
    w = message['w']
    print('pixel [{},{}] was colored: [{},{},{},{}]'.format(y,x,r,g,b,w))
    web_colorarray[y][x][:4] = [g,r,b,w]
    if(not (table_main is None)):
        table_main.web_rgbw_array[y][x] = [g,r,b,w]
    #Event.web_array_change_queue.put((y,x,[g,r,b,w]), timeout=50)

@socketio.on('array_clear_event')
def handle_array_clear(message):
    #TODO: insert into table python script!
    print('Pixel array was cleared.')
    for y,row in enumerate(web_colorarray):
        for x,_ in enumerate(row):
            web_colorarray[y][x] = [0,0,0,0,1]
    if(not (table_main is None)):
        for y in range(len(table_main.web_rgbw_array)):
            for x in range(len(table_main.web_rgbw_array[y])):
                table_main.web_rgbw_array[y][x] = [0,0,0,0]


@socketio.on('mode_switch_event')
def handle_mode_switch(message):
    global table_main
    mode = message['mode']
    print('Mode switched to {}.'.format(mode))
    if(table_main is None):
        return
    table_main.switch_mode(mode)


@socketio.on('colorarray_show_event')
def tmp_test_show_reciever(message):
    random_list = [[[g,r,0,0] for r,g in [(random.randint(0,255),random.randint(0,255)) for _ in range(23)]] for _ in range(23)]
    for each in random_list:
        for each_pixel in each:
            random.shuffle(each_pixel)
    tmp_show(random_list)


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
    pass
    #print(stringMessage)
    print(stringMessage['data'])

def start_server(ip, debug=False):
    socketio.run(app, host=ip, port=5000, debug=debug)
    #socketio.run(app, host='127.0.0.1', port=5000, debug=True)

def start_server_with_table(ip: str, table_main_given):
    import Table_Event
    global table_main
    table_main = table_main_given
    start_server(ip)

if __name__ == "__main__":
    global table_main
    table_main = None
    start_server('127.0.0.1', debug=True)
    # start_server('192.168.178.30', debug=True)
    #app.run(debug=True,host='127.0.0.1', port=8080)

