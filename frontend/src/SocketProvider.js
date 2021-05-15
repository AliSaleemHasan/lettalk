import React, { createContext, useEffect, useContext, useState } from "react";
import { Selector } from "./features/userSlice";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState();
  const user = useSelector(Selector);

  //   useEffect(() => {
  //     if (!socket || !user) return;

  //     const socketIO = io({ query: { id: user._id } });
  //     setSocket(socketIO);
  //     return () => socket.disconnect();
  //   }, [user]);
  return (
    <SocketContext.Provider value={[socket, setSocket]}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
