import { Html, Head, Main, NextScript } from "next/document";

import { staticPath } from "@/$path";

const Document = () => (
  <Html lang="ja">
    <Head>
      <link rel="icon" href={staticPath.favicon_ico} />
      <meta name="description" content="シンプルなメモアプリ" />
      <meta property="og:title" content="メモアプリ" />
      <meta property="og:site_name" content="メモアプリ" />
      <meta property="og:type" content="website" />
    </Head>
    <body className="overflow-hidden overscroll-y-none text-sm text-gray-800 dark:text-stone-200">
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
