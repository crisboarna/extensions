import { closeMainWindow, getPreferenceValues, popToRoot } from "@raycast/api";
import { runAppleScript } from "run-applescript";
import { Preferences, Tab } from "../interfaces";
import { SEARCH_ENGINE } from "../util/constants";

export async function openNewTab(queryText: string | null | undefined): Promise<boolean | string> {
    popToRoot();
    closeMainWindow({ clearRootSearch: true });

    const script = `
    tell application "Firefox"
      activate
      repeat while not frontmost
        delay 0.1
      end repeat
      tell application "System Events"
        keystroke "t" using {command down}
        ${
        queryText
            ? `keystroke "l" using {command down}
           keystroke "a" using {command down}
           key code 51
           keystroke "${SEARCH_ENGINE[getPreferenceValues<Preferences>().searchEngine.toLowerCase()]}${queryText}"
           key code 36`
            : ""
    }
      end tell
    end tell
  `;

    return await runAppleScript(script);
}

export async function setActiveTab(tab: Tab): Promise<void> {
    await runAppleScript(`
    tell application "Firefox"
      activate
      repeat with w from 1 to count of windows
        set startTab to name of window 1
        repeat
            if name of window 1 contains "${tab.title}" then 
              exit repeat
            else
              tell application "System Events" to key code 48 using control down
            end if
            if name of window 1 is startTab then exit repeat
        end repeat
      end repeat
    end tell
  `);
}
