import equal from "fast-deep-equal";
import { useRouter } from "next/router";
import { memo } from "react";

import { useMemos } from "@/contexts";
import { pagesPath } from "@/lib";
import FolderListItem from "./FolderListItem";

const StyledComponent = FolderListItem;

export const Component = memo(StyledComponent, equal);

const Container = () => {
  const router = useRouter();
  const memos = useMemos();

  const name = "すべてのメモ";
  const count = memos.length;
  const current = router.pathname === pagesPath.$url().pathname;
  const href = pagesPath.$url();

  return <Component {...{ name, count, current, href }} />;
};

export default Container;
