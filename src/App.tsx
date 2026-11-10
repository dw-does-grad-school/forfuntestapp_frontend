import { useEffect, useState, type FormEvent } from "react";
import { SignIn, SignOutButton, useAuth, useUser } from "@clerk/react";
import { useMutation, useQuery } from "convex/react";
import {
  ArrowUpRight,
  Bike,
  Check,
  ChevronRight,
  CircleHelp,
  Footprints,
  Moon,
  Plus,
  Sun,
  Waves,
} from "lucide-react";
import { api } from "./api";

const goals = [
  { id: "basic", title: "Basic triathlon", detail: "Build a steady foundation across all three disciplines." },
  { id: "half", title: "Ironman 70.3", detail: "A 1.9 km swim, 90 km ride, and 21.1 km run." },
  { id: "full", title: "Full Ironman", detail: "The full-distance challenge: 3.8 km, 180 km, and 42.2 km." },
] as const;

const disciplines = [
  { id: "swim", label: "Swim", icon: Waves },
  { id: "bike", label: "Bike", icon: Bike },
  { id: "run", label: "Run", icon: Footprints },
] as const;

const skillLevels = [
  { id: "new", title: "Getting started", description: "I'm new to structured training" },
  { id: "building", title: "Finding my rhythm", description: "I train occasionally or have some experience" },
  { id: "confident", title: "Feeling strong", description: "I train regularly and know my pace" },
] as const;

const equipmentOptions = [
  { id: "goggles", name: "Swim goggles", category: "Swim" },
  { id: "cap", name: "Swim cap", category: "Swim" },
  { id: "wetsuit", name: "Wetsuit", category: "Swim" },
  { id: "pull-buoy", name: "Pull buoy", category: "Swim" },
  { id: "road-bike", name: "Road bike", category: "Bike" },
  { id: "helmet", name: "Helmet", category: "Bike" },
  { id: "cycling-shoes", name: "Cycling shoes", category: "Bike" },
  { id: "bike-computer", name: "Bike computer", category: "Bike" },
  { id: "running-shoes", name: "Running shoes", category: "Run" },
  { id: "gps-watch", name: "GPS watch", category: "Run" },
  { id: "race-belt", name: "Race belt", category: "Run" },
] as const;

type Theme = "light" | "dark" | "system";
type Goal = (typeof goals)[number]["id"];
type Skill = (typeof skillLevels)[number]["id"];
type Discipline = (typeof disciplines)[number]["id"];
type Skills = Record<Discipline, Skill>;

const emptySkills: Skills = { swim: "new", bike: "new", run: "new" };

export default function App() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("forme-theme");
    return saved === "light" || saved === "dark" ? saved : "system";
  });
  const [goal, setGoal] = useState<Goal>("basic");
  const [skills, setSkills] = useState<Skills>(emptySkills);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [customEquipment, setCustomEquipment] = useState<string[]>([]);
  const [newEquipment, setNewEquipment] = useState("");
  const [notice, setNotice] = useState("");
  const profile = useQuery(api.profiles.get, isSignedIn ? {} : "skip");
  const saveProfile = useMutation(api.profiles.save);

  useEffect(() => {
    document.documentElement.dataset.theme = theme === "system" ? "" : theme;
    if (theme === "system") delete document.documentElement.dataset.theme;
    localStorage.setItem("forme-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!profile) return;
    setGoal(profile.goal);
    setSkills(profile.skills);
    setSelectedEquipment(profile.equipment);
    setCustomEquipment(profile.customEquipment);
  }, [profile]);

  const toggleEquipment = (name: string) => {
    setSelectedEquipment((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name],
    );
  };

  const addEquipment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = newEquipment.trim();
    if (!name) return;
    const alreadyAdded = [...equipmentOptions.map(({ name: option }) => option), ...customEquipment]
      .some((option) => option.toLowerCase() === name.toLowerCase());
    if (alreadyAdded) {
      setNotice("That item is already in your equipment list.");
      return;
    }
    setCustomEquipment((items) => [...items, name]);
    setSelectedEquipment((items) => [...items, name]);
    setNewEquipment("");
    setNotice(`${name} added to your equipment.`);
  };

  const handleSave = async () => {
    setNotice("");
    try {
      await saveProfile({ goal, skills, equipment: selectedEquipment, customEquipment });
      setNotice("Your training profile is saved.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "We couldn't save your profile. Please try again.");
    }
  };

  if (!isSignedIn) {
    return (
      <main className="signin-page">
        <header className="topbar">
          <a className="wordmark" href="/">FORME<span>.</span></a>
          <ThemeButton theme={theme} onChange={setTheme} />
        </header>
        <div className="signin-layout">
          <section className="signin-copy">
            <p className="eyebrow"><span className="live-dot" /> YOUR TRAINING, IN FORM</p>
            <h1>Make room<br />for your <em>next.</em></h1>
            <p className="intro">A training home built around you, your starting point, and the finish line you have in mind.</p>
            <div className="discipline-list">
              {disciplines.map(({ id, label, icon: Icon }) => (
                <span key={id}><Icon size={17} strokeWidth={1.7} />{label}</span>
              ))}
            </div>
            <p className="signin-footnote">Three disciplines. One personal plan.</p>
          </section>
          <section className="signin-card">
            <div className="card-kicker"><span>01</span><span>YOUR STARTING LINE</span></div>
            <h2>Sign in to get started</h2>
            <p className="muted">Set your sights. We’ll take it from there.</p>
            <SignIn
              routing="hash"
              appearance={{
                elements: {
                  rootBox: "clerk-root",
                  card: "clerk-card",
                  headerTitle: "clerk-title",
                  headerSubtitle: "clerk-subtitle",
                  socialButtonsBlockButton: "clerk-social-button",
                  formButtonPrimary: "clerk-primary",
                  footerActionLink: "clerk-link",
                },
              }}
            />
            <p className="privacy-note"><CircleHelp size={14} /> Your training profile stays yours.</p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="wordmark" href="/">FORME<span>.</span></a>
        <div className="topbar-right">
          <span className="user-greeting">YOUR TRAINING BASE</span>
          <ThemeButton theme={theme} onChange={setTheme} />
          <div className="account-chip">
            <span className="avatar">{user?.firstName?.[0] ?? "A"}</span>
            <span className="account-name">{user?.firstName ?? "Athlete"}</span>
            <SignOutButton><button className="signout-button" type="button">Sign out</button></SignOutButton>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="live-dot" /> YOUR PERSONAL TRAINING BASE</p>
          <h1>Build toward<br />your <em>next.</em></h1>
          <p>Start where you are. Tell us where you want to go.</p>
        </div>
        <div className="hero-stamp" aria-hidden="true">
          <span>SWIM</span><span className="stamp-line" /><span>BIKE</span><span className="stamp-line" /><span>RUN</span>
          <strong>01</strong>
        </div>
        <div className="hero-index"><span>TRAINING PROFILE</span><span>01 / 01</span></div>
      </section>

      <section className="setup-card">
        <div className="section-heading">
          <div><p className="eyebrow">YOUR FOUNDATION</p><h2>Let's get to know you.</h2></div>
          <span className="section-mark">A / 01</span>
        </div>

        {profile === undefined ? (
          <div className="loading-state"><span className="spinner" /> Loading your training profile</div>
        ) : (
          <div className="form-content">
            <section className="form-section">
              <div className="section-title"><span className="step-number">01</span><div><h3>What are you training for?</h3><p>Choose the finish line that feels right.</p></div></div>
              <div className="goal-grid">
                {goals.map((option, index) => (
                  <button
                    className={`goal-card ${goal === option.id ? "is-selected" : ""}`}
                    key={option.id}
                    type="button"
                    aria-pressed={goal === option.id}
                    onClick={() => setGoal(option.id)}
                  >
                    <span className="goal-index">0{index + 1}</span>
                    <span className="goal-title">{option.title}</span>
                    <span className="goal-detail">{option.detail}</span>
                    <span className="selection-mark">{goal === option.id && <Check size={14} />}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="form-section">
              <div className="section-title"><span className="step-number">02</span><div><h3>Where are you starting?</h3><p>Every level is a good place to begin.</p></div></div>
              <div className="skills-table">
                {disciplines.map(({ id, label, icon: Icon }) => (
                  <div className="skill-row" key={id}>
                    <div className="sport-label"><Icon size={18} /><span>{label}</span></div>
                    <div className="skill-options">
                      {skillLevels.map((level) => (
                        <button
                          key={level.id}
                          type="button"
                          className={`skill-option ${skills[id] === level.id ? "is-selected" : ""}`}
                          aria-pressed={skills[id] === level.id}
                          onClick={() => setSkills((current) => ({ ...current, [id]: level.id }))}
                        >
                          <span className="radio-dot" /><span>{level.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="form-section equipment-section">
              <div className="section-title"><span className="step-number">03</span><div><h3>What do you have on hand?</h3><p>Pick what you own. You can add anything we missed.</p></div></div>
              {disciplines.map(({ label }) => (
                <div className="equipment-group" key={label}>
                  <h4>{label}</h4>
                  <div className="equipment-items">
                    {equipmentOptions.filter((option) => option.category === label).map(({ id, name }) => (
                      <EquipmentChip key={id} name={name} selected={selectedEquipment.includes(name)} onClick={() => toggleEquipment(name)} />
                    ))}
                    {customEquipment.filter((name) => {
                      const knownItem = equipmentOptions.some((item) => item.name.toLowerCase() === name.toLowerCase());
                      const categoryIsInferred = label === "Bike" ? /bike|cycle|helmet|pedal|trainer/i.test(name) : label === "Swim" ? /swim|goggle|cap|wetsuit/i.test(name) : /run|shoe|sock/i.test(name);
                      return !knownItem && categoryIsInferred;
                    }).map((name) => (
                      <EquipmentChip key={name} name={name} selected={selectedEquipment.includes(name)} onClick={() => toggleEquipment(name)} custom />
                    ))}
                  </div>
                </div>
              ))}
              {customEquipment.filter((name) => !/(bike|cycle|helmet|pedal|trainer|swim|goggle|cap|wetsuit|run|shoe|sock)/i.test(name)).length > 0 && (
                <div className="equipment-group">
                  <h4>Other</h4>
                  <div className="equipment-items">
                    {customEquipment.filter((name) => !/(bike|cycle|helmet|pedal|trainer|swim|goggle|cap|wetsuit|run|shoe|sock)/i.test(name)).map((name) => (
                      <EquipmentChip key={name} name={name} selected={selectedEquipment.includes(name)} onClick={() => toggleEquipment(name)} custom />
                    ))}
                  </div>
                </div>
              )}
              <form className="add-equipment" onSubmit={addEquipment}>
                <label htmlFor="custom-equipment">Missing something?</label>
                <div className="add-equipment-control">
                  <input id="custom-equipment" value={newEquipment} onChange={(event) => setNewEquipment(event.target.value)} placeholder="Add your own equipment" maxLength={60} />
                  <button type="submit" aria-label="Add equipment" disabled={!newEquipment.trim()}><Plus size={16} /><span>Add item</span></button>
                </div>
              </form>
            </section>

            <div className="save-row">
              <div className="save-message" role="status">{notice && <><Check size={15} />{notice}</>}</div>
              <button className="save-button" type="button" onClick={handleSave}>
                Save your profile <ArrowUpRight size={17} />
              </button>
            </div>
          </div>
        )}
      </section>
      <footer className="page-footer"><span>FORME / TRAINING PROFILE</span><span>START WHERE YOU ARE <ChevronRight size={13} /> BUILD FROM THERE</span></footer>
    </main>
  );
}

function ThemeButton({ theme, onChange }: { theme: Theme; onChange: (theme: Theme) => void }) {
  const nextTheme = theme === "dark" ? "light" : theme === "light" ? "system" : "dark";
  const label = theme === "system" ? "System appearance" : `${theme} appearance`;
  const Icon = theme === "light" ? Sun : Moon;
  return (
    <button className="theme-toggle" type="button" title={`${label}. Click to switch.`} aria-label={`${label}. Click to switch.`} onClick={() => onChange(nextTheme)}>
      <Icon size={17} />
    </button>
  );
}

function EquipmentChip({ name, selected, onClick, custom = false }: { name: string; selected: boolean; onClick: () => void; custom?: boolean }) {
  return (
    <button type="button" className={`equipment-chip ${selected ? "is-selected" : ""}`} aria-pressed={selected} onClick={onClick}>
      <span className="chip-check">{selected && <Check size={12} />}</span>{name}{custom && <span className="custom-tag">ADDED</span>}
    </button>
  );
}
