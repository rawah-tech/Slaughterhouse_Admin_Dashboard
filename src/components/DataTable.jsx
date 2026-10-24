import React, { useMemo, useState } from "react";

const DEFAULT_PAGE_SIZE = 10;

const toText = (value) => {
  if (value === null || value === undefined || typeof value === "boolean") {
    return "";
  }

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map(toText).join(" ");
  }

  if (React.isValidElement(value)) {
    return toText(value.props.children);
  }

  return "";
};

const compareValues = (left, right) =>
  toText(left).localeCompare(toText(right), "ar", {
    numeric: true,
    sensitivity: "base",
  });

const DataTable = ({ data = {}, className = "", bordered, striped, hover }) => {
  const columns = data.columns ?? [];
  const rows = data.rows ?? [];
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState(null);
  const [page, setPage] = useState(1);

  const visibleRows = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ar");
    const filteredRows = normalizedQuery
      ? rows.filter((row) =>
          columns.some((column) =>
            toText(row[column.field]).toLocaleLowerCase("ar").includes(normalizedQuery)
          )
        )
      : rows;

    if (!sort) return filteredRows;

    return [...filteredRows].sort((left, right) => {
      const result = compareValues(left[sort.field], right[sort.field]);
      return sort.direction === "asc" ? result : -result;
    });
  }, [columns, query, rows, sort]);

  const pageCount = Math.max(1, Math.ceil(visibleRows.length / DEFAULT_PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageRows = visibleRows.slice(
    (safePage - 1) * DEFAULT_PAGE_SIZE,
    safePage * DEFAULT_PAGE_SIZE
  );

  const handleSort = (column) => {
    if (!column.sort) return;

    setSort((current) => ({
      field: column.field,
      direction:
        current?.field === column.field && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const tableClasses = [
    "table",
    "align-middle",
    bordered && "table-bordered",
    striped && "table-striped",
    hover && "table-hover",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={className} aria-label="جدول البيانات">
      <div className="d-flex justify-content-end mb-3">
        <label className="w-100" style={{ maxWidth: 320 }}>
          <span className="visually-hidden">بحث في الجدول</span>
          <input
            className="form-control"
            type="search"
            value={query}
            placeholder="بحث"
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
          />
        </label>
      </div>

      <div className="table-responsive">
        <table className={tableClasses}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.field} scope="col">
                  {column.sort ? (
                    <button
                      type="button"
                      className="btn btn-link p-0 text-decoration-none"
                      onClick={() => handleSort(column)}
                      aria-label={`ترتيب حسب ${column.label}`}
                    >
                      {column.label}
                      {sort?.field === column.field && (
                        <span aria-hidden="true"> {sort.direction === "asc" ? "▲" : "▼"}</span>
                      )}
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length ? (
              pageRows.map((row, rowIndex) => (
                <tr key={row.id ?? row._id ?? `${safePage}-${rowIndex}`}>
                  {columns.map((column) => (
                    <td key={column.field}>{row[column.field]}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={Math.max(columns.length, 1)} className="text-center py-4">
                  لا توجد بيانات مطابقة.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <nav className="d-flex align-items-center justify-content-between" aria-label="صفحات الجدول">
          <button
            type="button"
            className="btn btn-sm btn-outline-primary"
            disabled={safePage === 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            السابق
          </button>
          <span>
            الصفحة {safePage} من {pageCount}
          </span>
          <button
            type="button"
            className="btn btn-sm btn-outline-primary"
            disabled={safePage === pageCount}
            onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
          >
            التالي
          </button>
        </nav>
      )}
    </section>
  );
};

export default DataTable;
