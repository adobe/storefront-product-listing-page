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
    // eslint-disable-next-line no-console
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
function getColorSwatchesFromAttribute(item: Product, categoryId?: string) {
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
  if (!colorOptions) {
    return null;
  }
  const segmentedOptions = categoryId ? getSegmentedOptions(item, colorOptions.id, categoryId) : null;

  return colorOptions?.values?.filter((option: any) => !segmentedOptions || segmentedOptions.includes(option.id))
    .map((option: any) => {
    const imagConfig = colorOptionsFromAttribute.images && colorOptionsFromAttribute.images.find((image: any) => image.id === option.id);
    const defaultImage = '/en-us/media/image/media_1ccf88b21200e64fed7e7e93e0cf2d0a76fa007a8.png';
    const swatchImage = (imagConfig && imagConfig.swatch_image) || defaultImage
    return {
      ...option,
      image: swatchImage,
    };
  });
}

/**
 * When product has attribute `eds_segmentation`.
 * eds_segmentation contains an array of optionUID:categoryIDs pairs.
 * This enables a given option of the product for a one or more categories.
 *
 * if the categoryId is found in at least one of the optionUIDs, only
 * the swatches matching the optionUIDs enabled for that categoryId should be displayed.
 * If the categoryId is not found in any of the optionUIDs all swatches should be displayed
 *
 * @param item Product Item
 * @param optionId id of the option
 * @param categoryId id of the current category
 * @returns array of optionUIDs(swatches) that must be displayed for current product in the current category,
 * or null if all optionUIDs(swatches) must be shown for the current product in the current category.
 *
 * For more information see https://amersports.atlassian.net/browse/WAF-116
 */
function getSegmentedOptions(item: Product, optionId: string | null, categoryId: string) {
  const edsSegmentation = item.productView?.attributes?.find(({name}) => name === 'eds_segmentation')?.value;
  if (!edsSegmentation) {
    return null;
  }

  const parsedSegmentation = JSON.parse(edsSegmentation);
  if (parsedSegmentation?.['attribute_code'] === optionId) {
    const segmentedOptions = parsedSegmentation.options
        .filter((option: any) => option?.categories?.split()?.includes(categoryId))
        .map((option:any) => option.id);
    return segmentedOptions.length > 0 ? segmentedOptions : null;
  }
  return null;
}


function getDefaultColorSwatchId(item: Product) {
  const colorOptionsFromAttribute = getColorSwatcheConfigFromAttribute(item);

  return colorOptionsFromAttribute?.images?.[0]?.id;
}

export { isSportsWear, getColorSwatchesFromAttribute, getDefaultColorSwatchId };
