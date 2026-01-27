# UI Audit (global)

## Funn (gjentakende mønstre)

- **Knapper og ikonknapper**
  - Gjenbruk av `Button` i flere sider og admin-komponenter, men også flere inline-stylet `<button>` (f.eks. admin media-modal og historikk).
- **Skjemaelementer**
  - Egne input/textarea-stiler i `ContactForm` og admin settings (`SettingsForm`).
- **Cards / paneler**
  - Kortstil i admin settings, info-sider (personvern), sauna-sider og admin-scraper.
- **Badges / status chips**
  - Badges i sauna-kort, admin-scraper, privacy/medlemskap, header-badge.
- **Sections / containers**
  - Seksjoner og containere via inline-styles og globale `.container`-bruk.
- **Tables / list states**
  - Admin-historikk og scraper har egne tabell-stiler.
- **Typography**
  - Tittel/overskrift-stiler via både globale heading-regler og modulspesifikk typografi.

## Forslag til komponentisering

**UI primitives (src/components/ui):**
- `Button` (variants: primary, secondary, outline, ghost, danger; size: sm/md/lg)
- `IconButton` (variant: ghost/outline/solid; size: sm/md/lg)
- `Badge` (variant: default, info, success, warning, danger, neutral; size: sm/md/lg)
- `Input`, `Textarea`, `Select` (size: sm/md/lg)
- `Card` (variant: default/muted/outline; padding: none/sm/md/lg)
- `Section`, `Container`, `Stack` (layout/spacing)

**Common components (src/components/common):**
- `ContactForm` (story + shared field primitives)
- (Videre: `StatusBadge`, `HistoryTable`, `ActionRow` i admin)

## Risiko / avhengigheter

- **CSS Modules**: Flere modulstiler definerer egne tokens og kort-UI. Endringer må være små for å unngå visuelle regressjoner.
- **Admin-dashboards**: Inline-styles og spesialtilpassede komponenter kan kreve gradvis refaktor.
- **Storybook**: Story-filer må oppdateres når nye primitives tas i bruk, og stories må holdes synkronisert med props/varianter.

## Planlagt opprydding (neste iterasjoner)

- Migrere flere badges (scraper/privacy/medlemskap) til `Badge`.
- Konsolidere cards i admin (settings/scraper/medlemskap) til `Card`.
- Standardisere tabell-stiler og tomme states.
