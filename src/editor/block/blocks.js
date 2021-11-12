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
import { insertNewBlock } from "../commands";

function getPlaceholderData(blocktype) {
	switch (blocktype) {
		case "header-one": {
			return ["forcePlaceholderH1", "Heading 1"];
		}
		case "header-two": {
			return ["forcePlaceholderH2", "Header 2"];
		}
		case "unstyled": {
			return ["forcePlaceholderUS", "Type / to add open menu"];
		}
		case "blockquote": {
			return ["forcePlaceholderBQ", "Type any quote"];
		}
		case "unordered-list-item": {
			return ["forcePlaceholderUOL", "Unordered list item"];
		}
		case "ordered-list-item": {
			return ["forcePlaceholderOL", "Ordered list item"];
		}
		default: {
			return ["", ""];
		}
	}
}

function BlockWrapper(props) {
	const [entry_anim, setentry_anim] = useState(false);
	const [exit_anim, setexit_anim] = useState(false);
	const [visi, setVisi] = useState(false);
	const [currVisi, setcurrVisi] = useState(false);
	if (visi && !entry_anim) {
		setentry_anim(true);
		setcurrVisi(true);
	} else if (!visi && !exit_anim && currVisi) {
		setentry_anim(false);
		setexit_anim(true);
	}
	return (
		<div
			className={`sienna-editor-master-wrapper`}
			onMouseEnter={() => {
				setentry_anim(false);
				setexit_anim(false);
				setVisi(true);
			}}
			onMouseLeave={() => {
				setentry_anim(false);
				setexit_anim(false);
				setVisi(false);
			}}
		>
			<div
				className={`sienna-editor-block-wrapper  
                ${
					props.blockProps.children.length <= 0 && visi
						? getPlaceholderData(props.block.type)[0]
						: null
				} 
           `}
				placeholder={getPlaceholderData(props.block.type)[1]}
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}
			>
				<div
					className={`sienna-editor-block-wrapper-butt-cont 
                        ${entry_anim ? "sienna-editor-block-wrapper-butt-cont_enter" : null} 
                        ${exit_anim ? "sienna-editor-block-wrapper-butt-cont_exist" : null}
             `}
					onAnimationEnd={() => {
						if (exit_anim) {
							setcurrVisi(false);
							setexit_anim(false);
						}
						if (entry_anim) {
							setcurrVisi(true);
							setentry_anim(false);
						}
					}}
					style={{
						display: currVisi ? "flex" : "none",
						alignItems: currVisi ? "center" : "none",
					}}
				>
					<button
						className={`sienna-editor-block-wrapper-butt`}
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							const chngeSelec = SelectionState.createEmpty(props.block.getKey());
							props.blockProps
								.editorStateChage(
									insertNewBlock(
										EditorState.forceSelection(
											props.blockProps.editorState,
											chngeSelec
										)
									)
								)
								.then(() => {
									props.blockProps.toggelAdderMenu();
								});
						}}
					>
						<svg
							className="sienna-editor-block-wrapper-butt-ico"
							height="24px"
							viewBox="0 0 24 24"
							width="24px"
							fill="currentColor"
						>
							<path d="M0 0h24v24H0V0z" fill="none" />
							<path d="M18 13h-5v5c0 .55-.45 1-1 1s-1-.45-1-1v-5H6c-.55 0-1-.45-1-1s.45-1 1-1h5V6c0-.55.45-1 1-1s1 .45 1 1v5h5c.55 0 1 .45 1 1s-.45 1-1 1z" />
						</svg>
					</button>
				</div>
				{props.children}
			</div>
		</div>
	);
}

function Header1BlockRender(props) {
	return (
		<BlockWrapper {...props}>
			<div className="sienna-editor-header-1-block">
				<EditorBlock {...props} />
			</div>
		</BlockWrapper>
	);
}
function Header2BlockRender(props) {
	return (
		<BlockWrapper {...props}>
			<div className="sienna-editor-header-2-block">
				<EditorBlock {...props} />
			</div>
		</BlockWrapper>
	);
}

function UnstyledBlockRender(props) {
	return (
		<BlockWrapper {...props}>
			<div className={`sienna-editor-unstyle-block`}>
				<EditorBlock {...props} />
			</div>
		</BlockWrapper>
	);
}
function BlockBlockRender(props) {
	return (
		<BlockWrapper {...props}>
			<div className="sienna-editor-block-block">
				<EditorBlock {...props} />
			</div>
		</BlockWrapper>
	);
}
function BlockCodeRender(props) {
	return (
		<BlockWrapper {...props}>
			<div className="sienna-editor-block-code">
				<EditorBlock {...props} />
			</div>
		</BlockWrapper>
	);
}

function BlockUOLRender(props) {
	return (
		<BlockWrapper {...props}>
			<div className="sienna-editor-UOL-block">
				<div className="sienna-editor-UOL-block-cir" contentEditable={false} readOnly />
				<EditorBlock {...props} />
			</div>
		</BlockWrapper>
	);
}

function BlockOLRender(props) {
	return (
		<BlockWrapper {...props}>
			<div className="sienna-editor-OL-block">
				<div className="sienna-editor-OL-block-count" contentEditable={false} readOnly />
				<EditorBlock {...props} />
			</div>
		</BlockWrapper>
	);
}

function AtomicBlockRender(props) {
	const type = props.contentState.getEntity(props.block.getEntityAt(0)).type;
	const data = props.contentState.getEntity(props.block.getEntityAt(0)).getData();

	const handleDividerClick = (e) => {
		// props.blockProps.editorStateChage(EditorState.forceSelection(props.blockProps.editorState, props.selection))
	};

	switch (type) {
		case "divider": {
			return (
				<BlockWrapper {...props}>
					<div
						className="sienna-editor-divider-block-cont"
						onClick={handleDividerClick}
						contentEditable={false}
					>
						<div className="sienna-editor-divider-block" />
					</div>
				</BlockWrapper>
			);
		}
		default: {
			break;
		}
	}
}

export {
	AtomicBlockRender,
	BlockOLRender,
	BlockUOLRender,
	BlockCodeRender,
	BlockBlockRender,
	Header2BlockRender,
	Header1BlockRender,
	UnstyledBlockRender,
};
