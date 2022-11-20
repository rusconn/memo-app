import "@/styles/globals.css";

import type { AppProps } from "next/app";
import Head from "next/head";

import { Layout } from "@/components/layout";
import { RenameFolderIdProvider, SelectedMemoIdProvider } from "@/contexts";

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <title>メモアプリ</title>
    </Head>
    <RenameFolderIdProvider>
      <SelectedMemoIdProvider>
        <Layout>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Component {...pageProps} />
        </Layout>
      </SelectedMemoIdProvider>
    </RenameFolderIdProvider>
  </>
);

export default MyApp;
