import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { Trans, useI18next } from "gatsby-plugin-react-i18next";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/solid";
import { TranslateIcon } from "@heroicons/react/outline";
import { useLocation } from "@reach/router";
import languages from "../data/languageOptions.json";

type LanguageOption = {
  value: string;
  name: string;
  callToAction: string;
};

const languageOptions: LanguageOption[] = languages;

const classNames = (...classes: string[]): string =>
  classes.filter(Boolean).join(" ");

const LanguageSelector = () => {
  const location = useLocation();
  const { changeLanguage } = useI18next();

  const languageName =
    location?.pathname?.split("/")?.filter(path => path !== "")?.[0] ?? "en";

  return (
    <Listbox value={languageName} onChange={value => changeLanguage(value)}>
      {({ open }) => (
        <div className="relative">
          <div className="inline-flex divide-x divide-indigo-600 rounded-md shadow-sm">
            <div className="relative z-0 inline-flex divide-x divide-indigo-600 rounded-md shadow-sm">
              <div className="relative inline-flex items-center py-2 pl-3 pr-4 text-white bg-indigo-500 border border-transparent shadow-sm rounded-l-md">
                <TranslateIcon
                  aria-hidden="true"
                  className="hidden w-5 h-5 sm:block"
                />
                <p className="ml-2.5 text-sm font-medium">
                  <Trans i18nKey="header.Change language">
                    Change language
                  </Trans>
                </p>
              </div>
              <Listbox.Button className="relative inline-flex items-center p-2 text-sm font-medium text-white bg-indigo-500 rounded-l-none rounded-r-md hover:bg-indigo-600 focus:outline-none focus:z-10 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500">
                <span className="sr-only">
                  <Trans i18nKey="header.Change language">
                    Change language
                  </Trans>
                </span>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="w-5 h-5 text-white"
                />
              </Listbox.Button>
            </div>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            show={open}
          >
            <Listbox.Options className="absolute right-0 z-50 mt-2 overflow-hidden origin-top-right bg-white divide-y divide-gray-200 rounded-md shadow-lg w-72 ring-1 ring-black ring-opacity-5 focus:outline-none">
              {languageOptions.map(({ value, name, callToAction }) => (
                <Listbox.Option
                  key={value}
                  className={({ active }) =>
                    classNames(
                      active ? "text-white bg-indigo-500" : "text-gray-900",
                      "cursor-default select-none relative p-4 text-sm"
                    )
                  }
                  value={value}
                >
                  {({ selected, active }) => (
                    <div className="flex flex-col">
                      <div className="flex justify-between">
                        <p
                          className={selected ? "font-semibold" : "font-normal"}
                        >
                          {name}
                        </p>
                        {selected ? (
                          <span
                            className={
                              active ? "text-white" : "text-indigo-500"
                            }
                          >
                            <CheckIcon aria-hidden="true" className="w-5 h-5" />
                          </span>
                        ) : null}
                      </div>
                      <p
                        className={classNames(
                          active ? "text-indigo-200" : "text-gray-500",
                          "mt-2"
                        )}
                      >
                        {callToAction}
                      </p>
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  );
};

export default LanguageSelector;
