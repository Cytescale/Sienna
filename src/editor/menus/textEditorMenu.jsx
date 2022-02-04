import React,{useState,useEffect} from "react";
import { convertToRaw, Editor, EditorState, RichUtils } from "draft-js";
import {Dropdown} from 'react-bootstrap';
import {convertToHTML} from 'draft-convert';
import { EditorMenuState } from "../constants";

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
     <button href="" ref={ref} className="comp-text-editor-block-type-butt" onClick={(e) => { e.preventDefault(); onClick(e);}}>{children}</button>));

const CustomMenu = React.forwardRef(
     ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
       const [value, setValue] = useState('');

       return (
         <div ref={ref} style={style} className={className} aria-labelledby={labeledBy}>
           <ul className="list-unstyled">{React.Children.toArray(children).filter((child) =>!value || child.props.children.toLowerCase().startsWith(value),)}</ul>
         </div>
       );
     },
   );
   
const block_type_array =[
     "unstyled",
     "header-one",
     "header-two",
     "blockquote",
     "unordered-list-item",
]

const block_type_show_array =[
     "Paragraph",
     "Header 1",
     "Header 2",
     "Quote",
     "Bullet list",
     
]


const TextEditorMenu = (props)=>{
     const [visi,setVisi] = useState(true);
     const [bld,setbld] = useState(false);
     const [itl,setitl] = useState(false);
     const [uld,setuld] = useState(false);
     const [stk,setstk] = useState(false);
     const [cde,setcde] = useState(false);
     const [block_type_index,setblock_type_index] = useState(null);
     const [finX,setfinX] = useState(0);
     const [finY,setfinY] = useState(0);
     var edtState = props.editorState;
  
     const deterMineToolarPosition=()=>{
          const selection = window.getSelection();
          if(selection.type =='None' || selection.type =='Caret' || selection.anchorNode == null )return;
          const domRect = selection.getRangeAt(0).getBoundingClientRect();
          const init_spawn_x = domRect.x - 64;
          const inti_spawn_y = domRect.y;
          let offset_x = 0;
          let offset_y = 0;
          const viewport_height =  window.innerHeight;
          const adder_menu_width = 450/2;
          const adder_menu_height = 42;
          const row_height_offset = adder_menu_height + 12;
          if(init_spawn_x + adder_menu_width > window.innerWidth){
               offset_x = window.innerWidth - (init_spawn_x + adder_menu_width) - 32;
          }
          if(init_spawn_x <=  0){
               offset_x = init_spawn_x + 32;
          }
          if(inti_spawn_y + adder_menu_height + row_height_offset > viewport_height){
               offset_y = viewport_height - (inti_spawn_y + adder_menu_height ) - (32+ row_height_offset);
          }
          if(inti_spawn_y <=  0){
               offset_y = inti_spawn_y + (32+row_height_offset);
          }
          let spwn_x = init_spawn_x + offset_x;
          let spwn_y = inti_spawn_y + offset_y - row_height_offset;
          if(spwn_y <= inti_spawn_y && spwn_y+adder_menu_height >= inti_spawn_y){
               if((spwn_y+row_height_offset+adder_menu_height)<=viewport_height){
                    spwn_y = spwn_y+row_height_offset;
               }
               else if((spwn_y-row_height_offset-adder_menu_height)>=0){
                    spwn_y = spwn_y-row_height_offset;
                    const lower_diff = inti_spawn_y -(spwn_y + adder_menu_height);
                    spwn_y = spwn_y + lower_diff; 
               }
               else{
                    // no posi move;
               }
          }
          setfinX(spwn_x);
          setfinY(spwn_y);
     }


     useEffect(()=>{
          setVisi(props.visi);
          const visiDetermine = async ()=>{
               const currContent = edtState.getCurrentContent(); 
               // console.log(props.visi);
               const selc = edtState.getSelection();
               if(!selc.getFocusKey() && !selc.getAnchorKey()){setVisi(false);return;};
               deterMineToolarPosition()
               var currBlockType = null;
               try{
                    currBlockType = RichUtils.getCurrentBlockType(edtState);
                    const ent = currContent.getEntity(selc.getFocusKey());
                    console.log(ent);
               }
               catch(e){
                    // console.log('no entr');
               }
     
               const block_ind = block_type_array.findIndex(element=>element==currBlockType)
               const anchorKey = edtState.getSelection().getAnchorKey();
               const currContentBlock= currContent.getBlockForKey(anchorKey);
               const inlineStyle = currContentBlock.getInlineStyleAt(edtState.getSelection().getAnchorOffset());
               setblock_type_index(block_ind);
               setbld(inlineStyle.has("BOLD"));
               setitl(inlineStyle.has("ITALIC"));
               setuld(inlineStyle.has("UNDERLINE"));
               setstk(inlineStyle.has("STRIKETHROUGH"));
               setcde(inlineStyle.has("CODE"));
          }
          if(props.visi)visiDetermine();
     // eslint-disable-next-line react-hooks/exhaustive-deps
     },[props.editorState,props.visi]);

     
     const handleBold = (e)=>{
          const newState = RichUtils.toggleInlineStyle(edtState, "BOLD");
          setbld(!bld);
          props.editorStateChage(newState);
          e.stopPropagation();
          e.preventDefault();          
     }
     const handleUld = (e)=>{
          const newState = RichUtils.toggleInlineStyle(edtState, "UNDERLINE");
          setuld(!uld);
          props.editorStateChage(newState);
          e.stopPropagation();
          e.preventDefault();
     }
     const handleItl = (e)=>{
          const newState = RichUtils.toggleInlineStyle(edtState, "ITALIC");
          setitl(!itl);
          props.editorStateChage(newState);
          e.stopPropagation();
          e.preventDefault();
     }
     const handleStk = (e)=>{
          const newState = RichUtils.toggleInlineStyle(edtState, "STRIKETHROUGH");
          setstk(!stk);
          props.editorStateChage(newState);
          e.stopPropagation();
          e.preventDefault();
     }


     const handleBlockChange = (ind)=>{
          const nstate = RichUtils.toggleBlockType(edtState, block_type_array[ind])
          props.editorStateChage(nstate);          
     }
     if(!visi){return <></>};
     return(
          
          <div className="comp-text-editor-menu-main-cont"
        
          style={{
               left:finX+"px",
               top:finY+"px",
          }}>
               <div className="comp-text-editor-menu-button-cont">
                    
                    <Dropdown>
                    <Dropdown.Toggle as={CustomToggle} className='comp-text-editor-block-type-butt-togg'>
                         {block_type_show_array[block_type_index]}
                         <svg className='comp-text-editor-block-type-butt-togg-ico' height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 5.83l2.46 2.46c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L12.7 3.7c-.39-.39-1.02-.39-1.41 0L8.12 6.88c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 5.83zm0 12.34l-2.46-2.46c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l3.17 3.18c.39.39 1.02.39 1.41 0l3.17-3.17c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0L12 18.17z"/></svg>
                    </Dropdown.Toggle>

                    <Dropdown.Menu as={CustomMenu} variant="dark">
                         <Dropdown.Item eventKey="3" active={block_type_index==0??true} onClick={()=>{handleBlockChange(0)}}><svg className="list-unstyled-ico" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><g><rect fill="none" height="24" width="24"/><path d="M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M13,17H8c-0.55,0-1-0.45-1-1 c0-0.55,0.45-1,1-1h5c0.55,0,1,0.45,1,1C14,16.55,13.55,17,13,17z M16,13H8c-0.55,0-1-0.45-1-1c0-0.55,0.45-1,1-1h8 c0.55,0,1,0.45,1,1C17,12.55,16.55,13,16,13z M16,9H8C7.45,9,7,8.55,7,8c0-0.55,0.45-1,1-1h8c0.55,0,1,0.45,1,1 C17,8.55,16.55,9,16,9z"/></g></svg>Paragraph</Dropdown.Item>
                         <Dropdown.Item eventKey="1" active={block_type_index==1??true} onClick={()=>{handleBlockChange(1)}}><svg className="list-unstyled-ico" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M5 4v3h5.5v12h3V7H19V4H5z"/></svg>Header 1</Dropdown.Item>
                         <Dropdown.Item eventKey="2" active={block_type_index==2??true} onClick={()=>{handleBlockChange(2)}}><svg className="list-unstyled-ico" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M5 4v3h5.5v12h3V7H19V4H5z"/></svg>Header 2</Dropdown.Item>
                         <Dropdown.Item eventKey="3" active={block_type_index==3??true} onClick={()=>{handleBlockChange(3)}}><svg className="list-unstyled-ico" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7.17 17c.51 0 .98-.29 1.2-.74l1.42-2.84c.14-.28.21-.58.21-.89V8c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h2l-1.03 2.06c-.45.89.2 1.94 1.2 1.94zm10 0c.51 0 .98-.29 1.2-.74l1.42-2.84c.14-.28.21-.58.21-.89V8c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h2l-1.03 2.06c-.45.89.2 1.94 1.2 1.94z"/></svg>Quote</Dropdown.Item>            
                         <Dropdown.Item eventKey="3" active={block_type_index==4??true} onClick={()=>{handleBlockChange(4)}}><svg className="list-unstyled-ico" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM8 19h12c.55 0 1-.45 1-1s-.45-1-1-1H8c-.55 0-1 .45-1 1s.45 1 1 1zm0-6h12c.55 0 1-.45 1-1s-.45-1-1-1H8c-.55 0-1 .45-1 1s.45 1 1 1zM7 6c0 .55.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1H8c-.55 0-1 .45-1 1z"/></svg>Bullet list</Dropdown.Item>               
                    </Dropdown.Menu>
                    </Dropdown>
                    <div className="comp-text-editor-div-cont"/>
                    <button className={`
                    comp-text-editor-menu-button
                    ${bld?"comp-text-editor-menu-button-active":""}
                    ${!visi?"comp-text-editor-menu-button-disable":""}
                    `}
                    disabled={!visi}
                    onClick={(e)=>{handleBold(e)}}
                    >
                    <svg className="comp-text-editor-menu-button-ico" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H8c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h5.78c2.07 0 3.96-1.69 3.97-3.77.01-1.53-.85-2.84-2.15-3.44zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg>
                    </button>
                     <button className={`
                    comp-text-editor-menu-button
                    ${itl?"comp-text-editor-menu-button-active":""}
                    ${!visi?"comp-text-editor-menu-button-disable":""}
                    `}
                    disabled={!visi}
                    onClick={(e)=>{handleItl(e)}}
                    >
                    <svg className="comp-text-editor-menu-button-ico"  height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M10 5.5c0 .83.67 1.5 1.5 1.5h.71l-3.42 8H7.5c-.83 0-1.5.67-1.5 1.5S6.67 18 7.5 18h5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5h-.71l3.42-8h1.29c.83 0 1.5-.67 1.5-1.5S17.33 4 16.5 4h-5c-.83 0-1.5.67-1.5 1.5z"/></svg>
                    </button>
                    <button className={`
                    comp-text-editor-menu-button
                    ${uld?"comp-text-editor-menu-button-active":""}
                    ${!visi?"comp-text-editor-menu-button-disable":""}
                    `}
                    disabled={!visi}
                    onClick={(e)=>{handleUld(e)}}
                    >
                    <svg  className="comp-text-editor-menu-button-ico"  height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12.79 16.95c3.03-.39 5.21-3.11 5.21-6.16V4.25C18 3.56 17.44 3 16.75 3s-1.25.56-1.25 1.25v6.65c0 1.67-1.13 3.19-2.77 3.52-2.25.47-4.23-1.25-4.23-3.42V4.25C8.5 3.56 7.94 3 7.25 3S6 3.56 6 4.25V11c0 3.57 3.13 6.42 6.79 5.95zM5 20c0 .55.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1H6c-.55 0-1 .45-1 1z"/></svg>
                    </button>
                    <button className={`
                    comp-text-editor-menu-button
                    ${stk?"comp-text-editor-menu-button-active":""}
                    ${!visi?"comp-text-editor-menu-button-disable":""}
                    `}
                    onClick={(e)=>{handleStk(e)}}
                    disabled={!visi}
                    >
                    <svg className="comp-text-editor-menu-button-ico" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M14.59 7.52c0-.31-.05-.59-.15-.85-.09-.27-.24-.49-.44-.68-.2-.19-.45-.33-.75-.44-.3-.1-.66-.16-1.06-.16-.39 0-.74.04-1.03.13s-.53.21-.72.36c-.19.16-.34.34-.44.55-.1.21-.15.43-.15.66 0 .48.25.88.74 1.21.38.25.77.48 1.41.7H7.39c-.05-.08-.11-.17-.15-.25-.26-.48-.39-1.03-.39-1.67 0-.61.13-1.16.4-1.67.26-.5.63-.93 1.11-1.29.48-.35 1.05-.63 1.7-.83.66-.19 1.39-.29 2.18-.29.81 0 1.54.11 2.21.34.66.22 1.23.54 1.69.94.47.4.83.88 1.08 1.43s.38 1.15.38 1.81h-3.01M20 10H4c-.55 0-1 .45-1 1s.45 1 1 1h8.62c.18.07.4.14.55.2.37.17.66.34.87.51s.35.36.43.57c.07.2.11.43.11.69 0 .23-.05.45-.14.66-.09.2-.23.38-.42.53-.19.15-.42.26-.71.35-.29.08-.63.13-1.01.13-.43 0-.83-.04-1.18-.13s-.66-.23-.91-.42c-.25-.19-.45-.44-.59-.75s-.25-.76-.25-1.21H6.4c0 .55.08 1.13.24 1.58s.37.85.65 1.21c.28.35.6.66.98.92.37.26.78.48 1.22.65.44.17.9.3 1.38.39.48.08.96.13 1.44.13.8 0 1.53-.09 2.18-.28s1.21-.45 1.67-.79c.46-.34.82-.77 1.07-1.27s.38-1.07.38-1.71c0-.6-.1-1.14-.31-1.61-.05-.11-.11-.23-.17-.33H20c.55 0 1-.45 1-1V11c0-.55-.45-1-1-1z"/></svg>
                    </button>
                    <div className="comp-text-editor-div-cont"/>
                    <button className={`
                    comp-text-editor-menu-button
                    ${stk?"comp-text-editor-menu-button-active":""}
                    ${!visi?"comp-text-editor-menu-button-disable":""}
                    `}
                    disabled={!visi}
                    >
                    <svg className="comp-text-editor-menu-button-ico" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><g><rect fill="none" height="24" width="24"/></g><g><g><path d="M17,7h-3c-0.55,0-1,0.45-1,1s0.45,1,1,1h3c1.65,0,3,1.35,3,3s-1.35,3-3,3h-3c-0.55,0-1,0.45-1,1c0,0.55,0.45,1,1,1h3 c2.76,0,5-2.24,5-5S19.76,7,17,7z M8,12c0,0.55,0.45,1,1,1h6c0.55,0,1-0.45,1-1s-0.45-1-1-1H9C8.45,11,8,11.45,8,12z M10,15H7 c-1.65,0-3-1.35-3-3s1.35-3,3-3h3c0.55,0,1-0.45,1-1s-0.45-1-1-1H7c-2.76,0-5,2.24-5,5s2.24,5,5,5h3c0.55,0,1-0.45,1-1 C11,15.45,10.55,15,10,15z"/></g></g></svg>
                    </button>
                    <button className={`
                    comp-text-editor-menu-button
                    ${stk?"comp-text-editor-menu-button-active":""}
                  
                    `}
                    onClick={(e)=>{
                              console.log(convertToHTML(edtState.getCurrentContent()));
                         }
                    }
                    >
                    <svg className="comp-text-editor-menu-button-ico" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>
                    </button>
               </div>
          </div>
     )
}

export default TextEditorMenu;