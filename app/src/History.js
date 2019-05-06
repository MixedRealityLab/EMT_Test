import React, {Component} from 'react';
import {AsyncStorage, ScrollView, Text, StyleSheet} from 'react-native'

export default class History extends Component{

    constructor(props) {
        super(props);

        this.state = {
            keys: []
        }
    }

    componentDidMount(){
        AsyncStorage.getAllKeys((err,res) =>{ this.setState({keys: res}) })
        AsyncStorage.getItem("0000", (err,res) =>{ let obj = JSON.parse(res); console.log(obj)})
    }
    render(){
        console.log(this.state.keys)
        return(
            <>
                <ScrollView contentContainerStyle={styles.scrollCont}>
                    <Text>Keys:</Text>
                    {this.state.keys.map( (item,i) =>(<Text key={i}>{item}</Text>) )}
                </ScrollView>
            </>
          )
    }
}

const styles = StyleSheet.create({
    scrollCont:{
        paddingVertical: 20
      },
})
