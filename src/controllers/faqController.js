const faqData = [
  {
    keywords: ["policy", "policies", "rules"],
    answer: "Our policy ensures that all items stored in the lockers are safe. Hazardous materials, weapons, and illegal substances are strictly prohibited."
  },
  {
    keywords: ["refund", "cancel", "money back"],
    answer: "You can cancel your booking up to 24 hours in advance for a full refund. Cancellations made within 24 hours are non-refundable."
  },
  {
    keywords: ["time", "late", "overtime", "extend"],
    answer: "If you exceed your booked time slot, you will be charged an additional fee of ₹10 per hour. Please ensure you empty your locker on time."
  },
  {
    keywords: ["lost", "forgot", "password", "mpin"],
    answer: "If you forget your MPIN, you can reset it from the Wallet dashboard by providing a new 4-digit PIN."
  },
  {
    keywords: ["terms", "condition", "agreement"],
    answer: "By using SmartVault, you agree to our Terms and Conditions. We are not liable for any perishable goods that spoil inside the lockers. For full terms, please contact support."
  }
];

exports.askFaq = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ answer: "Please ask a question." });
    }

    const lowerQ = question.toLowerCase();
    
    // Simple Keyword matching (Simulated RAG)
    let bestMatch = null;
    let maxMatches = 0;

    for (const item of faqData) {
      let matches = 0;
      for (const keyword of item.keywords) {
        if (lowerQ.includes(keyword)) {
          matches++;
        }
      }
      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatch = item;
      }
    }

    if (bestMatch) {
      return res.json({ answer: bestMatch.answer });
    }

    // Default response if no keywords match
    res.json({ answer: "I'm sorry, I couldn't find an answer to that in our policies or FAQs. Please contact support for further assistance." });
  } catch (err) {
    res.status(500).json({ answer: "An error occurred while processing your question." });
  }
};
