import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { MemoCards } from "@/components/common";
import { useFolders, useMemos } from "@/contexts";

const Page: NextPage = () => {
  const router = useRouter();

  const folderId = router.query.folderId as string | undefined;
  const folder = useFolders().find(({ id }) => id === folderId);
  const allMemos = useMemos();

  if (!folderId) {
    return <p className="p-6">ロード中…</p>;
  }

  if (!folder) {
    return <p className="p-6">フォルダが見つかりませんでした。</p>;
  }

  const memos = allMemos
    .filter(memo => memo.folderId === folderId)
    .map(memo => ({
      ...memo,
      headline: memo.content.split("\n")[0],
      folderName: folder.name,
    }));

  return (
    <>
      <Head>
        <title>{folder.name}</title>
      </Head>
      <div className="p-6">
        <MemoCards {...{ memos }} hideFolderLine />
      </div>
    </>
  );
};

export default Page;
