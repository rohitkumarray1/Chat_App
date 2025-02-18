import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, SmilePlus } from "lucide-react";
import toast from "react-hot-toast";
import Picker from "emoji-picker-react";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  // Toggle Emoji Picker
  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  // Handle Emoji Selection
  const handleEmojiClick = (emojiObject) => {
    setText((prev) => prev + emojiObject.emoji);
  };

  // Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Remove Image Preview
  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Send Message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
        emoji: selectedEmoji,
      });

      // Reset state after sending
      setText("");
      setImagePreview(null);
      setSelectedEmoji(null);
      setShowEmojiPicker(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full rounded-lg">
      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
            >
              <X className="text-zinc-700" />
            </button>
          </div>
        </div>
      )}

      {/* Message Input Form */}
      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-2 relative p-2 rounded-lg border border-zinc-700"
      >
        <div className="flex-1 flex items-center gap-2">
          {/* Emoji Button */}
          <button
            type="button"
            onClick={toggleEmojiPicker}
            className="text-zinc-400 hover:text-zinc-600"
          >
            <SmilePlus size={22} />
          </button>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="absolute bottom-full mb-2 overflow-auto left-0 z-10 bg-white shadow-md rounded-lg w-full md:w-auto h-[300px]">
              <Picker
                onEmojiClick={(emoji) => handleEmojiClick(emoji)}
                pickerStyle={{
                  fontSize: "3px",
                }}
              />
            </div>
          )}

          {/* Text Input */}
          <input
            type="text"
            className="w-full h-10 px-4 bg-transparent border-none outline-none placeholder:text-zinc-400"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {/* Hidden File Input */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          {/* Image Upload Button */}
          <button
            type="button"
            className="text-zinc-400 hover:text-zinc-600"
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={22} />
          </button>
        </div>

        {/* Send Button */}
        <button
          type="submit"
          className="p-2 bg-blue-500 rounded-full hover:bg-blue-600 disabled:bg-zinc-600"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} className="text-white" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
