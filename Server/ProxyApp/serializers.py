from rest_framework import serializers
from ProxyApp.models import *

class CourseSerializer(serializers.ModelSerializer):
	class Meta:
		model = CourseDB
		fields = ('courseID', 'name', 'userid')

class TrainingSerializer(serializers.ModelSerializer):
	class Meta:
		model = TrainDB
		fields = ('studentID', 'picturesList')

class PersonSerializer(serializers.ModelSerializer):
	class Meta:
		model = PersonDB
		fields = ('userid', 'name','password','isTeacher','emailID')

class AttendanceSerializer(serializers.ModelSerializer):
	class Meta:
		model = AttendanceDB
		fields = ('id', 'date','courseID','picturesList','attendanceList')

class LogsSerializer(serializers.ModelSerializer):
	class Meta:
		model = LogsDB
		fields = ('id', 'timeStamp','activities','userid')

class EnrollmentSerializer(serializers.ModelSerializer):
	class Meta:
		model = EnrollmentDB
		fields = ('id', 'userid','courseID','cummulativeAttendance')

class StudentFaceTokenSerializer(serializers.ModelSerializer):
	class Meta:
		model = StudentFaceTokenDB
		fields = ('studentID', 'face_token')
