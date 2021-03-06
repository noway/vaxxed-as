import { QrcodeIcon } from "@heroicons/react/outline";
import { Link, Trans } from "gatsby-plugin-react-i18next";
import loadable from "@loadable/component";
import LanguageSelector from "../components/LanguageSelector";
import { CameraPlaceholder } from "../components/QrCamera";

const QrCamera = loadable(() => import("../components/QrCamera"), {
  fallback: <CameraPlaceholder />
});

const VerificationResultDialog = loadable(
  () => import("../components/VerificationResultDialog")
);

const CameraRoute = () => {
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen px-0 space-y-4 bg-gray-500 dark:bg-gray-700 sm:px-8 sm:py-8">
      <div className="z-10 flex flex-col w-full h-screen space-y-3 overflow-y-scroll bg-white shadow-2xl dark:bg-gray-600 sm:h-auto md:max-w-3xl sm:rounded-3xl">
        <div className="flex items-center justify-between object-cover w-full p-2 space-x-2 bg-white bg-center shadow-lg rounded-b-3xl stripped-background dark:bg-gray-50">
          <Link
            className="flex items-center p-2 space-x-2 bg-white md:p-4 rounded-3xl"
            to="/"
          >
            <QrcodeIcon
              aria-hidden="true"
              className="w-6 h-6 md:w-10 md:h-10"
            />
            <h1 className="font-bold text-md md:text-2xl">vaxxed.as</h1>
          </Link>
          <h2 className="hidden text-lg font-bold leading-none md:leading-tight md:text-2xl sm:block">
            <Trans i18nKey="header.Scan your NZ COVID pass">
              Scan your NZ COVID pass
            </Trans>
          </h2>
          <LanguageSelector />
        </div>
        <div className="relative z-0 p-10 lg:p-3">
          <div className="flex justify-center">
            <div className="w-full">
              <QrCamera />
            </div>
          </div>
        </div>
      </div>
      <footer className="flex justify-center w-full p-4 md:max-w-3xl md:p-0">
        <article className="prose">
          <p className="leading-tight text-gray-300 dark:text-gray-400">
            <Trans i18nKey="footer.disclaimer">
              This is not an official Government website. For more information
              about the COVID pass, please go to https://nzcp.covid19.health.nz
            </Trans>
          </p>
        </article>
      </footer>
      <VerificationResultDialog />
    </main>
  );
};

export default CameraRoute;
