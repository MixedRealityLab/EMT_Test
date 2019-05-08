import iso8601 from 'iso8601.js'
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
});

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const log = async (level, data) => {
  while (db == null) {
    await sleep(100);
  }
  const dt = iso8601.iso(new Date(), true);
  const json = JSON.stringify(data);
  console.log('[' + dt + '] ' + level + ': ' + json);
  db.executeSql('INSERT INTO log (datetime, level, data, uploaded) VALUES (?, ?, ?, 0)', [dt, level, json]);
}

const getUnuploaded = async () => {
  while (db == null) {
    await sleep(100);
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

export const Log = {

  trace: (data) => {
    log('trace', data);
  },

  debug: (data) => {
    log('debug', data);
  },

  info: (data) => {
    log('info', data);
  },

  warn: (data) => {
    log('warn', data);
  },

  error: (data) => {
    log('error', data);
  }

};

export const Uploader = {

  uploadTask: async (taskData) => {
    BackgroundTimer.setInterval(() => {
      getUnuploaded().then((results) => {
        // TODO: actually upload the results, then set rows to uploaded
      });
    }, upload_period);
  }

};
