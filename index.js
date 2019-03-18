/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import {AppRegistry} from 'react-native';
import App from './app/App';
import {name as appName} from './app.json';

var PushNotification = require('react-native-push-notification');

AppRegistry.registerComponent(appName, () => App);

const Notif = async (data) => {
    console.log("Background Service")
    Manager = new Manager()
    
    
}
AppRegistry.registerHeadlessTask('Notif', () => Notif);

export default class Manager {
    constructor(){
        this.state ={
            item: 0
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

        this.sendNotif = this.sendNotif.bind(this)
        this.intervalID = setInterval( () => this.sendNotif(), 5000);
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
    
            /* iOS and Android properties */
            title: "Bus Change", // (optional)
            message: "Change to bus " + this.state.item, // (required)
            playSound: false, // (optional) default: true
            soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
            number: '10', // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
            actions: '["Yes", "No"]',  // (Android only) See the doc for notification actions to know more
          })
        this.setState({item: this.state.item++})
    }
}