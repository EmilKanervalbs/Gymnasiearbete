var lengthen = (x) => {
    return x < 10 ? "0" + x : x;
};

var getWeekday = (x) => {
	let y = ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"];
	console.log(x.getDay());
	console.log(y[x.getDay()]);
	console.log(y[5]);
	return y[x.getDay()];
}

const client = {
	lengthen,
	getWeekday
}

export {client}