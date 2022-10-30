import {
  ComponentProps,
  ForwardedRef,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useEndRenameFolder, useRenameFolder } from "@/contexts";

type ContainerProps = {
  id: string;
  name: string;
};

type Props = Pick<ComponentProps<"input">, "value" | "onChange" | "onKeyDown" | "onBlur">;

const StyledComponent = (
  { value, onChange, onKeyDown, onBlur }: Props,
  ref: ForwardedRef<HTMLInputElement>
) => (
  <input
    className="rounded-sm px-1 outline-yellow-500 dark:bg-stone-900"
    {...{ value, ref, onChange, onKeyDown, onBlur }}
  />
);

export const Component = memo(forwardRef(StyledComponent));

const Container = ({ id, name }: ContainerProps) => {
  const [value, setValue] = useState(name);
  const renameFolder = useRenameFolder();
  const ref = useRef<HTMLInputElement>(null);
  const endRenameFolder = useEndRenameFolder();

  useEffect(() => {
    ref.current?.select();
  }, []);

  const tryRename = useCallback(() => {
    if (value.trim() !== "") {
      renameFolder({ id, name: value });
    } else {
      setValue(name);
    }

    endRenameFolder();
  }, [renameFolder, id, value, name, endRenameFolder]);

  const onChange: NonNullable<Props["onChange"]> = useCallback(({ currentTarget }) => {
    setValue(currentTarget.value);
  }, []);

  const onKeyDown: NonNullable<Props["onKeyDown"]> = useCallback(
    ({ code, nativeEvent }) => {
      if (code === "Enter" && !nativeEvent.isComposing) {
        tryRename();
      }
    },
    [tryRename]
  );

  const onBlur: NonNullable<Props["onBlur"]> = tryRename;

  return <Component {...{ value, onChange, onKeyDown, onBlur, ref }} />;
};

export default Container;
