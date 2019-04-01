import React from "react"
import { View, PermissionsAndroid, Button, StyleSheet } from "react-native"
import { createAppContainer, createDrawerNavigator } from "react-navigation"
import App from './App'
import Info from './src/Info.js'
import Settings from './src/Settings'

/**
 * Drawer Navigation screens
 */

/**
 * Ask for location permission
 */
async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'In My Seat',
        message:
          'In My Seat needs access to your current location ' +
          'so that it can give you information about the ' +
          'surrounding area.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Access granted');
      
    } else {
      console.log('Access denied');
    }
  } catch (err) {
    console.warn(err)
  }
}

class Lobby extends React.Component {
    static navigationOptions = {
      drawerLabel: 'Home',
    };

    componentDidMount(){
      requestLocationPermission()
    }
  
    render() {
      return (
        <App />
      );
    }
  }
  
  class HistoryScreen extends React.Component {
    static navigationOptions = {
      drawerLabel: 'History',
    };
    render() {
      return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Info />
        </View>
      )
    }
  }
  
  class SetScreen extends React.Component {
    static navigationOptions = {
      drawerLabel: 'Settings',
    };
    render() {
      return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Settings />
        </View>
      )
    }
  }

  const DrawerNavigator = createDrawerNavigator({
    Home: {
      screen: Lobby,
    },
    History: {
      screen: HistoryScreen,
    },
    Settings: {
      screen: SetScreen
    }
  });
  
  export default createAppContainer(DrawerNavigator);