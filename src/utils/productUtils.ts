import { ColorSwatchFromAttribute,ProductView } from '../types/interface';

function isSportsWear(productView: ProductView) {
  const department = productView?.attributes?.find(({ name }) => name === 'pim_department_name');

  return department?.value.includes('Sportswear');
}

export function getColorOptionsFromProductOptions(productView: ProductView) {
  // First pim_axis option in product option is a color options config
  const productOptions = productView?.options?.find((option) => option.id?.startsWith('pim_axis'));
  return productOptions;
}

export function getImageConfigsFromAttribute(productView: ProductView) {
  const imageAttributes = productView?.attributes?.find(({ name }) => name === 'eds_images');
  if (!imageAttributes) {
    return [];
  }

  try {
    return JSON.parse(imageAttributes.value);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error parsing image attributes', e);
  }

  return [];
}

/*
* New attribute i.e. "eds_images" for product images were introduced to get around catalog service sync issue
* Ref: https://adobe-dx-support.slack.com/archives/C04CQH83BME/p1719261375238899
*
* Following steps are taken to get the color swatches:
* 1. Find the attribute with name "eds_images" in product view attributes
* 2. Parse the value of the attribute
* 3. Get the attribute id from the product view options by selecting the first option
* 5. Find the option in "eds_images" with the same attribute id as found in step 3
* 6. Validate if the option has the attribute type as "visual" and show_swatches is true
* 7. If the above condition is met, return the image options
*/
function getColorSwatchesFromAttribute(productView: ProductView, categoryId?: string): ColorSwatchFromAttribute[] {
  const imageConfigsFromAttribute = getImageConfigsFromAttribute(productView);
  const colorOptionsFromAttribute = imageConfigsFromAttribute.find((config: any) => config.attribute_type === 'visual'
    && config.show_swatches);

  const segmentedOptions = categoryId ? getSegmentedOptions(productView, colorOptionsFromAttribute?.attribute_id, categoryId) : null;
  return (colorOptionsFromAttribute?.images ?? [])
    .filter((colorOption: any) => !segmentedOptions || segmentedOptions.includes(colorOption.id))
    .map((colorOption: any) => {
      const defaultImage = '/en-us/media/image/media_1ccf88b21200e64fed7e7e93e0cf2d0a76fa007a8.png';
      const swatchImage = colorOption?.swatch_image || defaultImage

      return {
        ...colorOption,
        swatch_image: swatchImage
      }
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
function getSegmentedOptions(productView: ProductView, optionId: string | null, categoryId: string) {
  if (!categoryId) {
    return null;
  }
  const edsSegmentation = productView?.attributes?.find(({name}) => name === 'eds_segmentation')?.value;
  if (!edsSegmentation) {
    return null;
  }

  const parsedSegmentation = JSON.parse(edsSegmentation);
  if (parsedSegmentation?.['attribute_code'] === optionId) {
    const segmentedOptions = parsedSegmentation.options
      .filter((option: any) => option?.categories?.split(',')?.includes(categoryId))
      .map((option:any) => option.id);
    return segmentedOptions.length > 0 ? segmentedOptions : null;
  }
  return null;
}


function getDefaultColorSwatchId(productView: ProductView, swatches: ColorSwatchFromAttribute[]): string | undefined {
  if (isSportsWear(productView)) {
    // There will be single color option for sportswear
    const colorOptionsFromProductOptions = getColorOptionsFromProductOptions(productView);
    return swatches?.find((swatch: any) => swatch.id === colorOptionsFromProductOptions?.values?.[0].id)?.id;
  }

  return swatches[0].id;
}

export { isSportsWear, getColorSwatchesFromAttribute, getDefaultColorSwatchId, getSegmentedOptions };
