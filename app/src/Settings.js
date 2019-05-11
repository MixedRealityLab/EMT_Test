import React, {Component} from 'react';
import {AsyncStorage, ScrollView, Text, StyleSheet, TouchableOpacity, View, LayoutAnimation, Platform, UIManager } from 'react-native'
import { CheckBox, Slider } from 'react-native-elements'
import Axios from 'axios';

import Selector from './components/Selector'

/**
 * Class to allow the user to edit settings
 * Currently only changes notifcation settings
 */
export default class Info extends Component{

    constructor(props) {
        super(props);

        this.state = {
            notifOpen: false,
            filterOpen: false,
            rateOpen: false,
            Settings: {},
            notifDirect: true,
            notifFacticle: true,
            filterList: [],
            rateNotif: 1,
            categories: [],
        }

        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }

        this.saveSettings = this.saveSettings.bind(this)
        this.updateFilter = this.updateFilter.bind(this)
    }

    changeLayout = (item) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        switch(item){
            case 0:
            this.setState({ notifOpen: !this.state.notifOpen })
            break
            case 1:
            this.setState({ filterOpen: !this.state.filterOpen })
            break
            case 2:
            this.setState({ rateOpen: !this.state.rateOpen })
            break
        }
    }

    componentDidMount(){
        var temp= {}

        AsyncStorage.getItem(
            'Setting', (err,res) => {
                temp = JSON.parse(res)
                this.setState({
                    Settings: temp,
                    notifDirect: temp.Direct,
                    notifFacticle: temp.Facticle,
                    filterList: temp.Filter,
                    rateNotif: temp.NotifRate
                })
            }
        )

        Axios.get( "https://inmyseat.chronicle.horizon.ac.uk/api/v1/allcats" )
        .then( response => this.setState( {categories: response.data}) )
    }

    saveSettings(){
        var Settings = {
            Direct:     this.state.notifDirect,     //Direction Notifications
            Facticle:   this.state.notifFacticle,   //Facticle Notifications
            Filter:     this.state.filterList,      //Facticle Notification Filter
            NotifRate:  this.state.rateNotif        //Facticle Notification Display Rate
        }
        AsyncStorage.setItem( 'Setting', JSON.stringify(Settings) )
    }

    updateFilter(item){
        var temp = this.state.filterList
        if(this.state.filterList.includes(item)){
            let index = temp.indexOf(item)
            temp.splice(index, 1)
        }
        else{
            temp.push(item)
        }
        this.setState({filterList: temp})
        this.saveSettings()
    }

    render(){
        return(
            <View style={{flex:1}}>
            <Selector
                mode={'Settings'}                       //Tell component what to return
                navigation={this.props.navigation}  //Pass Nav props
            />
            <ScrollView contentContainerStyle={styles.scrollCont}>
            {/*Drop down to choose what type of notifications can be shown*/}
                <View style={styles.expandMenuHolder}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => this.changeLayout(0)} style={styles.expandMenu}>
                        <Text style={styles.expandMenuHeaderText}>Notification Types</Text>
                        </TouchableOpacity>
                        <View style={{ height: this.state.notifOpen ? null : 0, overflow: 'hidden' }}>
                            <Text>Set if you want to see factile or direction notifications</Text>
                            <View style={styles.column}>
                                <CheckBox
                                title='Direction notifications'
                                checked={this.state.notifDirect}
                                onPress={() => {this.setState({notifDirect: !this.state.notifDirect}); this.saveSettings() } }
                                />
                                <CheckBox
                                title='Facticle Notifications'
                                checked={this.state.notifFacticle}
                                onPress={() => { this.setState({notifFacticle: !this.state.notifFacticle}); this.saveSettings() }}
                                />
                            </View>
                        </View>
                    </View>
                {/*Drop down to choose a filter for notifications*/}
                <View style={styles.expandMenuHolder}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => this.changeLayout(1)} style={styles.expandMenu}>
                        <Text style={styles.expandMenuHeaderText}>Notification Filters</Text>
                        </TouchableOpacity>
                        <View style={{ height: this.state.filterOpen ? null : 0, overflow: 'hidden' }}>
                            <View style={styles.column}>
                                <Text>Set the type of factile notifications that appear</Text>
                                {this.state.categories.map(
                                    (item, i) => {
                                        return(
                                            <CheckBox
                                            title= {item}
                                            key={i}
                                            checked={ this.state.filterList.length === 0 ? false : this.state.filterList.includes(item) }
                                            onPress={() => this.updateFilter(item) }
                                            />
                                        )
                                    }
                                )}

                            </View>
                        </View>
                    </View>
                {/*Drop down to choose how often notifications are sent*/}
                <View style={styles.expandMenuHolder}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => this.changeLayout(2)} style={styles.expandMenu}>
                        <Text style={styles.expandMenuHeaderText}>Notification Rates</Text>
                        </TouchableOpacity>
                        <View style={{ height: this.state.rateOpen ? null : 0, overflow: 'hidden' }}>
                            <View style={styles.column}>
                            <View style={{ flex: 1, alignItems: 'stretch', justifyContent: 'center' , flexDirection: 'column'}}>
                                <Text>Set the time in seconds between facticle notifications</Text>
                                <Slider
                                    value={this.state.rateNotif}
                                    onValueChange={ value => this.setState({ rateNotif: value })}
                                    onSlidingComplete={ () => this.saveSettings() }
                                    minimumValue={0}
                                    maximumValue={60}
                                    step={1}
                                />
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}} >
                                <Text>0 Seconds</Text>
                                <Text>60 Seconds</Text>
                                </View>
                                <Text>Current interval: {this.state.rateNotif}</Text>

                            </View>
                            </View>
                        </View>
                    </View>
                <TouchableOpacity style={styles.button} onPress={this.saveSettings}>
                    <Text style={styles.text}>Save</Text>
                </TouchableOpacity>
            </ScrollView>
            </View>
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
