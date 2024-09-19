export const formatDateTime = (date) => {
	date = fixIosDateFormat(date)
	date = new Date(date)
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()
	return `${year}-${addZero(month)}-${addZero(day)} ${addZero(hour)}:${addZero(minute)}:${addZero(second)}`
}

export const formatDate = (date) => {
	date = fixIosDateFormat(date)
	date = new Date(date)
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	return `${year}-${addZero(month)}-${addZero(day)}`
}

export const formatTime = (date) => {
	date = fixIosDateFormat(date)
	date = new Date(date)
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()
	return `${addZero(hour)}:${addZero(minute)}:${addZero(second)}`
}

const addZero = (num) => {
	if (num < 10) {
		num = `0${num}`
	}
	return num
}

const dateTimeReg = /^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])( [0-5]?[0-9]:[0-5]?[0-9]:[0-5]?[0-9])?$/

const fixIosDateFormat = (value) => {
	if (typeof value === 'string' && dateTimeReg.test(value)) {
		value = value.replace(/-/g, '/')
	}
	return value
}