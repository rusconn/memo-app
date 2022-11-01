import { nanoid } from "nanoid";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { Folder, Memo } from "./types";

type RenameFolderParams = Pick<Folder, "id" | "name">;

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

const SetFoldersContext = createContext<(f: (prev: Folder[]) => Folder[]) => void>(() => {});

const AddFolderContext = createContext<() => Folder["id"]>(() => "all");

const RenameFolderContext = createContext<(params: RenameFolderParams) => void>(() => {});

const DeleteFolderContext = createContext<(id: Folder["id"]) => void>(() => {});

const AddMemoContext = createContext<(id: Folder["id"]) => Memo["id"]>(() => "");

export const useFolders = () => useContext(FoldersContext);

export const useSetFolders = () => useContext(SetFoldersContext);

export const useAddFolder = () => useContext(AddFolderContext);

export const useRenameFolder = () => useContext(RenameFolderContext);

export const useDeleteFolder = () => useContext(DeleteFolderContext);

export const useAddMemo = () => useContext(AddMemoContext);

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

  return (
    <FoldersContext.Provider value={folders}>
      <SetFoldersContext.Provider value={setFoldersToUse}>
        <AddFolderContext.Provider value={addFolder}>
          <RenameFolderContext.Provider value={renameFolder}>
            <DeleteFolderContext.Provider value={deleteFolder}>
              <AddMemoContext.Provider value={addMemo}>{children}</AddMemoContext.Provider>
            </DeleteFolderContext.Provider>
          </RenameFolderContext.Provider>
        </AddFolderContext.Provider>
      </SetFoldersContext.Provider>
    </FoldersContext.Provider>
  );
};
