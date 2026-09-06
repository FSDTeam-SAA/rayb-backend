const messageService = require("./message.service");

const sendMessage = async (req, res, next) => {
  try {
    const result = await messageService.sendMessage(req.body, req.files);

    const io = req.app.get("io");
    if (io) {
      if (result.chat) {
        io.to(result.chat.toString()).emit("newMessage", result);
      }
      if (result.receiverId && result.notification) {
        io.to(result.receiverId.toString()).emit("new_notification", result.notification);
        io.to(result.receiverId.toString()).emit("notification", result.notification);
      }
    }

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getMessage = async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    const { businessId } = req.query;
    const result = await messageService.getMessages(chatId, businessId, userId);

    return res.status(200).json({
      success: true,
      message: "Messages retrieved successfully",
      data: result,
    });
  } catch (error) {
    throw new Error(error);
  }
};

const getSenderMessages = async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    const result = await messageService.getSenderMessages(chatId, userId);

    return res.status(200).json({
      success: true,
      message: "Messages retrieved successfully",
      data: result,
    });
  } catch (error) {
    throw new Error(error);
  }
};

const messageController = {
  sendMessage,
  getMessage,
  getSenderMessages,
};

module.exports = messageController;
