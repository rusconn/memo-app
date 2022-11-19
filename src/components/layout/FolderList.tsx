import equal from "fast-deep-equal";
import { useRouter } from "next/router";
import { ComponentProps, memo } from "react";

import { useFolders, useMemos } from "@/contexts";
import { pagesPath } from "@/lib";
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
  const folders = useFolders();
  const memos = useMemos();

  const allCurrent = router.pathname === pagesPath.$url().pathname && router.query.folderId == null;

  const foldersToUse = folders.map(({ id, name, editable }) => ({
    id,
    name,
    count: memos.filter(({ folderId }) => folderId === id).length,
    current: id === router.query.folderId,
    editable,
  }));

  return <Component {...{ allCurrent }} folders={foldersToUse} />;
};

export default memo(Container);
