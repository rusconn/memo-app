import { Html, Head, Main, NextScript } from "next/document";

import { staticPath } from "@/$path";
import { app } from "@/data";

const Document = () => (
  <Html lang="ja">
    <Head>
      <link rel="icon" href={staticPath.favicon_ico} />
      <meta name="description" content="A simple memo app" />
      <meta property="og:title" content={app.name} />
      <meta property="og:site_name" content={app.name} />
      <meta property="og:type" content="website" />
    </Head>
    <body className="overflow-hidden overscroll-y-none text-sm text-gray-800 dark:text-stone-200">
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
