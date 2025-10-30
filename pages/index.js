import { useState } from 'react';

export default function Home() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setAnswer(data.answer || 'Không nhận được phản hồi.');
    } catch (error) {
      setAnswer('Lỗi kết nối: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Chatbot Tra cứu Văn bản</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nhập câu hỏi..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
        />
        <button type="submit" disabled={loading} style={{ marginTop: '0.5rem', padding: '0.5rem 1rem' }}>
          {loading ? 'Đang gửi...' : 'Gửi'}
        </button>
      </form>
      {answer && (
        <div style={{ marginTop: '1rem', background: '#f1f1f1', padding: '0.75rem', borderRadius: '4px' }}>
          <strong>Trả lời:</strong>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
