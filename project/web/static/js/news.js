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


export var getNews = async () => {
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


export var getNewsByID = async (id) => {
    console.log("requesting news id " + id);
    let news = await fetch("/getnews/" + id)
        .then((resp) => {
            console.log("response recieved");
            // console.log(resp);

            return resp.json();
    })
        .then((news) => {
            // console.log(news);
            return news
    });

    return news;
}


