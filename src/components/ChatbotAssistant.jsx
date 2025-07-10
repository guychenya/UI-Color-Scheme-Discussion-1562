import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMessageSquare, FiSend, FiX, FiCpu, FiUser, FiBulb, FiTrendingUp, FiTarget, FiAlertCircle, FiCompass, FiZap } = FiIcons;

// Sample assistant responses based on keywords
const botResponses = {
  problem: [
    "Problems represent strategic challenges your organization faces. Focus on describing them clearly and their impact.",
    "When adding a problem, consider its priority level and what actions might resolve it.",
    "High-priority problems should address critical issues that are blocking your progress."
  ],
  goal: [
    "Goals are specific objectives you want to achieve. Make them measurable with clear success criteria.",
    "A good goal includes a timeline and is aligned with your mission.",
    "Consider breaking down large goals into smaller milestones with individual progress tracking."
  ],
  mission: [
    "Mission statements define your organization's purpose and direction.",
    "A strong mission statement should be concise, memorable, and inspire action.",
    "Try to connect your mission statements to the problems they help address."
  ],
  challenge: [
    "Challenges represent obstacles in your path. Unlike problems, they often require innovative solutions.",
    "When defining challenges, consider their impact level and potential solutions.",
    "Track challenges across different categories to maintain a balanced view of your organization."
  ],
  priority: [
    "Priority levels help you focus on what matters most:",
    "• High: Critical items requiring immediate attention",
    "• Medium: Important but not time-critical issues",
    "• Low: Items that should be addressed but can wait"
  ],
  status: [
    "Status tracking helps monitor progress:",
    "• Active/Pending: Currently being worked on or awaiting action",
    "• Completed/Resolved: Successfully addressed and completed"
  ],
  analytics: [
    "Analytics provide insights into your strategic planning performance.",
    "Use the dashboard to track key metrics and identify trends.",
    "Regular review of analytics helps adjust priorities and resource allocation."
  ],
  help: [
    "I can help with definitions and best practices for strategic planning.",
    "Try asking about specific concepts like 'problems', 'goals', 'missions', or 'challenges'.",
    "I can also provide guidance on using priority levels and status tracking effectively."
  ]
};

// Default greeting messages
const greetings = [
  "Hello! I'm your strategic planning assistant. How can I help you today?",
  "I can help with definitions and best practices for problems, goals, missions, and challenges."
];

const ChatbotAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: greetings[0], timestamp: new Date() },
    { sender: 'bot', text: greetings[1], timestamp: new Date() }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const messagesEndRef = useRef(null);
  
  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);
  
  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;
    
    // Add user message
    const userMessage = {
      sender: 'user',
      text: currentMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    
    // Process the message to generate a response
    setTimeout(() => {
      const botResponse = generateResponse(currentMessage);
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: botResponse,
        timestamp: new Date()
      }]);
    }, 500);
  };
  
  const generateResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Check for keyword matches
    for (const [keyword, responses] of Object.entries(botResponses)) {
      if (lowerMessage.includes(keyword)) {
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
    
    // Default responses if no keyword match
    const defaultResponses = [
      "I'm here to help with your strategic planning. Try asking about problems, goals, missions, or challenges.",
      "Need guidance on a specific concept? I can explain priorities, statuses, or analytics.",
      "I can provide best practices for strategic planning. What area are you working on?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };
  
  // Get icon based on message content
  const getMessageIcon = (message) => {
    const text = message.text.toLowerCase();
    
    if (text.includes('problem')) return FiAlertCircle;
    if (text.includes('goal')) return FiTarget;
    if (text.includes('mission')) return FiCompass;
    if (text.includes('challenge')) return FiZap;
    if (text.includes('analytics') || text.includes('metric')) return FiTrendingUp;
    if (text.includes('tip') || text.includes('advice')) return FiBulb;
    
    return message.sender === 'bot' ? FiCpu : FiUser;
  };
  
  return (
    <>
      {/* Chat button */}
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg hover:shadow-xl"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
      >
        <SafeIcon icon={FiMessageSquare} className="text-white text-xl" />
      </motion.button>
      
      {/* Chat overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 md:p-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="w-full max-w-lg h-[600px] max-h-[90vh] glass-card rounded-xl overflow-hidden flex flex-col"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Chat header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-indigo-800 to-purple-800">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <SafeIcon icon={FiCpu} className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Strategic Planning Assistant</h3>
                    <p className="text-white/60 text-xs">AI-powered guidance</p>
                  </div>
                </div>
                <button 
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
                  onClick={() => setIsOpen(false)}
                >
                  <SafeIcon icon={FiX} className="text-white/80 text-lg" />
                </button>
              </div>
              
              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                  >
                    <div className={`flex max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.sender === 'user' 
                            ? 'bg-indigo-600 ml-2' 
                            : 'bg-purple-700 mr-2'
                        }`}
                      >
                        <SafeIcon icon={getMessageIcon(message)} className="text-white text-sm" />
                      </div>
                      <div 
                        className={`py-2 px-4 rounded-2xl ${
                          message.sender === 'user' 
                            ? 'bg-indigo-600 rounded-tr-none' 
                            : 'bg-white/10 rounded-tl-none'
                        }`}
                      >
                        <p className="text-white text-sm">{message.text}</p>
                        <p className="text-white/50 text-xs mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Chat input */}
              <div className="p-4 border-t border-white/10 bg-white/5">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask about problems, goals, missions..."
                    className="flex-1 glass-input px-4 py-3 rounded-full text-white"
                  />
                  <motion.button
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendMessage}
                  >
                    <SafeIcon icon={FiSend} className="text-white text-lg" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotAssistant;