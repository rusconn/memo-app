import { nanoid } from "nanoid";
import { useCallback } from "react";
import { useLocalStorage, useReadLocalStorage } from "usehooks-ts";

import { MAX_FOLDERS } from "@/config";
import { Folder, Timestamps } from "./types";

type UpdateFolderParams = Pick<Folder, "id"> & Partial<Omit<Folder, "id" | keyof Timestamps>>;

const FOLDERS_KEY = "folders";

const defaultFolder: Folder = {
  id: "memo",
  name: "メモ",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  editable: false,
};

export const useFolders = () => useReadLocalStorage<Folder[]>(FOLDERS_KEY) ?? [defaultFolder];

export const useFoldersMutation = () => {
  const [folders, setFolders] = useLocalStorage(FOLDERS_KEY, [defaultFolder]);

  const addFolder = useCallback(() => {
    if (folders.length >= MAX_FOLDERS) {
      throw new Error("too many folders.");
    }

    const id = nanoid();
    const now = new Date().toISOString();

    const newFolder: Folder = {
      id,
      name: "新規フォルダ",
      editable: true,
      createdAt: now,
      updatedAt: now,
    };

    setFolders(([defaultMemoFolder, ...rest]) => [defaultMemoFolder, newFolder, ...rest]);

    return id;
  }, [folders.length, setFolders]);

  const updateFolder = useCallback(
    ({ id, ...rest }: UpdateFolderParams) => {
      const now = new Date().toISOString();

      setFolders(prev =>
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
    [setFolders]
  );

  const deleteFolder = useCallback(
    (id: Folder["id"]) => {
      setFolders(prev => prev.filter(folder => folder.id !== id));
    },
    [setFolders]
  );

  return {
    addFolder,
    updateFolder,
    deleteFolder,
  };
};
