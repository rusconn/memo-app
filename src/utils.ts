export const clsx = (...classes: (string | false | null | undefined)[]) =>
  classes.filter((v): v is string => Boolean(v)).join(" ");
