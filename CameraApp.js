'use strict';
import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, TouchableOpacity, View, StatusBar } from 'react-native';
import { RNCamera } from 'react-native-camera';
import {  StackActions,NavigationActions } from 'react-navigation'
import Orientation from 'react-native-orientation';
import {Dimensions } from "react-native";
export default class CameraApp extends Component {
  constructor(props){
    super(props);
    Orientation.lockToLandscape()
    this.state = {
        count: 0,
        key:this.props.navigation.getParam('key', 'No key'),
        rectangles:[
        ],
        screenWidth:  Math.round(Dimensions.get('screen').width),
        screenHeight: Math.round(Dimensions.get('screen').height)
    }
  }
  componentWillMount(){
     
  }
  componentDidMount() {
    
    const { navigation } = this.props;
    navigation.addListener('willFocus', () =>
      this.setState({ focusedScreen: true })
    );
    navigation.addListener('willBlur', () =>
      this.setState({ focusedScreen: false })
    );
  }
  renderRectangles(){
    const {rectangles}=this.state;
    const views=[]
    rectangles.forEach((rect)=>{
      const styles={
        position:'absolute',
        top:rect.top,
        left:rect.left,
        height:rect.height,
        width:rect.width,
        borderWidth:1,
        borderColor: 'crimson',
        flexDirection:'column'
      }
      views.push(<View style={styles} key={rect.callName}><Text>{rect.callName}</Text></View>)
      console.log(rect);
    });
    return views
  }
  cameraView(){
    const {screenWidth,screenHeight}=this.state;
    return (
        <View style={styles.container}>
          <StatusBar hidden={true}/>
          <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            style={styles.preview}
            type={RNCamera.Constants.Type.front}
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
            captureAudio={false}
            zoom={0}
            ratio="16:9"
          />
          <View style={{ justifyContent: 'center', position: 'absolute',right:5, height: '100%'}}>
            <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
              <Text style={{ fontSize: 14 }}> SNAP </Text>
            </TouchableOpacity>
          </View>
          {this.renderRectangles()}
        </View>
    );
  }
  render() {
    const { hasCameraPermission, focusedScreen } = this.state;
    if (focusedScreen){
      return (this.cameraView());
    } else {
      return <View />;
    }
   
  }

  takePicture = async function() {
    const{screenWidth,screenHeight}=this.state
    const qrcode = this.state.key;
    console.log("qrcode => "+qrcode)
    console.log(screenWidth+"xxxx"+screenHeight)
    if (this.camera) {
      const options = { quality: 1, base64: true,pauseAfterCapture:true,width:screenHeight,height:screenWidth,mirrorImage:true};
      const data = await this.camera.takePictureAsync(options);
      console.log(data.width+"xxxx"+data.height);
      fetch('https://aiattendance.com/identify', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: qrcode,
          img: data.base64
        }),
      })
      .then(async (response)=>{
        const text = await response.text();
        console.log("55555555555555555555")
        const rectangles=JSON.parse(text)
        console.log(rectangles)
        this.setState({rectangles})
      })
      .catch((error)=>{
          console.log(error)
      })
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  }
});