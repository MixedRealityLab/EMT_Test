import React, { Component } from 'react';
import { Marker, Polyline } from 'react-google-maps';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Axios from 'axios';
import { reqBod, reqPlan, stopList, locReq } from './Requests'

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
      polyOptsWalk:{
        strokeColor:"red"
      },
      polyOptsBus:{
        strokeColor:"green"
      },
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
    let temp = !this.state.walk
    this.setState({
      walk: temp
    })
  }

  getRoute(){  
    if(this.state.dep !== -1){
      if(this.state.arr !== -1) 
        var journey = this.setJourney()
        this.getJourney(journey)
        this.polyDirections(journey[0],journey[3],true, true, true)
    }
  }
  clearRoute(){
    this.setState({
      jStart:   [],
      jMiddle:  [],
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
    if(this.state.dep > locReq.length-2){
      let close = 0
      for(let i = 0; i < locReq.length -1; i++){
        if(geolib.getDistance(locReq[this.state.dep][1], locReq[i][1]) < geolib.getDistance(locReq[this.state.dep][1],locReq[close][1])){
          close = i
        }
      }
      temp[1] = close
    }
    else{ temp[1] = temp[0]}

    if(this.state.arr > locReq.length-2){
      let close = 0
      for(let i = 0; i < locReq.length -1; i++){
        if(geolib.getDistance(locReq[this.state.arr][1], locReq[i][1]) < geolib.getDistance(locReq[this.state.arr][1],locReq[close][1])){
          close = i
        }
      }
      temp[2] = close
    }
    else{ temp[2] = temp[3] }

    return temp
  }
  getJourney(journey){
    if( geolib.getDistance(locReq[journey[0]][1], locReq[journey[3]][1]) < 400){
      this.polyDirections(journey[0],journey[3], true, true, false)
    }
    else{
    //Start of journey, walking to nearest stop
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
      console.log(props.target.id)
      this.setState({
        dep: props.target.id
      })

    }
    else if(this.state.dep === props.target.id){
      console.log("Select Different Location")
    }
    else if(this.state.arr < 0){
      console.log(props.target.id)
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
        origin: locReq[start][1],
        destination: locReq[stop][1],
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
          isWalk ?
            this.setState({
              jWalk: pointsS
            })
          :
          isClose ?
          this.setState({
            jMiddle: pointsS
          })
          :
          isStart ?
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
    Object.assign(reqPlan.svcReqL[0].req.arrLocL[0], locReq[stop][0])
    Object.assign(reqPlan.svcReqL[0].req.depLocL[0], locReq[start][0])
    Axios.post(
      'https://inmyseat.chronicle.horizon.ac.uk/proxy/', Object.assign(reqBod, reqPlan)
    )
    .then(response =>{
      let points = []
      let data = response.data.svcResL[0].res
      let sections = data.outConL[0].secL

      for(let i = 0; i < sections.length; i++){
        let temp = polyline.decode(data.common.polyL[i].crdEncYX)
        temp.map(item => 
          points.push({
            lat: item[0],
            lng: item[1],
            y: item[0],
            x: item[1]
          }))
      }
      //Simplify Polyline
      return simplify(points,0.0001)}
      )
      .then( data => this.setState({
        jMiddle: data
      })
      )
  }

  render(){
      return(
        <div>
        {this.state.show ?
          <div>
          <Marker
            name={"dep"}
            position={
              this.state.jStart.length !== 0 ? {lat: this.state.jStart[0].lat,
                lng: this.state.jStart[0].lng}
              :
              this.state.jMiddle.length !== 0 ? {lat: this.state.jMiddle[0].lat,
                lng: this.state.jMiddle[0].lng}
              : {lat: 0, lng: 0}
            }
            icon={this.state.iconD}
          />
          <Marker
            name={"arr"}
            position={this.state.jEnd.length !== 0 ? {lat: this.state.jEnd[this.state.jEnd.length-1].lat,
              lng: this.state.jEnd[this.state.jEnd.length-1].lng}
            :
            this.state.jMiddle.length !== 0 ? {lat: this.state.jMiddle[this.state.jMiddle.length-1].lat,
              lng: this.state.jMiddle[this.state.jMiddle.length-1].lng}
            : {lat: 0, lng: 0}
            }
            icon= {this.state.iconA}
          />
          {
            this.state.walk ? 
            <Polyline
            path={this.state.jWalk}
            options = {this.state.polyOptsWalk}
            />
            :
            <>
            <Polyline
            path={this.state.jStart}
            options = {this.state.polyOptsWalk}
            />
            <Polyline
              path={this.state.jMiddle}
              options = {this.state.polyOptsBus}
            />
            <Polyline
              path={this.state.jEnd}
              options = {this.state.polyOptsWalk}
            />
            </>
          }
          </div>
          : null}

        <table>
        <tbody>
          <tr>
            <td>
              <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                <DropdownToggle caret>
                  Locations
                </DropdownToggle>
                <DropdownMenu onClick={this.setDepArr}>
                  <DropdownItem id="0" >Innovation Park </DropdownItem>
                  <DropdownItem id="1" >Newark Hall</DropdownItem>
                  <DropdownItem id="2" >Exchange Building</DropdownItem>
                  <DropdownItem id="3" >Lenton Hillside</DropdownItem>
                  <DropdownItem id="4" >Dunkirk East Entrance</DropdownItem>
                  <DropdownItem id="5" >George Green Library</DropdownItem>
                  <DropdownItem id="6" >Campus Arts Centre</DropdownItem>
                  <DropdownItem id="7" >Lincon Hall</DropdownItem>
                  <DropdownItem id="8" >East Entrance</DropdownItem>
                  <DropdownItem id="9" >Campus Union Shop</DropdownItem>
                  <DropdownItem id="10">Derby Hall</DropdownItem>
                  <DropdownItem id="11">Kings Meadow Campus</DropdownItem>
                  <DropdownItem id="12">East Midlands Coference Centre</DropdownItem>
                  <DropdownItem id="13">Current Location</DropdownItem>
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
            <td><button onClick={this.clearRoute}>Clear</button></td>
            <td><button onClick={this.switch}>Toggle</button></td>
          </tr>
        </tbody>
      </table>
      </div>
      )
    }
}
export default Plan
