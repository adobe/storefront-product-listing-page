import { FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

import { useSearch } from "../../context";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  totalCount: number;
}

export const Drawer: FunctionComponent<DrawerProps> = ({
  isOpen,
  onClose,
  totalCount,
  children,
}) => {
  const searchCtx = useSearch();

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('no-scroll');
      document.body.style.overflow = 'visible';
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex bg-black bg-opacity-50">
          <div
            className="relative mt-auto w-full bg-white h-[80%] md:h-full shadow-lg overflow-auto animate-slideUp pb-20 md:animate-slideRight md:max-w-[500px]">
            <div className="p-12">{children}</div>
          </div>
          <div
            class="apply-buttons absolute left-0 right-0 bottom-0 flex p-4 gap-4 md:animate-slideRight md:max-w-[485px] ">
            <button
              class="apply-buttons_button border border-solid border-black content-center h-16 flex-1 bg-white text-black capitalize"
              onClick={() => searchCtx.clearFilters()}>clear filters
            </button>
            <button
              class="apply-buttons_button border border-solid border-black content-center h-16 flex-1 bg-black text-white capitalize"
              onClick={onClose}>view {totalCount} results
            </button>
          </div>
        </div>
      )}
    </>
  );
};
