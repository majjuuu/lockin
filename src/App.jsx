import React, { useState, useEffect, useRef } from "react";
import {
  Lock, Flame, Target, Settings as SettingsIcon, Users, Home as HomeIcon,
  Award, Play, Pause, Square, Coffee, Plus, ChevronLeft, Check, Clock, Minus
} from "lucide-react";
import { LineChart, Line, XAxis, ResponsiveContainer } from "recharts";

/* ------------------------------------------------------------------ */
/*  LockIn — single-user core prototype                                */
/*  One component, a `screen` state acts as the router, and all app    */
/*  data lives in React state (in memory — it resets on reload).       */
/* ------------------------------------------------------------------ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700;800&display=swap');

.li-root{
  --bg:#F0E9DA; --shell:#FBEFB6; --card:#FCF7E6; --ink:#3C342A;
  --muted:#9C9081; --brown:#574B3E; --brown-d:#3F352B; --track:#E8DFCB;
  --pink:#F58BB0; --coral:#F26A5A; --orange:#F4A24C; --yellow:#F7D154;
  font-family:'Nunito',sans-serif; color:var(--ink);
  min-height:100%; width:100%; display:flex; justify-content:center;
  background:var(--bg); position:relative; overflow:hidden;
}
.li-root *{box-sizing:border-box;}
.li-blob{position:absolute;border-radius:50%;filter:blur(60px);opacity:.55;pointer-events:none;animation:drift 18s ease-in-out infinite alternate;}
@keyframes drift{from{transform:translate(0,0) scale(1);}to{transform:translate(30px,-20px) scale(1.1);}}

.li-phone{
  width:100%; max-width:420px; min-height:100vh; background:var(--shell);
  position:relative; display:flex; flex-direction:column;
  box-shadow:0 20px 60px rgba(80,60,30,.18); z-index:1;
}
@media(min-width:460px){ .li-phone{ margin:24px 0; min-height:auto; height:860px; border-radius:38px; overflow:hidden; } }

.li-screen{flex:1; overflow-y:auto; padding:22px 20px 96px; animation:fade .4s ease;}
@keyframes fade{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}

.li-h1{font-family:'Fredoka';font-weight:600;font-size:26px;margin:0;}
.li-brand{font-family:'Fredoka';font-weight:600;display:flex;align-items:center;gap:6px;color:var(--brown);}
.li-sub{color:var(--muted);font-size:14px;}

.li-card{background:var(--card);border-radius:20px;padding:16px;border:1px solid rgba(87,75,62,.08);box-shadow:0 4px 14px rgba(120,90,40,.06);}
.li-btn{font-family:'Fredoka';font-weight:500;border:none;cursor:pointer;border-radius:16px;background:var(--brown);color:#FBF4DC;padding:14px;width:100%;font-size:16px;transition:transform .08s,background .15s;}
.li-btn:active{transform:scale(.97);background:var(--brown-d);}
.li-btn.ghost{background:var(--card);color:var(--ink);border:1px solid rgba(87,75,62,.18);}
.li-chip{font-family:'Nunito';font-weight:700;font-size:13px;border:1.5px solid rgba(87,75,62,.18);background:var(--card);border-radius:12px;padding:9px 12px;cursor:pointer;transition:.15s;}
.li-chip.on{border-color:#4d94ff;background:#eef4ff;}
.li-field{width:100%;border:1px solid rgba(87,75,62,.15);border-radius:14px;padding:13px 14px;background:#FFFDF6;font-family:'Nunito';font-size:15px;outline:none;}
.li-field:focus{border-color:var(--orange);}

.li-track{height:12px;border-radius:8px;background:var(--track);overflow:hidden;}
.li-fill{height:100%;border-radius:8px;background:var(--brown);transition:width .4s;}

.li-tile{flex:1;background:var(--card);border-radius:18px;padding:16px;border:1px solid rgba(87,75,62,.08);cursor:pointer;display:flex;flex-direction:column;gap:8px;align-items:flex-start;transition:transform .08s;}
.li-tile:active{transform:scale(.97);}

.li-nav{position:absolute;bottom:0;left:0;right:0;height:72px;background:var(--card);border-top:1px solid rgba(87,75,62,.1);display:flex;justify-content:space-around;align-items:center;z-index:5;}
.li-navb{background:none;border:none;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px;color:var(--muted);font-size:10px;font-weight:700;font-family:'Nunito';padding:6px 10px;border-radius:12px;transition:.15s;}
.li-navb.on{color:var(--brown);}

.li-toggle{width:46px;height:26px;border-radius:20px;border:none;cursor:pointer;position:relative;transition:.2s;}
.li-knob{position:absolute;top:3px;width:20px;height:20px;border-radius:50%;background:#fff;transition:.2s;box-shadow:0 1px 3px rgba(0,0,0,.25);}

.li-step{display:flex;align-items:center;gap:10px;}
.li-stepb{width:32px;height:32px;border-radius:10px;border:1px solid rgba(87,75,62,.2);background:var(--card);cursor:pointer;display:flex;align-items:center;justify-content:center;}
`;

const F = "Fredoka, sans-serif";

/* tiny reusable toggle */
function Toggle({ on, onClick }) {
  return (
    <button className="li-toggle" onClick={onClick}
      style={{ background: on ? "var(--coral)" : "var(--track)" }}>
      <span className="li-knob" style={{ left: on ? 23 : 3 }} />
    </button>
  );
}

function Header({ title, onHome }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
      <button onClick={onHome} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "var(--brown)" }}>
        <ChevronLeft size={22} /> <span style={{ fontFamily: F, fontWeight: 500 }}>Home</span>
      </button>
      <span style={{ fontFamily: F, fontWeight: 600, fontSize: 18 }}>{title}</span>
      <span style={{ width: 60 }} />
    </div>
  );
}

export default function LockInApp() {
  const [screen, setScreen] = useState("login");

  // --- shared app state -------------------------------------------------
  const [streak] = useState(67);
  const [weekly, setWeekly] = useState({ done: 15, total: 20 });   // hours
  const [today, setToday] = useState({ mins: 80, goal: 180 });     // minutes
  const [settings, setSettings] = useState({
    shortBreak: 5, longBreak: 15,
    enableAll: false, study: false, breakR: true, streakR: true,
    dndAuto: true, dndBlock: false, dndCalls: true, dndPop: false,
  });
  const [goals, setGoals] = useState([
    { id: 1, title: "Complete Calculus", note: "1 hr / day", pct: 75, detail: "7.5 / 10h", milestone: "Final in 4 days", group: false },
    { id: 2, title: "Finish Group Business Analysis", note: "Shared", pct: 80, detail: "Shared progress", milestone: "Status: Shared", group: true },
  ]);

  const set = (k, v) => setSettings(s => ({ ...s, [k]: v }));

  // --- pomodoro timer ---------------------------------------------------
  const [timer, setTimer] = useState({ mode: "idle", remaining: 0, running: false });
  const [taskName, setTaskName] = useState("Physics 240");
  const intervalRef = useRef(null);
  const lens = { focus: 25 * 60, short: settings.shortBreak * 60, long: settings.longBreak * 60 };

  useEffect(() => {
    if (timer.running) {
      intervalRef.current = setInterval(() => {
        setTimer(t => {
          if (t.remaining <= 1) {
            if (t.mode === "focus") creditFocus(lens.focus);   // full block completed
            return { ...t, remaining: 0, running: false };
          }
          return { ...t, remaining: t.remaining - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line
  }, [timer.running, timer.mode]);

  const creditFocus = (seconds) => {
    const m = Math.round(seconds / 60);
    setToday(t => ({ ...t, mins: t.mins + m }));
    setWeekly(w => ({ ...w, done: Math.min(w.total, +(w.done + m / 60).toFixed(1)) }));
  };
  const startMode = (mode) => setTimer({ mode, remaining: lens[mode], running: true });
  const togglePause = () => setTimer(t => ({ ...t, running: !t.running }));
  const endSession = () => {
    if (timer.mode === "focus") creditFocus(lens.focus - timer.remaining); // partial credit
    setTimer({ mode: "idle", remaining: 0, running: false });
  };

  const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  /* ===================================================================== */
  /*  SCREENS                                                              */
  /* ===================================================================== */

  const Login = (
    <div className="li-screen" style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingBottom: 22 }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div className="li-brand" style={{ fontSize: 34, justifyContent: "center" }}>
          L<Lock size={26} style={{ margin: "0 -1px" }} />ck in
        </div>
        <div style={{ letterSpacing: 2, fontWeight: 700, marginTop: 8, color: "var(--ink)" }}>WELCOME BACK</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input className="li-field" placeholder="Email" />
        <input className="li-field" placeholder="Password" type="password" />
        <button className="li-btn" style={{ background: "#fff", color: "var(--ink)", border: "1px solid rgba(87,75,62,.18)" }}
          onClick={() => setScreen("discovery")}>Log In</button>
        <div style={{ textAlign: "center", color: "var(--muted)", fontSize: 13, margin: "4px 0" }}>— or continue with —</div>
        <button className="li-btn ghost" onClick={() => setScreen("discovery")}>Continue with Google</button>
        <button className="li-btn" onClick={() => setScreen("discovery")}>Continue with Apple</button>
        <div style={{ textAlign: "center", fontSize: 13, marginTop: 8 }}>
          Don't have an account? <b style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => setScreen("discovery")}>Sign up</b>
        </div>
        <div style={{ textAlign: "center", fontSize: 11, color: "var(--muted)", marginTop: 6 }}>(demo — auth isn't wired up yet)</div>
      </div>
    </div>
  );

  const Discovery = (() => {
    const [stage, setStage] = useState("College");
    const [picked, setPicked] = useState(["Stay Focused"]);
    const [style, setStyle] = useState(["Flexible"]);
    const toggle = (arr, setArr, v) => setArr(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);
    return (
      <div className="li-screen">
        <h2 className="li-h1" style={{ textAlign: "center" }}>Let's set up your Lock In</h2>
        <p className="li-sub" style={{ textAlign: "center", marginTop: 4 }}>Tell us about yourself so we can personalize your experience.</p>

        <div style={{ marginTop: 20, fontWeight: 800 }}>What's your stage?</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
          {["Middle School", "High School", "College", "Adult Learner"].map(s =>
            <button key={s} className={"li-chip" + (stage === s ? " on" : "")} onClick={() => setStage(s)}>{s}</button>)}
        </div>

        <div style={{ marginTop: 18, fontWeight: 800 }}>What are your goals?</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
          {["Stay Focused", "Find Study Buddies", "Get Motivated"].map(s =>
            <button key={s} className={"li-chip" + (picked.includes(s) ? " on" : "")} onClick={() => toggle(picked, setPicked, s)}>{s}</button>)}
        </div>

        <div style={{ marginTop: 18, fontWeight: 800 }}>How do you like to study?</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
          {["Solo & Silent", "Music On", "Flexible", "Pomodoro Timer", "Group Study"].map(s =>
            <button key={s} className={"li-chip" + (style.includes(s) ? " on" : "")} onClick={() => toggle(style, setStyle, s)}>{s}</button>)}
        </div>

        <button className="li-btn" style={{ marginTop: 26 }} onClick={() => setScreen("home")}>Start Locking In</button>
      </div>
    );
  })();

  const Home = (
    <div className="li-screen">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="li-brand" style={{ fontSize: 22 }}>L<Lock size={18} />ck in</div>
        <SettingsIcon size={22} style={{ cursor: "pointer", color: "var(--brown)" }} onClick={() => setScreen("settings")} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "16px 0 14px", fontFamily: F, fontWeight: 500, fontSize: 20 }}>
        Streak: {streak} days <Flame size={20} color="var(--coral)" fill="var(--coral)" />
      </div>

      <div className="li-card">
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800 }}>
          <span>Weekly Goal</span><span>{weekly.done} / {weekly.total} hrs</span>
        </div>
        <div className="li-track" style={{ marginTop: 10 }}>
          <div className="li-fill" style={{ width: `${(weekly.done / weekly.total) * 100}%` }} />
        </div>
      </div>

      <div className="li-card" style={{ background: "var(--brown)", color: "#FBF4DC", marginTop: 14, textAlign: "center", cursor: "pointer" }} onClick={() => setScreen("study")}>
        <div style={{ fontWeight: 700 }}>Start Personal Study Session</div>
        <div style={{ fontFamily: F, fontSize: 40, fontWeight: 500, margin: "6px 0" }}>{timer.mode === "idle" ? "25:00" : mmss(timer.remaining)}</div>
        <div style={{ fontSize: 12, opacity: .8 }}>Task</div>
        <div style={{ background: "#7d6f5e", borderRadius: 12, padding: "6px 12px", marginTop: 4, display: "inline-block" }}>{taskName}</div>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
        <div className="li-tile" onClick={() => setScreen("group")}>
          <Users size={26} /><span style={{ fontWeight: 800 }}>Group Study</span>
        </div>
        <div className="li-tile" onClick={() => setScreen("goals")}>
          <Target size={26} /><span style={{ fontWeight: 800 }}>Goals</span>
        </div>
      </div>

      <div style={{ marginTop: 18, fontWeight: 800 }}>Achievements</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
        {["Finished 40 Hours of Studying", "Met Weekly Goal Twice"].map(a =>
          <div key={a} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Award size={22} color="var(--orange)" /><span>{a}</span>
          </div>)}
      </div>
    </div>
  );

  const Study = (() => {
    const len = timer.mode === "idle" ? lens.focus : lens[timer.mode];
    const pct = len ? 1 - timer.remaining / len : 0;
    const R = 78, C = 2 * Math.PI * R;
    return (
      <div className="li-screen">
        <Header title="Personal Study" onHome={() => setScreen("home")} />
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, fontFamily: F, fontSize: 22, fontWeight: 500 }}>
            <Flame size={20} color="var(--coral)" fill="var(--coral)" /> {streak} Day Streak
          </div>
          <div className="li-sub">This streak is legendary!</div>
          <div style={{ fontFamily: F, fontSize: 22, fontWeight: 500, marginTop: 6 }}>
            Today: {Math.floor(today.mins / 60)}h {today.mins % 60}m / {today.goal / 60}h
          </div>
        </div>

        <div className="li-card" style={{ textAlign: "center", marginTop: 14 }}>
          <input className="li-field" value={taskName} onChange={e => setTaskName(e.target.value)} style={{ textAlign: "center", border: "none", background: "transparent", fontWeight: 800, fontSize: 16 }} />
          <div className="li-sub">{timer.mode === "short" ? "Short break" : timer.mode === "long" ? "Long break" : "Focus session"}</div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 22 }}>
          <svg width={190} height={190}>
            <circle cx={95} cy={95} r={R} fill="none" stroke="var(--track)" strokeWidth={12} />
            <circle cx={95} cy={95} r={R} fill="none" stroke="var(--brown)" strokeWidth={12}
              strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - pct)}
              transform="rotate(-90 95 95)" style={{ transition: "stroke-dashoffset 1s linear" }} />
            <text x={95} y={102} textAnchor="middle" fontFamily="Fredoka" fontSize={30} fill="var(--ink)">
              {timer.mode === "idle" ? "25:00" : mmss(timer.remaining)}
            </text>
          </svg>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
          {timer.mode === "idle"
            ? <button className="li-btn" onClick={() => startMode("focus")}><Play size={16} style={{ verticalAlign: -2 }} /> Start Focus</button>
            : <>
                <button className="li-btn" onClick={togglePause}>
                  {timer.running ? <><Pause size={16} style={{ verticalAlign: -2 }} /> Pause</> : <><Play size={16} style={{ verticalAlign: -2 }} /> Resume</>}
                </button>
                <button className="li-btn ghost" onClick={endSession}><Square size={14} style={{ verticalAlign: -1 }} /> End Session</button>
              </>}
          <div style={{ display: "flex", gap: 10 }}>
            <button className="li-btn ghost" onClick={() => startMode("short")}><Coffee size={14} style={{ verticalAlign: -2 }} /> Short Break</button>
            <button className="li-btn ghost" onClick={() => startMode("long")}><Coffee size={14} style={{ verticalAlign: -2 }} /> Long Break</button>
          </div>
        </div>

        <div className="li-card" style={{ marginTop: 16 }}>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>Upcoming tasks</div>
          <div className="li-sub">10 min · Short Break</div>
          <div className="li-sub">65 min · EECS 280 HW</div>
        </div>
      </div>
    );
  })();

  const Group = (
    <div className="li-screen">
      <Header title="Group Study" onHome={() => setScreen("home")} />
      <div className="li-card" style={{ textAlign: "center", padding: 28 }}>
        <Users size={40} color="var(--brown)" />
        <h3 style={{ fontFamily: F, fontWeight: 600, marginTop: 12 }}>Coming in v2</h3>
        <p className="li-sub" style={{ marginTop: 6 }}>
          Live group sessions — synced timers, shared notes, and invites — need a real-time
          backend, so they're the next milestone after the single-user core is solid.
        </p>
      </div>
    </div>
  );

  const Goals = (() => {
    const [title, setTitle] = useState("");
    const add = () => {
      if (!title.trim()) return;
      setGoals(g => [...g, { id: Date.now(), title: title.trim(), note: "New goal", pct: 0, detail: "0%", milestone: "Just started", group: false }]);
      setTitle("");
    };
    return (
      <div className="li-screen">
        <Header title="My Goals" onHome={() => setScreen("home")} />
        <div style={{ display: "flex", gap: 8 }}>
          <input className="li-field" placeholder="Create a new goal…" value={title} onChange={e => setTitle(e.target.value)} />
          <button className="li-btn" style={{ width: 52 }} onClick={add}><Plus size={18} /></button>
        </div>
        {goals.map(g =>
          <div className="li-card" key={g.id} style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 800, fontSize: 17 }}>{g.group ? "Group Goal" : "Personal Goal"}</div>
            <div style={{ marginTop: 2 }}>{g.title} <span className="li-sub">· {g.note}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontWeight: 700, fontSize: 13 }}>
              <span>Progress {g.pct}%</span><span>{g.detail}</span>
            </div>
            <div className="li-track" style={{ marginTop: 6 }}><div className="li-fill" style={{ width: `${g.pct}%`, background: g.group ? "var(--orange)" : "var(--brown)" }} /></div>
            <div className="li-sub" style={{ marginTop: 6 }}>{g.milestone}</div>
          </div>)}
      </div>
    );
  })();

  const Achievements = (() => {
    const data = [1, 2, 2, 3, 3, 4, 5].map((v, i) => ({ x: i, v }));
    return (
      <div className="li-screen">
        <Header title="Achievements" onHome={() => setScreen("home")} />
        <div className="li-card">
          <div style={{ fontWeight: 800, marginBottom: 8 }}>Completed Goals</div>
          {[["Organic Chem", "Oct 11"], ["Calculus", "Oct 22"], ["English", "Oct 28"]].map(([n, d]) =>
            <div key={n} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0" }}>
              <span style={{ width: 22, height: 22, borderRadius: 11, background: "var(--brown)", display: "flex", alignItems: "center", justifyContent: "center" }}><Check size={14} color="#fff" /></span>
              <span><b>{n}</b> <span className="li-sub">· completed {d}</span></span>
            </div>)}
        </div>

        <div className="li-card" style={{ background: "var(--brown)", color: "#FBF4DC", marginTop: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div><div style={{ opacity: .8 }}>My Streak</div><div style={{ fontFamily: F, fontSize: 34, fontWeight: 600 }}>{streak}</div></div>
            <Flame size={40} color="#FBF4DC" fill="#FBF4DC" />
          </div>
          <div style={{ marginTop: 6, opacity: .85, fontSize: 13 }}>Goals Achieved</div>
          <div style={{ height: 70 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}><XAxis dataKey="x" hide /><Line type="monotone" dataKey="v" stroke="#FBF4DC" strokeWidth={2.5} dot={false} /></LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ marginTop: 14, fontWeight: 800 }}>Latest Achievement</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
          <Award size={24} color="var(--orange)" /><span>Finished 40 Hours of Studying</span>
        </div>
      </div>
    );
  })();

  const Stepper = ({ label, val, k }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
      <span>{label}</span>
      <div className="li-step">
        <button className="li-stepb" onClick={() => set(k, Math.max(1, val - 1))}><Minus size={14} /></button>
        <b style={{ width: 54, textAlign: "center" }}>{val} min</b>
        <button className="li-stepb" onClick={() => set(k, val + 1)}><Plus size={14} /></button>
      </div>
    </div>
  );
  const Row = ({ label, k }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0" }}>
      <span>{label}</span><Toggle on={settings[k]} onClick={() => set(k, !settings[k])} />
    </div>
  );

  const Settings = (
    <div className="li-screen">
      <Header title="Settings" onHome={() => setScreen("home")} />
      <div className="li-card">
        <div style={{ fontWeight: 800, display: "flex", alignItems: "center", gap: 6 }}><Clock size={16} /> Break Timer</div>
        <Stepper label="Short break length" val={settings.shortBreak} k="shortBreak" />
        <Stepper label="Long break length" val={settings.longBreak} k="longBreak" />
      </div>
      <div className="li-card" style={{ marginTop: 14 }}>
        <div style={{ fontWeight: 800 }}>Notifications</div>
        <Row label="Enable all notifications" k="enableAll" />
        <Row label="Study reminder" k="study" />
        <Row label="Break reminder" k="breakR" />
        <Row label="Streak reminder" k="streakR" />
      </div>
      <div className="li-card" style={{ marginTop: 14 }}>
        <div style={{ fontWeight: 800 }}>Do Not Disturb Mode</div>
        <Row label="Turn on automatically" k="dndAuto" />
        <Row label="Block notifications" k="dndBlock" />
        <Row label="Silence calls" k="dndCalls" />
        <Row label="Hide pop-ups" k="dndPop" />
      </div>
    </div>
  );

  const screens = { login: Login, discovery: Discovery, home: Home, study: Study, group: Group, goals: Goals, achievements: Achievements, settings: Settings };
  const showNav = !["login", "discovery"].includes(screen);

  const NavBtn = ({ id, icon: Icon, label }) => (
    <button className={"li-navb" + (screen === id ? " on" : "")} onClick={() => setScreen(id)}>
      <Icon size={22} />{label}
    </button>
  );

  return (
    <div className="li-root">
      <style>{STYLES}</style>
      <div className="li-blob" style={{ width: 260, height: 260, background: "var(--orange)", top: -60, left: -40 }} />
      <div className="li-blob" style={{ width: 240, height: 240, background: "var(--pink)", bottom: 40, right: -50, animationDelay: "3s" }} />

      <div className="li-phone">
        {screens[screen]}
        {showNav &&
          <div className="li-nav">
            <NavBtn id="home" icon={HomeIcon} label="Home" />
            <NavBtn id="study" icon={Clock} label="Study" />
            <NavBtn id="goals" icon={Target} label="Goals" />
            <NavBtn id="achievements" icon={Award} label="Awards" />
            <NavBtn id="settings" icon={SettingsIcon} label="Settings" />
          </div>}
      </div>
    </div>
  );
}
