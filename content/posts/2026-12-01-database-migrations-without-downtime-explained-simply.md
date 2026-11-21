---
title: Database migrations without downtime, explained simply
seoTitle: Zero-downtime database migrations in four steps
description: Rename a column without an outage. The expand and contract pattern in four steps, with a small PostgreSQL example and the mistakes that cause downtime.
slug: database-migrations-without-downtime-explained-simply
date: 2026-12-01
tags: Engineering, Databases, Releases
keywords: zero downtime database migration, expand and contract pattern, PostgreSQL migration, rename column without downtime, lock_timeout, database release
ogTitle: Database migrations without downtime
ogKicker: Expand and contract in four steps
---

A schema change looks small. One line of SQL, one pull request, one green build. Then the deploy runs, the table locks, and every request that touches it waits.

I work on release engineering, so I care about this a lot. Code is easy to roll back. A database is not. That is why I treat every migration as the risky part of a release.

The fix is not a clever tool. It is a habit with a name: expand and contract. Some people call it parallel change, and [Martin Fowler describes it](https://martinfowler.com/bliki/ParallelChange.html) well. Here it is in four steps.

## Why one big migration fails

Say you want to rename `users.name` to `users.display_name`. The one-step way is `ALTER TABLE users RENAME COLUMN name TO display_name`. The command is fast. The problem is the code.

During a deploy, old and new versions of your app run side by side for a few minutes. The old version asks for `name`. The new version asks for `display_name`. Whatever you do to the schema, one of them breaks.

So the rule is simple. Every schema must work with the code before it and the code after it. You cannot do that in one step. You need four.

## Step 1. Expand

Add the new column. Do not touch the old one.

```sql
ALTER TABLE users ADD COLUMN display_name text;
```

This is safe. In PostgreSQL, adding a nullable column with no default is a quick change to the table definition. The old code does not know the column exists, and that is fine.

Do not add a `NOT NULL` rule yet. The table is full of rows that have no value, so the rule would fail or lock the table while it checks every row.

## Step 2. Write to both, then backfill

Now deploy code that writes to both columns. Every new or changed row gets both values. Reads still use the old column.

Then fill the old rows. Do it in small batches, not in one big update.

```sql
UPDATE users
SET display_name = name
WHERE id IN (
  SELECT id FROM users
  WHERE display_name IS NULL
  LIMIT 1000
);
```

Run it in a loop until it updates zero rows. Pause a little between batches. A single update of ten million rows holds locks for a long time and floods replication. A thousand rows at a time does not.

I like this step because it is dull. You can stop it, restart it, and watch it. Nothing hides inside one giant transaction.

## Step 3. Switch the reads

Deploy code that reads `display_name`. Keep writing to both columns for now.

Check the data before you go on. Count rows where the two columns differ. The count must be zero. If it is not, you found a bug in step 2 while the old column still protects you.

Keep this version running for at least one full release. If something looks wrong, you roll back the code and the old column is still correct. This is the whole point of the pattern. Every step has a way back.

## Step 4. Contract

Only now remove the old column. First deploy code that stops writing to `name`. Then, in a later release, drop it.

```sql
ALTER TABLE users DROP COLUMN name;
```

If you want the new column to be `NOT NULL`, this is the time. Check how your version of PostgreSQL does it, because a plain `SET NOT NULL` scans the whole table. The [PostgreSQL docs on ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html) describe the safer route with a check constraint.

Notice the cost. A rename that took one line now takes three or four releases. I accept that. Boring and slow is cheaper than an outage at noon.

## The mistakes that cause the outage

A small group of mistakes causes most migration outages. These are the ones I watch for.

Lock queues. Many `ALTER TABLE` commands need a strong lock on the table. If a long query is running, your command waits. Every query that arrives after it waits behind it. So a fast change can freeze the app because of one slow report.

Set a short `lock_timeout` so the migration gives up instead of waiting. The [PostgreSQL documentation for lock_timeout](https://www.postgresql.org/docs/current/runtime-config-client.html) explains the setting. Then retry later.

Plain index creation. `CREATE INDEX` blocks writes to the table while it builds. Use `CREATE INDEX CONCURRENTLY` on a live table. It takes longer and has its own rules, which the [CREATE INDEX docs](https://www.postgresql.org/docs/current/sql-createindex.html) list. It does not stop your writes.

Mixing schema and data work. A migration that changes the table and also rewrites the data runs in one transaction. Keep them apart. Change the schema in one step, move the data in another.

Dropping too early. Someone sees an unused column and removes it in the same release that stops using it. Then a rollback has nothing to roll back to. Wait one release.

<!-- AUTHOR: add one real migration story from your work (no company name): what went wrong or what went well, and what you changed after it. -->

## A small rule I follow

I try to keep each migration small enough that I can explain it in one sentence. "Add a nullable column." "Backfill 1,000 rows at a time." "Drop the old column." If I need two sentences, I split it.

I will say one thing against common advice. Many teams run migrations automatically at app start, and I understand why. It is simple. But a slow migration then blocks every new instance from starting, and that is a bad time to find out. I prefer to run migrations as a separate step that a person or a pipeline can watch and stop.

I am not sure this is right for every team. For a small app with a small database, the simple way is fine. The pattern above matters when the table is big and the traffic is real.

What is the worst migration you have run? [Tell me about it](/#contact).
