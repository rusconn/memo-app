import Fuse from "fuse.js";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { MemoCards } from "@/components/common";
import { useFolders, useMemos } from "@/storage";

export type OptionalQuery = {
  folderId?: string;
  q?: string;
};

const Page: NextPage = () => {
  const router = useRouter();
  const folders = useFolders();
  const allMemos = useMemos();

  const { folderId, q }: OptionalQuery = router.query;

  const allMemosToUse = allMemos
    .filter(memo => !folderId || memo.folderId === folderId)
    .sort((x, y) => Date.parse(y.updatedAt) - Date.parse(x.updatedAt))
    .map(memo => ({
      ...memo,
      headline: memo.content.split("\n")[0],
      folderName: folders.find(folder => folder.id === memo.folderId)?.name ?? "",
    }));

  const memos =
    !q || q === ""
      ? allMemosToUse
      : new Fuse(allMemosToUse, { keys: ["content", "folderName"], threshold: 0.65 })
          .search({ $or: [{ content: q }, { folderName: q }] })
          .map(({ item }) => item);

  const hideFolderLine = folderId != null;

  return (
    <div className="p-6">
      <MemoCards {...{ memos, hideFolderLine }} />
    </div>
  );
};

export default dynamic(Promise.resolve(Page), { ssr: false });
