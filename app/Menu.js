import React from "react"
import { View, PermissionsAndroid, AsyncStorage, StyleSheet, DeviceEventEmitter } from "react-native"
import { createAppContainer, createDrawerNavigator } from "react-navigation"
import App from './App'
import Info from './src/Info.js'
import Settings from './src/Settings'
import Axios from "axios";
import PushNotificationAndroid from 'react-native-push-notification'

/**
 * Drawer Navigation screens
 * Add new options for drawer here
 */

/**
 * Ask for location permission
 * Add any other permissions to be asked for on app startup here
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
/**
 * Screen for main components of the app
 */
class Lobby extends React.Component {
    static navigationOptions = {
      drawerLabel: 'Home',
    };

    componentDidMount(){
      requestLocationPermission()

      /*PushNotificationAndroid.registerNotificationActions(['Show']);
      DeviceEventEmitter.addListener('notificationActionReceived', function(action){
      console.log ('Notification action received: ' + action);
      const info = JSON.parse(action.dataJSON);
      if (info.action == 'Show') {
        console.log("Notif!")
      }
      else{
        console.log("Nothing")
      }
      });*/

      //Look for a username in async storage, if none are found, ask server for a username and password
      AsyncStorage.getItem(
        'username', (err, res) => {
          if(res !== null)
          {
            console.log("Username Found")
            console.log(res)
          }
          else{
            console.log("No Username")
            Axios.get("https://inmyseat.chronicle.horizon.ac.uk/api/v1/newuser")
            .then( 
              response => { 
                console.log(response)
                AsyncStorage.setItem('username', response.data.id)
                AsyncStorage.setItem('password', response.data.password)
              }
            )
          }
        } 
      )
      //Look for the settings object inside async storage, if not found, create one
      AsyncStorage.getItem(
        'Setting', (err,res) => {
          if(res !== null){
            console.log("Settings found")
            console.log(JSON.parse(res))
          }
          else{
            console.log("No settings found")
            let obj = { Direct: true, Facticle: true, Filter: [], NotifRate: 1 }
            console.log(JSON.stringify(obj))
            AsyncStorage.setItem('Setting', JSON.stringify(obj))
          }
        }
      )
      //Look for VisPOIS object inside async storage, if not found, create one
      AsyncStorage.getItem(
        'VisPOIS', (err,res) => {
          if(res !== null){
            console.log("VisPOIS found")
          }
          else{
            console.log("No VisPOIS found")
            AsyncStorage.setItem('VisPOIS', JSON.stringify([]))
          }
        }
      )
      //Temp function to load up facticles, will be changed later
      AsyncStorage.getItem(
        'facticles', (err,res) => {
          if(res !== null){
            console.log("Facticles found")
          }
          else{
            console.log("No facticles found")
            AsyncStorage.setItem('facticles', JSON.stringify([]))
          }
        }
      )
    }
  
    render() {
      return (
        <App />
      );
    }
  }
  /**
   * Screen for history of journeys
   * Might be removed
   */
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
  
  /**
   * Screen to change settings
   */
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