# Portfolio

My awesome portfolio with hidden tools 😂😂

## Money workspace

The private `/admin` area now includes a maintainable SGD ledger with:

- database-backed admin credentials and bcrypt password hashing;
- signed, expiring, HTTP-only sessions verified by the edge proxy;
- profile and password management with session invalidation;
- exact integer-cent money calculations, opening balance, and IN/OUT entries;
- top-level categories, one level of subcategories, and a protected Unclassified category;
- category suggestions and automatic creation while entering a transaction;
- filtered statistics, cash-flow and spending charts, and paginated transactions;
- a compact oldest-first mobile ledger and an adaptive desktop dashboard.

### First deployment

1. Copy the variables from `.env.example` into the local/deployment environment. Keep `AUTH_SECRET` stable and private.
2. Run `pnpm prisma db push` against the intended MongoDB database, then deploy.
3. Sign in once with `ADMIN_BOOTSTRAP_USERNAME` and `ADMIN_BOOTSTRAP_PASSWORD`. This creates the first `AdminUser` with a bcrypt hash.
4. Remove the two `ADMIN_BOOTSTRAP_*` variables and manage credentials from `/admin/profile` thereafter.

The money schema intentionally starts fresh: transaction amounts, directions, and categories are required, and amounts are stored as integer cents.

### Security notes

- Every admin route is protected by `proxy.ts`; every mutating server action also performs its own authentication check.
- Admin responses are private and non-cacheable. Baseline framing, MIME-sniffing, referrer, and permissions headers are configured in `next.config.ts`.
- For internet exposure, enable rate limiting for `/admin/login` at the hosting/WAF layer. In-memory counters are not reliable in a serverless deployment.

## Plan

- Improve money feature
  - Transaction source/destination (new feature)
    - every transaction should have a source/destination
    - these sources/destination can be managed separately
    - source/transaction properties
      - name (required)
      - is credit card (default is false)
    - in "money" settings, user can select which source/destination is the default
  - transactions
    - parent categories cannot be selected as the categroy for a transaction except for the default "unclassified" category
  - category budget
    - parent categories and sub categories should have budgets
    - sum of the budget of of sub categories should be equal to the parent category budget
  - dashboard (transaction page) desktop version
    - filters
      - money in or out: default is out
      - categories
        - a left side panel should show all the available categories
        - the panel should take the remaining height of the screen
        - overflowing content should scrollable
        - categories are grouped based on the parent category
        - all categories are first sorted in parent category alphabetic order. Then sub categories alphabetic order
        - there is an option to show/hide sub categories
        - all categories are selectable
        - maximum number of categories that can be selected is 10
        - if sub categories are shown and a parent categroy is selected, its first 10 sub categories will be selected automatically
        - show a UI cue at parent categories whether all or some or none of the sub categories are selected. This is irrelevant if sub categories are hidden
        - there is a search bar at the top of the panel to searh categories
        - show the selected number of categories in the panel
      - date range
        - from and to dates should have a datepicker. install a library if required
        - from and to dates are inclusive
        - there are predefined date ranges:
          - 1 week: one week from today. today is inclusive.
          - 1 month: similar to above
          - 3 months: similar
          - 1 year: similar
          - this week: last Monday - today
          - last week: last complete week from Monday - Sunday
          - this month: similar to "this week"
          - last month: similar to "last week"
          - this year: similar to "this week"
          - last year: similar to "last week"
        - when a predefined range is selected, the date range fields should be updated automatically and UI cue should be displayed to indicate which predefined option was selected.
        - if the date range is changed using "to" and "from" fields, unselect the selected predefined range
        - the panel is collapsible
    - save filters (new feature)
      - filters can be saved and they should include following
        - categories selected
        - sub categories are hidden or shown
        - if a predefined date range is selected, the selected range option but not "from" and "to" dates
        - if a predined date range is not selected, "from" and "to" dates
        - name: a name for the filter. provide a default unique filter name in the pattern "filter {number}"
        - money in or out
      - saved filters can be viewed in a popup
        - there should be a delete icon for each saved filter to delete them
        - clicking on a saved filter apply the filter and close the popup
      - saved filter names can be changed
    - charts
      - line chart
        - show lines for selected category
        - y axis is money
        - x axis is the date. compress dates based on the selected date range
        - if sub categories are hidden, accumulate all sub categories to the parent category
        - hide this chart if the date range only includes one day
        - if none of the categories are selected, accumulate all money into one line
      - bar chart
        - only show this chart if more than one category is selected
        - show bars for each category with their budget on the side
        - y axis is the money
        - budget bars can be hidden
    - statistics
      - show following numbers
        - total money out
        - total money in
        - total money in substracts total money out
        - if more than one category is selected
          - total money in each category
          - remaining budget or overflown amount
          - remaining budget or overflown amount as a percentage
    - table
      - show transactions in a paginated view
      - include following properties
        - amount
        - money in or out
        - date
      - clicking on a record open the relevant transaction page
    - order of the dashboard from top to bottom
      - filters. categories filter is on the left side
      - line chart
      - bar chart
      - statistics
      - table
    - all charts, statistics area and table are collapsible
- this application does not have live data. Therefore the DB structure can be changed without worrying about existing data
