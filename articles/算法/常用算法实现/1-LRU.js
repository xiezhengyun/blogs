class LRUCache {
  constructor(maxLength) {
    this.cache = Object.create(null);
    this.keys = [];
    this.maxLength = maxLength;
  }

  get(key) {
    if (this.cache[key]) {
      this.removeKey(key);
      this.keys.push(key);
      return this.cache[key];
    }
    return -1;
  }

  put(key, value) {
    if (this.cache[key]) {
      this.cache[key] = value;
      this.removeKey(key);
      this.keys.push(key);
    } else {
      this.cache[key] = value;
      this.keys.push(key);
      if (this.keys.length > this.maxLength) {
        this.removeCache(this.keys[0]);
      }
    }
  }

  removeKey(key) {
    var index = this.keys.indexOf(key);
    this.keys.splice(index, 1);
  }

  removeCache(key) {
    this.cache[key] = null;
    this.removeKey(key);
  }
}

var lruCache = new LRUCache(3);
lruCache.put('a', 1);
lruCache.put('b', 2);
lruCache.put('c', 3);
lruCache.put('d', 4);
console.log(lruCache.get('a'));
lruCache.put('b', 'b');
console.log(lruCache.get('b'));
console.log(lruCache.get('c'));
console.log(lruCache.get('d'));

//----------------map 实现 ------------------、

class LRUCache2 {
  constructor(maxLength) {
    this.cache = new Map();
    this.maxLength = maxLength;
  }

  get(key) {
    if (this.cache.has(key)) {
      var temp = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, temp);
      return temp;
    }
    return -1;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxLength) {
      this.cache.delete(this.cache.keys().next().value);
    }
    this.cache.set(key, value);
  }
}
