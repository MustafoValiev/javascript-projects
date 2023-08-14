let mealContainer = document.getElementById("meal");
let container = document.getElementById("list-slide-container")
let wrapper = document.getElementById("list-slide-wrapper")
let mainContainer = document.getElementById("container")
let favListElement = document.getElementsByTagName("aside")[0]
let favUl = document.getElementById("fav-ul")
let favListElementH2 = document.querySelector(".fav-title h2")
let listImgMeal = []
let listMeal = []
let count = 0
let slideContainerWidth = mainContainer.offsetWidth - 132
let favArrayID;

// localStorage.clear()


window.onload = () => {
    for (let i = 0; i < slideContainerWidth / 132; i++) {
        generateMeal(i)
    }
    favArrayID = showFavMealsID() ? showFavMealsID().split(",") : []
}


function generateMeal(i) {
    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
        .then(res => res.json())
        .then(res => {
            createListImgMeal(res.meals[0]);
            listMeal.push(res.meals[0])
            let div = document.createElement("div")
            let img = document.createElement("img")
            let span = document.createElement("span")
            div.classList.add("meal-icon")
            div.id = `divList${count++}`
            span.innerHTML = "&#9829"; // empty -> &#9753;
            span.id = "fav"
            for (let j = 0; j < count; j++) {
                img.setAttribute("src", `${listImgMeal[i]}`)
                img.setAttribute("alt", "Meal")
                img.classList.add("image")
                div.append(span)
                div.append(img)
                container.append(div)
            }
        })
        .catch(e => {
            console.warn(e);
        });
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
    }
    if (el.classList.contains("fa-bars")) {
        el.addEventListener('click', function () {
            favListElement.setAttribute('class', isOpen ? 'slide-out' : 'slide-in');
            el.parentElement.setAttribute('class', isOpen ? 'rotate-out' : 'rotate-in');
        });
        if (isOpen) {
           generateFavList()
        } else {
            removeLi()
        }
    }
    let spanCross = document.getElementById("span-cross");
    if (el === spanCross || el.parentElement.classList.contains("rotate-out")) {
        mealContainer.innerHTML = ''
        mealContainer.style.opacity = "0"
        container.style.filter = "none"
        container.style.pointerEvents = "initial"
        container.style.userSelect = "initial"
    } else if (el.classList.contains("image") || (el.parentElement.classList.contains("rotate-in") && el.classList.contains("fa-bars"))) {
        container.style.pointerEvents = "none"
        container.style.userSelect = "none"
        container.style.filter = "blur(3px)";
    }
}

function generateFavList() {
    favArrayID.forEach((mealID) => {
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
            .then(res => res.json())
            .then(data => {
                setTimeout(addLi(data.meals[0]),1)
            })
            .catch(e => {
                console.warn(e);
            })
    })
}

function addLi(meal) {
    let li;
    li = document.createElement("LI")
    li.innerHTML = `
            <img src="${meal.strMealThumb}" alt="Meal Image" id="img-icon">
            <h3>${meal.strMeal}</h3>
            `
    favUl.append(li)
    if (favUl.children.length >= 3) {
        favListElementH2.classList.add("width-changer")
    } else {
        favListElementH2.classList.remove("width-changer")
    }
}

function removeLi() {
    while (favUl.firstChild) {
        favUl.removeChild(favUl.firstChild)
    }
}

window.onkeydown = e => {
    closeEvent(e)
}

function closeEvent(e) {
    if (e.key === "Escape") {
        mealContainer.innerHTML = ''
        mealContainer.style.opacity = "0"
        container.style.filter = "none"
        container.style.pointerEvents = "initial"
        container.style.userSelect = "initial"
    }
}

const createListImgMeal = meal => {
    listImgMeal.push(meal.strMealThumb)
}

wrapper.addEventListener("click", function (e) {
    let img;
    if (e.target.classList.contains("image")) {
        img = e.target
        let str = img.parentElement.id
        createMeal(listMeal[str.charAt(str.length - 1)])
        let youtubeDiv = document.getElementsByClassName("video-div")
        if (youtubeDiv.length === 0) {
            let descrp = document.querySelector(".description p")
            descrp.style.maxHeight = "24rem"
        }
    }
})


const createMeal = meal => {
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
            : ''
    }
    		</div>
    	</div>
    	
    `;
    mealContainer.innerHTML = newInnerHTML;
    mealContainer.style.opacity = "1"
};

function saveFavMealsID() {
    localStorage.setItem("favMealsID", favArrayID)
}

function showFavMealsID() {
    return localStorage.getItem("favMealsID")
}

