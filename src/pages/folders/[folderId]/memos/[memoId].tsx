import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { ChangeEventHandler, MouseEventHandler, useCallback, useEffect, useState } from "react";

import { useMemos, useMemosMutation } from "@/contexts";

const Page: NextPage = () => {
  const { query } = useRouter();
  const folderId = query.folderId as string | undefined;
  const memoId = query.memoId as string | undefined;

  const memo = useMemos().find(x => x.folderId === folderId && x.id === memoId);
  const { updateMemo } = useMemosMutation();

  const [timerId, setTimerId] = useState<number>();
  const [content, setContent] = useState("");

  useEffect(() => {
    if (memo) {
      setContent(memo.content);
    }
  }, [memo]);

  const onChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(
    ({ currentTarget }) => {
      if (!folderId || !memoId) {
        return;
      }

      window.clearTimeout(timerId);

      setContent(currentTarget.value);

      const id = window.setTimeout(() => {
        updateMemo({ id: memoId, content: currentTarget.value });
      }, 500);

      setTimerId(id);
    },
    [timerId, setContent, folderId, memoId, updateMemo]
  );

  // 上流コンポーネントによるメモの選択状態解除を避ける
  const onMouseDown: MouseEventHandler<HTMLDivElement> = useCallback(e => {
    e.stopPropagation();
  }, []);

  if (!memoId) {
    return <p className="p-6">ロード中…</p>;
  }

  if (!memo) {
    return <p className="p-6">メモが見つかりませんでした。</p>;
  }

  return (
    <>
      <Head>
        <title>メモ詳細</title>
      </Head>
      <div className="flex h-full flex-col items-center space-y-2" {...{ onMouseDown }}>
        <time className="opacity-50" dateTime={memo.updatedAt} suppressHydrationWarning>
          {format(parseISO(memo.updatedAt), "yyyy年MM月dd日 HH:mm")}
        </time>
        <textarea
          className="w-full flex-grow resize-none bg-inherit p-6 outline-none"
          value={content}
          {...{ onChange }}
        />
      </div>
    </>
  );
};

export default Page;
