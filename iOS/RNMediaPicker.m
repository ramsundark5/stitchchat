#import "RNMediaPicker.h"
#import "AppDelegate.h"
#import <MobileCoreServices/MobileCoreServices.h>
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"

@implementation RNMediaPicker

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

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


#pragma mark private-methods

void hideMediaPicker() {
  AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
  [delegate.rootViewController dismissViewControllerAnimated:YES completion:nil];
}
@end
