import { useState, useRef, useEffect } from 'react';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! I'm CampusHub Assistant. How can I help with events?" }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false); // 🔥 NEW: Mic status
  const messagesEndRef = useRef(null);

  // 🔥 VOICE RECOGNITION SETUP
  useEffect(() => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      console.log('Speech recognition not supported');
    }
  }, []);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-IN'; // English + Tamil support
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      sendMessage(); // Auto send!
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      console.error('Speech error:', event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      // 🔥 MOCK RESPONSE FOR NOW (Backend later)
      const data = { 
        reply: "✅ Voice working! Namaskaram! CampusHub Assistant 🚀\n\n📅 Upcoming: Hackathon Feb 20-22 @ SRM\n📋 8 Registrations | 3 Upcoming" 
      };
      
      setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: "Sorry, something went wrong. Try again!" 
      }]);
    }
  };

  return (
    
    <div className="fixed bottom-8 right-8 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border flex flex-col z-50">
      <div className="p-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-t-2xl text-white flex justify-between items-center">
        <h3>🤖 Campus Assistant</h3>
        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
          {isListening ? '🎙️ Listening...' : ''}
        </span>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'bot' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-xs p-3 rounded-2xl ${
              msg.role === 'bot' 
                ? 'bg-gray-100 rounded-br-sm' 
                : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-bl-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t">
        <div className="flex gap-2">
          {/* 🔥 MIC BUTTON */}
          <button
            onClick={startListening}
            disabled={isListening}
            className={`p-3 rounded-full transition-all duration-200 ${
              isListening
                ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/50'
                : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl'
            }`}
            title="Voice Input"
          >
            {isListening ? '⏹️' : '🎙️'}
          </button>
          
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Type or speak..."
          />
          <button
            onClick={sendMessage}
            className="p-3 bg-purple-500 text-white rounded-full hover:bg-purple-600"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
