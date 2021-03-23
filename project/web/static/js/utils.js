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

var calculateTime = (minuteTime) => {
	return `${Math.floor(minuteTime / 60)}.${client.lengthen(minuteTime % 60)}`;
} 

const client = {
	lengthen,
	getWeekday,
	calculateTime
}

export {client}