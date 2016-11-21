from flask import Flask, send_from_directory, send_file, request, json
from SecretSanta import secretSantaCycle
app = Flask(__name__)

@app.route('/')
def hello_world():
    return send_file('client/index.html')

@app.route('/api/v1/ss', methods=['POST'])
def secret_santa():
    payload = json.loads(request.data)
    secretSantaCycle(payload)
    return 'ok', 200

@app.route('/<path:path>')
def send_static(path):
    return send_from_directory('client', path)

