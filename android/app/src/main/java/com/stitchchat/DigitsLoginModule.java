package com.stitchchat;

import com.digits.sdk.android.AuthCallback;
import com.digits.sdk.android.Digits;
import com.digits.sdk.android.DigitsException;
import com.digits.sdk.android.DigitsOAuthSigning;
import com.digits.sdk.android.DigitsSession;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.twitter.sdk.android.core.AuthToken;
import com.twitter.sdk.android.core.TwitterAuthConfig;
import com.twitter.sdk.android.core.TwitterAuthToken;
import com.twitter.sdk.android.core.TwitterCore;

import java.util.Map;


public class DigitsLoginModule extends ReactContextBaseJavaModule {

    public DigitsLoginModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    final AuthCallback digitsCallback = new AuthCallback() {
        @Override
        public void success(DigitsSession session, String phoneNumber) {
            TwitterAuthToken authToken = (TwitterAuthToken) session.getAuthToken();
            TwitterAuthConfig authConfig = TwitterCore.getInstance().getAuthConfig();
            DigitsOAuthSigning oauthSigning = new DigitsOAuthSigning(authConfig, authToken);
            Map<String, String> authHeaders = oauthSigning.getOAuthEchoHeadersForVerifyCredentials();

            WritableMap responseData = Arguments.createMap();
            responseData.putString("X-Auth-Service-Provider", authHeaders.get("X-Auth-Service-Provider"));
            responseData.putString("X-Verify-Credentials-Authorization", authHeaders.get("X-Verify-Credentials-Authorization"));
            responseData.putString("phoneNumber", session.getPhoneNumber());

            // Do something on success
            getReactApplicationContext()
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("registrationSuccess", responseData);
        }

        @Override
        public void failure(DigitsException exception) {
            if(exception.getErrorCode() == 1){
                getReactApplicationContext()
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("registrationCancelled", exception.getMessage());
            }
            // Do something on failure
        }
    };

    @ReactMethod
    public void startLoginProcess(){
        Digits.authenticate(digitsCallback);
    }

    @ReactMethod
    public void logout(){
        Digits.getSessionManager().clearActiveSession();
    }

    @Override
    public String getName() {
        return "DigitsLogin";
    }
}
