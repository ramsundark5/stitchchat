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
    PHAssetResource * resource = [[PHAssetResource assetResourcesForAsset:phAsset] firstObject];
    CFStringRef mimeType = UTTypeCopyPreferredTagWithClass((__bridge CFStringRef _Nonnull)(resource.uniformTypeIdentifier), kUTTagClassMIMEType);
    NSString *mimeTypeString = (__bridge_transfer NSString *)mimeType;
    CFStringRef extension = UTTypeCopyPreferredTagWithClass((__bridge CFStringRef _Nonnull)(resource.uniformTypeIdentifier), kUTTagClassFilenameExtension);
    NSString *extensionStr = (__bridge_transfer NSString *)extension;
    
    NSMutableDictionary *mediaDetails = [[NSMutableDictionary alloc] init];
    NSNumber* mediaType = [NSNumber numberWithInteger:phAsset.mediaType];
    [mediaDetails setObject:phAsset.localIdentifier  forKey:@"localIdentifier"];
    [mediaDetails setObject:mediaType  forKey:@"mediaType"];
    [mediaDetails setObject:mimeTypeString  forKey:@"mimeType"];
    [mediaDetails setObject:extensionStr  forKey:@"extension"];
    [selectedMediaDetails addObject:mediaDetails];
  }
  hideMediaPicker();
  self.resolve(selectedMediaDetails);
}

RCT_EXPORT_METHOD(uploadMedia:(NSString*)localIdentifier
                  uploadURL:(NSString*)uploadURL
                  messageId:(NSInteger)messageId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject){
  
  PHAsset* phAsset = [PHAsset fetchAssetsWithLocalIdentifiers:@[localIdentifier]
                                                      options:nil].firstObject;
  if(!self.manager){
    self.manager = [AFHTTPSessionManager manager];
    self.manager.responseSerializer = [AFHTTPResponseSerializer serializer];
  }
  NSLog(@"got message id as %ld", (long)messageId);
   PHAssetResource * resource = [[PHAssetResource assetResourcesForAsset:phAsset] firstObject];
   __block NSURL *tempUrl;
   NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:[NSURL URLWithString:uploadURL]];
  request.HTTPMethod = @"PUT";
  [request setValue:@"multipart/form-data" forHTTPHeaderField:@"Content-Type"];
  [request setValue:@"multipart/form-data" forHTTPHeaderField:@"Content-Type"];

  __block NSProgress* progress;
  [self writeResourceToTmp:resource pathCallback:^(NSURL *localTempUrl){
     tempUrl = localTempUrl;
     NSURLSessionUploadTask *uploadTask = [self.manager
        uploadTaskWithRequest:request
        fromFile:tempUrl
        progress:&progress
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
