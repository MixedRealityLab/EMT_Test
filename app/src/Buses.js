import React, { Component } from 'react';
import { Marker } from 'react-native-maps';
import Axios from 'axios';
import { reqBus, reqBod} from './Requests'

export default class Buses extends Component{
    constructor(props) {
      super(props);
  
      this.state = {
        buses: []
      }
    }
  
    componentDidMount(){
      this.intervalID = setInterval( () => this.updateBus(), 5000);
    }
  
    componentWillUnmount(){
      clearInterval(this.intervalID)
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
      return(
        this.state.buses.map((item, i) =>{
          return(
            <Marker 
              key={i}
              coordinate={{latitude: item.pos.y / 1000000, longitude: item.pos.x / 1000000}}
              image={require('../assets/icon-bus-64.png')}
            />
          )
        })
      )
    }
  }