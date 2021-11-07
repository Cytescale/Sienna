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
function BlockCodeRender(props){
     return(<div className='sienna-editor-block-code'><EditorBlock {...props} /></div>)
}

function BlockRenderer (contentBlock){
     const ty = contentBlock.getType();
     console.log(ty);
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
          case 'code':
               return {
                    component:BlockCodeRender,
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
          this.state = {
               editorState: EditorState.createWithContent(state),
               textEditorVisi: false,
          }
          this.editorStateChage = this.editorStateChage.bind(this);
          this.setTextEditorVisi = this.setTextEditorVisi.bind(this);
          this.blurHandle = this.blurHandle.bind(this);
     }

     setTextEditorVisi(visi){this.setState({textEditorVisi: visi});}

     textEditorVisi(edtState){
          const selc = edtState.getSelection();
          if(selc.getEndOffset() > selc.getStartOffset()){
               this.setTextEditorVisi(true);
               return;
          }
          this.setTextEditorVisi(false);
     }

     blurHandle(){
          this.setTextEditorVisi(false);
     }

     editorStateChage(edtState){   
          this.textEditorVisi(edtState);
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
            onBlur={this.blurHandle}
            />
          <TextEditorMenu visi={this.state.textEditorVisi} editorStateChage={this.editorStateChage} editorState={this.state.editorState}/>
          </div>
          );
        }
}