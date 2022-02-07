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

export const insertBlockWithType = (editorState, type) => {
  const newBlock = new ContentBlock({
    key: genKey(),
    type: type,
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
        type: type,
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

export const toggleBlockWithType = (editorState, type) => {
  const newEs = RichUtils.toggleBlockType(editorState, type);
  return newEs;
};

export const toggleProperBlock = (type, editorState) => {
  switch (type) {
    case "paragrapgh": {
      return toggleBlockWithType(editorState, "unstyled");
      break;
    }
    case "header-one": {
      return toggleBlockWithType(editorState, "header-one");
      break;
    }
    case "header-two": {
      return toggleBlockWithType(editorState, "header-two");
      break;
    }
    case "quote": {
      return toggleBlockWithType(editorState, "blockquote");
      break;
    }
    case "image": {
      return editorState;
      break;
    }
    case "bullet-list": {
      return toggleBlockWithType(editorState, "unordered-list-item");
      break;
    }
    case "divider": {
      return insertDivider(editorState);
      break;
    }
    default: {
      return editorState;
    }
  }
};

export const insertProperBlock = (type, editorState) => {
  switch (type) {
    case "paragrapgh": {
      return insertBlockWithType(editorState, "unstyled");
      break;
    }
    case "header-one": {
      return insertBlockWithType(editorState, "header-one");
      break;
    }
    case "header-two": {
      return insertBlockWithType(editorState, "header-two");
      break;
    }
    case "quote": {
      return insertBlockWithType(editorState, "blockquote");
      break;
    }
    case "image": {
      return editorState;
      break;
    }
    case "bullet-list": {
      return insertBlockWithType(editorState, "unordered-list-item");
      break;
    }
    case "divider": {
      return insertDivider(editorState);
      break;
    }
    default: {
      return editorState;
    }
  }
};
