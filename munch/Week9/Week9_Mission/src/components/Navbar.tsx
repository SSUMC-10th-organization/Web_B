import { useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import useCartStore from "../hooks/useCartStore";

const Navbar = () => {
	const { amount, cartItems, calculateTotals } = useCartStore();

	// biome-ignore lint/correctness/useExhaustiveDependencies: calculateTotals is stable
	useEffect(() => {
		calculateTotals();
	}, [cartItems]);

	return (
		<div className="flex justify-between items-center p-4 bg-gray-800 text-white">
			<h1 className="text-2xl font-semibold">
				<button
					type="button"
					onClick={() => {
						window.location.href = "/";
					}}
					className="cursor-pointer bg-transparent border-none text-white p-0"
				>
					Munch
				</button>
			</h1>
			<div className="flex items-center space-x-2">
				<FaShoppingCart className="text-2xl" />
				<span className="text-xl font-medium">{amount}</span>
			</div>
		</div>
	);
};

export default Navbar;
