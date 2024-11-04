import {useEffect, useState} from 'preact/hooks';
const fetchMerchandiseData = async () => {
    const response = await fetch(`/en-us/enrichment/enrichment.json`);
    const merchandisingData = await response.json();

    // Filter merchandisingData.data based on phrase
    return merchandisingData.data.filter((item: any) => {
        let positions = [];
        try {
            positions = JSON.parse(item.positions);
        } catch (e) {
        }
        return Array.isArray(positions) && positions.length > 0 && positions.every((position => !isNaN(Number(position))))
    });
};

const useMerchandisingData = () => {
    const [merchandisingData, setMerchandisingData] = useState<Array<{ positions: string}>>([]);

    useEffect(() => {
        const getMerchandisingData = async () => {
            setMerchandisingData(await fetchMerchandiseData());
        };

        getMerchandisingData();
    }, []);

    return merchandisingData;
};

export default useMerchandisingData;
