//const url = 'https://www.goodreads.com/search.xml?key=o3ZEitH9EZ1E7JYpQ6BHHQ&q=Ender%27s+Game&search=title';
const search_url = new URL('https://www.goodreads.com/search.xml')
const key = 'o3ZEitH9EZ1E7JYpQ6BHHQ'
let titles;
let page_index;
const items_per_page = 5;
let total_items;
let total_pages;

function getTitle(xmlDoc) {
    console.log(xmlDoc);
    let titles_xml = xmlDoc.getElementsByTagName("title");
    localStorage.setItem('xml', new XMLSerializer().serializeToString(xmlDoc));
    titles = [];
    page_index = 0;
    for (title of titles_xml) {
        titles.push(title.innerHTML);
    }
    total_items = titles.length;
    total_pages = total_items/items_per_page;
    titles = splitList(titles);
    displayList();
    document.getElementById("left-arrow").style.visibility = 'hidden';
    document.getElementById("right-arrow").style.visibility = 'visible';
}

function displayList() {
    
    let ul = document.getElementById("book-list");
    ul.innerHTML = "";
    for (title of titles[page_index]) {
        // console.log(title)
        let li = document.createElement('li');
        let a = document.createElement('a');
        let linkText = document.createTextNode(title);
        a.appendChild(linkText);
        // a.onclick = function() {
        //     // getBookDetail(this.text,xmlDoc)
        //     localStorage.setItem('xml', new XMLSerializer().serializeToString(xmlDoc));
        // };
        a.href = 'detail_page.html';
        li.appendChild(a);
        ul.appendChild(li);
    }
}

function click(){
    // getBookDetail(this.text,xmlDoc)
    localStorage.setItem('xml', new XMLSerializer().serializeToString(xmlDoc));
}
function next(){
    
    if (page_index < total_pages-1){
        page_index ++
        displayList();
    }
    else {
        document.getElementById("right-arrow").style.visibility = 'hidden';   
    }
    if (document.getElementById("left-arrow").style.visibility == 'hidden'){
        document.getElementById("left-arrow").style.visibility = 'visible';
    }

}
function previous(){
    if (page_index != 0){
        page_index --
        displayList();
    }
    else{
        document.getElementById("left-arrow").style.visibility = 'hidden';  
    }
    if (document.getElementById("right-arrow").style.visibility == 'hidden'){
        document.getElementById("right-arrow").style.visibility = 'visible';
    }
}

// function showArrows() {
//     if(disp == 'none') document.getElementsByClassName("arrow").style.display = 'none';
//    }
function splitList(list) {
    let splited = []
    for (var i = 0; i < list.length; i += items_per_page)
        splited.push(list.slice(i, i + items_per_page));
    return splited;
}

function getBookDetail() {
    const xmlDoc = $.parseXML(localStorage.getItem('xml'));
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
    getData(search_url, book, getTitle);
}