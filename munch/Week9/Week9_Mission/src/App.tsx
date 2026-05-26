import { Provider } from "react-redux";
import "./App.css";
import CartList from "./components/CartList";
import Modal from "./components/Modal";
import Navbar from "./components/Navbar";
import PriceBox from "./components/PriceBox";
import store from "./store/store";

function App() {
	return (
		<Provider store={store}>
			<Navbar />
			<Modal />
			<CartList />
			<PriceBox />
		</Provider>
	);
}

export default App;
