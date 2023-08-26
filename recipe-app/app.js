let mealContainer = document.getElementById("meal");
let listSlideContainer = document.getElementById("list-slide-container")
let listSlideH2 = document.getElementById("list-slide-h2")
let mainContainer = document.getElementById("container")
let favListElement = document.getElementsByTagName("aside")[0]
let favUl = document.getElementById("fav-ul")
let favListElementH2 = document.querySelector(".fav-title h2")
let refreshButton = document.getElementById("refresh-button")
let searchButton = document.getElementById("search")
let searchText = document.getElementById("search-text")
let screenWidth = document.getElementById("wrapper").parentElement.offsetWidth
let listMeal = []
let slideContainerWidth = mainContainer.offsetWidth * 0.8
let favArrayID;
let isOpen;
let bool = false


// localStorage.clear()

window.onload = () => {
    favArrayID = showFavMealsID() ? showFavMealsID().split(",") : []
    generateMeal()
    searchButton.children[0].style.lineHeight = "initial"
}

window.onclick = e => {
    isOpen = favListElement.classList.contains('slide-in');
    let el = e.target
    if (el.id === "fav") {
        let str = e.target.parentElement.id
        let favMeal = listMeal[str.charAt(str.length - 1)]
        if (!favArrayID.includes(favMeal.idMeal)) {
            favArrayID.push(favMeal.idMeal)
            saveFavMealsID()
        }
        if (el.classList.contains("not-faved")) {
            el.classList.remove("not-faved")
            el.innerHTML = "&#9829" // empty -> &#9825 ♡; full -> &#9829 ♥
        } else {
            el.classList.add("not-faved")
            el.innerHTML = "&#9825"
            let index = document.getElementById(el.parentElement.children[1].id).id
            let position = favArrayID.indexOf(favArrayID.find((element) => element === index))
            favArrayID.splice(position, 1)

        }
    }
    if (el.classList.contains("fa-bars")) {
        let favLength = favArrayID.length
        if (isOpen) {
            let urls = []
            favArrayID.forEach((mealID) => {
                urls.push(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
            })
            Promise.all(urls.map(u => fetch(u))).then(responses =>
                Promise.all(responses.map(res => res.json()))
            ).then(data => {
                data.forEach((meal) => {
                    if (favLength < favUl.children.length) {
                        return 0
                    }
                    addLi(meal.meals[0])
                })
            }).catch(e => {
                console.warn(e);
            })
            changeWidth()
        } else {
            removeUl()
        }
        el.addEventListener('click', function () {
            favListElement.setAttribute('class', isOpen ? 'slide-out' : 'slide-in');
            el.parentElement.setAttribute('class', isOpen ? 'rotate-out' : 'rotate-in');
        });
    }
    let spanCross = document.getElementById("span-cross");
    if (el === spanCross) {
        closeMeal()
        if (isOpen) {
            unBlurFavList()
            return 0
        }
        unBlurSlideList()
    }
    if (el.classList.contains("image") || (el.parentElement.classList.contains("rotate-in" || "") || isOpen)) {
        blurSlideList()
    }
    if (isOpen) {
        if (el.classList.contains("img-icon")) {
            blurFavList()
        }
    }
    if ((el.parentElement.classList.contains("rotate-out") && !isOpen)) {
        unBlurSlideList()
    }
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
    let liCross = document.querySelectorAll("#ul-span-cross")
    liCross.forEach((element) => {
        if (el === element) {
            el.parentNode.parentNode.removeChild(document.getElementById(element.parentElement.id))
            let imageID = element.parentElement.firstElementChild.firstElementChild.firstElementChild.id
            let position = favArrayID.indexOf(favArrayID.find((element) => element === imageID))
            favArrayID.splice(position, 1)
            let imageMealList = document.querySelectorAll(`#list-slide-container .meal-icon`)
            imageMealList.forEach((elem) => {
                let imageMeal = elem.children[1].id
                if (imageID === imageMeal) {
                    elem.children[0].innerHTML = "&#9825"
                    elem.children[0].classList.add("not-faved")
                }
            })
            changeWidth()
            saveFavMealsID()
        }
    })
    if (el === refreshButton) {
        listMeal = []
        while (listSlideContainer.firstChild) {
            listSlideContainer.firstChild.remove()
        }
        generateMeal()
    }
    if (el === searchButton.children[0]) {
        screenWidth = document.getElementById("wrapper").parentElement.offsetWidth
        if (bool) {
            if (searchText.value) {
                searchInput()
            }
            else {
                searchButton.style.marginLeft = "0"
                searchButton.style.gap = "0"
                searchButton.style.padding = "0"
                closeSearchText()
            }
            bool = !bool
        } else {
            if (screenWidth <= 440) {
                searchButton.style.marginLeft = "-5.1rem"
            } else if (screenWidth <= 590) {
                searchButton.style.marginLeft = "-7.1rem"
            } else if (screenWidth <= 710) {
                searchButton.style.marginLeft = "-7.1rem"
            } else if (screenWidth <= 1156) {
                searchButton.style.marginLeft = "-8.1rem"
            } else {
                searchButton.style.marginLeft = "-9.1rem"
            }
            searchButton.style.gap = "0.6rem"
            searchButton.style.padding = "0.5rem 0 0.5rem 0.5rem"
            showSearchText()
            searchText.focus()
            bool = !bool
        }
    } else {
        if (el === searchText || searchText.value   ) {
            return 0
        }
        searchButton.style.marginLeft = "0"
        closeSearchText()
        bool = false
    }
}

function searchInput() {
    if (searchText.value) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchText.value}`)
            .then(res => res.json())
            .then(data => {
                if (data.meals === null) {
                    alert(`Meal "${searchText.value}" not found`)
                } else createMeal(data.meals[0])
            })
            .catch(e => {
                console.warn(e)
            })
    }
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
            span.id = "fav"
            span.classList.add("not-faved")
            img.setAttribute("src", `${meal.meals[0].strMealThumb}`)
            img.setAttribute("alt", 'Meal')
            img.id = meal.meals[0].idMeal
            img.classList.add("image")
            div.append(span)
            div.append(img)
            listSlideContainer.append(div)
            favArrayID.forEach((elem) => {
                if (elem === img.id) {
                    span.classList.remove("not-faved")
                    setTimeout(favIconAni(`${span.parentElement.id.charAt(span.parentElement.id.length - 1)}`), 150)
                }
            })
            if (span.classList.contains("not-faved")) {
                span.setAttribute("onclick", `favIconAni(${span.parentElement.id.charAt(span.parentElement.id.length - 1)})`)
            }
        })
    }).catch(e => {
        console.warn(e);
    });
}

let count = 0;

function addLi(meal) {
    let li;
    li = document.createElement("LI")
    li.id = `${count++}`
    li.innerHTML = `
            <div>
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
            </div>
            <span id="ul-span-cross">✕</span>
            `
    favUl.append(li)
    changeWidth()
}

function changeWidth() {
    if (favUl.children.length > 3) {
        favListElementH2.classList.add("width-changer")
    } else {
        favListElementH2.classList.remove("width-changer")
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
    			<div id="ingredients">
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
    if (screenWidth <= 1156) {
        if (!youtubeDiv) {
            description.style.maxHeight = "27rem"
        }
    }
    if (screenWidth <= 710) {
        if (!youtubeDiv) {
            description.style.maxHeight = "23rem"
        }
    }
    if (screenWidth <= 440) {
        if (!youtubeDiv) {
            description.style.maxHeight = "21rem"
        }
    }
    document.getElementById("menu").style.pointerEvents = "none"
    document.getElementById("menu").style.userSelect = "none"
}

window.onkeydown = e => {
    closeEvent(e)
    if ((e.key === "Enter") && (window.getComputedStyle(searchText).getPropertyValue("opacity") === "1")) {
        searchInput()
    }
}

function showSearchText() {
    searchText.classList.add("search-text-open")
}

function closeSearchText() {
    searchText.classList.remove("search-text-open")
}

function closeEvent(e) {
    if (e.key === "Escape") {
        closeMeal()
        if (isOpen) {
            unBlurFavList()
            return 0
        }
        unBlurSlideList()
    }
}

function closeMeal() {
    mealContainer.innerHTML = ''
    mealContainer.style.opacity = "0"
    document.getElementById("menu").style.pointerEvents = "initial"
    document.getElementById("menu").style.userSelect = "initial"
}

function blurSlideList() {
    listSlideContainer.style.pointerEvents = "none"
    listSlideContainer.style.userSelect = "none"
    listSlideContainer.style.filter = "blur(3px)"

    listSlideH2.style.pointerEvents = "none"
    listSlideH2.style.userSelect = "none"
    listSlideH2.style.filter = "blur(3px)"
}

function unBlurSlideList() {
    listSlideContainer.style.pointerEvents = "initial"
    listSlideContainer.style.userSelect = "initial"
    listSlideContainer.style.filter = "none"

    listSlideH2.style.pointerEvents = "initial"
    listSlideH2.style.userSelect = "initial"
    listSlideH2.style.filter = "none"
}

function blurFavList() {
    favListElement.style.pointerEvents = "none"
    favListElement.style.userSelect = "none"
    favListElement.style.filter = "blur(3px)"
}

function unBlurFavList() {
    favListElement.style.pointerEvents = "initial"
    favListElement.style.userSelect = "initial"
    favListElement.style.filter = "none"
}

function removeUl() {
    while (favUl.firstChild) {
        favUl.removeChild(favUl.firstChild)
    }
}


function saveFavMealsID() {
    localStorage.setItem("favMealsID", favArrayID)
}

function showFavMealsID() {
    return localStorage.getItem("favMealsID")
}

function favIconAni(id) {
    let button = document.querySelector(`#divList${id} #fav`)
    button.classList.add("fav-icon-ani-class")
    setTimeout(() => {
        button.classList.remove("fav-icon-ani-class")
    }, 500)
    button.innerHTML = "&#9829" // empty -> &#9825; full -> &#9829
}
