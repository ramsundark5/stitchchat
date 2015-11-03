
#import "AFHTTPSessionManager.h"
#import "AFURLSessionManager.h"
#import <AssetsLibrary/AssetsLibrary.h>
#import <AWSS3/AWSS3.h>
#import <AFNetworking/AFHTTPRequestOperationManager.h>
#import "RCTBridgeModule.h"

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

RCT_EXPORT_METHOD(uploadFile:(NSString*) filePath
                  fileName:(NSString*) fileName
                  signedUrl:(NSString*) signedUrl
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject){
  
  if(!self.manager){
    self.manager = [AFHTTPSessionManager manager];
    self.manager.responseSerializer = [AFHTTPResponseSerializer serializer];
  }
  
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
         
         NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:[NSURL URLWithString:signedUrl]];
         request.HTTPMethod = @"PUT";
         [request setValue:@"multipart/form-data" forHTTPHeaderField:@"Content-Type"];
         
         NSURLSessionUploadTask *uploadTask = [self.manager uploadTaskWithRequest:request
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