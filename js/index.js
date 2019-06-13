//const url = 'https://www.goodreads.com/search.xml?key=o3ZEitH9EZ1E7JYpQ6BHHQ&q=Ender%27s+Game&search=title';
const search_url = new URL('https://www.goodreads.com/search.xml')
const key = 'o3ZEitH9EZ1E7JYpQ6BHHQ'


function getTitle(xmlDoc) {
    console.log(xmlDoc);
    let titles = xmlDoc.getElementsByTagName("title");
    let ul = document.getElementById("book-list")

    for (title of titles) {
        let li = document.createElement('li');
        let a = document.createElement('a');
        let linkText = document.createTextNode(title.innerHTML);
        a.appendChild(linkText);
        a.onclick = function(){ 
            // getBookDetail(this.text,xmlDoc)
            localStorage.setItem('xml',new XMLSerializer().serializeToString(xmlDoc));
        };
        a.href = 'detail_page.html'; 
        li.appendChild(a);
        ul.appendChild(li);
    }
}

function getBookDetail(){
    const xmlDoc = localStorage.getItem('xml');
    updateBookDetails($.parseXML(xmlDoc));
}

function updateBookDetails(xmlDoc){
    console.log(xmlDoc)
    let title = xmlDoc.getElementsByTagName("title")[0].innerHTML;
    let author = xmlDoc.getElementsByTagName("name")[0].innerHTML;
    let cover = xmlDoc.getElementsByTagName("image_url")[0].innerHTML;
    let rating = xmlDoc.getElementsByTagName("average_rating")[0].innerHTML;
    document.getElementById("book-name").innerHTML = title;
    document.getElementById("author").innerHTML = author;
    document.getElementById("rating").innerHTML = rating;
    document.getElementById('cover').src = cover;
}

function getData(url, q, func) {
    let params = { key, q }
    url.search = new URLSearchParams(params);
    console.log(url);
    return fetch(url)
        .then(handleResponse)
        .then(func)
        .catch(function(err) {
            console.log(err)
        })
}

function handleResponse(response) {
    return response.text()
        .then(xml => {
            if (response.ok) {
                
                return Promise.resolve($.parseXML(xml));
            } else {
                return Promise.reject(xml);
            }
        })
}

function getBooks() {
    const book = document.getElementById('book-name').value;
    getData(search_url, book,getTitle);
}