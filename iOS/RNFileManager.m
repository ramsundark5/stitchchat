#import <Foundation/Foundation.h>
#import <AFNetworking/AFURLSessionManager.h>
#import "AFHTTPSessionManager.h"
#import "RCTBridgeModule.h"
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"
#import <Photos/Photos.h>

@interface RNFileManager : NSObject <RCTBridgeModule>

@property (strong, nonatomic) AFURLSessionManager *manager;

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
                  messageId:(nonnull NSNumber*)messageId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject){
  
    if(!self.manager){
      NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
      self.manager = [[AFURLSessionManager alloc] initWithSessionConfiguration:configuration];
    }
  
    NSURL *URL = [NSURL URLWithString:downloadURL];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:URL];
  
    NSURLSessionDownloadTask *downloadTask = [self.manager
                                              downloadTaskWithRequest:request
                                              
                                              progress:^(NSProgress * _Nonnull downloadProgress) {
                                                // This is not called back on the main queue.
                                                // You are responsible for dispatching to the main queue for UI updates
                                                dispatch_async(dispatch_get_main_queue(), ^{
                                                  //Update the progress view
                                                  NSLog(@"Download Progress… %f", downloadProgress.fractionCompleted);
                                                  [self sendProgressUpdates:messageId
                                                          fractionCompleted:downloadProgress.fractionCompleted];
                                                });
                                              }
                                              
                                              destination:^NSURL *(NSURL *targetPath, NSURLResponse *response) {
                                                NSURL *documentsDirectoryURL = [[NSFileManager defaultManager] URLForDirectory:NSDocumentDirectory inDomain:NSUserDomainMask appropriateForURL:nil create:NO error:nil];
                                                return [documentsDirectoryURL URLByAppendingPathComponent:[response suggestedFilename]];
                                              }
                                              
                                              completionHandler:^(NSURLResponse *response, NSURL *filePath, NSError *error) {
                                                if(error){
                                                  NSLog(@"Error downloading media %@",[error localizedDescription]);
                                                  [self.bridge.eventDispatcher sendDeviceEventWithName:@"fileDownloadFailed"
                                                                                                  body:messageId];
                                                }else{
                                                  //NSError *openMediaError = nil;
                                                  NSString *filePathString = [filePath absoluteString];
                                                  NSLog(@"File downloaded to: %@", filePath);
                                                  [self.bridge.eventDispatcher sendDeviceEventWithName:@"fileDownloadCompleted"
                                                                                                  body:@{@"messageId" : messageId,
                                                                                                         @"mediaUrl" :filePathString}];
                                                  
                                                                                                  }
      
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
    NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
    self.manager = [[AFURLSessionManager alloc] initWithSessionConfiguration:configuration];
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
      [self startUploadTask:tempUrl messageId:messageId deleteTmpUrl:true request:request];
    }];

  });
  resolve(@"Upload initiated");
}

RCT_EXPORT_METHOD(uploadMediaFromURL:(NSString*)filePathString
                  uploadURL:(NSString*)uploadURL
                  messageId:(nonnull NSNumber*)messageId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject){
  
  if(!self.manager){
    NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
    self.manager = [[AFURLSessionManager alloc] initWithSessionConfiguration:configuration];
  }
  
  NSURL *mediaURL = [[NSURL alloc] initWithString:filePathString];
  
  dispatch_async(attachmentsQueue(), ^{
    NSLog(@"got message id as %@", messageId);
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:[NSURL URLWithString:uploadURL]];
    request.HTTPMethod = @"PUT";
    [request setValue:@"multipart/form-data" forHTTPHeaderField:@"Content-Type"];
    
    [self startUploadTask:mediaURL messageId:messageId deleteTmpUrl:false request:request];
    
  });
  resolve(@"Upload initiated");
}

-(void)startUploadTask:(NSURL*)mediaURL
             messageId:(nonnull NSNumber*)messageId
          deleteTmpUrl:(BOOL)deleteTmpUrl
               request:(NSMutableURLRequest*)request{
  NSURLSessionUploadTask *uploadTask = [self.manager
                                        uploadTaskWithRequest:request
                                        fromFile:mediaURL
                                        
                                        progress:^(NSProgress * _Nonnull uploadProgress) {
                                          // This is not called back on the main queue.
                                          // You are responsible for dispatching to the main queue for UI updates
                                          dispatch_async(dispatch_get_main_queue(), ^{
                                            //NSLog(@"Progress… %f", uploadProgress.fractionCompleted);
                                            [self sendProgressUpdates:messageId
                                                    fractionCompleted:uploadProgress.fractionCompleted];
                                          });
                                        }
                                        
                                        completionHandler:^(NSURLResponse *response, id responseObject, NSError *error) {
                                          if (error) {
                                            NSLog(@"Error: %@", error);
                                            if(deleteTmpUrl){
                                              [self deleteTempFile:mediaURL];
                                            }
                                            [self.bridge.eventDispatcher sendDeviceEventWithName:@"fileUploadFailed"
                                                                                            body:messageId];
                                          } else {
                                            NSLog(@"Success: %@ %@", response, responseObject);
                                            if(deleteTmpUrl){
                                              [self deleteTempFile:mediaURL];
                                            }
                                            [self.bridge.eventDispatcher sendDeviceEventWithName:@"fileUploadCompleted"
                                                                                            body:messageId];
                                          }
                                        }];
  [uploadTask resume];

  
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

-(void) writeImageToStitchchatAlbum:(NSData*)imageData{
  
  __block PHFetchResult *photosAsset;
  __block PHAssetCollection *collection;
  __block PHObjectPlaceholder *placeholder;
  
  NSString* albumTitle = @"Stitchchat";
  // Find the album
  PHFetchOptions *fetchOptions = [[PHFetchOptions alloc] init];
  fetchOptions.predicate = [NSPredicate predicateWithFormat:@"title = %@", albumTitle];
  collection = [PHAssetCollection fetchAssetCollectionsWithType:PHAssetCollectionTypeAlbum
                                                        subtype:PHAssetCollectionSubtypeAny
                                                        options:fetchOptions].firstObject;
  // Create the album
  if (!collection)
  {
    [[PHPhotoLibrary sharedPhotoLibrary] performChanges:^{
      PHAssetCollectionChangeRequest *createAlbum = [PHAssetCollectionChangeRequest
                                                     creationRequestForAssetCollectionWithTitle:albumTitle];
      placeholder = [createAlbum placeholderForCreatedAssetCollection];
    } completionHandler:^(BOOL success, NSError *error) {
      if (success)
      {
        PHFetchResult *collectionFetchResult = [PHAssetCollection fetchAssetCollectionsWithLocalIdentifiers:@[placeholder.localIdentifier]
                                                                                                    options:nil];
        collection = collectionFetchResult.firstObject;
      }
    }];
  }
  
  // Save to the album
  [[PHPhotoLibrary sharedPhotoLibrary] performChanges:^{
    PHAssetChangeRequest *assetRequest = [PHAssetChangeRequest creationRequestForAssetFromImage:[UIImage imageWithData:imageData]];
    placeholder = [assetRequest placeholderForCreatedAsset];
    photosAsset = [PHAsset fetchAssetsInAssetCollection:collection options:nil];
    PHAssetCollectionChangeRequest *albumChangeRequest = [PHAssetCollectionChangeRequest
                                                          changeRequestForAssetCollection:collection
                                                                                  assets:photosAsset];
    [albumChangeRequest addAssets:@[placeholder]];
  } completionHandler:^(BOOL success, NSError *error) {
    if (success)
    {
      //NSString *UUID = [placeholder.localIdentifier substringToIndex:36];
      //self.photo.assetURL = [NSString stringWithFormat:@"assets-library://asset/asset.PNG?id=%@&ext=JPG", UUID];
      //[self savePhoto];
    }
    else
    {
      NSLog(@"%@", error);
    }
  }];
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

-(void)sendProgressUpdates:(nonnull NSNumber*)messageId
         fractionCompleted:(double)fractionCompleted{
  NSMutableString *eventName = [NSMutableString string];
  if (messageId){
    [eventName appendString:@"fileProgress"];
    [eventName appendString:[NSString stringWithFormat:@"%@",messageId]];
    [self.bridge.eventDispatcher sendDeviceEventWithName:eventName
                                                    body:@{@"messageId" : messageId,
                                                           @"fractionCompleted" : [@(fractionCompleted) stringValue]}];
  }
  
}
@end