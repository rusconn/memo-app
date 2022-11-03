import { useRouter } from "next/router";
import { ComponentProps, memo, useCallback } from "react";
import { TfiTrash } from "react-icons/tfi";

import { pagesPath } from "@/$path";
import { useClearSelectedMemoId, useDeleteMemo, useSelectedMemoId } from "@/contexts";
import ToolbarButton from "./ToolbarButton";

type Props = Pick<ComponentProps<typeof ToolbarButton>, "disabled" | "onClick">;

const StyledComponent = ({ disabled, onClick }: Props) => (
  <ToolbarButton
    Icon={TfiTrash}
    tooltipText="削除"
    ariaLabel="選択中のメモを削除する"
    {...{ disabled, onClick }}
  />
);

export const Component = memo(StyledComponent);

const Container = () => {
  const router = useRouter();
  const clearSelectedMemoId = useClearSelectedMemoId();
  const selectedMemoId = useSelectedMemoId();
  const deleteMemo = useDeleteMemo();

  const pathFolderId = router.query.folderId as string | undefined;
  const pathMemoId = router.query.memoId as string | undefined;
  const deleteMemoId = selectedMemoId ?? pathMemoId;
  const disabled = deleteMemoId == null;

  const onClick: Props["onClick"] = useCallback(() => {
    if (deleteMemoId) {
      const isMemoPage =
        router.pathname === pagesPath.folders._folderId("").memos._memoId("").$url().pathname;

      // 表示中のベージがなくなる場合はフォルダへ移動する
      if (isMemoPage && pathFolderId) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        router
          .push(pagesPath.folders._folderId(pathFolderId).$url())
          .then(() => deleteMemo(deleteMemoId));
      } else {
        deleteMemo(deleteMemoId);
      }

      clearSelectedMemoId();
    }
  }, [clearSelectedMemoId, deleteMemoId, deleteMemo, router, pathFolderId]);

  return <Component {...{ disabled, onClick }} />;
};

export default Container;
