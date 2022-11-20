import { useLiveQuery } from "dexie-react-hooks";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { ComponentProps, memo, useCallback } from "react";
import { TfiPencil } from "react-icons/tfi";

import { MAX_MEMOS_PER_FOLDER } from "@/config";
import { useSelectedMemoIdMutation } from "@/contexts";
import { pagesPath } from "@/lib";
import { db, useMemosMutation } from "@/storage";
import ToolbarButton from "./ToolbarButton";

type Props = ComponentProps<typeof ToolbarButton>;

const StyledComponent = ToolbarButton;

export const Component = memo(StyledComponent);

const Container = () => {
  const router = useRouter();
  const { addMemo } = useMemosMutation();
  const { setSelectedMemoId } = useSelectedMemoIdMutation();

  const folderId = (router.query.folderId ?? "memo") as string;

  const numFolderMemos = useLiveQuery(
    () => db.memos.where("folderId").equals(folderId).count(),
    [],
    0
  );

  const Icon = TfiPencil;
  const tooltipText = "作成";
  const ariaLabel = "選択中のフォルダにメモを作成する";

  const disabled =
    router.pathname !== pagesPath.$url().pathname || numFolderMemos >= MAX_MEMOS_PER_FOLDER;

  const onClick: NonNullable<Props["onClick"]> = useCallback(() => {
    (async () => {
      const memoId = await addMemo(folderId);
      setSelectedMemoId(memoId);
    })().catch(console.error);
  }, [addMemo, folderId, setSelectedMemoId]);

  return <Component {...{ Icon, tooltipText, ariaLabel, disabled, onClick }} />;
};

export default dynamic(Promise.resolve(memo(Container)), { ssr: false });
