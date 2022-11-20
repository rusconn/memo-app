import dynamic from "next/dynamic";
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

import { useRenamingFolderIdMutation } from "@/contexts";
import { useFoldersMutation } from "@/storage";

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
  const { updateFolder } = useFoldersMutation();
  const ref = useRef<HTMLInputElement>(null);
  const { endRenameFolder } = useRenamingFolderIdMutation();

  useEffect(() => {
    ref.current?.select();
  }, []);

  const tryRename = useCallback(() => {
    if (value.trim() !== "") {
      updateFolder({ id, name: value });
    } else {
      setValue(name);
    }

    endRenameFolder();
  }, [updateFolder, id, value, name, endRenameFolder]);

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

export default dynamic(Promise.resolve(memo(Container)), { ssr: false });
