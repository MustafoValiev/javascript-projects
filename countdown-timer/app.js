const days = document.getElementById("days")
const hours = document.getElementById("hours")
const minutes = document.getElementById("minutes")
const seconds = document.getElementById("seconds")
const eventWrapper = document.getElementById("event-wrapper")
let chosenEventDate = ""
let diff, calendar;


calendar = document.createElement("input")
calendar.setAttribute("type", "date")
calendar.id = "calendar"
if (localStorage.getItem("timeData") !== "") {
    calendar.value = localStorage.getItem("timeData")
    chosenEventDate = new Date(`${calendar.value}T00:00`)
}
eventWrapper.append(calendar)

calendar.addEventListener("input", () => {
    localStorage.setItem("timeData", calendar.value)
    let field = document.getElementById("calendar")
    let date = new Date(`${field.value}T00:00`);
    chosenEventDate = date
})

setInterval(() => {
    let str = calendar.value
    localStorage.setItem("timeData", str)
    if (calendar.value === "") {
        seconds.innerHTML = "0"
        minutes.innerHTML = "0"
        hours.innerHTML = "0"
        days.innerHTML = "0"
    } else {
        setInterval(countdown, 1000)
    }
}, 1)

function countdown() {
    const chosenDate = new Date(chosenEventDate)
    const currentDate = new Date()
    diff = Math.abs(chosenDate - currentDate) / 1000

    seconds.innerHTML = formatTime(`${Math.floor(diff) % 60}`)
    minutes.innerHTML = formatTime(`${Math.floor(diff / 60) % 60}`)
    hours.innerHTML = formatTime(`${Math.floor(diff / 3600) % 24}`)
    days.innerHTML = formatTime(`${Math.floor(diff / 3600 / 24)}`)
}

function formatTime(time) {
    return time < 10 ? `0${time}` : time
}
