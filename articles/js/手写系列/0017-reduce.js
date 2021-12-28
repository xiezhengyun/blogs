Array.prototype.myReduce = function (callback, initValue) {
  if (this === null) {
    throw new TypeError(
      "Array.prototype.reduce " + "called on null or undefined"
    );
  }
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }

  const length = this.length;
  let acc = typeof initValue === "undefined" ? this[0] : initValue;
  let i = typeof initValue === "undefined" ? 1 : 0;

  while (i < length) {
    acc = callback(acc, this[i], i, this);
    i++;
  }
  return acc;
};
