# PROXY - Attendance Assistant
CS3410 Course Project

Synopsis:
Proxy is a software developed intended to be used by universities to maintain the record of attendance of students enrolled in a particular course. This software emphasizes mainly on the detection of faces in the pictures and matching the detected pictures to the students pictures. Proxy is intended to provide an easy way for teachers
to mark attendance of students using photographs instead of manually doing the same. 


How to use:
1. Firstly, install django rest framework by following steps in the link "https://www.howtoforge.com/tutorial/how-to-install-django-on-ubuntu/".

2. And, make sure that latest versions of node and npm are installed. The latest versions can be installed by following the steps in the following link "https://www.liquidweb.com/kb/how-to-install-node-js-via-nvm-node-version-manager-on-ubuntu-14-04-lts/". 

3. To install all the necessary packages needed to run the client side code, go to the client root directory and run npm install. This will install all the required packages needed.

4. After downloading/cloning the project, navigate to the "Server" root directory run the django server by the following the command in the Linux terminal in the 'Proxy' directory.
		$python manage.py runserver
5. To run the js client, run "npm start". This starts a local server which hosts the webpage on the local address, "http://localhost:8100/".

6. The pictures used for training(i.e the individual pics of every individual in the class) should be present in the directory "Proxy/Client/app/images/Training_Pictures". For this, "Advanced Options" can be used.

7. The class pictures uploaded by teacher every day for attendance should be present in the directory "Proxy/Client/app/images/Test_Pictures".


Motivation:
The focus of this software is to ensure that no student is given false attendance in a class and also to ease the process of taking attendance.


API Reference:
APIs used for face detection and searching are in the links "https://console.faceplusplus.com/documents/5679127", "https://console.faceplusplus.com/documents/5681455" provided by face++ cognitive services.
URLs fo APIs written on server side can be looked up from the file "Proxy/Proxy/Proxy/urls.py"



Contributors:
Nikitha Gollamudi - www.github.com/Nikitha2497
Kavya Mrudula - www.github.com/kavya006
Sistla Meghana Aparna - www.github.com/cs14b052
Vemuri Sowjanya - www.github.com/vemurisowjanya

