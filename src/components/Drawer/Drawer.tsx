import { FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

import CloseIcon from '../../icons/plus.svg';
import {useSearch} from "../../context";

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
            <div className="relative mt-auto w-full bg-white h-[80%] md:h-full shadow-lg overflow-auto animate-slideUp md:animate-slideRight">
              <div className="p-12">{children}</div>
            </div>
            <div class="apply-buttons md:animate-slideRight">
              <button class="apply-buttons_button" onClick={() => searchCtx.clearFilters()}>clear filters</button>
              <button class="apply-buttons_button apply-buttons_button--view" onClick={onClose}>view {totalCount} results</button>
            </div>
          </div>
      )}
    </>
  );
};
