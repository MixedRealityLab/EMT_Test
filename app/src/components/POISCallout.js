import React, {Component} from 'react';
import { Text, StyleSheet, View } from 'react-native'
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
    showOverlay(){ this.setState({show: true}) }

    render(){
        return(
        <Overlay 
          animationType="fade"
          isVisible={this.state.show}
          onBackdropPress={() => this.setState({ show: false })}
        >
        <View style={styles.containerP} >
        </View>
        </Overlay>
        )
    }
}

const styles = StyleSheet.create({
    containerP:{
        flexDirection: 'column',
        alignSelf: 'flex-start',
        width: 200
    },
  });

/*
this.props.render ? 
            <View style={styles.containerP}>
                <Text>{this.props.item.name}</Text>
                {this.state.clean.map( (item, i) => { return( String(item).substr(0,4) === "<img" ? null : <HTML key={i} html={item} imagesMaxWidth={200} imagesMaxHeight={200}/> ) } )}
                
            </View>
            :
            null
*/