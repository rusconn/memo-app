import { nanoid } from "nanoid";
import { createContext, PropsWithChildren, useCallback, useContext, useMemo } from "react";

import { Folder, Memo } from "./types";
import { useFolders, useFoldersMutation } from "./folders";

type UpdateMemoParams = {
  folderId: Folder["id"];
  memoId: Memo["id"];
  content: Memo["content"];
};

const MemosContext = createContext<Memo[]>([]);

const MemosMutationContext = createContext<{
  addMemo: (id: Folder["id"]) => Memo["id"];
  updateMemo: (params: UpdateMemoParams) => void;
  deleteMemo: (id: Memo["id"]) => void;
}>({
  addMemo: () => "",
  updateMemo: () => {},
  deleteMemo: () => {},
});

export const useMemos = () => useContext(MemosContext);

export const useMemosMutation = () => useContext(MemosMutationContext);

/** FoldersProvider に依存する */
export const MemosProvider = ({ children }: PropsWithChildren) => {
  const folders = useFolders();
  const { setFolders } = useFoldersMutation();

  const memos = folders.flatMap(folder => folder.memos);

  const addMemo = useCallback(
    (id: Folder["id"]) => {
      const memoId = nanoid();
      const now = new Date().toISOString();

      setFolders(prev =>
        prev.map(folder =>
          folder.id === id
            ? {
                ...folder,
                count: folder.count + 1,
                memos: [
                  {
                    id: memoId,
                    headline: "",
                    content: "",
                    folderName: folder.name,
                    folderId: folder.id,
                    createdAt: now,
                    updatedAt: now,
                  },
                  ...folder.memos,
                ],
                updatedAt: now,
              }
            : folder
        )
      );

      return memoId;
    },
    [setFolders]
  );

  const updateMemo = useCallback(
    ({ folderId, memoId, content }: UpdateMemoParams) => {
      const now = new Date().toISOString();

      setFolders(prev =>
        prev.map(folder =>
          folder.id === folderId
            ? {
                ...folder,
                memos: folder.memos.map(memo =>
                  memo.id === memoId
                    ? {
                        ...memo,
                        headline: content.split("\n")[0],
                        content,
                        updatedAt: now,
                      }
                    : memo
                ),
                updatedAt: now,
              }
            : folder
        )
      );
    },
    [setFolders]
  );

  const deleteMemo = useCallback(
    (id: Memo["id"]) => {
      const now = new Date().toISOString();

      setFolders(prev =>
        prev.map(folder =>
          folder.memos.some(memo => memo.id === id)
            ? {
                ...folder,
                count: folder.count - 1,
                memos: folder.memos.filter(memo => memo.id !== id),
                updatedAt: now,
              }
            : folder
        )
      );
    },
    [setFolders]
  );

  const memosMutation = useMemo(
    () => ({
      addMemo,
      updateMemo,
      deleteMemo,
    }),
    [addMemo, deleteMemo, updateMemo]
  );

  return (
    <MemosContext.Provider value={memos}>
      <MemosMutationContext.Provider value={memosMutation}>
        {children}
      </MemosMutationContext.Provider>
    </MemosContext.Provider>
  );
};
