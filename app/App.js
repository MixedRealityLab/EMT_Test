import React from "react"
import { View, PermissionsAndroid } from "react-native"
import { createAppContainer, createBottomTabNavigator } from "react-navigation"
import Map from './src/Map.js'
import Info from './src/Info.js'
import MapSimple from "./src/MapSimple.js"
import Settings from './src/Settings'
import TravelMap from './src/Travel'

async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'In My Seat',
        message:
          'In My Seat needs access to your current location ' +
          'so that it can give you information about the ' +
          'surrounding area.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Access granted');
      
    } else {
      console.log('Access denied');
    }
  } catch (err) {
    console.warn(err)
  }
}

class ExploreScreen extends React.Component {
  componentDidMount(){
    requestLocationPermission()
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <MapSimple />
      </View>
    )
  }
}

class PlanScreen extends React.Component {
  constructor(props){
    super(props) 
    this.state ={
      changeView: true,
      journeyKey: ''
    }
    this.change = this.change.bind(this)
  }

  change(jKey){
    this.setState(
      {
        changeView: !this.state.changeView,
        journeyKey: jKey
      }
    )
  }
  render() {
    return (
      this.state.changeView ? 
      <TravelMap change={this.change} jKey={this.state.journeyKey} />
      :
      <Map change={this.change}/>
      
    )
  }
}

class HistoryScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Info />
      </View>
    )
  }
}

class SetScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Settings />
      </View>
    )
  }
}


const AppNavigator = createBottomTabNavigator(
  {
    Explore: ExploreScreen,
    Plan: PlanScreen,
    History: HistoryScreen,
    Settings: SetScreen
  },
  {
    initialRouteName: 'Plan',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#add8e6',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
    tabBarOptions: {
      activeTintColor: '#fff',
      inactiveTintColor: 'gray',
      inactiveBackgroundColor: 'black',
      activeBackgroundColor: '#add8e6',
      labelStyle:{fontSize:16}
    },
  }
)

export default createAppContainer(AppNavigator);

/*
static navigationOptions = ({ navigation }) => {
    return{
      title: 'Plan',
      headerRight: <Button
      onPress={() => navigation.navigate('Details')}
      title="Info"
      color="#000"
    />
    }
  };
*/