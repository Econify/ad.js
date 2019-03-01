export default function(
  tag: string,
  attributes: { [key: string]: boolean | string } = {},
  elementToInsertInto: HTMLElement,
  html?: string,
): HTMLElement {
  const element: HTMLElement = document.createElement(tag);

  Object.keys(attributes).forEach((key) => {
    const value: boolean | string = attributes[key];

    if (typeof value === 'boolean') {
      if (!value) {
        return;
      }

      element.setAttribute(key, key);
      return;
    }

    element.setAttribute(key, value);
  });

  if (typeof html === 'string') {
    element.innerHTML = html;
  }

  elementToInsertInto.appendChild(element);

  return element;
}
