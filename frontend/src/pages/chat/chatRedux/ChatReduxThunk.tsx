import { createAsyncThunk } from "@reduxjs/toolkit";
import { getItem } from "../../../tools/localStorage";
import { axiosRequest } from "../../../apis/AxiosHelper";
const currentUser = getItem("user");

export const fetchChat = createAsyncThunk("chat/fetchChat", async () => {
  try {
    const response = await axiosRequest("get", `chat/${currentUser.id}`);
    return response.data;
  } catch (err) {
    return "Failed to fetch Chat, Please retry again later";
  }
});

//   useEffect(() => {
//     fetchData();

//     
//   }, [selectedUser]);
//     }
// })
