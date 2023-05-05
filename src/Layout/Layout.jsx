import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import '../styles/main.css'

const Layout = (props) => {
  const { user, setUser } = props
  return (
    <div className="App">
      <Header user={user} setUser={setUser} />
      <div id="content">
        <Outlet />
      </div>
      <Footer /> 
    </div>

  )
};

export default Layout;
