import { nanoid } from "nanoid";
import { useCallback } from "react";

import { MAX_MEMOS_PER_FOLDER, MAX_MEMO_CONTENT_LENGTH } from "@/config";
import { db } from "./db";
import { Folder, Memo, Timestamps } from "./types";

type UpdateMemoParams = Pick<Memo, "id"> & Partial<Omit<Memo, "id" | keyof Timestamps>>;

export const useMemosMutation = () => {
  const addMemo = useCallback(async (id: Folder["id"]) => {
    const numFolderMemos = await db.memos.where("folderId").equals(id).count();

    if (numFolderMemos >= MAX_MEMOS_PER_FOLDER) {
      throw new Error("too many memos in the folder");
    }

    const now = new Date().toISOString();

    return db.memos.add({
      id: nanoid(),
      content: "",
      folderId: id,
      createdAt: now,
      updatedAt: now,
    });
  }, []);

  const updateMemo = useCallback(async ({ id, ...rest }: UpdateMemoParams) => {
    if (rest.content && rest.content.length > MAX_MEMO_CONTENT_LENGTH) {
      throw new Error("content too long.");
    }

    const now = new Date().toISOString();

    return db.memos.update(id, { ...rest, updatedAt: now });
  }, []);

  const deleteMemo = useCallback(async (id: Memo["id"]) => {
    return db.memos.delete(id);
  }, []);

  const deleteMemosWhere = useCallback(async (f: (_: Memo) => boolean) => {
    return db.memos.filter(memo => f(memo)).delete();
  }, []);

  return {
    addMemo,
    updateMemo,
    deleteMemo,
    deleteMemosWhere,
  };
};
