import react from "react";
import template_page_code from "./templatePage";
import { Editor,EditorState,EditorBlock,RichUtils,convertFromHTML,ContentState,Draft,DefaultDraftBlockRenderMap, convertToRaw } from "draft-js";
import TextEditorMenu from "./textEditorMenu";

function Header1BlockRender(props){
     return(<div className='sienna-editor-header-1-block'><EditorBlock {...props}/></div>)
}

function UnstyledBlockRender(props){
     return(<div className='sienna-editor-unstyle-block'><EditorBlock {...props}/></div>)
}
function BlockBlockRender(props){
     return(<div className='sienna-editor-block-block'><EditorBlock {...props} /></div>)
}

function BlockRenderer (contentBlock){
     const ty = contentBlock.getType();
     switch(ty){
          case 'header-one':{
               return {
                    component:Header1BlockRender,
                    editable:true,
                    children:contentBlock.getText(),
                    props:{
                         children:contentBlock.getText()
                    }
               }               
          }
          case 'blockquote':
               return {
                    component:BlockBlockRender,
                    editable:true,
                    props:{
                         children:contentBlock.getText()
                    }
               }
          case 'unstyled':
               return {
                    component:UnstyledBlockRender,
                    editable:true,
                    props:{
                         children:contentBlock.getText()
                    }
               }
          default:{

          }
     }
}


          

export default class SiennaEditor extends react.Component   {
     
     constructor(props){
          super(props);
          const blocksFromHTML = convertFromHTML(template_page_code);
          const state = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks,blocksFromHTML.entityMap,);
          this.state = {editorState: EditorState.createWithContent(state)};
          this.editorStateChage = this.editorStateChage.bind(this);

     }

     editorStateChage(edtState){
          this.setState({editorState: edtState});
     }

     render() {
          return (
          <div className='sienna-editor-main-cont'>
            <div contentEditable className='sienna-editor-page-title-main-cont'>Page Title</div>
            <Editor
            readOnly={false}
            placeholder='Type anything here'
            className='sienna-editor-root'
            editorState={this.state.editorState} 
            onChange={this.editorStateChage} 
            blockRendererFn={BlockRenderer}
            />
          <TextEditorMenu visi={true} editorState={this.state.editorState}/>
          </div>
          );
        }
}