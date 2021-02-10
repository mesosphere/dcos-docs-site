import upperFirst from "lodash/upperFirst";
import escape from "lodash/escape";
import groupBy from "lodash/groupBy";
import truncate from "lodash/truncate";
import ReactDOM from "react-dom";
import React from "react";

/*
  This handles the retrieval and rendering of our own CVE-Table
 */

///////////////////////////////////////////////////////////////////////////////
//                                   MODEL                                   //
///////////////////////////////////////////////////////////////////////////////
const init = {
  // all cves we got from the server.
  cves: null,

  loaded: false,

  // the model representation of the filter bar above the table. "sev" === "Severity"
  sevFilters: {
    negligible: false,
    low: false,
    medium: false,
    high: true,
    critical: true,
  },
  page: 1,
  perPage: 10,
  sorting: { by: "severity", order: "desc" },
};

// https://github.com/dcos-labs/ui-kit/blob/master/design-guidelines/design-tokens/color.md
const colors = {
  blue_d2: "#1065C1",
  blue_l2: "#4398F4",
  grey_l: "#DADDE2",
  grey_d: "#76797E",
  red: "#EB293A",
  yellow_d1: "#DF9223",
  yellow_l2: "#FAB553",
  yellow_l3: "#FBC77E",
};

const severity = (k) =>
  ({
    negligible: { prio: 1, color: colors.blue_d2 },
    low: { prio: 2, color: colors.blue_l2 },
    medium: { prio: 3, color: colors.yellow_l2 },
    high: { prio: 4, color: colors.yellow_d1 },
    critical: { prio: 5, color: colors.red },
  }[k] || { prio: 0, color: colors.grey_d });
const severityFor = (cve) => {
  const changed = (cve.mitigations[0] || {}).changed_severity;
  return severity(changed || cve.vulnerability_severity);
};

// Sorting
const sortBy = ({ by, order }) => {
  const fn = toComparableString[by];
  const dir = order == "asc" ? 1 : -1;
  return (a, b) => dir * fn(a).localeCompare(fn(b));
};
const toComparableString = {
  severity: (cve) => String(severityFor(cve).prio),
  name: (cve) => cve.vulnerability_name || "",
};

const int = (x) => parseInt(x, 10);
const clamp = (x, min, max) => Math.min(Math.max(min, x), max);
const clampPage = (model) => {
  const { cves, sevFilters } = model;
  const count = cves.filter((x) => sevFilters[x.vulnerability_severity]).length;
  const maxPage = Math.ceil(count / model.perPage);
  return { ...model, page: clamp(model.page, 1, maxPage) };
};
///////////////////////////////////////////////////////////////////////////////
//                                    VIEW                                   //
///////////////////////////////////////////////////////////////////////////////

const Filters = ({ cves, filters, onChange }) => {
  const FilterBtn = ({ id }) => {
    const cls = filters[id] ? "active" : "";
    const count = cves.filter((c) => c.vulnerability_severity === id).length;
    const toggleFilter = () => onChange({ ...filters, [id]: !filters[id] });
    return (
      <Tooltip tip={count}>
        <div className={`cve-filter-button ${cls}`} onClick={toggleFilter}>
          {shield(severity(id).color)} {upperFirst(id)}
        </div>
      </Tooltip>
    );
  };
  return (
    <div className="cve-filter">
      <FilterBtn id="negligible" />
      <FilterBtn id="low" />
      <FilterBtn id="medium" />
      <FilterBtn id="high" />
      <FilterBtn id="critical" />
    </div>
  );
};

const Pagination = ({ page, maxPage, onChange }) => {
  const _onChange = (x) => onChange(clamp(x, 1, maxPage));
  const onInput = ({ target: { value } }) => _onChange(int(value, 10) || page);

  return (
    <div className="cve-pagination">
      <span onClick={() => _onChange(page - 1)}>⟨</span>
      Page <input onInput={onInput} value={page} /> / {maxPage}
      <span onClick={() => _onChange(page + 1)}>⟩</span>
    </div>
  );
};

const PerPageSelect = ({ onChange }) => (
  <div className="per-page">
    Per page:{" "}
    <select onChange={(e) => onChange(int(e.target.value))}>
      <option value="10">10</option>
      <option value="25">25</option>
      <option value="50">50</option>
      <option value="100">100</option>
      <option value="200">200</option>
    </select>
  </div>
);

const Row = (cve) => (
  <React.Fragment key={cve.vulnerability_name}>
    <span className="td">
      <a href={cve.vulnerability_url} target="_blank">
        {cve.vulnerability_name}
      </a>
    </span>
    <span className="td">
      {truncate(escape(cve.vulnerability_description), { length: 400 })}
    </span>
    <span className="td">
      <span style={{ color: severityFor(cve).color }}>
        {upperFirst(cve.vulnerability_severity)}
      </span>
    </span>
    <span className="td">
      {upperFirst(cve.project_name)} {cve.project_version}
    </span>
    <span className="td">
      <ul className="m0">
        {cve.purls.map((p) => (
          <li key={p}>{displayPURL(p)}</li>
        ))}
      </ul>
    </span>
    <span className="td">
      {cve.mitigations.map((p) => (
        <div key={p}> {p.description} </div>
      ))}
    </span>
    <span className="spacing-dummy" />
  </React.Fragment>
);

const Table = ({ cves, sorting, onSortChange }) => {
  const sortable = (header, by) => {
    const active = by == sorting.by;
    const cls = `sortable ${active ? "active" : ""}`;
    const order = active && sorting.order == "asc" ? "desc" : "asc";
    const maybeArrow = active ? (order == "asc" ? "▲" : "▼") : "";
    return (
      <div className={cls} onClick={() => onSortChange({ by, order })}>
        {header} {maybeArrow}
      </div>
    );
  };
  return (
    <div className="main table-container">
      <div id="cve-table">
        <div className="th">{sortable("CVE", "name")}</div>
        <div className="th">Summary</div>
        <div className="th">{sortable("Severity", "severity")}</div>
        <div className="th">Products</div>
        <div className="th">Images</div>
        <div className="th">Mitigations</div>
        <div className="spacing-dummy" />
        {cves.map(Row)}
      </div>
    </div>
  );
};

const colorize = (content, color) => <span style={{ color }}>{content}</span>;

const displayPURL = (p) =>
  p.replace("pkg:docker/", "").replace(/\?repository_url=.*/, "");

const jumbo = (str) => <div className="jumbotron main">{str}</div>;

const Tooltip = ({ children, tip }) => (
  <div className="tooltip">
    {children}
    <span className="tip">{tip}</span>
  </div>
);

const shield = (color) => (
  <svg viewBox="0 0 16 16" fill={color}>
    <g fillRule="evenodd">
      <path
        d="M14 7.759V1.966c0-.512-2.65-.93-6-.964v13.5c3.35-.232 6-3.162 6-6.743z"
        fillOpacity=".3"
      />
      <path d="M2 7.759V1.966c0-.512 2.65-.93 6-.964v13.5C4.65 14.27 2 11.34 2 7.76z" />
    </g>
  </svg>
);

///////////////////////////////////////////////////////////////////////////////
//                                    APP                                    //
///////////////////////////////////////////////////////////////////////////////
const App = () => {
  React.useEffect(() => {
    // we have a lot of entries in the list that only differ in `resource_purl`.
    // here we boild that down to one CVE that has a list of purls attached.
    const foldPurlsByVulnName = (cves) =>
      Object.values(groupBy(cves, (c) => c.vulnerability_name)).map((group) => {
        return { ...group[0], purls: group.map((c) => c.resource_purl) };
      });
    fetch("/assets/konvoy_cves.json")
      .then((r) => r.json())
      .then((cves) => onUpdate({ cves })); //: foldPurlsByVulnName(cves) }));
  }, []);

  const [model, setModel] = React.useState(init);

  const onUpdate = (p, fn = (x) => x) => setModel(fn({ ...model, ...p }));

  const cves = (model.cves || [])
    .filter((cve) => model.sevFilters[cve.vulnerability_severity])
    .sort(sortBy(model.sorting));
  const offSet = (model.page - 1) * model.perPage;

  return (
    <div className="cve-listing">
      <Filters
        cves={model.cves || []}
        filters={model.sevFilters}
        onChange={(sevFilters) => onUpdate({ sevFilters }, clampPage)}
      />

      {cves.length <= model.perPage ? null : (
        <Pagination
          page={model.page}
          maxPage={Math.ceil(cves.length / model.perPage)}
          onChange={(page) => onUpdate({ page })}
        />
      )}

      {cves.length === 0 ? (
        jumbo(model.cves !== null ? "No CVEs found" : "Loading...")
      ) : (
        <Table
          cves={cves.slice(offSet, offSet + model.perPage)}
          sorting={model.sorting}
          onSortChange={(sorting) => onUpdate({ sorting })}
        />
      )}

      {cves.length <= model.perPage ? null : (
        <PerPageSelect
          onChange={(perPage) => onUpdate({ perPage }, clampPage)}
        />
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector(".cve-table-container"));
