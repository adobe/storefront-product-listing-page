import { Product } from '../types/interface';

function isSportsWear(product: Product) {
  const { productView } = product;
  const department = productView?.attributes?.find(({ name }) => name === 'pim_department_name');
  
  return department?.value.includes('Sportswear');
}

function getColorSwatcheConfigFromAttribute(item: Product) {
  if (isSportsWear(item)) {
    return null;
  }

  const { productView } = item;
  const imageAttributes = productView?.attributes?.find(({ name }) => name === 'eds_images');
  if (!imageAttributes) {
    return null;
  }

  let options;
  try {
    options = JSON.parse(imageAttributes.value);
  } catch (e) {
    console.error('Error parsing image attributes', e);
    return null;
  }

  const productOptions = productView?.options?.filter((option) => option.id?.startsWith('pim_axis'));
  const colorOptions =  productOptions?.[0];
  const attributeId = colorOptions?.id;
  
  return options.find((option: any) => option.attribute_id === attributeId 
    && option.attribute_type === 'visual' 
    && option.show_swatches);
}

/*
* New attribute i.e. "eds_images" for product images were introduced to get around catalog service sync issue
* Ref: https://adobe-dx-support.slack.com/archives/C04CQH83BME/p1719261375238899
*
* Following steps are taken to get the color swatches:
* 1. If the product is sports wear, return an empty array since there are no color swatches for sports wear
* 2. Get the attribute id from the product view options by selecting the first option
* 3. Find the attribute with name "eds_images" in product view attributes
* 4. Parse the value of the attribute
* 5. Find the option with the same attribute id as found in step 1
* 6. Validate if the option has the attribute type as "visual" and show_swatches is true
* 7. If the above condition is met, return the image options
*/
function getColorSwatchesFromAttribute(item: Product) {
  if (isSportsWear(item)) {
    return null;
  }

  const colorOptionsFromAttribute = getColorSwatcheConfigFromAttribute(item);
  if (!colorOptionsFromAttribute) {
    return null;
  }

  const { productView } = item;
  const productOptions = productView?.options?.filter((option) => option.id?.startsWith('pim_axis'));
  const colorOptions = productOptions?.[0];
  return colorOptions?.values?.map((option) => {
    const imagConfig = colorOptionsFromAttribute.images.find((image: any) => image.id === option.id);
    return {
      ...option,
      image: imagConfig?.swatch_image,
    };
  });
}

function getDefaultColorSwatchId(item: Product) {
  const colorOptionsFromAttribute = getColorSwatcheConfigFromAttribute(item);

  return colorOptionsFromAttribute?.images?.[0]?.id;
}

export { isSportsWear, getColorSwatchesFromAttribute, getDefaultColorSwatchId };
