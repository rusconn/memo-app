import Router from "next/router";
import { ComponentProps, memo, useCallback } from "react";
import { TfiPlus } from "react-icons/tfi";

import { useFoldersMutation, useRenamingFolderIdMutation } from "@/contexts";
import { pagesPath } from "@/lib";

type Props = {
  label: string;
} & Pick<ComponentProps<"button">, "onClick">;

const StyledComponent = ({ label, onClick }: Props) => (
  <button
    className="flex items-center space-x-2 opacity-60 hover:opacity-100"
    type="button"
    {...{ onClick }}
  >
    <TfiPlus className="h-6" />
    <span>{label}</span>
  </button>
);

export const Component = memo(StyledComponent);

const Container = () => {
  const { addFolder } = useFoldersMutation();
  const { startRenameFolder } = useRenamingFolderIdMutation();

  const label = "新規フォルダ";

  const onClick: NonNullable<Props["onClick"]> = useCallback(() => {
    const id = addFolder();
    void Router.push(pagesPath.folders._folderId(id).$url()).then(() => startRenameFolder(id));
  }, [addFolder, startRenameFolder]);

  return <Component {...{ label, onClick }} />;
};

export default Container;
