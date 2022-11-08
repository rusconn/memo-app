import Fuse from "fuse.js";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { MemoCards } from "@/components/common";
import { useFolders, useMemos } from "@/contexts";

export type OptionalQuery = {
  q?: string;
};

const Page: NextPage = () => {
  const router = useRouter();
  const folders = useFolders();
  const allMemos = useMemos();

  const { q }: OptionalQuery = router.query;

  const allMemosToUse = allMemos
    .sort((x, y) => Date.parse(y.updatedAt) - Date.parse(x.updatedAt))
    .map(memo => ({
      ...memo,
      headline: memo.content.split("\n")[0],
      folderName: folders.find(folder => folder.id === memo.folderId)?.name ?? "",
    }));

  const [title, memos] =
    !q || q === ""
      ? ["すべてのメモ", allMemosToUse]
      : [
          "検索結果",
          new Fuse(allMemosToUse, { keys: ["content", "folderName"], threshold: 0.65 })
            .search({ $or: [{ content: q }, { folderName: q }] })
            .map(({ item }) => item),
        ];

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="p-6">
        <MemoCards {...{ memos }} />
      </div>
    </>
  );
};

export default Page;
