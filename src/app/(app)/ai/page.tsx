// 'use client';

// import { useState } from 'react';
// import { Loader2 } from 'lucide-react';
// import axios from 'axios';

// type ChatMessage = {
//   role: 'user' | 'assistant';
//   content: string;
// };

// export default function Chat() {
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     if (!input.trim()) return;

//     const newMessages: ChatMessage[] = [
//       ...messages,
//       { role: 'user', content: input },
//     ];

//     setMessages(newMessages);
//     setIsLoading(true);

//     try {
//       const res = await axios.post('/api/chat', {
//         messages: newMessages,
//       });

//       const aiReply = res.data.text;

//       setMessages([...newMessages, { role: 'assistant', content: aiReply }]);
//       setInput('');
//     } catch (err: any) {
//       console.error(err);
//       setError(err.response?.data?.error || 'Something went wrong');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col w-full max-w-md mx-auto py-24 px-4">
//       <h1 className="text-2xl font-bold mb-6">Chat with AI</h1>

//       <div className="flex flex-col gap-4 mb-4">
//         {messages.map((m, i) => (
//           <div
//             key={i}
//             className={`p-3 rounded ${
//               m.role === 'user' ? 'bg-blue-100' : 'bg-green-100'
//             }`}
//           >
//             <strong>{m.role === 'user' ? 'You' : 'AI'}:</strong>{' '}
//             <span>{m.content}</span>
//           </div>
//         ))}
//       </div>

//       {error && <p className="text-red-500 mb-2">❌ {error}</p>}

//       <form onSubmit={handleSubmit} className="flex gap-2">
//         <input
//           type="text"
//           value={input}
//           onChange={e => setInput(e.target.value)}
//           placeholder="Say something..."
//           className="flex-1 border border-gray-300 rounded px-3 py-2"
//           disabled={isLoading}
//         />
//         <button
//           type="submit"
//           disabled={isLoading || !input.trim()}
//           className="bg-black text-white px-4 py-2 rounded"
//         >
//           {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Send'}
//         </button>
//       </form>
//     </div>
//   );
// }
import React from 'react'

const page = () => {
  return (
    <div>
      
    </div>
  )
}

export default page
