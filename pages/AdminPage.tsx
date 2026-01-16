
import React, { useState, useRef, useEffect } from 'react';
import { Concept, PhotoboothSettings } from '../types';
import { 
  uploadOverlayToGas, 
  saveSettingsToGas, 
  saveConceptsToGas
} from '../lib/appsScript';
import { DEFAULT_GAS_URL } from '../constants';

interface AdminPageProps {
  settings: PhotoboothSettings;
  concepts: Concept[];
  onSaveSettings: (settings: PhotoboothSettings) => void;
  onSaveConcepts: (concepts: Concept[]) => void;
  onBack: () => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ settings, concepts, onSaveSettings, onSaveConcepts, onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [localSettings, setLocalSettings] = useState(settings);
  const [localConcepts, setLocalConcepts] = useState(concepts);
  const [gasUrl, setGasUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'settings' | 'concepts'>('settings');
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedUrl = localStorage.getItem('APPS_SCRIPT_BASE_URL') || DEFAULT_GAS_URL;
    setGasUrl(savedUrl);
  }, []);

  const handleLogin = () => {
    if (pin === settings.adminPin) {
      setIsAuthenticated(true);
    } else {
      alert('INVALID SECURITY PIN');
      setPin('');
    }
  };

  const handleSaveSettings = async () => {
    localStorage.setItem('APPS_SCRIPT_BASE_URL', gasUrl);
    const ok = await saveSettingsToGas(localSettings, settings.adminPin);
    if (ok) {
      onSaveSettings(localSettings);
      alert('Settings saved and synced to cloud');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center p-6 bg-[#050505]">
        <h2 className="text-3xl font-heading mb-10 neon-text italic uppercase">SECURE ACCESS</h2>
        <div className="glass-card p-8 flex flex-col items-center gap-8 w-full max-w-sm">
          <input 
            type="password" 
            placeholder="PIN" 
            className="bg-black/50 border-2 border-white/5 px-6 py-5 text-center text-3xl outline-none focus:border-purple-500 w-full font-mono"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button onClick={handleLogin} className="w-full py-5 bg-purple-600 font-heading tracking-widest uppercase">AUTHORIZE</button>
          <button onClick={onBack} className="text-gray-500 uppercase text-[10px] tracking-widest">Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col p-6 md:p-10 bg-[#050505] overflow-y-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 max-w-7xl mx-auto w-full border-b border-white/5 pb-10 gap-8">
        <h2 className="text-2xl font-heading text-white neon-text italic uppercase">SYSTEM_ROOT</h2>
        <div className="flex bg-white/5 p-1 rounded-xl">
          {(['settings', 'concepts'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg text-[10px] font-bold tracking-[0.3em] uppercase transition-all ${activeTab === tab ? 'bg-purple-600 text-white shadow-xl shadow-purple-900/40' : 'text-gray-500 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button onClick={() => setIsAuthenticated(false)} className="px-10 py-4 border-2 border-red-900/40 text-red-500 uppercase tracking-widest text-xs italic">Disconnect</button>
      </div>

      <div className="max-w-7xl mx-auto w-full pb-24">
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="glass-card p-6 md:p-10 flex flex-col gap-8 h-fit">
              <h3 className="font-heading text-xl text-purple-400 border-b border-white/5 pb-4 uppercase italic">Global Identity</h3>
              
              <div className="flex flex-col gap-3">
                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Event Name (Title Utama)</label>
                <input 
                  className="bg-black/50 border border-white/10 p-4 font-mono text-xs text-white focus:border-purple-500 outline-none transition-colors" 
                  value={localSettings.eventName} 
                  onChange={e => setLocalSettings({...localSettings, eventName: e.target.value})}
                  placeholder="CORO AI PHOTOBOOTH"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Event Description (Tagline)</label>
                <input 
                  className="bg-black/50 border border-white/10 p-4 font-mono text-xs text-white focus:border-purple-500 outline-none transition-colors" 
                  value={localSettings.eventDescription} 
                  onChange={e => setLocalSettings({...localSettings, eventDescription: e.target.value})}
                  placeholder="Transform Your Reality"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Google Drive Folder ID</label>
                <input 
                  className="bg-black/50 border border-white/10 p-4 font-mono text-xs text-white focus:border-purple-500 outline-none transition-colors" 
                  value={localSettings.folderId} 
                  onChange={e => setLocalSettings({...localSettings, folderId: e.target.value})}
                  placeholder="Masukkan Folder ID dari Drive"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Apps Script URL</label>
                <input 
                  className="bg-black/50 border border-white/10 p-4 font-mono text-[10px] text-purple-300 focus:border-purple-500 outline-none" 
                  value={gasUrl} 
                  onChange={e => setGasUrl(e.target.value)} 
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Security PIN</label>
                <input 
                  type="text"
                  className="bg-black/50 border border-white/10 p-4 font-mono text-xs text-white focus:border-purple-500 outline-none" 
                  value={localSettings.adminPin} 
                  onChange={e => setLocalSettings({...localSettings, adminPin: e.target.value})} 
                />
              </div>

              <button onClick={handleSaveSettings} className="w-full py-6 bg-green-800 hover:bg-green-700 text-white font-heading tracking-widest uppercase italic mt-6 transition-all">SAVE SETTINGS</button>
            </div>

            <div className="glass-card p-6 md:p-10 flex flex-col gap-8 border-white/10 h-fit text-center">
              <h3 className="font-heading text-xl text-purple-400 border-b border-white/5 pb-4 uppercase italic">Overlay Asset</h3>
              <div className="flex flex-col gap-6">
                <div className={`aspect-[9/16] bg-white/5 border border-white/10 rounded-lg flex items-center justify-center overflow-hidden mx-auto shadow-2xl ${localSettings.orientation === 'portrait' ? 'w-32' : 'w-64 aspect-video'}`}>
                  {localSettings.overlayImage ? (
                    <img src={localSettings.overlayImage} className="w-full h-full object-contain" alt="Overlay" />
                  ) : (
                    <span className="text-[10px] text-gray-700 font-mono">NO_OVERLAY</span>
                  )}
                </div>
                <input type="file" accept="image/png" className="hidden" ref={fileInputRef} onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setIsUploading(true);
                  const reader = new FileReader();
                  reader.onload = async () => {
                    const res = await uploadOverlayToGas(reader.result as string, settings.adminPin);
                    if (res.ok) {
                      setLocalSettings({...localSettings, overlayImage: res.url});
                      alert('Overlay updated');
                    } else {
                      alert('Upload error');
                    }
                    setIsUploading(false);
                  };
                  reader.readAsDataURL(file);
                }} />
                <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="w-full py-4 border-2 border-white/10 hover:border-purple-500 text-[10px] tracking-widest font-bold uppercase transition-all bg-white/5">
                  {isUploading ? 'UPLOADING...' : 'CHANGE PNG OVERLAY'}
                </button>
                <p className="text-[9px] text-gray-500 uppercase font-mono italic">Recommended: transparent PNG (1080x1920)</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'concepts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-16">
            {localConcepts.map((concept, index) => (
              <div key={concept.id} className="glass-card p-6 flex flex-col sm:flex-row gap-8">
                <div className="w-24 aspect-[9/16] bg-white/5 border border-white/10 rounded-xl shrink-0 overflow-hidden relative group shadow-lg">
                  <img src={concept.thumbnail} className="w-full h-full object-cover" />
                  <label className="absolute inset-0 bg-purple-600/80 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer text-[10px] uppercase font-bold text-white transition-opacity">
                    Update
                    <input type="file" className="hidden" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          const nc = [...localConcepts];
                          nc[index].thumbnail = reader.result as string;
                          setLocalConcepts(nc);
                        };
                        reader.readAsDataURL(file);
                      }
                    }} />
                  </label>
                </div>
                <div className="flex-1 flex flex-col gap-4">
                  <input className="bg-transparent border-b border-white/20 p-2 font-heading uppercase italic text-white outline-none focus:border-purple-500" value={concept.name} onChange={e => {
                    const nc = [...localConcepts];
                    nc[index].name = e.target.value;
                    setLocalConcepts(nc);
                  }} />
                  <textarea className="bg-black/50 border border-white/5 p-3 text-[10px] font-mono h-24 text-gray-400 outline-none focus:border-white/20 resize-none" value={concept.prompt} onChange={e => {
                    const nc = [...localConcepts];
                    nc[index].prompt = e.target.value;
                    setLocalConcepts(nc);
                  }} />
                </div>
              </div>
            ))}
            <div className="col-span-full flex justify-center mt-10">
              <button onClick={async () => {
                const ok = await saveConceptsToGas(localConcepts, settings.adminPin);
                if (ok) { onSaveConcepts(localConcepts); alert('Concepts updated on cloud'); }
              }} className="px-20 py-6 bg-purple-600 font-heading tracking-widest uppercase italic shadow-2xl hover:bg-purple-500 transition-all">SYNC ALL CONCEPTS</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
