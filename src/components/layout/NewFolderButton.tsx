import Router from "next/router";
import { memo, MouseEventHandler, useCallback } from "react";
import { TfiPlus } from "react-icons/tfi";

import { pagesPath } from "@/$path";
import { useAddFolder, useStartRenameFolder } from "@/contexts";

type Props = {
  onClick: MouseEventHandler<HTMLButtonElement>;
};

const StyledComponent = ({ onClick }: Props) => (
  <button
    className="flex items-center space-x-2 opacity-60 hover:opacity-100"
    type="button"
    {...{ onClick }}
  >
    <TfiPlus className="h-6" />
    <span>新規フォルダ</span>
  </button>
);

export const Component = memo(StyledComponent);

const Container = () => {
  const addFoler = useAddFolder();
  const startRenameFolder = useStartRenameFolder();

  const onClick: Props["onClick"] = useCallback(() => {
    const id = addFoler();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    Router.push(pagesPath.folders._folderId(id).$url());
    startRenameFolder(id);
  }, [addFoler, startRenameFolder]);

  return <Component {...{ onClick }} />;
};

export default Container;
