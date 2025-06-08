from flask import Flask, request, jsonify
from youtube_transcript_api import YouTubeTranscriptApi
from dotenv import load_dotenv
import os
    
load_dotenv()
app = Flask(__name__)

@app.route('/')
def home():
  try:
    url = request.args.get('url')
    video_id = url.split('v=')[1][:11] 

    ytt_api = YouTubeTranscriptApi()
    fetched_transcript = ytt_api.fetch(video_id)

    # convert to raw data
    raw_data = fetched_transcript.to_raw_data()

    return jsonify(raw_data)
  except Exception as e:
    print(e)
    return "An exception occurred", 500
