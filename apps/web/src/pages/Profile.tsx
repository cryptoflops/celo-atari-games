import { useState } from 'react';
import type { FC, FormEvent, ChangeEvent } from 'react';
import { useWallet } from '../hooks/useWallet';
import { useProfile, type ProfileData } from '../hooks/useProfile';
import { Panel } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { StatusLight } from '../components/StatusLight';

const Field: FC<{
  label: string;
  name: keyof ProfileData;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  prefix?: string;
}> = ({ label, name, value, onChange, placeholder, prefix }) => (
  <div>
    <label htmlFor={`profile-${name}`} className="tech-label block mb-2" style={{ fontSize: '13px' }}>
      {label}
    </label>
    <div className="relative">
      {prefix && (
        <span
          aria-hidden="true"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/40"
          style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}
        >
          {prefix}
        </span>
      )}
      <input
        id={`profile-${name}`}
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="sega-input"
        style={prefix ? { paddingLeft: '32px' } : undefined}
      />
    </div>
  </div>
);

export const Profile: FC = () => {
  const { address, isConnected, connect, isMiniPayWallet } = useWallet();
  const profile = useProfile();

  const [formData, setFormData] = useState<ProfileData>({
    username: profile.username,
    twitter: profile.twitter,
    farcaster: profile.farcaster,
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    profile.updateProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="flex flex-col items-center py-8 px-4 max-w-xl mx-auto w-full">
      <header className="text-center mb-8 w-full">
        <h1 className="pixel-title mb-3" style={{ fontSize: '27px' }}>
          Player profile
        </h1>
        <p className="text-cream/70 mx-auto" style={{ fontSize: '15px', lineHeight: 1.35, maxWidth: '46ch' }}>
          Manage your credentials, link your web3 socials, and confirm your on-chain standing.
        </p>
      </header>

      <Panel className="w-full">
        <div className="machine-label machine-label--yellow mb-5">Identity</div>

        {/* Wallet section */}
        <section className="mb-8">
          <h2 className="tech-label text-white/45 mb-3" style={{ fontSize: '13px' }}>Wallet connection</h2>
          {isConnected && address ? (
            <div className="sega-card-stats flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex items-center justify-center"
                  style={{
                    width: 44, height: 44,
                    background: 'var(--color-surface)',
                    border: '2px solid var(--color-ink)',
                    boxShadow: '2px 2px 0 var(--color-arcade-shadow)',
                    fontSize: '20px',
                  }}
                >
                  {isMiniPayWallet ? '▣' : '◆'}
                </span>
                <div>
                  <div className="font-arcade text-cream" style={{ fontSize: '15px' }}>
                    {address.slice(0, 6)}…{address.slice(-4)}
                  </div>
                  <StatusLight kind="live" label={`Connected via ${isMiniPayWallet ? 'MiniPay' : 'injected'}`} />
                </div>
              </div>
              <Badge status="verified" label="On-chain" />
            </div>
          ) : (
            <Panel variant="locked" className="text-center" role="status">
              <p className="tech-label text-white/55 mb-4" style={{ fontSize: '13px' }}>No wallet linked to this browser session</p>
              <Button onClick={connect} variant="primary">Connect wallet</Button>
            </Panel>
          )}
        </section>

        {/* Social registry form */}
        <section>
          <h2 className="tech-label text-white/45 mb-4" style={{ fontSize: '13px' }}>Social registry</h2>
          <form onSubmit={handleSave} className="flex flex-col gap-5">
            <Field label="Arcade alias" name="username" value={formData.username} onChange={handleChange} placeholder="e.g. Satoshi" />
            <Field label="X (Twitter) profile" name="twitter" value={formData.twitter} onChange={handleChange} placeholder="username" prefix="@" />
            <Field label="Farcaster identity" name="farcaster" value={formData.farcaster} onChange={handleChange} placeholder="username" prefix="@" />

            <Button type="submit" variant={isSaved ? 'secondary' : 'primary'} fullWidth className="py-4 mt-1">
              {isSaved ? '✓ Registry secured' : 'Save profile'}
            </Button>
          </form>
          <p className="tech-label text-white/45 mt-4 text-center" style={{ fontSize: '13px' }}>
            Profile data is stored locally (browser only). On-chain persistence coming soon.
          </p>
        </section>
      </Panel>
    </div>
  );
};

export default Profile;
