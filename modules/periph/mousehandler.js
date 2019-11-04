'use strict';

NeonFlow.MouseHandler = class MouseHandler {
  constructor (elem, xOffset, yOffset) {
    this.elemBoundaries = elem.getBoundingClientRect();
    this.lastClickEvent = null;
    this.lastContextMenuEvent = null;
    this.hitRegions = [];
    this.contextMenuActions = [];
    this.xOffset = xOffset || 0;
    this.yOffset = yOffset || 0;
    /* Listens to onmousedown event and checks every hit region */
    elem.addEventListener('mousedown', (ev) => {
      this.lastClickEvent = ev;
      this.hitRegions.forEach((hitRegion) => {
        let isCameraDefined = hitRegion.camera instanceof NeonFlow.Camera;
        let xOffset = isCameraDefined ? hitRegion.camera.x : 0;
        let yOffset = isCameraDefined ? hitRegion.camera.y : 0;
        let hrx = hitRegion.x + this.elemBoundaries.left - xOffset + this.xOffset;
        let hry = hitRegion.y + this.elemBoundaries.top - yOffset + this.yOffset;
        if (hitRegion.isActive) {
          if (
            hitRegion instanceof NeonFlow.RectHitRegion &&
            ev.clientX >= hrx &&
            ev.clientY >= hry &&
            ev.clientX <= hrx + hitRegion.width &&
            ev.clientY <= hry + hitRegion.height
          ) {
            hitRegion.action();
          } else if (
            hitRegion instanceof NeonFlow.CircHitRegion &&
            Math.pow(hrx - ev.clientX, 2) + Math.pow(hry - ev.clientY, 2) <= Math.pow(hitRegion.radius, 2)
          ) {
            hitRegion.action();
          } else if (
            hitRegion instanceof NeonFlow.EllipseHitRegion &&
            hitRegion.width * Math.pow(hrx - ev.clientX, 2) + hitRegion.height * Math.pow(hry - ev.clientY, 2) <= 1
          ) {
            // Condition : a^-2 * x^2 + b^-2 * y^2 <= 1(^2)
            hitRegion.action();
          }
        }
      });
    }, false);
    /* Listens to oncontextmenu event and execute every context menu action when the even is triggered */
    elem.addEventListener('contextmenu', (ev) => {
      this.lastContextMenuEvent = ev;
      this.contextMenuActions.forEach((action) => {
        action();
      });
    }, false);
  }

  /* Sets offset */
  setOffset (x, y) {
    this.xOffset = x;
    this.yOffset = y;
  }

  /* Links a hit region to the mouse handler */
  linkHitRegion (hitRegionName) {
    return this.hitRegions.push(NeonFlow.HitRegion.hitRegions[hitRegionName]) - 1;
  }

  /* Unlinks all hit regions*/
  unlinkHitRegions () {
    this.hitRegions = [];
  }

  /* Adds a context menu action */
  addContextMenuAction (action) {
    return this.contextMenuActions.push(action) - 1;
  }

  /* Removes all context menu actions */
  removeContextMenuActions () {
    this.contextMenuActions = [];
  }

  static linkMoveRegion (moveRegionName) {

  }

  static unlinkMoveRegion (moveRegionName) {

  }

  static unlinkMoveRegions () {

  }

  static setMoveRegionOffset (x, y) {
    NeonFlow.MouseHandler.moveRegionsXOffset = x;
    NeonFlow.MouseHandler.moveRegionsYOffset = y;
  }
};

NeonFlow.MouseHandler.moveRegionsXOffset = 0;
NeonFlow.MouseHandler.moveRegionsYOffset = 0;
NeonFlow.MouseHandler.moveRegions = [];
NeonFlow.MouseHandler.lastMoveEvent = null;
NeonFlow.MouseHandler.mouseMoveHandler = (ev) => {
  NeonFlow.MouseHandler.lastMoveEvent = ev;
  NeonFlow.MouseHandler.moveRegions.forEach((moveRegion) => {
    let isCameraDefined = moveRegion.camera instanceof NeonFlow.Camera;
    let xOffset = isCameraDefined ? moveRegion.camera.x : 0;
    let yOffset = isCameraDefined ? moveRegion.camera.y : 0;
    let mrx = moveRegion.x + moveRegion.xOffset - xOffset + NeonFlow.MouseHandler.moveRegionsXOffset;
    let mry = moveRegion.y + moveRegion.yOffset - yOffset + NeonFlow.MouseHandler.moveRegionsYOffset;
    if (moveRegion.isActive) {
      if (
        moveRegion instanceof NeonFlow.RectHitRegion &&
        ev.clientX >= mrx &&
        ev.clientY >= mry &&
        ev.clientX <= mrx + moveRegion.width &&
        ev.clientY <= mry + moveRegion.height
      ) {
        moveRegion.action();
      } else if (
        moveRegion instanceof NeonFlow.CircHitRegion &&
        Math.pow(mrx - ev.clientX, 2) + Math.pow(mry - ev.clientY, 2) <= Math.pow(moveRegion.radius, 2)
      ) {
        moveRegion.action();
      } else if (
        moveRegion instanceof NeonFlow.EllipseHitRegion &&
        moveRegion.width * Math.pow(mrx - ev.clientX, 2) + moveRegion.height * Math.pow(mry - ev.clientY, 2) <= 1
      ) {
        // Condition : a^-2 * x^2 + b^-2 * y^2 <= 1(^2)
        moveRegion.action();
      }
    }
  });
}
