import { ChangeEventHandler, memo, useCallback, useState } from "react";
import { TfiSearch } from "react-icons/tfi";

type Props = {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

const StyledComponent = ({ value, onChange }: Props) => (
  <label
    className="flex h-full w-full items-center border-b border-gray-700 dark:border-stone-200"
    htmlFor="search"
  >
    <TfiSearch className="h-fit w-fit p-1" />
    <input
      id="search"
      className="flex-grow bg-inherit focus:outline-none dark:placeholder-stone-500"
      placeholder="メモを検索する"
      {...{ value, onChange }}
    />
  </label>
);

export const Component = memo(StyledComponent);

const Container = () => {
  const [value, setValue] = useState("");

  const onChange: Props["onChange"] = useCallback(({ currentTarget }) => {
    setValue(currentTarget.value);
  }, []);

  return <Component {...{ value, onChange }} />;
};

export default Container;
