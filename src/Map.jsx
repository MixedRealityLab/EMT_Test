import React, { Component } from 'react';
import { withGoogleMap, GoogleMap } from 'react-google-maps';
import Plan from './Plan'
import Stops from './Stops'
import Buses from './Buses'

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
