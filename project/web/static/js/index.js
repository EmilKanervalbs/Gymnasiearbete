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

var getWeekday = (x) => {
	let y = ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"];
	console.log(x.getDay());
	console.log(y[x.getDay()]);
	console.log(y[5]); // fråga jens wtf
	return y[x.getDay()];
}

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

            return resp.json();
    })
        .then((news) => {
            // console.log(news);
            return news
    });

    return news;
}

var getUser = async () => { // dels tar den user och dels tar den resultaten
    let user = await fetch("/getuser")
        .then((resp) => {
            console.log("response recieved");
            console.log(resp);

            return resp.json();
	})
        .then((data) => {
            console.log(data);
            return data;
    });
    // console.log(x);
	// return x;
	const assignmentUL = document.getElementById("navbar-assignments").querySelector("ul");
	const resultsUL = document.getElementById("navbar-results").querySelector("ul");
	const resultsDIV = document.getElementById("results").querySelector("div");
	let y = user.lessons

	y.forEach((z) => {
		let A = document.createElement("a");
		let LI = document.createElement("li");
		LI.innerText = z.code;
		A.append(LI);
		let a = A.cloneNode(true);
		assignmentUL.append(A);
		resultsUL.append(a);
	});

	user.results.forEach((result) => {
		console.log(new Date().getTime());
		console.log((result.time + 2678400) * 1000);

		// HÄÄÄÄÄÄÄÄÄR fixa att den inte visar för gamla resultat
		if (new Date().getTime() > (result.time + 2678400) * 1000) {
			return;
		}


		let el = document.createElement("results-element"); // name, course, type, due
		el.setAttribute("name", result.name);
		el.setAttribute("course", result.course);
		el.setAttribute("type", result.type);

		date = new Date(result.time * 1000);
		let dueDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
		el.setAttribute("due", dueDate);

		resultsDIV.append(el);
	});

	console.log(user.results);

	window.customElements.define("results-element", Results);

}

getUser();


var getAssignments = async () => {
    console.log("requesting assignments");
    let assignments = await fetch("/getassignments")
        .then((resp) => {
            console.log("response recieved");

            return resp.json();
    })
        .then((news) => {
            return news;
	});
	
	console.log(assignments);


	assignments.assignments.forEach((x) => {
		let element = document.createElement("assignment-element");
		
		let date = new Date(x.time * 1000);
		let currentTime = new Date();

		let weekendDate = new Date(Math.floor((new Date().getTime()) / 86400000) * 86400000 + (7 - currentTime.getDay()) * 86400000 - 1).getTime();

		let dueDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

		element.setAttribute("name", x.name);
		element.setAttribute("course", x.course);
		element.setAttribute("type", x.type);

		let parentElement;

		// console.log(weekendDate);
		// console.log(date);

		switch(x.type) {
			case "exam":
				if (weekendDate >= date.getTime()) {
					parentElement = document.getElementsByClassName("assignment-wrapper")[2];
					dueDate = `${getWeekday(date)} ${date.getDate()}/${date.getMonth() + 1}`;
				}
				else {
					parentElement = document.getElementsByClassName("assignment-wrapper")[3];
				}
				break;
			default:
				if (weekendDate >= date.getTime()) {
					parentElement = document.getElementsByClassName("assignment-wrapper")[0];
					dueDate = `${getWeekday(date)} ${date.getDate()}/${date.getMonth() + 1}`;

				}
				else {
					parentElement = document.getElementsByClassName("assignment-wrapper")[1];
				}
		}

		element.setAttribute("due", dueDate);


		parentElement.append(element);


		console.log(x);
	});

	window.customElements.define("assignment-element", Assignment)

};

getAssignments();

var getSchedule = async () => {
	const scheduleRoots = document.getElementsByClassName("scheduleHolder");

    console.log("requesting assignments"); 
    let schedule = await fetch("/getschedule") // GET request från servern för att få ett objekt med hela användarens schema
        .then((resp) => {
            console.log("response recieved");

            return resp.json();
    })
        .then((data) => {
            return data;
	});

	// console.log(schedule);

	let fullSchedule = [];

	let currentDay = new Date(); 
	// let currentDay = new Date(1611039600000); 
	// console.log(currentDay.getDay());

	currentTime = currentDay.getHours() * 60 + currentDay.getMinutes(); // nuvarande tid i minuter från midnatt

	// console.log(currentTime);

	let weekday = currentDay.getDay() - 1; // JS Date klassen har söndag = 0 och lördag = 7, gör om till måndag = 0 och söndag = 7
	while (weekday < 0) weekday += 7;

	let	trueWeekday = weekday;

	if (weekday > 4) { // klipper av lördag och söndag
		weekday = 0
	}

	// weekday = 2;
	// console.log("weekday: " + weekday);
	// console.log(schedule["normal"][weekday]);

	if ((currentDay.getDay() + 6) % 7 < 5) { // kör bara om det är måndag-fredag
		for (let i = 0; i < schedule["normal"][weekday].length; i++) { //kollar alla dagens lektioner och tar bort de som har slutat
			let lesson = schedule["normal"][weekday][i];
	
			if (currentTime > lesson.endTime) { // ifall lektionen har slutat
				schedule["normal"][weekday].splice(i, 1); // ta bort
				i--; // minska i för att motverka att längden har minskat med 1
			}
		}
	}

	// koden nedanför är enkel insertion sort med O(n^2)
	// koden arbetar dag för dag, så först idag, följt av imorgon
	for (let i = 0; i < schedule["normal"].length; i++) { // loopar genom alla dagar

		for (let j = 0; j < schedule["normal"][weekday].length;) { // loopar genom alla lektioner

			let earliestIndex = 0;
			for (let k = 0; k < schedule["normal"][weekday].length; k++) {

				if (schedule["normal"][weekday][k].startTime < schedule["normal"][weekday][earliestIndex].startTime) { // hittar den tidigaste lektionen
					earliestIndex = k;
					
				}
			}

			let x = schedule["normal"][weekday][earliestIndex]
			x.weekday = weekday;
			console.log(schedule["normal"][weekday].splice(earliestIndex, 1)); // tar bort den tidigaste lektionen
			fullSchedule.push(x); // sätter den tidigaste lektionen
		}

		schedule["normal"][weekday].forEach(x => {
			
		});

		weekday = ++weekday % 5; // ++ före istället för efter då ++weekday % 5 är lika med (weekday + 1) % 5
								// istället för weekday++ % 5 som är lika med weekday % 5
	}	

	console.log(fullSchedule);
	for (let i = 0; i < fullSchedule.length && i < 7; i++) { // for-loopen som visar upp schemat
		let lesson = fullSchedule[i]

		let el = document.createElement("schedule-element"); // skapar elementet
		el.setAttribute("start", lesson.startTime); // fixar alla attribut
		el.setAttribute("course", lesson.course);
		el.setAttribute("end", lesson.endTime);
		el.setAttribute("room", lesson.room);
		el.setAttribute("weekday", lesson.weekday);

		if (lesson.weekday != fullSchedule[0].weekday || lesson.weekday != trueWeekday) {
			let weekdayArr = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"];

			el.setAttribute("displayDay", weekdayArr[lesson.weekday]);
			console.log("hmm yes hello " + lesson.weekday + " " + fullSchedule[0].weekday)
			console.log()
		}
		else {
			el.setAttribute("displayDay", "");
		}

		// bestämmer om lektionen hamnar i "nästa/nuvarande lektion" eller "kommande lektioner"
		// ifall det är den första lektionen hamnar den alltid i "nästa"
		// ifall någon annan lektion börjar på samma dag som den första, eller har börjat hamnar den i nuvarande
		// hamnar inte i nästa/nuvarande ifall det inte samma dag
		if (i == 0 || 
			(lesson.startTime == fullSchedule[0].startTime || lesson.startTime < currentTime) && 
			lesson.weekday == fullSchedule[0].weekday && lesson.weekday == trueWeekday)
			{
			scheduleRoots[0].appendChild(el); // lägg till lektioonen i "nästa lektion"-sektionen
			continue;
		}

		scheduleRoots[1].appendChild(el); // lägg till lektionen i "kommande lektioner"-sektionen
	}

	scheduleRoots[0].childNodes.forEach((el) => {
		if (el.nodeType != 1) {
			return;
		}

		let lessonStart = el.getAttribute("start");
		let lessonWeekday = el.getAttribute("weekday");

		if (lessonStart <= currentTime && lessonWeekday == trueWeekday) {
			let text = "Nuvarande lektion";
			if (scheduleRoots[0].childElementCount > 1) {
				text += "er";
			}

			scheduleRoots[0].parentElement.querySelector("h3").innerText = text;
		}
	});
	
	window.customElements.define("schedule-element", Schedule);
	

}

getSchedule();

var getResults = async () => {
	let results = await fetch("/getresults")
        .then((resp) => {
            console.log("response recieved");

            return resp.json();
    })
        .then((data) => {
            return data;
	});

	console.log(results);
}

// getResults();


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

class Assignment extends HTMLElement {
	constructor() {
		super();
		var shadowDOM = this.attachShadow({
			mode: "open"
		});

		var LINK = document.createElement("link")
        LINK.setAttribute("rel", "stylesheet")
        LINK.setAttribute("href", "/css/normalize.css")

        var LINK2 = document.createElement("link")
        LINK2.setAttribute("rel", "stylesheet")
        LINK2.setAttribute("href", "/css/style.css")
    
        shadowDOM.appendChild(LINK);
        shadowDOM.appendChild(LINK2);


		var assignmentName = this.getAttribute("name");
        var course = this.getAttribute("course");
        var type = this.getAttribute("type");
        var due = this.getAttribute("due");

        var TABLE = document.createElement("table");
        TABLE.className = "newstable";

        var TBODY = document.createElement("tbody");
        var TR = document.createElement("tr");

		let displayType = "";

		switch(type) {
			case "assignment":
				displayType = "Inlämningsuppgift";
				break;
			case "verbal":
				displayType = "Muntlig uppgift";
				break;
			case "exam":
				displayType = "Prov";
				break;
		}

        var ASSIGNMENT_NAME = document.createElement("th");
        ASSIGNMENT_NAME.innerText = assignmentName;

		var FIRST_ROW = document.createElement("td");

        var COURSE_NAME = document.createElement("div");
		COURSE_NAME.innerText = course;

		var DUE_DATE = document.createElement("div");
		DUE_DATE.innerText = due

		FIRST_ROW.append(COURSE_NAME);
		FIRST_ROW.append(DUE_DATE);


		var SECOND_ROW = document.createElement("td");

		var TYPE = document.createElement("div");
		TYPE.innerText = displayType;

		SECOND_ROW.append(TYPE);
		
		

        TR.append(ASSIGNMENT_NAME);
        TR.append(FIRST_ROW);
        TR.append(SECOND_ROW);

        TBODY.append(TR);
        TABLE.append(TBODY);

		shadowDOM.append(TABLE);  
		
		// console.log(TABLE);

	}
}

class Results extends HTMLElement {
	constructor() {
		super();
		var shadowDOM = this.attachShadow({
			mode: "open"
		});

		var LINK = document.createElement("link")
        LINK.setAttribute("rel", "stylesheet")
        LINK.setAttribute("href", "/css/normalize.css")

        var LINK2 = document.createElement("link")
        LINK2.setAttribute("rel", "stylesheet")
        LINK2.setAttribute("href", "/css/style.css")
    
        shadowDOM.appendChild(LINK);
        shadowDOM.appendChild(LINK2);


		var assignmentName = this.getAttribute("name");
        var course = this.getAttribute("course");
        var type = this.getAttribute("type");
        var due = this.getAttribute("due");

        var TABLE = document.createElement("table");
        TABLE.className = "newstable";

        var TBODY = document.createElement("tbody");
        var TR = document.createElement("tr");

		let displayType = "";

		switch(type) {
			case "assignment":
				displayType = "Inlämningsuppgift";
				break;
			case "verbal":
				displayType = "Muntlig uppgift";
				break;
			case "exam":
				displayType = "Prov";
				break;
		}

        var ASSIGNMENT_NAME = document.createElement("th");
        ASSIGNMENT_NAME.innerText = assignmentName;

		var FIRST_ROW = document.createElement("td");

        var COURSE_NAME = document.createElement("div");
		COURSE_NAME.innerText = course;

		var DUE_DATE = document.createElement("div");
		DUE_DATE.innerText = due

		FIRST_ROW.append(COURSE_NAME);
		FIRST_ROW.append(DUE_DATE);


		var SECOND_ROW = document.createElement("td");

		var TYPE = document.createElement("div");
		TYPE.innerText = displayType;

		SECOND_ROW.append(TYPE);
		
		

        TR.append(ASSIGNMENT_NAME);
        TR.append(FIRST_ROW);
        TR.append(SECOND_ROW);

        TBODY.append(TR);
        TABLE.append(TBODY);

		shadowDOM.append(TABLE);

	}
}



class Schedule extends HTMLElement {
	constructor() {
		super();
		var shadowDOM = this.attachShadow({
			mode: "open"
		});

		var LINK = document.createElement("link")
        LINK.setAttribute("rel", "stylesheet")
        LINK.setAttribute("href", "/css/normalize.css")

        var LINK2 = document.createElement("link")
        LINK2.setAttribute("rel", "stylesheet")
        LINK2.setAttribute("href", "/css/style.css")
    
        shadowDOM.appendChild(LINK);
        shadowDOM.appendChild(LINK2);

        var course = this.getAttribute("course");
        var start = this.getAttribute("start");
        var end = this.getAttribute("end");
		var room = this.getAttribute("room");
		var displayDay = this.getAttribute("displayDay");
		var weekday = this.getAttribute("weekday");

        var TABLE = document.createElement("table");
        TABLE.className = "newstable";

        var TBODY = document.createElement("tbody");
        var TR = document.createElement("tr");

        var LESSON_NAME = document.createElement("th");
        LESSON_NAME.innerText = course;

		var FIRST_ROW = document.createElement("td");

        var ROOM_NAME = document.createElement("div");
		ROOM_NAME.innerText = room;

		var TIME = document.createElement("div");
		TIME.innerText = `${Math.floor(start / 60)}.${lengthen(start % 60)}-${Math.floor(end / 60)}.${lengthen(end % 60)}`;


		if (displayDay != "") {
			TIME.innerText = displayDay + " " + TIME.innerText;
		}

		FIRST_ROW.append(ROOM_NAME);
		FIRST_ROW.append(TIME);
		

        TR.append(LESSON_NAME);
        TR.append(FIRST_ROW);

        TBODY.append(TR);
        TABLE.append(TBODY);

		shadowDOM.append(TABLE);  
		
		// console.log(TABLE);
	}
}


document.getElementById("news").addEventListener("click", async (e) => { // ifall man clickar på en nyhet
	console.log(e.target);
    if (e.target.nodeName == "NEWS-ELEMENT"){
        // console.log(e.target.getAttribute("news-id"));
        const POPUP = document.getElementById("popup");
        let news = await getNewsByID(e.target.getAttribute("news-id"));

        POPUP.querySelector("h2").innerText = news.title;
        POPUP.querySelector("h3").innerText = "Av: " + news.sender;
        POPUP.querySelector("p").innerText = news.content;
        
        let date = new Date(news.startDate * 1000);
        // date.setTime(news.startDate);
        POPUP.querySelector("h4").innerText = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${lengthen(date.getHours())}:${lengthen(date.getMinutes())}`


        POPUP.classList.add("visible");

    }
});



document.getElementById("assignments").addEventListener("click", async (e) => { // ifall man clickar på en nyhet
	console.log(e.target);
    if (e.target.nodeName == "ASSIGNMENT-ELEMENT"){
        const POPUP = document.getElementById("popup");
		let target = e.target;
		
        POPUP.querySelector("h2").innerText = target.getAttribute("name");
        POPUP.querySelector("h3").innerText = target.getAttribute("course");
        POPUP.querySelector("p").innerText = target.getAttribute("type");
        
		POPUP.querySelector("h4").innerText = target.getAttribute("due")

        POPUP.classList.add("visible");

    }
});

document.getElementById("exams").addEventListener("click", async (e) => { // ifall man clickar på en nyhet
	console.log(e.target);
    if (e.target.nodeName == "ASSIGNMENT-ELEMENT"){
        const POPUP = document.getElementById("popup");
		let target = e.target;
		
        POPUP.querySelector("h2").innerText = target.getAttribute("name");
        POPUP.querySelector("h3").innerText = target.getAttribute("course");
        POPUP.querySelector("p").innerText = target.getAttribute("type");
        
		POPUP.querySelector("h4").innerText = target.getAttribute("due")

        POPUP.classList.add("visible");

    }
});

document.getElementById("popup").addEventListener("click", e => {
    if (e.target.id = "popup") {
        e.target.classList.remove("visible");
        return;
    }
});