import React, {Component} from 'react';
import {AsyncStorage, ScrollView, Text, StyleSheet, TouchableOpacity, View, LayoutAnimation, Platform, UIManager } from 'react-native'
import { CheckBox } from 'react-native-elements'

/**
 * Class to allow the user to edit settings
 * Currently only changes notifcation settings
 */
export default class Info extends Component{

    constructor(props) {
        super(props);

        this.state = {
            Settings: {},
            notifDirect: true,
            notifFacticle: true,
            notifOpen: false
        }

        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }

        this.saveSettings = this.saveSettings.bind(this)
    }

    changeLayout = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState({ notifOpen: !this.state.notifOpen });
    }

    componentDidMount(){
        var temp= {}

        AsyncStorage.getItem( 
            'Setting', (err,res) => {
                temp = JSON.parse(res)
                console.log(temp)
                this.setState({
                    Settings: temp,
                    notifDirect: temp.Direct,
                    notifFacticle: temp.Facticle
                })
            }
        )
    }

    saveSettings(){
        console.log("Save")
        var Settings = {
            Direct:     this.state.notifDirect,  //Direction Notifications
            Facticle:   this.state.notifFacticle //Facticle Notifications
        }
        AsyncStorage.setItem( 'Setting', JSON.stringify(Settings) )
    }

    render(){
        return(
            <ScrollView contentContainerStyle={styles.scrollCont}>
                <View style={styles.expandMenuHolder}>
                        <TouchableOpacity activeOpacity={0.8} onPress={this.changeLayout} style={styles.expandMenu}>
                        <Text style={styles.expandMenuHeaderText}>Notifications</Text>
                        </TouchableOpacity>
                        <View style={{ height: this.state.notifOpen ? null : 0, overflow: 'hidden' }}>
                            <View style={styles.column}>
                                <CheckBox
                                title='Direction notifications'
                                checked={this.state.notifDirect}
                                onPress={() => this.setState({notifDirect: !this.state.notifDirect})}
                                />
                                <CheckBox
                                title='Facticle Notifications'
                                checked={this.state.notifFacticle}
                                onPress={() => this.setState({notifFacticle: !this.state.notifFacticle})}
                                />
                            </View>
                        </View>
                    </View>
                <TouchableOpacity style={styles.button} onPress={this.saveSettings}>
                    <Text style={styles.text}>Save</Text>
                </TouchableOpacity>
            </ScrollView>
          )
    }
}

const styles = StyleSheet.create({
    scrollCont:{
        paddingVertical: 10
      },
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
    column:{
        top:0,
        left:0,
        right:0,
        left:0,
        flex: 3,
        flexDirection: 'column',
        justifyContent: 'center',
      },
      expandMenuHeaderText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 20
      },
     
      expandMenuHolder: {
        borderWidth: 1,
        borderColor: 'black'
      },
     
      expandMenu: {
        padding: 10,
        backgroundColor: '#add8e6'
      }
})
