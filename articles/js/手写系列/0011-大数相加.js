var addStrings = function (num1, num2) {
  var i = num1.length - 1;
  var j = num2.length - 1;
  var carry = 0;
  var res = [];
  while (i >= 0 || j >= 0) {
    var x = num1[i] === undefined ? 0 : +num1[i];
    var y = num2[j] === undefined ? 0 : +num2[j];

    var sum = x + y + carry;
    res.push(sum % 10);
    carry = sum / 10 >= 1 ? 1 : 0;
    j--;
    i--;
  }
  if (carry > 0) res.push(carry);

  return res.reverse().join('');
};
