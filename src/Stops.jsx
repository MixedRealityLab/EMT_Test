import React, { Component } from 'react';
import Axios from 'axios';
import {Marker} from 'google-maps-react';
import { reqStop } from './Requests'



class Stops extends Component{
  constructor(props) {
    super(props);

    this.state = {
      stops: []
    }
  }

    componentDidMount(){
      console.log("Mount")
        Axios.post(
          'https://inmyseat.chronicle.horizon.ac.uk/proxy/', reqStop 
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
            <Marker 
                key={i}
                onClick={this.markClick}
                name={item.name}
                position={{lat: item.lat, lng: item.lng}}
                
              />
          )
        })
      )
    }
  
}
export default Stops