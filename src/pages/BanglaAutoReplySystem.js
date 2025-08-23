import React, { useState, useRef } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  AppBar,
  Toolbar,
  Tabs,
  Tab
} from '@mui/material';
import {
  Upload,
  Send,
  Delete,
  SmartToy
} from '@mui/icons-material';

const BanglaAutoReplySystem = () => {
  const [documents, setDocuments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const fileInputRef = useRef(null);

  // Pre-loaded Bangla knowledge base with sample content
  const [knowledgeBase, setKnowledgeBase] = useState([
    "আমাদের প্রতিষ্ঠানটি ২০১০ সালে প্রতিষ্ঠিত হয়েছিল। আমরা শিক্ষা প্রযুক্তি领域এ কাজ করি।",
    "আমাদের গ্রাহক সেবা দল ২৪/৭ আপনাকে সহায়তা করার জন্য উপলব্ধ। ফোন নম্বর: ০১৭১১২৩৪৫৬৭।",
    "আমরা সকল পণ্যের উপর ৩০-দিনের মানি-ব্যাক গ্যারান্টি অফার করি। যদি不满意হন, সম্পূর্ণ refund পাবেন।",
    "ডেলিভারি সময় সাধারণত ৩-৫ কর্মদিবস সময় লাগে। ঢাকার ভিতরে next day delivery available।",
    "আমাদের products এর price ৫০০ টাকা থেকে ৫০,০০০ টাকা পর্যন্ত। installment এ কিনতে পারবেন।",
    "আমাদের office অবস্থিত Gulshan, Dhaka তে। visiting hours সকাল ৯টা থেকে বিকেল ৫টা পর্যন্ত।",
    "নতুন customers ১৫% discount পান প্রথম order এ। referral দিলে additional ১০% discount।",
    "আমাদের training program ৩ মাস duration এর। course complete করলে certificate দেওয়া হয়।",
    "technical support পেতে email করুন support@company.com এ বা call করুন ০৯৬১२৩৪৫৬৭৮ নম্বরে।",
    "website: www.company.com, Facebook: facebook.com/company, YouTube: youtube.com/company"
  ]);

  // Predefined responses for common questions in Bangla/Banglish
  const predefinedResponses = {
    greeting: ["হ্যালো! আপনাকে কিভাবে সাহায্য করতে পারি?", "আসসালামু আলাইকুম! কেমন আছেন?", "নমস্কার! জিজ্ঞাসা করুন কীভাবে帮助করতে পারি?"],
    thanks: ["আপনাকে ধন্যবাদ!", "কোন সমস্যা নেই!", "আপনার স্বাগতম!"],
    goodbye: ["বিদায়! আপনার দিন শুভ হোক!", "আবার দেখা হবে!", "শুভ বিদায়!"],
    unknown: ["দুঃখিত, আমি এই প্রশ্নের উত্তর দিতে পারছি না। অন্য কিছু জিজ্ঞাসা করুন।", "আমি এই সম্পর্কে জানি না। আমাদের knowledge base দেখুন।", "আমি এখনও এটি শিখিনি। অন্য প্রশ্ন করুন।"]
  };

  // Enhanced Banglish to Bangla converter
  const convertBanglishToBangla = (text) => {
    const mapping = {
      // Vowels
      "a": "া", "aa": "া", "i": "ি", "ee": "ী", "u": "ু", "oo": "ূ", "ri": "ৃ", "e": "ে", "oi": "ৈ", "o": "ো", "ou": "ৌ",
      // Consonants
      "k": "ক", "kh": "খ", "g": "গ", "gh": "ঘ", "ng": "ঙ",
      "ch": "চ", "chh": "ছ", "j": "জ", "jh": "ঝ", "yn": "ঞ",
      "t": "ট", "th": "ঠ", "d": "ড", "dh": "ঢ", "n": "ণ",
      "p": "প", "ph": "ফ", "b": "ব", "bh": "ভ", "m": "ম",
      "y": "য", "r": "র", "l": "ল", "w": "ও", "sh": "শ", 
      "s": "স", "h": "হ", "dd": "ড", "tt": "ট", "rh": "ড়", 
      // Numbers
      "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪", 
      "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯"
    };
    
    let result = text;
    for (const [eng, bangla] of Object.entries(mapping)) {
      const regex = new RegExp(eng, "gi");
      result = result.replace(regex, bangla);
    }
    return result;
  };

  // Process text for better understanding
  const preprocessText = (text) => {
    let processed = text.toLowerCase();
    processed = convertBanglishToBangla(processed);
    processed = processed.replace(/[^\w\s\u0980-\u09FF]/g, '');
    return processed;
  };

  // Handle document upload
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const newDocuments = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type,
      content: null,
      uploadedAt: new Date()
    }));

    setDocuments(prev => [...prev, ...newDocuments]);
    setError('');

    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        setDocuments(prev => prev.map(doc => 
          doc.id === newDocuments[index].id ? {...doc, content} : doc
        ));
        const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
        setKnowledgeBase(prev => [...prev, ...paragraphs]);
      };
      reader.onerror = () => {
        setError(`Failed to read file: ${file.name}`);
      };
      reader.readAsText(file);
    });
  };

  // Remove a document
  const removeDocument = (id) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  // Add custom knowledge
  const addCustomKnowledge = () => {
    const knowledge = prompt("Enter information to add to the knowledge base:");
    if (knowledge && knowledge.trim()) {
      setKnowledgeBase(prev => [...prev, knowledge.trim()]);
      setMessages(prev => [{
        type: 'system',
        text: `Custom knowledge added to database`,
        timestamp: new Date()
      }, ...prev]);
    }
  };

  // Calculate text similarity
  const calculateSimilarity = (text1, text2) => {
    const words1 = preprocessText(text1).split(/\s+/);
    const words2 = preprocessText(text2).split(/\s+/);
    
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return union.size > 0 ? intersection.size / union.size : 0;
  };

  // Find the most relevant knowledge for a question
  const findRelevantKnowledge = (question) => {
    let bestMatch = null;
    let highestSimilarity = 0;
    
    for (const knowledge of knowledgeBase) {
      const similarity = calculateSimilarity(question, knowledge);
      if (similarity > highestSimilarity) {
        highestSimilarity = similarity;
        bestMatch = knowledge;
      }
    }
    
    return { knowledge: bestMatch, similarity: highestSimilarity };
  };

  // Generate response based on Bangla/Banglish input
  const generateResponse = (message) => {
    const processedMessage = preprocessText(message);
    
    // Check for greetings
    if (processedMessage.includes('hello') || processedMessage.includes('hi') || 
        processedMessage.includes('hey') || processedMessage.includes('হ্যালো') ||
        processedMessage.includes('নমস্কার') || processedMessage.includes('আসসালামু')) {
      return predefinedResponses.greeting[Math.floor(Math.random() * predefinedResponses.greeting.length)];
    }
    
    // Check for thanks
    if (processedMessage.includes('thank') || processedMessage.includes('thanks') ||
        processedMessage.includes('ধন্যবাদ')) {
      return predefinedResponses.thanks[Math.floor(Math.random() * predefinedResponses.thanks.length)];
    }
    
    // Check for goodbye
    if (processedMessage.includes('bye') || processedMessage.includes('goodbye') ||
        processedMessage.includes('বিদায়')) {
      return predefinedResponses.goodbye[Math.floor(Math.random() * predefinedResponses.goodbye.length)];
    }
    
    // Find relevant knowledge
    const { knowledge, similarity } = findRelevantKnowledge(message);
    
    if (knowledge && similarity > 0.1) {
      return `জি, আপনার প্রশ্নের উত্তর: ${knowledge}`;
    }
    
    // Fallback to unknown response
    return predefinedResponses.unknown[Math.floor(Math.random() * predefinedResponses.unknown.length)];
  };

  // Send a message
  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage = {
      type: 'user',
      text: currentMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [userMessage, ...prev]);
    setCurrentMessage('');
    setIsProcessing(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const responseText = generateResponse(currentMessage);
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
    setDocuments([]);
    setMessages([]);
    setCurrentMessage('');
    setError('');
  };

  return (
    <Box sx={{ 
      bgcolor: '#f5f5f5', 
      minHeight: '100vh',
      pb: 4
    }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <SmartToy sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            বাংলা Auto-Reply System
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          বাংলা এবং Banglish Auto-Reply
        </Typography>
        
        <Typography variant="body1" gutterBottom align="center" sx={{ mb: 4 }}>
          নীচের sample questions গুলি try করুন অথবা নিজের questions জিজ্ঞাসা করুন
        </Typography>

        <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
          {[
            "হ্যালো", 
            "আপনাদের প্রতিষ্ঠান কবে প্রতিষ্ঠিত হয়েছিল?", 
            "delivery time koto?",
            "discount ache?",
            "office kothay?",
            "technical support number",
            "কিভাবে অর্ডার করব?",
            "price koto?",
            "thanks"
          ].map((question, index) => (
            <Chip
              key={index}
              label={question}
              onClick={() => setCurrentMessage(question)}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="চ্যাট" />
            <Tab label="নলেজ বেস" />
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
            <Box sx={{ flex: 1 }}>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    নলেজ সোর্স
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<Upload />}
                      onClick={() => fileInputRef.current.click()}
                      size="small"
                    >
                      টেক্সট ফাইল আপলোড
                    </Button>
                    <input
                      type="file"
                      multiple
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                      accept=".txt,.text,text/plain"
                    />
                    
                    <Button
                      variant="outlined"
                      onClick={addCustomKnowledge}
                      size="small"
                    >
                      কাস্টম নলেজ যোগ করুন
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
            
            <Box sx={{ flex: 2 }}>
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  বাংলা/Banglish চ্যাট
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="বাংলা, Banglish, বা English এ сообщение লিখুন..."
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
                    পাঠান
                  </Button>
                </Box>
                
                <Button size="small" onClick={clearAll} sx={{ mr: 1 }}>
                  সব Clear করুন
                </Button>
              </Paper>
              
              {messages.length > 0 ? (
                <Paper variant="outlined" sx={{ p: 2, maxHeight: '500px', overflow: 'auto' }}>
                  <List>
                    {messages.map((message, index) => (
                      <Box key={index}>
                        <ListItem alignItems="flex-start">
                          <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            width: '100%',
                            p: 1,
                            bgcolor: message.type === 'user' ? 'primary.light' : 'grey.100',
                            borderRadius: 1
                          }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="caption" fontWeight="bold">
                                {message.type === 'user' ? 'আপনি' : 'Auto-Reply'}
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
                </Paper>
              ) : (
                <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body1" color="textSecondary">
                    এখনও কোনো বার্তা নেই। উপরের sample questions গুলি try করুন।
                  </Typography>
                </Paper>
              )}
            </Box>
          </Box>
        )}

        {tabValue === 1 && (
          <Card variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              নলেজ বেস (প্রি-লোডেড কন্টেন্ট)
            </Typography>
            
            <List>
              {knowledgeBase.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`${index + 1}. ${item}`} />
                </ListItem>
              ))}
            </List>
          </Card>
        )}

        <Box sx={{ mt: 4, p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Sample Questions to Try:
          </Typography>
          <Typography variant="body2" paragraph>
            • "হ্যালো" বা "hello" - Greeting response<br/>
            • "আপনাদের প্রতিষ্ঠান কবে প্রতিষ্ঠিত হয়েছিল?" - Company establishment date<br/>
            • "delivery time koto?" - Delivery information<br/>
            • "discount ache?" - Discount information<br/>
            • "office kothay?" - Office location<br/>
            • "technical support number" - Support contact<br/>
            • "কিভাবে অর্ডার করব?" - How to order<br/>
            • "price koto?" - Pricing information<br/>
            • "thanks" or "ধন্যবাদ" - Thank you response
          </Typography>
          <Typography variant="body2">
            এই systemটি সম্পূর্ণভাবে frontend এ কাজ করে। কোনো backend required না।
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default BanglaAutoReplySystem;