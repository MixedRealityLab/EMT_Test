export const stopList = 
["Innovation Park", "Newark Hall", "Exchange Building", "Lenton Hillside",
"Dunkirk East Entrance", "George Green Library", "Campus Arts Centre", "Lincon Hall",
"East Entrance", "Campus Union Shop", "Derby Hall", "Kings Meadow Campus",
"East Midlands Coference Centre", "Current Location", "Current Location 2"
]
export const reqBod = {
  "auth": {
    "aid": "a4r2b3i8x2n9f6l0",
    "type": "AID"
  },
  "client": {
    "id": "ARRIVA",
    "name": "Arriva Bus ",
    "os": "Android 6.0.1",
    "res": "1080x1776",
    "type": "AND",
    "ua": "Dalvik/2.1.0 (Linux; U; Android 6.0.1; Nexus 5 Build/M4B30Z)",
    "v": 1000038
  },
  "formatted": false,
  "lang": "eng",
  
  "ver": "1.16"
}
export const reqStop = {
  
  "svcReqL": [
    {
      "cfg": {
        "polyEnc": "GPA"
      },
      "meth": "LocGeoPos",
      "req": {
        "getPOIs": false,
        "maxLoc": 2,
        "ring": {
          "cCrd": {
            "x": -1183801,
            "y": 52951855
          }
        }
      }
    }
  ],
}
export const reqBus = {
  "svcReqL": [
    {
      "cfg": {
        "polyEnc": "GPA"
      },
      "meth": "JourneyGeoPos",
      "req": {
        "jnyFltrL": [
          {
            "mode": "BIT",
            "type": "PROD",
            "value": "000001"
          }
        ],
        "maxJny": 128,
        "onlyRT": true,
        "perSize": 30000,
        "rect": {
          "llCrd": {
            "x": -1280332,
            "y": 52862989
          },
          "urCrd": {
            "x": -1095595,
            "y": 53021319
          }
        },
        "trainPosMode": "REPORT_ONLY"
      }
    }
  ],
  
}
export const reqPlan = {
  "svcReqL": [
    {
      "cfg": {
        "polyEnc": "GPA"
      },
      "meth": "TripSearch",
      "req": {
        "arrLocL": [
          {
            "crd": {
              "x": -1192328,
              "y": 52941098
            },
            "eteId": "A=1@O=Nottingham University Main Campus Science Departme@X=-1192328@Y=52941098@u=0@U=70@L=336106@Nottingham University Main Campus Science Departme",
            "extId": "336106",
            "lid": "A=1@O=Nottingham University Main Campus Science Departme@X=-1192328@Y=52941098@u=0@U=70@L=336106@",
            "name": "Nottingham University Main Campus Science Departme",
            "type": "S"
          }
        ],
        "depLocL": [
          {
            "crd": {
              "x": -1187564,
              "y": 52953997
            },
            "eteId": "A=1@O=Nottingham University Jubilee Campus Jubilee Campu@X=-1187564@Y=52953997@u=0@U=70@L=335697@Nottingham University Jubilee Campus Jubilee Campu",
            "extId": "335697",
            "lid": "A=1@O=Nottingham University Jubilee Campus Jubilee Campu@X=-1187564@Y=52953997@u=0@U=70@L=335697@",
            "name": "Nottingham University Jubilee Campus Jubilee Campu",
            "type": "S"
          }
        ],
        "getPasslist": true,
        "getPolyline": true,
        "jnyFltrL": [
          {
            "mode": "BIT",
            "type": "PROD",
            "value": "11111111111111"
          }
        ]
      }
    }
  ],
}

export const coordsArriva = [{
    "crd": {
      "x": -1183672,
      "y": 52950473
    },
    "eteId": "A=1@O=Nottingham University Jubilee Campus Innovation Pa@X=-1183672@Y=52950473@u=0@U=70@L=530123@Nottingham University Jubilee Campus Innovation Pa",
    "extId": "530123",
    "lid": "A=1@O=Nottingham University Jubilee Campus Innovation Pa@X=-1183672@Y=52950473@u=0@U=70@L=530123@",
    "name": "Nottingham University Jubilee Campus Innovation Pa",
    "type": "S"
    },
    {
      "crd": {
        "x": -1185973,
        "y": 52953062
      },
      "eteId": "A=1@O=Nottingham University Jubilee Campus Newark Hall@X=-1185973@Y=52953062@u=0@U=70@L=517649@Nottingham University Jubilee Campus Newark Hall",
      "extId": "517649",
      "lid": "A=1@O=Nottingham University Jubilee Campus Newark Hall@X=-1185973@Y=52953062@u=0@U=70@L=517649@",
      "name": "Nottingham University Jubilee Campus Newark Hall",
      "type": "S"
    },
    {
      "crd": {
        "x": -1187564,
        "y": 52953997
      },
      "eteId": "A=1@O=Nottingham University Jubilee Campus Jubilee Campu@X=-1187564@Y=52953997@u=0@U=70@L=335697@Nottingham University Jubilee Campus Jubilee Campu",
      "extId": "335697",
      "lid": "A=1@O=Nottingham University Jubilee Campus Jubilee Campu@X=-1187564@Y=52953997@u=0@U=70@L=335697@",
      "name": "Nottingham University Jubilee Campus Jubilee Campu",
      "type": "S"
    },
    {
      "crd": {
        "x": -1183690,
        "y": 52947174
      },
      "eteId": "A=1@O=Lenton Hillside@X=-1183690@Y=52947174@u=0@U=70@L=335435@Lenton Hillside",
      "extId": "335435",
      "lid": "A=1@O=Lenton Hillside@X=-1183690@Y=52947174@u=0@U=70@L=335435@",
      "name": "Lenton Hillside",
      "type": "S"
    },
    {
      "crd": {
        "x": -1184562,
        "y": 52940981
      },
      "eteId": "A=1@O=Dunkirk University East Entrance@X=-1184562@Y=52940981@u=0@U=70@L=335618@Dunkirk University East Entrance",
      "extId": "335618",
      "lid": "A=1@O=Dunkirk University East Entrance@X=-1184562@Y=52940981@u=0@U=70@L=335618@",
      "name": "Dunkirk University East Entrance",
      "type": "S"
    },
    {
      "crd": {
        "x": -1192328,
        "y": 52941098
      },
      "eteId": "A=1@O=Nottingham University Main Campus Science Departme@X=-1192328@Y=52941098@u=0@U=70@L=336106@Nottingham University Main Campus Science Departme",
      "extId": "336106",
      "lid": "A=1@O=Nottingham University Main Campus Science Departme@X=-1192328@Y=52941098@u=0@U=70@L=336106@",
      "name": "Nottingham University Main Campus Science Departme",
      "type": "S"
    },
    {
      "crd": {
        "x": -1188795,
        "y": 52939030
      },
      "eteId": "A=1@O=Nottingham University Main Campus Arts Centre@X=-1188795@Y=52939030@u=0@U=70@L=336109@Nottingham University Main Campus Arts Centre",
      "extId": "336109",
      "lid": "A=1@O=Nottingham University Main Campus Arts Centre@X=-1188795@Y=52939030@u=0@U=70@L=336109@",
      "name": "Nottingham University Main Campus Arts Centre",
      "type": "S"
    },
    {
      "crd": {
        "x": -1199223,
        "y": 52942347
      },
      "eteId": "A=1@O=Nottingham University Main Campus Lincoln Hall@X=-1199223@Y=52942347@u=0@U=70@L=336125@Nottingham University Main Campus Lincoln Hall",
      "extId": "336125",
      "lid": "A=1@O=Nottingham University Main Campus Lincoln Hall@X=-1199223@Y=52942347@u=0@U=70@L=336125@",
      "name": "Nottingham University Main Campus Lincoln Hall",
      "type": "S"
    },
    {
      "crd": {
        "x": -1191474,
        "y": 52939129
      },
      "eteId": "A=1@O=Nottingham University Main Campus University East @X=-1191474@Y=52939129@u=0@U=70@L=336117@Nottingham University Main Campus University East",
      "extId": "336117",
      "lid": "A=1@O=Nottingham University Main Campus University East @X=-1191474@Y=52939129@u=0@U=70@L=336117@",
      "name": "Nottingham University Main Campus University East",
      "type": "S"
    },
    {
      "crd": {
        "x": -1195097,
        "y": 52938886
      },
      "eteId": "A=1@O=Nottingham University Main Campus Union Shop@X=-1195097@Y=52938886@u=0@U=70@L=336107@Nottingham University Main Campus Union Shop",
      "extId": "336107",
      "lid": "A=1@O=Nottingham University Main Campus Union Shop@X=-1195097@Y=52938886@u=0@U=70@L=336107@",
      "name": "Nottingham University Main Campus Union Shop",
      "type": "S"
    },
    {
      "crd": {
        "x": -1202432,
        "y": 52942140
      },
      "eteId": "A=1@O=Nottingham University Main Campus Derby Hall@X=-1202432@Y=52942140@u=0@U=70@L=336124@Nottingham University Main Campus Derby Hall",
      "extId": "336124",
      "lid": "A=1@O=Nottingham University Main Campus Derby Hall@X=-1202432@Y=52942140@u=0@U=70@L=336124@",
      "name": "Nottingham University Main Campus Derby Hall",
      "type": "S"
    },  
    {
      "crd": {
        "x": -1173154,
        "y": 52938356
      },
      "eteId": "A=1@O=Lenton Lane Industrial Estate King's Meadow Campus@X=-1173154@Y=52938356@u=0@U=70@L=517648@Lenton Lane Industrial Estate King's Meadow Campus",
      "extId": "517648",
      "lid": "A=1@O=Lenton Lane Industrial Estate King's Meadow Campus@X=-1173154@Y=52938356@u=0@U=70@L=517648@",
      "name": "Lenton Lane Industrial Estate King's Meadow Campus",
      "type": "S"
    },
    {
      "crd": {
        "x": -1205183,
        "y": 52939839
      },
      "eteId": "A=1@O=Nottingham University Main Campus East Midlands Co@X=-1205183@Y=52939839@u=0@U=70@L=336123@Nottingham University Main Campus East Midlands Co",
      "extId": "336123",
      "lid": "A=1@O=Nottingham University Main Campus East Midlands Co@X=-1205183@Y=52939839@u=0@U=70@L=336123@",
      "name": "Nottingham University Main Campus East Midlands Co",
      "type": "S"
    }
]

export const coordsLatLng = [
  {
    latitude: 52.950473,
    longitude: -1.183672
  },
  {
    latitude: 52.953062,
    longitude: -1.185973
  },
  {
    latitude: 52.953997,
    longitude: -1.187564
  },
  {
    latitude: 52.947174,
    longitude: -1.183690
  },
  {
    latitude: 52.940981,
    longitude: -1.184562
  },
  {
    latitude: 52.941098,
    longitude: -1.192328
  },
  {
    latitude: 52.939030,
    longitude: -1.188795
  },
  {
    latitude: 52.942347,
    longitude: -1.199223
  },
  {
    latitude: 52.939129,
    longitude: -1.191474
  },
  {
    latitude: 52.938886,
    longitude: -1.195097
  },
  {
    latitude: 52.942140,
    longitude: -1.202432
  },
  {
    latitude: 52.938356,
    longitude: -1.173154
  },
  {
    latitude: 52.939839,
    longitude: -1.205183
  }
]

export const tempLocs =[
  //Random Local (In QMC)
  {latitude: 52.943513,longitude: -1.186406},
  //Random Local (Near Innovation Park)
  {latitude: 52.951037,longitude: -1.184562}
]

export const mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#523735"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#c9b2a6"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#dcd2be"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#ae9e90"
      }
    ]
  },
  {
    "featureType": "administrative.neighborhood",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#93817c"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#a5b076"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#447530"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#fdfcf8"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f8c967"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#e9bc62"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e98d58"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#db8555"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#806b63"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8f7d77"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#b9d3c2"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#92998d"
      }
    ]
  }
]