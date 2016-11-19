from flask import Flask, send_from_directory, send_file
app = Flask(__name__)

@app.route('/')
def hello_world():
    return send_file('client/index.html')

@app.route('/<path:path>')
def send_static(path):
    return send_from_directory('client', path)
