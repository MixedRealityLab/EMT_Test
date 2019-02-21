import React, {Component} from 'react';
import {AsyncStorage, ScrollView, Text, StyleSheet} from 'react-native'

export default class Info extends Component{

    constructor(props) {
        super(props);

        this.state = {
            keys: []
        }
    }
    
    componentDidMount(){
        AsyncStorage.getAllKeys((err,res) =>{ this.setState({keys: res}) })
        
    }
    render(){
        console.log(this.state.keys)
        return(
            <>
                <ScrollView contentContainerStyle={styles.container}>
                    <Text>Keys:</Text> 
                    {this.state.keys.map( (item,i) =>(<Text key={i}>{item}</Text>) )}
                </ScrollView>
            </>
          )
    }
}

const styles = StyleSheet.create({
    container:{
       
        paddingVertical: 20
      },
})