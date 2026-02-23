import { useState, useRef, useEffect } from "react";
import {
  FaComments,
  FaTimes,
  FaPaperPlane,
  FaRobot,
  FaUser,
} from "react-icons/fa";
import api from "../services/api";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! 👋 I'm your Campus Event Hub assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([
    "Show me upcoming events",
    "How do I register for an event?",
    "What are popular events?",
    "Show my registered events",
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: messageText.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      // ✅ Fixed: api baseURL is already "http://localhost:5000/api"
      // so path should be "/chatbot/message" not "/api/chatbot/message"
      const response = await api.post("/chatbot/message", {
        message: messageText.trim(),
        conversationHistory: messages.slice(-5),
      });

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.data.response,
        sender: "bot",
        timestamp: new Date(),
        suggestions: response.data.data.suggestions || [],
        actions: response.data.data.actions || [],
      };

      setMessages((prev) => [...prev, botMessage]);

      if (response.data.data.suggestions?.length > 0) {
        setSuggestions(response.data.data.suggestions);
      }
    } catch (error) {
      console.error("Chatbot error:", error);

      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting right now. Please try again in a moment or contact support.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const styles = {
    floatingButton: {
      position: "fixed",
      bottom: "24px",
      right: "24px",
      width: "64px",
      height: "64px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      border: "none",
      boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: "28px",
      transition: "all 0.3s ease",
      zIndex: 1000,
    },
    chatWindow: {
      position: "fixed",
      bottom: "100px",
      right: "24px",
      width: "400px",
      height: "600px",
      maxHeight: "80vh",
      background: "white",
      borderRadius: "24px",
      boxShadow: "0 12px 48px rgba(0, 0, 0, 0.2)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      zIndex: 1000,
      animation: "slideUp 0.3s ease",
    },
    header: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      padding: "20px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: "24px 24px 0 0",
    },
    headerLeft: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    botAvatar: {
      width: "48px",
      height: "48px",
      borderRadius: "50%",
      background: "rgba(255, 255, 255, 0.2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "24px",
    },
    headerText: {
      display: "flex",
      flexDirection: "column",
      gap: "2px",
    },
    headerTitle: {
      fontSize: "18px",
      fontWeight: "700",
      margin: 0,
    },
    headerStatus: {
      fontSize: "12px",
      opacity: 0.9,
      margin: 0,
    },
    closeButton: {
      background: "rgba(255, 255, 255, 0.2)",
      border: "none",
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      fontSize: "18px",
      color: "white",
      transition: "all 0.2s",
    },
    messagesContainer: {
      flex: 1,
      overflowY: "auto",
      padding: "20px",
      background: "linear-gradient(to bottom, #f8f9fc, #ffffff)",
    },
    messageWrapper: {
      display: "flex",
      marginBottom: "16px",
      gap: "12px",
    },
    messageWrapperUser: {
      flexDirection: "row-reverse",
    },
    messageAvatar: {
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "14px",
      flexShrink: 0,
    },
    botMessageAvatar: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
    },
    userMessageAvatar: {
      background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      color: "white",
    },
    messageContent: {
      maxWidth: "70%",
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    },
    messageBubble: {
      padding: "12px 16px",
      borderRadius: "18px",
      fontSize: "14px",
      lineHeight: "1.5",
      wordWrap: "break-word",
      whiteSpace: "pre-wrap",
    },
    botMessageBubble: {
      background: "#f0f2f5",
      color: "#1f2937",
      borderBottomLeftRadius: "4px",
    },
    userMessageBubble: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      borderBottomRightRadius: "4px",
    },
    messageTime: {
      fontSize: "11px",
      color: "#9ca3af",
      paddingLeft: "8px",
    },
    messageTimeUser: {
      textAlign: "right",
      paddingLeft: 0,
      paddingRight: "8px",
    },
    typingIndicator: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "16px",
    },
    typingBubble: {
      background: "#f0f2f5",
      borderRadius: "18px",
      borderBottomLeftRadius: "4px",
      padding: "12px 16px",
      display: "flex",
      gap: "4px",
      alignItems: "center",
    },
    typingDot: {
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      background: "#9ca3af",
      animation: "bounce 1.2s infinite",
    },
    suggestionsContainer: {
      padding: "12px 20px",
      borderTop: "1px solid #e5e7eb",
      background: "white",
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
    },
    suggestionChip: {
      padding: "8px 16px",
      background: "#f0f2f5",
      border: "none",
      borderRadius: "20px",
      fontSize: "13px",
      color: "#667eea",
      cursor: "pointer",
      transition: "all 0.2s",
      fontWeight: "500",
    },
    inputContainer: {
      padding: "16px 20px",
      borderTop: "1px solid #e5e7eb",
      background: "white",
      display: "flex",
      gap: "12px",
      alignItems: "center",
      borderRadius: "0 0 24px 24px",
    },
    input: {
      flex: 1,
      padding: "12px 16px",
      border: "2px solid #e5e7eb",
      borderRadius: "24px",
      fontSize: "14px",
      outline: "none",
      transition: "all 0.2s",
      fontFamily: "inherit",
    },
    inputFocused: {
      borderColor: "#667eea",
      boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
    },
    sendButton: {
      width: "44px",
      height: "44px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      border: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: "18px",
      cursor: "pointer",
      transition: "all 0.2s",
      boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
    },
    sendButtonDisabled: {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          style={styles.floatingButton}
          onClick={() => setIsOpen(true)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow =
              "0 12px 32px rgba(102, 126, 234, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow =
              "0 8px 24px rgba(102, 126, 234, 0.4)";
          }}
        >
          <FaComments />
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div style={styles.chatWindow}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerLeft}>
              <div style={styles.botAvatar}>
                <FaRobot />
              </div>
              <div style={styles.headerText}>
                <h3 style={styles.headerTitle}>Campus Assistant</h3>
                <p style={styles.headerStatus}>● Online</p>
              </div>
            </div>
            <button
              style={styles.closeButton}
              onClick={() => setIsOpen(false)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
              }}
            >
              <FaTimes />
            </button>
          </div>

          {/* Messages */}
          <div style={styles.messagesContainer}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  ...styles.messageWrapper,
                  ...(message.sender === "user"
                    ? styles.messageWrapperUser
                    : {}),
                }}
              >
                <div
                  style={{
                    ...styles.messageAvatar,
                    ...(message.sender === "bot"
                      ? styles.botMessageAvatar
                      : styles.userMessageAvatar),
                  }}
                >
                  {message.sender === "bot" ? <FaRobot /> : <FaUser />}
                </div>
                <div style={styles.messageContent}>
                  <div
                    style={{
                      ...styles.messageBubble,
                      ...(message.sender === "bot"
                        ? styles.botMessageBubble
                        : styles.userMessageBubble),
                    }}
                  >
                    {message.text}
                  </div>
                  <span
                    style={{
                      ...styles.messageTime,
                      ...(message.sender === "user"
                        ? styles.messageTimeUser
                        : {}),
                    }}
                  >
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div style={styles.typingIndicator}>
                <div
                  style={{
                    ...styles.messageAvatar,
                    ...styles.botMessageAvatar,
                  }}
                >
                  <FaRobot />
                </div>
                <div style={styles.typingBubble}>
                  <div style={{ ...styles.typingDot, animationDelay: "0s" }} />
                  <div
                    style={{ ...styles.typingDot, animationDelay: "0.2s" }}
                  />
                  <div
                    style={{ ...styles.typingDot, animationDelay: "0.4s" }}
                  />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div style={styles.suggestionsContainer}>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  style={styles.suggestionChip}
                  onClick={() => handleSuggestionClick(suggestion)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#667eea";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#f0f2f5";
                    e.currentTarget.style.color = "#667eea";
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={styles.inputContainer}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              style={styles.input}
              onFocus={(e) =>
                Object.assign(e.target.style, styles.inputFocused)
              }
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e7eb";
                e.target.style.boxShadow = "none";
              }}
            />
            <button
              style={{
                ...styles.sendButton,
                ...(inputMessage.trim() === ""
                  ? styles.sendButtonDisabled
                  : {}),
              }}
              onClick={() => handleSendMessage()}
              disabled={inputMessage.trim() === ""}
              onMouseEnter={(e) => {
                if (inputMessage.trim() !== "") {
                  e.currentTarget.style.transform = "scale(1.1)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 16px rgba(102, 126, 234, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(102, 126, 234, 0.3)";
              }}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-8px); }
        }
        @media (max-width: 768px) {
          div[style*="width: 400px"] {
            width: calc(100vw - 48px) !important;
            height: calc(100vh - 120px) !important;
            max-height: none !important;
            right: 24px !important;
            bottom: 100px !important;
          }
        }
      `}</style>
    </>
  );
}

export default Chatbot;
