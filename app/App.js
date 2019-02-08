import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, View, Picker, Text} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout, Polyline }  from 'react-native-maps';
import Stops from './src/Stops'
import Buses from './src/Buses'
import Plan from './src/Plan'

export default class App extends Component {

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


  render() {
    return (
    <View style={styles.containerP}>
      <View style={styles.mapContainer}>
     <MapView
       provider={PROVIDER_GOOGLE}
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
      <Plan onRef={ref => (this.child = ref)} childDep={this.state.dep} childArr={this.state.arr}/>
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
              <Picker.Item label="Current Location 2"               value="14" />
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
              <Picker.Item label="Current Location"                 value="13" />
              <Picker.Item label="Current Location 2"               value="14" />
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
          <TouchableOpacity style={styles.button}>
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
    height: 400,
    width: 400,
  },
  containerP:{
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
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
    height: 40,
    width: 300,
  },
  tRow:{
    top:0,
    left:0,
    right:0,
    left:0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    //alignItems: 'stretch',
  },
  button:{
    //width:150,
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

