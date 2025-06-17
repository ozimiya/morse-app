import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="app-header">
      <nav>
        <ul>
          <li><Link to="/">一文字</Link></li>
          <li><Link to="/words">単語</Link></li>
          <li><Link to="/settings">設定</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
