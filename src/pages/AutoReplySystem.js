import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  Card,
  CardContent,
  IconButton,
  AppBar,
  Toolbar,
  Switch,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Send,
  Delete,
  LightMode,
  DarkMode,
  SmartToy,
  Description,
  Refresh,
  Psychology,
  Storage
} from '@mui/icons-material';

// Google Sheets API configuration (in a real app, these would be environment variables)
const GOOGLE_SHEETS_API_KEY = 'YOUR_API_KEY';
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';
const KNOWLEDGE_SHEET_NAME = 'KnowledgeBase';
const CONVERSATIONS_SHEET_NAME = 'Conversations';

const AutoReplySystem = () => {
  const [documents, setDocuments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [knowledgeBase, setKnowledgeBase] = useState([]);
  const [loading, setLoading] = useState(false);
  const [documentUrl, setDocumentUrl] = useState('');
  const [pyodide, setPyodide] = useState(null);
  const [pyodideLoading, setPyodideLoading] = useState(true);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    personality: 'friendly',
    responseLength: 'medium',
    learningEnabled: true
  });
  const pyodideInitialized = useRef(false);

  // Initialize Pyodide
  useEffect(() => {
    const loadPyodide = async () => {
      if (pyodideInitialized.current) return;
      pyodideInitialized.current = true;
      
      try {
        // Load Pyodide
        console.log('Loading Pyodide...');
        // @ts-ignore
        const pyodideInstance = await loadPyodide();
        setPyodide(pyodideInstance);
        
        // Install required packages
        console.log('Installing packages...');
        await pyodideInstance.loadPackage(['micropip']);
        const micropip = pyodideInstance.pyimport("micropip");
        await micropip.install(['numpy', 'scikit-learn', 'pandas']);
        
        // Initialize machine learning models
        await initializeMLModels(pyodideInstance);
        
        console.log('Pyodide loaded successfully');
        setPyodideLoading(false);
        
        // Load data from Google Sheets
        loadKnowledgeBase();
        loadConversationHistory();
      } catch (err) {
        console.error('Error loading Pyodide:', err);
        setError('Failed to load AI engine. Some advanced features may not work.');
        setPyodideLoading(false);
      }
    };

    loadPyodide();
  }, []);

  // Initialize machine learning models
  const initializeMLModels = async (pyodideInstance) => {
    try {
      await pyodideInstance.runPythonAsync(`
        import numpy as np
        import pandas as pd
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.metrics.pairwise import cosine_similarity
        from sklearn.cluster import KMeans
        import re
        
        # Global variables for our Python code
        knowledge_base = []
        vectorizer = TfidfVectorizer(stop_words='english', max_features=1000)
        tfidf_matrix = None
        kmeans = KMeans(n_clusters=5, random_state=42)
        conversation_history = []
        user_profile = {}
        
        # Response templates for Suman personality
        response_templates = {
            'greeting': [
                "Hello! I'm Suman. How can I help you today?",
                "Hi there! I'm Suman. What can I do for you?",
                "Hey! I'm Suman. How can I assist you today?"
            ],
            'thanks': [
                "You're welcome! Is there anything else I can help with?",
                "Happy to help! Let me know if you need anything else.",
                "Anytime! Feel free to ask if you have more questions."
            ],
            'farewell': [
                "Thank you for chatting with me. Have a great day!",
                "It was nice talking to you. Take care!",
                "Goodbye! Hope to chat with you again soon."
            ],
            'no_answer': [
                "I'm not sure about that. Can you provide more details?",
                "That's an interesting question. I don't have information about that yet.",
                "I'm still learning about that topic. Could you try asking in a different way?"
            ]
        }
        
        def initialize_models(knowledge_data):
            global knowledge_base, tfidf_matrix, kmeans
            knowledge_base = knowledge_data
            
            if knowledge_base:
                # Create TF-IDF matrix
                tfidf_matrix = vectorizer.fit_transform(knowledge_base)
                
                # Cluster knowledge base for better organization
                if len(knowledge_base) >= 5:
                    kmeans.fit(tfidf_matrix)
        
        def extract_personal_info():
            # Extract personal information from knowledge base
            personal_info = {}
            
            for info in knowledge_base:
                # Extract age
                age_match = re.search(r'(?:age|old).*?(\d+)', info, re.IGNORECASE)
                if age_match:
                    personal_info['age'] = age_match.group(1)
                
                # Extract location
                location_match = re.search(r'(?:live|lives|location|from).*?([A-Za-z\s,]+)(?:\\.|\\?|\\!|$)', info, re.IGNORECASE)
                if location_match:
                    location = location_match.group(1).strip()
                    if len(location) > 3 and location not in ['I', 'My', 'The']:
                        personal_info['location'] = location
                
                # Extract name
                name_match = re.search(r'(?:name is|I am|call me) ([A-Za-z]+)', info, re.IGNORECASE)
                if name_match:
                    personal_info['name'] = name_match.group(1)
            
            return personal_info
        
        def generate_response(user_query, history=None, personality='friendly'):
            # First check for personal questions
            personal_response = handle_personal_questions(user_query)
            if personal_response:
                return personal_response, 'personal'
                
            # Check for greetings, thanks, farewells
            lower_query = user_query.lower()
            
            if any(word in lower_query for word in ['hello', 'hi', 'hey', 'greetings']):
                return np.random.choice(response_templates['greeting']), 'greeting'
                
            if any(word in lower_query for word in ['thank', 'thanks', 'appreciate']):
                return np.random.choice(response_templates['thanks']), 'thanks'
                
            if any(word in lower_query for word in ['bye', 'goodbye', 'see you']):
                return np.random.choice(response_templates['farewell']), 'farewell'
            
            # If we have a knowledge base, use ML to find the best response
            if knowledge_base and tfidf_matrix is not None:
                # Vectorize the user query
                query_vec = vectorizer.transform([user_query])
                
                # Calculate cosine similarity
                cosine_similarities = cosine_similarity(query_vec, tfidf_matrix).flatten()
                
                # Get the most relevant knowledge base item
                if cosine_similarities.max() > 0.1:  # Lower threshold for more responses
                    best_match_idx = cosine_similarities.argmax()
                    response_text = knowledge_base[best_match_idx]
                    
                    # Personalize response based on Suman's personality
                    personalized_response = personalize_response(response_text, personality, user_query)
                    return personalized_response, 'knowledge'
            
            # If no good match found, use a default response
            return np.random.choice(response_templates['no_answer']), 'no_answer'
        
        def handle_personal_questions(query):
            lower_query = query.lower()
            personal_info = extract_personal_info()
            
            # Check for age questions
            if any(word in lower_query for word in ['how old', 'age', 'year old']):
                if 'age' in personal_info:
                    return f"I'm {personal_info['age']} years old.", 'personal'
            
            # Check for location questions
            if any(word in lower_query for word in ['where you live', 'where do you live', 'your location', 'where are you from']):
                if 'location' in personal_info:
                    return f"I live in {personal_info['location']}.", 'personal'
            
            # Check for name questions
            if any(word in lower_query for word in ['your name', 'who are you', 'what are you called']):
                if 'name' in personal_info:
                    return f"My name is {personal_info['name']}.", 'personal'
            
            return None
        
        def personalize_response(response, personality, query):
            # Add personal touches based on the selected personality
            lower_query = query.lower()
            
            if personality == 'friendly':
                if any(word in lower_query for word in ['what', 'how', 'when', 'where', 'why']):
                    return f"Sure! {response}"
                else:
                    return f"Hi! {response}"
            elif personality == 'professional':
                return f"According to our information, {response.lower()}"
            else:
                return response
        
        def learn_from_conversation(user_input, ai_response, response_type):
            # Simple learning mechanism - add new information to knowledge base
            if response_type == 'no_answer' and len(user_input) > 10:
                # Add the user's question as new knowledge (in a real system, this would be validated)
                knowledge_base.append(user_input)
                # Update the TF-IDF matrix
                tfidf_matrix = vectorizer.fit_transform(knowledge_base)
                return True
            return False
        
        def get_conversation_summary():
            # Generate a summary of the conversation for learning
            if conversation_history:
                # Simple implementation - in a real system, use more advanced summarization
                last_few_messages = conversation_history[-5:] if len(conversation_history) > 5 else conversation_history
                return " ".join([f"{msg['sender']}: {msg['text']}" for msg in last_few_messages])
            return ""
      `);
      
      console.log('ML models initialized successfully');
    } catch (err) {
      console.error('Error initializing ML models:', err);
    }
  };

  // Load data from Google Sheets
  const loadKnowledgeBase = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('Loading knowledge base from Google Sheets...');
      
      // In a real implementation, this would call the Google Sheets API
      // For demonstration, we'll use mock data that simulates what would come from Sheets
      const mockSheetData = [
        ["My name is Suman. I am 25 years old and I live in Dhaka, Bangladesh."],
        ["I work as a software developer at TechSolutions Inc."],
        ["My hobbies include reading books, playing guitar, and traveling."],
        ["I enjoy helping people with their questions and providing useful information."],
        ["My favorite foods are biryani and sushi."],
        ["I'm passionate about technology, especially artificial intelligence and web development."],
        ["I can help you with information about our company, our products, and our services."],
        ["Our company offers web development, mobile app development, and cloud solutions."],
        ["We have been in business since 2010 and have served over 500 clients worldwide."],
        ["Our team consists of 25 experienced developers and designers."],
        ["We offer a 30-day money-back guarantee on all our services."],
        ["You can contact us at info@techsolutions.com or call us at (555) 123-4567."]
      ];
      
      // Process the data
      const knowledgeData = mockSheetData.map(row => row[0]);
      processDocumentContent(knowledgeData);
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading knowledge base:', err);
      setError('Failed to load knowledge base from Google Sheets. Using demo data.');
      
      // Fallback to demo data
      const demoData = [
        "My name is Suman. I am 25 years old and I live in Dhaka, Bangladesh.",
        "I work as a software developer at TechSolutions Inc.",
        "My hobbies include reading books, playing guitar, and traveling.",
        "I enjoy helping people with their questions and providing useful information.",
        "My favorite foods are biryani and sushi.",
        "I'm passionate about technology, especially artificial intelligence and web development.",
        "I can help you with information about our company, our products, and our services.",
        "Our company offers web development, mobile app development, and cloud solutions.",
        "We have been in business since 2010 and have served over 500 clients worldwide.",
        "Our team consists of 25 experienced developers and designers.",
        "We offer a 30-day money-back guarantee on all our services.",
        "You can contact us at info@techsolutions.com or call us at (555) 123-4567."
      ];
      
      processDocumentContent(demoData);
      setLoading(false);
    }
  };

  // Save conversation to Google Sheets
  const saveConversationToSheets = async (conversationData) => {
    try {
      console.log('Saving conversation to Google Sheets...');
      
      // In a real implementation, this would call the Google Sheets API
      // For demonstration, we'll just log the data
      console.log('Conversation data to save:', conversationData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Conversation saved to Google Sheets successfully');
    } catch (err) {
      console.error('Error saving conversation to Google Sheets:', err);
    }
  };

  // Load conversation history from Google Sheets
  const loadConversationHistory = async () => {
    try {
      console.log('Loading conversation history from Google Sheets...');
      
      // In a real implementation, this would call the Google Sheets API
      // For demonstration, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockConversations = [
        { sender: 'user', text: 'Hello', timestamp: new Date(Date.now() - 86400000).toISOString() },
        { sender: 'ai', text: "Hi there! I'm Suman. What can I do for you?", timestamp: new Date(Date.now() - 86300000).toISOString() },
        { sender: 'user', text: 'What is your name?', timestamp: new Date(Date.now() - 86200000).toISOString() },
        { sender: 'ai', text: "My name is Suman.", timestamp: new Date(Date.now() - 86100000).toISOString() }
      ];
      
      setConversationHistory(mockConversations);
      
      // Also check localStorage for more recent conversations
      const savedHistory = localStorage.getItem('conversationHistory');
      if (savedHistory) {
        const localHistory = JSON.parse(savedHistory);
        setConversationHistory(prev => [...localHistory, ...prev]);
      }
      
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      }
    } catch (err) {
      console.error('Error loading conversation history:', err);
      
      // Fallback to localStorage
      const savedHistory = localStorage.getItem('conversationHistory');
      if (savedHistory) {
        setConversationHistory(JSON.parse(savedHistory));
      }
      
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      }
    }
  };

  // Save conversation history
  const saveConversationHistory = (history) => {
    try {
      localStorage.setItem('conversationHistory', JSON.stringify(history));
      
      // Also save to Google Sheets
      saveConversationToSheets(history);
      
      // Extract user profile information from conversation
      if (history.length > 0) {
        const userMessages = history.filter(msg => msg.sender === 'user');
        if (userMessages.length > 3) {
          const profile = extractUserProfile(userMessages);
          setUserProfile(profile);
          localStorage.setItem('userProfile', JSON.stringify(profile));
        }
      }
    } catch (err) {
      console.error('Error saving conversation history:', err);
    }
  };

  // Extract user profile from conversation
  const extractUserProfile = (userMessages) => {
    const profile = {};
    const text = userMessages.map(msg => msg.text).join(' ');
    
    // Extract name
    const nameMatch = text.match(/(my name is|i am|call me) (\w+)/i);
    if (nameMatch && nameMatch[2]) {
      profile.name = nameMatch[2];
    }
    
    // Extract interests
    const interests = [];
    if (text.includes('like') || text.includes('love') || text.includes('interested')) {
      if (text.match(/(like|love|enjoy) (.*?)(\.|\?|!|,|$)/i)) {
        const interestText = text.match(/(like|love|enjoy) (.*?)(\.|\?|!|,|$)/i)[2];
        interests.push(interestText);
      }
    }
    
    if (interests.length > 0) {
      profile.interests = interests;
    }
    
    return profile;
  };

  // Process document content and add to knowledge base
  const processDocumentContent = (content) => {
    try {
      // If content is already an array, use it directly
      const chunks = Array.isArray(content) ? content : content.split(/\n\n+|\.\s+|(?<=[.!?])\s+(?=[A-Z])/)
        .filter(s => s.trim().length > 10)
        .map(chunk => chunk.trim());
      
      // Add to knowledge base
      setKnowledgeBase(chunks);
      
      // Initialize ML models with the knowledge base
      if (pyodide && !pyodideLoading) {
        pyodide.globals.set("knowledge_data", chunks);
        pyodide.runPython(`
          initialize_models(knowledge_data)
        `);
      }
      
      console.log('Knowledge base loaded with', chunks.length, 'items');
    } catch (err) {
      console.error('Error processing document content:', err);
      setError('Failed to process document content');
    }
  };

  // Remove a document
  const removeDocument = (id) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    setKnowledgeBase([]);
  };

  // Send a message
  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    // Add user message
    const userMessage = {
      sender: 'user',
      text: currentMessage,
      timestamp: new Date()
    };
    
    const updatedHistory = [...conversationHistory, userMessage];
    setConversationHistory(updatedHistory);
    saveConversationHistory(updatedHistory);
    
    setMessages(prev => [{
      type: 'user',
      text: currentMessage,
      timestamp: new Date()
    }, ...prev]);
    
    setCurrentMessage('');
    setIsProcessing(true);
    
    try {
      // Generate response using Pyodide
      let responseText = "I'm having trouble processing your request. Please try again.";
      let responseType = 'error';
      
      if (pyodide && !pyodideLoading) {
        // Pass data to Pyodide
        pyodide.globals.set("user_query", currentMessage);
        pyodide.globals.set("personality", settings.personality);
        
        // Run the advanced NLP processing
        const response = pyodide.runPython(`
          response, response_type = generate_response(user_query, None, personality)
          (response, response_type)
        `);
        
        responseText = response[0];
        responseType = response[1];
        
        // If learning is enabled, learn from this conversation
        if (settings.learningEnabled && responseType === 'no_answer') {
          pyodide.runPython(`
            learn_from_conversation(user_query, response, response_type)
          `);
        }
      } else {
        // Fallback to basic response
        responseText = generateBasicResponse(currentMessage, knowledgeBase);
        responseType = 'basic';
      }
      
      // Add AI response
      const aiMessage = {
        sender: 'ai',
        text: responseText,
        timestamp: new Date(),
        type: responseType
      };
      
      const updatedHistoryWithAI = [...updatedHistory, aiMessage];
      setConversationHistory(updatedHistoryWithAI);
      saveConversationHistory(updatedHistoryWithAI);
      
      setMessages(prev => [{
        type: 'ai',
        text: responseText,
        timestamp: new Date(),
        method: pyodide && !pyodideLoading ? 'advanced' : 'basic'
      }, ...prev]);
    } catch (error) {
      console.error('Error generating response:', error);
      setError('Failed to generate response. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Basic response generation (fallback)
  const generateBasicResponse = (message, knowledgeBase) => {
    const lowerMessage = message.toLowerCase();
    
    // Check for personal questions first
    const personalResponse = handlePersonalQuestionsBasic(message, knowledgeBase);
    if (personalResponse) return personalResponse;
    
    // Check for simple greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! I'm Suman. How can I help you today?";
    }
    
    if (lowerMessage.includes('thank')) {
      return "You're welcome! Is there anything else I can help with?";
    }
    
    if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
      return "Thank you for chatting with me. Have a great day!";
    }
    
    // Personalize response with user's name if available
    let personalization = "";
    if (userProfile && userProfile.name) {
      personalization = `${userProfile.name}, `;
    }
    
    // Calculate relevance scores for each knowledge base item
    const scoredKnowledge = knowledgeBase.map(info => {
      const lowerInfo = info.toLowerCase();
      const words = lowerMessage.split(/\s+/).filter(word => word.length > 3);
      
      // Calculate score based on word matches
      let score = 0;
      words.forEach(word => {
        if (lowerInfo.includes(word)) {
          score += 1;
          // Bonus for exact matches
          if (lowerInfo.includes(` ${word} `) || lowerInfo.startsWith(`${word} `) || lowerInfo.endsWith(` ${word}`)) {
            score += 0.5;
          }
        }
      });
      
      return { text: info, score };
    });
    
    // Filter out items with no matches and sort by score
    const relevantItems = scoredKnowledge
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);
    
    if (relevantItems.length > 0) {
      return personalization + simplifyAnswer(relevantItems[0].text, message);
    }
    
    return personalization + "I'm not sure about that. Can you provide more details or try rephrasing your question?";
  };

  // Handle personal questions in basic mode
  const handlePersonalQuestionsBasic = (message, knowledgeBase) => {
    const lowerMessage = message.toLowerCase();
    
    // Extract personal information from knowledge base
    let age = null;
    let location = null;
    let name = null;
    
    knowledgeBase.forEach(info => {
      const lowerInfo = info.toLowerCase();
      
      // Extract age
      if (!age && (lowerInfo.includes('age') || lowerInfo.includes('old'))) {
        const ageMatch = info.match(/\b(\d+)\s*(?:years old|year old|age)/i);
        if (ageMatch) {
          age = ageMatch[1];
        }
      }
      
      // Extract location
      if (!location && (lowerInfo.includes('live') || lowerInfo.includes('location'))) {
        const locationMatch = info.match(/(?:live|lives in|location|from) ([A-Za-z\s,]+)(?:\.|\?|!|$)/i);
        if (locationMatch) {
          location = locationMatch[1].trim();
        }
      }
      
      // Extract name
      if (!name && lowerInfo.includes('name is')) {
        const nameMatch = info.match(/name is ([A-Za-z]+)/i);
        if (nameMatch) {
          name = nameMatch[1];
        }
      }
    });
    
    // Check for age questions
    if (age && (lowerMessage.includes('how old') || lowerMessage.includes('age') || lowerMessage.includes('year old'))) {
      return `I'm ${age} years old.`;
    }
    
    // Check for location questions
    if (location && (lowerMessage.includes('where you live') || lowerMessage.includes('where do you live') || 
        lowerMessage.includes('your location') || lowerMessage.includes('where are you from'))) {
      return `I live in ${location}.`;
    }
    
    // Check for name questions
    if (name && (lowerMessage.includes('your name') || lowerMessage.includes('who are you') || 
        lowerMessage.includes('what are you called'))) {
      return `My name is ${name}.`;
    }
    
    return null;
  };

  // Simplify and refine the answer based on the question
  const simplifyAnswer = (answer, question) => {
    if (!answer) return "I'm not sure how to respond to that. Can you provide more details?";
    
    const lowerQuestion = question.toLowerCase();
    
    // Extract the most relevant part of the answer for yes/no questions
    if (lowerQuestion.startsWith('do you') || lowerQuestion.startsWith('are you') || 
        lowerQuestion.startsWith('is there') || lowerQuestion.startsWith('can you') ||
        lowerQuestion.startsWith('will you') || lowerQuestion.startsWith('would you')) {
      
      // Look for yes/no patterns in the answer
      if (answer.toLowerCase().includes('yes') || answer.toLowerCase().includes('certainly') || 
          answer.toLowerCase().includes('of course') || answer.toLowerCase().includes('absolutely')) {
        return "Yes, " + answer.replace(/^.*?\b(yes|certainly|of course|absolutely)\b/i, '').trim();
      }
      
      if (answer.toLowerCase().includes('no') || answer.toLowerCase().includes('not')) {
        return "No, " + answer.replace(/^.*?\b(no|not)\b/i, '').trim();
      }
    }
    
    // For what/how questions, try to extract the direct answer
    if (lowerQuestion.startsWith('what') || lowerQuestion.startsWith('how') || 
        lowerQuestion.startsWith('when') || lowerQuestion.startsWith('where')) {
      
      // Try to find the most concise part of the answer
      const sentences = answer.split(/\.\s+/);
      if (sentences.length > 1) {
        // Return the first sentence that seems to directly answer the question
        for (let sentence of sentences) {
          if (sentence.length > 10 && sentence.length < 150) {
            return sentence + '.';
          }
        }
      }
    }
    
    // Default: return the original answer with personalization
    return answer;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearAll = () => {
    setMessages([]);
    setConversationHistory([]);
    setCurrentMessage('');
    setError('');
    localStorage.removeItem('conversationHistory');
    localStorage.removeItem('userProfile');
    setUserProfile(null);
  };

  const exportConversation = () => {
    const conversationText = conversationHistory.map(msg => 
      `${msg.sender}: ${msg.text} (${msg.timestamp.toLocaleString()})`
    ).join('\n');
    
    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'conversation-with-suman.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ 
      bgcolor: darkMode ? '#121212' : 'background.default', 
      minHeight: '100vh',
      color: darkMode ? '#fff' : 'text.primary',
      pb: 4
    }}>
      <AppBar position="static" color={darkMode ? "default" : "primary"}>
        <Toolbar>
          <SmartToy sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Suman - AI Assistant with Google Sheets
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {pyodideLoading ? (
              <CircularProgress size={20} sx={{ mr: 1 }} />
            ) : pyodide ? (
              <Chip label="AI Enhanced" color="success" size="small" sx={{ mr: 1 }} />
            ) : (
              <Chip label="Basic Mode" color="warning" size="small" sx={{ mr: 1 }} />
            )}
            <IconButton color="inherit" onClick={() => setShowSettings(true)}>
              <Psychology />
            </IconButton>
            <Switch
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              icon={<LightMode />}
              checkedIcon={<DarkMode />}
            />
            <Typography variant="body2">
              {darkMode ? "Dark" : "Light"}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Suman - Your Friendly AI Assistant
        </Typography>
        
        <Typography variant="body1" gutterBottom align="center" sx={{ mb: 4 }}>
          Hi! I'm Suman. I can help answer your questions using information from Google Sheets.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {userProfile && userProfile.name && (
          <Alert severity="info" sx={{ mb: 2 }}>
            I remember you, {userProfile.name}! {userProfile.interests ? `I know you're interested in ${userProfile.interests.join(', ')}.` : ''}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Document section */}
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Google Sheets Integration
                </Typography>
                <Box>
                  <Button
                    variant="outlined"
                    onClick={loadKnowledgeBase}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <Refresh />}
                    sx={{ mr: 1 }}
                  >
                    {loading ? 'Loading...' : 'Reload'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={exportConversation}
                    disabled={conversationHistory.length === 0}
                    startIcon={<Storage />}
                  >
                    Export
                  </Button>
                </Box>
              </Box>
              
              <TextField
                fullWidth
                variant="outlined"
                label="Google Sheets URL"
                value={documentUrl}
                onChange={(e) => setDocumentUrl(e.target.value)}
                sx={{ mb: 2 }}
                placeholder="https://docs.google.com/spreadsheets/d/..."
              />
              
              <Box sx={{ mt: 2 }}>
                <Chip 
                  label={`${knowledgeBase.length} knowledge items loaded from Google Sheets`} 
                  color="primary" 
                  variant="outlined" 
                />
                {pyodide && !pyodideLoading && (
                  <Chip 
                    label="AI Enhanced Responses" 
                    color="success" 
                    variant="outlined" 
                    sx={{ ml: 1 }}
                  />
                )}
                {conversationHistory.length > 0 && (
                  <Chip 
                    label={`${conversationHistory.length} conversations remembered`} 
                    color="info" 
                    variant="outlined" 
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
          
          {/* Chat interface */}
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Chat with Suman
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Type your message..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isProcessing || knowledgeBase.length === 0 || pyodideLoading}
                  multiline
                  maxRows={3}
                />
                <Button
                  variant="contained"
                  endIcon={<Send />}
                  onClick={sendMessage}
                  disabled={isProcessing || !currentMessage.trim() || knowledgeBase.length === 0 || pyodideLoading}
                  sx={{ height: 'fit-content' }}
                >
                  Send
                </Button>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" onClick={clearAll}>
                  Clear Chat
                </Button>
                <Button size="small" onClick={exportConversation} disabled={conversationHistory.length === 0}>
                  Export Conversation
                </Button>
              </Box>
            </CardContent>
          </Card>
          
          {/* Message display */}
          {messages.length > 0 ? (
            <Card variant="outlined">
              <CardContent>
                <List>
                  {messages.map((message, index) => (
                    <Box key={index}>
                      <ListItem alignItems="flex-start">
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: 'column',
                          width: '100%',
                          p: 1,
                          bgcolor: message.type === 'user' ? 
                            (darkMode ? 'primary.dark' : 'primary.light') : 
                            (darkMode ? 'grey.800' : 'grey.100'),
                          borderRadius: 1,
                          position: 'relative'
                        }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption" fontWeight="bold">
                              {message.type === 'user' ? 'You' : 'Suman'}
                              {message.method === 'advanced' && (
                                <Chip label="AI" color="success" size="small" sx={{ ml: 1 }} />
                              )}
                            </Typography>
                            <Typography variant="caption">
                              {message.timestamp.toLocaleTimeString()}
                            </Typography>
                          </Box>
                          <Typography variant="body1">
                            {message.text}
                          </Typography>
                        </Box>
                      </ListItem>
                      {index < messages.length - 1 && <Divider sx={{ my: 1 }} />}
                    </Box>
                  ))}
                </List>
              </CardContent>
            </Card>
          ) : (
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="body1" color="textSecondary">
                  {knowledgeBase.length === 0 
                    ? 'Load data from Google Sheets to start chatting' 
                    : pyodideLoading
                      ? 'Loading AI engine...'
                      : 'No messages yet. Start a conversation with Suman!'}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>

        <Box sx={{ mt: 4, p: 2, bgcolor: darkMode ? '#1e1e1e' : '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="body2">
            <strong>How it works:</strong> Suman uses data from Google Sheets to answer your questions.
            All conversations are saved to Google Sheets for future reference and learning.
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            <strong>Note:</strong> In a production environment, this would use proper Google Sheets API authentication.
            {pyodideLoading && " Currently loading the AI engine for enhanced responses..."}
          </Typography>
        </Box>
      </Container>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onClose={() => setShowSettings(false)}>
        <DialogTitle>AI Assistant Settings</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Customize how Suman interacts with you
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="body2" gutterBottom>
                Personality Style
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip 
                  label="Friendly" 
                  onClick={() => setSettings({...settings, personality: 'friendly'})} 
                  color={settings.personality === 'friendly' ? 'primary' : 'default'}
                  variant={settings.personality === 'friendly' ? 'filled' : 'outlined'}
                />
                <Chip 
                  label="Professional" 
                  onClick={() => setSettings({...settings, personality: 'professional'})} 
                  color={settings.personality === 'professional' ? 'primary' : 'default'}
                  variant={settings.personality === 'professional' ? 'filled' : 'outlined'}
                />
              </Box>
            </Box>
            
            <Box>
              <Typography variant="body2" gutterBottom>
                Response Length
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip 
                  label="Short" 
                  onClick={() => setSettings({...settings, responseLength: 'short'})} 
                  color={settings.responseLength === 'short' ? 'primary' : 'default'}
                  variant={settings.responseLength === 'short' ? 'filled' : 'outlined'}
                />
                <Chip 
                  label="Medium" 
                  onClick={() => setSettings({...settings, responseLength: 'medium'})} 
                  color={settings.responseLength === 'medium' ? 'primary' : 'default'}
                  variant={settings.responseLength === 'medium' ? 'filled' : 'outlined'}
                />
                <Chip 
                  label="Detailed" 
                  onClick={() => setSettings({...settings, responseLength: 'detailed'})} 
                  color={settings.responseLength === 'detailed' ? 'primary' : 'default'}
                  variant={settings.responseLength === 'detailed' ? 'filled' : 'outlined'}
                />
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                Learning Enabled
              </Typography>
              <Switch
                checked={settings.learningEnabled}
                onChange={(e) => setSettings({...settings, learningEnabled: e.target.checked})}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettings(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AutoReplySystem;