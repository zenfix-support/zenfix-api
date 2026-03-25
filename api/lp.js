export default function handler(req, res) {
  // アクセスされたURLの末尾（slug）を取得
  const { slug } = req.query;

  // 【集客キーワード辞書】ここを増やせば、自動でページが増殖します！
  const pages = {
    'dakuten': {
      title: '全銀フォーマットの「濁点・半濁点分離」を自動化',
      desc: '「ガ」を「ｶ」と「ﾞ」に自動分離。全銀フォーマット特有のやっかいな濁点エラーを瞬時に解決するAPIツールです。',
      h1: '全銀フォーマットの「濁点分離」エラーを全自動で直すAPI'
    },
    'hankaku-kana': {
      title: '全銀協フォーマットの全角カナを半角カナに一括変換',
      desc: '全角カタカナや全角英数字が含まれるデータを、銀行ルールに従って半角に一括変換する開発者向けAPIです。',
      h1: '全銀フォーマットの「全角カナ→半角カナ」一括変換API'
    },
    'ryakugo': {
      title: '株式会社など法人略語を全銀フォーマット用に自動変換',
      desc: '株式会社を「ｶ)」に、有限会社を「ﾕ)」に自動変換。全銀協の法人略語ルールに完全対応した変換APIです。',
      h1: '「株式会社」などの法人略語を全銀ルール（ｶ）に自動変換するAPI'
    }
  };

  // 辞書にないURLにアクセスされた場合は、hankaku-kanaのページをデフォルトで表示
  const pageData = pages[slug] || pages['hankaku-kana'];

  // SEOに最適化されたHTMLをその場で組み立てる
  const html = `
  <!DOCTYPE html>
  <html lang="ja">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageData.title} | Zenfix</title>
    <meta name="description" content="${pageData.desc}">
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-gray-50 text-gray-800 font-sans">
    <div class="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <p class="text-blue-600 font-semibold tracking-wide uppercase">Zenfix - 全銀データ変換API</p>
        <h1 class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          ${pageData.h1}
        </h1>
        <p class="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
          ${pageData.desc}
        </p>
      </div>

      <div class="bg-white shadow-xl rounded-lg overflow-hidden p-8 text-center border border-gray-100">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">エラー対応の無駄な労働から解放されませんか？</h2>
        <p class="text-gray-600 mb-8">Zenfixを自社システムにAPIとして組み込めば、このような全銀フォーマットの修正作業がすべて全自動化されます。</p>
        
        <a href="/" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full transition duration-300 shadow-md text-lg">
          まずは無料デモで変換精度を試す（トップページへ）
        </a>
      </div>
    </div>
  </body>
  </html>
  `;

  // 組み立てたHTMLをブラウザに返す
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(html);
}
