/**
 * Simple chatbot controller - works without database
 */
export const handleChatMessage = async (req, res) => {
  try {
    const { message } = req.body;

    console.log('📨 Received message:', message); // Debug log

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const lowerMessage = message.toLowerCase().trim();
    let response = '';
    let suggestions = [];

    // ========== GREETING ==========
    if (lowerMessage.match(/^(hi|hello|hey|good morning|good evening|greetings|hola)/)) {
      response = `Hello! 👋 Welcome to Campus Event Hub. I can help you with:
      
- Finding upcoming events
- Registration process
- Event categories
- Dashboard features
- General questions

What would you like to know?`;
      
      suggestions = ["Show upcoming events", "How to register", "Event categories", "My dashboard"];
    }

    // ========== EVENTS ==========
    else if (lowerMessage.includes('event') || lowerMessage.includes('upcoming') || lowerMessage.includes('show')) {
      response = `📅 **Upcoming Events:**

We have exciting events coming up! Here's what you can do:

1️⃣ **Browse Events** - Visit the Events page to see all available events
2️⃣ **Filter by Category** - Sports, Tech, Cultural, Workshops
3️⃣ **Register Instantly** - Click any event to register

Visit the Events page to explore all opportunities! 🎉`;
      
      suggestions = ["How to register", "Event categories", "Go to events page", "Popular events"];
    }

    // ========== REGISTRATION ==========
    else if (lowerMessage.includes('register') || lowerMessage.includes('sign up') || lowerMessage.includes('how to join')) {
      response = `📝 **How to Register for Events:**

**Easy 5-Step Process:**

1️⃣ Go to **Events Page**
2️⃣ Browse and select an event
3️⃣ Click **"Register"** button
4️⃣ Fill in your details
5️⃣ Confirm registration ✅

You'll receive a confirmation email immediately!

**Note:** Make sure you're logged in before registering.`;
      
      suggestions = ["Show events", "Login help", "My registrations", "Event categories"];
    }

    // ========== CATEGORIES ==========
    else if (lowerMessage.includes('categor') || lowerMessage.includes('type') || lowerMessage.includes('kind')) {
      response = `📚 **Event Categories:**

🏆 **Sports** - Tournaments, championships, fitness events
💻 **Hackathons** - Coding competitions, tech challenges  
🎭 **Cultural** - Fests, performances, art exhibitions
📖 **Workshops** - Skill-building, training sessions
🎤 **Seminars** - Guest lectures, conferences
🎉 **Social** - Networking, club activities

Filter events by category to find what interests you!`;
      
      suggestions = ["Sports events", "Tech events", "Cultural events", "All events"];
    }

    // ========== MY REGISTRATIONS ==========
    else if (lowerMessage.includes('my') && (lowerMessage.includes('event') || lowerMessage.includes('registration'))) {
      response = `🎯 **Your Registrations:**

To view your registered events:

1️⃣ Go to your **Dashboard**
2️⃣ Click **"My Registrations"**
3️⃣ See all your events with status

From there you can:
✅ View event details
✅ Check registration status  
✅ Download certificates (for completed events)
✅ Cancel registrations (if needed)

**Note:** You need to be logged in!`;
      
      suggestions = ["Go to dashboard", "Login", "Browse events", "How to cancel"];
    }

    // ========== DASHBOARD ==========
    else if (lowerMessage.includes('dashboard') || lowerMessage.includes('profile')) {
      response = `🎛️ **Your Dashboard - Control Center:**

Your personalized dashboard includes:

📊 **Overview** - Stats and quick info
📅 **Registered Events** - Your upcoming events
✅ **Completed Events** - Past participations
🏆 **Certificates** - Download your achievements
⭐ **Recommendations** - Events you might like
⚙️ **Settings** - Manage your profile

Access it from the navigation menu anytime!`;
      
      suggestions = ["Go to dashboard", "My events", "Edit profile", "Certificates"];
    }

    // ========== CERTIFICATES ==========
    else if (lowerMessage.includes('certificate') || lowerMessage.includes('completion')) {
      response = `🏆 **Event Certificates:**

**How to Get Certificates:**

1️⃣ Register for an event
2️⃣ Attend the event
3️⃣ Event admin marks you as "completed"
4️⃣ Certificate appears in your dashboard
5️⃣ Download as PDF anytime! 📄

Certificates include:
✅ Event details
✅ Your name
✅ Date of completion
✅ Official stamps

Boost your resume with event certificates!`;
      
      suggestions = ["My certificates", "Completed events", "Browse events"];
    }

    // ========== LOGIN/ACCOUNT ==========
    else if (lowerMessage.includes('login') || lowerMessage.includes('account') || lowerMessage.includes('sign in')) {
      response = `🔐 **Login / Account Help:**

**To Login:**
1️⃣ Click "Login" in the top menu
2️⃣ Enter your email and password
3️⃣ Select account type (Student/Admin)
4️⃣ Click "Sign In"

**Don't have an account?**
- Click "Register" to create one
- It's free and takes 2 minutes!

**Forgot Password?**
- Click "Forgot Password" on login page
- We'll send a reset link to your email`;
      
      suggestions = ["Create account", "Reset password", "Login help", "Browse events"];
    }

    // ========== CANCEL REGISTRATION ==========
    else if (lowerMessage.includes('cancel') || lowerMessage.includes('unregister')) {
      response = `❌ **Cancel Event Registration:**

**To cancel a registration:**

1️⃣ Go to your Dashboard
2️⃣ Find the event in "My Registrations"
3️⃣ Click "Cancel Registration"
4️⃣ Confirm cancellation

⚠️ **Important:**
- Some events have cancellation deadlines
- Check event policy before canceling
- Refunds (if applicable) processed in 5-7 days`;
      
      suggestions = ["My registrations", "Refund policy", "Dashboard", "Contact support"];
    }

    // ========== CONTACT/SUPPORT ==========
    else if (lowerMessage.includes('contact') || lowerMessage.includes('support') || lowerMessage.includes('help')) {
      response = `📞 **Need Help?**

**Contact Support:**

📧 **Email:** support@campuseventhub.com
📱 **Phone:** +91-1234-567890
💬 **Live Chat:** Available 9 AM - 6 PM

**Quick Help:**
- Check our FAQ section
- Use this chatbot for instant answers
- Contact your college event coordinator

We're here to help! 😊`;
      
      suggestions = ["Common issues", "FAQs", "Report bug", "Give feedback"];
    }

    // ========== ABOUT ==========
    else if (lowerMessage.includes('about') || lowerMessage.includes('what is')) {
      response = `🎓 **About Campus Event Hub**

Your one-stop platform for inter-college events! 🚀

**What We Do:**
✨ Centralized event discovery
✨ Easy online registration
✨ Real-time event updates
✨ Digital certificates
✨ Event ratings & reviews
✨ Personalized recommendations

**Why Join?**
- Discover events from multiple colleges
- Network with students across campuses
- Build your profile with certifications
- Stay updated on campus activities

Join thousands of students today!`;
      
      suggestions = ["Create account", "Browse events", "Features", "Student benefits"];
    }

    // ========== PRICING ==========
    else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('fee') || lowerMessage.includes('free')) {
      response = `💰 **Event Pricing:**

**Good News:** Most events are **FREE!** 🎉

**Some Premium Events:**
- Workshops with certification: ₹100-500
- Major competitions: ₹200-1000  
- Cultural fests: Usually free

**Payment Info:**
✅ All fees clearly shown before registration
✅ Secure payment gateway
✅ Multiple payment options
✅ Instant confirmation

Check individual event pages for exact pricing!`;
      
      suggestions = ["Free events", "Payment methods", "Refund policy", "Browse events"];
    }

    // ========== FALLBACK ==========
    else {
      response = `I'm here to help with Campus Event Hub! 😊

I can assist you with:

📅 **Events** - Finding and browsing events
📝 **Registration** - How to sign up for events
🎯 **Dashboard** - Managing your profile
🏆 **Certificates** - Getting event certificates
❓ **General Help** - Platform questions

What would you like to know?`;
      
      suggestions = [
        "Show upcoming events",
        "How to register",
        "My dashboard",
        "Event categories"
      ];
    }

    console.log('✅ Sending response'); // Debug log

    // Send response
    res.status(200).json({
      success: true,
      data: {
        response,
        suggestions,
        timestamp: new Date()
      }
    });

  } catch (error) {
    console.error('❌ Chatbot error:', error);
    res.status(500).json({
      success: false,
      message: 'Sorry, I encountered an error. Please try again.',
      error: error.message
    });
  }
};
