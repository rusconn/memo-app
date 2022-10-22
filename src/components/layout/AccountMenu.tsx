import Image from "next/image";
import { memo, MouseEventHandler, RefObject, useRef } from "react";
import { useBoolean, useOnClickOutside } from "usehooks-ts";

import { staticPath } from "@/$path";

type Props = {
  isOpen: boolean;
  menuRef: RefObject<HTMLElement>;
  onButtonClick: MouseEventHandler<HTMLButtonElement>;
};

const StyledComponent = ({ isOpen, menuRef, onButtonClick }: Props) => (
  <section className="relative flex h-8 w-8 justify-center rounded-full" ref={menuRef}>
    <button className="w-8 rounded-full" type="button" onClick={onButtonClick}>
      <Image
        className="rounded-full bg-gray-200 dark:bg-stone-600"
        layout="fill"
        objectFit="contain"
        src={staticPath.vercel_svg}
        alt="プロフィール画像"
      />
    </button>
    {isOpen && (
      <section className="absolute top-8 right-0 z-10 w-max rounded-md bg-gray-50 shadow dark:bg-stone-900">
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a className="block p-2" href="#">
          ログアウト
        </a>
      </section>
    )}
  </section>
);

export const Component = memo(StyledComponent);

const Container = () => {
  const menuRef = useRef<HTMLElement>(null);
  const { value: isOpen, toggle: onButtonClick, setFalse: close } = useBoolean(false);

  useOnClickOutside(menuRef, close);

  return <Component {...{ isOpen, menuRef, onButtonClick }} />;
};

export default Container;
