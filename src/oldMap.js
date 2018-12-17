import React, { Component } from 'react';
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';

import axios from 'axios'

const baseReq = {
    "auth": {
      "aid": "a4r2b3i8x2n9f6l0",
      "type": "AID"
    },
    "client": {
      "id": "ARRIVA",
      "name": "Arriva Bus ",
      "os": "Android 6.0.1",
      "res": "1080x1776",
      "type": "AND",
      "ua": "Dalvik/2.1.0 (Linux; U; Android 6.0.1; Nexus 5 Build/M4B30Z)",
      "v": 1000038
    },
  }
  const sendReq = {
      
      "formatted": false,
      "lang": "eng",
      "svcReqL": [
        {
          "cfg": {
            "polyEnc": "GPA"
          },
          "meth": "LocGeoPos",
          "req": {
            "getPOIs": false,
            "maxLoc": 2,
            "ring": {
              "cCrd": {
                "x": -1183801,
                "y": 52951855
              }
            }
          }
        }
      ],
      "ver": "1.16"
  }
  const liveReq = {
    "formatted": false,
    "lang": "eng",
    "svcReqL": [
      {
        "cfg": {
          "polyEnc": "GPA"
        },
        "meth": "JourneyGeoPos",
        "req": {
          "jnyFltrL": [
            {
              "mode": "BIT",
              "type": "PROD",
              "value": "000001"
            }
          ],
          "maxJny": 128,
          "onlyRT": true,
          "perSize": 30000,
          "rect": {
            "llCrd": {
              "x": -1280332,
              "y": 52862989
            },
            "urCrd": {
              "x": -1095595,
              "y": 53021319
            }
          },
          "trainPosMode": "REPORT_ONLY"
        }
      }
    ],
    "ver": "1.16"
  }

  const style = {
    width: '75%',
    height: '75%',
    margin: 'auto'
  }
  const center = {
    lat: 52.9375237,
    lng: -1.1967676
  }
  const stopIMG = "https://image.flaticon.com/icons/svg/0/622.svg"
  const busIMG = "https://img.icons8.com/metro/1600/bus.png"

class MainMap extends Component{
    constructor(props) {
        super(props);
        
        this.state = {
          stops: [],
          loaded: false,
          liveLoc: [],
          liveNum: 0,
          liveOldNum: -1,
          updated: true
        }
        
      }
      componentDidMount(){
        console.log("Mount")
        
          axios.post(
            'https://inmyseat.chronicle.horizon.ac.uk/proxy/', Object.assign(baseReq, sendReq) 
          )
          .then(response =>{
            let loc = response.data.svcResL[0].res.locL
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
            stops: data,
            loaded: true
            },
          )  
        )
        
        console.log("Mounted")
      }
    
      componentDidUpdate(){
        console.log("Check Update")
        if(this.state.updated){
          console.log("Same update")
          
        }
        else{
          this.updateBus()
        }
      }
    
      markClick(props, marker, e){
        console.log("Click")
        console.log(marker.name)
    
        
      }
    
      updateBus(){
        console.log("Update Bus")
        axios.post(
          'https://inmyseat.chronicle.horizon.ac.uk/proxy/', Object.assign(baseReq, liveReq) 
        )
        .then(response =>{
          let loc = response.data.svcResL[0].res.jnyL
          let buses = []
            for (var i = 0; i < loc.length; i++){
              buses.push({
                lat: loc[i].pos.y / 1000000,
                lng: loc[i].pos.x / 1000000,
              })
              
            }
            return buses})
            .then(data =>this.setState(
              {
              liveLoc: data
              },
            ))
        
      }
    
      drawStops(){
        console.log("Draw Stops")
        return(
          this.state.stops.map((item, i) =>{
            return(
              <Marker 
                  key={i}
                  onClick={this.markClick}
                  name={item.name}
                  position={{lat: item.lat, lng: item.lng}}
                  icon={{
                    url: stopIMG,
                    anchor: new this.props.google.maps.Point(32,32),
                    scaledSize: new this.props.google.maps.Size(32,32)
                  }}
                />
            )
          })
        )
      }
    
      drawLive(){
        return (
          this.state.liveLoc.map((item, i) =>{
            return(
              <Marker 
                  key={i}
                  position={{lat: item.lat, lng: item.lng}}
                  icon={{
                    url: busIMG,
                    anchor: new this.props.google.maps.Point(32,32),
                    scaledSize: new this.props.google.maps.Size(32,32)
                  }}
                />
            )
          })
        )
      }
    
      map(){
        console.log("Make Map")
        
          return(
            <><header className="App-header">
            <Map 
              google={this.props.google} 
              style={style}
              initialCenter={center}
              zoom={14}>
              {this.drawStops()}
              
            </Map>
                
            </header></>
          )
        
        
        
      }
    
      render() {
        return(
          this.map()
          
        )
      }
    }
    
    export default GoogleApiWrapper({ 
      apiKey: ("AIzaSyAtnvNRtLtldvDVaP4_KxZQgRyDNn_Eih4"),
    })(MainMap)

    //<div>Icons made by <a href="https://www.freepik.com/" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" 			    title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" 			    title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>