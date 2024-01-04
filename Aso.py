from flask import Flask, request, jsonify
from flask_cors import CORS
from google_play_scraper import app as play_scraper_app, search

app = Flask(__name__)
CORS(app, origins="*")

@app.route('/search_app', methods=['POST'])
def app_search():
    data = request.get_json()
    app_name = data['data']['appname']

    res = search(
        app_name,
        lang="en",
        country="in",
        n_hits=3
    )
    
    return jsonify(res)

@app.route('/appdata', methods=['POST'])
def app_data():
    dat = request.get_json()
    app_id = dat['data']['app_id']
    
    result = play_scraper_app(
        app_id,
        lang="en",
        country="in"
    )

    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4040)
