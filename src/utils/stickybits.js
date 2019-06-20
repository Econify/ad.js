class Stickybits {
  constructor (target) {
    this.target = target;

    this.target.style.top = '0px';
    this.target.style.position = 'sticky -o-sticky -webkit-sticky -moz-sticky -ms-sticky';

    if (navigator.appName == 'Netscape') {
      const ua = navigator.userAgent;
      const re  = new RegExp("Trident/.*rv:([0-9]{1,}[\\.0-9]{0,})");
      if (re.exec(ua) != null) {
        const rv = parseInt( RegExp.$1 );
        if (rv === 11) {
          this.target.style.position = 'fixed';
        }
      }
    }
  }

  cleanup () {
      this.target.style.position = ''
      this.target.style.top = '';
  }
}

export default Stickybits;
