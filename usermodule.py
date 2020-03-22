from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def hello_world():
    return render_template('index.html')


@app.route('/friends/<name>')
def friends(name="Who are you?"):
    return 'Hello my good friend ' + name

if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0', port=8080)