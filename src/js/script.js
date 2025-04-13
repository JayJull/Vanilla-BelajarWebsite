const notesData = [
  {
    id: "notes-jT-jjsyz61J8XKiI",
    title: "Welcome to Notes, Dimas!",
    body: "Welcome to Notes! This is your first note. You can archive it, delete it, or create new ones.",
    createdAt: "2022-07-28T10:03:12.594Z",
    archived: false,
  },
  {
    id: "notes-aB-cdefg12345",
    title: "Meeting Agenda",
    body: "Discuss project updates and assign tasks for the upcoming week.",
    createdAt: "2022-08-05T15:30:00.000Z",
    archived: false,
  },
  {
    id: "notes-XyZ-789012345",
    title: "Shopping List",
    body: "Milk, eggs, bread, fruits, and vegetables.",
    createdAt: "2022-08-10T08:45:23.120Z",
    archived: false,
  },
  {
    id: "notes-1a-2b3c4d5e6f",
    title: "Personal Goals",
    body: "Read two books per month, exercise three times a week, learn a new language.",
    createdAt: "2022-08-15T18:12:55.789Z",
    archived: false,
  },
  {
    id: "notes-LMN-456789",
    title: "Recipe: Spaghetti Bolognese",
    body: "Ingredients: ground beef, tomatoes, onions, garlic, pasta. Steps:...",
    createdAt: "2022-08-20T12:30:40.200Z",
    archived: false,
  },
  {
    id: "notes-QwErTyUiOp",
    title: "Workout Routine",
    body: "Monday: Cardio, Tuesday: Upper body, Wednesday: Rest, Thursday: Lower body, Friday: Cardio.",
    createdAt: "2022-08-25T09:15:17.890Z",
    archived: false,
  },
  {
    id: "notes-abcdef-987654",
    title: "Book Recommendations",
    body: "1. 'The Alchemist' by Paulo Coelho\n2. '1984' by George Orwell\n3. 'To Kill a Mockingbird' by Harper Lee",
    createdAt: "2022-09-01T14:20:05.321Z",
    archived: false,
  },
  {
    id: "notes-zyxwv-54321",
    title: "Daily Reflections",
    body: "Write down three positive things that happened today and one thing to improve tomorrow.",
    createdAt: "2022-09-07T20:40:30.150Z",
    archived: false,
  },
  {
    id: "notes-poiuyt-987654",
    title: "Travel Bucket List",
    body: "1. Paris, France\n2. Kyoto, Japan\n3. Santorini, Greece\n4. New York City, USA",
    createdAt: "2022-09-15T11:55:44.678Z",
    archived: false,
  },
  {
    id: "notes-asdfgh-123456",
    title: "Coding Projects",
    body: "1. Build a personal website\n2. Create a mobile app\n3. Contribute to an open-source project",
    createdAt: "2022-09-20T17:10:12.987Z",
    archived: false,
  },
  {
    id: "notes-5678-abcd-efgh",
    title: "Project Deadline",
    body: "Complete project tasks by the deadline on October 1st.",
    createdAt: "2022-09-28T14:00:00.000Z",
    archived: false,
  },
  {
    id: "notes-9876-wxyz-1234",
    title: "Health Checkup",
    body: "Schedule a routine health checkup with the doctor.",
    createdAt: "2022-10-05T09:30:45.600Z",
    archived: false,
  },
  {
    id: "notes-qwerty-8765-4321",
    title: "Financial Goals",
    body: "1. Create a monthly budget\n2. Save 20% of income\n3. Invest in a retirement fund.",
    createdAt: "2022-10-12T12:15:30.890Z",
    archived: false,
  },
  {
    id: "notes-98765-54321-12345",
    title: "Holiday Plans",
    body: "Research and plan for the upcoming holiday destination.",
    createdAt: "2022-10-20T16:45:00.000Z",
    archived: false,
  },
  {
    id: "notes-1234-abcd-5678",
    title: "Language Learning",
    body: "Practice Spanish vocabulary for 30 minutes every day.",
    createdAt: "2022-10-28T08:00:20.120Z",
    archived: false,
  },
];

class NoteCard extends HTMLElement {
  constructor() {
    super();
    this._title = "";
    this._body = "";
    this._date = "";
    this._id = "";
    this._archived = false;
  }

  static get observedAttributes() {
    return ["title", "body", "date", "noteid", "archived"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case "title":
        this._title = newValue;
        break;
      case "body":
        this._body = newValue;
        break;
      case "date":
        this._date = newValue;
        break;
      case "noteid":
        this._id = newValue;
        break;
      case "archived":
        this._archived = newValue === "true";
        break;
    }

    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const createdAt = new Date(this._date).toLocaleString();

    this.innerHTML = `
              <div class="note-title">${this._title}</div>
              <div class="note-body">${this._body}</div>
              <div class="note-footer">
                  <div class="note-date">Created: ${createdAt}</div>
              </div>
              <div class="note-actions">
                  <button class="action-btn edit-btn" data-id="${this._id}">
                      <i class="fas fa-edit"></i> Edit
                  </button>
                  ${
                    this._archived
                      ? `<button class="action-btn unarchive-btn" data-id="${this._id}">
                          <i class="fas fa-box-open"></i> Unarchive
                      </button>`
                      : `<button class="action-btn archive-btn" data-id="${this._id}">
                          <i class="fas fa-archive"></i> Archive
                      </button>`
                  }
                  <button class="action-btn delete-btn" data-id="${this._id}">
                      <i class="fas fa-trash"></i> Delete
                  </button>
              </div>
          `;

    const deleteBtn = this.querySelector(".delete-btn");
    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => {
        deleteNote(this._id);
      });
    }

    const editBtn = this.querySelector(".edit-btn");
    if (editBtn) {
      editBtn.addEventListener("click", () => {
        editNote(this._id);
      });
    }

    if (this._archived) {
      const unarchiveBtn = this.querySelector(".unarchive-btn");
      if (unarchiveBtn) {
        unarchiveBtn.addEventListener("click", () => {
          toggleArchiveNote(this._id);
        });
      }
    } else {
      const archiveBtn = this.querySelector(".archive-btn");
      if (archiveBtn) {
        archiveBtn.addEventListener("click", () => {
          toggleArchiveNote(this._id);
        });
      }
    }
  }
}
customElements.define("note-card", NoteCard);

class AppHeader extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.setupTabNavigation();
  }

  render() {
    this.innerHTML = `
              <div class="container">
                  <h1><i class="fas fa-sticky-note"></i> Notes App</h1>
                  <div class="tab-container">
                      <button class="tab" data-target="add-note"><i class="fas fa-plus"></i> Add Note</button>
                      <button class="tab" data-target="view-notes"><i class="fas fa-list"></i> View Notes <span class="count-badge" id="activeCount">0</span></button>
                      <button class="tab" data-target="archived-notes"><i class="fas fa-archive"></i> Archived <span class="count-badge" id="archivedCount">0</span></button>
                      <button id="themeToggle" class="theme-toggle-btn">
                <i class="fas fa-moon"></i> Toggle Theme
            </button>
                  </div>
              </div>
          `;
  }

  setupTabNavigation() {
    const tabs = this.querySelectorAll(".tab");

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        document
          .querySelectorAll(".tab")
          .forEach((t) => t.classList.remove("active"));

        tab.classList.add("active");

        document.querySelectorAll(".content").forEach((content) => {
          content.classList.remove("active");
        });

        const targetId = tab.getAttribute("data-target");
        document.getElementById(targetId).classList.add("active");
      });
    });
  }
}
customElements.define("app-header", AppHeader);
class NoteForm extends HTMLElement {
  constructor() {
    super();
    this._editingNoteId = null;
  }

  connectedCallback() {
    this.render();
    this.setupFormValidation();
    this.setupForm();
  }

  render() {
    this.innerHTML = `
              <div class="note-form">
                  <h2>Add New Note</h2>
                  <form id="noteForm">
                      <div class="form-group">
                          <label for="title">Title</label>
                          <input type="text" id="title" class="form-control" required>
                          <span class="validation-message" id="titleValidation"></span>
                      </div>
                      <div class="form-group">
                          <label for="body">Note Content</label>
                          <textarea id="body" class="form-control" required></textarea>
                          <span class="validation-message" id="bodyValidation"></span>
                      </div>
                      <button type="submit" class="btn"><i class="fas fa-save"></i> Save Note</button>
                  </form>
              </div>
          `;
  }

  setupFormValidation() {
    const titleInput = this.querySelector("#title");
    const bodyInput = this.querySelector("#body");
    const titleValidation = this.querySelector("#titleValidation");
    const bodyValidation = this.querySelector("#bodyValidation");

    titleInput.addEventListener("input", () => {
      if (titleInput.value.trim() === "") {
        titleInput.classList.add("invalid");
        titleValidation.textContent = "Title cannot be empty";
      } else if (titleInput.value.length < 3) {
        titleInput.classList.add("invalid");
        titleValidation.textContent = "Title must be at least 3 characters";
      } else {
        titleInput.classList.remove("invalid");
        titleValidation.textContent = "";
      }
    });

    bodyInput.addEventListener("input", () => {
      if (bodyInput.value.trim() === "") {
        bodyInput.classList.add("invalid");
        bodyValidation.textContent = "Note content cannot be empty";
      } else if (bodyInput.value.length < 10) {
        bodyInput.classList.add("invalid");
        bodyValidation.textContent =
          "Note content must be at least 10 characters";
      } else {
        bodyInput.classList.remove("invalid");
        bodyValidation.textContent = "";
      }
    });
  }

  setupForm() {
    const form = this.querySelector("#noteForm");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = this.querySelector("#title").value.trim();
      const body = this.querySelector("#body").value.trim();
      if (title.length < 3 || body.length < 10) {
        return;
      }

      if (this._editingNoteId) {
        updateNote(this._editingNoteId, title, body);
        this._editingNoteId = null;
      } else {
        const note = {
          id: "notes-" + Date.now().toString(),
          title,
          body,
          createdAt: new Date().toISOString(),
          archived: false,
        };
        const notes = JSON.parse(localStorage.getItem("notes") || "[]");
        notes.push(note);
        localStorage.setItem("notes", JSON.stringify(notes));
      }

      form.reset();
      this.querySelector("#title").classList.remove("invalid");
      this.querySelector("#body").classList.remove("invalid");
      this.querySelector("#titleValidation").textContent = "";
      this.querySelector("#bodyValidation").textContent = "";
      renderAllNotes();

      document.querySelectorAll(".tab")[1].click();
      showNotification("Note saved successfully!", "success");
    });
  }

  setEditingNote(noteId) {
    const notes = JSON.parse(localStorage.getItem("notes") || "[]");
    const note = notes.find((note) => note.id === noteId);

    if (note) {
      this.querySelector("#title").value = note.title;
      this.querySelector("#body").value = note.body;
      this._editingNoteId = noteId;
    }
  }
}
customElements.define("note-form", NoteForm);

class EmptyState extends HTMLElement {
  constructor() {
    super();
    this._message = "No notes found";
  }

  static get observedAttributes() {
    return ["message"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "message" && oldValue !== newValue) {
      this._message = newValue;
      this.render();
    }
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
              <div class="empty-state">
                  <i class="fas fa-sticky-note fa-3x"></i>
                  <p>${this._message}</p>
              </div>
          `;
  }
}
customElements.define("empty-state", EmptyState);

class NotifyMessage extends HTMLElement {
  constructor() {
    super();
    this._message = "";
    this._type = "success";
  }

  static get observedAttributes() {
    return ["message", "type"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case "message":
        this._message = newValue;
        break;
      case "type":
        this._type = newValue;
        break;
    }

    this.render();
  }

  connectedCallback() {
    this.render();
    this.setupAnimation();
  }

  render() {
    this.className = `notification ${this._type}`;
    this.innerHTML = `
              <div class="notification-content">
                  <span>${this._message}</span>
                  <button class="close-btn">&times;</button>
              </div>
          `;

    this.style.position = "fixed";
    this.style.bottom = "20px";
    this.style.right = "20px";
    this.style.backgroundColor =
      this._type === "success"
        ? "#1cc88a"
        : this._type === "danger"
        ? "#e74a3b"
        : this._type === "warning"
        ? "#f6c23e"
        : "#4e73df";
    this.style.color = this._type === "warning" ? "#333" : "white";
    this.style.padding = "15px 20px";
    this.style.borderRadius = "5px";
    this.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    this.style.zIndex = "1000";
    this.style.opacity = "0";
    this.style.transform = "translateY(20px)";
    this.style.transition = "opacity 0.3s, transform 0.3s";

    const content = this.querySelector(".notification-content");
    content.style.display = "flex";
    content.style.alignItems = "center";
    content.style.justifyContent = "space-between";

    const closeBtn = this.querySelector(".close-btn");
    closeBtn.style.backgroundColor = "transparent";
    closeBtn.style.border = "none";
    closeBtn.style.color = "inherit";
    closeBtn.style.fontSize = "20px";
    closeBtn.style.marginLeft = "10px";
    closeBtn.style.cursor = "pointer";

    closeBtn.addEventListener("click", () => {
      this.closeNotification();
    });
  }

  setupAnimation() {
    setTimeout(() => {
      this.style.opacity = "1";
      this.style.transform = "translateY(0)";
    }, 10);

    setTimeout(() => {
      this.closeNotification();
    }, 3000);
  }

  closeNotification() {
    this.style.opacity = "0";
    this.style.transform = "translateY(20px)";

    setTimeout(() => {
      this.remove();
    }, 300);
  }
}

customElements.define("notify-message", NotifyMessage);
function deleteNote(noteId) {
  if (confirm("Are you sure you want to delete this note?")) {
    const notes = JSON.parse(localStorage.getItem("notes") || "[]");
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    renderAllNotes();
    showNotification("Note deleted successfully!", "danger");
  }
}

function updateNote(noteId, title, body) {
  const notes = JSON.parse(localStorage.getItem("notes") || "[]");
  const noteIndex = notes.findIndex((note) => note.id === noteId);

  if (noteIndex !== -1) {
    notes[noteIndex].title = title;
    notes[noteIndex].body = body;
    localStorage.setItem("notes", JSON.stringify(notes));
  }
}

function editNote(noteId) {
  document.querySelectorAll(".tab")[0].click();
  const noteForm = document.querySelector("note-form");
  if (noteForm) {
    noteForm.setEditingNote(noteId);
  }
}

function toggleArchiveNote(noteId) {
  const notes = JSON.parse(localStorage.getItem("notes") || "[]");
  const noteIndex = notes.findIndex((note) => note.id === noteId);

  if (noteIndex !== -1) {
    notes[noteIndex].archived = !notes[noteIndex].archived;
    localStorage.setItem("notes", JSON.stringify(notes));
    renderAllNotes();

    const action = notes[noteIndex].archived ? "archived" : "unarchived";
    showNotification(`Note ${action} successfully!`, "warning");
  }
}

function showNotification(message, type = "success") {
  const notification = document.createElement("notify-message");
  notification.setAttribute("message", message);
  notification.setAttribute("type", type);
  document.body.appendChild(notification);
}

function renderAllNotes() {
  if (
    document.getElementById("notesContainer") &&
    document.getElementById("archivedContainer")
  ) {
    renderActiveNotes();
    renderArchivedNotes();
    updateNotesCount();
  } else {
    setTimeout(renderAllNotes, 100);
  }
}

function renderActiveNotes() {
  const notesContainer = document.getElementById("notesContainer");
  if (!notesContainer) return;

  const notes = JSON.parse(localStorage.getItem("notes") || "[]");
  const activeNotes = notes.filter((note) => !note.archived);
  renderNotes(notesContainer, activeNotes);
}

function renderArchivedNotes() {
  const archivedContainer = document.getElementById("archivedContainer");
  if (!archivedContainer) return;

  const notes = JSON.parse(localStorage.getItem("notes") || "[]");
  const archivedNotes = notes.filter((note) => note.archived);

  renderNotes(archivedContainer, archivedNotes);
}

function renderNotes(container, notes) {
  container.innerHTML = "";

  if (notes.length === 0) {
    const emptyState = document.createElement("empty-state");
    emptyState.setAttribute("message", "No notes found in this section");
    container.appendChild(emptyState);
    return;
  }

  const sortedNotes = notes.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  sortedNotes.forEach((note) => {
    const noteCard = document.createElement("note-card");
    noteCard.setAttribute("title", note.title);
    noteCard.setAttribute("body", note.body);
    noteCard.setAttribute("date", note.createdAt);
    noteCard.setAttribute("noteid", note.id);
    noteCard.setAttribute("archived", note.archived.toString());

    container.appendChild(noteCard);
  });
}

function updateNotesCount() {
  const activeCountElement = document.getElementById("activeCount");
  const archivedCountElement = document.getElementById("archivedCount");

  if (!activeCountElement || !archivedCountElement) return; // Safety check

  const notes = JSON.parse(localStorage.getItem("notes") || "[]");
  const activeNotes = notes.filter((note) => !note.archived);
  const archivedNotes = notes.filter((note) => note.archived);

  activeCountElement.textContent = activeNotes.length;
  archivedCountElement.textContent = archivedNotes.length;
}

function setupSearch() {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase().trim();

    if (searchTerm === "") {
      renderAllNotes();
      return;
    }

    const notes = JSON.parse(localStorage.getItem("notes") || "[]");
    const filteredActiveNotes = notes.filter(
      (note) =>
        !note.archived &&
        (note.title.toLowerCase().includes(searchTerm) ||
          note.body.toLowerCase().includes(searchTerm))
    );
    const filteredArchivedNotes = notes.filter(
      (note) =>
        note.archived &&
        (note.title.toLowerCase().includes(searchTerm) ||
          note.body.toLowerCase().includes(searchTerm))
    );
    const notesContainer = document.getElementById("notesContainer");
    const archivedContainer = document.getElementById("archivedContainer");

    if (notesContainer) renderNotes(notesContainer, filteredActiveNotes);
    if (archivedContainer)
      renderNotes(archivedContainer, filteredArchivedNotes);
  });
}

function setupThemeToggle() {
  const themeToggle = document.getElementById("themeToggle");
  if (!themeToggle) return;

  const icon = themeToggle.querySelector("i");

  themeToggle.className = "theme-toggle-btn";
  themeToggle.style.padding = "8px 12px";
  themeToggle.style.borderRadius = "5px";
  themeToggle.style.cursor = "pointer";
  themeToggle.style.display = "inline-flex";
  themeToggle.style.alignItems = "center";
  themeToggle.style.gap = "5px";
  themeToggle.style.transition = "all 0.3s";
  themeToggle.style.border = "none";

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
    themeToggle.style.backgroundColor = "#fff";
    themeToggle.style.color = "#1a1a2e";
  } else {
    themeToggle.style.backgroundColor = "var(--primary-color)";
    themeToggle.style.color = "#fff";
  }

  themeToggle.addEventListener("click", (e) => {
    e.preventDefault();
    document.body.classList.toggle("dark-theme");

    if (document.body.classList.contains("dark-theme")) {
      icon.classList.remove("fa-moon");
      icon.classList.add("fa-sun");
      themeToggle.style.backgroundColor = "#fff";
      themeToggle.style.color = "#1a1a2e";
      localStorage.setItem("theme", "dark");
    } else {
      icon.classList.remove("fa-sun");
      icon.classList.add("fa-moon");
      themeToggle.style.backgroundColor = "var(--primary-color)";
      themeToggle.style.color = "#fff";
      localStorage.setItem("theme", "light");
    }

    const themeName = document.body.classList.contains("dark-theme")
      ? "Dark"
      : "Light";
    showNotification(`${themeName} theme applied`, "success");
  });
}

function initApp() {
  if (!localStorage.getItem("notes")) {
    localStorage.setItem("notes", JSON.stringify(notesData));
  }

  setupSearch();
  setupThemeToggle();

  setTimeout(renderAllNotes, 100);

  setTimeout(() => {
    const tabs = document.querySelectorAll(".tab");
    if (tabs.length > 1) {
      tabs[1].click();
    }
  }, 200);
}

document.addEventListener("DOMContentLoaded", initApp);
