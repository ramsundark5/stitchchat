import Foundation

@objc(RNSqlite)
class RNSqlite: NSObject{
  
  var queue: FMDatabaseQueue?
  
  @objc func initDB(dbName: String,
              resolver resolve: RCTPromiseResolveBlock,
              rejecter reject : RCTPromiseRejectBlock){
     // try{
        let databasePath = self.getDBPath(dbName)
        resolve("db initialized with name"+dbName);
     /* }catch let error as NSError {
        print(error.localizedDescription)
        reject(error.localizedDescription)
      }*/
  }
  
  @objc func executeUpdate(dbName: String,
                          sqlStmt: String,
                          paramDict:Dictionary<String, String>,
                          resolver resolve: RCTPromiseResolveBlock,
                          rejecter reject : RCTPromiseRejectBlock){
     self.executeUpdate(dbName, sqlStmt: sqlStmt, paramDict: paramDict);
     resolve("execute update completed");
  }
  
  @objc func executeQuery(dbName: String,
                          sqlStmt: String,
                          paramDict:Dictionary<String, String>,
                          resolver resolve: RCTPromiseResolveBlock,
                          rejecter reject : RCTPromiseRejectBlock){
                            
      let resultsArray = self.executeQuery(dbName, sqlStmt: sqlStmt, paramDict: paramDict);
      resolve(resultsArray);
  }
  
  func getDBPath(dbpath: String)->String{
    //databaseWithPath:@"/tmp/tmp.db"
    let documentsFolder = NSSearchPathForDirectoriesInDomains(.DocumentDirectory, .UserDomainMask, true)[0] as String
    
    let databasePath = (documentsFolder as NSString).stringByAppendingPathComponent(dbpath)
    print("db path is"+databasePath)
    return databasePath
  }
  
  func executeUpdate(dbName: String, sqlStmt: String, paramDict:Dictionary<String, String>? = nil){
    let queue = FMDatabaseQueue(path: dbName)
    
    queue?.inDatabase() {
      db in
      
      if !db.executeUpdate(sqlStmt, withParameterDictionary:paramDict) {
        print("execute update failed with message: \(db.lastErrorMessage())")
        return
      }
    }
  }
  
  func executeQuery(dbName: String, sqlStmt: String, paramDict:Dictionary<String, String>? = nil)->Array<Dictionary<String,AnyObject>>{
    let queue = FMDatabaseQueue(path: dbName)
    var resultsArray = Array<Dictionary<String,AnyObject>>()
    
    queue?.inDatabase() {
      db in
      
      if let rs = db.executeQuery("select * from test", withParameterDictionary:paramDict) {
        while rs.next() {
          print(rs.resultDictionary())
          resultsArray.append(rs.resultDictionary() as! Dictionary<String,AnyObject>)
        }
      } else {
        print("select failure: \(db.lastErrorMessage())")
      }
    }
    
    return resultsArray
  }
  
  @objc func closeDB(dbName: String){
    let queue = FMDatabaseQueue(path: dbName)
    
    queue?.inDatabase() {
      db in
      
      db.close()
    }

  }
  
}