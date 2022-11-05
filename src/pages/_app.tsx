import "@/styles/globals.css";

import type { AppProps } from "next/app";
import Head from "next/head";

import { Layout } from "@/components/layout";
import {
  FoldersProvider,
  MemosProvider,
  RenameFolderIdProvider,
  SelectedMemoIdProvider,
} from "@/contexts";
import { app } from "@/data";

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <title>{app.name}</title>
    </Head>
    <FoldersProvider>
      <MemosProvider>
        <RenameFolderIdProvider>
          <SelectedMemoIdProvider>
            <Layout>
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <Component {...pageProps} />
            </Layout>
          </SelectedMemoIdProvider>
        </RenameFolderIdProvider>
      </MemosProvider>
    </FoldersProvider>
  </>
);

export default MyApp;
