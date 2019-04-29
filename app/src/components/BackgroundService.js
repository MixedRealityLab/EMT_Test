import { AsyncStorage } from 'react-native'
import Geolocation from 'react-native-geolocation-service'
import BackgroundTimer from 'react-native-background-timer';
import AppMan from './NotifMan'

class LocationManager{
  constructor(){
      this.state ={
          item: 0,
          running: false,
          interval: "",
          settings: {}
      }

      this.clean = this.clean.bind(this) 
      this.getLoc = this.getLoc.bind(this)
  }

  clean(){
    console.log("Running: " + this.state.running)
    if(this.state.running){
      console.log("Cleaning Background Service")
      BackgroundTimer.clearTimeout(this.state.interval)
      this.state.running = false
    }
  }

  startScan(){
    if(!this.state.running){
        console.log("Start Scan")
        this.state.running = true
        
        AsyncStorage.getItem('Setting', (err,res) => {
          let obj = JSON.parse(res); this.state.settings = obj; console.log(this.state.settings);
        } )
        .then(
          AsyncStorage.getItem(
            'travel', (err, res) => {
              if(res === 'true'){
                AppMan.loadJourney()
                console.log("Checking")
                //Create background timer and execute every 5000ms (5 seconds)
                this.state.interval = BackgroundTimer.setInterval(() => {
                  this.getLoc()
                  console.log('Item: ' + this.state.item);
                  this.state.item++
              }, 5000)
              }
              else AppMan.state.loaded = false
            }
          )
        )
        
    }
  }
  
  getLoc(){
    Geolocation.getCurrentPosition(
        (position) => {
            console.log(position);
            if(this.state.settings.Facticle && this.state.running){
              console.log("Checking facticles")
              AppMan.state.facticles.map( (item) => AppMan.checkDist(position.coords, item) )
            }

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

/*
.then(
    () => {
      if(Settings.Direct){
        navigator.geolocation.getCurrentPosition((position) => {
          //console.log(position.coords)
          AsyncStorage.getItem(
            'travel', (err, res) => {
              if(res === 'true'){
                AppMan.loadJourney()
                console.log("Checking")
                if(Settings.Facticle) AppMan.state.facticles.map( (item) => AppMan.checkDist(position.coords, item) )
              }
              else AppMan.state.loaded = false
            }
          )
         })
      }
    }
  )
*/