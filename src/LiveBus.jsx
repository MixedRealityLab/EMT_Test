import React, { Component } from 'react';
import Axios from 'axios';
import {Marker} from 'google-maps-react';
import { reqBus } from './Requests'

class LiveBus extends Component{
    constructor(props) {
      super(props);
  
      this.state = {
        buses: []
      }
    }
    
    componentDidMount(){
      
    }
  
    updateBus(){
      
        Axios.post(
          'https://inmyseat.chronicle.horizon.ac.uk/proxy/', reqBus() 
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
      this.updateBus()
      return(
        this.state.buses.map((item, i) =>{
          return(
            <Marker 
                    key={i}
                    position={{lat: item.pos.y / 1000000, lng: item.pos.x / 1000000}}
                  />
          )
        })
      )
    }
}

export default LiveBus