"""Proxy URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from ProxyApp import views

urlpatterns = [
    # url(r'^admin/', admin.site.urls),
    url(r'^proxyapis/GetCourseDetails/$', views.giveCourseDetails),
    url(r'^proxyapis/SaveCourseDetails/$', views.saveCourseDetails),
    url(r'^proxyapis/DeleteCourseDetails/$', views.deleteCourseDetails),
    url(r'^proxyapis/GetTrainingPicturesList/$', views.getTrainingPicturesList),
    url(r'^proxyapis/SaveTrainingPicturesList/$', views.saveTrainingPicturesList),
    url(r'^proxyapis/GetAttendance/$', views.getAttendance),
    url(r'^proxyapis/SaveAttendance/$', views.saveAttendance),
    url(r'^proxyapis/GetPersonDetails/$', views.getPersonDetails),
    url(r'^proxyapis/SavePersonDetails/$', views.savePersonDetails),
    url(r'^proxyapis/GetLogs/$', views.getLogs),
    url(r'^proxyapis/SaveLogs/$', views.saveLogs),
    url(r'^proxyapis/GetCourses/$', views.getCourses),
    url(r'^proxyapis/Enroll/$', views.enroll),
    url(r'^proxyapis/UnEnroll/$', views.unenroll),
    url(r'^proxyapis/GetPicturesList/$', views.getPicturesList),
    url(r'^proxyapis/SavePicturesList/$', views.savePicturesList),
    url(r'^proxyapis/GetStudentFaceToken/$', views.getStudentFaceToken),
    url(r'^proxyapis/SaveStudentFaceToken/$', views.saveStudentFaceToken),
    url(r'^proxyapis/RaiseQuery/$', views.saveRaiseQuery),
    url(r'^proxyapis/GetCummulativeAttendance/$', views.getCummulativeAttendance),
]
