import { ComponentProps, memo, PropsWithChildren, useCallback } from "react";

import { useSelectedMemoIdMutation } from "@/contexts";
import Sidebar from "./Sidebar";
import Toolbar from "./Toolbar";

type ContainerProps = Pick<Props, "children">;

type Props = PropsWithChildren<{
  onMouseDown?: ComponentProps<"div">["onMouseDown"];
  onToolbarMouseDown?: ComponentProps<"div">["onMouseDown"];
}>;

const StyledComponent = ({ children, onMouseDown, onToolbarMouseDown }: Props) => (
  <div className="flex h-screen" {...{ onMouseDown }}>
    <div className="w-64 bg-gray-100 dark:bg-stone-800">
      <Sidebar />
    </div>
    <main className="flex h-full flex-grow flex-col overflow-x-hidden bg-white dark:bg-stone-900">
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div className="pr-2" onMouseDown={onToolbarMouseDown}>
        <Toolbar />
      </div>
      <section className="flex-grow overflow-x-hidden overflow-y-scroll">{children}</section>
    </main>
  </div>
);

export const Component = memo(StyledComponent);

const Container = ({ children }: ContainerProps) => {
  const { clearSelectedMemoId } = useSelectedMemoIdMutation();

  // メモの選択状態を解除する
  // イベント発生時に選択解除をしたくないコンポーネントには stopPropagation を設定する
  const onMouseDown: NonNullable<Props["onMouseDown"]> = useCallback(() => {
    clearSelectedMemoId();
  }, [clearSelectedMemoId]);

  // 上流コンポーネントによるメモの選択状態解除を避ける
  const onToolbarMouseDown: NonNullable<Props["onToolbarMouseDown"]> = useCallback(e => {
    e.stopPropagation();
  }, []);

  return <Component {...{ onMouseDown, onToolbarMouseDown }}>{children}</Component>;
};

export default Container;
