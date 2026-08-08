# Portfolio

My awesome portfolio with hidden tools 😂😂

## Plan

- Improve proxy.ts
  - check if there any anti-patterns in it and fix them.
  - check if there are security issues in it and fix them.
- Improve auth
  - create a page to manage admin profile. This page should include features to change admin user name and password. The password should be hashed and stored in the database. Create a schema in Prisma to store admin user name and password.
  - change auth-service.ts to compare the hashed passwords and check user name from the DB.
  - check if there any anti-patterns in auth-service.ts and fix them.
  - check if there are security issues in auth-service.ts and fix them.
  - check if auth-service.ts is used in a secured way in the proxy.ts, pages and actions. If there are security issues, fix them.
  - All pages afer 'admin' and including 'admin' can be accessed only by authenticated users.
- Improve UI/UX of navigation bar
- Improve "money" feature. This feature includes storing transactions. All transactions are in SGD. There are categories of transactions. A transaction can belong to only one category. Transactions that do not have a category fall into a category named "unclassified". unclassified category does not have sub categories. This feature start from path 'src\app\admin\money'.
  - User should be able add, edit, view and delete categories.
  - Categories should be able to have any number of sub categories except for unlcassified category. A subcategory does not have subcategories.
  - When adding a transaction, use can mention the category. If the mentioned category does not exist, it should be created when adding the transaction. When use types a category, a suggestion list should be displayed. If the typed category does not exist, a text should be displayed saying that a category will be created.
  - In addition to category, the user should mention following details when adding a transaction,
    - transaction amount
    - whether transacion is in or out
  - When adding a transaction, following details should be displayed to the user,
    - current account balance
    - balance after the adding transaction
  - There should be a feature to add the initial account balance
  - Follow similar UI and functions when editing a transaction
  - Viewing transactions is a crucial part. It should include various statistics shown using numbers and charts. There should be good filters as well.
  - Transactions adding and editing page has to be mobile friendly and follow responsive design.
  - Statistics page should follow adaptive design method.
  - For mobile screen sizes, the statistics page should show a very simple UI with only following details,
    - Pagination enabled list of transactions
    - The list is sorted by date in ascending order
  - None of the pages has to be mobile friendly unless explicitly mentioned to be otherwise
- For all designs, by default Tailwind CSS should be used. Tailwind CSS theme feature should be used to create common css.
- If writing Tailwind CSS for a certain component makes it unreadable and hard to maintain, CSS classes or inline-CSS should be used.
- Install an appropriate charts library for charts
- Install ssafe libraries for encryption and hashing as required
