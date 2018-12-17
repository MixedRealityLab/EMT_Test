import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import Axios from 'axios';
import { reqStop, reqBus } from './Requests'

class Buses extends Component{
  constructor(props) {
    super(props);

    this.state = {
      buses: []
    }
  }

  updateBus(){
    
      Axios.post(
        'https://inmyseat.chronicle.horizon.ac.uk/proxy/', reqBus
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
    console.log(this.state.buses)
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
    //<Stops />
   render() {
    const MainMap = withGoogleMap(props => (
      <GoogleMap
        defaultCenter = { { lat: 52.944351, lng: -1.190312 } }
        defaultZoom = { 14 }
      >
      <Stops />
      <Buses />
    </GoogleMap>
   ));
   return(
      <div>
        <MainMap
          containerElement={ <div style={{ height: `500px`, width: '1000px' }} /> }
          mapElement={ <div style={{ height: `100%` }} /> 
        
        }
          
        />
      </div>
   );
   }
};
export default Map;

/*
.then( check =>{
        
        console.log(check[0].pos.y)
        if(check.pos.y === this.state.update ){
          console.log("Same")
        }
        else{
          console.log("Different")
        }
        return check
      }

      )
*/