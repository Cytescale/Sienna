import react, { useState, useEffect } from "react";
import template_page_code from "./templatePage";
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
import ElementAdderMenu from "./elementMenu";
import TextEditorMenu from "./textEditorMenu";
import { BlockRenderer, extendedBlockRenderMap } from "./block";
import { insertDivider } from "./commands";
var GLOBAL_MOUSE_X = 0;
var GLOBAL_MOUSE_Y = 0;

const toContinueBlocks = ["ordered-list-item", "unordered-list-item"];

const HeaderBlocks = [
    "header-one",
    "header-two",
    "blockquote",
    "unordered-list-item",
    "ordered-list-item",
];

export default class SiennaEditor extends react.Component {
    ADDER_MENU_SPAWN_X = 0;
    ADDER_MENU_SPAWN_Y = 0;
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
            textEditorVisi: false,
        };
        this.setDomEditorRef = (ref) => (this.domEditor = ref);
        this.editorStateChage = this.editorStateChage.bind(this);
        this.setTextEditorVisi = this.setTextEditorVisi.bind(this);
        this.setElementAdderVisi = this.setElementAdderVisi.bind(this);
        this.toggelAdderMenu = this.toggelAdderMenu.bind(this);
        this.blurHandle = this.blurHandle.bind(this);
        this.focusHandle = this.focusHandle.bind(this);
        this.handleReturnEvent = this.handleReturnEvent.bind(this);
    }
    async setElementAdderVisi(visi) {
        this.setState({ elementAdderVisi: visi });
    }
    setTextEditorVisi(visi) {
        this.setState({ textEditorVisi: visi });
    }

    mouseMovementHandler(e) {
        GLOBAL_MOUSE_X = e.clientX;
        GLOBAL_MOUSE_Y = e.clientY;
    }

    focusHandle(e) {
        this.setElementAdderVisi(false);
    }

    blurHandle(e) {}

    getSelectedBlockElement = () => {
        var selection = window.getSelection();
        if (selection.rangeCount == 0) return null;
        var node = selection.getRangeAt(0).startContainer;
        do {
            if (node.getAttribute && node.getAttribute("data-block") == "true")
                return node;
            node = node.parentNode;
        } while (node != null);
        return null;
    };

    toggelAdderMenu() {
        if (!this.state.textEditorVisi) {
            const selcBlock = this.getSelectedBlockElement();
            var node = null;
            var domRect = null;
            if (selcBlock) {
                var treeWalker = document.createTreeWalker(
                    selcBlock,
                    NodeFilter.SHOW_ELEMENT,
                    {
                        acceptNode: function (node) {
                            return NodeFilter.FILTER_ACCEPT;
                        },
                    },
                    false
                );
                node = treeWalker.nextNode();
                if (node) {
                    while (node) {
                        node = treeWalker.nextNode();
                        if (node == null || !node.className) {
                            break;
                        }
                        if (node.className.includes) {
                            if (
                                node.className.includes(
                                    "sienna-editor-block-wrapper"
                                )
                            ) {
                                break;
                            }
                        }
                    }
                    domRect = node.getBoundingClientRect();
                }
            }
            if (!domRect) return;
            this.ADDER_MENU_SPAWN_X = domRect ? domRect.x : GLOBAL_MOUSE_X;
            this.ADDER_MENU_SPAWN_Y = domRect ? domRect.y : GLOBAL_MOUSE_Y;
            this.setElementAdderVisi(true).then(() => {
                this.domEditor.focus();
            });
        } else {
            this.setElementAdderVisi(false).then(() => {
                this.domEditor.focus();
            });
        }
    }

    KeyBinder = (e) => {
        if (e.keyCode === 8) {
        }
        if (e.keyCode === 27) {
            if (this.state.textEditorVisi) {
                this.setElementAdderVisi(false).then(() => {
                    this.domEditor.focus();
                });
            }
        }
        return getDefaultKeyBinding(e);
    };
    getUpperInsertableBlock = (conState, blockKey) => {
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

    skipEntityBackspace = (nwState, contState, block, blockKey, prvBlock) => {
        var newState = nwState;
        var nsCntSt = newState.getCurrentContent();
        const insrtBlock = this.getUpperInsertableBlock(contState, blockKey);
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

    handleKeyCommand = (command) => {
        if (command === "backspace") {
            const edtrState = this.state.editorState;
            const currSelec = edtrState.getSelection();
            if (currSelec.isCollapsed() && currSelec.getFocusOffset() === 0) {
                const contState = edtrState.getCurrentContent();
                const blockKey = currSelec.getFocusKey();
                const block = contState.getBlockForKey(blockKey);
                if (HeaderBlocks.includes(block.getType())) {
                    this.editorStateChage(
                        RichUtils.toggleBlockType(edtrState, "unstyled")
                    );
                    return "handled";
                }
                try {
                    const prvBlock = contState.getBlockBefore(blockKey);
                    const ent = contState.getEntity(prvBlock.getEntityAt(0));
                    if (ent) {
                        const newState = this.skipEntityBackspace(
                            edtrState,
                            contState,
                            block,
                            blockKey,
                            prvBlock
                        );
                        this.editorStateChage(newState);
                        return "handled";
                    }
                } catch (e) {}
            }
        }
        return "not-handled";
    };

    handleReturnEvent(e) {
        const editorState = this.state.editorState;
        const currBlockType = RichUtils.getCurrentBlockType(
            this.state.editorState
        );
        const isContinousBlock = toContinueBlocks.indexOf(currBlockType) > -1;
        const isAtStart =
            this.state.editorState.getSelection().getFocusOffset() === 0;
        if (e.shiftKey) {
            const newEditorState = RichUtils.insertSoftNewline(
                this.state.editorState
            );
            if (newEditorState !== this.state.editorState) {
                this.editorStateChage(newEditorState);
            }
        } else {
            const currentContent = editorState.getCurrentContent();
            const selection = editorState.getSelection();
            const textWithEntity = Modifier.splitBlock(
                currentContent,
                selection
            );
            var nState = EditorState.push(
                editorState,
                textWithEntity,
                "split-block"
            );
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
            this.editorStateChage(nState);
        }
        return "handled";
    }

    componentDidMount() {
        window.addEventListener("mousemove", this.mouseMovementHandler);
        this.domEditor.focus();
    }
    componentWillUnmount() {
        window.removeEventListener("mousemove", this.mouseMovementHandler);
    }
    async editorStateChage(edtState) {
        this.setState({ editorState: edtState });
    }

    render() {
        return (
            <div className="sienna-editor-main-cont">
                <Editor
                    ref={this.setDomEditorRef}
                    readOnly={false}
                    placeholder="Type anything here"
                    className="sienna-editor-root"
                    editorState={this.state.editorState}
                    handleKeyCommand={this.handleKeyCommand}
                    handleReturn={this.handleReturnEvent}
                    keyBindingFn={this.KeyBinder}
                    onChange={this.editorStateChage}
                    blockRenderMap={extendedBlockRenderMap}
                    blockRendererFn={(contntBlock) => {
                        return BlockRenderer(
                            contntBlock,
                            this.state.editorState,
                            this.editorStateChage,
                            this.toggelAdderMenu
                        );
                    }}
                    onFocus={this.focusHandle}
                    onBlur={this.blurHandle}
                />
                <ElementAdderMenu
                    spawn_x={this.ADDER_MENU_SPAWN_X}
                    spawn_y={this.ADDER_MENU_SPAWN_Y}
                    visi={this.state.elementAdderVisi}
                    triggerExist={this.setElementAdderVisi}
                />
                <TextEditorMenu
                    visi={true}
                    editorStateChage={this.editorStateChage}
                    editorState={this.state.editorState}
                />
            </div>
        );
    }
}
