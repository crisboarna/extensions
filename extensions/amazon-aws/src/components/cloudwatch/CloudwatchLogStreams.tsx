import { Action, ActionPanel, getPreferenceValues, List } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import { fetchLogStreams, getTaskCWLogsGroupUrl } from "../../actions";
import { getActionOpenInBrowser, getActionPush, getFilterPlaceholder } from "../../util";
import { DefaultAction, Preferences } from "../../interfaces";
import CloudwatchLogs from "./CloudwatchLogs";
import { LogStream } from "@aws-sdk/client-cloudwatch-logs";

function CloudwatchLogStreams({ logGroupName }: { logGroupName: string }) {
  const { defaultAction } = getPreferenceValues<Preferences>();
  const { data: streams, isLoading } = useCachedPromise(fetchLogStreams, [logGroupName], { keepPreviousData: true });

  const getActions = (stream: LogStream) => {
    const actionViewInApp = getActionPush({
      title: "View Logs",
      component: CloudwatchLogs,
      logGroupName,
      logStreamNames: stream.logStreamName!,
    });
    const actionViewInBrowser = getActionOpenInBrowser(getTaskCWLogsGroupUrl(logGroupName));

    return defaultAction === DefaultAction.OpenInBrowser
      ? [actionViewInBrowser, actionViewInApp]
      : [actionViewInApp, actionViewInBrowser];
  };

  return (
    <List isLoading={isLoading} searchBarPlaceholder={getFilterPlaceholder("stream")}>
      {streams ? (
        streams.map((s) => (
          <List.Item
            id={s.logStreamName}
            key={s.logStreamName}
            title={s.logStreamName || ""}
            icon={"aws-icons/cw.png"}
            actions={
              <ActionPanel>
                {getActions(s)}
                <ActionPanel.Section title="Copy">
                  <Action.CopyToClipboard
                    title="Copy Stream ARN"
                    content={s.arn || ""}
                    shortcut={{ modifiers: ["opt"], key: "c" }}
                  />
                </ActionPanel.Section>
              </ActionPanel>
            }
            accessories={[
              { text: new Date(s.lastEventTimestamp!).toLocaleString() || "", tooltip: "Last Event Timestamp" },
            ]}
          />
        ))
      ) : (
        <List.EmptyView />
      )}
    </List>
  );
}

export default CloudwatchLogStreams;
