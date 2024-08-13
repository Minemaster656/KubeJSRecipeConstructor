let selected_autocomplete_field = null
let isLoading = false
//! {"isTag":boolean, "namespace":string, "id":string}
let autocomplete = [
    // { "isTag": true, "namespace": "minecraft", "id": "moss_replacable" },
    // { "isTag": true, "namespace": "forge", "id": "ores" },
    // { "isTag": false, "namespace": "minecraft", "id": "air" },
    // { "isTag": false, "namespace": "minecraft", "id": "lava_bucket" },
    // { "isTag": false, "namespace": "minecraft", "id": "water_bucket" },
    // { "isTag": false, "namespace": "create", "id": "zink_ingot" },
    // { "isTag": false, "namespace": "create", "id": "andesite_alloy" }
]

let autocomplete_fields = document.querySelectorAll(".autocomplete");

let lastCallTime = 0;
let isProcessing = false;

const raw_autocompletes_to_html = async (autocomplete_suggestions_raw) => {


    const MAX_SUGGESTIONS = 20
    autocomplete_suggestions_raw = autocomplete_suggestions_raw.slice(0, MAX_SUGGESTIONS)
    let existing_autocompletes = document.querySelectorAll(".autocomplete-suggestion");
    let autocomplete_suggestions_strings = []
    let images_for_suggestions = {}
    for (let i = 0; i < autocomplete_suggestions_raw.length; i++) {
        autocomplete_suggestions_strings.push((autocomplete_suggestions_raw[i].isTag ? "#" : "") + autocomplete_suggestions_raw[i].namespace + ":" + autocomplete_suggestions_raw[i].id)
        images_for_suggestions[autocomplete_suggestions_strings[i]] = autocomplete_suggestions_raw[i].image
    }

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
        icon.src = images_for_suggestions[autocomplete_suggestions_strings[i]] != "" ? images_for_suggestions[autocomplete_suggestions_strings[i]] : "assets/missing.svg";
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
};
const handleInput = (i) => {
    return async (event) => {
        const now = Date.now();
        if (isProcessing && now - lastCallTime < 300) {
            return; // Пропустить, если еще не прошло 300 мс
        }

        lastCallTime = now;
        isProcessing = true;

        // console.clear()
        let val = autocomplete_fields[i].value;
        let val_no_tag = val.startsWith("#") ? val.split("").splice(1).join("") : val
        let suggestions_raw = []
        for (let j = 0; j < autocomplete.length; j++) {
            if (val[0] === "#" & !autocomplete[j].isTag || val[0] !== "#" & autocomplete[j].isTag) continue
            //console.log(`${autocomplete[j].isTag ? '#' : ''}${autocomplete[j].namespace}:${autocomplete[j].id}`)
            // console.log(val + "   |   " + JSON.stringify(autocomplete[j]))
            
            if (val.includes(":")) {
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
                console.log(val_no_tag)
                if (!autocomplete[j].id.includes(val_no_tag)) continue
                if (!autocomplete[j].namespace.includes(val_no_tag)) continue
            }

            suggestions_raw.push(autocomplete[j])



        }
        // console.log(suggestions_raw)
        raw_autocompletes_to_html(suggestions_raw)


        isProcessing = false;
    };
}

for (let i = 0; i < autocomplete_fields.length; i++) {
    autocomplete_fields[i].addEventListener("focus", () => {
        selected_autocomplete_field = autocomplete_fields[i];
        for (let j = 0; j < autocomplete_fields.length; j++) {
            autocomplete_fields[j].classList.remove("last-selected-autocomplete");
        }
        selected_autocomplete_field.classList.add("last-selected-autocomplete");
    });

    autocomplete_fields[i].addEventListener("input", handleInput(i));

}

async function clearAutocomplete() {
    autocomplete = []
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
        for (const item of autocomplete) {
            store.add(item);
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
            db.createObjectStore('autocompletes', { keyPath: 'filename' });
        };

        const db = await new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });

        const transaction = db.transaction('autocompletes', 'readonly');
        const store = transaction.objectStore('autocompletes');
        const allDataRequest = store.getAll();

        allDataRequest.onsuccess = () => {
            const imagesArray = allDataRequest.result;
            // console.log('Loaded images:', imagesArray);
            console.log(`Loaded ${imagesArray.length} autocomplete entries from IndexedDB`);
            autocomplete = imagesArray;
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
            db.createObjectStore('autocompletes', { keyPath: 'filename' });
        };
        const db = await new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });

        const transaction = db.transaction('autocompletes', 'readwrite');
        const store = transaction.objectStore('autocompletes');
        store.clear();
        for (const item of autocomplete) {
            store.add(item);
        }


    } catch (error) {
        console.error('Error saving autocompletes: ', error);
    } finally {
        isLoading = false;
    }
}

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
        console.log(images); // Массив объектов { filename: str, image: base64 str }

        for (const image of images) {
            let doesExist = false
            for (const autocomplete_item of autocomplete) {
                if (autocomplete_item.id == image.id && autocomplete_item.namespace == image.namespace && autocomplete_item.nbt == image.nbt) {
                    doesExist = true
                    break
                }
            }
            if (!doesExist) autocomplete.push(image);
        }
        saveAutocompletesToDB();
        alert('Загружено ' + images.length + ' автодополнений.');

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