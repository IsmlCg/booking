from flask import Flask, Response, jsonify, make_response, redirect, render_template, request, send_from_directory, url_for
# generate jwt token import
import jwt
from time import time
import os
import asyncio
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import datetime
app = Flask(__name__, static_folder='booking')
cred = credentials.Certificate('./booking/serviceAccountKey.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://spotify-d5016-default-rtdb.europe-west1.firebasedatabase.app'
})
# 
jwt_token = "None"
def render_set( url ):
    with open( url ) as f:
        return Response(f.read(), mimetype="text/html") 
def generate_jwt_token(username):
    seconds_now = time()
    jwt_secret = os.environ.get('JWT_SECRET', 'izzy')
    token = {
        "username": username,
        "iat": seconds_now -1,
        "exp": seconds_now + 7200 #30000
    }
    return jwt.encode( token,jwt_secret, algorithm="HS256" )
def ok_jwt_token(token):
    try:
        jwt_secret = os.environ.get('JWT_SECRET', 'izzy')
        decoded_token = jwt.decode(token, jwt_secret, algorithms=['HS256'])
        return True, decoded_token
    except jwt.ExpiredSignatureError:
        return False, "Token has expired."
    except jwt.InvalidTokenError:
        return False, "Invalid token."

@app.route('/')
def home():
    return render_set( './booking/index.html' )   
@app.route('/main')
def main():
    return render_set( './booking/html/main.html' )  

@app.route('/payment')
def payment():
    return render_set( './booking/html/payment.html' )   
@app.route('/appointmentreminders')
def appointmentreminders():
    return render_set( './booking/html/appointmentreminders.html' )   

@app.route('/admin')
def admin():
    return render_set( './booking/html/admin.html' )   
@app.route('/patientappointmentschedule')
def patientappointmentschedule():
    return render_set( './booking/html/patientappointmentschedule.html' )   
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    # Validate username and password (implement your own validation logic)
    users_ref = db.reference( 'users' )
    # Query users where username and password are equal
    query = users_ref.order_by_child('username').equal_to( username ).get()
    # Filter the query results by password
    results = [ user for user in query.values() if user.get('password') == password ]
    
    if len(results) != 0:
        token = generate_jwt_token( username )
        return jsonify({"token": token})
    else:
        return jsonify({"error": "Invalid credentials"}), 401
    
@app.route('/signup', methods=['GET', 'POST'])
def sign_up():
        if request.method == 'POST':
            # Get a reference to the root of the database
            users_ref = db.reference( 'users' )
            fullname = request.form.get('fullname')
            username = request.form.get('username')
            password = request.form.get('password')
            
            # Query users where username and password are equal
            query = users_ref.order_by_child('username').equal_to( username ).get()
            if len(query) == 0:
                user_data = {
                    'fullname' : fullname,
                    'username' : username,
                    'password' : password
                }
                new_user = users_ref.push(user_data)
                return render_set( './booking/index.html' ) 
            else:
                sms = "Username exist."
                with open('./booking/html/signup.html') as f:
                    return Response(f.read().replace('{{ sms }}', sms), mimetype='text/html')
        elif request.method == 'GET':
            return render_set( './booking/html/signup.html' ) 


@app.route('/findsongs', methods=['POST'])
def get_find_sond():
    
    # return jwt_token
    global jwt_token
    is_valid, decoded = ok_jwt_token(jwt_token)
    if is_valid :
        # Get the username from the request cookies
        username = request.cookies.get('username')
        if request.method == 'POST' and username:
            # Get a reference to the root of the database
            playlist_ref = db.reference( 'songs' )   
            all_playlists = playlist_ref.get()
            find_song = request.json['find_song'].lower()
            data =[]
            for  value in all_playlists: 
                name = value['name'].lower()
                description = value['description'].lower()
                if find_song in name:
                    data.append( value )
                elif find_song in description:
                    data.append( value )
            return jsonify( data )
        return None
    else:
        return jsonify({'error': 'Token has expired'}), 401

@app.route('/booking/css/<path:filename>')
def serve_css(filename):
    return send_from_directory('css', filename)

@app.route('/booking/js/<path:filename>')
def serve_js(filename):
    return send_from_directory('js', filename)

@app.route('/booking/mp3/<path:filename>')
def serve_mp3(filename):
    return send_from_directory('mp3', filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0')