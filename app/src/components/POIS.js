import React, {Component} from 'react'
import { Marker } from 'react-native-maps'
import Axios from 'axios';

export default class POIS extends Component{

    constructor(props) {
        super(props);
    
        this.state = {
            POIS: [],
            //render: [],
            show: false
        }
        this.returnInfo = this.returnInfo.bind(this)
    }
    
    returnInfo(){
      console.log("Hi")
    }

    componentDidMount(){
        Axios.get("https://inmyseat.chronicle.horizon.ac.uk/api/v1/allpois")
        .then(response =>{
          return response.data
        })
        .then(data => this.setState({ POIS: data}))
        /*.then( () => {
          var render = []
          for(let i = 0; i < this.state.POIS.length; i++){
            render[i] = false
          }
          return render
        })
        .then(data => this.setState({render: data}))*/
    }

    render(){
        return(
          <>
            {
              this.state.POIS.map((item, i) =>{
                if(item.category === this.props.filter || this.props.filter === "N/A"){
                  return(
                    <Marker
                    key={i}
                    onPress={
                      () =>{
                        this.props.showOverlay()
                        this.props.showItem(item)
                      }
                    }
                    name={item.name}
                    coordinate={{latitude: item.latitude, longitude: item.longitude}}
                    icon={require('../../assets/icons8-point-of-interest-52.png')}
                    > 
                    </Marker>
                  )
                }
              })
            }
            
          </>
          )
          
    }
}