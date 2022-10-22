import type { NextPage } from "next";
import Head from "next/head";

import { MemoCards } from "@/components/common";
import { useFolders } from "@/contexts";

const Page: NextPage = () => {
  const memos = useFolders().flatMap(folder => folder.memos);

  return (
    <>
      <Head>
        <title>すべてのメモ</title>
      </Head>
      <div className="p-6">
        <MemoCards {...{ memos }} showFolderName />
      </div>
    </>
  );
};

export default Page;
