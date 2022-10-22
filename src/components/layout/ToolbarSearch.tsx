import { ComponentProps, memo, useCallback, useState } from "react";
import { TfiSearch } from "react-icons/tfi";

type Props = Pick<ComponentProps<"input">, "value" | "placeholder" | "onChange">;

const StyledComponent = ({ value, placeholder, onChange }: Props) => (
  <label
    className="flex h-full w-full items-center border-b border-gray-700 dark:border-stone-200"
    htmlFor="search-memo"
  >
    <TfiSearch className="h-fit w-fit p-1" />
    <input
      id="search-memo"
      className="flex-grow bg-inherit focus:outline-none dark:placeholder-stone-500"
      {...{ value, placeholder, onChange }}
    />
  </label>
);

export const Component = memo(StyledComponent);

const Container = () => {
  const [value, setValue] = useState("");

  const placeholder = "メモを検索する";

  const onChange: NonNullable<Props["onChange"]> = useCallback(({ currentTarget }) => {
    setValue(currentTarget.value);
  }, []);

  return <Component {...{ value, placeholder, onChange }} />;
};

export default Container;
