let mealContainer = document.getElementById("meal");
let container = document.getElementById("list-slide-container")
let wrapper = document.getElementById("list-slide")
let listImgMeal = []
let listMeal = []
let count = 0

window.onload = () => {
    for (let i = 0; i <5 ; i++) {
        fetch('https://www.themealdb.com/api/json/v1/1/random.php')
            .then(res => res.json())
            .then(res => {
                createListImgMeal(res.meals[0]);
                listMeal.push(res.meals[0])
                let div = document.createElement("div")
                let img = document.createElement("img")
                div.classList.add("meal-icon")
                div.id = `divList${count++}`
                for (let j = 0; j < count; j++) {
                    img.setAttribute("src", `${listImgMeal[i]}`)
                    img.setAttribute("alt", "Meal")
                    img.classList.add("image")
                    div.append(img)
                    container.append(div)
                }
            })
            .catch(e => {
                console.warn(e);
            });
    }
}

const createListImgMeal = meal => {
    listImgMeal.push(meal.strMealThumb)
}

console.log(wrapper)

wrapper.addEventListener("click", function (e) {
    let img;
    if (e.target.classList.contains("image")){
        img = e.target
        let str = img.parentElement.id
        createMeal(listMeal[str.charAt(str.length - 1)])
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
    	<div class="meal-wrapper">
    		<div class="info-div">
    			<img src="${meal.strMealThumb}" alt="Meal Image">
    			<div>
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
                    <h4>${meal.strMeal}</h4>
                    <p>${meal.strInstructions}</p>
                </div>
                 ${
        meal.strYoutube
            ? `
                        <div class="video-div">
                            <h4>Video Recipe</h4>
                                <div class="videoWrapper" style=" width: 320px">
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
    mealContainer.style.zIndex = "10"
};
