/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import { AppRegistry, AsyncStorage } from 'react-native';
import App from './app/Menu';
import { name as appName } from './app.json';

var PushNotification = require('react-native-push-notification');

class Manager{
  constructor(){
      this.state ={
          item: 0,
          travel: false
      }

      PushNotification.configure({
          // (required) Called when a remote or local notification is opened or received
          onNotification: function(notification) {
            console.log( 'NOTIFICATION:', notification )
        },
        permissions: {
          alert: true,
          badge: true,
          sound: true
        }
      })
      AsyncStorage.getAllKeys( (err,res) => console.log(res) )
      
      /*AsyncStorage.getItem(
        //this.props.jKey
        '0000'
        ,(err,res) =>{ let obj = JSON.parse(res); console.log(obj)}
      )*/
      this.sendNotif = this.sendNotif.bind(this)
      this.checkTravel = this.checkTravel.bind(this)

      this.checkTravel()
  }

  checkTravel(){
    AsyncStorage.getItem(
      'travel', (err, res) => {
        if(res === true)
        {console.log("Ye")}
        else{console.log("Ne")}
      } 
      )
  }

  sendNotif(){
      PushNotification.localNotification({
          largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
          smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
          bigText: "Change to bus " + this.state.item, // (optional) default: "message" prop
          subText: "Change", // (optional) default: none
          color: "#add8e6", // (optional) default: system default
          vibrate: true, // (optional) default: true
          //vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
          tag: 'bus_change', // (optional) add tag to message
          group: "BusChange", // (optional) add group to message
  
           //iOS and Android properties 
          title: "Bus Change", // (optional)
          message: "Change to bus " + this.state.item, // (required)
          playSound: false, // (optional) default: true
          soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
          number: '10', // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
          actions: '["Yes", "No"]',  // (Android only) See the doc for notification actions to know more
        })
      this.state.item++
  }
}

const AppMan = new Manager();

AppRegistry.registerComponent(appName, (AppMan) => App);

const Notif = async (data) => {
    console.log("Background Service")
    navigator.geolocation.getCurrentPosition((position) => {
        //console.log(position.coords);
        //AppMan.sendNotif()
        //AppMan.checkTravel()
       });
    //this.intervalID = setInterval( () => sendNotif(), 5000)
    
    /*for(let i = 0; i < 4; i++){
      console.log(i)
      //AppMan.sendNotif()
    }
    */
        
}
AppRegistry.registerHeadlessTask('Notif', () => Notif.bind(null, AppMan));
