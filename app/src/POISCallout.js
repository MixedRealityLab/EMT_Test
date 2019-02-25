import React, {Component} from 'react';
import { Text, StyleSheet, View } from 'react-native'
import { WebView } from "react-native-webview";
import HTML from 'react-native-render-html'

export default class POISCallout extends Component{
    render(){
        console.log(String(this.props.item.description))
        return(
            <View>
                <Text>{this.props.item.name}</Text>
                <HTML html={this.props.item.description } imagesMaxWidth={300} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    containerP:{
      flex: 1,
      flexDirection: 'column'
    }
  });
  /*
  <WebView  
                originWhitelist={['*']}
                allowUniversalAccessFromFileURLs={true}
                domStorageEnabled={true}
                source={{html: this.props.item.description , baseUrl: ''}} style={styles.containerP}
                />*/