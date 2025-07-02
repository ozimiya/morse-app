import { NavLink } from 'react-router-dom';
import './Header.css';
import { APP_VERSION } from '../data/version';

const version = APP_VERSION;

const Header = () => {
  return (
    <header className="app-header">
      <nav>
        <ul className="nav-list">
          <li>
            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              一文字
            </NavLink>
          </li>
          <li>
            <NavLink to="/words" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              単語
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              速度設定
            </NavLink>
          </li>
        </ul>
        <span className="version-badge">v{version}</span>
      </nav>
    </header>
  );
};

export default Header;
