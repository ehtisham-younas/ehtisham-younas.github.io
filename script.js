(function(){
  const root = document.documentElement;
  const button = document.getElementById("themeToggle");
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const backdrop = document.getElementById("drawerBackdrop");
  const saved = localStorage.getItem("portfolio-theme");
  const systemLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  const theme = saved || (systemLight ? "light" : "dark");

  function applyTheme(value){
    root.setAttribute("data-theme", value);
    if(button){
      button.setAttribute("aria-label", value === "dark" ? "Switch to light mode" : "Switch to dark mode");
    }
  }

  applyTheme(theme);

  if(button){
    button.addEventListener("click", function(){
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      localStorage.setItem("portfolio-theme", next);
      applyTheme(next);
    });
  }

  function closeDrawer() {
    if(menuToggle && navMenu && backdrop) {
      menuToggle.classList.remove("active");
      navMenu.classList.remove("active");
      backdrop.classList.remove("active");
    }
  }

  if(menuToggle && navMenu && backdrop){
    menuToggle.addEventListener("click", function(){
      const isActive = navMenu.classList.contains("active");
      if(isActive) {
        closeDrawer();
      } else {
        menuToggle.classList.add("active");
        navMenu.classList.add("active");
        backdrop.classList.add("active");
      }
    });

    backdrop.addEventListener("click", closeDrawer);

    navMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeDrawer);
    });

    window.addEventListener("scroll", function(){
      if(navMenu.classList.contains("active")){
        closeDrawer();
      }
    }, { passive: true });

    window.addEventListener("resize", function(){
      if(navMenu.classList.contains("active")){
        closeDrawer();
      }
    });
  }
})();

const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTop.classList.add('show');
  } else {
    backToTop.classList.remove('show');
  }
});