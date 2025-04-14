import api from "../api/note-apps.js";

class AppHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header class="container">
        <h1>Notes App</h1>
        <div class="tab-container">
          <button id="addNoteTab" class="tab active">
            <i class="fas fa-plus"></i> Add Note
          </button>
          <button id="viewNotesTab" class="tab">
            <i class="fas fa-list"></i> View Notes
          </button>
          <button id="archivedNotesTab" class="tab">
            <i class="fas fa-archive"></i> Archived Notes
          </button>
        </div>
        <button id="themeToggle" class="theme-toggle-btn">
          <i class="fas fa-moon"></i> Toggle Theme
        </button>
      </header>
    `;
  }
}

class NoteForm extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <form class="note-form" id="noteForm">
          <h2>Add New Note</h2>
          <div class="form-group">
            <label for="title">Title</label>
            <input type="text" id="title" class="form-control" required maxlength="50">
            <span class="validation-message"></span>
          </div>
          <div class="form-group">
            <label for="body">Content</label>
            <textarea id="body" class="form-control" required></textarea>
            <span class="validation-message"></span>    
          </div>
          <button type="submit" class="btn">
            <i class="fas fa-save"></i> Save Note
          </button>
        </form>
      `;
  
      this.querySelector("#noteForm").addEventListener(
        "submit",
        this.handleSubmit
      );
      
      gsap.from(this.querySelector('form'), {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power2.out"
      });
      
      const submitBtn = this.querySelector('button[type="submit"]');
      submitBtn.addEventListener('mouseenter', () => {
        gsap.to(submitBtn, {
          scale: 1.05,
          duration: 0.2
        });
      });
      
      submitBtn.addEventListener('mouseleave', () => {
        gsap.to(submitBtn, {
          scale: 1,
          duration: 0.2
        });
      });
    }
  
    async handleSubmit(e) {
      e.preventDefault();
      const titleInput = document.getElementById("title");
      const bodyInput = document.getElementById("body");
  
      if (titleInput.value.trim() === "" || bodyInput.value.trim() === "") {
        alert("Please fill all fields");
        return;
      }
  
      const noteData = {
        title: titleInput.value,
        body: bodyInput.value,
      };
  
      const submitBtn = e.target.querySelector('button[type="submit"]');
      const originalContent = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
      submitBtn.disabled = true;
      
      gsap.to(submitBtn, {
        scale: 0.95,
        duration: 0.2
      });
  
      try {
        await api.createNote(noteData);
        titleInput.value = "";
        bodyInput.value = "";
                
        gsap.to(submitBtn, {
          backgroundColor: "#4caf50",
          duration: 0.3,
          yoyo: true,
          repeat: 1
        });
  
        alert("Note created successfully!");
        if (document.getElementById("view-notes").classList.contains("active")) {
          document.dispatchEvent(new CustomEvent("refreshNotes"));
        }
      } catch (error) {
        console.error("Error creating note:", error);
                
        gsap.to(submitBtn, {
          backgroundColor: "#f44336",
          duration: 0.3,
          yoyo: true,
          repeat: 1
        });
        
        alert("Failed to create note. Please try again.");
      } finally {
        submitBtn.innerHTML = originalContent;
        submitBtn.disabled = false;
        gsap.to(submitBtn, {
          scale: 1,
          duration: 0.2
        });
      }
    }
  }

class LoadingIndicator extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <div class="loading-indicator">
          <i class="fas fa-spinner fa-spin fa-3x"></i>
          <p>Loading...</p>
        </div>
      `;
      this.style.display = "flex";
      this.style.justifyContent = "center";
      this.style.alignItems = "center";
      this.style.flexDirection = "column";
      this.style.padding = "40px";
      this.style.color = "var(--primary-color)";

      const spinner = this.querySelector('.fa-spinner');
      setTimeout(() => {
        gsap.to(spinner, {
          scale: 1.2,
          duration: 0.8,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut"
        });
        
        gsap.to(this.querySelector('p'), {
          opacity: 0.6,
          duration: 1,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut"
        });
      }, 10);
    }
  }

class NoteCard extends HTMLElement {
    connectedCallback() {
      const id = this.getAttribute("id");
      const title = this.getAttribute("title") || "Untitled";
      const body = this.getAttribute("body") || "No content";
      const createdAt =
        this.getAttribute("created-at") || new Date().toISOString();
      const archived = this.getAttribute("archived") === "true";
  
      const dateObj = new Date(createdAt);
      const formattedDate = dateObj.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
  
      this.innerHTML = `
        <div class="note-title">${title}</div>
        <div class="note-date">${formattedDate}</div>
        <div class="note-body">${body}</div>
        <div class="note-actions">
          ${
            archived
              ? `<button class="action-btn unarchive-btn" data-id="${id}">
              <i class="fas fa-box-open"></i> Unarchive
            </button>`
              : `<button class="action-btn archive-btn" data-id="${id}">
              <i class="fas fa-archive"></i> Archive
            </button>`
          }
          <button class="action-btn delete-btn" data-id="${id}">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      `;
  
      this.querySelector(".delete-btn").addEventListener(
        "click",
        this.handleDelete.bind(this)
      );
  
      const archiveButton = this.querySelector(".archive-btn");
      if (archiveButton) {
        archiveButton.addEventListener("click", this.handleArchive.bind(this));
      }
  
      const unarchiveButton = this.querySelector(".unarchive-btn");
      if (unarchiveButton) {
        unarchiveButton.addEventListener(
          "click",
          this.handleUnarchive.bind(this)
        );
      }
      
      this.style.opacity = "0";
      this.style.transform = "translateY(20px)";
      
      setTimeout(() => {
        gsap.to(this, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out"
        });
      }, 10);
    }
  
    async handleDelete(e) {
      const id = e.currentTarget.getAttribute("data-id");
      if (confirm("Are you sure you want to delete this note?")) {
        const button = e.currentTarget;
        const originalContent = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting...';
        button.disabled = true;
  
        try {
          await api.deleteNote(id);
          
          gsap.to(this, {
            opacity: 0,
            y: -20,
            duration: 0.3,
            onComplete: () => {
              this.remove();
              this.checkEmptyContainer();
            }
          });
          
        } catch (error) {
          console.error("Error deleting note:", error);
          alert("Failed to delete note. Please try again.");
          button.innerHTML = originalContent;
          button.disabled = false;
        }
      }
    }
  
    async handleArchive(e) {
      const id = e.currentTarget.getAttribute("data-id");
      const button = e.currentTarget;
      const originalContent = button.innerHTML;
      button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Archiving...';
      button.disabled = true;
  
      try {
        await api.archiveNote(id);
        
        gsap.to(this, {
          opacity: 0,
          x: 100,
          duration: 0.4,
          onComplete: () => {
            this.remove();
            if (
              document.getElementById("archived-notes").classList.contains("active")
            ) {
              document.dispatchEvent(new CustomEvent("refreshArchivedNotes"));
            }
            this.checkEmptyContainer();
          }
        });
        
      } catch (error) {
        console.error("Error archiving note:", error);
        alert("Failed to archive note. Please try again.");
        button.innerHTML = originalContent;
        button.disabled = false;
      }
    }
  
    async handleUnarchive(e) {
      const id = e.currentTarget.getAttribute("data-id");
      const button = e.currentTarget;
      const originalContent = button.innerHTML;
      button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Unarchiving...';
      button.disabled = true;
  
      try {
        await api.unarchiveNote(id);
        
        gsap.to(this, {
          opacity: 0,
          x: -100,
          duration: 0.4,
          onComplete: () => {
            this.remove();
            if (document.getElementById("view-notes").classList.contains("active")) {
              document.dispatchEvent(new CustomEvent("refreshNotes"));
            }
            this.checkEmptyContainer();
          }
        });
        
      } catch (error) {
        console.error("Error unarchiving note:", error);
        alert("Failed to unarchive note. Please try again.");
        button.innerHTML = originalContent;
        button.disabled = false;
      }
    }
  
    checkEmptyContainer() {
      const notesContainer = document.getElementById("notesContainer");
      if (notesContainer && notesContainer.children.length === 0) {
        notesContainer.innerHTML =
          '<div class="empty-message">No notes found. Add a new note to get started!</div>';
      }
      const archivedContainer = document.getElementById("archivedContainer");
      if (archivedContainer && archivedContainer.children.length === 0) {
        archivedContainer.innerHTML =
          '<div class="empty-message">No archived notes found.</div>';
      }
    }
  }

customElements.define("app-header", AppHeader);
customElements.define("note-form", NoteForm);
customElements.define("loading-indicator", LoadingIndicator);
customElements.define("note-card", NoteCard);

export { AppHeader, NoteForm, LoadingIndicator, NoteCard };