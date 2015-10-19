import {NativeModules} from 'react-native';

class DBHelper{

    constructor(){
        this.db = NativeModules.RNSqlite;
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

module.exports = new DBHelper();