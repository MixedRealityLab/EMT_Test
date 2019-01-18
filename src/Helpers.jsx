import { reqBod, reqPlan, locReq } from './Requests'
import Axios from 'axios';

const google = window.google;
var polyline = require('@mapbox/polyline');
var simplify = require('simplify-js');
var geolib = require('geolib');

export function routeCheck(route){

    var arrivaLen = 0
    var arrivaTime = 0

    Object.assign(reqPlan.svcReqL[0].req.arrLocL[0], locReq[route[3]][0])
    Object.assign(reqPlan.svcReqL[0].req.depLocL[0], locReq[route[0]][0])
    Axios.post(
      'https://inmyseat.chronicle.horizon.ac.uk/proxy/', Object.assign(reqBod, reqPlan)
    )
    .then(response =>{
      
      let data = response.data.svcResL[0].res
      let sections = data.outConL[0].secL
      arrivaTime = data.outConL[0].dur

      let line = []
      for(let i = 0; i < sections.length; i++){
        let temp = polyline.decode(data.common.polyL[i].crdEncYX)
        temp.forEach(item => line.push(item))
      }

     
      arrivaLen = geolib.getPathLength(line)

      
    })
    console.log("Time is: " + arrivaTime)
    console.log("Length is: " + arrivaLen)
}