class InteractionManager {
  static ACCELERATE_RATE = 0.1;

  _yOffset = 0;
  _acceleratedYOffset = 0;
  _currentSection = 0;
  _requestAnimationFrameJobId = -1;
  _sectionList = [];

  _calculateAcceleratedYOffset () {
    this._acceleratedYOffset +=
      (this._yOffset - this._acceleratedYOffset) * InteractionManager.ACCELERATE_RATE;

    if (this._requestAnimationFrameJobId !== -1) {
      return;
    }

    if (Math.abs(this._yOffset - this._acceleratedYOffset) < 1) {
      cancelAnimationFrame(this._requestAnimationFrameJobId);
      this._requestAnimationFrameJobId = -1;
    } else {
      this._requestAnimationFrameJobId = requestAnimationFrame(
        () => this._calculateAcceleratedYOffset
      );
    }
  }

  _animate () {
    const activeSection = this._sectionList[this._currentSection];
    activeSection.update(this._yOffset + window.innerHeight / 2);
  }

  _updateCurrentSection () {
    for (let i = 0; i < this._sectionList.length; i++) {
      const section = this._sectionList[i];
      const sectionScrollHeight = section.getScrollHeight();
      const sectionLocalYOffset = section.getLocalYOffset(this._yOffset);
      const halfOfWindowHeight = window.innerHeight / 2;
      const endOffsetY = sectionScrollHeight - halfOfWindowHeight;

      if (sectionLocalYOffset < endOffsetY) {
        if (this._currentSection !== i) {
          log.info(`section changed to ${i}`);
        }
        this._currentSection = i;
        break;
      }
    }
  
    this._sectionList.forEach((section, index) => {
      index === this._currentSection
        ? section.activate()
        : section.deactivate();
    });
  }

  _onScroll () {
    this._yOffset = window.scrollY;
    this._updateCurrentSection();

    if (this._requestAnimationFrameJobId === -1) {
      this._calculateAcceleratedYOffset();
    }

    this._animate();
  }

  _setLayout () {
    this._sectionList.forEach((section) => {
      section.setLayout();
    });
  }

  addSection (section) {
    if (section instanceof Section) {
      this._sectionList.push(section);
    } else {
      log.error('invalid section', section);
    }
    return this;
  }

  initialize () {
    window.addEventListener('resize', () => this._setLayout());
    window.addEventListener('scroll', () => this._onScroll());

    this._yOffset = this._acceleratedYOffset = window.scrollY;
    this._sectionList.forEach((section) => section.initialize());
    this._setLayout();
    this._updateCurrentSection();
  }
}

const manager = new InteractionManager();
