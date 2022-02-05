/** @format */

import {
  RichUtils,
  EditorState,
  Modifier,
  getDefaultKeyBinding,
} from "draft-js";
import { toContinueBlocks, HeaderBlocks } from "../constants";
import { skipEntityBackspace } from "./utils";
import { insertDivider, insertProperBlock } from "../commands";
import { MenuButtonInd } from "../menus/elementMenu";
import { SelectionState } from "draft-js";

export function ReturnHandler(
  e,
  eState,
  editorStateChange,
  editorAdderMenuObject
) {
  const editorState = eState;
  const currBlockType = RichUtils.getCurrentBlockType(editorState);
  const isContinousBlock = toContinueBlocks.indexOf(currBlockType) > -1;
  const isAtStart = editorState.getSelection().getFocusOffset() === 0;

  if (e.shiftKey) {
    const newEditorState = RichUtils.insertSoftNewline(editorState);
    if (newEditorState !== editorState) {
      editorStateChange(newEditorState);
    }
  } else if (editorAdderMenuObject.visi) {
    let ind = editorAdderMenuObject.adderMenuMouseInd
      ? editorAdderMenuObject.adderMenuMouseInd
      : editorAdderMenuObject.adderInd;
    let type = MenuButtonInd[ind].id;

    const prev_selec = editorAdderMenuObject.prevSelecState;
    const curr_selec = eState.getSelection();
    let empty_selec = SelectionState.createEmpty(
      eState.getCurrentContent().getBlockForKey(curr_selec.getFocusKey()).key
    );
    empty_selec = empty_selec.merge({
      anchorOffset: prev_selec.getAnchorOffset(),
      focusOffset: curr_selec.getFocusOffset(),
    });
    //     console.log(empty_selec);
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
    editorAdderMenuObject.setVisi(false);
  } else {
    const currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const textWithEntity = Modifier.splitBlock(currentContent, selection);
    var nState = EditorState.push(editorState, textWithEntity, "split-block");
    if (!isContinousBlock && !isAtStart) {
      nState = RichUtils.toggleBlockType(nState, "unstyled");
    }
    if (isAtStart) {
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
      editorStateChange(RichUtils.toggleBlockType(edtrState, "unstyled"));
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
    } catch (e) {}
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
      let ind = editorAdderMenuObject.adderMenuMouseInd
        ? editorAdderMenuObject.adderMenuMouseInd
        : editorAdderMenuObject.adderInd;
      editorAdderMenuObject.setAdderMenuMouseInd(null);
      editorAdderMenuObject.setAdderMenuInd(
        ind - 1 >= 0
          ? (ind - 1) % MenuButtonInd.length
          : MenuButtonInd.length - 1
      );

      break;
    }
    case "arrowDown": {
      let ind = editorAdderMenuObject.adderMenuMouseInd
        ? editorAdderMenuObject.adderMenuMouseInd
        : editorAdderMenuObject.adderInd;
      editorAdderMenuObject.setAdderMenuMouseInd(null);
      editorAdderMenuObject.setAdderMenuInd((ind + 1) % MenuButtonInd.length);
      break;
    }
    case "backspace": {
      backspaceHandler(eState, editorStateChange);
      break;
    }
    default: {
      return "not-handled";
    }
  }
}

export function KeyBinderHandle(e, editorAdderMenuObject) {
  // console.log(e.keyCode);

  switch (e.keyCode) {
    case 191: {
      editorAdderMenuObject.toggleAdderMenu();
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
      if (editorAdderMenuObject.visi) {
        return "arrowUp";
      }
      return;
    }
    case 40: {
      if (editorAdderMenuObject.visi) {
        return "arrowDown";
      }
      return;
    }

    default: {
      return getDefaultKeyBinding(e);
    }
  }
}
