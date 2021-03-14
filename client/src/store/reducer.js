const reducer = (state, action) => {
  switch (action.type) {
    case "SIGNIN":
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.asscessToken,
      };
    case "SIGNOUT":
      return {
        ...state,
        user: action.payload,
        accessToken: action.payload,
      };
    case "GETLANE":
      return {
        ...state,
        lane: action.payload.data,
      };
    case "BOOKINGS":
      return {
        ...state,
        bookings: action.payload.data,
      };
    case "ADDLANE":
      console.log(action.payload);
      return {
        ...state,
        lane: [...state.lane, action.payload.newLane],
      };
    case "LANEREMOVE":
      console.log(
        "Delete",
        state.lane.filter((data) => {
          if (data.id !== action.payload) return data;
        })
      );
      return {
        ...state,
        lane: state.lane.filter((data) => {
          if (data.id !== action.payload) return data;
        }),
      };
    case "VIEWPARKINGSPACE":
      return {
        ...state,
        parkingSpace: action.payload.data,
      };
    case "CANCELORDER":
      return {
        ...state,
        bookings: state.bookings.map((data) => {
          if (data.id === action.payload) {
            data = {
              ...data,
              isBooking: false,
            };
            return data;
          }
          return data;
        }),
      };
    case "Users":
      return {
        ...state,
        users: action.payload.user,
      };
    case "REPLY":
      console.log(action.payload);
      return {
        ...state,
        chat: !action.payload.MSG ? [] : action.payload.MSG,
      };
    default:
      return state;
  }
};

export default reducer;
