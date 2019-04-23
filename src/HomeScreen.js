import React, { Component } from 'react';
import { FormGroup, Modal, Label, ModalHeader, ModalBody } from 'reactstrap';

const initial = {
  textOne: '',
  textTwo: '',
  textThree: '',
  textOneX: '50%',
  textOneY: '10%',
  textTwoX: '50%',
  textTwoY: '45%',
  textThreeX: '50%',
  textThreeY: '90%',
  isTextOneMovable: false,
  isTextTwoMovable: false,
  isTextThreeMovable: false,
  black: false,
  red: false,
  white: false
}

const images = [
  { src: '/assets/meme1.jpg' },
  { src: '/assets/meme2.jpg' },
  { src: '/assets/meme3.jpg' },
  { src: '/assets/meme4.jpg' },
  { src: '/assets/meme5.jpg' },
  { src: '/assets/meme6.jpg' },
  { src: '/assets/meme7.jpg' },
  { src: '/assets/meme8.jpg' },
  { src: '/assets/meme9.jpg' },
  { src: '/assets/meme10.jpg' },
  { src: '/assets/meme11.jpg' },
  { src: '/assets/meme12.jpg' },
  { src: '/assets/meme13.png' },
  { src: '/assets/meme14.png' },
  { src: '/assets/meme15.png' },
  { src: '/assets/meme16.png' },
  { src: '/assets/meme17.jpg' },
  { src: '/assets/meme18.png' },
  { src: '/assets/meme19.png' },
  { src: '/assets/meme20.png' }
];

class HomeScreen extends Component {
  constructor() {
    super();
    this.state = {
      currentImage: 0,
      // selectedImage: null,
      isModalOpen: false,
      ...initial
    };
  }

  onOpenImage = (i) => {
    const image = images[i];
    const originalImage = new Image();
    originalImage.src = image.src;
    const base64 = this.getSelectedImage(originalImage);
    this.setState(prevState => ({
      currentImage: i,
      isModalOpen: !prevState.isModalOpen,
      selectedImage: base64,
      ...initial
    }));
  }

  getSelectedImage(image) {
    var canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    var drawOnCanvas = canvas.getContext("2d");
    drawOnCanvas.drawImage(image, 0, 0);
    var imageDataURL = canvas.toDataURL("image/jpg");
    return imageDataURL;
  }

  onModalCheck = () => {
    this.setState(prevState =>
      ({
        isModalOpen: !prevState.isModalOpen
      })
    );
  }

  onChangeText = (event) => {
    this.setState({
      [event.currentTarget.name]: event.currentTarget.value
    });
  }

  onDragText = (e, id) => {
    let rect = this.imageRef.getBoundingClientRect();
    const xTextPosition = e.clientX - rect.left;
    const yTextPosition = e.clientY - rect.top;
    let objectSetState = {};
    if (id === 'text1') {
      objectSetState = {
        isTextOneMovable: true,
        isTextTwoMovable: false,
        isTextThreeMovable: false,
        textOneX: `${xTextPosition}px`,
        textOneY: `${yTextPosition}px`
      }
    } else if (id === 'text2') {
      objectSetState = {
        isTextTwoMovable: true,
        isTextOneMovable: false,
        isTextThreeMovable: false,
        textTwoX: `${xTextPosition}px`,
        textTwoY: `${yTextPosition}px`
      }
    } else if (id === 'text3') {
      objectSetState = {
        isTextOneMovable: false,
        isTextTwoMovable: false,
        isTextThreeMovable: true,
        textThreeX: `${xTextPosition}px`,
        textThreeY: `${yTextPosition}px`
      }
    }
    return objectSetState;
  }

  onMouseDown = (e, id) => {
    const objectSetState = this.onDragText(e, id);
    document.addEventListener('mousemove', (event) => this.onMouseMove(event, id));
    this.setState({
      ...objectSetState
    })
  }

  onMouseUp = (event) => {
    document.removeEventListener('mousemove', this.onMouseMove);
    this.setState({
      isTextOneMovable: false,
      isTextTwoMovable: false,
      isTextThreeMovable: false
    });
  }

  onMouseMove = (e, id) => {
    if (this.state.isTextOneMovable || this.state.isTextTwoMovable || this.state.isTextThreeMovable) {
      let objectSetState = {};
      if (id === 'text1' && this.state.isTextOneMovable) {
        objectSetState = this.onDragText(e, id);
      } else if (id === 'text2' && this.state.isTextTwoMovable) {
        objectSetState = this.onDragText(e, id);
      } else if (id === 'text3' && this.state.isTextThreeMovable) {
       objectSetState = this.onDragText(e, id);
      }
      this.setState({
        ...objectSetState
      });
    }
  };

  convertSVGToImage = () => {
    const svgFile = this.svg;
    let svgData = new XMLSerializer().serializeToString(svgFile);
    const canvas = document.createElement("canvas");
    canvas.setAttribute("id", "canvas");
    const svgFileSize = svgFile.getBoundingClientRect();
    canvas.width = svgFileSize.width;
    canvas.height = svgFileSize.height;
    const finalImage = document.createElement("img");
    finalImage.setAttribute("src", "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData))));
    finalImage.onload = function() {
      canvas.getContext("2d").drawImage(finalImage, 0, 0);
      const canvasdata = canvas.toDataURL("image/jpg");
      const aHrefLink = document.createElement("a");
      aHrefLink.download = "NewMeme.jpg";
      aHrefLink.href = canvasdata;
      document.body.appendChild(aHrefLink);
      aHrefLink.click();
    };
  }

  onBlackButtonPress() {
    const objectSetState = {
      black : true,
      red: false,
      white: false
    };
    this.setState({
      ...objectSetState
    })
  }

  onRedButtonPress() {
    const objectSetState = {
      red : true,
      black: false,
      white: false
    };
    this.setState({
      ...objectSetState
    })
  }

  onWhiteButtonPress() {
    const objectSetState = {
      white : true,
      red: false,
      black: false
    };
    this.setState({
      ...objectSetState
    })
  }

  render() {
    const image = images[this.state.currentImage];
    const originalImage = new Image();
    originalImage.src = image.src;
    var modalImageSize = originalImage.width / originalImage.height;
    var newWidth = 600;
    var newHeight = newWidth / modalImageSize;
    const textStyle = {
      fontFamily: "Arial",
      fontSize: "50px",
      fill: "#FFF"
    }

    return (
      <div>
        <div className="header">
          Meme Creator with React.js
        </div>
        <hr />
          <div className="container">
            {
              images.map((image, i) => (
              <div className="imageContainer" key={image.src}>
                <img
                  style={{
                    width: "100%",
                    height: "100%",
                    cursor: "pointer",
                  }}
                  alt={i}
                  src={image.src}
                  onClick={() => this.onOpenImage(i)}
                />
              </div>
              ))
            }
          </div>
        <Modal isOpen={this.state.isModalOpen} className="modalContainer" backdrop="static">
          <ModalHeader toggle={this.onModalCheck} className="modalHeader">Editor</ModalHeader>
          <ModalBody className="modalBodyStyle">
            <div className="modalFormStyle">
              <FormGroup>
                <Label for="textOne">Choose a color:</Label>
                <br/>
                <button onClick={() => this.onBlackButtonPress()} className="btn btn-dark colorButtons">
                  Black
                </button>
                <button onClick={() => this.onRedButtonPress()} className="btn btn-danger colorButtons">
                  Red
                </button>
                <button onClick={() => this.onWhiteButtonPress()} className="btn btn-secondary colorButtons">
                  White
                </button>
              </FormGroup>
                <FormGroup>
                  <Label for="textOne">Text Line 1</Label>
                  <input className="inputStyle" type="text" name="textOne" id="textOne" placeholder="Line 1" onChange={this.onChangeText} />
                </FormGroup>
                <FormGroup>
                  <Label for="textTwo">Text Line 2</Label>
                  <input className="inputStyle" type="text" name="textTwo" id="textTwo" placeholder="Line 2" onChange={this.onChangeText} />
                </FormGroup>
                <FormGroup>
                  <Label for="textThree">Text Line 3</Label>
                  <input className="inputStyle" type="text" name="textThree" id="textThree" placeholder="Line 3" onChange={this.onChangeText} />
                </FormGroup>
                <button onClick={() => this.convertSVGToImage()} className="btn btn-outline-primary">Download</button>
            </div>
            <svg
              width={newWidth}
              height={newHeight}
              ref={el => { this.svg = el }}
            >
              <image
                ref={el => { this.imageRef = el }}
                height={newHeight}
                width={newWidth}
                xlinkHref={this.state.selectedImage}
              />
              <text
                style={{
                  ...textStyle,
                  fill: this.state.black ? "#000000" : this.state.red ? "#FF0000" : this.state.white ? "#FFFFFF" : "#FFFFFF"
                }}
                x={this.state.textOneX}
                y={this.state.textOneY}
                onMouseDown={event => this.onMouseDown(event, 'text1')}
                onMouseUp={event => this.onMouseUp(event, 'text1')}
              >
                {this.state.textOne}
              </text>
              <text
                style={{
                  ...textStyle,
                  fill: this.state.black ? "#000000" : this.state.red ? "#FF0000" : this.state.white ? "#FFFFFF" : "#FFFFFF"
                }}
                x={this.state.textTwoX}
                y={this.state.textTwoY}
                onMouseDown={event => this.onMouseDown(event, 'text2')}
                onMouseUp={event => this.onMouseUp(event, 'text2')}
              >
                {this.state.textTwo}
              </text>
              <text
                style={{
                  ...textStyle,
                  fill: this.state.black ? "#000000" : this.state.red ? "#FF0000" : this.state.white ? "#FFFFFF" : "#FFFFFF"
                }}
                x={this.state.textThreeX}
                y={this.state.textThreeY}
                onMouseDown={event => this.onMouseDown(event, 'text3')}
                onMouseUp={event => this.onMouseUp(event, 'text3')}
              >
                {this.state.textThree}
              </text>
            </svg>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

export default HomeScreen;
