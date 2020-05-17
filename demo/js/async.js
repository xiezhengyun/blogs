function sleep(duration) {
    return new Promise(function (resolve) {
        setTimeout(resolve, duration);
    });
}
async function changeColor(duration, color) {
    console.log(color)
    await sleep(duration);
}
async function main() {
    let i = 0
    while (i<10) {
        await changeColor(3000, "green");
        await changeColor(1000, "yellow");
        await changeColor(2000, "red");
        i++;
    }
}
//main();

//————————————————————————————————————————————————————————————
function setColor(color) {
    console.log(color)
}

let timer = (cb, color, time) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            cb(color)
            resolve()
        }, time)
    })
}
let step = function () {
    Promise.resolve().then(() => {
        return timer(setColor, 'green', 3000)
    }).then(() => {
        return timer(setColor, 'yellow', 1000)
    }).then(() => {
        return timer(setColor, 'red', 2000)
    }).then(() => {
        step()
    })
}
step()