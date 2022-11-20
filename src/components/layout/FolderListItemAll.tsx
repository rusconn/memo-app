import { useLiveQuery } from "dexie-react-hooks";
import equal from "fast-deep-equal";
import dynamic from "next/dynamic";
import { ComponentProps, memo } from "react";

import { pagesPath } from "@/lib";
import { db } from "@/storage";
import FolderListItem from "./FolderListItem";

type ContainerProps = Pick<Props, "current">;

type Props = ComponentProps<typeof FolderListItem>;

const StyledComponent = FolderListItem;

export const Component = memo(StyledComponent, equal);

const Container = ({ current }: ContainerProps) => {
  const count = useLiveQuery(() => db.memos.count(), [], 0);

  const name = "すべてのメモ";
  const href = pagesPath.$url();

  return <Component {...{ name, count, current, href }} />;
};

export default dynamic(Promise.resolve(memo(Container)), { ssr: false });
