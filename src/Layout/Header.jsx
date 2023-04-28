import { SignIn } from "../Screens/SignIn"
import { SignOut } from "../Screens/SignOut"

const Header = (props) => {
    const { user } = props
    return(
    <header className="App-header">
        <div className='title'>
            <a href='/'>
                First Star
            </a>
        </div>
        <div id="userHeader">
        <span id="user">{user?user.displayName:''}</span>
            {user ? <SignOut /> : <SignIn />}
        </div>
    </header>
    )
}

export default Header