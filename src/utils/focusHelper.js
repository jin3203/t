/**
 * Enter Key Focus Navigation Helper
 * Focuses the next focusable input/select element when Enter is pressed.
 */
export function handleEnterKeyNavigation(e) {
  if (e.key !== 'Enter') return;

  // Don't intercept if modifier keys are held or target is a button
  if (e.shiftKey || e.ctrlKey || e.altKey) return;
  if (e.target.tagName === 'BUTTON' || e.target.tagName === 'TEXTAREA') return;

  e.preventDefault();

  // Find all visible, enabled input/select elements in the document
  const focusables = Array.from(
    document.querySelectorAll(
      'input:not([type="hidden"]):not([disabled]), select:not([disabled])'
    )
  );

  const currentIndex = focusables.indexOf(e.target);
  if (currentIndex > -1 && currentIndex < focusables.length - 1) {
    const nextElem = focusables[currentIndex + 1];
    nextElem.focus();
    if (nextElem.select && typeof nextElem.select === 'function') {
      nextElem.select();
    }
  } else if (currentIndex === focusables.length - 1) {
    // If it's the last input, blur or loop
    e.target.blur();
  }
}
