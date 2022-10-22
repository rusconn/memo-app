import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { Folder } from "./types";

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

export const useFolders = () => useContext(FoldersContext);

export const useSetFolders = () => useContext(SetFoldersContext);

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

  return (
    <FoldersContext.Provider value={folders}>
      <SetFoldersContext.Provider value={setFoldersToUse}>{children}</SetFoldersContext.Provider>
    </FoldersContext.Provider>
  );
};
