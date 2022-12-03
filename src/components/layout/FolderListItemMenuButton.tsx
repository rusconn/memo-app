import { ComponentProps, memo } from "react";

import { clsx } from "@/lib";

type Props = Pick<ComponentProps<"button">, "children" | "disabled" | "onClick">;

const StyledComponent = ({ children, disabled, onClick }: Props) => (
  <button
    className={clsx(
      "block w-full p-2 text-left hover:bg-gray-200 dark:hover:bg-stone-800",
      disabled && "opacity-40"
    )}
    type="button"
    {...{ disabled, onClick }}
  >
    {children}
  </button>
);

export const Component = memo(StyledComponent);

export default Component;
