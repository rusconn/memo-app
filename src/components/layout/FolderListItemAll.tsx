import equal from "fast-deep-equal";
import dynamic from "next/dynamic";
import { ComponentProps, memo } from "react";

import { pagesPath } from "@/lib";
import { useMemos } from "@/storage";
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

export default dynamic(Promise.resolve(memo(Container)), { ssr: false });
