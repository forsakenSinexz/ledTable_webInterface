from flask import Flask, render_template
from flask_socketio import SocketIO
import random


# venv\Scripts\activate

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secreto!'
socketio = SocketIO(app)


@app.route('/')
def hello_world():
    return render_template('index.html')


@app.route('/friends/<name>')
def friends(name="Who are you?"):
    return 'Hello my good friend ' + name

@socketio.on('pixel_colored_event')
def handle_pixel_colored(message):
    y = message['y']
    x = message['x']
    g = message['g']
    r = message['r']
    b = message['b']
    w = message['w']
    #TODO: insert into table python script!
    print('pixel [{},{}] was colored: [{},{},{},{}]'.format(y,x,r,g,b,w))

@socketio.on('array_clear_event')
def handle_array_clear(message):
    #TODO: insert into table python script!
    print('Pixel array was cleared.')

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

if __name__ == "__main__":
    #tmp_show([[[255,0,0], [0,0,0]], [[0,0,0], [255,0,0]]])
    socketio.run(app, host='127.0.0.1', port=5000, debug=True)
    #app.run(debug=True,host='127.0.0.1', port=8080)