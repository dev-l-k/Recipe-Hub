const API = "https://www.themealdb.com/api/json/v1/1/";
async function searchRecipes() {
    const name = document.getElementById('searchInput').value.trim();
    if (!name) return;
    showMessage("Searching...");
    try{
        const response= await fetch(API+"search.php?s="+encodeURIComponent(name));
        const data = await response.json();
        showRecipes(data.meals);

    }catch{
        showMessage("Something went wrong...");
    }
    
}
async function loadCategory(category) {
    showMessage("Loading recipes...");
    try{
        const response = await fetch(API+"filter.php?c="+encodeURIComponent(category));
        const data = await response.json();
        showRecipes(data.meals);
    }catch{
        showMessage("Something went Wrong");
    }
}
async function randomRecipe() {
    showMessage("Finding Recipe...");
    try{
        const response = await fetch(API+"random.php");
        const data = await response.json();
        openRecipe(data.meals[0].idMeal);
    }catch{
        showMessage("Smething went wrong");
    }
}
async function openRecipe(id) {
    try{
        const response = await fetch(API+"lookup.php?i="+id);
        const data = await response.json();
        const meal = data.meals[0];
        let ingredients= "";
        for(let i = 1;i<=20;i++){
            const ingredient = meal["strIngredient"+i];
            const amount = meal["strMeasure"+i];
            if (ingredient&&ingredient.trim()){
                ingredients+=`<li>${amount} ${ingredient}</li>`;
            }
        }
        document.getElementById("details").innerHTML = `
        <img src="${meal.strMealThumb}">
        <h2>${meal.strMeal}</h2><p>${meal.strCategory} × ${meal.strArea}</p>
        <h3>Ingredients</h3>
        <ul>${ingredients}</ul>
        <h3>Instructions</h3>
        <p>${meal.strInstructions}</p>
        `;
        document.getElementById("item").style.display = "block";
    }catch{
        alert("Could not load recipe..");

    }
}
    function closeRecipe(){
        document.getElementById("item").style.display="none";
    }
    function showRecipes(meals){
        const container = document.getElementById("recipes");
        if(!meals){
            showMessage("No recipe found");
            container.innerHTML = "";
            return;

        }
        document.getElementById("message").style.display = "none";
        container.innerHTML = meals.map(meal => `
            <div class="card">
            <img src="${meal.strMealThumb}">
            <div class = "card-content">
            <h3>${meal.strMeal}</h3>
            <button onclick="openRecipe('${meal.idMeal}')">
            View Recipe
            </button>
            </div>
            </div>
            `).join("");

    
}
function showMessage(text){
    const message = document.getElementById("message");
    message.textContent = text;
    message.style.display = "block";
    document.getElementById("recipes").innerHTML="";
}
loadCategory("Chicken");