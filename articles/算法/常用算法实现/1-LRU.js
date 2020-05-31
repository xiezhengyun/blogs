class LRU{

    constructor(maxLength){
        this.cache = Object.create(null);
        this.keys = [];
        this.maxLength = maxLength;
    }

    get(key){
        if(this.cache[key]){
            this.removeKey(key)
            this.keys.push(key)
            return this.cache[key]
        }
        return -1
    }

    put(key,value){
        if(this.cache[key]){
            this.cache[key] = value;
            this.removeKey(key);
            this.keys.push(key);
        }else{
            this.cache[key] = value;
            this.keys.push(key);
            if(this.keys.length > this.maxLength){
                this.removeCache(this.keys[0])
            }
        }
    }


    removeKey(key){
        var index = this.keys.indexOf(key);
        this.keys.splice(index,1)
    }

    removeCache(key){
        this.cache[key] = null;
        this.removeKey(key)
    }

}

var lruCache = new LRU(3);
lruCache.put('a',1)
lruCache.put('b',2)
lruCache.put('c',3)
lruCache.put('d',4)
console.log(lruCache.get('a')) 
lruCache.put('b','b')
console.log(lruCache.get('b')) 
console.log(lruCache.get('c')) 
console.log(lruCache.get('d')) 