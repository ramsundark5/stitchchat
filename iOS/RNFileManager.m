
#import "RNFileManager.h"
#import "AFHTTPSessionManager.h"
#import "AFURLSessionManager.h"
#import <AssetsLibrary/AssetsLibrary.h>
#import <AWSS3/AWSS3.h>
#import <AFNetworking/AFHTTPRequestOperationManager.h>

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

RCT_EXPORT_METHOD(uploadFile:(NSString*) filePath
                  fileName:(NSString*) fileName
                  signedUrl:(NSString*) signedUrl
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject){
  
  dispatch_async(attachmentsQueue(), ^{
    
       NSURL *assetUrl = [[NSURL alloc] initWithString:filePath];
    
       #pragma clang diagnostic push
       #pragma clang diagnostic ignored "-Wdeprecated-declarations"
       ALAssetsLibrary *library = [[ALAssetsLibrary alloc] init];
       [library assetForURL:assetUrl resultBlock:^(ALAsset *asset) {
            ALAssetRepresentation *rep = [asset defaultRepresentation];
            
            CGImageRef fullScreenImageRef = [rep fullScreenImage];
            UIImage *image = [UIImage imageWithCGImage:fullScreenImageRef];
            NSData *fileData = UIImagePNGRepresentation(image);
            //[self uploadAFN:fileData location:signedUrl];
            [self uploadDataWithProgress:fileData location:signedUrl];
       } failureBlock:^(NSError *error) {
            reject(error);
       }];
       #pragma clang diagnostic pop
    });
}

- (BOOL)uploadAFN:(NSData*)fileData location:(NSString*)location {
  
  AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
  manager.responseSerializer = [AFHTTPResponseSerializer serializer];
  
  NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:[NSURL URLWithString:location]];
  request.HTTPMethod = @"PUT";
  //request.HTTPBody   = fileData;
  [request setValue:@"multipart/form-data" forHTTPHeaderField:@"Content-Type"];
  
  NSURLSessionUploadTask *uploadTask = [manager uploadTaskWithRequest:request
            fromData:fileData progress:nil
            completionHandler:^(NSURLResponse *response, id responseObject, NSError *error) {
    if (error) {
      NSLog(@"Error: %@", error);
    } else {
      NSLog(@"Success: %@ %@", response, responseObject);
    }
  }];
  [uploadTask resume];
  
  return TRUE;
}

//old style using HTTPOPerations manager. this is depreacted. use AFHTTPSessionManager instead

- (BOOL)uploadDataWithProgress:(NSData*)fileData location:(NSString*)location {
  AFHTTPRequestOperationManager *manager = [AFHTTPRequestOperationManager manager];
  manager.responseSerializer = [AFHTTPResponseSerializer serializer];
  dispatch_semaphore_t sema = dispatch_semaphore_create(0);
  __block BOOL success = NO;
  
  NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:[NSURL URLWithString:location]];
  request.HTTPMethod = @"PUT";
  request.HTTPBody   = fileData;
  [request setValue:@"multipart/form-data" forHTTPHeaderField:@"Content-Type"];
  
  AFHTTPRequestOperation *httpOperation = [manager HTTPRequestOperationWithRequest:request success:^(AFHTTPRequestOperation *operation, id responseObject) {
    success = YES;
    dispatch_semaphore_signal(sema);
  } failure:^(AFHTTPRequestOperation *operation, NSError *error) {
    NSLog(@"Failed uploading attachment with error: %@", error.description);
    success = NO;
    dispatch_semaphore_signal(sema);
  }];
  
  [httpOperation setUploadProgressBlock:^(NSUInteger bytesWritten, long long totalBytesWritten, long long totalBytesExpectedToWrite) {
    double percentDone = (double)totalBytesWritten / (double)totalBytesExpectedToWrite;
    NSNotificationCenter *notificationCenter = [NSNotificationCenter defaultCenter];
    [notificationCenter postNotificationName:@"attachmentUploadProgress" object:nil userInfo:@{ @"progress": @(percentDone) }];
  }];
  
  [httpOperation start];
  
  dispatch_semaphore_wait(sema, DISPATCH_TIME_FOREVER);
  
  return success;
}


@end