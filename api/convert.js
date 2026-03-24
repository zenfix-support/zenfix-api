// 【新規追加】法人略語マップ（全銀協の標準ルールに基づく）
const corpMap = {
  '株式会社': 'ｶ)',
  '（株）': 'ｶ)',
  '(株)': 'ｶ)',
  '有限会社': 'ﾕ)',
  '（有）': 'ﾕ)',
  '(有)': 'ﾕ)',
  '合同会社': 'ﾄﾞ)',
  '合名会社': 'ﾒｲ)',
  '合資会社': 'ｼ)',
  '医療法人': 'ｲ)',
  '財団法人': 'ｻﾞｲ)',
  '社団法人': 'ｼﾔ)'
};

// 全角カタカナ→半角カタカナ変換マップ（濁点・半濁点分離対応）
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
  'ー': 'ｰ', '、': '､', '。': '｡', '・': '･', '「': '｢', '」': '｣', '　': ' ' // 全角スペースは半角スペースに
};

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POSTメソッドのみ許可されています' });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: '変換するテキスト(text)が送信されていません' });
  }

  try {
    let converted = text;

    // 0. 法人略語の自動変換（漢字が消去される前に、真っ先に実行する）
    for (const [key, value] of Object.entries(corpMap)) {
      // 該当する法人名（例：株式会社）を見つけたら、略語（例：ｶ) ）に置き換える
      converted = converted.split(key).join(value);
    }

    // 1. 全角英数字を半角に変換
    converted = converted.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });

    // 2. 全銀ルールの基本：英字はすべて「大文字」に統一
    converted = converted.toUpperCase();

    // 3. 全角カタカナ・記号を半角カタカナに変換（濁点分離）
    converted = converted.replace(/[ァ-ンヴー、。・「」　]/g, function(match) {
      return kanaMap[match] || match;
    });

    // 4. 全銀フォーマットで使用できない不正な記号（漢字・ひらがな等）を削除
    // ※ ｶ) のカッコ「)」が消されないように、許可リストに入れています
    converted = converted.replace(/[^ｱ-ﾝﾞﾟｧ-ｫｬ-ｮｯｰA-Z0-9\-\.\(\)\/\\ \n]/g, '');

    res.status(200).json({
      success: true,
      message: 'Zenfix: 法人略語変換を含む全銀フォーマット最適化に成功しました。',
      original_text: text,
      converted_text: converted,
    });
  } catch (error) {
    res.status(500).json({ error: '変換処理中にエラーが発生しました' });
  }
}
