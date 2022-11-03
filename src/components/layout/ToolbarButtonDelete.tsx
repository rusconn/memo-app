import { useRouter } from "next/router";
import { ComponentProps, memo, useCallback } from "react";
import { TfiTrash } from "react-icons/tfi";

import { pagesPath } from "@/$path";
import { useClearSelectedMemoId, useDeleteMemo, useSelectedMemoId } from "@/contexts";
import ToolbarButton from "./ToolbarButton";

type Props = ComponentProps<typeof ToolbarButton>;

const StyledComponent = ToolbarButton;

export const Component = memo(StyledComponent);

const Container = () => {
  const router = useRouter();
  const clearSelectedMemoId = useClearSelectedMemoId();
  const selectedMemoId = useSelectedMemoId();
  const deleteMemo = useDeleteMemo();

  const pathFolderId = router.query.folderId as string | undefined;
  const pathMemoId = router.query.memoId as string | undefined;
  const deleteMemoId = selectedMemoId ?? pathMemoId;

  const Icon = TfiTrash;
  const tooltipText = "削除";
  const ariaLabel = "選択中のメモを削除する";

  const disabled = deleteMemoId == null;

  const onClick: NonNullable<Props["onClick"]> = useCallback(() => {
    if (deleteMemoId) {
      const isMemoPage =
        router.pathname === pagesPath.folders._folderId("").memos._memoId("").$url().pathname;

      // 表示中のベージがなくなる場合はフォルダへ移動する
      if (isMemoPage && pathFolderId) {
        void router
          .push(pagesPath.folders._folderId(pathFolderId).$url())
          .then(() => deleteMemo(deleteMemoId));
      } else {
        deleteMemo(deleteMemoId);
      }

      clearSelectedMemoId();
    }
  }, [clearSelectedMemoId, deleteMemoId, deleteMemo, router, pathFolderId]);

  return <Component {...{ Icon, tooltipText, ariaLabel, disabled, onClick }} />;
};

export default Container;
