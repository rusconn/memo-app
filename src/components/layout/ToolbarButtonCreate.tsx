import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { ComponentProps, memo, useCallback } from "react";
import { TfiPencil } from "react-icons/tfi";

import { MAX_MEMOS_PER_FOLDER } from "@/config";
import { useSelectedMemoIdMutation } from "@/contexts";
import { pagesPath } from "@/lib";
import { useMemos, useMemosMutation } from "@/storage";
import ToolbarButton from "./ToolbarButton";

type Props = ComponentProps<typeof ToolbarButton>;

const StyledComponent = ToolbarButton;

export const Component = memo(StyledComponent);

const Container = () => {
  const router = useRouter();
  const memos = useMemos();
  const { addMemo } = useMemosMutation();
  const { setSelectedMemoId } = useSelectedMemoIdMutation();

  const folderId = (router.query.folderId ?? "memo") as string;
  const folderMemos = memos.filter(x => x.folderId === folderId);

  const Icon = TfiPencil;
  const tooltipText = "作成";
  const ariaLabel = "選択中のフォルダにメモを作成する";

  const disabled =
    router.pathname !== pagesPath.$url().pathname || folderMemos.length >= MAX_MEMOS_PER_FOLDER;

  const onClick: NonNullable<Props["onClick"]> = useCallback(() => {
    const memoId = addMemo(folderId);
    setSelectedMemoId(memoId);
  }, [addMemo, folderId, setSelectedMemoId]);

  return <Component {...{ Icon, tooltipText, ariaLabel, disabled, onClick }} />;
};

export default dynamic(Promise.resolve(memo(Container)), { ssr: false });
