import React, { FC, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../rootReducer";
import Markdown from "markdown-to-jsx";
import http from "../../services/api";
import { Entry } from "../../interfaces/entery.interface";
import { Diary } from "../../interfaces/diary.interface";
import { setCurrentlyEditing, setCanEdit } from "./editorSlice";
import { updateDiary } from "../diary/diariesSlice";
import { updateEntry } from "./entrySlice";
import { showAlert } from "../../util/util";
import { useStoreDispatch } from "../../store";

const Editor: FC = () => {
  const {
    currentlyEditing: entry,
    canEdit,
    activeDiaryId,
  } = useSelector((state: RootState) => state.editor);
  const [editedEntry, setEditedEntry] = useState(entry);
  const disptach = useStoreDispatch();

  const saveEntry = async () => {
    if (activeDiaryId === null) {
      return showAlert("Please select a diary", "warning");
    }
    if (entry == null) {
      http
        .post<Entry, { diary: Diary; entry: Entry }>(
          `/diaries/entry/${activeDiaryId}`,
          editedEntry
        )
        .then((data) => {
          if (data != null) {
            const { diary, entry: _entry } = data;
            disptach(setCurrentlyEditing(_entry));
            disptach(updateDiary(diary));
          }
        });
    } else {
      http.put<Entry, Entry>(`/diaries/entry/${entry.id}`, editedEntry).then((_entry) => {
        if (_entry != null) {
          disptach(setCurrentlyEditing(_entry));
          disptach(updateEntry(_entry));
        }
      });
    }
    disptach(setCanEdit(false));
  };

  useEffect(() => setEditedEntry(entry), [entry]);

  return (
    <div className="editor">
      <header
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: "0.2em",
          paddingBottom: "0.2em",
          borderBottom: "1px solid rgba(0,0,0,0.1)",
        }}>
        {entry && !canEdit ? (
          <h4>
            {entry.title}
            <a
              href="#edit"
              onClick={(e) => {
                e.preventDefault();
                if (entry != null) {
                  disptach(setCanEdit(true));
                }
              }}
              style={{ marginLeft: "0.4em" }}>
              (Edit)
            </a>
          </h4>
        ) : (
          <input
            value={editedEntry?.title ?? ""}
            disabled={!canEdit}
            onChange={(e) => {
              if (editedEntry) {
                setEditedEntry({
                  ...editedEntry,
                  title: e.target.value,
                });
              } else {
                setEditedEntry({
                  title: e.target.value,
                  content: "",
                });
              }
            }}
          />
        )}
      </header>
      {entry && !canEdit ? (
        <Markdown>{entry.content}</Markdown>
      ) : (
        <>
          <textarea
            disabled={!canEdit}
            placeholder="Supports Markdown"
            value={entry?.content}
            onChange={(e) => {
              if (editedEntry) {
                setEditedEntry({
                  ...editedEntry,
                  content: e.target.value,
                });
              } else {
                setEditedEntry({
                  title: "",
                  content: e.target.value,
                });
              }
              console.log("Firing onChange -->", e.target.value, entry?.content);
            }}
          />
          <button onClick={saveEntry} disabled={!canEdit}>
            Save
          </button>
        </>
      )}
    </div>
  );
};

export default Editor;
