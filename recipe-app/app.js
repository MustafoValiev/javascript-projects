let mealContainer = document.getElementById("meal");
let container = document.getElementById("list-slide-container")
let wrapper = document.getElementById("list-slide-wrapper")
let mainContainer = document.getElementById("container")
let favListElement = document.getElementsByTagName("aside")[0]
let listImgMeal = []
let listMeal = []
let count = 0
let slideContainerWidth = mainContainer.offsetWidth - 116
let favArrayID;

// localStorage.clear()

window.onload = () => {
    for (let i = 0; i < slideContainerWidth / 116; i++) {
        generateMeal(i)
    }
    favArrayID = showFavMealsID() ? showFavMealsID().split(",") : []
    console.log(favArrayID)
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
            span.innerHTML = "❤️"
            span.id = "fav"
            for (let j = 0; j < count; j++) {
                img.setAttribute("src", `${listImgMeal[i]}`)
                img.setAttribute("alt", "Meal")
                img.classList.add("image")
                div.append(span)
                div.append(img)
                container.append(div)
            }
            // if ()
        })
        .catch(e => {
            console.warn(e);
        });
}

window.onclick = e => {
    if (e.target.id === "fav") {
        let str = e.target.parentElement.id
        let favMeal = listMeal[str.charAt(str.length - 1)]
        if (!favArrayID.includes(favMeal.idMeal)) {
            favArrayID.push(favMeal.idMeal)
            saveFavMealsID()
            let favUl = document.getElementById("fav-ul")
            let li = document.createElement("LI")
            li.innerHTML = `
            <img src="${favMeal.strMealThumb}" alt="Meal Image" id="img-icon">
            <h3>${favMeal.strMeal}</h3>
            `
            favUl.appendChild(li)
        }
    }
    if (e.target.classList.contains("fa-bars")) {
        e.target.addEventListener('click', function () {
            let isOpen = favListElement.classList.contains('slide-in');
            favListElement.setAttribute('class', isOpen ? 'slide-out' : 'slide-in');
            e.target.parentElement.setAttribute('class', isOpen ? 'rotate-out' : 'rotate-in');
        });
    }
    let spanCross = document.getElementById("span-cross");

    if (e.target === spanCross) {
        mealContainer.innerHTML = ''
        mealContainer.style.opacity = "0"
        container.style.filter = "none"
        container.style.pointerEvents = "initial"
        container.style.userSelect = "initial"
    } else if (e.target.classList.contains("image")) {
        container.style.pointerEvents = "none"
        container.style.userSelect = "none"
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
    container.style.filter = "blur(3px)";
};

function saveFavMealsID() {
    localStorage.setItem("favMealsID", favArrayID)
}

function showFavMealsID() {
    return localStorage.getItem("favMealsID")
}
