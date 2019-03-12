import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, View, Picker, Text, ScrollView, Button} from 'react-native';
import { SearchBar, Overlay  } from 'react-native-elements'
import Axios from 'axios';

export default class Search extends Component {

    constructor(props){
      super(props) 
      this.state ={
        search:"",
        show: false,
        POIS: [],
        loaded: false
      }
    }

    componentDidMount(){
      Axios.get("https://inmyseat.chronicle.horizon.ac.uk/allpois")
      .then(response =>{
        return response.data
      })
      .then(data => this.setState({ POIS: data, loaded: true }))
      
  }

    updateSearch = search => {
      this.setState({ search });
    };

    render() {
      const { search } = this.state
      //console.log(search)
      return (
      <View style={{flex:1}}>
        <TouchableOpacity style={styles.button} onPress={()=>{this.setState({show: true})}}>
            <Text style={styles.text}>Search</Text>
        </TouchableOpacity>
        <Overlay 
                animationType="fade"
                isVisible={this.state.show}
                onBackdropPress={() => this.setState({ show: false })}
        >
            <View style={styles.containerP}>
                <SearchBar
                    placeholder="Type Here..."
                    onChangeText={this.updateSearch}
                    value={search}
                />
                <ScrollView contentContainerStyle={styles.scrollCont}>
                    {this.state.loaded ? 
                      this.state.POIS.map( (item, i) => { 
                        if(item.name.includes(search) && this.props.filter === "N/A" ? true : item.category === this.props.filter)
                        {
                          return(
                            <Text 
                              key={i}
                              style={styles.textList}
                              onPress={()=>{this.props.viewPOI(item.latitude, item.longitude); this.setState({ show: false })}}
                            >
                            {item.name}</Text>
                          )
                        } 
                        } 
                      )
                      : null}
                </ScrollView>
            </View>
        </Overlay>
      </View>
      );
    }
  }
/*

<TouchableOpacity key={i} style={styles.button} onPress={()=>{this.props.viewPOI(item.latitude, item.longitude); this.setState({ show: false })}}>
                              <Text style={styles.text}>{item.name}</Text>
                          </TouchableOpacity>
*/

const styles = StyleSheet.create({
    button:{
      flex:1,
      backgroundColor: '#add8e6',
      borderColor: 'black',
      borderWidth: 1
    },
    text:{
      fontSize: 14,
      fontWeight: 'bold',
      alignSelf: 'center',
      color: 'white',
    },
    textList:{
      padding: 10,
      fontSize: 14,
      fontWeight: 'bold',
      alignSelf: 'center',
    },
    containerP:{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        alignSelf: 'stretch'
      },
  });
  