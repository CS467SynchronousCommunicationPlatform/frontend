"use client";

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Channel, MessageProps, ChannelUser } from '@/app/lib/types/types';
import { User } from '@supabase/supabase-js';

// Define the shape of state
interface AppState {
    user: User | null;
    channels: Channel[];
    currentChannel: number;
    allMessages: Map<number, MessageProps[]>;
    channelUsers: Map<number, ChannelUser[]>;
    unreadMessagesCount: Map<number, number>;
    isChannelBarVisible: boolean;
    isUserListVisible: boolean;
}

// Define initial state
const initialState: AppState = {
    user: null,
    channels: [],
    currentChannel: 4,
    allMessages: new Map(),
    channelUsers: new Map(),
    unreadMessagesCount: new Map(),
    isChannelBarVisible: false,
    isUserListVisible: false,
};

// Create the context
const AppContext = createContext<{
    state: AppState;
    dispatch: React.Dispatch<any>;
}>({
    state: initialState,
    dispatch: () => null,
});

// Define a reducer
const reducer = (state: AppState, action: any): AppState => {
    switch (action.type) {
        case 'SET_USER':
            return { ...state, user: action.payload };
        case 'SET_CHANNELS':
            return { ...state, channels: action.payload };
        case 'SET_CURRENT_CHANNEL':
            return { ...state, currentChannel: action.payload };
        case 'SET_MESSAGES':
            return { ...state, allMessages: new Map(action.payload) };
        case 'SET_CHANNEL_USERS':
            return { ...state, channelUsers: new Map(action.payload) };
        case 'ADD_USER_TO_CHANNEL':
            const updatedChannelUsers = new Map(state.channelUsers);
            const users = updatedChannelUsers.get(action.payload.channelId) || [];
            updatedChannelUsers.set(action.payload.channelId, [...users, action.payload.user]);
            return { ...state, channelUsers: updatedChannelUsers };
        case 'TOGGLE_CHANNEL_BAR':
            return { ...state, isChannelBarVisible: !state.isChannelBarVisible };
        case 'TOGGLE_USER_LIST':
            return { ...state, isUserListVisible: !state.isUserListVisible };
        case 'INCREMENT_UNREAD_COUNT': {
            const { channelId } = action.payload;
            const unreadCount = state.unreadMessagesCount.get(channelId) || 0;
            const newUnreadMessagesCount = new Map(state.unreadMessagesCount);
            newUnreadMessagesCount.set(channelId, unreadCount + 1);
            return { ...state, unreadMessagesCount: newUnreadMessagesCount };
        }
        case 'RESET_UNREAD_COUNT': {
            const { channelId } = action.payload;
            const newUnreadMessagesCount = new Map(state.unreadMessagesCount);
            newUnreadMessagesCount.set(channelId, 0);
            return { ...state, unreadMessagesCount: newUnreadMessagesCount };
        }
        case 'HIDE_BARS':
            return { ...state, isChannelBarVisible: false, isUserListVisible: false };
        default:
            return state;
    }
};

// Create a provider component
export const AppProvider: React.FC<{ children: ReactNode; initialState: AppState }> = ({
                                                                                           children,
                                                                                           initialState,
                                                                                       }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};

// Custom hook to use the AppContext
export const useAppState = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppState must be used within an AppProvider');
    }
    return context;
};