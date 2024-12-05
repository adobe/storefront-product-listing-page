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
  const parrentDiv = clicked.closest('.ds-sdk-input')
  let borderDiv: any
  if (parrentDiv && "querySelector" in parrentDiv) {
    borderDiv = parrentDiv.querySelector('.ds-sdk-input__border')
  }

  if (!(toBeActiveFilterBlock) || toBeActiveFilterBlock.classList.contains('none-display')) {
    const clickedForm = clicked.closest('form')
    let currentFilterBlock: any
    if (clickedForm && "querySelector" in clickedForm) {
      currentFilterBlock = clickedForm.querySelector('fieldset:not(.none-display)');
    }

      currentFilterBlock?.classList.add('none-display')
      currentFilterBlock?.nextElementSibling?.classList.remove('mt-md')
      currentFilterBlock?.closest('.ds-sdk-input').classList.remove('active')

    toBeActiveFilterBlock?.classList.remove('none-display')
    borderDiv.classList.add('mt-md');
    if (parrentDiv && "classList" in parrentDiv) {
      parrentDiv.classList.add('active');
    }
  } else {
    toBeActiveFilterBlock?.classList.add('none-display')
    borderDiv.classList.remove('mt-md');
    if (parrentDiv && "classList" in parrentDiv) {
      parrentDiv.classList.remove('active');
    }
  }
}