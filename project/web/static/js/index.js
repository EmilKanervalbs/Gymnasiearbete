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
// console.log(x)

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

    // const newsElement = document.getElementById("news").querySelector("tbody");
    const newsWrapper = document.getElementById("news").querySelector("div");
    
    console.log(x["news"]);
    x["news"].forEach(a => {
        console.log(a);
        let title = a.title;
        let content = a.content;

        // let newsElement = document.createElement("news")

        let element = document.createElement("news-element");

        element.setAttribute("title", title);
        element.setAttribute("content", content);
        element.setAttribute("sender", "");
        element.setAttribute("news-id", "");

        newsWrapper.appendChild(element);


        // let TR = document.createElement("tr");
        // let TH = document.createElement("th");
        // TH.innerText = title;
        // TR.appendChild(TH);

        // let TD = document.createElement("td");
        // TD.innerText = content;
        // TR.appendChild(TD)

        // newsElement.appendChild(TR);
    });
    window.customElements.define("news-element", news)
}


getNews();

class news extends HTMLElement {
    constructor() {
        super();
        var shadowDOM = this.attachShadow({
            mode : "open"
        });

        var LINK = document.createElement("link")
        LINK.setAttribute("rel", "stylesheet")
        LINK.setAttribute("href", "/css/normalize.css")

        var LINK2 = document.createElement("link")
        LINK2.setAttribute("rel", "stylesheet")
        LINK2.setAttribute("href", "/css/style.css")
    
        shadowDOM.appendChild(LINK);
        shadowDOM.appendChild(LINK2);


        var newsID = this.getAttribute("news-id");
        var sender = this.getAttribute("sender");
        var title = this.getAttribute("title");
        var content = this.getAttribute("content");

        var TABLE = document.createElement("table");
        TABLE.className = "newstable";

        var TBODY = document.createElement("tbody");
        var TR = document.createElement("tr");



        console.log(newsID);
        console.log(sender);
        console.log(title);
        console.log(content);

        var NEWS_TITLE = document.createElement("th");
        NEWS_TITLE.innerText = title;

        var NEWS_CONTENT = document.createElement("td");
        NEWS_CONTENT.innerText = content;

        TR.append(NEWS_TITLE);
        TR.append(NEWS_CONTENT);

        TBODY.append(TR);
        TABLE.append(TBODY)

        shadowDOM.append(TABLE);

        
        
    }
}