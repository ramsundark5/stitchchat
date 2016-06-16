

#import "RCTVideoThumbnailLoader.h"

#import <Photos/Photos.h>
#import <libkern/OSAtomic.h>
#import "RCTImageUtils.h"
#import "RCTUtils.h"

@implementation RCTVideoThumbnailLoader

RCT_EXPORT_MODULE()

@synthesize bridge = _bridge;

#pragma mark - RCTImageLoader

- (BOOL)canLoadImageURL:(NSURL *)requestURL
{
  return [requestURL.scheme.lowercaseString isEqualToString:@"vph" ] || [requestURL.scheme.lowercaseString isEqualToString:@"vuri"];
}

- (RCTImageLoaderCancellationBlock)loadImageForURL:(NSURL *)imageURL
                                              size:(CGSize)size
                                             scale:(CGFloat)scale
                                        resizeMode:(RCTResizeMode)resizeMode
                                   progressHandler:(RCTImageLoaderProgressBlock)progressHandler
                                 completionHandler:(RCTImageLoaderCompletionBlock)completionHandler
{
  NSLog(@"got imageURL as %@", imageURL);
  NSString* imageURLStr = [imageURL absoluteString];
  if([imageURLStr isEqualToString:@"vph"]){
    return [self loadImageForLocalIdentifier:imageURLStr size:size scale:scale resizeMode:resizeMode progressHandler:progressHandler completionHandler:completionHandler];
  }
  
  return [self loadImageForVideoURL:imageURLStr size:size scale:scale resizeMode:resizeMode progressHandler:progressHandler completionHandler:completionHandler];
}

- (RCTImageLoaderCancellationBlock)loadImageForLocalIdentifier:(NSString *)imageURL
                                              size:(CGSize)size
                                             scale:(CGFloat)scale
                                        resizeMode:(RCTResizeMode)resizeMode
                                   progressHandler:(RCTImageLoaderProgressBlock)progressHandler
                                 completionHandler:(RCTImageLoaderCompletionBlock)completionHandler
{
  NSString *phAssetID = [imageURL substringFromIndex:[@"vph://" length]];
  PHFetchResult *results = [PHAsset fetchAssetsWithLocalIdentifiers:@[phAssetID] options:nil];
  if (results.count == 0) {
    NSString *errorText = [NSString stringWithFormat:@"Failed to fetch PHAsset with local identifier %@ with no error message.", phAssetID];
    NSError *error = RCTErrorWithMessage(errorText);
    completionHandler(error, nil);
    return ^{};
  }
  
  PHAsset *videoAsset = [results firstObject];
  
  PHVideoRequestOptions *videoOptions = [PHVideoRequestOptions new];
  videoOptions.deliveryMode = PHVideoRequestOptionsDeliveryModeFastFormat;
  videoOptions.progressHandler = ^(double progress, NSError *error, BOOL *stop, NSDictionary *info) {
    static const double multiplier = 1e6;
    progressHandler(progress * multiplier, multiplier);
  };
  
  PHImageRequestID requestID = [[PHImageManager defaultManager] requestAVAssetForVideo:videoAsset options:videoOptions resultHandler:^(AVAsset * asset, AVAudioMix * audioMix, NSDictionary * info) {
    
    if(asset){
      // Calculate a time for the snapshot - I'm using the half way mark.
      CMTime duration = [asset duration];
      
      CMTime snapshot = CMTimeMake(duration.value / 2, duration.timescale);
      
      NSError* error;
      // Create a generator and copy image at the time.
      AVAssetImageGenerator *generator = [AVAssetImageGenerator assetImageGeneratorWithAsset:asset];
      generator.appliesPreferredTrackTransform = YES;
      
      CGImageRef imageRef = [generator copyCGImageAtTime:snapshot
                                              actualTime:nil
                                                   error:&error];
      
      // Make a UIImage and release the CGImage.
      UIImage *thumbnail = [UIImage imageWithCGImage:imageRef];
      CGImageRelease(imageRef);
      
      completionHandler(nil, thumbnail);
    }else {
      completionHandler(info[PHImageErrorKey], nil);
    }
    
  }];
  
  return ^{
    [[PHImageManager defaultManager] cancelImageRequest:requestID];
  };

}

- (RCTImageLoaderCancellationBlock)loadImageForVideoURL:(NSString *)imageURL
                                              size:(CGSize)size
                                             scale:(CGFloat)scale
                                        resizeMode:(RCTResizeMode)resizeMode
                                   progressHandler:(RCTImageLoaderProgressBlock)progressHandler
                                 completionHandler:(RCTImageLoaderCompletionBlock)completionHandler
{
  NSString *imageURLNoPrefix = [imageURL substringFromIndex:[@"vuri://" length]];
  //imageURLNoPrefix = [imageURLNoPrefix substringFromIndex:[@"file://" length]];
  
  __block volatile uint32_t cancelled = 0;
  
    if (cancelled) {
      return ^{};
    }
    NSFileManager *fileManager = [NSFileManager defaultManager];
    
    BOOL isDir;
    if (![fileManager fileExistsAtPath:imageURLNoPrefix isDirectory:&isDir] || isDir){
      NSError *error = [NSError errorWithDomain:@"file not found" code:-15 userInfo:nil];
      completionHandler(error, nil);
      return ^{};
    }
    
    AVURLAsset *asset = [AVURLAsset URLAssetWithURL:[NSURL fileURLWithPath:imageURLNoPrefix] options:nil];
    
    if(asset){
      UIImage *thumbnail;
      
      if (progressHandler) {
        progressHandler(1, 1);
      }
      
      // Calculate a time for the snapshot - I'm using the half way mark.
      CMTime duration = [asset duration];
      
      CMTime snapshot = CMTimeMake(duration.value / 2, duration.timescale);
      
      NSError* error;
      // Create a generator and copy image at the time.
      AVAssetImageGenerator *generator = [AVAssetImageGenerator assetImageGeneratorWithAsset:asset];
      generator.appliesPreferredTrackTransform = YES;
      
      CGImageRef imageRef = [generator copyCGImageAtTime:snapshot
                                              actualTime:nil
                                                   error:&error];
      
      // Make a UIImage and release the CGImage.
      thumbnail = [UIImage imageWithCGImage:imageRef];
      CGImageRelease(imageRef);
      
      completionHandler(nil, thumbnail);
    }else {
      NSString *message = [NSString stringWithFormat:@"Could not find image"];
      completionHandler(RCTErrorWithMessage(message), nil);
    }
    
    return ^{
      OSAtomicOr32Barrier(1, &cancelled);
    };
}
@end