import DashboardLayout from "@/layout/core/dash-board-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
    return <DashboardLayout>{children}</DashboardLayout>;
}