var TIME = document.getElementById("time");

var Lengthen = (x, y) => {
    x = x.toString();
    let res = "";
    for (let i = x.length; i < y; i++) {
        res += "0";
    }
    res += x;
    return res;
};

let x = new Date;

TIME.innerText = Lengthen(x.getHours(), 2) + ":" + Lengthen(x.getMinutes(), 2) + ":" + Lengthen(x.getSeconds(), 2);

setTimeout(() => {
    setInterval(() => {
        let time = new Date;
    
        TIME.innerText = Lengthen(time.getHours(), 2) + ":" + Lengthen(time.getMinutes(), 2) + ":" + Lengthen(time.getSeconds(), 2);
    }, 1000);
    x = new Date;
    TIME.innerText = Lengthen(x.getHours(), 2) + ":" + Lengthen(x.getMinutes(), 2) + ":" + Lengthen(x.getSeconds(), 2);

}, 1000 - x.getMilliseconds());
