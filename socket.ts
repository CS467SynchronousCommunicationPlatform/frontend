"use client"

import { io } from "socket.io-client"

const url = process.env.NEXT_PUBLIC_SOCKET_URL

/**
 * Add comment here
 * Establish the socket manager
 * 
 */
export const socket = io(url, {
    transports: ["websocket"],
    autoConnect: false,
})

export const updateSocketAuth = (token: string) => {
    socket.auth = { token }
}