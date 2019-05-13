import React, { Component } from 'react';
import { AsyncStorage, Alert, Text, ToastAndroid } from 'react-native'
import { Marker, Polyline, Callout } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import Axios from 'axios'
import { reqBod, reqPlan, coordsArriva, coordsLatLng } from './Requests'
import Geolocation from 'react-native-geolocation-service'

var polyline = require('@mapbox/polyline')
var simplify = require('simplify-js')
var geolib = require('geolib')

/**
 * Class that handles displaying the planned route
 */
export default class PlanComponent extends Component{
  constructor(props) {
    super(props);

    this.state = {
      currentPos: {},
      jStart:   [],
      jMiddle:  [],
      jEnd:     [],
      jWalk:    [],
      changes:  [],
      purePoly: [],
      show:     false,
      walk:     false,
      polyOptsWalk:'#ff0000',
      polyOptsBus:[  '#00ff00' ,
                     '#0000ff' ,
                     '#000000' ,
                     '#fff000' ]
      }

    this.pureRoute  = this.pureRoute  .bind(this)
    this.makeRoute  = this.makeRoute  .bind(this)
    this.switch     = this.switch     .bind(this)
    this.getRoute   = this.getRoute   .bind(this)
    this.clearRoute = this.clearRoute .bind(this)
    this.polyArriva = this.polyArriva .bind(this)
    this.setJourney = this.setJourney .bind(this)
    this.getJourney = this.getJourney .bind(this)
    this.getLoc     = this.getLoc     .bind(this)
    this.beginRoute = this.beginRoute .bind(this)
  }

  componentDidMount(){
    this.props.onRef(this)
    this.getLoc()
    this.intervalID = setInterval( () => this.getLoc(), 5000);
    AsyncStorage.setItem('travel', 'false')
  }

  componentWillUnmount(){
    clearInterval(this.intervalID)
    this.props.onRef(undefined)
  }

  switch(){
    this.setState(prevState => ({
      walk: !prevState.walk
    }))
  }

  getLoc(){
    Geolocation.getCurrentPosition(
      (position) => {
          this.setState({
            currentPos: {latitude: position.coords.latitude, longitude: position.coords.longitude}
          })
      },
      (error) => {
          // See error code charts below.
          console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  );
  }

  makeRoute(){
    var route = []
      route.push(this.state.jStart)
      this.state.jMiddle.map( (item) => { route.push(item) })
      route.push(this.state.jEnd)
    return route
  }

  pureRoute(){
    let temp= []
      temp.push(this.state.jStart)
      this.state.purePoly.map( (item) => { temp.push(item) })
      temp.push(this.state.jEnd)
    return temp
  }

  beginRoute(){
    if(this.state.jMiddle.length !== 0){
      var Journey = {
        //Is it a walking journey?
        walk: this.state.walk,
        //Bus route
        route: this.state.walk ? [this.state.jWalk] : this.makeRoute(),
        //Bus Changes
        changes: this.state.changes,
        //Start point
        start: this.state.currentPos,
        //End point
        end: this.props.childArr,
        //Pure polyline from arriva, temp solution
        pure: this.pureRoute()
      }
      AsyncStorage.getAllKeys((err,keys)=>{
        var keyLen = keys.length
        if(keyLen === 0){
          AsyncStorage.setItem('0000', JSON.stringify(Journey))
        }
        else{
          var newKey
          switch (String(keyLen).length){
            case 1:
              newKey = '000' + keyLen
              break;
            case 2:
              newKey = '00' + keyLen
              break;
            case 3:
              newKey = '0' + keyLen
              break;
          }
          AsyncStorage.setItem(newKey, JSON.stringify(Journey))
          AsyncStorage.setItem('travel', newKey)
          AsyncStorage.setItem('VisPOIS',JSON.stringify([]))
          this.props.change(newKey)
        }
      })
    }
    else{
      Alert.alert(
        "Warning",
        "A route needs to be selected in order to begin a journey"
      )
    }

  }

  getRoute(){
      if(this.props.childArr.key !== -1){
          this.getLoc()
          var journey = this.setJourney()
          //Get bus journey, which can have walking sections
          this.getJourney(journey)
      }
      else{
        Alert.alert(
          "Warning",
          "Please select Destination"
        )
      }
  }
  clearRoute(){
    //Reset route and redraw
    this.setState({
      jStart:   [],
      jMiddle:  [],
      jEnd:     [],
      jWalk:    [],
      changes:  [],
      show:     false,
      walk:     false
    })
    this.forceUpdate()
  }

  setJourney(){
    //Set closest stops to the start and end points based on distance
    var temp = [this.state.currentPos,-1,-1,this.props.childArr]

    let closeS = geolib.findNearest(this.state.currentPos, coordsLatLng, 0)
    temp[1] = closeS.key

    let aLoc = {latitude: this.props.childArr.Lat, longitude: this.props.childArr.Lon}
    let closeA = geolib.findNearest(aLoc, coordsLatLng, 0)
    temp[2] = closeA.key

    return temp
  }

  getJourney(journey){
    this.polyArriva(journey[1],journey[2])

    this.setState({
      show: true
    })
    this.forceUpdate()
  }

  polyArriva(start, stop){
    Object.assign(reqPlan.svcReqL[0].req.arrLocL[0], coordsArriva[stop])
    Object.assign(reqPlan.svcReqL[0].req.depLocL[0], coordsArriva[start])
    Axios.post(
      'https://inmyseat.chronicle.horizon.ac.uk/proxy/', Object.assign(reqBod, reqPlan)
    )
    .then(response =>{
      let points = []
      let purePoints = []
      let data = response.data.svcResL[0].res

      let sections = data.outConL[0].secL
      var jnySec = []
      var jnyCount = 0
      for(let i = 0; i < sections.length; i++){
        let temp = polyline.decode(data.common.polyL[i].crdEncYX);
        // [Dominic] As the polylines going through Jubilee are broken, at
        // the moment lets just show start/end points.
        //Full arriva polyline
        let pure = temp

        temp = [temp[0], temp[temp.length-1]];
        if(sections[i].type === "JNY"){
          jnySec.push(data.common.prodL[jnyCount])
          jnyCount++
        }
        points.push(
          temp.map(item =>
            ({
              latitude: item[0],
              longitude: item[1],
              y: item[0],
              x: item[1]
            })
          )
        )
        purePoints.push(
          pure.map(item =>
            ({
              latitude: item[0],
              longitude: item[1]
            }))
        )
      }
      this.setState({changes: jnySec, purePoly: purePoints})
      //Simplify Polyline
      return simplify(points,0.0001)}
      )
      .then( data => this.setState({
        jMiddle: data
      })
      )
  }

  render(){
    if(this.state.jMiddle.length > 0){
      if(this.state.jMiddle.length > 6){
        var lastItem = this.state.jMiddle[this.state.jMiddle.length-1]
      }
      else{
        let temp = this.state.jMiddle[this.state.jMiddle.length-1]
        var lastItem = temp[temp.length -1]
      }
    }

      return(
        <>
        {//Only show markers and polyline if a route has been selected
        this.state.show ?
          <>
          <Marker
            coordinate={ this.state.currentPos }
            image={ require('../../assets/icons8-current-location-96.png') }>
            <Callout>
              <Text>
                Start
              </Text>
            </Callout>
            </Marker>

          <Marker
            coordinate={{latitude: this.props.childArr.Lat, longitude: this.props.childArr.Lon}}
            image= { require('../../assets/icons8-destination-96.png') }
          >
            <Callout>
              <Text>
                End
              </Text>
            </Callout>
          </Marker>
          {//Display either the walking route or the bus route, which can have walking sections
            this.state.walk ?
            <MapViewDirections origin={this.state.currentPos}
              destination={{latitude: this.props.childArr.Lat, longitude: this.props.childArr.Lon}}
              apikey={'AIzaSyAl_iLAt_xLilUJm2K4oZgXfr1bP22LIxk'}
              mode={'walking'}
              //Get polyline coords for walking
              onReady={(props) =>{ this.setState({jWalk: props.coordinates}) } }
              strokeColor={this.state.polyOptsWalk}
              strokeWidth = {3}/>
            :
            this.state.jMiddle.length > 0 ?
              <>
              {
                this.state.jMiddle.length > 1 ?
                  this.state.jMiddle.map(
                    (item, i) => ( <Marker key={i} coordinate={item[item.length-1]} image={require('../../assets/icons8-synchronize-filled-96.png')} />) )
                : null
              }

              <MapViewDirections origin={this.state.currentPos}
                destination={this.state.jMiddle.length > 7 ? this.state.jMiddle[0] : this.state.jMiddle[0][0]}
                onReady={(props) =>{ this.setState({jStart: props.coordinates}) } }
                apikey={'AIzaSyAl_iLAt_xLilUJm2K4oZgXfr1bP22LIxk'}
                mode={'walking'}
                strokeColor={this.state.polyOptsWalk}
                strokeWidth = {3}/>
              {
                this.state.jMiddle.map( (item, i) => ( <Polyline key={i} coordinates={item} strokeColor = {this.state.polyOptsBus[i]} strokeWidth = {3}/>) )
              }
              <MapViewDirections origin={lastItem}
                destination={{latitude: this.props.childArr.Lat, longitude: this.props.childArr.Lon}}
                onReady={(props) =>{ this.setState({jEnd: props.coordinates}) } }
                apikey={'AIzaSyAl_iLAt_xLilUJm2K4oZgXfr1bP22LIxk'}
                mode={'walking'}
                strokeColor={this.state.polyOptsWalk}
                strokeWidth = {3}
                anchor={(1,1)}/>
              </>
            :
            null
          }
          </>
        : null}
      </>
      )
    }
}
