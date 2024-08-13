let selected_autocomplete_field = null
let isLoading = false
// id:base64img
let autocomplete = {
    // { "isTag": true, "namespace": "minecraft", "id": "moss_replacable" },
    // { "isTag": true, "namespace": "forge", "id": "ores" },
    // { "isTag": false, "namespace": "minecraft", "id": "air" },
    // { "isTag": false, "namespace": "minecraft", "id": "lava_bucket" },
    // { "isTag": false, "namespace": "minecraft", "id": "water_bucket" },
    // { "isTag": false, "namespace": "create", "id": "zink_ingot" },
    // { "isTag": false, "namespace": "create", "id": "andesite_alloy" }
}
let namespaces = []


let autocomplete_fields = document.querySelectorAll(".autocomplete");

let lastCallTime = 0;
let isProcessing = false;
let currentItemsTab = ""



const raw_autocompletes_to_html = async (autocomplete_suggestions_raw_ids) => {


    const MAX_SUGGESTIONS = 20
    autocomplete_suggestions_raw_ids = autocomplete_suggestions_raw_ids.slice(0, MAX_SUGGESTIONS)
    let existing_autocompletes = document.querySelectorAll(".autocomplete-suggestion");
    // let autocomplete_suggestions_strings = []
    // let images_for_suggestions = {}
    // for (let i = 0; i < autocomplete_suggestions_raw.length; i++) {
    //     autocomplete_suggestions_strings.push((autocomplete_suggestions_raw[i].isTag ? "#" : "") + autocomplete_suggestions_raw[i].namespace + ":" + autocomplete_suggestions_raw[i].id)
    //     images_for_suggestions[autocomplete_suggestions_strings[i]] = autocomplete_suggestions_raw[i].image
    // }


    // autocomplete_suggestions_strings = autocomplete_suggestions_raw.forEach(e => {
    //     console.log(e.isTag ? "#" : "" + e.namespace + ":" + e.id)
    //     return e.isTag ? "#" : "" + e.namespace + ":" + e.id
    // });
    // console.log(autocomplete_suggestions_strings)

    let remove_existing = []
    let lazy_new = []
    for (let i = 0; i < existing_autocompletes.length; i++) {
        let autocomplete_text = existing_autocompletes[i].querySelector(".autocomplete-suggestion-text").innerText;
        let found_lazy = false
        for (let j = 0; j < autocomplete_suggestions_raw_ids.length; j++) {
            if (autocomplete_text === autocomplete_suggestions_raw_ids[j]) {
                lazy_new.push(autocomplete_suggestions_raw_ids[j])
                found_lazy = true
                break
            }
        }
        if (!found_lazy) {
            remove_existing.push(existing_autocompletes[i])
        }

    }

    for (let i = 0; i < remove_existing.length; i++) {
        //! тут нужно попросить сборщик мусора убрать обработчики
        remove_existing[i].remove()
    }

    for (let i = 0; i < autocomplete_suggestions_raw_ids.length; i++) {
        if (lazy_new.includes(autocomplete_suggestions_raw_ids[i])) continue

        let li = document.createElement("div");
        li.classList.add("autocomplete-suggestion");
        let iconcont = document.createElement("div");
        iconcont.classList.add("item-icon-container");
        let icon = document.createElement("img");
        // icon.src = images_for_suggestions[autocomplete_suggestions_strings[i]] != "" ? images_for_suggestions[autocomplete_suggestions_strings[i]] : "assets/missing.svg";
        icon.src = autocomplete[autocomplete_suggestions_raw_ids[i]] != "" ? autocomplete[autocomplete_suggestions_raw_ids[i]] : "assets/missing.svg";
        icon.alt = autocomplete_suggestions_raw_ids[i];
        icon.classList.add("item-icon");
        iconcont.appendChild(icon);
        li.appendChild(iconcont);
        let autocompleteSuggestionText = document.createElement("div");
        autocompleteSuggestionText.classList.add("autocomplete-suggestion-text");
        let ast_p = document.createElement("p");
        ast_p.innerText = autocomplete_suggestions_raw_ids[i];
        autocompleteSuggestionText.appendChild(ast_p);
        li.appendChild(autocompleteSuggestionText);
        document.querySelector(".autocomplete-suggestions").appendChild(li);
        li.addEventListener("click", () => {
            selected_autocomplete_field.value = ast_p.innerText;
            selected_autocomplete_field.dispatchEvent(new Event("input"));
        })
        // li.appendChild(document.createElement("div")).classList.add("item-icon-container").appendChild(document.createElement("img")).classList.add("item-icon");
        // li.appendChild(document.createElement("div")).classList.add("autocomplete-suggestion-text").appendChild(document.createElement("p").innerText = autocomplete_suggestions_strings[i]);
        // document.querySelector(".autocomplete-suggestions").appendChild(li);


    }
};
const handleInput = (i, thisNode) => {
    return async (event) => {
        const now = Date.now();
        if (isProcessing && now - lastCallTime < 300) {
            return; // Пропустить, если еще не прошло 300 мс
        }

        lastCallTime = now;
        isProcessing = true;

        // console.clear()
        let val = autocomplete_fields[i].value;
        // let val_no_tag = val.startsWith("#") ? val.split("").splice(1).join("") : val
        let suggestions_raw_ids = []

        let imgTag = autocomplete_fields[i].parentElement.querySelector(".item-icon")
        imgTag.src = autocomplete[val] != "" && autocomplete[val] != undefined ? autocomplete[val] : "assets/missing.svg"
        imgTag.alt = val
        // for (let j = 0; j < autocomplete.length; j++) {
        //     if (val[0] === "#" & !autocomplete[j].isTag || val[0] !== "#" & autocomplete[j].isTag) continue
        //     //console.log(`${autocomplete[j].isTag ? '#' : ''}${autocomplete[j].namespace}:${autocomplete[j].id}`)
        //     // console.log(val + "   |   " + JSON.stringify(autocomplete[j]))

        //     if (val.includes(":")) {
        //         // console.log("^^^ has namespace")

        //         let namespace = val.split(":")[0]
        //         namespace = namespace.startsWith("#") ? namespace.split("").splice(1).join("") : namespace
        //         if (autocomplete[j].namespace != namespace) continue
        //         if (autocomplete[j].id.startsWith(val.split(":")[1]) == false) continue //TODO: поиск в середине а не только в начале (search). сделай
        //     }
        //     else {
        //         // console.log("^^^ no namespace")
        //         // console.log(JSON.stringify(autocomplete[j]) + "   |   " + "id.search(" + val_no_tag + ") = " + autocomplete[j].id.includes(val_no_tag) + "   |   " + "namespace.search(" + val + ") = " + autocomplete[j].namespace.includes(val))
        //         //^^^ не везде val на val_no_tag заменен и search не заменен в строках на inncludes
        //         console.log(val_no_tag)
        //         if (!autocomplete[j].id.includes(val_no_tag)) continue
        //         if (!autocomplete[j].namespace.includes(val_no_tag)) continue
        //     }

        //     suggestions_raw.push(autocomplete[j])



        // }
        let ids = Object.keys(autocomplete)
        for (let j = 0; j < ids.length; j++) {
            if (ids[j].includes(val)) suggestions_raw_ids.push(ids[j])
        }
        //sorting by alphabet
        suggestions_raw_ids.sort()
        suggestions_raw_ids = sortIDsByNamespaceEntryFirst(suggestions_raw_ids, val)

        // console.log(suggestions_raw)
        raw_autocompletes_to_html(suggestions_raw_ids)


        isProcessing = false;
    };
}
function sortIDsByNamespaceEntryFirst(ids, namespace_entry) {
    selected_ids_by_namespace = []
    selected_ids_by_id = []
    for (let i = 0; i < ids.length; i++) {
        let id_no_tag = ids[i].startsWith("#") ? ids[i].split("").splice(1).join("") : ids[i]
        if (id_no_tag.startsWith(namespace_entry)) {
            selected_ids_by_namespace.push(ids[i])
        } else {
            selected_ids_by_id.push(ids[i])
        }
    }
    selected_ids_by_namespace.sort()
    selected_ids_by_id.sort()
    return selected_ids_by_namespace.concat(selected_ids_by_id)
}
for (let i = 0; i < autocomplete_fields.length; i++) {
    autocomplete_fields[i].addEventListener("focus", () => {
        selected_autocomplete_field = autocomplete_fields[i];
        for (let j = 0; j < autocomplete_fields.length; j++) {
            autocomplete_fields[j].classList.remove("last-selected-autocomplete");
        }
        selected_autocomplete_field.classList.add("last-selected-autocomplete");
    });
    let img_container = document.createElement("div");
    img_container.classList.add("item-icon-container");

    autocomplete_fields[i].parentElement.appendChild(img_container)
    let img_item = document.createElement("img");
    img_item.classList.add("item-icon");
    img_container.appendChild(img_item)
    autocomplete_fields[i].addEventListener("input", handleInput(i));


}

async function clearAutocomplete() {
    autocomplete = {}
    try {

        const request = indexedDB.open('myDatabase', 1);

        request.onupgradeneeded = event => {
            const db = event.target.result;
            db.createObjectStore('autocompletes', { keyPath: 'filename' });
        };
        const db = await new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });

        const transaction = db.transaction('autocompletes', 'readwrite');
        const store = transaction.objectStore('autocompletes');
        store.clear();
        // for (const item of autocomplete) {
        //     store.add(item);
        // }
        for (key of Object.keys(autocomplete)) {
            store.put({ "id": key, "value": autocomplete[key] });
        }


    } catch (error) {
        console.error('Error saving autocompletes: ', error);
    } finally {

    }
}

async function loadAutocompletesFromDB() {
    if (isLoading) return;

    isLoading = true;
    try {
        const request = indexedDB.open('myDatabase', 1);

        request.onupgradeneeded = event => {
            const db = event.target.result;
            db.createObjectStore('autocompletes', { keyPath: 'id' });
        };

        const db = await new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });

        const transaction = db.transaction('autocompletes', 'readonly');
        const store = transaction.objectStore('autocompletes');
        const allDataRequest = store.getAll();


        allDataRequest.onsuccess = () => {
            //const imagesArray = allDataRequest.result;
            let results = allDataRequest.result;
            // console.log('Loaded images:', imagesArray);

            //autocomplete = imagesArray;
            results.forEach(item => {
                autocomplete[item.id] = item.value; // Замените 'value' на ваше поле
                // console.log(item);
                // console.log((item['id'].startsWith("#") ? item['id'].split("").splice(1).join("") : item['id']))
                let namespace = ((item['id'].startsWith("#") ? item['id'].split("").splice(1).join("") : item['id']).split(":"))[0]
                if (!namespaces.includes(namespace)) {
                    namespaces.push(namespace)
                }
                
            });
            console.log(`Loaded ${Object.keys(autocomplete).length} autocomplete entries from IndexedDB`);
            refreshItemsList()
        };
        
    } catch (error) {
        console.error('Error loading autocompletes: ', error);
    } finally {
        isLoading = false;
    }

}
loadAutocompletesFromDB()
async function saveAutocompletesToDB() {
    if (isLoading) return;

    isLoading = true;
    try {

        const request = indexedDB.open('myDatabase', 1);

        request.onupgradeneeded = event => {
            const db = event.target.result;
            db.createObjectStore('autocompletes', { keyPath: 'id' });
        };
        const db = await new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });

        const transaction = db.transaction('autocompletes', 'readwrite');
        const store = transaction.objectStore('autocompletes');
        store.clear();
        // for (const item of autocomplete) {
        //     store.put(item);
        // }
        for (key of Object.keys(autocomplete)) {
            store.put({ "id": key, "value": autocomplete[key] });
            
            
            
        }
        

    } catch (error) {
        console.error('Error saving autocompletes: ', error);
    } finally {
        isLoading = false;
    }
}

//! UPLOAD ZIP
document.getElementById('archiveUploadButton').addEventListener('click', async () => {
    const input = document.getElementById('archiveInput');

    if (input.files.length === 0) {
        alert('Пожалуйста, выберите архив.');
        return;
    }

    const file = input.files[0];

    if (!file.name.endsWith('.zip')) {
        alert('Пожалуйста, загрузите архив в формате .zip');
        return;
    }

    const arrayBuffer = await file.arrayBuffer();
    const jszip = new JSZip();

    try {
        const zip = await jszip.loadAsync(arrayBuffer);
        const imagePromises = [];

        Object.keys(zip.files).forEach((filename) => {
            // Проверяем, является ли файл изображением
            //wildberries__sweet_berry_jam
            //wardrobe__savanna_chestplate__{Damage__0}.png
            let filename_no_zip_name = filename.split('/').splice(1).join('/')
            let only_filename = filename_no_zip_name.split(".").slice(0, -1).join(".")
            // TODO: обработка метаданных
            let parts = only_filename.split('__');
            if (!namespaces.includes(parts[0])) {
                namespaces.push(parts[0])
            }
            if (/\.(png|gif|apng|jpg|jpeg|svg)$/i.test(filename)) {
                imagePromises.push(zip.files[filename].async('base64').then((data) => ({
                    isTag: false,
                    namespace: parts[0],
                    id: parts[1],
                    nbt: parts.length > 2 ? parts.splice(2).join('__').split(".").slice(0, -1).join(".") : '',
                    filename: filename,
                    image: `data:image/png;base64,${data}`
                })));
            }
        });

        const images = await Promise.all(imagePromises);


        for (const image of images) {
            let compiled_id = (image.isTag ? "#" : "") + image.namespace + ":" + image.id
            if (autocomplete[compiled_id] === undefined) {
                autocomplete[compiled_id] = image.image;

            }


        }
        saveAutocompletesToDB();
        alert('Загружено ' + images.length + ' автодополнений.');
        refreshItemsList();
    } catch (error) {
        console.error('Error while loading archive:', error);
        alert('Произошла ошибка при загрузке архива.');
    }
});
function DEBUG_download_autocomplete_as_JSON() {
    // Преобразуем массив в JSON с отступами
    const jsonString = JSON.stringify(autocomplete, null, 4);

    // Создаем Blob с содержимым JSON
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Создаем ссылку для скачивания
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';

    // Программно нажимаем на ссылку для скачивания
    document.body.appendChild(a);
    a.click();

    // Убираем ссылку после скачивания
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
async function refreshItemsList() {
    console.log("Items list refreshed!")
    let tabs_parent = document.querySelector(".items-list-tabs")
    tabs_parent.innerHTML = ""
    // console.log(namespaces)
    for (let i = 0; i < namespaces.length; i++) {
        let namespace_for_event = namespaces[i]
        let tab = document.createElement("div")
        tab.classList.add("items-tab")
        tabs_parent.appendChild(tab)

        let icon_cont = document.createElement("div")       
        icon_cont.classList.add("item-icon-container")
        tab.appendChild(icon_cont)
        let icon = document.createElement("img")
        icon.classList.add("item-icon")
        let icon_src = ""
        for (key of Object.keys(autocomplete)) {
            if ((key.startsWith("#") ? key.split("").splice(1).join("") : key).split(":")[0] == namespace_for_event) {
                icon_src = autocomplete[key]
                break
            }
        }
        icon.src = icon_src != ""? icon_src : "assets/missing.svg"
        icon.alt = namespaces[i]
        icon_cont.appendChild(icon)
        
        let tab_text = document.createElement("p")
        tab_text.innerText = namespaces[i]
        tab.appendChild(tab_text)
        
        tab.addEventListener("click", () => {
            console.log("Click on tab " + namespace_for_event)
            for (let j = 0; j < tabs_parent.children.length; j++) {
                tabs_parent.children[j].classList.remove("selected-items-tab")
            }
            tab.classList.add("selected-items-tab")
            renderItemsList(namespace_for_event, tab)
        })
    }
}
const renderItemsList = async (namespace, tab_node) => {
    console.log("Rendering items list for " + namespace)
    if (namespace == currentItemsTab) return
    currentItemsTab = namespace
    let items_list = document.querySelector(".items-list-grid")
    let all_items_in_namespace = []
    for (key of Object.keys(autocomplete)) {
        if ((key.startsWith("#") ? key.split("").splice(1).join("") : key).split(":")[0] == namespace) {
            all_items_in_namespace.push(key)
        }
    }
    items_list.innerHTML = ""
    for (let i = 0; i < all_items_in_namespace.length; i++) {
        let item = document.createElement("div")
        item.classList.add("item-in-list")
        let icon_cont = document.createElement("div")
        icon_cont.classList.add("item-icon-container")
        let icon = document.createElement("img")
        icon.classList.add("item-icon")
        icon.src = autocomplete[all_items_in_namespace[i]] != "" && autocomplete[all_items_in_namespace[i]] != undefined ? autocomplete[all_items_in_namespace[i]] : "assets/missing.svg"
        icon.alt = all_items_in_namespace[i]
        //setting tab's icon if it is missing
        // if (tab_node.querySelector(".item-icon").src = "assets/missing.svg") {
        //     tab_node.querySelector(".item-icon").src = icon.src
        // }
        icon_cont.appendChild(icon)
        item.appendChild(icon_cont)
        // let item_text = document.createElement("p")
        // item_text.innerText = all_items_in_namespace[i]
        // item.appendChild(item_text)
        items_list.appendChild(item)
        item.id = all_items_in_namespace[i] 
        item.addEventListener("click", () => {
            renderItemInfo(all_items_in_namespace[i])
        })
    }

}
function renderItemInfo(id) {

}