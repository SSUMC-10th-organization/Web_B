import "./App.css";
import { CartList } from "./components/CartList";
import { Navbar } from "./components/Navbar";
import { Provider } from "react-redux";
import store from "./store/store";
import PriceBox from "./components/PriceBox";

function App() {
  return (
    <Provider store={store}>
      <Navbar />
      <CartList />
      <PriceBox />
    </Provider>
  );
}

export default App;
