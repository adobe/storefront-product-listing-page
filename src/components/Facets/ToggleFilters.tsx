/**
 * Toggles filters modal
 *
 * @param event
 */
export const toggleFilters = (event: any) => {
  const activateEvent = event.type === 'click' || (event.type === 'keydown' && event.key === 'Enter') || false;

  if (!activateEvent) {
    return;
  }

  const clicked = event.currentTarget;
  const toBeActiveFilterBlock = clicked.nextElementSibling;
  const parentDiv = clicked.closest('.ds-sdk-input')
  let borderDiv: any
  if (parentDiv) {
    borderDiv = parentDiv.querySelector('.ds-sdk-input__border')
  }

  if (!(toBeActiveFilterBlock) || toBeActiveFilterBlock.classList.contains('none-display')) {
    const clickedForm = clicked.closest('form')
    let currentFilterBlock: any
    if (clickedForm) {
      currentFilterBlock = clickedForm.querySelector('fieldset:not(.none-display)');
    }

      currentFilterBlock?.classList.add('none-display')
      currentFilterBlock?.nextElementSibling?.classList.remove('mt-md')
      currentFilterBlock?.closest('.ds-sdk-input').classList.remove('active')

    toBeActiveFilterBlock?.classList.remove('none-display')
    borderDiv.classList.add('mt-md');
    if (parentDiv) {
      parentDiv.classList.add('active');
    }
  } else {
    toBeActiveFilterBlock?.classList.add('none-display')
    borderDiv.classList.remove('mt-md');
    if (parentDiv) {
      parentDiv.classList.remove('active');
    }
  }
}