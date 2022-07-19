class Section {
  constructor (section, type, heightScale = 1) {
    this._sectionElement = document.querySelector(section);
    this._type = type;
    this._heightScale = heightScale;
    this._scrollHeight = 0;
  }

  setLayout () {
    this._scrollHeight = window.innerHeight * Math.max(this._heightScale, 1);
    this._sectionElement.style.height = `${this._scrollHeight}px`;
  }

  getLocalYOffset (globalYOffset) {
    const offsetTop = this._sectionElement.offsetTop;
    return Math.max(0, globalYOffset - offsetTop);
  }

  getLocalScrollRatio (globalYOffset) {
    return this.getLocalYOffset(globalYOffset) / this._scrollHeight;
  }

  getScrollHeight () {
    return this._scrollHeight;
  }

  activate () {
    this._sectionElement.classList.add('active');
  }

  deactivate () {
    this._sectionElement.classList.remove('active');
  }

  initialize () {
    throw new Error('initialize() not implemented');
  }

  update (_globalYOffset) {
    throw new Error('update() not implemented');
  }
}
