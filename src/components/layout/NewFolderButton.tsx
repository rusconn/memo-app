import Router from "next/router";
import { ComponentProps, memo, useCallback } from "react";
import { TfiPlus } from "react-icons/tfi";

import { MAX_FOLDERS } from "@/config";
import { useFolders, useFoldersMutation, useRenamingFolderIdMutation } from "@/contexts";
import { clsx, pagesPath } from "@/lib";

type Props = {
  label: string;
} & Pick<ComponentProps<"button">, "disabled" | "onClick">;

const StyledComponent = ({ label, disabled, onClick }: Props) => (
  <button
    className={clsx("flex items-center space-x-2 opacity-60", !disabled && "hover:opacity-100")}
    type="button"
    {...{ disabled, onClick }}
  >
    <TfiPlus className="h-6" />
    <span>{label}</span>
  </button>
);

export const Component = memo(StyledComponent);

const Container = () => {
  const folders = useFolders();
  const { addFolder } = useFoldersMutation();
  const { startRenameFolder } = useRenamingFolderIdMutation();

  const label = "新規フォルダ";
  const disabled = folders.length >= MAX_FOLDERS;

  const onClick: NonNullable<Props["onClick"]> = useCallback(() => {
    const id = addFolder();
    void Router.push(pagesPath.$url({ query: { folderId: id } })).then(() => startRenameFolder(id));
  }, [addFolder, startRenameFolder]);

  return <Component {...{ label, disabled, onClick }} />;
};

export default memo(Container);
