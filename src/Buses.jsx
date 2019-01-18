import React, { Component } from 'react';
import { Marker } from 'react-google-maps';
import Axios from 'axios';
import { reqBus, reqBod} from './Requests'

class Buses extends Component{
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

  export default Buses