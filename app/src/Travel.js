import React, {Component} from 'react'
import { StyleSheet, View, AsyncStorage } from 'react-native'
import MapView, { PROVIDER_GOOGLE, Polyline, Marker }  from 'react-native-maps'
import { mapStyle } from './components/Requests'
import Selector from './components/Selector'
import Geolocation from 'react-native-geolocation-service'
import { Button } from 'react-native-elements'
import Axios from 'axios';
import StateMan from './components/StateCheck'
import AppMan from './components/NotifMan'

const StateManager = new StateMan()
var PushNotification = require('react-native-push-notification');

export default class TravelMap extends Component {

    constructor(props){
      super(props) 
      this.state ={
        route: {},
        points: [],
        facticles: [],
        currentPos: {},
        Settings: {},
        VisiblePois: [],
        loaded: false,
        following: true,
        polyOptsBus:['#00ff00' ,
                     '#0000ff' ,
                     '#000000' ,
                     '#fff000' ]
      }
      this.getFacticles = this.getFacticles.bind(this)
      this.resNotf = this.resNotf.bind(this)
    }

    viewPOI() {
      this.mView.animateCamera({center:this.state.currentPos, zoom: 17})
    }

    resNotf(){
      console.log("ResNotf")
    }

    getLoc(){
      Geolocation.getCurrentPosition(
        (position) => {
            this.setState({
              currentPos: {latitude: position.coords.latitude, longitude: position.coords.longitude}
            }), this.state.following ? this.viewPOI() : console.log("freecam")
            console.log("UI check")
            AsyncStorage.getItem('Setting', (err,res) => {
              let obj = JSON.parse(res); this.setState({Settings: obj});
            } )
            if(this.state.Settings.Facticle) AppMan.state.facticles.map( (item) => AppMan.checkDist(position.coords, item) )
        },
        (error) => {
            // See error code charts below.
            console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
    }

    getFacticles(){
      Axios.get("https://inmyseat.chronicle.horizon.ac.uk/api/v1/timeline" )
      .then( response => {
        console.log(response.data)
        this.setState({facticles: response.data})
        return response.data
      })
      .then( data => 
        AsyncStorage.setItem('facticles', JSON.stringify(data))
      )
    }

    componentDidMount(){

      PushNotification.configure({
        // (required) Called when a remote or local notification is opened or received
        onNotification: function(notification) {
          console.log( 'NOTIFICATION:', notification )
          console.log("Lat: " + notification.data.lat + ", Lon: " + notification.data.lon);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true
      }
    })

      this.getLoc()
      AppMan.loadJourney()
      
      this.intervalID = setInterval( () => this.getLoc(), 5000)
      this.getFacticles()
      AsyncStorage.getItem(
        //this.props.jKey
        '0005'
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
      .then( () => { AsyncStorage.setItem('CurrentJ', 
        //this.props.jKey
        '0005'
      ) } )
      console.log(StateManager.returnState())
    }

    componentWillUnmount(){
      clearInterval(this.intervalID)
      console.log("Unmount")
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
         
         initialRegion={{
           latitude: 52.944351,
           longitude: -1.190312,
           latitudeDelta: 0.020,
           longitudeDelta: 0.0121,
         }}
         onPanDrag={ () => { this.state.following ? this.setState({following: false}) : null } }
       >
       {
           this.state.loaded ? 
           this.state.points.map( 
             (item, i) => 
                { 
                  return( 
                    <View key={i} >
                      { i !== 0 ? <Marker  coordinate={item[0]} image={ require('../assets/icons8-synchronize-filled-96.png') } /> : null } 
                      <Polyline coordinates={item} strokeColor = {this.state.polyOptsBus[i]} strokeWidth = {3} />
                    </View> 
                    ) 
                } 
             )
            : console.log("empty")
       }
       {
         this.state.loaded ?
         this.state.currentPos.latitude === undefined ? console.log("empty")
         : <Marker coordinate={ this.state.currentPos }
            image={ require('../assets/mylocation.gif') } />
         :
         console.log("empty")
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
  