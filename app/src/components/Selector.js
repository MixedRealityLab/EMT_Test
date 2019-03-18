import React, {Component} from 'react';
import {TouchableOpacity, View, Picker, Text, StyleSheet, Alert} from 'react-native'
import { Overlay } from 'react-native-elements'
import Search from './Search'
import ActionButton from 'react-native-action-button'
import Icon from 'react-native-vector-icons/Ionicons'

export default class Selector extends Component{

    constructor(props) {
        super(props);

        this.state = {
            mode: 'View',
            show: false,
            filter: 'N/A'
        }

        this.modeSel = this.modeSel.bind(this)
        this.poiSet = this.poiSet.bind(this)
        this.endJour = this.endJour.bind(this)
    }
    
    componentDidMount(){

    }

    poiSet(lat, lon){
        console.log("Lat: " + lat)
        console.log("Lon: " + lon)
        Alert.alert(
            "Point",
            "Set as Start point or End point",
            [
                {text: 'Start', onPress: () => { console.log('Start pressed') }},
                {text: 'End', onPress: () => console.log('End Pressed')},
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
            ],
            {cancelable: false},
        )
    }

    endJour(){
        Alert.alert(
            "End Journey",
            "Are you sure?",
            [
                {text: 'Yes', onPress: () => this.props.change('') },
                {text: 'No', onPress: () => console.log('Do nothing') },
            ]
        )
    }

    modeSel(){
        switch (this.props.mode){
            case 'View':
                return(
                    <View style={styles.tRow}>
                        <Picker
                            selectedValue={this.props.filter}
                            style={styles.picker}
                            onValueChange={(itemValue, itemIndex) =>
                            {
                                this.props.setFilter(itemValue)
                            }
                            }>
                            <Picker.Item label="Select Filter"      value="N/A" />
                            <Picker.Item label="Gardens"            value="Gardens" />
                            <Picker.Item label="Food and Drink"     value="Food and Drink" />
                        </Picker>
                        <Search viewPOI={this.props.viewPOI} filter={this.props.filter}/>
                    </View>
                )
            case 'Plan':
                return(
                    <View style={styles.containerP} >
                   <ActionButton buttonColor="#000">
                        <ActionButton.Item buttonColor='#add8e6' title="Route" onPress={() => this.setState({show: true})}>
                        <Icon name="md-flag" style={styles.actionButtonIcon} />
                        </ActionButton.Item>
                    </ActionButton>
                    <Overlay 
                            animationType="fade"
                            isVisible={this.state.show}
                            onBackdropPress={() => this.setState({ show: false })}
                    >
                    <View style={styles.containerP} >
                    <View style={styles.containerP} >
                    <Picker
                            selectedValue={this.props.dep}
                            style={styles.picker}
                            onValueChange={(itemValue, itemIndex) => this.props.setDep(itemValue)
                            }>
                            <Picker.Item label="Select Departure"                 value="-1" />
                            <Picker.Item label="Innovation Park"                  value="0"  />
                            <Picker.Item label="Newark Hall"                      value="1"  />
                            <Picker.Item label="Exchange Building"                value="2"  />
                            <Picker.Item label="Lenton Hillside"                  value="3"  />
                            <Picker.Item label="Dunkirk East Entrance"            value="4"  />
                            <Picker.Item label="George Green Library"             value="5"  />
                            <Picker.Item label="Campus Arts Centre"               value="6"  />
                            <Picker.Item label="Lincon Hall"                      value="7"  />
                            <Picker.Item label="East Entrance"                    value="8"  />
                            <Picker.Item label="Campus Union Shop"                value="9"  />
                            <Picker.Item label="Derby Hall"                       value="10" />
                            <Picker.Item label="Kings Meadow Campus"              value="11" />
                            <Picker.Item label="East Midlands Coference Centre"   value="12" />
                            <Picker.Item label="Current Location"                 value="13" />
                        </Picker>
            
                        <Picker
                            selectedValue={this.props.arr}
                            style={styles.picker}
                            onValueChange={(itemValue, itemIndex) => this.props.setArr(itemValue)
                            }>
                            <Picker.Item label="Select Destination"               value="-1" />
                            <Picker.Item label="Innovation Park"                  value="0"  />
                            <Picker.Item label="Newark Hall"                      value="1"  />
                            <Picker.Item label="Exchange Building"                value="2"  />
                            <Picker.Item label="Lenton Hillside"                  value="3"  />
                            <Picker.Item label="Dunkirk East Entrance"            value="4"  />
                            <Picker.Item label="George Green Library"             value="5"  />
                            <Picker.Item label="Campus Arts Centre"               value="6"  />
                            <Picker.Item label="Lincon Hall"                      value="7"  />
                            <Picker.Item label="East Entrance"                    value="8"  />
                            <Picker.Item label="Campus Union Shop"                value="9"  />
                            <Picker.Item label="Derby Hall"                       value="10" />
                            <Picker.Item label="Kings Meadow Campus"              value="11" />
                            <Picker.Item label="East Midlands Coference Centre"   value="12" />
                        </Picker>
                    </View>
            
                    <View style={styles.containerP} >
                        <View style={styles.tRow}>
                        <TouchableOpacity style={styles.button} onPress={this.props.getRoute}>
                            <Text style={styles.text}>Get Route</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={this.props.clearRoute}>
                            <Text style={styles.text}>Clear Route</Text>
                        </TouchableOpacity>
                        </View>
                        <View style={styles.tRow}>
                        <TouchableOpacity style={styles.button} onPress={this.props.beginRoute}>
                            <Text style={styles.text}>Begin Route</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={this.props.switch}>
                            <Text style={styles.text}>Switch Route</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.tRow}>
                        <Picker
                            selectedValue={this.state.filter}
                            style={styles.picker}
                            onValueChange={(itemValue, itemIndex) => {this.setState({filter: itemValue})}
                            }>
                            <Picker.Item label="Select Filter"      value="N/A" />
                            <Picker.Item label="Gardens"            value="Gardens" />
                            <Picker.Item label="Food and Drink"     value="Food and Drink" />
                        </Picker>
                        <Search viewPOI={this.poiSet} filter={this.state.filter}/>
                    </View>
                    </View>
                    </Overlay>
                    </View>
                )
            case 'Travel':
                return(
                    <ActionButton buttonColor="#000">
                        <ActionButton.Item buttonColor='#add8e6' title="Recenter" onPress={() => this.props.following() }>
                        <Icon name="md-locate" style={styles.actionButtonIcon} />
                        </ActionButton.Item>
                        <ActionButton.Item buttonColor='#add8e6' title="End Journey" onPress={ () => this.endJour() }>
                        <Icon name="md-flag" style={styles.actionButtonIcon} />
                        </ActionButton.Item>
                    </ActionButton>
                )
        }
    }

    render(){
        return(
            <View style={styles.containerP}>
                {this.modeSel()}
            </View>
          )
    }
}

const styles = StyleSheet.create({
    tRow:{
        top:0,
        left:0,
        right:0,
        left:0,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    picker:{
        flex:1
    },
    containerP:{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        alignSelf: 'stretch'
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
    }
})