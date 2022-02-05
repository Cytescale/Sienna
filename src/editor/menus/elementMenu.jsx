/** @format */
import React, { useState, useEffect, useRef } from "react";
import { lockScroll } from "../handlers/utils";
import { insertProperBlock } from "../commands";
import {
  RichUtils,
  EditorState,
  Modifier,
  getDefaultKeyBinding,
  SelectionState,
} from "draft-js";

export const MenuButtonInd = [
  {
    id: "paragrapgh",
    element: (
      <div>
        <div className="element_adder_menu_butt_pri_tit">
          <svg className="element_adder_menu_butt_ico" viewBox="0 0 512 512">
            <title>Text</title>
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"
              d="M32 415.5l120-320 120 320M230 303.5H74M326 239.5c12.19-28.69 41-48 74-48h0c46 0 80 32 80 80v144"
            />
            <path
              d="M320 358.5c0 36 26.86 58 60 58 54 0 100-27 100-106v-15c-20 0-58 1-92 5-32.77 3.86-68 19-68 58z"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"
            />
          </svg>
          Paragraph
        </div>
        <div className="element_adder_menu_butt_sec_tit">
          Add textual data to your document
        </div>
      </div>
    ),
  },
  {
    id: "header-one",
    element: (
      <div>
        <div className="element_adder_menu_butt_pri_tit">
          <svg
            className="element_adder_menu_butt_ico"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            fill="currentColor"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M5 4v3h5.5v12h3V7H19V4H5z" />
          </svg>
          Header 1
        </div>
        <div className="element_adder_menu_butt_sec_tit">
          Add Header size 1 to your document
        </div>
      </div>
    ),
  },
  {
    id: "header-two",
    element: (
      <div>
        <div className="element_adder_menu_butt_pri_tit">
          <svg
            className="element_adder_menu_butt_ico"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            fill="currentColor"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M5 4v3h5.5v12h3V7H19V4H5z" />
          </svg>
          Header 2
        </div>
        <div className="element_adder_menu_butt_sec_tit">
          Add Header size 2 to your document
        </div>
      </div>
    ),
  },
  {
    id: "quote",
    element: (
      <div>
        <div className="element_adder_menu_butt_pri_tit">
          <svg
            className="element_adder_menu_butt_ico"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            fill="currentColor"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M7.17 17c.51 0 .98-.29 1.2-.74l1.42-2.84c.14-.28.21-.58.21-.89V8c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h2l-1.03 2.06c-.45.89.2 1.94 1.2 1.94zm10 0c.51 0 .98-.29 1.2-.74l1.42-2.84c.14-.28.21-.58.21-.89V8c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h2l-1.03 2.06c-.45.89.2 1.94 1.2 1.94z" />
          </svg>
          Quote
        </div>
        <div className="element_adder_menu_butt_sec_tit">
          Add Quote to your document
        </div>
      </div>
    ),
  },
  {
    id: "bullet-list",
    element: (
      <div>
        <div className="element_adder_menu_butt_pri_tit">
          <svg
            className="element_adder_menu_butt_ico"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            fill="currentColor"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM8 19h12c.55 0 1-.45 1-1s-.45-1-1-1H8c-.55 0-1 .45-1 1s.45 1 1 1zm0-6h12c.55 0 1-.45 1-1s-.45-1-1-1H8c-.55 0-1 .45-1 1s.45 1 1 1zM7 6c0 .55.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1H8c-.55 0-1 .45-1 1z" />
          </svg>
          Bullet List
        </div>
        <div className="element_adder_menu_butt_sec_tit">
          Add Unorederd list to your document
        </div>
      </div>
    ),
  },
  {
    id: "image",
    element: (
      <div>
        <div className="element_adder_menu_butt_pri_tit">
          <svg className="element_adder_menu_butt_ico" viewBox="0 0 512 512">
            <title>Image</title>
            <rect
              x="48"
              y="80"
              width="416"
              height="352"
              rx="48"
              ry="48"
              fill="none"
              stroke="currentColor"
              stroke-linejoin="round"
              stroke-width="32"
            />
            <circle
              cx="336"
              cy="176"
              r="32"
              fill="none"
              stroke="currentColor"
              stroke-miterlimit="10"
              stroke-width="32"
            />
            <path
              d="M304 335.79l-90.66-90.49a32 32 0 00-43.87-1.3L48 352M224 432l123.34-123.34a32 32 0 0143.11-2L464 368"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"
            />
          </svg>
          Image
        </div>
        <div className="element_adder_menu_butt_sec_tit">
          Add Images to your document
        </div>
      </div>
    ),
  },
  {
    id: "divider",
    element: (
      <div>
        <div className="element_adder_menu_butt_pri_tit">
          <svg className="element_adder_menu_butt_ico" viewBox="0 0 512 512">
            <title>Git Commit</title>
            <circle
              cx="256"
              cy="256"
              r="96"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"
            />
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"
              d="M160 256H48M464 256H352"
            />
          </svg>
          Divider
        </div>
        <div className="element_adder_menu_butt_sec_tit">
          Divide your document and add space between elements
        </div>
      </div>
    ),
  },
];

const getSelectedBlockElement = () => {
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

const getDOMRect = () => {
  const selcBlock = getSelectedBlockElement();
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
          if (node.className.includes("sienna-editor-block-wrapper")) {
            break;
          }
        }
      }
      domRect = node.getBoundingClientRect();
    }
  }
  if (!domRect) return;
  return domRect;
};

const ElementAdderMenu = (props) => {
  const adderMenuRef = useRef();
  const menu_elm_ref = useRef([]);
  const [entry_anim, setentry_anim] = useState(false);
  const [exit_anim, setexit_anim] = useState(false);
  const [curr_visi, setcurr_visi] = useState(false);
  const [selectedButtonInd, setselectedButtonInd] = useState(
    props.editorAdderMenuObject.adderInd
  );
  const [finX, setfinX] = useState(0);
  const [finY, setfinY] = useState(0);

  useEffect(() => {
    if (props.visi && !entry_anim) {
      setentry_anim(true);
      setcurr_visi(true);
      const selection = window.getSelection();
      let selecDomRect = null;
      if (selection) {
        selecDomRect = selection.getRangeAt(0).getBoundingClientRect();
      }
      const DOMRect = getDOMRect();
      if (!DOMRect) {
        return;
      }
      let init_spawn_x = selecDomRect
        ? selecDomRect.x !== 0
          ? selecDomRect.x
          : DOMRect.x
        : DOMRect.x;
      let inti_spawn_y = selecDomRect
        ? selecDomRect.y !== 0
          ? selecDomRect.y
          : DOMRect.y
        : DOMRect.y;
      let offset_x = 0;
      let offset_y = 0;
      const viewport_height = window.innerHeight;
      const adder_menu_width = 270;
      const adder_menu_height = 250;
      const row_height_offset = 42;
      if (init_spawn_x + adder_menu_width > window.innerWidth) {
        offset_x = window.innerWidth - (init_spawn_x + adder_menu_width) - 32;
      }
      if (init_spawn_x <= 0) {
        offset_x = init_spawn_x + 32;
      }
      if (
        inti_spawn_y + adder_menu_height + row_height_offset >
        viewport_height
      ) {
        offset_y =
          viewport_height -
          (inti_spawn_y + adder_menu_height) -
          (32 + row_height_offset);
      }
      if (inti_spawn_y <= 0) {
        offset_y = inti_spawn_y + (32 + row_height_offset);
      }
      let spwn_x = init_spawn_x + offset_x;
      let spwn_y = inti_spawn_y + offset_y + row_height_offset;
      if (
        spwn_y <= inti_spawn_y &&
        spwn_y + adder_menu_height >= inti_spawn_y
      ) {
        if (spwn_y + row_height_offset + adder_menu_height <= viewport_height) {
          spwn_y = spwn_y + row_height_offset;
        } else if (spwn_y - row_height_offset - adder_menu_height >= 0) {
          spwn_y = spwn_y - row_height_offset;
          const lower_diff = inti_spawn_y - (spwn_y + adder_menu_height);
          spwn_y = spwn_y + lower_diff;
        } else {
          // no posi move;
        }
      }
      setfinX(spwn_x);
      setfinY(spwn_y);
      // adderMenuRef.current.focus();
      // adderMenuRef.current.scrollIntoView()
    } else if (!props.visi && !exit_anim && curr_visi) {
      setentry_anim(false);
      setexit_anim(true);
    }
  }, [props.visi]);

  useEffect(() => {
    let selc_elem = document.getElementsByClassName(`
               element_adder_menu_butt
               element_adder_menu_butt_selected
               `);
    let topPos = selc_elem[0] ? selc_elem[0].offsetTop : 0;
    // console.log(adderMenuRef.current.scrollTop,topPos,(topPos-adderMenuRef.current.scrollTop));
    let prev_diff = topPos - adderMenuRef.current.scrollTop;
    if ((adderMenuRef && prev_diff >= 186) || prev_diff <= 0) {
      let diff = topPos - 186;
      let finScroll = diff;
      adderMenuRef.current.scrollTop = finScroll;
      // console.log(adderMenuRef.current.scrollTop,adderMenuRef.current.scrollTop);
    }
  }, [props.editorAdderMenuObject.adderInd]);

  return (
    <div
      ref={adderMenuRef}
      className={`
                    element_adder_menu_main_cont
                    ${entry_anim ? "element_adder_menu_main_cont_enter" : ""}
                    ${exit_anim ? "element_adder_menu_main_cont_exist" : ""}
                    `}
      onAnimationEnd={() => {
        if (exit_anim) {
          setcurr_visi(false);
          setexit_anim(false);
        }
        if (entry_anim) {
          setcurr_visi(true);
          setentry_anim(false);
        }
      }}
      style={{
        left: finX + "px",
        top: finY + "px",
        display: curr_visi ? "block" : "none",
      }}
    >
      <div className="element_adder_menu_tit">
        Element Menu
        <button
          className="element_adder_menu_close_butt"
          onClick={() => {
            props.triggerExist(false);
          }}
        >
          <svg
            className="element_adder_menu_close_butt_ico"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            fill="currentColor"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
          </svg>
        </button>
      </div>
      <div className="element_adder_menu_body">
        <div className="element_adder_menu_cat_title">Basic Elements</div>
        {MenuButtonInd.map((b, ind) => {
          return (
            <button
              onClick={(e) => {
                let type = MenuButtonInd[ind].id;
                const prev_selec = props.editorAdderMenuObject.prevSelecState;
                const curr_selec = props.editorState.getSelection();
                let empty_selec = SelectionState.createEmpty(
                  props.editorState
                    .getCurrentContent()
                    .getBlockForKey(curr_selec.getFocusKey()).key
                );
                empty_selec = empty_selec.merge({
                  anchorOffset: prev_selec.getAnchorOffset(),
                  focusOffset: curr_selec.getFocusOffset(),
                });

                let newEs = EditorState.push(
                  props.editorState,
                  Modifier.removeRange(
                    props.editorState.getCurrentContent(),
                    empty_selec,
                    "forward"
                  ),
                  "remove-text"
                );

                props.editorStateChange(insertProperBlock(type, newEs));
                props.editorAdderMenuObject.setVisi(false);
              }}
              onMouseEnter={() => {
                props.editorAdderMenuObject.setAdderMenuInd(null);
                props.editorAdderMenuObject.setAdderMenuMouseInd(ind);
              }}
              className={`
                                        element_adder_menu_butt
                                        ${
                                          props.editorAdderMenuObject
                                            .adderInd === ind ||
                                          props.editorAdderMenuObject
                                            .adderMenuMouseInd === ind
                                            ? "element_adder_menu_butt_selected"
                                            : ""
                                        }
                                        `}
            >
              {b.element}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ElementAdderMenu;
