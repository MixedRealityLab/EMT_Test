import React, { Component } from 'react';
import { Marker, Polyline } from 'react-google-maps';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Axios from 'axios';
import { reqBod, reqPlan, stopList, coordsArriva, coordsLatLng, tempLocs} from './Requests'

const google = window.google;
var polyline = require('@mapbox/polyline');
var simplify = require('simplify-js');
var geolib = require('geolib');

class Plan extends Component{
  constructor(props) {
    super(props);

    this.state = {
      jStart:   [],
      jMiddle:  [],
      jEnd:     [],
      jWalk:    [],
      show:     false,
      dep:      -1,
      arr:      -1,
      walk:     false,
      iconA: {
        url: process.env.PUBLIC_URL + '/images/icon-target.png',
        scaledSize: new google.maps.Size(32,32),
        anchor: new google.maps.Point(16,16)
      },
      iconD: {
        url: process.env.PUBLIC_URL + '/images/mylocation.gif',
        anchor: new google.maps.Point(8,8)
      },
      polyOptsWalk:{ strokeColor:"red"  },
      polyOptsBus:[ { strokeColor:"green" },
                    { strokeColor:"blue" },
                    { strokeColor:"black" },
                    { strokeColor:"orange" }],
      dropdownOpen: false
      }
    
    this.toggle = this.toggle.bind(this);
    this.switch = this.switch.bind(this)
    this.getRoute = this.getRoute.bind(this)
    this.clearRoute = this.clearRoute.bind(this)
    this.setDepArr = this.setDepArr.bind(this)
    this.polyDirections = this.polyDirections.bind(this)
    this.polyArriva = this.polyArriva.bind(this)
    this.setJourney = this.setJourney.bind(this)
    this.getJourney = this.getJourney.bind(this)
  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }))
  }
  
  switch(){
    this.setState(prevState => ({
      walk: !prevState.walk
    }))
  }

  getRoute(){  
    if(this.state.dep !== -1){
      if(this.state.arr !== -1) 
        var journey = this.setJourney()
        //Get bus journey, which can have walking sections
        this.getJourney(journey)
        //Get walking journey
        this.polyDirections(journey[0],journey[3],true, true, true)
    }
  }
  clearRoute(){
    //Reset route and redraw
    this.setState({
      jStart:   [],
      jMiddle:  [[]],
      jEnd:     [],
      jWalk:    [],
      show:     false,
      dep:      -1,
      arr:      -1,
      walk:     false
    })
    this.forceUpdate()
  }

  setJourney(){
    var temp = [this.state.dep,-1,-1,this.state.arr]
    //If start point is not a bus stop, find the closest bus stop to it
    if(this.state.dep > coordsLatLng.length-1){
      let dLoc = tempLocs[this.state.dep === "13"? 0 : 1]
      let close = geolib.findNearest(dLoc, coordsLatLng, 0)
      temp[1] = close.key
    }
    else{ temp[1] = temp[0] }
    //If end point is not a bus stop, find the closest bus stop to it
    if(this.state.arr > coordsLatLng.length-1){
      let aLoc = tempLocs[this.state.arr === "13"? 0 : 1]
      let close = geolib.findNearest(aLoc, coordsLatLng, 0)
      temp[2] = close.key
    }
    else{ temp[2] = temp[3] }
    return temp
  }

  getJourney(journey){
    let start = this.state.dep > coordsLatLng.length-1 ? tempLocs[this.state.dep === "13"? 0 : 1]: coordsLatLng[journey[0]]
    let stop  = this.state.arr > coordsLatLng.length-1 ? tempLocs[this.state.arr === "13"? 0 : 1]: coordsLatLng[journey[3]]
    if(geolib.getDistance(start, stop) < 400){
      this.polyDirections(journey[0],journey[3], true, true, false)
    }
    else{
      if(journey[0] !== journey[1]){
        this.polyDirections(journey[0],journey[1], true, false, false)
      }
      //Bus route of journey
      this.polyArriva(journey[1],journey[2])
      //Walking from stop to destination
      if(journey[2] !== journey[3]){
        this.polyDirections(journey[2],journey[3], false, false, false)
      }
    }
    this.setState({
      show: true
    })
    this.forceUpdate()
  }
  setDepArr(props){
    if(this.state.dep < 0){
      this.setState({
        dep: props.target.id
      })
    }
    else if(this.state.dep === props.target.id){
      console.log("Select Different Location")
    }
    else if(this.state.arr < 0){
      this.setState({
        arr: props.target.id
      })
    }
    else{
      console.log("Dep and Arr selected")
    }
  }
  polyDirections(start, stop, isStart, isClose, isWalk){
    var DirectionsService = new google.maps.DirectionsService();
    DirectionsService.route(
      {
        origin: start > coordsLatLng.length-1? start === "13" ? tempLocs[0] : tempLocs[1] :coordsLatLng[start],
        destination: stop > coordsLatLng.length-1? stop === "13" ? tempLocs[0] : tempLocs[1] :coordsLatLng[stop],
        travelMode: "WALKING"
      },
      (response, status) =>
      {
        if (status === google.maps.DirectionsStatus.OK)
        {
          let temp = polyline.decode(response.routes[0].overview_polyline)
          let points = []
          temp.map( item =>
            points.push({
              lat: item[0],
              lng: item[1],
              y: item[0],
              x: item[1]}
            )
          )
         
          let pointsS = simplify(points,0.0001)
          isWalk ? //Is it a walking journey?
            this.setState({
              jWalk: pointsS
            })
          :
          isClose ? //Are the points close?
          this.setState({
            jMiddle: pointsS
          })
          :
          isStart ? //Is it the start or the end of the journey?
            this.setState({
              jStart: pointsS
            })
          :
            this.setState({
              jEnd: pointsS
            })
        }
        else
          console.error(`error fetching directions ${response}`)
          console.log(status)
          return 1
      }

    )
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
      let sections = data.outConL[0].secL

      for(let i = 0; i < sections.length; i++){
        let temp = polyline.decode(data.common.polyL[i].crdEncYX)
        points.push(
          temp.map(item => 
            ({
              lat: item[0],
              lng: item[1],
              y: item[0],
              x: item[1]
            })
          )
        ) 
      }
      /*let temp = polyline.decode(data.common.polyL[0].crdEncYX)
        temp.map(item => 
          points.push({
            lat: item[0],
            lng: item[1],
            y: item[0],
            x: item[1]
          }))*/
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
        <div>
        {//Only show markers and polyline if a route has been selected
        this.state.show ?
          <div>
          <Marker
            position={
              this.state.jStart.length !== 0 ? {lat: this.state.jStart[0].lat,
                lng: this.state.jStart[0].lng}
              :
              this.state.jMiddle.length !== 0 ? {lat: this.state.jMiddle[0][0].lat,
                lng: this.state.jMiddle[0][0].lng}
              : {lat: 0, lng: 0}
            }
            icon={this.state.iconD}
          />
          <Marker
            position={this.state.jEnd.length !== 0 ? {lat: this.state.jEnd[this.state.jEnd.length-1].lat,
              lng: this.state.jEnd[this.state.jEnd.length-1].lng}
            :
            this.state.jMiddle.length !== 0 ? {lat: this.state.jMiddle[this.state.jMiddle.length-1].lat,
              lng: this.state.jMiddle[this.state.jMiddle.length-1].lng}
            : {lat: 0, lng: 0}
            }
            icon= {this.state.iconA}
          />
          {//Display either the walking route or the bus route, which can have walking sections
            this.state.walk ? 
            <Polyline path={this.state.jWalk}   options = {this.state.polyOptsWalk}/>
            :
            <>
            <Polyline path={this.state.jStart}  options = {this.state.polyOptsWalk}/>
            {
              this.state.jMiddle.map( (item, i) => ( <Polyline key={i} path={item} options = {this.state.polyOptsBus[i]}/>) )
            }
            <Polyline path={this.state.jEnd}    options = {this.state.polyOptsWalk}/>
            </>
          }
          </div> 
        : null}
        <table>
        <tbody>
          <tr>
            <td>
              <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                <DropdownToggle caret> Locations </DropdownToggle>
                <DropdownMenu onClick={this.setDepArr}>
                  <DropdownItem id="0" >Innovation Park                 </DropdownItem>
                  <DropdownItem id="1" >Newark Hall                     </DropdownItem>
                  <DropdownItem id="2" >Exchange Building               </DropdownItem>
                  <DropdownItem id="3" >Lenton Hillside                 </DropdownItem>
                  <DropdownItem id="4" >Dunkirk East Entrance           </DropdownItem>
                  <DropdownItem id="5" >George Green Library            </DropdownItem>
                  <DropdownItem id="6" >Campus Arts Centre              </DropdownItem>
                  <DropdownItem id="7" >Lincon Hall                     </DropdownItem>
                  <DropdownItem id="8" >East Entrance                   </DropdownItem>
                  <DropdownItem id="9" >Campus Union Shop               </DropdownItem>
                  <DropdownItem id="10">Derby Hall                      </DropdownItem>
                  <DropdownItem id="11">Kings Meadow Campus             </DropdownItem>
                  <DropdownItem id="12">East Midlands Coference Centre  </DropdownItem>
                  <DropdownItem id="13">Current Location                </DropdownItem>
                  <DropdownItem id="14">Current Location 2              </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </td>
          </tr>
          <tr>
            <td>Depature: </td>
            <td>{this.state.dep < 0 ? null : stopList[this.state.dep]}</td>
          </tr>
          <tr>
            <td>Arrival: </td>
            <td>{this.state.arr < 0 ? null : stopList[this.state.arr]}</td>
          </tr>
          <tr>
            <td><button onClick={this.getRoute}>Get Route </button></td>
            <td><button onClick={this.clearRoute}>Clear   </button></td>
            <td><button onClick={this.switch}>Toggle      </button></td>
          </tr>
        </tbody>
      </table>
      </div>
      )
    }
}
export default Plan
