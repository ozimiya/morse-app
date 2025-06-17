import { useSettings } from '../context/SettingsContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const {
    lengthFilter,
    playbackSpeed,
    setLengthFilter,
    setPlaybackSpeed,
  } = useSettings();

  const navigate = useNavigate();

  return (
    <div style={{ padding: '1rem' }}>
      {/* <h2>⚙️ 設定</h2> */}

      <div style={{ marginBottom: '1rem' }}>
        <label>
          出題文字数：
          <select
            value={lengthFilter}
            onChange={(e) => setLengthFilter(Number(e.target.value))}
            style={{ marginLeft: '0.5rem', fontSize: '1rem' }}
          >
            <option value={0}>指定なし</option>
            <option value={2}>2文字</option>
            <option value={3}>3文字</option>
            <option value={4}>4文字</option>
            <option value={5}>5文字</option>
          </select>
        </label>
      </div>

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
