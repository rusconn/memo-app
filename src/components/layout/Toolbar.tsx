import { memo } from "react";

import ButtonBack from "./ToolbarButtonBack";
import ButtonCreate from "./ToolbarButtonCreate";
import ButtonDelete from "./ToolbarButtonDelete";
import Search from "./ToolbarSearch";

const StyledComponent = () => (
  <section className="flex h-16 items-center justify-between p-4">
    <div className="flex space-x-8 text-xs">
      <ButtonBack />
      <div className="flex space-x-2">
        <ButtonDelete />
        <ButtonCreate />
      </div>
    </div>
    <div className="h-full w-48">
      <Search />
    </div>
  </section>
);

export const Component = memo(StyledComponent);

export default Component;
