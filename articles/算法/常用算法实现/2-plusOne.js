
// 给定一个由整数组成的非空数组所表示的非负整数，在该数的基础上加一。

// 最高位数字存放在数组的首位， 数组中每个元素只存储单个数字。

// 你可以假设除了整数 0 之外，这个整数不会以零开头。

// https://leetcode-cn.com/problems/plus-one/

//直接循环判断是不是等于9，如果有一次不是9，就直接++，然后break，最后判断下i==0的情况。（用push应该比unshift要快点？）

var plusOne = function(digits) {
    var len = digits.length;
    for(var i = len-1;i>=0; i--){
        if(digits[i] == 9){
            digits[i] = 0;
            if(i == 0){
                digits[i] = 1;
                digits.push(0);
                break
            }
        }else{
            digits[i]++;
            break
        }
    }
    
    return digits
}



// 下面是js的  push 和 unshift 速度测试


var arr = [1,'a','c','b',2,4,'j'];
var time1 = new Date().getTime();
for(var i = 0;i<100000;i++){
   // arr.push(1)
   arr.unshift(1)
}
var time2 = new Date().getTime();
console.log(time2 - time1)