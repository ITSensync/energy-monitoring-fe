import { defineStore } from "pinia";

const storageKey = "energy-auth-session";
const validUsers = [
  {
    username: "admin",
    password: "admin123",
    displayName: "Administrator",
  },
  {
    username: "user",
    password: "user123",
    displayName: "Operator",
  },
];

function saveSession(session) {
  localStorage.setItem(storageKey, JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem(storageKey);
}

function loadSession() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;

    const session = JSON.parse(raw);
    if (!session || typeof session.expiresAt !== "number") return null;

    if (Date.now() > session.expiresAt) {
      clearSession();
      return null;
    }

    return session;
  } catch (error) {
    clearSession();
    return null;
  }
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isLoggedIn: false,
    username: "",
    displayName: "",
    errorMessage: "",
  }),

  actions: {
    login(username, password) {
      const user = validUsers.find(
        (item) => item.username === username && item.password === password
      );

      if (user) {
        this.isLoggedIn = true;
        this.username = user.username;
        this.displayName = user.displayName;
        this.errorMessage = "";

        saveSession({
          username: user.username,
          displayName: user.displayName,
          expiresAt: Date.now() + 12 * 60 * 60 * 1000,
        });

        return true;
      }

      this.isLoggedIn = false;
      this.username = "";
      this.displayName = "";
      this.errorMessage = "Username atau password salah.";
      clearSession();
      return false;
    },

    logout() {
      this.isLoggedIn = false;
      this.username = "";
      this.displayName = "";
      this.errorMessage = "";
      clearSession();
    },

    restoreSession() {
      const session = loadSession();
      if (!session) {
        this.logout();
        return false;
      }

      this.isLoggedIn = true;
      this.username = session.username;
      this.displayName = session.displayName;
      this.errorMessage = "";
      return true;
    },
  },
});
