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

import { Folder, Memo } from "./types";

type RenameFolderParams = Pick<Folder, "id" | "name">;

type UpdateMemoParams = {
  folderId: Folder["id"];
  memoId: Memo["id"];
  content: Memo["content"];
};

const defaultFolder: Folder = {
  id: "memo",
  name: "メモ",
  count: 0,
  memos: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  editable: false,
};

const FoldersContext = createContext([defaultFolder]);

const FoldersMutationContext = createContext<{
  setFolders: (f: (prev: Folder[]) => Folder[]) => void;
  addFolder: () => Folder["id"];
  renameFolder: (params: RenameFolderParams) => void;
  deleteFolder: (id: Folder["id"]) => void;
  addMemo: (id: Folder["id"]) => Memo["id"];
  updateMemo: (params: UpdateMemoParams) => void;
  deleteMemo: (id: Memo["id"]) => void;
}>({
  setFolders: () => {},
  addFolder: () => "",
  renameFolder: () => {},
  deleteFolder: () => {},
  addMemo: () => "",
  updateMemo: () => {},
  deleteMemo: () => {},
});

export const useFolders = () => useContext(FoldersContext);

export const useFoldersMutation = () => useContext(FoldersMutationContext);

export const FoldersProvider = ({ children }: PropsWithChildren) => {
  const FOLDERS_KEY = "folders";

  const [folders, setFolders] = useState([defaultFolder]);

  // ストレージはクライアントサイドにしかない
  useEffect(() => {
    const existingFolders = localStorage.getItem(FOLDERS_KEY);

    if (existingFolders) {
      setFolders(JSON.parse(existingFolders) as Folder[]);
    }
  }, []);

  // state とストレージを同期するラッパー
  const setFoldersToUse = useCallback((f: (prev: Folder[]) => Folder[]) => {
    setFolders(prev => {
      const next = f(prev);
      localStorage.setItem(FOLDERS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const addFolder = useCallback(() => {
    const id = nanoid();
    const now = new Date().toISOString();

    const newFolder = {
      id,
      name: "新規フォルダ",
      count: 0,
      memos: [],
      editable: true,
      createdAt: now,
      updatedAt: now,
    };

    setFoldersToUse(([defaultMemoFolder, ...rest]) => [defaultMemoFolder, newFolder, ...rest]);

    return id;
  }, [setFoldersToUse]);

  const renameFolder = useCallback(
    ({ id, name }: RenameFolderParams) => {
      const now = new Date().toISOString();

      setFoldersToUse(prev =>
        prev.map(folder =>
          folder.id === id
            ? {
                ...folder,
                name,
                memos: folder.memos.map(memo => ({
                  ...memo,
                  folderName: name,
                })),
                updatedAt: now,
              }
            : folder
        )
      );
    },
    [setFoldersToUse]
  );

  const deleteFolder = useCallback(
    (id: Folder["id"]) => {
      setFoldersToUse(prev => prev.filter(folder => folder.id !== id));
    },
    [setFoldersToUse]
  );

  const addMemo = useCallback(
    (id: Folder["id"]) => {
      const memoId = nanoid();
      const now = new Date().toISOString();

      setFoldersToUse(prev =>
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
    [setFoldersToUse]
  );

  const updateMemo = useCallback(
    ({ folderId, memoId, content }: UpdateMemoParams) => {
      const now = new Date().toISOString();

      setFoldersToUse(prev =>
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
    [setFoldersToUse]
  );

  const deleteMemo = useCallback(
    (id: Memo["id"]) => {
      const now = new Date().toISOString();

      setFoldersToUse(prev =>
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
    [setFoldersToUse]
  );

  const foldersMutation = useMemo(
    () => ({
      setFolders: setFoldersToUse,
      addFolder,
      renameFolder,
      deleteFolder,
      addMemo,
      updateMemo,
      deleteMemo,
    }),
    [addFolder, addMemo, deleteFolder, deleteMemo, renameFolder, setFoldersToUse, updateMemo]
  );

  return (
    <FoldersContext.Provider value={folders}>
      <FoldersMutationContext.Provider value={foldersMutation}>
        {children}
      </FoldersMutationContext.Provider>
    </FoldersContext.Provider>
  );
};
