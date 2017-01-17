'''
Purpose: Server responsible for routing

Author: Md. Tanvir Islam

Command to execute: python app.py  
'''

from flask import Flask
from flask import render_template
from flask import json
from flask import request
import random
import sys

app = Flask(__name__)

print("Server is live...", file = sys.stderr)

users = []


@app.route("/")
def index():
	return render_template("index.html"), 200

@app.route("/generate", methods = ["POST"])
def generate():
	this_user = {} # init user
	send_data = {} # data to be sent
	post_obj = request.json	
	rc = dimension(post_obj)

	send_data["x"] = rc["x"]
	send_data["y"] = rc["y"]
	send_data["speed"] = 20

	this_user["name"] = post_obj["name"] # sets the user's name
	this_user["speed"] = send_data["speed"] # sets the user's speed
	this_user["size"] = 0
	users.append(this_user) # append it to the list of users


	return json.dumps(send_data), 200

# sends the x and y coordinates to the client
@app.route("/regenerate", methods = ["POST"])
def regenerate():
	send_data = {}
	post_obj = request.json	
	rc = dimension(post_obj)

	send_data["x"] = rc["x"]
	send_data["y"] = rc["y"]
	
	return json.dumps(send_data), 200
# sends the size of the snake to the server
@app.route("/size", methods = ["POST"])
def size():
	temp = {}
	obj_obj = request.json
	for i in range(len(users)):
		if obj_obj["name"] == users[i]["name"]:
			temp = users[i]

	users[users.index(temp)]["size"] += 1

	send_data = {}
	send_data["size"] = users[users.index(temp)]["size"]

	return json.dumps(send_data), 200


'''
	Function: dimensions
	 Purpose: generates a random x and y coordinate within a limit to send it the client 		 
		  in: obj
'''

def dimension(obj):
	rc = {}
	width_min = int(obj["width_min"])
	width_max = int(obj["width_max"])
	height_min = int(obj["height_min"])
	height_max = int(obj["height_max"])

	x = random_number(width_min, width_max)
	y = random_number(height_min, height_max)

	rc["x"] = x
	rc["y"] = y

	return rc

'''
	Function: random_number
	 Purpose: generates a random number between a particular range		 
		  in: min, max
'''

def random_number(min, max):
	return random.randint(min, max)


if __name__ == "__main__":
	app.run(host = "localhost", port = 2406, debug = True)