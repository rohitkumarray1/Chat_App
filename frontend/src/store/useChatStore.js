import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false, // Fixed typo from isMassagesLoading to isMessagesLoading

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  deleteMessage: async (messagesToDelete) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) {
      console.error("No selected user found");
      return;
    }

    try {
      const messageIds = messagesToDelete.map((msg) => msg._id);
      await axiosInstance.post(`/messages/delete/${selectedUser._id}`, {
        messageIds,
      });

      // Update messages state after successful deletion
      set({
        messages: messages.filter((msg) => !messageIds.includes(msg._id)),
      });
    } catch (error) {
      console.error("Error deleting messages:", error.message);
      return { error: "Failed to delete messages" };
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    // Listen for new messages
    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) return;

      set({ messages: [...get().messages, newMessage] });
    });

    // ✅ Listen for deleted messages
    socket.on("messageDeleted", ({ messageIds }) => {
      set({
        messages: get().messages.filter((msg) => !messageIds.includes(msg._id)),
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("messageDeleted"); // ✅ Remove listener when unsubscribing
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
