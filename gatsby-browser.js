import StoreProvider from "./src/StoreProvider";
import "./src/styles/tailwind.css";

const onInitialClientRender = () => {
  window.addEventListener(
    "popstate",
    () => (window.location.href = window.location.href)
  );
};

const wrapRootElement = StoreProvider;

const onServiceWorkerUpdateFound = () => {
  window.swUpdate = true;
};

const onServiceWorkerUpdateReady = () => {
  window.dispatchEvent(new Event("resize"));
};

export {
  onInitialClientRender,
  onServiceWorkerUpdateFound,
  onServiceWorkerUpdateReady,
  wrapRootElement
};
