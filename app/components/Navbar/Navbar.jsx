import React, {Component} from 'react';
import Radium from 'radium';
import _ from 'lodash';

let stylesRight = {
	outer : {
		display : "flex",
		height : "40px",
		position : "absolute",
		right : "10%"
	},
	text : {
		margin : "0px 5px",
		color : 'rgb(253, 251, 218)'
	},
	logout : {
		textDecoration : 'none'
	}
};

let stylesLeft = {
	outer : {
		fontSize : '20px',
		height : "50px",
		position : "relative",
		backgroundColor :  'rgb(53,120,81)',
		marginBottom : '50px',
		display : 'flex',
		flexDirection : 'column-reverse',
		textAlign : 'center'
	},
	header : {
		color : "rgb(203, 255, 231)",
		left : "5%",
		position : "relative",
		backgroundColor : 'rgb(53, 43,43)',
		height : '60px',
		width : '400px',
		top : '0%'
	},
	p : {
		padding : 0,
		margin : 0,
		position : 'absolute',
		top : '30%',
		left : '25%'
	}
}

// class RightBar extends Component{
// 	constructor(props){
// 		super(props);

// 	}
// 	render(){
// 		console.log(this.props);
// 		return (
// 				<div style={stylesRight.outer}>
// 					<span style={stylesRight.text}>{_.startCase(_.lowerCase(this.props.user))}</span>
// 					<span style={stylesRight.text}>{_.upperCase(this.props.course)}</span>
// 				</div>
// 			);
// 	}
// }

// class LeftBar extends Component{
// 	constructor(props) {
// 		super(props);
// 	}
// 	render() {
// 		return (
// 				<div style={stylesLeft.header}>
// 					<p style={stylesLeft.p}> PROXY <span style={stylesLeft.span}>{_.upperCase(this.props.status)}</span></p>
// 				</div>	
// 			);
// 	}
// }
const RightBar = (props) => (
		<div style={stylesRight.outer}>
			<span style={stylesRight.text}>{props.user}</span>
			<span style={stylesRight.text}>{props.course}</span>
			<a style={stylesRight.logout} href="/">logout</a>
		</div>
	);
const LeftBar = (props) => (
		<div style={stylesLeft.header}>
			<p style={stylesLeft.p}> PROXY - <span style={stylesLeft.span}>{_.upperCase(props.status)}</span></p>
		</div>
	);
class Navbar extends Component{
	constructor(props) {
		super(props);
	}
	render () {
		return (
			<div style={stylesLeft.outer}>
	 			<LeftBar status={this.props.status} />
	 			{this.props.user ? <RightBar user={this.props.user} course = {this.props.course} /> : ""}
	 		</div>
	 	);
	}
}

// const Navbar = (props) => (
// 		<div style={stylesLeft.outer}>
// 			<LeftBar status = {props.status} />
// 			<RightBar user = {props.user} course = {props.course} />
// 		</div>
// 	);

export default Navbar;