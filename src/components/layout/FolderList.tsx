import equal from "fast-deep-equal";
import { ComponentProps, memo } from "react";

import { useFolders, useMemos } from "@/contexts";
import FolderListItemAll from "./FolderListItemAll";
import FolderListItemEach from "./FolderListItemEach";

type Props = {
  folders: ComponentProps<typeof FolderListItemEach>[];
};

const StyledComponent = ({ folders }: Props) => (
  <ol>
    <FolderListItemAll key="all" />
    {folders.map(({ id, name, count, editable }) => (
      <FolderListItemEach key={id} {...{ id, name, count, editable }} />
    ))}
  </ol>
);

export const Component = memo(StyledComponent, equal);

const Container = () => {
  const folders = useFolders();
  const memos = useMemos();

  const foldersToUse = folders.map(({ id, name, editable }) => ({
    id,
    name,
    count: memos.filter(({ folderId }) => folderId === id).length,
    editable,
  }));

  return <Component folders={foldersToUse} />;
};

export default Container;
