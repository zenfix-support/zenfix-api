// 法人略語マップ
const corpMap = {
  '株式会社': 'ｶ)', '（株）': 'ｶ)', '(株)': 'ｶ)',
  '有限会社': 'ﾕ)', '（有）': 'ﾕ)', '(有)': 'ﾕ)',
  '合同会社': 'ﾄﾞ)', '合名会社': 'ﾒｲ)', '合資会社': 'ｼ)',
  '医療法人': 'ｲ)', '財団法人': 'ｻﾞｲ)', '社団法人': 'ｼﾔ)'
};

// 全角カタカナ→半角カタカナ変換マップ
const kanaMap = {
  'ガ': 'ｶﾞ', 'ギ': 'ｷﾞ', 'グ': 'ｸﾞ', 'ゲ': 'ｹﾞ', 'ゴ': 'ｺﾞ',
  'ザ': 'ｻﾞ', 'ジ': 'ｼﾞ', 'ズ': 'ｽﾞ', 'ゼ': 'ｾﾞ', 'ゾ': 'ｿﾞ',
  'ダ': 'ﾀﾞ', 'ヂ': 'ﾁﾞ', 'ヅ': 'ﾂﾞ', 'デ': 'ﾃﾞ', 'ド': 'ﾄﾞ',
  'バ': 'ﾊﾞ', 'ビ': 'ﾋﾞ', 'ブ': 'ﾌﾞ', 'ベ': 'ﾍﾞ', 'ボ': 'ﾎﾞ',
  'パ': 'ﾊﾟ', 'ピ': 'ﾋﾟ', 'プ': 'ﾌﾟ', 'ペ': 'ﾍﾟ', 'ポ': 'ﾎﾟ',
  'ヴ': 'ｳﾞ', 'ア': 'ｱ', 'イ': 'ｲ', 'ウ': 'ｳ', 'エ': 'ｴ', 'オ': 'ｵ',
  'カ': 'ｶ', 'キ': 'ｷ', 'ク': 'ｸ', 'ケ': 'ｹ', 'コ': 'ｺ',
  'サ': 'ｻ', 'シ': 'ｼ', 'ス': 'ｽ', 'セ': 'ｾ', 'ソ': 'ｿ',
  'タ': 'ﾀ', 'チ': 'ﾁ', 'ツ': 'ﾂ', 'テ': 'ﾃ', 'ト': 'ﾄ',
  'ナ': 'ﾅ', 'ニ': 'ﾆ', 'ヌ': 'ﾇ', 'ネ': 'ﾈ', 'ノ': 'ﾉ',
  'ハ': 'ﾊ', 'ヒ': 'ﾋ', 'フ': 'ﾌ', 'ヘ': 'ﾍ', 'ホ': 'ﾎ',
  'マ': 'ﾏ', 'ミ': 'ﾐ', 'ム': 'ﾑ', 'メ': 'ﾒ', 'モ': 'ﾓ',
  'ヤ': 'ﾔ', 'ユ': 'ﾕ', 'ヨ': 'ﾖ',
  'ラ': 'ﾗ', 'リ': 'ﾘ', 'ル': 'ﾙ', 'レ': 'ﾚ', 'ロ': 'ﾛ',
  'ワ': 'ﾜ', 'ヲ': 'ｦ', 'ン': 'ﾝ',
  'ァ': 'ｧ', 'ィ': 'ｨ', 'ゥ': 'ｩ', 'ェ': 'ｪ', 'ォ': 'ｫ',
  'ッ': 'ｯ', 'ャ': 'ｬ', 'ュ': 'ｭ', 'ョ': 'ｮ',
  'ー': 'ｰ', '、': '､', '。': '｡', '・': '･', '「': '｢', '」': '｣', '　': ' '
};

// 【新規追加】有効なAPIキーのリスト（本来はデータベース等で管理しますが今回は直接記述します）
const VALID_API_KEYS = [
  'zenfix_demo_key',      // 私たちのWebサイトの無料デモ用
  'zenfix_pro_sk_12345'   // 【本番用】契約した法人顧客に渡す専用キー
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  if (req.method === 'OPTIONS') { return res.status(200).end(); }
  if (req.method !== 'POST') { return res.status(405).json({ error: 'POSTメソッドのみ許可されています' }); }

  // 【門番】送信されてきた「x-api-key」をチェックする
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || !VALID_API_KEYS.includes(apiKey)) {
    // 鍵がない、または間違っている場合はエラーで弾き返す！
    return res.status(401).json({ error: '無効なAPIキーです。不正なアクセスをブロックしました。' });
  }

  const { text } = req.body;
  if (!text) { return res.status(400).json({ error: '変換するテキスト(text)が送信されていません' }); }

  try {
    let converted = text;
    for (const [key, value] of Object.entries(corpMap)) {
      converted = converted.split(key).join(value);
    }
    converted = converted.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
    converted = converted.toUpperCase();
    converted = converted.replace(/[ァ-ンヴー、。・「」　]/g, function(match) {
      return kanaMap[match] || match;
    });
    converted = converted.replace(/[^ｱ-ﾝﾞﾟｧ-ｫｬ-ｮｯｰA-Z0-9\-\.\(\)\/\\ \n]/g, '');

    res.status(200).json({
      success: true,
      converted_text: converted,
    });
  } catch (error) {
    res.status(500).json({ error: '変換処理中にエラーが発生しました' });
  }
}
