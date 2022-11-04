import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { ChangeEventHandler, useCallback, useState } from "react";

import { useFolders, useFoldersMutation } from "@/contexts";

const Page: NextPage = () => {
  const { query } = useRouter();
  const folderId = query.folderId as string;
  const memoId = query.memoId as string;

  const memo = useFolders()
    .find(({ id }) => id === folderId)
    ?.memos.find(({ id }) => id === memoId);

  const [timerId, setTimerId] = useState<number>();
  const [content, setContent] = useState(memo?.content ?? "");
  const { updateMemo } = useFoldersMutation();

  const onChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(
    ({ currentTarget }) => {
      window.clearTimeout(timerId);

      setContent(currentTarget.value);

      const id = window.setTimeout(() => {
        updateMemo({ folderId, memoId, content: currentTarget.value });
      }, 500);

      setTimerId(id);
    },
    [timerId, setContent, folderId, memoId, updateMemo]
  );

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
          value={content}
          {...{ onChange }}
        />
      </div>
    </>
  );
};

export default Page;
