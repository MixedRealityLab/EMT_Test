export const stopList = 
["Innovation Park", "Newark Hall", "Exchange Building", "Lenton Hillside",
"Dunkirk East Entrance", "George Green Library", "Campus Arts Centre", "Lincon Hall",
"East Entrance", "Campus Union Shop", "Derby Hall", "Kings Meadow Campus",
"East Midlands Coference Centre", "Current Location"
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

export const locReq = [
  [{
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
      lat: 52.950473,
      lng: -1.183672
    }
  ],
  [
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
      lat: 52.953062,
      lng: -1.185973
    }
  ],
  [
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
      lat: 52.953997,
      lng: -1.187564
    }
  ],
  [
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
      lat: 52.947174,
      lng: -1.183690
    }
  ],
  [
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
      lat: 52.940981,
      lng: -1.184562
    }
  ],
  [
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
      lat: 52.941098,
      lng: -1.192328
    }
  ],
  [
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
      lat: 52.939030,
      lng: -1.188795
    }
  ],
  [
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
      lat: 52.942347,
      lng: -1.199223
    }
  ],
  [
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
      lat: 52.939129,
      lng: -1.191474
    }
  ],
  [
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
      lat: 52.938886,
      lng: -1.195097
    }
  ],
  [
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
      lat: 52.942140,
      lng: -1.202432
    }
  ],
  [
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
      lat: 52.938356,
      lng: -1.173154
    }
  ],
  [
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
    },
    {
      lat: 52.939839,
      lng: -1.205183
    }
  ],
  [
    {
      "crd":{
        "x": -1184728,
        "y": 52947270
      },
      "type": "S"
    },
    {
      lat: 52.943513,
      lng: -1.186406
    }
  ]
]

