const quizData = [
    {
        question: "1. Which answer is true?",
        a: "The answer #4 is correct",
        b: "This answer is incorrect",
        c: "The answer above is incorrect",
        d: "The answer #2 is correct",
        correct: "c"
    }, {
        question: "2. What is the most used programming language in 2023?",
        a: "Java",
        b: "C++",
        c: "Python",
        d: "JavaScript",
        correct: "d"
    }, {
        question: "3. Who is the president of the USA?",
        a: "Donald Trump",
        b: "Joe Biden",
        c: "Barack Obama",
        d: "George W.Bush",
        correct: "b"
    }, {
        question: "4. What does HTML stand for?",
        a: "Hypertext Markup Language",
        b: "Cascading Style Sheet",
        c: "Jason Object Notation",
        d: "Application Programming Interface",
        correct: "a"
    }, {
        question: "5. What year was JavaScript launched?",
        a: "1996",
        b: "1997",
        c: "1998",
        d: "None of the above",
        correct: "d"
    }
]
let currentQuestion = 0;
let quizWrapper = document.getElementById("quiz-wrapper")
let quizWrapperQuestion = document.querySelector("#quiz-wrapper h2")
let button = document.getElementById("button")
let row = document.getElementsByTagName("input")
let answers = []

loadQuizQuestion();

console.log()

function loadQuizQuestion() {
    quizWrapperQuestion.innerText = quizData[currentQuestion].question
    for (let i = 0; i < 4; i++) {
        let currentLi = document.getElementById(`row${i + 1}`)
        currentLi.innerText = Object.values(quizData[currentQuestion])[1 + i]
    }
}

button.addEventListener("click", () => {
    let answered = false;
    for (let i = 0; i < 4; i++) {
        let row = document.getElementById(String.fromCharCode(97 + i))
        if (row.checked && (row.id === quizData[currentQuestion].correct))
            answers.push(1)
    }
    for (let i = 0; i < 4; i++) {
        let row = document.getElementById(String.fromCharCode(97 + i))
        if (row.checked) {
            row.checked = false
            answered = !answered
        }
    }
    if (currentQuestion === 5) {
        quizWrapper.innerHTML = ""

        return 0
    }
    if (answered) {
        currentQuestion++

        if (currentQuestion === 5) {
            quizWrapper.style.display = "flex"
            quizWrapper.style.flexDirection = "column-reverse"
            quizWrapper.innerHTML =
                `<button onclick = "location.reload()">
                    Reload
                </button>
                <div id="h1-wrapper" style="margin-bottom: 1.5rem">
                    <h1>Your Result: 
                        <span style="color: #ff0000">${answers.length.toString() + "/5"}</span>
                    </h1>
                </div>`

            return 0
        }
        loadQuizQuestion()
    } else {
        for (let i = 0; i < 4; i++) {
            let rows = document.querySelectorAll("label")
            rows.forEach(e => {
                e.classList.add("notAnswered")
                setTimeout(() => {
                    e.classList.remove("notAnswered")
                }, 500)
            })
        }
    }

})

