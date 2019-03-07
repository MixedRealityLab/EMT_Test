import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, View, Picker, Text, Platform} from 'react-native';
import MapView, { PROVIDER_GOOGLE }  from 'react-native-maps';
import Stops from './components/Stops'
import POIS from './components/POIS'
import { mapStyle } from './components/Requests'
import Search from './components/Search'

export default class MapSimple extends Component {

    constructor(props){
      super(props) 
      this.state ={
        filter: "N/A",
        region:{
          latitude: 52.944351,
          longitude: -1.190312,
          latitudeDelta: 0.020,
          longitudeDelta: 0.0121
        }
      }

      this.viewPOI = this.viewPOI.bind(this)
    }

    viewPOI(lat, lon) {
      this.mView.animateCamera({center:{latitude: lat, longitude: lon}})
    }

    render() {
      return (
      <View style={styles.containerP}>
      <View style={styles.mapContainer}>
       <MapView
         ref={mView => this.mView = mView}
         provider={PROVIDER_GOOGLE}
         style={styles.map}
         customMapStyle={mapStyle}
         onMapReady={this.ready}
         region={this.state.region}
       >
        <Stops/>
        <POIS filter={this.state.filter}/>
       </MapView>
      </View>
          <View style={styles.tRow}>
            <Picker
                selectedValue={this.state.filter}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({filter: itemValue})
                }>
                <Picker.Item label="Select Filter"      value="N/A" />
                <Picker.Item label="Gardens"            value="Gardens" />
                <Picker.Item label="Food and Drink"     value="Food and Drink" />
            </Picker>
            <Search viewPOI={this.viewPOI} filter={this.state.filter}/>
          </View>
    </View>
      );
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
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
    },
  });
  