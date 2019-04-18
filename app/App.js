import React from "react"
import { View } from "react-native"
import { createAppContainer, createBottomTabNavigator } from "react-navigation"
import Map from './src/Map.js'
import MapSimple from "./src/MapSimple.js"
import TravelMap from './src/Travel'

/**
 * Tab Navigation Screens
 * Add new tabs here
 */

 /**
  * Screen for viewing POIS
  */
class ExploreScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <MapSimple />
      </View>
      
    )
  }
}

/**
 * Screen for planning a journey
 */
class PlanScreen extends React.Component {
  constructor(props){
    super(props) 
    this.state ={
      changeView: true,
      journeyKey: ''
    }
    this.change = this.change.bind(this)
  }
  //Function to switch to travel mode
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

const AppNavigator = createBottomTabNavigator(
  {
    Explore: ExploreScreen,
    Plan: PlanScreen
  },
  {
    initialRouteName: 'Explore',
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