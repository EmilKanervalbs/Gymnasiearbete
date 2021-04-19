var lengthen = (x) => {
    return x < 10 ? "0" + x : x;
};

var getWeekday = (x) => {
	let y = ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"];
	return y[x.getDay()];
}

var calculateTime = (minuteTime) => {
	return `${Math.floor(minuteTime / 60)}.${client.lengthen(minuteTime % 60)}`;
} 

var generateReadableTime = (time) => {
	if (typeof(time) == "object") {
		return `${lengthen(time.getHours())}:${lengthen(time.getMinutes())}`;
	} else {
		return `${Math.floor(time / 60)}:${lengthen(time % 60)}`
	}
}

const client = {
	lengthen,
	getWeekday,
	calculateTime,
	generateReadableTime
}

export {client}