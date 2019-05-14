import React, { Component } from 'react';
import { Picker, ScrollView, StyleSheet, Text, View } from 'react-native';
import ActionButton from 'react-native-action-button';
import { Overlay, SearchBar } from 'react-native-elements';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import HTML from 'react-native-render-html';
import Icon from 'react-native-vector-icons/Ionicons';
import { DrawerActions } from 'react-navigation';

import Axios from 'axios';
import capitalize from 'capitalize';

import Stops from './components/Stops.js';
import POIS from './components/POIS.js';
import { mapStyle } from './components/Requests.js';
import Search from './components/Search'
import {Log} from './Logger.js'

export default class Explore extends Component {

  constructor(props) {
    super(props)
    this.state = {
      filter: 'N/A',
      categories: [],
      region: {
        latitude: 52.944351,
        longitude: -1.190312,
        latitudeDelta: 0.020,
        longitudeDelta: 0.0121
      },
      showPOI: false,
      showTime: false,
      item: {},
      clean: [],
      busTimes: []
    }

    this.viewPOI = this.viewPOI.bind(this)
    this.setFilter = this.setFilter.bind(this)
    this.showOverlayPOI = this.showOverlayPOI.bind(this)
    this.showOverlayTime = this.showOverlayTime.bind(this)
    this.showItem = this.showItem.bind(this)
    this.showBusTime = this.showBusTime.bind(this)

  }

  componentDidMount(){
    Axios.get( "https://inmyseat.chronicle.horizon.ac.uk/api/v1/allcats" )
        .then( response => this.setState( {categories: response.data.sort()}) );
     this.props.navigation.addListener('didFocus', (payload) => {
       Log.info('The Explore screen was activated');
     });
  }

  viewPOI(lat, lon) {
    this.mView.animateCamera({
      center: {
        latitude: lat,
        longitude: lon
      },
      zoom: 17 });
  }



  setFilter(filter) {
    this.setState({ filter: filter })
  }

  showOverlayPOI() {
    this.setState({ showPOI: true })
  }

  showOverlayTime(){
    this.setState({ showTime: true })
  }

  showItem(item) {
    let temp = item.description
    var split = temp.split('<br>')

    var clean = []
    split.map(
      (item) => {
        switch (String(item).substr(0, 4)) {
          case '':
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

  showBusTime(item){
    this.setState({busTimes: item})
  }

  render() {
    const searchOverlayRef = React.createRef();
    return (
      <View style={styles.containerP}>
        <View style={styles.mapContainer}>
          <MapView
            ref={mView => this.mView = globRef= mView}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            customMapStyle={mapStyle}
            onMapReady={this.ready}
            region={this.state.region} >
            <Stops showOverlay={this.showOverlayTime} showItem={this.showBusTime} />
            <POIS filter={this.state.filter} showOverlay={this.showOverlayPOI} showItem={this.showItem} />
          </MapView>
        </View>
        {/**POI Overlay */}
        <Overlay
          animationType='fade'
          isVisible={this.state.showPOI}
          onBackdropPress={() => this.setState({ showPOI: false })} >
          <View style={styles.containerP} >
            <ScrollView contentContainerStyle={styles.scrollCont} >
              <Text>{this.state.item.name}</Text>
              <Text>Category: {this.state.item.category}</Text>
              {
                String(this.state.clean[0]).substr(0, 4) === '<img'
                    ? <HTML html={this.state.clean[0]} />
                    : <Text>{this.state.clean[0]}</Text>
              }
              {
                this.state.clean.map(
                  (item, i) => {
                    if (i !== 0) {
                      return (<Text key={i} >{item}</Text>)
                    }
                  }
                )
              }
            </ScrollView>
          </View>
        </Overlay>
        {/**Bus Time Overlay */}
        <Overlay
          animationType='fade'
          isVisible={this.state.showTime}
          onBackdropPress={() => this.setState({ showTime: false, busTimes: [] })} >
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
        <Picker
            style={styles.picker}
            selectedValue={this.state.filter}
            onValueChange={(itemValue, itemIndex) => {
              this.setFilter(itemValue);
            }}>
          <Picker.Item label="Select Filter" value="N/A" />
          { this.state.categories.map( (item, i) => {
            const itemName = capitalize.words(item);
            return(
              <Picker.Item key={i} label={itemName} value={item} /> ) } )
          }
        </Picker>

        <ActionButton
            position='left'
            verticalOrientation='down'
            renderIcon={(active) => {
              return (<Icon name='md-menu' size={24} color='#FFFFFF' />)
            }}
            offsetX={15}
            offsetY={15}
            onPress={() => {
              this.props.navigation.dispatch(DrawerActions.openDrawer());
            }} />
        <ActionButton
            position='right'
            verticalOrientation='up'
            renderIcon={(active) => {
              return (<Icon name='md-search' size={24} color='#FFFFFF' />)
            }}
            offsetX={15}
            offsetY={15}
            onPress={() => {
              searchOverlayRef.current.setVisible(true);
            }} />
        <Search
            mode={'exp'}
            ref={searchOverlayRef}
            filter={this.state.filter}
            viewPOI={this.viewPOI}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 8,
    borderWidth: 4
  },
  containerP: {
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
