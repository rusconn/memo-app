import { useLiveQuery } from "dexie-react-hooks";
import equal from "fast-deep-equal";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { ComponentProps, memo } from "react";

import { pagesPath } from "@/lib";
import { db } from "@/storage";
import FolderListItemAll from "./FolderListItemAll";
import FolderListItemEach from "./FolderListItemEach";

type Props = {
  allCurrent: boolean;
  folders: ComponentProps<typeof FolderListItemEach>[];
};

const StyledComponent = ({ allCurrent, folders }: Props) => (
  <ol>
    <FolderListItemAll key="all" current={allCurrent} />
    {folders.map(({ id, name, count, current, editable }) => (
      <FolderListItemEach key={id} {...{ id, name, count, current, editable }} />
    ))}
  </ol>
);

export const Component = memo(StyledComponent, equal);

const Container = () => {
  const router = useRouter();

  const allCurrent = router.pathname === pagesPath.$url().pathname && router.query.folderId == null;

  const folders = useLiveQuery(
    async () => {
      const fs = await db.folders.toCollection().reverse().sortBy("createdAt");

      const counts = await Promise.all(
        fs.map(f => db.memos.where("folderId").equals(f.id).count())
      );

      return fs.map((f, i) => ({ ...f, count: counts[i] }));
    },
    [],
    []
  );

  const foldersToUse = folders
    .sort((x, y) => Number(x.editable) - Number(y.editable))
    .map(({ id, name, count, editable }) => ({
      id,
      name,
      count,
      current: id === router.query.folderId,
      editable,
    }));

  return <Component {...{ allCurrent }} folders={foldersToUse} />;
};

export default dynamic(Promise.resolve(memo(Container)), { ssr: false });
