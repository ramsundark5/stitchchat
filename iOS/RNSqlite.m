
#import "RCTBridgeModule.h"
#import "FMDB.h"

@interface RNSqlite : NSObject <RCTBridgeModule>

@property (strong, nonatomic) NSString *documentDirectory;

@end

@implementation RNSqlite

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(initDB:(NSString *)dbName
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{

  @try {
    NSString* dbPath = [self getDBPath:dbName];
    FMDatabaseQueue *queue = [FMDatabaseQueue databaseQueueWithPath:dbPath];
    [queue inDatabase:^(FMDatabase *db) {
      BOOL status = [db open];
      NSString * statusString = (status) ? @"True" : @"False";
      resolve(statusString);
    }];
  }
  @catch (NSError *error) {
    NSLog(@"%@", error.localizedDescription);
    reject(error);
  }
}

/*RCT_EXPORT_METHOD(executeBatchUpdate:(NSString *)dbName
                  sqlStmts:(NSArray *)sqlStmts
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject){
  @try {
    BOOL executedStatus;
    for(NSString* sqlStmt in sqlStmts){
      executedStatus = [self executeUpdateInternal:dbName sqlStmt:sqlStmt params:nil];
    }
     NSString * statusString = (executedStatus) ? @"True" : @"False";
     resolve(statusString);
  }
  @catch (NSError *error) {
    NSLog(@"%@", error.localizedDescription);
    reject(error);
  }
}*/

RCT_EXPORT_METHOD(executeInsert:(NSString *)dbName
                  sqlStmt:(NSString *)sqlStmt
                  params:(NSDictionary *) params
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject){
  @try {
    NSInteger lastInsertRowid  = [self executeInsertInternal:dbName sqlStmt:sqlStmt params:params];
    NSNumber *lastRowIdResponse = [NSNumber numberWithInteger: lastInsertRowid];
    resolve(lastRowIdResponse);
  }
  @catch (NSError *error) {
    NSLog(@"%@", error.localizedDescription);
    reject(error);
  }
}

RCT_EXPORT_METHOD(executeUpdate:(NSString *)dbName
                  sqlStmt:(NSString *)sqlStmt
                  params:(NSDictionary *) params
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject){
  @try {
    BOOL status = [self executeUpdateInternal:dbName sqlStmt:sqlStmt params:params];
    NSString * statusString = (status) ? @"True" : @"False";
    resolve(statusString);
  }
  @catch (NSError *error) {
    NSLog(@"%@", error.localizedDescription);
    reject(error);
  }
}

RCT_EXPORT_METHOD(executeQuery:(NSString *)dbName
                  sqlStmt:(NSString *)sqlStmt
                  params:(NSDictionary *) params
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject){
  @try {
    NSArray *results = [self executeQueryInternal:dbName sqlStmt:sqlStmt params:params];
    resolve(results);
  }
  @catch (NSError *error) {
    NSLog(@"%@", error.localizedDescription);
    reject(error);
  }
}

RCT_EXPORT_METHOD(close:(NSString *)dbName
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject){
  
}

-(NSInteger) executeInsertInternal:(NSString *)dbName
                      sqlStmt:(NSString *)sqlStmt
                       params:(NSDictionary *) params{
  NSString* dbPath = [self getDBPath:dbName];
  FMDatabaseQueue *queue = [FMDatabaseQueue databaseQueueWithPath:dbPath];
  __block NSInteger lastId = 0;
  
  [queue inDatabase:^(FMDatabase *db) {
    BOOL status = [db executeUpdate:sqlStmt withParameterDictionary:params];
    if(status){
      lastId = [db lastInsertRowId];
    }
  }];
  
  return lastId;
}

-(BOOL) executeUpdateInternal:(NSString *)dbName
                      sqlStmt:(NSString *)sqlStmt
                       params:(NSDictionary *) params{
  NSString* dbPath = [self getDBPath:dbName];
  FMDatabaseQueue *queue = [FMDatabaseQueue databaseQueueWithPath:dbPath];
  __block BOOL status = FALSE;
  
  [queue inDatabase:^(FMDatabase *db) {
    status = [db executeUpdate:sqlStmt withParameterDictionary:params];
  }];
  
  return status;
}

-(NSArray*) executeQueryInternal:(NSString *)dbName
                      sqlStmt:(NSString *)sqlStmt
                       params:(NSDictionary *) params{
  NSString* dbPath = [self getDBPath:dbName];
  NSMutableArray *results = [NSMutableArray array];
  FMDatabaseQueue *queue = [FMDatabaseQueue databaseQueueWithPath:dbPath];
  
  [queue inDatabase:^(FMDatabase *db) {
    FMResultSet *rs = [db executeQuery:sqlStmt withParameterDictionary:params];
    while ([rs next]) {
      [results addObject:[rs resultDictionary]];
    }
    [rs close];
  }];
  
  return results;
}

- (NSString *)getDBPath:(NSString *)dbName
{
    if(!self.documentDirectory){
       NSArray *docPaths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
       NSString *documentsDir = [docPaths objectAtIndex:0];
       self.documentDirectory = documentsDir;
    }
    NSString *dbPath = [self.documentDirectory  stringByAppendingPathComponent:dbName];
    //NSLog(@"DB path is%@", dbPath);
    return dbPath;
}
@end
