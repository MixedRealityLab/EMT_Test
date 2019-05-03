import React from 'react'
import { createAppContainer, createDrawerNavigator } from 'react-navigation'

import Info from './src/Info.js'
import Map from './src/Map.js'
import ExploreMap from './src/ExploreMap.js'
import Settings from './src/Settings'
import TravelMap from './src/Travel'


class ExploreScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Explore',
  };
  render() {
    return (<ExploreMap />)
  }
}

class PlanScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Plan',
  };
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
      <Map change={this.change} />
    )
  }
}

class HistoryScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: 'History',
  };
  render() {
    return (<Info />)
  }
}

class SettingsScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Settings',
  };
  render() {
    return (<Settings />)
  }
}

const DrawerNavigator = createDrawerNavigator({
  Explore: {
    screen: ExploreScreen,
  },
  Plan: {
    screen: PlanScreen
  },
  History: {
    screen: HistoryScreen,
  },
  Settings: {
    screen: SettingsScreen
  }
});

export default createAppContainer(DrawerNavigator);
