import { List } from "@raycast/api";
import { useState, ReactElement } from "react";
import { useHistorySearch } from "./hooks/useHistorySearch";
import { GroupedEntries, HistoryEntry } from "./interfaces";
import { IridiumListsItems } from "./components";

const groupEntries = (allEntries?: HistoryEntry[]): GroupedEntries =>
  allEntries
    ? allEntries.reduce((acc, cur) => {
        const title = new Date(cur.lastVisited).toLocaleDateString(undefined, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        const groupEntries = acc.get(title) ?? [];
        groupEntries.push(cur);
        acc.set(title, groupEntries);
        return acc;
      }, new Map<string, HistoryEntry[]>())
    : new Map<string, HistoryEntry[]>();

export default function Command(): ReactElement {
  const [searchText, setSearchText] = useState<string>();
  const { isLoading, permissionView, data } = useHistorySearch(searchText);

  if (permissionView) {
    return permissionView as ReactElement;
  }

  const groupedEntries = groupEntries(data);
  const groups = Array.from(groupedEntries.keys());

  return (
    <List onSearchTextChange={setSearchText} isLoading={isLoading} throttle={true}>
      {groups?.map((group) => (
        <List.Section title={group} key={group}>
          {groupedEntries?.get(group)?.map((e) => (
            <IridiumListsItems.TabHistory entry={e} key={e.id} />
          ))}
        </List.Section>
      ))}
    </List>
  );
}
