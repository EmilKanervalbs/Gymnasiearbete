var TIME = document.getElementById("time");

var lengthen = (x) => {
    return x < 10 ? "0" + x : x;
};

var updateTime = () => {
    let time = new Date;
    
    TIME.innerText = lengthen(time.getHours()) + ":" + lengthen(time.getMinutes()) + ":" + lengthen(time.getSeconds());
}

let currentTime = new Date;

updateTime();

setTimeout(() => {
    setInterval(() => {
        updateTime();
    }, 1000);
    updateTime();
}, 1000 - currentTime.getMilliseconds());

let x = document.getElementById("news")
// console.log(x)

var getNews = async () => {
    console.log("requesting news");
    let x = await fetch("/getnews/")
        .then((resp) => {
            console.log("response recieved");
            // console.log(resp);

            return resp.json();
    })
        .then((news) => {
            // console.log(news);
            return news
    });

    // const newsElement = document.getElementById("news").querySelector("tbody");
    const newsWrapper = document.getElementById("news").querySelector("div");
    
    x["news"].forEach(a => {
        let title = a.title;
        let content = a.content;
        let news_id = a.newsid;

        let element = document.createElement("news-element");

        element.setAttribute("title", title);
        element.setAttribute("content", content);
        element.setAttribute("sender", "");
        element.setAttribute("news-id", news_id);

        newsWrapper.appendChild(element);
    });
    window.customElements.define("news-element", News)
}

getNews();

var getNewsByID = async (id) => {
    console.log("requesting news id " + id);
    let news = await fetch("/getnews/" + id)
        .then((resp) => {
            console.log("response recieved");
            // console.log(resp);

            // return resp.json();
    })
        .then((news) => {
            // console.log(news);
            return news
    });

    return news;
}

var getUser = async () => {
    let x = await fetch("/getuser")
        .then((resp) => {
            console.log("response recieved");
            // console.log(resp);

            return resp.json();
    	})
        .then((news) => {
            // console.log(news);
            return news;
    });
    console.log(x);
    return x;
}

var user = getUser().then(data => {
	console.log(data);
	user = "bajs";
	return data;

}); //fixa så att den gör skit typ asså verkligen
console.log(user);

class News extends HTMLElement {
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



        // console.log(newsID);
        // console.log(sender);
        // console.log(title);
        // console.log(content);

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

document.getElementById("news").addEventListener("click", async (e) => { // ifall man clickar på en nyhet
    if (e.target.nodeName == "NEWS-ELEMENT"){
        // console.log(e.target.getAttribute("news-id"));
        const POPUP = document.getElementById("popup");
        let news = await getNewsByID(e.target.getAttribute("news-id"));

        POPUP.querySelector("h2").innerText = news.title;
        POPUP.querySelector("h3").innerText = "Av: " + news.sender;
        POPUP.querySelector("p").innerText = news.content;
        
        let date = new Date(news.startDate);
        // date.setTime(news.startDate);
        POPUP.querySelector("h4").innerText = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${lengthen(date.getHours())}:${lengthen(date.getMinutes())}`


        POPUP.classList.add("visible");

    }
});

document.getElementById("popup").addEventListener("click", e => {
    if (e.target.id = "popup") {
        e.target.classList.remove("visible");
        return;
    }
});