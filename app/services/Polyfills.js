class Polyfills{

    constructor(){
        global.debugAsyncObject = this.debugAsyncObject;
    }

    debugAsyncObject(obj){
        console.log("async obj is"+ obj);
    }
}
export default new Polyfills();