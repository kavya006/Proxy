import React, {Component} from 'react';
import {IndexLink, Link} from 'react-router';
import _ from 'lodash';
import Modal from 'react-modal';
import $ from 'jquery';
import ReactDOM from 'react-dom';

import Recent from '../common/Recent.jsx';

let styles = {
	inner : {
		display : 'inline-block',
		width : '300px',
		overflowY : 'scroll',
		height : '350px',
		overflowX : 'hidden',
		textAlign : 'left'
	},
	h3 : {
		color : 'rgb(53, 43, 43)',
		display : 'inline-block'
	},
	medium : {
		display : 'flex',
		position : 'relative',
		left : '10%',
		flexDirection : 'column'
	},
	linkWrapper : {
		display : 'inline-block',
		position: 'relative',
		margin : '0% 5%'
	},
	course : {
		textAlign : 'left',
		display : 'block',
		backgroundColor: 'rgb(53, 43,43)',
		textDecoration : 'none',
		padding : '5px 10px',
		margin : '5px',
		borderRadius: '10px',
		color : 'rgb(203, 255, 218)'
	},
	modal : {
		content: {
			width : '350px',
			top : '50%',
    		left : '50%',
    		right : 'auto',
    		bottom : 'auto',
    		marginRight: '-50%',
    		transform : 'translate(-50%, -50%)',
			height : '350px'
		}
	},
	modal2 : {
		content: {
			width : '550px',
			top : '50%',
    		left : '50%',
    		right : 'auto',
    		bottom : 'auto',
    		marginRight: '-50%',
    		transform : 'translate(-50%, -50%)',
			height : '450px'
		}
	},
	button : {
		position : 'relative',
		width : '150px',
		height: '35px',
		borderRadius : '5px'
	},
	outer : {
		display : 'flex',
		justifyContent : 'space-between'
	},
	label : {
		width: '60%',
		border: '1px solid rgb(53,43,43)',
		borderRadius: '3px'
	}
};
let modal = {
	header : {
		outer : {
			fontSize : '20px',
			height : "40px",
			position : "relative",
			backgroundColor :  'rgb(53,120,81)',
			marginBottom : '30px',
			display : 'flex',
			flexDirection : 'column-reverse',
			textAlign : 'center'
		},
		inner : {
			color : "rgb(203, 255, 231)",
			left : "21%",
			position : "relative",
			backgroundColor : 'rgb(53, 43,43)',
			height : '40px',
			width : '200px',
			top : '0%'
		},
		inner2: {
			color : "rgb(203, 255, 231)",
			left : "23%",
			position : "relative",
			backgroundColor : 'rgb(53, 43,43)',
			height : '40px',
			width : '300px',
			top : '0%'	
		},
		text : {
			padding : 0,
			margin : 0,
			position : 'absolute',
			top : '20%',
			left : '24%'	
		},
		text2 : {
			padding : 0,
			margin : 0,
			position : 'absolute',
			top : '20%',
			left : '16%'	
		}
	}
}


Array.prototype.diff = function(a){
	return this.filter(function(i) { 
		return a.map(function(m){
			return m.name == i.name;
		}).indexOf(true) < 0; 
	});
}

Array.prototype.getIndex = function(a) { 
	return this.map(function(m){ 
		return m.name == a; 
	}).indexOf(true);
}

class UserAdmin extends Component{

	constructor(props) {
		super(props);
		this.data = [];
		this.files = [];
		this.state = {showAdd : false, showAdv : false, showDelete : false, name : '', id : '', data : [], files: [], showPicsList: false, advancedID: ''};
		this.populateData = this.populateData.bind(this);
		this.handleAddCourse = this.handleAddCourse.bind(this);
		this.handleDeleteCourse = this.handleDeleteCourse.bind(this);
		this.handleAdvanced = this.handleAdvanced.bind(this);
		this.formatData = this.formatData.bind(this);
		this.handleChangeid = this.handleChangeid.bind(this);
		this.handleChangename = this.handleChangename.bind(this);
		this.handleAddCancel = this.handleAddCancel.bind(this);
		this.handleDeleteCancel = this.handleDeleteCancel.bind(this);
		this.handleChangeAdvancedid = this.handleChangeAdvancedid.bind(this);

		this.handleMore = this.handleMore.bind(this);
		this.handleSubmitFinal = this.handleSubmitFinal.bind(this);
	}
	
	handleChangeid(e){
		this.setState({id : e.target.value});
	}
	handleChangename(e){
		this.setState({name : e.target.value});
	}
	handleChangeAdvancedid(e){
		this.setState({advancedID: e.target.value});
	}
	handleMore () {
		let x = ReactDOM.findDOMNode(this.refs.images);
		if(x && x.files) {
			for (var i = 0; i < x.files.length; i++) {
				let reader = new FileReader();
				if(this.files.getIndex(x.files[i].name) != -1){
					continue;
				}
				this.files.push(x.files[i]);
				reader.onload = function (e) {
					let child = document.createElement('div');
					child.className = 'images-wrapper';
					child.style.display = 'inline-block';
					let image = document.createElement('img');
					image.className = 'images-image';
					image.style.width = '150px';
					image.style.margin = '5px 10px';
					image.style.cursor = 'pointer';
					image.style.padding = '5px';
					image.style.borderRadius = '5px';
					image.setAttribute('src', e.target.result);
					child.appendChild(image);
					// _this.files.push(e.target.result);
					document.getElementById("uploaded-images").appendChild(child);
				}
				reader.readAsDataURL(x.files[i]);
			}
		}
	}

	handleSubmitFinal(){
		let _this = this;
		let url = 'http://localhost:8000/proxyapis/SaveTrainingPicturesList/';
		let _data = this.files;
		let picturesList = "";
		for (var i = _data.length - 1; i >= 0; i--) {
			picturesList +=_data[i].name;
			if(i != 0)
				picturesList += ',';
		};
		if(picturesList == ''){
			_this.setState({showAdv: _this.state.showAdv ? false : true});
			return;
		}
		let data = {};
		data["studentID"] = _this.state.advancedID;
		data["picturesList"] = picturesList;
		console.log(data);
	    $.ajax({
	      type: 'POST',
	      url:url,
	      data: data,
	      headers: {"Access-Control-Request-Headers": "x-requested-with"},
	      crossDomain: true,
	      dataType: "json",
	      success: function  (data2, text, req) {
	      	_this.files = [];
			_this.setState({showAdv : _this.state.showAdv ? false : true, advancedID: '', files: _this.files});
	      },
	      error: function(xhr,status){
	      	_this.files = [];
			_this.setState({showAdv : _this.state.showAdv ? false : true, advancedID: '', files: _this.files});
	      } 
	    });
	}
	componentDidMount() {
		if(this.props.params.admin === 'student'){
			document.getElementById('adminOnly1').style.display = 'none';
			document.getElementById('adminOnly2').style.display = 'none';
			document.getElementById('adminOnly3').style.display = 'none';
		}
		
		let _this = this;
		let url = 'http://localhost:8000/proxyapis/GetCourses/?';
		let params = 'userid=' + _this.props.params.name + '&admin=' + _this.props.params.admin;
	    $.ajax({
	      type: 'GET',
	      url:url + params,
	      headers: {"Access-Control-Request-Headers": "x-requested-with"},
	      crossDomain: true,
	      dataType: "json",
	      success: function  (data, text, req) {
 	        _this.data = data;
 	        _this.setState({data : _this.data});
	      },
	      error: function(xhr,status){
	      } 
	    });
	}
	
	populateData(){
		
	}

	handleAddCourse() {
		if(this.state.name == '' || this.state.id == '')
			return;
		let _this = this;
		let url = 'http://localhost:8000/proxyapis/SaveCourseDetails/';
		let data = {};
		data["courseID"] = _this.state.id;
		data["name"] = _this.state.name;
		data["userid"] = _this.props.params.name;
	    $.ajax({
	      type: 'POST',
	      url:url,
	      data: data,
	      headers: {"Access-Control-Request-Headers": "x-requested-with"},
	      crossDomain: true,
	      dataType: "json",
	      success: function  (data2, text, req) {
	      	_this.data.push(data);
			_this.setState({name : '', id : '',showAdd : _this.state.showAdd ? false : true, data : _this.data});
	      },
	      error: function(xhr,status){
			_this.setState({name : '', id : '', showAdd : _this.state.showAdd ? false : true});
	      } 
	    });
	}

	handleDeleteCourse() {
		if(this.state.id == '')
			return;
		let _this = this;
		let url = 'http://localhost:8000/proxyapis/DeleteCourseDetails/';
		let _data = {};
		_data.courseID = _this.state.id;
		_data.userid = _this.props.params.name;
	    $.ajax({
	      type: 'POST',
	      url:url,
	      data: _data,
	      headers: {"Access-Control-Request-Headers": "x-requested-with"},
	      crossDomain: true,
	      dataType: "json",
	      success: function  (data2, text, req) {
	      	let newData = _this.data;
	      	newData = newData.filter((s) => (
	      			s.courseID != _this.state.id
	      		));
	      	_this.data = newData;
			_this.setState({name : '', id : '', showDelete : _this.state.showDelete ? false : true, data : _this.data});
	      },
	      error: function(xhr,status){
			_this.setState({name : '', id : '', showDelete : _this.state.showDelete ? false : true, data : _this.data});
	      } 
	    });
	}

	handleAddCancel() {
		this.setState({name : '', id : '', showAdd : this.state.showAdd ? false : true});
	}

	handleDeleteCancel() {
		this.setState({name : '', id : '', showDelete : this.state.showDelete ? false : true});
	}

	handleAdvanced() {
		this.setState({showAdv : this.state.showAdv ? false : true});
	}
	formatData(){
		let params = this.props.params;
		let a = this.data.map(function (c ,i){
			return (
				<div style={styles.linkWrapper} key={i}>
					<IndexLink style={styles.course} id={params.user+c+i} 
						to={'/user/' + params.admin + '/id/' + params.name + '/course/' + c.courseID}> 
						{c.courseID + " : " + (c.courseName || c.name)} 
					</IndexLink>
				</div>);
		});
		return a;
	}
	render(){
		return (
			<div style={styles.outer}>
				<div style = {{display : 'inline-block', margin : '3% 0 0 7%'}}>
					<div style={styles.medium}>
						<div>
						<div style={{display : "inline-block", textAlign : 'center'}} id="adminOnly1">
							<button style={styles.button} onClick={this.handleAddCancel}>Add Course</button>
							<Modal 
								isOpen = {this.state.showAdd}
								onRequestClose = {this.handleAddCancel}
								style={styles.modal}
								contentLabel = 'Add Course'>
								<div style={modal.header.outer}>
									<div style={modal.header.inner}>
										<p style={modal.header.text}>Add Course</p>
									</div>
								</div>
								<div>
								<label>
						          <span style={styles.span}>Course Number:</span><br/><br/>
						          <input style={styles.label} type="text" value={this.state.courseid} onChange={this.handleChangeid} />
						        </label>
						        <br/><br/>
						        <label>
						          <span>Course Name:</span><br/><br/>
						          <input style={styles.label} type="text" value={this.state.coursename} onChange={this.handleChangename} />
						        </label>
						        <br/><br/>
						        <div style={{textAlign : 'center', marginTop : '25px'}}>
			          				<button onClick={this.handleAddCourse}>submit</button> &nbsp; &nbsp;
			          				<button onClick={this.handleAddCancel}>cancel</button>
			          			</div>
		          				</div>
							</Modal>
						</div>
						<div style={{display : "inline-block", textAlign : 'center'}} id="adminOnly3">
							<button style={styles.button} onClick={this.handleDeleteCancel}>Delete Course</button>
							<Modal 
								isOpen = {this.state.showDelete}
								onRequestClose = {this.handleDeleteCancel}
								style={styles.modal}
								contentLabel = 'Delete Course'>
								<div style={modal.header.outer}>
									<div style={modal.header.inner}>
										<p style={modal.header.text}>Delete Course</p>
									</div>
								</div>
								<div>
								<label>
						          <span style={styles.span}>Course Number:</span><br/><br/>
						          <input style={styles.label} type="text" value={this.state.courseid} onChange={this.handleChangeid} />
						        </label>
						        <br/><br/>
						        <div style={{textAlign : 'center', marginTop : '25px'}}>
			          				<button onClick={this.handleDeleteCourse}>submit</button> &nbsp; &nbsp;
			          				<button onClick={this.handleDeleteCancel}>cancel</button>
			          			</div>
		          				</div>
							</Modal>
						</div>
						</div>
						<h3 style={styles.h3}>{this.props.params.admin === 'admin' ? 'Courses List' : 'Enrolled Courses:'}</h3>
						<div style={styles.inner}>
							{this.formatData()}
						</div>
						<div style={{position : 'fixed', left : '10%', bottom : '5%'}} id="adminOnly2">
							<button style={styles.button} onClick={this.handleAdvanced}>Advanced Options</button>
							<Modal 
								isOpen = {this.state.showAdv}
								onRequestClose = {this.handleAdvanced}
								style={styles.modal2}
								contentLabel = 'Upload Student Pics'>
								<div style={modal.header.outer}>
									<div style={modal.header.inner2}>
										<p style={modal.header.text2}>Upload Student Pics</p>
									</div>
								</div>
								<label>
						          <span style={styles.span}>Student RollNumber:</span><br/><br/>
						          <input style={styles.label} type="text" value={this.state.advancedID} onChange={this.handleChangeAdvancedid} />
						        </label>
								<div id="uploaded-images">
								</div>
						        <div style={{textAlign : 'center', marginTop : '25px'}}>
			          				<input id="UploadImagesHere" ref='images' type="file"  
			          				accept="image/*;capture=camera" multiple size="6" onChange={this.handleMore} />
			          				 &nbsp; &nbsp;
			          				<button onClick={this.handleSubmitFinal}>Done</button>
			          			</div>
							</Modal>
						</div>
					</div>
				</div>
				<div style = {{}}>
					<Recent userid={this.props.params.name} change={this.state.id}/>
				</div>
			</div>
		);
	}
}

export default UserAdmin;