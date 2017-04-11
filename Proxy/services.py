
API_KEY = "uAmXK3JoIec38JXQIaqFgtFBYpPBrmyj"
API_SECRET = "ZDlG-LT73qTXDVddQP5PHr7hPtj7rCSc"
FACESET_TOKEN = "afd14a284f2984ffab922c6996ef5f21"

import requests
import urlparse, urllib
import json
import os
import base64

base_dir = "/home/nikitha/Desktop/Sem6/SoftwareEngineering/Proxy/Test_Pictures/"

# for image in os.listdir(base_dir):
# 	file_path = base_dir+image
# 	print file_path

# # file_path = "/media/nikitha/OS/Users/Insp/Pictures/Camera/14238370_1148695528546477_157233438552777101_n.jpg"

# 	with open(file_path, "rb") as imageFile:
# 	    string = base64.b64encode(imageFile.read())

# 	# with open("/home/smeghanaaparna/Downloads/Meghana.jpg", "rb") as imageFile:
# 	#   f = imageFile.read()
# 	#   b = bytearray(f)

# 	# with open("temp","wb") as writeFile:
# 	# 	writeFile.write(b)

# 	detect_url = "https://api-us.faceplusplus.com/facepp/v3/detect"

# 	params = {}

# 	params["api_key"] = API_KEY
# 	params["api_secret"] = API_SECRET
# 	params["image_base64"] = string
# 	# params["image_url"] = path2url(file_path)
# 	# params["image_file"] = b


# 	# print params

# 	response = requests.post(detect_url,data=params)

# 	# print response.json()["faces"]

# 	tokens = []

# 	for face in response.json()["faces"]:
# 		 tokens.append(face["face_token"])


		

# 	addface_url = "https://api-us.faceplusplus.com/facepp/v3/faceset/addface"

# 	addface_params = {}
# 	addface_params["api_key"] = API_KEY
# 	addface_params["api_secret"] = API_SECRET
# 	addface_params["face_tokens"] = tokens
# 	addface_params["faceset_token"] = FACESET_TOKEN

# 	print addface_params
# 	addface_response = requests.post(addface_url, data=addface_params)


# 	print addface_response
# 	for item in addface_response:
# 		print "inside"
# 		print item

# for image in os.listdir(base_dir):
# file_path = base_dir+"megsow.jpg"
# # print image
# with open(file_path, "rb") as imageFile:
# 	string = base64.b64encode(imageFile.read())

# search_url = "https://api-us.faceplusplus.com/facepp/v3/search"

# search_params = {}
# search_params["api_key"] = API_KEY
# search_params["api_secret"] = API_SECRET
# search_params["image_base64"] = string
# search_params["faceset_token"] = FACESET_TOKEN



# search_response = requests.post(search_url, data=search_params)

# facetokens = []
# for face in search_response.json()["faces"]:
# 	facetokens.append(face["face_token"])

# search_params.pop("image_base64")

# for token in facetokens:
# 	search_params["face_token"]=token
# 	search_response = requests.post(search_url, data=search_params)
# 	print search_response.json()["results"]	


def createFaceset():
	pass


def Training(file_path):
	with open(file_path, "rb") as imageFile:
	    string = base64.b64encode(imageFile.read())

	detect_url = "https://api-us.faceplusplus.com/facepp/v3/detect"

	params = {}
	params["api_key"] = API_KEY
	params["api_secret"] = API_SECRET
	params["image_base64"] = string

	response = requests.post(detect_url,data=params)

	tokens = []
	for face in response.json()["faces"]:
		 tokens.append(face["face_token"])

	addface_url = "https://api-us.faceplusplus.com/facepp/v3/faceset/addface"

	addface_params = {}
	addface_params["api_key"] = API_KEY
	addface_params["api_secret"] = API_SECRET
	addface_params["face_tokens"] = tokens
	addface_params["faceset_token"] = FACESET_TOKEN

	# print addface_params
	addface_response = requests.post(addface_url, data=addface_params)

	# print addface_response
	# for item in addface_response:
		# print "inside"
		# print item

def Testing(file_path):
	with open(file_path, "rb") as imageFile:
		string = base64.b64encode(imageFile.read())

	search_url = "https://api-us.faceplusplus.com/facepp/v3/search"

	search_params = {}
	search_params["api_key"] = API_KEY
	search_params["api_secret"] = API_SECRET
	search_params["image_base64"] = string
	search_params["faceset_token"] = FACESET_TOKEN

	search_response = requests.post(search_url, data=search_params)

	facetokens = []
	for face in search_response.json()["faces"]:
		facetokens.append(face["face_token"])

	search_params.pop("image_base64")

	for token in facetokens:
		search_params["face_token"]=token
		search_response = requests.post(search_url, data=search_params)
		print search_response.json()["results"]	