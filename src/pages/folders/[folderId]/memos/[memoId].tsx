import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { ChangeEventHandler, useCallback } from "react";

import { useFolders } from "@/contexts";

const Page: NextPage = () => {
  const { query } = useRouter();
  const { folderId, memoId } = query;

  const memo = useFolders()
    .find(({ id }) => id === folderId)
    ?.memos.find(({ id }) => id === memoId);

  const onChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(() => {}, []);

  if (!memo) {
    return <p className="p-6">メモが見つかりませんでした。</p>;
  }

  return (
    <>
      <Head>
        <title>メモ詳細</title>
      </Head>
      <div className="flex h-full flex-col items-center">
        <time className="opacity-50" dateTime={memo.updatedAt} suppressHydrationWarning>
          {format(parseISO(memo.updatedAt), "yyyy年MM月dd日 HH:mm")}
        </time>
        <textarea
          className="w-full flex-grow resize-none bg-inherit p-4 outline-none"
          value={memo.content}
          {...{ onChange }}
        />
      </div>
    </>
  );
};

export default Page;
