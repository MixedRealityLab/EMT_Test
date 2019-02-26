import React, {Component} from 'react';
import { Text, View } from 'react-native'
import { Marker, Callout } from 'react-native-maps';
import Axios from 'axios';
import POISCallout from './POISCallout'

export default class POIS extends Component{

    constructor(props) {
        super(props);
    
        this.state = {
            POIS: [],
            render: []
        }
        this.returnInfo = this.returnInfo.bind(this)
    }
    
    returnInfo(){
      return(
        <View style={styles.containerP}>
            <Text>{this.props.item.name}</Text>
            <WebView originWhiteList={ ['*'] } source={ {html: this.state.text} } />
        </View>
      )
    }

    componentDidMount(){
        Axios.get("https://inmyseat.chronicle.horizon.ac.uk/allpois")
        .then(response =>{
          return response.data
        })
        .then(data => this.setState({ POIS: data}))
        .then( () => {
          var render = []
          for(let i = 0; i < this.state.POIS.length; i++){
            render[i] = false
          }
          return render
        })
        .then(data => this.setState({render: data}))
    }

    render(){
        return(
            this.state.POIS.map((item, i) =>{
              return(
                <Marker
                key={i}
                onPress={
                  () =>{
                    var temp = this.state.render
                    temp[i] = true
                    this.setState({
                      render: temp
                    })
                  }
                }
                name={item.name}
                coordinate={{latitude: item.latitude, longitude: item.longitude}}
                image={require('../assets/icons8-point-of-interest-52.png')}
                >
                <Callout>
                    <POISCallout item={item} render={this.state.render[i]} />
                </Callout>
                </Marker>
              )
            })
          )
    }
}
  