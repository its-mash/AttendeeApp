'use strict';

import React, { Component } from 'react';
import {  StackActions,NavigationActions } from 'react-navigation'
import Orientation from 'react-native-orientation';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';

export default class QRcodeApp extends Component {
  constructor(props){
    super(props)
    Orientation.lockToPortrait()
  }
  onSuccess(e) {
    const qrdata=e.data;
    console.log(qrdata)
    fetch('https://aiattendance.com/verifyqrcode', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: e.data,
      }),
    })
    .then(async (response)=>{
      const text = await response.text();
      console.log("55555555555555555555")
      console.log(text);
      if (text == "valid") {
        console.log("valid QR  code");
        const resetAction = StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'SelfieScreen',params:{key:qrdata} })
          ]
          });
        this.props.navigation.dispatch(resetAction);
      }
      else
        console.log("invalid QR code");
    })
    .catch((error)=>{
        console.log(error)
    })
  }
  componentWillMount(){
    
  }
  render() {
    return (
      <QRCodeScanner
        onRead={this.onSuccess.bind(this)}
        topContent={
          <Text style={styles.centerText}>
            Scan the QR code to proceed 
          </Text>
        }
        bottomContent={
          <TouchableOpacity style={styles.buttonTouchable}>
            {/* <Text style={styles.buttonText}>OK. Got it!</Text> */}
          </TouchableOpacity>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});