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



let x = document.getElementById("news")
console.log(x)

var getNews = async () => {
    console.log("requesting news");
    let x = await fetch("/getnews/")
        .then((resp) => {
            console.log("response recieved");
            console.log(resp);

            return resp.json();
    })
        .then((news) => {
            console.log(news);
            return news
    });

    const newsElement = document.getElementById("news").querySelector("tbody")
    
    console.log(x["news"]);
    x["news"].forEach(a => {
        console.log(a);
        let title = a.title;
        let content = a.content;
        let TR = document.createElement("tr");
        let TH = document.createElement("th");
        TH.innerText = title;
        TR.appendChild(TH);

        let TD = document.createElement("td");
        TD.innerText = content;
        TR.appendChild(TD)

        newsElement.appendChild(TR);
    })
}


getNews();

