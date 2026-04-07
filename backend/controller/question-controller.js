import Question from "../models/question-model.js";

// @desc    Toggle or set pinned state for a question
// @route   PATCH /api/questions/:id/pin
// @access  Private
export const togglePin = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate({
      path: "session",
      select: "user",
    });

    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    if (question.session?.user?.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    if (typeof req.body?.isPinned === "boolean") {
      question.isPinned = req.body.isPinned;
    } else {
      question.isPinned = !question.isPinned;
    }

    await question.save();

    res.status(200).json({ success: true, question });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
