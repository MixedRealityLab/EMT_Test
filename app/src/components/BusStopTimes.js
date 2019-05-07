import React, {Component} from 'react'
import { View, Text } from 'react-native'
import Axios from 'axios';
import { reqBod, reqStopTimes, coordsArriva } from './Requests'

export default class BusStopTimes extends Component{
  constructor(props){
    super(props)
      this.state ={
        Date: new Date(),
        CurrDate: "",
        BusList: [],
        loaded: false
      }

      this.getTimes = this.getTimes.bind(this)
  }

  getTimes(busStop){
    Object.assign(reqStopTimes.svcReqL[0].req.stbLoc, coordsArriva[busStop])

    reqStopTimes.svcReqL[0].req.stbLoc = coordsArriva[busStop]

    let DY = this.state.Date.getFullYear()
    let DM = this.state.Date.getMonth() + 1
    if(String(DM).length === 1) DM = "0" + DM
    let DD = this.state.Date.getDate()
    if(String(DD).length === 1) DD = "0" + DD

    this.state.CurrDate = DY + DM + DD

    reqStopTimes.svcReqL[0].req.date = this.state.CurrDate
    reqStopTimes.svcReqL[0].req.time = "" + this.state.Date.getHours() + this.state.Date.getMinutes() + "00"

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
        this.setState({BusList: list, loaded: true})
    })
    .then(this.forceUpdate())
    .catch(err => console.log(err))
  }

  componentDidMount(){
    this.getTimes(this.props.stop)
  }

  render(){
    console.log(this.state.BusList[0])
    return(
      <View style={{flex:1, flexDirection:'column'}}>
        <Text>Bus Times</Text>
        <Text>{"" + this.state.loaded}</Text>
        {
          this.state.loaded ? 
          this.state.BusList.map( (item, i) => {
            <Text key={i} > Bus: {"" + item.bus}, Time: {"" + item.time} </Text>
          } )
          : <Text>Loading</Text>
        }
      </View>
    )
  }
}



/*
import React, {Component} from 'react'
import Axios from 'axios';
import { reqBod, reqStopTimes, coordsArriva } from './Requests'

class BusStopTimes{
  constructor(){
      this.state ={
        Date: new Date(),
        CurrDate: "",
        BusList: []
      }

      this.getTimes = this.getTimes.bind(this)

  }

  getTimes(busStop){
    Object.assign(reqStopTimes.svcReqL[0].req.stbLoc, coordsArriva[busStop])

    reqStopTimes.svcReqL[0].req.stbLoc = coordsArriva[busStop]

    let DY = this.state.Date.getFullYear()
    let DM = this.state.Date.getMonth() + 1
    if(String(DM).length === 1) DM = "0" + DM
    let DD = this.state.Date.getDate()
    if(String(DD).length === 1) DD = "0" + DD

    this.state.CurrDate = DY + DM + DD

    reqStopTimes.svcReqL[0].req.date = this.state.CurrDate
    reqStopTimes.svcReqL[0].req.time = "" + this.state.Date.getHours() + this.state.Date.getMinutes() + "00"

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
        
        console.log(this.state.BusList)
        this.state.BusList = list
    })


  }
}

export default StopTimes = new BusStopTimes()
*/