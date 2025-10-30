export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Phương thức không được hỗ trợ' });
    return;
  }
  const { question } = req.body;
  if (!question) {
    res.status(400).json({ error: 'Chưa có câu hỏi' });
    return;
  }
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-1.0-pro-latest';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const sampleText = 
    "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\n" +
    "Độc lập - Tự do - Hạnh phúc\n" +
    "----------\n" +
    "UBND TP. X______\n" +
    "Số: 123/UBND-VP\n" +
    "V/v: Tổ chức kiểm tra cuối năm học 2023-2024\n\n" +
    "Căn cứ Điều lệ trường học và quy định hiện hành về tổ chức, đánh giá trong nhà trường;\n" +
    "Căn cứ kết quả học tập của học sinh trong học kỳ 2 năm học 2023-2024;\n" +
    "UBND THÀNH PHỐ X thông báo:\n" +
    "1. Tổ chức kiểm tra cuối năm học đối với tất cả học sinh tiểu học và THCS;\n" +
    "2. Các trường THPT tổ chức kỳ thi kiểm tra cuối năm theo kế hoạch giảng dạy;\n" +
    "3. Thời gian kiểm tra: từ ngày ... đến ngày ... tháng ... năm 2024;\n" +
    "4. Nội dung kiểm tra gồm kiến thức chương trình học kỳ 2 của từng lớp.\n" +
    "5. Các trường phối hợp Phòng Giáo dục và Đào tạo chấm thi và công bố kết quả.";

  const prompt = `Dựa vào văn bản sau, trả lời câu hỏi của người dùng.\n\nVăn bản mẫu:\n${sampleText}\n\nHỏi: ${question}\nTrả lời:`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
      res.status(response.status).json({ error: data.error?.message || 'Lỗi API Gemini' });
      return;
    }
    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    res.status(200).json({ answer: answer || 'Không có câu trả lời.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
