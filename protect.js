(function () {
  function editable(target) {
    return !!(target && target.closest && target.closest("input, textarea, select, [contenteditable='true']"));
  }
  document.addEventListener("copy", function (e) {
    if (!editable(e.target)) e.preventDefault();
  });
  document.addEventListener("cut", function (e) {
    if (!editable(e.target)) e.preventDefault();
  });
  document.addEventListener("contextmenu", function (e) {
    if (!editable(e.target)) e.preventDefault();
  });
  document.addEventListener("dragstart", function (e) {
    if (!editable(e.target)) e.preventDefault();
  });
  document.addEventListener("selectstart", function (e) {
    if (!editable(e.target)) e.preventDefault();
  });
  window.addEventListener("keydown", function (e) {
    if (editable(e.target)) return;
    if (!(e.ctrlKey || e.metaKey)) return;
    var key = String(e.key || "").toLowerCase();
    if ("cxaspu".indexOf(key) !== -1) e.preventDefault();
  });
})();
