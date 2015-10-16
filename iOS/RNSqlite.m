
#import <Foundation/Foundation.h>

#import "RCTBridgeModule.h"
#import "FMDB.h"

@interface RNSqlite : NSObject <RCTBridgeModule>

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
    NSMutableArray *results = [NSMutableArray array];
    FMResultSet* rs = [self executeQueryInternal:dbName sqlStmt:sqlStmt params:params];
    while ([rs next]) {
      [results addObject:[rs resultDictionary]];
    }
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

-(FMResultSet*) executeQueryInternal:(NSString *)dbName
                      sqlStmt:(NSString *)sqlStmt
                       params:(NSDictionary *) params{
  NSString* dbPath = [self getDBPath:dbName];
  FMDatabaseQueue *queue = [FMDatabaseQueue databaseQueueWithPath:dbPath];
  __block FMResultSet *rs = nil;
  
  [queue inDatabase:^(FMDatabase *db) {
    rs = [db executeQuery:sqlStmt withParameterDictionary:params];
  }];
  
  return rs;
}

- (NSString *)getDBPath:(NSString *)dbName
{
    NSArray *docPaths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsDir = [docPaths objectAtIndex:0];
    NSString *dbPath = [documentsDir   stringByAppendingPathComponent:dbName];
    //NSLog(@"DB path is%@", dbPath);
    return dbPath;
}
@end
