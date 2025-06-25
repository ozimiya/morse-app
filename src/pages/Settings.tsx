import { useSettings } from '../context/SettingsContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const {
    lengthFilter,
    playbackSpeed,
    setPlaybackSpeed,
  } = useSettings();

  const navigate = useNavigate();

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          再生速度：
          <input
            type="range"
            min={7}
            max={20}
            step={1}
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
          />
          <span>{playbackSpeed} WPM</span>
        </label>
      </div>

      <button onClick={() => navigate(-1)} className="button-primary">
        戻ル
      </button>
    </div>
  );
};

export default Settings;
