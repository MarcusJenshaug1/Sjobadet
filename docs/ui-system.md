# UI Component System

## Struktur

- `src/components/ui/` – UI primitives (Button, Input, Card, Badge, layout).
- `src/components/common/` – Gjenbrukbare komposittkomponenter brukt på tvers av sider.
- `src/components/layout/` – Layout, navigasjon og wrappers.
- `src/theme/tokens.css` – Design tokens (farger, spacing, radius, shadows, typography).

## Når noe skal bli en UI primitive

Lag en komponent i `ui/` når:
- den brukes flere steder,
- den har gjenbrukbare varianter (variant/size/state),
- den er en grunnleggende byggestein (button, input, badge, card, layout).

## Når noe skal bli en common component

Lag en komponent i `common/` når:
- den kombinerer flere primitives,
- den representerer en gjenkjennelig seksjon (f.eks. ContactForm, DashboardRow),
- den brukes på minst 2 sider eller i flere deler av admin.

## Storybook-regler

- Filnavn: `ComponentName.stories.tsx`
- Default export med `title` og `component`
- Minst:
  - Default
  - Varianter (size/variant)
  - States (disabled/loading/error/empty)
  - Interaction tests (play) for knapper, skjemaer, toggles, tabs, modaler

## Tokens

Alle komponenter skal bruke CSS-variabler fra `src/theme/tokens.css`. Unngå hardkodede verdier i komponenter der tokens finnes.
