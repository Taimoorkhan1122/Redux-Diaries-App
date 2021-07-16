import { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../rootReducer";
import http from "../../services/api";
import { Diary } from "../../interfaces/diary.interface";
import { addDiary } from "./diariesSlice";
import Swal from "sweetalert2";
import { setUser } from "../auth/userSlice";
import DiaryTile from "./DiaryTile";
import { User } from "../../interfaces/user.interface";
import { Route, Switch } from "react-router-dom";
import DiaryEntriesList from "./DiaryEntriesList";
import { useStoreDispatch } from "../../store";
import dayjs from "dayjs";

const Diaries: FC = () => {
    const dispatch = useStoreDispatch();
    const diaries = useSelector((state: RootState) => state.diaries);
    const user = useSelector((state: RootState) => state.user);

    useEffect(() => {
        const fetchDiaries = async () => {
            if(user) {
                http.get<null, Diary[]>(`/diaries/${user.id}`)
                .then((data) => {
                    if(data && data.length > 0){
                        const sortByUpdatedAt = data.sort((a,b) => {
                            return (
                              dayjs(b.updatedAt).unix() -
                              dayjs(a.updatedAt).unix()
                            ); 
                        })
                        dispatch(addDiary(sortByUpdatedAt));
                    }
                })
            }
        }
        fetchDiaries();
    }, [dispatch,user])

    const createDiary = async () => {
        const swal = Swal.mixin({
          input: "text",
          confirmButtonText: "Next →",
          showCancelButton: true,
          progressSteps: ["1", "2"],
        });
        const result = await swal
          .fire({ titleText: "Diary Title", input: "text" })
          .then((res) => {
            if (res.isConfirmed) {
              return swal.fire({
                 titleText: "Private or Public?",
                 input: "radio",
                 inputOptions: {
                   private: "Private",
                   public: "Public",
                 },
                 inputValue: "private",
               }).then(res2=> {
                 if(res2.isConfirmed) {
                   return {
                     value: [res.value, res2.value],
                   };
                 }
               });
              
            }
          });
        
        if(result?.value) {
            const { value } = result;

            const { diary, user: _user} = await http.post<Partial<Diary>, {diary: Diary, user: User}>('/diaries/', {
                title: value[0],
                type: value[1],
                userId: user?.id,
            });

            if(diary && _user ) {
                dispatch(addDiary([diary] as Diary[]));
                dispatch(addDiary([diary] as Diary[]));
                dispatch(setUser(_user));
                return Swal.fire({
                    titleText: 'All done!',
                    confirmButtonText: 'OK!',
                });
            }
        }
        Swal.fire({
            titleText: 'Cancelled'
        });
    }

  return (
    <div style={{ padding: "1em 0.4em" }}>
      <Switch>
        <Route path="/diary/:id">
          <DiaryEntriesList />
        </Route>
        <Route path="/">
          <button onClick={createDiary}>Create New</button>
          {diaries.map((diary, idx) => (
            <DiaryTile key={idx} diary={diary} />
          ))}
        </Route>
      </Switch>
    </div>
  );
};

export default Diaries;
