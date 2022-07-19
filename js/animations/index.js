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

/**
 * # StickySection
 * 
 * Manager for sticky section.
 * 
 * ### Configs
 * 
 * ```js
 * [
 *   {
 *     target: '.selector',
 *     initialStyle: {
 *       opacity: 0,
 *     },
 *     effects: [
 *       {
 *         values: [0, 1],
 *         enter: [0.1, 0.3],
 *         exit: [0.35, 0.5],
 *         style: 'opacity',
 *       },
 *     ],
 *   },
 *   ...
 * ];
 * ```
 */
class StickySection extends Section {
  static STICKY_SECTION_EFFECT_ELEMENT = Symbol();

  constructor (section, heightScale, configs) {
    super(section, 'sticky', heightScale);
    this._configs = configs || [];
  }

  initialize () {
    this._configs.forEach((config) => {
      const initialStyle = config.initialStyle;
      const targetElement = document.querySelector(config.target);
      config[StickySection.STICKY_SECTION_EFFECT_ELEMENT] = targetElement;

      if (initialStyle) {
        Object.entries(initialStyle).forEach(([styleProperty, value]) => {
          console.log(styleProperty, value);
          targetElement.style[styleProperty] = value;
        });
      }
    });
  }

  update (globalYOffset) {
    const ratio = this.getLocalScrollRatio(globalYOffset);
    
    this._configs.forEach((config) => {
      const targetElement = config[StickySection.STICKY_SECTION_EFFECT_ELEMENT];
      config.effects.forEach((effect) => {
        const {
          enter,
          exit,
          values,
          style: styleProperty,
          getStyle,
        } = effect;
        const isEnter = enter[0] >= ratio || enter[0] <= ratio && enter[1] >= ratio;
        const [from, to] = isEnter ? values : [values[1], values[0]];
        const [animateEnter, animateExit] = isEnter ? enter : exit;
        const styleValue = interpolate(
          { from: animateEnter, to: animateExit },
          { from, to },
          ratio
        );

        targetElement.style[styleProperty] = getStyle
          ? getStyle(styleValue)
          : styleValue;
      });
    });
  }
}
