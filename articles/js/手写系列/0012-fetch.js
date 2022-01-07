const fetch = (url, time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(url);
      resolve(`success-${url}`);
    }, time);
  });
};
const urlArr = [
  ['1', 10000],
  ['2', 100],
  ['3', 200],
  ['4', 300],
  ['5', 100],
  ['6', 10],
  ['7', 500],
];
function fetchLimit(urlArr, max = 2) {
  return new Promise((resolve, reject) => {
    const len = urlArr.length;
    if (len === 0) return resolve([]);

    const results = Array(len);
    let cur = -1;
    let count = 0;

    const next = () => {
      if (cur >= len) return;

      const cb = (index => (results, data) => {
        results[index] = data;
      })(cur);
      // console.log(cur, urlArr[cur])
      const [url, time] = urlArr[cur] || []
      fetch(url, time)
        .then(data => {
          cb(results, data);
        })
        .finally(() => {
          ++cur < len && next();
          ++count === len && resolve(results);
        });
    };

    for (let i = 0; i < max; i++) {
      cur++;
      next();
    }
  });
}
fetchLimit(urlArr, 2).then(data => {
  console.log(data);
});
