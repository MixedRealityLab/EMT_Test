import React, {Component} from 'react';
import {StyleSheet, View, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE }  from 'react-native-maps';
import { Overlay } from 'react-native-elements'
import HTML from 'react-native-render-html'
import Stops from './components/Stops'
import POIS from './components/POIS'
import { mapStyle } from './components/Requests'
import Selector from './components/Selector'

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
        },
        show: false,
        item: {},
        clean: []
      }

      this.viewPOI = this.viewPOI.bind(this)
      this.setFilter = this.setFilter.bind(this)
      this.showOverlay = this.showOverlay.bind(this)
      this.showItem = this.showItem.bind(this)
    }

    viewPOI(lat, lon) {
      this.mView.animateCamera({center:{latitude: lat, longitude: lon}, zoom: 17})
    }

    setFilter(filter){
      this.setState({filter: filter})
    }

    showOverlay(){
      this.setState({show: true})
    }

    showItem(item){
      let temp = item.description
        var split = temp.split("<br>")

        var clean = []
        split.map(
            (item) => {
                switch (String(item).substr(0,4)){
                    case "":
                    break
                    default:
                        clean.push(item)
                    break
                }
            }
        )
        this.setState({
            clean: clean,
            item: item
        })
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
        <POIS filter={this.state.filter} showOverlay={this.showOverlay} showItem={this.showItem} />
       </MapView>
      </View>
      <Overlay 
          animationType="fade"
          isVisible={this.state.show}
          onBackdropPress={() => this.setState({ show: false })}
        >
        <View style={styles.containerP} >
          <Text>{this.state.item.name}</Text>
          <Text>Category: {this.state.item.category}</Text>
          {
            String(this.state.clean[0]).substr(0,4) === "<img" ?
              <HTML html={this.state.clean[0]} />
            : 
              <Text>{this.state.clean[0]}</Text>
          }
          {
            this.state.clean.map(
              (item, i) => {
                if(i !== 0){
                  return(
                    <Text key={i} >{item}</Text>
                  )
                }

              }
            )
          }
        </View>
        </Overlay>
          <Selector 
          mode={'View'}
          viewPOI={this.viewPOI} 
          setFilter={this.setFilter} 
          filter={this.state.filter}
          />
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
    map: {
      ...StyleSheet.absoluteFillObject,
    }
  });
  