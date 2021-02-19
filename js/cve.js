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
const perPageOptions = [10, 25, 50, 100, 200];
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
  showMitigated: false,
  page: 1,
  perPage: perPageOptions[1],
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

// prettier-ignore
const severity = (k) =>
  ({
    negligible: { prio: 1, color: colors.blue_d2, display: "Negligible", id: "negligible" },
    low: { prio: 2, color: colors.blue_l2, display: "Low", id: "low" },
    medium: { prio: 3, color: colors.yellow_l2, display: "Medium", id: "medium" },
    high: { prio: 4, color: colors.yellow_d1, display: "High", id: "high" },
    critical: { prio: 5, color: colors.red, display: "Critical", id: "critical" },
  }[k] || { prio: 0, color: colors.grey_d, display: "Unknown" });
const severityFor = (cve) => {
  const changed = (cve.mitigations[0] || {}).changed_severity;
  const mitigated = (cve.mitigations[0] || {}).kind === "not_affected";
  return { ...severity(changed || cve.vulnerability_severity), mitigated };
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

const Filters = ({ cves, filters, onChange, showMitigated }) => {
  const FilterBtn = ({ id }) => {
    const cls = filters[id] ? "active" : "";
    const count = cves.filter((c) => c.vulnerability_severity === id).length;
    const toggleFilter = () =>
      onChange({ sevFilters: { ...filters, [id]: !filters[id] } });
    const { color, display } = severity(id);
    return (
      <Tooltip tip={count}>
        <div className={`cve-filter-button ${cls}`} onClick={toggleFilter}>
          {shield(color)} {display}
        </div>
      </Tooltip>
    );
  };
  const tip = showMitigated
    ? "Showing mitigated CVEs"
    : "Hiding mitigated CVEs";
  return (
    <div className="cve-filter">
      <div>
        <FilterBtn id="negligible" />
        <FilterBtn id="low" />
        <FilterBtn id="medium" />
        <FilterBtn id="high" />
        <FilterBtn id="critical" />
      </div>
      <div>
        <Tooltip tip={tip}>
          <div
            className={"cve-filter-button"}
            onClick={() => onChange({ showMitigated: !showMitigated })}
          >
            {showMitigated ? eye : eyeSlash}
          </div>
        </Tooltip>
      </div>
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

const PerPageSelect = ({ onChange, value }) => {
  const renderOption = (i) => <option key={i} value={i} children={i} />;

  return (
    <div className="per-page">
      Per page:{" "}
      <select value={value} onChange={(e) => onChange(int(e.target.value))}>
        {perPageOptions.map(renderOption)}
      </select>
    </div>
  );
};

const renderSeverity = (cve, i) => {
  const { mitigated, color, display } = severityFor(cve);
  const Tag = mitigated ? "del" : "span";
  const tip = mitigated ? "Mitigated - see Addtitional Explanation" : null;
  // a workaround for not having to integrate a fully fledged tooltip-library.
  const cls = i === 0 ? "tip-bottom" : "";
  return (
    <Tooltip tip={tip} cls={cls}>
      <Tag style={{ color }}>{display}</Tag>
    </Tooltip>
  );
};

const Row = (cve, i) => {
  const cls = severityFor(cve).mitigated ? "td muted" : "td";
  return (
    <React.Fragment key={cve.vulnerability_name}>
      <span className={cls}>
        <a href={cve.vulnerability_url} target="_blank">
          {cve.vulnerability_name}
        </a>
      </span>
      <span className={cls}>
        {truncate(escape(cve.vulnerability_description), { length: 400 })}
      </span>
      <span className={cls}>{renderSeverity(cve, i)}</span>
      <span className={cls}>
        {upperFirst(cve.project_name)} {cve.project_version}
      </span>
      <span className={cls}>
        <ul className="m0">
          {cve.purls.map((p) => (
            <li key={p}>{displayPURL(p)}</li>
          ))}
        </ul>
      </span>
      <span className={cls}>
        {cve.mitigations.map((p) => (
          <div key={p}> {p.description} </div>
        ))}
      </span>
      <span className="spacing-dummy" />
    </React.Fragment>
  );
};

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
        <div className="th">Additional Explanation</div>
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

/**
 * conditionally shows a tooltip, if `tip` is truthy
 */
const Tooltip = ({ children, tip, cls = "" }) => {
  if (!tip) return children;
  return (
    <span className="tooltip">
      {children}
      <span className={`tip ${cls}`}>{tip}</span>
    </span>
  );
};
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
const eye = (
  <svg viewBox="0 0 16 16">
    <path
      d="M7.919 2C3.889 2 .555 4.608 0 8c.555 3.392 3.889 6 7.919 6 4.03 0 7.364-2.608 7.919-6-.555-3.392-3.889-6-7.919-6zM8 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm0-2a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"
      fill-rule="evenodd"
      fill="#56595E"
    ></path>
  </svg>
);
const eyeSlash = (
  <svg viewBox="0 0 16 16">
    <path
      fill="#56595E"
      d="M2.65 12.267C1.247 11.19.277 9.693 0 8c.555-3.392 3.889-6 7.919-6 .217 0 .432.008.645.022L7.06 4.628a3.502 3.502 0 0 0-2.45 4.244l-1.96 3.395zm4.78 1.72c.162.009.325.013.489.013 4.03 0 7.364-2.608 7.919-6-.27-1.648-1.195-3.111-2.538-4.18l-1.91 3.308a3.506 3.506 0 0 1-2.45 4.244l-1.51 2.615zM11.134.572l1.732 1-8 13.856-1.732-1 8-13.856z"
      fill-rule="evenodd"
    ></path>
  </svg>
);

///////////////////////////////////////////////////////////////////////////////
//                                    APP                                    //
///////////////////////////////////////////////////////////////////////////////
const isLocal =
  location.hostname === "localhost" || location.hostname === "127.0.0.1";
const reportURL = isLocal
  ? "/assets/konvoy_latest.json"
  : "https://konvoy-staging-devx-cac8-cve-reporter.s3-us-west-2.amazonaws.com/vulnerability_report_latest.json";

const App = () => {
  React.useEffect(() => {
    // we have a lot of entries in the list that only differ in `resource_purl`.
    // here we boild that down to one CVE that has a list of purls attached.
    const foldPurlsByVulnName = (cves) =>
      Object.values(groupBy(cves, (c) => c.vulnerability_name)).map((group) => {
        return { ...group[0], purls: group.map((c) => c.resource_purl) };
      });
    fetch(reportURL)
      .then((r) => r.json())
      .then((cves) => onUpdate({ cves: foldPurlsByVulnName(cves) }));
  }, []);

  const [model, setModel] = React.useState(init);

  const onUpdate = (p, fn = (x) => x) => setModel(fn({ ...model, ...p }));

  let cves = (model.cves || [])
    .filter((cve) => {
      const { mitigated, id } = severityFor(cve);
      return model.sevFilters[id] && (model.showMitigated || !mitigated);
    })
    .sort(sortBy(model.sorting));
  const offSet = (model.page - 1) * model.perPage;

  return (
    <div className="cve-listing">
      <Filters
        cves={model.cves || []}
        filters={model.sevFilters}
        onChange={(p) => onUpdate(p, clampPage)}
        showMitigated={model.showMitigated}
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
          value={model.perPage}
        />
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector(".cve-table-container"));
