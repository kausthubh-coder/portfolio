import { useState } from 'react';

export default function Chatbot() {
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'bot' }>>([]);
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { text: input, sender: 'user' }]);
    
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "I'm a chatbot trained on your data. I can help schedule meetings and answer questions!", sender: 'bot' },
      ]);
    }, 1000);

    setInput('');
  };

  return (
    <div className="h-[400px] flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, i) => (
          <div
            key={i}
            className={`${
              message.sender === 'user' ? 'ml-auto bg-blue-600' : 'mr-auto bg-[var(--border-color)]'
            } rounded-lg p-2 max-w-[80%]`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="border-t border-[var(--border-color)] p-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          className="w-full px-3 py-2 bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </form>
    </div>
  );
}