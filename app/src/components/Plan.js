import React, { Component } from 'react';
import { AsyncStorage, Alert, Text } from 'react-native'
import { Marker, Polyline, Callout } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import Axios from 'axios'
import { reqBod, reqPlan, coordsArriva, coordsLatLng, tempLocs, stopList} from './Requests'
import Geolocation from 'react-native-geolocation-service'

var polyline = require('@mapbox/polyline')
var simplify = require('simplify-js')
var geolib = require('geolib')
var RNFS = require('react-native-fs')
//Storage Directory
var path = RNFS.ExternalDirectoryPath + '/test.txt';

//AsyncStorage.setItem("Temp","21")
//AsyncStorage.clear()
AsyncStorage.getAllKeys((err,res) =>{
  console.log(res)
})

export default class Plan extends Component{
  constructor(props) {
    super(props);

    this.state = {
      currentPos: {},
      jMiddle:  [],
      jWalk:    [],
      changes:  [],
      show:     false,
      walk:     false,
      polyOptsWalk:'#ff0000',
      polyOptsBus:[  '#00ff00' ,
                     '#0000ff' ,
                     '#000000' ,
                     '#fff000' ]
      }
    
    this.switch = this.switch.bind(this)
    this.getRoute = this.getRoute.bind(this)
    this.clearRoute = this.clearRoute.bind(this)
    this.polyArriva = this.polyArriva.bind(this)
    this.setJourney = this.setJourney.bind(this)
    this.getJourney = this.getJourney.bind(this)
    this.getLoc = this.getLoc.bind(this)
    this.writeFile = this.writeFile.bind(this)
    this.beginRoute = this.beginRoute.bind(this)
  }

  writeFile(){
    RNFS.writeFile(path, JSON.stringify(this.state.jMiddle), 'utf8')
    .then((success) => {
      console.log('FILE WRITTEN!');
    })
    .catch((err) => {
      console.log(err.message);
    });
  }

  componentDidMount(){
    this.props.onRef(this)
    this.getLoc()
    this.intervalID = setInterval( () => this.getLoc(), 5000);
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

  beginRoute(){
    if(this.state.jMiddle.length !== 0){
      var Journey = {
        //Is it a walking journey?
        walk: this.state.walk,
        //Bus route
        route: this.state.walk ? this.state.jWalk : this.state.jMiddle,
        //Bus Changes
        changes: this.state.changes,
        //Start point
        start: (this.props.childDep > coordsLatLng.length -1 ? "Location" : stopList[this.props.childDep]),
        //End point
        end: (this.props.childArr > coordsLatLng.length -1 ? "Location" : stopList[this.props.childArr])
      }
      console.log(Journey)
      console.log(JSON.stringify(Journey))
      AsyncStorage.getAllKeys((err,keys)=>{
        console.log(keys)
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
    console.log("Dep: " + this.props.childDep)
    console.log("Arr: " + this.props.childArr)  
    if(this.props.childDep !== -1){
      console.log("Dep correct")
      if(this.props.childArr !== -1){
        console.log("Arr correct")

        if(this.props.childDep === this.props.childArr){
          Alert.alert(
            "Warning",
            "Start point and End point cannot be the same"
          )
        }
        else{
          if(this.props.childDep > coordsLatLng.length -1){
            this.getLoc()
          }
          var journey = this.setJourney()
          //Get bus journey, which can have walking sections
          this.getJourney(journey)
        }
      }
      else{
        Alert.alert(
          "Warning",
          "Please select End point"
        )
      }
    }
    else{
      Alert.alert(
        "Warning",
        "Please select Start and End points"
      )
    }
    
  }
  clearRoute(){
    //Reset route and redraw
    this.setState({
      jMiddle:  [[]],
      jWalk:    [],
      changes:  [],
      show:     false,
      walk:     false
    })
    this.forceUpdate()
  }

  setJourney(){
    var temp = [this.props.childDep,-1,-1,this.props.childArr]
    //If start point is not a bus stop, find the closest bus stop to it
    if(this.props.childDep > coordsLatLng.length-1){
      let close = geolib.findNearest(this.state.currentPos, coordsLatLng, 0)
      temp[1] = close.key
    }
    else{ temp[1] = temp[0] }
    //If end point is not a bus stop, find the closest bus stop to it
    if(this.props.childArr > coordsLatLng.length-1){
      let aLoc = tempLocs[this.props.childArr === "13"? 0 : 1]
      let close = geolib.findNearest(aLoc, coordsLatLng, 0)
      temp[2] = close.key
    }
    else{ temp[2] = temp[3] }
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
      let data = response.data.svcResL[0].res
      console.log(data)
      let sections = data.outConL[0].secL
      var jnySec = 0
      for(let i = 0; i < sections.length; i++){
        let temp = polyline.decode(data.common.polyL[i].crdEncYX)
        if(sections[i].type === "JNY"){
          console.log(data.common.prodL[jnySec])
          jnySec++
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
      }
      //Simplify Polyline
      return simplify(points,0.0001)}
      )
      .then( data => this.setState({
        jMiddle: data
      }),
      
      )
  }
  render(){
    /*if(this.state.jMiddle.length != 0){
      this.writeFile()
    }*/
      return(
        <>
        {//Only show markers and polyline if a route has been selected
        this.state.show ?
          <>
          <Marker
            coordinate={ this.props.childDep > coordsLatLng.length-1? this.state.currentPos :coordsLatLng[this.props.childDep] }
            image={ require('../../assets/icons8-current-location-96.png') }>
            <Callout>
              <Text>
                Start
              </Text>
            </Callout>
            </Marker>
          
          <Marker
            coordinate={ this.props.childArr > coordsLatLng.length-1? this.state.currentPos :coordsLatLng[this.props.childArr] }
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
            <MapViewDirections origin={this.props.childDep > coordsLatLng.length-1? this.state.currentPos : coordsLatLng[this.props.childDep]} 
              destination={coordsLatLng[this.props.childArr]} 
              apikey={'AIzaSyAl_iLAt_xLilUJm2K4oZgXfr1bP22LIxk'} 
              mode={'walking'}
              //Get polyline coords for walking
              onReady={(props) =>{ this.setState({jWalk: props.coordinates}) } }
              strokeColor={this.state.polyOptsWalk}
              strokeWidth = {3}/>
            :
            <>
            {
              this.state.jMiddle.length > 1 ? 
                this.state.jMiddle.map( 
                  (item, i) => ( <Marker key={i} coordinate={item[item.length-1]} image={require('../../assets/icons8-synchronize-filled-96.png')} />) )
              : null
            }
            <MapViewDirections origin={this.props.childDep > coordsLatLng.length-1? this.state.currentPos :coordsLatLng[this.props.childDep]} 
              destination={this.state.jMiddle.length > 1 ? this.state.jMiddle[0][0] : this.state.jMiddle[0]} 
              apikey={'AIzaSyAl_iLAt_xLilUJm2K4oZgXfr1bP22LIxk'}
              mode={'walking'}
              strokeColor={this.state.polyOptsWalk}
              strokeWidth = {3}/>
            {
              this.state.jMiddle.map( (item, i) => ( <Polyline key={i} coordinates={item} strokeColor = {this.state.polyOptsBus[i]} strokeWidth = {3}/>) )
            }
             <MapViewDirections origin={this.state.jMiddle.length > 1 ? this.state.jMiddle.slice(-1)[this.state.jMiddle.length-1] : this.state.jMiddle[this.state.jMiddle.length-1]} 
              destination={coordsLatLng[this.props.childArr]} 
              apikey={'AIzaSyAl_iLAt_xLilUJm2K4oZgXfr1bP22LIxk'}
              mode={'walking'}
              strokeColor={this.state.polyOptsWalk}
              strokeWidth = {3}
              anchor={(1,1)}/>
            </>
          }
          </> 
        : null}
      </>
      )
    }
}