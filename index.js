/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import { AppRegistry, AsyncStorage } from 'react-native'
import App from './app/Menu'
import { name as appName } from './app.json'
import StateMan from './app/src/components/StateCheck'
import AppMan from './app/src/components/NotifMan'

/**
 * Entry point to app
 * Here is where the headless JS task runs
 */

const StateManager = new StateMan();

AppRegistry.registerComponent(appName, () => App)

const Notif = async (data) => {
  if(StateManager.returnState() !== 'active'){
    console.log("Background")
    var Settings = {}
    AsyncStorage.getItem('Setting', (err,res) => {
      let obj = JSON.parse(res); Settings = obj; console.log(Settings);
    } )
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
    
  }     
}
AppRegistry.registerHeadlessTask('Notif', () => Notif.bind(null, [AppMan, StateManager]))
