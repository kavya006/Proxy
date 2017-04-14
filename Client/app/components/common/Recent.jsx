import React, {Component} from 'react';
import Radium from 'radium';
import {IndexLink, Link} from 'react-router';
import Timestamp from 'react-timestamp';
import $ from 'jquery';
import moment from 'moment';

let styles = {
	outer : {
		width : '300px',
		height : '450px',
		position : 'relative',
		right : '15%',
		top : '7%',
		display : 'table-cell',
		verticalAlign : 'bottom',
		backgroundColor :  'rgb(53,120,81)',
		color : 'rgb(253, 251, 218)'
	},
	inner : {
		height : '400px',
		overflowY : 'scroll'
	},
	p : {
		margin: 0,
		padding: '15px 10px 5px 10px',
		fontStyle: 'italic',
		textDecoration: 'underline'
	},
	card : {
		backgroundColor : 'rgb(253, 251, 218)',
		color : 'rgb(53,43,43)',
		fontSize : '14px',
		textAlign : 'justify',
		width : '275px',
		padding : '5px',
		margin : '15px 10px',
		borderRadius : '5px',
		border : '1px solid rgb(53,43,43)'
	}
};

class Recent extends Component{

	constructor(props) {
		super(props);
		this.data = [];
		this.state = {data: []};
		this.populateData = this.populateData.bind(this);
	}
	componentDidMount() {
		let _this = this;
		let url = 'http://localhost:8000/proxyapis/GetLogs/?';
		let params = 'userid=' + _this.props.userid;
		// alert(url + params);
	    $.ajax({
	      type: 'GET',
	      url:url + params,
	      headers: {"Access-Control-Request-Headers": "x-requested-with"},
	      crossDomain: true,
	      dataType: "json",
	      success: function  (data, text, req) {
	      	_this.data = data;
	      	_this.setState({data: _this.data});
	      },
	      error: function(xhr,status){
 	        _this.data = []; 
	      	_this.setState({data: _this.data});
	      } 
	    });	
	}

	componentWillReceiveProps(nextProps) {
		let _this = this;
		let url = 'http://localhost:8000/proxyapis/GetLogs/?';
		let params = 'userid=' + nextProps.userid;
		// alert(url + params);
	    $.ajax({
	      type: 'GET',
	      url:url + params,
	      headers: {"Access-Control-Request-Headers": "x-requested-with"},
	      crossDomain: true,
	      dataType: "json",
	      success: function  (data, text, req) {
	      	_this.data = data;
	      	_this.setState({data: _this.data});
	      },
	      error: function(xhr,status){
 	        _this.data = []; 
	      	_this.setState({data: _this.data});
	      } 
	    });		
	}

	populateData(){
		let a = this.data.map(function(m, i){
			return (
				<div key={'_message' + i} style={styles.card}>
					{moment(m.timeStamp).format('DD-MM-YY HH:MM:SS')} > {m.activities}
				</div>
			);
		});
		return a;
	}

	render(){
		return (
			<div style={styles.outer}>
				<p style={styles.p}> Recent Activity: </p>			
				<div style={styles.inner}>
					{this.populateData()}
				</div>
			</div>);
	}
}

export default Recent;