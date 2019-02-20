export default function loadScript(url: string, attributes: { [key: string]: boolean | string } = {}): Promise<void | {}> {
  return new Promise((resolve) => {
    const scriptTag: HTMLScriptElement = document.createElement('script');

    scriptTag.src = url;
    scriptTag.onload = resolve;

    Object.keys(attributes).forEach((key) => {
      const value: boolean | string = attributes[key];

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
  }).catch((err) => console.error(err));
}
