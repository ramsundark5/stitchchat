#import "RNMediaPicker.h"
#import "AppDelegate.h"

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
      
      // init picker
      CTAssetsPickerController *picker = [[CTAssetsPickerController alloc] init];
      picker.title = @"Gallery";
      // set delegate
      picker.delegate = self;
      
      // Optionally present picker as a form sheet on iPad
      if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad)
        picker.modalPresentationStyle = UIModalPresentationFormSheet;
      
      // present picker
      [delegate.rootViewController presentViewController:picker animated:YES completion:nil];
    });
  }];
}

- (void)assetsPickerController:(CTAssetsPickerController *)picker didFinishPickingAssets:(NSArray *)assets
{
  // assets contains PHAsset objects.
  for(PHAsset* phAsset in assets){
    PHAssetResource * resource = [[PHAssetResource assetResourcesForAsset:phAsset] firstObject];
    
    [RNMediaPicker writeResourceToTmp:resource pathCallback:^(NSURL *localUrl)
     {
       //[formData appendPartWithFileURL: localUrl name:@"data" fileName:entity.filename mimeType:mimeType error:&fileappenderror];
       
     }];
  }
  hideMediaPicker();
}

+(void)getAassetUrl: (PHAsset*)mPhasset resultHandler:(void(^)(NSURL *imageUrl))dataResponse{
  
  PHImageRequestOptions * requestOption = [[PHImageRequestOptions alloc] init];
  requestOption.synchronous = YES;
  requestOption.deliveryMode = PHImageRequestOptionsDeliveryModeFastFormat;
  
  [[PHImageManager defaultManager] requestImageDataForAsset:mPhasset options:requestOption resultHandler:^(NSData *imageData, NSString *dataUTI, UIImageOrientation orientation, NSDictionary *info) {
    
    dataResponse([info objectForKey:@"PHImageFileURLKey"]);
    
  }];
}

+(void)writeResourceToTmp: (PHAssetResource*)resource pathCallback: (void(^)(NSURL*localUrl))pathCallback {
  // Get Asset Resource. Take first resource object. since it's only the one image.
  NSString *filename = resource.originalFilename;
  NSString *pathToWrite = [NSTemporaryDirectory() stringByAppendingString:filename];
  NSURL *localpath = [NSURL fileURLWithPath:pathToWrite];
  PHAssetResourceRequestOptions *options = [PHAssetResourceRequestOptions new];
  options.networkAccessAllowed = YES;
  [[PHAssetResourceManager defaultManager] writeDataForAssetResource:resource toFile:localpath options:options completionHandler:^(NSError * _Nullable error) {
    if (error) {
      NSLog(@"Failed to write a resource: %@",[error localizedDescription]);
    }
    
    pathCallback(localpath);
  }];
  
}

#pragma mark private-methods

void hideMediaPicker() {
  AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
  [delegate.rootViewController dismissViewControllerAnimated:YES completion:nil];
}
@end
