import "@/styles/globals.css";

import type { AppProps } from "next/app";
import Head from "next/head";

import { Layout } from "@/components/layout";
import { FoldersProvider, SelectedMemoIdProvider } from "@/contexts";

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <title>メモアプリ</title>
    </Head>
    <FoldersProvider>
      <SelectedMemoIdProvider>
        <Layout>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Component {...pageProps} />
        </Layout>
      </SelectedMemoIdProvider>
    </FoldersProvider>
  </>
);

export default MyApp;
