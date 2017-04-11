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
		}
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
	    margin : '20px 24%'
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
			left : "21%",
			position : "relative",
			backgroundColor : 'rgb(53, 43,43)',
			height : '40px',
			width : '200px',
			top : '0%'
		},
		text : {
			padding : 8,
			margin : 0,	
		}
	}
}


class ChangeList extends Component {
	constructor(props) {
		super(props);
		this.state = {showChangeList : false, roll : "", name : ""};
		this.handleChangeList = this.handleChangeList.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChangeName = this.handleChangeName.bind(this);
		this.handleChangeRoll = this.handleChangeRoll.bind(this);
	}

	handleChangeList () {
		this.setState({showChangeList : this.state.showChangeList ? false : true});
	}

	handleSubmit(){
		if(this.state.roll == '')
			return;
		let _this = this;
		let url = 'http://localhost:8000/proxyapis/'+_this.props.func+'/';
		let data = {};
		data["courseID"] = _this.props.params.courseid;
		data["userid"] = _this.state.roll;
	    $.ajax({
	      type: 'POST',
	      url:url,
	      data: data,
	      headers: {"Access-Control-Request-Headers": "x-requested-with"},
	      crossDomain: true,
	      dataType: "json",
	      success: function  (data2, text, req) {
			_this.setState({name : '', id : '',showChangeList : _this.state.showChangeList ? false : true, data : _this.data});
	      },
	      error: function(xhr,status){
	      	console.log(xhr);
			_this.setState({name : '', id : '', showChangeList : _this.state.showChangeList ? false : true});
	      } 
	    });
	}

	handleChangeName(event) {
  	  this.setState({name: event.target.value});
	}

	handleChangeRoll(event){
	  	this.setState({roll : event.target.value});
	}

	render () {
		return (
				<div style={{textAlign : 'center', display : 'inline'}} id="changeList-student">
							<button style={styles.button} 
								onClick={this.handleChangeList}>{this.props.func + ' '} Student</button>
							<Modal 
								isOpen = {this.state.showChangeList}
								onRequestClose = {this.handleChangeList}
								style={styles.modal}
								contentLabel = 'ChangeList'>
								<div style={modalClass.header.outer}>
									<div style={modalClass.header.inner}>
										<p style={modalClass.header.text}>{this.props.func + ' '} Student</p>
									</div>
								</div>
								<div>
									<label>
							          <span style={styles.span}>Student RollNo:</span><br/><br/>
							          <input type="text" value={this.state.roll} onChange={this.handleChangeRoll} />
							        </label>
							        <br/><br/>
								</div>
						        <div style={{textAlign : 'center', marginTop : '25px'}}>
			          				<button onClick={this.handleSubmit}>submit</button> &nbsp; &nbsp;
			          				<button onClick={this.handleChangeList}>close</button>
			          			</div>
							</Modal>
						</div>
			);
	}
}

class AdminCourse extends Component{
	constructor(props) {
		super(props);
		this.data = []
		this.state = {selectedDate:moment(), isPresent : true};
		this.changeDate = this.changeDate.bind(this);
		this.populateData = this.populateData.bind(this);
	}

	populateData () {
		let name = this.props.params.name;
		this.data = ['Nikitha', 'Kavya', 'Meghana', 'Sowjanya', 'Mayank'];
		let a = this.data.map((m, i) => {
			return <Attendance name={m} id={i} attendance={_.lowerCase(m) == _.lowerCase(name) ? 'A' : 'P'}/>;
		});
		return a;
	}

	changeDate(m){
		this.setState({selectedDate : m});
	}

	render(){
		return (
				<div style={styles.outer}>
					<div>
						<div>
							<ChangeList func='Enroll' params={this.props.params}/> &nbsp; &nbsp;
							<ChangeList func='UnEnroll' params={this.props.params}/>
						</div>
						<div style={styles.left.outer}>
							<h3>Choose a date:</h3>
							<Datetime input={false}
									timeFormat={false}
									defaultValue={this.state.selectedDate}
						            onChange={this.changeDate}/>
					    </div>
				    </div>
				    <div style={styles.right.outer}>
				    	Showing Options for {moment(this.state.selectedDate).format('DD/MM/YYYY')} <br/><br/>
				    	<div style={styles.linkWrapper}>
				          <IndexLink style={styles.login} 
				          to={'/user/admin/id/'+this.props.params.name
				          +'/course/'+this.props.params.courseid + '/date/'
				          +encodeURIComponent(moment(this.state.selectedDate).format('DD/MM/YYYY'))+'/upload'}> 
				            Upload Pics 
				          </IndexLink>
				        </div>
				        <div style={styles.linkWrapper}>
				          <IndexLink style={styles.login} 
				          to={'/user/admin/id/'+this.props.params.name 
				      		+'/course/'+this.props.params.courseid + '/date/'
				      		+encodeURIComponent(moment(this.state.selectedDate).format('DD/MM/YYYY')) + '/show'}> 
				            Show/Change Attendance 
				          </IndexLink>
				        </div>
				    </div>
				</div>
			);
	}	
}

export default AdminCourse;