import { useRouter } from "next/router";
import { ComponentProps, memo, useCallback } from "react";
import { TfiPencil } from "react-icons/tfi";

import { pagesPath } from "@/$path";
import ToolbarButton from "./ToolbarButton";

type Props = Pick<ComponentProps<typeof ToolbarButton>, "disabled" | "onClick">;

const StyledComponent = ({ disabled, onClick }: Props) => (
  <ToolbarButton
    Icon={TfiPencil}
    tooltipText="作成"
    ariaLabel="選択中のフォルダにメモを作成する"
    {...{ disabled, onClick }}
  />
);

export const Component = memo(StyledComponent);

const Container = () => {
  const router = useRouter();

  const folderId = (router.query.folderId ?? "memo") as string;

  const disabled =
    router.pathname !== pagesPath.folders._folderId("").$url().pathname &&
    router.pathname !== pagesPath.$url().pathname;

  const onClick: Props["onClick"] = useCallback(() => {
    // eslint-disable-next-line no-alert
    alert(folderId);
  }, [folderId]);

  return <Component {...{ disabled, onClick }} />;
};

export default Container;