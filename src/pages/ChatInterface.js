import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Chip,
  IconButton,
  CircularProgress,
  AppBar,
  Toolbar
} from '@mui/material';
import { Send, ExitToApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { 
      text: "Hello! I'm your AI assistant. How can I help you today?", 
      sender: 'ai', 
      timestamp: new Date() 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message to chat
    const userMessage = { text: inputMessage, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      // Replace this with your actual AI backend API call
      const response = await fetch('YOUR_AI_BACKEND_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: inputMessage, 
          user: currentUser.email 
        }),
      });

      const data = await response.json();
      const aiResponse = { 
        text: data.response || `I received your message: "${inputMessage}". This is a simulated response.`, 
        sender: 'ai', 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = { 
        text: 'Sorry, I encountered an error processing your request.', 
        sender: 'ai', 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!currentUser) {
    return null; // Or a loading spinner
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AI Chat Assistant
          </Typography>
          <Chip 
            avatar={<Avatar>{currentUser?.name?.charAt(0)}</Avatar>}
            label={currentUser?.name}
            variant="outlined"
            sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)', mr: 2 }}
          />
          <IconButton color="inherit" onClick={handleLogout}>
            <ExitToApp />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2, backgroundColor: '#f5f5f5' }}>
        <List sx={{ mb: 2 }}>
          {messages.map((message, index) => (
            <ListItem key={index} sx={{ 
              display: 'flex', 
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
              px: 1 
            }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
                maxWidth: '70%'
              }}>
                <ListItemAvatar sx={{ minWidth: 40 }}>
                  <Avatar sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: message.sender === 'user' ? '#1976d2' : '#4caf50' 
                  }}>
                    {message.sender === 'user' ? currentUser?.name?.charAt(0) : 'AI'}
                  </Avatar>
                </ListItemAvatar>
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    ml: message.sender === 'user' ? 0 : 1,
                    mr: message.sender === 'user' ? 1 : 0,
                    backgroundColor: message.sender === 'user' ? '#1976d2' : 'white',
                    color: message.sender === 'user' ? 'white' : 'text.primary'
                  }}
                >
                  <ListItemText 
                    primary={message.text} 
                    secondary={new Date(message.timestamp).toLocaleTimeString()} 
                    sx={{ 
                      '& .MuiListItemText-secondary': { 
                        color: message.sender === 'user' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                        fontSize: '0.75rem',
                        mt: 0.5
                      } 
                    }}
                  />
                </Paper>
              </Box>
            </ListItem>
          ))}
          {loading && (
            <ListItem sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <ListItemAvatar sx={{ minWidth: 40 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: '#4caf50' }}>
                    AI
                  </Avatar>
                </ListItemAvatar>
                <Paper elevation={1} sx={{ p: 2, ml: 1 }}>
                  <CircularProgress size={16} />
                </Paper>
              </Box>
            </ListItem>
          )}
          <div ref={messagesEndRef} />
        </List>
      </Box>

      <Divider />
      <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
        <Box sx={{ display: 'flex' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            multiline
            maxRows={3}
          />
          <Button
            variant="contained"
            endIcon={<Send />}
            onClick={handleSendMessage}
            disabled={loading || !inputMessage.trim()}
            sx={{ ml: 1 }}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatInterface;