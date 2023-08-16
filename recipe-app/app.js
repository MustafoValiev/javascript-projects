let mealContainer = document.getElementById("meal");
let listSlideContainer = document.getElementById("list-slide-container")
let listSlideH2 = document.getElementById("list-slide-h2")
let headerH1 = document.querySelector(".header h1")
let mainContainer = document.getElementById("container")
let favListElement = document.getElementsByTagName("aside")[0]
let favUl = document.getElementById("fav-ul")
let favListElementH2 = document.querySelector(".fav-title h2")
let listMeal = []
let slideContainerWidth = mainContainer.offsetWidth - 132
let favArrayID;
let favButton;

// localStorage.clear()

window.onload = () => {
    generateMeal()
    favArrayID = showFavMealsID() ? showFavMealsID().split(",") : []
    console.log(favArrayID)
}

window.onclick = e => {
    let isOpen = favListElement.classList.contains('slide-in');
    let el = e.target
    if (el.id === "fav") {
        let str = e.target.parentElement.id
        let favMeal = listMeal[str.charAt(str.length - 1)]
        if (!favArrayID.includes(favMeal.idMeal)) {
            favArrayID.push(favMeal.idMeal)
            saveFavMealsID()
        }
        if (favButton) {
            el.innerHTML = "&#9825" // empty -> &#9825; full -> &#9829
            favButton = false
        } else {
            el.innerHTML = "&#9829"
            favButton = true
        }
    }
    if (el.classList.contains("fa-bars")) {
        if (isOpen) {
            let urls = []
            favArrayID.forEach((mealID) => {
                urls.push(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
            })
            Promise.all(urls.map(u => fetch(u))).then(responses =>
                Promise.all(responses.map(res => res.json()))
            ).then(data => {
                data.forEach((meal) => {
                    if (favArrayID.length <= favUl.children.length) {
                        return 0
                    }
                    addLi(meal.meals[0])
                })
            }).catch(e => {
                console.warn(e);
            })
        } else {
            removeUl()
        }
        el.addEventListener('click', function () {
            favListElement.setAttribute('class', isOpen ? 'slide-out' : 'slide-in');
            el.parentElement.setAttribute('class', isOpen ? 'rotate-out' : 'rotate-in');
            isOpen ? headerH1.classList.remove("change-position-h1") : headerH1.classList.add("change-position-h1");
        });
    }
    let spanCross = document.getElementById("span-cross");
    if (el === spanCross) {
        closeMeal()
    }
    // console.log(isOpen)
    // if (isOpen) {
    //     makeUnClickable(listSlideContainer)
    //     makeUnClickable(listSlideH2)
    // } else if (el.classList.contains("image") || el.classList.contains("img-icon")) {
    //     makeUnClickable(listSlideContainer)
    //     makeUnClickable(listSlideH2)
    //     makeUnClickable(favListElement)
    // } else if (!isOpen && (el === spanCross)) {
    //     toDefault()
    // } else if (isOpen && (el === spanCross)) {
    //     toDefault()
    //     makeUnClickable(listSlideContainer)
    //     makeUnClickable(listSlideH2)
    // }
    // -------------------------------
    // if (el === spanCross || el.parentElement.classList.contains("rotate-out") || el.parentElement.classList.contains("rotate-in")) {
    //     if (el.parentElement.classList.contains("rotate-in")){
    //         makeUnClickable(listSlideContainer)
    //         makeUnClickable(listSlideH2)
    //     }
    //     else if (el === spanCross && isOpen){
    //         makeUnClickable(listSlideContainer)
    //         makeUnClickable(listSlideH2)
    //     }
    //     else {
    //         toDefault();
    //     }
    // } else if (el.classList.contains("image") || (isOpen && el.classList.contains("fa-bars"))) {
    //     makeUnClickable(listSlideContainer)
    //     makeUnClickable(listSlideH2)
    //     makeUnClickable(favListElement)
    // } else if (el.classList.contains("img-icon")) {
    //     let background = document.querySelectorAll("#list-slide-h2, #list-slide-container, aside")
    //     console.log(background)
    //     background.forEach((el) => {
    //         makeUnClickable(el)
    //     })
    // }
    //
    let img;
    if (el.classList.contains("image")) {
        img = el
        let str = img.parentElement.id
        createMeal(listMeal[str.charAt(str.length - 1)])
    }
    if (el.classList.contains("img-icon")) {
        let id = el.id
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
            .then(res => res.json())
            .then(data => {
                createMeal(data.meals[0])
            })
            .catch(e => {
                console.warn(e)
            })
    }
}

window.onkeydown = e => {
    closeEvent(e)
}

function makeUnClickable(el) {
    el.style.pointerEvents = "none"
    el.style.userSelect = "none"
    el.style.filter = "blur(3px)"
}

function closeEvent(e) {
    if (e.key === "Escape") {
        toDefault(e)
    }
}

function closeMeal() {
    mealContainer.innerHTML = ''
    mealContainer.style.opacity = "0"
    document.getElementById("menu").style.pointerEvents = "initial"
    document.getElementById("menu").style.userSelect = "initial"
}

function toDefault(e) {
    listSlideContainer.style.filter = "none"
    listSlideContainer.style.pointerEvents = "initial"
    listSlideContainer.style.userSelect = "initial"
    listSlideH2.style.filter = "none"
    listSlideH2.style.pointerEvents = "initial"
    listSlideH2.style.userSelect = "initial"

    favListElement.style.filter = "none"
    favListElement.style.pointerEvents = "initial"
    favListElement.style.userSelect = "initial"
}

function generateMeal() {
    let count = 0
    let urls = []
    for (let i = 0; i < slideContainerWidth / 132; i++) {
        urls.push('https://www.themealdb.com/api/json/v1/1/random.php')
    }
    Promise.all(urls.map(u => fetch(u))).then(responses =>
        Promise.all(responses.map(res => res.json()))
    ).then(data => {
        data.forEach((meal) => {
            listMeal.push(meal.meals[0])
            let img = document.createElement("img")
            let span = document.createElement("span")
            let div = document.createElement("div")
            div.classList.add("meal-icon")
            div.id = `divList${count++}`
            span.innerHTML = "&#9825"; // empty -> &#9825; full -> &#9829
            span.id = "fav" //
            img.setAttribute("src", `${meal.meals[0].strMealThumb}`)
            img.setAttribute("alt", 'Meal')
            img.classList.add("image")
            div.append(span)
            div.append(img)
            listSlideContainer.append(div)
            span.setAttribute("onclick", `favIconAni(${span.parentElement.id.charAt(span.parentElement.id.length - 1)})`)
        })
    }).catch(e => {
        console.warn(e);
    });
}

function addLi(meal) {
    let li;
    li = document.createElement("LI")
    li.innerHTML = `
            <div>
                <img src="${meal.strMealThumb}" alt="Meal Image" id="${meal.idMeal}" class="img-icon ">
            </div>
            <div class="fav-li">
                <h3 id="title-h3">${meal.strMeal}</h3>
                ${
        meal.strCategory
            ? `<p><strong>Category:</strong> ${meal.strCategory}</p>`
            : ''
    }
    			${
        meal.strArea ?
            `<p><strong>Area:</strong> ${meal.strArea}</p>`
            : ''
    }
    			${
        meal.strTags
            ? `<p><strong>Tags:</strong> ${meal.strTags.split(',').join(', ')}</p>`
            : ''
    }
            </div>
            `
    favUl.append(li)
    if (favUl.children.length >= 3) {
        favListElementH2.classList.add("width-changer")
    } else {
        favListElementH2.classList.remove("width-changer")
    }
}

function removeUl() {
    while (favUl.firstChild) {
        favUl.removeChild(favUl.firstChild)
    }
}

function createMeal(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(
                `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
            );
        } else {
            break;
        }
    }

    const newInnerHTML = `
        <span id="span-cross">✕</span>
    	<div class="meal-wrapper">
    		<div class="info-div">
    			<img src="${meal.strMealThumb}" alt="Meal Image" id="img-icon">
    			<div id="brief-desc">
    			${
        meal.strCategory
            ? `<p><strong>Category:</strong> ${meal.strCategory}</p>`
            : ''
    }
    			${
        meal.strArea ?
            `<p><strong>Area:</strong> ${meal.strArea}</p>`
            : ''}
    			${
        meal.strTags
            ? `<p><strong>Tags:</strong> ${meal.strTags.split(',').join(', ')}</p>`
            : ''
    }
    			</div>
    			<div>
                    <h4>Ingredients:</h4>
                    <ul>
                        ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                    </ul>
    			</div>
    		</div>
    		<div class="meal-description">
                <div class="description">
                    <h2>${meal.strMeal}</h2>
                    <p>${meal.strInstructions}</p>
                </div>
                 ${
        meal.strYoutube
            ? `
                <div class="video-div">
                    <h4>Video Recipe</h4>
                    <div class="videoWrapper" style=" width: 12rem">
                        <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${meal.strYoutube.slice(-11)}"></iframe>
                    </div>
                </div>
            `
            : `
                <div class="video-div">
                    <h4>No Video Found</h4>
                </div>
            `
    }
    		</div>
    	</div>
    	
    `;
    mealContainer.innerHTML = newInnerHTML;
    mealContainer.style.opacity = "1"
    mealContainer.style.opacity = "1"

    let youtubeDiv = document.querySelector(".video-div div")
    let description = document.querySelector(".description p")
    if (!youtubeDiv) {
        description.style.maxHeight = "20rem"
    }
    document.getElementById("menu").style.pointerEvents = "none"
    document.getElementById("menu").style.userSelect = "none"
}

function saveFavMealsID() {
    localStorage.setItem("favMealsID", favArrayID)
}

function showFavMealsID() {
    return localStorage.getItem("favMealsID")
}

function favIconAni(id) {
    document.querySelector(`#divList${id} #fav`).classList.add("fav-icon-ani-class")
    setTimeout(() => {
        document.querySelector(`#divList${id} #fav`).classList.remove("fav-icon-ani-class")
    }, 150)
}