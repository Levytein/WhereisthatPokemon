import { Link } from "react-router-dom"
function Header(){
    return (
    <div className='header'>
                  <Link to={`/`} >Where's that Pokémon?</Link>
        </div>
        )
            ;

}

export default Header;