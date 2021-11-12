/** @format */

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
import ElementAdderMenu from "./menus/elementMenu";
import TextEditorMenu from "./menus/textEditorMenu";
import { BlockRenderer, extendedBlockRenderMap } from "./block";
import { ReturnHandler, KeyCommandHandler, KeyBinderHandle } from "./handlers";
import { getUpperInsertableBlock, skipEntityBackspace } from "./handlers/utils";

export default class SiennaEditor extends react.Component {
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
	}
	async setElementAdderVisi(visi) {
		this.setState({ elementAdderVisi: visi });
	}
	setTextEditorVisi(visi) {
		this.setState({ textEditorVisi: visi });
	}

	focusHandle(e) {
		this.setElementAdderVisi(false);
	}

	blurHandle(e) {}
	toggelAdderMenu() {
		if (!this.state.textEditorVisi) {
			this.setElementAdderVisi(true).then(() => {
				this.domEditor.focus();
			});
		} else {
			this.setElementAdderVisi(false).then(() => {
				this.domEditor.focus();
			});
		}
	}

	componentDidMount() {
		this.domEditor.focus();
	}
	componentWillUnmount() {}
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
					handleKeyCommand={(c) => {
						return KeyCommandHandler(c, this.state.editorState, this.editorStateChage);
					}}
					handleReturn={(e, es) => {
						return ReturnHandler(e, es, this.editorStateChage);
					}}
					keyBindingFn={(e) => {
						return KeyBinderHandle(e);
					}}
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
