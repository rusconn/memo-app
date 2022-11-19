import { nanoid } from "nanoid";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { MAX_MEMOS_PER_FOLDER, MAX_MEMO_CONTENT_LENGTH } from "@/config";
import { Folder, Memo, Timestamps } from "./types";

type UpdateMemoParams = Pick<Memo, "id"> & Partial<Omit<Memo, "id" | keyof Timestamps>>;

const MemosContext = createContext<Memo[]>([]);

const MemosMutationContext = createContext<{
  addMemo: (id: Folder["id"]) => Memo["id"];
  updateMemo: (params: UpdateMemoParams) => void;
  deleteMemo: (id: Memo["id"]) => void;
  deleteMemosWhere: (f: (memo: Memo) => boolean) => void;
}>({
  addMemo: () => "",
  updateMemo: () => {},
  deleteMemo: () => {},
  deleteMemosWhere: () => {},
});

export const useMemos = () => useContext(MemosContext);

export const useMemosMutation = () => useContext(MemosMutationContext);

export const MemosProvider = ({ children }: PropsWithChildren) => {
  const MEMOS_KEY = "memos";

  const [memos, setMemos] = useState<Memo[]>([]);

  // ストレージはクライアントサイドにしかない
  useEffect(() => {
    const existingMemos = localStorage.getItem(MEMOS_KEY);

    if (existingMemos) {
      setMemos(JSON.parse(existingMemos) as Memo[]);
    }
  }, []);

  // state とストレージを同期するラッパー
  const setMemosToUse = useCallback((f: (prev: Memo[]) => Memo[]) => {
    setMemos(prev => {
      const next = f(prev);
      localStorage.setItem(MEMOS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const addMemo = useCallback(
    (id: Folder["id"]) => {
      const folderMemos = memos.filter(x => x.folderId === id);

      if (folderMemos.length >= MAX_MEMOS_PER_FOLDER) {
        throw new Error("too many memos in the folder");
      }

      const memoId = nanoid();
      const now = new Date().toISOString();

      setMemosToUse(prev => [
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
    [memos, setMemosToUse]
  );

  const updateMemo = useCallback(
    ({ id, ...rest }: UpdateMemoParams) => {
      if (rest.content && rest.content.length > MAX_MEMO_CONTENT_LENGTH) {
        throw new Error("content too long.");
      }

      const now = new Date().toISOString();

      setMemosToUse(prev =>
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
    [setMemosToUse]
  );

  const deleteMemo = useCallback(
    (id: Memo["id"]) => {
      setMemosToUse(prev => prev.filter(memo => memo.id !== id));
    },
    [setMemosToUse]
  );

  const deleteMemosWhere = useCallback(
    (f: (_: Memo) => boolean) => {
      setMemosToUse(prev => prev.filter(memo => !f(memo)));
    },
    [setMemosToUse]
  );

  const memosMutation = useMemo(
    () => ({
      addMemo,
      updateMemo,
      deleteMemo,
      deleteMemosWhere,
    }),
    [addMemo, deleteMemosWhere, deleteMemo, updateMemo]
  );

  return (
    <MemosContext.Provider value={memos}>
      <MemosMutationContext.Provider value={memosMutation}>
        {children}
      </MemosMutationContext.Provider>
    </MemosContext.Provider>
  );
};
