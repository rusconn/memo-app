import { useRouter } from "next/router";
import { ComponentProps, memo, useCallback } from "react";
import { TfiTrash } from "react-icons/tfi";

import { useSelectedMemoIdMutation, useMemosMutation, useSelectedMemoId } from "@/contexts";
import { pagesPath } from "@/lib";
import ToolbarButton from "./ToolbarButton";

type Props = ComponentProps<typeof ToolbarButton>;

const StyledComponent = ToolbarButton;

export const Component = memo(StyledComponent);

const Container = () => {
  const router = useRouter();
  const { clearSelectedMemoId } = useSelectedMemoIdMutation();
  const selectedMemoId = useSelectedMemoId();
  const { deleteMemo } = useMemosMutation();

  const queryFolderId = router.query.folderId as string | undefined;
  const pathMemoId = router.query.memoId as string | undefined;
  const deleteMemoId = selectedMemoId ?? pathMemoId;

  const Icon = TfiTrash;
  const tooltipText = "削除";
  const ariaLabel = "選択中のメモを削除する";

  const disabled = deleteMemoId == null;

  const onClick: NonNullable<Props["onClick"]> = useCallback(() => {
    if (deleteMemoId) {
      const isMemoPage = router.pathname === pagesPath._memoId("").$url({ query: {} }).pathname;

      // 表示中のベージがなくなる場合はフォルダへ移動する
      if (isMemoPage) {
        const url = queryFolderId
          ? pagesPath.$url({ query: { folderId: queryFolderId } })
          : pagesPath.$url();
        void router.push(url).then(() => deleteMemo(deleteMemoId));
      } else {
        deleteMemo(deleteMemoId);
      }

      clearSelectedMemoId();
    }
  }, [clearSelectedMemoId, deleteMemoId, deleteMemo, router, queryFolderId]);

  return <Component {...{ Icon, tooltipText, ariaLabel, disabled, onClick }} />;
};

export default memo(Container);
