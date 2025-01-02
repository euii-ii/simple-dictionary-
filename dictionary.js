const txtBox = document.querySelector(".txtBox");
const form = document.querySelector(".searchForm");
const searchWord = document.querySelector(".search-word");
const description = document.querySelector(".description");
const synonyms = document.querySelector(".synonyms");
const antonyms = document.querySelector(".antonyms");
const loadingMessage = document.querySelector(".loading-message");
const recentSearchesContainer = document.querySelector(".recent-searches");

const dictionaryJson = "https://raw.githubusercontent.com/adambom/dictionary/master/dictionary.json";

let recentSearches = []; 

function searchDict(e) {
    e.preventDefault();

    
    searchWord.innerHTML = "";
    description.innerHTML = "";
    synonyms.innerHTML = "";
    antonyms.innerHTML = "";
    loadingMessage.textContent = "Loading...";

    let word = txtBox.value.trim();
    if (word === "") {
        loadingMessage.textContent = "Please enter a word.";
        return;
    }

    fetch(dictionaryJson)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            loadingMessage.textContent = ""; 
            let searchKeyword = word.toUpperCase();

            
            if (data[searchKeyword]) {
                searchWord.innerHTML = searchKeyword;
                description.innerHTML = data[searchKeyword].join(", "); 

                
                if (data[searchKeyword].synonyms && data[searchKeyword].synonyms.length > 0) {
                    synonyms.innerHTML = "Synonyms: " + data[searchKeyword].synonyms.join(", ");
                } else {
                    synonyms.innerHTML = ""; 
                }

                if (data[searchKeyword].antonyms && data[searchKeyword].antonyms.length > 0) {
                    antonyms.innerHTML = "Antonyms: " + data[searchKeyword].antonyms.join(", ");
                } else {
                    antonyms.innerHTML = ""; 
                }

                
                addToRecentSearches(searchKeyword);
            } else {
                searchWord.innerHTML = searchKeyword;
                description.innerHTML = "Not found.";
                synonyms.innerHTML = "";
                antonyms.innerHTML = "";
            }
        })
        .catch(error => {
            loadingMessage.textContent = "Error fetching dictionary data: " + error.message;
        });
}


function addToRecentSearches(word) {
    if (!recentSearches.includes(word)) {
        recentSearches.push(word);
        updateRecentSearches();
    }
}


function updateRecentSearches() {
    recentSearchesContainer.innerHTML = "";
    recentSearches.forEach(word => {
        const li = document.createElement("li");
        li.textContent = word;
        li.onclick = () => {
            txtBox.value = word;
            searchDict(new Event("submit")); 
        };
        recentSearchesContainer.appendChild(li);
    });
}

form.addEventListener("submit", searchDict);
function searchDict(e) {
e.preventDefault();


searchWord.innerHTML = "";
description.innerHTML = "";
synonyms.innerHTML = "";
antonyms.innerHTML = "";
loadingMessage.textContent = "Loading...";

let word = txtBox.value.trim();
if (word === "") {
loadingMessage.textContent = "Please enter a word.";
return;
}

fetch(dictionaryJson)
.then(response => {
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
})
.then(data => {
    loadingMessage.textContent = ""; 
    let searchKeyword = word.toUpperCase();

    
    if (data[searchKeyword]) {
        searchWord.innerHTML = searchKeyword;

        
        const definition = data[searchKeyword];
        if (Array.isArray(definition)) {
            description.innerHTML = definition.join(", ");
        } else {
            description.innerHTML = definition; 
        }

        
        if (definition.synonyms && Array.isArray(definition.synonyms)) {
            synonyms.innerHTML = "Synonyms: " + definition.synonyms.join(", ");
        } else {
            synonyms.innerHTML = "Synonyms: Not available"; 
        }

        if (definition.antonyms && Array.isArray(definition.antonyms)) {
            antonyms.innerHTML = "Antonyms: " + definition.antonyms.join(", ");
        } else {
            antonyms.innerHTML = "Antonyms: Not available"; 
        }

        
        addToRecentSearches(searchKeyword);
    } else {
        searchWord.innerHTML = searchKeyword;
        description.innerHTML = "Not found.";
        synonyms.innerHTML = "";
        antonyms.innerHTML = "";
    }
})
.catch(error => {
    loadingMessage.textContent = "Error fetching dictionary data: " + error.message;
});
}
