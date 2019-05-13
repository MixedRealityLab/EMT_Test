import { AsyncStorage, DeviceEventEmitter } from 'react-native'
import Axios from 'axios'
import BackgroundTimer from 'react-native-background-timer';

var PushNotification = require('react-native-push-notification')
import PushNotificationAndroid from 'react-native-push-notification'

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
          Date: new Date(),
          item: 0,
          loaded: false,
          facticles: [],
          facticleQueue: 1,
          factileRate: 1,
          nextFacticle: false,
          seenFacticles: [],
          seenLimit: 50,
          journey: {},
          categories: [],
          timer: ""
      }

      PushNotification.configure({
          // (required) Called when a remote or local notification is opened or received
          onNotification: function(notification) {
            // Register all the valid actions for notifications here and add the action handler for each action
            
          },
        permissions: {
          alert: true,
          badge: true,
          sound: true
        }
      })
      //AsyncStorage.setItem("seenFacticles","[]")
      AsyncStorage.getAllKeys( (err,res) => console.log(res) ).catch(err => console.log(err))
      AsyncStorage.getItem('travel',(err,res)=>console.log(res))
      Axios.get( "https://inmyseat.chronicle.horizon.ac.uk/api/v1/allcats" )
      .then( response => this.state.categories = response.data )
      .catch(err => console.log(err))
      
      AsyncStorage.getItem("seenFacticles", (err,res)=>{ let obj = JSON.parse(res); console.log(obj); this.state.seenFacticles = obj })
      .catch(err => console.log(err))

      if(this.state.timer.length < 1 ){
        console.log("Setting timer")
        this.state.timer = BackgroundTimer.setInterval(() => {
          //console.log(this.state.facticleQueue)
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
      this.updateSeen   = this.updateSeen .bind(this)
      this.checkSeen    = this.checkSeen  .bind(this)
  }

  queue(){
    let free = false
    if( this.state.nextFacticle){
      console.log("Current queue: " + this.state.facticleQueue)
      this.state.nextFacticle = false
      free = true
    }
    else {
      console.log("Notif limit reached for now")
      free = false
    }
    return free
  }

  setRate(item){
    this.state.factileRate = item
  }

  checkSeen(id){
    let isSeen = false
    for(let i = 0; i < this.state.seenFacticles.length; i++){
      //Stop checking seen facticles after a point
      if(i > this.state.seenLimit) break
      if(this.state.seenFacticles[i].id === id){isSeen = true; console.log("Seen Facticle"); break}
    }
    return isSeen
  }

  updateSeen(item){
    //Current Day
    let TD = this.state.Date.getDate()
    if(String(TD).length === 1) TD = "0" + TD
    //Current Month
    let TM = this.state.Date.getMonth() + 1
    if(String(TM).length === 1) TM = "0" + TM 
    //Current Year
    let TY = this.state.Date.getFullYear()
    //Current Hour
    let TH = this.state.Date.getHours()
    if(String(TH).length === 1) TH = "0" + TH
    //Current Mins
    let TMn = this.state.Date.getMinutes()
    if(String(TMn).length === 1) TMn = "0" + TMn
    
    let setDate = {Date: TD + ":" + TM + ":" + TY , Time: TH + ":" + TMn}

    let newItem = Object.assign(item, setDate)
    console.log(newItem)
    let temp = []
    temp.push(newItem)
    let newArr = temp.concat(this.state.seenFacticles)
    this.state.seenFacticles = newArr

    AsyncStorage.setItem('seenFacticles', JSON.stringify(this.state.seenFacticles))
  }

  checkDist(position, facticle){
    var notif = false
    if(facticle.hasOwnProperty('cls')){
      let dist = geolib.getDistance({latitude: position.latitude, longitude: position.longitude}, {latitude: facticle.latitude, longitude: facticle.longitude} , 0)
      if(dist < 70){
        this.sendNotif(facticle)
        notif=true
      }
    }
    else{
      if(!this.checkSeen(facticle.id)){
        let dist = geolib.getDistance({latitude: position.latitude, longitude: position.longitude}, {latitude: facticle.latitude, longitude: facticle.longitude} , 0)
        if(facticle.hasOwnProperty('targets')){
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

  loadJourney(item){
    if(!this.state.loaded){
      var currJ = ''
      console.log("Loading")
      AsyncStorage.getItem('facticles', (err,res) => { let obj = JSON.parse(res); /*console.log(obj);*/ this.state.facticles = obj } )
      .catch(err => console.log(err))
      
      if(item !== null){
        AsyncStorage.getItem(item,(err,res) =>{ let obj = JSON.parse(res); this.state.journey = obj; this.state.loaded = true } )
        .catch(err => console.log(err))
      }
      else{
        AsyncStorage.getItem('CurrentJ', (err,res) => {console.log(res); currJ = res} )
      .then( () => {
        AsyncStorage.getItem(currJ,(err,res) =>{ let obj = JSON.parse(res); this.state.journey = obj; this.state.loaded = true } )
        .catch(err => console.log(err))
      } )
      .catch(err => console.log(err))
      }
      
    }
    console.log("AppMan: ")
    console.log(this.state.journey)
    return this.state.loaded
  }

  testNotif(){

    for(let i = 0; i < 5; i++){
      let pos = JSON.stringify({lat: i* 20, lon:i* 20})
      PushNotification.localNotification({
        message: "Test notification type: Test" + (i * 20), // (required)
        data: pos
      })
    }
  }

  sendNotif(item){
    var isFacticle = false
    if(item.hasOwnProperty('category')) isFacticle = true

    console.log(item)
    var notifSet = {
      title: isFacticle ? "Point of interest" : "Bus change",
      bigMess: isFacticle ? "Did you know you are near to " + (item.name.substring(0,2) === 'The' ? "" : "The ") + item.name : "Change to bus " + item.name,
      //mainMess : isFacticle ? item.description: "Change to bus " + item.name,
      tag: isFacticle ? item.category : "bus_change",
      group: isFacticle ? "Facticle" : "BusChange"
    }

    let data = {lat: item.latitude, lon: item.longitude}
    let desc = ''
    if(item.hasOwnProperty('description')){
      desc = {desc: item.description}
      data = Object.assign(data,desc)
    }
    var loc = JSON.stringify(data)

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
      if(isFacticle) this.updateSeen(item)
  }
}

export default AppMan = new Manager(); 