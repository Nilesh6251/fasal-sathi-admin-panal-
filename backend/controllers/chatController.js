// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHATBOT CONTROLLER (Groq AI)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const prisma = require('../config/database');
const ApiResponse = require('../utils/apiResponse');
const { parsePagination, buildPaginationMeta } = require('../utils/helpers');
const config = require('../config');

// Groq AI setup
let groq = null;
try {
  const Groq = require('groq-sdk');
  if (config.groq.apiKey && config.groq.apiKey !== 'your_groq_api_key_here') {
    groq = new Groq({ apiKey: config.groq.apiKey });
  }
} catch (e) {
  console.warn('Groq AI not configured:', e.message);
}

const SYSTEM_PROMPT = `You are "Fasal Sathi AI" - an expert agriculture assistant for Indian farmers.
You help with: crop farming, soil health, pest control, weather, government schemes, mandi prices, organic farming.
Always respond in the user's language (Hindi/English). Be practical and concise.
If a question is not agriculture-related, politely redirect to farming topics.`;

const sendMessage = async (req, res, next) => {
  try {
    const { message, language, category } = req.body;
    if (!message) return ApiResponse.badRequest(res, 'Message is required.');

    let aiResponse = 'AI service not configured. Please set GROQ_API_KEY in .env file.';

    if (groq) {
      try {
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: message },
          ],
          model: 'llama-3.3-70b-versatile',
          temperature: 0.7,
          max_tokens: 1024,
        });
        aiResponse = chatCompletion.choices[0]?.message?.content || 'No response generated.';
      } catch (aiError) {
        console.error('Groq AI Error:', aiError.message);
        aiResponse = 'AI is temporarily unavailable. Please try again.';
      }
    }

    // Save user message
    await prisma.chat.create({
      data: { userId: req.user.id, message, role: 'user', category: category || 'general', language: language || 'hi' },
    });

    // Save AI response
    const chat = await prisma.chat.create({
      data: { userId: req.user.id, message: aiResponse, role: 'assistant', category: category || 'general', language: language || 'hi' },
    });

    return ApiResponse.success(res, { message: aiResponse, chatId: chat.id }, 'Response generated.');
  } catch (error) { next(error); }
};

const getChatHistory = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const where = { userId: req.user.id };
    const [chats, total] = await Promise.all([
      prisma.chat.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.chat.count({ where }),
    ]);
    return ApiResponse.paginated(res, chats.reverse(), buildPaginationMeta(total, page, limit));
  } catch (error) { next(error); }
};

const getAllChats = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { userId, category } = req.query;
    const where = {};
    if (userId) where.userId = userId;
    if (category) where.category = category;
    const [chats, total] = await Promise.all([
      prisma.chat.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } } },
      }),
      prisma.chat.count({ where }),
    ]);
    return ApiResponse.paginated(res, chats, buildPaginationMeta(total, page, limit));
  } catch (error) { next(error); }
};

const getChatAnalytics = async (req, res, next) => {
  try {
    const totalChats = await prisma.chat.count();
    const totalUsers = await prisma.chat.groupBy({ by: ['userId'], _count: true });
    const byCategory = await prisma.chat.groupBy({ by: ['category'], _count: { id: true } });
    const todayChats = await prisma.chat.count({
      where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
    });

    return ApiResponse.success(res, {
      totalChats,
      totalChatUsers: totalUsers.length,
      todayChats,
      byCategory: byCategory.map(c => ({ category: c.category || 'general', count: c._count.id })),
    });
  } catch (error) { next(error); }
};

const deleteChat = async (req, res, next) => {
  try {
    await prisma.chat.deleteMany({ where: { userId: req.params.userId } });
    return ApiResponse.success(res, null, 'Chat history deleted.');
  } catch (error) { next(error); }
};

module.exports = { sendMessage, getChatHistory, getAllChats, getChatAnalytics, deleteChat };
