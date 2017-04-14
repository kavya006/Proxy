import React, {Component} from 'react';
import Navbar from '../Navbar/Navbar.jsx';

// value={'add' + (this.state.data.length == 0 ? ' ' : ' more ') + 'images'}
let styles = {
	outer : {
		position: "absolute",
		top: "50%",
		width: "1366px",
		textAlign: "center"
	},
	student : {
		margin: "10px 50px 10px 10px",
		display: "inline",
		position: "absolute",
		right: "30%"
	},
	admin : {
		margin : "10px 10px 10px 50px",
		display: "inline",
		position: "absolute",
		left: "30%"
	}
};
class GenPage extends Component{

	constructor(props) {
		super(props);
		this.sendPic = this.sendPic.bind(this);
	}

	sendPic() {
	    var file = myInput.files[0];

	    // Send file here either by adding it to a `FormData` object 
	    // and sending that via XHR, or by simply passing the file into 
	    // the `send` method of an XHR instance.
	}
	
	render(){
		return (
			<div>
				<Navbar />
			</div>);
	}
}

export default GenPage;