import { FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

import CloseIcon from '../../icons/plus.svg';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Drawer: FunctionComponent<DrawerProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          <div className="relative mt-auto w-full bg-white h-[80%] shadow-lg overflow-auto slide-up">
            <div className="flex items-center justify-between p-4">
              <CloseIcon
                className="h-[20px] w-[20px] rotate-45 inline-block ml-sm cursor-pointer fill-neutral-800"
                onClick={onClose}
              />
            </div>
            <div className="p-4">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};
