import React, {Component} from 'react';
import {Link, IndexLink} from 'react-router';
import moment from 'moment';
import Radium, {StyleRoot, Style} from 'radium';
import Datetime from 'react-datetime';
import Modal from 'react-modal';
import _ from 'lodash';
import $ from 'jquery';

let styles = {
	outer : {
		display : 'flex',
		justifyContent : 'space-around'
	},
	left : {

	},
	right : {
		outer : {
			fontSize : '20px',
			paddingTop : '16px',
			fontWeight : 900,
			maxWidth : '50%'
		},
		inner : {
			fontSize: '14px',
			marginLeft: '10px'
		}
	},
	modal : {
		content : {
			width : '750px',
			top : '50%',
    		left : '50%',
    		right : 'auto',
    		bottom : 'auto',
    		marginRight: '-50%',
    		transform : 'translate(-50%, -50%)',
			height : '400px'
		}
	},
	images : {
		width : '150px',
		margin : '5px 10px',
		cursor : 'pointer',
		padding : '5px',
		borderRadius : '5px'
	},
	sub : {
		fontWeight : 900, 
		display : 'inline-block', 
		width : '13%'
	},
	button : {
		display : 'inline'
	}
}

let attendance = {
	outer : {
		fontSize : '16px',
		margin : '15px 10px',
		position : 'relative',
		textAlign : 'left',
		height : '30px'
	},
	span : {
		position : 'absolute',
		padding : '5px'
	},
	box : {
		fontSize : '14px',
		position : 'absolute',
		right : '50%',
		display : 'inline',
		padding : '5px',
		color : 'rgb(253, 251, 218)',
		backgroundColor : 'rgb(53,120,81)',
		border : '1px solid rgb(53, 120, 81)'
	}
}
let modalClass = {
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
			left : "25%",
			position : "relative",
			backgroundColor : 'rgb(53, 43,43)',
			height : '40px',
			width : '50%',
			top : '0%'
		},
		text : {
			padding : 0,
			margin : 0,
			position : 'absolute',
			top : '20%',
			left : '28%'	
		},
		text2 : {
			padding : 0,
			margin : 0,
			position : 'absolute',
			top : '20%',
			left : '32%'	
		}
	}
}

class RaiseQuery extends Component {
	constructor(props) {
		super(props);
		this.adminID = "";
		this.state = {showQuery : false};
		this.handleQuery = this.handleQuery.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	componentDidMount() {
		let _this = this;
		let url = 'http://localhost:8000/proxyapis/GetCourseDetails/?';
		let params = 'courseID=' + _this.props.courseID;
		// alert(url + params);
	    $.ajax({
	      type: 'GET',
	      url:url + params,
	      headers: {"Access-Control-Request-Headers": "x-requested-with"},
	      crossDomain: true,
	      dataType: "json",
	      success: function  (data, text, req) {
	      	_this.adminID = data["userid"];
	      },
	      error: function(xhr,status){
 	        _this.data = []; 
	      } 
	    });	
	}

	handleQuery () {
		this.setState({showQuery : this.state.showQuery ? false : true});
	}
	handleClose () {
		this.setState({showQuery : this.state.showQuery ? false : true});
	}
	handleSubmit () {
		let _this = this;
		let url = 'http://localhost:8000/proxyapis/RaiseQuery/';
		let _data = {};
		_data.courseID = _this.props.courseID;
		_data.useridAdmin = _this.adminID;
		_data.useridStudent = _this.props.name;
		_data.date = moment(_this.props.date, "YYYY-MM-DD").format("YYYY-MM-DD");
		_data.attendance = _this.props.attendance;
		console.log(_data);
	    $.ajax({
	      type: 'POST',
	      url:url,
	      data : _data,
	      headers: {"Access-Control-Request-Headers": "x-requested-with"},
	      crossDomain: true,
	      dataType: "json",
	      success: function  (data, text, req) {
			_this.setState({showQuery : _this.state.showQuery ? false : true});
	      },
	      error: function(xhr,status){
			_this.setState({showQuery : _this.state.showQuery ? false : true});
	      } 
	    });
	}
	render () {
		return (
				<div style={{textAlign : 'center', display : 'inline'}} id="view class pics">
							<button style={styles.button} onClick={this.handleQuery}>Raise Query</button>
							<Modal 
								isOpen = {this.state.showQuery}
								onRequestClose = {this.handleClose}
								style={styles.modal}
								contentLabel = 'Raise Query'>
								<div style={modalClass.header.outer}>
									<div style={modalClass.header.inner}>
										<p style={modalClass.header.text2}>Raise A Query</p>
									</div>
								</div>
								<p>
									<span style={styles.sub}>From: </span> 
									<span>{_.startCase(this.props.name)}</span>
								</p>
								<p>
									<span style={styles.sub}>To: </span> 
									<span>{this.adminID}</span>
								</p>
								<p>
									<span style={styles.sub}>Subject: </span> 
									<span>Discrepancies in Attendance</span>
								</p>
								Sir/Madam,<br/>
								<p style={{margin : '15px'}}>
									I have been marked  
									<span style={{fontWeight : 900}}>
										{this.props.attendance ? ' present' : ' absent'}
									</span> wrongly for the 
								date 
									<span style={{fontWeight : 900}}>
										{' ' + moment(this.props.date).format('DD/MM/YYYY')}
									</span>. for the course 
									<span style={{fontWeight : 900}}>
										{' ' + this.props.courseID}
									</span>. <br/> <br/>Please verify the same.  </p>
						        <div style={{textAlign : 'center', marginTop : '25px'}}>
						        	<button onClick={this.handleSubmit}>submit</button> &nbsp; &nbsp;
			          				<button onClick={this.handleClose}>close</button>
			          			</div>
							</Modal>
						</div>
			);
	}
}
class ViewClassPics extends Component {
	constructor(props) {
		super(props);
		this.data = [];
		this.renderData = [];
		this.state = {showClass : false, data : [], date : moment()};
		this.handleClassPick = this.handleClassPick.bind(this);
		this.populatePhotos = this.populatePhotos.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if(!this.props.date.isSame(this.state.date)){
			this.setState({date : this.props.date});
		}
	}
	handleClassPick() {
		let _this = this;
		let url = 'http://localhost:8000/proxyapis/GetPicturesList/?';
		let params = 'courseID=' + _this.props.params.courseid 
		+ '&date=' + moment(_this.state.date).format('YYYY-MM-DD');
		// alert(url + params);
	    $.ajax({
	      type: 'GET',
	      url:url + params,
	      headers: {"Access-Control-Request-Headers": "x-requested-with"},
	      crossDomain: true,
	      dataType: "json",
	      success: function  (data, text, req) {
	      	if (data.length == 0) {
	      		_this.data = [];
				_this.setState({showClass : _this.state.showClass ? false : true, data : []});
	      	}else{
	      		_this.data = data.split(","); 
 	        	_this.populatePhotos();
				_this.setState({showClass : _this.state.showClass ? false : true, data : _this.data});
	      	}
	      },
	      error: function(xhr,status){
 	        _this.data = []; 
			_this.setState({showClass : _this.state.showClass ? false : true, data : []});
	      	// alert(status);
	      } 
	    });
	}

	populatePhotos () {
		let base_dir = "./images/Test_Pictures/";
		if(this.data.length == 0){
			this.renderData = "";
			return;
		}
		this.renderData = this.data.map((p, i) => {
			return <img key={i} style={styles.images} src={base_dir + p}/>
		});
	}

	render () {
		return (
				<div style={{textAlign : 'center', display : 'inline'}} id="view class pics">
							<button style={styles.button} onClick={this.handleClassPick}>View Class Pics</button>
							<Modal 
								isOpen = {this.state.showClass}
								onRequestClose = {this.handleClassPick}
								style={styles.modal}
								contentLabel = 'View Class Pics'>
								<div style={modalClass.header.outer}>
									<div style={modalClass.header.inner}>
										<p style={modalClass.header.text}>View Class Pics</p>
									</div>
								</div>
								<div>
									{this.renderData}
								</div>
						        <div style={{textAlign : 'center', marginTop : '25px'}}>
			          				<button onClick={this.handleClassPick}>close</button>
			          			</div>
							</Modal>
						</div>
			);
	}
}
const Attendance = (props) => (
		<div style={attendance.outer}>
			<span style={attendance.span}>{props.name} &nbsp;</span>
			<div style={attendance.box}>
				{props.attendance}
			</div>
		</div>
	);
class StudentCourse extends Component{
	constructor(props) {
		super(props);
		this.data = {}
		this.isPresent = true;
		this.state = {selectedDate:moment(), isPresent : true, data : {}};
		this.changeDate = this.changeDate.bind(this);
		this.populateData = this.populateData.bind(this);
		this.sendRequest = this.sendRequest.bind(this);
		this.renderData = [];
		this.renderCumData = [];
	}

	componentDidMount() {
		let _this = this;
		let url = 'http://localhost:8000/proxyapis/GetAttendance/?';
		let params = 'courseID=' + _this.props.params.courseid 
		+ '&date=' + moment(_this.state.selectedDate).format('YYYY-MM-DD');
	    $.ajax({
	      type: 'GET',
	      url:url + params,
	      headers: {"Access-Control-Request-Headers": "x-requested-with"},
	      crossDomain: true,
	      dataType: "json",
	      success: function  (data, text, req) {
	      	console.log(data);
 	        _this.data = data; 
 	        _this.populateData();
	      },
	      error: function(xhr,status){
 	        _this.data = {}; 
	      } 
	    }).then(() => {
		    let url = 'http://localhost:8000/proxyapis/GetCummulativeAttendance/?';
			let params = 'courseID=' + _this.props.params.courseid + '&userid=' + _this.props.params.name;
		    $.ajax({
		      type: 'GET',
		      url:url + params,
		      headers: {"Access-Control-Request-Headers": "x-requested-with"},
		      crossDomain: true,
		      dataType: "json",
		      success: function  (data, text, req) {
	 	        _this.renderCumData = data; 
				_this.setState({data : _this.data});
		      },
		      error: function(xhr,status){
	 	        _this.renderCumData = {}; 
				_this.setState({data : _this.data});
		      } 
		    });
		});
	}

	sendRequest(m) {
		let _this = this;
		let url = 'http://localhost:8000/proxyapis/GetAttendance/?';
		let params = 'courseID=' + _this.props.params.courseid 
		+ '&date=' + moment(_this.state.selectedDate).format('YYYY-MM-DD');
		// alert(url + params);
	    $.ajax({
	      type: 'GET',
	      url:url + params,
	      headers: {"Access-Control-Request-Headers": "x-requested-with"},
	      crossDomain: true,
	      dataType: "json",
	      success: function  (data, text, req) {
 	        _this.data = data;
	      },
	      error: function(xhr,status){
	      	_this.data = {};
	      } 
	    }).then(() => {
		    let url = 'http://localhost:8000/proxyapis/GetCummulativeAttendance/?';
			let params = 'courseID=' + _this.props.params.courseid + '&userid=' + _this.props.params.name;
		    $.ajax({
		      type: 'GET',
		      url:url + params,
		      headers: {"Access-Control-Request-Headers": "x-requested-with"},
		      crossDomain: true,
		      dataType: "json",
		      success: function  (data, text, req) {
	 	        _this.renderCumData = data; 
	 	        _this.setState({selectedDate: m, data : _this.data});
		      },
		      error: function(xhr,status){
	 	        _this.renderCumData = {}; 
	 	        _this.setState({selectedDate: m, data : _this.data});
		      } 
		    });
		});
	}
	componentWillUpdate(nextProps, nextState) {
		this.populateData();
	}
	populateData () {
		this.renderData = [<Attendance name={this.props.params.name} key={10} attendance={this.data[this.props.params.name] == '0' ? 'A' : 'P'} />]
		this.isPresent = (this.data[this.props.params.name] == '1');
	}

	changeDate(m){
		this.sendRequest(m);
	}

	render(){
		return (
				<div style={styles.outer}>
					<div style={styles.left.outer}>
						<h3>Choose a date:</h3>
						<Datetime input={false}
								timeFormat={false}
								defaultValue={this.state.selectedDate}
					            onChange={this.changeDate}/>
				    </div>
				    <div style={styles.right.outer}>
				    	Attendance for {moment(this.state.selectedDate).format('DD/MM/YYYY')}
				    	{this.renderData}
		    			<p>Cummulative Attendance </p>
			    		<div style={styles.right.inner}>
			    			<p style={styles.right.p}>Number of classes present: {this.renderCumData.numOfDaysPresent}</p>
			    			<p style={styles.right.p}>Number of classes absent: {this.renderCumData.numOfDaysAbsent}</p>
			    			<p style={styles.right.p}>Number of Total Classes conducted: {this.renderCumData.totalNumDays}</p>
			    			<p style={styles.right.p}>Cummulative Attendance Percentage so far: {this.renderCumData.attendancePercentage}</p>
			    		</div>
				    	<div>
				    		<ViewClassPics params={this.props.params} date={this.state.selectedDate}/> &nbsp; &nbsp;
				    		<RaiseQuery attendance={this.isPresent} 
				    				courseID={this.props.params.courseid}
				    				name={this.props.params.name}
				    				date={this.state.selectedDate}/>
				    	</div>
				    </div>
				</div>
			);
	}
}

export default StudentCourse;