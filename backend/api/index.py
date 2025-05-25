from flask import Flask, request, jsonify
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.proxies import WebshareProxyConfig
from dotenv import load_dotenv
import os
    
load_dotenv()
app = Flask(__name__)
proxy_username = os.getenv('PROXY_USERNAME')
proxy_password = os.getenv('PROXY_PASSWORD')

@app.route('/')
def home():
  url = request.args.get('url')
  video_id = url.split('v=')[1][:11] 

  ytt_api = YouTubeTranscriptApi(
    proxy_config=WebshareProxyConfig(
        proxy_username=proxy_username,
        proxy_password=proxy_password,
    )
)
  fetched_transcript = ytt_api.fetch(video_id)

  # convert to raw data
  raw_data = fetched_transcript.to_raw_data()

  return jsonify(raw_data)