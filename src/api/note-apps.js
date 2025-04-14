const BASE_URL = "https://notes-api.dicoding.dev/v2";

const api = {
  async getNotes() {
    const response = await fetch(`${BASE_URL}/notes`);
    const result = await response.json();
    return result.data || [];
  },

  async getArchivedNotes() {
    const response = await fetch(`${BASE_URL}/notes/archived`);
    const result = await response.json();
    return result.data || [];
  },

  async getSingleNote(id) {
    const response = await fetch(`${BASE_URL}/notes/${id}`);
    const result = await response.json();
    return result.data;
  },

  async createNote(note) {
    const response = await fetch(`${BASE_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    });
    const result = await response.json();
    return result;
  },

  async archiveNote(id) {
    const response = await fetch(`${BASE_URL}/notes/${id}/archive`, {
      method: "POST",
    });
    const result = await response.json();
    return result;
  },

  async unarchiveNote(id) {
    const response = await fetch(`${BASE_URL}/notes/${id}/unarchive`, {
      method: "POST",
    });
    const result = await response.json();
    return result;
  },

  async deleteNote(id) {
    const response = await fetch(`${BASE_URL}/notes/${id}`, {
      method: "DELETE",
    });
    const result = await response.json();
    return result;
  },
};

export default api;
