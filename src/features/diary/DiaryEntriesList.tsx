import React, { FC, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../rootReducer";
import http from "../../services/api";
import { Entry } from "../../interfaces/entery.interface";
import { addEntry } from "../entry/entrySlice";
import { setCurrentlyEditing, setCanEdit } from "../entry/editorSlice";
import dayjs from "dayjs";
import { useStoreDispatch } from "../../store";

const DiaryEntriesList : FC = () => {
    const { entries } = useSelector((state: RootState) => state);
    const dispatch = useStoreDispatch();
    const { id } = useParams<{id: string}>();
 
    useEffect(() => {
        if(id != null) {
            http
              .get<null, { entries: Entry[] }>(`/diaries/entries/${id}`)
              .then(({ entries: _entries }) => {
                  if(_entries){
                      const sortByLastUpdate = _entries.sort((a, b) => {
                        return (
                          dayjs(b.updatedAt).unix() - dayjs(a.updatedAt).unix()
                        );
                    });
                    dispatch(addEntry(sortByLastUpdate));
                  }
              });
        }
    }, [id, dispatch])
    return (
      <div className="entries">
        <header>
          <Link to="/">
            <h3>← Go Back</h3>
          </Link>
        </header>
        <ul>
          {entries.map((entry) => (
            <li
              key={entry.id}
              onClick={() => {
                dispatch(setCurrentlyEditing(entry));
                dispatch(setCanEdit(true));
              }}>
              {entry.title}
            </li>
          ))}
        </ul>
      </div>
    );
}

export default DiaryEntriesList;