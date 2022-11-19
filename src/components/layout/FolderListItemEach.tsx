import equal from "fast-deep-equal";
import { ComponentProps, memo, useMemo } from "react";

import { useRenamingFolderId } from "@/contexts";
import { pagesPath } from "@/lib";
import FolderListItem from "./FolderListItem";
import FolderListItemMenu from "./FolderListItemMenu";
import FolderListItemRenameInput from "./FolderListItemRenameInput";

type ContainerProps = Pick<Props, "name" | "count" | "current"> &
  Pick<ComponentProps<typeof FolderListItemMenu>, "id" | "editable">;

type Props = ComponentProps<typeof FolderListItem>;

const StyledComponent = FolderListItem;

export const Component = memo(StyledComponent, equal);

const Container = ({ id, name, count, current, editable }: ContainerProps) => {
  const renamingFolderId = useRenamingFolderId();

  const renaming = renamingFolderId === id;
  const href = pagesPath.$url({ query: { folderId: id } });

  const renameInput = useMemo(() => <FolderListItemRenameInput {...{ id, name }} />, [id, name]);

  const menu = useMemo(
    () => <FolderListItemMenu {...{ id, editable, current }} />,
    [id, editable, current]
  );

  return renaming ? (
    <Component {...{ name, count, current, href, renameInput, menu }} />
  ) : (
    <Component {...{ name, count, current, href, menu }} />
  );
};

export default memo(Container);
