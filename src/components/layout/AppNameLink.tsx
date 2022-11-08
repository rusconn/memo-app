import equal from "fast-deep-equal";
import Link, { LinkProps } from "next/link";
import { memo } from "react";

import { pagesPath } from "@/lib";

type Props = {
  name: string;
} & Pick<LinkProps, "href">;

const StyledComponent = ({ name, href }: Props) => (
  <h1 className="text-lg">
    <Link {...{ href }}>{name}</Link>
  </h1>
);

export const Component = memo(StyledComponent, equal);

const Container = () => {
  const name = "メモアプリ";
  const href = pagesPath.$url();

  return <Component {...{ name, href }} />;
};

export default Container;
