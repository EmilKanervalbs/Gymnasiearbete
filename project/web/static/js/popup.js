var open = (el, reason) => {
	if (typeof(reason) == "undefined") {
		document.getElementById("popup-result-row").innerText = "";
	}
	el.classList.add("animate-in");
	el.classList.add("visible");
	setTimeout(() => {
		el.classList.remove("animate-in");
	}, 500);
};

var close = (el) => {
	if (el.classList.contains("animate-in")) { // om den håller på att animera in
		el.classList.remove("visible");
		el.classList.remove("animate-in")
		return;
	}
	el.classList.add("animate-out");
	setTimeout(() => {
		el.classList.remove("visible");
		el.classList.remove("animate-out");
	}, 500);
};

const popup = {
	open,
	close
};

export {popup};