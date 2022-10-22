import Link from "next/link";
import { memo } from "react";

import { pagesPath } from "@/$path";
import { app } from "@/data";

const StyledComponent = () => (
  <h1 className="text-lg">
    <Link href={pagesPath.$url()}>{app.name}</Link>
  </h1>
);

export const Component = memo(StyledComponent);

export default Component;
