import React, { AsyncStorage } from 'react-native';
import DBHelper from '../dao/DBHelper';
import * as AppConstants from '../constants/AppConstants';

class CacheService{
    constructor(){
        this.cache = new Map();
    }

    init(){
        let sqlStmt = "SELECT * from Preferences";
        let that = this;
        let loadPreferencesPromise = DBHelper.executeQuery(AppConstants.MESSAGES_DB, sqlStmt);
        loadPreferencesPromise.then(function(resultSet){
            for(let i in resultSet){
                let row = resultSet[i];
                that.set(row.key, row.value);
            }
        });
        return loadPreferencesPromise;
    }

    set(key, value){
        this.cache.set(key, value);
    }

    get(key){
        return this.cache.get(key);
    }

    async isAppRegistered(){
        let isRegistered = false;
        let sqlStmt = "SELECT value from Preferences where key = 'phoneNumber'";
        try{
            let results = await DBHelper.executeQuery(AppConstants.MESSAGES_DB, sqlStmt);
            if(results && results.length > 0){
                isRegistered = true;
            }
        }catch(err){
            //this is required if tables are not created yet.
            console.log("unable to get registration status "+ err);
        }
        console.log("is app registered? "+isRegistered);
        return isRegistered;
    }

    async getLastContactSyncTime(){
        let lastContactSyncTime = 0;
        let sqlStmt = "SELECT value from Preferences where key = 'lastContactSyncTime'";
        try{
            let results = await DBHelper.executeQuery(AppConstants.MESSAGES_DB, sqlStmt);
            if(results && results.length > 0){
                let row = results[0];
                lastContactSyncTime = row.value;
            }
        }catch(err){
            //this is required if tables are not created yet.
            console.log("unable to get lastContactSyncTime "+ err);
        }
        console.log("last contact sync time is "+lastContactSyncTime);
        return lastContactSyncTime;
    }

    setAndPersist(key, value){
        this.set(key, value);
        let sqlStmt = 'INSERT OR REPLACE into Preferences (key, value) values (:key, :value)';
        let params  = {key: key, value: value};
        return DBHelper.executeUpdate(AppConstants.MESSAGES_DB, sqlStmt, params );
    }

}

export default new CacheService();