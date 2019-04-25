/**
 * @format
 */

import {AppRegistry} from 'react-native';
import QRcodeApp from './QRcodeApp';
import CameraApp from './CameraApp'
import {name as appName} from './app.json';
import { createStackNavigator, createAppContainer } from "react-navigation";

const AppNavigator = createStackNavigator(
  {
    HomeScreen: {
        screen:QRcodeApp,
        navigationOptions: {
            header: null,
        }
    },
    SelfieScreen: {
        screen:CameraApp,
        navigationOptions: {
            header: null,
        }
    }
  },
  {
    initialRouteName: "HomeScreen"
  }
);
const AppContainer= createAppContainer(AppNavigator);
AppRegistry.registerComponent(appName, () => AppContainer);
