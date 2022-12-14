import { useRouter } from "next/router";
import { ComponentProps, memo } from "react";
import { TfiAngleLeft } from "react-icons/tfi";

import { pagesPath } from "@/lib";
import ToolbarButton from "./ToolbarButton";

type Props = ComponentProps<typeof ToolbarButton>;

const StyledComponent = ToolbarButton;

export const Component = memo(StyledComponent);

const Container = () => {
  const router = useRouter();

  const Icon = TfiAngleLeft;
  const tooltipText = "戻る";
  const ariaLabel = "前のページへ戻る";

  const disabled = router.pathname !== pagesPath._memoId("").$url({ query: {} }).pathname;

  const onClick: NonNullable<Props["onClick"]> = router.back;

  return <Component {...{ Icon, tooltipText, ariaLabel, disabled, onClick }} />;
};

export default memo(Container);
