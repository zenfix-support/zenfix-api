export default function handler(req, res) {
  // セキュリティ（CORS）設定：外部システムからのアクセスを許可
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POST（データ送信）以外はエラーを返す
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POSTメソッドのみ許可されています' });
  }

  // 送られてきたデータを受け取る
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: '変換するテキスト(text)が送信されていません' });
  }

  // 【Zenfix コア機能（MVP版）】
  // 全銀フォーマットの第一歩として、全角英数字を「半角」に自動変換する機能
  const convertedText = text.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });

  // 綺麗に整形したデータを返す
  res.status(200).json({
    success: true,
    message: 'Zenfix: 変換に成功しました。',
    original_text: text,
    converted_text: convertedText,
  });
}
