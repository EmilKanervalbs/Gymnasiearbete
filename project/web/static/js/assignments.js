import {client} from "./utils.js"

export var getAssignments = async () => {
    console.log("Requesting Assignments");
    let assignments = await fetch("/getassignments")
        .then((resp) => {
            console.log("Assignments recieved");

            return resp.json();
    }).then(data => {
		return data.assignments;
	})
	
	let newAssignments = [];
	for (let i = 0; i < assignments.length;) { // kör tills array är 0 length 
		let lowestTime = Number.MAX_SAFE_INTEGER;
		let lowestIndex = 0;
		for (let j = 0; j < assignments.length; j++) {
			if (assignments[j].time < lowestTime) {
				lowestTime = assignments[j].time;
				lowestIndex = j;
			}
		}
		assignments.splice(lowestIndex, 1).forEach(x => newAssignments.push(x));
	}


	newAssignments.forEach((x) => {
		let element = document.createElement("assignment-element");
		
		let date = new Date(x.time * 1000);
		let currentTime = new Date();

		let weekendDate = new Date(Math.floor((new Date().getTime()) / 86400000) * 86400000 + (7 - currentTime.getDay()) * 86400000 - 1).getTime();

		let dueDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

		element.setAttribute("name", x.name);
		element.setAttribute("course", x.course);
		element.setAttribute("type", x.type);
		element.setAttribute("id", x.id);

		let parentElement;


		switch(x.type) {
			case "exam":
				if (weekendDate >= date.getTime()) {
					parentElement = document.getElementsByClassName("assignment-wrapper")[2];
					dueDate = `${client.getWeekday(date)} ${date.getDate()}/${date.getMonth() + 1}`;
				}
				else {
					parentElement = document.getElementsByClassName("assignment-wrapper")[3];
				}
				break;
			default:
				if (weekendDate >= date.getTime()) {
					parentElement = document.getElementsByClassName("assignment-wrapper")[0];
					dueDate = `${client.getWeekday(date)} ${date.getDate()}/${date.getMonth() + 1}`;

				}
				else {
					parentElement = document.getElementsByClassName("assignment-wrapper")[1];
				}
		}

		element.setAttribute("due", dueDate);


		parentElement.append(element);


		// console.log(x);
	});

	window.customElements.define("assignment-element", Assignment)
};

export var getAssignmentById = async (id) => {
	return await fetch("/getassignments/" + id).then(r => {
		return r.json();
	})
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
	}
}