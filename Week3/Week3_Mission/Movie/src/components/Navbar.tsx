import {Link} from 'react-router-dom'

const Navbar = () =>{
    return(
        <nav className="flex mt-[5vh] ml-[5vw] gap-[1vw] items-center">
            <Link to="/" className="px-6 py-3 bg-purple-200 text-purple-900 font-semibold rounded-xl 
                   hover:bg-purple-300 transition-colors duration-200 shadow-md whitespace-nowrap">Home</Link>
            
            <Link to="/movies" className="px-6 py-3 bg-purple-200 text-purple-900 font-semibold rounded-xl 
                   hover:bg-purple-300 transition-colors duration-200 shadow-md whitespace-nowrap">Popular</Link>

            <Link to="/now" className="px-6 py-3 bg-purple-200 text-purple-900 font-semibold rounded-xl 
                   hover:bg-purple-300 transition-colors duration-200 shadow-md whitespace-nowrap">Now</Link>
        </nav>
    )
}

export default Navbar;