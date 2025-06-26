import { useSettings } from '../context/SettingsContext';
import { useNavigate } from 'react-router-dom';
import '../styles/components.css';
import './Settings.css';

const Settings = () => {
  const {
    playbackSpeed,
    setPlaybackSpeed,
  } = useSettings();

  const navigate = useNavigate();

  return (
    <div className="settings-container">
      <div className="settings-section">
        <div className="wpm-wrap">
          <label htmlFor="speed">再生速度：</label>
          <span>{playbackSpeed} WPM</span>
        </div>
        <input
          id="speed"
          type="range"
          min={7}
          max={20}
          step={1}
          value={playbackSpeed}
          onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
        />
      </div>

      <button onClick={() => navigate(-1)} className="button-primary">
        戻る
      </button>
    </div>
  );
};

export default Settings;
