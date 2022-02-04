/** @format */

import "draft-js/dist/Draft.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./stylesheets/App.css";

import SiennaEditor from "./editor";

function App() {
	return (
		<div className="App">
			<div className="land_main_header_base">
				<div className="land_main_header_base_left_body">
					<svg
						className="land_main_logo_logo"
						width="100"
						height="100"
						viewBox="0 0 100 100"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<rect width="100" height="100" rx="13" fill="#31363F" />
						<path
							d="M77.8642 35.7682L59.2878 73.1422C55.6248 80.5119 45.1248 80.549 41.4098 73.2054L22.391 35.6102C19.0145 28.9356 23.8931 21.0523 31.373 21.0963L68.9682 21.3175C76.3659 21.361 81.157 29.1436 77.8642 35.7682Z"
							fill="url(#paint0_linear_533:12)"
						/>
						<defs>
							<linearGradient
								id="paint0_linear_533:12"
								x1="50"
								y1="91"
								x2="50"
								y2="21"
								gradientUnits="userSpaceOnUse"
							>
								<stop stop-color="#70FFD4" />
								<stop offset="1" stop-color="#47ECBA" />
							</linearGradient>
						</defs>
					</svg>
				</div>
				<div className="land_main_header_base_center_body">
					<div className="land_main_logo_main_cont">{/* Sienna Editor */}</div>
				</div>
			</div>
			<div className="land_main_header_fader" />
			<SiennaEditor />
		</div>
	);
}

export default App;
