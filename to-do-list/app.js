const inputBox = document.getElementById("input-box")
const listContainer = document.getElementById("list-container")
const deleteAll = document.getElementById("delete-all")

window.onload = ()=> {
    inputBox.focus()
}

let pText
let spanCheck
let spanRemove
let spanEdit
let count = 0;
let deleted = false
let listID = 0;
let editList = []

listID = localStorage.getItem("ID")

function addTask() {
    if (inputBox.value === "") {
        inputBox.focus()
    } else {
        let li = document.createElement("li")
        spanCheck = document.createElement("span");
        spanRemove = document.createElement("span")
        spanEdit = document.createElement("span")
        pText = document.createElement("p")

        pText.innerHTML = inputBox.value
        spanCheck.innerHTML = "\u274E" // "\u2705" - checked
        spanRemove.innerHTML = "\u00d7"
        spanEdit.innerHTML = "<i class=\"fas fa-edit\"></i>"

        li.classList.add(`${count++}`)
        li.id = `${listID++}`
        spanCheck.id = ("spanCheck")
        pText.id = ("pText")
        spanRemove.classList.add("spanRemove")
        spanEdit.id = ("spanEdit")
        listContainer.insertBefore(li, listContainer.firstChild)
        pText.setAttribute("contentEditable", "false")
        li.appendChild(spanCheck)
        li.appendChild(pText)
        li.appendChild(spanEdit)
        li.appendChild(spanRemove)
        saveID();
    }
    inputBox.value = ""
    saveData();
}

localStorage.setItem("deleteStatus", deleted)


function deleteList() {
    deleteAll.addEventListener("click", () => {
        listContainer.innerHTML = ''
        deleted = true
        listID = 0;
        saveID();
        saveData()
    })
}


listContainer.addEventListener("click", function (e) {
    let currentRow;
    let currentSpan;
    let parText = e.target.parentElement.querySelector("#pText")
    if (e.target.id === "spanCheck" || (e.target.id === "pText")) {
        currentRow = e.target.parentElement.classList[0]
        currentSpan = e.target.parentElement.querySelector("#spanCheck")
        if (!parText.classList.contains("onEdit")) {
            e.target.parentElement.classList.toggle("checked")
            if (e.target.parentElement.classList.contains("checked")) {
                currentSpan.textContent = "\u2705" // "\u2705" - checked
                e.target.parentElement.querySelector("#spanEdit").setAttribute("contentEditable", "false")
            } else if (e.target.parentElement.classList.contains(currentRow)) {
                currentSpan.textContent = "\u274E"
            } else {
                return 0
            }
        }
        else{
            return 0
        }
        if (e.target.parentElement.classList.contains("checked")) {
            e.target.parentElement.querySelector("#spanEdit i").classList.add("toRed");
            parText.setAttribute("contentEditable", "false")
            parText.classList.remove("onEdit")
        } else {
            e.target.parentElement.querySelector("#spanEdit i").classList.remove("toRed");
        }
        saveData()
    }
    else if (e.target.classList.contains("spanRemove")) {
        e.target.parentElement.remove();
        saveData()
    }
    else if (e.target.classList.contains("fa-edit")) {
        let currentLi;
        let currentText;
        currentLi = e.target.parentElement.parentElement
        currentText = currentLi.querySelector("#pText")
        let tempID = editList[0]
        let tempLi = document.getElementById(tempID)
        let condition = currentText.getAttribute("contentEditable") === 'false'
        editList.push(currentLi.id)
        if(editList.length > 1){
            editList.splice(0,1)
            tempLi.querySelector("#pText").setAttribute("contentEditable", "false")
            tempLi.querySelector("#pText").classList.remove("onEdit")
            saveData()
        }
        if (condition) { // editing text
            if (currentLi.classList.contains("checked")) {
                currentText.setAttribute("contentEditable", "false")
                return
            }
            window.onkeydown = (event) => {
                if (event.key === "Enter") {
                    if(currentLi.querySelector("#pText").innerText === "") {
                        editList.pop()
                        currentLi.remove()
                        saveData()
                    }
                    inputBox.focus()
                    currentText.setAttribute("contentEditable", "false")
                    currentText.classList.remove("onEdit")
                    saveData()
                    return 0
                }
            }
            setTimeout(function () {
                let el = currentText
                let pos = 1
                let range = document.createRange();
                let sel = window.getSelection();
                range.setStart(el, pos);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }, 0);
            saveData()
            currentText.setAttribute("contentEditable", "true")
            currentText.classList.add("onEdit")
        } else {
            currentText.setAttribute("contentEditable", "false")
            currentText.classList.remove("onEdit")
            saveData()
        }
    }
}, false)

function saveData() {
    localStorage.setItem("deleteStatus", deleted)
    localStorage.setItem("data", listContainer.innerHTML);
}

function saveID() {
    localStorage.setItem("ID", listID)
}

function showData() {
    listContainer.innerHTML = localStorage.getItem("data")
}


inputBox.onkeydown = (event) => {
    if (event.key === "Enter") {
        addTask()
    }
}

window.onkeydown = (event) => {
    if (event.key === "Enter") {
        inputBox.focus()
    }
}

deleted = localStorage.getItem("deleteStatus")
if (deleted) {
    showData();
}
