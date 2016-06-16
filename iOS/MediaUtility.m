
#import <Foundation/Foundation.h>
#import "MediaUtility.h"
#import "RCTImageUtils.h"
#import "RCTUtils.h"

@implementation MediaUtility

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getImageURLforVideo:(NSString*)localIdentifier
                     resolver:(RCTPromiseResolveBlock)resolve
                     rejecter:(RCTPromiseRejectBlock)reject){
  PHFetchResult *results = [PHAsset fetchAssetsWithLocalIdentifiers:@[localIdentifier] options:nil];
  if (results.count == 0) {
    NSString *errorText = [NSString stringWithFormat:@"Failed to fetch PHAsset with local identifier %@ with no error message.", localIdentifier];
    NSError *error = RCTErrorWithMessage(errorText);
    reject(errorText, nil, error);
  }
  
  PHAsset *videoAsset = [results firstObject];
  
  PHVideoRequestOptions *videoOptions = [PHVideoRequestOptions new];
  videoOptions.deliveryMode = PHVideoRequestOptionsDeliveryModeFastFormat;
  
  [[PHImageManager defaultManager] requestAVAssetForVideo:videoAsset options:videoOptions resultHandler:^(AVAsset * asset, AVAudioMix * audioMix, NSDictionary * info) {
    
    if(asset){
      NSURL* assetURL = [(AVURLAsset *)asset URL];
      NSLog(@"got assetURL as %@", assetURL);
      resolve([assetURL absoluteString]);
    }else {
      NSString *errorText = [NSString stringWithFormat:@"Failed to fetch AVAsset with local identifier %@ with no error message.", localIdentifier];
      NSError *error = RCTErrorWithMessage(errorText);
      reject(errorText, nil, error);
    }
  }];
}

RCT_EXPORT_METHOD(getURLForMediaID:(NSString*)localIdentifier
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject){
  PHFetchResult *results = [PHAsset fetchAssetsWithLocalIdentifiers:@[localIdentifier] options:nil];
  if (results.count == 0) {
    NSString *errorText = [NSString stringWithFormat:@"Failed to fetch PHAsset with local identifier %@ with no error message.", localIdentifier];
    NSError *error = RCTErrorWithMessage(errorText);
    reject(errorText, nil, error);
    return;
  }
  
  PHAsset *mediaAsset = [results firstObject];
  [mediaAsset requestContentEditingInputWithOptions:nil
                             completionHandler:^(PHContentEditingInput *contentEditingInput, NSDictionary *info) {
                               NSURL *imageURL = contentEditingInput.fullSizeImageURL;
                               NSLog(@"ph media location is %@", imageURL);
                               resolve([imageURL absoluteString]);
                             }];
  
}

RCT_EXPORT_METHOD(deleteMedia:(NSString*)localIdentifier
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject){
  PHFetchResult *results = [PHAsset fetchAssetsWithLocalIdentifiers:@[localIdentifier] options:nil];
  [[PHPhotoLibrary sharedPhotoLibrary] performChanges:^{
    [PHAssetChangeRequest deleteAssets:results];
  } completionHandler:^(BOOL success, NSError *error) {
    if(error){
      NSString *errorText = [NSString stringWithFormat:@"Error deleting media with local identifier %@.", localIdentifier];
      reject(errorText, nil, error);
    }
    if (success) {
      NSLog(@"Finished deleting asset. %@", (success ? @"Success." : error));
      resolve(@"deleted successfully");
    }
  }];
}

@end
