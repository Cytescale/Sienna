/** @format */

import react, { useState, useEffect } from "react";
import template_page_code from "./templatePage";
import axios from "axios";
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
import ElementAdderMenu from "./menus/elementMenu";
import TextEditorMenu from "./menus/textEditorMenu";
import { BlockRenderer, extendedBlockRenderMap } from "./block";
import { ReturnHandler, KeyCommandHandler, KeyBinderHandle } from "./handlers";
import { getUpperInsertableBlock, skipEntityBackspace } from "./handlers/utils";
import { EditorMode, EditorLockState, EditorMenuState } from "./constants";
import { lockScroll } from "./handlers/utils";

export default class SiennaEditor extends react.Component {
  CURRENT_LOCK_STATE = EditorLockState.LOCKED;
  CURRENT_EDITOR_MENU_STATE = EditorMenuState.NONE;

  constructor(props) {
    super(props);
    const blocksFromHTML = convertFromHTML(template_page_code);
    const state = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    this.state = {
      editorState: EditorState.createWithContent(state),
      elementAdderVisi: false,
      adderMenuInd: 0,
      adderMenuMouseInd: 0,
      CURRENT_EDITOR_MODE: EditorMode.BLURRED,
      textEditorVisi: false,
    };
    this.setDomEditorRef = (ref) => (this.domEditor = ref);
    this.setCurrentLockState = async (State) => {
      // this.setState({ CURRENT_LOCK_STATE: State });
      this.CURRENT_LOCK_STATE = State;
    };
    this.setEditorMode = async (mode) => {
      this.setState({ CURRENT_EDITOR_MODE: mode });
      // this.CURRENT_EDITOR_MODE = mode;
    };
    this.setEditorMenuState = async (state) => {
      // this.setState({ CURRENT_EDITOR_MENU_STATE: state });
      this.CURRENT_EDITOR_MENU_STATE = state;
    };

    this.EditorTextMenuVisiDetermine =
      this.EditorTextMenuVisiDetermine.bind(this);
    this.editorStateChage = this.editorStateChage.bind(this);
    this.setTextEditorVisi = this.setTextEditorVisi.bind(this);
    this.setElementAdderVisi = this.setElementAdderVisi.bind(this);
    this.toggelAdderMenu = this.toggelAdderMenu.bind(this);
    this.EditorblurHandle = this.EditorblurHandle.bind(this);
    this.EditorfocusHandle = this.EditorfocusHandle.bind(this);
    this.rootFocusHandle = this.rootFocusHandle.bind(this);
    this.closeAllMenus = this.closeAllMenus.bind(this);
    this.setAdderMenuInd = this.setAdderMenuInd.bind(this);
    this.setAdderMenuMouseInd = this.setAdderMenuMouseInd.bind(this);
  }
  setAdderMenuInd(int) {
    this.setState({ adderMenuInd: int });
  }
  setAdderMenuMouseInd(int) {
    this.setState({ adderMenuMouseInd: int });
  }
  async setElementAdderVisi(visi) {
    if (visi === true) {
      lockScroll(true);
      await this.setEditorMenuState(EditorMenuState.ADDER_MENU);
    } else {
      lockScroll(false);
      await this.setEditorMenuState(EditorMenuState.NONE);
    }

    this.setState({ elementAdderVisi: visi });
  }
  setTextEditorVisi(visi) {
    if (visi === true) {
      this.setEditorMenuState(EditorMenuState.TEXT_EDITOR_MENU);
    } else {
      this.setEditorMenuState(EditorMenuState.NONE);
    }

    this.setState({ textEditorVisi: visi });
  }

  closeAllMenus() {
    this.setElementAdderVisi(false);
    this.setTextEditorVisi(false);
  }

  async rootFocusHandle(e) {
    if (this.domEditor) {
      this.domEditor.focus();
    }
  }

  async EditorfocusHandle(e) {
    console.log("focus entered");
    await this.setEditorMode(EditorMode.FOCUSED);
  }
  async EditorblurHandle(e) {
    console.log("focus lost	");
    this.closeAllMenus();
    await this.setEditorMode(EditorMode.BLURRED);
  }
  toggelAdderMenu() {
    if (!this.state.elementAdderVisi) {
      this.setElementAdderVisi(true).then(() => {
        //    this.domEditor.focus();
      });
    } else {
      this.setElementAdderVisi(false).then(() => {
        //    this.domEditor.focus();
      });
    }
  }

  componentDidMount() {
    this.domEditor.focus();
    this.setEditorMode(EditorMode.FOCUSED);
    this.setEditorMenuState(EditorMenuState.NONE);
    this.setCurrentLockState(EditorLockState.UNLOCKED);
  }
  componentWillUnmount() {}

  async EditorTextMenuVisiDetermine(edtState) {
    const selc = edtState.getSelection();
    if (selc.getAnchorKey() !== undefined && selc.getFocusKey() !== undefined) {
      if (
        selc.getFocusOffset() !== selc.getAnchorOffset() &&
        !selc.isCollapsed()
      ) {
        if (this.CURRENT_EDITOR_MENU_STATE !== EditorMenuState.NONE) {
          await this.setElementAdderVisi(false);
        }
        if (this.CURRENT_EDITOR_MENU_STATE === EditorMenuState.NONE) {
          this.setTextEditorVisi(true);
        }
      } else {
        this.setTextEditorVisi(false);
      }
    } else {
      this.setTextEditorVisi(false);
    }
  }

  async editorStateChage(edtState) {
    //     this.EditorTextMenuVisiDetermine(edtState);
    this.setState({ editorState: edtState });
  }

  render() {
    let focusObject = {
      current_editor_mode: this.state.CURRENT_EDITOR_MODE,
      set_editor_mode: this.setEditorMode,
    };
    let editorAdderMenuObject = {
      visi: this.state.elementAdderVisi,
      setVisi: this.setElementAdderVisi,
      adderInd: this.state.adderMenuInd,
      adderMenuMouseInd: this.state.adderMenuMouseInd,
      setAdderMenuMouseInd: this.setAdderMenuMouseInd,
      setAdderMenuInd: this.setAdderMenuInd,
      closeAllMenus: this.closeAllMenus,
      toggleAdderMenu: this.toggelAdderMenu,
    };

    return (
      <div className="sienna-editor-main-cont" onFocus={this.rootFocusHandle}>
        <Editor
          ref={this.setDomEditorRef}
          readOnly={
            this.CURRENT_LOCK_STATE === EditorLockState.LOCKED ? true : false
          }
          placeholder="Type anything here"
          className="sienna-editor-root"
          editorState={this.state.editorState}
          handleKeyCommand={(c) => {
            return KeyCommandHandler(
              c,
              this.state.editorState,
              this.editorStateChage,
              editorAdderMenuObject
            );
          }}
          handleReturn={(e, es) => {
            return ReturnHandler(
              e,
              es,
              this.editorStateChage,
              editorAdderMenuObject
            );
          }}
          keyBindingFn={(e) => {
            return KeyBinderHandle(e, editorAdderMenuObject, focusObject);
          }}
          onChange={this.editorStateChage}
          blockRenderMap={extendedBlockRenderMap}
          blockRendererFn={(contntBlock) => {
            return BlockRenderer(
              contntBlock,
              this.state.editorState,
              this.editorStateChage,
              this.toggelAdderMenu,
              this.CURRENT_LOCK_STATE
            );
          }}
          onFocus={this.EditorfocusHandle}
          onBlur={this.EditorblurHandle}
        />
        <ElementAdderMenu
          visi={this.state.elementAdderVisi}
          triggerExist={this.setElementAdderVisi}
          editor_ref={this.domEditor}
          focusObject={this.focusObject}
          editorAdderMenuObject={editorAdderMenuObject}
        />
        <TextEditorMenu
          visi={this.state.textEditorVisi}
          ind={this.state.adderMenuInd}
          domEditor={this.domEditor}
          editorStateChage={this.editorStateChage}
          editorState={this.state.editorState}
        />
      </div>
    );
  }
}
