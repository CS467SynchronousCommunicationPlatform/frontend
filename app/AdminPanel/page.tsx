import React from 'react';
import dynamic from 'next/dynamic';
import NavBar from "@/app/ui/NavBar/NavBar";
import { StackedLayout } from "@/app/ui/Catalyst/stacked-layout";
import { Sidebar } from "@/app/ui/Catalyst/sidebar";
import AdminPanelComponent from "@/app/AdminPanel/AdminPanel";



const AdminPanelPage: React.FC = () => (

        <AdminPanelComponent />

);

export default AdminPanelPage;