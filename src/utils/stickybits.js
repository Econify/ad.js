class Stickybits {
  constructor (target, obj) {
    const o = typeof obj !== 'undefined' ? obj : {}
    this.version = 'VERSION'
    this.userAgent = window.navigator.userAgent || 'no `userAgent` provided by the browser'
    this.props = {
      customStickyChangeNumber: o.customStickyChangeNumber || null,
      noStyles: o.noStyles || false,
      stickyBitStickyOffset: o.stickyBitStickyOffset || 0,
      parentClass: o.parentClass || 'js-stickybit-parent',
      scrollEl: typeof o.scrollEl === 'string' ? document.querySelector(o.scrollEl) : o.scrollEl || window,
      stickyClass: o.stickyClass || 'js-is-sticky',
      stuckClass: o.stuckClass || 'js-is-stuck',
      stickyChangeClass: o.stickyChangeClass || 'js-is-sticky--change',
      useStickyClasses: o.useStickyClasses || false,
      useFixed: o.useFixed || false,
      useGetBoundingClientRect: o.useGetBoundingClientRect || false,
      verticalPosition: o.verticalPosition || 'top',
    }

    this.props.positionVal = this.definePosition() || 'fixed'

    this.instances = []

    const {
      positionVal,
      verticalPosition,
      noStyles,
      stickyBitStickyOffset,
    } = this.props
    const verticalPositionStyle = verticalPosition === 'top' && !noStyles ? `${stickyBitStickyOffset}px` : ''
    const positionStyle = positionVal !== 'fixed' ? positionVal : ''

    this.els = typeof target === 'string' ? document.querySelectorAll(target) : target

    if (!('length' in this.els)) this.els = [this.els]

    for (let i = 0; i < this.els.length; i++) {
      const el = this.els[i]

      // set vertical position
      el.style[verticalPosition] = verticalPositionStyle
      el.style.position = positionStyle

      // instances are an array of objects
      this.instances.push(this.addInstance(el, this.props))
    }
  }

  definePosition () {
    let stickyProp
    if (this.props.useFixed) {
      stickyProp = 'fixed'
    } else {
      const prefix = ['', '-o-', '-webkit-', '-moz-', '-ms-']
      const test = document.head.style
      for (let i = 0; i < prefix.length; i += 1) {
        test.position = `${prefix[i]}sticky`
      }
      stickyProp = test.position ? test.position : 'fixed'
      test.position = ''
    }
    return stickyProp
  }

  removeInstance (instance) {
    const e = instance.el
    const p = instance.props
    const tC = this.toggleClasses
    e.style.position = ''
    e.style[p.verticalPosition] = ''
    tC(e, p.stickyClass)
    tC(e, p.stuckClass)
    tC(e.parentNode, p.parentClass)
  }

  cleanup () {
    for (let i = 0; i < this.instances.length; i += 1) {
      const instance = this.instances[i]
      if (instance.stateContainer) {
        instance.props.scrollEl.removeEventListener('scroll', instance.stateContainer)
      }
      this.removeInstance(instance)
    }
    this.manageState = false
    this.instances = []
  }
}

export default function stickybits (target, o) {
  return new Stickybits(target, o)
}
