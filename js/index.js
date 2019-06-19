const items_per_page = 5;
let total_items;
let total_pages;
let titles;
let page_index;

function getBooks() {
    const book = document.getElementById('book-name');
    const search_url = new URL('https://www.goodreads.com/search.xml');
    const key = 'o3ZEitH9EZ1E7JYpQ6BHHQ';
    let timeout = null;
    book.onkeyup = function(e) {
        clearTimeout(timeout);
        timeout = setTimeout(() => { fetchData(search_url, key, book.value) }, 700);
    };
}

function fetchData(url, key, q) {
    const params = { key, q }
    url.search = new URLSearchParams(params);
    return fetch(url)
        .then(handleResponse)
        .then(getTitleList)
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

function getTitleList(xmlDoc) {
    localStorage.setItem('xml', new XMLSerializer().serializeToString(xmlDoc));
    const titles_xml = xmlDoc.getElementsByTagName("title");
    const result_count = xmlDoc.getElementsByTagName("total-results")[0].innerHTML;
    if (titles_xml.length == 0) {
        return Promise.reject(titles_xml);
    }
    titles = [...titles_xml].map(item=>item.innerHTML).reduce((resultArray, item, index) => { 
        const chunkIndex = Math.floor(index/items_per_page);
        if(!resultArray[chunkIndex]) {
          resultArray[chunkIndex] = []
        }
        resultArray[chunkIndex].push(item);
        return resultArray
      }, []);

    appendCount(result_count);
    initPagination(titles_xml.length);
    displayList();
    return Promise.resolve();
}


function appendCount(count) {
    const ul = document.getElementById("result-count");
    ul.innerHTML = "";
    const li = document.createElement("li");
    li.innerHTML = `Total Results: ${count}`
    ul.appendChild(li);
}

function initPagination(items_size) {
    page_index = 0;
    total_items = items_size;
    total_pages = Math.ceil(total_items / items_per_page);
    document.getElementById("left-arrow").style.visibility = 'hidden';
    document.getElementById("right-arrow").style.visibility = 'visible';
}


function displayList() {
    let ul = document.getElementById("book-list");
    ul.innerHTML = "";
    for (title of titles[page_index]) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        const linkText = document.createTextNode(title);
        a.appendChild(linkText);
        a.href = 'detail_page.html';
        li.appendChild(a);
        ul.appendChild(li);
    }
}

function nextPage() {
    if (page_index < total_pages - 1) {
        page_index++
        displayList();
    }
    if (page_index == total_pages - 1) {
        document.getElementById("right-arrow").style.visibility = 'hidden';
    }
    if (document.getElementById("left-arrow").style.visibility == 'hidden') {
        document.getElementById("left-arrow").style.visibility = 'visible';
    }
}

function previousPage() {
    if (page_index != 0) {
        page_index--
        displayList();
    }
    if (page_index == 0) {
        document.getElementById("left-arrow").style.visibility = 'hidden';
    }
    if (document.getElementById("right-arrow").style.visibility == 'hidden') {
        document.getElementById("right-arrow").style.visibility = 'visible';
    }
}

function getBookDetail() {
    const xmlDoc = $.parseXML(localStorage.getItem('xml'));
    const title = xmlDoc.getElementsByTagName("title")[0].innerHTML;
    const author = xmlDoc.getElementsByTagName("name")[0].innerHTML;
    const cover = xmlDoc.getElementsByTagName("image_url")[0].innerHTML;
    const rating = xmlDoc.getElementsByTagName("average_rating")[0].innerHTML;
    document.getElementById("book-name").innerHTML = title;
    document.getElementById("author").innerHTML = author;
    document.getElementById("rating").innerHTML = rating;
    document.getElementById("cover").src = cover;
}