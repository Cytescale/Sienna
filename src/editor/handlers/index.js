/** @format */

import {
  RichUtils,
  EditorState,
  Modifier,
  getDefaultKeyBinding,
} from "draft-js";
import { toContinueBlocks, HeaderBlocks } from "../constants";
import {
  afterWholeBlockSelected,
  skipEntityBackspace,
  wholeBlockSelected,
} from "./utils";
import {
  insertDivider,
  insertProperBlock,
  insertNewBlock,
  toggleProperBlock,
  toggleBlockWithType,
} from "../commands";
import { MenuButtonInd } from "../menus/elementMenu";
import { SelectionState } from "draft-js";
import { removeBlockTypes } from "./utils";
import { getSelectedBlock, getSelectionText } from "draftjs-utils";

export function ReturnHandler(
  e,
  eState,
  editorStateChange,
  editorAdderMenuObject
) {
  const editorState = eState;
  const currBlockType = RichUtils.getCurrentBlockType(editorState);
  const isContinousBlock = toContinueBlocks.indexOf(currBlockType) > -1;
  const isAtStart = editorState.getSelection().getAnchorOffset() === 0;

  if (e.shiftKey) {
    const newEditorState = RichUtils.insertSoftNewline(editorState);
    if (newEditorState !== editorState) {
      editorStateChange(newEditorState);
    }
  } else if (editorAdderMenuObject.blockAdderState.getMenuVisi()) {
    let ind = editorAdderMenuObject.blockAdderState.getMouseInd()
      ? editorAdderMenuObject.blockAdderState.getMouseInd()
      : editorAdderMenuObject.blockAdderState.getArrowInd();
    let type = MenuButtonInd[ind].id;

    const prev_selec =
      editorAdderMenuObject.blockAdderState.getPrevSelecState();
    const curr_selec = eState.getSelection();
    const empty_selec = SelectionState.createEmpty(
      eState.getCurrentContent().getBlockForKey(curr_selec.getFocusKey()).key
    );
    const temp_selec = empty_selec.merge({
      anchorOffset: prev_selec.getAnchorOffset(),
      focusOffset: curr_selec.getAnchorOffset(),
      anchorKey: prev_selec.getAnchorKey(),
      focusKey: prev_selec.getAnchorKey(),
    });
    const selecText = getSelectionText(
      EditorState.acceptSelection(editorState, temp_selec)
    );

    const block = getSelectedBlock(eState);
    if (selecText.length === block.getLength() && selecText === block.text) {
      let wholeRange = SelectionState.createEmpty(block.getKey());
      wholeRange = wholeRange.merge({
        anchorOffset: 0,
        focusOffset: block.getLength() + 1,
        anchorKey: block.key,
        focusKey: block.key,
      });
      let newEs = toggleProperBlock(
        type,
        EditorState.push(
          eState,
          Modifier.removeRange(
            eState.getCurrentContent(),
            wholeRange,
            "backward"
          ),
          "remove-text"
        )
      );
      var newSelec = SelectionState.createEmpty(block.getKey());
      newSelec = newSelec.set("anchorOffset", 0);
      newSelec = newSelec.set("focusKey", block.getKey());
      newSelec = newSelec.set("focusOffset", 0);
      newEs = EditorState.forceSelection(newEs, newSelec);
      // newEs = toggleBlockWithType(eState, "atomic");
      editorStateChange(newEs);
    } else {
      let empty_selec = SelectionState.createEmpty(
        eState.getCurrentContent().getBlockForKey(curr_selec.getFocusKey()).key
      );
      empty_selec = empty_selec.merge({
        anchorOffset: prev_selec.getAnchorOffset(),
        focusOffset: curr_selec.getFocusOffset(),
      });
      let newEs = EditorState.push(
        eState,
        Modifier.removeRange(
          editorState.getCurrentContent(),
          empty_selec,
          "forward"
        ),
        "remove-text"
      );

      editorStateChange(insertProperBlock(type, newEs));
    }

    editorAdderMenuObject.setVisi(false);
  } else if (afterWholeBlockSelected(editorState)) {
    let eState = editorState;
    let curr_selec = eState.getSelection();
    let newEs = EditorState.push(
      eState,
      Modifier.removeRange(
        editorState.getCurrentContent(),
        curr_selec,
        "backward"
      ),
      "remove-text"
    );
    newEs = insertNewBlock(newEs);
    editorStateChange(newEs);
    return "handled";
  } else {
    const currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const textWithEntity = Modifier.splitBlock(currentContent, selection);
    var nState = EditorState.push(editorState, textWithEntity, "split-block");
    if (!isContinousBlock && !isAtStart) {
      nState = RichUtils.toggleBlockType(nState, "unstyled");
    }
    if (isAtStart && editorState.getSelection().isCollapsed()) {
      const currSelc = nState.getSelection();
      const befselc = nState.getCurrentContent().getSelectionBefore();
      nState = EditorState.forceSelection(nState, befselc);
      nState = RichUtils.toggleBlockType(nState, "unstyled");
      nState = EditorState.forceSelection(nState, currSelc);
    }
    editorStateChange(nState);
  }

  return "handled";
}

const backspaceHandler = (eState, editorStateChange) => {
  const edtrState = eState;
  const currSelec = edtrState.getSelection();
  if (currSelec.isCollapsed() && currSelec.getFocusOffset() === 0) {
    const contState = edtrState.getCurrentContent();
    const blockKey = currSelec.getFocusKey();
    const block = contState.getBlockForKey(blockKey);
    if (HeaderBlocks.includes(block.getType())) {
      let newEs = EditorState.push(
        eState,
        Modifier.setBlockType(contState, currSelec, "unstyled"),
        "change-block-type"
      );
      const currSelc = newEs.getSelection();
      const befselc = newEs.getCurrentContent().getSelectionBefore();
      newEs = EditorState.forceSelection(newEs, befselc);
      newEs = RichUtils.toggleBlockType(newEs, "unstyled");
      newEs = EditorState.forceSelection(newEs, currSelc);
      editorStateChange(newEs);
      return "handled";
    }
    try {
      const prvBlock = contState.getBlockBefore(blockKey);
      const ent = contState.getEntity(prvBlock.getEntityAt(0));
      if (ent) {
        const newState = skipEntityBackspace(
          edtrState,
          contState,
          block,
          blockKey,
          prvBlock
        );
        editorStateChange(newState);
        return "handled";
      }
    } catch (e) {
      //  console.log(e);
    }
  }
  return "not-handled";
};

export function KeyCommandHandler(
  command,
  eState,
  editorStateChange,
  editorAdderMenuObject
) {
  // console.log(command);
  switch (command) {
    case "arrowUp": {
      // let ind = editorAdderMenuObject.adderMenuMouseInd
      //   ? editorAdderMenuObject.adderMenuMouseInd
      //   : editorAdderMenuObject.adderInd;
      // editorAdderMenuObject.setAdderMenuMouseInd(null);
      // editorAdderMenuObject.setAdderMenuInd(
      //   ind - 1 >= 0
      //     ? (ind - 1) % MenuButtonInd.length
      //     : MenuButtonInd.length - 1
      // );
      let ind = editorAdderMenuObject.blockAdderState.getMouseInd()
        ? editorAdderMenuObject.blockAdderState.getMouseInd()
        : editorAdderMenuObject.blockAdderState.getArrowInd();
      editorAdderMenuObject.blockAdderStateChange(
        editorAdderMenuObject.blockAdderState.setMouseInd(null)
      );
      editorAdderMenuObject.blockAdderStateChange(
        editorAdderMenuObject.blockAdderState.setArrowInd(
          ind - 1 >= 0
            ? (ind - 1) % MenuButtonInd.length
            : MenuButtonInd.length - 1
        )
      );

      break;
    }
    case "arrowDown": {
      // let ind = editorAdderMenuObject.adderMenuMouseInd
      //   ? editorAdderMenuObject.adderMenuMouseInd
      //   : editorAdderMenuObject.adderInd;
      // editorAdderMenuObject.setAdderMenuMouseInd(null);
      // editorAdderMenuObject.setAdderMenuInd((ind + 1) % MenuButtonInd.length);
      let ind = editorAdderMenuObject.blockAdderState.getMouseInd()
        ? editorAdderMenuObject.blockAdderState.getMouseInd()
        : editorAdderMenuObject.blockAdderState.getArrowInd();
      editorAdderMenuObject.blockAdderStateChange(
        editorAdderMenuObject.blockAdderState.setMouseInd(null)
      );
      editorAdderMenuObject.blockAdderStateChange(
        editorAdderMenuObject.blockAdderState.setArrowInd(
          ind + 1 <= MenuButtonInd.length
            ? (ind + 1) % MenuButtonInd.length
            : MenuButtonInd.length - 1
        )
      );
      break;
    }
    case "backspace": {
      return backspaceHandler(eState, editorStateChange);
      break;
    }
    default: {
      return "not-handled";
    }
  }
}

export function KeyBinderHandle(e, editorAdderMenuObject) {
  // console.log(e.keyCode);
  console.log();
  switch (e.keyCode) {
    case 191: {
      if (!e.shiftKey) {
        editorAdderMenuObject.toggleAdderMenu();
      }
      return;
    }
    case 17: {
      return;
    }
    case 27: {
      editorAdderMenuObject.closeAllMenus();
      return;
    }
    case 38: {
      if (editorAdderMenuObject.blockAdderState.getMenuVisi()) {
        return "arrowUp";
      }
      return;
    }
    case 40: {
      if (editorAdderMenuObject.blockAdderState.getMenuVisi()) {
        return "arrowDown";
      }
      return;
    }

    default: {
      return getDefaultKeyBinding(e);
    }
  }
}
