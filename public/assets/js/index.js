let ntitle;
let ntext;
let saveBtn;
let addNoteBtn;
let noteList;

if (window.location.pathname === '/notes') {
  ntitle = document.querySelector('.note-title');
  ntext = document.querySelector('.note-textarea');
  saveBtn = document.querySelector('.nsave');
  addNoteBtn = document.querySelector('.add-note');
  noteList = document.querySelectorAll('.list-container .list-group');
}

const show = (elem) => {
  elem.style.display = 'inline';
};

const hide = (elem) => {
  elem.style.display = 'none';
};

let activeNote = {};

const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const renderActiveNote = () => {
  hide(saveBtn);

  if (activeNote.id) {
    ntitle.setAttribute('readonly', true);
    ntext.setAttribute('readonly', true);
    ntitle.value = activeNote.title;
    ntext.value = activeNote.text;
  } else {
    ntitle.value = '';
    ntext.value = '';
    ntitle.readOnly = false;
    ntext.readOnly = false;
  }
};

const handleNoteSave = () => {
  const newNote = {
    title: ntitle.value,
    text: ntext.value,
  };
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

const handleNoteDelete = (e) => {
  e.stopPropagation();

  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};

const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};

const handleRenderSaveBtn = () => {
  if (!ntitle.value.trim() || !ntext.value.trim()) {
    hide(saveBtn);
  } else {
    show(saveBtn);
  }
};

const renderNoteList = async (notes) => {
  let jNotes = await notes.json();
  if (window.location.pathname === '/notes') {
    noteList.forEach((el) => (el.innerHTML = ''));
  }

  let noteListItems = [];

  const createLi = (text, delBtn = true) => {
    const lil = document.createElement('li');
    lil.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);

    lil.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDelete);

      lil.append(delBtnEl);
    }

    return lil;
  };

  if (jNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }

  jNotes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    noteListItems.push(li);
  });

  if (window.location.pathname === '/notes') {
    noteListItems.forEach((note) => noteList[0].append(note));
  }
};

const getAndRenderNotes = () => getNotes().then(renderNoteList);

if (window.location.pathname === '/notes') {
  saveBtn.addEventListener('click', handleNoteSave);
  addNoteBtn.addEventListener('click', handleNewNoteView);
  ntitle.addEventListener('keyup', handleRenderSaveBtn);
  ntext.addEventListener('keyup', handleRenderSaveBtn);
}

getAndRenderNotes();
