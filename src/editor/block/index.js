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
import {
  Header1BlockRender,
  Header2BlockRender,
  BlockOLRender,
  BlockUOLRender,
  BlockCodeRender,
  BlockBlockRender,
  UnstyledBlockRender,
  AtomicBlockRender,
} from "./blocks";

export function BlockRenderer(
  contentBlock,
  editorState,
  editorStateChage,
  toggelAdderMenu,
  LockState
) {
  const ty = contentBlock.getType();
  switch (ty) {
    case "header-one": {
      return {
        component: Header1BlockRender,
        editable: true,
        children: contentBlock.getText(),
        props: {
          children: contentBlock.getText(),
          editorState: editorState,
          editorStateChage: editorStateChage,
          lockState: LockState,
        },
      };
    }
    case "header-two": {
      return {
        component: Header2BlockRender,
        editable: true,
        children: contentBlock.getText(),
        props: {
          children: contentBlock.getText(),
          editorState: editorState,
          editorStateChage: editorStateChage,

          lockState: LockState,
        },
      };
    }
    case "ordered-list-item": {
      return {
        component: BlockOLRender,
        editable: true,
        children: contentBlock.getText(),
        props: {
          children: contentBlock.getText(),
          editorState: editorState,
          editorStateChage: editorStateChage,

          lockState: LockState,
        },
      };
    }
    case "unordered-list-item": {
      return {
        component: BlockUOLRender,
        editable: true,
        children: contentBlock.getText(),
        props: {
          children: contentBlock.getText(),
          editorState: editorState,
          editorStateChage: editorStateChage,
          lockState: LockState,
        },
      };
    }
    case "blockquote":
      return {
        component: BlockBlockRender,
        editable: true,
        props: {
          children: contentBlock.getText(),
          editorState: editorState,
          editorStateChage: editorStateChage,
          lockState: LockState,
        },
      };
    case "unstyled":
      // console.log(contentBlock);
      return {
        component: UnstyledBlockRender,
        editable: true,
        props: {
          children: contentBlock.getText(),
          editorState: editorState,
          editorStateChage: editorStateChage,
          lockState: LockState,
        },
      };
    case "code":
      return {
        component: BlockCodeRender,
        editable: true,
        props: {
          children: contentBlock.getText(),
          editorState: editorState,
          editorStateChage: editorStateChage,
          lockState: LockState,
        },
      };
    case "atomic": {
      return {
        component: AtomicBlockRender,
        editable: false,
        props: {
          children: "",
          editorState: editorState,
          editorStateChage: editorStateChage,

          lockState: LockState,
        },
      };
    }
    default: {
    }
  }
}

export const blockRenderMap = Immutable.Map({
  "header-one": { element: "div" },
  "header-two": { element: "div" },
  blockquote: { element: "div" },
  unstyled: { element: "div" },
  "unordered-list-item": { element: "div" },
  "ordered-list-item": { element: "div" },
  atomic: { element: "div" },
  "***": { element: "div" },
});

export const extendedBlockRenderMap =
  DefaultDraftBlockRenderMap.merge(blockRenderMap);
