import Question from "../models/question-model.js";
import Session from "../models/session-model.js";

// @desc    Create a new session and linked questions
// @route   POST /api/sessions/create
// @access  Private
export const createSession = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, description, questions } = req.body;
    const userId = req.user._id; // Assuming you have a middleware setting req.user

    if (!role || !experience) {
      return res.status(400).json({
        success: false,
        message: "Role and experience are required",
      });
    }

    let topicsArray = [];
    if (Array.isArray(topicsToFocus)) {
      topicsArray = topicsToFocus.map((topic) => String(topic).trim()).filter(Boolean);
    } else if (typeof topicsToFocus === "string") {
      topicsArray = topicsToFocus
        .split(",")
        .map((topic) => topic.trim())
        .filter(Boolean);
    }

    // Create the session
    const session = await Session.create({
      user: userId,
      role,
      experience,
      topicsToFocus: topicsArray,
      description: description || "",
    });

    // Create questions and collect their IDs
    const incomingQuestions = Array.isArray(questions) ? questions : [];
    const questionDocs = await Promise.all(
      incomingQuestions.map(async (q) => {
        const question = await Question.create({
          session: session._id,
          question: q.question,
          answer: q.answer || "",
          note: q.note || "",
          isPinned: q.isPinned || false,
        });
        return question._id;
      }),
    );

    // Update session with question IDs
    if (questionDocs.length) {
      session.questions = questionDocs;
      await session.save();
    }

    // Return the populated session
    // const populatedSession = await Session.findById(session._id).populate(
    //   "questions",
    // );

    // res.status(201).json({
    //   success: true,
    //   data: populatedSession,
    // });
    res.status(201).json({
      success: true,
      session,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get all sessions for the logged-in user
// @route   GET /api/sessions/my-sessions
// @access  Private
export const getMySessions = async (req, res) => {
  try {
    const userId = req.user._id;

    const sessions = await Session.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("questions");

    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get a session by ID with populated questions
// @route   GET /api/sessions/:id
// @access  Private
export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate("questions")
      .populate("user", "name email");

    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    // Check if the session belongs to the logged-in user
    if (session.user._id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Delete a session and its questions
// @route   DELETE /api/sessions/:id
// @access  Private
export const deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    if (session.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    await Question.deleteMany({ session: session._id });
    await Session.findByIdAndDelete(session._id);

    res.status(200).json({ success: true, message: "Session deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

