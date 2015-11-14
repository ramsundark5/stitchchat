#import "RNMediaPicker.h"
#import "AppDelegate.h"
#import <AFNetworking/AFHTTPRequestOperationManager.h>
#import <AFNetworking/AFURLSessionManager.h>

@implementation RNMediaPicker

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

RCT_EXPORT_METHOD(showMediaPicker:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  self.resolve = resolve;
  self.reject  = reject;
  [self showMediaPickerInternal];
}

-(void)showMediaPickerInternal {
  AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
  
  
  [PHPhotoLibrary requestAuthorization:^(PHAuthorizationStatus status){
    dispatch_async(dispatch_get_main_queue(), ^{
      
      //init picker
      CTAssetsPickerController *picker = [[CTAssetsPickerController alloc] init];
      picker.title = @"Gallery";
      // set delegate
      picker.delegate = self;
      
      //Optionally present picker as a form sheet on iPad
      if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad)
        picker.modalPresentationStyle = UIModalPresentationFormSheet;
      
      //present picker
      [delegate.rootViewController presentViewController:picker animated:YES completion:nil];
    });
  }];
}

- (void)assetsPickerController:(CTAssetsPickerController *)picker didFinishPickingAssets:(NSArray *)assets
{
  NSMutableArray* selectedMediaDetails = [[NSMutableArray alloc]init];

  //assets contains PHAsset objects.
  for(PHAsset* phAsset in assets){
    NSMutableDictionary *mediaDetails = [[NSMutableDictionary alloc] init];
    NSNumber* mediaType = [NSNumber numberWithInteger:phAsset.mediaType];
    [mediaDetails setObject:phAsset.localIdentifier  forKey:@"localIdentifier"];
    [mediaDetails setObject:mediaType  forKey:@"mediaType"];
    [selectedMediaDetails addObject:mediaDetails];
  }
  hideMediaPicker();
  self.resolve(selectedMediaDetails);
  //upload media
  /*for(PHAsset* phAsset in assets){
    [self uploadMediaInternal:phAsset];
  }*/
}

RCT_EXPORT_METHOD(uploadMedia:(NSString*)localIdentifier
                  uploadURL:(NSString*)uploadURL
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject){
  
  PHAsset* phAsset = [PHAsset fetchAssetsWithLocalIdentifiers:@[localIdentifier]
                              options:nil].firstObject;
  if(!self.manager){
    self.manager = [AFHTTPSessionManager manager];
    self.manager.responseSerializer = [AFHTTPResponseSerializer serializer];
  }

  [self uploadMediaInternal:phAsset uploadURL:uploadURL];
  resolve(@"Upload initiated");
}
-(void) uploadMediaInternal:(PHAsset*) phAsset uploadURL:(NSString*)uploadURL{
   PHAssetResource * resource = [[PHAssetResource assetResourcesForAsset:phAsset] firstObject];
   __block NSURL *tempUrl;
   NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:[NSURL URLWithString:uploadURL]];
  request.HTTPMethod = @"PUT";
  [request setValue:@"multipart/form-data" forHTTPHeaderField:@"Content-Type"];
  
  [self writeResourceToTmp:resource pathCallback:^(NSURL *localTempUrl){
     tempUrl = localTempUrl;
     NSURLSessionUploadTask *uploadTask = [self.manager
        uploadTaskWithRequest:request
        fromFile:tempUrl progress:nil
        completionHandler:^(NSURLResponse *response, id responseObject, NSError *error) {
          if (error) {
            NSLog(@"Error: %@", error);
            [self deleteTempFile:tempUrl];
            //reject(error);
          } else {
            NSLog(@"Success: %@ %@", response, responseObject);
            [self deleteTempFile:tempUrl];
          }
    }];
    [uploadTask resume];
  }];
  
  

  /*NSURLRequest *urlRequest =  [[AFHTTPRequestSerializer serializer] multipartFormRequestWithMethod:@"PUT"
       URLString:uploadURL
       parameters:nil
       constructingBodyWithBlock:^(id<AFMultipartFormData> formData) {
   
          [self writeResourceToTmp:resource pathCallback:^(NSURL *localTempUrl)
           {
             tempFilePath = [localTempUrl absoluteString];
             [formData appendPartWithFileURL: localTempUrl
                        name:@"data"
                        fileName:@"file.jpg"
                        mimeType:@"image/jpeg"
                        error:nil];
             
           }];
   }error:nil];
  
  AFURLSessionManager *manager = [[AFURLSessionManager alloc] initWithSessionConfiguration:[NSURLSessionConfiguration defaultSessionConfiguration]];
  NSProgress *progress = nil;
  
  NSURLSessionUploadTask *uploadTask = [manager uploadTaskWithStreamedRequest:urlRequest progress:&progress completionHandler:^(NSURLResponse *response, id responseObject, NSError *error) {
    if (error) {
      NSLog(@"Error: %@", error);
    } else {
      NSLog(@"%@ %@", response, responseObject);
      NSError* removeTempFile = nil;
      [[NSFileManager defaultManager] removeItemAtPath:tempFilePath error:&removeTempFile];
    }
  }];
  
  [uploadTask resume];*/
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

#pragma mark private-methods

void hideMediaPicker() {
  AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
  [delegate.rootViewController dismissViewControllerAnimated:YES completion:nil];
}
@end
