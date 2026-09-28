const Chat = require("./modules/chat/chat.model");
const Message = require("./modules/message/message.model");
const User = require("./modules/user/user.model");
const Notification = require("./modules/notification/notification.model");

function initSocket(io) {
  io.on("connection", (socket) => {
    console.log("A user connected");

    // Join chat room
    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
      console.log("User joined chatId:", chatId);
    });

    // Join notification room
    socket.on("joinNotification", (userId) => {
      socket.join(userId);
      console.log("User joined notification room:", userId);
    });

    // Send message
    socket.on("sendMessage", async (data) => {
      let { chatId, senderId, receiverId, message, image } = data;

      try {
        const chatDoc = await Chat.findById(chatId);
        if (!chatDoc) return;

        if (!receiverId) {
          const otherParticipant = chatDoc.participants.find(
            (p) => p.userId && p.userId.toString() !== senderId.toString()
          );
          if (otherParticipant) {
            receiverId = otherParticipant.userId.toString();
          }
        }

        const newMessage = await Message.create({
          senderId,
          receiverId,
          message,
          image,
          chat: chatId,
        });

        await Chat.findByIdAndUpdate(chatId, { lastMessage: newMessage._id });

        const senderUser = await User.findById(senderId);
        const receiverUser = await User.findById(receiverId);
        const senderName = senderUser?.name || "Someone";
        const receiverType = receiverUser?.userType || "user";

        const existingNotification = await Notification.findOne({
          receiverId,
          type: "new_message",
          "metadata.chatId": chatId,
          isRead: false,
        });

        let notificationDoc;
        if (existingNotification) {
          existingNotification.senderId = senderId;
          existingNotification.message = `${senderName} sent you a new message.`;
          existingNotification.metadata.messageId = newMessage._id;
          existingNotification.userType = receiverType;
          notificationDoc = await existingNotification.save();
        } else {
          notificationDoc = await Notification.create({
            senderId,
            receiverId,
            userType: receiverType,
            type: "new_message",
            title: "New Message",
            message: `${senderName} sent you a message.`,
            metadata: {
              chatId,
              messageId: newMessage._id,
            },
          });
        }

        // Send message to chat room
        io.to(chatId).emit("newMessage", newMessage);

        // Send notification to receiver room
        if (receiverId) {
          io.to(receiverId.toString()).emit("new_notification", notificationDoc);
          io.to(receiverId.toString()).emit("notification", notificationDoc);
        }
      } catch (err) {
        console.log("sendMessageErr:", err.message);
      }
    });

    // Mark message as read
    socket.on("readMessage", async ({ messageId, userId }) => {
      try {
        await Message.findByIdAndUpdate(messageId, {
          $addToSet: { isReadBy: userId },
        });
        io.to(messageId).emit("messageRead", { messageId, userId });
      } catch (err) {
        console.error("readMessage error:", err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
}

module.exports = { initSocket };
