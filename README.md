Options (with pros / cons)
1) Local filesystem on the app host (paths stored in SQL)

What it is: Save files under /uploads/articles/<articleId>/<uuid>.webp; store path + metadata in SQL.

Pros

Easiest to implement.

Zero extra services; low latency.

Cheap (just uses server disk).

Cons

Disk fills over time; you must monitor & prune.

Harder to scale to multiple app instances or servers.

Backups and restores get bulky if uploads live beside app.

If the VM dies, so do the assets unless backups are solid.

Best when

Single-node deployment, modest usage (<20–50 GB in near term), tight budget, fast time-to-value.

Space savers

Convert to WebP/AVIF on upload, strip EXIF.

Enforce size/dimension caps (e.g., 8 MB, max 4K).

Thumbnails for UI, originals rarely served.

Nightly job to purge orphan files and draft leftovers.

2) Network file share (NAS/SMB) + pointers in SQL

What it is: Store files on a company NAS or SMB share mounted to the server; keep relative paths + metadata in SQL.

Pros

Offloads app disk; central storage often already backed up by IT.

Simple to implement (like local disk, just a different root).

Can scale capacity without touching the app server.

Cons

Requires network reliability and share permissions.

Latency can be higher vs local disk.

Still no built-in lifecycle rules or CDN.

Best when

Company has a managed NAS with quotas and backups; you need cheap capacity without new cloud services.

Space savers

Same as #1 plus scheduled reports on per-article usage to prune.

3) SQL Server VARBINARY(MAX) (store bytes in DB rows)

What it is: Store the file bytes in a table column; keep metadata in same row.

Pros

Transactional and consistent with article writes.

Single backup/restore target.

Cons

DB size and transaction logs grow fast (backups balloon, restores slow).

Can hurt performance if you accidentally SELECT blobs in list views.

Storage is more expensive (DB disks) vs file/object stores.

Best when

Very small images and very small scale; strict transactional coupling needed.

Space savers

Keep blobs in a dedicated table; never query blob column in lists.

Compress to WebP/AVIF; deduplicate via checksum.

Partition or filegroup strategy for large tables.

4) SQL Server FILESTREAM / FileTable

What it is: Bytes live on NTFS but are governed by SQL (a FILESTREAM column). FileTable provides a Windows share view.

Pros

Transactional consistency + included in SQL backups.

Better for large files than pure VARBINARY.

Operationally simpler than managing a separate store if you’re all-in on SQL Server.

Cons

Still balloons DB backup sets (includes FILESTREAM data).

Requires Windows/NTFS specifics and DBA enablement.

No built-in lifecycle/CDN.

Best when

You must keep files “within SQL governance” but want more efficient storage than VARBINARY.

Space savers

Same as #3, plus differential backups and pruning policies.

5) Object storage (Azure Blob, S3; MinIO self-hosted) + URLs in SQL ✅ Recommended

What it is: Upload files to a bucket/container; store only URLs + metadata in SQL.

Pros

Practically limitless capacity, pay-as-you-go (or cheap self-hosted).

Easy CDN enablement & caching.

Lifecycle policies (tiering, auto-delete) to control costs/space.

Clean scale-out (no app server coupling).

Cons

One more service to provision/operate (or coordinate with infra).

Requires signed URLs/SAS tokens for secure access if private.

Best when

You want growth without surprises, easy cost control, and minimal ops burden on the app server/DB.

Space savers

Lifecycle rules (e.g., move originals to “Cool/Archive” after N days).

Delete orphaned or unused-draft images nightly.

Enforce limits + WebP/AVIF + thumbnails.

Optional dedup by checksum.

6) Hybrid: Thumbnails in DB, originals in object storage

What it is: Store small thumbnails (≤50–100 KB) as VARBINARY for instant UI loads; keep originals in object storage.

Pros

Fast, single-query list views (thumbs right from DB).

Original images don’t bloat DB backups.

Cons

More moving parts; still modest DB growth from thumbnails.

Slightly more code in the upload pipeline.

Best when

You want snappy admin/search pages and still keep the DB lean-ish.

Space savers

Low-quality, fixed-width thumbs (e.g., 320–480px).

Same lifecycle/dedup rules for originals.

Cost/space mindset (rough)

DB storage is premium; avoid storing large/unbounded binary in SQL.

Local/NAS is cheapest but needs discipline (quotas, pruning).

Object storage is usually the best long-term TCO thanks to lifecycle tiering and CDN offload.

Compression (WebP/AVIF), dimension caps, and thumbnails deliver the biggest immediate space savings.

Governance you should implement regardless

Upload gatekeeping: mime-type allowlist, size/dimension caps, EXIF strip.

Compression pipeline: convert to WebP (or AVIF), generate thumbnails.

Quotas: per-article image count, per-image size, per-user monthly cap.

Lifecycle: nightly job to purge images not referenced by any article (incl. abandoned drafts); archive old originals.

Checksum dedup: avoid storing identical assets.

Monitoring: disk free %, object-store usage, top articles by storage, monthly growth.
