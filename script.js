let bookData = [];
const localStorageBooks = 'LOCAL_STORAGE_BOOKS';
const RENDER = 'RENDER_BOOKS';
const SEARCH = 'SEARCH_BOOKS';
const SAVED = 'SAVED_BOOK';
const submitAction = document.getElementById('inputBook');
const submitSearch = document.getElementById('searchBook');

function checkForStorage() {
    return typeof (Storage) !== 'undefined';
};

window.addEventListener('load', function () {
  if (checkForStorage) {
    if (localStorage.getItem(localStorageBooks) !== null) {
      bookData = getDataBook();
    }
    document.dispatchEvent(new Event(RENDER));
    } else {
      alert('Browser yang Anda gunakan tidak mendukung Web Storage');
  }
});

function addBookData(data) {
  if (checkForStorage()) {
    bookData.push(data);
  saveData();
  document.dispatchEvent(new Event(RENDER));
  }
};
 
document.addEventListener(RENDER, function () {
  const uncompleteBookshelfList = document.getElementById('uncompleteBookshelfList');
  uncompleteBookshelfList.innerHTML = '';
  const completeBookshelfList = document.getElementById('completeBookshelfList');
  completeBookshelfList.innerHTML = '';

  for (const bookItem of bookData) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isComplete) {
      uncompleteBookshelfList.append(bookElement);
    } else
      completeBookshelfList.append(bookElement);
  }
});

function makeBook(bookData) {
  const title = document.createElement('h3');
  title.innerText = bookData.title;

  const author = document.createElement('p');
  author.innerText = bookData.author;

  const textContainer = document.createElement('div');
  textContainer.classList.add('bio');
  textContainer.append(title, author);

  const year = document.createElement('p');
  year.innerText = bookData.year;
   
  const container = document.createElement('article');
  container.classList.add('bookItem');
  container.append(textContainer, year);
  container.setAttribute('id', `book-${bookData.id}`);

  if (!bookData.isComplete) {
    const completedButton = document.createElement('button');
    completedButton.classList.add('tick');
    completedButton.addEventListener('click', function () {
      addBookToComplete(bookData.id);
    });
     
    const tickIcon = document.createElement('img');
    tickIcon.setAttribute('src', 'assets/tick.png')
    completedButton.append(tickIcon);

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash');
    trashButton.addEventListener('click', function () {
      notification();
      answered(bookData.id);
    });

    const trashIcon = document.createElement('img');
    trashIcon.setAttribute('src', 'assets/trash.png');
    trashButton.append(trashIcon);
     
    const uncompleteButtonContainer = document.createElement('div');
    uncompleteButtonContainer.classList.add('action');
    uncompleteButtonContainer.append(completedButton, trashButton);
    container.append(uncompleteButtonContainer);

  } else {
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo');
    undoButton.addEventListener('click', function () {
      undoBookFromComplete(bookData.id);
    });

  const undoIcon = document.createElement('img');
  undoIcon.setAttribute('src', 'assets/undo.png');
  undoButton.append(undoIcon);

  const trashButton = document.createElement('button');
  trashButton.classList.add('trash');
  trashButton.addEventListener('click', function () {
    notification();
    answered(bookData.id);
  });

  const trashIcon = document.createElement('img');
  trashIcon.setAttribute('src', 'assets/trash.png')
  trashButton.append(trashIcon);
     
  const completeButtonContainer = document.createElement('div');
  completeButtonContainer.classList.add('action');
  completeButtonContainer.append(undoButton, trashButton);
  container.append(completeButtonContainer);
  }
  return container;
};

function addBookToComplete (bookId) {
  const bookTarget = findBook(bookId);
   
  if (bookTarget == null) return;
  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER));
  saveData();
};

function findBook(bookId) {
  for (const todoItem of bookData) {
    if (todoItem.id === bookId) {
      return todoItem;
    }
  }
  return null;
};
  
function deleteBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;
  bookData.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER));
  notification();
  saveData();
};
   
function undoBookFromComplete(bookId) {
  const bookTarget = findBook(bookId);
   
  if (bookTarget == null) return;
  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER));
  saveData();
};

function findBookIndex(bookId) {
  for (const index in bookData) {
    if (bookData[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function getDataBook() {
  return JSON.parse(localStorage.getItem(localStorageBooks));
};

submitAction.addEventListener('submit', function (event) {
  event.preventDefault();
  const title = document.getElementById('inputBookTitle').value;
  const author = document.getElementById('inputBookAuthor').value;
  const year = parseInt(document.getElementById('inputBookYear').value);
  const generatedID = generateId();
  const isComplete = document.getElementById("inputBookIsComplete").checked;
  const newBookData = {
    id: generatedID,
    title: title,
    author: author,
    year: year,
    isComplete: isComplete,
  };
  addBookData(newBookData);
});

function generateId() {
  return +new Date();
};

function saveData() {
  if (checkForStorage()) {
    const parsed = JSON.stringify(bookData);
    localStorage.setItem(localStorageBooks, parsed);
    document.dispatchEvent(new Event(SAVED));
  }
};

document.addEventListener(SAVED, function () {
  const cek = localStorage.getItem(localStorageBooks);
  console.log(cek);
});

function searchByTitle(bookTitle) {
  if (checkForStorage()) {
    const find = bookData.filter((current) => current.title.toLowerCase().includes(bookTitle.toLowerCase()));
    return find;
  }
  return [];
};

document.addEventListener(SEARCH, function () {
  const bookTitle = document.getElementById('searchBookTitle').value;
  bookData = searchByTitle(bookTitle);
  document.dispatchEvent(new Event(RENDER));
  bookData = getDataBook();
});

submitSearch.addEventListener('submit', function (event) {
  event.preventDefault();
  document.dispatchEvent(new Event(SEARCH));
});


function answered(bookId) {
  const confirm = document.getElementById('confirmDeleteButton');
  const cancel = document.getElementById('cancelDeleteButton');
  const exit = document.getElementById('exit');

  confirm.onclick = () => {
    deleteBook(bookId);
  };

  cancel.onclick = () => {
    notification();
  };

  exit.onclick = () => {
    notification();
  };
};

function notification() {
  const notifications = document.getElementById('notification');
  notifications.classList.toggle('active');
};
