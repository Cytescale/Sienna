import { BlockAdderInpMode } from "../../constants";

export const defaultMenuArray = [
  "paragrapgh",
  "header-one",
  "header-two",
  "quote",
  "image",
  "bullet-list",
  "divider",
];

export default class BlockAdderState {
  statimenuVisi = false;
  menuArrowIndex = 0;
  menuMouseIndex = null;
  prevSelecState = null;
  searchString = "";
  currShowingMenuArray = defaultMenuArray;
  searchHitBool = false;
  lastInpMode = null;

  setMenuVisi(bool) {
    this.menuVisi = bool ? true : false;
    return this;
  }
  toggleMenuVisi() {
    this.menuVisi = !this.menuVisi;
    return this;
  }
  setSearchString(str) {
    this.searchString = str;
    return this;
  }
  setLastInpMode(mode) {
    this.lastInpMode = mode;
    return this;
  }
  setArrowInd(int) {
    this.menuArrowIndex = int;
    return this;
  }
  setMouseInd(int) {
    this.menuMouseIndex = int;
    return this;
  }

  setPrevSelecState(state) {
    this.prevSelecState = state;
    return this;
  }

  getCurrShowingMenuArray() {
    return this.currShowingMenuArray;
  }

  getMenuVisi() {
    return this.menuVisi;
  }

  getSearchString() {
    return this.searchString;
  }
  getLastInpMode() {
    return this.lastInpMode;
  }
  getArrowInd() {
    return this.menuArrowIndex;
  }
  getMouseInd() {
    return this.menuMouseIndex;
  }

  getPrevSelecState() {
    return this.prevSelecState;
  }

  getState() {
    return this;
  }
}
