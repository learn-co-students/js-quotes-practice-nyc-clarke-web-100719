// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
const quotesUrl = "http://localhost:3000/quotes?_embed=likes";
const quoteList = document.getElementById('quote-list');
const form = document.getElementById('new-quote-form');

document.addEventListener("DOMContentLoaded", function(event){
    //functions in here
    renderQuotes();
})

function renderQuotes() {
    fetch(quotesUrl) 
        .then(function(response){
            return response.json();
        })
        .then(function(quotes){
            quotes.forEach(function(quote){
                addQuote(quote);
            })
        })
}

function addQuote(quote){
    let quoteHTML = `<li class='quote-card'>
    <blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button data-id=${quote.id} class='btn-success'>Likes: <span>0</span></button>
      <button data-id=${quote.id} class='btn-danger'>Delete</button>
    </blockquote>
  </li>
  <hr>`
  quoteList.innerHTML += quoteHTML;
}

form.addEventListener('click', function(event){
    event.preventDefault();
    if (event.target.className === "btn btn-primary") {
        let quoteText = document.getElementById('new-quote');
        let author = document.getElementById('author');
        fetch("http://localhost:3000/quotes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                "quote": quoteText.value,
                "author": author.value
            })
        })
        .then(function(response){
            return response.json();
        })
        .then(function(quote){
            addQuote(quote);
        })
    }
})

quoteList.addEventListener('click', function(event){
    let quoteCard = event.target.closest('.quote-card');
    if (event.target.className === 'btn-danger') {
        deleteButton(event.target.dataset.id, quoteCard)
    } else if (event.target.className === "btn-success") {
        addLikes(event.target.dataset.id, quoteCard);
    }
});

function deleteButton(num, quoteCard) {
    fetch("http://localhost:3000/quotes" + `/${num}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        } 
    })
    .then(function(response){
        return response.json();
    })
    .then(function(quote){
        quoteCard.remove();
    })
}

function addLikes(num, quoteCard) {
    fetch(`http://localhost:3000/likes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            quoteId: parseInt(num) 
        })
    })
    .then(function(response){
        return response.json();
    })
    .then(function(object){
        quoteCard.querySelector('.btn-success span').innerText = parseInt(quoteCard.querySelector('.btn-success span').innerText) + 1;
    })
}