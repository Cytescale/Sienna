import react from "react";
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
} from "draft-js";
import TextEditorMenu from "./textEditorMenu";
import Immutable from "immutable";

function BlockWrapper(props) {
  const [visi, setVisi] = react.useState(null);
  return (
    <div
      className={`sienna-editor-master-wrapper`}
      onMouseEnter={() => {
        setVisi(true);
      }}
      onMouseLeave={() => {
        setVisi(false);
      }}
    >
      <div
        className={`sienna-editor-block-wrapper  ${
          visi ? "sienna-editor-master-wrapper-hover" : ""
        }`}
      >
        {/* <div
          className={`sienna-editor-block-wrapper-butt-cont  ${
            visi
              ? "sienna-editor-block-wrapper-butt-visi"
              : "sienna-editor-block-wrapper-butt-hidden"
          }`}
        >
          <button className={`sienna-editor-block-wrapper-butt`}>
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
        </div> */}
        {props.children}
      </div>
    </div>
  );
}

function Header1BlockRender(props) {
  return (
    <BlockWrapper>
      <div className="sienna-editor-header-1-block">
        <EditorBlock {...props} />
      </div>
    </BlockWrapper>
  );
}
function Header2BlockRender(props) {
  return (
    <BlockWrapper>
      <div className="sienna-editor-header-2-block">
        <EditorBlock {...props} />
      </div>
    </BlockWrapper>
  );
}

function UnstyledBlockRender(props) {
  return (
    <BlockWrapper>
      <div className="sienna-editor-unstyle-block">
        <EditorBlock {...props} />
      </div>
    </BlockWrapper>
  );
}
function BlockBlockRender(props) {
  return (
    <BlockWrapper>
      <div className="sienna-editor-block-block">
        <EditorBlock {...props} />
      </div>
    </BlockWrapper>
  );
}
function BlockCodeRender(props) {
  return (
    <BlockWrapper>
      <div className="sienna-editor-block-code">
        <EditorBlock {...props} />
      </div>
    </BlockWrapper>
  );
}

function BlockUOLRender(props) {
  return (
    <BlockWrapper>
      <div className="sienna-editor-UOL-block">
        <div
          className="sienna-editor-UOL-block-cir"
          contentEditable={false}
          readOnly
        />
        <EditorBlock {...props} />
      </div>
    </BlockWrapper>
  );
}

function BlockRenderer(contentBlock) {
  const ty = contentBlock.getType();
  // console.log(ty);
  switch (ty) {
    case "header-one": {
      return {
        component: Header1BlockRender,
        editable: true,
        children: contentBlock.getText(),
        props: {
          children: contentBlock.getText(),
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
        },
      };
    }
    case "blockquote":
      return {
        component: BlockBlockRender,
        editable: true,
        props: {
          children: contentBlock.getText(),
        },
      };
    case "unstyled":
      return {
        component: UnstyledBlockRender,
        editable: true,
        props: {
          children: contentBlock.getText(),
        },
      };
    case "code":
      return {
        component: BlockCodeRender,
        editable: true,
        props: {
          children: contentBlock.getText(),
        },
      };
    default: {
    }
  }
}

const blockRenderMap = Immutable.Map({
  "header-one": { element: "div" },
  "header-two": { element: "div" },
  blockquote: { element: "div" },
  unstyled: { element: "div" },
  "unordered-list-item": { element: "div" },
  "***": { element: "div" },
});

const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);

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
      textEditorVisi: false,
    };
    this.editorStateChage = this.editorStateChage.bind(this);
    this.setTextEditorVisi = this.setTextEditorVisi.bind(this);
    this.blurHandle = this.blurHandle.bind(this);
  }

  setTextEditorVisi(visi) {
    this.setState({ textEditorVisi: visi });
  }

  blurHandle() {
    
  }

  editorStateChage(edtState) {
    this.setState({ editorState: edtState });
  }

  render() {
    return (
      <div className="sienna-editor-main-cont">
          <div className={`sienna-editor-master-wrapper`}>
            <div className={`sienna-editor-block-wrapper`}>
            <div contentEditable={true} className='sienna-editor-page-title-main-cont'>Page Title</div>  
            <div contentEditable={true} className='sienna-editor-page-sub-title-main-cont'>Page sub title with a moto</div>  
          </div>
        </div>
        <Editor
          readOnly={false}
          placeholder="Type anything here"
          className="sienna-editor-root"
          editorState={this.state.editorState}
          onChange={this.editorStateChage}
          blockRenderMap={extendedBlockRenderMap}
          blockRendererFn={BlockRenderer}
          onBlur={this.blurHandle}
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
