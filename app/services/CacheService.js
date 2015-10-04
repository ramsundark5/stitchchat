import React, { AsyncStorage } from 'react-native';

class CacheService{
    constructor(){
        this.cache = new Map();
    }

    set(key, value){
        cache.set(key, value);
    }

    get(key){
        return cache.get(key);
    }

    setAndPersist(key, value){
        this.set(key, value);
        AsyncStorage.setItem(key, value);
    }

}

module.exports = new CacheService();