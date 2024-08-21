import { FunctionComponent } from 'preact';

import {useSearch} from "../../context";
import FranchiseView from "../../icons/franchiseview.svg";
import PlpView from "../../icons/plpview.svg";


export const FranchiseViewSelector: FunctionComponent = () => {
  const searchCtx = useSearch();

  return (
    <div className="flex gap-[10px] franchise-selector">
      <button disabled={searchCtx.displayFranchises} onClick={() => searchCtx.toggleFranchiseView(true)}>
        <FranchiseView/>
      </button>
      <button disabled={!searchCtx.displayFranchises} onClick={() => searchCtx.toggleFranchiseView(false)}>
        <PlpView/>
      </button>
    </div>
  );
}
