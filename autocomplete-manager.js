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
        // console.clear()
        let val = autocomplete_fields[i].value;
        let val_no_tag = val.startsWith("#") ? val.split("").splice(1).join("") : val
        let suggestions_raw = []
        for (let j = 0; j < autocomplete.length; j++) {
            if (val[0] === "#" & !autocomplete[j].isTag || val[0] !== "#" & autocomplete[j].isTag) continue
            //console.log(`${autocomplete[j].isTag ? '#' : ''}${autocomplete[j].namespace}:${autocomplete[j].id}`)
            console.log(val + "   |   " + JSON.stringify(autocomplete[j]))
            if (val.search(":") >= 0) {
                // console.log("^^^ has namespace")

                let namespace = val.split(":")[0]
                namespace = namespace.startsWith("#") ? namespace.split("").splice(1).join("") : namespace
                if (autocomplete[j].namespace != namespace) continue
                if (autocomplete[j].id.startsWith(val.split(":")[1]) == false) continue //TODO: поиск в середине а не только в начале (search). сделай
            }
            else {
                // console.log("^^^ no namespace")
                // console.log(JSON.stringify(autocomplete[j]) + "   |   " + "id.search(" + val_no_tag + ") = " + autocomplete[j].id.includes(val_no_tag) + "   |   " + "namespace.search(" + val + ") = " + autocomplete[j].namespace.includes(val))
                //^^^ не везде val на val_no_tag заменен и search не заменен в строках на inncludes
                if (!autocomplete[j].id.includes(val_no_tag) && !autocomplete[j].namespace.includes(val_no_tag)) continue
            }

            suggestions_raw.push(autocomplete[j])



        }
        console.log(suggestions_raw)
        raw_autocompletes_to_html(suggestions_raw)
    });

}
function raw_autocompletes_to_html(autocomplete_suggestions_raw) {

    let existing_autocompletes = document.querySelectorAll(".autocomplete-suggestion");
    let autocomplete_suggestions_strings = []
    for (let i = 0; i < autocomplete_suggestions_raw.length; i++) {
        autocomplete_suggestions_strings.push((autocomplete_suggestions_raw[i].isTag ? "#" : "") + autocomplete_suggestions_raw[i].namespace + ":" + autocomplete_suggestions_raw[i].id)
    }
    // autocomplete_suggestions_strings = autocomplete_suggestions_raw.forEach(e => {
    //     console.log(e.isTag ? "#" : "" + e.namespace + ":" + e.id)
    //     return e.isTag ? "#" : "" + e.namespace + ":" + e.id
    // });
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
        let li = document.createElement("div");
        li.classList.add("autocomplete-suggestion");
        let iconcont = document.createElement("div");
        iconcont.classList.add("item-icon-container");
        let icon = document.createElement("img");
        icon.classList.add("item-icon");
        iconcont.appendChild(icon);
        li.appendChild(iconcont);
        let autocompleteSuggestionText = document.createElement("div");
        autocompleteSuggestionText.classList.add("autocomplete-suggestion-text");
        let ast_p = document.createElement("p");
        ast_p.innerText = autocomplete_suggestions_strings[i];
        autocompleteSuggestionText.appendChild(ast_p);
        li.appendChild(autocompleteSuggestionText);
        document.querySelector(".autocomplete-suggestions").appendChild(li);
        // li.appendChild(document.createElement("div")).classList.add("item-icon-container").appendChild(document.createElement("img")).classList.add("item-icon");
        // li.appendChild(document.createElement("div")).classList.add("autocomplete-suggestion-text").appendChild(document.createElement("p").innerText = autocomplete_suggestions_strings[i]);
        // document.querySelector(".autocomplete-suggestions").appendChild(li);


    }
}