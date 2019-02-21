import React from "react";
import { Button, View, Text, PermissionsAndroid } from "react-native";
import { createStackNavigator, createAppContainer } from "react-navigation";
import Map from './src/Map.js'
import Info from './src/Info.js'


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
    
  }

  componentDidMount(){
    requestLocationPermission()
  }

  static navigationOptions = ({ navigation }) => {
    return{
      title: 'In My Seat',
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

class DetailsScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Info />
        
      </View>
    );
  }
}

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Details: DetailsScreen
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#add8e6',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  }
);

export default createAppContainer(AppNavigator);