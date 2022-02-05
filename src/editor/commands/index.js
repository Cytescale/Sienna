/** @format */

import react, { useState, useEffect } from "react";
import {
  Editor,
  EditorState,
  EditorBlock,
  RichUtils,
  convertFromHTML,
  ContentState,
  Draft,
  DefaultDraftBlockRenderMap,
  convertToRaw,
  getDefaultKeyBinding,
  KeyBindingUtil,
  EditorChangeType,
  Modifier,
  AtomicBlockUtils,
  removeTextWithStrategy,
  ContentBlock,
  genKey,
  SelectionState,
} from "draft-js";
import Immutable, { List } from "immutable";
import { MenuButtonInd } from "../menus/elementMenu";

export const insertNewBlock = (editorState) => {
  const newBlock = new ContentBlock({
    key: genKey(),
    type: "unstyled",
    text: "",
    characterList: List(),
  });
  var contentState = editorState.getCurrentContent();
  const currSelec = editorState.getSelection();
  const currentBlock = contentState.getBlockForKey(currSelec.getEndKey());
  const blockMap = contentState.getBlockMap();
  const blocksBefore = blockMap.toSeq().takeUntil(function (v) {
    return v === currentBlock;
  });
  const blocksAfter = blockMap
    .toSeq()
    .skipUntil(function (v) {
      return v === currentBlock;
    })
    .rest();
  let newBlocks = [
    [currentBlock.getKey(), currentBlock],
    [
      newBlock.getKey(),
      new ContentBlock({
        key: newBlock.getKey(),
        type: "unstyled",
        text: "",
        characterList: List(),
        data: {
          initialAdderMenuToggle: true,
        },
      }),
    ],
  ];
  const newBlockMap = blocksBefore
    .concat(newBlocks, blocksAfter)
    .toOrderedMap();
  var newSelec = SelectionState.createEmpty(newBlock.getKey());
  newSelec = newSelec.set("anchorOffset", 0);
  newSelec = newSelec.set("focusKey", newBlock.getKey());
  newSelec = newSelec.set("focusOffset", 0);
  const newContentState = contentState.merge({ blockMap: newBlockMap });
  var newEditorState = EditorState.push(
    editorState,
    newContentState,
    "insert-fragment"
  );
  newEditorState = EditorState.forceSelection(newEditorState, newSelec);
  return newEditorState;
};

export const insertDivider = (editorState) => {
  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity(
    "divider",
    "IMMUTABLE",
    {}
  );
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const newEditorState = EditorState.set(editorState, {
    currentContent: contentStateWithEntity,
  });
  return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ");
};

export const insertProperBlock = (type, editorState) => {
  switch (type) {
    case "divider": {
      return insertDivider(editorState);
      break;
    }
    default: {
    }
  }
};
