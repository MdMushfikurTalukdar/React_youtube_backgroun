import React, { useState, useRef, useEffect } from 'react';
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
  CircularProgress
} from '@mui/material';
import {
  Send,
  Delete,
  LightMode,
  DarkMode,
  SmartToy,
  Description
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const AutoReplySystem = () => {
  const [documents, setDocuments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [knowledgeBase, setKnowledgeBase] = useState([]);
  const [loading, setLoading] = useState(false);
  const { authToken } = useAuth();

  // Don't expose the document URL/ID in client-side code
  // These should be stored securely on the server

  // Load data from secure API on component mount
  useEffect(() => {
    loadKnowledgeBase();
  }, []);

  // Load data from secure API endpoint
  const loadKnowledgeBase = async () => {
    setLoading(true);
    try {
      // Call your secure API endpoint instead of directly accessing Google Docs
      const response = await fetch('/api/knowledge-base', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to load knowledge base');
      }
      
      const data = await response.json();
      
      // Process the content
      processDocumentContent(data.content);
      
      // Add to documents list for UI
      setDocuments([{
        id: 'secure-knowledge-base',
        name: 'Secure Knowledge Base',
        content: data.content.substring(0, 100) + '...', // Show preview
        source: 'secure-api'
      }]);
      
      setError('');
      setLoading(false);
    } catch (err) {
      console.error('Error loading knowledge base:', err);
      setError('Failed to load knowledge base. Please try again later.');
      setLoading(false);
      
      // For testing purposes, add some sample data
      const sampleContent = `
        Company FAQ
        
      `;
      
      processDocumentContent(sampleContent);
      setDocuments([{
        id: 'sample',
        name: 'Sample Data (Knowledge base load failed)',
        content: sampleContent.substring(0, 100) + '...',
        source: 'sample'
      }]);
    }
  };

  // Process document content and add to knowledge base
  const processDocumentContent = (content) => {
    try {
      // Split content into meaningful chunks (paragraphs or sentences)
      const chunks = content.split(/\n\n+|\.\s+|(?<=[.!?])\s+(?=[A-Z])/).filter(s => s.trim().length > 10);
      
      // Add to knowledge base
      setKnowledgeBase(chunks);
      console.log('Knowledge base loaded with', chunks.length, 'items');
    } catch (err) {
      console.error('Error processing document content:', err);
      setError('Failed to process document content');
    }
  };

  // Remove a document
  const removeDocument = (id) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    // Also remove from knowledge base
    setKnowledgeBase([]);
  };

  // Find the most relevant line from the knowledge base
  const findRelevantLine = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Check for simple greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return { text: "Hello! How can I help you today?", isGreeting: true };
    }
    
    if (lowerMessage.includes('thank')) {
      return { text: "You're welcome! Is there anything else I can help with?", isGreeting: true };
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
      return { text: relevantItems[0].text, isGreeting: false };
    }
    
    return { text: null, isGreeting: false };
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
    
    // Default: return the original answer
    return answer;
  };

  // Generate response using knowledge base
  const generateResponse = (message) => {
    // Find the most relevant line from the knowledge base
    const relevantLine = findRelevantLine(message);
    
    if (relevantLine.isGreeting) {
      return relevantLine.text;
    }
    
    if (relevantLine.text) {
      // Simplify and refine the answer based on the question
      return simplifyAnswer(relevantLine.text, message);
    }
    
    return "I'm not sure how to respond to that. Can you provide more details or try rephrasing your question?";
  };

  // Send a message
  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    // Add user message
    const userMessage = {
      type: 'user',
      text: currentMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [userMessage, ...prev]);
    setCurrentMessage('');
    setIsProcessing(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate response
    const responseText = generateResponse(currentMessage);
    
    // Add AI response
    const aiMessage = {
      type: 'ai',
      text: responseText,
      timestamp: new Date()
    };
    
    setMessages(prev => [aiMessage, ...prev]);
    setIsProcessing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearAll = () => {
    setMessages([]);
    setCurrentMessage('');
    setError('');
  };

  const reloadDocument = () => {
    loadKnowledgeBase();
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
            Advanced Auto-Reply System
          </Typography>
          <Switch
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            icon={<LightMode />}
            checkedIcon={<DarkMode />}
          />
          <Typography variant="body2">
            {darkMode ? "Dark" : "Light"}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Auto-Reply Chat with Secure Knowledge Base
        </Typography>
        
        <Typography variant="body1" gutterBottom align="center" sx={{ mb: 4 }}>
          Answers are generated from our secure knowledge base
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Document section - Removed sensitive information */}
          {/* <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Knowledge Source
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Button
                  variant="outlined"
                  onClick={reloadDocument}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Reload Knowledge Base'}
                </Button>
              </Box>
              
              {documents.length > 0 && (
                <>
                  <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
                    Loaded Knowledge Base:
                  </Typography>
                  <List dense>
                    {documents.map((doc) => (
                      <ListItem
                        key={doc.id}
                        secondaryAction={
                          <IconButton edge="end" onClick={() => removeDocument(doc.id)} size="small">
                            <Delete />
                          </IconButton>
                        }
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Description sx={{ mr: 1, fontSize: 16 }} />
                              {doc.name}
                            </Box>
                          }
                          secondary={doc.content}
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </CardContent>
          </Card> */}
          
          {/* Chat interface */}
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Chat
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Type your message..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isProcessing}
                  multiline
                  maxRows={3}
                />
                <Button
                  variant="contained"
                  endIcon={<Send />}
                  onClick={sendMessage}
                  disabled={isProcessing || !currentMessage.trim()}
                  sx={{ height: 'fit-content' }}
                >
                  Send
                </Button>
              </Box>
              
              <Button size="small" onClick={clearAll}>
                Clear Chat
              </Button>
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
                          borderRadius: 1
                        }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption" fontWeight="bold">
                              {message.type === 'user' ? 'You' : 'AI'}
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
                  No messages yet. Start a conversation!
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>

        <Box sx={{ mt: 4, p: 2, bgcolor: darkMode ? '#1e1e1e' : '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="body2">
            <strong>How it works:</strong> This system reads content from our secure knowledge base and uses it to answer your questions.
            Try asking about return policy, shipping, payment methods, or order tracking.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default AutoReplySystem;