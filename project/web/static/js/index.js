var TIME = document.getElementById("time");

var Lengthen = (x) => {
    if (x < 10) {
        return "0" + x;
    }
    return x;
};

var UpdateTime = () => {
    let time = new Date;
    
    TIME.innerText = Lengthen(time.getHours()) + ":" + Lengthen(time.getMinutes()) + ":" + Lengthen(time.getSeconds());
}

let currentTime = new Date;

UpdateTime();

setTimeout(() => {
    setInterval(() => {
        UpdateTime();
    }, 1000);
    UpdateTime();
}, 1000 - currentTime.getMilliseconds());


