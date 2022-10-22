import { useRouter } from "next/router";
import { ComponentProps, memo, useCallback } from "react";
import { TfiPencil } from "react-icons/tfi";

import { pagesPath } from "@/$path";
import ToolbarButton from "./ToolbarButton";

type Props = ComponentProps<typeof ToolbarButton>;

const StyledComponent = ToolbarButton;

export const Component = memo(StyledComponent);

const Container = () => {
  const router = useRouter();

  const folderId = (router.query.folderId ?? "memo") as string;

  const Icon = TfiPencil;
  const tooltipText = "作成";
  const ariaLabel = "選択中のフォルダにメモを作成する";

  const disabled =
    router.pathname !== pagesPath.folders._folderId("").$url().pathname &&
    router.pathname !== pagesPath.$url().pathname;

  const onClick: NonNullable<Props["onClick"]> = useCallback(() => {
    // eslint-disable-next-line no-alert
    alert(folderId);
  }, [folderId]);

  return <Component {...{ Icon, tooltipText, ariaLabel, disabled, onClick }} />;
};

export default Container;
