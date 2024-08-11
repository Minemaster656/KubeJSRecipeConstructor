let selected_autocomplete_field = null
//! {"isTag":boolean, "namespace":string, "id":string}
let autocomplete = [
    { "isTag": true, "namespace": "minecraft", "id": "moss_replacable" },
    { "isTag": true, "namespace": "forge", "id": "ores" },
    { "isTag": false, "namespace": "minecraft", "id": "air" },
    { "isTag": false, "namespace": "minecraft", "id": "lava_bucket" },
    { "isTag": false, "namespace": "minecraft", "id": "water_bucket" },
    { "isTag": false, "namespace": "create", "id": "zink_ingot" },
    { "isTag": false, "namespace": "create", "id": "andesite_alloy" }
]

let autocomplete_fields = document.querySelectorAll(".autocomplete");
for (let i = 0; i < autocomplete_fields.length; i++) {
    autocomplete_fields[i].addEventListener("focus", () => {
        selected_autocomplete_field = autocomplete_fields[i];
        for (let j = 0; j < autocomplete_fields.length; j++) {
            autocomplete_fields[j].classList.remove("last-selected-autocomplete");
        }
        selected_autocomplete_field.classList.add("last-selected-autocomplete");
    });
    autocomplete_fields[i].addEventListener("input", () => {
        console.clear()
        let val = autocomplete_fields[i].value;
        let suggestions_raw = []
        for (let j = 0; j < autocomplete.length; j++) {
            if (val[0] === "#" & !autocomplete[j].isTag || val[0] !== "#" & autocomplete[j].isTag) continue
            //console.log(`${autocomplete[j].isTag ? '#' : ''}${autocomplete[j].namespace}:${autocomplete[j].id}`)

            if (val.search(":") !== -1) {
                console.log(autocomplete[j])
                let namespace = val.split(":")[0]
                if (autocomplete[j].namespace != namespace) continue
                if (autocomplete[j].id.startsWith(val.split(":")[1]) == false) continue //TODO: поиск в середине а не только в начале (search). сделай
            }
            else {
                if (autocomplete[j].id.search(val) === -1 && autocomplete[j].namespace.search(val) !== -1) continue 
            }
            console.log(autocomplete[j])
            suggestions_raw.push(autocomplete[j])



        }
        console.log(suggestions_raw)
        raw_autocompletes_to_html(suggestions_raw)
    });

}
function raw_autocompletes_to_html(autocomplete_suggestions_raw) {
    
    let existing_autocompletes = document.querySelectorAll(".autocomplete-suggestion");
    let autocomplete_suggestions_strings = []
    autocomplete_suggestions_strings = autocomplete_suggestions_raw.forEach(e => {
        console.log(e.isTag ? "#" : "" + e.namespace + ":" + e.id)
        return e.isTag ? "#" : "" + e.namespace + ":" + e.id
    });
    console.log(autocomplete_suggestions_strings)
    let remove_existing = []
    let lazy_new = []
    for (let i = 0; i < existing_autocompletes.length; i++) {
        let autocomplete_text = existing_autocompletes[i].querySelector(".autocomplete-suggestion-text").innerText;
        let found_lazy = false
        for (let j = 0; j < autocomplete_suggestions_strings.length; j++) {
            if (autocomplete_text === autocomplete_suggestions_strings[j]) {
                lazy_new.push(autocomplete_suggestions_strings[j])
                found_lazy = true
                break
            }
        }
        if (!found_lazy) {
            remove_existing.push(existing_autocompletes[i])
        }

    }

    for (let i = 0; i < remove_existing.length; i++) {
        remove_existing[i].remove()
    }

    for (let i = 0; i < autocomplete_suggestions_strings.length; i++) {
        if (lazy_new.includes(autocomplete_suggestions_strings[i])) continue
        let li = document.createElement("li");
        li.classList.add("autocomplete-suggestion");
        li.appendChild(document.createElement("div")).classList.add("item-icon-container").appendChild(document.createElement("img")).classList.add("item-icon");
        li.appendChild(document.createElement("div")).classList.add("autocomplete-suggestion-text").appendChild(document.createElement("p").innerText = autocomplete_suggestions_strings[i]);
        document.querySelector(".autocomplete-suggestions").appendChild(li);


    }
}