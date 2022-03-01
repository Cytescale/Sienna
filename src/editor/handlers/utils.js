/** @format */

import { SelectionState, Modifier, EditorState } from "draft-js";
import { getSelectedBlocksMap } from "draftjs-utils";
export const lockScroll = (bool) => {
  if (bool) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
};

export const getUpperInsertableBlock = (conState, blockKey) => {
  var blockBefore = conState.getBlockBefore(blockKey);
  while (blockBefore) {
    if (blockBefore) {
      try {
        const ent = conState.getEntity(blockBefore.getEntityAt(0));
        if (!ent) {
          break;
        }
      } catch (e) {
        break;
      }
      blockBefore = conState.getBlockBefore(blockBefore.getKey());
    } else {
      break;
    }
  }
  return blockBefore;
};

export const skipEntityBackspace = (
  nwState,
  contState,
  block,
  blockKey,
  prvBlock
) => {
  var newState = nwState;
  var nsCntSt = newState.getCurrentContent();
  const insrtBlock = getUpperInsertableBlock(contState, blockKey);
  var newSelec = SelectionState.createEmpty(insrtBlock.key);
  newSelec = newSelec.set("focusOffset", insrtBlock.getLength());
  newSelec = newSelec.set("anchorOffset", insrtBlock.getLength());
  nsCntSt = Modifier.insertText(
    newState.getCurrentContent(),
    newSelec,
    block.getText()
  );
  newState = EditorState.push(newState, nsCntSt, "insert-text");
  var toDeleteSelec = SelectionState.createEmpty(blockKey);
  toDeleteSelec = toDeleteSelec.set("focusOffset", block.getLength());
  toDeleteSelec = toDeleteSelec.set("anchorKey", prvBlock.getKey());
  toDeleteSelec = toDeleteSelec.set("anchorOffset", prvBlock.getLength());
  nsCntSt = Modifier.removeRange(
    newState.getCurrentContent(),
    toDeleteSelec,
    "forward"
  );
  newState = EditorState.push(newState, nsCntSt, "remove-range");
  newState = EditorState.forceSelection(newState, newSelec);
  return newState;
};

export const removeBlockTypes = (editorState) => {
  const contentState = editorState.getCurrentContent();
  const blocksMap = getSelectedBlocksMap(editorState);
  const contentWithoutBlocks = blocksMap.reduce((newContentState, block) => {
    const blockType = block.getType();
    if (blockType === "unstyled") {
      const selectionState = SelectionState.createEmpty(block.getKey());
      const updatedSelection = selectionState.merge({
        focusOffset: 0,
        anchorOffset: block.getText().length,
      });

      return Modifier.setBlockType(
        newContentState,
        updatedSelection,
        "unstyled"
      );
    }

    return newContentState;
  }, contentState);

  const newEditorState = EditorState.push(
    editorState,
    contentWithoutBlocks,
    "change-block-type"
  );

  return newEditorState;
};

export const wholeBlockSelected = (editorState) => {
  let edtState = editorState;
  const selecState = edtState.getSelection();
  const block = edtState
    .getCurrentContent()
    .getBlockAfter(selecState.getAnchorKey());
  if (block) {
    if (
      selecState.getFocusKey() === block.key &&
      selecState.getFocusOffset() === 0 &&
      selecState.getAnchorOffset() === 0
    ) {
      return true;
    }
  }
  return false;
};

export const afterWholeBlockSelected = (editorState) => {
  let edtState = editorState;
  const selecState = edtState.getSelection();
  const curr_block = edtState
    .getCurrentContent()
    .getBlockForKey(selecState.getAnchorKey());
  if (
    selecState.getFocusKey() === selecState.getAnchorKey() &&
    selecState.getFocusOffset() === curr_block.getLength() &&
    selecState.getAnchorOffset() === 0
  ) {
    return true;
  }
  return false;
};

export const selectionCorrection = (editorState) => {
  let edtState = editorState;
  const selecState = edtState.getSelection();
  const curr_block = edtState
    .getCurrentContent()
    .getBlockForKey(selecState.getAnchorKey());
  if (wholeBlockSelected(edtState)) {
    let newSelecState = selecState;
    newSelecState = newSelecState.merge({
      focusKey: selecState.getAnchorKey(),
      focusOffset: curr_block.getLength(),
    });
    let nState = EditorState.forceSelection(edtState, newSelecState);
    return nState;
  }
  return edtState;
};
