// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
const quotesUrl = "http://localhost:3000/quotes";
const likesUrl = "http://localhost:3000/likes";
const quoteList = document.querySelector('#quote-list');
const createForm = document.querySelector('#new-quote-form');

function fetchQuotes() {
    fetch(quotesUrl + '?_embed=likes')
        .then(resp => resp.json())
        .then(function(data) {
            data.forEach(renderQuote)
        })
}

function renderQuote(quote) {
    const quoteHTML = `
        <li class='quote-card' data-id=${quote.id} >
            <blockquote class="blockquote">
            <p class="mb-0">${quote.quote}</p>
            <footer class="blockquote-footer">${quote.author}</footer>
            <br>
            <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
            <button class='btn-info'>Edit</button>
            <button class='btn-danger'>Delete</button>
            </blockquote>
        </li>
    `
    quoteList.insertAdjacentHTML('beforeend', quoteHTML);
}

function buttonsListener() {
    quoteList.addEventListener('click', function(e) {
        if (e.target.className === 'btn-success') {
            let quote = e.target.closest('li');
            createLike(quote);
        } else if (e.target.className === 'btn-danger') {
            let quote = e.target.closest('li');
            deleteQuote(quote);
        } else if (e.target.className === 'btn-info') {
            debugger;
            let quote = e.target.closest('li');
            editQuote(quote);
        }
    });
}

function editQuote(quote) {
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
        debugger;
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

fetchQuotes();
createFormListener();
buttonsListener();