import React, {Component} from 'react';
import { StyleSheet, TouchableOpacity, View, Text, ScrollView } from 'react-native';
import { SearchBar, Overlay  } from 'react-native-elements'
import Axios from 'axios';

export default class Search extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isLoaded: false,
      pois: [],
      searchTerm: '',
      isVisible: false,
    };
    this.setVisible = this.setVisible.bind(this);
  }

  componentDidMount() {
    Axios.get('https://inmyseat.chronicle.horizon.ac.uk/api/v1/allpois')
      .then(response => {
        return response.data.sort((e1, e2) => {
          if (e1.name < e2.name) {
            return -1;
          } else if (e1.name > e2.name) {
            return 1;
          }
          return 0;
        });
      })
      .then(data => this.setState({ pois: data, isLoaded: true }));
  }

  setVisible(isVisible) {
    this.setState({ isVisible: isVisible });
  }

  render() {
    return (
      <View style={ this.props.mode === 'plan' ? {flex:1}: {} }>
      {
        this.props.mode === 'plan'
        ? <TouchableOpacity style={styles.button} onPress={()=>{this.setVisible(true)}}>
            <Text style={styles.text}>Search</Text>
          </TouchableOpacity>
        : null
      }
      <Overlay
          animationType='fade'
          isVisible={this.state.isVisible}
          onBackdropPress={() => this.setVisible(false)} >
        <View style={styles.containerP}>
          <SearchBar
              placeholder='Type Here...'
              onChangeText={(text) => {this.setState({searchTerm: text})}}
              value={this.state.searchTerm} />
          <ScrollView contentContainerStyle={styles.scrollCont}>
            {this.state.isLoaded
                ? this.state.pois.map((item, i) => {
                  if (item.name.includes(this.state.searchTerm)
                      && (this.props.filter === 'N/A'
                          ? true
                          : item.category === this.props.filter)) {
                    return (
                      <Text
                          key={i}
                          style={styles.textList}
                          onPress={() => {
                            this.props.viewPOI(
                                item.latitude,
                                item.longitude,
                                item.name, i);
                            this.setVisible(false);
                          }}>
                        {item.name}
                      </Text>
                    )
                  }})
                : null}
          </ScrollView>
        </View>
      </Overlay>
      </View>
    );
  }
}
const styles = StyleSheet.create({
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
  textList:{
    padding: 10,
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  containerP:{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      alignSelf: 'stretch'
    },
});