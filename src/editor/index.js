/** @format */

import react from "react";
import template_page_code from "./templatePage";
import { Editor, EditorState, convertFromHTML, ContentState } from "draft-js";
import ElementAdderMenu from "./menus/elementMenu";
import TextEditorMenu from "./menus/textEditorMenu";
import { BlockRenderer, extendedBlockRenderMap } from "./block";
import { ReturnHandler, KeyCommandHandler, KeyBinderHandle } from "./handlers";
import { selectionCorrection } from "./handlers/utils";
import { EditorMode, EditorLockState, EditorMenuState } from "./constants";
import { lockScroll } from "./handlers/utils";
import BlockAdderState from "./component/blockAdderMenu";

export default class SiennaEditor extends react.Component {
  CURRENT_LOCK_STATE = EditorLockState.LOCKED;

  constructor(props) {
    super(props);
    const blocksFromHTML = convertFromHTML(template_page_code);

    const state = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );

    this.state = {
      editorState: EditorState.createWithContent(state),
      BlockAdderState: new BlockAdderState(),
      CURRENT_EDITOR_MODE: EditorMode.BLURRED,
      textEditorVisi: false,
    };
    this.setDomEditorRef = (ref) => (this.domEditor = ref);
    this.setCurrentLockState = async (State) => {
      this.CURRENT_LOCK_STATE = State;
    };
    this.setEditorMode = async (mode) => {
      this.setState({ CURRENT_EDITOR_MODE: mode });
    };

    this.editorStateChage = this.editorStateChage.bind(this);
    this.setTextEditorVisi = this.setTextEditorVisi.bind(this);
    this.setElementAdderVisi = this.setElementAdderVisi.bind(this);
    this.toggelAdderMenu = this.toggelAdderMenu.bind(this);
    this.EditorblurHandle = this.EditorblurHandle.bind(this);
    this.EditorfocusHandle = this.EditorfocusHandle.bind(this);
    this.rootFocusHandle = this.rootFocusHandle.bind(this);
    this.closeAllMenus = this.closeAllMenus.bind(this);
    this.BlockAdderStateChange = this.BlockAdderStateChange.bind(this);
    this.setBlockAdderState = this.setBlockAdderState.bind(this);
    this.EditorTextMenuVisiDetermine =
      this.EditorTextMenuVisiDetermine.bind(this);
  }

  setBlockAdderState(blockadderstate) {
    this.setState({ BlockAdderState: blockadderstate });
  }

  async setElementAdderVisi(visi) {
    lockScroll(visi ? true : false);
    let prevBlockAdderState = this.state.BlockAdderState.getState();
    prevBlockAdderState.setPrevSelecState(
      this.state.editorState.getSelection()
    );
    prevBlockAdderState.setMenuVisi(visi);
    this.setBlockAdderState(prevBlockAdderState);
  }

  toggelAdderMenu() {
    let prevBlockAdderState = this.state.BlockAdderState.getState();
    prevBlockAdderState.setPrevSelecState(
      this.state.editorState.getSelection()
    );
    prevBlockAdderState.setMenuVisi(!prevBlockAdderState.getMenuVisi());
    this.setBlockAdderState(prevBlockAdderState);
  }

  setTextEditorVisi(visi) {
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
    await this.setEditorMode(EditorMode.FOCUSED);
  }
  async EditorblurHandle(e) {
    this.closeAllMenus();
    await this.setEditorMode(EditorMode.BLURRED);
  }

  componentDidMount() {
    this.domEditor.focus();
    this.setEditorMode(EditorMode.FOCUSED);
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

  BlockAdderStateChange(blockadderstate) {
    this.setState({ BlockAdderState: blockadderstate });
  }

  editorStateChage(edtState) {
    edtState = selectionCorrection(edtState);
    this.EditorTextMenuVisiDetermine(edtState);
    this.setState({ editorState: edtState });
  }

  render() {
    let focusObject = {
      current_editor_mode: this.state.CURRENT_EDITOR_MODE,
      set_editor_mode: this.setEditorMode,
    };

    let editorAdderMenuObject = {
      blockAdderState: this.state.BlockAdderState,
      blockAdderStateChange: this.BlockAdderStateChange,
      setVisi: this.setElementAdderVisi,
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
          editorState={this.state.editorState}
          editorStateChange={this.editorStateChage}
          editorAdderMenuObject={editorAdderMenuObject}
        />
        {/* <TextEditorMenu
          visi={this.state.textEditorVisi}
          ind={this.state.adderMenuInd}
          domEditor={this.domEditor}
          editorStateChage={this.editorStateChage}
          editorState={this.state.editorState}
        /> */}
      </div>
    );
  }
}
