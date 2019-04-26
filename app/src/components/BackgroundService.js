import { AsyncStorage } from 'react-native'
import Geolocation from 'react-native-geolocation-service'
var { Timer } = require('easytimer.js')
import BackgroundTimer from 'react-native-background-timer';


/**
 * Notifications manager class
 * This class handles sending notifications to the user
 * It is unique for the app, so when the app is started, only one instance will be present
 * This means it can keep coherency between the background service and foreground
 */
class LocationManager{
  constructor(){
      this.state ={
          item: 0,
          running: false,
          interval: ""
      }

      this.clean = this.clean.bind(this) 
      this.getLoc = this.getLoc.bind(this)
  }

  clean(){
    BackgroundTimer.clearTimeout(this.state.interval)
  }

  startScan(){
    if(!this.state.running){
        console.log("Start Scan")
        this.state.running = true
        
        this.state.interval = BackgroundTimer.setInterval(() => {
            // this will be executed every 200 ms
            // even when app is the the background
            this.getLoc()
            console.log('tic');
        }, 2000);
    }
  }
  
  getLoc(){
      console.log("Hey")
    Geolocation.getCurrentPosition(
        (position) => {
            console.log(position);
        },
        (error) => {
            // See error code charts below.
            console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }

}

export default LocMan = new LocationManager(); 