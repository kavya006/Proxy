
API_KEY = "uAmXK3JoIec38JXQIaqFgtFBYpPBrmyj"
API_SECRET = "ZDlG-LT73qTXDVddQP5PHr7hPtj7rCSc"
FACESET_TOKEN = "cc3bff94c847111e6d3cf86819394541"

import requests
import urlparse, urllib
import json
import os
import base64

base_dir = "/home/nikitha/Documents/Proxy/Client/app/images/Test_Pictures/"
Train_dir = "/home/nikitha/Documents/Proxy/Client/app/images/Training_Pictures/"

def createFaceset():
	create_url = "https://api-us.faceplusplus.com/facepp/v3/faceset/create"

	create_params = {}
	create_params["api_key"] = API_KEY
	create_params["api_secret"] = API_SECRET

	create_response = requests.post(create_url,data=create_params)
	# print create_response

	FACESET_TOKEN = create_response.json()["faceset_token"]
	print FACESET_TOKEN


def Training(file_path):
	with open(Train_dir + file_path, "rb") as imageFile:
	    string = base64.b64encode(imageFile.read())

	detect_url = "https://api-us.faceplusplus.com/facepp/v3/detect"

	params = {}
	params["api_key"] = API_KEY
	params["api_secret"] = API_SECRET
	params["image_base64"] = string

	response = requests.post(detect_url,data=params)
	print len(response.json()["faces"])
	tokens = []
	for face in response.json()["faces"]:
		 tokens.append(face["face_token"])

	addface_url = "https://api-us.faceplusplus.com/facepp/v3/faceset/addface"

	addface_params = {}
	addface_params["api_key"] = API_KEY
	addface_params["api_secret"] = API_SECRET
	addface_params["face_tokens"] = tokens
	addface_params["faceset_token"] = FACESET_TOKEN
	print "add"
	addface_response = requests.post(addface_url, data=addface_params)

	print addface_response.json()
	return tokens[0]


def Testing(file_path):
	print (base_dir+file_path)
	with open(base_dir+file_path, "rb") as imageFile:
		string = base64.b64encode(imageFile.read())

	search_url = "https://api-us.faceplusplus.com/facepp/v3/search"

	search_params = {}
	search_params["api_key"] = API_KEY
	search_params["api_secret"] = API_SECRET
	search_params["image_base64"] = string
	search_params["faceset_token"] = FACESET_TOKEN

	print "here"
	search_response = requests.post(search_url, data=search_params)

	print search_response.json()
	facetokens = []
	for face in search_response.json()["faces"]:
		facetokens.append(face["face_token"])

	search_params.pop("image_base64")

	matchedtokens = []
	for token in facetokens:
		search_params["face_token"]=token
		search_response = requests.post(search_url, data=search_params)
		result = search_response.json()["results"][0]
		if(result["confidence"]>70):
			matchedtokens.append(result["face_token"])
	return matchedtokens



# createFaceset();
# 
# TrainingPicsDir = "/home/nikitha/Desktop/Sem6/SoftwareEngineering/Proxy/Proxy_Pictures/"
# for name in os.listdir(TrainingPicsDir):
# 	# file_path = TrainingPicsDir+name
# 	tokens = Training(name)
# 	print name
# 	print tokens
# # 	