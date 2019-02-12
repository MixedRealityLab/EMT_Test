import React, {Component} from 'react';
import {Text} from 'react-native'
import {Marker, Callout } from 'react-native-maps';
import Axios from 'axios';
import { reqStop, reqBod, stopList } from './Requests';

export default class Stops extends Component{

    constructor(props) {
        super(props);
    
        this.state = {
          stops: []
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
                <Marker 
                    key={i}
                    name={item.name}
                    coordinate={{latitude: item.lat, longitude: item.lng}}
                    image={require('../assets/icon-bus-stop-64.png')}
                    >
                    <Callout>
                      <Text>
                        {stopList[i]}
                      </Text>
                    </Callout>
                </Marker>  
              )
            })
          )
    }
}