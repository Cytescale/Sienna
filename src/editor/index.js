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
  getDefaultKeyBinding,
  KeyBindingUtil,
  EditorChangeType,
  Modifier,
  AtomicBlockUtils
} from "draft-js";
import TextEditorMenu from "./textEditorMenu";
import Immutable from "immutable";
const {hasCommandModifier} = KeyBindingUtil;

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
        onClick={(e)=>{
          e.preventDefault();
          e.stopPropagation();
      }}
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
        <EditorBlock {...props}  />
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

function BlockOLRender(props) {
  return (
    <BlockWrapper>
      <div className="sienna-editor-OL-block">
        <div
          className="sienna-editor-OL-block-count"
          contentEditable={false}
          readOnly
        />
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
    
  }

  switch (type) {
    case 'divider':{
      return (
        <BlockWrapper>
          <div className="sienna-editor-divider-block-cont"
          onClick={handleDividerClick}
          ><div className='sienna-editor-divider-block'/></div>
        </BlockWrapper>
      );
    }
    default:{
      break;
    }
  }
  
}

function BlockRenderer(contentBlock,editorState,editorStateChage) {
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
    case "ordered-list-item": {
      console.log(contentBlock.getCharacterList());
      return {
        component: BlockOLRender,
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
    case "atomic":{
      return {
        component: AtomicBlockRender,
        editable: false,
        props: {
          editorState: editorState,
          editorStateChage:editorStateChage
        },
      };
    }
    default: {
    }
  }
}

const insertDivider = (editorState) => {
  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity("divider","IMMUTABLE");
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const newEditorState = EditorState.set(editorState, {currentContent: contentStateWithEntity});
  return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ");
};

const blockRenderMap = Immutable.Map({
  "header-one": { element: "div" },
  "header-two": { element: "div" },
  blockquote: { element: "div" },
  unstyled: { element: "div" },
  "unordered-list-item": { element: "div" },
  "ordered-list-item": { element: "div" },
  "atomic": { element: "div" },
  "***": { element: "div" },
});

const toContinueBlocks=[
  'ordered-list-item',
  "unordered-list-item",
];

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
    this.handleReturnEvent = this.handleReturnEvent.bind(this);
  }

  setTextEditorVisi(visi) {
    this.setState({ textEditorVisi: visi });
  }

  focusHandle(){
    
  }

  blurHandle() {
    
  }

  KeyBinder = (e)=>{
    if(e.keyCode ===8){
      
    }
    return getDefaultKeyBinding(e);
   
  }
  
   handleKeyCommand = (command)=>{
    console.log(command);
    return 'not-handled';
  }
  
  
  insertImage = (editorState, base64) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity("image","IMMUTABLE",{ src: base64 });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {currentContent: contentStateWithEntity});
    return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ");
  };
 handleReturnEvent(e){
  const editorState = this.state.editorState;
  const currBlockType = RichUtils.getCurrentBlockType(this.state.editorState);
  const isContinousBlock = toContinueBlocks.indexOf(currBlockType)>-1;
  const isAtStart = this.state.editorState.getSelection().getFocusOffset()==0;
  if(e.shiftKey) {
    // const newEditorState = RichUtils.insertSoftNewline(this.state.editorState);
    // if (newEditorState !== this.state.editorState) {this.editorStateChage(newEditorState);}
    
    this.editorStateChage(insertDivider(this.state.editorState));
  } else {
      const currentContent = editorState.getCurrentContent();
      const selection = editorState.getSelection();
      const textWithEntity = Modifier.splitBlock(currentContent, selection);
      var nState = EditorState.push(editorState, textWithEntity, "split-block");
      if(!isContinousBlock && !isAtStart){nState = RichUtils.toggleBlockType(nState, 'unstyled');   }
      if(isAtStart){
        const currSelc = nState.getSelection();
        const befselc = nState.getCurrentContent().getSelectionBefore();
        nState = EditorState.forceSelection(nState, befselc);
        nState = RichUtils.toggleBlockType(nState, 'unstyled');       
        nState =  EditorState.forceSelection(nState,currSelc);
      }
      // console.log(nState.getUndoStack());
      this.editorStateChage(nState);
  }

  return 'handled';
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
          handleKeyCommand={this.handleKeyCommand}
          handleReturn={this.handleReturnEvent}
          keyBindingFn={this.KeyBinder}
          onChange={this.editorStateChage}
          blockRenderMap={extendedBlockRenderMap}
          blockRendererFn={(contntBlock)=>{return BlockRenderer(contntBlock,this.state.editorState,this.editorStateChage)}}
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
