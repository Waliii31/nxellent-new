import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUserProfile } from "../hooks/api/useUser";

interface RoleGuardProps {
    forbiddenRoles?: string[];
    redirectTo?: string;
    children?: React.ReactNode;
}

export default function RoleGuard({
    forbiddenRoles = [],
    redirectTo = "/projects/my-projects",
    children
}: RoleGuardProps) {
    const { data: user, isLoading } = useUserProfile();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#000124]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FD7EFF]"></div>
            </div>
        );
    }

    if (user && forbiddenRoles.includes(user.role)) {
        return <Navigate to={redirectTo} replace />;
    }

    return children ? <>{children}</> : <Outlet />;
}
