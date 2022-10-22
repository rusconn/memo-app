import { useRouter } from "next/router";
import { ComponentProps, memo, useCallback } from "react";
import { TfiTrash } from "react-icons/tfi";

import { useSelectedMemoId } from "@/contexts";
import ToolbarButton from "./ToolbarButton";

type Props = ComponentProps<typeof ToolbarButton>;

const StyledComponent = ToolbarButton;

export const Component = memo(StyledComponent);

const Container = () => {
  const router = useRouter();
  const selectedMemoId = useSelectedMemoId();

  const pathMemoId = router.query.memoId as string | undefined;
  const deleteMemoId = selectedMemoId ?? pathMemoId;

  const Icon = TfiTrash;
  const tooltipText = "削除";
  const ariaLabel = "選択中のメモを削除する";

  const disabled = deleteMemoId == null;

  const onClick: NonNullable<Props["onClick"]> = useCallback(() => {
    // eslint-disable-next-line no-alert
    alert(deleteMemoId);
  }, [deleteMemoId]);

  return <Component {...{ Icon, tooltipText, ariaLabel, disabled, onClick }} />;
};

export default Container;
