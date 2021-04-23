import {getSchedule} from "./schedule.js";
import {Plan, openPlanCreator, createPlan, deletePlan} from "./plan.js";
import {getNews, getNewsByID} from "./news.js";
import {getUser} from "./user.js";
import {getAssignments, getAssignmentById} from "./assignments.js";
import {popup} from "./popup.js";
import {client} from "./utils.js";

var TIME = document.getElementById("time");

var updateTime = () => {
    let time = new Date;
    
    TIME.innerText = client.lengthen(time.getHours()) + ":" + client.lengthen(time.getMinutes()) + ":" + client.lengthen(time.getSeconds());
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

// stäng popup om man trycker escape
window.addEventListener("keydown", e => {
	if (e.key == "Escape") {
		if (document.getElementById("popup").classList.contains("visible")) {
			popup.close(document.getElementById("popup"))
		}
		if (document.getElementById("plan-popup").classList.contains("visible")) {
			popup.close(document.getElementById("plan-popup"))
		}
	}
})

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
        POPUP.querySelector("h4").innerText = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${client.generateReadableTime(date)}`

		popup.open(POPUP);
    }
});

var handleAssignmentClick = async (e) => {
	console.log(e.target);
    if (e.target.nodeName == "ASSIGNMENT-ELEMENT"){
		let assignment = await getAssignmentById(e.target.getAttribute("id"))
        const POPUP = document.getElementById("popup");
		let target = e.target;
		
        POPUP.querySelector("h2").innerText = target.getAttribute("name");
        POPUP.querySelector("h3").innerText = target.getAttribute("course");
        POPUP.querySelector("p").innerText = assignment.description;
        
		POPUP.querySelector("h4").innerText = target.getAttribute("due")

        popup.open(POPUP);
    }
}

document.getElementById("assignments").addEventListener("click", handleAssignmentClick);
document.getElementById("exams").addEventListener("click", handleAssignmentClick);


document.getElementById("popup").addEventListener("click", e => { // ifall man clickar på bakgrunden till den
    if (e.target.id == "popup") {
		popup.close(e.target);
    }
});


document.getElementById("plan-popup").addEventListener("click", e => {
    if (e.target.id == "plan-popup") {
        popup.close(e.target);
    }
});

document.getElementById("popupCloseButton").addEventListener("click", function() {
	popup.close(document.getElementById("popup"));
});

document.getElementById("planCloseButton").addEventListener("click", function() {
	popup.close(document.getElementById("plan-popup"));
});

document.getElementById("plan-input-submit-button").addEventListener("click", e => {
	const POPUP = document.getElementById("plan-popup")
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

	// console.log(title);
	// console.log(content);

	createPlan(title, content);

	popup.close(POPUP);
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