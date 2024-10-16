/**
 * Toggles filters modal
 *
 * @param event
 */
export const toggleFilters = (event: Omit<MouseEvent, "currentTarget"> & {
  readonly currentTarget: HTMLLabelElement
}) => {
  const clicked = event.target;
  const toBeActiveFilterBlock = clicked.nextElementSibling;
  const parrentDiv = clicked.closest('.ds-sdk-input')
  const borderDiv = parrentDiv.querySelector('.ds-sdk-input__border')

  if (toBeActiveFilterBlock.classList.contains('none-display')) {
    const currentFilterBlock = clicked.closest('form').querySelector('fieldset:not(.none-display)')
    currentFilterBlock?.classList.add('none-display')
    currentFilterBlock?.nextElementSibling?.classList.remove('mt-md')
    currentFilterBlock?.closest('.ds-sdk-input').classList.remove('active')
    toBeActiveFilterBlock?.classList.remove('none-display')
    borderDiv.classList.add('mt-md');
    parrentDiv.classList.add('active');
  } else {
    toBeActiveFilterBlock?.classList.add('none-display')
    borderDiv.classList.remove('mt-md');
    parrentDiv.classList.remove('active');
  }
}