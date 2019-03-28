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
    this.beginRoute = this.beginRoute.bind(this)
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

  beginRoute(){
    console.log(this.state.jMiddle)
    if(this.state.walk){
      console.log("jMiddle: " + this.state.jMiddle.length) 
    }
    else{
      console.log("jMiddle: " + this.state.jMiddle[0].length) 
    }
    console.log("ChildArr: " + this.props.childArr)
    if(this.state.jMiddle.length !== 0){
      var Journey = {
        //Is it a walking journey?
        walk: this.state.walk,
        //Bus route
        route: this.state.walk ? [this.state.jWalk] : this.state.jMiddle,
        //Bus Changes
        changes: this.state.changes,
        //Start point
        start: this.state.currentPos,
        //(this.props.childDep > coordsLatLng.length -1 ? "Location" : stopList[this.props.childDep])
        //End point
        end: this.props.childArr
        //(this.props.childArr > coordsLatLng.length -1 ? "Location" : stopList[this.props.childArr])
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
          AsyncStorage.setItem('travel', 'true')
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
    //console.log("Dep: " + this.props.childDep)
    console.log("Arr: " + this.props.childArr)  
    /*
    if(this.props.childDep !== -1){
      console.log("Dep correct")
    }
    else{
      Alert.alert(
        "Warning",
        "Please select Start and End points"
      )
    }
    */
      if(this.props.childArr.key !== -1){
        console.log("Arr correct")

          this.getLoc()
          var journey = this.setJourney()
          //Get bus journey, which can have walking sections
          this.getJourney(journey)
        /*
        if(this.state.currentPos.latitude === this.props.childArr.lat && this.state.currentPos.longitude === this.props.childArr.lon){
          Alert.alert(
            "Warning",
            "Start point and End point cannot be the same"
          )
        }
        else{
          if(this.props.childDep > coordsLatLng.length -1){ 
          }
        }
        */
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
      jMiddle:  [[]],
      jWalk:    [],
      changes:  [],
      show:     false,
      walk:     false
    })
    this.forceUpdate()
  }

  setJourney(){
    //var temp = [this.props.childDep,-1,-1,this.props.childArr]
    var temp = [this.state.currentPos,-1,-1,this.props.childArr]
    //If start point is not a bus stop, find the closest bus stop to it
    /*if(this.props.childDep > coordsLatLng.length-1){
      
    }
    else{ temp[1] = temp[0] }*/

    let closeS = geolib.findNearest(this.state.currentPos, coordsLatLng, 0)
    temp[1] = closeS.key
    
    //If end point is not a bus stop, find the closest bus stop to it
    /*
    if(this.props.childArr > coordsLatLng.length-1){
      
    }
    else{ temp[2] = temp[3] }
    */
   //tempLocs[this.props.childArr === "13"? 0 : 1]
    let aLoc = {latitude: this.props.childArr.Lat, longitude: this.props.childArr.Lon}
    console.log(aLoc)
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
      let data = response.data.svcResL[0].res
      console.log(data)
      let sections = data.outConL[0].secL
      var jnySec = []
      var jnyCount = 0
      for(let i = 0; i < sections.length; i++){
        let temp = polyline.decode(data.common.polyL[i].crdEncYX)
        if(sections[i].type === "JNY"){
          console.log(data.common.prodL[jnyCount])
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
      }
      this.setState({changes: jnySec})
      //Simplify Polyline
      return simplify(points,0.0001)}
      )
      .then( data => this.setState({
        jMiddle: data
      }),
      
      )
  }
  render(){
      return(
        <>
        {//Only show markers and polyline if a route has been selected
        this.state.show ?
          <>
          <Marker
            coordinate={ this.state.currentPos }
            //this.props.childDep > coordsLatLng.length-1? this.state.currentPos :coordsLatLng[this.props.childDep]
            image={ require('../../assets/icons8-current-location-96.png') }>
            <Callout>
              <Text>
                Start
              </Text>
            </Callout>
            </Marker>
          
          <Marker
          //this.props.childArr > coordsLatLng.length-1? this.state.currentPos :coordsLatLng[this.props.childArr]
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
            <>
            {
              this.state.jMiddle.length > 1 ? 
                this.state.jMiddle.map( 
                  (item, i) => ( <Marker key={i} coordinate={item[item.length-1]} image={require('../../assets/icons8-synchronize-filled-96.png')} />) )
              : null
            }
            <MapViewDirections origin={this.state.currentPos}
            //this.props.childDep > coordsLatLng.length-1? this.state.currentPos :coordsLatLng[this.props.childDep] 
              destination={this.state.jMiddle.length > 1 ? this.state.jMiddle[0][0] : this.state.jMiddle[0]} 
              apikey={'AIzaSyAl_iLAt_xLilUJm2K4oZgXfr1bP22LIxk'}
              mode={'walking'}
              strokeColor={this.state.polyOptsWalk}
              strokeWidth = {3}/>
            {
              this.state.jMiddle.map( (item, i) => ( <Polyline key={i} coordinates={item} strokeColor = {this.state.polyOptsBus[i]} strokeWidth = {3}/>) )
            }
             <MapViewDirections origin={this.state.jMiddle.length > 1 ? this.state.jMiddle.slice(-1)[this.state.jMiddle.length-1] : this.state.jMiddle[this.state.jMiddle.length-1]} 
              //coordsLatLng[this.props.childArr]
              destination={{latitude: this.props.childArr.Lat, longitude: this.props.childArr.Lon}} 
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