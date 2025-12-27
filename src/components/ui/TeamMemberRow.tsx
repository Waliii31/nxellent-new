import { useUser } from "../../hooks/api/useUser";
import MemberRow from "./MemberRow";
import type { RoleType } from "./MemberRow";
import type { PopulatedUser } from "../../types/project";

type TeamMemberRowProps = {
    userId: string;
    role: string;
    populatedUser?: PopulatedUser; // Pre-populated user data from backend
    onRemove?: () => void;
};

export default function TeamMemberRow({
    userId,
    role,
    populatedUser,
    onRemove,
}: TeamMemberRowProps) {
    // Only fetch user data if not already populated
    const { data: fetchedUser, isLoading } = useUser(populatedUser ? undefined : userId);
    const user = populatedUser || fetchedUser;
    const isOwner = role === "owner";

    if (isLoading && !populatedUser) {
        return (
            <div className="relative my-3 rounded-2xl overflow-hidden bg-[#000027]">
                <div className="flex items-center justify-between px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-white/10 animate-pulse" />
                        <div className="flex flex-col gap-2">
                            <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
                            <div className="h-3 w-48 bg-white/10 rounded animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <MemberRow
                name="Unknown User"
                email={userId}
                role={role.charAt(0).toUpperCase() + role.slice(1) as RoleType}
                onRemove={!isOwner ? onRemove : undefined}
            />
        );
    }

    return (
        <MemberRow
            name={user.profile.name}
            email={user.email}
            role={role.charAt(0).toUpperCase() + role.slice(1) as RoleType}
            avatarUrl={user.profile.avatar}
            onRemove={!isOwner ? onRemove : undefined}
        />
    );
}
