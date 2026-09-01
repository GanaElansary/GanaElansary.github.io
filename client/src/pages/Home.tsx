/*
 * Sweet Signal Scrapbook: an asymmetric Kawaii Cyber-Pinboard with tactile cards,
 * signal-pink highlights, face-folders, and friendly system interactions.
 */
import {
  ArrowDownRight,
  ArrowRight,
  BriefcaseBusiness,
  ChevronRight,
  Command,
  Copy,
  FileCode2,
  Gamepad2,
  GraduationCap,
  Heart,
  Keyboard,
  LockKeyhole,
  Menu,
  MousePointer2,
  Music2,
  Network,
  Pin,
  ScanLine,
  Send,
  ShieldCheck,
  Sparkles,
  SquareTerminal,
  Star,
  Terminal as TerminalIcon,
  Trophy,
  Wifi,
  X,
  Zap,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

const ASSETS = {
  hero: "/manus-storage/sweet-signal-hero_c7b7b820.png",
  folders: "/manus-storage/sweet-signal-folders_dd45845b.png",
  stickers: "/manus-storage/sweet-signal-stickers_4194645f.png",
  mascot: "/manus-storage/sweet-signal-mascot_32472799.png",
  logo: "/manus-storage/sweet-signal-logo_38883ff6.png",
};

type FolderId = "profile" | "projects" | "ga" | "leadership" | "hobbies" | "contact";
type TerminalLine = { kind: "system" | "command" | "output"; text: string };

const FOLDERS: Array<{
  id: FolderId;
  index: string;
  label: string;
  face: string;
  tone: string;
  sectionId: string;
}> = [
  { id: "profile", index: "01", label: "profile", face: "◡‿◡", tone: "pink", sectionId: "top" },
  { id: "projects", index: "02", label: "projects", face: "•ᴗ•", tone: "blue", sectionId: "projects" },
  { id: "ga", index: "03", label: "GA projects", face: "⌐■‿■", tone: "yellow", sectionId: "ga" },
  { id: "leadership", index: "04", label: "leadership", face: "ᵔᴥᵔ", tone: "mint", sectionId: "leadership" },
  { id: "hobbies", index: "05", label: "hobbies", face: "✦ᴗ✦", tone: "lavender", sectionId: "hobbies" },
  { id: "contact", index: "06", label: "contact", face: "♡‿♡", tone: "peach", sectionId: "contact" },
];

const PROJECTS = [
  { title: "Networking 2 Project", label: "network / systems", icon: "◌", tone: "blue", copy: "A pin for protocol thinking, connected systems, and the details that make a network feel alive." },
  { title: "DND Project", label: "worlds / rules", icon: "✧", tone: "pink", copy: "A creative workspace for turning a big idea into a playable, structured experience." },
  { title: "Game Hub", label: "play / build", icon: "▣", tone: "yellow", copy: "A collection point for game ideas, interaction experiments, and cheerful systems design." },
  { title: "Digital T", label: "digital / visual", icon: "⌁", tone: "mint", copy: "A digital project pin that mixes visual direction, making, and a human point of view." },
  { title: "TI Project", label: "tools / logic", icon: "{}", tone: "lavender", copy: "A technical note for problem solving, clean structure, and building with intention." },
  { title: "AI Project", label: "curiosity / future", icon: "✺", tone: "peach", copy: "An exploration of how intelligent tools can become more useful, clear, and fun to use." },
];

const LEADERSHIP = [
  { title: "VP Music Club", org: "University Bahrain Polytechnic", icon: "♫", tone: "pink" },
  { title: "SEC Esports Club", org: "University Bahrain Polytechnic", icon: "▰", tone: "blue" },
  { title: "VP Esports Club", org: "University Bahrain Polytechnic", icon: "✦", tone: "yellow" },
  { title: "SSF", org: "Student Film Festival organizer", icon: "◉", tone: "mint" },
  { title: "Skra Internship", org: "Project Manager — interactions & minigames team", icon: "⌁", tone: "lavender" },
  { title: "Event Management", org: "Planning, coordination, and keeping the signal clear", icon: "✎", tone: "peach" },
];

const INITIAL_TERMINAL: TerminalLine[] = [
  { kind: "system", text: "pastel-shell v1.0.4 — connected to gana.pinboard" },
  { kind: "output", text: "type `help` for a tiny command map" },
  { kind: "output", text: "────────────────────────────────────" },
];

const NOTES = [
  { id: "note-hello", label: "HELLO WORLD", copy: "a curious mind, pinned with intent", tone: "note-yellow", x: 38, y: 38, rotation: "-3deg" },
  { id: "note-signal", label: "SIGNAL CHECK", copy: "soft skills / strong systems", tone: "note-pink", x: 280, y: 144, rotation: "4deg" },
  { id: "note-play", label: "PLAY LOOP", copy: "make it useful. make it kind.", tone: "note-blue", x: 508, y: 58, rotation: "-2deg" },
];

function FolderIcon({ tone, face }: { tone: string; face: string }) {
  return (
    <span className={`folder-icon folder-icon--${tone}`} aria-hidden="true">
      <span className="folder-icon__tab" />
      <span className="folder-icon__face">
        <span>{face.slice(0, 3)}</span>
        <small>{face.slice(3)}</small>
      </span>
    </span>
  );
}

function SignalMark({ size = "regular" }: { size?: "small" | "regular" }) {
  return <span className={`signal-mark signal-mark--${size}`} aria-hidden="true"><Heart size={size === "small" ? 12 : 17} fill="currentColor" strokeWidth={1.8} /></span>;
}

function MascotBadge() {
  return (
    <div className="mascot-css" aria-label="Kawaii shield mascot">
      <span className="mascot-css__antenna mascot-css__antenna--left" />
      <span className="mascot-css__antenna mascot-css__antenna--right" />
      <span className="mascot-css__shield"><span className="mascot-css__eyes">•ᴗ•</span><Heart size={22} fill="currentColor" /></span>
      <span className="mascot-css__sparkle">✦</span>
    </div>
  );
}

function FolderButton({
  folder,
  active,
  onSelect,
}: {
  folder: (typeof FOLDERS)[number];
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      className={`folder-button folder-button--${folder.tone} ${active ? "is-active" : ""}`}
      type="button"
      aria-current={active ? "page" : undefined}
      onClick={onSelect}
    >
      <FolderIcon tone={folder.tone} face={folder.face} />
      <span className="folder-button__copy">
        <span className="folder-button__index">key {folder.index}</span>
        <strong>{folder.label}</strong>
      </span>
      <ChevronRight className="folder-button__arrow" size={17} strokeWidth={2.4} />
    </button>
  );
}

function DraggableNote({
  note,
  position,
  dragging,
  onPointerDown,
}: {
  note: (typeof NOTES)[number];
  position: { x: number; y: number };
  dragging: boolean;
  onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
}) {
  return (
    <article
      className={`floating-note ${note.tone} ${dragging ? "is-dragging" : ""}`}
      style={{ left: `${position.x}px`, top: `${position.y}px`, ["--note-rotation" as string]: note.rotation }}
      onPointerDown={onPointerDown}
      aria-label={`${note.label}: draggable pinboard note`}
    >
      <span className="floating-note__pin"><Pin size={12} fill="currentColor" /></span>
      <span className="floating-note__label">{note.label}</span>
      <strong>{note.copy}</strong>
      <span className="floating-note__grip"><MousePointer2 size={12} /> drag me</span>
    </article>
  );
}

function TerminalWidget({
  open,
  lines,
  value,
  onChange,
  onCommand,
  onClose,
}: {
  open: boolean;
  lines: TerminalLine[];
  value: string;
  onChange: (value: string) => void;
  onCommand: () => void;
  onClose: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <aside className="terminal-widget" aria-label="Interactive pastel terminal">
      <div className="terminal-widget__titlebar">
        <div className="terminal-widget__dots" aria-hidden="true"><span /><span /><span /></div>
        <span><SquareTerminal size={14} /> pastel-shell</span>
        <button type="button" aria-label="Close terminal" onClick={onClose}><X size={16} /></button>
      </div>
      <div className="terminal-widget__body">
        <div className="terminal-widget__output" aria-live="polite">
          {lines.map((line, index) => (
            <div key={`${line.text}-${index}`} className={`terminal-line terminal-line--${line.kind}`}>
              {line.kind === "command" && <span className="terminal-prompt">gana@pinboard:~$</span>}{line.text}
            </div>
          ))}
        </div>
        <div className="terminal-input-line">
          <span className="terminal-prompt">gana@pinboard:~$</span>
          <input
            ref={inputRef}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => { if (event.key === "Enter") onCommand(); }}
            aria-label="Terminal command input"
            autoComplete="off"
            spellCheck={false}
          />
          <span className="terminal-caret" aria-hidden="true" />
        </div>
        <div className="terminal-widget__hint">try: help · projects · skills · sudo cute</div>
      </div>
    </aside>
  );
}

export default function Home() {
  const [activeFolder, setActiveFolder] = useState<FolderId>("profile");
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>(INITIAL_TERMINAL);
  const [shortcutOpen, setShortcutOpen] = useState(false);
  const [cuteness, setCuteness] = useState(false);
  const [copied, setCopied] = useState(false);
  const [draggingNote, setDraggingNote] = useState<string | null>(null);
  const [notePositions, setNotePositions] = useState<Record<string, { x: number; y: number }>>(
    Object.fromEntries(NOTES.map((note) => [note.id, { x: note.x, y: note.y }])) as Record<string, { x: number; y: number }>,
  );
  const dragRef = useRef<{ id: string; startX: number; startY: number; originX: number; originY: number } | null>(null);

  const jumpTo = (sectionId: string, folderId?: FolderId, instant = false) => {
    setActiveFolder(folderId ?? activeFolder);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: instant ? "auto" : "smooth", block: "start" });
  };

  const triggerCuteness = () => {
    setCuteness(true);
    window.setTimeout(() => setCuteness(false), 2200);
  };

  const appendTerminal = (text: string | string[]) => {
    const list = Array.isArray(text) ? text : [text];
    setTerminalLines((current) => [...current, ...list.map((line) => ({ kind: "output" as const, text: line }))]);
  };

  const executeCommand = () => {
    const raw = terminalInput.trim();
    const command = raw.toLowerCase();
    setTerminalInput("");

    if (!command) return;
    if (command === "clear") {
      setTerminalLines([]);
      return;
    }

    setTerminalLines((current) => [...current, { kind: "command", text: raw }]);

    switch (command) {
      case "help":
        appendTerminal(["help       show available commands", "about      read the profile pin", "projects   open the project folder", "skills     show the signal stack", "contact    jump to the footer pin", "sudo cute  deploy a tiny easter egg", "clear      wipe this terminal"]);
        break;
      case "about":
      case "whoami":
        appendTerminal(["Gana Elansary", "4th-Year Cybersecurity Student @ Bahrain Polytechnic", "curious / resourceful / bright"]);
        jumpTo("about", "profile");
        break;
      case "projects":
      case "ls projects":
        appendTerminal(["opening /projects ...", "6 pins found: Networking 2 · DND · Game Hub · Digital T · TI · AI"]);
        jumpTo("projects", "projects");
        break;
      case "skills":
        appendTerminal(["signal stack loaded", "cybersecurity · project management · game development", "event management · music · visual storytelling"]);
        jumpTo("leadership", "leadership");
        break;
      case "contact":
        appendTerminal(["footer pin located", "copy the page link or open a new terminal thread to say hello"]);
        jumpTo("contact", "contact");
        break;
      case "sudo cute":
        appendTerminal(["permission granted", "deploying 12 heart packets ... done <3"]);
        triggerCuteness();
        break;
      case "neofetch":
        appendTerminal(["gana@pinboard", "OS: pastel-shell", "kernel: curious-4.0", "uptime: always learning", "theme: sweet-signal"]);
        break;
      default:
        appendTerminal(`command not found: ${raw} — type help for the map`);
    }
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const isTyping = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
      if (isTyping && event.key !== "Escape") return;

      if (event.key === "?") {
        event.preventDefault();
        setShortcutOpen((open) => !open);
        return;
      }
      if (event.key.toLowerCase() === "t") {
        event.preventDefault();
        setTerminalOpen((open) => !open);
        return;
      }
      if (event.key === "Escape") {
        setTerminalOpen(false);
        setShortcutOpen(false);
        setDraggingNote(null);
        return;
      }
      if (/^[1-6]$/.test(event.key)) {
        const folder = FOLDERS[Number(event.key) - 1];
        jumpTo(folder.sectionId, folder.id, true);
      }
      if (event.key.toLowerCase() === "g") triggerCuteness();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  useEffect(() => {
    const sections = FOLDERS.map((folder) => document.getElementById(folder.sectionId)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const folder = FOLDERS.find((item) => item.sectionId === visible.target.id);
        if (folder) setActiveFolder(folder.id);
      },
      { rootMargin: "-34% 0px -56% 0px", threshold: [0.1, 0.35, 0.6] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const move = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      setNotePositions((current) => ({
        ...current,
        [drag.id]: {
          x: Math.max(10, Math.min(700, drag.originX + event.clientX - drag.startX)),
          y: Math.max(12, Math.min(380, drag.originY + event.clientY - drag.startY)),
        },
      }));
    };
    const end = () => {
      dragRef.current = null;
      setDraggingNote(null);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
    };
  }, []);

  const startDrag = (id: string, event: ReactPointerEvent<HTMLDivElement>) => {
    if (window.matchMedia("(max-width: 720px)").matches) return;
    event.preventDefault();
    const origin = notePositions[id];
    dragRef.current = { id, startX: event.clientX, startY: event.clientY, originX: origin.x, originY: origin.y };
    setDraggingNote(id);
  };

  const copyPageLink = async () => {
    if (navigator.clipboard) await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className={`site-shell ${cuteness ? "cute-mode" : ""}`}>
      <header className="topbar">
        <a className="brand-lockup" href="#top" aria-label="Gana Elansary home">
          <SignalMark />
          <span><strong>GANA</strong><small>/ PINBOARD</small></span>
        </a>
        <nav className="topbar__links" aria-label="Primary navigation">
          <button type="button" onClick={() => jumpTo("projects", "projects")}>projects <span>02</span></button>
          <button type="button" onClick={() => jumpTo("leadership", "leadership")}>signal stack <span>04</span></button>
          <button type="button" onClick={() => jumpTo("contact", "contact")}>say hi <ArrowRight size={14} /></button>
        </nav>
        <div className="topbar__actions">
          <button className="shortcut-trigger" type="button" onClick={() => setShortcutOpen(true)} aria-label="Open keyboard shortcuts">
            <Keyboard size={15} /><span>shortcuts</span><kbd>?</kbd>
          </button>
          <button className="terminal-trigger" type="button" onClick={() => setTerminalOpen((open) => !open)} aria-label="Toggle pastel terminal">
            <TerminalIcon size={16} /><span>terminal</span><kbd>T</kbd>
          </button>
          <button className="mobile-menu-trigger" type="button" onClick={() => jumpTo("folders")} aria-label="Jump to folder navigation"><Menu size={18} /></button>
        </div>
      </header>

      <main>
        <section id="top" className="hero-section pinboard-section">
          <div className="hero-section__art" />
          <div className="hero-section__wash" />
          <div className="hero-section__inner">
            <div className="hero-copy">
              <div className="status-chip"><span className="status-chip__dot" /> online / learning mode <span className="status-chip__heart">♡</span></div>
              <div className="hero-copy__paper">
                <span className="hero-copy__eyebrow">personal portfolio · 2026 archive</span>
                <h1>Gana<br /><em>Elansary</em></h1>
                <p className="hero-copy__lead">A 4th-Year Cybersecurity student at Bahrain Polytechnic, collecting technical curiosities, creative builds, and the people-shaped projects in between.</p>
                <div className="hero-copy__actions">
                  <button className="button button--signal" type="button" onClick={() => jumpTo("projects", "projects")}><span>open project pins</span><ArrowDownRight size={17} /></button>
                  <button className="text-button" type="button" onClick={() => setTerminalOpen(true)}><SquareTerminal size={15} /> ask the terminal</button>
                </div>
                <div className="hero-copy__meta">
                  <span><Wifi size={13} /> Bahrain / BH</span>
                  <span><ScanLine size={13} /> curious by default</span>
                  <span><ShieldCheck size={13} /> signal pink approved</span>
                </div>
              </div>
              <div className="hero-copy__shortcut"><kbd>1</kbd><span>profile pin</span><span className="hero-copy__shortcut-line" /></div>
            </div>

            <aside className="hero-profile-card paper-card paper-card--cream">
              <span className="paper-card__tape tape--pink" />
              <div className="hero-profile-card__top"><span>identity / 001</span><span className="tiny-status"><span /> verified</span></div>
              <div className="hero-profile-card__portrait">
                <div className="portrait-ring"><MascotBadge /></div>
                <span className="portrait-sticker">♡</span>
              </div>
              <h2>soft heart.<br /><span>sharp signal.</span></h2>
              <p className="hero-profile-card__copy">The human behind the folders: a student, organizer, maker, and enthusiast of systems that invite people in.</p>
              <div className="hero-profile-card__stats"><span><strong>04</strong><small>year</small></span><span><strong>06</strong><small>project pins</small></span><span><strong>∞</strong><small>curiosity</small></span></div>
              <div className="hero-profile-card__footer"><span>GANA.EXE</span><span>v4.0 / bh-poly</span></div>
            </aside>
          </div>
          <div className="hero-section__sticker-sheet" aria-hidden="true"><span>♥</span><span>✦</span><span>⌁</span><span>◇</span><span>♡</span></div>
          <div className="hero-section__scroll"><span>scroll to browse</span><ArrowDownRight size={15} /></div>
        </section>

        <section id="folders" className="folder-navigation pinboard-section">
          <div className="section-heading section-heading--folders">
            <div><span className="section-kicker"><ShieldCheck size={11} /> the index / use your keyboard</span><h2>Choose a folder<span>.</span></h2></div>
            <p>Every pin has a little more context. Click a face, press a number, or let the terminal do the sorting.</p>
          </div>
          <div className="folder-navigation__layout">
            <div className="folder-buttons" role="navigation" aria-label="Portfolio folders">
              {FOLDERS.map((folder) => <FolderButton key={folder.id} folder={folder} active={activeFolder === folder.id} onSelect={() => jumpTo(folder.sectionId, folder.id)} />)}
            </div>
            <div className="folder-specimen paper-card paper-card--lavender">
              <span className="paper-card__tape tape--blue" />
              <div className="folder-specimen__caption"><span>visual index</span><strong>face folders / set 01</strong></div>
              <div className="folder-specimen__grid" aria-label="Pastel face folder icons">{FOLDERS.map((folder) => <FolderIcon key={folder.id} tone={folder.tone} face={folder.face} />)}</div>
              <div className="folder-specimen__footer"><span>made to be opened</span><span>♡♡♡</span></div>
            </div>
          </div>
        </section>

        <section id="about" className="about-section pinboard-section">
          <div className="about-section__main paper-card paper-card--yellow">
            <span className="paper-card__tape tape--lavender" />
            <div className="section-kicker"><LockKeyhole size={11} /> 01 / the operator · secure profile</div>
            <h2>Not just a résumé.<br /><em>A living pinboard.</em></h2>
            <p>I like the space where technology meets a real person: the handoff between a good system and a friendly experience, the moment a complex idea becomes something you can actually play with.</p>
            <p>Scroll this board like a desk wall. Pick a folder, move a note, or open the terminal if you want the short version.</p>
            <div className="about-section__signature"><span>gana</span><span>curious / resourceful / bright</span></div>
          </div>
          <div className="about-section__stack">
            <div className="mini-memo mini-memo--blue"><span>currently pinning</span><strong>cybersecurity × creative systems</strong><small>no boring tabs allowed</small></div>
            <div className="mini-memo mini-memo--pink"><span>small rule</span><strong>make it useful.<br />make it kind.</strong><span className="mini-memo__stamp">OK!</span></div>
            <div className="about-section__badge"><LockKeyhole size={16} /><span>trusted by<br /><strong>curiosity</strong></span></div>
          </div>
        </section>

        <section id="projects" className="projects-section pinboard-section">
          <div className="section-heading">
            <div><span className="section-kicker">02 / folder open · key 2</span><h2>Project pins<span>.</span></h2></div>
            <button className="outline-button" type="button" onClick={() => { setTerminalOpen(true); setTerminalInput("projects"); }}><span>ls projects</span><TerminalIcon size={15} /></button>
          </div>
          <div className="projects-canvas">
            <div className="projects-canvas__label"><TerminalIcon size={13} /><span>signal monitor / arranged, not aligned</span></div>
            <div className="projects-grid">
              {PROJECTS.map((project, index) => (
                <article key={project.title} className={`project-card project-card--${project.tone}`}>
                  <span className="project-card__pin"><Pin size={13} fill="currentColor" /></span>
                  <div className="project-card__top"><span className="project-card__number">0{index + 1}</span><span className="project-card__icon">{project.icon}</span></div>
                  <span className="project-card__label">{project.label}</span>
                  <h3>{project.title}</h3>
                  <p>{project.copy}</p>
                  <div className="project-card__footer"><span>open pin</span><ArrowRight size={14} /></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="ga" className="ga-section pinboard-section">
          <div className="section-heading">
            <div><span className="section-kicker"><Network size={11} /> 03 / graduation + academic · signal pending</span><h2>Big builds<span>.</span></h2></div>
            <span className="section-heading__aside"><GraduationCap size={16} /> still in progress</span>
          </div>
          <div className="ga-layout">
            <article className="ga-card ga-card--pink paper-card">
              <span className="paper-card__tape tape--yellow" />
              <div className="ga-card__top"><span>GA / 01</span><span className="ga-card__orbit">✦</span></div>
              <div className="ga-card__icon"><Zap size={26} /></div>
              <h3>Wind Turbine</h3>
              <p>A pinned academic build with room for research, iteration, and the kind of questions that keep a project moving.</p>
              <div className="ga-card__footer"><span>academic pin</span><span>in the works</span></div>
            </article>
            <article className="ga-card ga-card--blue paper-card">
              <span className="paper-card__tape tape--pink" />
              <div className="ga-card__top"><span>GA / 02</span><span className="ga-card__orbit">♡</span></div>
              <div className="ga-card__icon"><Network size={26} /></div>
              <h3>Capstone</h3>
              <p>The larger pin on the board: an opportunity to connect technical thinking, project leadership, and a clear human outcome.</p>
              <div className="ga-card__footer"><span>graduation pin</span><span>signal pending</span></div>
            </article>
            <div className="ga-side-note"><span className="ga-side-note__tape" /><span className="section-kicker">tiny note</span><strong>Good work can be both rigorous and adorable.</strong><span className="ga-side-note__scribble">* ✦ * ✦ *</span></div>
          </div>
        </section>

        <section id="leadership" className="leadership-section pinboard-section">
          <div className="section-heading">
            <div><span className="section-kicker"><ShieldCheck size={11} /> 04 / people + momentum · key 4</span><h2>Leadership log<span>.</span></h2></div>
            <span className="section-heading__aside"><Trophy size={16} /> show up, then share the signal</span>
          </div>
          <div className="leadership-layout">
            <div className="leadership-intro paper-card paper-card--cream">
              <span className="paper-card__tape tape--mint" />
              <div className="leadership-intro__icon"><BriefcaseBusiness size={24} /></div>
              <h3>Making space<br /><em>for other people.</em></h3>
              <p>Clubs, festivals, internships, and event teams have taught me that the best projects are built from clear roles, generous communication, and a little bit of momentum.</p>
              <div className="leadership-intro__stamp">TEAM PLAYER<br /><span>verified</span></div>
            </div>
            <div className="leadership-list">
              {LEADERSHIP.map((item, index) => (
                <article key={item.title} className={`leadership-row leadership-row--${item.tone}`}>
                  <span className="leadership-row__number">0{index + 1}</span>
                  <span className="leadership-row__icon">{item.icon}</span>
                  <div><h3>{item.title}</h3><p>{item.org}</p></div>
                  <ArrowRight className="leadership-row__arrow" size={16} />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="hobbies" className="hobbies-section pinboard-section">
          <div className="hobbies-section__copy"><span className="section-kicker"><ShieldCheck size={11} /> 05 / off-duty tabs · key 5</span><h2>Hobbies &<br /><em>interests.</em></h2><p>Different tabs, same curiosity. The board gets brighter when play, sound, and transformation are allowed in.</p></div>
          <div className="hobbies-ribbons">
            <div className="hobby-ribbon hobby-ribbon--pink"><span className="hobby-ribbon__icon"><Gamepad2 size={21} /></span><strong>Gaming</strong><span>worlds to wander</span></div>
            <div className="hobby-ribbon hobby-ribbon--blue"><span className="hobby-ribbon__icon"><Music2 size={21} /></span><strong>Music</strong><span>moods to carry</span></div>
            <div className="hobby-ribbon hobby-ribbon--yellow"><span className="hobby-ribbon__icon"><Sparkles size={21} /></span><strong>SFX Makeup</strong><span>make-believe, made real</span></div>
          </div>
          <div className="hobbies-section__sticker"><Heart size={19} fill="currentColor" /><span>keep a little<br /><strong>magic</strong></span></div>
        </section>

        <section id="contact" className="contact-section pinboard-section">
          <div className="contact-section__card paper-card paper-card--lavender">
            <span className="paper-card__tape tape--blue" />
            <div className="contact-section__orb"><SignalMark /></div>
            <div><span className="section-kicker"><LockKeyhole size={11} /> 06 / final pin · secure channel</span><h2>Want to pin<br /><em>something new?</em></h2><p>There is always room on the board for a good question, a playful collaboration, or a project with a little heart in it.</p></div>
            <div className="contact-section__actions"><button className="button button--signal" type="button" onClick={() => setTerminalOpen(true)}><span>open a terminal thread</span><Send size={16} /></button><button className="outline-button" type="button" onClick={copyPageLink}><Copy size={15} /><span>{copied ? "link copied" : "copy page link"}</span></button></div>
          </div>
          <div className="pinboard-canvas" aria-label="Draggable pinboard notes">
            <div className="pinboard-canvas__header"><span><Pin size={13} fill="currentColor" /> free notes</span><span>drag on desktop · stack on mobile</span></div>
            {NOTES.map((note) => <DraggableNote key={note.id} note={note} position={notePositions[note.id]} dragging={draggingNote === note.id} onPointerDown={(event) => startDrag(note.id, event)} />)}
            <div className="pinboard-canvas__sparkle"><Star size={21} fill="currentColor" /><span>you made it<br /><strong>to the footer!</strong></span></div>
          </div>
        </section>
      </main>

      <footer className="site-footer"><span className="site-footer__brand"><SignalMark size="small" /> Gana Elansary / Kawaii Cyber-Pinboard</span><span className="site-footer__status"><TerminalIcon size={12} /> status: pinned / checksum: cute</span><span className="site-footer__note">built with curiosity, pastel tape, and a lot of tiny pins <Heart size={13} fill="currentColor" /></span></footer>

      <div className="terminal-dock"><button className="terminal-dock__button" type="button" onClick={() => setTerminalOpen((open) => !open)}><span className="terminal-dock__icon"><TerminalIcon size={18} /></span><span><small>pastel-shell</small><strong>{terminalOpen ? "close terminal" : "type a command"}</strong></span><kbd>T</kbd></button></div>
      <TerminalWidget open={terminalOpen} lines={terminalLines} value={terminalInput} onChange={setTerminalInput} onCommand={executeCommand} onClose={() => setTerminalOpen(false)} />

      {shortcutOpen && <div className="shortcut-overlay" role="dialog" aria-modal="true" aria-label="Keyboard shortcuts" onClick={() => setShortcutOpen(false)}>
        <div className="shortcut-dialog paper-card paper-card--cream" onClick={(event) => event.stopPropagation()}>
          <button className="shortcut-dialog__close" type="button" onClick={() => setShortcutOpen(false)} aria-label="Close shortcuts"><X size={17} /></button>
          <span className="paper-card__tape tape--pink" />
          <span className="section-kicker">keyboard / quick map</span><h2>Make the board<br /><em>respond.</em></h2>
          <div className="shortcut-list">
            <div><kbd>1—6</kbd><span>jump to a folder</span></div><div><kbd>T</kbd><span>toggle pastel terminal</span></div><div><kbd>?</kbd><span>open this cheat sheet</span></div><div><kbd>G</kbd><span>deploy cute mode</span></div><div><kbd>Esc</kbd><span>close any open layer</span></div>
          </div>
          <button className="button button--signal shortcut-dialog__button" type="button" onClick={() => { setShortcutOpen(false); triggerCuteness(); }}><span>press the magic button</span><Sparkles size={16} /></button>
        </div>
      </div>}

      {cuteness && <div className="cute-burst" aria-live="polite"><span>♡</span><span>✦</span><span>♡</span><strong>cute mode<br />authorized</strong></div>}
    </div>
  );
}
