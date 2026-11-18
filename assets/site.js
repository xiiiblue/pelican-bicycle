const workbench = document.querySelector("#workbench");
const viewer = document.querySelector("#viewer");
const frame = document.querySelector("#preview");
const currentName = document.querySelector("#current-name");
const openLink = document.querySelector("#open-link");
const position = document.querySelector("#viewer-position");
const list = document.querySelector("#models");
const listViewport = document.querySelector("#catalogue-body");
const template = document.querySelector("#model-template");
const search = document.querySelector("#model-search");
const familyFilter = document.querySelector("#family-filter");
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");
const previous = document.querySelector("#previous");
const next = document.querySelector("#next");

function createModelRow(work, index) {
  const row = template.content.firstElementChild.cloneNode(true);
  const button = row.querySelector("button");
  button.querySelector(".model-name").textContent = work.name;
  button.querySelector(".model-family").textContent = work.family;
  button.setAttribute("aria-pressed", "false");

  if (work.thumbnail) {
    const image = document.createElement("img");
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    image.addEventListener("error", () => image.remove(), { once: true });
    image.src = "./assets/previews/" + work.thumbnail;
    button.querySelector(".model-thumb").append(image);
  }

  button.addEventListener("click", event => {
    select(index);
    if (viewer.getBoundingClientRect().top < 0 || matchMedia("(max-width: 880px)").matches) {
      viewer.scrollIntoView({ block: "start" });
      if (event.detail === 0) currentName.focus({ preventScroll: true });
    }
  });
  return { row, button };
}

const rows = works.map(createModelRow);
let selected = -1;

function select(index) {
  if (index === selected) return;

  rows[selected]?.button.setAttribute("aria-pressed", "false");
  selected = index;
  const { name, file } = works[selected];
  const { button, row } = rows[selected];

  currentName.textContent = name;
  frame.title = name + "作品预览";
  frame.src = file;
  openLink.href = file;
  position.textContent = String(selected + 1).padStart(2, "0") + " / " + works.length;
  button.setAttribute("aria-pressed", "true");

  const url = new URL(location.href);
  if (url.protocol !== "file:" && url.searchParams.get("work") !== file) {
    url.searchParams.set("work", file);
    history.replaceState(null, "", url);
  }

  if (!row.hidden) {
    const viewport = listViewport.getBoundingClientRect();
    const item = row.getBoundingClientRect();
    if (item.top < viewport.top) listViewport.scrollTop += item.top - viewport.top;
    if (item.bottom > viewport.bottom) listViewport.scrollTop += item.bottom - viewport.bottom;
  }
}

function move(delta) {
  select((selected + delta + works.length) % works.length);
}

function applyFilters() {
  const terms = search.value.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  const family = familyFilter.value;
  let visible = 0;

  works.forEach((work, index) => {
    const label = (work.name + " " + work.family).toLocaleLowerCase();
    const matches = (!family || work.family === family) && terms.every(term => label.includes(term));
    rows[index].row.hidden = !matches;
    if (matches) visible += 1;
  });

  listViewport.scrollTop = 0;
  resultCount.textContent = visible + " 个作品";
  emptyState.hidden = visible !== 0;
}

function initialize() {
  if (works.length === 0) return;

  const families = [...new Set(works.map(work => work.family))];
  families.forEach(family => familyFilter.add(new Option(family, family)));
  document.querySelector("#work-total").textContent = works.length;
  document.querySelector("#family-total").textContent = families.length;
  document.querySelector("#hero-stats").hidden = false;
  list.append(...rows.map(({ row }) => row));
  applyFilters();

  search.addEventListener("input", applyFilters);
  familyFilter.addEventListener("change", applyFilters);
  document.querySelector("#reset-filters").addEventListener("click", () => {
    search.value = "";
    familyFilter.value = "";
    applyFilters();
    search.focus();
  });

  previous.disabled = next.disabled = works.length < 2;
  previous.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));

  document.addEventListener("keydown", event => {
    if (event.defaultPrevented || event.isComposing || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.target instanceof Element && event.target.closest("input, select, textarea, [contenteditable]")) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      move(event.key === "ArrowLeft" ? -1 : 1);
    }
  });

  const file = new URLSearchParams(location.search).get("work");
  workbench.hidden = false;
  select(Math.max(0, works.findIndex(work => work.file === file)));
}

initialize();
