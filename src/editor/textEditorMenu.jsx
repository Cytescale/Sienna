import React,{useState,useEffect} from "react";
import { RichUtils } from "draft-js";

const TextEditorMenu = (props)=>{
     const [visi,setVisi] = useState(false);
     const [bld,setbld] = useState(false);
     const [itl,setitl] = useState(false);
     const [uld,setuld] = useState(false);
     const [stk,setstk] = useState(false);
     const [cde,setcde] = useState(false);
     var edtState = props.editorState;

     useEffect(()=>{
          setVisi(props.visi);
     },[props.visi]);

     useEffect(()=>{
          const currContent = edtState.getCurrentContent();
          const anchorKey = edtState.getSelection().getAnchorKey();
          const currContentBlock= currContent.getBlockForKey(anchorKey);
          const inlineStyle = currContentBlock.getInlineStyleAt(edtState.getSelection().getAnchorOffset());
          setbld(inlineStyle.has("BOLD"));
          setitl(inlineStyle.has("ITALIC"));
          setuld(inlineStyle.has("UNDERLINE"));
          setstk(inlineStyle.has("STRIKETHROUGH"));
          setcde(inlineStyle.has("CODE"));
     // eslint-disable-next-line react-hooks/exhaustive-deps
     },[props.editorState]);

     if(!visi)return null;


     const handleBold = ()=>{
          const newState = RichUtils.toggleInlineStyle(edtState, "BOLD");
          setbld(!bld);
          props.editorStateChage(newState);
     }
     const handleUld = ()=>{
          const newState = RichUtils.toggleInlineStyle(edtState, "UNDERLINE");
          setuld(!uld);
          props.editorStateChage(newState);
     }
     const handleItl = ()=>{
          const newState = RichUtils.toggleInlineStyle(edtState, "ITALIC");
          setitl(!itl);
          props.editorStateChage(newState);
     }
     const handleStk = ()=>{
          const newState = RichUtils.toggleInlineStyle(edtState, "STRIKETHROUGH");
          setstk(!stk);
          props.editorStateChage(newState);
     }

     return(
          <div className="comp-text-editor-menu-main-outer-cont">
          <div className="comp-text-editor-menu-main-cont">
               <div className="comp-text-editor-menu-button-cont">
                    <button className={`
                    comp-text-editor-menu-button
                    ${bld?"comp-text-editor-menu-button-active":""}
                    `}
                    onClick={(e)=>{handleBold(e)}}
                    >
                    <svg className="comp-text-editor-menu-button-ico" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H8c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h5.78c2.07 0 3.96-1.69 3.97-3.77.01-1.53-.85-2.84-2.15-3.44zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg>
                    </button>
                     <button className={`
                    comp-text-editor-menu-button
                    ${itl?"comp-text-editor-menu-button-active":""}
                    `}
                    onClick={(e)=>{handleItl(e)}}
                    >
                    <svg className="comp-text-editor-menu-button-ico"  height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M10 5.5c0 .83.67 1.5 1.5 1.5h.71l-3.42 8H7.5c-.83 0-1.5.67-1.5 1.5S6.67 18 7.5 18h5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5h-.71l3.42-8h1.29c.83 0 1.5-.67 1.5-1.5S17.33 4 16.5 4h-5c-.83 0-1.5.67-1.5 1.5z"/></svg>
                    </button>
                    <button className={`
                    comp-text-editor-menu-button
                    ${uld?"comp-text-editor-menu-button-active":""}
                    `}
                    onClick={(e)=>{handleUld(e)}}
                    >
                    <svg  className="comp-text-editor-menu-button-ico"  height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12.79 16.95c3.03-.39 5.21-3.11 5.21-6.16V4.25C18 3.56 17.44 3 16.75 3s-1.25.56-1.25 1.25v6.65c0 1.67-1.13 3.19-2.77 3.52-2.25.47-4.23-1.25-4.23-3.42V4.25C8.5 3.56 7.94 3 7.25 3S6 3.56 6 4.25V11c0 3.57 3.13 6.42 6.79 5.95zM5 20c0 .55.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1H6c-.55 0-1 .45-1 1z"/></svg>
                    </button>
                    <button className={`
                    comp-text-editor-menu-button
                    ${stk?"comp-text-editor-menu-button-active":""}
                    `}
                    onClick={(e)=>{handleStk(e)}}
                    >
                    <svg className="comp-text-editor-menu-button-ico" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M14.59 7.52c0-.31-.05-.59-.15-.85-.09-.27-.24-.49-.44-.68-.2-.19-.45-.33-.75-.44-.3-.1-.66-.16-1.06-.16-.39 0-.74.04-1.03.13s-.53.21-.72.36c-.19.16-.34.34-.44.55-.1.21-.15.43-.15.66 0 .48.25.88.74 1.21.38.25.77.48 1.41.7H7.39c-.05-.08-.11-.17-.15-.25-.26-.48-.39-1.03-.39-1.67 0-.61.13-1.16.4-1.67.26-.5.63-.93 1.11-1.29.48-.35 1.05-.63 1.7-.83.66-.19 1.39-.29 2.18-.29.81 0 1.54.11 2.21.34.66.22 1.23.54 1.69.94.47.4.83.88 1.08 1.43s.38 1.15.38 1.81h-3.01M20 10H4c-.55 0-1 .45-1 1s.45 1 1 1h8.62c.18.07.4.14.55.2.37.17.66.34.87.51s.35.36.43.57c.07.2.11.43.11.69 0 .23-.05.45-.14.66-.09.2-.23.38-.42.53-.19.15-.42.26-.71.35-.29.08-.63.13-1.01.13-.43 0-.83-.04-1.18-.13s-.66-.23-.91-.42c-.25-.19-.45-.44-.59-.75s-.25-.76-.25-1.21H6.4c0 .55.08 1.13.24 1.58s.37.85.65 1.21c.28.35.6.66.98.92.37.26.78.48 1.22.65.44.17.9.3 1.38.39.48.08.96.13 1.44.13.8 0 1.53-.09 2.18-.28s1.21-.45 1.67-.79c.46-.34.82-.77 1.07-1.27s.38-1.07.38-1.71c0-.6-.1-1.14-.31-1.61-.05-.11-.11-.23-.17-.33H20c.55 0 1-.45 1-1V11c0-.55-.45-1-1-1z"/></svg>
                    </button>
               </div>
          </div>
          </div>
     )
}

export default TextEditorMenu;