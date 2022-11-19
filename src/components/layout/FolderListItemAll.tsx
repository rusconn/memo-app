import equal from "fast-deep-equal";
import { ComponentProps, memo } from "react";

import { useMemos } from "@/contexts";
import { pagesPath } from "@/lib";
import FolderListItem from "./FolderListItem";

type ContainerProps = Pick<Props, "current">;

type Props = ComponentProps<typeof FolderListItem>;

const StyledComponent = FolderListItem;

export const Component = memo(StyledComponent, equal);

const Container = ({ current }: ContainerProps) => {
  const memos = useMemos();

  const name = "すべてのメモ";
  const count = memos.length;
  const href = pagesPath.$url();

  return <Component {...{ name, count, current, href }} />;
};

export default memo(Container);
