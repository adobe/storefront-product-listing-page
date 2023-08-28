import { FunctionComponent } from "preact";
import { HTMLAttributes } from "preact/compat";

import "./product-list.css";

import { Product } from "../../types/interface";
import ProductItem from "../ProductItem";

export interface ProductListProps extends HTMLAttributes<HTMLDivElement> {
    products: Array<Product> | null | undefined;
    numberOfColumns: number;
    currencySymbol: string;
    currencyRate: string;
}

export const ProductList: FunctionComponent<ProductListProps> = ({
    products,
    numberOfColumns,
    currencySymbol,
    currencyRate,
}) => {
    return (
        <div className="ds-sdk-product-list bg-body max-w-5xl mx-auto pb-2xl sm:pb-24 lg:max-w-7xl">
            <div
                style={{
                    gridTemplateColumns: `repeat(${numberOfColumns}, minmax(0, 1fr))`,
                }}
                className="ds-sdk-product-list__grid mt-md grid grid-cols-1 gap-y-8 gap-x-2xl sm:grid-cols-2 xl:gap-x-8"
            >
                {products?.map(product => (
                    <ProductItem
                        item={product}
                        key={product.product.id}
                        currencySymbol={currencySymbol}
                        currencyRate={currencyRate}
                    />
                ))}
            </div>
        </div>
    );
};
