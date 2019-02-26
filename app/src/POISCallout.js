import React, {Component} from 'react';
import { Text, StyleSheet, View } from 'react-native'
import { WebView } from "react-native-webview";
import HTML from 'react-native-render-html'

export default class POISCallout extends Component{

    constructor(props){
        super(props)
        this.state ={
            clean: []
        }
    }

    componentDidMount(){
        let temp = this.props.item.description
        var split = temp.split("<br>")
        //console.log(split)

        var clean = []
        split.map(
            (item) => {
                switch (String(item).substr(0,4)){
                    case "":
                    break
                    default:
                        clean.push(item)
                    break
                }
            }
        )
        this.setState({
            clean: clean
        })

    }


    render(){
        //console.log(this.state.img)
        //console.log(this.state.text)
        this.temp
        return(
            this.props.render ? 
            <View style={styles.containerP}>
                <Text>{this.props.item.name}</Text>
                <HTML html={this.state.clean[1]} />
            </View>
            :
            null
        )
    }
}

const styles = StyleSheet.create({
    containerP:{
      flex: 1
    }
  });
  /*
  <WebView  
                originWhitelist={['*']}
                allowUniversalAccessFromFileURLs={true}
                domStorageEnabled={true}
                source={{html: this.props.item.description , baseUrl: ''}} style={styles.containerP}
                />*/