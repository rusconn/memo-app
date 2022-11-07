export type Folder = Timestamps & {
  id: string;
  name: string;
  editable: boolean;
};

export type Memo = Timestamps & {
  id: string;
  content: string;
  folderId: string;
};

export type Timestamps = {
  createdAt: string;
  updatedAt: string;
};
