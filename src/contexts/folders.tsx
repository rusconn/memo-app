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

import { Folder, Timestamps } from "./types";

type UpdateFolderParams = Pick<Folder, "id"> & Partial<Omit<Folder, "id" | keyof Timestamps>>;

const defaultFolder: Folder = {
  id: "memo",
  name: "メモ",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  editable: false,
};

const FoldersContext = createContext([defaultFolder]);

const FoldersMutationContext = createContext<{
  addFolder: () => Folder["id"];
  updateFolder: (params: UpdateFolderParams) => void;
  deleteFolder: (id: Folder["id"]) => void;
}>({
  addFolder: () => "",
  updateFolder: () => {},
  deleteFolder: () => {},
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

    const newFolder: Folder = {
      id,
      name: "新規フォルダ",
      editable: true,
      createdAt: now,
      updatedAt: now,
    };

    setFoldersToUse(([defaultMemoFolder, ...rest]) => [defaultMemoFolder, newFolder, ...rest]);

    return id;
  }, [setFoldersToUse]);

  const updateFolder = useCallback(
    ({ id, ...rest }: UpdateFolderParams) => {
      const now = new Date().toISOString();

      setFoldersToUse(prev =>
        prev.map(folder =>
          folder.id === id
            ? {
                ...folder,
                ...rest,
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

  const foldersMutation = useMemo(
    () => ({
      addFolder,
      updateFolder,
      deleteFolder,
    }),
    [addFolder, deleteFolder, updateFolder]
  );

  return (
    <FoldersContext.Provider value={folders}>
      <FoldersMutationContext.Provider value={foldersMutation}>
        {children}
      </FoldersMutationContext.Provider>
    </FoldersContext.Provider>
  );
};
