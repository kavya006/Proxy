import React, {Component} from 'react';
import Radium from 'radium';
import {IndexLink, Link} from 'react-router';
import $ from 'jquery';

let styles = {
	outer : {
		width : '100%',
    position : 'absolute',
    top : '25%'
	},
  login : {
    textDecoration : 'none',
    fontSize : '16px',
    color : "rgb(203, 255, 231)",
    backgroundColor : 'rgb(53, 43,43)'
  },
  linkWrapper : {
    display : 'inline-block',
    padding : '10px 15px',
    backgroundColor: 'rgb(53, 43,43)',
    position: 'relative',
    borderRadius: '10px',
    margin : '20px 24%',
    cursor : 'pointer'
  },
  inner : {
    position: 'relative',
    left: '41%',
    display: 'inline-block',
    padding: '3% 3%',
    color: 'rgb(53,43,43)',
    fontSize: '16px',
    fontStyle: 'italic',
    border: '1px solid black'
  }
}

function login (form) {
  return dispatch => doLogin(form)
    .then(() => dispatch({ type: 'LOGGED_IN' }))
    .catch(() => dispatch({ type: 'LOGIN_FAILED' }))
}

const initialState = {
  // some fields...,
  loggedIn: false,
  shouldRedirect: false,
  errorMessage: null
}


class LoginPopup extends Component{
	constructor(props) {
    super(props);
    this.state = {name: '', password: ''};
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangePass = this.handleChangePass.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeName(event) {
    this.setState({name: event.target.value});
  }

  handleChangePass(event){
  	this.setState({password : event.target.value});
  }

  handleSubmit(event) {
  	// this.history.pushState(null, 'login');
    // let httpRequest = new XMLHttpRequest();
    let url = 'http://localhost:8000/proxyapis/GetPersonDetails/?';
    let params = 'userid=' + this.state.name;
    var userid = this.state.name;
    var passwd = this.state.password;

    // httpRequest.open('GET', url+params, true);
    // httpRequest.overrideMimeType('application/json');
    // // httpRequest.setRequestHeader("Access-Control-Request-Headers","x-requested-with");
    // // httpRequest.responseType = "json";
    // httpRequest.onreadystatechange = (e)=>{
    //   if(httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status == 200) {
    //     alert(httpRequest.responseText);
    //   }
    // };
    // httpRequest.send();
    let _this = this;
    $.ajax({
      type: 'GET',
      url:url + params,
      headers: {"Access-Control-Request-Headers": "x-requested-with"},
      crossDomain: true,
      dataType: "json",
      success: function  (data, text, req) {
        // body...
        if(data.length == 0){
           alert("Invalid User Name");
          _this.setState({name : "", password:""});
        }else{
          let pwd = JSON.stringify(data[0].password);
          let pass = JSON.stringify(passwd);
          let isAdmin = JSON.stringify(data[0].isTeacher);
          if(pwd==pass){
             if((isAdmin == "false" && _this.props.params.admin == "student") || 
                (isAdmin == "true" && _this.props.params.admin == "admin")){
              window.location.href = "http://localhost:8100/#/user/"+
               _this.props.params.admin +"/id/"+userid;
             }else{
                alert("Invalid Access");
                _this.setState({name : "", password:""});  
             }
          }
          else{
            alert("Invalid Password");
            _this.setState({name : "", password:""});
          }
        }

      },
      error: function(xhr,status){
      } 
    });
  }

  render() {
    return (
    	<div style={styles.outer}>
        <h3 style={{textAlign : 'center'}}>
          ---- Login Form ---- 
        </h3>
        <div style={styles.inner}>
        <label>
          <span style={styles.span}>UserName:</span><br/><br/>
          <input type="text" ref="name" value={this.state.name} onChange={this.handleChangeName} />
        </label>
        <br/><br/>
        <label>
          <span>Password:</span><br/><br/>
          <input type="password" ref="password" value={this.state.password} onChange={this.handleChangePass} />
        </label>
        <br/><br/>
        <div style={styles.linkWrapper}>
          <IndexLink onClick={this.handleSubmit} style={styles.login} > 
            Log In 
          </IndexLink>
        </div>
        </div>
      </div>
    );
  }
}

export default LoginPopup;