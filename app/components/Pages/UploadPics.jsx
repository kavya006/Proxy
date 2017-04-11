import React, {Component} from 'react';
import moment from 'moment';
import Modal from 'react-modal';
import _ from 'lodash';
import $ from 'jquery';
import ReactDOM from 'react-dom';

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
			width : '650px',
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
			left : "22%",
			position : "relative",
			backgroundColor : 'rgb(53, 43,43)',
			height : '40px',
			width : '350px',
			top : '0%'
		},
		text : {
			padding : 8,
			margin : 0,	
		}
	}
}

Array.prototype.diff = function(a, debug){
	if(a || (a && a.length == 0))
		return this;
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

class PicsList extends Component {concat
	constructor(props) {
		super(props);
		this.files = [];
		this.state = {showPicsList : false, data : [], file : []};
		this.handleMore = this.handleMore.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleSubmitFinal = this.handleSubmitFinal.bind(this);
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
				console.log(x.files[i]);
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

	handleSubmit(){
		this.setState({showPicsList : this.state.showPicsList ? false : true , data : this.state.data});
	}
	handleSubmitFinal(){
		this.files = this.files.diff(this.state.data, "handleSubmitFinal");
		// console.log(this.state.data.concat(this.files));
		if(this.state.data || (this.state.data && this.state.data.length == 0))
			this.state.data = [];
		this.props.handlePics(this.state.data.concat(this.files));
		this.setState({showPicsList : this.state.showPicsList ? false : true , data : this.files});
	}
	render () {
		return (
				<div style={{textAlign : 'center', display : 'inline'}} id="PicsList-student">
							<button style={styles.button} 
								onClick={this.handleSubmit}> Select Images </button>
							<Modal 
								isOpen = {this.state.showPicsList}
								onRequestClose = {this.handleSubmitFinal}
								style={styles.modal}
								contentLabel = 'PicsList'>
								<div style={modalClass.header.outer}>
									<div style={modalClass.header.inner}>
										<p style={modalClass.header.text}>Browse from device</p>
									</div>
								</div>
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
			);
	}
}

class UploadPics extends Component{
	constructor(props) {
		super(props);
		this.data = [];
		this.state = {data : [], newData:[]};
		this.handlePics = this.handlePics.bind(this);
		this.populateData = this.populateData.bind(this);
		this.uploadAllPics = this.uploadAllPics.bind(this);
	}

	componentDidMount() {
		let _this = this;
		let url = 'http://localhost:8000/proxyapis/GetPicturesList/?';
		let params = "date=" + moment(_this.props.params.date, "DD/MM/YYYY").format("YYYY-MM-DD") + "&courseID=" + _this.props.params.courseid;
	    $.ajax({
	      type: 'GET',
	      url:url+params,
	      headers: {"Access-Control-Request-Headers": "x-requested-with"},
	      crossDomain: true,
	      dataType: "json",
	      success: function  (data2, text, req) {
	      	if(data2.length == 0){
				_this.setState({data : [], newData : []});
	      	}
			else{
				let base_url = '/images/Test_Pictures/';
				let array = data2.split(',');
				let _data_array = [];
				for (var i = 0; i < array.length; i++) {
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
					image.setAttribute('src', base_url+array[i]);
					child.appendChild(image);
					document.getElementById("uploaded-images-parent").appendChild(child);
					_data_array.push({name: array[i]});
				}
				_this.setState({data: _data_array});

			}
	      },
	      error: function(xhr,status){
	      	// alert(status);
			_this.setState({data : [], newData : []});
	      } 
	    });
	}
	
	uploadAllPics(){
		let _this = this;
		let url = 'http://localhost:8000/proxyapis/SavePicturesList/';
		// let _data = this.state.data.concat(this.state.newData);
		let _data = this.state.data;
		let picturesList = "";
		for (var i = _data.length - 1; i >= 0; i--) {
			picturesList +=_data[i].name;
			if(i != 0)
				picturesList += ',';
		};
		let data = {};
		data["date"] = moment(_this.props.params.date, "DD/MM/YYYY").format("YYYY-MM-DD");
		data["courseID"] = _this.props.params.courseid;
		alert(picturesList);
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
			_this.setState({data : _data, newData : []});
	      },
	      error: function(xhr,status){
	      	alert(status);
			_this.setState({data : [], newData : []});
	      } 
	    });
	}
	populateData(){
		let x = this.state.newData;
		let a = [];
		for (var i = 0; i < x.length; i++) {
			let reader = new FileReader();
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
				document.getElementById("uploaded-images-parent").appendChild(child);
			}
			reader.readAsDataURL(x[i]);
		}
	}

	handlePics (d) {
		d = d.diff(this.state.data, "handlePics");
		this.setState({data : this.state.data.concat(d), newData : d});
	}
	render(){
		this.populateData()
		return (
			<div>
				<h2 style={{marginRight : '10%', textAlign : 'right'}}>
					Showing pics for {' ' + moment(this.props.params.date, 'DD/MM/YYYY').format('DD/MM/YY')}
				</h2>
				<div>
					<PicsList func='Browse' handlePics={this.handlePics}/>
					<div id="uploaded-images-parent"></div>
					<button onClick={this.uploadAllPics}>Upload</button>
				</div>
			</div>);
	}
}

export default UploadPics;
