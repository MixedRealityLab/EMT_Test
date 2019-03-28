import React from "react"
import { View } from "react-native"
import { createAppContainer, createBottomTabNavigator } from "react-navigation"
import Map from './src/Map.js'
import MapSimple from "./src/MapSimple.js"
import TravelMap from './src/Travel'

/**
 * Tab Navigation Screens
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

class PlanScreen extends React.Component {
  constructor(props){
    super(props) 
    this.state ={
      changeView: false,
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

const AppNavigator = createBottomTabNavigator(
  {
    Explore: ExploreScreen,
    Plan: PlanScreen
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