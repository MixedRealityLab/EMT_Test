import React, { Component } from 'react';
import Axios from 'axios';
import { reqStop, reqBod } from './Requests'
import StopMarker from './Marker'

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

  export default Stops