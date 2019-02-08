import React, { Component } from 'react';
import { Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions'
import Axios from 'axios';
import { reqBod, reqPlan, stopList, coordsArriva, coordsLatLng, tempLocs} from './Requests'

var google = window.google;
var polyline = require('@mapbox/polyline');
var simplify = require('simplify-js');
var geolib = require('geolib');

export default class Plan extends Component{
  constructor(props) {
    super(props);

    this.state = {
      jStart:   [],
      jMiddle:  [],
      jEnd:     [],
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
  }

  componentDidMount(){
    this.props.onRef(this)
   
  }

  componentWillUnmount(){
    this.props.onRef(undefined)
  }
  
  switch(){
    this.setState(prevState => ({
      walk: !prevState.walk
    }))
  }

  getRoute(){  
    if(this.props.childDep !== -1){
      if(this.props.childArr !== -1) 
        var journey = this.setJourney()
        //Get bus journey, which can have walking sections
        this.getJourney(journey)
    }
  }
  clearRoute(){
    //Reset route and redraw
    this.setState({
      //jStart:   [],
      jMiddle:  [[]],
      //jEnd:     [],
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
      let dLoc = tempLocs[this.props.childDep === "13"? 0 : 1]
      let close = geolib.findNearest(dLoc, coordsLatLng, 0)
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
    let start = this.props.childDep > coordsLatLng.length-1 ? tempLocs[this.props.childDep === "13"? 0 : 1]: coordsLatLng[journey[0]]
    let stop  = this.props.childArr > coordsLatLng.length-1 ? tempLocs[this.props.childArr === "13"? 0 : 1]: coordsLatLng[journey[3]]
    if(geolib.getDistance(start, stop) < 400){
    //placeholder
    }
    else{
    this.polyArriva(journey[1],journey[2]) 
    }
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
        console.log(points)
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
      return(
        <>
        {//Only show markers and polyline if a route has been selected
        this.state.show ?
          <>
          <Marker
            coordinate={ this.props.childDep > coordsLatLng.length-1? this.props.childDep === "13" ? tempLocs[0] : tempLocs[1] :coordsLatLng[this.props.childDep] }
            image={ require('../assets/mylocation.gif') }
          />
          <Marker
            coordinate={ this.props.childArr > coordsLatLng.length-1? this.props.childArr === "13" ? tempLocs[0] : tempLocs[1] :coordsLatLng[this.props.childArr] }
            image= { require('../assets/icon-target.png') }
          />
          {//Display either the walking route or the bus route, which can have walking sections
            this.state.walk ? 
            <MapViewDirections origin={coordsLatLng[this.props.childDep]} destination={coordsLatLng[this.props.childArr]} apikey={'AIzaSyAl_iLAt_xLilUJm2K4oZgXfr1bP22LIxk'}/>
            :
            <>
            {
              this.state.jMiddle.length > 1 ? this.state.jMiddle.map( (item, i) => ( <Marker key={i} coordinate={item[item.length-1]} image={require('../assets/couple-of-arrows-changing-places.png')} />) ): null
            }
            
            <MapViewDirections origin={coordsLatLng[this.props.childDep]} 
              destination={this.state.jMiddle.length > 10 ? this.state.jMiddle[0][0] : this.state.jMiddle[0]} 
              apikey={'AIzaSyAl_iLAt_xLilUJm2K4oZgXfr1bP22LIxk'}/>
            {
              this.state.jMiddle.map( (item, i) => ( <Polyline key={i} coordinates={item} strokeColor = {this.state.polyOptsBus[i]} strokeWidth = {2}/>) )
            }
             <MapViewDirections origin={this.state.jMiddle > 10 ? this.state.jMiddle[this.state.jMiddle.length-1][this.state.jMiddle[this.state.jMiddle.length-1].length-1] :this.state.jMiddle[this.state.jMiddle.length-1]} 
              destination={coordsLatLng[this.props.childArr]} 
              apikey={'AIzaSyAl_iLAt_xLilUJm2K4oZgXfr1bP22LIxk'}/>
            </>
          }
          </> 
        : null}
      </>
      )
    }
}
