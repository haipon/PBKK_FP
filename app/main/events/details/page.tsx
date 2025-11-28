"use client";

import { useEffect, useState } from "react";
import Header from "../../../component/header";
import UserHeader from "../../../component/userHeader";

export default function EventDetailsPage() {
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
    const token = localStorage.getItem("token");
    setAuthenticated(!!token);
    }, []);

    return (
    <div className="min-h-screen flex flex-col">
        {authenticated ? <UserHeader /> : <Header />}

        
    </div>
    );
}