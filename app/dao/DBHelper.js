import {NativeModules} from 'react-native';
var sqlite3 = require('react-native-sqlite3');
class DBHelper{

    constructor(){
        //this.db = NativeModules.RNSqlite;
        this.db = sqlite3;
    }

    initDB(dbName){
        let openPromise = this.db.initDB(dbName);
        return openPromise;
    }

    executeInsert(dbName, sqlStmt, params){
        let insertPromise = this.db.executeInsert(sqlStmt, params);
        return insertPromise;
    }

    executeUpdate(dbName, sqlStmt, params){
        let updatePromise = this.db.executeUpdate(sqlStmt, params);
        return updatePromise;
    }

    executeQuery(dbName, sqlStmt, params){
       let queryPromise = this.db.executeQuery(sqlStmt, params);
       return queryPromise;
    }

   close(dbName){
       this.db.close(dbName);
   }

}

export default new DBHelper();