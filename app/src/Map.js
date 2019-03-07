import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, View, Picker, Text, Platform} from 'react-native';
import MapView, { PROVIDER_GOOGLE }  from 'react-native-maps';
import { mapStyle } from './components/Requests'
import Stops from './components/Stops'
import Buses from './components/Buses'
import Plan from './components/Plan'

export default class Map extends Component {

    constructor(props){
      super(props)
      this.state = {
        dep:      -1,
        arr:      -1,
        walk:     false,
      } 
    }
    switch = () => {
      this.child.switch()
    }
  
    clearRoute = () => {
      this.child.clearRoute()
    }
  
    getRoute = () => {
      this.child.getRoute()
    }

    beginRoute = () => {
      this.child.beginRoute()
    }

    render() {
      return (
      <View style={styles.containerP}>
        <View style={styles.mapContainer}>
       <MapView
         provider={PROVIDER_GOOGLE}
         customMapStyle={mapStyle}
         style={styles.map}
         onMapReady={this.ready}
         initialRegion={{
           latitude: 52.944351,
           longitude: -1.190312,
           latitudeDelta: 0.020,
           longitudeDelta: 0.0121,
         }}
       >
        <Stops/>
        <Buses/>
        <Plan onRef={ref => (this.child = ref)} childDep={this.state.dep} childArr={this.state.arr} change={this.props.change}/>
       </MapView>
     </View>
    
        <View style={styles.containerP} >
          <View style={styles.containerP} >
          <Picker
                selectedValue={this.state.dep}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({dep: itemValue})
                }>
                <Picker.Item label="Select Departure"                 value="-1" />
                <Picker.Item label="Innovation Park"                  value="0"  />
                <Picker.Item label="Newark Hall"                      value="1"  />
                <Picker.Item label="Exchange Building"                value="2"  />
                <Picker.Item label="Lenton Hillside"                  value="3"  />
                <Picker.Item label="Dunkirk East Entrance"            value="4"  />
                <Picker.Item label="George Green Library"             value="5"  />
                <Picker.Item label="Campus Arts Centre"               value="6"  />
                <Picker.Item label="Lincon Hall"                      value="7"  />
                <Picker.Item label="East Entrance"                    value="8"  />
                <Picker.Item label="Campus Union Shop"                value="9"  />
                <Picker.Item label="Derby Hall"                       value="10" />
                <Picker.Item label="Kings Meadow Campus"              value="11" />
                <Picker.Item label="East Midlands Coference Centre"   value="12" />
                <Picker.Item label="Current Location"                 value="13" />
            </Picker>
  
            <Picker
                selectedValue={this.state.arr}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({arr: itemValue})
                }>
                <Picker.Item label="Select Departure"                 value="-1" />
                <Picker.Item label="Innovation Park"                  value="0"  />
                <Picker.Item label="Newark Hall"                      value="1"  />
                <Picker.Item label="Exchange Building"                value="2"  />
                <Picker.Item label="Lenton Hillside"                  value="3"  />
                <Picker.Item label="Dunkirk East Entrance"            value="4"  />
                <Picker.Item label="George Green Library"             value="5"  />
                <Picker.Item label="Campus Arts Centre"               value="6"  />
                <Picker.Item label="Lincon Hall"                      value="7"  />
                <Picker.Item label="East Entrance"                    value="8"  />
                <Picker.Item label="Campus Union Shop"                value="9"  />
                <Picker.Item label="Derby Hall"                       value="10" />
                <Picker.Item label="Kings Meadow Campus"              value="11" />
                <Picker.Item label="East Midlands Coference Centre"   value="12" />
            </Picker>
          </View>
  
          <View style={styles.containerP} >
            <View style={styles.tRow}>
              <TouchableOpacity style={styles.button} onPress={this.getRoute}>
                <Text style={styles.text}>Get Route</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={this.clearRoute}>
                <Text style={styles.text}>Clear Route</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tRow}>
            <TouchableOpacity style={styles.button} onPress={this.beginRoute}>
                <Text style={styles.text}>Begin Route</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={this.switch}>
                <Text style={styles.text}>Switch Route</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
  
      
      </View>
      );
    }
  }
  
  const styles = StyleSheet.create({
    mapContainer: {
      flex: 2
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
  