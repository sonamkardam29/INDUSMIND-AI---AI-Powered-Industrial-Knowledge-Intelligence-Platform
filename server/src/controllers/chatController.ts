import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ChatModel } from '../models/Chat';
import { executeRAGQuery } from '../services/ragService';

export const sendChatMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { chatId, question, department } = req.body;

    if (!question) {
      return res.status(400).json({ message: 'Question parameter is required.' });
    }

    const userId = req.user?.id || '65a1234567890abcdef12345';

    let chat;
    if (chatId) {
      chat = await ChatModel.findById(chatId).exec();
    }

    if (!chat) {
      chat = new ChatModel({
        userId,
        title: question.substring(0, 40) + '...',
        department: department || 'General',
        messages: [],
      });
    }

    // Append User Message
    const userMsgId = 'msg-' + Date.now() + '-user';
    chat.messages.push({
      id: userMsgId,
      sender: 'user',
      content: question,
      timestamp: new Date(),
    });

    // Execute RAG Pipeline with Citation & Confidence calculation
    const ragResult = await executeRAGQuery(question, department);

    // Append Assistant Message
    const assistantMsgId = 'msg-' + Date.now() + '-ai';
    chat.messages.push({
      id: assistantMsgId,
      sender: 'assistant',
      content: ragResult.answer,
      confidenceScore: ragResult.confidenceScore,
      citations: ragResult.citations,
      sourceDocs: ragResult.sourceDocs,
      pageNumbers: ragResult.pageNumbers,
      relatedDocs: ragResult.relatedDocs,
      timestamp: new Date(),
    });

    await chat.save();

    return res.json({
      chatId: chat._id,
      title: chat.title,
      message: chat.messages[chat.messages.length - 1],
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getChats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || '65a1234567890abcdef12345';
    const chats = await ChatModel.find({ userId }).sort({ updatedAt: -1 }).select('title department messages createdAt').exec();
    return res.json({ chats });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getChatById = async (req: AuthRequest, res: Response) => {
  try {
    const chat = await ChatModel.findById(req.params.id).exec();
    if (!chat) return res.status(404).json({ message: 'Chat history not found.' });
    return res.json({ chat });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const bookmarkMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { chatId, messageId } = req.body;
    const chat = await ChatModel.findById(chatId).exec();
    if (!chat) return res.status(404).json({ message: 'Chat not found.' });

    const msg = chat.messages.find(m => m.id === messageId);
    if (msg) {
      msg.isBookmarked = !msg.isBookmarked;
      await chat.save();
    }

    return res.json({ message: 'Bookmark status toggled.', isBookmarked: msg?.isBookmarked });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
