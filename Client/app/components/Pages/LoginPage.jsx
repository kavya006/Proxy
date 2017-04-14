import React, {Component} from 'react';
import {IndexLink, Link} from 'react-router';

let styles = {
	outer : {
		position: "absolute",
		top: "50%",
		width: "100%",
		textAlign: "center"
	},
	student : {
		marginRight : '15%',
		textDecoration : 'none',
		fontSize : '20px',
		color : "rgb(203, 255, 231)",
		backgroundColor : 'rgb(53, 43,43)',
		position: 'absolute',
		top: '25%',
		left: '25%'
	},
	admin :{
		marginLeft : '15%',
		textDecoration : 'none',
		fontSize : '20px',
		color : "rgb(203, 255, 231)",
		backgroundColor : 'rgb(53, 43,43)',
		position: 'absolute',
		top: '25%',
		right: '30%'
	},
	linkWrapper : {
		display : 'inline-block',
		width: '160px',
		height: '50px',
		backgroundColor: 'rgb(53, 43,43)',
		position: 'relative',
		borderRadius: '10px',
		margin : '0 5%'
	},
	header : {
		position: 'absolute',
		top: '-200%',
		left: '45%',
		fontSize: '25px',
		fontStyle: 'italic',
		color: 'rgb(53,43,43)'
	}
};
class LoginPage extends Component{

	constructor(props) {
		super(props);
	}
	
	render(){
		return (
			<div style={styles.outer}>
				<div style={styles.header}>Log In as</div>
				<div style={styles.linkWrapper}><IndexLink style={styles.student} activeClassName='active' to='/login_popup/student'>
					Student
				</IndexLink> &nbsp;</div>
				<div style={styles.linkWrapper}><IndexLink style={styles.admin} activeClassName='active' to='/login_popup/admin'>
					Admin
				</IndexLink> &nbsp;</div>
			</div>);
	}
}

export default LoginPage;