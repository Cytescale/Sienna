import './stylesheets/App.css';
import 'draft-js/dist/Draft.css';
import SiennaEditor from './editor';

function App() {
  return (
    <div className="App">
       <div className="land_main_header_base">
                         <div className="land_main_header_base_left_body">
                         <div className="land_main_logo_logo"/> 
     
                         </div>
                         <div className="land_main_header_base_center_body">
                              <div className="land_main_logo_main_cont">
                                   Sienna Editor
                              </div>
                         </div>
                         <div className="land_main_header_base_right_body">

                         
                         <button className="land_main_header_right_more_butt">
                              <svg className="land_main_header_right_more_butt_ico" viewBox="0 0 512 512"><title>Layers</title><path d="M434.8 137.65l-149.36-68.1c-16.19-7.4-42.69-7.4-58.88 0L77.3 137.65c-17.6 8-17.6 21.09 0 29.09l148 67.5c16.89 7.7 44.69 7.7 61.58 0l148-67.5c17.52-8 17.52-21.1-.08-29.09zM160 308.52l-82.7 37.11c-17.6 8-17.6 21.1 0 29.1l148 67.5c16.89 7.69 44.69 7.69 61.58 0l148-67.5c17.6-8 17.6-21.1 0-29.1l-79.94-38.47" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path d="M160 204.48l-82.8 37.16c-17.6 8-17.6 21.1 0 29.1l148 67.49c16.89 7.7 44.69 7.7 61.58 0l148-67.49c17.7-8 17.7-21.1.1-29.1L352 204.48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>
                         </button>    

                         <button className="land_main_header_right_more_butt">
                         <svg className="land_main_header_right_more_butt_ico"  viewBox="0 0 512 512"><path d="M408 64H104a56.16 56.16 0 00-56 56v192a56.16 56.16 0 0056 56h40v80l93.72-78.14a8 8 0 015.13-1.86H408a56.16 56.16 0 0056-56V120a56.16 56.16 0 00-56-56z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32"/></svg>
                         </button>

                            <button className="land_main_header_right_more_butt">
                              <svg className="land_main_header_right_more_butt_ico" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                         </button>  
                         
                    

                         </div>
       </div>
     <div className="land_main_header_fader"/>
      <SiennaEditor/>
    </div>
  );
}

export default App;
