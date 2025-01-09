import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    currentUser: "erenkahraman",
    currentDateTime: "",
    isTeacher: false,
  }),

  actions: {
    updateDateTime() {
      const now = new Date();
      this.currentDateTime =
        now.toLocaleString("en-US", {
          timeZone: "UTC",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }) + " UTC";
    },

    setUserRole(isTeacher) {
      this.isTeacher = isTeacher;
    },
  },
});