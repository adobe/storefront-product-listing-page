import { FunctionComponent } from 'preact';

import { classNames } from '../../../utils/dom';
import LoadingIcon from '../../icons/loading.svg';

interface LoadingProps {
  label: string;
}

export const Loading: FunctionComponent<LoadingProps> = ({ label }) => {
  const isMobile = window.matchMedia(
    'only screen and (max-width: 768px)'
  ).matches;
  return (
    <div
      className={classNames(
        'ds-sdk-loading flex h-screen justify-center items-center',
        isMobile ? 'loading-spinner-on-mobile' : ''
      )}
    >
      <div className="ds-sdk-loading__spinner bg-gray-100 rounded-full p-xs flex w-fit my-lg outline-gray-200">
        <LoadingIcon className="inline-block mr-xs ml-xs w-md animate-spin fill-primary" />
        <span className="ds-sdk-loading__spinner-label p-xs">{label}</span>
      </div>
    </div>
  );
};

export default Loading;
