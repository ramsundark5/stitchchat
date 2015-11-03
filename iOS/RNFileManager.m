
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
            //[self uploadDataWithProgress:fileData location:signedUrl];
         
         AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
         manager.responseSerializer = [AFHTTPResponseSerializer serializer];
         
         NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:[NSURL URLWithString:signedUrl]];
         request.HTTPMethod = @"PUT";
         //request.HTTPBody   = fileData;
         [request setValue:@"multipart/form-data" forHTTPHeaderField:@"Content-Type"];
         
         NSURLSessionUploadTask *uploadTask = [manager uploadTaskWithRequest:request
              fromData:fileData progress:nil
              completionHandler:^(NSURLResponse *response, id responseObject, NSError *error) {
           if (error) {
             NSLog(@"Error: %@", error);
             reject(error);
           } else {
             NSLog(@"Success: %@ %@", response, responseObject);
           }
         }];
         [uploadTask resume];
       } failureBlock:^(NSError *error) {
            reject(error);
       }];
       #pragma clang diagnostic pop
    });
}

@end