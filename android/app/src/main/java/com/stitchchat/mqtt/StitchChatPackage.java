package com.stitchchat.mqtt;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Created by ramsundar on 9/22/15.
 */
public class StitchChatPackage implements ReactPackage {

    public StitchChatPackage(){
        super();
    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactApplicationContext) {
        //List<NativeModule> baseModules = super.createNativeModules(reactApplicationContext);
        List<NativeModule> appModules = new ArrayList<NativeModule>();
        //appModules.addAll(baseModules);
        appModules.add(new RNMQTTClient(reactApplicationContext));
        return appModules;
    }

    @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(
            ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }


}
