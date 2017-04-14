import React, {Component} from 'react';
import {IndexLink} from 'react-router';
import moment from 'moment';
import $ from 'jquery';

let attendance = {
	outer : {
		fontSize : '16px',
		margin : '15px 10px',
		position : 'relative',
		textAlign : 'left',
		height : '30px',
		left : '40%'
	},
	span : {
		position : 'absolute',
		padding : '5px'
	},
	box : {
		fontSize : '14px',
		position : 'absolute',
		left : '10%',
		display : 'inline',
		padding : '5px',
		color : 'rgb(253, 251, 218)',
		backgroundColor : 'rgb(53,120,81)',
		border : '1px solid rgb(53, 120, 81)'
	},
	box2 : {
		fontSize : '14px',
		position : 'absolute',
		left : '10%',
		display : 'inline',
		padding : '5px',
		// color : 'rgb(253, 251, 218)',
		// backgroundColor : 'rgb(53,120,81)',
		border : '1px solid rgb(53, 120, 81)',
		cursor : 'pointer'
	}
}

let styles = {
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
  	}
}
class Attendance extends Component{
	constructor(props) {
		super(props);
		this.state = {att : this.props.attendance};
		this.onDoubleClick = this.onDoubleClick.bind(this);
	}
	onDoubleClick () {
		if(!this.props.edit)
			return;
		let x = (this.state.att == 'A' ? 'P' : 'A');
		this.setState({att : x});
		this.props.handleChange(this.props.name);
	}
	render() {
		let boxStyle = this.props.edit ? attendance.box2 : attendance.box;
		return	(
			<div style={attendance.outer}>
				<span style={attendance.span}>{_.startCase(_.lowerCase(this.props.name))} &nbsp;</span>
				<div style={boxStyle} onDoubleClick={this.onDoubleClick}>
					{this.props.attendance}
				</div>
			</div>
		);
	}
}

class ShowAttendance extends Component{
	constructor(props) {
		super(props);
		this.data = [];
		this.renderData = [];
		this.state = {edit : false, data : []};
		this.populateData = this.populateData.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleEdit = this.handleEdit.bind(this);
	}

	handleChange (changedKey) {
		console.log(this.data);
		this.data[changedKey] = (this.data[changedKey] == '0' ? '1' : '0');
		console.log(this.data);
		this.setState({data : this.data});
	}
	handleEdit () {
		if(this.state.edit){
			let _this = this;
			let url = 'http://localhost:8000/proxyapis/SaveAttendance/';
			let attendanceList = "";
			let s = Object.keys(this.data);
			// let x = s.map((m, i)=>{
			// 	if(this.data[m] == '1'){
			// 		return m;
			// 	}
			// });
			let x = [];
			for (let i = s.length - 1; i >= 0; i--) {
				if(this.data[s[i]] == '1')
					x.push(s[i]);
			};
			console.log(x);
			x.map((m, i) => {
				attendanceList += m;
				if(i != x.length - 1)
					attendanceList += ",";
			});
			// alert(attendanceList);
			let data = {};
			data["courseID"] = _this.props.params.courseid;
			data["date"] = moment(_this.props.params.date, 'DD/MM/YYYY').format("YYYY-MM-DD");
			if (attendanceList=="") {
				attendanceList = "NA";
			}
			data["attendanceList"] = attendanceList;
			data["picturesList"] = "NA";
			console.log(data);
		    $.ajax({
		      type: 'POST',
		      url:url,
		      data : data,
		      headers: {"Access-Control-Request-Headers": "x-requested-with"},
		      crossDomain: true,
		      dataType: "json",
		      success: function  (data, text, req) {
				_this.setState({edit : !_this.state.edit});
		      },
		      error: function(xhr,status){
				_this.setState({edit : !_this.state.edit});
	 	        // _this.setState({data : _this.data});
		      	// alert(status);
		      } 
		    });
		}else{
			this.setState({edit : !this.state.edit});
		}
	}

	componentDidMount() {
		let _this = this;
		let url = 'http://localhost:8000/proxyapis/GetAttendance/?';
		let params = 'courseID=' + _this.props.params.courseid 
		+ '&date=' + moment(_this.props.params.date, 'DD/MM/YYYY').format("YYYY-MM-DD");
		// alert(url + params);
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
	      	_this.data = {};
 	        _this.setState({data : {}});
 	        // _this.setState({data : _this.data});
	      	// alert(status);
	      } 
	    }).then(() => {
	    	console.log(_this.data);
	    });
	}

	populateData () {
		let x = Object.keys(this.data);
		this.renderData = x.map((m, i) => {
			return <Attendance name={m} handleChange={this.handleChange} 
			key={i} keyId={i} attendance={this.data[m] == '0' ? 'A' : 'P'} 
			edit={this.state.edit}/>;
		});
	}
	
	render(){
		let a = this.state.edit ? "Save" : "Edit";
		this.populateData();
		return (
			<div>
				<h2 style={{marginRight : '0%', textAlign : 'center'}}>
					Attendance as recorded on 
					{' ' + moment(this.props.params.date, 'DD/MM/YYYY').format('DD/MM/YY')}
				</h2>
				<div style={{textAlign : 'center', marginLeft : '20%'}}>
					<button onClick={this.handleEdit}>{a}</button>
				</div>
				<div id="attendance-fixed">
					{this.renderData}
				</div>
				<div style={styles.linkWrapper}>
					<IndexLink style={styles.link} to={'/user/admin/id/' + 
					this.props.params.name+'/course/' + this.props.params.courseid + '/'}>Done</IndexLink>
				</div>
			</div>);
	}
}

export default ShowAttendance;