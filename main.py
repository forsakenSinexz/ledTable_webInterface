from flask import Flask, render_template
from flask_socketio import SocketIO


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
def handle_pixel_colored(message):
    #TODO: insert into table python script!
    print('Pixel array was cleared.')


@socketio.on('testmessage')
def handle_testmessage(stringMessage):
    pass
    #print(stringMessage)
    print(stringMessage['data'])

if __name__ == "__main__":
    socketio.run(app, host='127.0.0.1', port=5000, debug=True)
    #app.run(debug=True,host='127.0.0.1', port=8080)