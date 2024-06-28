import { Product } from '../types/interface';

function isSportsWear(product: Product) {
  const { productView } = product;
  const department = productView?.attributes?.find(({ name }) => name === 'pim_department_name');
  
  return department?.value.includes('Sportswear');
}

function getColorSwatchesFromQuery(item: Product) {
  if (isSportsWear(item)) {
    return [];
  }

  const { productView } = item;
  const attributeId = productView?.options?.[0].id;
  const imageAttributes = productView?.attributes?.find(({ name }) => name === 'eds_images');
  if (imageAttributes) {
    const options = JSON.parse(imageAttributes.value);
    const colorOption = options.find((option: any) => option.attribute_id === attributeId 
      && option.attribute_type === 'visual' 
      && option.show_swatches);
    if (!colorOption) {
      return [];
    }

    return colorOption.images;
  }

  return [];
}

export { isSportsWear, getColorSwatchesFromQuery };
