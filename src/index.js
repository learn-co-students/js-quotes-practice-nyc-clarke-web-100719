// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
const quoteForm = document.getElementById("new-quote-form")
const quoteList = document.getElementById("quote-list")
const QUOTE_LINK = "http://localhost:3000/quotes"
const QUOTES_LIKES_URL = "http://localhost:3000/quotes?_embed=likes"
const LIKES_URL = 'http://localhost:3000/likes'

function getQuotes(){
    fetch(QUOTES_LIKES_URL)
        .then(res => res.json())
        .then(json =>{
            quoteList.innerHTML = json.map(htmlQuote).join(' ')
        })
}

const htmlQuote = quote =>{
    let likesQuote = quote.likes ? quote.likes.length : 0;
    return `<li class='quote-card'>
                <blockquote class="blockquote" data-quote-id=${quote.id}>
                    <p class="mb-0">${quote.quote}</p>
                    <footer class="blockquote-footer">${quote.author}</footer>
                    <br>
                    <button class='btn-success' id="like-btn">Likes: <span id='num-likes'>${likesQuote}</span></button>
                    <button class='btn-danger' id="delete-btn">Delete</button>
                </blockquote>
            </li>`
}

quoteList.addEventListener('click',e=>{
    if(e.target.localName === 'button'){
        if(e.target.id === 'like-btn'){
            // console.log()
            fetch(LIKES_URL,{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                    Accept:'application/json'
                },
                body: JSON.stringify({quoteId: parseInt(e.target.parentNode.dataset.quoteId),
                    createdAt: Date.now()
                })})
                .then(res => res.json())
                .then(json=> {
                    const spanlikes = e.target.parentNode.querySelector('span')
                    spanlikes.innerText = parseInt(spanlikes.innerText) + 1
                })

        }
        else{
            fetch(QUOTE_LINK+`/${e.target.parentNode.dataset.quoteId}`,{
                method: 'DELETE',
                headers:{
                    'Content-Type': 'application/json',
                    Accept:'application/json'
                }})
                .then(res => res.json())
                .then(json=> {
                    e.target.parentNode.parentNode.remove()
                })
        }
    }
})

quoteForm.addEventListener('submit', e=>{
    e.preventDefault()
    const inputs = e.target.querySelectorAll('input')
        fetch(QUOTE_LINK,{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                Accept:'application/json'
            },
            body: JSON.stringify({quote:inputs[0].value,author:inputs[1].value
            })})
            .then(res => res.json())
            .then(json =>{
                quoteList.innerHTML += htmlQuote(json)
            })
})

getQuotes()