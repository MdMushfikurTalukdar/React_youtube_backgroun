import React, { useState, useEffect } from 'react';

const AutoReply = () => {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simple response system in JavaScript
  const responses = {
    "hi": ["Hello!", "Hi there!", "Greetings!"],
    "hello": ["Hello!", "Hi there!", "Greetings!"],
    "hey": ["Hello!", "Hi there!", "Greetings!"],
    "how are you": ["I'm good, thanks!", "Doing well!", "All systems operational!"],
    "what's your name": ["I'm AutoBot!", "Call me AutoReply!", "I'm your friendly AutoReply bot"],
    "default": ["Interesting, tell me more.", "I'm not sure I understand.", "Could you rephrase that?"]
  };

  const getResponse = (inputText) => {
    const inputLower = inputText.toLowerCase();
    for (const key in responses) {
      if (inputLower.includes(key)) {
        return responses[key][Math.floor(Math.random() * responses[key].length)];
      }
    }
    return responses["default"][Math.floor(Math.random() * responses["default"].length)];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      // Add user message to conversation
      const userMessage = { sender: 'user', text: message };
      setConversation(prev => [...prev, userMessage]);
      
      // Get reply from JavaScript function
      const botReply = getResponse(message);
      
      // Add bot reply to conversation after a small delay to simulate processing
      setTimeout(() => {
        setConversation(prev => [...prev, { sender: 'bot', text: botReply }]);
        setReply(botReply);
        setMessage('');
      }, 300);
    } catch (err) {
      setError('Error generating reply: ' + err.message);
    }
  };

  if (error) {
    return <div className="container py-5 text-center text-danger">Error: {error}</div>;
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">Auto Reply Bot</h1>
      
      <div className="card mb-4">
        <div className="card-body" style={{ height: '300px', overflowY: 'auto' }}>
          {conversation.length === 0 ? (
            <p className="text-muted">Start a conversation with the bot...</p>
          ) : (
            conversation.map((msg, index) => (
              <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-end' : 'text-start'}`}>
                <div className={`d-inline-block p-2 rounded ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-light'}`}>
                  {msg.text}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="btn btn-primary" type="submit" disabled={!message.trim()}>
            Send
          </button>
        </div>
      </form>
      
      {reply && (
        <div className="alert alert-info mt-3">
          <strong>Bot replied:</strong> {reply}
        </div>
      )}
    </div>
  );
};

export default AutoReply;