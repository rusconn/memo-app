export type Folder = Timestamps & {
  id: string;
  name: string;
  count: number;
  memos: Memo[];
  editable: boolean;
};

export type Memo = Timestamps & {
  id: string;
  headline: string;
  content: string;
  folderName: string;
  folderId: string;
};

type Timestamps = {
  createdAt: string;
  updatedAt: string;
};
