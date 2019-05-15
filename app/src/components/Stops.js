import React, {Component} from 'react';
import { Marker } from 'react-native-maps';
import Axios from 'axios';
import { reqStop, reqBod, reqStopTimes, coordsArriva } from './Requests';
import {Log} from '../Logger.js'

export default class Stops extends Component{

    constructor(props) {
        super(props);

        this.state = {
          Date: new Date(),
          CurrDate: "",
          stops: [],
          generatedTimes: [],
          firstUpdate: 0
        }
        this.checkCache = this.checkCache.bind(this)
        this.getStopInfo = this.getStopInfo.bind(this)
    }

    componentDidMount(){
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
    }

    checkCache(){
      if(String(this.state.firstUpdate).length > 0){
        if(Math.abs(this.state.firstUpdate - this.state.Date.getMinutes()) > 10){
          this.state.generatedTimes = []
          this.state.firstUpdate = this.state.Date.getMinutes
        }
      }
      else{
        this.state.firstUpdate = this.state.Date.getMinutes
      }
    }

    getStopInfo(busStop){
      this.checkCache()
      if(this.state.generatedTimes.find( (item) => {
        if(item.ID === busStop) {
          this.props.showItem(item.DATA, busStop)
          return true
        }
      })){

      }
      else{
        let tempOBJ = reqStopTimes
        Object.assign(tempOBJ.svcReqL[0].req.stbLoc, coordsArriva[busStop])

        tempOBJ.svcReqL[0].req.stbLoc = coordsArriva[busStop]

        let DY = this.state.Date.getFullYear()
        let DM = this.state.Date.getMonth() + 1
        if(String(DM).length === 1) DM = "0" + DM
        let DD = this.state.Date.getDate()
        if(String(DD).length === 1) DD = "0" + DD

        this.state.CurrDate = DY + DM + DD

        tempOBJ.svcReqL[0].req.date = this.state.CurrDate

        let TH = this.state.Date.getHours()
        if(String(TH).length === 1) TH = "0" + TH
        let TM = this.state.Date.getMinutes()
        if(String(TM).length === 1) TM = "0" + TM


        tempOBJ.svcReqL[0].req.time = "" + TH + TM + "00"
        let tempREQ = reqBod
        Axios.post(
          'https://inmyseat.chronicle.horizon.ac.uk/proxy/', Object.assign(tempREQ, tempOBJ)
        )
        .then(response =>{
            var Data = response.data.svcResL[0].res
            var DStop = response.data.svcResL[0].res.jnyL
            let list = []
            let mem = 0
            for( let i = 0; i < DStop.length; i++){
                while(!Data.common.prodL[i + mem].hasOwnProperty('number')) mem++
                let temp = {
                    time: DStop[i].stbStop.dTimeS,
                    bus:  Data.common.prodL[i + mem].number
                }
                list.push(temp)
            }
            this.state.generatedTimes.push({ID: busStop, DATA: list})
            this.props.showItem(list, busStop)
        })
        .catch(err => Log.error(err))
      }

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
                />
              )
            })
          )
    }
}
