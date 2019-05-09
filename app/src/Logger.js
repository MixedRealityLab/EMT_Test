import Axios from 'axios';
import iso8601 from 'iso8601.js'
import { AsyncStorage } from 'react-native'
import BackgroundTimer from 'react-native-background-timer';
import SQLite from 'react-native-sqlite-storage'


const database_name = 'imslog.db';
const database_version = '1.0';
const database_displayname = 'In My Seat Log Database';

const upload_period = 30 * 60 * 1000;

let db = null;

SQLite.enablePromise(true);

console.log('Opening log database');
SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname, -1).then((_db) => {
  console.log('Log database opened');
  db = _db;
  db.executeSql('CREATE TABLE IF NOT EXISTS log( '
    + 'datetime TEXT, '
    + 'level TEXT, '
    + 'data TEXT, '
    + 'uploaded INTEGER'
    +'); ').catch((error) => {
      console.log(error);
  });
}).catch((error) => {
  console.log(error);
  db = false;
});

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const log = async (level, data) => {
  while (db === null) {
    await sleep(100);
  }
  if (db === false) {
    return;
  }
  const dt = iso8601.iso(new Date(), true);
  const json = JSON.stringify(data);
  console.log('[' + dt + '] ' + level + ': ' + json);
  db.executeSql('INSERT INTO log (datetime, level, data, uploaded) VALUES (?, ?, ?, 0)', [dt, level, json]);
}

const getUnuploaded = async () => {
  while (db === null) {
    await sleep(100);
  }
  if (db === false) {
    return;
  }
  return db.executeSql('SELECT rowid, * FROM log WHERE uploaded = 0').then((results) => {
    var res = [];
    results = results[0];
    var len = results.rows.length;
    for (let i = 0; i < len; i++) {
      res.push(results.rows.item(i));
    }
    return res;
  });
}

const setUploaded = async (entries) => {
  while (db === null) {
    await sleep(100);
  }
  if (db === false) {
    return;
  }
  var len = entries.length;
  for (let i = 0; i < len; i++) {
    const entry = entries[i];
    db.executeSql('UPDATE log SET uploaded = 1 WHERE rowid = ?', [entry.rowid]);
  }
}

export const Log = {

  trace: (data) => {
    log('trace', data).catch(console.log);
  },

  debug: (data) => {
    log('debug', data).catch(console.log);
  },

  info: (data) => {
    log('info', data).catch(console.log);
  },

  warn: (data) => {
    log('warn', data).catch(console.log);
  },

  error: (data) => {
    log('error', data).catch(console.log);
  }

};

export const Uploader = {

  uploadTask: async (taskData) => {
    BackgroundTimer.setInterval(() => {
      getUnuploaded().then(async (results) => {
        const un = await AsyncStorage.getItem('username');
        Axios.post('https://inmyseat.chronicle.horizon.ac.uk/api/v1/log_entry?username=' + un,
            JSON.stringify(results)).then(response => {
          if (response.status == 200) {
            setUploaded(results);
          }
        });
      });
    }, upload_period);
  }

};
