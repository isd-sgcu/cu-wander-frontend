export const showTabBar = (): void => {
  const tabBar = document.getElementById("app-tab-bar");
  if (tabBar !== null) {
    tabBar.style.display = "flex";
  }
};

export const hideTabBar = (): void => {
  const tabBar = document.getElementById("app-tab-bar");
  if (tabBar !== null) {
    tabBar.style.display = "none";
  }
};
