export const reqStop = {
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
  "ver": "1.16"
}

export const reqBus = {
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
  "ver": "1.16"
}