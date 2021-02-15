export class Plan extends HTMLElement {
	static get observedAttributes() {
        return ["title", "content"]
    }
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

        var title = this.getAttribute("title");
        var content = this.getAttribute("content");

        var TABLE = document.createElement("table");
        TABLE.className = "newstable";

        var TBODY = document.createElement("tbody");
		var TR = document.createElement("tr");
		
        var TITLE = document.createElement("th");
        TITLE.innerText = title;

        var CONTENT = document.createElement("td");
		CONTENT.innerText = content;
		
		console.log(title);
		console.log(content);
		console.log(this.getAttribute("content"));

        TR.append(TITLE);
        TR.append(CONTENT);

        TBODY.append(TR);
        TABLE.append(TBODY)

		shadowDOM.append(TABLE);   
			
	}
	
	attributeChangedCallback(name, oldValue, newValue) {
		console.log(name);
		switch(name) {
			case "title":
				this.shadowRoot.querySelector("table").querySelector("tbody").querySelector("tr").querySelector("th").innerText = newValue; 
				break;
			case "content":
				this.shadowRoot.querySelector("table").querySelector("tbody").querySelector("tr").querySelector("td").innerText = newValue; 
				break;
		}
	}
}	

var currentPlanRoot;

export var openPlanCreator = (el) => {
	if (el) {
		document.getElementById("plan-input-title").value = el.getAttribute("title"); 
		document.getElementById("plan-input-content").value = el.getAttribute("content");
		currentPlanRoot = el;
	}
	else {
		document.getElementById("plan-input-title").value = ""; // sätter inputs till default ifall el är null
		document.getElementById("plan-input-content").value = "";	
		currentPlanRoot = null;
	}

	if (document.getElementById("plan-input-title").value.length == 20) {
		document.getElementById("plan-title-input-char-counter").classList.add("red-text");
	}
	else {
		document.getElementById("plan-title-input-char-counter").classList.remove("red-text");
	}
	document.getElementById("plan-title-input-char-counter").innerText = 20 - document.getElementById("plan-input-title").value.length;

	if (document.getElementById("plan-input-content").value.length == 500) {
		document.getElementById("plan-content-input-char-counter").classList.add("red-text");
	}
	else {
		document.getElementById("plan-content-input-char-counter").classList.remove("red-text");
	}
	document.getElementById("plan-content-input-char-counter").innerText = 500 - document.getElementById("plan-input-content").value.length;
	
	document.getElementById("plan-popup").classList.add("visible");
}


export var createPlan = (title, content) => {
	if (currentPlanRoot) {
		currentPlanRoot.setAttribute("title", title)
		currentPlanRoot.setAttribute("content", content)
		return;
	} else {
		console.log("create paln")
	let el = document.createElement("plan-element");
	el.setAttribute("title", title)
	el.setAttribute("content", content)

	document.getElementById("plans").querySelector("div").append(el);

	el.addEventListener("click", () => {
		openPlanCreator(el);
	});
	}
}


export var deletePlan = () => {
	if (currentPlanRoot) { // ifall man har valt en, kör på, ifall man inte valt en kan man strunta i det.
		
		currentPlanRoot.remove();
		currentPlanRoot = null;
		
	}
	document.getElementById("plan-popup").classList.remove("visible");
}
