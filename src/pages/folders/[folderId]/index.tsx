import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { MemoCards } from "@/components/common";
import { useFolders } from "@/contexts";

const Page: NextPage = () => {
  const router = useRouter();

  const folderId = (router.query.folderId ?? "") as string;
  const folder = useFolders().find(({ id }) => id === folderId);

  if (!folder) {
    return <p className="p-6">フォルダが見つかりませんでした。</p>;
  }

  const { memos } = folder;

  return (
    <>
      <Head>
        <title>{folder.name}</title>
      </Head>
      <div className="p-6">
        <MemoCards {...{ memos }} />
      </div>
    </>
  );
};

export default Page;