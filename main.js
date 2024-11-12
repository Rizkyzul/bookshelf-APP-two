const localStorageKey = "BOOKS_DATA"

const title = document.querySelector("#inputBookTitle")
const errorTitle = document.querySelector("#errorTitle")
const sectionTitle = document.querySelector("#sectionTitle")

const author = document.querySelector("#inputBookAuthor")
const errorAuthor = document.querySelector("#errorAuthor")
const sectionAuthor = document.querySelector("#sectionAuthor")

const year = document.querySelector("#inputBookYear")
const errorYear = document.querySelector("#errorYear")
const sectionYear = document.querySelector("#sectionYear")

const readed = document.querySelector("#inputBookIsComplete")

const btnSubmit = document.querySelector("#bookSubmit")

const searchValue = document.querySelector("#searchBookTitle")
const btnSearch = document.querySelector("#searchSubmit")

let checkInput = []
let checkTitle = null
let checkAuthor = null
let checkYear = null

window.addEventListener("load", function(){
    if (localStorage.getItem(localStorageKey) !== null) {    
        const booksData = getData()
        showData(booksData)
    }
})

btnSearch.addEventListener("click", function(e) {
    e.preventDefault();
    
    if (localStorage.getItem(localStorageKey) == null) {    
        Swal.fire({
            icon: 'info',
            title: 'Tidak ada data buku',
            text: 'Belum ada data buku yang tersimpan.',
            confirmButtonText: 'OK'
        });
        return;
    } else {
        const getByTitle = getData().filter(a => a.title == searchValue.value.trim());
        if (getByTitle.length == 0) {
            const getByAuthor = getData().filter(a => a.author == searchValue.value.trim());
            if (getByAuthor.length == 0) {
                const getByYear = getData().filter(a => a.year == searchValue.value.trim());
                if (getByYear.length == 0) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Tidak ditemukan',
                        text: `Tidak ditemukan data dengan kata kunci: ${searchValue.value}`,
                        confirmButtonText: 'OK'
                    });
                } else {
                    showSearchResult(getByYear);
                }
            } else {
                showSearchResult(getByAuthor);
            }
        } else {
            showSearchResult(getByTitle);
        }
    }

    searchValue.value = '';
});

btnSubmit.addEventListener("click", function() {
    if (btnSubmit.value == "") {
        checkInput = [];

        title.classList.remove("error");
        author.classList.remove("error");
        year.classList.remove("error");

        errorTitle.classList.add("error-display");
        errorAuthor.classList.add("error-display");
        errorYear.classList.add("error-display");

        if (title.value == "") {
            checkTitle = false;
        } else {
            checkTitle = true;
        }

        if (author.value == "") {
            checkAuthor = false;
        } else {
            checkAuthor = true;
        }

        if (year.value == "") {
            checkYear = false;
        } else {
            checkYear = true;
        }

        checkInput.push(checkTitle, checkAuthor, checkYear);
        let resultCheck = validation(checkInput);

        if (resultCheck.includes(false)) {
            Swal.fire({
                icon: 'error',
                title: 'Data Belum Lengkap',
                text: 'Silakan lengkapi semua data sebelum menambahkan buku.',
                confirmButtonText: 'OK'
            });
            return false;
        } else {
            const newBook = {
                id: +new Date(),
                title: title.value.trim(),
                author: author.value.trim(),
                year: year.value,
                isCompleted: readed.checked
            };
            insertData(newBook);

        
            title.value = '';
            author.value = '';
            year.value = '';
            readed.checked = false;

         
            Swal.fire({
                icon: 'success',
                title: 'Buku Berhasil Ditambahkan',
                text: 'Data buku berhasil ditambahkan ke daftar.',
                confirmButtonText: 'OK'
            });
        }
    }
});


function validation(check) {
    let resultCheck = []
    
    check.forEach((a,i) => {
        if (a == false) {
            if (i == 0) {
                title.classList.add("error")
                errorTitle.classList.remove("error-display")
                resultCheck.push(false)
            }else if (i == 1) {
                author.classList.add("error")
                errorAuthor.classList.remove("error-display")
                resultCheck.push(false)
            }else{
                year.classList.add("error")
                errorYear.classList.remove("error-display")
                resultCheck.push(false)
            }
        }
    });

    return resultCheck
}

function insertData(book) {
    let bookData = []


    if (localStorage.getItem(localStorageKey) === null) {
        localStorage.setItem(localStorageKey, 0);
    }else{
        bookData = JSON.parse(localStorage.getItem(localStorageKey))
    }

    bookData.unshift(book)   
    localStorage.setItem(localStorageKey,JSON.stringify(bookData))

    showData(getData())
}

function getData() {
    return JSON.parse(localStorage.getItem(localStorageKey)) || []
}

function showData(books = []) {
    const inCompleted = document.querySelector("#incompleteBookshelfList")
    const completed = document.querySelector("#completeBookshelfList")

    inCompleted.innerHTML = ''
    completed.innerHTML = ''

    books.forEach(book => {
        if (book.isCompleted == false) {
            let el = `
            <article class="book_item">
                <h3>${book.title}</h3>
                <p>Penulis: ${book.author}</p>
                <p>Tahun: ${book.year}</p>

                <div class="action">
                    <button class="green" onclick="readedBook('${book.id}')">Selesai dibaca</button>
                    <button class="red" onclick="deleteBook('${book.id}')">Hapus buku</button>
                </div>
            </article>
            `

            inCompleted.innerHTML += el
        }else{
            let el = `
            <article class="book_item">
                <h3>${book.title}</h3>
                <p>Penulis: ${book.author}</p>
                <p>Tahun: ${book.year}</p>

                <div class="action">
                    <button class="green" onclick="unreadedBook('${book.id}')">Belum selesai di Baca</button>
                    <button class="red" onclick="deleteBook('${book.id}')">Hapus buku</button>
                </div>
            </article>
            `
            completed.innerHTML += el
        }
    });
}

function showSearchResult(books) {
    const searchResult = document.querySelector("#searchResult")

    searchResult.innerHTML = ''

    books.forEach(book => {
        let el = `
        <article class="book_item">
            <h3>${book.title}</h3>
            <p>Penulis: ${book.author}</p>
            <p>Tahun: ${book.year}</p>
            <p>${book.isCompleted ? 'Sudah dibaca' : 'Belum dibaca'}</p>
        </article>
        `

        searchResult.innerHTML += el
    });
}

function readedBook(id) {
    Swal.fire({
        title: 'Pindahkan ke selesai dibaca?',
        text: "Buku akan dipindahkan ke daftar selesai dibaca.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, pindahkan',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            const bookDataDetail = getData().filter(a => a.id == id);
            const newBook = {
                id: bookDataDetail[0].id,
                title: bookDataDetail[0].title,
                author: bookDataDetail[0].author,
                year: bookDataDetail[0].year,
                isCompleted: true
            };

          
            const bookData = getData().filter(a => a.id != id);
            localStorage.setItem(localStorageKey, JSON.stringify(bookData));

           
            insertData(newBook);

    
            Swal.fire(
                'Berhasil!',
                'Buku telah dipindahkan ke daftar selesai dibaca.',
                'success'
            );
        }
    });
}


function unreadedBook(id) {
    Swal.fire({
        title: 'Pindahkan ke belum selesai dibaca?',
        text: "Buku akan dipindahkan ke daftar belum selesai dibaca.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, pindahkan',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            const bookDataDetail = getData().filter(a => a.id == id);
            const newBook = {
                id: bookDataDetail[0].id,
                title: bookDataDetail[0].title,
                author: bookDataDetail[0].author,
                year: bookDataDetail[0].year,
                isCompleted: false
            };

            const bookData = getData().filter(a => a.id != id);
            localStorage.setItem(localStorageKey, JSON.stringify(bookData));
            insertData(newBook);

    
            Swal.fire(
                'Berhasil!',
                'Buku telah dipindahkan ke belum selesai dibaca.',
                'success'
            );
        }
    });
}


function deleteBook(id) {
    Swal.fire({
        title: 'Yakin ingin menghapusnya?',
        text: "Aksi ini tidak dapat dibatalkan!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            const bookDataDetail = getData().filter(a => a.id == id);
            const bookData = getData().filter(a => a.id != id);
            localStorage.setItem(localStorageKey, JSON.stringify(bookData));
            showData(getData());
 
            Swal.fire(
                'Terhapus!',
                `Buku "${bookDataDetail[0].title}" telah terhapus.`,
                'success'
            );
        }
    });
}

