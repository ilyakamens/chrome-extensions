// Street View shares the map's canvas, so the URL is the only reliable signal.
const update = () =>
  document.documentElement.toggleAttribute("data-street-view", /,3a,/.test(location.pathname));

update();
navigation.addEventListener("currententrychange", update);
