// backend/controllers/message.controller.js

import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { encryptValue, decryptValue } from "../lib/crypto.js";

/* -------------------------------------------------------
   GET USERS FOR SIDEBAR (with decrypted profilePic)
---------------------------------------------------------*/
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const users = await User.find({ _id: { $ne: loggedInUserId } })
      .select("-password");

    const cleanedUsers = users.map((u) => ({
      ...u._doc,
      profilePic: u.profilePic ? decryptValue(u.profilePic) : null,
    }));

    res.status(200).json(cleanedUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/* -------------------------------------------------------
   GET CHAT MESSAGES (decrypt messages + images)
---------------------------------------------------------*/
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    const decrypted = messages.map((msg) => ({
      ...msg._doc,
      text: msg.text ? decryptValue(msg.text) : null,
      image: msg.image ? decryptValue(msg.image) : null,
    }));

    res.status(200).json(decrypted);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/* -------------------------------------------------------
   SEND MESSAGE (encrypt before storing)
---------------------------------------------------------*/
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl = null;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    // Encrypt before saving to MongoDB
    const encryptedText = text ? encryptValue(text) : null;
    const encryptedImage = imageUrl ? encryptValue(imageUrl) : null;

    const newMessage = new Message({
      senderId,
      receiverId,
      text: encryptedText,
      image: encryptedImage,
    });

    await newMessage.save();

    // Send decrypted message live over socket
    const plainMessage = {
      ...newMessage._doc,
      text: text || null,
      image: imageUrl || null,
    };

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", plainMessage);
    }

    res.status(201).json(plainMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
