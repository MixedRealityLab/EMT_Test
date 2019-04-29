import { AsyncStorage } from 'react-native';

var PushNotification = require('react-native-push-notification');
var geolib = require('geolib')

/**
 * Notifications manager class
 * This class handles sending notifications to the user
 * It is unique for the app, so when the app is started, only one instance will be present
 * This means it can keep coherency between the background service and foreground
 */
class Manager{
  constructor(){
      this.state ={
          item: 0,
          loaded: false,
          facticles: [],
          seenFacticles: [],
          journey: {}
      }

      PushNotification.configure({
          // (required) Called when a remote or local notification is opened or received
          onNotification: function(notification) {
            console.log( 'NOTIFICATION:', notification )
            console.log("Lat: " + notification.data.lat + ", Lon: " + notification.data.lon)
            
        },
        permissions: {
          alert: true,
          badge: true,
          sound: true
        }
      })
      
      AsyncStorage.getAllKeys( (err,res) => console.log(res) )
      
      this.testNotif = this.testNotif.bind(this)
      this.sendNotif = this.sendNotif.bind(this)
      this.loadJourney = this.loadJourney.bind(this)
      this.checkDist = this.checkDist.bind(this)
      this.seen = this.seen.bind(this)
  }
  

  seen(id){
    var seen = this.state.seenFacticles
    var isSeen = false
    for(let i = 0; i < seen.length; i++){
      if(id === seen[i]){
        isSeen = true
        break
      }
    }
    return isSeen
  }

  checkDist(position, facticle){
    if(!this.seen(facticle.id)){

      let dist = geolib.getDistance({latitude: position.latitude, longitude: position.longitude}, {latitude: facticle.latitude, longitude: facticle.longitude} , 0)
      if(facticle.targets.length > 0){
        let isInside = geolib.isPointInside( {latitude: position.latitude, longitude: position.longitude}, facticle.targets[0].bounds )
        console.log(isInside)
        if(isInside){
          this.sendNotif(facticle)
          this.state.seenFacticles.push(facticle.id)
        }
      }
      if(dist < 11){
        this.sendNotif(facticle)
        this.state.seenFacticles.push(facticle.id)
      }
      else{
        //console.log("Too far away")
      }
    }
  }

  loadJourney(){
    if(!this.state.loaded){
      var currJ = ''
      console.log("Loading")
      AsyncStorage.getItem('facticles', (err,res) => { let obj = JSON.parse(res); /*console.log(obj);*/ this.state.facticles = obj } )
      AsyncStorage.getItem('CurrentJ', (err,res) => {console.log(res); currJ = res} )
      .then( () => {
        AsyncStorage.getItem(currJ,(err,res) =>{ let obj = JSON.parse(res); this.state.journey = obj } ) 
      } )
      this.state.loaded = true
    }
  }

  testNotif(){
    PushNotification.localNotification({
      message: "Test Notifcation" // (required)
    })
  }

  sendNotif(item){
    var isFacticle = false
    if(item.category !== null){
      isFacticle = true
    }
    console.log(item)
    var notifSet = {
      title: isFacticle ? "Point of interest" : "Bus change",
      bigMess: isFacticle ? item.name : "Change to bus " + item.name,
      mainMess : isFacticle ? item.description: "Change to bus " + item.name,
      tag: isFacticle ? "facticle" : "bus_change",
      group: isFacticle ? "Facticle" : "BusChange"
    }

    var loc = JSON.stringify({lat: item.latitude, lon: item.longitude})

      PushNotification.localNotification({
          largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
          smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
          bigText: notifSet.bigMess, // (optional) default: "message" prop
          color: "#add8e6", // (optional) default: system default
          vibrate: true, // (optional) default: true
          vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
          tag: notifSet.tag, // (optional) add tag to message
          group: notifSet.group, // (optional) add group to message
  
           //iOS and Android properties 
          title: notifSet.title, // (optional)
          message: notifSet.mainMess, // (required)
          playSound: false, // (optional) default: true
          //actions: '["Show"]',  // (Android only) See the doc for notification actions to know more
          data: loc
        })
      this.state.item++
  }
}

export default AppMan = new Manager(); 