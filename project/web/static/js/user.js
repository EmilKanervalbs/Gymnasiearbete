import {popup} from "./popup.js"

export var getUser = async () => { // dels tar den user och dels tar den resultaten
	console.log("Requesting User");
    let user = await fetch("/getuser")
        .then((resp) => {
            console.log("User recieved");

            return resp.json();
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
		// console.log(new Date().getTime());
		// console.log((result.time + 2678400) * 1000);

		// HÄÄÄÄÄÄÄÄÄR fixa att den inte visar för gamla resultat
		if (new Date().getTime() > (result.time + 2678400) * 1000) {
			return;
		}

		let el = document.createElement("results-element"); // name, course, type, due
		el.setAttribute("name", result.name);
		el.setAttribute("course", result.course);
		el.setAttribute("type", result.type);
		el.setAttribute("id", result.id);

		let date = new Date(result.time * 1000);
		let dueDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
		el.setAttribute("due", dueDate);

		el.addEventListener("click", async e => {
			let result = await getResultByID(e.target.getAttribute("id"))
			let POPUP = document.getElementById("popup");
			POPUP.querySelector("h2").innerText = result.name;
        	POPUP.querySelector("h3").innerText = result.course;
			POPUP.querySelector("p").innerText = result.comment;
			
			popup.open(POPUP);
		});

		resultsDIV.append(el);
	});

	// console.log(user.results);

	window.customElements.define("results-element", Results);
}

var getResultByID = async (id) => {
	return await fetch("/getesults/" + id).then((resp) => {
		return resp.json();
	});
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