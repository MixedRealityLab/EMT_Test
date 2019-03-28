import React, {Component} from 'react'
import {StyleSheet, View, AsyncStorage} from 'react-native'
import MapView, { PROVIDER_GOOGLE, Polyline, Marker }  from 'react-native-maps'
import { mapStyle } from './components/Requests'
import Selector from './components/Selector'
import Geolocation from 'react-native-geolocation-service'
import { Button } from 'react-native-elements'

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

    componentDidMount(){
        this.getLoc()
        this.intervalID = setInterval( () => this.getLoc(), 5000);
        AsyncStorage.getItem(
            this.props.jKey
            //'0004'
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
           this.state.points.map( (item, i) => { return( <Polyline key={i} coordinates={item} strokeColor = {this.state.polyOptsBus[i]} strokeWidth = {3} /> ) } )
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
  