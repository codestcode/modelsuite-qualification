# Marketplace Redesign — What I Did & How It Works

## Overview

I redesigned the **Available Tasks Discovery Experience** (`AvailableTasksList.jsx`) to look like a modern marketplace (similar to Airbnb or Dribbble) instead of a basic database list. The changes touch **3 files** and add ~200 lines of new CSS.

---

## Files Changed

| File | What it does |
|------|-------------|
| `client/src/components/talent/TaskCard.jsx` | The individual card for each task (completely rewritten) |
| `client/src/components/talent/AvailableTasksList.jsx` | The grid + filter bar that contains all cards (completely rewritten) |
| `client/src/index.css` | Added new CSS classes at the bottom for marketplace styling |

---

## 1. TaskCard.jsx — The Card Design

### What changed
The old card was a simple box with title, description, status badge, and a claim button. The new card has:

### Auto-Categorization System
```jsx
function categorize(title = '') {
  const t = title.toLowerCase();
  if (/design|ui|ux|figma|logo|brand|visual|mockup|wireframe/.test(t)) return 'design';
  if (/code|dev|api|bug|fix|build|frontend|backend|fullstack|engineer|program/.test(t)) return 'code';
  if (/writ|copy|content|blog|article|text/.test(t)) return 'writing';
  if (/research|analysis|data|survey|report|investigate/.test(t)) return 'research';
  return 'default';
}
```
**How it works:** Each task title is matched against keyword patterns. If the title contains words like "design", "logo", or "figma", it gets categorized as `design`. Each category has its own color, icon, and gradient.

### Category Config Object
```jsx
const CATEGORY_CONFIG = {
  design:   { label: 'Design',   icon: '◆', color: '#A78BFA', gradient: '...' },
  code:     { label: 'Dev',      icon: '⟨/⟩', color: '#60A5FA', gradient: '...' },
  writing:  { label: 'Writing',  icon: '✎', color: '#F472B6', gradient: '...' },
  research: { label: 'Research', icon: '◎', color: '#34D399', gradient: '...' },
  default:  { label: 'General',  icon: '⬡', color: '#FBBF24', gradient: '...' },
};
```
This stores the visual identity for each category — color, icon symbol, and gradient.

### Card Structure (top to bottom)
1. **Gradient accent bar** — a 2px colored line at the very top of the card, using the category's color
2. **Category pill** — shows the icon + label (e.g., "◆ Design") with color-coded border
3. **Bounty badge** — a visual "reward" indicator in the top-right corner
4. **Title** — using Poppins font, clamped to 2 lines
5. **Description** — clamped to 3 lines
6. **Meta footer** — due date + author name + "Open" status tag
7. **Claim button** — gradient purple/blue with loading spinner

### Claim Button with Loading State
```jsx
const [claiming, setClaiming] = useState(false);

const handleClaim = async () => {
  setClaiming(true);          // Shows spinner
  try {
    await claimTask(task._id);
    if (onClaimed) onClaimed();  // Refreshes parent data
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to claim task');
  } finally {
    setClaiming(false);       // Hides spinner
  }
};
```
When the user clicks "Claim Task", a spinner appears while the API call is in progress.

---

## 2. AvailableTasksList.jsx — The Grid & Filters

### What changed
The old component was just a grid of TaskCards with an empty state message. The new version adds:

### Search Bar
```jsx
const [searchQuery, setSearchQuery] = useState('');

// Filters tasks by title OR description
if (searchQuery.trim()) {
  const q = searchQuery.toLowerCase();
  result = result.filter(
    (t) =>
      t.title?.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q)
  );
}
```
A text input that filters tasks in real-time as you type. It searches both title and description.

### Filter Bar (Horizontal Scrolling Pills)
```jsx
const FILTERS = [
  { key: 'all',    label: 'All Tasks',    icon: '⬡' },
  { key: 'design', label: 'Design',       icon: '◆' },
  { key: 'code',   label: 'Development',  icon: '⟨/⟩' },
  { key: 'writing', label: 'Writing',     icon: '✎' },
  { key: 'research', label: 'Research',   icon: '◎' },
];
```
A row of clickable pills. Clicking "Design" shows only design tasks. Clicking "All Tasks" shows everything. The pills scroll horizontally on small screens (no scrollbar visible).

### Combining Filters
```jsx
const filtered = useMemo(() => {
  let result = tasks || [];

  // Apply category filter
  if (activeFilter !== 'all') {
    result = result.filter((t) => categorize(t.title) === activeFilter);
  }

  // Apply search filter
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    result = result.filter(
      (t) =>
        t.title?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q)
    );
  }

  return result;
}, [tasks, activeFilter, searchQuery]);
```
Both filters work together. You can search within a category. `useMemo` ensures filtering only recalculates when the inputs change (performance optimization).

### Staggered Card Animation
```jsx
{filtered.map((task, i) => (
  <div
    key={task._id}
    className="card-stagger"
    style={{ animationDelay: `${i * 0.06}s` }}
  >
    <TaskCard task={task} showClaimButton onClaimed={onClaimed} />
  </div>
))}
```
Each card gets a slightly different animation delay (0.06s apart), so they cascade in one after another instead of all appearing at once.

### Clear Filters Button
When any filter is active, a "Clear filters" link appears that resets both search and category to default.

---

## 3. index.css — New Styles

Added at the bottom of the existing `index.css` file:

### Task Card Styles
```css
.task-card-marketplace {
  background: linear-gradient(160deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.008) 100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  transition: transform 0.25s cubic-bezier(0.16,1,0.3,1),
              border-color 0.25s ease-out,
              box-shadow 0.3s ease-out;
}
.task-card-marketplace:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35), ...;
}
```
**On hover:** the card lifts up 4px, scales up 1%, and gets a deep shadow — giving that "floating" premium feel.

### Claim Button Gradient
```css
.claim-btn {
  background: linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #8B5CF6 100%);
  background-size: 200% 200%;
  transition: background-position 0.4s ease-out, ...;
}
.claim-btn:hover {
  background-position: 100% 100%;  /* Shifts the gradient */
  box-shadow: 0 6px 24px rgba(99, 102, 241, 0.35);
}
```
The button has a blue-to-purple gradient. On hover, the gradient shifts position (animated via `background-size: 200% 200%`) and gets a purple glow.

### Filter Pills
```css
.filter-pill-active {
  background: rgba(59, 130, 246, 0.1);
  color: #60A5FA;
  border-color: rgba(59, 130, 246, 0.3);
}
```
Active filter gets a blue tint. Inactive pills are dark gray.

### Card Entrance Animation
```css
@keyframes cardEntrance {
  from { opacity: 0; transform: translateY(16px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
.card-stagger {
  animation: cardEntrance 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
}
```
Cards slide up from below while fading in. The `cubic-bezier(0.16, 1, 0.3, 1)` curve makes the motion feel snappy at first, then smooth at the end.

---

## How It All Connects

```
TalentDashboard.jsx
  ├── fetchAvailableTasks() → API call → sets availableTasks state
  ├── AvailableTasksList (receives tasks as prop)
  │     ├── Search bar (filters by text)
  │     ├── Filter pills (filters by category)
  │     └── Grid of TaskCard components (filtered results)
  │           └── Claim button → claimTask() API call → refreshes parent
  └── MyTasksList (unchanged)
```

1. `TalentDashboard` fetches tasks from the API and passes them to `AvailableTasksList`
2. `AvailableTasksList` filters them by search query + category, then renders a grid
3. Each `TaskCard` displays the task info and a claim button
4. When claimed, it calls the API, then triggers `onClaimed` which refreshes the parent data

---

## What I Did NOT Change

- **API layer** (`client/src/api/talent.js`) — untouched, same 3 endpoints
- **Server-side code** — untouched, no backend changes
- **Task model** — untouched, no schema changes
- **MyTasksList.jsx** — untouched, only AvailableTasksList was redesigned
- **TalentDashboard.jsx** — untouched, it already passes the right props
- **Existing CSS classes** — untouched, I only added new ones at the bottom
