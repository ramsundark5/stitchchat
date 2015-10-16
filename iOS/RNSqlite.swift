import Foundation

@objc(RNSqlite2)
class RNSqlite: NSObject{
  
  var queue: FMDatabaseQueue?
  
  @objc func initDB(dbName: String,
              resolver resolve: RCTPromiseResolveBlock,
              rejecter reject : RCTPromiseRejectBlock)-> Void{
      
      let databasePath = self.getDBPath(dbName)
      let queue = FMDatabaseQueue(path: databasePath)
      queue?.inDatabase() {
        db in
        db.open()
        resolve("db initialized with name"+dbName)
      }
  }
  
  @objc func executeUpdate(dbName: String,
                          sqlStmt: String,
                          params: [String],
                          resolver resolve: RCTPromiseResolveBlock,
                          rejecter reject : RCTPromiseRejectBlock)-> Void{
                      
     let status = self.executeUpdate(dbName, sqlStmt: sqlStmt, params: params)
     resolve(status)
  }
  
  @objc func executeQuery(dbName: String,
                          sqlStmt: String,
                          params:[String],
                          resolver resolve: RCTPromiseResolveBlock,
                          rejecter reject : RCTPromiseRejectBlock)-> Void{
      let resultsArray = self.executeQuery(dbName, sqlStmt: sqlStmt, params: params)
      resolve(resultsArray)
  }
  
  @objc func closeDB(dbName: String)-> Void{
    let dbPath = self.getDBPath(dbName);
    let queue = FMDatabaseQueue(path: dbPath)
    
    queue?.inDatabase() {
      db in
      
      db.close()
    }
  }
  
  func getDBPath(dbpath: String)->String{
    let documentsFolder = NSSearchPathForDirectoriesInDomains(.DocumentDirectory, .UserDomainMask, true)[0] as String
    
    let databasePath = (documentsFolder as NSString).stringByAppendingPathComponent(dbpath)
    print("db path is"+databasePath)
    return databasePath
  }
  
  func executeUpdate(dbName: String, sqlStmt: String, params:[String]?=nil)-> Bool{
    let dbPath = self.getDBPath(dbName);
    let queue = FMDatabaseQueue(path: dbPath)
    var status = false
    queue?.inDatabase() {
      db in
      
      status = db.executeUpdate(sqlStmt, withArgumentsInArray:params)
      if (!status){
        print("execute update failed with message: \(db.lastErrorMessage())")
      }
    }
    return status
  }
  
  func executeQuery(dbName: String, sqlStmt: String, params:[String]?=nil)->Array<Dictionary<String,AnyObject>>{
    let dbPath = self.getDBPath(dbName);
    let queue = FMDatabaseQueue(path: dbPath)
    var resultsArray = Array<Dictionary<String,AnyObject>>()
    queue?.inDatabase() {
      db in
      
      if let rs = db.executeQuery("select * from test", withArgumentsInArray:params) {
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
  
 }