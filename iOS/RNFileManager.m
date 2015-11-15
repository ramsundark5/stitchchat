#import <Foundation/Foundation.h>
#import <AFNetworking/AFURLSessionManager.h>
#import "AFHTTPSessionManager.h"
#import "RCTBridgeModule.h"
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"
#import <Photos/Photos.h>

@interface RNFileManager : NSObject <RCTBridgeModule>

@property (strong, nonatomic) AFHTTPSessionManager *manager;

@end

@implementation RNFileManager

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

dispatch_queue_t attachmentsQueue() {
  static dispatch_once_t queueCreationGuard;
  static dispatch_queue_t queue;
  dispatch_once(&queueCreationGuard, ^{
    queue = dispatch_queue_create("com.stitchchat.attachments", NULL);
  });
  return queue;
}

RCT_EXPORT_METHOD(downloadFile:(NSString*)downloadURL
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject){
  
    NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
    AFURLSessionManager *manager = [[AFURLSessionManager alloc] initWithSessionConfiguration:configuration];
    
    NSURL *URL = [NSURL URLWithString:downloadURL];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:URL];
    [request setValue:@"multipart/form-data" forHTTPHeaderField:@"Content-Type"];
  
    NSURLSessionDownloadTask *downloadTask = [manager downloadTaskWithRequest:request progress:nil destination:^NSURL *(NSURL *targetPath, NSURLResponse *response) {
      NSURL *documentsDirectoryURL = [[NSFileManager defaultManager] URLForDirectory:NSDocumentDirectory inDomain:NSUserDomainMask appropriateForURL:nil create:NO error:nil];
      return [documentsDirectoryURL URLByAppendingPathComponent:[response suggestedFilename]];
    } completionHandler:^(NSURLResponse *response, NSURL *filePath, NSError *error) {
      NSLog(@"File downloaded to: %@", filePath);
    }];
    [downloadTask resume];
}


RCT_EXPORT_METHOD(uploadMedia:(NSString*)localIdentifier
                  uploadURL:(NSString*)uploadURL
                  messageId:(nonnull NSNumber*)messageId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject){
  
  PHAsset* phAsset = [PHAsset fetchAssetsWithLocalIdentifiers:@[localIdentifier]
                                                      options:nil].firstObject;
  if(!self.manager){
    self.manager = [AFHTTPSessionManager manager];
    self.manager.responseSerializer = [AFHTTPResponseSerializer serializer];
  }
  dispatch_async(attachmentsQueue(), ^{
    NSLog(@"got message id as %@", messageId);
    PHAssetResource * resource = [[PHAssetResource assetResourcesForAsset:phAsset] firstObject];
    __block NSURL *tempUrl;
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:[NSURL URLWithString:uploadURL]];
    request.HTTPMethod = @"PUT";
    [request setValue:@"multipart/form-data" forHTTPHeaderField:@"Content-Type"];
    
    [self writeResourceToTmp:resource pathCallback:^(NSURL *localTempUrl){
      tempUrl = localTempUrl;
      NSURLSessionUploadTask *uploadTask = [self.manager
                                            uploadTaskWithRequest:request
                                            fromFile:tempUrl
                                            progress:nil
                                            completionHandler:^(NSURLResponse *response, id responseObject, NSError *error) {
                                              if (error) {
                                                NSLog(@"Error: %@", error);
                                                [self deleteTempFile:tempUrl];
                                                [self.bridge.eventDispatcher sendDeviceEventWithName:@"fileUploadFailed"
                                                                                                body:messageId];
                                              } else {
                                                NSLog(@"Success: %@ %@", response, responseObject);
                                                [self deleteTempFile:tempUrl];
                                                [self.bridge.eventDispatcher sendDeviceEventWithName:@"fileUploadCompleted"
                                                                                                body:messageId];
                                                
                                              }
                                            }];
      [uploadTask resume];
    }];

  });
  resolve(@"Upload initiated");
}

-(void)writeResourceToTmp: (PHAssetResource*)resource pathCallback: (void(^)(NSURL*localUrl))pathCallback {
  
  //Get Asset Resource. Take first resource object. since it's only the one image.
  NSString *filename = resource.originalFilename;
  NSString *pathToWrite = [NSTemporaryDirectory() stringByAppendingString:filename];
  NSURL *localpath = [NSURL fileURLWithPath:pathToWrite];
  BOOL fileExists = [[NSFileManager defaultManager] fileExistsAtPath:pathToWrite];
  if(fileExists){
    NSLog(@"File already exists at temp dir");
    pathCallback(localpath);
  }else{
    PHAssetResourceRequestOptions *options = [PHAssetResourceRequestOptions new];
    options.networkAccessAllowed = YES;
    
    [[PHAssetResourceManager defaultManager] writeDataForAssetResource:resource toFile:localpath options:options completionHandler:^(NSError * _Nullable error) {
      if (error) {
        NSLog(@"Failed to write a resource: %@",[error localizedDescription]);
      }
      
      pathCallback(localpath);
    }];
  }
  
}

-(void) deleteTempFile:(NSURL*) tempURL{
  NSError* removeTempFileError = nil;
  [[NSFileManager defaultManager] removeItemAtURL:tempURL error:&removeTempFileError];
  if (removeTempFileError) {
    NSLog(@"Failed to remove temp file: %@",[removeTempFileError localizedDescription]);
  }
}

//this should be never used in ideal scenario
-(void)deleteAllTempData
{
  NSString *tmpDirectory = NSTemporaryDirectory();
  NSFileManager *fileManager = [NSFileManager defaultManager];
  NSError *error;
  NSArray *cacheFiles = [fileManager contentsOfDirectoryAtPath:tmpDirectory error:&error];
  for (NSString *file in cacheFiles)
  {
    error = nil;
    [fileManager removeItemAtPath:[tmpDirectory stringByAppendingPathComponent:file]
                            error:&error];
  }
}

@end