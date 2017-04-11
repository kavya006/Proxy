from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ProxyApp.models import *
from ProxyApp.serializers import *
import ast
from services import *
from django.http import QueryDict
import time
import datetime
import operator

def insertCurrentLog(userid,logString):
	ts = time.time()
	st = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')
	temp={}
	temp["activities"] = logString
	temp["userid"] = userid
	temp["timeStamp"] = st
	qtemp = QueryDict('',mutable=True)
	qtemp.update(temp)
	serializer = LogsSerializer(data=qtemp)
	if serializer.is_valid():
		serializer.save()

# Create your views here.
@api_view(['GET'])
def giveCourseDetails(request):
	courseID = None
	if request.GET.get('courseID',False):
		courseID = request.GET['courseID']
	if courseID == None:
		return Response(status=status.HTTP_400_BAD_REQUEST)
	try:
		courseSession = CourseDB.objects.filter(courseID=courseID)
	except CourseDB.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)

	serializer = CourseSerializer(courseSession,many=True)
	result = {}
	result["courseID"] = serializer.data[0]["courseID"];
	result["name"] = serializer.data[0]["name"];
	result["userid"] = serializer.data[0]["userid"]
	try:
		personSession = PersonDB.objects.filter(userid=serializer.data[0]["userid"])
	except PersonDB.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)

	person_serializer = PersonSerializer(personSession,many=True)
	result["emailID"] = person_serializer.data[0]["emailID"];
	#print serializer.data
	return Response(result)


@api_view(['POST'])
def saveCourseDetails(request):
	serializer = CourseSerializer(data=request.data)
	courseID = request.data.get("courseID",None)
	userid = request.data.get("userid",None)
	name = request.data.get("name",None)
	try:
		if CourseDB.objects.filter(courseID=courseID).exists():
			CourseDB.objects.filter(courseID=courseID).delete()
	except CourseDB.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)

	if serializer.is_valid():
		serializer.save()
		Logstring = "Course " + courseID +" ("+name+") has been added"
		insertCurrentLog(userid,Logstring)

		return Response(serializer.data, status=status.HTTP_201_CREATED)

	return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def deleteCourseDetails(request):
	courseID = request.data.get("courseID",None)
	userid = request.data.get("userid",None)
	print request.data
	try:
		courseSession = CourseDB.objects.filter(courseID=courseID)
		if courseSession.exists():
			course_serializer = CourseSerializer(courseSession,many=True)
			name = course_serializer.data[0]["name"]
			CourseDB.objects.filter(courseID=courseID).delete()
			if EnrollmentDB.objects.filter(courseID=courseID).exists():
				EnrollmentDB.objects.filter(courseID=courseID).delete()
			if AttendanceDB.objects.filter(courseID=courseID).exists():
				AttendanceDB.objects.filter(courseID=courseID).delete()
			Logstring = "Course " + courseID +" ("+name+") has been deleted"
			insertCurrentLog(userid,Logstring)
		else:
			print "Does not exist"
	except CourseDB.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)
	
	return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def getTrainingPicturesList(request):
	studentID = None
	if request.GET.get('studentID',False):
		studentID = request.GET['studentID']
	if studentID == None:
		return Response(status=status.HTTP_400_BAD_REQUEST)
	try:
		TrainingDataSession = TrainDB.objects.filter(studentID=studentID)
	except TrainDB.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)

	serializer = TrainingSerializer(TrainingDataSession,many=True)
	return Response(serializer.data)

@api_view(['POST'])
def saveTrainingPicturesList(request):
	serializer = TrainingSerializer(data=request.data)
	print request.data
	studentID = request.data.get("studentID",None)
	picturesList = request.data.get("picturesList",None)

	# print serializer.validated_data

	try:
		if TrainDB.objects.filter(studentID=studentID).exists():
			TrainDB.objects.filter(studentID=studentID).delete()
	except TrainDB.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)

	if serializer.is_valid():
		serializer.save()
		images = picturesList.split(',')
		for image in images:
			face_token=Training(image)
			faceToken = StudentFaceTokenDB(face_token=face_token,studentID=studentID)
			faceToken.save()
		return Response(serializer.data, status=status.HTTP_201_CREATED)

	return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def getPicturesList(request):
	date = None
	courseID = None
	if request.GET.get('date',False):
		date = request.GET['date']
	if request.GET.get('courseID',False):
		courseID = request.GET['courseID']
	if date == None or courseID == None:
		return Response(status=status.HTTP_400_BAD_REQUEST)
	try:
		attendanceSession = AttendanceDB.objects.filter(date=date,courseID=courseID)
	except AttendanceDB.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)

	serializer = AttendanceSerializer(attendanceSession,many=True)
	if len(serializer.data) != 0:
		if serializer.data[0]["picturesList"] == "NA":
			return Response("")
		return Response(serializer.data[0]["picturesList"])
	return Response("")

@api_view(['POST'])
def savePicturesList(request):
	serializer = AttendanceSerializer(data=request.data)
	print request.data
	date = request.data.get("date",None)
	courseID = request.data.get("courseID",None)
	picturesList = request.data.get("picturesList",None)
	tempattendance = None
	print picturesList
	try:
		alreadypresentsession = AttendanceDB.objects.filter(date=date,courseID=courseID)
		if alreadypresentsession.exists():
			alreadypresentserializer = AttendanceSerializer(alreadypresentsession,many=True)
			tempattendance = alreadypresentserializer.data[0]["attendanceList"]
			AttendanceDB.objects.filter(date=date,courseID=courseID).delete()
	except AttendanceDB.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)
	if serializer.is_valid():
		serializer.save()
		#computing attendance
		attendanceList = ""
		temp_dict = {}
		images = picturesList.split(',')
		print images
		for picture in images:
			matchedtokens = Testing(picture)
			for token in matchedtokens:
				print matchedtokens
				studentID = StudentFaceTokenDB.objects.filter(face_token=token)
				if not studentID.exists():
					print "not possible"
				else:
					studentSession = EnrollmentDB.objects.filter(userid=studentID[0].studentID,courseID=courseID)
					if studentSession.exists():
						if not studentID[0].studentID in temp_dict:
							studentSerializer = EnrollmentSerializer(studentSession,many=True)
							studenttemp = {}
							studenttemp["userid"] = studentSerializer.data[0]["userid"]
							studenttemp["courseID"] = studentSerializer.data[0]["courseID"]
							if tempattendance!=None and tempattendance.find(studentID[0].studentID) != -1:
								studenttemp["cummulativeAttendance"] = studentSerializer.data[0]["cummulativeAttendance"]
							else:
								studenttemp["cummulativeAttendance"] = studentSerializer.data[0]["cummulativeAttendance"]+1
							EnrollmentDB.objects.filter(userid=studentID[0].studentID,courseID=courseID).delete()
							qstudentemp = QueryDict('',mutable=True)
							qstudentemp.update(studenttemp)
							studentSerializer = EnrollmentSerializer(data=qstudentemp)
							if studentSerializer.is_valid():
								studentSerializer.save()
							attendanceList += studentID[0].studentID + ","
		if len(attendanceList)!=0 and attendanceList[-1]==',':
			attendanceList = attendanceList[:-1]
		currAttendance = AttendanceDB.objects.get(date=date,courseID=courseID)
		currAttendance.attendanceList = attendanceList
		currAttendance.save()
		useridSession = CourseDB.objects.filter(courseID=courseID)
		if useridSession.exists():
			useridSerializer = CourseSerializer(useridSession,many=True)
			userid = useridSerializer.data[0]["userid"]
			Logstring = "Pictures for "+date+" for course "+courseID+" have been uploaded"
			insertCurrentLog(userid,Logstring)
		return Response(serializer.data, status=status.HTTP_201_CREATED)
	return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def getPersonDetails(request):
	userid = None
	if request.GET.get('userid',False):
		userid = request.GET['userid']
	if userid == None:
		return Response(status=status.HTTP_400_BAD_REQUEST)
	try:
		PersonSession = PersonDB.objects.filter(userid=userid)
	except PersonDB.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)

	serializer = PersonSerializer(PersonSession,many=True)
	return Response(serializer.data)

@api_view(['POST'])
def savePersonDetails(request):
	serializer = PersonSerializer(data=request.data)
	userid = request.data.get("userid",None)
	try:
		if PersonDB.objects.filter(userid=userid).exists():
			PersonDB.objects.filter(userid=userid).delete()
	except PersonDB.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)

	if serializer.is_valid():
		serializer.save()
		return Response(serializer.data, status=status.HTTP_201_CREATED)

	return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def getAttendance(request):
	date = None
	courseID = None
	if request.GET.get('date',False):
		date = request.GET['date']
	if request.GET.get('courseID',False):
		courseID = request.GET['courseID']
	if date == None or courseID == None:
		return Response(status=status.HTTP_400_BAD_REQUEST)
	try:
		attendanceSession = AttendanceDB.objects.filter(date=date,courseID=courseID)
	except AttendanceDB.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)

	serializer = AttendanceSerializer(attendanceSession,many=True)
	full_dict = {}
	studentSession = EnrollmentDB.objects.filter(courseID=courseID);
	studentserializer = EnrollmentSerializer(studentSession,many=True)
	Allstudents = studentserializer.data
	if(len(serializer.data) != 0):
		presentStudents = []
		if serializer.data[0]["attendanceList"]!=None:
			presentStudents = serializer.data[0]["attendanceList"].split(',')
		print presentStudents	
	for student in Allstudents:
		full_dict[student["userid"]]="0"
	if(len(serializer.data) != 0):
		if len(presentStudents)!=0:
			if presentStudents[0] != "NA":
				for student in presentStudents:
					if student != '':
						full_dict[student]="1"	
	return Response(full_dict)

@api_view(['POST'])
def saveAttendance(request):
	serializer = AttendanceSerializer(data=request.data)
	date = request.data.get("date",None)
	courseID = request.data.get("courseID",None)
	temp = {}
	temp["date"] = date
	temp["courseID"] = courseID
	temp["attendanceList"] = request.data.get("attendanceList",None)
	temp["picturesList"] = request.data.get("picturesList")
	try:
		if AttendanceDB.objects.filter(date=date,courseID=courseID).exists():
			temparraysession = AttendanceDB.objects.filter(date=date,courseID=courseID)
			temparrayserializer = AttendanceSerializer(temparraysession,many=True)
			temp["picturesList"] = temparrayserializer.data[0]["picturesList"]
			tempattendanceList = temparrayserializer.data[0]["attendanceList"]
			if tempattendanceList!="NA":
				tempattendanceListarray = tempattendanceList.split(',')
				for attendance in tempattendanceListarray:
					studentSession = EnrollmentDB.objects.get(userid=attendance,courseID=courseID)
					studentSerializer = EnrollmentSerializer(studentSession)
					studenttemp = {}
					studenttemp["userid"] = studentSerializer.data["userid"]
					studenttemp["courseID"] = studentSerializer.data["courseID"]
					studenttemp["cummulativeAttendance"] = studentSerializer.data["cummulativeAttendance"]-1
					EnrollmentDB.objects.filter(userid=attendance,courseID=courseID).delete()
					qstudentemp = QueryDict('',mutable=True)
					qstudentemp.update(studenttemp)
					studentSerializer = EnrollmentSerializer(data=qstudentemp)
					if studentSerializer.is_valid():
						studentSerializer.save()
 			AttendanceDB.objects.filter(date=date,courseID=courseID).delete()
	except AttendanceDB.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)

	qtemp = QueryDict('', mutable=True)
	qtemp.update(temp)
	newserializer = AttendanceSerializer(data=qtemp)
	if newserializer.is_valid():
		newserializer.save()
		tempattendanceList = newserializer.data["attendanceList"]
		if tempattendanceList!="NA":
			tempattendanceListarray = tempattendanceList.split(',')
			for attendance in tempattendanceListarray:
				studentSession = EnrollmentDB.objects.get(userid=attendance,courseID=courseID)
				studentSerializer = EnrollmentSerializer(studentSession)
				studenttemp = {}
				studenttemp["userid"] = studentSerializer.data["userid"]
				studenttemp["courseID"] = studentSerializer.data["courseID"]
				studenttemp["cummulativeAttendance"] = studentSerializer.data["cummulativeAttendance"]+1
				EnrollmentDB.objects.filter(userid=attendance,courseID=courseID).delete()
				qstudentemp = QueryDict('',mutable=True)
				qstudentemp.update(studenttemp)
				studentSerializer = EnrollmentSerializer(data=qstudentemp)
				if studentSerializer.is_valid():
					studentSerializer.save()
					useridSession = CourseDB.objects.filter(courseID=courseID)
					enrollmentSession = EnrollmentDB.objects.filter(courseID=courseID)
					if useridSession.exists():
						useridSerializer = CourseSerializer(useridSession,many=True)
						userid = useridSerializer.data[0]["userid"]
						Logstring = "Attendance for "+date+" for course "+courseID+" has been updated"
						insertCurrentLog(userid,Logstring)
					if enrollmentSession.exists():
						enrollmentserializer = EnrollmentSerializer(enrollmentSession,many=True)
						for student in enrollmentserializer.data:
							userid = student["userid"]
							Logstring = "Attendance for "+date+" for course "+courseID+" has been updated"
							insertCurrentLog(userid,Logstring)

		return Response(newserializer.data, status=status.HTTP_201_CREATED)
	return Response(newserializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def getLogs(request):
	userid = None
	if request.GET.get('userid',False):
		userid = request.GET['userid']
	if userid == None:
		return Response(status=status.HTTP_400_BAD_REQUEST)
	try:
		logSession = LogsDB.objects.filter(userid=userid).order_by('-id')
	except LogsDB.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)
	serializer = LogsSerializer(logSession,many=True)
	# print serializer.data
	return Response(serializer.data)

@api_view(['POST'])
def saveLogs(request):
	serializer = LogsSerializer(data=request.data)
	# print request.data
	timeStamp = request.data.get("timeStamp",None)
	userid = request.data.get("userid",None)
	activities = request.data.get("activities",None)

	try:
		if LogsDB.objects.filter(timeStamp=timeStamp,userid=userid).exists():
			LogsDB.objects.filter(timeStamp=timeStamp,userid=userid).delete()
		return Response(status=status.HTTP_404_NOT_FOUND)
	except LogsDB.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)
	if serializer.is_valid():
		serializer.save()
		return Response(serializer.data, status=status.HTTP_201_CREATED)

	return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def getCourses(request):
	userid = None
	if request.GET.get('userid',False):
		userid = request.GET['userid']
		admin = request.GET['admin']
	if userid == None:
		return Response(status=status.HTTP_400_BAD_REQUEST)
	if admin == "admin":
		try:
			courseSession = CourseDB.objects.filter(userid=userid)
		except CourseDB.DoesNotExist:
			return Response(status=status.HTTP_404_NOT_FOUND)
		course_serializer = CourseSerializer(courseSession,many=True)
		coursesList = []
		for course in course_serializer.data:
			temp = {}
			try :
				personSession = PersonDB.objects.get(userid=course["userid"])
			except PersonDB.DoesNotExist:
				return Response(status=status.HTTP_404_NOT_FOUND)
			person_serializer = PersonSerializer(personSession)
			temp["courseID"] = course["courseID"]
			temp["courseName"] = course["name"]
			temp["emailID"] = person_serializer.data["emailID"]
			coursesList.append(temp)
		return Response(coursesList)
	elif admin == "student":
		try:
			enrollmentSession = EnrollmentDB.objects.filter(userid=userid)
		except EnrollmentDB.DoesNotExist:
			return Response(status=status.HTTP_404_NOT_FOUND)
		serializer = EnrollmentSerializer(enrollmentSession,many=True)
		coursesList = []
		for item in serializer.data:
			temp = {}
			try:
				courseSession = CourseDB.objects.get(courseID=item["courseID"])
			except CourseDB.DoesNotExist:
				return Response(status=status.HTTP_404_NOT_FOUND)
			
			course_serializer = CourseSerializer(courseSession)
			try:
				personSession = PersonDB.objects.get(userid=course_serializer.data["userid"])
			except PersonDB.DoesNotExist:
				return Response(status=status.HTTP_404_NOT_FOUND)
			person_serializer = PersonSerializer(personSession)
			temp["courseID"] = item["courseID"]
			temp["courseName"] = course_serializer.data["name"]
			temp["emailID"] = person_serializer.data["emailID"]
			coursesList.append(temp)
			print temp["courseID"]
		return Response(coursesList)


@api_view(['GET'])
def getCummulativeAttendance(request):
	userid = None
	courseID = None
	if request.GET.get('userid',False):
		userid = request.GET['userid']
	if request.GET.get('courseID',False):
		courseID = request.GET['courseID']
	# print userid, courseID
	if userid == None or courseID==None:
		return Response(status=status.HTTP_400_BAD_REQUEST)
	try:
		getCummulativeAttendanceSession = EnrollmentDB.objects.filter(userid=userid,courseID=courseID)
	except EnrollmentDB.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)

	getCummulativeAttendanceSerializer = EnrollmentSerializer(getCummulativeAttendanceSession,many=True)
	numOfDaysPresent = getCummulativeAttendanceSerializer.data[0]["cummulativeAttendance"]

	try:
		getTotalDaysSession = AttendanceDB.objects.filter(courseID=courseID)
	except AttendanceDB.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)

	getTotalDaysSerializer = AttendanceSerializer(getTotalDaysSession,many=True)
	totalNumDays = len(getTotalDaysSerializer.data)
	if totalNumDays == 0:
		attendancePercentage = 0
	else:
		attendancePercentage = (float(numOfDaysPresent)/totalNumDays)*100
	# print numOfDaysPresent, totalNumDays
	temp_dict = {}
	temp_dict["numOfDaysPresent"] = numOfDaysPresent
	temp_dict["numOfDaysAbsent"] = totalNumDays - numOfDaysPresent
	temp_dict["totalNumDays"] = totalNumDays
	temp_dict["attendancePercentage"] = float("{0:.2f}".format(attendancePercentage))
	return Response(temp_dict)



@api_view(['POST'])
def enroll(request):
	serializer = EnrollmentSerializer(data=request.data)
	print request.data
	userid = request.data.get("userid",None)
	courseID = request.data.get("courseID",None)

	if not PersonDB.objects.filter(userid=userid).exists():
		return Response("Student can't be enrolled",status=status.HTTP_404_NOT_FOUND)

	try:
		if EnrollmentDB.objects.filter(userid=userid,courseID=courseID).exists():
			return Response("Student already enrolled",status=status.HTTP_400_BAD_REQUEST)
	except EnrollmentDB.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)
	if serializer.is_valid():
		serializer.save()
		useridSession = CourseDB.objects.filter(courseID=courseID)
		if useridSession.exists():
			useridSerializer = CourseSerializer(useridSession,many=True)
			useridAdmin = useridSerializer.data[0]["userid"]
			Logstring = userid + " has been enrolled for course " + courseID
			insertCurrentLog(useridAdmin,Logstring)
		Logstring = "You have been enrolled for course " + courseID
		insertCurrentLog(userid,Logstring)
		return Response(serializer.data, status=status.HTTP_201_CREATED)
	return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def unenroll(request):
	courseID = request.data.get("courseID",None)
	userid = request.data.get("userid",None)
	print request.data
	if not PersonDB.objects.filter(userid=userid).exists():
		return Response("Student can't be unenrolled",status=status.HTTP_404_NOT_FOUND)
	try:
		if EnrollmentDB.objects.filter(courseID=courseID,userid=userid).exists():
			EnrollmentDB.objects.filter(courseID=courseID,userid=userid).delete()
			useridSession = CourseDB.objects.filter(courseID=courseID)
			if useridSession.exists():
				useridSerializer = CourseSerializer(useridSession,many=True)
				useridAdmin = useridSerializer.data[0]["userid"]
				Logstring = userid + " has been unenrolled from course " + courseID
				insertCurrentLog(useridAdmin,Logstring)
			Logstring = "You have been unenrolled from course " + courseID
			insertCurrentLog(userid,Logstring)
		else:
			return Response("Student is not enrolled in the course",status=HTTP_400_BAD_REQUEST)
	except EnrollmentDB.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)
	
	return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def getStudentFaceToken(request):
	face_token = None
	if request.GET.get('face_token',False):
		face_token = request.GET['face_token']
	if face_token == None:
		return Response(status=status.HTTP_400_BAD_REQUEST)
	try:
		StudentFaceTokenSession = StudentFaceTokenDB.objects.filter(face_token=face_token)
	except StudentFaceTokenDB.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)

	serializer = StudentFaceTokenSerializer(StudentFaceTokenSession,many=True)
	return Response(serializer.data)

@api_view(['POST'])
def saveStudentFaceToken(request):
	serializer = StudentFaceTokenSerializer(data=request.data)
	print request.data
	face_token = request.data.get("face_token",None)
	studentID = request.data.get("studentID",None)

	if not PersonDB.objects.filter(userid=studentID).exists():
		return Response("Student does not exist",status=status.HTTP_404_NOT_FOUND)
	try:
		if StudentFaceTokenDB.objects.filter(face_token=face_token).exists():
			StudentFaceTokenDB.objects.filter(face_token=face_token).delete()
	except StudentFaceTokenDB.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)

	if serializer.is_valid():
		serializer.save()
		return Response(serializer.data, status=status.HTTP_201_CREATED)

	return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def saveRaiseQuery(request):
	print request
	useridAdmin = request.data.get("useridAdmin",None)
	useridStudent = request.data.get("useridStudent",None)
	courseID = request.data.get("courseID",None)
	date = request.data.get("date",None)
	attendance = request.data.get("attendance",None)
	if attendance == None:
		return;
	attString = ""
	if attendance == 0:
		attString = "present"
	else:
		attString = "absent"
	Logstring = "Raised a query for marking " + attString + " wrongly for course " + courseID + " on date " + date
	insertCurrentLog(useridStudent,Logstring)	
	Logstring = "Attendance for student " + useridStudent +" has been marked " + attString + " wrongly for course " + courseID + " on date " + date
	insertCurrentLog(useridAdmin,Logstring)
	return Response(status=status.HTTP_201_CREATED)