import { memo, MouseEventHandler, useCallback } from "react";
import { TfiPlus } from "react-icons/tfi";

type Props = {
  onClick: MouseEventHandler<HTMLButtonElement>;
};

const StyledComponent = ({ onClick }: Props) => (
  <button
    className="flex items-center space-x-2 opacity-60 hover:opacity-100"
    type="button"
    {...{ onClick }}
  >
    <TfiPlus className="h-6" />
    <span>新規フォルダ</span>
  </button>
);

export const Component = memo(StyledComponent);

const Container = () => {
  const onClick: Props["onClick"] = useCallback(() => {
    // eslint-disable-next-line no-alert
    alert("new folder");
  }, []);

  return <Component {...{ onClick }} />;
};

export default Container;
