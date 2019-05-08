import { AsyncStorage } from 'react-native'
import Axios from 'axios'
import BackgroundTimer from 'react-native-background-timer';

var PushNotification = require('react-native-push-notification')
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
          facticleQueue: 1,
          factileRate: 1,
          nextFacticle: false,
          seenFacticles: [],
          journey: {},
          categories: [],
          timer: ""
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

      Axios.get( "https://inmyseat.chronicle.horizon.ac.uk/api/v1/allcats" )
      .then( response => this.state.categories = response.data )
      
      if(this.state.timer.length < 1 ){
        console.log("Setting timer")
        this.state.timer = BackgroundTimer.setInterval(() => {
          console.log(this.state.facticleQueue)
          let newTime = this.state.facticleQueue - 1
          if(newTime > 0){
            this.state.facticleQueue = newTime
          }
          else {
            this.state.facticleQueue = this.state.factileRate
            this.state.nextFacticle = true
          }
        }, 1000)
      }

      this.setRate      = this.setRate    .bind(this)
      this.queue        = this.queue      .bind(this)
      this.testNotif    = this.testNotif  .bind(this)
      this.sendNotif    = this.sendNotif  .bind(this)
      this.loadJourney  = this.loadJourney.bind(this)
      this.checkDist    = this.checkDist  .bind(this)
      this.seen         = this.seen       .bind(this)
  }

  queue(item){
    let free = false
    //if(!this.state.seenFacticles.includes(item + "testNotif")){

    if( this.state.nextFacticle){
      console.log("Current queue: " + this.state.facticleQueue)
      this.state.nextFacticle = false
      free = true
    }
    else {
      console.log("Notif limit reached for now")
      free = false
    }
  /*
  }
  
  else{
    console.log("Seen")
  }*/

    return free
  }

  setRate(item){
    this.state.factileRate = item
  }

  seen(id){
    var seen = this.state.seenFacticles
    var isSeen = false
    //var isSeen = seen.includes(id)
    for(let i = 0; i < seen.length; i++){
      if(id === seen[i]){
        isSeen = true
        break
      }
    }
    return isSeen
  }

  checkDist(position, facticle){
    var notif = false
    if(facticle.hasOwnProperty('cls')){
      console.log("Has CLS")
      let dist = geolib.getDistance({latitude: position.latitude, longitude: position.longitude}, {latitude: facticle.latitude, longitude: facticle.longitude} , 0)
      if(dist < 11){
        this.sendNotif(facticle)
        notif=true
      }
    }
    else{
      if(!this.state.seenFacticles.includes(facticle.id)){
        let dist = geolib.getDistance({latitude: position.latitude, longitude: position.longitude}, {latitude: facticle.latitude, longitude: facticle.longitude} , 0)
        if(facticle.targets.length > 0){
          let isInside = geolib.isPointInside( {latitude: position.latitude, longitude: position.longitude}, facticle.targets[0].bounds )
          if(isInside){
            if(this.queue()){
              this.sendNotif(facticle)
              notif = true
            }
          }
        }
        else if(dist < 11){
          if(this.queue()){
            this.sendNotif(facticle)
            notif=true
          }
        }
        else{
          //console.log("Too far away")
        }
      }
    }
    
    return notif
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

    this.state.categories.map( (item,i) => {
      if(this.queue(item)){
          PushNotification.localNotification({
            message: "Test notification type: " + item, // (required)
            tag: item
          })
          this.state.seenFacticles.push(item + "testNotif")
          
      }
    } )
  }

  sendNotif(item){
    var isFacticle = false
    if(item.category !== null) isFacticle = true

    console.log(item)
    var notifSet = {
      title: isFacticle ? "Point of interest" : "Bus change",
      bigMess: isFacticle ? "Did you know you are near to " + (item.name.substring(0,2) === 'The' ? "" : "The ") + item.name : "Change to bus " + item.name,
      //mainMess : isFacticle ? item.description: "Change to bus " + item.name,
      tag: isFacticle ? item.category : "bus_change",
      group: isFacticle ? "Facticle" : "BusChange"
    }

    var loc = JSON.stringify({lat: item.latitude, lon: item.longitude})

      PushNotification.localNotification({
          largeIcon: "ic_launcher",     // (optional) default: "ic_launcher"
          smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
          bigText: notifSet.bigMess,    // (optional) default: "message" prop
          color: "#add8e6",             // (optional) default: system default
          vibrate: true,                // (optional) default: true
          vibration: 300,               // vibration length in milliseconds, ignored if vibrate=false, default: 1000
          tag: notifSet.tag,            // (optional) add tag to message
          group: notifSet.group,        // (optional) add group to message
  
          //iOS and Android properties 
          title: notifSet.title,      // (optional)
          message: notifSet.bigMess,  // (required)
          playSound: false,           // (optional) default: true
          //actions: '["Show"]',      // (Android only) See the doc for notification actions to know more
          data: loc
        })
        
      this.state.item++
      if(isFacticle)this.state.seenFacticles.push(item.id)
  }
}

export default AppMan = new Manager(); 



/*queue(item){
    let free = false
    if(!this.state.seenFacticles.includes(item + "testNotif")){

    let newQueue = this.state.facticleQueue - 1
    if( newQueue > 0){
      this.state.facticleQueue = newQueue
      console.log("Current queue: " + this.state.facticleQueue)
      free = true
    }
    else {
      console.log("Notif limit reached for now")
      free = false
    }

  }
  else{
    console.log("Seen")
  }

    return free
  }*/