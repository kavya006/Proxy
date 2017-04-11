from __future__ import unicode_literals

from django.db import models

# Create your models here.

class CourseDB(models.Model):
	userid = models.CharField(max_length=100);
	courseID = models.CharField(max_length=100,primary_key=True);
	name = models.CharField(max_length=100);


class TrainDB(models.Model):
	studentID = models.CharField(max_length=100,primary_key=True);
	picturesList = models.CharField(max_length=1000);

class PersonDB(models.Model):
	userid = models.CharField(max_length=100,primary_key=True);
	name = models.CharField(max_length=100);
	password = models.CharField(max_length=100);
	isTeacher = models.BooleanField();
	emailID = models.CharField(max_length=100,default="niki.gollamudi@gmail.com");


class AttendanceDB(models.Model):
	class Meta:
		unique_together = (('date','courseID'),)

	date = models.DateField();
	courseID = models.CharField(max_length=100);
	picturesList = models.CharField(max_length=1000);
	attendanceList = models.CharField(max_length=1000, null=True);


class LogsDB(models.Model):
	class Meta:
		unique_together = (('timeStamp','userid'),)

	timeStamp = models.DateTimeField()
	activities = models.CharField(max_length=1000);
	userid = models.CharField(max_length=100);

class EnrollmentDB(models.Model):
	class Meta:
		unique_together = (('userid','courseID'),)

	userid = models.CharField(max_length=100);
	courseID = models.CharField(max_length=100);
	cummulativeAttendance = models.IntegerField(default=0);

class StudentFaceTokenDB(models.Model):
	studentID = models.CharField(max_length=100)
	face_token = models.CharField(max_length=100, primary_key=True)