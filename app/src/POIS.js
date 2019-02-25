import React, {Component} from 'react';
import { Text, View } from 'react-native'
import { Marker, Callout } from 'react-native-maps';
import Axios from 'axios';
import POISCallout from './POISCallout'

export default class POIS extends Component{

    constructor(props) {
        super(props);
    
        this.state = {
            POIS: []
        }
    }
    
    componentDidMount(){
        Axios.get("https://inmyseat.chronicle.horizon.ac.uk/allpois")
        .then(response =>{
          console.log(response.data)
          var res = []
          for(let i =0; i < 20; i++){
            res[i] = response.data[i]
          }
          return res
        })
        .then(data => this.setState({ POIS: data}))
    }
    render(){
        return(
            this.state.POIS.map((item, i) =>{
              return(
                <Marker
                key={i}
                name={item.name}
                coordinate={{latitude: item.latitude, longitude: item.longitude}}
                image={require('../assets/icons8-point-of-interest-52.png')}
                >
                <Callout>
                    <POISCallout item={item}/>
                </Callout>
                </Marker>
              )
            })
          )
    }
}
  