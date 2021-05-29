import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Entry } from "../../interfaces/entery.interface";

const entries = createSlice({
  name: "entries",
  initialState: [] as Entry[],
  reducers: {
    addEntry(state, { payload }: PayloadAction<Entry[]>) {
        return (state = (payload != null) ? payload: []); 
    },

    updateEntry(state, { payload }: PayloadAction<Entry>) {
      const id = payload.id;
      // find index of entry we received in payload
      const entryIndex = state.findIndex((entry) => entry.id === id);
      entryIndex !== -1 && state.splice(entryIndex, 1, payload);
    },
  },
});

export const { addEntry, updateEntry } = entries.actions;
export default entries.reducer;
