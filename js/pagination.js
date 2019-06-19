
class pagination {
    constructor(total_items, chucked_list, items_per_page) {
        this.total_items = total_items
        this.page_index = 0;
        this.chucked_list = chucked_list;
        this.items_per_page = items_per_page;
        this.total_pages = Math.ceil(this.total_items / this.items_per_page);
        document.getElementById("left-arrow").style.visibility = 'hidden';
        document.getElementById("right-arrow").style.visibility = 'visible';
    }


    displayList() {
        const ul = document.getElementById("book-list");
        ul.innerHTML = "";
        for (let title of this.chucked_list[this.page_index]) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            const linkText = document.createTextNode(title);
            a.appendChild(linkText);
            a.href = 'detail_page.html';
            li.appendChild(a);
            ul.appendChild(li);
        }
    }

    nextPage() {
        if (this.page_index < this.total_pages - 1) {
            this.page_index++
                this.displayList();
        }
        if (this.page_index == this.total_pages - 1) {
            document.getElementById("right-arrow").style.visibility = 'hidden';
        }
        if (document.getElementById("left-arrow").style.visibility == 'hidden') {
            document.getElementById("left-arrow").style.visibility = 'visible';
        }
    }

    previousPage() {
        if (this.page_index != 0) {
            this.page_index--
                this.displayList();
        }
        if (this.page_index == 0) {
            document.getElementById("left-arrow").style.visibility = 'hidden';
        }
        if (document.getElementById("right-arrow").style.visibility == 'hidden') {
            document.getElementById("right-arrow").style.visibility = 'visible';
        }
    }
}