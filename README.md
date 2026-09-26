# Portfolio

My awesome portfolio with hidden tools 😂😂

## Money workspace

The private `/admin/money` workspace has separate transaction, category,
instrument, settings, and dashboard pages. The ledger and editing forms adapt
to mobile screens; the dashboard uses a desktop layout.

### Transactions

- Create, edit, and delete money-in and money-out entries in SGD.
- Record amount, direction, title, category, instrument, Singapore date/time,
  payer/payee, reference, and notes. Creation and update timestamps are automatic.
- View both directions together by default, across all dates.
- Combine search (title, notes, payer/payee, reference), direction, category,
  instrument, inclusive Singapore date bounds, and minimum/maximum amounts.
- Selecting a parent category includes its subcategories. Archived categories
  remain available in historical filters.
- Sort by newest, oldest, highest amount, or lowest amount. Database pagination
  loads 25 entries per page; income, expense, and net totals cover all matches.
- Store integer cents; validate positive transaction amounts and the database's
  32-bit amount limit. Opening balances can be negative. Enter amounts without
  grouping commas, with at most two decimal places.

### Categories and instruments

Categories have a name, description, supported direction (in, out, or both),
optional parent, monthly spending budget, and archive status. Flat categories
and subcategories can receive transactions; a category with children is a
reporting group. Each subcategory has its own direction setting. Child budgets
cannot exceed the parent's allocation.

Archive categories to stop new assignments while preserving transaction history.
Existing entries can retain their archived category when edited. Archive children
before their parent; restore the parent before restoring children. A category
with transactions or children cannot be deleted. The protected Unclassified
category is always available.

Instruments describe the source/destination (such as cash or a card), with a
configurable default. They share one opening balance and ledger balance, rather
than maintaining separate account balances. Credit-card bill payments are not
recorded again as expenses.

### Dashboard

`/admin/money/dashboard` retains saved category/date/direction filters, cash-flow
statistics, prorated budgets, charts, and a transaction table. Saved filters
belong to the signed-in admin. The responsive ledger is at
`/admin/money/transactions`; its filters are retained in the URL.

### Database setup

Configure `DATABASE_URL` for MongoDB and `AUTH_SECRET` as described in
`.env.example`. After pulling schema changes, regenerate the client and apply
the schema to the development database:

```bash
pnpm install
pnpm prisma generate
pnpm prisma db push
pnpm db:seed
```

MongoDB must support transactions (for example, an Atlas deployment or a replica
set). Prisma uses `db push` for this MongoDB schema, not SQL migrations. No live
data migration is included. If reusing old development fixtures, recreate them
with the new category fields populated.

The seed creates Unclassified, Cash, and the primary money account. The
application assumes those records exist; reads never create or repair them.
Seeding money records does not create an admin user.

### Standalone TypeScript scripts

Place executable `.ts` files directly in the root `scripts/` folder. Set
`SCRIPT_NAME` to the filename, with or without `.ts`, then run:

```bash
pnpm script
```

For example, put this in `.env.local` (with your `DATABASE_URL`):

```dotenv
SCRIPT_NAME=create-default-category
```

Or select the script in PowerShell:

```powershell
$env:SCRIPT_NAME = "create-default-category"
pnpm script
```

The runner loads environment files before launching the selected script, without
starting Next.js. Existing shell variables win, followed by
`.env.<NODE_ENV>.local`, `.env.local`, `.env.<NODE_ENV>`, and `.env` in that order.
`NODE_ENV` defaults to `development`; test mode skips `.env.local`. Files are
resolved from the repository root. Extra arguments are passed to the script,
and script failures produce a nonzero exit code.

`create-default-category.ts` creates the protected, active **Unclassified**
category for both transaction directions, with an explicit `parentId: null`.
It uses an upsert, so rerunning it preserves an existing category. It creates no
instruments, accounts, or admin users. It requires `DATABASE_URL` and a generated
Prisma client. You can also run it directly with
`pnpm exec tsx scripts/create-default-category.ts`; it loads the same environment
files and always disconnects Prisma after the operation.

Run `pnpm test:scripts` to check environment precedence, script selection,
argument forwarding, and failure exit codes without a database.

### Verification

```bash
pnpm test:money
pnpm exec tsc --noEmit
pnpm lint
pnpm build
```

The money tests cover cent precision and limits, Singapore date/time boundaries,
filter validation and pagination URLs, category assignment/archive rules, and
budget proration. They run without a database. For a database-backed smoke test,
seed a development database, sign in, create income and expense categories and
transactions, combine the ledger filters, edit an entry, then archive its
category and verify that history is retained. Check the ledger and forms at a
narrow viewport and the dashboard at a desktop viewport.

### Security notes

- Every admin route is protected by `proxy.ts`; every mutating server action also performs its own authentication check.
- Admin responses are private and non-cacheable. Baseline framing, MIME-sniffing, referrer, and permissions headers are configured in `next.config.ts`.
- For internet exposure, enable rate limiting for `/admin/login` at the hosting/WAF layer. In-memory counters are not reliable in a serverless deployment.
