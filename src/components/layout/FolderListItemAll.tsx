import equal from "fast-deep-equal";
import { useRouter } from "next/router";
import { memo } from "react";

import { pagesPath } from "@/$path";
import { useFolders } from "@/contexts";
import FolderListItem from "./FolderListItem";

const StyledComponent = FolderListItem;

export const Component = memo(StyledComponent, equal);

const Container = () => {
  const router = useRouter();
  const folders = useFolders();

  const name = "すべてのメモ";
  const count = folders.flatMap(({ memos }) => memos).length;
  const current = router.pathname === pagesPath.$url().pathname;
  const href = pagesPath.$url();

  return <Component {...{ name, count, current, href }} />;
};

export default Container;
