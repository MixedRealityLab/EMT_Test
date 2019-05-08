import React, {Component} from 'react'
import { StyleSheet, View, AsyncStorage, ScrollView, Text } from 'react-native'
import MapView, { PROVIDER_GOOGLE, Polyline, Marker }  from 'react-native-maps'
import HTML from 'react-native-render-html'
import { mapStyle } from './components/Requests'
import Selector from './components/Selector'
import Geolocation from 'react-native-geolocation-service'
import { Overlay } from 'react-native-elements'
import Axios from 'axios';
import StateMan from './components/StateCheck'
import AppMan from './components/NotifMan'
import LocMan from './components/BackgroundService'

const StateManager = new StateMan()
var PushNotification = require('react-native-push-notification');

export default class Travel extends Component {

    constructor(props){
      super(props)
      this.state ={
        route: {},
        points: [],
        facticles: [],
        currentPos: {},
        Settings: {},
        VisiblePois: [],
        loaded: false,
        showPOI: false,
        showList: false,
        clean: [],
        following: true,
        polyOptsBus:['#00ff00' ,
                     '#0000ff' ,
                     '#000000' ,
                     '#fff000' ]
      }
      this.getFacticles = this.getFacticles.bind(this)
      this.showItem = this.showItem.bind(this)
    }

    viewPOI() {
      this.mView.animateCamera({center:this.state.currentPos, zoom: 17})
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
            showPOI: true
        })
    }

    getLoc(){
      Geolocation.getCurrentPosition(
        (position) => {
            this.setState({
              currentPos: {latitude: position.coords.latitude, longitude: position.coords.longitude}
            }), this.state.following ? this.viewPOI() : console.log("freecam")
            console.log("Get Location (Travel.js)")
            AsyncStorage.getItem('Setting', (err,res) => {
              let obj = JSON.parse(res); this.setState({Settings: obj});
            } )
            AsyncStorage.getItem('VisPOIS', (err,res) => {
              if(JSON.parse(res) !== this.state.VisiblePois){
                this.setState({VisiblePois: JSON.parse(res)})
              }
            })
            AppMan.setRate(this.state.Settings.NotifRate)
            //Check if facticles are turned on
            if(this.state.Settings.Facticle)
              AppMan.state.facticles.map( (item) => {
              //Make sure that only the facticle categories that the user selected show up
              if(this.state.Settings.Filter.includes(item.category)){
                //If a facticle is visible, add it to the list of visible POIS
                let vis = AppMan.checkDist(position.coords, item)
                //AppMan.checkDist(position.coords, item)
                if(vis){
                  console.log(item)
                  console.log(this.state.VisiblePois)
                  if(!this.state.VisiblePois.includes(item) ){
                    console.log("Found")
                    this.state.VisiblePois.push(
                      item
                    )
                    AsyncStorage.setItem('VisPOIS', JSON.stringify(this.state.VisiblePois))
                  }
                }
              }
              })
            if(this.state.Settings.Direct){
              this.state.route.changes.map( (item, i) => {
                let dir = item
                let loc = this.state.route.route[i + 1][0]
                let temp = Object.assign(dir, loc)
                AppMan.checkDist(position.coords, temp)
              })
            }
            

        },
        (error) => {
            // See error code charts below.
            console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
    }

    getFacticles(){
      Axios.get("https://inmyseat.chronicle.horizon.ac.uk/api/v1/timeline" )
      .then( response => {
        this.setState({facticles: response.data})
        return response.data
      })
      .then( data =>
        AsyncStorage.setItem('facticles', JSON.stringify(data))
      )
    }

    componentDidMount(){
      this.getLoc()
      AppMan.loadJourney()
      AsyncStorage.setItem('VisPOIS', '[]')
      this.intervalID = setInterval( () => this.getLoc(), 2000)
      this.getFacticles()
      AsyncStorage.getItem(
        this.props.jKey
        ,(err,res) =>{ let obj = JSON.parse(res); this.setState({route: obj, points: obj.route})}
      )
      .then(
        () => {
          console.log(this.state.route)
          var temp = []
          if(this.state.points.length < 6){
            for(let i = 0; i < this.state.points.length; i++){
              let part = []
              this.state.points[i].map( (item,i) => { part.push({latitude: item.latitude, longitude: item.longitude}) } )
              temp.push( part )
            }
          }
          else temp = this.state.points
            return temp
            }
          )
      .then( (res) => this.setState({points: res, loaded: true}) )
      .then( () => { AsyncStorage.setItem('CurrentJ',
        this.props.jKey
      ) } )
      console.log(StateManager.returnState())
    }

    componentWillUnmount(){
      clearInterval(this.intervalID)
      console.log("Unmount")
    }

    render() {
      //Stop background service
      LocMan.clean()
      return (
      <View style={styles.containerP}>
      <View style={styles.mapContainer}>
       <MapView
         provider={PROVIDER_GOOGLE}
         ref={mView => this.mView = mView}
         style={styles.map}
         customMapStyle={mapStyle}
         onMapReady={this.ready}

         initialRegion={{
           latitude: 52.944351,
           longitude: -1.190312,
           latitudeDelta: 0.020,
           longitudeDelta: 0.0121,
         }}
         onPanDrag={ () => { this.state.following ? this.setState({following: false}) : null } }
       >
       {
          this.state.loaded ?
          this.state.VisiblePois.map( (item,i) => {
            return(
              <Marker
                key={i}
                coordinate={{latitude: item.latitude, longitude: item.longitude}}
                image={require('../assets/icons8-point-of-interest-52.png')}
                onPress={ () => {
                  this.showItem(this.state.VisiblePois[i])
                } }
              /> )
          })
          : null
        }
       {
           this.state.loaded ?
           this.state.points.map(
             (item, i) =>
                {
                  return(
                    <View key={i} >
                      { i !== 0 ?
                      <Marker
                        coordinate={item[0]}
                        image={ require('../assets/icons8-synchronize-filled-96.png') }
                      /> : null }
                      <Polyline coordinates={item} strokeColor = {this.state.polyOptsBus[i]} strokeWidth = {3} />
                    </View>
                    )
                }
             )
            : console.log("empty")
       }
       {
         this.state.loaded ?
         this.state.currentPos.latitude === undefined ? console.log("empty")
         : <Marker coordinate={ this.state.currentPos }
            image={ require('../assets/mylocation.gif') }
            style={styles.image}
            />
         :
         console.log("empty")
       }
       </MapView>
       {/*POIS overlay*/}
       <Overlay
          animationType="fade"
          isVisible={this.state.showPOI}
          onBackdropPress={() => this.setState({ showPOI: false })}
        >
        <View style={styles.containerP} >
        <ScrollView contentContainerStyle={styles.scrollCont} >
          <Text>{this.state.clean.name}</Text>
          <Text>Category: {this.state.clean.category}</Text>
          {
            String(this.state.clean[0]).substr(0,4) === "<img" ?
              //<HTML html={this.state.clean[0]} />
              <></>
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
        </ScrollView>
        </View>
        </Overlay>
        {/*POIS List overlay*/}
        <Overlay
          animationType="fade"
          isVisible={this.state.showList}
          onBackdropPress={() => this.setState({ showList: false })}
        >
        <View style={styles.containerP} >
        <ScrollView contentContainerStyle={styles.scrollCont} >
          {
            this.state.VisiblePois.map( (item, i) => {
              return(
                <Text key={i} onPress={ () => {
                  this.mView.animateCamera({center:{latitude: item.latitude, longitude: item.longitude}, zoom: 17})
                  this.setState({showList: false, following: false})
                } } > {item.name} </Text>
              )
            })
          }
        </ScrollView>
        </View>
        </Overlay>
       <Selector change={this.props.change} mode={'Travel'} following={ () => { this.setState({following: true}), this.viewPOI() } } listPOIS={ ()=> this.setState({showList: true}) } />
      </View>
    </View>
      )
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
    },
    image: {
      height: 22,
      width: 22
    }

  })
