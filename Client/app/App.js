import React, { Component } from 'react'
import { Router, Route, hashHistory, IndexRoute, IndexLink } from 'react-router'

import LoginPage from './components/Pages/LoginPage.jsx';
import GenPage from './components/Pages/GenPage.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import LoginPopup from './components/Pages/LoginPopup.jsx';
import UserPage from './components/Pages/UserPage.jsx';
import AdminCourse from './components/Pages/AdminCourse.jsx';
import StudentCourse from './components/Pages/StudentCourse.jsx';
import UploadPics from './components/Pages/UploadPics.jsx';
import ShowAttendance from './components/Pages/ShowAttendance.jsx';

class App extends Component {

  constructor() {
    super();
    this.state = {admin : false, name: '', courseid : '', date : '', isLoggedIn : false};
    this.requireAuth = this.requireAuth.bind(this);
  }

  requireAuth (nextState, replace) {
    console.log(nextState);
    console.log(replace);
  }

  render() {
    return (
      <Router history={hashHistory}>
        <Route exact path='/' component={Container} >
          <IndexRoute component={LoginMain} />
          <Route path='/login_popup/:admin' component={Login}/>
          <Route path='/user/:admin/id/:name' component={User} 
            onEnter={this.requrireAuth}/>
          <Route path='/user/admin/id/:name/course/:courseid' component={CourseAdmin} 
            onEnter={this.requrireAuth}/>
          <Route path='/user/admin/id/:name/course/:courseid/date/:date/show' component={Attendance} 
            onEnter={this.requrireAuth}/>
          <Route path='/user/admin/id/:name/course/:courseid/date/:date/upload' component={Upload} 
            onEnter={this.requrireAuth}/>
          <Route path='/user/student/id/:name/course/:courseid' component={CourseStudent} 
            onEnter={this.requrireAuth}/>
          <Route path='*' component={GenPage} />
        </Route>
      </Router>
    )
  }
}

const Attendance = (props) => (
    <div>
      <Navbar status = 'admin' user = {props.params.name} course = {props.params.courseid}/>
      <ShowAttendance params = {props.params}/>
    </div>
  );

const Upload = (props) => (
    <div>
      <Navbar status = 'admin' user = {props.params.name} course = {props.params.courseid}/>
      <UploadPics params = {props.params}/>
    </div>
  );
const CourseAdmin = (props) => (
    <div>
      <Navbar status = 'admin' user = {props.params.name} course = {props.params.courseid}/>
      <AdminCourse params = {props.params}/>
    </div>
  );

const CourseStudent = (props) => (
    <div>
      <Navbar status = 'student' user = {props.params.name} course = {props.params.courseid}/>
      <StudentCourse params = {props.params} />
    </div>
  );
const LoginMain = (props) => (
    <div>
      <Navbar status = {props.params.admin}/>
      <LoginPage />
    </div>
  );

const Login = (props) => (
    <div>
      <Navbar status = {props.params.admin}/>
      <LoginPopup params = {props.params}/>
    </div>
  );
const User = (props) => (
    <div>
      <Navbar status = {props.params.admin} user = {props.params.name}/>
      <UserPage params = {props.params} />
    </div>
  );
const Container = (props) => (
    <div>
      {props.children}
    </div>
  );
const Nothing = (props) => <div>{props.params.courseid}</div>
const NotFound = () => <h1>404.. This page is not found!</h1>

export default App