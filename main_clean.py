from flask import Flask, render_template
from flask_socketio import SocketIO
import random

# USE THIS MAIN CLASS FOR TEST PURPOSES IN DEBUG MODE!
# ####################################################

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secreto!'
socketio = SocketIO(app, logger=False, engineio_logger=False)

@app.route('/')
def hello_world():
    return render_template('index.html')

@socketio.on('connect')
def connect():
    socketio.emit('sub_page', get_sub_page('snowflake_v2'), broadcast=False)

@socketio.on('analyzer_volume_change')
def change_analyzer_volume(value):
    print("Analyzer volume change to {}".format(value))
    socketio.emit('analyzer_volume_update', value, broadcast=True, include_self=False)

@socketio.on('request_analyzer_volume')
def answer_analyzer_volume_request():
    # global table_main
    print('got analyzer volume request')
    socketio.emit('analyzer_volume_update', 20)

@socketio.on('load_sub_page')
def load_sub_page(page_name): # page_name : str
    socketio.emit('sub_page', get_sub_page(page_name), broadcast=False)

def get_sub_page(page_name):
    return render_template('subPages/{}.html'.format(page_name))

@socketio.on('color_mode_switch')
def color_mode_switch(cmode):
    socketio.emit('color_mode_update', cmode, broadcast=True, include_self=False)

def load_color_component(color_objects):
    socketio.emit(
        'color_components_update',
        {o.mode : {i : cmode for i,cmode in enumerate(o.cmodes)} for o in color_objects}, 
        broadcast = True)

@socketio.on('test')
def test_test():
    socketio.emit(
        'component_load',
        render_template(
            'components/color_object.html',
            mode_names = ['bastard','batschak']
        ),
        broadcast = True)



def start_server(ip, debug=False):
    socketio.run(app, host=ip, port=5000, debug=debug)
    #socketio.run(app, host='127.0.0.1', port=5000, debug=True)

def start_server_with_table(ip: str, table_main_given):
    global table_main
    table_main = table_main_given
    start_server(ip)

if __name__ == "__main__":
    # start_server('127.0.0.1', debug=True)
    start_server('192.168.178.30', debug=True)
    #app.run(debug=True,host='127.0.0.1', port=8080)

