import {getSchedule} from "./schedule.js"
import {Plan, openPlanCreator, createPlan, deletePlan} from "./plan.js"
import {getNews, getNewsByID} from "./news.js"
import {getUser} from "./user.js";
import {getAssignments} from "./assignments.js"

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

getNews();

getUser();

getAssignments();

getSchedule();



window.customElements.define("plan-element", Plan);

document.getElementById("news").addEventListener("click", async (e) => { // ifall man clickar på en nyhet
	console.log(e.target);
    if (e.target.nodeName == "NEWS-ELEMENT"){
        const POPUP = document.getElementById("popup");
        let news = await getNewsByID(e.target.getAttribute("news-id")); // hämtar nyheten man clickat på

		// fyller i alla fält i popup:en
        POPUP.querySelector("h2").innerText = news.title;
        POPUP.querySelector("h3").innerText = "Av: " + news.sender;
        POPUP.querySelector("p").innerText = news.content;
        
        let date = new Date(news.startDate * 1000);
        POPUP.querySelector("h4").innerText = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${lengthen(date.getHours())}:${lengthen(date.getMinutes())}`


        POPUP.classList.add("visible");
    }
});

document.getElementById("assignments").addEventListener("click", async (e) => { // ifall man clickar på en nyhet
	console.log(e.target);
    if (e.target.nodeName == "ASSIGNMENT-ELEMENT"){
        const POPUP = document.getElementById("popup");
		let target = e.target;
		
		// sätter texten i den som den ska
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
    if (e.target.id == "popup") {
        e.target.classList.remove("visible");
    }
});

document.getElementById("plan-popup").addEventListener("click", e => {
    if (e.target.id == "plan-popup") {
        e.target.classList.remove("visible");
    }
});

document.getElementById("plan-input-submit-button").addEventListener("click", e => {
	let title = document.getElementById("plan-input-title").value;
	let content = document.getElementById("plan-input-content").value;

	let invalid = false;

	if (title == "") {
		document.getElementById("plan-input-title").classList.add("invalid-input");
		invalid = true;
	}

	if (content == "") {
		document.getElementById("plan-input-content").classList.add("invalid-input");
		invalid = true;
	}

	if (invalid) return;

	console.log(title);
	console.log(content);

	createPlan(title, content);

	document.getElementById("plan-popup").classList.remove("visible");
});


document.getElementById("open-create-plan-button").addEventListener("click", e => {
	openPlanCreator();
});

document.getElementById("plan-input-delete-button").addEventListener("click", (e) => {
	deletePlan();
});

const PLAN_INPUT_TITLE = document.getElementById("plan-input-title");
PLAN_INPUT_TITLE.addEventListener("keydown", (e) => {
	PLAN_INPUT_TITLE.classList.remove("invalid-input");

	const PLAN_INPUT_TITLE_CHAR_COUNTER = document.getElementById("plan-title-input-char-counter");

	setTimeout(() => {
		PLAN_INPUT_TITLE_CHAR_COUNTER.innerText = 20 - PLAN_INPUT_TITLE.value.length;
		if (PLAN_INPUT_TITLE.value.length == 20) {
			PLAN_INPUT_TITLE_CHAR_COUNTER.classList.add("red-text");
		}
		else {
			PLAN_INPUT_TITLE_CHAR_COUNTER.classList.remove("red-text");
		}
	}, 50);
});

const PLAN_INPUT_CONTENT = document.getElementById("plan-input-content");
PLAN_INPUT_CONTENT.addEventListener("keydown", (e) => {
	PLAN_INPUT_CONTENT.classList.remove("invalid-input");

	const PLAN_INPUT_CONTENT_CHAR_COUNTER = document.getElementById("plan-content-input-char-counter");

	setTimeout(() => {
		PLAN_INPUT_CONTENT_CHAR_COUNTER.innerText = 500 - PLAN_INPUT_CONTENT.value.length;
		if (PLAN_INPUT_CONTENT.value.length == 500) {
			PLAN_INPUT_CONTENT_CHAR_COUNTER.classList.add("red-text");
		}
		else {
			PLAN_INPUT_CONTENT_CHAR_COUNTER.classList.remove("red-text");
		}
	}, 50);
});