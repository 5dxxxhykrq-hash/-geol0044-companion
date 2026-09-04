(function () {
  "use strict";

  var guide = document.getElementById("guide");
  var nav = document.getElementById("part-nav");
  var search = document.getElementById("site-search");
  var searchStatus = document.getElementById("search-status");
  var progressLabel = document.getElementById("progress-label");
  var progressBar = document.getElementById("progress-bar");
  var progressTrack = document.querySelector(".progress-track");
  var sidebar = document.getElementById("sidebar");
  var menuButton = document.getElementById("menu-button");
  var scrim = document.getElementById("scrim");
  var storageKey = "geol0044-completed-parts-v1";

  function partNumber(text) {
    var match = String(text || "").match(/^Part\s+(\d+)/i);
    return match ? Number(match[1]) : null;
  }

  function shortTitle(text) {
    return String(text || "")
      .replace(/^Part\s+\d+\s*/i, "")
      .replace(/^[　\s]+/, "")
      .replace(/GEOL0044\s*/i, "")
      .slice(0, 42);
  }

  var allLevelOne = Array.prototype.slice.call(guide.querySelectorAll(":scope > section.level1"));
  allLevelOne.forEach(function (section) {
    var heading = section.querySelector(":scope > h1");
    if (!heading || partNumber(heading.textContent) === null) {
      section.hidden = true;
      section.setAttribute("aria-hidden", "true");
    }
  });

  var parts = allLevelOne.filter(function (section) {
    var heading = section.querySelector(":scope > h1");
    return heading && partNumber(heading.textContent) !== null;
  }).sort(function (a, b) {
    return partNumber(a.querySelector(":scope > h1").textContent) - partNumber(b.querySelector(":scope > h1").textContent);
  });

  parts.forEach(function (section) {
    var heading = section.querySelector(":scope > h1");
    var number = partNumber(heading.textContent);
    section.id = "part-" + number;
    heading.id = "part-" + number + "-title";
    section.setAttribute("aria-labelledby", heading.id);
  });

  function loadDone() {
    try {
      var parsed = JSON.parse(localStorage.getItem(storageKey) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  var done = loadDone();

  function saveDone() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(done));
    } catch (error) {
      return;
    }
  }

  function updateProgress() {
    var count = done.length;
    progressLabel.textContent = count + " / " + parts.length;
    progressBar.style.width = parts.length ? (count / parts.length * 100) + "%" : "0%";
    progressTrack.setAttribute("aria-valuenow", String(count));
    nav.querySelectorAll(".part-check").forEach(function (button) {
      var number = Number(button.getAttribute("data-part"));
      var checked = done.indexOf(number) !== -1;
      button.classList.toggle("is-done", checked);
      button.setAttribute("aria-pressed", checked ? "true" : "false");
      button.textContent = checked ? "✓" : "";
      button.setAttribute("title", checked ? "取消完成标记" : "标记本部分已完成");
    });
  }

  parts.forEach(function (section) {
    var heading = section.querySelector(":scope > h1");
    var number = partNumber(heading.textContent);
    var row = document.createElement("div");
    row.className = "nav-row";

    var check = document.createElement("button");
    check.type = "button";
    check.className = "part-check";
    check.setAttribute("data-part", String(number));
    check.setAttribute("aria-label", "标记 Part " + number + " 的学习状态");
    check.addEventListener("click", function () {
      var index = done.indexOf(number);
      if (index === -1) {
        done.push(number);
        done.sort(function (a, b) { return a - b; });
      } else {
        done.splice(index, 1);
      }
      saveDone();
      updateProgress();
    });

    var link = document.createElement("a");
    link.className = "nav-link";
    link.href = "#part-" + number;
    link.innerHTML = "<strong>PART " + String(number).padStart(2, "0") + "</strong>" + shortTitle(heading.textContent);
    link.addEventListener("click", closeMenu);

    row.appendChild(check);
    row.appendChild(link);
    nav.appendChild(row);
  });
  updateProgress();

  guide.querySelectorAll("section.level2").forEach(function (section) {
    var heading = section.querySelector(":scope > h2");
    if (!heading) return;
    var tools = document.createElement("div");
    tools.className = "section-tools";
    var button = document.createElement("button");
    button.type = "button";
    button.className = "collapse-button";
    button.textContent = "收起本节";
    button.setAttribute("aria-expanded", "true");
    button.addEventListener("click", function () {
      var collapsed = section.classList.toggle("section-collapsed");
      button.textContent = collapsed ? "展开本节" : "收起本节";
      button.setAttribute("aria-expanded", collapsed ? "false" : "true");
    });
    tools.appendChild(button);
    heading.insertAdjacentElement("afterend", tools);
  });

  guide.querySelectorAll("a[href^='http']").forEach(function (link) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  function makeNode(text, className) {
    var node = document.createElement("div");
    node.className = className;
    node.innerHTML = text;
    return node;
  }

  function enhanceDiagrams() {
    guide.querySelectorAll("pre").forEach(function (pre) {
      var source = pre.textContent.trim();
      if (source.indexOf("flowchart") !== 0) return;

      if (source.indexOf("过去的环境") !== -1) {
        var sequence = [
          "过去的环境<br><small>温度、生产力、氧、环流</small>",
          "影响生物与海水化学",
          "壳、脂质、元素或沉积结构留下信号",
          "信号埋藏并保存于海底沉积物",
          "钻探取芯、分样、实验室测量",
          "校准后成为 proxy reconstruction",
          "与其他证据交叉检验并解释不确定性"
        ];
        var flow = document.createElement("div");
        flow.className = "flow-visual";
        flow.setAttribute("role", "img");
        flow.setAttribute("aria-label", "从过去环境到古海洋解释的证据链");
        sequence.forEach(function (label, index) {
          flow.appendChild(makeNode(label, "flow-node"));
          if (index < sequence.length - 1) flow.appendChild(makeNode("↓", "flow-arrow"));
        });
        pre.replaceWith(flow);
        return;
      }

      if (source.indexOf("GEOL0044") !== -1) {
        var tree = document.createElement("div");
        tree.className = "tree-visual";
        tree.setAttribute("role", "img");
        tree.setAttribute("aria-label", "GEOL0044 知识依赖树");
        tree.appendChild(makeNode("GEOL0044：重建 Cretaceous–Recent oceans", "tree-node tree-root"));
        var grid = document.createElement("div");
        grid.className = "tree-grid";
        [
          ["现代海洋如何运作", "T–S–density、分层、环流、生产力"],
          ["记录载体如何形成与保存", "微体生物、沉降、溶解、成岩作用"],
          ["信号如何测量和校准", "同位素、元素比、脂质、仪器"],
          ["记录如何定年与相关", "地质时间、地层、化石带、age–depth"]
        ].forEach(function (branch) {
          var branchBox = document.createElement("div");
          branchBox.className = "tree-branch";
          branchBox.appendChild(makeNode(branch[0], "tree-node"));
          branchBox.appendChild(makeNode("↓", "tree-arrow"));
          branchBox.appendChild(makeNode(branch[1], "tree-node"));
          grid.appendChild(branchBox);
        });
        tree.appendChild(grid);
        pre.replaceWith(tree);
      }
    });
  }
  enhanceDiagrams();

  var noResults = document.createElement("div");
  noResults.className = "no-results";
  noResults.hidden = true;
  noResults.textContent = "没有找到对应内容。可以尝试英文术语，例如 isotope、CCD、ODV 或 PETM。";
  guide.appendChild(noResults);

  function normalize(value) {
    return String(value || "").toLocaleLowerCase().replace(/\s+/g, " ").trim();
  }

  function runSearch() {
    var query = normalize(search.value);
    var shown = 0;
    parts.forEach(function (section) {
      var matches = !query || normalize(section.textContent).indexOf(query) !== -1;
      section.hidden = !matches;
      if (matches) shown += 1;
    });
    noResults.hidden = shown !== 0;
    if (query) {
      searchStatus.classList.add("is-visible");
      searchStatus.textContent = "“" + search.value.trim() + "”出现在 " + shown + " 个 Part 中。页面只显示匹配章节。";
    } else {
      searchStatus.classList.remove("is-visible");
      searchStatus.textContent = "";
    }
  }
  search.addEventListener("input", runSearch);

  document.addEventListener("keydown", function (event) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      search.focus();
      search.select();
    }
    if (event.key === "Escape") {
      if (document.activeElement === search && search.value) {
        search.value = "";
        runSearch();
      }
      closeMenu();
    }
  });

  function openMenu() {
    sidebar.classList.add("is-open");
    menuButton.setAttribute("aria-expanded", "true");
    scrim.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    sidebar.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    scrim.hidden = true;
    document.body.style.overflow = "";
  }

  menuButton.addEventListener("click", function () {
    if (sidebar.classList.contains("is-open")) closeMenu();
    else openMenu();
  });
  scrim.addEventListener("click", closeMenu);

  document.getElementById("print-button").addEventListener("click", function () {
    window.print();
  });
  document.getElementById("back-to-top").addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      var visible = entries
        .filter(function (entry) { return entry.isIntersecting; })
        .sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });
      if (!visible.length) return;
      var id = visible[0].target.id;
      nav.querySelectorAll(".nav-row").forEach(function (row) {
        var link = row.querySelector(".nav-link");
        row.classList.toggle("is-current", link.getAttribute("href") === "#" + id);
      });
    }, { rootMargin: "-15% 0px -75% 0px", threshold: 0 });
    parts.forEach(function (part) { observer.observe(part); });
  }
})();
