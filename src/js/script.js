import api from "../api/note-apps.js";
import "../css/style.css";
import {
  AppHeader,
  NoteForm,
  LoadingIndicator,
  NoteCard,
} from "../components/note-component.js";

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initThemeToggle();
  loadNotes();

  document.addEventListener("refreshNotes", loadNotes);
  document.addEventListener("refreshArchivedNotes", loadArchivedNotes);
  initSearch();
});

function initTabs() {
  const tabs = document.querySelectorAll(".tab");
  const contents = document.querySelectorAll(".content");

  document.getElementById("add-note").classList.add("active");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      contents.forEach((content) => content.classList.remove("active"));
      let contentId;
      if (tab.id === "addNoteTab") {
        contentId = "add-note";
      } else if (tab.id === "viewNotesTab") {
        contentId = "view-notes";
        loadNotes();
      } else if (tab.id === "archivedNotesTab") {
        contentId = "archived-notes";
        loadArchivedNotes();
      }
      document.getElementById(contentId).classList.add("active");
    });
  });
}

function initThemeToggle() {
  const themeToggle = document.getElementById("themeToggle");
  const body = document.body;
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark-theme");
    themeToggle.innerHTML = '<i class="fas fa-sun"></i> Toggle Theme';
  }

  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-theme");
    if (body.classList.contains("dark-theme")) {
      localStorage.setItem("theme", "dark");
      themeToggle.innerHTML = '<i class="fas fa-sun"></i> Toggle Theme';
    } else {
      localStorage.setItem("theme", "light");
      themeToggle.innerHTML = '<i class="fas fa-moon"></i> Toggle Theme';
    }
  });
}

async function loadNotes() {
  const notesContainer = document.getElementById("notesContainer");
  notesContainer.innerHTML = "";
  const loadingIndicator = document.createElement("loading-indicator");
  notesContainer.appendChild(loadingIndicator);

  try {
    const notes = await api.getNotes();
    notesContainer.innerHTML = "";

    if (notes.length === 0) {
      notesContainer.innerHTML =
        '<div class="empty-message">No notes found. Add a new note to get started!</div>';
      return;
    }

    notes.forEach((note) => {
      const noteCard = document.createElement("note-card");
      noteCard.setAttribute("id", note.id);
      noteCard.setAttribute("title", note.title);
      noteCard.setAttribute("body", note.body);
      noteCard.setAttribute("created-at", note.createdAt);
      noteCard.setAttribute("archived", note.archived.toString());
      notesContainer.appendChild(noteCard);
    });
  } catch (error) {
    console.error("Error loading notes:", error);
    notesContainer.innerHTML =
      '<div class="empty-message">Failed to load notes. Please try again later.</div>';
  }
}

async function loadArchivedNotes() {
  const archivedContainer = document.getElementById("archivedContainer");
  archivedContainer.innerHTML = "";
  const loadingIndicator = document.createElement("loading-indicator");
  archivedContainer.appendChild(loadingIndicator);

  try {
    const archivedNotes = await api.getArchivedNotes();
    archivedContainer.innerHTML = "";

    if (archivedNotes.length === 0) {
      archivedContainer.innerHTML =
        '<div class="empty-message">No archived notes found.</div>';
      return;
    }

    archivedNotes.forEach((note) => {
      const noteCard = document.createElement("note-card");
      noteCard.setAttribute("id", note.id);
      noteCard.setAttribute("title", note.title);
      noteCard.setAttribute("body", note.body);
      noteCard.setAttribute("created-at", note.createdAt);
      noteCard.setAttribute("archived", note.archived.toString());
      archivedContainer.appendChild(noteCard);
    });
  } catch (error) {
    console.error("Error loading archived notes:", error);
    archivedContainer.innerHTML =
      '<div class="empty-message">Failed to load archived notes. Please try again later.</div>';
  }
}

function initSearch() {
  const searchInput = document.getElementById("searchInput");

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const noteCards = document.querySelectorAll("#notesContainer note-card");

    noteCards.forEach((card) => {
      const title = card.querySelector(".note-title").textContent.toLowerCase();
      const body = card.querySelector(".note-body").textContent.toLowerCase();

      if (title.includes(searchTerm) || body.includes(searchTerm)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });

    const visibleCards = [...noteCards].filter(
      (card) => card.style.display !== "none"
    );
    if (visibleCards.length === 0 && noteCards.length > 0) {
      if (!document.querySelector("#notesContainer .empty-search-message")) {
        const emptyMessage = document.createElement("div");
        emptyMessage.className = "empty-message empty-search-message";
        emptyMessage.textContent = `No notes found matching "${searchTerm}"`;
        document.getElementById("notesContainer").appendChild(emptyMessage);
      }
    } else {
      const emptyMessage = document.querySelector(
        "#notesContainer .empty-search-message"
      );
      if (emptyMessage) {
        emptyMessage.remove();
      }
    }
  });
}
