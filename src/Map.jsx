import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, Marker, Polyline } from 'react-google-maps';
import Axios from 'axios';
import { reqStop, reqBus, reqBod, reqPlan, stopList, locReq } from './Requests'
import StopMarker from './Marker'

const google = window.google;
var polyline = require('@mapbox/polyline');
var simplify = require('simplify-js');
var geolib = require('geolib');

class Buses extends Component{
  constructor(props) {
    super(props);

    this.state = {
      buses: []
    }
  }

  componentDidMount(){
    this.intervalID = setInterval( () => this.tick(), 5000);
  }

  componentWillUnmount(){
    clearInterval(this.intervalID)
  }

  tick(){
    this.updateBus()
  }

  updateBus(){
    
      Axios.post(
        'https://inmyseat.chronicle.horizon.ac.uk/proxy/', Object.assign(reqBod, reqBus)
      )
      .then(response =>{
        let loc = response.data.svcResL[0].res.jnyL
        return loc})
      
      .then(data =>this.setState(
        {
        buses: data
        },
      ))
      
  }

  render(){
    console.log(this.state.buses)
    return(
      this.state.buses.map((item, i) =>{
        return(
          <Marker 
            key={i}
            position={{lat: item.pos.y / 1000000, lng: item.pos.x / 1000000}}
            icon={process.env.PUBLIC_URL + '/images/icon-bus-32.png'}
          />
        )
      })
    )
  }
}

class Stops extends Component{
  constructor(props) {
    super(props);

    this.state = {
      stops: [],
      markerImg: process.env.PUBLIC_URL + '/images/icon-bus-stop-32.png',
      markerSel: process.env.PUBLIC_URL + '/images/icon-bus-stop-64.png'
    }
  }

    componentDidMount(){
      console.log("Mount")
        Axios.post(
          'https://inmyseat.chronicle.horizon.ac.uk/proxy/', Object.assign(reqBod, reqStop) 
        )
        .then(response =>{
          let loc = response.data.svcResL[0].res.locL
          console.log("Stops")
          console.log(response.data.svcResL)
          let points = []
          for (var i = 0; i < loc.length; i++){
            points.push({
              name: loc[i].name,
              lat: loc[i].crd.y / 1000000,
              lng: loc[i].crd.x / 1000000
              
            })
          }
          return points})
        .then(data =>this.setState(
          {
          stops: data
          },
        )  
      )
      
      console.log("Mounted")
    }

    render(){
      return(
        this.state.stops.map((item, i) =>{
          return(
            <StopMarker 
                key={i}
                id={i}
                name={item.name}
                position={{lat: item.lat, lng: item.lng}}
                icon={this.state.markerImg}
              />
          )
        })
      )
    }
  
}

class Plan extends Component{
  constructor(props) {
    super(props);

    this.state = {
      pLine: [],
      show: false,
      dep: -1,
      arr: -1,
      walk: false
    }

    this.getRoute = this.getRoute.bind(this)
    this.clearRoute = this.clearRoute.bind(this)
    this.setDepArr = this.setDepArr.bind(this)
    this.polyDirections = this.polyDirections.bind(this)
    this.polyArriva = this.polyArriva.bind(this)
  }

  getRoute(){ 

    //Decide to use Arriva polyline or DirectionsAPI polyline(google)
    //console.log(geolib.getPathLength())
    if(geolib.getDistance(locReq[this.state.dep][1], locReq[this.state.arr][1]) < 400){
      this.polyDirections()
      this.setState({
        walk: true
      })
    }
    else{
      this.polyArriva()
    }
    
  }
  
  clearRoute(){
    this.setState({
      pLine: [],
      show: false,
      dep: -1,
      arr: -1,
      walk: false
    })
    this.forceUpdate()
  }
  setDepArr(props){
    if(this.state.dep < 0){
      console.log(props.target.id)
      this.setState({
        dep: props.target.id
      })
      this.forceUpdate()
    }
    else if(this.state.dep === props.target.id){
      console.log("Select Different Location")
    } 
    else if(this.state.arr < 0){
      console.log(props.target.id)
      this.setState({
        arr: props.target.id
      })
      this.forceUpdate()
    }
    else{
      console.log("Dep and Arr selected")
    }
  }
  polyDirections(){
    var DirectionsService = new google.maps.DirectionsService();
    DirectionsService.route(
      {
        origin: locReq[this.state.dep][1],
        destination: locReq[this.state.arr][1],
        travelMode: "WALKING"
      },
      (response, status) =>
      {
        if (status === google.maps.DirectionsStatus.OK)
        {
          console.log(response)
          console.log(response.routes[0].overview_polyline)
          let temp = polyline.decode(response.routes[0].overview_polyline)
          let points = []
          for(let c = 0; c < temp.length; c++){
            points.push({
              lat: temp[c][0],
              lng: temp[c][1],
              y: temp[c][0],
              x: temp[c][1]
            })
            
          }

          let pointsS = simplify(points,0.0001)
          console.log(pointsS)
          this.setState(
            {
              pLine: pointsS,
              show: true
            }
          )
        }
        else
          console.error(`error fetching directions ${response}`)
          console.log(status)
      }

    )
  }
  polyArriva(){
    Object.assign(reqPlan.svcReqL[0].req.arrLocL[0], locReq[this.state.arr][0])
    Object.assign(reqPlan.svcReqL[0].req.depLocL[0], locReq[this.state.dep][0])
    
    Axios.post(
      'https://inmyseat.chronicle.horizon.ac.uk/proxy/', Object.assign(reqBod, reqPlan) 
    )
    .then(response =>{
      let points = []
      let data = response.data.svcResL[0].res
      let sections = data.outConL[0].secL

      let line = []
      for(let i = 0; i < sections.length; i++){
        let temp = polyline.decode(data.common.polyL[i].crdEncYX)
        temp.forEach(item => line.push(item))
      }
      
      for(let c = 0; c < line.length; c++){
        points.push({
          lat: line[c][0],
          lng: line[c][1],
          y: line[c][0],
          x: line[c][1]
        })
        
      }
      //Simplify Polyline
      let pointsS = simplify(points,0.0001)
      return pointsS}
      )
    .then(result =>this.setState(
      {
        pLine: result,
        show: true
      }
    ))
    this.forceUpdate()
  }

  render(){
      return(
        <div>
        <Marker 
          name={"dep"}
          position={
            this.state.pLine.length !== 0 ? {lat: this.state.pLine[0].lat, 
              lng: this.state.pLine[0].lng}
            : {lat: 0, lng: 0}
          }
          icon={process.env.PUBLIC_URL + '/images/icon-bus-stop-64.png'}
        />
        <Marker 
          name={"arr"}
          position={this.state.pLine.length !== 0 ? {lat: this.state.pLine[this.state.pLine.length-1].lat, 
            lng: this.state.pLine[this.state.pLine.length-1].lng}
          : {lat: 0, lng: 0}
          }
          icon={process.env.PUBLIC_URL + '/images/icon-bus-stop-64.png'}
        />
        {
          this.state.show ?
          <Polyline 
            path={this.state.pLine}
          />
          : null
        }
        <table id="StopList">
        <tbody>
          <tr id="r0">
            <td><button id="0" onClick={this.setDepArr}>Innovation Park </button></td>
            <td><button id="1" onClick={this.setDepArr}>Newark Hall </button></td>
            <td><button id="2" onClick={this.setDepArr}>Exchange Building</button></td>
            <td><button id="3" onClick={this.setDepArr}>Lenton Hillside </button></td>
          </tr>
          <tr id="r1">
            <td><button id="4" onClick={this.setDepArr}>Dunkirk East Entrance </button></td>
            <td><button id="5" onClick={this.setDepArr}>George Green Library </button></td>
            <td><button id="6" onClick={this.setDepArr}>Campus Arts Centre </button></td>
            <td><button id="7" onClick={this.setDepArr}>Lincon Hall </button></td>
          </tr>
          <tr id="r2">
            <td><button id="8" onClick={this.setDepArr}>East Entrance </button></td>
            <td><button id="9" onClick={this.setDepArr}>Campus Union Shop </button></td>
            <td><button id="10" onClick={this.setDepArr}>Derby Hall </button></td>
            <td><button id="11" onClick={this.setDepArr}>Kings Meadow Campus </button></td>
          </tr>
          <tr id="r3">
            <td><button id="12" onClick={this.setDepArr}>East Midlands Coference Centre </button></td>
            <td><button id="13" onClick={this.setDepArr}>Current Location </button></td>
          </tr>
          <tr id="r4">
            <td>Depature: </td>
            <td>{this.state.dep < 0 ? null : stopList[this.state.dep]}</td>
          </tr>
          <tr id="r5">
            <td>Arrival: </td>
            <td>{this.state.arr < 0 ? null : stopList[this.state.arr]}</td>
          </tr>
          <tr id="r6">
            <td><button onClick={this.getRoute}>Get Route </button></td>
            <td><button onClick={this.clearRoute}> Clear</button></td>
          </tr>
        </tbody>
      </table>
      </div>
      )
    }
}

class Map extends Component {

    constructor(props){
        super(props)

        this.state = {
            loaded: false
        }
    }
    componentDidMount(){
      this.setState(
        {
          loaded: true
        }
      )
    }
   render() {
     // <Stops />
     // <Buses />
     // <Plan />
    const MainMap = withGoogleMap(props => (
      <GoogleMap
        defaultCenter = { { lat: 52.944351, lng: -1.190312 } }
        defaultZoom = { 14 }
      >
      <Buses/>
      <Stops/>
      <Plan />
    </GoogleMap>
   ));
   return(
      <div>
        <MainMap
          containerElement={ <div style={{ height: `500px`, width: '1000px' }} /> }
          mapElement={ <div style={{ height: `100%` }} /> }
          
        />
      </div>
   );
   }
};
export default Map;
