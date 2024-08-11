let recipe_types = document.querySelectorAll(".recipe-type");
for (let i = 0; i < recipe_types.length; i++) {
    recipe_types[i].addEventListener("click", () => {
        for (let j = 0; j < recipe_types.length; j++) {
            recipe_types[j].classList.remove("selected");
            document.getElementById(recipe_types[j].id + "-editor").classList.add("hidden");
        }
        recipe_types[i].classList.add("selected");
        document.getElementById(recipe_types[j].id + "-editor").classList.remove("hidden");
    });
}

