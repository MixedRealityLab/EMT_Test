import React, {Component} from 'react';
import { View, Text } from 'react-native'
import {Marker, Callout } from 'react-native-maps';
import { Overlay } from 'react-native-elements'
import Axios from 'axios';
import { reqStop, reqBod, stopList, reqStopTimes, coordsArriva } from './Requests';

//import StopTimes from './BusStopTimes.js'
import BusStopTimes from './BusStopTimes'

export default class Stops extends Component{

    constructor(props) {
        super(props);
        
        this.state = {
          Date: new Date(),
          CurrDate: "",
          stops: [],
          currStopTimes: [],
          show: false,
          BusList: [],
        }

        this.getStopInfo = this.getStopInfo.bind(this)
    }

    componentDidMount(){
        console.log("Mount")

          Axios.post(
            'https://inmyseat.chronicle.horizon.ac.uk/proxy/', Object.assign(reqBod, reqStop) 
          )
          .then(response =>{
            let loc = response.data.svcResL[0].res.locL
            let points = []
            for (var i = 0; i < loc.length; i++){
              points.push({
                name: loc[i].name,
                lat: loc[i].crd.y / 1000000,
                lng: loc[i].crd.x / 1000000
                
              })
            }
            return points})
          .then(data => { this.setState({stops: data }) })
        
        console.log("Mounted")
    }

    getStopInfo(busStop){
      Object.assign(reqStopTimes.svcReqL[0].req.stbLoc, coordsArriva[busStop])

      reqStopTimes.svcReqL[0].req.stbLoc = coordsArriva[busStop]
  
      let DY = this.state.Date.getFullYear()
      let DM = this.state.Date.getMonth() + 1
      if(String(DM).length === 1) DM = "0" + DM
      let DD = this.state.Date.getDate()
      if(String(DD).length === 1) DD = "0" + DD
  
      this.state.CurrDate = DY + DM + DD
  
      reqStopTimes.svcReqL[0].req.date = this.state.CurrDate

      let TH = this.state.Date.getHours()
      if(String(TH).length === 1) TH = "0" + TH
      let TM = this.state.Date.getMinutes()
      if(String(TM).length === 1) TM = "0" + TM


      reqStopTimes.svcReqL[0].req.time = "" + TH + TM + "00"

      Axios.post(
        'https://inmyseat.chronicle.horizon.ac.uk/proxy/', Object.assign(reqBod, reqStopTimes)
      )
      .then(response =>{
          var Data = response.data.svcResL[0].res
          var DStop = response.data.svcResL[0].res.jnyL
          console.log(Data)
          let list = []
          let mem = 0
          for( let i = 0; i < DStop.length; i++){
              if(!Data.common.prodL[i].hasOwnProperty('number')) mem++
              let temp = {
                  time: DStop[i].stbStop.dTimeS,
                  bus:  Data.common.prodL[i + mem].number 
              }
              list.push(temp)
          }
          console.log(list)
          this.props.showItem(list)
          
      })
      .catch(err => console.log(err))
    }

    render(){
        return(
            this.state.stops.map((item, i) =>{
              return(
                <Marker 
                    key={i}
                    name={item.name}
                    coordinate={{latitude: item.lat, longitude: item.lng}}
                    image={require('../../assets/icon-bus-stop-64.png')}
                    onPress={ () => { this.props.showOverlay(); this.getStopInfo(i)} }
                    >
                    
                </Marker>  
              )
            })
          )
    }
}