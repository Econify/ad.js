export default function loadScript(url: string, attributes: {} = {}): Promise<void> {
  return new Promise((resolve) => {
    const scriptTag: HTMLElement = document.createElement('script');

    scriptTag.src = url;
    scriptTag.onload = resolve;

    Object.keys(attributes).forEach((key) => {
      const value = attributes[key];

      if (typeof value === 'boolean') {
        if (!value) {
          return;
        }

        scriptTag.setAttribute(key, key);
        return;
      }


      scriptTag.setAttribute(key, value);
    });

    document.getElementsByTagName('head')[0].appendChild(scriptTag);
  }).catch(err => console.error(err));
}

