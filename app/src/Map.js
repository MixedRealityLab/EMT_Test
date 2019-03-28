import React, {Component} from 'react';
import {StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE }  from 'react-native-maps';
import { mapStyle } from './components/Requests'
import Stops from './components/Stops'
import Buses from './components/Buses'
import Plan from './components/Plan'
import Selector from './components/Selector'

export default class Map extends Component {

    constructor(props){
      super(props)
      this.state = {
        //dep:      -1,
        arr:      -1,
        walk:     false,
      }
      this.setArr = this.setArr.bind(this)
      //this.setDep = this.setDep.bind(this)
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
/*
    setDep(dep){
      this.setState({dep: dep})
    }
*/
    setArr(arr){
      this.setState({arr: arr})
      console.log(arr)
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
        <Plan 
          onRef={ref => (this.child = ref)} //Refernce in order to use childs functions
          //childDep={this.state.dep}         //Pass selected start point to child
          childArr={this.state.arr}         //Pass selected end point to child
          change={this.props.change}        //Pass function to change from plan view to travel view
        />
       </MapView>
       <Selector 
            mode={'Plan'}                 //Tell component what to return
            //setDep={this.setDep}          //Pass function to change start point
            //dep={this.state.dep}          //Pass selected start point to component
            setArr={this.setArr}          //Pass function to change end point
            arr={this.state.arr}          //Pass selected end point to component
            getRoute={this.getRoute}      //Pass refrence to child function
            clearRoute={this.clearRoute}  //Pass refrence to child function
            beginRoute={this.beginRoute}  //Pass refrence to child function
            switch={this.switch}          //Pass refrence to child function
          />
     </View>
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
  