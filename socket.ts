"use client"

import { io } from "socket.io-client"

const url = process.env.BACKEND_API

/**
 * Establish the socket manager and set autoConnect to false to avoid constant
 * connection errors while the server waits for a user id
 * TODO: set up event maps for the Socket type
 */
export const socket = io(url, {
    transports: ["websocket"],
    autoConnect: false,
})

// Need user id for auth token, so set it up later
export const updateSocketAuth = (token: string) => {
    socket.auth = { token }
}