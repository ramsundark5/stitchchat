import {NativeModules} from 'react-native';
var sqlite3 = require('react-native-sqlite3');
class DBHelper{

    constructor(){
        //this.db = NativeModules.RNSqlite;
        this.db = sqlite3;
    }

    open(dbName){
        let openPromise = this.db.open(dbName);
        return openPromise;
    }

    executeInsert(dbName, sqlStmt, params){
        let insertPromise = this.db.executeInsert(dbName, sqlStmt, params);
        return insertPromise;
    }

    executeUpdate(dbName, sqlStmt, params){
        let updatePromise = this.db.executeUpdate(dbName, sqlStmt, params);
        return updatePromise;
    }

    executeQuery(dbName, sqlStmt, params){
       let queryPromise = this.db.executeQuery(dbName, sqlStmt, params);
       return queryPromise;
    }

   close(dbName){
       this.db.close(dbName);
   }

}

export default new DBHelper();