import { nanoid } from "nanoid";
import { useCallback } from "react";

import { MAX_FOLDERS } from "@/config";
import { db } from "./db";
import { Folder, Timestamps } from "./types";

type UpdateFolderParams = Pick<Folder, "id"> & Partial<Omit<Folder, "id" | keyof Timestamps>>;

export const useFoldersMutation = () => {
  const addFolder = useCallback(async () => {
    const numFolders = await db.folders.count();

    if (numFolders >= MAX_FOLDERS) {
      throw new Error("too many folders.");
    }

    const now = new Date().toISOString();

    return db.folders.add({
      id: nanoid(),
      name: "新規フォルダ",
      editable: true,
      createdAt: now,
      updatedAt: now,
    });
  }, []);

  const updateFolder = useCallback(async ({ id, ...rest }: UpdateFolderParams) => {
    const now = new Date().toISOString();

    return db.folders.update(id, { ...rest, updatedAt: now });
  }, []);

  const deleteFolder = useCallback(async (id: Folder["id"]) => {
    return db.folders.delete(id);
  }, []);

  return {
    addFolder,
    updateFolder,
    deleteFolder,
  };
};
