interface IScriptAttributes {
  [key: string]: boolean | string;
}

export default (url: string, attributes: IScriptAttributes = {}): Promise<void> =>
  new Promise((resolve) => {
    const scriptTag: HTMLScriptElement = document.createElement('script');

    scriptTag.src = url;
    scriptTag.onload = () => resolve();

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
  });
