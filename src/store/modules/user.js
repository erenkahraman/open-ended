import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    currentUser: null,
    currentDateTime: "",
    isTeacher: false,
    error: null,
    isLoading: false,
    lastActivity: null
  }),

  getters: {
    formattedDateTime: state => {
      if (!state.currentDateTime) return "";
      return new Date(state.currentDateTime).toLocaleString("en-US", {
        timeZone: "UTC",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      }) + " UTC";
    },
    
    isAuthenticated: state => Boolean(state.currentUser),
    isSessionActive: state => {
      if (!state.lastActivity) return false;
      const inactiveTime = Date.now() - state.lastActivity;
      return inactiveTime < 30 * 60 * 1000; // 30 minutes
    }
  },

  actions: {
    async initializeUser(username) {
      if (!username?.trim()) {
        throw new Error("Username is required");
      }

      try {
        this.isLoading = true;
        this.error = null;
        this.currentUser = username.trim();
        this.lastActivity = Date.now();
        await this.updateDateTime();
      } catch (error) {
        this.error = error.message;
        console.error("Failed to initialize user:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async updateDateTime() {
      try {
        this.currentDateTime = new Date().toISOString();
      } catch (error) {
        this.error = "Failed to update date time";
        console.error("Failed to update datetime:", error);
      }
    },

    updateActivity() {
      this.lastActivity = Date.now();
    },

    setUserRole(isTeacher) {
      this.isTeacher = Boolean(isTeacher);
    },

    clearError() {
      this.error = null;
    },

    logout() {
      this.currentUser = null;
      this.isTeacher = false;
      this.currentDateTime = "";
      this.error = null;
      this.lastActivity = null;
    }
  }
});