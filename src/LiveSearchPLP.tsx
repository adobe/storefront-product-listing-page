import { render } from "preact/compat";

import "./styles/index.css";
import {
    AttributeMetadataProvider,
    CartProvider,
    ProductsContextProvider,
    SearchProvider,
    StoreContextProvider,
} from "@/context";
import { StoreDetails } from "@/types";
import { getUserViewHistory } from "@/utils/getUserViewHistory";
import { validateStoreDetailsKeys } from "@/utils/validateStoreDetails";

import App from "./containers/App";
import Resize from "./context/displayChange";
import Translation from "./context/translation";

type LiveSearchPlpProps = {
    storeDetails: StoreDetails;
    root: HTMLElement;
};

export function LiveSearchPLP({ storeDetails, root }: LiveSearchPlpProps) {
    if (!storeDetails) {
        throw new Error("Livesearch PLP's storeDetails prop was not provided");
    }
    if (!root) {
        throw new Error("Livesearch PLP's Root prop was not provided");
    }
    const userViewHistory = getUserViewHistory();

    const updatedStoreDetails: StoreDetails = {
        ...storeDetails,
        context: {
            ...storeDetails.context,
            userViewHistory,
        },
    };

    render(
        <StoreContextProvider {...validateStoreDetailsKeys(updatedStoreDetails)}>
            <AttributeMetadataProvider>
                <SearchProvider>
                    <Resize>
                        <Translation>
                            <ProductsContextProvider>
                                <CartProvider>
                                    <App />
                                </CartProvider>
                            </ProductsContextProvider>
                        </Translation>
                    </Resize>
                </SearchProvider>
            </AttributeMetadataProvider>
        </StoreContextProvider>,
        root,
    );
}
