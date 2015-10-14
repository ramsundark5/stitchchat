
#import <Foundation/Foundation.h>

#import "RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(RNSqlite, NSObject)


RCT_EXTERN_METHOD(initDB:(NSString *)dbName
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(executeUpdate:(NSString *)dbName
                  sqlStmt:(NSString *)sqlStmt
                  paramsDict:(NSDictionary *) paramsDict
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(executeQuery:(NSString *)dbName
                  sqlStmt:(NSString *)sqlStmt
                  paramsDict:(NSDictionary *) paramsDict
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(close:(NSString *)dbName
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
@end
