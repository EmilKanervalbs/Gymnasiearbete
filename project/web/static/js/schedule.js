import {client} from "./utils.js"

export class Schedule extends HTMLElement {
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
		TIME.innerText = `${Math.floor(start / 60)}.${client.lengthen(start % 60)}-${Math.floor(end / 60)}.${client.lengthen(end % 60)}`;

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
	}
}

export var getSchedule = async () => {
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

	let currentTime = currentDay.getHours() * 60 + currentDay.getMinutes(); // nuvarande tid i minuter från midnatt

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
	for (let i = 0; i < fullSchedule.length && i < 6; i++) { // for-loopen som visar upp schemat
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