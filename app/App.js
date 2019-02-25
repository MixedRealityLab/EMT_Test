import React from "react";
import { Button, View, Text, PermissionsAndroid } from "react-native";
import { createAppContainer, createBottomTabNavigator } from "react-navigation";
import Map from './src/Map.js'
import Info from './src/Info.js'
import MapSimple from "./src/MapSimple.js";



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
    console.warn(err);
  }
}

class HomeScreen extends React.Component {
  constructor(props){
    super(props)
    this.nav = this.nav.bind(this)
  }

  nav(){
    this.props.navigation.openDrawer();
  }

  componentDidMount(){
    requestLocationPermission()
  }
  render() {
    return (
      <><Text>Hi</Text>
      <Button onPress={this.nav} title={"Push Me"}></Button></>
      
      
    );
  }
}

class PlanScreen extends React.Component {
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
  render() {
    return (
      <Map/>
    );
  }
}

class ViewScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <MapSimple />
        
      </View>
    );
  }
}

class InfoScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Info />
        
      </View>
    );
  }
}

const AppNavigator = createBottomTabNavigator(
  {
    Home: HomeScreen,
    Plan: PlanScreen,
    View: ViewScreen,
    Info: InfoScreen
  },
  {
    initialRouteName: 'View',
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
);

export default createAppContainer(AppNavigator);