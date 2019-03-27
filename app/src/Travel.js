import React, {Component} from 'react'
import {StyleSheet, View, AsyncStorage} from 'react-native'
import MapView, { PROVIDER_GOOGLE, Polyline, Marker }  from 'react-native-maps'
import { mapStyle } from './components/Requests'
import Selector from './components/Selector'
import Geolocation from 'react-native-geolocation-service'
import { Button } from 'react-native-elements'

var PushNotification = require('react-native-push-notification');

export default class TravelMap extends Component {

    constructor(props){
      super(props) 
      this.state ={
        route: {},
        points: [],
        currentPos: {},
        loaded: false,
        following: true,
        polyOptsBus:['#00ff00' ,
                     '#0000ff' ,
                     '#000000' ,
                     '#fff000' ]
      }
      this.notif = this.notif.bind(this)
    }
    viewPOI() {
      this.mView.animateCamera({center:this.state.currentPos, zoom: 17})
    }

    getLoc(){
      Geolocation.getCurrentPosition(
        (position) => {
            this.setState({
              currentPos: {latitude: position.coords.latitude, longitude: position.coords.longitude}
            }), this.state.following ? this.viewPOI() : console.log("freecam")
        },
        (error) => {
            // See error code charts below.
            console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
    }

    notif(sec){ 
      PushNotification.localNotification({
        largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
        smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
        bigText: "Change to bus " + this.state.route.changes[sec].name, // (optional) default: "message" prop
        subText: "Change", // (optional) default: none
        color: "#add8e6", // (optional) default: system default
        vibrate: true, // (optional) default: true
        vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
        tag: 'bus_change', // (optional) add tag to message
        group: "BusChange", // (optional) add group to message

        /* iOS and Android properties */
        title: "Bus Change", // (optional)
        message: "Change to bus " + this.state.route.changes[sec].name, // (required)
        playSound: false, // (optional) default: true
        soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
        number: '10', // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
        actions: '["Yes", "No"]',  // (Android only) See the doc for notification actions to know more
      })
    }

    componentDidMount(){
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
 
      });
        this.getLoc()
        this.intervalID = setInterval( () => this.getLoc(), 5000);
        AsyncStorage.getItem(
            //this.props.jKey
            '0004'
            ,(err,res) =>{ let obj = JSON.parse(res); this.setState({route: obj, points: obj.route})}
            )
            .then(
              () => {
              console.log(this.state.route)
              var temp = []
              if(this.state.points.length < 6){
                for(let i = 0; i < this.state.points.length; i++){
                  let part = []
                  this.state.points[i].map( (item,i) => { part.push({latitude: item.latitude, longitude: item.longitude}) } )
                  temp.push( part )
                }
              }
              else temp = this.state.points
              return temp  
              }
            )
            .then( (res) => this.setState({points: res, loaded: true}) )
            
    }

    componentWillUnmount(){
      clearInterval(this.intervalID)
    }

    render() {
      return (
      <View style={styles.containerP}>
      <View style={styles.mapContainer}>
       <MapView
         provider={PROVIDER_GOOGLE}
         ref={mView => this.mView = mView}
         style={styles.map}
         customMapStyle={mapStyle}
         onMapReady={this.ready}
         onPanDrag={ () => { if(this.state.following) this.setState({following: false}) } }
         initialRegion={{
           latitude: 52.944351,
           longitude: -1.190312,
           latitudeDelta: 0.020,
           longitudeDelta: 0.0121,
         }}
       >
       {
           this.state.loaded ? 
           this.state.points > 6 ? 
            <Polyline coordinates={this.state.points} /> : 
              this.state.points.map( (item, i) => { return( <Polyline key={i} coordinates={item} strokeColor = {this.state.polyOptsBus[i]} strokeWidth = {3} /> ) } )
            : console.log("empty")
            
       }
       {console.log(this.state.currentPos.latitude)}
       {
         this.state.loaded ?
         this.state.currentPos.latitude === undefined ? console.log("empty")
         : <Marker coordinate={ this.state.currentPos }
            image={ require('../assets/mylocation.gif') } />
         //console.log(this.state.currentPos)
         :
         console.log("empty")
         //<Marker coordinate={this.state.currentPos} />
       }
       </MapView>
       <Selector change={this.props.change} mode={'Travel'} following={ () => { this.setState({following: true}), this.viewPOI() } }/>
      </View>
    </View>
      )
    }
  }
  
  const styles = StyleSheet.create({
    mapContainer: {
      flex: 8,
      borderWidth: 4
    },
    containerP:{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      alignSelf: 'stretch'
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    
  })
  