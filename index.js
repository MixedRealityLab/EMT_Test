/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import { AppRegistry, AsyncStorage } from 'react-native'
import App from './app/Menu'
import { name as appName } from './app.json'
import StateMan from './app/src/components/StateCheck'
import LocMan from './app/src/components/BackgroundService'

/**
 * Entry point to app
 * Here is where the headless JS task runs
 */

const StateManager = new StateMan();
AppRegistry.registerComponent(appName, () => App)

const Notif = async (data) => {
  if(StateManager.returnState() !== 'active'){
    LocMan.startScan()
  }    
}
AppRegistry.registerHeadlessTask('Notif', () => Notif.bind(null, [LocMan, StateManager]))
