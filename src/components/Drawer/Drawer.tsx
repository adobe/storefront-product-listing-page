import { FunctionComponent } from 'preact';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Drawer: FunctionComponent<DrawerProps> = ({
  isOpen,
  onClose,
  children,
}) => {

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          <div className="relative mt-auto w-full bg-white h-80 shadow-lg overflow-auto slide-up">
            <div className="flex items-center justify-between p-4">
              <button onClick={onClose}>&times;</button>
            </div>
            <div className="p-4">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};
