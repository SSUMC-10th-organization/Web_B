import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="flex items-center justify-between px-6 py-4 bg-[#111] border-b border-[#222]">
      <div className="container mx-auto text-center text-gray-400">
        <p>&copy;{new Date().getFullYear()} LP. All rights reserved.</p>
        <div className={"flex justify-center space-x-4 mt-4"}>
          <Link to={"#"}>Privacy Policy</Link>
          <Link to={"#"}>Terms of Service</Link>
          <Link to={"#"}>Contact</Link>
        </div>
      </div>
    </footer>
  );
};
