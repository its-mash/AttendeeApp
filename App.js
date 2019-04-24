'use strict';

import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';

export default class App extends Component {

  onSuccess(e) {
    console.log(e)
    // Linking
    //   .openURL(e.data)
    //   .catch(err => console.error('An error occured', err));
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
    .then((res)=>{
      // console.log("55555555555555555555")
      // console.log(res);
      if(res=="valid")
        console.log("valid QR code")
      else
        console.log("invalid QR code")
    })
    .catch((error)=>{
        console.log(error)
    })
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