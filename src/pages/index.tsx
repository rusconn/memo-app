import Fuse from "fuse.js";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { MemoCards } from "@/components/common";
import { useFolders } from "@/contexts";

// 下記 OptionalQuery を定義したいが、生成コードの import パスが間違っているので避けた
// https://github.com/aspida/pathpida#define-query---nextjs

const Page: NextPage = () => {
  const router = useRouter();
  const q = (router.query.q ?? "") as string;
  const allMemos = useFolders().flatMap(({ memos }) => memos);
  const title = q === "" ? "すべてのメモ" : "検索結果";

  const memos =
    q === ""
      ? allMemos
      : new Fuse(allMemos, { keys: ["content", "folderName"], threshold: 0.65 })
          .search({ $or: [{ content: q }, { folderName: q }] })
          .map(({ item }) => item);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="p-6">
        <MemoCards {...{ memos }} showFolderName />
      </div>
    </>
  );
};

export default Page;
