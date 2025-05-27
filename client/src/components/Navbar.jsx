import "../css/Navbar.css";

export default function Navbar() {
  return (
    <div>
      <nav className="navbar">
        <div className="navbar-logo" style={{color:"#669",fontWeight:700,fontFamily:"Lato, sans-serif"}}>RateYourOutfit</div>
        <ul className="navbar-links">
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">About</a>
          </li>
          <li>
            <a href="#">Services</a>
          </li>
          <li>
            <a href="#">Contact</a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
