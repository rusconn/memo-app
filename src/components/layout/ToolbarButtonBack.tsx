import { useRouter } from "next/router";
import { ComponentProps, memo } from "react";
import { TfiAngleLeft } from "react-icons/tfi";

import { pagesPath } from "@/$path";
import ToolbarButton from "./ToolbarButton";

type Props = Pick<ComponentProps<typeof ToolbarButton>, "disabled" | "onClick">;

const StyledComponent = ({ disabled, onClick }: Props) => (
  <ToolbarButton
    Icon={TfiAngleLeft}
    tooltipText="戻る"
    ariaLabel="前のページへ戻る"
    {...{ disabled, onClick }}
  />
);

export const Component = memo(StyledComponent);

const Container = () => {
  const router = useRouter();

  const disabled =
    router.pathname !== pagesPath.folders._folderId("").memos._memoId("").$url().pathname;

  const onClick: Props["onClick"] = router.back;

  return <Component {...{ disabled, onClick }} />;
};

export default Container;
