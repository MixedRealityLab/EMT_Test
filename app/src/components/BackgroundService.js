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
    if(this.state.running){
      BackgroundTimer.clearTimeout(this.state.interval)
      this.state.running = false
    }
  }

  startScan(){
    if(!this.state.running){
        this.state.running = true

        AsyncStorage.getItem('Setting', (err,res) => {
          let obj = JSON.parse(res);
          this.state.settings = obj;
        } )
        .then(
          AsyncStorage.getItem(
            'travel', (err, res) => {
              if(res !== 'false'){
                console.log("Background key: " + res)
                AppMan.loadJourney()
                //Create background timer and execute every 2000ms (2 seconds)
                this.state.interval = BackgroundTimer.setInterval(() => {
                  this.getLoc()
                  this.state.item++
              }, 2000)
              }
              else AppMan.state.loaded = false
            }
          )
          .catch(err => console.log(err))
        )
        .catch(err => console.log(err))
    }
  }

  getLoc(){
    Geolocation.getCurrentPosition(
        (position) => {
            if(this.state.settings.Facticle){
              AppMan.state.facticles.map((item) => {
                  if(this.state.settings.Filter.includes(item.category)) {
                    let vis = AppMan.checkDist(position.coords, item)
                    //AppMan.checkDist(position.coords, item)
                    if(vis){
                      AsyncStorage.getItem('VisPOIS', (err, res) => {

                        if(!res.includes(JSON.stringify(item)) ){
                          let temp = JSON.parse(res)
                          temp.push(item)
                          AsyncStorage.setItem('VisPOIS', JSON.stringify(this.state.VisiblePois))
                        }

                      })
                      .catch(err => console.log(err))

                    }
                  }
                })
            }
            if(this.state.settings.Direct)
            AppMan.state.journey.changes.map( (item, i) => {
              if(!item.hasOwnProperty('seen')){
                let dir = item
                let loc = AppMan.state.journey.route[i + 1][0]
                let temp = Object.assign(dir, loc)
                let seen = AppMan.checkDist(position.coords, temp)

                if(seen){
                  item = Object.assign(item, {seen:false})
                }
              }
            })
        },
        (error) => {
            // See error code charts below.
            console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }
}

export default LocMan = new LocationManager()
