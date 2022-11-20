import dynamic from "next/dynamic";
import Router from "next/router";
import { ComponentProps, memo, useCallback } from "react";
import { TfiPlus } from "react-icons/tfi";

import { MAX_FOLDERS } from "@/config";
import { useRenamingFolderIdMutation } from "@/contexts";
import { clsx, pagesPath } from "@/lib";
import { db, useFoldersMutation } from "@/storage";
import { useLiveQuery } from "dexie-react-hooks";

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
  const numFolders = useLiveQuery(() => db.folders.count(), [], 0);
  const { addFolder } = useFoldersMutation();
  const { startRenameFolder } = useRenamingFolderIdMutation();

  const label = "新規フォルダ";
  const disabled = numFolders >= MAX_FOLDERS;

  const onClick: NonNullable<Props["onClick"]> = useCallback(() => {
    (async () => {
      const id = await addFolder();
      void Router.push(pagesPath.$url({ query: { folderId: id } })).then(() =>
        startRenameFolder(id)
      );
    })().catch(console.error);
  }, [addFolder, startRenameFolder]);

  return <Component {...{ label, disabled, onClick }} />;
};

export default dynamic(Promise.resolve(memo(Container)), { ssr: false });
