/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { createContext } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";

import { WidgetConfigOptions } from "../types/interface";
import { useStore } from "./store";

interface WidgetConfigProps extends WidgetConfigOptions {}

const defaultWidgetConfigState = {
    badge: {
        enabled: false,
        label: "",
        attributeCode: "",
        backgroundColor: "",
    },
    price: {
        showNoPrice: false,
        showRange: true,
        showRegularPrice: true,
        showStrikethruPrice: true,
    },
    attributeSlot: {
        enabled: false,
        attributeCode: "",
        backgroundColor: "",
    },
    addToWishlist: {
        enabled: true,
        placement: "inLineWithName" as const,
    },
    layout: {
        defaultLayout: "grid" as const,
        allowedLayouts: [],
        showToggle: true,
    },
    addToCart: { enabled: true },
    stockStatusFilterLook: "radio" as const,
    swatches: {
        enabled: false,
        swatchAttributes: [],
        swatchesOnPage: 10,
    },
    multipleImages: {
        enabled: true,
        limit: 10,
    },
    compare: {
        enabled: true,
    },
};

const WidgetConfigContext = createContext<WidgetConfigProps>(defaultWidgetConfigState);

const WidgetConfigContextProvider = ({ children }: { children?: any }) => {
    const storeCtx = useStore();
    const { environmentId, storeCode } = storeCtx;

    const [widgetConfig, setWidgetConfig] = useState<WidgetConfigProps>(defaultWidgetConfigState);
    // widgetConfigFetched is to prevent configs flashing with default setting
    // incase of there's slowness of widget config API
    const [widgetConfigFetched, setWidgetConfigFetched] = useState<boolean>(false);

    useEffect(() => {
        if (!environmentId || !storeCode) {
            return;
        }

        !widgetConfigFetched &&
            getWidgetConfig(environmentId, storeCode)
                .then((results) => {
                    const newWidgetConfig = {
                        // new merchant config could have some missing node config, so it needs to merge with default config for missing nodes
                        ...defaultWidgetConfigState,
                        ...results,
                    };
                    setWidgetConfig(newWidgetConfig);
                    setWidgetConfigFetched(true);
                })
                .finally(() => {
                    setWidgetConfigFetched(true);
                });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [environmentId, storeCode]);

    const getWidgetConfig = async (envId: string, storeCode: string): Promise<WidgetConfigOptions> => {
        const fileName = "widgets-config.json";
        const S3path = `/${envId}/${storeCode}/${fileName}`;
        const widgetConfigUrl = `${WIDGET_CONFIG_URL}${S3path}`;

        const response = await fetch(widgetConfigUrl, {
            method: "GET",
        });

        if (response.status !== 200) {
            return defaultWidgetConfigState;
        }
        const results = await response?.json();
        return results;
    };

    const widgetConfigCtx = {
        ...widgetConfig,
    };

    return (
        <WidgetConfigContext.Provider value={widgetConfigCtx}>
            {widgetConfigFetched && children}
        </WidgetConfigContext.Provider>
    );
};

const useWidgetConfig = () => {
    const widgetConfigCtx = useContext(WidgetConfigContext);
    return widgetConfigCtx;
};

export { WidgetConfigContextProvider, useWidgetConfig };
