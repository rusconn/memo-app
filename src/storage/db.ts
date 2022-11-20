import Dexie, { Table } from "dexie";

import { Folder, Memo } from "./types";

class MemoAppDB extends Dexie {
  folders!: Table<Folder, Folder["id"]>;

  memos!: Table<Memo, Memo["id"]>;

  constructor() {
    super("memoAppDB");

    this.version(1).stores({
      folders: "id, createdAt, updatedAt",
      memos: "id, folderId, [id+folderId], createdAt, updatedAt",
    });

    // initialize
    this.on("populate", () => {
      db.folders
        .add({
          id: "memo",
          name: "メモ",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          editable: false,
        })
        .catch(console.error);
    });
  }
}

export const db = new MemoAppDB();
