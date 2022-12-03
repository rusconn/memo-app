import { nanoid } from "nanoid";
import { useCallback } from "react";
import { useLocalStorage, useReadLocalStorage } from "usehooks-ts";

import { MAX_MEMOS_PER_FOLDER, MAX_MEMO_CONTENT_LENGTH } from "@/config";
import { Folder, Memo, Timestamps } from "./types";

type UpdateMemoParams = Pick<Memo, "id"> & Partial<Omit<Memo, "id" | keyof Timestamps>>;

const MEMOS_KEY = "memos";

export const useMemos = () => useReadLocalStorage<Memo[]>(MEMOS_KEY) ?? [];

export const useMemosMutation = () => {
  const [memos, setMemos] = useLocalStorage<Memo[]>(MEMOS_KEY, []);

  const addMemo = useCallback(
    (id: Folder["id"]) => {
      const folderMemos = memos.filter(x => x.folderId === id);

      if (folderMemos.length >= MAX_MEMOS_PER_FOLDER) {
        throw new Error("too many memos in the folder");
      }

      const memoId = nanoid();
      const now = new Date().toISOString();

      setMemos(prev => [
        {
          id: memoId,
          content: "",
          folderId: id,
          createdAt: now,
          updatedAt: now,
        },
        ...prev,
      ]);

      return memoId;
    },
    [memos, setMemos]
  );

  const updateMemo = useCallback(
    ({ id, ...rest }: UpdateMemoParams) => {
      if (rest.content && rest.content.length > MAX_MEMO_CONTENT_LENGTH) {
        throw new Error("content too long.");
      }

      const now = new Date().toISOString();

      setMemos(prev =>
        prev.map(memo =>
          memo.id === id
            ? {
                ...memo,
                ...rest,
                updatedAt: now,
              }
            : memo
        )
      );
    },
    [setMemos]
  );

  const deleteMemo = useCallback(
    (id: Memo["id"]) => {
      setMemos(prev => prev.filter(memo => memo.id !== id));
    },
    [setMemos]
  );

  const deleteMemosWhere = useCallback(
    (f: (_: Memo) => boolean) => {
      setMemos(prev => prev.filter(memo => !f(memo)));
    },
    [setMemos]
  );

  return {
    addMemo,
    updateMemo,
    deleteMemo,
    deleteMemosWhere,
  };
};
