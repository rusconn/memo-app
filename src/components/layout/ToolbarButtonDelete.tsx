import { useRouter } from "next/router";
import { ComponentProps, memo, useCallback } from "react";
import { TfiTrash } from "react-icons/tfi";

import { useSelectedMemoId } from "@/contexts";
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
  const selectedMemoId = useSelectedMemoId();

  const pathMemoId = router.query.memoId as string | undefined;
  const deleteMemoId = selectedMemoId ?? pathMemoId;
  const disabled = deleteMemoId == null;

  const onClick: Props["onClick"] = useCallback(() => {
    // eslint-disable-next-line no-alert
    alert(deleteMemoId);
  }, [deleteMemoId]);

  return <Component {...{ disabled, onClick }} />;
};

export default Container;
