import React, {Component} from 'react';
import { TouchableOpacity, View, Picker, Text, StyleSheet, Alert, ToastAndroid } from 'react-native'
import { Overlay } from 'react-native-elements'
import Axios from 'axios'
import Search from './Search'
import ActionButton from 'react-native-action-button'
import Icon from 'react-native-vector-icons/Ionicons'
import { DrawerActions } from 'react-navigation';

/**
 * Class that displays various buttons and interactions for the user
 * Returns different arrangements depending on the mode prop provided by calling class
 * Current modes: View, Plan, Travel
 */
export default class Selector extends Component{

    constructor(props) {
        super(props);

        this.state = {
            mode: 'View',
            planShow: false,
            viewShow: false,
            filter: 'N/A',
            categories: [],
            destName: "",

        }

        this.modeSel = this.modeSel.bind(this)
        this.poiSet = this.poiSet.bind(this)
        this.endJour = this.endJour.bind(this)
    }

    componentDidMount(){
        Axios.get( "https://inmyseat.chronicle.horizon.ac.uk/api/v1/allcats" )
        .then( response => this.setState( {categories: response.data}) )
    }

    poiSet(lat, lon, name, key){
        var Des = {
            Name: name,
            Key: key,
            Lat: lat,
            Lon: lon
        }
        Alert.alert(
            "Point",
            "Set " + name + " as destination?",
            [
                {text: 'Yes', onPress: () => { this.props.setArr(Des); this.setState({destName: name}); this.props.getRoute() }},
                {
                    text: 'No',
                    onPress: () => {},
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
                {text: 'No', onPress: () => {} },
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
                            { this.state.categories.map( (item, i) => { return( <Picker.Item key={i} label={item} value={item} /> ) } ) }
                        </Picker>
                        <Search viewPOI={this.props.viewPOI} filter={this.props.filter}/>
                    </View>
                )
            case 'Plan':
                return(

                    <View style={styles.containerP} >

                    <ActionButton
                        position='left'
                        verticalOrientation='down'
                        renderIcon={(active) => {
                        return (<Icon name='md-menu' size={24} color='#FFFFFF' />)}}
                        offsetX={15}
                        offsetY={15}
                        onPress={() => {
                            this.props.navigation.dispatch(DrawerActions.openDrawer());
                        }}
                    />

                   <ActionButton buttonColor="#000">
                        <ActionButton.Item buttonColor='#add8e6' title="Route" onPress={() => this.setState({planShow: true})}>
                        <Icon name="md-flag" style={styles.actionButtonIcon} />
                        </ActionButton.Item>
                    </ActionButton>
                    <Overlay
                            animationType="fade"
                            isVisible={this.state.planShow}
                            onBackdropPress={() => this.setState({ planShow: false })}
                    >
                    <View style={styles.containerP} >

                    <Search mode={'plan'} viewPOI={this.poiSet} filter={this.state.filter}/>
                    <Text>Destination: </Text>
                    <Text>{ this.state.destName !== "" ? this.state.destName : "No Destination Selected" }</Text>
                    {}
                    <TouchableOpacity style={styles.button} onPress={()=>{ this.props.beginRoute()}}>
                        <Text style={styles.text}>Begin Route</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={()=>{this.props.clearRoute(); this.setState({destName:""})}}>
                        <Text style={styles.text}>Cancel</Text>
                    </TouchableOpacity>



                    </View>
                    </Overlay>
                    </View>
                )
            case 'Travel':
                return(
                    <>
                    
                    <ActionButton buttonColor="#000">
                        <ActionButton.Item buttonColor='#add8e6' title="Points of Interest" onPress={() => this.props.listPOIS() }>
                        <Icon name="md-locate" style={styles.actionButtonIcon} />
                        </ActionButton.Item>
                        <ActionButton.Item buttonColor='#add8e6' title="Recenter" onPress={() => this.props.following() }>
                        <Icon name="md-locate" style={styles.actionButtonIcon} />
                        </ActionButton.Item>
                        <ActionButton.Item buttonColor='#add8e6' title="End Journey" onPress={ () => this.endJour() }>
                        <Icon name="md-flag" style={styles.actionButtonIcon} />
                        </ActionButton.Item>
                    </ActionButton>
                    <ActionButton
                        position='left'
                        verticalOrientation='down'
                        renderIcon={(active) => {
                        return (<Icon name='md-menu' size={24} color='#FFFFFF' />)}}
                        offsetX={15}
                        offsetY={15}
                        onPress={() => {
                            this.props.navigation.dispatch(DrawerActions.openDrawer());
                        }}
                    />
                    </>
                )
            case 'Settings':
                return(
                    <ActionButton
                        position='left'
                        verticalOrientation='down'
                        renderIcon={(active) => {
                        return (<Icon name='md-menu' size={24} color='#FFFFFF' />)}}
                        offsetX={15}
                        offsetY={15}
                        onPress={() => {
                            this.props.navigation.dispatch(DrawerActions.openDrawer());
                        }}
                    />
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

/*
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
                            { this.state.categories.map( (item, i) => { return( <Picker.Item key={i} label={item} value={item} /> ) } ) }
                        </Picker>
                        <Search viewPOI={this.poiSet} filter={this.state.filter}/>
                    </View>
*/

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
