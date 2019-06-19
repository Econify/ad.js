class Stickybits {
  constructor (target) {
    this.props = {
      stickyBitStickyOffset: 0,
      verticalPosition: 'top',
    }
    this.target = target

    this.props.positionVal = this.definePosition() || 'fixed'

    const {
      positionVal,
      verticalPosition,
      stickyBitStickyOffset,
    } = this.props
    const verticalPositionStyle = verticalPosition === 'top' && `${stickyBitStickyOffset}px`
    const positionStyle = positionVal !== 'fixed' ? positionVal : ''

    // set vertical position
    this.target.style[verticalPosition] = verticalPositionStyle
    this.target.style.position = positionStyle
  }

  definePosition () {
    let stickyProp;
    const prefix = ['', '-o-', '-webkit-', '-moz-', '-ms-']
    const test = document.head.style
    for (let i = 0; i < prefix.length; i += 1) {
      test.position = `${prefix[i]}sticky`
    }
    stickyProp = test.position ? test.position : 'fixed'
    test.position = ''
    return stickyProp;
  }

  cleanup () {
      this.target.style.position = ''
      this.target.style[this.props.verticalPosition] = '';
  }
}

export default Stickybits;
