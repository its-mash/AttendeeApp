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
    // Orientation.lockToLandscape()
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
     Orientation.lockToLandscape()
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
    if(rectangles)
    rectangles.forEach((rect)=>{
      const styles={
        position:'absolute',
        top:rect.top,
        left:rect.left,
        height:rect.height,
        width:rect.width,
        borderWidth:1,
        borderColor: 'crimson',
        flexDirection:'column',
        justifyContent:'center',
        zIndex:4
      }
      views.push(<View style={styles} key={rect.callName}><Text style={{textAlign:'center',color:'green',fontSize:25,justifyContent:'center' }}>{rect.callName}</Text></View>)
      console.log(rect);
    });
    return views
  }
  retake(){
    this.setState({rectangles:[],submit:false})
    this.camera.resumePreview()
  }
  submit(){
    const {rectangles}=this.state;
    const qrcode = this.state.key;
    const personId=[]
    rectangles.forEach(rect=>personId.push(rect.id))
    console.log(personId)
    console.log("submitting");
    fetch('https://aiattendance.com/record', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key:qrcode,
          ids:personId
        }),
      })
      .then(async (response)=>{
        const text = await response.text();
        console.log(text)
      })
      .catch((error)=>{
          console.log(error)
      })
  }
  renderButton(){
    const {submit}=this.state;
    if(submit){
      return(
        <View style={{ flex:1, height:'100%',flexDirection:'column',position: 'absolute',justifyContent:'center'}}>
          <View style={{ flex:0,zIndex:5}}>
                <TouchableOpacity onPress={this.retake.bind(this)} style={styles.capture}>
                  <Text style={{ fontSize: 14 }}> Retake </Text>
                </TouchableOpacity>
          </View>
          <View style={{flex:0,zIndex:5}}>
                  <TouchableOpacity onPress={this.submit.bind(this)} style={styles.capture}>
                    <Text style={{ fontSize: 14 }}> Submit </Text>
                  </TouchableOpacity>
          </View>
        </View>
      )
    }
    else
     return(
      <View style={{ flex:1, height:'100%',flexDirection:'column',position: 'absolute',justifyContent:'center',zIndex:5}}>
              <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
                <Text style={{ fontSize: 14 }}> SNAP </Text>
              </TouchableOpacity>
      </View>
    )
  }
  cameraView(){
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
          {this.renderRectangles()}
          {this.renderButton()}
    
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
        if(rectangles!=undefined || rectangles.length!=0)
          this.setState({rectangles,submit:true})
        else{
          console.log("No face found, resuming")
          console.log(this.camera.resumePreview())
        }
          
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
    justifyContent: 'flex-end'
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