import { useTranslation } from "next-i18next";
import classNames from "classnames";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Disclosure, Transition } from "@headlessui/react";
import { useCallback, useRef } from "react";

import QueueEntry from "../widgets/queue/queueEntry";

function getProgress(sizeLeft, size) {
  return sizeLeft === 0 ? 100 : (1 - sizeLeft / size) * 100;
}

function getTitle(queueEntry, libraryData) {
  const entryId = queueEntry.movieId || queueEntry.seriesId;
  let title = "";
  const entryTitle = libraryData.find((entry) => entry.id === entryId)?.title;
  if (entryTitle) title += entryTitle;
  const { episodeTitle } = queueEntry;
  if (episodeTitle) title += `: ${episodeTitle}`;
  if (title === "") return null;
  return title;
}

export default function ArrQueue({ enableQueue, queueDetailsData, libraryData, collapsible, compactQueue }) {
  const { t } = useTranslation();
  const panel = useRef();

  const formatDownloadState = useCallback((downloadState) => {
    switch (downloadState) {
      case "importPending":
        return "import pending";
      case "failedPending":
        return "failed pending";
      default:
        return downloadState;
    }
  }, []);

  return (
    <Disclosure defaultOpen={enableQueue}>
      {({ open }) => (
        <>
          {collapsible && (
            <Disclosure.Button
              disabled={!enableQueue}
              className="flex w-full select-none items-center group text-xs px-1.5"
            >
              {/* TODO: Create translation for "Download Queue" */}
              Download Queue
              <MdKeyboardArrowDown
                className={classNames(
                  !enableQueue ? "hidden" : "",
                  "transition-all opacity-0 group-hover:opacity-100 ml-auto text-theme-800 dark:text-theme-300 text-xl",
                  open ? "" : "rotate-180",
                )}
              />
            </Disclosure.Button>
          )}
          <Transition
            className="!block"
            unmount={false}
            beforeLeave={() => {
              panel.current.style.height = `${panel.current.scrollHeight}px`;
              setTimeout(() => {
                panel.current.style.height = `0`;
              }, 1);
            }}
            beforeEnter={() => {
              panel.current.style.height = `0px`;
              setTimeout(() => {
                panel.current.style.height = `${panel.current.scrollHeight}px`;
              }, 1);
              setTimeout(() => {
                panel.current.style.height = "auto";
              }, 150);
            }}
          >
            <Disclosure.Panel
              className={`transition-all ${compactQueue ? "overflow-y-scroll" : "overflow-hidden"} duration-300 ease-out ${compactQueue && "max-h-64"}`}
              ref={panel}
              static
            >
              {queueDetailsData.map((queueEntry) => (
                <QueueEntry
                  progress={getProgress(queueEntry.sizeLeft, queueEntry.size)}
                  timeLeft={queueEntry.timeLeft}
                  // TODO: Make common.unknown
                  title={getTitle(queueEntry, libraryData) ?? t("sonarr.unknown")}
                  activity={formatDownloadState(queueEntry.trackedDownloadState)}
                  key={`${queueEntry.seriesId}-${queueEntry.episodeId}`}
                />
              ))}
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}
