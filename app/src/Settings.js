import React, {Component} from 'react';
import {AsyncStorage, ScrollView, Text, StyleSheet, TouchableOpacity, View, LayoutAnimation, Platform, UIManager } from 'react-native'
import { CheckBox } from 'react-native-elements'

export default class Info extends Component{

    constructor(props) {
        super(props);

        this.state = {
            Open: false,
            Settings: []
        }

        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }

        this.saveSettings = this.saveSettings.bind(this)
    }

    changeLayout = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState({ expanded: !this.state.expanded });
    }

    componentDidMount(){
        this.setState(
            {
                Settings: AsyncStorage.getItem("Setting")
            }
        )
    }

    saveSettings(){
        console.log("Save")
    }


    render(){
        return(
            <ScrollView contentContainerStyle={styles.scrollCont}>
                <View style={styles.expandMenuHolder}>
                        <TouchableOpacity activeOpacity={0.8} onPress={this.changeLayout} style={styles.expandMenu}>
                        <Text style={styles.expandMenuHeaderText}>Notifications</Text>
                        </TouchableOpacity>
                        <View style={{ height: this.state.expanded ? null : 0, overflow: 'hidden' }}>
                            <View style={styles.column}>
                                <CheckBox
                                title='Click Here'
                                checked={this.state.checked}
                                onPress={() => this.setState({checked: !this.state.checked})}
                                />
                                <CheckBox
                                title='Click Here'
                                checked={this.state.checked}
                                onPress={() => this.setState({checked: !this.state.checked})}
                                />
                                <CheckBox
                                title='Click Here'
                                checked={this.state.checked}
                                onPress={() => this.setState({checked: !this.state.checked})}
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
