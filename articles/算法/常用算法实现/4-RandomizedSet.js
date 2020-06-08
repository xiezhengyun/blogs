//https://leetcode-cn.com/problems/insert-delete-getrandom-o1/submissions/

// 数组删除最后一个元素，时间复杂度是O(1)

class RandomizedSet{
    constructor(){
        this.map = new Map();
        this.arr = [];
    }

    insert(val){
        if(!this.map.has(val)){
            this.map.set(val,val)
            this.arr.push(val)
            return true
        }
        return false
    }

    remove(val){
        if(this.map.has(val)){
            this.map.delete(val)
            var index = this.arr.indexOf(val);
            var temp = this.arr[this.arr.length-1];
            this.arr[index] = temp;
            this.arr.pop();
            return true
        }
        return false
    }

    getRandom(){
        var random = Math.floor(Math.random()*this.map.size);
        return this.arr[random]
    }
}




