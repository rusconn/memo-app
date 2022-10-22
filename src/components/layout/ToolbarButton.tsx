import { clsx } from "@/utils";
import { memo, MouseEventHandler } from "react";
import { IconType } from "react-icons";

type Props = {
  Icon: IconType;
  tooltipText: string;
  ariaLabel: string;
  disabled?: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

const StyledComponent = ({ Icon, tooltipText, ariaLabel, disabled, onClick }: Props) => (
  <span className="group relative">
    <button
      className={clsx(
        " rounded-md p-1",
        disabled ? "opacity-40" : "cursor-pointer hover:bg-gray-100 dark:hover:bg-stone-700"
      )}
      type="button"
      {...{ disabled, onClick }}
      aria-label={ariaLabel}
    >
      <Icon className="h-6 w-6 rounded-md" />
    </button>
    <span className="pointer-events-none absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap border bg-stone-100 p-2 opacity-0 transition delay-500 group-hover:opacity-100 dark:border-stone-600 dark:bg-stone-800">
      {tooltipText}
    </span>
  </span>
);

export const Component = memo(StyledComponent);

export default Component;
