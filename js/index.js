let paginate;

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
    const items_per_page = 5;
    if (titles_xml.length == 0) {
        return Promise.reject(titles_xml);
    }
    const titles = [...titles_xml].map(item => item.innerHTML).reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / items_per_page);
        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = []
        }
        resultArray[chunkIndex].push(item);
        return resultArray
    }, []);

    appendCount(result_count);
    paginate = new pagination(titles_xml.length, titles, items_per_page);
    paginate.displayList();
    return Promise.resolve();
}


function appendCount(count) {
    const ul = document.getElementById("result-count");
    ul.innerHTML = "";
    const li = document.createElement("li");
    li.innerHTML = `Total Results: ${count}`
    ul.appendChild(li);
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
