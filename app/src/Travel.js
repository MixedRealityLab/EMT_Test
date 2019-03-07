import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, View, Picker, Text, Platform, AsyncStorage} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polyline }  from 'react-native-maps';
import POIS from './components/POIS'
import { mapStyle } from './components/Requests'
import MapViewDirections from 'react-native-maps-directions'

export default class TravelMap extends Component {

    constructor(props){
      super(props) 
      this.state ={
        route: {}
      }
    }

    componentDidMount(){
        AsyncStorage.getItem(
            //this.props.jKey
            '0006', (err,res) =>{ let obj = JSON.parse(res); this.setState({route: obj})})
    }

    render() {
        console.log(this.state.route)
      return (
      <View style={styles.containerP}>
      <View style={styles.mapContainer}>
       <MapView
         provider={PROVIDER_GOOGLE}
         style={styles.map}
         customMapStyle={mapStyle}
         onMapReady={this.ready}
         initialRegion={{
           latitude: 52.944351,
           longitude: -1.190312,
           latitudeDelta: 0.020,
           longitudeDelta: 0.0121,
         }}
       >
       {
           this.state.route === null ? console.log("full") : console.log("empty") //this.state.route.route.map( (item,i) => { return( <Polyline key={i} coordinates={item}/> ) } )
       }

       </MapView>
      </View>
            
    </View>
      )
    }
  }
  
  const styles = StyleSheet.create({
    mapContainer: {
      flex: 8
    },
    containerP:{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      alignSelf: 'stretch'
    },
    containerL:{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    picker:{
      flex:1
    },
    tRow:{
      top:0,
      left:0,
      right:0,
      left:0,
      flex: 3,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    button:{
      flex:1,
      backgroundColor: '#add8e6',
      borderColor: 'black',
      borderWidth: 1
    },
    text:{
      fontSize: 14,
      fontWeight: 'bold',
      alignSelf: 'center',
      color: 'white',
      
    }
  });
  