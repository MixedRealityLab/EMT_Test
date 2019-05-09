import React, {Component} from 'react';
import {StyleSheet, View, ScrollView, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE }  from 'react-native-maps';
import { Overlay } from 'react-native-elements'

import { mapStyle } from './components/Requests'
import Stops from './components/Stops'
import Buses from './components/Buses'
import PlanComponent from './components/Plan'
import Selector from './components/Selector'

export default class Plan extends Component {

    constructor(props){
      super(props)
      this.state = {
        arr:      -1,
        walk:     false,
        showBusTimes: false, 
        busTimes: [],
      }
      this.showBusTime = this.showBusTime.bind(this)
      this.showBusTimeOverlay = this.showBusTimeOverlay.bind(this)
      this.setArr = this.setArr.bind(this)
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

    setArr(arr){
      this.setState({arr: arr})
      console.log(arr)
    }

    showBusTimeOverlay(){
      this.setState({showBusTimes: true})
    }

    showBusTime(item){
      this.setState({busTimes: item})
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
        <Stops showOverlay={this.showBusTimeOverlay} showItem={this.showBusTime} />
        <Buses/>
        <PlanComponent
          onRef={ref => (this.child = ref)} //Refernce in order to use childs functions
          childArr={this.state.arr}         //Pass selected end point to child
          change={this.props.change}        //Pass function to change from plan view to travel view
        />
       </MapView>
       <Selector
            mode={'Plan'}                 //Tell component what to return
            setArr={this.setArr}          //Pass function to change end point
            arr={this.state.arr}          //Pass selected end point to component
            getRoute={this.getRoute}      //Pass refrence to child function
            clearRoute={this.clearRoute}  //Pass refrence to child function
            beginRoute={this.beginRoute}  //Pass refrence to child function
            switch={this.switch}          //Pass refrence to child function
          />
     </View>

     {/*Bus Stop Times overlay*/}
     <Overlay
          animationType="fade"
          isVisible={this.state.showBusTimes}
          onBackdropPress={() => this.setState({ showBusTimes: false })}
        >
        <View style={styles.containerP} >
        <ScrollView contentContainerStyle={styles.scrollCont} >
          <Text>Bus Times</Text>
            {
              this.state.busTimes.map( (item,i) =>{ let temp = "" + item.time; let cleanTime = temp.substr(0,2) + ":" + temp.substr(2,2) + ":" + temp.substr(4,2)
                return(
                  <Text key={i} > Bus: {"" + item.bus}, Time: { cleanTime } </Text>
                )
              })
            }
        </ScrollView>
        </View>
        </Overlay>

     </View>
      );
    }
  }

  const styles = StyleSheet.create({
    mapContainer: {
      flex: 8,
      borderWidth: 4
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
    }
  });
