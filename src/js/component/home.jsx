import React from "react";

//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";
import TodoLitApi from "./TodoLitApi";

//create your first component
const Home = () => {
	return (
		<div>
			<TodoLitApi />
		</div>
	);
};

export default Home;
