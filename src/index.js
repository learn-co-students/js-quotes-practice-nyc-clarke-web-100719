// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
const quotesUrl = "http://localhost:3000/quotes";
const likesUrl = "http://localhost:3000/likes";
const quoteList = document.querySelector('#quote-list');
const createForm = document.querySelector('#new-quote-form');
const sortButton = document.querySelector('#sort');
let sort = false;

// sort on frontend JS after receiving from API
// function fetchQuotes(sortFunction) {
//     fetch(quotesUrl + '?_embed=likes')
//         .then(resp => resp.json())
//         .then(function(data) {
//             if (typeof sortFunction === 'function') {
//                 data = data.sort(compareAuthors)
//             }
//             data.forEach(function(datum) {
//                 quoteList.insertAdjacentHTML('beforeend', renderQuote(datum));
//             })
//         })
// }

// sort via backend flag
function fetchQuotes(sortFlag="") {
    fetch(quotesUrl + '?_embed=likes' + sortFlag)
        .then(resp => {
            return resp.json()
        })
        .then(function(data) {
            data.forEach(function(datum) {
                quoteList.insertAdjacentHTML('beforeend', renderQuote(datum));
            })
        })
}

function renderQuote(quote) {
    const quoteHTML = `
        <li class='quote-card' data-id=${quote.id} >
            <blockquote class="blockquote">
            <p class="mb-0">${quote.quote}</p>
            <footer class="blockquote-footer">${quote.author}</footer>
            <br>
            <button class='likebtn btn btn-success'>Likes: <span>${quote.likes.length}</span></button>
            <button class='editbtn btn btn-info'>Edit</button>
            <button class='delbtn btn btn-danger'>Delete</button>
            </blockquote>
        </li>
    `
    // quoteList.insertAdjacentHTML('beforeend', quoteHTML);
    return quoteHTML;
}

function buttonsListener() {
    quoteList.addEventListener('click', function(e) {
        if (e.target.classList.contains('likebtn')) {
            let quote = e.target.closest('li');
            createLike(quote);
        } else if (e.target.classList.contains('delbtn')) {
            let quote = e.target.closest('li');
            deleteQuote(quote);
        } else if (e.target.classList.contains('editbtn')) {
            let quote = e.target.closest('li');
            editQuote(quote);
        } else if (e.target.classList.contains('submitbtn')) {
            e.preventDefault();
            let quote = e.target.closest('li');
            updateQuote(quote);
        } else if (e.target.classList.contains('cancelbtn')) {
            e.preventDefault();
            let quote = e.target.closest('li');
            cancelEditQuote(quote);
        }
    });
}

function editQuote(quote) {
    const quoteWords = quote.querySelector('.mb-0').innerText
    const quoteAuthor = quote.querySelector('.blockquote-footer').innerText

    let quoteEditHTML = `
            <form id="edit-form">
                Quote: <input type="text" class='edit-quote' name="quoteAuthor" value="${quoteWords}" size="75">
                <br>
                Author: <input type="text" class='edit-author' name="quoteAuthor" value="${quoteAuthor}" size="35">
                <br>
                <button type="submit" class='submitbtn btn btn-primary'>Submit</button>
                <button class='cancelbtn btn btn-warning'>Cancel</button>
            </form>
    `
    quote.innerHTML = quoteEditHTML
    
}

function cancelEditQuote(quote) {
    fetch(quotesUrl + `/${quote.dataset.id}` + `?_embed=likes`)
        .then(resp => resp.json())
        .then(function(data) {
            quote.innerHTML = renderQuote(data);
        })

}

function updateQuote(quote) {
    const updateObj = {
        method: "PATCH",
        headers: {
            "Content-Type": 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({
            quote: quote.querySelector('.edit-quote').value,
            author: quote.querySelector('.edit-author').value,
        })
    }
    fetch(quotesUrl + `/${quote.dataset.id}`, updateObj)
        .then(resp => resp.json())
        .then(function(data) {
            fetch(quotesUrl + `/${quote.dataset.id}` + `?_embed=likes`)
                .then(resp => resp.json())
                .then(function(data) {
                    quote.innerHTML = renderQuote(data);
                })
        })
}

function createLike(quote) {
    let quoteId = parseInt(quote.dataset.id);
    const likeObj = {
        method: "POST",
        headers: {
            "Content-Type": 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({
            quoteId: quoteId,
            createdAt: Date.now()
        })
    }
    fetch(likesUrl, likeObj)
        .then(resp => resp.json())
        .then(function(data) {
            updateLikeRender(data);
        })
}

function updateLikeRender(like) {
    let likeListItem = document.querySelector(`[data-id="${like.quoteId}"]`);
    let likeCount = likeListItem.querySelector('button.btn-success span')
    likeCount.innerText = parseInt(likeCount.innerText) + 1;
}

function deleteQuote(quote) {
    const quoteId = quote.dataset.id;
    const quoteUrl = quotesUrl + `/${quoteId}`;
    const quoteConfig = {
        method: "DELETE",
        headers: {
            "Content-Type": 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({
            id: quoteId
        })
    }
    fetch(quoteUrl, quoteConfig)
        .then(resp => {
            resp.json()
        } )
        .then(function(data) {
            quote.remove();
        })
}

function createFormListener() {
    createForm.addEventListener('submit', function(e){
        e.preventDefault();
        let quoteInfo = {
            quote: e.target.querySelector('#new-quote').value,
            author: e.target.querySelector('#author').value,
            likes: []
        }
        if (quoteInfo.quote === "") {
            alert("Quote cannot be blank!")
        } else if (quoteInfo.author === "") {
            alert("Author cannot be blank!")
        } else {
            createQuote(quoteInfo);
        }
    })
}

function createQuote(quoteInfo) {
    const quoteObj = {
        method: "POST",
        headers: {
            "Content-Type": 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify(quoteInfo)
    }
    fetch(quotesUrl, quoteObj)
    .then(resp => resp.json())
    .then(function(data) {
        renderQuote(data);
        createForm.reset();
    })

}


// sortByAuthor backend flag
const sortByAuthor = '&_sort=author'


// sortByAuthor is using frontend sort via JS
// function sortByAuthor( a, b ) {
//     if (a.author < b.author){
//       return -1;
//     }
//     if ( a.author > b.author ){
//       return 1;
//     }
//     return 0;
// }

function sortListener() {
    sortButton.addEventListener('click', function(e) {
        if (!sort) {
            sort = true;
            e.target.className = "btn btn-dark"
            e.target.innerText = "Unsort"
            clearQuotes();
            fetchQuotes(sortByAuthor);
        } else if (sort) {
            sort = false;
            e.target.className = "btn btn-light"
            e.target.innerText = "Sort"
            clearQuotes();
            fetchQuotes();
        }
    })
}

  

function clearQuotes() {
    quoteList.innerHTML = ""
}

fetchQuotes();
createFormListener();
buttonsListener();
sortListener();