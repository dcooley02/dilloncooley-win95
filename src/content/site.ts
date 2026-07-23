export const site = {
  name: 'Dillon Cooley',
  title: 'Lieutenant, U.S. Navy - MH-60S Instructor Pilot',
  bio: [
    'I am a Lieutenant in the United States Navy and an MH-60S pilot currently serving as a weapons and tactics instructor (WTI) and fleet experimentation officer at HSC Weapons School Pacific. A 2018 graduate of the United States Naval Academy with a degree in aerospace engineering, I recently completed a master\'s program in air and space operations and tactics from the University of Staffordshire. In my current role, I specialize in maritime intelligence, surveillance, and reconnaissance (ISR) and airborne mine countermeasures (AMCM), focusing on the integration of emerging tactics and technologies into current operations.',
    'My professional interests include international geopolitics and the evolving landscape of military strategy. I am particularly driven by how emerging technologies shape modern conflict. My recent research focuses on the feasibility of expeditionary advanced base operations (EABO) within the Indo-Pacific, exploring how distributed ISR can be leveraged to counter complex anti-access/area denial (A2/AD) environments.',
    'Outside of the cockpit, I spend most of my time leaning into the outdoors. I enjoy distance running, snowboarding, and exploring San Diego.',
  ],
  thesis: {
    title:
      'Countering A2/AD Through EABO: The Role and Feasibility of Distributed ISR in the Indo-Pacific',
    meta: 'MSc Air and Space: Operations and Tactics — University of Staffordshire',
    pdf: '/docs/thesis.pdf',
  },
  resume: {
    title: 'Professional Resume',
    pdf: '/docs/resume.pdf',
  },
  links: [
    {
      id: 'linkedin',
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/dillon-cooley-627526123',
      description: 'Professional network',
    },
    {
      id: 'x',
      label: 'X (Twitter)',
      href: 'https://x.com/realdcool',
      description: 'Public posts',
    },
    {
      id: 'substack',
      label: 'Substack',
      href: 'https://substack.com/@dilloncooley',
      description: 'Writing',
    },
    {
      id: 'github',
      label: 'GitHub',
      href: 'https://github.com/dcooley02',
      description: 'Code & projects',
    },
  ],
  notepad: `Welcome to Dillon Cooley's desktop.

HOW TO USE THIS MACHINE
-----------------------
• Click desktop icons (or Start menu) to open programs
• Drag title bars to move windows
• Minesweeper: left-click open, right-click flag
• Solitaire: click card, then destination (double-click auto-foundation)

PROFESSIONAL
------------
• About Me — background and current role
• Resume.pdf — credentials
• Thesis.pdf — EABO / distributed ISR research
• Network Neighborhood — LinkedIn, X, Substack, GitHub

RECREATIONAL
------------
• Minesweeper — classic 9×9
• Solitaire — Klondike (Deal for a new hand)
• Recycle Bin — do not restore

dilloncooley.us

— DC
`,
} as const

export type AppId =
  | 'about'
  | 'resume'
  | 'thesis'
  | 'connect'
  | 'minesweeper'
  | 'notepad'
  | 'solitaire'
  | 'recycle'
