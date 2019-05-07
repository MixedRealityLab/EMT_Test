import { AppRegistry, AsyncStorage } from 'react-native'

import Axios from 'axios';

import { name as appName } from './app.json'
import App from './app/Menu.js'
import LocMan from './app/src/components/BackgroundService.js'
import StateMan from './app/src/components/StateCheck.js'


const StateManager = new StateMan();

const Notif = async (data) => {
  if(StateManager.returnState() !== 'active'){
    LocMan.startScan()
  }
}

const initialise = async () => {

  AsyncStorage.getItem(
    'username', (err, res) => {
      if (res == null) {
        Axios.get('https://inmyseat.chronicle.horizon.ac.uk/api/v1/newuser')
            .then(
              response => {
                AsyncStorage.setItem('username', response.data.id)
                AsyncStorage.setItem('password', response.data.password)
              }
            )
      }
    }
  );

  AsyncStorage.getItem(
    'Setting', (err, res) => {
      if (res == null) {
        let obj = { Direct: true, Facticle: true, Filter: [], NotifRate: 1 };
        AsyncStorage.setItem('Setting', JSON.stringify(obj));
      }
    }
  );

  AsyncStorage.getItem(
    'VisPOIS', (err, res) => {
      if (res == null) {
        AsyncStorage.setItem('VisPOIS', JSON.stringify([]));
      }
    }
  );

  AsyncStorage.getItem(
    'facticles', (err, res) => {
      if (res == null) {
        AsyncStorage.setItem('facticles', JSON.stringify([]));
      }
    }
  );

};
initialise();

AppRegistry.registerComponent(appName, () => App)
AppRegistry.registerHeadlessTask(
    'Notif',
    () => Notif.bind(null, [LocMan, StateManager]));
