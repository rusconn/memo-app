import { ComponentProps, memo, useCallback } from "react";
import { TfiPlus } from "react-icons/tfi";

type Props = {
  label: string;
} & Pick<ComponentProps<"button">, "onClick">;

const StyledComponent = ({ label, onClick }: Props) => (
  <button
    className="flex items-center space-x-2 opacity-60 hover:opacity-100"
    type="button"
    {...{ onClick }}
  >
    <TfiPlus className="h-6" />
    <span>{label}</span>
  </button>
);

export const Component = memo(StyledComponent);

const Container = () => {
  const label = "新規フォルダ";

  const onClick: NonNullable<Props["onClick"]> = useCallback(() => {
    // eslint-disable-next-line no-alert
    alert("new folder");
  }, []);

  return <Component {...{ label, onClick }} />;
};

export default Container;
