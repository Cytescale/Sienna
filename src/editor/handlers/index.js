/** @format */

import { RichUtils, EditorState, Modifier, getDefaultKeyBinding } from "draft-js";
import { toContinueBlocks, HeaderBlocks } from "../constants";
import { skipEntityBackspace } from "./utils";
import { insertDivider } from "../commands";

export function ReturnHandler(e, eState, editorStateChange) {
	const editorState = eState;
	const currBlockType = RichUtils.getCurrentBlockType(editorState);
	const isContinousBlock = toContinueBlocks.indexOf(currBlockType) > -1;
	const isAtStart = editorState.getSelection().getFocusOffset() === 0;
	if (e.shiftKey) {
		// const newEditorState = RichUtils.insertSoftNewline(editorState);
		// if (newEditorState !== editorState) {
		// 	editorStateChange(newEditorState);
		// }
		editorStateChange(insertDivider(editorState));
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

export function KeyCommandHandler(command, eState, setAdderMenu, editorStateChange) {
	switch (command) {
		case "backspace": {
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
			// " / "Trigger Button keycode
			editorAdderMenuObject.setVisi(true);
			return;
		}
		case 17: {
			return;
		}
		case 27: {
			editorAdderMenuObject.setVisi(!editorAdderMenuObject.visi);
			return;
		}
		default: {
			return getDefaultKeyBinding(e);
		}
	}
}
